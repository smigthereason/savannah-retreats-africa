/**
 * Transactional email via Namecheap Private Email (SMTP + IMAP), using
 * the info@savannahretreatsafrica.com mailbox for customer confirmations,
 * internal lead alerts, and admin replies.
 *
 * Requires env vars (see .env.example):
 *   SMTP_HOST            — mail.privateemail.com
 *   SMTP_PORT             — 465 (SSL) or 587 (STARTTLS)
 *   SMTP_USER             — info@savannahretreatsafrica.com
 *   SMTP_PASSWORD          — that mailbox's password (an App Password, if
 *                            2FA/app-passwords are enabled on the account)
 *   MAIL_FROM              — e.g. "Savannah Retreats Africa <info@savannahretreatsafrica.com>"
 *   ADMIN_ALERT_EMAIL      — where new-lead alerts land
 *   IMAP_HOST / IMAP_PORT  — only needed if different from SMTP_HOST /
 *                            993 (Namecheap's default IMAP-SSL port) —
 *                            used solely to archive admin replies into
 *                            the Sent folder, see sendReplyAndArchive().
 *   NEXT_PUBLIC_SITE_URL   — e.g. https://savannahretreatsafrica.com, used
 *                            to build an absolute logo URL for email
 *                            headers (email clients can't load relative
 *                            image paths)
 *
 * If SMTP_HOST/SMTP_USER/SMTP_PASSWORD aren't set, sendMail() logs a
 * warning and resolves without throwing — inquiry submission keeps
 * working end-to-end even before email is wired up, it just won't send
 * anything yet.
 */

import nodemailer, { type Transporter } from "nodemailer";

type SendMailInput = {
  to: string;
  subject: string;
  html: string;
};

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const port = Number(process.env.SMTP_PORT || 465);

  if (!host || !user || !pass) return null;

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465 (SSL), false for 587 (STARTTLS)
      auth: { user, pass },
    });
  }
  return cachedTransporter;
}

export async function sendMail({ to, subject, html }: SendMailInput) {
  const from = process.env.MAIL_FROM;
  const transporter = getTransporter();

  if (!transporter || !from) {
    console.warn(
      "[mail] SMTP_HOST/SMTP_USER/SMTP_PASSWORD/MAIL_FROM not fully set — skipping email send.",
      { to, subject }
    );
    return { skipped: true };
  }

  try {
    await transporter.sendMail({ from, to, subject, html });
    return { skipped: false, ok: true };
  } catch (err) {
    console.error("[mail] SMTP send failed:", err);
    // Deliberately don't throw — a failed email shouldn't fail the
    // inquiry submission itself; the lead is already saved in Sanity.
    return { skipped: false, ok: false };
  }
}

// ---------------------------------------------------------------------
// Admin replies: send + archive to the Sent folder
// ---------------------------------------------------------------------
// Namecheap Private Email does NOT automatically copy SMTP-submitted
// mail into the account's own Sent folder the way its webmail does.
// To make admin replies show up in Sent (so there's a real record
// alongside anything sent manually by the team), we build the raw MIME
// message once, send that exact byte stream over SMTP, then IMAP-APPEND
// the same bytes into the Sent folder. Both steps authenticate as the
// same mailbox (SMTP_USER/SMTP_PASSWORD), since it's the same account.

