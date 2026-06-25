"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroSlides } from "@/lib/data";

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((a) => (a + 1) % heroSlides.length),
      7000
    );
    return () => clearInterval(id);
  }, []);

  const slide = heroSlides[active];

  return (
    <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden bg-umber">
      {heroSlides.map((s, i) => (
        <div
          key={s.location}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={s.image}
            alt={s.location}
            fill
            priority={i === 0}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-umber/40" />
        </div>
      ))}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <span className="coord !text-linen/80 mb-4">{slide.coord} · {slide.location}</span>
        <span className="eyebrow !text-linen/90 mb-5">{slide.eyebrow}</span>
        <h1 className="max-w-4xl whitespace-pre-line font-display text-4xl leading-tight text-linen sm:text-5xl md:text-6xl">
          {slide.headline}
        </h1>
        <a href="#packages" className="btn-outline mt-10">
          View Itineraries
        </a>
      </div>

      <div className="absolute bottom-8 right-8 z-10 flex gap-2">
        {heroSlides.map((s, i) => (
          <button
            key={s.location}
            aria-label={`Show ${s.location} slide`}
            onClick={() => setActive(i)}
            className={`h-1.5 w-8 transition-colors ${
              i === active ? "bg-ochre" : "bg-linen/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
