// import CTABooking from "@/components/Landing-Page/CTABooking";
// import LodgesHero from "@/components/Lodges/LodgesHero";
// import LodgeShowcase from "@/components/Lodges/LodgeShowcase";
// import LodgeBrowser from "@/components/Lodges/LodgeBrowser";
// import LodgeCategories from "@/components/Lodges/LodgeCategories";
// import LodgeFAQ from "@/components/Lodges/LodgeFAQ";

// export const metadata = {
//   title: "Lodges & Camps | Savannah Retreats Africa",
//   description:
//     "Nine hand-picked properties across the Maasai Mara, Amboseli, Samburu, Tsavo, the Rift Valley, and the Kenyan coast — tented camps, lodges, and private villas.",
// };

// export default function LodgesPage() {
//   return (
//     <main
//       className="relative"
//       style={{
//         backgroundImage:
//           "url('https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2400&auto=format&fit=crop')",
//         backgroundAttachment: "fixed",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <LodgesHero />
//       <LodgeShowcase />
//       <LodgeBrowser />
//       <LodgeCategories />
//       <LodgeFAQ />
//       <CTABooking />
//     </main>
//   );
// }
import CTABooking from "@/components/Landing-Page/CTABooking";
import LodgesHero from "@/components/Lodges/LodgesHero";
import LodgeShowcase from "@/components/Lodges/LodgeShowcase";
import LodgeBrowser from "@/components/Lodges/LodgeBrowser";
import LodgeCategories from "@/components/Lodges/LodgeCategories";
import LodgeFAQ from "@/components/Lodges/LodgeFAQ";

export const metadata = {
  title: "Lodges & Camps | Savannah Retreats Africa",
  description:
    "Nine hand-picked properties across the Maasai Mara, Amboseli, Samburu, Tsavo, the Rift Valley, and the Kenyan coast — tented camps, lodges, and private villas.",
};

export default function LodgesPage() {
  return (
    <main
      className="relative overflow-hidden" // ← added overflow-hidden
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2400&auto=format&fit=crop')",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <LodgesHero />
      <LodgeShowcase />
      <LodgeBrowser />
      <LodgeCategories />
      <LodgeFAQ />
      <CTABooking />
    </main>
  );
}
