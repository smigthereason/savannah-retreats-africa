import Image from "next/image";
import Link from "next/link";

export default function LodgesHero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-umber">
      <Image
        src="https://images.unsplash.com/photo-1769952055799-aa6d3e01f3a2?q=80&w=1634&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Safari tents in the African savanna"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Heavier at top so navbar area is always readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-umber/20 to-umber/80" />

      {/* pt-24 ensures content clears the fixed navbar on all screen sizes */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-24 text-center">
        <span className="coord !text-linen/80 mb-4">01°S, 35°E · Kenya</span>
        <span className="eyebrow !text-linen/90 mb-5">Where You Stay</span>
        <h1 className="max-w-3xl font-display text-4xl leading-tight text-linen sm:text-5xl md:text-6xl lg:text-7xl">
          Lodges &amp; Camps
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-linen/85">
          Nine properties across the Mara, Amboseli, Samburu, Tsavo, the Rift
          Valley, and the coast — each one chosen first, with the itinerary
          built around it rather than the other way around.
        </p>
        <nav
          aria-label="Breadcrumb"
          className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-linen/60"
        >
          <Link href="/" className="hover:text-ochre transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-ochre">Lodges &amp; Camps</span>
        </nav>
      </div>
    </section>
  );
}
