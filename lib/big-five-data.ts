export type BigFiveAnimal = {
  name: string;
  latin: string;
  fact: string;
  whereToSpot: string;
  bestTime: string;
  poster: string;
  videoSrc: string;
};

export const bigFive: BigFiveAnimal[] = [
  {
    name: "Lion",
    latin: "Panthera leo",
    fact: "A pride can hold up to fifteen lions, but only the lionesses hunt as one. They fan out at dusk to corner prey the pride will share by rank.",
    whereToSpot: "Maasai Mara, Amboseli, Tsavo",
    bestTime: "Dawn and dusk",
    poster:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1200&auto=format&fit=crop",
    videoSrc: "/lion.mp4",
  },
  {
    name: "African Elephant",
    latin: "Loxodonta africana",
    fact: "The largest land animal on Earth travels in herds led by its oldest female. A matriarch who carries the memory of every waterhole for fifty miles.",
    whereToSpot: "Amboseli, Tsavo, Samburu",
    bestTime: "Early morning",
    poster:
      "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=1200&auto=format&fit=crop",
    videoSrc: "/elephant.mp4",
  },
  {
    name: "Cape Buffalo",
    latin: "Syncerus caffer",
    fact: "Herds run into the hundreds. It's the lone bull, cast out, unpredictable and unafraid of a lion pride, that guides give the widest berth.",
    whereToSpot: "Maasai Mara, Lake Nakuru",
    bestTime: "Midmorning near water",
    poster:
      "https://images.unsplash.com/photo-1704805129310-a263e4a95947?q=80&w=1200&auto=format&fit=crop",
    videoSrc: "/buffalo.mp4",
  },
  {
    name: "Leopard",
    latin: "Panthera pardus",
    fact: "The Big Five's hardest sighting. Solitary and near-invisible against dry bush,it's as likely draped over a branch overhead as moving on the ground.",
    whereToSpot: "Maasai Mara, Samburu",
    bestTime: "Night drives",
    poster:
      "https://images.unsplash.com/photo-1572978965590-7dd074d642c9?q=80&w=1200&auto=format&fit=crop",
    videoSrc: "/leopard.mp4",
  },
  {
    name: "Rhinoceros",
    latin: "Diceros bicornis / Ceratotherium simum",
    fact: "Both black and white rhino were pushed to the edge by poaching.Their steady recovery here is one of Kenya's clearest conservation wins.",
    whereToSpot: "Lake Nakuru National Park",
    bestTime: "Late afternoon",
    poster:
      "https://images.unsplash.com/photo-1523629104117-bd9583d1829b?q=80&w=1200&auto=format&fit=crop",
    videoSrc: "/rhino.mp4",
  },
];
