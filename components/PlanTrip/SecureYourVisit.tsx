import { Landmark, ShieldCheck, HeartPulse } from "lucide-react";

const PILLARS = [
  {
    icon: Landmark,
    eyebrow: "Reserve Your Dates",
    title: "A Deposit Holds Your Trip",
    body: [
      "Once your itinerary is confirmed, a 30% deposit secures your dates, camps, and guide allocation — availability at smaller camps is genuinely limited, especially in peak season.",
      "The balance is due closer to travel, typically 60 days out. Payment is by bank transfer or a secure payment link, arranged directly with your trip designer once you're ready to book.",
    ],
  },
  {
    icon: ShieldCheck,
    eyebrow: "Travel Protection",
    title: "Insurance We Ask Every Traveler to Have",
    body: [
      "We require every traveler to carry comprehensive travel insurance, including emergency medical evacuation coverage — genuinely essential for safari travel, where the nearest hospital can be hours away by air.",
      "We don't underwrite or sell insurance ourselves, but we'll ask for proof of coverage before your trip and can point you toward reputable providers if you don't already have one you trust.",
    ],
  },
  {
    icon: HeartPulse,
    eyebrow: "Safety & Well-Being",
    title: "Looked After, Start to Finish",
    body: [
      "Every guide is briefed on your itinerary and reachable throughout your trip. In parks, you'll follow standard safari safety practices — staying in the vehicle during game drives unless your guide says otherwise, for one.",
      "Talk to a travel health provider about routine precautions (malaria prevention is the main one for most of Kenya) well before you fly — we're glad to point you toward current guidance, but this one's between you and a doctor.",
    ],
  },
];

export default function SecureYourVisit() {
  return (
    <section className="bg-sand py-24 md:py-28">
      <div className="section-pad mx-auto max-w-8xl">
        <span className="eyebrow">Secure Your Visit</span>
        <h2 className="mt-4 max-w-xl font-display text-4xl text-umber md:text-5xl">
          What "Booked" Actually Means
        </h2>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink">
          Three things worth understanding before your trip is confirmed —
          how your dates get held, what protection we ask you to carry,
          and how we look after you once you're on the ground.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="bg-linen px-7 py-9">
              <p.icon className="h-7 w-7 text-ochre" strokeWidth={1.5} />
              <p className="mt-5 text-[10px] uppercase tracking-widest2 text-ink/50">
                {p.eyebrow}
              </p>
              <h3 className="mt-2 font-display text-xl text-umber">
                {p.title}
              </h3>
              <div className="mt-3 space-y-3">
                {p.body.map((paragraph, i) => (
                  <p key={i} className="text-[13px] leading-relaxed text-ink/80">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
