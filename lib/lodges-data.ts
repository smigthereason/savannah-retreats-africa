// lib/lodges-data.ts
// Fictional, in-house Savannah Retreats Africa properties (not third-party
// brand names) so the site isn't implying partnership with real camps.
// Nightly rates are per person, twin-share, full board — 2026 estimates
// in the same Classic Tented / Signature Luxury / Private Reserve bands
// used on the packages page. Re-check against real camp inventory before
// this goes live.

export type Lodge = {
  slug: string;
  name: string;
  coord: string;
  eyebrow: string;
  region: string;
  category: "Tented Camp" | "Lodge" | "Private Villa";
  tier: "Classic Tented" | "Signature Luxury" | "Private Reserve";
  rooms: string;
  priceFromPerNight: number;
  signature: string;
  image: string;
  description: string;
  amenities: string[];
};

export const lodgeFilters: {
  label: string;
  value: Lodge["category"] | "all";
}[] = [
  { label: "All Properties", value: "all" },
  { label: "Tented Camps", value: "Tented Camp" },
  { label: "Lodges", value: "Lodge" },
  { label: "Private Villas", value: "Private Villa" },
];

export const lodges: Lodge[] = [
  {
    slug: "ol-kanjau-tented-camp",
    name: "Ol Kanjau Tented Camp",
    coord: "01°S, 35°E",
    eyebrow: "Mara North Conservancy",
    region: "Maasai Mara",
    category: "Tented Camp",
    tier: "Private Reserve",
    rooms: "8 tents, 16 guests",
    priceFromPerNight: 850,
    signature:
      "Decks cantilevered over the river — the sound of the water replaces a turn-down service.",
    image:
      "https://images.unsplash.com/photo-1741850821150-58b56e0e6156?q=80&w=1600&auto=format&fit=crop",
    description:
      "Eight tents strung along a river bend inside a private conservancy, each with its own deck and plunge pool. No fences, no shared drives — just one camp's worth of guests on several thousand acres.",
    amenities: [
      "Private plunge pool on every tent deck",
      "Exclusive-use 4×4 and dedicated guide per tent",
      "Sundowner bar set up wherever the day's drive ends",
    ],
  },
  {
    slug: "olarro-private-house",
    name: "Olarro Private House",
    coord: "01°S, 35°E",
    eyebrow: "Mara North Conservancy",
    region: "Maasai Mara",
    category: "Private Villa",
    tier: "Private Reserve",
    rooms: "4 bedrooms, sleeps 8",
    priceFromPerNight: 1200,
    signature:
      "Booked as a whole house — your own chef, vehicle, and guide, with no other guests on the property.",
    image:
      "https://images.unsplash.com/photo-1757777598981-2a589811168d?q=80&w=1600&auto=format&fit=crop",
    description:
      "A four-bedroom house on a private escarpment plot, taken as a single exclusive-use booking. Built for families or groups who want the Mara without sharing a single meal, vehicle, or view with anyone outside their party.",
    amenities: [
      "Whole-property exclusive use — no other guests",
      "Private chef, butler, and two dedicated vehicles",
      "Infinity pool facing the Mara escarpment",
    ],
  },
  {
    slug: "kibo-view-lodge",
    name: "Kibo View Lodge",
    coord: "02°S, 37°E",
    eyebrow: "Amboseli National Park",
    region: "Amboseli",
    category: "Lodge",
    tier: "Signature Luxury",
    rooms: "24 rooms",
    priceFromPerNight: 480,
    signature:
      "Kilimanjaro fills the window of every room on the clear mornings the park is known for.",
    image:
      // TODO: placeholder — swap for a verified Amboseli/Kilimanjaro photo before launch
      "https://images.unsplash.com/photo-1757777598981-2a589811168d?q=80&w=1600&auto=format&fit=crop",
    description:
      "A low-slung lodge on Amboseli's swamp edge, positioned so the mountain is the first thing you see from bed. Built for the elephant herds at ground level and Kilimanjaro at every other angle.",
    amenities: [
      "Kilimanjaro-facing rooms with private verandas",
      "Swamp-edge pool used by elephants most evenings",
      "In-room telescope for stargazing",
    ],
  },
  {
    slug: "ewaso-rapids-camp",
    name: "Ewaso Rapids Camp",
    coord: "00°N, 37°E",
    eyebrow: "Samburu National Reserve",
    region: "Samburu",
    category: "Tented Camp",
    tier: "Signature Luxury",
    rooms: "12 tents",
    priceFromPerNight: 420,
    signature:
      "Pitched on a bend of the Ewaso Nyiro, close enough that crocodiles are visible from the dining tent.",
    image:
      "/ewuaso.jpg",
    description:
      "Twelve tents under riverine fever trees, in the only reserve where the Samburu Special Five gather in one place. Elephants cross the river in front of camp most afternoons.",
    amenities: [
      "Riverfront tents with private verandas",
      "Open-sided dining tent over the water",
      "Samburu cultural visit arranged on request",
    ],
  },
  {
    slug: "salt-lick-safari-lodge",
    name: "Salt Lick Safari Lodge",
    coord: "03°S, 38°E",
    eyebrow: "Tsavo West National Park",
    region: "Tsavo",
    category: "Tented Camp",
    tier: "Signature Luxury",
    rooms: "10 rooms",
    priceFromPerNight: 260,
    signature:
      "Built directly around a natural waterhole — game viewing starts from the breakfast table.",
    image:
      "/Tsavo-west.webp",
    description:
      "A classic tented camp facing one of Tsavo's busiest waterholes, with the comfort of a fenced perimeter and the price advantage of a park with lower fees than the Mara.",
    amenities: [
      "Waterhole-facing tents and dining deck",
      "Fenced grounds, swimming pool",
      "Lower park fees than Mara-based camps of the same standard",
    ],
  },
  {
    slug: "crescent-bay-lodge",
    name: "Crescent Bay Lodge",
    coord: "04°S, 39°E",
    eyebrow: "Diani Beach",
    region: "Diani",
    category: "Lodge",
    tier: "Signature Luxury",
    rooms: "30 rooms",
    priceFromPerNight: 310,
    signature:
      "An infinity pool set flush with the horizon, so the Indian Ocean and the water in front of you are the same blue.",
    image:
      "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?q=80&w=1600&auto=format&fit=crop",
    description:
      "A beachfront lodge on Diani's white sand, built as the coastal half of a Mara-plus-beach itinerary or a standalone escape. Every room opens onto the same stretch of reef-protected water.",
    amenities: [
      "Beachfront rooms, private balconies",
      "Horizon-edge infinity pool",
      "Dhow sailing and reef snorkeling arranged on-site",
    ],
  },
  {
    slug: "turtle-bay-retreat",
    name: "Turtle Bay Retreat",
    coord: "03°S, 40°E",
    eyebrow: "Watamu Marine National Park",
    region: "Watamu & Malindi",
    category: "Lodge",
    tier: "Classic Tented",
    rooms: "20 rooms",
    priceFromPerNight: 190,
    signature:
      "Steps from the marine park's coral gardens, at the quieter, lower-priced end of the coast.",
    image:
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1600&auto=format&fit=crop",
    description:
      "A boutique beach lodge on the old Swahili coast, walking distance from Watamu Marine Park's coral gardens and a short drive from the Gede ruins.",
    amenities: [
      "Marine-park snorkeling steps from the beach",
      "Garden pool and shaded beachfront bar",
      "Lower nightly rate than Diani's main strip",
    ],
  },
  {
    slug: "great-rift-valley-lodge",
    name: "Great Rift Valley Lodge",
    coord: "00°S, 36°E",
    eyebrow: "Lake Naivasha",
    region: "Naivasha",
    category: "Lodge",
    tier: "Signature Luxury",
    rooms: "10 rooms",
    priceFromPerNight: 260,
    signature:
      "Hippos grunt past the lawn most evenings — included in the room rate, whether you asked for it or not.",
    image:
      "/Great-Rift-Valley-Lodge.jpg",
    description:
      "A ten-room lakeside lodge used as the Rift Valley stop on the road down to the Mara, or as a quiet weekend on its own — boat safaris, flamingos, and acacia forest walks.",
    amenities: [
      "Private jetty and lake boat safaris",
      "Lawn-front rooms facing the water",
      "Two-hour drive from Nairobi, no flight needed",
    ],
  },
  {
    slug: "castle-forest-lodge",
    name: "Castle Forest Lodge",
    coord: "00°N, 37°E",
    eyebrow: "Mount Kenya",
    region: "Mount Kenya",
    category: "Lodge",
    tier: "Classic Tented",
    rooms: "18 rooms",
    priceFromPerNight: 220,
    signature:
      "Treehouse-style rooms in the montane forest canopy, with a waterhole lit for night viewing below.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Mt_Kenya_Castle_Lodge.jpg/960px-Mt_Kenya_Castle_Lodge.jpg",
    description:
      "Raised forest rooms on Mount Kenya's lower slopes, built around a floodlit waterhole that draws elephant and buffalo through the night. A quieter, cooler opening to a longer Kenya itinerary.",
    amenities: [
      "Raised forest rooms with private balconies",
      "Floodlit waterhole, viewable from the lounge after dark",
      "Guided forest walks included",
    ],
  },
];

