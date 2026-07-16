import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-umber/10 bg-linen">
        <div className="mx-auto flex max-w-8xl items-center justify-between gap-4 px-6 py-3 md:px-10">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image
              src="/logo-no-bg.png"
              alt="Savannah Retreats Africa"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="text-[13px] font-medium uppercase tracking-widest2 text-umber">
              Admin
            </span>
          </Link>
          <Link
            href="/"
            className="text-[11px] uppercase tracking-widest2 text-ink/60 hover:text-ochre"
          >
            View live site →
          </Link>
        </div>
      </header>
      {children}
    </>
  );
}
