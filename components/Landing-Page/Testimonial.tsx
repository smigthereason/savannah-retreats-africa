import Image from "next/image";
import { testimonial } from "@/lib/data";

export default function Testimonial() {
  return (
    <section className="relative flex min-h-[640px] items-center overflow-hidden">
      {/* Transparent dark overlay — lets the fixed parallax bg show through */}
      <div className="absolute inset-0 bg-umber/55" />

      <div className="section-pad relative z-10 mx-auto max-w-8xl py-24">
        <div className="max-w-xl text-linen">
          <span className="eyebrow !text-ochre">{testimonial.eyebrow}</span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            {testimonial.headline}
          </h2>
          <p className="mt-8 text-[15px] italic leading-relaxed text-linen/85">
            &ldquo;{testimonial.quote}&rdquo;
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-full border border-linen/40">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
                alt={testimonial.name}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-display text-base text-linen">
                {testimonial.name}
              </p>
              <p className="text-xs text-linen/70">{testimonial.role}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