export type LodgeCategoryInfo = {
  category: Lodge["category"];
  tagline: string;
  description: string;
  bestFor: string;
};

export const lodgeCategories: LodgeCategoryInfo[] = [
  {
    category: "Tented Camp",
    tagline: "Canvas walls, hard floors, real comfort",
    description:
      "Walk-in canvas tents with proper beds, en-suite bathrooms, and a deck — usually the closest you'll sleep to the wildlife itself.",
    bestFor:
      "Best for travelers who want the classic safari feeling without giving up a real bed.",
  },
  {
    category: "Lodge",
    tagline: "Permanent rooms, more infrastructure",
    description:
      "Built structures with pools, larger dining areas, and steadier power and water — the most reliable option for longer or family stays.",
    bestFor:
      "Best for families, longer stays, or anyone prioritizing consistency over canvas.",
  },
  {
    category: "Private Villa",
    tagline: "The whole property, just your party",
    description:
      "An entire house or camp taken on exclusive-use terms — your own staff, vehicle, and schedule, with no other guests on the property.",
    bestFor:
      "Best for groups, multi-generational families, or anyone who wants zero shared spaces.",
  },
];

export const lodgeFaqs = [
  {
    question:
      "What's the difference between a camp's nightly rate and a package price?",
    answer:
      "The package prices on the Safari Packages page bundle several nights, transfers, and park fees into one itinerary. The nightly rates here are the building blocks — useful if you already know your route and want to compare specific properties, or extend a package by a night or two at a particular camp.",
  },
  {
    question: "Is there electricity and wifi at the tented camps?",
    answer:
      "Yes at every property listed here, though tented camps typically run on solar with generator backup, and wifi is usually limited to the dining and lounge areas rather than in every tent. Lodges have steadier power and broader coverage. We'll flag any exceptions when you book.",
  },
  {
    question: "Do you offer exclusive-use bookings at camps other than Olarro?",
    answer:
      "Most of the tented camps on this page can be booked exclusive-use for a full buy-out rate if your group is large enough to fill them — ask when you enquire and we'll quote the whole-camp rate against the per-room total.",
  },
  {
    question: "Are these properties suitable for children?",
    answer:
      "Lodges generally have a minimum age policy of 6 and up due to open-plan tents and proximity to wildlife corridors; villas and lodge family rooms are the more flexible option for younger children. Tell us the ages when you enquire and we'll point you to properties without restrictions.",
  },
  {
    question: "Is malaria prophylaxis required at all of these locations?",
    answer:
      "Yes — all of the regions on this page sit in malaria zones, including the coast and the highlands. Antimalarial medication is recommended regardless of which property you choose; consult your GP before departure.",
  },
];
