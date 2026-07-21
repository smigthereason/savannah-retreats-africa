import Link from "next/link";
import Image from "next/image";

const PREVIEW_CARDS = [
  {
    title: "Mountains",
    caption: "Mount Kenya's glaciers to a Rift Valley crater-rim day hike.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/This_is_Thomson-Batian-Nelion-MT.kenya.jpg/960px-This_is_Thomson-Batian-Nelion-MT.kenya.jpg",
  },
  {
    title: "Hills",
    caption: "The Aberdare Range, Chyulu Hills, and the Ngong ridgeline.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Gura_Giant_Falls_view_from_the_top_of_Karuru_Falls.jpg/960px-Gura_Giant_Falls_view_from_the_top_of_Karuru_Falls.jpg",
  },
  {
    title: "Forests",
    caption: "Rainforest birdwatching to an urban escape inside Nairobi.",
    image:
      "https://images.unsplash.com/photo-1647089395036-d1e77fc1013e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "National Parks",
    caption: "Lake Nakuru's flamingos, Hell's Gate's gorges, and more.",
    image:
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function DiscoverTeaser() {
  return (
    <section className="bg-sand w-full">
      <div className="section-pad mx-auto max-w-8xl py-20 md:py-28">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">Beyond the Safari Circuit</span>
            <h2 className="mt-4 max-w-lg font-display text-4xl text-umber md:text-5xl">
              Discover Kenya
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink">
              Mountains, hills, forests, and lesser-known parks — the rest
              of the country, for travelers who want more than the
              game-drive circuit alone.
            </p>
          </div>
          <Link href="/discover" className="btn-ochre shrink-0">
            Explore Discover Kenya
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PREVIEW_CARDS.map((card) => (
            <Link
              key={card.title}
              href="/discover"
              className="group relative block aspect-[3/4] overflow-hidden"
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-umber/90 via-umber/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-xl text-linen">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-linen/80">
                  {card.caption}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
