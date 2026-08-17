import ContactHero from "@/components/Contact/ContactHero";
import DesignYourJourneyFunnel from "@/components/DesignYourJourney/DesignYourJourneyFunnel";

// -------------------------------------------------------------------
// ORIGINAL STANDARD CONTACT FORM
// Kept here intentionally so it can be restored immediately after the
// Design Your Journey user test.
//
// import { Suspense } from "react";
// import ContactSection from "@/components/Contact/ContactSection";
// -------------------------------------------------------------------

export const metadata = {
  title: "Contact | Savannah Retreats Africa",
  description:
    "Get in touch with Savannah Retreats Africa — questions about a safari package, a property, or a custom Kenya itinerary.",
};

export default function ContactPage() {
  return (
    <main className="relative bg-linen">
      <ContactHero />

      {/*
        ==============================================================
        ORIGINAL FORM — COMMENTED OUT FOR DESIGN YOUR JOURNEY TESTING
        ==============================================================

        <Suspense fallback={null}>
          <ContactSection />
        </Suspense>

        To roll back:
        1. Re-enable the Suspense and ContactSection imports above.
        2. Uncomment this block.
        3. Comment out <DesignYourJourneyFunnel /> below.
      */}

      <DesignYourJourneyFunnel />
    </main>
  );
}
