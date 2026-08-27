import Image from "next/image";
import Link from "next/link";
import { GalleryHero1 } from "@/public/index";


export default function GalleryHero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-umber">
      {/* Image container with better scaling control */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={GalleryHero1}
          alt="Kenyan landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          quality={90}
          placeholder="blur"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-umber/30 via-umber/35 to-umber/80" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-20 text-center">
        <span className="eyebrow !text-linen/90 mb-5">
          Field Notes in Frames
        </span>
        <h1 className="max-w-3xl font-display text-5xl leading-tight text-linen sm:text-6xl md:text-7xl">
          Gallery
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-linen/80 md:text-[15px]">
          Wildlife, landscapes, camps, culture, and the quieter moments that
          make a journey through Kenya memorable.
        </p>

        <nav
          aria-label="Breadcrumb"
          className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-linen/60"
        >
          <Link href="/" className="transition-colors hover:text-ochre">
            Home
          </Link>
          <span className="text-linen/40">/</span>
          <span className="text-ochre">Gallery</span>
        </nav>
      </div>
    </section>
  );
}
