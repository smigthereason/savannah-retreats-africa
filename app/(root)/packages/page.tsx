import CTABooking from "@/components/Landing-Page/CTABooking";
import PackagesHero from "@/components/Packages/PackagesHero";
import PackageBrowser from "@/components/Packages/PackageBrowser";
import PricingTiers from "@/components/Packages/PricingTiers";
import PackageFAQ from "@/components/Packages/PackageFAQ";

export const metadata = {
  title: "Safari Packages | Savannah Retreats Africa",
  description:
    "Six curated Kenya safari itineraries across the Maasai Mara, Amboseli, the Rift Valley, and the coast — each with a private guide and vehicle from first night to last.",
};

export default function PackagesPage() {
  return (
    <main
      className="relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2400&auto=format&fit=crop')",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <PackagesHero />
      <PackageBrowser />
      <PricingTiers />
      <PackageFAQ />
      <CTABooking />
    </main>
  );
}
