"use client";

export default function PlanSafari() {
  return (
    <section id="packages" className="bg-sand py-20">
      <div className="section-pad mx-auto max-w-8xl">
        <span className="eyebrow">Check Availability</span>
        <h2 className="mt-4 font-display text-4xl text-umber md:text-5xl">
          Plan Your Safari
        </h2>

        <form className="mt-10 flex flex-col gap-px bg-umber/10 md:flex-row">
          <Field label="Destination">
            <select className="w-full bg-linen px-5 py-5 text-sm text-ink outline-none">
              <option>Maasai Mara</option>
              <option>Amboseli</option>
              <option>Mount Kenya</option>
              <option>Diani Beach</option>
            </select>
          </Field>

          <Field label="Travel dates">
            <input
              type="text"
              placeholder="Add dates"
              className="w-full bg-linen px-5 py-5 text-sm text-ink placeholder:text-ink/50 outline-none"
            />
          </Field>

          <Field label="Travelers">
            <select className="w-full bg-linen px-5 py-5 text-sm text-ink outline-none">
              <option>2 Adults</option>
              <option>1 Adult</option>
              <option>3 Adults</option>
              <option>Family (4+)</option>
            </select>
          </Field>

          <Field label="Package">
            <select className="w-full bg-linen px-5 py-5 text-sm text-ink outline-none">
              <option>Safari Only</option>
              <option>Safari + Beach</option>
              <option>Honeymoon</option>
              <option>Private Custom</option>
            </select>
          </Field>

          <button
            type="submit"
            className="bg-ochre px-10 py-5 text-xs font-semibold uppercase tracking-widest2 text-linen transition-colors hover:bg-umber"
          >
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
    <label className="flex-1 bg-linen">
      <span className="sr-only">{label}</span>
      {children}
    </label>
  );
}
