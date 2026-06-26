import Image from "next/image";
import Link from "next/link";

export default function PackagesHero() {
  return (
    <section className="relative h-[58vh] min-h-[440px] w-full overflow-hidden bg-umber">
      <Image
        src="https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2400&auto=format&fit=crop"
        alt="Safari vehicle on the Maasai Mara plains at golden hour"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-umber/50" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/*<span className="coord !text-linen/80 mb-4">01°S, 35°E · Kenya</span>
        <span className="eyebrow !text-linen/90 mb-5">Curated Itineraries</span>*/}
        <nav
          aria-label="Breadcrumb"
          className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-linen/60"
        >
          <Link href="/" className="hover:text-ochre">
            Home
          </Link>
          <span>/</span>
          <span className="text-ochre">Safari Packages</span>
        </nav>
        <h1 className="max-w-3xl font-display text-4xl leading-tight text-linen sm:text-5xl md:text-6xl">
          Safari Packages
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-linen/85">
          Six routes through Kenya&rsquo;s reserves and conservancies, each one
          built around a single private guide and vehicle from first night to
          last. Every itinerary below can be lengthened, shortened, or rebuilt
          from scratch.
        </p>
      </div>
    </section>
  );
}
