export type FaqItem = {
  category: "Safety & Security" | "Planning" | "On Safari";
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    category: "Safety & Security",
    question: "Is Kenya safe for tourists?",
    answer:
      "Millions of visitors travel through Kenya's established tourism areas, but no destination is risk-free. We build itineraries around established safari circuits, use professional local partners, and adjust routing when conditions or official travel guidance require it. Guests should also follow the travel advice issued by their own government before departure.",
  },
  {
    category: "Safety & Security",
    question: "Could I be kidnapped while travelling in Kenya?",
    answer:
      "Kidnapping is not a normal part of travel on established safari itineraries, but it is reasonable to ask about it. We do not design guest routes through areas where current security conditions make leisure travel inappropriate. Transfers, guides, accommodation, and movements are planned in advance, and routes can be changed if the security picture changes. No operator can promise zero risk, so we also recommend reviewing current official travel advisories before you travel.",
  },
  {
    category: "Safety & Security",
    question: "What happens if the security situation changes during my trip?",
    answer:
      "We prioritise keeping guests away from developing security issues. If a route, region, or transfer becomes unsuitable, the itinerary can be adjusted in coordination with guides, properties, transport partners, and the guest. The exact response depends on the location and circumstances at the time.",
  },
  {
    category: "Safety & Security",
    question: "How are guides, drivers, and transfer partners selected?",
    answer:
      "We work with experienced local partners suited to the route and type of trip being planned. For private journeys, transport and guiding arrangements are confirmed before travel so guests know who is meeting them and where. We also recommend that guests avoid accepting unplanned rides or unofficial guiding offers while travelling.",
  },
  {
    category: "On Safari",
    question: "Is it safe to be close to wild animals?",
    answer:
      "Wild animals should always be treated as wild. Game drives and camp activities are conducted according to the rules of the park, conservancy, guide, and property. Guests should remain inside vehicles when instructed, never approach or feed wildlife, and follow staff directions around camps, particularly after dark.",
  },
  {
    category: "On Safari",
    question: "Is road travel between parks and lodges safe?",
    answer:
      "Road conditions vary considerably by region and season. Where road transfers are part of an itinerary, we plan realistic journey times and use suitable vehicles and drivers. In some cases a domestic flight may be the more practical option, and we can discuss that while designing the trip.",
  },
  {
    category: "On Safari",
    question: "Can I travel to Kenya on my own?",
    answer:
      "Yes. Solo travellers can have a fully planned private itinerary with airport transfers, guides, accommodation, and internal transport arranged in advance. If travelling alone is a concern, tell us early so we can design the journey with fewer unstructured transfers and clearer meet-and-assist points.",
  },
  {
    category: "Planning",
    question: "Do I need travel insurance?",
    answer:
      "We strongly recommend comprehensive travel insurance that is appropriate for your itinerary, including medical treatment, evacuation, cancellations, delays, and the activities you plan to do. Coverage differs by provider and country, so check the policy wording carefully before purchasing.",
  },
  {
    category: "Planning",
    question: "What if I have a medical emergency while travelling?",
    answer:
      "Emergency arrangements depend on where you are travelling, since remote safari areas can be far from major hospitals. Your itinerary can be planned with access and evacuation considerations in mind, but guests should carry suitable medical and evacuation insurance and share any practical mobility or medical requirements that affect trip planning before departure.",
  },
  {
    category: "Planning",
    question: "What vaccinations or health preparation do I need?",
    answer:
      "Health requirements depend on your nationality, travel history, destination within Kenya, and personal medical circumstances. We can flag practical travel considerations, but medical advice should come from a qualified clinician or travel-health service, ideally with enough time before departure to complete any recommended preparation.",
  },
  {
    category: "Planning",
    question: "Do I need a visa or other entry documents?",
    answer:
      "Entry requirements depend on your passport and can change. Before travelling, check Kenya's official immigration guidance and the travel advice issued by your own government. Your passport should also meet the validity requirements that apply to your trip dates.",
  },
  {
    category: "Planning",
    question: "What happens if my international flight is delayed?",
    answer:
      "Send us the updated flight details as soon as you have them. Where possible, transfers and the first part of the itinerary can be adjusted around the new arrival time. Any additional costs or rebooking requirements depend on the airline, property, transfer, and booking terms involved.",
  },
];
