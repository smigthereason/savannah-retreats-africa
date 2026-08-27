"use client";

import { useMemo, useState } from "react";
import { faqs, type FaqItem } from "@/lib/faq-data";

const categoryOrder: FaqItem["category"][] = [
  "Safety & Security",
  "Planning",
  "On Safari",
];

export default function FAQAccordion() {
  const [open, setOpen] = useState<string | null>(faqs[0]?.question || null);

  const grouped = useMemo(
    () =>
      categoryOrder.map((category) => ({
        category,
        items: faqs.filter((faq) => faq.category === category),
      })),
    [],
  );

  return (
    <div className="space-y-16">
      {grouped.map(({ category, items }) => (
        <section key={category}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
            <div>
              <p className="eyebrow">{category}</p>
            </div>

            <div className="divide-y divide-umber/15 border-y border-umber/15">
              {items.map((faq) => {
                const isOpen = open === faq.question;

                return (
                  <div key={faq.question}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : faq.question)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="font-display text-xl leading-snug text-umber md:text-2xl">
                        {faq.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`shrink-0 text-2xl text-ochre transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>

                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-3xl pb-6 text-[14px] leading-7 text-ink/80 md:text-[15px]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
