import DiscoverHero from "@/components/Discover/DiscoverHero";
import DiscoverIntroSection from "@/components/Discover/DiscoverIntroSection";
import DiscoverCategorySection from "@/components/Discover/DiscoverCategorySection";
import {
  mountains,
  hills,
  forests,
  nationalParksAndReserves,
} from "@/lib/discover-data";

export const metadata = {
  title: "Discover Kenya | Savannah Retreats Africa",
  description:
    "Mountains, hills, forests, and national parks beyond the main safari circuit — Mount Kenya, the Aberdare Range, Chyulu and Ngong Hills, Kakamega Forest, and more.",
};

export default function DiscoverPage() {
  return (
    <main className="relative overflow-hidden">
      <DiscoverHero />
      <DiscoverIntroSection />
      <DiscoverCategorySection
        eyebrow="Peaks & Summits"
        headline="Mountains"
        intro="From a crater-rim day hike near Nairobi to a multi-day trek to Point Lenana, Kenya's mountains cover everything from a half-day outing to a serious expedition."
        entries={mountains}
        background="linen"
      />
      <DiscoverCategorySection
        eyebrow="Ridgelines & Volcanic Hills"
        headline="Hills"
        intro="Lower and more accessible than the mountains proper, but no less distinctive — ridge walks, lava-tube caves, and views that rival any summit."
        entries={hills}
        background="sand"
      />
      <DiscoverCategorySection
        eyebrow="Forests"
        headline="Forests"
        intro="Kenya's forests range from an urban escape inside Nairobi to the country's only true tropical rainforest — a different pace, and a different set of species, than the open savanna."
        entries={forests}
        background="linen"
      />
      <DiscoverCategorySection
        eyebrow="National Parks & Game Reserves"
        headline="Beyond the Mara and Amboseli"
        intro="The Mara, Amboseli, Tsavo, and Samburu anchor most itineraries — for travelers who want to go further, these parks offer their own wildlife, landscapes, and a much quieter experience."
        entries={nationalParksAndReserves}
        background="sand"
      />
    </main>
  );
}
