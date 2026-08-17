"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  Sparkles,
} from "lucide-react";

type JourneyData = {
  destinations: string[];
  experiences: string[];
  travellerType: string;
  adults: number;
  children: number;
  travelTiming: string;
  travelMonth: string;
  duration: string;
  budget: string;
  accommodationPreferences: string[];
  interests: string[];
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

const initialData: JourneyData = {
  destinations: [],
  experiences: [],
  travellerType: "",
  adults: 2,
  children: 0,
  travelTiming: "",
  travelMonth: "",
  duration: "",
  budget: "",
  accommodationPreferences: [],
  interests: [],
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

const destinations = [
  ["Maasai Mara", "Iconic wildlife, private conservancies and exceptional guiding."],
  ["Amboseli & Chyulu Hills", "Elephants, Kilimanjaro views and wide-open landscapes."],
  ["Laikipia & Mount Kenya", "Private conservancies, adventure and intimate safari stays."],
  ["Samburu & Northern Kenya", "Distinct wildlife, dramatic scenery and rich Samburu culture."],
  ["Tsavo", "Vast wilderness, red elephants and a quieter safari rhythm."],
  ["Great Rift Valley", "Naivasha, Nakuru, lakes, birdlife and beautiful stopovers."],
  ["Diani & South Coast", "White-sand beaches and an easy Indian Ocean finish."],
  ["Watamu & Malindi", "Marine life, beaches, Swahili culture and coastal charm."],
  ["Lamu Archipelago", "Swahili heritage, dhow sailing and deeply unhurried island days."],
  ["Not sure yet", "Tell us the feeling you want and we will recommend the right parts of Kenya."],
] as const;

const experiences = [
  ["Classic Safari", "Wildlife-led days and immersive bush stays."],
  ["Private Luxury", "Exceptional lodges, privacy and seamless service."],
  ["Romance & Honeymoon", "Intimate stays and private moments."],
  ["Family Adventure", "Meaningful experiences across generations."],
  ["Culture & Community", "Local stories, food, heritage and connection."],
  ["Bush & Beach", "Pair the wilderness with the Indian Ocean."],
  ["Wellness & Slow Travel", "Space to reset and travel without rushing."],
  ["Active Adventure", "Trekking, hiking, water and movement."],
] as const;

const travellerTypes = ["Solo", "Couple", "Family", "Friends", "Private Group"];

const timings = [
  "I have dates in mind",
  "My dates are flexible",
  "Recommend the best time",
];

const durations = [
  ["4–6 nights", "A focused escape."],
  ["7–9 nights", "Room for a richer itinerary."],
  ["10–14 nights", "Ideal for a multi-stop journey."],
  ["15+ nights", "A deeper, slower exploration."],
  ["Not sure yet", "Design the right pace for me."],
] as const;

const budgets = [
  "US$2,500 – 5,000 per person",
  "US$5,000 – 8,000 per person",
  "US$8,000 – 12,000 per person",
  "US$12,000+ per person",
  "Flexible — show me what is possible",
];

const accommodationOptions = [
  ["Boutique & Characterful", "Small stays with personality and a strong sense of place."],
  ["Luxury Safari Lodges", "High-touch service, beautiful design and prime locations."],
  ["Tented Camps", "Closer to nature without compromising comfort."],
  ["Private Villas", "Exclusive-use stays with space and privacy."],
  ["Eco-conscious", "Thoughtful properties with a lighter footprint."],
  ["A considered mix", "Different styles depending on the destination."],
] as const;

const interestOptions = [
  "Wildlife",
  "Photography",
  "Food & Wine",
  "Conservation",
  "Culture & Heritage",
  "Wellness",
  "Celebration",
  "Privacy & Seclusion",
  "Adventure",
  "Beach Time",
];

const stepNames = [
  "Destination",
  "Experience",
  "Travellers",
  "Timing",
  "Duration",
  "Investment",
  "Stay",
  "Details",
  "Introduction",
  "Review",
];

function scrollJourneyIntoView() {
  requestAnimationFrame(() => {
    document.getElementById("design-your-journey")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

function ChoiceCard({
  title,
  description,
  selected,
  onClick,
}: {
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={[
        "group relative min-h-[122px] w-full border p-5 text-left transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2",
        selected
          ? "border-umber bg-umber text-linen hover:bg-ochre"
          : "border-umber/15 bg-linen text-umber hover:-translate-y-0.5 hover:border-ochre/70",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-2xl leading-none">{title}</p>
          {description ? (
            <p
              className={[
                "mt-3 text-[13px] leading-relaxed",
                selected ? "text-linen/75" : "text-ink/75",
              ].join(" ")}
            >
              {description}
            </p>
          ) : null}
        </div>

        <span
          className={[
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition",
            selected
              ? "border-linen bg-linen text-ochre"
              : "border-umber/25 text-transparent",
          ].join(" ")}
        >
          <Check size={12} strokeWidth={2} />
        </span>
      </div>
    </button>
  );
}

function NumberPicker({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-umber/15 py-5">
      <span className="font-display text-2xl text-umber">{label}</span>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-10 w-10 items-center justify-center border border-umber/20 text-umber transition hover:border-ochre hover:text-ochre disabled:cursor-not-allowed disabled:opacity-25"
        >
          <Minus size={15} />
        </button>
        <span className="w-6 text-center text-sm font-semibold text-umber">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-10 w-10 items-center justify-center border border-umber/20 text-umber transition hover:border-ochre hover:text-ochre disabled:cursor-not-allowed disabled:opacity-25"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="grid gap-2 border-b border-umber/10 py-5 sm:grid-cols-[140px_1fr_auto] sm:gap-5">
      <span className="text-[10px] uppercase tracking-widest2 text-ink/50">
        {label}
      </span>
      <span className="text-sm leading-relaxed text-umber">
        {value || "Not specified"}
      </span>
      <button
        type="button"
        onClick={onEdit}
        className="w-fit text-[10px] uppercase tracking-widest2 text-ochre underline underline-offset-4"
      >
        Edit
      </button>
    </div>
  );
}

export default function DesignYourJourneyFunnel() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<JourneyData>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const progress = ((step + 1) / stepNames.length) * 100;

  const setField = <K extends keyof JourneyData>(
    field: K,
    value: JourneyData[K],
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const toggle = (
    field:
      | "destinations"
      | "experiences"
      | "accommodationPreferences"
      | "interests",
    value: string,
  ) => {
    const current = data[field];
    setField(
      field,
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const valid = useMemo(() => {
    switch (step) {
      case 0:
        return data.destinations.length > 0;
      case 1:
        return data.experiences.length > 0;
      case 2:
        return Boolean(data.travellerType);
      case 3:
        return Boolean(data.travelTiming);
      case 4:
        return Boolean(data.duration);
      case 5:
        return Boolean(data.budget);
      case 8:
        return (
          data.firstName.trim().length > 1 &&
          data.lastName.trim().length > 1 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
        );
      default:
        return true;
    }
  }, [data, step]);

  const next = () => {
    if (!valid) {
      setError("Please complete this step before continuing.");
      return;
    }

    setError(null);
    setStep((prev) => Math.min(prev + 1, stepNames.length - 1));
    scrollJourneyIntoView();
  };

  const back = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 0));
    scrollJourneyIntoView();
  };

  async function submit() {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "designJourney",
          name: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
          email: data.email.trim(),
          phone: data.phone.trim() || undefined,
          message: data.message.trim() || undefined,
          destinations: data.destinations,
          experiences: data.experiences,
          travellerType: data.travellerType,
          adults: data.adults,
          children: data.children,
          travelTiming: data.travelTiming,
          travelMonth: data.travelMonth.trim() || undefined,
          duration: data.duration,
          budget: data.budget,
          accommodationPreferences: data.accommodationPreferences,
          interests: data.interests,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to submit your journey.");
      }

      setSubmitted(true);
      scrollJourneyIntoView();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!started) {
    return (
      <section id="design-your-journey" className="scroll-mt-24 relative overflow-hidden bg-linen px-6 py-20 text-umber md:py-28">
        <div className="section-pad mx-auto max-w-8xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest2 text-ink/65">
              <Sparkles size={13} strokeWidth={1.5} />
              Design Your Journey
            </span>

            <h1 className="mt-6 max-w-2xl font-display text-5xl leading-[0.98] md:text-7xl">
              Start with the feeling.
              <br />
              We&apos;ll shape the journey.
            </h1>

            <p className="mt-7 max-w-xl text-[15px] leading-7 text-ink/75 md:text-base">
              Tell us which parts of Kenya draw you in, how you like to travel
              and what matters most. In a few considered steps, you&apos;ll give our
              Kenya-based travel designers the ingredients for a journey that
              feels personal from the start.
            </p>

            <button
              type="button"
              onClick={() => {
                setStarted(true);
                scrollJourneyIntoView();
              }}
              className="mt-10 inline-flex items-center gap-3 bg-ochre px-7 py-4 text-[11px] font-semibold uppercase tracking-widest2 text-white transition hover:bg-umber"
            >
              Begin discovery
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>

            <p className="mt-5 text-[11px] leading-relaxed text-linen/50">
              About 3 minutes · No commitment · A trip designer replies within 24 hours
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-48 -right-36 h-[520px] w-[520px] rounded-full border border-linen/10" />
        <div className="pointer-events-none absolute -bottom-24 -right-12 h-[320px] w-[320px] rounded-full border border-linen/10" />
      </section>
    );
  }

  if (submitted) {
    return (
      <section id="design-your-journey" className="scroll-mt-24 bg-linen px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Journey Received</span>
          <h2 className="mt-5 font-display text-5xl text-umber md:text-6xl">
            Your journey has begun.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-7 text-ink">
            Thank you, {data.firstName}. Your preferences are now with Savannah
            Retreats Africa. A trip designer can use them to begin shaping a
            thoughtful first proposal.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="design-your-journey" className="scroll-mt-24 min-h-screen bg-linen">
      <div className="mx-auto grid min-h-screen max-w-8xl lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="relative hidden overflow-hidden bg-umber p-10 text-linen lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div>
            <span className="text-[10px] uppercase tracking-widest2 text-linen/60">
              Savannah Retreats Africa
            </span>
            <h2 className="mt-8 max-w-md font-display text-5xl leading-[1.02]">
              Kenya, designed around how you want to feel.
            </h2>
          </div>

          <div className="max-w-sm">
            <p className="font-display text-2xl leading-snug text-linen/90">
              The best journeys begin before the itinerary.
            </p>
            <p className="mt-4 text-[13px] leading-6 text-linen/60">
              Every answer helps us understand your pace, priorities and sense
              of place — not just your dates.
            </p>
          </div>

          <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full border border-linen/10" />
          <div className="pointer-events-none absolute -bottom-8 -right-4 h-48 w-48 rounded-full border border-linen/10" />
        </aside>

        <div className="flex min-h-screen flex-col">
          <div className="border-b border-umber/10 px-6 py-5 md:px-10 xl:px-14">
            <div className="mx-auto max-w-3xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest2 text-ink/55">
                  {stepNames[step]}
                </span>
                <span className="text-[10px] uppercase tracking-widest2 text-ink/55">
                  {String(step + 1).padStart(2, "0")} / {stepNames.length}
                </span>
              </div>
              <div className="h-px overflow-hidden bg-umber/10">
                <div
                  className="h-full bg-ochre transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-1 px-6 py-10 md:px-10 md:py-14 xl:px-14 xl:py-16">
            <div className="mx-auto w-full max-w-3xl">
              {step === 0 && (
                <>
                  <span className="eyebrow">01 — Destination</span>
                  <h1 className="mt-4 font-display text-4xl leading-tight text-umber md:text-5xl">
                    Where in Kenya are you drawn to?
                  </h1>
                  <p className="mt-5 max-w-2xl text-[15px] leading-7 text-ink">
                    Choose one or more regions. If you&apos;re undecided, we can recommend
                    the right parts of Kenya around the experience you want.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {destinations.map(([title, description]) => (
                      <ChoiceCard
                        key={title}
                        title={title}
                        description={description}
                        selected={data.destinations.includes(title)}
                        onClick={() => toggle("destinations", title)}
                      />
                    ))}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <span className="eyebrow">02 — Experience</span>
                  <h1 className="mt-4 font-display text-4xl leading-tight text-umber md:text-5xl">
                    What should this journey feel like?
                  </h1>
                  <p className="mt-5 text-[15px] leading-7 text-ink">
                    Select everything that belongs in your ideal Kenya escape.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {experiences.map(([title, description]) => (
                      <ChoiceCard
                        key={title}
                        title={title}
                        description={description}
                        selected={data.experiences.includes(title)}
                        onClick={() => toggle("experiences", title)}
                      />
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <span className="eyebrow">03 — Travellers</span>
                  <h1 className="mt-4 font-display text-4xl leading-tight text-umber md:text-5xl">
                    Who are you travelling with?
                  </h1>
                  <p className="mt-5 text-[15px] leading-7 text-ink">
                    This helps us shape the pace, accommodation and private experiences.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {travellerTypes.map((option) => (
                      <ChoiceCard
                        key={option}
                        title={option}
                        selected={data.travellerType === option}
                        onClick={() => setField("travellerType", option)}
                      />
                    ))}
                  </div>
                  <div className="mt-8 border-t border-umber/15">
                    <NumberPicker
                      label="Adults"
                      value={data.adults}
                      min={1}
                      max={30}
                      onChange={(value) => setField("adults", value)}
                    />
                    <NumberPicker
                      label="Children"
                      value={data.children}
                      min={0}
                      max={20}
                      onChange={(value) => setField("children", value)}
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <span className="eyebrow">04 — Timing</span>
                  <h1 className="mt-4 font-display text-4xl leading-tight text-umber md:text-5xl">
                    When are you thinking of travelling?
                  </h1>
                  <p className="mt-5 text-[15px] leading-7 text-ink">
                    Exact dates are not necessary. A rough window is enough to start.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {timings.map((option) => (
                      <ChoiceCard
                        key={option}
                        title={option}
                        selected={data.travelTiming === option}
                        onClick={() => setField("travelTiming", option)}
                      />
                    ))}
                  </div>
                  <label className="mt-8 block">
                    <span className="text-[10px] uppercase tracking-widest2 text-ink/55">
                      Preferred month or dates
                    </span>
                    <input
                      type="text"
                      value={data.travelMonth}
                      onChange={(e) => setField("travelMonth", e.target.value)}
                      placeholder="e.g. October 2026 or 12–22 October"
                      className="mt-2 w-full border border-umber/15 bg-white px-4 py-4 text-sm text-umber outline-none placeholder:text-ink/35 focus:border-ochre"
                    />
                  </label>
                </>
              )}

              {step === 4 && (
                <>
                  <span className="eyebrow">05 — Pace</span>
                  <h1 className="mt-4 font-display text-4xl leading-tight text-umber md:text-5xl">
                    How much time would you like to give the journey?
                  </h1>
                  <p className="mt-5 text-[15px] leading-7 text-ink">
                    We favour fewer, better stops over rushing between destinations.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {durations.map(([title, description]) => (
                      <ChoiceCard
                        key={title}
                        title={title}
                        description={description}
                        selected={data.duration === title}
                        onClick={() => setField("duration", title)}
                      />
                    ))}
                  </div>
                </>
              )}

              {step === 5 && (
                <>
                  <span className="eyebrow">06 — Investment</span>
                  <h1 className="mt-4 font-display text-4xl leading-tight text-umber md:text-5xl">
                    What level of investment feels comfortable?
                  </h1>
                  <p className="mt-5 text-[15px] leading-7 text-ink">
                    Per person, excluding international flights. This helps us recommend
                    places that genuinely fit.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {budgets.map((option) => (
                      <ChoiceCard
                        key={option}
                        title={option}
                        selected={data.budget === option}
                        onClick={() => setField("budget", option)}
                      />
                    ))}
                  </div>
                </>
              )}

              {step === 6 && (
                <>
                  <span className="eyebrow">07 — Stay</span>
                  <h1 className="mt-4 font-display text-4xl leading-tight text-umber md:text-5xl">
                    How do you like to stay?
                  </h1>
                  <p className="mt-5 text-[15px] leading-7 text-ink">
                    Choose the styles you are naturally drawn to.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {accommodationOptions.map(([title, description]) => (
                      <ChoiceCard
                        key={title}
                        title={title}
                        description={description}
                        selected={data.accommodationPreferences.includes(title)}
                        onClick={() => toggle("accommodationPreferences", title)}
                      />
                    ))}
                  </div>
                </>
              )}

              {step === 7 && (
                <>
                  <span className="eyebrow">08 — Details</span>
                  <h1 className="mt-4 font-display text-4xl leading-tight text-umber md:text-5xl">
                    What would make the trip unmistakably yours?
                  </h1>
                  <p className="mt-5 text-[15px] leading-7 text-ink">
                    The smallest preferences often become the most memorable parts.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {interestOptions.map((option) => (
                      <ChoiceCard
                        key={option}
                        title={option}
                        selected={data.interests.includes(option)}
                        onClick={() => toggle("interests", option)}
                      />
                    ))}
                  </div>
                </>
              )}

              {step === 8 && (
                <>
                  <span className="eyebrow">09 — Introduction</span>
                  <h1 className="mt-4 font-display text-4xl leading-tight text-umber md:text-5xl">
                    Where should we send your first journey ideas?
                  </h1>
                  <p className="mt-5 text-[15px] leading-7 text-ink">
                    Share a few details and our travel designers can turn your choices
                    into a thoughtful starting point.
                  </p>

                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <label>
                      <span className="text-[10px] uppercase tracking-widest2 text-ink/55">
                        First name *
                      </span>
                      <input
                        required
                        value={data.firstName}
                        onChange={(e) => setField("firstName", e.target.value)}
                        className="mt-2 w-full border border-umber/15 bg-white px-4 py-3.5 text-sm text-umber outline-none focus:border-ochre"
                      />
                    </label>

                    <label>
                      <span className="text-[10px] uppercase tracking-widest2 text-ink/55">
                        Last name *
                      </span>
                      <input
                        required
                        value={data.lastName}
                        onChange={(e) => setField("lastName", e.target.value)}
                        className="mt-2 w-full border border-umber/15 bg-white px-4 py-3.5 text-sm text-umber outline-none focus:border-ochre"
                      />
                    </label>

                    <label>
                      <span className="text-[10px] uppercase tracking-widest2 text-ink/55">
                        Email *
                      </span>
                      <input
                        required
                        type="email"
                        value={data.email}
                        onChange={(e) => setField("email", e.target.value)}
                        className="mt-2 w-full border border-umber/15 bg-white px-4 py-3.5 text-sm text-umber outline-none focus:border-ochre"
                      />
                    </label>

                    <label>
                      <span className="text-[10px] uppercase tracking-widest2 text-ink/55">
                        Phone / WhatsApp
                      </span>
                      <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        className="mt-2 w-full border border-umber/15 bg-white px-4 py-3.5 text-sm text-umber outline-none focus:border-ochre"
                      />
                    </label>

                    <label className="sm:col-span-2">
                      <span className="text-[10px] uppercase tracking-widest2 text-ink/55">
                        Anything else we should know?
                      </span>
                      <textarea
                        rows={5}
                        value={data.message}
                        onChange={(e) => setField("message", e.target.value)}
                        placeholder="A celebration, dietary preference, accessibility need, favourite place or anything else that matters..."
                        className="mt-2 w-full resize-none border border-umber/15 bg-white px-4 py-3.5 text-sm text-umber outline-none placeholder:text-ink/35 focus:border-ochre"
                      />
                    </label>
                  </div>
                </>
              )}

              {step === 9 && (
                <>
                  <span className="eyebrow">10 — Your Journey</span>
                  <h1 className="mt-4 font-display text-4xl leading-tight text-umber md:text-5xl">
                    A first look at the journey you have in mind.
                  </h1>
                  <p className="mt-5 text-[15px] leading-7 text-ink">
                    Review your choices before sending them to Savannah Retreats Africa.
                  </p>

                  <div className="mt-8 border border-umber/15 bg-sand px-6 md:px-8">
                    <SummaryRow
                      label="Kenya destinations"
                      value={data.destinations.join(", ")}
                      onEdit={() => {
                        setStep(0);
                        scrollJourneyIntoView();
                      }}
                    />
                    <SummaryRow
                      label="Experience"
                      value={data.experiences.join(", ")}
                      onEdit={() => {
                        setStep(1);
                        scrollJourneyIntoView();
                      }}
                    />
                    <SummaryRow
                      label="Travellers"
                      value={`${data.travellerType} · ${data.adults} adult${data.adults === 1 ? "" : "s"}${data.children ? ` · ${data.children} child${data.children === 1 ? "" : "ren"}` : ""}`}
                      onEdit={() => {
                        setStep(2);
                        scrollJourneyIntoView();
                      }}
                    />
                    <SummaryRow
                      label="Timing"
                      value={`${data.travelTiming}${data.travelMonth ? ` · ${data.travelMonth}` : ""}`}
                      onEdit={() => {
                        setStep(3);
                        scrollJourneyIntoView();
                      }}
                    />
                    <SummaryRow
                      label="Duration"
                      value={data.duration}
                      onEdit={() => {
                        setStep(4);
                        scrollJourneyIntoView();
                      }}
                    />
                    <SummaryRow
                      label="Budget"
                      value={data.budget}
                      onEdit={() => {
                        setStep(5);
                        scrollJourneyIntoView();
                      }}
                    />
                    <SummaryRow
                      label="Stay"
                      value={data.accommodationPreferences.join(", ")}
                      onEdit={() => {
                        setStep(6);
                        scrollJourneyIntoView();
                      }}
                    />
                    <SummaryRow
                      label="Interests"
                      value={data.interests.join(", ")}
                      onEdit={() => {
                        setStep(7);
                        scrollJourneyIntoView();
                      }}
                    />
                    <SummaryRow
                      label="Contact"
                      value={`${data.firstName} ${data.lastName} · ${data.email}${data.phone ? ` · ${data.phone}` : ""}`}
                      onEdit={() => {
                        setStep(8);
                        scrollJourneyIntoView();
                      }}
                    />
                  </div>
                </>
              )}

              {error ? (
                <p
                  role="alert"
                  className="mt-6 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-[13px] text-red-700"
                >
                  {error}
                </p>
              ) : null}

              <div className="mt-10 flex items-center justify-between gap-4 border-t border-umber/10 pt-6">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest2 text-ink transition hover:text-ochre disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>

                {step === stepNames.length - 1 ? (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={submit}
                    className="inline-flex items-center gap-3 bg-ochre px-7 py-4 text-[10px] font-semibold uppercase tracking-widest2 text-white transition hover:bg-umber disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Send my journey"}
                    {!submitting ? <ArrowRight size={15} /> : null}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex items-center gap-3 bg-ochre px-7 py-4 text-[10px] font-semibold uppercase tracking-widest2 text-white transition hover:bg-umber"
                  >
                    Continue
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>

              {(step === 6 || step === 7) && (
                <button
                  type="button"
                  onClick={next}
                  className="mt-4 ml-auto block text-[10px] uppercase tracking-widest2 text-ink/50 underline underline-offset-4"
                >
                  Skip this step
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
