// lib/packages-data.ts
// Pricing reflects 2026 land-only, twin-share, all-inclusive rates for the
// Kenyan luxury/signature safari market (private vehicle, full board, park
// fees, road or domestic-flight transfers included; international flights,
// visas, insurance, balloon safaris and gratuities excluded). Re-check
// against current camp rate sheets each season before publishing.

export type SafariPackage = {
  slug: string;
  title: string;
  coord: string;
  eyebrow: string;
  region: string;
  tag: "classic" | "honeymoon" | "family" | "migration" | "dual-park";
  nights: number;
  groupSize: string;
  priceFrom: number;
  tier: "Classic Tented" | "Signature Luxury" | "Private Reserve";
  image: string;
  description: string;
  highlights: string[];
};

export const packageFilters: {
  label: string;
  value: SafariPackage["tag"] | "all";
}[] = [
  { label: "All Packages", value: "all" },
  { label: "Migration", value: "migration" },
  { label: "Classic Safari", value: "classic" },
  { label: "Honeymoon", value: "honeymoon" },
  { label: "Dual-Park", value: "dual-park" },
  { label: "Family", value: "family" },
];

export const packages: SafariPackage[] = [
  {
    slug: "classic-mara-migration",
    title: "Classic Mara Migration Safari",
    coord: "01°S, 35°E",
    eyebrow: "Maasai Mara",
    region: "Maasai Mara National Reserve",
    tag: "migration",
    nights: 4,
    groupSize: "2–6 guests, private vehicle",
    priceFrom: 2450,
    tier: "Signature Luxury",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1600&auto=format&fit=crop",
    description:
      "Four nights inside the Mara ecosystem, timed for the wildebeest crossings and built around a single, well-chosen camp rather than a string of one-night stops.",
    highlights: [
      "Private guide and 4×4 for every game drive",
      "Riverine tented camp on the Mara's edge",
      "Optional sunrise balloon safari with champagne breakfast",
    ],
  },
  {
    slug: "rift-valley-mara-explorer",
    title: "Rift Valley & Mara Explorer",
    coord: "00°S, 36°E",
    eyebrow: "Naivasha · Maasai Mara",
    region: "Lake Naivasha & Maasai Mara",
    tag: "dual-park",
    nights: 6,
    groupSize: "2–6 guests, private vehicle",
    priceFrom: 3890,
    tier: "Signature Luxury",
    image:
      "https://images.unsplash.com/photo-1547970810-dc1eac37d174?q=80&w=1600&auto=format&fit=crop",
    description:
      "A road-based itinerary down the escarpment, breaking the drive to the Mara with two nights of flamingos and hippos on Lake Naivasha before three full days of game viewing.",
    highlights: [
      "Boat safari on Lake Naivasha at golden hour",
      "Drive through the Great Rift Valley escarpment",
      "Three full days in private Mara conservancy land",
    ],
  },
  {
    slug: "amboseli-mara-dual-safari",
    title: "Amboseli & Mara Dual Safari",
    coord: "02°S, 37°E / 01°S, 35°E",
    eyebrow: "Amboseli · Maasai Mara",
    region: "Amboseli & Maasai Mara",
    tag: "dual-park",
    nights: 7,
    groupSize: "2–6 guests, private vehicle",
    priceFrom: 4950,
    tier: "Private Reserve",
    image:
      "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1600&auto=format&fit=crop",
    description:
      "Kilimanjaro's elephant herds first, then the Mara's predators — two of Kenya's signature landscapes connected by a domestic flight, so no day is lost to the road.",
    highlights: [
      "Domestic flight between parks — no long transfers",
      "Elephant herds against Kilimanjaro at Amboseli",
      "Private conservancy camp inside the Mara",
    ],
  },
  {
    slug: "escarpment-honeymoon-retreat",
    title: "Private Escarpment Honeymoon",
    coord: "01°S, 35°E",
    eyebrow: "Maasai Mara Escarpment",
    region: "Mara North Conservancy",
    tag: "honeymoon",
    nights: 5,
    groupSize: "2 guests, exclusive-use vehicle",
    priceFrom: 4250,
    tier: "Private Reserve",
    image:
      "https://images.unsplash.com/photo-1535941339077-2dc1c25d36d5?q=80&w=1600&auto=format&fit=crop",
    description:
      "A private tent on the Mara escarpment, an exclusive-use vehicle for the length of the stay, and a schedule built entirely around the two of you.",
    highlights: [
      "Exclusive-use vehicle and guide, no shared drives",
      "Private bush dinner under the escarpment cliffs",
      "Couples' spa tent and in-room champagne on arrival",
    ],
  },
  {
    slug: "highlands-mara-safari",
    title: "Mount Kenya Highlands & Mara",
    coord: "00°N, 37°E / 01°S, 35°E",
    eyebrow: "Mount Kenya · Maasai Mara",
    region: "Mount Kenya & Maasai Mara",
    tag: "classic",
    nights: 6,
    groupSize: "2–6 guests, private vehicle",
    priceFrom: 3650,
    tier: "Signature Luxury",
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1600&auto=format&fit=crop",
    description:
      "Highland forest and montane wildlife on Mount Kenya's lower slopes, followed by four nights of classic Mara game viewing — a quieter opening before the main event.",
    highlights: [
      "Forest walks and highland game viewing at altitude",
      "Four full game-drive days in the Mara",
      "Single supplement waived for solo travelers in low season",
    ],
  },
  {
    slug: "family-safari-diani-coast",
    title: "Family Safari & Diani Coast",
    coord: "01°S, 35°E / 04°S, 39°E",
    eyebrow: "Maasai Mara · Diani Beach",
    region: "Maasai Mara & Diani Beach",
    tag: "family",
    nights: 9,
    groupSize: "Families, private vehicle",
    priceFrom: 6950,
    tier: "Signature Luxury",
    image:
      "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?q=80&w=1600&auto=format&fit=crop",
    description:
      "Five nights of family-friendly game drives in the Mara, then four nights to decompress on Diani's white sand — paced for children, with a beach villa to finish.",
    highlights: [
      "Family tents with connecting rooms, child-friendly guides",
      "Maasai village visit and junior ranger activities",
      "Four nights at a private beach villa on Diani",
    ],
  },
];

