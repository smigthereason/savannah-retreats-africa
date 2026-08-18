import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity/client";
import {
  sendReplyAndArchive,
  adminReplyEmail,
  type InquiryDetails,
} from "@/lib/mail";

// Auth for this route is handled by proxy/middleware, which gates
// /api/admin/inquiries/* before this handler runs.

type ReplyInquiry = InquiryDetails & {
  _id: string;
  _type: "inquiry";
  status?: string;
};

/**
 * Resolve an inquiry by its exact Sanity document ID.
 *
 * `getDocument()` is used instead of a GROQ query here so the reply endpoint
 * does not depend on query perspective when resolving a single document.
 *
 * The fallback also supports a draft/published counterpart if an admin view
 * ever receives a draft id.
 */
async function getInquiryById(id: string): Promise<ReplyInquiry | null> {
  const normalizedId = decodeURIComponent(id).trim();

  if (!normalizedId) return null;

  const candidateIds = normalizedId.startsWith("drafts.")
    ? [normalizedId, normalizedId.replace(/^drafts\./, "")]
    : [normalizedId, `drafts.${normalizedId}`];

  for (const candidateId of candidateIds) {
    const document = await writeClient.getDocument<ReplyInquiry>(candidateId);

    if (document?._type === "inquiry") {
      return document;
    }
  }

  return null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
    console.warn("[admin-reply] Inquiry document not found:", {
      requestedId: id,
    });

    return NextResponse.json(
      { error: "Inquiry not found. Refresh the admin page and try again." },
      { status: 404 },
    );
  }

  if (!inquiry.email || typeof inquiry.email !== "string") {
    console.warn("[admin-reply] Inquiry has no recipient email:", {
      requestedId: id,
      resolvedId: inquiry._id,
    });

    return NextResponse.json(
      { error: "This inquiry does not have a valid email address." },
      { status: 422 },
    );
  }

  const result = await sendReplyAndArchive({
    to: inquiry.email.trim(),
    subject: subject.trim(),
    html: adminReplyEmail({
      message: message.trim(),
      inquiry,
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

  // Sending a reply means contact has been made. Do not downgrade an inquiry
  // that is already further along in the workflow.
  if (inquiry.status !== "booked" && inquiry.status !== "archived") {
    try {
      await writeClient
        .patch(inquiry._id)
        .set({ status: "contacted" })
        .commit();
    } catch (error) {
      // The email has already sent successfully, so a status-update failure
      // must not incorrectly tell the admin that the reply failed.
      console.error("[admin-reply] Reply sent but status update failed:", {
        inquiryId: inquiry._id,
        error,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    archived: result.archived,
  });
}
