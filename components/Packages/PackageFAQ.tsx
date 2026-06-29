// "use client";

// import { useState } from "react";
// import { packageFaqs } from "@/lib/packages-data";

// export default function PackageFAQ() {
//   const [open, setOpen] = useState<number | null>(0);

//   return (
//     <section className="bg-linen w-full">
//       <div className="section-pad mx-auto max-w-8xl py-24 md:py-28">
//         <div className="grid grid-cols-1 gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
//           <div>
//             <span className="eyebrow">Before You Enquire</span>
//             <h2 className="mt-4 font-display text-4xl text-umber md:text-5xl">
//               Good to Know
//             </h2>
//             <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink">
//               Answers to what we&rsquo;re asked most before a first call. Anything
//               else — call the reservation line above or send us your dates.
//             </p>
//           </div>

//           <div className="divide-y divide-umber/15 border-t border-b border-umber/15">
//             {packageFaqs.map((faq, i) => {
//               const isOpen = open === i;
//               return (
//                 <div key={faq.question}>
//                   <button
//                     type="button"
//                     onClick={() => setOpen(isOpen ? null : i)}
//                     aria-expanded={isOpen}
//                     className="flex w-full items-center justify-between gap-6 py-6 text-left"
//                   >
//                     <span className="font-display text-lg text-umber md:text-xl">
//                       {faq.question}
//                     </span>
//                     <span
//                       className={`shrink-0 text-xl text-ochre transition-transform duration-300 ${
//                         isOpen ? "rotate-45" : ""
//                       }`}
//                     >
//                       +
//                     </span>
//                   </button>
//                   <div
//                     className={`overflow-hidden transition-all duration-300 ${
//                       isOpen ? "max-h-64 pb-6" : "max-h-0"
//                     }`}
//                   >
//                     <p className="max-w-xl text-[14px] leading-relaxed text-ink/80">
//                       {faq.answer}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { useState } from "react";
import { packageFaqs } from "@/lib/packages-data";

export default function PackageFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-linen w-full">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <div>
            <span className="eyebrow">Before You Enquire</span>
            <h2 className="mt-4 font-display text-4xl text-umber md:text-5xl">
              Good to Know
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink">
              Answers to what we&rsquo;re asked most before a first call.
              Anything else — call the reservation line above or send us your
              dates.
            </p>
          </div>

          <div className="divide-y divide-umber/15 border-t border-b border-umber/15">
            {packageFaqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-lg text-umber md:text-xl">
                      {faq.question}
                    </span>
                    <span
                      className={`shrink-0 text-xl text-ochre transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-64 pb-6" : "max-h-0"
                    }`}
                  >
                    <p className="max-w-xl text-[14px] leading-relaxed text-ink/80">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
