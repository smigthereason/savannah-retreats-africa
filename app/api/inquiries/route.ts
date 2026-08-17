import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity/client";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { sendMail, inquiryConfirmationEmail, newLeadAlertEmail, partnerConfirmationEmail } from "@/lib/mail";

const ALLOWED_TYPES = ["contact", "tripPlanner", "booking", "planSafari", "partner", "designJourney"];

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
  accessibilityNeeds: 1000,
  businessName: 200,
  serviceType: 100,
  serviceLocation: 200,
  travellerType: 100,
  travelTiming: 120,
  travelMonth: 200,
  duration: 100,
  budget: 120,
  sourcePath: 300,
  sourceLabel: 240,
};

function cappedString(value: unknown, field: keyof typeof MAX_LENGTHS) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, MAX_LENGTHS[field]);
}

function saneSourcePath(value: unknown) {
  const path = cappedString(value, "sourcePath");
  if (!path) return undefined;

  // Keep this as a same-site relative path. The value is display metadata,
  // not an authorization signal, but rejecting external-looking values keeps
  // the admin source filters clean.
  if (!path.startsWith("/") || path.startsWith("//")) return undefined;

  return path;
}

function sanePartySize(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  const n = Math.round(value);
  if (n < 0 || n > 30) return undefined; // 30 is a generous ceiling for a group inquiry
  return n;
}

function saneChildrenAges(value: unknown): number[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const ages = value
    .map((v) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : null))
    .filter((v): v is number => v !== null && v >= 0 && v <= 17)
    .slice(0, 10);
  return ages.length > 0 ? ages : undefined;
}

function saneStringArray(
  value: unknown,
  maxItems = 20,
  maxItemLength = 120,
): string[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const cleaned = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().slice(0, maxItemLength))
    .filter(Boolean)
    .slice(0, maxItems);

  return cleaned.length > 0 ? cleaned : undefined;
}

function buildDesignJourneyMessage(body: Record<string, unknown>) {
  const destinations = saneStringArray(body.destinations)?.join(", ");
  const experiences = saneStringArray(body.experiences)?.join(", ");
  const accommodation = saneStringArray(body.accommodationPreferences)?.join(", ");
  const interests = saneStringArray(body.interests)?.join(", ");
  const travellerType = cappedString(body.travellerType, "travellerType");
  const travelTiming = cappedString(body.travelTiming, "travelTiming");
  const travelMonth = cappedString(body.travelMonth, "travelMonth");
  const duration = cappedString(body.duration, "duration");
  const budget = cappedString(body.budget, "budget");
  const notes = cappedString(body.message, "message");

  const lines = [
    "DESIGN YOUR JOURNEY",
    destinations ? `Kenya destinations: ${destinations}` : undefined,
    experiences ? `Experiences: ${experiences}` : undefined,
    travellerType ? `Travelling as: ${travellerType}` : undefined,
    typeof body.adults === "number" ? `Adults: ${body.adults}` : undefined,
    typeof body.children === "number" ? `Children: ${body.children}` : undefined,
    travelTiming ? `Timing: ${travelTiming}` : undefined,
    travelMonth ? `Preferred dates/month: ${travelMonth}` : undefined,
    duration ? `Duration: ${duration}` : undefined,
    budget ? `Budget: ${budget}` : undefined,
    accommodation ? `Accommodation: ${accommodation}` : undefined,
    interests ? `Interests: ${interests}` : undefined,
    notes ? `Notes: ${notes}` : undefined,
  ].filter(Boolean);

  return lines.join("\n").slice(0, MAX_LENGTHS.message);
}


