"use client";

import { trustedBy, intro } from "@/lib/data";
import { useState, useRef, useEffect } from "react";
import { PhoneCall } from "lucide-react";
import { submitInquiry } from "@/lib/submitInquiry";
import TravelerAgeDetails, {
  emptyTravelerAgeDetails,
  resizeChildrenAges,
  type TravelerAgeDetailsValue,
} from "@/components/shared/TravelerAgeDetails";

// ── Minimal inline calendar ──────────────────────────────────────────────────
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function Calendar({
  selected,
  onSelect,
  onClose,
}: {
  selected: { start: Date | null; end: Date | null };
  onSelect: (d: Date) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const next = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const isSelected = (d: Date) => {
    if (selected.start && d.toDateString() === selected.start.toDateString())
      return "start";
    if (selected.end && d.toDateString() === selected.end.toDateString())
      return "end";
    return null;
  };

  const isInRange = (d: Date) => {
    if (!selected.start || !selected.end) return false;
    return d > selected.start && d < selected.end;
  };

  const isPast = (d: Date) => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(viewYear, viewMonth, i + 1),
    ),
  ];

  return (
    <div className="absolute top-full left-0 z-50 mt-2 w-72 bg-linen border border-umber/15 shadow-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prev}
          className="p-1 hover:text-ochre transition-colors text-ink/60 text-lg leading-none"
        >
          ‹
        </button>
        <span className="font-display text-sm text-umber">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={next}
          className="p-1 hover:text-ochre transition-colors text-ink/60 text-lg leading-none"
        >
          ›
        </button>
      </div>
      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold uppercase tracking-wider text-ink/40 py-1"
          >
            {d}
          </div>
        ))}
      </div>
      {/* Cells */}
      <div className="grid grid-cols-7">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const sel = isSelected(date);
          const inRange = isInRange(date);
          const past = isPast(date);
          return (
            <button
              key={i}
              disabled={past}
              onClick={() => !past && onSelect(date)}
              className={[
                "h-8 w-8 mx-auto flex items-center justify-center text-xs transition-colors",
                past
                  ? "text-ink/20 cursor-not-allowed"
                  : "hover:bg-ochre/20 cursor-pointer",
                sel === "start" || sel === "end"
                  ? "bg-ochre text-linen font-semibold"
                  : "",
                inRange ? "bg-ochre/15 text-umber" : "",
              ].join(" ")}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex justify-between items-center border-t border-umber/10 pt-3">
        <span className="text-[10px] uppercase tracking-wider text-ink/40">
          {selected.start && !selected.end
            ? "Select end date"
            : !selected.start
              ? "Select start date"
              : ""}
        </span>
        {(selected.start || selected.end) && (
          <button
            onClick={onClose}
            className="text-[10px] uppercase tracking-wider text-ochre font-semibold hover:underline"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CTABooking() {
  const [dates, setDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [calOpen, setCalOpen] = useState(false);
  const calRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [adults, setAdults] = useState("");
  const [childrenCount, setChildrenCount] = useState("");
  const [ageDetails, setAgeDetails] = useState<TravelerAgeDetailsValue>(
    emptyTravelerAgeDetails()
  );
  // "3+" / "2+" style select values — parseInt reads the leading number
  const adultsNum = adults ? parseInt(adults, 10) : 0;
  const childrenNum = childrenCount ? parseInt(childrenCount, 10) : 0;

  function handleChildrenCountChange(v: string) {
    setChildrenCount(v);
    const n = v ? parseInt(v, 10) : 0;
    setAgeDetails((prev) => ({
      ...prev,
      childrenAges: resizeChildrenAges(prev.childrenAges, n),
    }));
  }
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDateSelect = (d: Date) => {
    if (!dates.start || (dates.start && dates.end)) {
      setDates({ start: d, end: null });
    } else if (d < dates.start) {
      setDates({ start: d, end: dates.start });
    } else {
      setDates((prev) => ({ ...prev, end: d }));
    }
  };

  const formatRange = () => {
    if (!dates.start) return "";
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    return dates.end
      ? `${fmt(dates.start)} – ${fmt(dates.end)}`
      : fmt(dates.start);
  };

  // Close calendar on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node))
        setCalOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  async function handleCheckAvailability() {
    if (!email) {
      setError("Enter your email so we can send availability.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await submitInquiry({
        type: "booking",
        email,
        dateStart: dates.start ? dates.start.toISOString().slice(0, 10) : undefined,
        dateEnd: dates.end ? dates.end.toISOString().slice(0, 10) : undefined,
        adults: adultsNum || undefined,
        children: childrenNum || undefined,
        childrenAges: childrenNum > 0 ? ageDetails.childrenAges : undefined,
        seniorAdults: ageDetails.seniorAdults || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="relative">
      {/* Transparent overlay — lets the fixed parallax bg show through */}
      <div className="absolute inset-0 bg-umber/50 pointer-events-none" />

      <div className="relative z-10 section-pad mx-auto max-w-8xl py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* ── Left: image card + phone ─────────────────────────── */}
          <div className="relative min-h-[420px]">
            <div className="absolute inset-0 bg-umber/30 backdrop-blur-sm" />
            <div className="relative z-10 flex h-full flex-col justify-end p-10">
              <span className="text-ochre">★★★★★</span>
              <p className="mt-4 max-w-sm font-display text-2xl leading-snug text-linen">
                Every trip includes a private guide, vehicle, and camp from
                first night to last.
              </p>
              <div className="mt-8 flex flex-row items-center gap-4">
                {/* strokeWidth={1.5} creates a thinner, more premium luxury line profile */}
                <PhoneCall
                  className="h-10 w-10 text-ochre shrink-0"
                  strokeWidth={0.5}
                />
                <div className="flex flex-col leading-tight">
                  <p className="text-[10px] uppercase tracking-widest2 text-linen/60">
                    {intro.phoneLabel}
                  </p>
                  <p className="font-display text-xl text-linen mt-0.5">
                    {intro.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: floating booking card ─────────────────────── */}
          <div className="flex justify-start ">
            <div className="w-full max-w-sm bg-sand px-8 py-10 md:px-10 shadow-2xl">
              <span className="eyebrow">Safari Packages</span>
              <h2 className="mt-4 font-display text-3xl text-umber md:text-4xl">
                Request a Booking
              </h2>

              {submitted ? (
                <p className="mt-8 text-[14px] leading-relaxed text-ink">
                  Thanks — we've got your dates. A trip designer will email
                  availability within 24 hours.
                </p>
              ) : (
                <div className="mt-8 space-y-4">
                  {/* Date range input + calendar */}
                  <div className="relative" ref={calRef}>
                    <input
                      type="text"
                      readOnly
                      onClick={() => setCalOpen((o) => !o)}
                      value={formatRange()}
                      placeholder="Travel dates"
                      className="w-full border border-umber/15 bg-linen px-5 pr-12 py-4 text-sm text-ink placeholder:text-ink/50 outline-none focus:border-ochre cursor-pointer"
                    />
                    {/* calendar icon */}
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 text-base">
                      📅
                    </span>
                    {calOpen && (
                      <Calendar
                        selected={dates}
                        onSelect={handleDateSelect}
                        onClose={() => setCalOpen(false)}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <select
                        value={adults}
                        onChange={(e) => setAdults(e.target.value)}
                        className="w-full appearance-none border border-umber/15 bg-linen pl-5 pr-10 py-4 text-sm text-ink outline-none focus:border-ochre"
                      >
                        <option value="">Adults</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3+</option>
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/50 text-xs">
                        ▾
                      </span>
                    </div>
                    <div className="relative">
                      <select
                        value={childrenCount}
                        onChange={(e) => handleChildrenCountChange(e.target.value)}
                        className="w-full appearance-none border border-umber/15 bg-linen pl-5 pr-10 py-4 text-sm text-ink outline-none focus:border-ochre"
                      >
                        <option value="">Children</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2+</option>
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/50 text-xs">
                        ▾
                      </span>
                    </div>
                  </div>

                  <TravelerAgeDetails
                    adults={adultsNum}
                    children={childrenNum}
                    value={ageDetails}
                    onChange={setAgeDetails}
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full border border-umber/15 bg-linen px-5 py-4 text-sm text-ink placeholder:text-ink/50 outline-none focus:border-ochre"
                  />

                  {error && <p className="text-[12px] text-red-200">{error}</p>}

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleCheckAvailability}
                    className="btn-ochre w-full disabled:opacity-60"
                  >
                    {submitting ? "Sending…" : "Check Availability"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trusted-by bar */}
      <div className="relative z-10 border-t border-linen/10 bg-umber/30 backdrop-blur-sm py-8">
        <div className="section-pad mx-auto flex max-w-8xl flex-wrap items-center justify-center gap-x-14 gap-y-3">
          {trustedBy.map((name) => (
            <span key={name} className="font-display text-lg text-linen/60">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
