import { cultureIntro, tribeHighlights } from "@/lib/culture-data";

export default function TribesSection() {
  return (
    <section className="bg-linen w-full">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-28">
        <span className="coord mb-4 block">{cultureIntro.coord}</span>
        <span className="eyebrow">{cultureIntro.eyebrow}</span>
        <h2 className="mt-4 max-w-2xl font-display text-4xl text-umber md:text-5xl">
          {cultureIntro.headline}
        </h2>

        <div className="mt-8 max-w-3xl space-y-5">
          {cultureIntro.paragraphs.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-ink">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px bg-umber/10 sm:grid-cols-2 lg:grid-cols-4">
          {tribeHighlights.map((t) => (
            <div key={t.name} className="bg-sand px-6 py-7">
              <span className="text-[10px] uppercase tracking-widest2 text-ochre">
                {t.group}
              </span>
              <h3 className="mt-2 font-display text-2xl text-umber">
                {t.name}
              </h3>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-ink/50">
                {t.region}
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-ink/80">
                {t.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
