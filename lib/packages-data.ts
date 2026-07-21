// lib/packages-data.ts
// Kenya-only safari & coastal packages, modeled on real park/camp pricing
// tiers (2026 land-only, twin-share, all-inclusive: private/shared vehicle,
// full board, park fees, road or domestic-flight transfers included;
// international flights, visas, insurance, balloon safaris and gratuities
// excluded). Re-check against current camp rate sheets each season.

export type SafariPackage = {
  slug: string;
  title: string;
  coord: string;
  eyebrow: string;
  region: string;
  tag:
    | "safari"
    | "coastal"
    | "honeymoon"
    | "family"
    | "weekend"
    | "multi-destination";
  nights: number;
  groupSize: string;
  priceFrom: number;
  tier: "Classic Tented" | "Signature Luxury" | "Private Reserve";
  bestSeason: string;
  camps: string;
  image: string;
  description: string;
  highlights: string[];
};

export const packageFilters: {
  label: string;
  value: SafariPackage["tag"] | "all";
}[] = [
  { label: "All Packages", value: "all" },
  { label: "Safari", value: "safari" },
  { label: "Coastal", value: "coastal" },
  { label: "Multi-Destination", value: "multi-destination" },
  { label: "Honeymoon", value: "honeymoon" },
  { label: "Family", value: "family" },
  { label: "Weekend Getaway", value: "weekend" },
];

// Used by Navbar.tsx for the destinations mega-menu. Each link points to
// the matching package's anchor on /packages so the menu is functional
// immediately, not just decorative.
export const destinationGroups: {
  title: string;
  links: { label: string; href: string }[];
}[] = [
  {
    title: "Safari & Savannah",
    links: [
      { label: "Maasai Mara", href: "/packages#classic-mara-migration" },
      { label: "Amboseli", href: "/packages#amboseli-elephant-safari" },
      { label: "Samburu", href: "/packages#samburu-special-five-safari" },
      { label: "Tsavo", href: "/packages#tsavo-red-earth-safari" },
    ],
  },
  {
    title: "Coastal Escapes",
    links: [
      { label: "Diani Beach", href: "/packages#diani-beach-retreat" },
      { label: "Watamu & Malindi", href: "/packages#watamu-malindi-coast" },
    ],
  },
  {
    title: "Highlands & Lakes",
    links: [
      { label: "Mount Kenya", href: "/packages#highlands-mara-safari" },
      { label: "Lake Naivasha", href: "/packages#rift-valley-mara-explorer" },
      { label: "Lake Nakuru", href: "/packages#nakuru-rhino-weekend" },
    ],
  },
];

