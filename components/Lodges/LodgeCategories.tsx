import { lodgeCategories } from "@/lib/lodges-data";

export default function LodgeCategories() {
  return (
    <section className="bg-umber py-24 md:py-28">
      <div className="section-pad mx-auto max-w-8xl">
        <div className="max-w-2xl">
          <span className="eyebrow !text-ochre">Three Ways to Stay</span>
          <h2 className="mt-4 font-display text-4xl text-linen md:text-5xl">
            Tents, Lodges, or the Whole House
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-linen/75">
            Every property on this page falls into one of three categories.
            None is objectively better — it depends on how close to the
            ground you want to sleep, and how many people you're traveling
            with.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden bg-linen/10 md:grid-cols-3">
          {lodgeCategories.map((cat) => (
            <div key={cat.category} className="flex flex-col bg-umber px-8 py-10 md:px-9">
              <span className="text-[10px] uppercase tracking-widest2 text-ochre">
                {cat.tagline}
              </span>
              <h3 className="mt-3 font-display text-2xl text-linen">
                {cat.category}
              </h3>
              <p className="mt-4 text-[14px] leading-relaxed text-linen/70">
                {cat.description}
              </p>
              <p className="mt-6 border-t border-linen/10 pt-5 text-[13px] leading-snug text-linen/55">
                {cat.bestFor}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
