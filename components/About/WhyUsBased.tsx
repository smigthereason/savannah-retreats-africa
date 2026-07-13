import { whyUsBased } from "@/lib/about-data";

export default function WhyUsBased() {
  return (
    <section className="relative w-full overflow-hidden bg-umber">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-28">
        <span className="eyebrow !text-ochre">{whyUsBased.eyebrow}</span>
        <h2 className="mt-4 max-w-xl font-display text-4xl text-linen md:text-5xl">
          {whyUsBased.headline}
        </h2>
        <div className="mt-6 max-w-2xl space-y-4">
          {whyUsBased.paragraphs.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-linen/85">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {whyUsBased.points.map((point, i) => (
            <div
              key={point.title}
              className="border border-linen/15 px-7 py-7"
            >
              <span className="font-display text-3xl text-ochre">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-xl text-linen">
                {point.title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-linen/75">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
