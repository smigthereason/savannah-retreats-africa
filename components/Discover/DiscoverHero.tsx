import Image from "next/image";
import Link from "next/link";

export default function DiscoverHero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-umber">
      <Image
        src="/mount-kenya.jpg"
        alt="Batian and Nelion, the twin peaks of Mount Kenya"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-umber/20 to-umber/80" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-24 text-center">
        <span className="coord !text-linen/80 mb-4">01°S, 38°E · Kenya</span>
        <span className="eyebrow !text-linen/90 mb-5">Beyond the Safari Circuit</span>
        <h1 className="max-w-3xl font-display text-4xl leading-tight text-linen sm:text-5xl md:text-6xl lg:text-7xl">
          Discover Kenya
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-linen/85">
          Mountains, hills, forests, and lesser-known parks — the rest of
          the country, for travelers who want more than the game-drive
          circuit alone.
        </p>
        <nav
          aria-label="Breadcrumb"
          className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-linen/60"
        >
          <Link href="/" className="hover:text-ochre transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-ochre">Discover Kenya</span>
        </nav>
      </div>

      {/* CC-BY-SA attribution, required by the source license.
          Photographer name intentionally omitted here — verify on the
          source page before publishing and update this credit with
          their actual name. */}
      <a
        href="https://commons.wikimedia.org/wiki/File:This_is_Thomson-Batian-Nelion-MT.kenya.jpg"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 z-10 text-[10px] text-linen/40 hover:text-linen/70"
      >
        Photo via Wikimedia Commons (CC BY-SA)
      </a>
    </section>
  );
}
