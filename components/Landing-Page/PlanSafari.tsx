"use client";

import { useState, useRef, useEffect } from "react";

// ── Calendar component (unchanged) ──
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
  // ... (same as before)
}

export default function PlanSafari() {
  const [dates, setDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [calOpen, setCalOpen] = useState(false);
  const calRef = useRef<HTMLDivElement>(null);

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

  return (
    <section id="packages" className="bg-sand py-20">
      <div className="section-pad mx-auto max-w-8xl">
        <span className="eyebrow">Check Availability</span>
        <h2 className="mt-4 font-display text-4xl text-umber md:text-5xl">
          Plan Your Safari
        </h2>

        <form className="mt-10 flex flex-col gap-px bg-umber/10 md:flex-row">
          <Field label="Destination">
            <select className="w-full bg-linen px-5 py-5 pr-12 text-sm text-ink outline-none appearance-none">
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
            <select className="w-full bg-linen px-5 py-5 pr-12 text-sm text-ink outline-none appearance-none">
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
            <select className="w-full bg-linen px-5 py-5 pr-12 text-sm text-ink outline-none appearance-none">
              <option>Safari Only</option>
              <option>Safari + Beach</option>
              <option>Honeymoon</option>
              <option>Private Custom</option>
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/50 text-xs">
              ▾
            </span>
          </Field>

          {/* ── Submit button changed to .btn-ochre ── */}
          <button type="submit" className="btn-ochre">
            Check Availability
          </button>
        </form>
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
