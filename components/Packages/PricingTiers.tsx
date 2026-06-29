// import { Check, Minus } from "lucide-react";
// import { pricingTiers } from "@/lib/packages-data";

// export default function PricingTiers() {
//   return (
//     <section className="bg-umber py-24 md:py-28">
//       <div className="section-pad mx-auto max-w-8xl">
//         <div className="max-w-2xl">
//           <span className="eyebrow !text-ochre">What Sets Each Tier Apart</span>
//           <h2 className="mt-4 font-display text-4xl text-linen md:text-5xl">
//             Three Levels of Comfort
//           </h2>
//           <p className="mt-6 text-[15px] leading-relaxed text-linen/75">
//             Every package on this page can be booked at any of the three tiers
//             below. The wildlife is identical across all three — what changes is
//             the camp, the vehicle, and how much of the logistics disappear from
//             view.
//           </p>
//         </div>

//         <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden bg-linen/10 md:grid-cols-3">
//           {pricingTiers.map((tier) => (
//             <div
//               key={tier.name}
//               className="flex flex-col bg-umber px-8 py-10 md:px-9"
//             >
//               <span className="text-[16px] uppercase tracking-widest2 text-ochre">
//                 {tier.nightlyRange}
//               </span>
//               <h3 className="mt-3 font-display text-2xl text-linen">
//                 {tier.name}
//               </h3>
//               <p className="mt-4 text-[14px] leading-relaxed text-linen/70">
//                 {tier.description}
//               </p>

//               <ul className="mt-7 space-y-3.5 border-t border-linen/10 pt-6">
//                 {tier.inclusions.map((item) => (
//                   <li
//                     key={item.label}
//                     className={`flex items-start gap-3 text-[13px] leading-snug ${
//                       item.included ? "text-linen/90" : "text-linen/35"
//                     }`}
//                   >
//                     {item.included ? (
//                       <Check
//                         className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ochre"
//                         strokeWidth={2}
//                       />
//                     ) : (
//                       <Minus
//                         className="mt-0.5 h-3.5 w-3.5 shrink-0 text-linen/30"
//                         strokeWidth={2}
//                       />
//                     )}
//                     {item.label}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         <p className="mt-6 text-[11px] uppercase tracking-widest2 text-linen/40">
//           Nightly figures are per person, twin-share, land-only — 2026
//           estimates, subject to season and camp availability.
//         </p>
//       </div>
//     </section>
//   );
// }
import { Check, Minus } from "lucide-react";
import { pricingTiers } from "@/lib/packages-data";

export default function PricingTiers() {
  return (
    <section className="bg-umber py-24 md:py-28">
      <div className="section-pad mx-auto max-w-8xl">
        <div className="max-w-2xl">
          <span className="eyebrow !text-ochre">What Sets Each Tier Apart</span>
          <h2 className="mt-4 font-display text-4xl text-linen md:text-5xl">
            Three Levels of Comfort
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-linen/75">
            Every package on this page can be booked at any of the three tiers
            below. The wildlife is identical across all three — what changes is
            the camp, the vehicle, and how much of the logistics disappear from
            view.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden bg-linen/10 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col bg-umber px-8 py-10 md:px-9"
            >
              <span className="text-[16px] uppercase tracking-widest2 text-ochre">
                {tier.nightlyRange}
              </span>
              <h3 className="mt-3 font-display text-2xl text-linen">
                {tier.name}
              </h3>
              <p className="mt-4 text-[14px] leading-relaxed text-linen/70">
                {tier.description}
              </p>

              <ul className="mt-7 space-y-3.5 border-t border-linen/10 pt-6">
                {tier.inclusions.map((item) => (
                  <li
                    key={item.label}
                    className={`flex items-start gap-3 text-[13px] leading-snug ${
                      item.included ? "text-linen/90" : "text-linen/35"
                    }`}
                  >
                    {item.included ? (
                      <Check
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ochre"
                        strokeWidth={2}
                      />
                    ) : (
                      <Minus
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-linen/30"
                        strokeWidth={2}
                      />
                    )}
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[11px] uppercase tracking-widest2 text-linen/40">
          Nightly figures are per person, twin-share, land-only — 2026
          estimates, subject to season and camp availability.
        </p>
      </div>
    </section>
  );
}
