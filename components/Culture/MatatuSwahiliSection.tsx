import Image from "next/image";
import { matatuCulture, swahiliCulture } from "@/lib/culture-data";
import { MatImage, SwahiliImage1, MatHeadline } from "@/public/index";


export default function MatatuSwahiliSection() {
  return (
    <section className="bg-linen w-full">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-28">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* ── Matatu culture ─────────────────────────────── */}
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={MatHeadline}
                alt="Colorfully decorated Nairobi matatu minibus"
                fill
                className="object-fill"
              />
            </div>
            <span className="eyebrow mt-8 block">{matatuCulture.eyebrow}</span>
            <h3 className="mt-3 font-display text-3xl text-umber md:text-4xl">
              {matatuCulture.headline}
            </h3>
            <div className="mt-5 space-y-4">
              {matatuCulture.paragraphs.map((p, i) => (
                <p key={i} className="text-[14px] leading-relaxed text-ink">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* ── Swahili culture ────────────────────────────── */}
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={SwahiliImage1}
                alt="Carved wooden door in Lamu's Swahili Old Town"
                fill
                className="object-cover"
              />
            </div>
            <span className="eyebrow mt-8 block">{swahiliCulture.eyebrow}</span>
            <h3 className="mt-3 font-display text-3xl text-umber md:text-4xl">
              {swahiliCulture.headline}
            </h3>
            <div className="mt-5 space-y-4">
              {swahiliCulture.paragraphs.map((p, i) => (
                <p key={i} className="text-[14px] leading-relaxed text-ink">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
