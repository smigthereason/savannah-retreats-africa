"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, MapPin, PhoneCall } from "lucide-react";
import { footer } from "@/lib/data";
import { packages } from "@/lib/packages-data";
import { lodges } from "@/lib/lodges-data";

function useReference() {
  const searchParams = useSearchParams();
  const packageSlug = searchParams.get("package");
  const lodgeSlug = searchParams.get("lodge");

  return useMemo(() => {
    if (packageSlug) {
      const pkg = packages.find((p) => p.slug === packageSlug);
      if (pkg) return { type: "Package" as const, label: pkg.title };
    }
    if (lodgeSlug) {
      const lodge = lodges.find((l) => l.slug === lodgeSlug);
      if (lodge) return { type: "Property" as const, label: lodge.name };
    }
    return null;
  }, [packageSlug, lodgeSlug]);
}

export default function ContactSection() {
  const reference = useReference();
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (reference) {
      setMessage(`Re: ${reference.label} — I'd like more information about this ${reference.type.toLowerCase()}.`);
    }
  }, [reference]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to a real email/CRM endpoint — this just shows a confirmation state for now.
    setSubmitted(true);
  }

  return (
    <section className="bg-linen w-full">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-28">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[0.8fr_1.2fr]">
          {/* ── Left: contact info ───────────────────────────── */}
          <div>
            <span className="eyebrow">Get In Touch</span>
            <h2 className="mt-4 font-display text-4xl text-umber md:text-5xl">
              Let's Plan Something
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink">
              Tell us where you'd like to go, or send a question about a
              specific package or property. A Kenya-based trip designer
              replies to every enquiry within 24 hours.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <PhoneCall className="mt-0.5 h-5 w-5 text-ochre" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] uppercase tracking-widest2 text-ink/50">
                    Reservations
                  </p>
                  <p className="font-display text-lg text-umber">{footer.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="mt-0.5 h-5 w-5 text-ochre" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] uppercase tracking-widest2 text-ink/50">
                    Email
                  </p>
                  <a
                    href={`mailto:${footer.email}`}
                    className="font-display text-lg text-umber hover:text-ochre"
                  >
                    {footer.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="mt-0.5 h-5 w-5 text-ochre" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] uppercase tracking-widest2 text-ink/50">
                    Office
                  </p>
                  {footer.address.map((line) => (
                    <p key={line} className="text-[15px] text-umber">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: form card ─────────────────────────────── */}
          <div className="bg-sand px-8 py-10 md:px-12 md:py-12">
            {submitted ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <span className="eyebrow">Message Sent</span>
                <h3 className="mt-4 font-display text-3xl text-umber">
                  Thank you — we'll be in touch.
                </h3>
                <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink">
                  A trip designer will reply to your enquiry within 24 hours.
                  In the meantime, feel free to call the reservation line
                  above with any urgent questions.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {reference && (
                  <div className="flex items-center gap-2 bg-ochre/10 px-4 py-2.5 text-[12px] text-umber">
                    <span className="font-semibold uppercase tracking-widest2 text-ochre">
                      {reference.type}
                    </span>
                    {reference.label}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                      Full Name
                    </span>
                    <input
                      required
                      type="text"
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
                      className="mt-2 w-full border border-umber/15 bg-linen px-4 py-3 text-sm text-ink outline-none focus:border-ochre"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                    Phone (optional)
                  </span>
                  <input
                    type="tel"
                    className="mt-2 w-full border border-umber/15 bg-linen px-4 py-3 text-sm text-ink outline-none focus:border-ochre"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                    Message
                  </span>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-2 w-full border border-umber/15 bg-linen px-4 py-3 text-sm text-ink outline-none focus:border-ochre"
                  />
                </label>

                <button type="submit" className="btn-ochre w-full">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