type DesignJourneyEmailData = {
  name?: string;
  email: string;
  phone?: string;
  destinations?: string[];
  experiences?: string[];
  travellerType?: string;
  adults?: number;
  children?: number;
  travelTiming?: string;
  travelMonth?: string;
  duration?: string;
  budget?: string;
  accommodationPreferences?: string[];
  interests?: string[];
  notes?: string;
  submittedAt: string;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function emailRow(label: string, value?: string | number) {
  if (value === undefined || value === null || String(value).trim() === "") return "";
  return `
    <tr>
      <td style="padding:9px 0;width:150px;vertical-align:top;color:#81786F;font-size:12px;line-height:18px;text-transform:uppercase;letter-spacing:1.2px;">${escapeHtml(label)}</td>
      <td style="padding:9px 0;vertical-align:top;color:#3A322C;font-size:14px;line-height:22px;font-weight:600;">${escapeHtml(value)}</td>
    </tr>`;
}

function emailTags(values?: string[]) {
  if (!values?.length) return "—";
  return values
    .map(
      (value) =>
        `<span style="display:inline-block;margin:0 6px 7px 0;padding:7px 10px;background:#F7F4F0;border:1px solid #E0D8CF;color:#4A433D;font-size:12px;line-height:16px;">${escapeHtml(value)}</span>`,
    )
    .join("");
}

function designJourneyAdminEmail(data: DesignJourneyEmailData) {
  const party = [
    data.adults !== undefined ? `${data.adults} adult${data.adults === 1 ? "" : "s"}` : undefined,
    data.children ? `${data.children} ${data.children === 1 ? "child" : "children"}` : undefined,
  ]
    .filter(Boolean)
    .join(" · ");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const adminButton = siteUrl
    ? `<a href="${escapeHtml(siteUrl)}/admin" style="display:inline-block;background:#A3704C;color:#ffffff;text-decoration:none;padding:13px 22px;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">View in admin</a>`
    : "";

  const received = new Date(data.submittedAt).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  });

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F3EFE9;font-family:Arial,Helvetica,sans-serif;color:#3A322C;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#F3EFE9;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:680px;background:#ffffff;border:1px solid #E4DDD4;">
            <tr>
              <td style="padding:34px 38px 30px;background:#5B6B4A;color:#ffffff;">
                <div style="font-size:11px;line-height:16px;letter-spacing:2.2px;text-transform:uppercase;color:#EFE9DF;">Savannah Retreats Africa</div>
                <div style="margin-top:18px;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:40px;">New Design Your Journey enquiry</div>
                <div style="margin-top:12px;font-size:14px;line-height:22px;color:#F5F1EA;">A traveller has completed the Kenya journey discovery funnel.</div>
              </td>
            </tr>

            <tr>
              <td style="padding:32px 38px 8px;">
                <div style="font-size:11px;line-height:16px;letter-spacing:1.8px;text-transform:uppercase;color:#A3704C;font-weight:700;">Traveller</div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px;border-top:1px solid #E9E2D9;">
                  ${emailRow("Name", data.name || data.email)}
                  ${emailRow("Email", data.email)}
                  ${emailRow("Phone", data.phone)}
                  ${emailRow("Travelling as", data.travellerType)}
                  ${emailRow("Party", party)}
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 38px 8px;">
                <div style="font-size:11px;line-height:16px;letter-spacing:1.8px;text-transform:uppercase;color:#A3704C;font-weight:700;">Journey brief</div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:10px;border-top:1px solid #E9E2D9;">
                  ${emailRow("Kenya regions", data.destinations?.join(", "))}
                  ${emailRow("Experience", data.experiences?.join(", "))}
                  ${emailRow("Timing", data.travelTiming)}
                  ${emailRow("Preferred dates", data.travelMonth)}
                  ${emailRow("Duration", data.duration)}
                  ${emailRow("Investment", data.budget)}
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:22px 38px 4px;">
                <div style="font-size:11px;line-height:16px;letter-spacing:1.8px;text-transform:uppercase;color:#81786F;">Accommodation preferences</div>
                <div style="margin-top:12px;">${emailTags(data.accommodationPreferences)}</div>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 38px 4px;">
                <div style="font-size:11px;line-height:16px;letter-spacing:1.8px;text-transform:uppercase;color:#81786F;">Interests</div>
                <div style="margin-top:12px;">${emailTags(data.interests)}</div>
              </td>
            </tr>

            ${
              data.notes
                ? `<tr><td style="padding:22px 38px 4px;"><div style="font-size:11px;line-height:16px;letter-spacing:1.8px;text-transform:uppercase;color:#81786F;">Traveller notes</div><div style="margin-top:10px;padding:16px 18px;background:#F7F4F0;color:#4A433D;font-size:14px;line-height:23px;white-space:pre-wrap;">${escapeHtml(data.notes)}</div></td></tr>`
                : ""
            }

            <tr>
              <td style="padding:30px 38px 36px;">
                ${adminButton}
                <div style="margin-top:${adminButton ? "22" : "0"}px;color:#8A8178;font-size:11px;line-height:18px;">Received ${escapeHtml(received)} EAT · Source: Design Your Journey</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function designJourneyConfirmationEmail(name?: string) {
  const firstName = name?.trim().split(/\s+/)[0];
  const greeting = firstName ? `Hi ${escapeHtml(firstName)},` : "Hello,";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F3EFE9;font-family:Arial,Helvetica,sans-serif;color:#3A322C;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#F3EFE9;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#ffffff;border:1px solid #E4DDD4;">
            <tr>
              <td style="padding:34px 38px;background:#5B6B4A;color:#ffffff;">
                <div style="font-size:11px;letter-spacing:2.2px;text-transform:uppercase;color:#EFE9DF;">Savannah Retreats Africa</div>
                <div style="margin-top:18px;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:40px;">Your Kenya journey is with us.</div>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 38px 38px;">
                <p style="margin:0;color:#3A322C;font-size:15px;line-height:25px;">${greeting}</p>
                <p style="margin:18px 0 0;color:#4A433D;font-size:15px;line-height:26px;">Thank you for sharing how you want to experience Kenya. Your journey brief has reached our travel design team.</p>
                <p style="margin:16px 0 0;color:#4A433D;font-size:15px;line-height:26px;">We&apos;ll review your preferences — the regions, pace, style of stay and experiences that matter to you — and reply with a thoughtful next step within 24 hours.</p>
                <div style="margin-top:28px;padding-top:22px;border-top:1px solid #E9E2D9;color:#81786F;font-size:12px;line-height:20px;">No action is needed from you right now. If you think of anything else, simply reply to this email.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
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
    const message =
      body.type === "designJourney"
        ? buildDesignJourneyMessage(body)
        : cappedString(body.message, "message");

    const doc = {
      _type: "inquiry",
      type: body.type,
      status: "new",
      name,
      email,
      phone: cappedString(body.phone, "phone"),
      message,
      sourcePath: saneSourcePath(body.sourcePath),
      sourceLabel: cappedString(body.sourceLabel, "sourceLabel"),
      reference:
        body.reference && typeof body.reference === "object"
          ? {
              refType: cappedString(body.reference.refType, "tier"),
              label: cappedString(body.reference.label, "destination"),
              slug: cappedString(body.reference.slug, "destination"),
            }
          : undefined,
      destinations: saneStringArray(body.destinations),
      tier: cappedString(body.tier, "tier"),
      experiences: saneStringArray(body.experiences, 12, 120),
      travellerType: cappedString(body.travellerType, "travellerType"),
      travelTiming: cappedString(body.travelTiming, "travelTiming"),
      travelMonth: cappedString(body.travelMonth, "travelMonth"),
      duration: cappedString(body.duration, "duration"),
      budget: cappedString(body.budget, "budget"),
      accommodationPreferences: saneStringArray(body.accommodationPreferences, 12, 120),
      interests: saneStringArray(body.interests, 20, 120),
      dateStart: cappedString(body.dateStart, "destination"),
      dateEnd: cappedString(body.dateEnd, "destination"),
      adults: sanePartySize(body.adults),
      children: sanePartySize(body.children),
      childrenAges: saneChildrenAges(body.childrenAges),
      seniorAdults: sanePartySize(body.seniorAdults),
      destination: cappedString(body.destination, "destination"),
      packageChoice: cappedString(body.packageChoice, "packageChoice"),
      accessibilityNeeds: cappedString(body.accessibilityNeeds, "accessibilityNeeds"),
      businessName: cappedString(body.businessName, "businessName"),
      serviceType: cappedString(body.serviceType, "serviceType"),
      serviceLocation: cappedString(body.serviceLocation, "serviceLocation"),
      submittedAt: new Date().toISOString(),
    };

    const created = await writeClient.create(doc);

    // Best-effort notifications — never let an email failure fail the
    // request itself; the lead is already safely saved above.
    const adminAlertTo = process.env.ADMIN_ALERT_EMAIL;
    const typeSubjectLabel: Record<string, string> = {
      contact: "General Enquiry",
      tripPlanner: "Trip Planning Request",
      booking: "Booking Request",
      planSafari: "Safari Search Enquiry",
      partner: "Partner Inquiry",
      designJourney: "Design Your Journey Request",
    };
    const isPartner = body.type === "partner";
    const isDesignJourney = body.type === "designJourney";

    const customerSubject = isPartner
      ? "We've received your inquiry — Savannah Retreats Africa"
      : isDesignJourney
        ? "Your Kenya journey is with us — Savannah Retreats Africa"
        : `Re: ${typeSubjectLabel[body.type] || "Your Enquiry"} — Savannah Retreats Africa`;

    const customerHtml = isPartner
      ? partnerConfirmationEmail(name)
      : isDesignJourney
        ? designJourneyConfirmationEmail(name)
        : inquiryConfirmationEmail(name, body.type);

    const adminSubject = isDesignJourney
      ? `New Design Your Journey enquiry — ${name || email}`
      : `New ${body.type} inquiry from ${name || email}`;

    const adminHtml = isDesignJourney
      ? designJourneyAdminEmail({
          name,
          email,
          phone: doc.phone,
          destinations: doc.destinations,
          experiences: doc.experiences,
          travellerType: doc.travellerType,
          adults: doc.adults,
          children: doc.children,
          travelTiming: doc.travelTiming,
          travelMonth: doc.travelMonth,
          duration: doc.duration,
          budget: doc.budget,
          accommodationPreferences: doc.accommodationPreferences,
          interests: doc.interests,
          notes: cappedString(body.message, "message"),
          submittedAt: doc.submittedAt,
        })
      : newLeadAlertEmail({
          type: body.type,
          name,
          email,
          phone: doc.phone,
          message,
          sourcePath: doc.sourcePath,
          sourceLabel: doc.sourceLabel,
          reference: doc.reference,
          destinations: doc.destinations,
          tier: doc.tier,
          dateStart: doc.dateStart,
          dateEnd: doc.dateEnd,
          adults: doc.adults,
          children: doc.children,
          childrenAges: doc.childrenAges,
          seniorAdults: doc.seniorAdults,
          destination: doc.destination,
          packageChoice: doc.packageChoice,
          accessibilityNeeds: doc.accessibilityNeeds,
          businessName: doc.businessName,
          serviceType: doc.serviceType,
          serviceLocation: doc.serviceLocation,
        });

    await Promise.allSettled([
      sendMail({
        to: email,
        subject: customerSubject,
        html: customerHtml,
      }),
      adminAlertTo
        ? sendMail({
            to: adminAlertTo,
            subject: adminSubject,
            html: adminHtml,
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
