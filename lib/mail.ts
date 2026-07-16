/**
 * Transactional email via Resend.
 *
 * Requires env vars (see .env.example):
 *   RESEND_API_KEY   — from https://resend.com/api-keys
 *   MAIL_FROM        — a verified sending address, e.g.
 *                       "Savannah Retreats Africa <hello@yourdomain.com>"
 *   ADMIN_ALERT_EMAIL — where new-lead alerts go, e.g. kimani@yourdomain.com
 *
 * If RESEND_API_KEY is not set, sendMail() logs a warning and resolves
 * without throwing — inquiry submission keeps working end-to-end even
 * before email is wired up, it just won't send anything yet.
 */

type SendMailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendMail({ to, subject, html }: SendMailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;

  if (!apiKey || !from) {
    console.warn(
      "[mail] RESEND_API_KEY or MAIL_FROM not set — skipping email send.",
      { to, subject }
    );
    return { skipped: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[mail] Resend send failed:", res.status, body);
    // Deliberately don't throw — a failed email shouldn't fail the
    // inquiry submission itself; the lead is already saved in Sanity.
    return { skipped: false, ok: false };
  }

  return { skipped: false, ok: true };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function inquiryConfirmationEmail(name: string | undefined) {
  const greeting = name ? escapeHtml(name) : "there";
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #3A322C;">Thanks, ${greeting} — we've got your message</h2>
      <p style="color: #4A433D; line-height: 1.6;">
        We've received your inquiry and a member of the Savannah Retreats
        Africa team will get back to you within 24 hours with a tailored
        response.
      </p>
      <p style="color: #4A433D; line-height: 1.6;">
        In the meantime, feel free to reply to this email with any extra
        details about your trip.
      </p>
    </div>
  `;
}

export function newLeadAlertEmail(params: {
  type: string;
  name?: string;
  email: string;
  phone?: string;
  message?: string;
}) {
  const { type, name, email, phone, message } = params;
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #3A322C;">New ${escapeHtml(type)} inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name || "—")}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
      ${message ? `<p><strong>Message:</strong><br/>${escapeHtml(message)}</p>` : ""}
      <p style="color: #888; font-size: 12px;">View and manage this lead in /admin.</p>
    </div>
  `;
}
