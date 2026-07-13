"use client";

/**
 * Shared across every booking / scheduling form (TripPlannerForm, CTABooking,
 * PlanSafari). Client requirement:
 *  - Children under 18 must each have their age captured (park & activity
 *    permits, kids' menus, and some lodges have minimum-age policies that
 *    depend on this).
 *  - Adults 65+ are flagged as a count, so guides can plan pacing, walking
 *    safaris, and medical/accessibility needs without asking every guest
 *    their exact age individually.
 *
 * This renders nothing when there are no children and no adults — mount it
 * unconditionally and it collapses itself.
 */

export type TravelerAgeDetailsValue = {
  childrenAges: number[];
  seniorAdults: number;
};

export function emptyTravelerAgeDetails(): TravelerAgeDetailsValue {
  return { childrenAges: [], seniorAdults: 0 };
}

/**
 * Keeps a childrenAges array in sync with a changing children count —
 * call this whenever the children number field changes.
 */
export function resizeChildrenAges(
  ages: number[],
  count: number
): number[] {
  const next = ages.slice(0, count);
  while (next.length < count) next.push(0);
  return next;
}

export default function TravelerAgeDetails({
  adults,
  children,
  value,
  onChange,
}: {
  adults: number;
  children: number;
  value: TravelerAgeDetailsValue;
  onChange: (next: TravelerAgeDetailsValue) => void;
}) {
  if (adults <= 0 && children <= 0) return null;

  function setChildAge(index: number, age: number) {
    const ages = [...value.childrenAges];
    ages[index] = age;
    onChange({ ...value, childrenAges: ages });
  }

  function setSeniorAdults(n: number) {
    const clamped = Math.max(0, Math.min(n, adults));
    onChange({ ...value, seniorAdults: clamped });
  }

  return (
    <div className="space-y-5 border border-umber/15 bg-linen px-5 py-5">
      {children > 0 && (
        <div>
          <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
            Ages of children under 18
          </span>
          <p className="mt-1 text-[12px] text-ink/50">
            Needed for park entry rates, kids' programs, and lodge age
            policies.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: children }).map((_, i) => (
              <label key={i} className="block">
                <span className="text-[10px] uppercase tracking-widest2 text-ink/50">
                  Child {i + 1}
                </span>
                <input
                  type="number"
                  min={0}
                  max={17}
                  required
                  value={value.childrenAges[i] ?? ""}
                  onChange={(e) => setChildAge(i, Number(e.target.value))}
                  placeholder="Age"
                  className="mt-1 w-full border border-umber/15 bg-sand px-3 py-2.5 text-sm text-ink outline-none focus:border-ochre"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {adults > 0 && (
        <div>
          <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
            Adults aged 65 and over
          </span>
          <p className="mt-1 text-[12px] text-ink/50">
            Helps us plan pacing and accessibility for walking safaris and
            long game drives.
          </p>
          <select
            value={value.seniorAdults}
            onChange={(e) => setSeniorAdults(Number(e.target.value))}
            className="mt-3 w-full max-w-[160px] appearance-none border border-umber/15 bg-sand px-4 py-2.5 text-sm text-ink outline-none focus:border-ochre"
          >
            {Array.from({ length: adults + 1 }).map((_, n) => (
              <option key={n} value={n}>
                {n} of {adults}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
