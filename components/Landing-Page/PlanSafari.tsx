"use client";

import { useState, useRef, useEffect } from "react";
import { submitInquiry } from "@/lib/submitInquiry";

// ── Calendar component ──
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

export default function PlanSafari() {
  const [destination, setDestination] = useState("Maasai Mara");
  const [dates, setDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [calOpen, setCalOpen] = useState(false);
  const calRef = useRef<HTMLDivElement>(null);
  const [travelers, setTravelers] = useState("2 Adults");
  const [packageChoice, setPackageChoice] = useState("Safari Only");
  const [email, setEmail] = useState("");

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

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node))
        setCalOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await submitInquiry({
        type: "planSafari",
        email,
        destination,
        packageChoice,
        dateStart: dates.start ? dates.start.toISOString().slice(0, 10) : undefined,
        dateEnd: dates.end ? dates.end.toISOString().slice(0, 10) : undefined,
        message: `Travelers: ${travelers}`,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="packages" className="bg-sand py-20">
      <div className="section-pad mx-auto max-w-8xl">
        <span className="eyebrow">Check Availability</span>
        <h2 className="mt-4 font-display text-4xl text-umber md:text-5xl">
          Plan Your Safari
        </h2>

        {submitted ? (
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink">
            Thanks — we've got your request. A trip designer will email
            availability and pricing within 24 hours.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-px bg-umber/10 md:flex-row md:flex-wrap">
            <Field label="Destination">
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-linen px-5 py-5 pr-12 text-sm text-ink outline-none appearance-none"
              >
                <option>Maasai Mara</option>
                <option>Amboseli</option>
                <option>Mount Kenya</option>
                <option>Diani Beach</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/50 text-xs">
                ▾
              </span>
            </Field>

            <Field label="Travel dates">
              <div className="relative" ref={calRef}>
                <input
                  type="text"
                  readOnly
                  onClick={() => setCalOpen((o) => !o)}
                  value={formatRange()}
                  placeholder="Add dates"
                  className="w-full bg-linen px-5 py-5 pr-12 text-sm text-ink placeholder:text-ink/50 outline-none cursor-pointer"
                />
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
            </Field>

            <Field label="Travelers">
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full bg-linen px-5 py-5 pr-12 text-sm text-ink outline-none appearance-none"
              >
                <option>2 Adults</option>
                <option>1 Adult</option>
                <option>3 Adults</option>
                <option>Family (4+)</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/50 text-xs">
                ▾
              </span>
            </Field>

            <Field label="Package">
              <select
                value={packageChoice}
                onChange={(e) => setPackageChoice(e.target.value)}
                className="w-full bg-linen px-5 py-5 pr-12 text-sm text-ink outline-none appearance-none"
              >
                <option>Safari Only</option>
                <option>Safari + Beach</option>
                <option>Honeymoon</option>
                <option>Private Custom</option>
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/50 text-xs">
                ▾
              </span>
            </Field>

            <Field label="Email">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full bg-linen px-5 py-5 text-sm text-ink placeholder:text-ink/50 outline-none"
              />
            </Field>

            <button type="submit" disabled={submitting} className="btn-ochre disabled:opacity-60">
              {submitting ? "Sending…" : "Check Availability"}
            </button>

            {error && (
              <p className="w-full bg-linen px-5 py-3 text-[12px] text-red-600">{error}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex-1 bg-linen relative">
      <span className="sr-only">{label}</span>
      {children}
    </label>
  );
}
