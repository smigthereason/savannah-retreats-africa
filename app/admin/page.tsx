import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { writeClient } from "@/lib/sanity/client";
import InquiryDashboard from "@/components/Admin/InquiryDashboard";
import type { Inquiry } from "@/lib/admin/types";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSessionToken,
} from "@/lib/admin/session";

export const dynamic = "force-dynamic";

async function getInquiries(): Promise<Inquiry[]> {
  return writeClient.fetch(
    `*[_type == "inquiry"] | order(coalesce(submittedAt, _createdAt) desc)`
  );
}

export default async function AdminInquiriesPage() {
  const cookieStore = await cookies();
  const currentUser = await readAdminSessionToken(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
  );

  if (!currentUser) redirect("/admin/login");

  const inquiries = await getInquiries();

  return <InquiryDashboard initialInquiries={inquiries} currentUser={currentUser} />;
}
