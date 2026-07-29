"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { bigFive, type BigFiveAnimal } from "@/lib/big-five-data";

function AnimalCard({ animal }: { animal: BigFiveAnimal }) {
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(animal.videoSrc);

  return (
    <div className="group relative aspect-[3/4] overflow-hidden bg-umber">
      {hasVideo && playing ? (
        <video
          src={animal.videoSrc}
          poster={animal.poster}
          autoPlay
          muted
          loop
          playsInline
          controls
          className="h-full w-full object-cover"
        />
      ) : (
        <>
          <Image
            src={animal.poster}
            alt={animal.name}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-umber/90 via-umber/20 to-umber/10" />

          {hasVideo ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play ${animal.name} footage`}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-linen/50 bg-linen/10 backdrop-blur-sm transition-colors group-hover:border-ochre group-hover:bg-ochre">
                <Play className="ml-0.5 h-5 w-5 text-linen" fill="currentColor" strokeWidth={0} />
              </span>
            </button>
          ) : (
            <span className="absolute right-3 top-3 bg-umber/70 px-2.5 py-1 text-[9px] uppercase tracking-widest2 text-linen/70">
              Footage coming soon
            </span>
          )}
        </>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-xl text-linen">{animal.name}</h3>
        <p className="mt-1 text-[11px] uppercase tracking-widest2 text-linen/60">
          {animal.whereToSpot}
        </p>
      </div>
    </div>
  );
}

export default function BigFiveVideography() {
  return (
    <section className="bg-umber w-full">
      <div className="section-pad mx-auto max-w-8xl py-20 md:py-28">
        <span className="eyebrow !text-ochre">Videography</span>
        <h2 className="mt-4 max-w-xl font-display text-4xl text-linen md:text-5xl">
          The Big Five, Up Close
        </h2>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-linen/80">
          Lion, elephant, buffalo, leopard, rhino — the five animals every
          safari is measured against, filmed on location across Kenya's
          parks and conservancies.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {bigFive.map((animal) => (
            <AnimalCard key={animal.name} animal={animal} />
          ))}
        </div>
      </div>
    </section>
  );
}
