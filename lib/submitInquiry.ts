export type InquiryPayload = {
  type: "contact" | "tripPlanner" | "booking" | "planSafari";
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  reference?: { refType: string; label: string; slug?: string };
  destinations?: string[];
  tier?: string;
  dateStart?: string; // ISO date, e.g. "2026-08-01"
  dateEnd?: string;
  adults?: number;
  children?: number;
  destination?: string;
  packageChoice?: string;
};

export async function submitInquiry(payload: InquiryPayload) {
  const res = await fetch("/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  return data as { ok: true; id: string };
}
