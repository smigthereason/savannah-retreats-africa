"use client";

import { useMemo, useState } from "react";
import { Mail, Phone, Calendar as CalendarIcon, Users } from "lucide-react";
import type { Inquiry } from "@/app/admin/page";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "booked", label: "Booked" },
  { value: "archived", label: "Archived" },
] as const;

const TYPE_LABELS: Record<Inquiry["type"], string> = {
  contact: "Contact Form",
  tripPlanner: "Trip Planner",
  booking: "Booking Request",
  planSafari: "Plan Safari",
};

const STATUS_COLORS: Record<Inquiry["status"], string> = {
  new: "bg-ochre text-linen",
  contacted: "bg-acacia text-linen",
  booked: "bg-umber text-linen",
  archived: "bg-ink/20 text-ink",
};

// The Gmail account replies should be sent from. Opens Gmail's web
// compose window scoped to this account (via `authuser`), which is far
// more reliable than a plain mailto: link — that just hands off to
// whatever mail app happens to be your OS default.
const REPLY_FROM = "savannahretreatsafricaa@gmail.com";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildReplyUrl(inquiry: Inquiry) {
  const subject = `Re: Your enquiry — Savannah Retreats Africa`;
  const body = `Hi ${inquiry.name || "there"},\n\nThanks for reaching out to Savannah Retreats Africa.\n\n`;
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: inquiry.email,
    su: subject,
    body,
    authuser: REPLY_FROM,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export default function InquiryDashboard({
  initialInquiries,
}: {
  initialInquiries: Inquiry[];
}) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTERS)[number]["value"]>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const visible = useMemo(() => {
    if (statusFilter === "all") return inquiries;
    return inquiries.filter((i) => i.status === statusFilter);
  }, [inquiries, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: inquiries.length };
    for (const i of inquiries) c[i.status] = (c[i.status] || 0) + 1;
    return c;
  }, [inquiries]);

  async function updateStatus(id: string, status: Inquiry["status"]) {
    setPendingId(id);
    const prev = inquiries;
    setInquiries((cur) => cur.map((i) => (i._id === id ? { ...i, status } : i)));
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setInquiries(prev); // revert on failure
    } finally {
      setPendingId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <section className="bg-linen w-full min-h-screen">
      <div className="section-pad mx-auto max-w-8xl py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">Admin</span>
            <h1 className="mt-3 font-display text-4xl text-umber md:text-5xl">
              Inquiries
            </h1>
            <p className="mt-3 text-[14px] text-ink/70">
              Everything submitted through Contact, Trip Planner, Booking, and
              Plan Safari.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[11px] uppercase tracking-widest2 text-ochre hover:underline"
          >
            Sign out
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`border px-5 py-2.5 text-[11px] font-medium uppercase tracking-widest2 transition-colors ${
                statusFilter === f.value
                  ? "border-ochre bg-ochre text-linen"
                  : "border-umber/20 text-umber hover:border-ochre hover:text-ochre"
              }`}
            >
              {f.label}
              <span className="ml-1.5 opacity-70">({counts[f.value] || 0})</span>
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {visible.map((inquiry) => (
            <div key={inquiry._id} className="bg-sand px-6 py-6 md:px-7 md:py-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest2 text-ink/50">
                    {TYPE_LABELS[inquiry.type]} ·{" "}
                    {formatDate(inquiry.submittedAt || inquiry._createdAt)}
                  </span>
                  <h3 className="mt-1.5 font-display text-2xl text-umber">
                    {inquiry.name || inquiry.email}
                  </h3>
                </div>
                <span
                  className={`shrink-0 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest2 ${
                    STATUS_COLORS[inquiry.status]
                  }`}
                >
                  {inquiry.status}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-[13px] text-ink/85">
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-ochre" strokeWidth={1.5} />
                  {inquiry.email}
                </p>
                {inquiry.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-ochre" strokeWidth={1.5} />
                    {inquiry.phone}
                  </p>
                )}
                {(inquiry.dateStart || inquiry.dateEnd) && (
                  <p className="flex items-center gap-2">
                    <CalendarIcon className="h-3.5 w-3.5 text-ochre" strokeWidth={1.5} />
                    {formatDate(inquiry.dateStart)} – {formatDate(inquiry.dateEnd)}
                  </p>
                )}
                {(inquiry.adults || inquiry.children) && (
                  <p className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-ochre" strokeWidth={1.5} />
                    {inquiry.adults || 0} adults, {inquiry.children || 0} children
                  </p>
                )}
              </div>

              {inquiry.reference && (
                <div className="mt-3 flex items-center gap-2 bg-ochre/10 px-3 py-2 text-[12px] text-umber">
                  <span className="font-semibold uppercase tracking-widest2 text-ochre">
                    {inquiry.reference.refType}
                  </span>
                  {inquiry.reference.label}
                </div>
              )}

              {inquiry.destinations && inquiry.destinations.length > 0 && (
                <p className="mt-3 text-[12px] text-ink/70">
                  <span className="text-ink/50">Destinations: </span>
                  {inquiry.destinations.join(", ")}
                </p>
              )}

              {inquiry.destination && (
                <p className="mt-3 text-[12px] text-ink/70">
                  <span className="text-ink/50">Destination: </span>
                  {inquiry.destination}
                </p>
              )}

              {inquiry.tier && (
                <p className="mt-1 text-[12px] text-ink/70">
                  <span className="text-ink/50">Comfort tier: </span>
                  {inquiry.tier}
                </p>
              )}

              {inquiry.packageChoice && (
                <p className="mt-1 text-[12px] text-ink/70">
                  <span className="text-ink/50">Package: </span>
                  {inquiry.packageChoice}
                </p>
              )}

              {inquiry.message && (
                <p className="mt-4 border-t border-umber/10 pt-4 text-[13px] leading-relaxed text-ink">
                  {inquiry.message}
                </p>
              )}

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-umber/10 pt-5">
                <div className="relative">
                  <select
                    value={inquiry.status}
                    disabled={pendingId === inquiry._id}
                    onChange={(e) =>
                      updateStatus(inquiry._id, e.target.value as Inquiry["status"])
                    }
                    className="appearance-none border border-umber/15 bg-linen pl-4 pr-9 py-2.5 text-[12px] text-ink outline-none focus:border-ochre disabled:opacity-60"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="booked">Booked</option>
                    <option value="archived">Archived</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 text-xs">
                    ▾
                  </span>
                </div>

                <a
                  href={buildReplyUrl(inquiry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ochre"
                >
                  Reply by Email
                </a>
              </div>
            </div>
          ))}

          {visible.length === 0 && (
            <p className="text-[14px] text-ink/60">No inquiries in this view yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
