import Image from "next/image";
import type { GalleryImage } from "@/lib/sanity/gallery";

type Props = {
  images: GalleryImage[];
};

export default function GalleryMasonry({ images }: Props) {
  if (!images.length) {
    return (
      <div className="border border-umber/10 bg-sand/55 px-6 py-16 text-center md:px-12">
        <span className="eyebrow">Gallery</span>
        <h2 className="mt-4 font-display text-3xl text-umber md:text-4xl">
          The gallery is being curated.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink/75">
          Add image entries in Sanity under Gallery Media and they will appear
          here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
      {images.map((item) => {
        const width = item.image.asset.metadata?.dimensions?.width || 1200;
        const height = item.image.asset.metadata?.dimensions?.height || 900;
        const lqip = item.image.asset.metadata?.lqip;

        return (
          <figure
            key={item._id}
            className="group relative mb-4 break-inside-avoid overflow-hidden bg-sand"
          >
            <Image
              src={item.image.asset.url}
              alt={item.altText || item.title}
              width={width}
              height={height}
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              placeholder={lqip ? "blur" : "empty"}
              blurDataURL={lqip}
              unoptimized
              priority
            />

            {(item.title || item.caption || item.location) && (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-umber/90 via-umber/55 to-transparent px-5 pb-5 pt-16 text-linen opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                {item.location && (
                  <p className="text-[10px] font-semibold uppercase tracking-widest2 text-ochre">
                    {item.location}
                  </p>
                )}
                <h2 className="mt-1 font-display text-xl leading-tight">
                  {item.title}
                </h2>
                {item.caption && (
                  <p className="mt-2 text-xs leading-relaxed text-linen/80">
                    {item.caption}
                  </p>
                )}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}
