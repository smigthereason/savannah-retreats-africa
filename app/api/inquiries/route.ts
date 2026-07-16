import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity/client";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { sendMail, inquiryConfirmationEmail, newLeadAlertEmail } from "@/lib/mail";

const ALLOWED_TYPES = ["contact", "tripPlanner", "booking", "planSafari"];

// Simple, deliberately permissive email check — good enough to reject
// garbage/typos without rejecting real addresses (full RFC 5322
// validation is out of scope and mostly counterproductive here).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_LENGTHS: Record<string, number> = {
  name: 200,
  phone: 40,
  message: 2000,
  tier: 100,
  destination: 200,
  packageChoice: 200,
};

function cappedString(value: unknown, field: keyof typeof MAX_LENGTHS) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, MAX_LENGTHS[field]);
}

function sanePartySize(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  const n = Math.round(value);
  if (n < 0 || n > 30) return undefined; // 30 is a generous ceiling for a group inquiry
  return n;
}

export async function POST(req: NextRequest) {
  try {
    // --- Rate limit: 5 submissions per IP per 10 minutes -------------
    const ip = getClientIp(req);
    const { success } = rateLimit(`inquiries:${ip}`, 5, 10 * 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const body = await req.json();

    if (!ALLOWED_TYPES.includes(body.type)) {
      return NextResponse.json({ error: "Invalid inquiry type" }, { status: 400 });
    }
    if (
      !body.email ||
      typeof body.email !== "string" ||
      !EMAIL_RE.test(body.email.trim()) ||
      body.email.length > 200
    ) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    const email = body.email.trim();
    const name = cappedString(body.name, "name");
    const message = cappedString(body.message, "message");

    const doc = {
      _type: "inquiry",
      type: body.type,
      status: "new",
      name,
      email,
      phone: cappedString(body.phone, "phone"),
      message,
      reference:
        body.reference && typeof body.reference === "object"
          ? {
              refType: cappedString(body.reference.refType, "tier"),
              label: cappedString(body.reference.label, "destination"),
              slug: cappedString(body.reference.slug, "destination"),
            }
          : undefined,
      destinations: Array.isArray(body.destinations)
        ? body.destinations.filter((d: unknown) => typeof d === "string").slice(0, 20)
        : undefined,
      tier: cappedString(body.tier, "tier"),
      dateStart: cappedString(body.dateStart, "destination"),
      dateEnd: cappedString(body.dateEnd, "destination"),
      adults: sanePartySize(body.adults),
      children: sanePartySize(body.children),
      destination: cappedString(body.destination, "destination"),
      packageChoice: cappedString(body.packageChoice, "packageChoice"),
      submittedAt: new Date().toISOString(),
    };

    const created = await writeClient.create(doc);

    // Best-effort notifications — never let an email failure fail the
    // request itself; the lead is already safely saved above.
    const adminAlertTo = process.env.ADMIN_ALERT_EMAIL;
    await Promise.allSettled([
      sendMail({
        to: email,
        subject: "We've received your inquiry — Savannah Retreats Africa",
        html: inquiryConfirmationEmail(name),
      }),
      adminAlertTo
        ? sendMail({
            to: adminAlertTo,
            subject: `New ${body.type} inquiry from ${name || email}`,
            html: newLeadAlertEmail({ type: body.type, name, email, phone: doc.phone, message }),
          })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ ok: true, id: created._id });
  } catch (err) {
    console.error("Failed to create inquiry:", err);
    return NextResponse.json(
      { error: "Something went wrong submitting your request." },
      { status: 500 }
    );
  }
}
