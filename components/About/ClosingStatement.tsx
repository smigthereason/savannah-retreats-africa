import Link from "next/link";
import { closingStatement } from "@/lib/about-data";

export default function ClosingStatement() {
  return (
    <section className="bg-linen w-full">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl leading-tight text-umber md:text-5xl">
            {closingStatement.headline}
          </h2>
          <p className="mt-7 text-[15px] leading-relaxed text-ink">
            {closingStatement.paragraph}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/plantrip" className="btn-ochre">
              Plan a Trip
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-umber/20 px-8 py-4 text-xs font-semibold uppercase tracking-widest2 text-umber transition-colors hover:border-ochre hover:text-ochre"
            >
              Talk to a Trip Designer
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
