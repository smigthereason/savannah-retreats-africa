import EngageHero from "@/components/Engage/EngageHero";
import EngageSection from "@/components/Engage/EngageSection";

export const metadata = {
  title: "Engage With Us | Savannah Retreats Africa",
  description:
    "For lodges, camps, guides, drivers, and local experience providers across Kenya who want to work with Savannah Retreats Africa.",
};

export default function EngagePage() {
  return (
    <main className="relative overflow-hidden">
      <EngageHero />
      <EngageSection />
    </main>
  );
}
