import AboutHero from "@/components/About/AboutHero";
import BridgeSection from "@/components/About/BridgeSection";
import WhatWeHandle from "@/components/About/WhatWeHandle";
import WhyUsBased from "@/components/About/WhyUsBased";
import ClosingStatement from "@/components/About/ClosingStatement";

export const metadata = {
  title: "About Us | Savannah Retreats Africa",
  description:
    "Savannah Retreats Africa is a US-based safari planning team bridging American travelers to Kenya — handling flights, luxury safari coordination, trusted local guiding, and 24/7 support.",
};

export default function AboutPage() {
  return (
    <main className="relative overflow-hidden">
      <AboutHero />
      <BridgeSection />
      <WhatWeHandle />
      <WhyUsBased />
      <ClosingStatement />
    </main>
  );
}
