import Image from "next/image";
import Link from "next/link";
import { aboutHero } from "@/lib/about-data";

export default function AboutHero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-umber">
      <Image
        src="https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2400&auto=format&fit=crop"
        alt="Safari vehicle overlooking the Kenyan savanna at golden hour"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-umber/20 to-umber/80" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-24 text-center">
        <span className="coord !text-linen/80 mb-4">{aboutHero.coord}</span>
        <span className="eyebrow !text-linen/90 mb-5">{aboutHero.eyebrow}</span>
        <h1 className="max-w-3xl font-display text-4xl leading-tight text-linen sm:text-5xl md:text-6xl lg:text-7xl">
          {aboutHero.headline}
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-linen/85">
          {aboutHero.intro}
        </p>
        <nav
          aria-label="Breadcrumb"
          className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-linen/60"
        >
          <Link href="/" className="hover:text-ochre transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-ochre">About</span>
        </nav>
      </div>
    </section>
  );
}
