import { Plane, Compass, Users, Headphones } from "lucide-react";
import { whatWeHandle } from "@/lib/about-data";

const ICONS = [Plane, Compass, Users, Headphones];

export default function WhatWeHandle() {
  return (
    <section className="bg-sand w-full">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-28">
        <span className="eyebrow">We Take Out the Guesswork</span>
        <h2 className="mt-4 max-w-xl font-display text-4xl text-umber md:text-5xl">
          Everything Handled, Start to Finish
        </h2>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink">
          From the flight you book to the guide who greets you on arrival,
          it's one team, one point of contact, and one standard of care.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-px bg-umber/10 sm:grid-cols-2 lg:grid-cols-4">
          {whatWeHandle.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <div key={item.title} className="bg-linen px-7 py-9">
                <Icon className="h-7 w-7 text-ochre" strokeWidth={1.25} />
                <h3 className="mt-5 font-display text-2xl text-umber">
                  {item.title}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/80">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
