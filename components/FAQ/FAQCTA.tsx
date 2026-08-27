import Link from "next/link";

export default function FAQCTA() {
  return (
    <div className="mx-auto max-w-8xl section-pad pb-20 md:pb-28">
      <div className="mt-20  pt-12 text-center">
        <p className="eyebrow">Still Unsure?</p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl text-umber md:text-4xl">
          Ask us before you book.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink/75">
          Tell us what you are concerned about and we will answer it in the
          context of the actual itinerary you are considering.
        </p>
        <Link href="/contact" className="btn-ochre mt-7">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
