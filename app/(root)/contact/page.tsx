import { Suspense } from "react";
import ContactHero from "@/components/Contact/ContactHero";
import ContactSection from "@/components/Contact/ContactSection";

export const metadata = {
  title: "Contact | Savannah Retreats Africa",
  description:
    "Get in touch with Savannah Retreats Africa — questions about a safari package, a property, or a custom Kenya itinerary.",
};

export default function ContactPage() {
  return (
    <main className="relative bg-linen">
      <ContactHero />
      <Suspense fallback={null}>
        <ContactSection />
      </Suspense>
    </main>
  );
}
