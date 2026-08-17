import type { Metadata } from "next";
import DesignYourJourneyFunnel from "@/components/DesignYourJourney/DesignYourJourneyFunnel";

export const metadata: Metadata = {
  title: "Design Your Journey | Savannah Retreats Africa",
  description:
    "Tell Savannah Retreats Africa how you want to travel and begin shaping a personalised African journey.",
};

export default function DesignYourJourneyPage() {
  return (
    <main className="relative bg-linen">
      <DesignYourJourneyFunnel />
    </main>
  );
}
