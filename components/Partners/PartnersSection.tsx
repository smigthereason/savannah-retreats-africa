"use client";

import { useState } from "react";
import { Handshake, Tent, Car, Compass } from "lucide-react";
import { submitInquiry } from "@/lib/submitInquiry";

const SERVICE_TYPES = [
  "Accommodation & Lodging",
  "Transport",
  "Tour Guiding",
  "Activity or Experience",
  "Local Knowledge / Hidden Gem",
  "Other",
];

const BENEFITS = [
  {
    icon: Tent,
    title: "Run a camp, cabin, or lodge?",
    body: "We're always building relationships with new places to stay, especially off the well-worn circuit.",
  },
  {
    icon: Car,
    title: "Drive, guide, or handle transport?",
    body: "Reliable people on the ground are the backbone of every trip we plan — we'd like to know you exist.",
  },
  {
    icon: Compass,
    title: "Know a hidden gem?",
    body: "A viewpoint, a trail, a local experience travelers wouldn't find on their own — tell us about it.",
  },
];

export default function PartnersSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [serviceLocation, setServiceLocation] = useState("");
  const [message, setMessage] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await submitInquiry({
        type: "partner",
        name,
        email,
        phone: phone || undefined,
        businessName: businessName || undefined,
        serviceType: serviceType || undefined,
        serviceLocation: serviceLocation || undefined,
        message: message || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-linen w-full">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-28">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[0.8fr_1.2fr]">
          {/* Left: why partner with us */}
          <div>
            <span className="eyebrow">Work With Us</span>
            <h1 className="mt-4 font-display text-4xl text-umber md:text-5xl">
              Partner With Savannah Retreats
            </h1>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink">
              Every trip we build leans on people who actually know the
              ground — camp owners, drivers, guides, and locals who know
              the places worth seeing. If that's you, we'd like to hear
              from you.
            </p>

            <div className="mt-10 space-y-7">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex items-start gap-4">
                  <b.icon className="mt-0.5 h-5 w-5 text-ochre" strokeWidth={1.5} />
                  <div>
                    <p className="font-display text-lg text-umber">{b.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink/80">
                      {b.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-start gap-4 border-t border-umber/10 pt-8">
              <Handshake className="mt-0.5 h-5 w-5 text-ochre" strokeWidth={1.5} />
              <p className="text-[13px] leading-relaxed text-ink/80">
                This isn't a booking request — it's how we find out you
                exist. Our team reviews every submission and reaches out
                directly when there's a fit for an upcoming trip.
              </p>
            </div>
          </div>

          {/* Right: form card */}
          <div className="bg-sand px-8 py-10 md:px-12 md:py-12">
            {submitted ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <span className="eyebrow">Received</span>
                <h2 className="mt-4 font-display text-3xl text-umber">
                  Thank you for reaching out.
                </h2>
                <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink">
                  Our partnerships team will review your details and follow
                  up if there's a fit for an upcoming trip.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                      Your Name
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

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                      Phone (optional)
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-2 w-full border border-umber/15 bg-linen px-4 py-3 text-sm text-ink outline-none focus:border-ochre"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                      Business / Service Name (if any)
                    </span>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="mt-2 w-full border border-umber/15 bg-linen px-4 py-3 text-sm text-ink outline-none focus:border-ochre"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                      What do you offer?
                    </span>
                    <div className="relative mt-2">
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full appearance-none border border-umber/15 bg-linen px-4 py-3 pr-10 text-sm text-ink outline-none focus:border-ochre"
                      >
                        <option value="">Select one</option>
                        {SERVICE_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/50 text-xs">
                        ▾
                      </span>
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                      Where in Kenya
                    </span>
                    <input
                      type="text"
                      value={serviceLocation}
                      onChange={(e) => setServiceLocation(e.target.value)}
                      placeholder="e.g. Maasai Mara, Nairobi, Diani"
                      className="mt-2 w-full border border-umber/15 bg-linen px-4 py-3 text-sm text-ink placeholder:text-ink/40 outline-none focus:border-ochre"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                    Tell us more
                  </span>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What you offer, capacity, rates if relevant, and anything that makes it worth knowing about."
                    className="mt-2 w-full border border-umber/15 bg-linen px-4 py-3 text-sm text-ink placeholder:text-ink/40 outline-none focus:border-ochre"
                  />
                </label>

                {error && <p className="text-[13px] text-red-600">{error}</p>}

                <button type="submit" disabled={submitting} className="btn-ochre w-full disabled:opacity-60">
                  {submitting ? "Sending…" : "Submit Partnership Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
