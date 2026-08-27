import FAQAccordion from "@/components/FAQ/FAQAccordion";

export default function FAQSection() {
  return (
    <section className="section-pad mx-auto max-w-8xl py-20 md:py-28">
      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-[0.75fr_1.25fr] md:gap-16">
        <div>
          <span className="eyebrow">Good to Know</span>
          <h2 className="mt-4 font-display text-4xl text-umber md:text-5xl">
            Ask the uncomfortable questions too.
          </h2>
        </div>
        <div className="md:pt-8">
          <p className="max-w-2xl text-[15px] leading-7 text-ink/80">
            A safari should feel exciting, not vague. We have included the
            practical questions travellers often hesitate to ask, including
            security and emergency planning. If your concern is specific to
            your route, dates, nationality, or circumstances, contact us and
            we can address it directly.
          </p>
        </div>
      </div>

      <FAQAccordion />
    </section>
  );
}
