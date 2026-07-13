"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { submitInquiry } from "@/lib/submitInquiry";
import TravelerAgeDetails, {
  emptyTravelerAgeDetails,
  resizeChildrenAges,
  type TravelerAgeDetailsValue,
} from "@/components/shared/TravelerAgeDetails";

const DESTINATIONS = [
  "Maasai Mara",
  "Amboseli",
  "Samburu",
  "Tsavo",
  "Naivasha",
  "Mount Kenya",
  "Diani",
  "Watamu & Malindi",
];

const TIERS = [
  { value: "classic", label: "Classic Tented", hint: "$250–$400 / night pp" },
  { value: "signature", label: "Signature Luxury", hint: "$450–$900 / night pp" },
  { value: "private", label: "Private Reserve", hint: "$1,000+ / night pp" },
] as const;

export default function TripPlannerForm() {
  const [destinations, setDestinations] = useState<string[]>([]);
  const [tier, setTier] = useState<(typeof TIERS)[number]["value"] | null>(null);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [ageDetails, setAgeDetails] = useState<TravelerAgeDetailsValue>(
    emptyTravelerAgeDetails()
  );

  function handleChildrenChange(n: number) {
    setChildren(n);
    setAgeDetails((prev) => ({
      ...prev,
      childrenAges: resizeChildrenAges(prev.childrenAges, n),
    }));
  }
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleDestination(d: string) {
    setDestinations((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await submitInquiry({
        type: "tripPlanner",
        name,
        email,
        message: notes || undefined,
        destinations,
        tier: tier || undefined,
        dateStart: dateStart || undefined,
        dateEnd: dateEnd || undefined,
        adults,
        children,
        childrenAges: children > 0 ? ageDetails.childrenAges : undefined,
        seniorAdults: ageDetails.seniorAdults || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="bg-linen w-full">
        <div className="section-pad mx-auto flex max-w-8xl flex-col items-center py-28 text-center">
          <span className="eyebrow">Request Received</span>
          <h2 className="mt-4 font-display text-4xl text-umber md:text-5xl">
            We're building your itinerary
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink">
            A Kenya-based trip designer will email a tailored itinerary
            within 24 hours, built around the destinations and dates you
            shared. No payment or commitment is needed until you're happy
            with the route.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-linen w-full">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-28">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl bg-sand px-8 py-12 md:px-14 md:py-14">
          <span className="eyebrow">Step One</span>
          <h2 className="mt-3 font-display text-3xl text-umber md:text-4xl">
            Where do you want to go?
          </h2>
          <p className="mt-3 text-[14px] text-ink/70">Select as many as you like.</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {DESTINATIONS.map((d) => {
              const active = destinations.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDestination(d)}
                  className={`flex items-center gap-1.5 border px-4 py-2.5 text-[12px] font-medium transition-colors ${
                    active
                      ? "border-ochre bg-ochre text-linen"
                      : "border-umber/20 text-umber hover:border-ochre hover:text-ochre"
                  }`}
                >
                  {active && <Check className="h-3 w-3" strokeWidth={2.5} />}
                  {d}
                </button>
              );
            })}
          </div>

          <div className="mt-10 border-t border-umber/10 pt-10">
            <span className="eyebrow">Step Two</span>
            <h2 className="mt-3 font-display text-3xl text-umber md:text-4xl">
              When, and how many of you?
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                  Earliest travel date
                </span>
                <input
                  type="date"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                  className="mt-2 w-full border border-umber/15 bg-linen px-4 py-3 text-sm text-ink outline-none focus:border-ochre"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                  Latest travel date
                </span>
                <input
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                  className="mt-2 w-full border border-umber/15 bg-linen px-4 py-3 text-sm text-ink outline-none focus:border-ochre"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                  Adults
                </span>
                <input
                  type="number"
                  min={1}
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="mt-2 w-full border border-umber/15 bg-linen px-4 py-3 text-sm text-ink outline-none focus:border-ochre"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                  Children
                </span>
                <input
                  type="number"
                  min={0}
                  max={8}
                  value={children}
                  onChange={(e) => handleChildrenChange(Number(e.target.value))}
                  className="mt-2 w-full border border-umber/15 bg-linen px-4 py-3 text-sm text-ink outline-none focus:border-ochre"
                />
              </label>
            </div>

            <div className="mt-5">
              <TravelerAgeDetails
                adults={adults}
                children={children}
                value={ageDetails}
                onChange={setAgeDetails}
              />
            </div>
          </div>

          <div className="mt-10 border-t border-umber/10 pt-10">
            <span className="eyebrow">Step Three</span>
            <h2 className="mt-3 font-display text-3xl text-umber md:text-4xl">
              What level of comfort?
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {TIERS.map((t) => {
                const active = tier === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTier(t.value)}
                    className={`flex flex-col items-start border px-4 py-4 text-left transition-colors ${
                      active
                        ? "border-ochre bg-ochre/10"
                        : "border-umber/20 hover:border-ochre"
                    }`}
                  >
                    <span className="text-[13px] font-semibold text-umber">{t.label}</span>
                    <span className="mt-1 text-[11px] text-ink/60">{t.hint}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 border-t border-umber/10 pt-10">
            <span className="eyebrow">Step Four</span>
            <h2 className="mt-3 font-display text-3xl text-umber md:text-4xl">
              How can we reach you?
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                  Full Name
                </span>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full border border-umber/15 bg-linen px-4 py-3 text-sm text-ink outline-none focus:border-ochre"
                />
              </label>
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                  Email
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full border border-umber/15 bg-linen px-4 py-3 text-sm text-ink outline-none focus:border-ochre"
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                Anything else we should know? (budget, occasion, must-sees)
              </span>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 w-full border border-umber/15 bg-linen px-4 py-3 text-sm text-ink outline-none focus:border-ochre"
              />
            </label>
          </div>

          {error && <p className="mt-6 text-[13px] text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-ochre mt-10 w-full disabled:opacity-60">
            {submitting ? "Sending…" : "Get My Itinerary"}
          </button>
        </form>
      </div>
    </section>
  );
}
