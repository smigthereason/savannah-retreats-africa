import { museums } from "@/lib/culture-data";

export default function MuseumsSection() {
  return (
    <section className="bg-sand w-full">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-28">
        <span className="eyebrow">Museums &amp; Heritage Sites</span>
        <h2 className="mt-4 max-w-xl font-display text-4xl text-umber md:text-5xl">
          Where the History Lives
        </h2>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink">
          From fossil halls to 16th-century forts, these stops can be woven
          into most itineraries — usually a half-day near Nairobi or the
          coast rather than a detour.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {museums.map((m) => (
            <div key={m.name} className="bg-linen px-6 py-7">
              <h3 className="font-display text-xl text-umber">{m.name}</h3>
              <p className="mt-1 text-[11px] uppercase tracking-widest2 text-ochre">
                {m.location}
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-ink/80">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