async function buildRawMessage(opts: {
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<Buffer> {
  const MailComposer = require("nodemailer/lib/mail-composer");
  const composer = new MailComposer(opts);
  return new Promise((resolve, reject) => {
    composer.compile().build((err: Error | null, message: Buffer) => {
      if (err) reject(err);
      else resolve(message);
    });
  });
}

async function appendToSentFolder(raw: Buffer): Promise<boolean> {
  const host = process.env.IMAP_HOST || process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const port = Number(process.env.IMAP_PORT || 993);

  if (!host || !user || !pass) return false;

  const { ImapFlow } = await import("imapflow");
  const client = new ImapFlow({
    host,
    port,
    secure: true,
    auth: { user, pass },
    logger: false,
  });

  try {
    await client.connect();
    // "Sent" matches Namecheap Private Email's default folder name. If
    // your account uses a different name (e.g. "Sent Items"), update
    // this — a wrong name fails the append below, which is caught and
    // logged rather than breaking the reply send itself.
    await client.append("Sent", raw, ["\\Seen"]);
    return true;
  } catch (err) {
    console.error("[mail] Failed to archive reply to Sent folder:", err);
    return false;
  } finally {
    await client.logout().catch(() => {});
  }
}

export async function sendReplyAndArchive({ to, subject, html }: SendMailInput) {
  const from = process.env.MAIL_FROM;
  const transporter = getTransporter();

  if (!transporter || !from) {
    console.warn("[mail] SMTP not configured — skipping reply send.", { to, subject });
    return { skipped: true, ok: false, archived: false };
  }

  let raw: Buffer;
  try {
    raw = await buildRawMessage({ from, to, subject, html });
  } catch (err) {
    console.error("[mail] Failed to build reply message:", err);
    return { skipped: false, ok: false, archived: false };
  }

  try {
    await transporter.sendMail({ raw, envelope: { from, to } });
  } catch (err) {
    console.error("[mail] SMTP send failed:", err);
    return { skipped: false, ok: false, archived: false };
  }

  // The email is sent at this point regardless of what happens below —
  // archiving is a nice-to-have record, not a condition of success.
  const archived = await appendToSentFolder(raw);
  return { skipped: false, ok: true, archived };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ---------------------------------------------------------------------
// Branded email shell
// ---------------------------------------------------------------------
// Written as table-based HTML with inline styles throughout — this is
// deliberate, not a style regression. Most email clients (Outlook
// especially) strip <style> blocks and don't support flexbox/grid, so
// inline styles + tables is the only way to get consistent rendering
// across Gmail, Outlook, Apple Mail, etc. Fonts fall back to system
// serif/sans-serif since Fraunces/Inter aren't guaranteed to load in
// an email client.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://savannahretreatsafrica.com";
const LOGO_URL = `${SITE_URL}/logo-no-bg.png`;

// TODO: replace with your real business address and phone number
// before sending this to real customers — these are placeholders.
const BUSINESS_ADDRESS = "Nairobi, Kenya";
const BUSINESS_PHONE = "+254 7XX XXX XXX";

const COLORS = {
  linen: "#F7F4F0",
  umber: "#3A322C",
  ochre: "#A3704C",
  ink: "#4A433D",
};

function emailShell({
  eyebrow,
  heading,
  bodyHtml,
}: {
  eyebrow: string;
  heading: string;
  bodyHtml: string;
}) {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:${COLORS.linen}; font-family: Georgia, 'Times New Roman', serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.linen}; padding: 40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%; background-color:#FFFFFF; border:1px solid rgba(58,50,44,0.08);">

            <!-- Logo -->
            <tr>
              <td align="center" style="padding: 40px 40px 24px;">
                <img src="${LOGO_URL}" alt="Savannah Retreats Africa" width="150" style="display:block; width:150px; height:auto;" />
              </td>
            </tr>

            <!-- Eyebrow + heading -->
            <tr>
              <td align="center" style="padding: 0 40px;">
                <p style="margin:0 0 8px; font-family: Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:${COLORS.ochre};">
                  ${escapeHtml(eyebrow)}
                </p>
                <h1 style="margin:0 0 16px; font-size:24px; line-height:1.3; color:${COLORS.umber}; font-weight:400;">
                  ${escapeHtml(heading)}
                </h1>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 32px;">
                  <tr><td style="width:48px; height:2px; background-color:${COLORS.ochre}; font-size:0; line-height:0;">&nbsp;</td></tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 0 40px 40px; font-family: Arial, Helvetica, sans-serif; font-size:15px; line-height:1.7; color:${COLORS.ink};">
                ${bodyHtml}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 24px 40px 40px; border-top:1px solid rgba(58,50,44,0.08); font-family: Arial, Helvetica, sans-serif; font-size:12px; line-height:1.8; color:${COLORS.ink}; text-align:center;">
                ${escapeHtml(BUSINESS_ADDRESS)}<br/>
                ${escapeHtml(BUSINESS_PHONE)}<br/>
                <a href="${SITE_URL}" style="color:${COLORS.ochre}; text-decoration:underline;">Visit our website</a>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
}

const INQUIRY_TYPE_HEADINGS: Record<string, string> = {
  contact: "General Enquiry",
  tripPlanner: "Trip Planning Request",
  booking: "Booking Request",
  planSafari: "Safari Search Enquiry",
};

// ---------------------------------------------------------------------
// Shared "enquiry details" renderer
// ---------------------------------------------------------------------
// Used both for the internal new-lead alert and for the "Your Enquiry"
// summary quoted at the top of an admin reply — same underlying data,
// two different presentations of it.

export type InquiryDetails = {
  type: string;
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  reference?: { refType?: string; label?: string; slug?: string };
  destinations?: string[];
  tier?: string;
  dateStart?: string;
  dateEnd?: string;
  adults?: number;
  children?: number;
  childrenAges?: number[];
  seniorAdults?: number;
  destination?: string;
  packageChoice?: string;
};

function buildInquiryRows(details: InquiryDetails): Array<[string, string]> {
  const {
    type, name, email, phone, destination, destinations, tier,
    packageChoice, dateStart, dateEnd, adults, children, childrenAges,
    seniorAdults, reference,
  } = details;

  const rows: Array<[string, string]> = [
    ["Type", INQUIRY_TYPE_HEADINGS[type] || type],
    ["Name", name || "—"],
    ["Email", email],
  ];
  if (phone) rows.push(["Phone", phone]);
  if (destination) rows.push(["Destination", destination]);
  if (destinations?.length) rows.push(["Destinations", destinations.join(", ")]);
  if (tier) rows.push(["Tier", tier]);
  if (packageChoice) rows.push(["Package", packageChoice]);
  if (dateStart || dateEnd) {
    rows.push(["Travel Dates", `${dateStart || "—"} to ${dateEnd || "—"}`]);
  }
  if (adults !== undefined || children !== undefined) {
    const adultsLabel = `${adults ?? 0} adult${adults === 1 ? "" : "s"}`;
    const seniorLabel = seniorAdults ? ` (${seniorAdults} aged 65+)` : "";
    const childrenLabel = children
      ? `, ${children} child${children === 1 ? "" : "ren"}${
          childrenAges?.length ? ` (ages ${childrenAges.join(", ")})` : ""
        }`
      : "";
    rows.push(["Party Size", `${adultsLabel}${seniorLabel}${childrenLabel}`]);
  }
  if (reference?.label) rows.push(["Referring item", reference.label]);
  return rows;
}

function renderRowsTable(rows: Array<[string, string]>) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
      ${rows
        .map(
          ([label, value]) => `
      <tr>
        <td style="padding:6px 12px 6px 0; font-weight:bold; white-space:nowrap; vertical-align:top;">${escapeHtml(label)}:</td>
        <td style="padding:6px 0; vertical-align:top;">${escapeHtml(value)}</td>
      </tr>`
        )
        .join("")}
    </table>
  `;
}

export function inquiryConfirmationEmail(name: string | undefined, type?: string) {
  const greeting = name ? escapeHtml(name) : "there";
  const heading = INQUIRY_TYPE_HEADINGS[type || ""] || "Your Enquiry";
  const body = `
    <p style="margin:0 0 16px;">Dear ${greeting},</p>
    <p style="margin:0 0 16px;">
      Thank you for reaching out to Savannah Retreats Africa. We've
      received your message and a member of our team will get back to
      you within 24 hours with a tailored response.
    </p>
    <p style="margin:0 0 16px;">
      In the meantime, feel free to reply directly to this email with
      any extra details about your trip.
    </p>
    <p style="margin:24px 0 0;">
      Warm regards,<br/>
      <strong style="color:${COLORS.umber};">The Savannah Retreats Africa Team</strong>
    </p>
  `;
  return emailShell({ eyebrow: "Re", heading, bodyHtml: body });
}

export function adminReplyEmail({
  message,
  inquiry,
}: {
  message: string;
  inquiry: InquiryDetails;
}) {
  const greeting = inquiry.name ? escapeHtml(inquiry.name) : "there";
  // Preserve paragraph breaks from the admin's plain-text textarea input.
  const paragraphs = message
    .split(/\n{2,}/)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;">${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`
    )
    .join("");

  const enquiryBox = `
    <div style="margin:0 0 24px; padding:16px 20px; background-color:${COLORS.linen}; border-left:3px solid ${COLORS.ochre};">
      <p style="margin:0 0 10px; font-size:11px; text-transform:uppercase; letter-spacing:1px; color:${COLORS.ochre}; font-weight:bold; font-family: Arial, Helvetica, sans-serif;">
        Your Enquiry
      </p>
      ${renderRowsTable(buildInquiryRows(inquiry))}
      ${
        inquiry.message
          ? `<p style="margin:12px 0 0; font-style:italic; color:${COLORS.ink};">"${escapeHtml(inquiry.message)}"</p>`
          : ""
      }
    </div>
  `;

  const body = `
    <p style="margin:0 0 16px;">Dear ${greeting},</p>
    ${paragraphs}
    ${enquiryBox}
    <p style="margin:24px 0 0;">
      Warm regards,<br/>
      <strong style="color:${COLORS.umber};">The Savannah Retreats Africa Team</strong>
    </p>
  `;
  return emailShell({ eyebrow: "Re", heading: "Your Enquiry", bodyHtml: body });
}

export function newLeadAlertEmail(params: InquiryDetails) {
  const body = `
    ${renderRowsTable(buildInquiryRows(params))}
    ${params.message ? `<p style="margin:20px 0 0;"><strong>Message:</strong><br/>${escapeHtml(params.message)}</p>` : ""}
    <p style="margin:24px 0 0; font-size:12px; color:#888;">View and manage this lead in /admin.</p>
  `;
  return emailShell({ eyebrow: "New Lead", heading: "New Inquiry Received", bodyHtml: body });
}
