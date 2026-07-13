// import Link from "next/link";
import { impactExperiences } from "@/lib/culture-data";

export default function ImpactSection() {
  return (
    <section className="bg-sand  w-full">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-28">
        <span className="eyebrow !text-umber">Give Back</span>
        <h2 className="mt-4 max-w-xl font-display text-4xl text-ink md:text-5xl">
          Not Just Tourist Sites — Missions That Matter
        </h2>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink">
          Some of the most meaningful days on a Kenya trip aren't in a
          national park. On request, we build in visits and contributions to
          the communities your route already passes through.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 bg-sand sm:grid-cols-2">
          {impactExperiences.map((item) => (
            <div key={item.title} className="bg-linen px-7 py-8">
              <h3 className="font-display text-2xl text-umber">
                {item.title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-ink">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/*<Link href="/plantrip" className="btn-outline mt-12 inline-flex">
          Add a Community Visit to My Trip
        </Link>*/}
        <a href="/plantrip" className="btn-ochre mt-10">
          Add a Community Visit to My Trip
        </a>
      </div>
    </section>
  );
}
