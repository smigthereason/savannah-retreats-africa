import Navbar from "@/components/Landing-Page/Navbar";
import Hero from "@/components/Landing-Page/Hero";
import Intro from "@/components/Landing-Page/Intro";
import PlanSafari from "@/components/Landing-Page/PlanSafari";
import Testimonial from "@/components/Landing-Page/Testimonial";
import Experiences from "@/components/Landing-Page/Experiences";
import Journal from "@/components/Landing-Page/Journal";
import CTABooking from "@/components/Landing-Page/CTABooking";
import Footer from "@/components/Landing-Page/Footer";

export default function Home() {
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
      <Navbar />
      <Hero />
      <Intro />
      <PlanSafari />
      <Testimonial />
      <Experiences />
      <Journal />
      <CTABooking />
      <Footer />
    </main>
  );
}
