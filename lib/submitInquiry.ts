export type InquiryPayload = {
  type:
    | "contact"
    | "tripPlanner"
    | "booking"
    | "planSafari"
    | "partner"
    | "designJourney";

  name?: string;
  email: string;
  phone?: string;
  message?: string;

  reference?: { refType: string; label: string; slug?: string };

  // Optional overrides. In normal browser use these are populated
  // automatically below from window.location.pathname + document.title.
  sourcePath?: string;
  sourceLabel?: string;

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
};

export async function submitInquiry(payload: InquiryPayload) {
  const browserSource =
    typeof window !== "undefined"
      ? {
          sourcePath: window.location.pathname,
          sourceLabel:
            typeof document !== "undefined" ? document.title : undefined,
        }
      : {};

  const body = {
    ...browserSource,
    ...payload,
  };

  const res = await fetch("/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data.error || "Something went wrong. Please try again.",
    );
  }

  return data as { ok: true; id: string };
}
