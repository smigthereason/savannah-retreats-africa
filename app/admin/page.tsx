import { writeClient } from "@/lib/sanity/client";
import InquiryDashboard from "@/components/Admin/InquiryDashboard";

export const dynamic = "force-dynamic"; // always fetch fresh, never cached

export type Inquiry = {
  _id: string;
  _createdAt: string;
  type: "contact" | "tripPlanner" | "booking" | "planSafari" | "partner";
  status: "new" | "contacted" | "booked" | "archived";
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  reference?: { refType: string; label: string; slug?: string };
  destinations?: string[];
  tier?: string;
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

async function getInquiries(): Promise<Inquiry[]> {
  return writeClient.fetch(
    `*[_type == "inquiry"] | order(coalesce(submittedAt, _createdAt) desc)`
  );
}

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();
  return <InquiryDashboard initialInquiries={inquiries} />;
}
