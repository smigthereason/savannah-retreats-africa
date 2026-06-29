import Image from "next/image";
import Link from "next/link";

export default function PlanTripHero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full  overflow-hidden bg-umber">
      <Image
        src="https://images.unsplash.com/photo-1709562185044-99cda3acc956?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Acacia tree on the open Kenyan savanna"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-umber/65" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <span className="eyebrow !text-linen/90 mb-5">Built Around You</span>
        <h1 className="max-w-2xl font-display text-4xl leading-tight text-linen sm:text-5xl md:text-6xl">
          Plan Your Trip
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-linen/85">
          Tell us where you want to go, when, and with whom — we'll build the
          route, pick the camps, and send back a tailored itinerary, no
          obligation.
        </p>

        <nav
          aria-label="Breadcrumb"
          className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-linen/60"
        >
          <Link href="/" className="hover:text-ochre">
            Home
          </Link>
          <span>/</span>
          <span className="text-ochre">Plan a Trip</span>
        </nav>
      </div>
    </section>
  );
}