export type PricingTier = {
  name: SafariPackage["tier"];
  nightlyRange: string;
  description: string;
  inclusions: { label: string; included: boolean }[];
};

export const pricingTiers: PricingTier[] = [
  {
    name: "Classic Tented",
    nightlyRange: "$250–$400 / night pp",
    description:
      "Fenced camps with full board, shared game-viewing vehicles, and reliable comfort — ideal for a first safari.",
    inclusions: [
      { label: "Full-board accommodation & park fees", included: true },
      { label: "Shared 4×4 game drives (max 6 guests)", included: true },
      { label: "Road transfers from Nairobi", included: true },
      { label: "Private guide & vehicle", included: false },
      { label: "Domestic flights between parks", included: false },
      { label: "Butler & in-camp spa service", included: false },
    ],
  },
  {
    name: "Signature Luxury",
    nightlyRange: "$450–$900 / night pp",
    description:
      "Our most-booked tier — private vehicles, premier camp locations, and a guide dedicated to your group for the trip.",
    inclusions: [
      { label: "Full-board accommodation & park fees", included: true },
      { label: "Private 4×4 game drives with dedicated guide", included: true },
      { label: "Road transfers from Nairobi", included: true },
      { label: "Private guide & vehicle", included: true },
      { label: "Domestic flights between parks", included: false },
      { label: "Butler & in-camp spa service", included: false },
    ],
  },
  {
    name: "Private Reserve",
    nightlyRange: "$1,000–$2,000+ / night pp",
    description:
      "Exclusive-use conservancy camps, fly-in transfers between parks, and a level of service built around one party at a time.",
    inclusions: [
      { label: "Full-board accommodation & park fees", included: true },
      { label: "Private 4×4 game drives with dedicated guide", included: true },
      { label: "Road transfers from Nairobi", included: true },
      { label: "Private guide & vehicle", included: true },
      { label: "Domestic flights between parks", included: true },
      { label: "Butler & in-camp spa service", included: true },
    ],
  },
];

export const packageFaqs = [
  {
    question: "What's included in the price shown on each package?",
    answer:
      "Every quoted rate covers full-board accommodation, all park and conservancy fees, a private or shared 4×4 with driver-guide as noted, and road or domestic-flight transfers between stops. International flights, the Kenya e-Visa, travel insurance, alcoholic drinks at most camps, gratuities, and optional activities like the hot-air balloon are quoted separately when you enquire.",
  },
  {
    question: "When is the best time to travel?",
    answer:
      "July to October covers the wildebeest migration and the Mara River crossings — book six to nine months out for this window. January to March is warm, dry, and quieter. April to June is the green season: lower rates, fewer guests, and excellent resident game viewing, with the trade-off of afternoon rain.",
  },
  {
    question: "Can these itineraries be customized?",
    answer:
      "Yes — every package on this page is a starting point. We adjust nights per camp, swap in private conservancies, add Diani Beach or Zanzibar on the back end, or rebuild the route entirely around a specific date or budget.",
  },
  {
    question: "How far in advance should we book?",
    answer:
      "For peak migration season (July–October) and any Private Reserve camp, six to twelve months ahead is recommended — the best-located tents sell out first. Classic and Signature tier camps in green season can often be confirmed within four to eight weeks.",
  },
  {
    question: "Is a deposit required to hold the dates?",
    answer:
      "A 30% deposit secures your camp inventory and guide allocation, with the balance due 60 days before arrival. Camps inside private conservancies often require full payment earlier due to limited tent availability.",
  },
];
