import Image from "next/image";
import { experiences } from "@/lib/data";
import Reveal from "@/components/Landing-Page/Reveal";

export default function Experiences() {
  return (
    <section className="bg-linen w-full">
      <div className="mx-auto max-w-8xl">
        {experiences.map((exp) => (
          <div
            key={exp.title}
            className={` grid grid-cols-1 md:grid-cols-2 ${
              exp.flip ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            {/* Image slides in from the edge it's nearest to: left column
                slides from the left, right column (flipped) from the right. */}
            <Reveal direction={exp.flip ? "right" : "left"}>
              <div className="group relative h-[380px] overflow-hidden md:h-[460px]">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
            </Reveal>

            <div className="flex flex-col justify-center bg-sand px-8 py-14 md:px-16">
              <span className="coord mb-2">{exp.coord}</span>
              <span className="eyebrow">{exp.eyebrow}</span>
              <h3 className="mt-3 font-display text-3xl text-umber md:text-4xl">
                {exp.title}
              </h3>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink">
                {exp.body}
              </p>
              <a href="/packages" className="btn-ochre mt-7 w-fit">
                Learn More
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
