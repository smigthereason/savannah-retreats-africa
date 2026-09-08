# Savannah Retreats Africa — Frontend

Next.js (App Router) + TypeScript + Tailwind. Safari/Kenya booking-inquiry
site targeting American travelers.

## Run it

```bash
npm install
cp .env.example .env.local   # fill in real values, see below
npm run dev
```

Open http://localhost:3000.

## Current architecture (as of this audit — keep this section honest)

- **Marketing content** (home, about, packages, lodges, culture) is still
  static — `lib/data.ts`, `lib/packages-data.ts`, `lib/lodges-data.ts`,
  `lib/culture-data.ts`, `lib/about-data.ts` hold all copy and image URLs
  as plain objects.
- **Sanity IS wired in**, but only for the inquiry/CRM pipeline, not
  content: `app/api/inquiries/route.ts` writes every form submission
  (Contact, Trip Planner, Booking CTA, Plan Safari) to Sanity as an
  `inquiry` document (`sanity/schemaTypes/inquiry.ts`). `app/admin`
  reads them back into a small CRM-style dashboard.
- **Sanity Studio** is live at `/studio`, gated by Sanity's own login.
- **Admin dashboard** is live at `/admin` and uses Google OAuth for staff
  authentication. Access is limited by `ADMIN_ALLOWED_EMAILS` and/or the
  optional `ADMIN_ALLOWED_GOOGLE_DOMAIN`. The signed session stores the
  Google account identity so every portal reply can be attributed to the
  individual staff member who sent it.
- **No payment processor, no customer accounts.** Confirmed absent, not
  just unbuilt — see the audit report for how that was verified.
- **Transactional email** goes through the `info@savannahretreatsafrica.com`
  mailbox via SMTP (`lib/mail.ts`, using Namecheap Private Email). Admin
  replies continue to use that official company mailbox as the From address,
  while Sanity stores a `replyHistory` audit trail with the authenticated
  staff member, subject, message and timestamp. The customer-facing reply
  signature also shows the staff member's name.

## Environment variables

See `.env.example` for the full list and where to get each value.
Required at minimum for `/admin` and inquiry submission to work:
`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
`SANITY_API_TOKEN`, `ADMIN_SESSION_SECRET`, `GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`, plus at least one of `ADMIN_ALLOWED_EMAILS` or
`ADMIN_ALLOWED_GOOGLE_DOMAIN`.

For Google Cloud, create/use a **Web application** OAuth client and add these
Authorized redirect URIs as required by your environments:

```text
https://savannahretreatsafrica.com/api/admin/auth/google/callback
http://localhost:3000/api/admin/auth/google/callback
```

The production URI must also be set as `GOOGLE_OAUTH_REDIRECT_URI` (or the
application will derive the same URI from the request origin). Only the
`openid email profile` scopes are requested; Gmail access is not required.

Email (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`,
`ADMIN_ALERT_EMAIL`) should remain configured for the existing Namecheap
Private Email mailbox so customer responses continue to come from
`info@savannahretreatsafrica.com`.

## Design tokens

| Token  | Hex       | Use                                   |
|--------|-----------|----------------------------------------|
| linen  | `#F7F4F0` | Page background                       |
| umber  | `#3A322C` | Nav, headlines, footer, dark sections  |
| ochre  | `#A3704C` | CTAs, links, focus states              |
| acacia | `#5B6B4A` | Secondary accent (coordinate labels)   |
| sand   | `#EDE6DB` | Alternate section background          |
| ink    | `#4A433D` | Body text                              |

Fonts: **Fraunces** (display/headlines) + **Inter** (body, nav, eyebrows).

## Structure

```
app/
  (root)/           — public pages: home, about, packages, lodges,
                       culture, contact, plantrip
  admin/             — Google-authenticated inquiry dashboard + login
  api/inquiries/     — public POST endpoint, writes to Sanity + sends email
  api/admin/         — Google OAuth, logout, status and reply endpoints
  studio/            — embedded Sanity Studio
components/
  Landing-Page/       — homepage sections (Navbar, Hero, CTABooking, etc.)
  Admin/InquiryDashboard.tsx — the /admin CRM UI (search, filter, CSV export)
  Contact/, PlanTrip/ — the two other inquiry-generating forms
lib/
  data.ts, packages-data.ts, lodges-data.ts, culture-data.ts, about-data.ts
                      — static content (not yet in Sanity)
  sanity/client.ts    — `client` (public, read-only, currently unused) and
                         `writeClient` (server-only, used for inquiries)
  mail.ts             — SMTP transactional email (Namecheap Private Email)
  rateLimit.ts         — lightweight in-memory rate limiter for public routes
  submitInquiry.ts     — client-side helper all four forms call
```

## Known placeholders / open items

- Most images are Unsplash URLs for layout purposes only — swap for
  licensed photography before launch. A few package/lodge entries still
  hotlink images directly from other companies' sites
  (`lib/data.ts`, `lib/packages-data.ts` — search for `masaimara.travel`,
  `scottdunn.com`, `south-african-lodges.com`, `pinimg.com`); replace
  these with real or licensed photography, not just Unsplash, since
  they're someone else's brand photography.
- "Trusted by" names (Magical Kenya, Condé Nast Traveler, etc.) in
  `lib/data.ts` are placeholder wordmarks, not real partnerships —
  replace with real credentials (e.g. KATO/TRA registration, if
  applicable) before publishing to paying customers.
- No `/journal` inner page yet (only the homepage teaser cards exist).
- No CSP configured in `next.config.mjs` (other baseline security
  headers are set) — needs live testing against `/studio` before adding.
- Sanity dataset visibility (public vs. private) should be confirmed in
  the Sanity project dashboard — see the audit report.

## Admin identity + email audit model

Google is used for **staff authentication only**. The portal does not request
Gmail scopes and does not need Gmail delegation or a service account. This is
intentional because the current shared mailbox is hosted by Namecheap Private
Email, not Google Workspace.

When an authenticated staff member replies from `/admin`:

1. The message is sent over the existing Namecheap SMTP connection from
   `info@savannahretreatsafrica.com`.
2. The email signature shows the authenticated staff member's display name.
3. Sanity appends an immutable-style `replyHistory` entry containing the
   staff Google account ID/email/name, subject, body, timestamp and mailbox.
4. The admin drawer displays that reply history so the team can see who
   replied and what was sent.

If the mailbox is later migrated to Google Workspace, Gmail delegation can be
considered separately. It is not required for the current architecture.

## Sanity migration for existing Design Your Journey notes

The schema now has a dedicated `additionalNotes` field for the final
"Anything else we should know?" answer. New submissions populate it
automatically. Existing Design Your Journey documents can be backfilled with:

```bash
node --env-file=.env.local scripts/migrate-inquiry-additional-notes.mjs
```

The migration only patches Design Your Journey documents where
`additionalNotes` is missing and extracts the legacy `Notes:` value from the
generated message summary.
