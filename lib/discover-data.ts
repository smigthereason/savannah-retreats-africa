// Placeholder content, same convention as lib/data.ts / lib/culture-data.ts —
// structured so it can be swapped for Sanity-fetched data later.
//
// `nearbyStay` is deliberately conservative: it only names a lodge from
// lib/lodges-data.ts when that lodge's own `region` genuinely matches
// or sits directly adjacent to the destination. Everywhere else it's
// left `null` and the component renders "Lodge partners for this area
// — coming soon" rather than inventing a name. Do not fill these in
// with fabricated lodge/camp names — replace with real confirmed
// partners as they're signed.

export type DiscoverEntry = {
  name: string;
  region: string;
  description: string;
  activities: string[];
  nearbyStay: { name: string; slug: string } | null;
  note?: string;
};

export const discoverIntro = {
  eyebrow: "Beyond the Safari Circuit",
  headline: "All of Kenya, Not Just the Mara",
  coord: "01°S, 38°E · Kenya",
  paragraphs: [
    "Kenya's safari parks get top billing for good reason, but they're one layer of a much bigger country — glaciated peaks two degrees south of the equator, highland forest an hour from the capital, and volcanic hill ranges most visitors never hear about.",
    "This is the rest of it: the mountains, hills, forests, and lesser-known parks worth building a day or two around, whether that means a crater-rim hike, a rainforest birdwatching walk, or a night in a tree-hotel watching a waterhole by spotlight.",
  ],
};

export const mountains: DiscoverEntry[] = [
  {
    name: "Mount Kenya",
    region: "Central Highlands",
    description:
      "Africa's second-highest peak and a UNESCO World Heritage Site — glaciated summits despite sitting almost on the equator, with forest, bamboo, moorland, and alpine zones stacked on the way up.",
    activities: [
      "Multi-day trekking to Point Lenana",
      "Shorter day hikes on the lower forest trails",
      "Technical climbing on the higher peaks (Batian, Nelion)",
      "Birdwatching and highland forest walks",
    ],
    nearbyStay: { name: "Kirinyaga Forest Lodge", slug: "kirinyaga-forest-lodge" },
  },
  {
    name: "Mount Longonot",
    region: "Rift Valley, near Naivasha",
    description:
      "A dormant volcano close enough to Nairobi for a day trip, with one of the most accessible crater-rim hikes in the country and zebra and giraffe often grazing the lower slopes on the way up.",
    activities: [
      "Crater rim day hike",
      "Wildlife spotting on the approach trail",
      "Photography — sweeping Rift Valley views from the rim",
    ],
    nearbyStay: { name: "Rift Valley Lakehouse", slug: "rift-valley-lakehouse" },
  },
  {
    name: "Mount Elgon",
    region: "Western Kenya, Kenya–Uganda border",
    description:
      "An extinct shield volcano with one of Africa's largest calderas — far quieter than Mount Kenya, known for caves elephants have mined for minerals for generations and dramatic waterfalls.",
    activities: [
      "Multi-day trekking",
      "Cave exploration (Kitum Cave)",
      "Waterfall hikes",
      "Birdwatching",
    ],
    nearbyStay: null,
    note: "No confirmed lodge partner in this area yet.",
  },
];

export const hills: DiscoverEntry[] = [
  {
    name: "Aberdare Range",
    region: "Central Highlands, near Nyeri",
    description:
      "Misted highland forest and moorland famous for its tree-hotels — lodges built on stilts or platforms overlooking a floodlit waterhole, so game viewing continues after dark.",
    activities: [
      "Waterfall hikes (Karuru Falls)",
      "Trout fishing in mountain streams",
      "Moorland hiking on the higher ground",
      "Night game-viewing from a tree-hotel deck",
    ],
    nearbyStay: null,
    note: "Activity list pending final confirmation — client flagged this needs a direct check before publishing.",
  },
  {
    name: "Ngong Hills",
    region: "Just outside Nairobi",
    description:
      "The seven-peak ridgeline visible from the capital on a clear day, immortalized in Karen Blixen's Out of Africa — a wind-farm-topped ridge walk with Rift Valley views on one side and Nairobi's skyline on the other.",
    activities: [
      "Ridge-line hiking",
      "Horseback riding (Karen area)",
      "Photography and picnicking",
    ],
    nearbyStay: null,
    note: "No confirmed lodge partner in this area yet.",
  },
  {
    name: "Chyulu Hills",
    region: "Between Tsavo East & Tsavo West",
    description:
      "A young volcanic range Hemingway wrote into The Green Hills of Africa — rolling grassland ridges, lava-tube caves, and some of the least-visited, most unspoiled scenery on the safari circuit.",
    activities: [
      "Horseback safaris",
      "Hiking the ridgeline",
      "Lava tube cave exploration",
      "Game viewing on the lower slopes",
    ],
    nearbyStay: { name: "Sable Springs Camp", slug: "sable-springs-camp" },
  },
];

