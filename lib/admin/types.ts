export const INQUIRY_TYPE_META = {
  contact: { label: "Contact Form", shortLabel: "Contact" },
  tripPlanner: { label: "Trip Planner", shortLabel: "Trip Planner" },
  booking: { label: "Booking Request", shortLabel: "Booking" },
  planSafari: { label: "Plan Safari", shortLabel: "Plan Safari" },
  partner: { label: "Engagement Inquiry", shortLabel: "Partners" },
  designJourney: { label: "Design Your Journey", shortLabel: "Journey" },
} as const;

export type InquiryType = keyof typeof INQUIRY_TYPE_META;

export const INQUIRY_STATUS_META = {
  new: { label: "New" },
  contacted: { label: "Contacted" },
  booked: { label: "Booked" },
  archived: { label: "Archived" },
} as const;

export type InquiryStatus = keyof typeof INQUIRY_STATUS_META;

export type Inquiry = {
  _id: string;
  _createdAt: string;
  type: InquiryType;
  status: InquiryStatus;

  name?: string;
  email: string;
  phone?: string;
  message?: string;

  // Where the submission actually happened. New enquiries populate these
  // automatically through lib/submitInquiry.ts.
  sourcePath?: string;
  sourceLabel?: string;

  reference?: { refType: string; label: string; slug?: string };

  destinations?: string[];
  tier?: string;

  // Design Your Journey
  experiences?: string[];
  travellerType?: string;
  travelTiming?: string;
  travelMonth?: string;
  duration?: string;
  budget?: string;
  accommodationPreferences?: string[];
  interests?: string[];

  dateStart?: string;
  dateEnd?: string;
  adults?: number;
  children?: number;
  childrenAges?: number[];
  seniorAdults?: number;

  destination?: string;
  packageChoice?: string;
  accessibilityNeeds?: string;

  businessName?: string;
  serviceType?: string;
  serviceLocation?: string;

  submittedAt?: string;
};
