import { writeClient } from "@/lib/sanity/client";
import InquiryDashboard from "@/components/Admin/InquiryDashboard";
import type { Inquiry } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

async function getInquiries(): Promise<Inquiry[]> {
  return writeClient.fetch(
    `*[_type == "inquiry"] | order(coalesce(submittedAt, _createdAt) desc)`
  );
}

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return <InquiryDashboard initialInquiries={inquiries} />;
}
