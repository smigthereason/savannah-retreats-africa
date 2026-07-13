import Image from "next/image";
import { footer } from "@/lib/data";
import { bridgeIntro as bridgeContent } from "@/lib/about-data";
import { Logo, MatHeadline } from "@/public/index";


export default function BridgeSection() {
  return (
    <section className="bg-linen w-full">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-32">
        <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-2">
          <div className="order-2 md:order-1 relative h-[420px] w-full md:h-[520px]">
            <Image
              src={Logo}
              alt="Trip designer reviewing a Kenya safari itinerary"
              fill
              className="object-cover"
            />
          </div>


          <div className="order-1 md:order-2">
            <span className="eyebrow">{bridgeContent.eyebrow}</span>
            <h2 className="mt-4 font-display text-4xl text-umber md:text-5xl">
              {bridgeContent.headline}
            </h2>

            <div className="mt-7 space-y-5 text-[15px] leading-relaxed text-ink">
              {bridgeContent.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-9 flex items-center gap-4">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="text-ochre"
              >
                <path
                  d="M6.6 10.8c1.5 3 4 5.4 7 7l2.3-2.3c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V21c0 .6-.4 1-1 1C11.6 22 2 12.4 2 1c0-.6.4-1 1-1h4.2c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"
                  fill="currentColor"
                />
              </svg>
              <div>
                <p className="text-xs uppercase tracking-widest2 text-ink/70">
                  {bridgeContent.phoneLabel}
                </p>
                <p className="font-display text-xl text-umber">{footer.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
