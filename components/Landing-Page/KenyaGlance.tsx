import { Building2, PawPrint, Sun, Flag, Medal } from "lucide-react";
import { kenyaGlance, kenyaWeatherByRegion } from "@/lib/data";

const ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  city: Building2,
  zebra: PawPrint,
  sun: Sun,
  flag: Flag,
  medal: Medal,
};

export default function KenyaGlance() {
  return (
    <section className="bg-sand w-full">
      <div className="section-pad mx-auto max-w-8xl py-20 md:py-28">
        <span className="eyebrow">Kenya at a Glance</span>
        <h2 className="mt-4 max-w-xl font-display text-4xl text-umber md:text-5xl">
          More Than a Safari
        </h2>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink">
          A country's worth of stories beyond the game drive — a capital
          city that never quite sleeps, a rally that breaks cars for a
          living, and the highlands that keep producing the fastest
          distance runners on earth.
        </p>

        {/* Story cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {kenyaGlance.map((item) => {
            const Icon = ICONS[item.icon] ?? Sun;
            return (
              <div key={item.title} className="bg-linen px-7 py-8">
                <Icon className="h-7 w-7 text-ochre" strokeWidth={1.5} />
                <span className="mt-5 block text-[10px] uppercase tracking-widest2 text-ink/50">
                  {item.eyebrow}
                </span>
                <h3 className="mt-2 font-display text-xl text-umber">
                  {item.title}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/80">
                  {item.body}
                </p>
              </div>
            );
          })}

          {/* Weather-by-region card — spans the remaining grid space so
              the layout doesn't leave an awkward single trailing card */}
          <div className="bg-umber px-7 py-8 text-linen sm:col-span-2 lg:col-span-1">
            <Sun className="h-7 w-7 text-ochre" strokeWidth={1.5} />
            <span className="mt-5 block text-[10px] uppercase tracking-widest2 text-linen/50">
              Climate Guide
            </span>
            <h3 className="mt-2 font-display text-xl text-linen">
              What to Pack, By Region
            </h3>
            <div className="mt-4 space-y-3">
              {kenyaWeatherByRegion.map((r) => (
                <div key={r.region} className="border-t border-linen/15 pt-3 first:border-t-0 first:pt-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[12px] font-medium text-linen">
                      {r.region}
                    </span>
                    <span className="text-[11px] text-ochre">{r.tempRangeF}</span>
                  </div>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-linen/50">
                    {r.example}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
