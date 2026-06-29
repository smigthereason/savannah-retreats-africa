const BENEFITS = [
  {
    title: "Always Private",
    body: "Every itinerary is built around your own guide and vehicle — we don't pool guests into shared drives to fill a van.",
  },
  {
    title: "Kenya-Based, Not a Call Center",
    body: "Trip designers who have driven these routes themselves answer your enquiry, not a script.",
  },
  {
    title: "No Hidden Fees",
    body: "The price you're quoted includes park fees, transfers, and full board — what you see is what you pay.",
  },
];

export default function WhyPlanWithUs() {
  return (
    <section className="bg-umber py-24 md:py-28">
      <div className="section-pad mx-auto max-w-8xl">
        <div className="max-w-xl">
          <span className="eyebrow !text-ochre">Why Plan With Us</span>
          <h2 className="mt-4 font-display text-4xl text-linen md:text-5xl">
            Before You Submit
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden bg-linen/10 md:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex flex-col bg-umber px-8 py-10 md:px-9">
              <h3 className="font-display text-2xl text-linen">{b.title}</h3>
              <p className="mt-4 text-[14px] leading-relaxed text-linen/70">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
