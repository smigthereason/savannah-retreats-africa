import Image from "next/image";
import Reveal from "@/components/Landing-Page/Reveal";
import { lodges } from "@/lib/lodges-data";

const showcase = [lodges[0], lodges[1]]; // Ol Kanjau Tented Camp, Olarro Private House

export default function LodgeShowcase() {
  return (
    <section className="bg-linen w-full">
      <div className="section-pad mx-auto max-w-8xl pt-24 md:pt-28">
        <span className="eyebrow">The Two We'd Book Ourselves</span>
        <h2 className="mt-4 max-w-xl font-display text-4xl text-umber md:text-5xl">
          Signature Properties
        </h2>
      </div>

      <div className="mt-14">
        {showcase.map((lodge, i) => {
          const flip = i % 2 === 1;
          return (
            <div
              key={lodge.slug}
              className={`grid grid-cols-1 md:grid-cols-2 ${
                flip ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <Reveal direction={flip ? "right" : "left"}>
                <div className="group relative h-[620px] overflow-hidden ">
                  <Image
                    src={lodge.image}
                    alt={lodge.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
              </Reveal>

              <div className="flex flex-col justify-center bg-sand px-8 py-14 md:px-16">
                <span className="coord mb-2">{lodge.coord}</span>
                <span className="eyebrow">{lodge.eyebrow}</span>
                <h3 className="mt-3 font-display text-3xl text-umber md:text-4xl">
                  {lodge.name}
                </h3>

                <blockquote className="mt-6 max-w-md border-l-2 border-ochre pl-5 font-display text-xl italic leading-snug text-umber/90">
                  &ldquo;{lodge.signature}&rdquo;
                </blockquote>

                <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink">
                  {lodge.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-widest2 text-ink/60">
                  <span>{lodge.rooms}</span>
                  <span className="text-ink/30">·</span>
                  <span>{lodge.category}</span>
                </div>

                <div className="mt-7 flex items-end justify-between border-t border-umber/10 pt-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest2 text-ink/50">
                      From, per person / night
                    </p>
                    <p className="font-display text-2xl text-umber">
                      ${lodge.priceFromPerNight.toLocaleString()}
                    </p>
                  </div>
                  <a
                    href={`/contact?lodge=${lodge.slug}`}
                    className="btn-ochre"
                  >
                    Check Availability
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
