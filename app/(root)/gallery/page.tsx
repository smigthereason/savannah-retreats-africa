import type { Metadata } from 'next';
import GalleryMasonry from "@/components/Gallery/GalleryMasonry";
import GalleryHero from "@/components/Gallery/GalleryHero";
import { getGalleryImages } from "@/lib/sanity/gallery";

export const metadata: Metadata  = {
  title: "Gallery | Savannah Retreats Africa",
  description:
    "A visual journal from Savannah Retreats Africa — Kenya's landscapes, wildlife, camps, culture, and moments on the road.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <main className="bg-linen">
      <GalleryHero />

      <section className="section-pad mx-auto max-w-8xl py-20 md:py-28">
        <div className="mb-12 max-w-2xl">
          <span className="eyebrow">Through Our Lens</span>
          <h2 className="mt-4 font-display text-4xl text-umber md:text-5xl">
            Kenya, unhurried.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ink/80">
            The masonry layout keeps each photograph in its natural shape, so
            portrait, landscape, and square images can sit together without
            being forced into the same crop.
          </p>
        </div>

        <GalleryMasonry images={images} />
      </section>
    </main>
  );
}
