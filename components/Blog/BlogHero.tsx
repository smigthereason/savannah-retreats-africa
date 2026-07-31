import Link from "next/link";

export default function BlogHero() {
  return (
    <section className="relative h-[100svh] min-h-[640px]  w-full  overflow-hidden bg-umber">
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <span className="eyebrow !text-ochre">From the Savannah Retreats Team</span>
        <h1 className="mt-4 max-w-2xl font-display text-4xl text-linen md:text-6xl">
          Journal
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-linen/80">
          News, travel guides, and stories from the road — written by the
          people planning the trips.
        </p>
        <nav
          aria-label="Breadcrumb"
          className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-linen/60"
        >
          <Link href="/" className="hover:text-ochre transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-ochre">Journal</span>
        </nav>
      </div>
    </section>
  );
}
