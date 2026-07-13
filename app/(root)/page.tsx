import Hero from "@/components/Landing-Page/Hero";
import Intro from "@/components/Landing-Page/Intro";
import PlanSafari from "@/components/Landing-Page/PlanSafari";
import Testimonial from "@/components/Landing-Page/Testimonial";
import Experiences from "@/components/Landing-Page/Experiences";
import CultureTeaser from "@/components/Landing-Page/CultureTeaser";
import Journal from "@/components/Landing-Page/Journal";
import CTABooking from "@/components/Landing-Page/CTABooking";

export default function Home() {
  return (
    <main
      className="relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2400&auto=format&fit=crop')",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Hero />
      <Intro />
      <PlanSafari />
      <Testimonial />
      <Experiences />
      <CultureTeaser />
      <Journal />
      <CTABooking />
    </main>
  );
}