export const packages: SafariPackage[] = [
  {
    slug: "classic-mara-migration",
    title: "Classic Mara Migration Safari",
    coord: "01°S, 35°E",
    eyebrow: "Maasai Mara",
    region: "Maasai Mara National Reserve",
    tag: "safari",
    nights: 4,
    groupSize: "2–6 guests, private vehicle",
    priceFrom: 2450,
    tier: "Signature Luxury",
    bestSeason: "Best July–October, for the river crossings",
    camps: "Tented camps in the Mara North or Olare conservancies",
    image:
      // "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1564101160531-4838e8a5f4e7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Four nights inside the Mara ecosystem, timed for the wildebeest crossings and built around a single, well-chosen camp rather than a string of one-night stops.",
    highlights: [
      "Private guide and 4×4 for every game drive",
      "Riverine tented camp on the Mara's edge",
      "Optional sunrise balloon safari with champagne breakfast",
    ],
  },
  {
    slug: "amboseli-elephant-safari",
    title: "Amboseli Elephant & Kilimanjaro Safari",
    coord: "02°S, 37°E",
    eyebrow: "Amboseli",
    region: "Amboseli National Park",
    tag: "safari",
    nights: 3,
    groupSize: "2–6 guests, private vehicle",
    priceFrom: 1850,
    tier: "Signature Luxury",
    bestSeason: "Best June–October & January–February, clearest skies",
    camps: "Lodges and tented camps on the park's swamp edge",
    image:
      "https://images.unsplash.com/photo-1670092873465-d00ecd79c3d6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Three nights with Africa's largest elephant herds, photographed against Kilimanjaro's snowcap on the rare clear mornings the park is known for.",
    highlights: [
      "Sunrise game drive facing Kilimanjaro",
      "Maasai-led nature walk on the park's edge",
      "Private guide and 4×4 for the full stay",
    ],
  },
  {
    slug: "tsavo-red-earth-safari",
    title: "Tsavo Red Earth Safari",
    coord: "03°S, 38°E",
    eyebrow: "Tsavo East & West",
    region: "Tsavo East & Tsavo West National Parks",
    tag: "safari",
    nights: 3,
    groupSize: "2–6 guests, private vehicle",
    priceFrom: 1450,
    tier: "Classic Tented",
    bestSeason: "Best June–October, dry-season waterhole viewing",
    camps: "Waterhole-facing tented camps in Tsavo East",
    image:
      "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=1600&auto=format&fit=crop",
    description:
      "Kenya's largest park, at a gentler price point than the Mara — red-dust elephants, the Mzima Springs hippo pools, and far fewer vehicles at every sighting.",
    highlights: [
      "Tent overlooking a natural waterhole",
      "Mzima Springs underwater hippo-viewing chamber",
      "Lower park fees than the Mara, more nights for the price",
    ],
  },
  {
    slug: "samburu-special-five-safari",
    title: "Samburu Special Five Safari",
    coord: "00°N, 37°E",
    eyebrow: "Samburu",
    region: "Samburu National Reserve",
    tag: "safari",
    nights: 3,
    groupSize: "2–6 guests, private vehicle",
    priceFrom: 1950,
    tier: "Signature Luxury",
    bestSeason: "Best June–October, when herds gather on the Ewaso Nyiro",
    camps: "Riverside camps such as Saruni Samburu & Elephant Bedroom Camp",
    image:
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1600&auto=format&fit=crop",
    description:
      "Kenya's semi-arid north, and the only place to find the Samburu Special Five — Grevy's zebra, reticulated giraffe, gerenuk, Beisa oryx, and Somali ostrich — in one reserve.",
    highlights: [
      "Grevy's zebra and reticulated giraffe, found nowhere else",
      "Riverside camp on the Ewaso Nyiro",
      "Optional Samburu cultural visit included",
    ],
  },
  {
    slug: "escarpment-honeymoon-retreat",
    title: "Private Mara Escarpment Honeymoon",
    coord: "01°S, 35°E",
    eyebrow: "Maasai Mara Escarpment",
    region: "Mara North Conservancy",
    tag: "honeymoon",
    nights: 5,
    groupSize: "2 guests, exclusive-use vehicle",
    priceFrom: 4250,
    tier: "Private Reserve",
    bestSeason: "Year-round; quietest in the April–June green season",
    camps: "Private-tent conservancy camps on the Mara escarpment",
    image:
      // "https://images.unsplash.com/photo-1535941339077-2dc1c25d36d5?q=80&w=1600&auto=format&fit=crop",
      "https://www.masaimara.travel/images/kenya-honeymoon-safaris.jpg",
    description:
      "A private tent on the Mara escarpment, an exclusive-use vehicle for the length of the stay, and a schedule built entirely around the two of you.",
    highlights: [
      "Exclusive-use vehicle and guide, no shared drives",
      "Private bush dinner under the escarpment cliffs",
      "Couples' spa tent and in-room champagne on arrival",
    ],
  },
  {
    slug: "diani-beach-retreat",
    title: "Diani Beach Retreat",
    coord: "04°S, 39°E",
    eyebrow: "Diani Beach",
    region: "Diani Beach, South Coast",
    tag: "coastal",
    nights: 4,
    groupSize: "2–6 guests",
    priceFrom: 1380,
    tier: "Signature Luxury",
    bestSeason: "Best December–March & July–September, driest months",
    camps: "Beachfront resorts and private villas along Diani's white sand",
    image:
      "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?q=80&w=1600&auto=format&fit=crop",
    description:
      "Four nights to decompress after the bush, or a standalone coastal escape — white sand, the Kongo Mosque ruins nearby, and the reef just offshore for snorkeling and dhow sailing.",
    highlights: [
      "Private beachfront room or villa, full board",
      "Sunset dhow sail along the South Coast reef",
      "Easily paired with any Mara or Tsavo safari above",
    ],
  },
  {
    slug: "watamu-malindi-coast",
    title: "Watamu & Malindi Swahili Coast",
    coord: "03°S, 40°E",
    eyebrow: "Watamu · Malindi",
    region: "Watamu & Malindi, North Coast",
    tag: "coastal",
    nights: 4,
    groupSize: "2–6 guests",
    priceFrom: 1280,
    tier: "Classic Tented",
    bestSeason: "Best December–March & July–September, driest months",
    camps: "Boutique beach hotels in Watamu Marine National Park",
    image:
      "https://images.scottdunn.com/c_fill,f_auto,q_auto,h_450,w_620/east-africa/watamu/803409-watamu.jpeg",
    description:
      "Kenya's old Swahili coast — coral gardens inside Watamu Marine Park, the Gede ruins a short drive inland, and the slower pace of Malindi's older seafront.",
    highlights: [
      "Snorkeling inside Watamu Marine National Park",
      "Guided tour of the Gede ruins",
      "Quieter and lower-priced than Diani's main strip",
    ],
  },
  {
    slug: "rift-valley-mara-explorer",
    title: "Rift Valley & Mara Explorer",
    coord: "00°S, 36°E",
    eyebrow: "Naivasha · Maasai Mara",
    region: "Lake Naivasha & Maasai Mara",
    tag: "multi-destination",
    nights: 6,
    groupSize: "2–6 guests, private vehicle",
    priceFrom: 3890,
    tier: "Signature Luxury",
    bestSeason: "Best July–October for the Mara leg",
    camps: "Lakeside lodge at Naivasha, tented camp in the Mara",
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
    slug: "nakuru-rhino-weekend",
    title: "Lake Nakuru Rhino Weekend",
    coord: "00°S, 36°E",
    eyebrow: "Lake Nakuru",
    region: "Lake Nakuru National Park",
    tag: "weekend",
    nights: 2,
    groupSize: "2–6 guests, private vehicle",
    priceFrom: 780,
    tier: "Classic Tented",
    bestSeason: "Year-round; a two-hour drive from Nairobi",
    camps: "Lakeshore lodges inside the national park",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/49/White_Rhino_in_Lake_Nakuru_3.jpg",
    description:
      "A short break for a long weekend — both black and white rhino, regular leopard sightings in the euphorbia forest, and a two-hour drive each way from Nairobi.",
    highlights: [
      "Both black and white rhino in a fenced sanctuary",
      "Two-hour drive from Nairobi — no flight needed",
      "Ideal as a standalone weekend or add-on before the Mara",
    ],
  },
  {
    slug: "highlands-mara-safari",
    title: "Mount Kenya Highlands & Mara",
    coord: "00°N, 37°E / 01°S, 35°E",
    eyebrow: "Mount Kenya · Maasai Mara",
    region: "Mount Kenya & Maasai Mara",
    tag: "multi-destination",
    nights: 6,
    groupSize: "2–6 guests, private vehicle",
    priceFrom: 3650,
    tier: "Signature Luxury",
    bestSeason: "Best July–October for the Mara leg",
    camps: "Forest lodge on Mount Kenya, tented camp in the Mara",
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2400&auto=format&fit=crop",
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
    bestSeason: "Best during Kenyan & UK school holidays",
    camps: "Family tents in the Mara, beach villa on Diani",
    image:
      "/Family.jpg",
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
    nightlyRange: "$200–$350 / night pp",
    description:
      "Fenced or waterhole-facing camps with full board, shared game-viewing vehicles, and reliable comfort — ideal for Tsavo, Nakuru, or a first safari.",
    inclusions: [
      { label: "Full-board accommodation & park fees", included: true },
      { label: "Shared 4×4 game drives (max 6 guests)", included: true },
      { label: "Road transfers from Nairobi", included: true },
      { label: "Private guide & vehicle", included: false },
      { label: "Domestic flights between destinations", included: false },
      { label: "Butler & in-camp spa service", included: false },
    ],
  },
  {
    name: "Signature Luxury",
    nightlyRange: "$400–$800 / night pp",
    description:
      "Our most-booked tier — private vehicles, premier camp locations across the Mara, Amboseli, Samburu, or the coast, with a guide dedicated to your group.",
    inclusions: [
      { label: "Full-board accommodation & park fees", included: true },
      { label: "Private 4×4 game drives with dedicated guide", included: true },
      { label: "Road transfers from Nairobi", included: true },
      { label: "Private guide & vehicle", included: true },
      { label: "Domestic flights between destinations", included: false },
      { label: "Butler & in-camp spa service", included: false },
    ],
  },
  {
    name: "Private Reserve",
    nightlyRange: "$900–$2,000+ / night pp",
    description:
      "Exclusive-use conservancy camps, fly-in transfers between parks, and a level of service built around one party at a time.",
    inclusions: [
      { label: "Full-board accommodation & park fees", included: true },
      { label: "Private 4×4 game drives with dedicated guide", included: true },
      { label: "Road transfers from Nairobi", included: true },
      { label: "Private guide & vehicle", included: true },
      { label: "Domestic flights between destinations", included: true },
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
    question: "Why is the Mara more expensive than Tsavo or Samburu?",
    answer:
      "Mostly park fees — the Maasai Mara reserve fee runs well above what Tsavo or Samburu charge, and the best Mara camps sit inside private conservancies with their own conservancy fee on top. Tsavo and Samburu offer comparable wildlife density at a noticeably lower nightly rate, which is why we route first-time, budget-conscious travelers there.",
  },
  {
    question: "When is the best time to travel?",
    answer:
      "July to October covers the wildebeest migration and the Mara River crossings — book six to nine months out for this window. January to March is warm, dry, and quieter across the parks. April to June is the green season: lower rates, fewer guests, and excellent resident game viewing, with the trade-off of afternoon rain.",
  },
  {
    question: "Can these itineraries be customized or combined?",
    answer:
      "Yes — every package on this page is a starting point. We adjust nights per camp, swap in private conservancies, combine a safari with Diani or Watamu on the back end, or rebuild the route entirely around a specific date or budget.",
  },
  {
    question: "Is a deposit required to hold the dates?",
    answer:
      "A 30% deposit secures your camp inventory and guide allocation, with the balance due 60 days before arrival. Camps inside private conservancies often require full payment earlier due to limited tent availability.",
  },
];
