import { localEvents } from "@/lib/culture-data";

export default function EventsSection() {
  return (
    <section className="bg-linen w-full">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-28">
        <span className="eyebrow">Local Life &amp; Events</span>
        <h2 className="mt-4 max-w-xl font-display text-4xl text-umber md:text-5xl">
          What's On, Beyond the Game Drive
        </h2>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink">
          A handful of Kenya's calendar fixtures pull in a genuinely local
          crowd, not just visitors — a good way to spend a day in Nairobi
          between safari legs.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {localEvents.map((e) => (
            <div
              key={e.title}
              className="flex items-start gap-5 bg-sand px-6 py-7"
            >
              <div className="shrink-0">
                <span className="font-display text-3xl text-ochre">
                  {e.title.slice(0, 1)}
                </span>
              </div>
              <div>
                <h3 className="font-display text-xl text-umber">
                  {e.title}
                </h3>
                <p className="mt-1 text-[11px] uppercase tracking-widest2 text-ink/50">
                  {e.location}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/80">
                  {e.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
