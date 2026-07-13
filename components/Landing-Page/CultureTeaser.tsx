import Link from "next/link";
import Image from "next/image";

const PREVIEW_CARDS = [
  {
    title: "47 Tribes",
    caption: "Kikuyu farmers, Maasai pastoralists, Swahili traders — and 44 more.",
    image:
      "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Matatu Culture",
    caption: "Nairobi's murals-on-wheels, sound systems, and street slang.",
    image:
      "https://cdn.tuko.co.ke/images/1120/95a5e42963047ee9.jpeg?v=1",
  },
  {
    title: "Give Back",
    caption: "Children's home visits, goodwill donations, borehole projects.",
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Local Life",
    caption: "Ngong Racecourse, Safari Sevens rugby, island festivals.",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function CultureTeaser() {
  return (
    <section className="bg-linen w-full">
      <div className="section-pad mx-auto max-w-8xl py-20 md:py-28">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">Beyond the Safari</span>
            <h2 className="mt-4 max-w-lg font-display text-4xl text-umber md:text-5xl">
              Culture &amp; Heritage
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink">
              47 officially recognized tribes, Swahili coastal history, and a
              capital city with a culture of its own — the people side of
              Kenya, alongside the wildlife.
            </p>
          </div>
          <Link href="/culture" className="btn-ochre shrink-0">
            Explore Culture &amp; Heritage
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PREVIEW_CARDS.map((card) => (
            <Link
              key={card.title}
              href="/culture"
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
