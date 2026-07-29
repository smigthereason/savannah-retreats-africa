// Placeholder content, same convention as lib/data.ts — structured so
// it can be swapped for Sanity-fetched data later.
//
// `videoSrc` is deliberately left undefined for every entry — no real
// video footage exists yet. The component gracefully falls back to a
// static poster image when videoSrc is missing, so this ships safely
// today and upgrades automatically the moment real clips are hosted
// somewhere and their URLs added here. Do not point videoSrc at a
// third-party/stock video URL without confirming its license first —
// video licensing is generally stricter than the photo licensing
// already documented at /credits.
//
// Poster images ARE real and verified (fetched directly from Unsplash,
// not recalled from memory) — two of them are genuinely Kenya-located
// shots (leopard: Masai Mara, rhino: Lake Nakuru National Park).

export type BigFiveAnimal = {
  name: string;
  fact: string;
  whereToSpot: string;
  poster: string;
  videoSrc?: string;
};

export const bigFive: BigFiveAnimal[] = [
  {
    name: "Lion",
    fact: "Africa's apex predator, living in prides of up to fifteen — most active at dawn and dusk, when the heat breaks.",
    whereToSpot: "Maasai Mara, Amboseli, Tsavo",
    poster:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "African Elephant",
    fact: "Earth's largest land mammal, led by the oldest and most experienced female in a tight-knit matriarchal herd.",
    whereToSpot: "Amboseli, Tsavo, Samburu",
    poster:
      "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Cape Buffalo",
    fact: "Often called the most unpredictable of the Big Five — herds can number in the hundreds, and a lone bull is one of Africa's most respected animals to encounter on foot.",
    whereToSpot: "Maasai Mara, Lake Nakuru",
    poster:
      "https://images.unsplash.com/photo-1704805129310-a263e4a95947?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Leopard",
    fact: "The most elusive Big Five sighting — solitary, superbly camouflaged, and as likely to be resting in a tree overhead as on the ground.",
    whereToSpot: "Maasai Mara, Samburu",
    poster:
      "https://images.unsplash.com/photo-1572978965590-7dd074d642c9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Rhinoceros",
    fact: "Both black and white rhino are genuine conservation success stories in Kenya, recovering steadily after being pushed to the edge by poaching.",
    whereToSpot: "Lake Nakuru National Park",
    poster:
      "https://images.unsplash.com/photo-1523629104117-bd9583d1829b?q=80&w=1200&auto=format&fit=crop",
  },
];
