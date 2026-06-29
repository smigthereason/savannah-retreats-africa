"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Bed, Check, MapPin } from "lucide-react";
import Reveal from "@/components/Landing-Page/Reveal";
import { lodgeFilters, lodges, type Lodge } from "@/lib/lodges-data";

function TierBadge({ tier }: { tier: Lodge["tier"] }) {
  return (
    <span className="absolute left-5 top-5 z-10 bg-linen/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest2 text-umber">
      {tier}
    </span>
  );
}

function CategoryBadge({ category }: { category: Lodge["category"] }) {
  return (
    <span className="absolute right-5 top-5 z-10 bg-ochre px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest2 text-linen">
      {category}
    </span>
  );
}

function LodgeCard({ lodge }: { lodge: Lodge }) {
  return (
    <div id={lodge.slug} className="flex h-full flex-col bg-sand scroll-mt-28">
      <div className="group relative h-64 overflow-hidden">
        <TierBadge tier={lodge.tier} />
        <CategoryBadge category={lodge.category} />
        <Image
          src={lodge.image}
          alt={lodge.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>

      <div className="flex flex-1 flex-col px-7 py-8 md:px-8">
        <span className="coord mb-2">{lodge.coord}</span>
        <span className="eyebrow">{lodge.eyebrow}</span>
        <h3 className="mt-3 font-display text-2xl text-umber md:text-[28px]">
          {lodge.name}
        </h3>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-widest2 text-ink/60">
          <span className="inline-flex items-center gap-1.5">
            <Bed className="h-3.5 w-3.5 text-ochre" strokeWidth={1.5} />
            {lodge.rooms}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-ochre" strokeWidth={1.5} />
            {lodge.region}
          </span>
        </div>

        <p className="mt-5 text-[15px] leading-relaxed text-ink">
          {lodge.description}
        </p>

        <ul className="mt-6 space-y-2.5">
          {lodge.amenities.map((a) => (
            <li key={a} className="flex items-start gap-2.5 text-[13px] leading-snug text-ink/85">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ochre" strokeWidth={2} />
              {a}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex items-end justify-between border-t border-umber/10 pt-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest2 text-ink/50">
              From, per person / night
            </p>
            <p className="font-display text-2xl text-umber">
              ${lodge.priceFromPerNight.toLocaleString()}
            </p>
          </div>
          <a href={`/contact?lodge=${lodge.slug}`} className="btn-ochre">
            Check Availability
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LodgeBrowser() {
  const [active, setActive] = useState<typeof lodgeFilters[number]["value"]>("all");

  const visible = useMemo(
    () => (active === "all" ? lodges : lodges.filter((l) => l.category === active)),
    [active]
  );

  return (
    <section className="bg-linen w-full">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-28">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">Every Property</span>
            <h2 className="mt-4 font-display text-4xl text-umber md:text-5xl">
              Browse the Full Collection
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink">
              From canvas tents on the Mara river to a beachfront lodge on
              Diani — every property we use, with room counts, amenities,
              and nightly rates upfront.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {lodgeFilters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setActive(f.value)}
                className={`border px-5 py-2.5 text-[11px] font-medium uppercase tracking-widest2 transition-colors ${
                  active === f.value
                    ? "border-ochre bg-ochre text-linen"
                    : "border-umber/20 text-umber hover:border-ochre hover:text-ochre"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2">
          {visible.map((lodge) => (
            <Reveal key={lodge.slug} direction="up" className="h-full">
              <LodgeCard lodge={lodge} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
