import { discoverIntro } from "@/lib/discover-data";

export default function DiscoverIntroSection() {
  return (
    <section className="bg-linen w-full">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-28">
        <span className="coord mb-4 block">{discoverIntro.coord}</span>
        <span className="eyebrow">{discoverIntro.eyebrow}</span>
        <h2 className="mt-4 max-w-2xl font-display text-4xl text-umber md:text-5xl">
          {discoverIntro.headline}
        </h2>

        <div className="mt-8 max-w-3xl space-y-5">
          {discoverIntro.paragraphs.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-ink">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
