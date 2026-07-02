"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, Clock, MapPin, Users } from "lucide-react";
import Reveal from "@/components/Landing-Page/Reveal";
import {
  packageFilters,
  packages,
  type SafariPackage,
} from "@/lib/packages-data";

const TAG_LABEL: Record<SafariPackage["tag"], string> = {
  safari: "Safari",
  coastal: "Coastal",
  honeymoon: "Honeymoon",
  family: "Family",
  weekend: "Weekend Getaway",
  "multi-destination": "Multi-Destination",
};

function TierBadge({ tier }: { tier: SafariPackage["tier"] }) {
  return (
    <span className="absolute left-5 top-5 z-10 bg-linen/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest2 text-umber">
      {tier}
    </span>
  );
}

function TagBadge({ tag }: { tag: SafariPackage["tag"] }) {
  return (
    <span className="absolute right-5 top-5 z-10 bg-ochre px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest2 text-linen">
      {TAG_LABEL[tag]}
    </span>
  );
}

function PackageCard({ pkg }: { pkg: SafariPackage }) {
  return (
    <div id={pkg.slug} className="flex h-full flex-col bg-sand scroll-mt-28">
      <div className="group relative h-64 overflow-hidden">
        <TierBadge tier={pkg.tier} />
        <TagBadge tag={pkg.tag} />
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>

      <div className="flex flex-1 flex-col px-7 py-8 md:px-8">
        <span className="coord mb-2">{pkg.coord}</span>
        <span className="eyebrow">{pkg.eyebrow}</span>
        <h3 className="mt-3 font-display text-2xl text-umber md:text-[28px]">
          {pkg.title}
        </h3>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-widest2 text-ink/60">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-ochre" strokeWidth={1.5} />
            {pkg.nights} nights
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-ochre" strokeWidth={1.5} />
            {pkg.groupSize}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-ochre" strokeWidth={1.5} />
            {pkg.region}
          </span>
        </div>

        <p className="mt-5 text-[15px] leading-relaxed text-ink">
          {pkg.description}
        </p>

        <ul className="mt-6 space-y-2.5">
          {pkg.highlights.map((h) => (
            <li
              key={h}
              className="flex items-start gap-2.5 text-[13px] leading-snug text-ink/85"
            >
              <Check
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ochre"
                strokeWidth={2}
              />
              {h}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[12px] leading-snug text-ink/55">
          <span className="font-semibold text-umber">Camps: </span>
          {pkg.camps}
          <span className="mx-2 text-ink/30">·</span>
          <span className="font-semibold text-umber">Season: </span>
          {pkg.bestSeason}
        </p>

        <div className="mt-7 flex items-end justify-between border-t border-umber/10 pt-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest2 text-ink/50">
              From, per person
            </p>
            <p className="font-display text-2xl text-umber">
              ${pkg.priceFrom.toLocaleString()}
            </p>
          </div>
          <a href={`/contact?package=${pkg.slug}`} className="btn-ochre">
            Request Itinerary
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PackageBrowser() {
  const [active, setActive] =
    useState<(typeof packageFilters)[number]["value"]>("all");

  const visible = useMemo(
    () =>
      active === "all" ? packages : packages.filter((p) => p.tag === active),
    [active],
  );

  return (
    <section className="bg-linen w-full">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-28">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">Kenya, Start to Finish</span>
            <h2 className="mt-4 font-display text-4xl text-umber md:text-5xl">
              Ten Routes, One Country
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink">
              Every itinerary below stays inside Kenya — the Mara, Amboseli,
              Samburu, and Tsavo for game viewing; Diani and the North Coast to
              unwind; the Rift Valley lakes and Mount Kenya for everything in
              between.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {packageFilters.map((f) => (
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
          {visible.map((pkg) => (
            <Reveal key={pkg.slug} direction="up" className="h-full">
              <PackageCard pkg={pkg} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
