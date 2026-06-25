# Savannah Retreats Africa — Frontend

Next.js (App Router) + TypeScript + Tailwind. Homepage rebuilt from the Cappa
hotel-theme reference, restyled around safari/Kenya content and the brand
palette below. Sanity is intentionally **not** wired up yet — `lib/data.ts`
holds all copy and image URLs as plain objects so it's a drop-in swap for
`sanityFetch()` calls later without touching component markup.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

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
  layout.tsx       — fonts, metadata
  page.tsx          — assembles the homepage
  globals.css       — base styles + .eyebrow / .coord / .btn-* utilities
components/
  Header.tsx        — transparent-over-hero nav + vertical "Reservation" tab
  Hero.tsx           — rotating slides, GPS-coordinate location tag
  Intro.tsx          — welcome / brand intro block
  PlanSafari.tsx     — "Search Rooms" pattern reworked into trip search
  Testimonial.tsx    — full-bleed quote section
  Experiences.tsx    — alternating image/text blocks (Mara, Amboseli, etc.)
  Journal.tsx        — travel-journal cards (was "News")
  CTABooking.tsx      — booking form + trusted-by wordmarks
  Footer.tsx
lib/
  data.ts            — all copy, nav links, image URLs
```

## Known placeholders

- All images are Unsplash URLs for layout purposes only — swap for licensed
  photography (or Sanity image assets) before launch.
- "Trusted by" names (Magical Kenya, Condé Nast Traveler, etc.) are
  placeholder wordmarks, not real partnerships — replace before publishing.
- Form inputs are static (no submit handler yet).

## Next steps (not done yet, per your request)

- Sanity schema + client, replacing `lib/data.ts`
- Real date picker for the search/booking forms
- Inner pages: About, Packages, Lodges, Journal, Contact
- Mobile nav (hamburger menu) — header currently collapses the nav links
  below the `lg` breakpoint with no menu to open them
