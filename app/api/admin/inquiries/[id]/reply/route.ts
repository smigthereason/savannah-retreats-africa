import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity/client";
import {
  sendReplyAndArchive,
  adminReplyEmail,
  type InquiryDetails,
} from "@/lib/mail";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSessionToken,
} from "@/lib/admin/session";

// Middleware protects /api/admin/inquiries/*, but this handler reads the
// signed session again because the authenticated Google identity becomes the
// immutable `sentBy` audit record for each reply.

type ReplyInquiry = InquiryDetails & {
  _id: string;
  _type: "inquiry";
  status?: string;
};

async function getInquiryById(id: string): Promise<ReplyInquiry | null> {
  const normalizedId = decodeURIComponent(id).trim();
  if (!normalizedId) return null;

  const candidateIds = normalizedId.startsWith("drafts.")
    ? [normalizedId, normalizedId.replace(/^drafts\./, "")]
    : [normalizedId, `drafts.${normalizedId}`];

  for (const candidateId of candidateIds) {
    const document = await writeClient.getDocument<ReplyInquiry>(candidateId);
    if (document?._type === "inquiry") return document;
  }

  return null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const actor = await readAdminSessionToken(
    req.cookies.get(ADMIN_SESSION_COOKIE)?.value,
  );

  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let subject: unknown;
  let message: unknown;

  try {
    ({ subject, message } = await req.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  if (
    typeof subject !== "string" ||
    typeof message !== "string" ||
    !subject.trim() ||
    !message.trim()
  ) {
    return NextResponse.json(
      { error: "Subject and message are required" },
      { status: 400 },
    );
  }

  if (subject.length > 200 || message.length > 5000) {
    return NextResponse.json(
      { error: "Subject or message is too long" },
      { status: 400 },
    );
  }

  let inquiry: ReplyInquiry | null;

  try {
    inquiry = await getInquiryById(id);
  } catch (error) {
    console.error("[admin-reply] Failed to read inquiry from Sanity:", {
      requestedId: id,
      error,
    });

    return NextResponse.json(
      { error: "Unable to load this inquiry from Sanity." },
      { status: 500 },
    );
  }

  if (!inquiry) {
    return NextResponse.json(
      { error: "Inquiry not found. Refresh the admin page and try again." },
      { status: 404 },
    );
  }

  if (!inquiry.email || typeof inquiry.email !== "string") {
    return NextResponse.json(
      { error: "This inquiry does not have a valid email address." },
      { status: 422 },
    );
  }

  const cleanSubject = subject.trim();
  const cleanMessage = message.trim();
  const result = await sendReplyAndArchive({
    to: inquiry.email.trim(),
    subject: cleanSubject,
    html: adminReplyEmail({
      message: cleanMessage,
      inquiry,
      staffName: actor.name,
    }),
  });

  if (result.skipped) {
    return NextResponse.json(
      {
        error:
          "Email is not configured on the server yet (SMTP environment variables are missing).",
      },
      { status: 502 },
    );
  }

  if (!result.ok) {
    return NextResponse.json(
      {
        error:
          "Failed to send the reply. Check the server logs for the SMTP error.",
      },
      { status: 502 },
    );
  }

  const reply = {
    _key: crypto.randomUUID(),
    _type: "reply",
    sentAt: new Date().toISOString(),
    subject: cleanSubject,
    message: cleanMessage,
    fromAddress: process.env.SMTP_USER || "info@savannahretreatsafrica.com",
    archived: result.archived,
    sentBy: {
      sub: actor.sub,
      email: actor.email,
      name: actor.name,
      ...(actor.picture ? { picture: actor.picture } : {}),
    },
  };

  let auditSaved = true;

  try {
    const patch = writeClient
      .patch(inquiry._id)
      .setIfMissing({ replyHistory: [] })
      .append("replyHistory", [reply]);

    if (inquiry.status !== "booked" && inquiry.status !== "archived") {
      patch.set({ status: "contacted" });
    }

    await patch.commit();
  } catch (error) {
    auditSaved = false;
    // The SMTP transaction has already completed. Do not claim the reply
    // failed, but surface the audit problem to the UI and server logs.
    console.error("[admin-reply] Reply sent but audit record failed:", {
      inquiryId: inquiry._id,
      actor: actor.email,
      error,
    });
  }

  return NextResponse.json({
    ok: true,
    archived: result.archived,
    auditSaved,
    reply,
  });
}
