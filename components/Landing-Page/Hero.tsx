"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroSlides } from "@/lib/data";

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((a) => (a + 1) % heroSlides.length),
      7000,
    );
    return () => clearInterval(id);
  }, []);

  const slide = heroSlides[active];

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-umber">
      {/* Slides */}
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
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Overlay — stronger at top so navbar is always readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-umber/60 via-umber/30 to-umber/50" />
        </div>
      ))}

      {/* Hero content — padded top so it never hides behind the fixed navbar */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-24 text-center">
        <span className="coord !text-linen/80 mb-4">
          {slide.coord} · {slide.location}
        </span>
        <span className="eyebrow !text-linen/90 mb-5">{slide.eyebrow}</span>
        <h1 className="max-w-4xl whitespace-pre-line font-display text-4xl leading-tight text-linen sm:text-5xl md:text-6xl lg:text-7xl">
          {slide.headline}
        </h1>
        <a href="/packages" className="btn-ochre mt-10">
          View Itineraries
        </a>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2 sm:left-auto sm:right-8 sm:translate-x-0">
        {heroSlides.map((s, i) => (
          <button
            key={s.location}
            aria-label={`Show ${s.location} slide`}
            onClick={() => setActive(i)}
            className={`h-1.5 transition-all duration-300 ${
              i === active ? "w-8 bg-ochre" : "w-4 bg-linen/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
