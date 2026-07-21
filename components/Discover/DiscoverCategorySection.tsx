import Link from "next/link";
import type { DiscoverEntry } from "@/lib/discover-data";

export default function DiscoverCategorySection({
  eyebrow,
  headline,
  intro,
  entries,
  background = "linen",
}: {
  eyebrow: string;
  headline: string;
  intro: string;
  entries: DiscoverEntry[];
  background?: "linen" | "sand";
}) {
  const cardBg = background === "linen" ? "bg-sand" : "bg-linen";

  return (
    <section className={`${background === "linen" ? "bg-linen" : "bg-sand"} w-full`}>
      <div className="section-pad mx-auto max-w-8xl py-20 md:py-28">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-4 max-w-xl font-display text-4xl text-umber md:text-5xl">
          {headline}
        </h2>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink">
          {intro}
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {entries.map((entry) => (
            <div key={entry.name} className={`${cardBg} flex flex-col px-7 py-8`}>
              <h3 className="font-display text-2xl text-umber">{entry.name}</h3>
              <p className="mt-1 text-[11px] uppercase tracking-widest2 text-ochre">
                {entry.region}
              </p>
              <p className="mt-4 text-[13px] leading-relaxed text-ink/80">
                {entry.description}
              </p>

              <div className="mt-5">
                <span className="text-[10px] uppercase tracking-widest2 text-ink/50">
                  Activities
                </span>
                <ul className="mt-2 space-y-1.5">
                  {entry.activities.map((a) => (
                    <li key={a} className="flex gap-2 text-[13px] text-ink/80">
                      <span className="text-ochre">—</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-t border-umber/10 pt-4">
                <span className="text-[10px] uppercase tracking-widest2 text-ink/50">
                  Nearby Stay
                </span>
                {entry.nearbyStay ? (
                  <Link
                    href={`/lodges#${entry.nearbyStay.slug}`}
                    className="mt-1 block text-[13px] font-medium text-umber hover:text-ochre"
                  >
                    {entry.nearbyStay.name} →
                  </Link>
                ) : (
                  <p className="mt-1 text-[13px] italic text-ink/50">
                    Lodge partners for this area — coming soon.
                  </p>
                )}
                {entry.note && (
                  <p className="mt-2 text-[11px] leading-relaxed text-ink/40">
                    {entry.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
