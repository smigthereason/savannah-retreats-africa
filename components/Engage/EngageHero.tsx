import Image from "next/image";
import Link from "next/link";

export default function EngageHero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-umber">
      <Image
        src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2400&auto=format&fit=crop"
        alt="Guide vehicle on the Maasai Mara plains"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-umber/55" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <span className="eyebrow !text-linen/90 mb-5">For People Who Know Kenya</span>
        <h1 className="max-w-2xl font-display text-4xl leading-tight text-linen sm:text-5xl md:text-6xl">
          Engage With Us
        </h1>

        <nav
          aria-label="Breadcrumb"
          className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-linen/60"
        >
          <Link href="/" className="hover:text-ochre">
            Home
          </Link>
          <span>/</span>
          <span className="text-ochre">Engage With Us</span>
        </nav>
      </div>
    </section>
  );
}
