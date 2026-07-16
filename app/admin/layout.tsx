import type { Metadata } from "next";

// Applies to every route under /admin (this page and /admin/login).
// Keeps the admin surface out of Google's index and out of any SEO
// tooling that might otherwise crawl and cache it — the password gate
// protects the *data*, this keeps the *URL* from being casually
// discoverable via search.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
