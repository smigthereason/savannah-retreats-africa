import CultureHero from "@/components/Culture/CultureHero";
import TribesSection from "@/components/Culture/TribesSection";
import MuseumsSection from "@/components/Culture/MuseumsSection";
import MatatuSwahiliSection from "@/components/Culture/MatatuSwahiliSection";
import ImpactSection from "@/components/Culture/ImpactSection";
import EventsSection from "@/components/Culture/EventsSection";

export const metadata = {
  title: "Culture & Heritage | Savannah Retreats Africa",
  description:
    "Kenya's 47 tribes, Swahili coastal heritage, matatu street culture, museums, community give-back experiences, and local events.",
};

export default function CulturePage() {
  return (
    <main className="relative overflow-hidden">
      <CultureHero />
      <TribesSection />
      <MuseumsSection />
      <MatatuSwahiliSection />
      <ImpactSection />
      <EventsSection />
    </main>
  );
}