export const forests: DiscoverEntry[] = [
  {
    name: "Karura Forest",
    region: "Nairobi",
    description:
      "An urban forest inside the capital, saved from development by Nobel laureate Wangari Maathai's Green Belt Movement — waterfalls, cycling and running trails, and caves, all a short drive from downtown Nairobi.",
    activities: [
      "Cycling and running trails",
      "Waterfall visits",
      "Guided nature walks",
      "Picnicking",
    ],
    nearbyStay: null,
    note: "No confirmed lodge partner — this is a day-visit destination for guests based in Nairobi.",
  },
  {
    name: "Kakamega Forest",
    region: "Western Kenya",
    description:
      "Kenya's only true tropical rainforest, the easternmost remnant of the Guineo-Congolian forest belt — exceptional birdwatching (over 300 species recorded) and primates rarely seen elsewhere in the country.",
    activities: [
      "Guided birdwatching walks",
      "Primate spotting (colobus monkeys)",
      "Night walks",
    ],
    nearbyStay: null,
    note: "No confirmed lodge partner in this area yet.",
  },
  {
    name: "Arabuko-Sokoke Forest",
    region: "Coast, near Watamu",
    description:
      "The largest remaining stretch of coastal forest in East Africa — home to species found almost nowhere else, including the Sokoke scops owl and the golden-rumped elephant shrew.",
    activities: [
      "Guided birdwatching walks",
      "Nature trails",
      "Rare-species spotting with a local guide",
    ],
    nearbyStay: { name: "Turtle Bay Retreat", slug: "turtle-bay-retreat" },
  },
];

export const nationalParksAndReserves: DiscoverEntry[] = [
  {
    name: "Aberdare National Park",
    region: "Central Highlands",
    description:
      "The protected high-altitude core of the Aberdare Range — rainforest and moorland, black rhino, bongo antelope, and one of Kenya's tallest waterfalls.",
    activities: [
      "Game drives",
      "Tree-hotel night viewing",
      "Waterfall hikes",
    ],
    nearbyStay: null,
  },
  {
    name: "Lake Nakuru National Park",
    region: "Rift Valley",
    description:
      "A Rift Valley soda lake historically famous for enormous flamingo flocks (numbers shift with water levels year to year), now also a dedicated black and white rhino sanctuary with a strong leopard population.",
    activities: [
      "Game drives",
      "Birdwatching",
      "Rhino tracking",
    ],
    nearbyStay: null,
    note: "No confirmed lodge partner in this area yet.",
  },
  {
    name: "Nairobi National Park",
    region: "Nairobi",
    description:
      "The only national park inside a capital city anywhere in the world — lions, rhino, and giraffe grazing with the Nairobi skyline as a backdrop, a genuine safari a fifteen-minute drive from downtown.",
    activities: [
      "Half-day and full-day game drives",
      "Photography (skyline backdrop shots)",
      "Nearby: Sheldrick Wildlife Trust elephant orphanage",
    ],
    nearbyStay: null,
    note: "No confirmed lodge partner — typically visited as a day safari from a Nairobi stay rather than an overnight.",
  },
  {
    name: "Hell's Gate National Park",
    region: "Rift Valley, near Naivasha",
    description:
      "One of the only parks in Kenya where visitors can cycle and hike freely among wildlife — dramatic gorges, towering rock columns, and geothermal steam vents. Said to have partly inspired the visual landscape of Disney's The Lion King.",
    activities: [
      "Cycling through the park",
      "Gorge hiking",
      "Rock climbing",
    ],
    nearbyStay: { name: "Rift Valley Lakehouse", slug: "rift-valley-lakehouse" },
  },
  {
    name: "Meru National Park",
    region: "Eastern Kenya",
    description:
      "Lush, well-watered, and far less visited than the Mara or Amboseli — the setting for Elsa the lioness in Born Free, with a genuine sense of having the park to yourself.",
    activities: [
      "Game drives",
      "Riverine walks",
      "Birdwatching",
    ],
    nearbyStay: null,
    note: "No confirmed lodge partner in this area yet.",
  },
];
