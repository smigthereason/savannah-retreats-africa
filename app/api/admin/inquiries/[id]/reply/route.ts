import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity/client";
import { sendReplyAndArchive, adminReplyEmail } from "@/lib/mail";

// Auth for this route is handled by middleware.ts, which gates every
// /api/admin/inquiries/* path — nothing further to check here.

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let subject: unknown;
  let message: unknown;
  try {
    ({ subject, message } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (
    typeof subject !== "string" ||
    typeof message !== "string" ||
    !subject.trim() ||
    !message.trim()
  ) {
    return NextResponse.json(
      { error: "Subject and message are required" },
      { status: 400 }
    );
  }
  if (subject.length > 200 || message.length > 5000) {
    return NextResponse.json(
      { error: "Subject or message is too long" },
      { status: 400 }
    );
  }

  // Look the recipient (and every other enquiry detail we quote back to
  // them) up server-side rather than trusting client-supplied values —
  // the id is the only thing we need from the request, everything else
  // comes from Sanity.
  const inquiry = await writeClient.fetch(
    `*[_id == $id][0]{
      type, name, email, phone, message, reference,
      destinations, tier, dateStart, dateEnd, adults, children,
      childrenAges, seniorAdults, destination, packageChoice, status
    }`,
    { id }
  );

  if (!inquiry?.email) {
    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
  }

  const result = await sendReplyAndArchive({
    to: inquiry.email,
    subject: subject.trim(),
    html: adminReplyEmail({ message: message.trim(), inquiry }),
  });

  if (result.skipped) {
    return NextResponse.json(
      { error: "Email isn't configured on the server yet (SMTP env vars missing)." },
      { status: 502 }
    );
  }
  if (!result.ok) {
    return NextResponse.json(
      { error: "Failed to send — check the server logs for the SMTP error." },
      { status: 502 }
    );
  }

  // Sending a reply means contact has been made — advance the status,
  // but don't downgrade an inquiry that's already further along.
  if (inquiry.status !== "booked" && inquiry.status !== "archived") {
    await writeClient.patch(id).set({ status: "contacted" }).commit();
  }

  // The email itself sent fine even if the Sent-folder archive step
  // failed — surface that distinction rather than hiding it, so the
  // team knows to check IMAP settings without thinking the reply
  // silently vanished.
  return NextResponse.json({ ok: true, archived: result.archived });
}
