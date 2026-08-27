import Image from "next/image";
import Link from "next/link";

export default function FAQHero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-umber">
      <Image
        src="https://images.unsplash.com/photo-1736610022076-75f281e4ac38?q=80&w=1470&auto=format&fit=crop"
        alt="Safari vehicle travelling through the Kenyan landscape"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-umber/30 via-umber/45 to-umber/85" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-20 text-center">
        <span className="eyebrow !text-linen/90 mb-5">Before You Travel</span>
        <h1 className="max-w-3xl font-display text-5xl leading-tight text-linen sm:text-6xl md:text-7xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-linen/80 md:text-[15px]">
          Direct answers about safety, security, planning, health, travel
          documents, and what to expect on safari.
        </p>

        <nav
          aria-label="Breadcrumb"
          className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-linen/60"
        >
          <Link href="/" className="transition-colors hover:text-ochre">
            Home
          </Link>
          <span>/</span>
          <span className="text-ochre">FAQ</span>
        </nav>
      </div>
    </section>
  );
}
