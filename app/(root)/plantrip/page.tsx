import PlanTripHero from "@/components/PlanTrip/PlanTripHero";
import TripPlannerForm from "@/components/PlanTrip/TripPlannerForm";
import WhyPlanWithUs from "@/components/PlanTrip/WhyPlanWithUs";
import SecureYourVisit from "@/components/PlanTrip/SecureYourVisit";
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: "Plan Your Trip | Savannah Retreats Africa",
  description:
    "Tell us where, when, and with whom — get a custom Kenya safari itinerary built around your dates and preferences.",
};

export default function PlanTripPage() {
  return (
    <main className="relative bg-linen">
      <PlanTripHero />
      <TripPlannerForm />
      <WhyPlanWithUs />
      <SecureYourVisit />
    </main>
  );
}
