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
- **Admin dashboard** is live at `/admin`, gated by a single shared
  password (`ADMIN_PASSWORD`) — see `middleware.ts`. This is a
  single-operator site lock, not a multi-user account system.
- **No payment processor, no customer accounts.** Confirmed absent, not
  just unbuilt — see the audit report for how that was verified.
- **Transactional email** goes through Resend (`lib/mail.ts`) — an
  inquiry confirmation to the customer and a new-lead alert to
  `ADMIN_ALERT_EMAIL`. If `RESEND_API_KEY` isn't set, sending is
  skipped (logged, not thrown) so the rest of the flow still works.

## Environment variables

See `.env.example` for the full list and where to get each value.
Required at minimum for `/admin` and inquiry submission to work:
`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
`SANITY_API_TOKEN`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
Email (`RESEND_API_KEY`, `MAIL_FROM`, `ADMIN_ALERT_EMAIL`) is optional
but recommended before sending real customers to the forms.

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
  admin/             — password-gated inquiry dashboard + login
  api/inquiries/     — public POST endpoint, writes to Sanity + sends email
  api/admin/         — login/logout/status-update, gated by middleware.ts
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
  mail.ts             — Resend transactional email
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
