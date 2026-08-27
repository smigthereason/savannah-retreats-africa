import type { Metadata } from 'next';
import FAQHero from "@/components/FAQ/FAQHero";
import FAQSection from "@/components/FAQ/FAQSection";
import FAQCTA from "@/components/FAQ/FAQCTA";

export const metadata: Metadata = {
  title: "FAQ | Savannah Retreats Africa",
  description:
    "Answers to common questions about safari safety, security, planning, insurance, travel documents, wildlife, and travelling in Kenya.",
};

export default function FAQPage() {
  return (
    <main className="bg-linen">
      <FAQHero />
      <FAQSection />
      <FAQCTA />
    </main>
  );
}
