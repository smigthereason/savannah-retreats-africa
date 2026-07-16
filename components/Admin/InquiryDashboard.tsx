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

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// No documented/verified compose-prefill URL exists for Namecheap's
// Private Email webmail (its compose window appears to be a modal that
// doesn't change the URL) — so rather than guess at query params that
// might silently do nothing, this opens the shared Inbox itself. Every
// team member logs in as info@savannahretreatsafrica.com, not their own
// personal mail app, which is the actual problem this solves — the
// recipient/subject/body just won't be pre-filled, unlike the in-app
// reply composer above, which should cover most day-to-day replies.
const PRIVATE_EMAIL_INBOX_URL = "https://privateemail.com/spm/mail/?f=INBOX";

const CSV_COLUMNS: (keyof Inquiry)[] = [
  "_createdAt",
  "submittedAt",
  "type",
  "status",
  "name",
  "email",
  "phone",
  "message",
  "destination",
  "destinations",
  "tier",
  "dateStart",
  "dateEnd",
  "adults",
  "children",
  "childrenAges",
  "seniorAdults",
  "packageChoice",
];

function csvEscape(value: unknown) {
  if (value === undefined || value === null) return "";
  const str = Array.isArray(value) ? value.join("; ") : String(value);
  // Quote any field containing a comma, quote, or newline; double up
  // internal quotes per RFC 4180.
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCsv(rows: Inquiry[]) {
  const header = CSV_COLUMNS.join(",");
  const body = rows
    .map((row) => CSV_COLUMNS.map((col) => csvEscape(row[col])).join(","))
    .join("\n");
  const csv = `${header}\n${body}`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function defaultReplyDraft() {
  return {
    subject: "Re: Your enquiry — Savannah Retreats Africa",
    message: "Thanks for reaching out to Savannah Retreats Africa.\n\n",
  };
}

// Generates warm, ready-to-send copy for the two most common replies —
// admin can still edit before sending, this just removes the blank-page
// problem for the most repetitive part of the job.
//
// Deliberately field-presence-driven rather than hardcoded per form,
// since the underlying forms genuinely differ in what they ask for:
//  - CTABooking ("Check Availability") only ever collects dates + party
//    size — no destination/package at all, so there's no specific "item"
//    to name.
//  - PlanSafari collects BOTH a destination and a packageChoice — naming
//    only one of those (as the previous version did) silently drops the
//    other.
//  - ContactSection rarely has dates at all — see isAvailabilityRelevant
//    below, which gates whether these buttons show up at all.
function buildAvailabilityParagraph(
  inquiry: Inquiry,
  choice: "available" | "unavailable"
) {
  const itemLabel =
    inquiry.packageChoice && inquiry.destination
      ? `${inquiry.packageChoice} in ${inquiry.destination}`
      : inquiry.packageChoice ||
        inquiry.reference?.label ||
        inquiry.destination ||
        (inquiry.destinations && inquiry.destinations.length > 0
          ? inquiry.destinations.join(", ")
          : undefined);

  const dateRange =
    inquiry.dateStart && inquiry.dateEnd
      ? `${formatDate(inquiry.dateStart)} – ${formatDate(inquiry.dateEnd)}`
      : inquiry.dateStart || inquiry.dateEnd || "your selected dates";

  const partySize = buildPartySizeClause(inquiry);

  if (choice === "available") {
    const subject = itemLabel ? `${itemLabel} is available` : "we have availability";
    return `Good news — ${subject} for ${dateRange}${partySize}. To secure your booking, we ask for a 30% deposit to confirm the reservation, with the balance due closer to your travel date. Our team will follow up shortly with payment details and next steps — we can't wait to help you plan this trip.`;
  }
  const subject = itemLabel ? `${itemLabel} is not available` : "we don't have availability";
  return `Thank you for your patience while we checked availability. Unfortunately, ${subject} for ${dateRange}${partySize}. We'd love to help you find a wonderful alternative — let us know if you'd like us to suggest different dates or a similar experience, and we'll follow up with options.`;
}

function buildPartySizeClause(inquiry: Inquiry) {
  if (!inquiry.adults && !inquiry.children) return "";
  const adultsPart = `${inquiry.adults ?? 0} adult${inquiry.adults === 1 ? "" : "s"}`;
  const seniorPart = inquiry.seniorAdults ? ` (${inquiry.seniorAdults} aged 65+)` : "";
  const childrenPart = inquiry.children
    ? `, ${inquiry.children} child${inquiry.children === 1 ? "" : "ren"}`
    : "";
  return ` for your group of ${adultsPart}${seniorPart}${childrenPart}`;
}

// Only date-based requests (Check Availability, Plan Safari, Trip
// Planner, or a package/lodge-referenced Contact submission that
// happens to include dates) make sense to answer with an availability
// verdict. A plain "I have a question" contact message has nothing to
// be available or unavailable for — showing the toggle there would
// just produce a confusing, contextless reply.
function isAvailabilityRelevant(inquiry: Inquiry) {
  return Boolean(inquiry.dateStart || inquiry.dateEnd);
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
  const [search, setSearch] = useState("");

  const [replyOpenId, setReplyOpenId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<
    Record<string, { subject: string; message: string }>
  >({});
  const [replySendingId, setReplySendingId] = useState<string | null>(null);
  const [replyErrorId, setReplyErrorId] = useState<Record<string, string>>({});
  const [replySuccessId, setReplySuccessId] = useState<string | null>(null);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);
  const [replyArchivedOk, setReplyArchivedOk] = useState<Record<string, boolean>>({});
  const [replyAvailability, setReplyAvailability] = useState<
    Record<string, "available" | "unavailable" | undefined>
  >({});
  const [insertedAvailabilityText, setInsertedAvailabilityText] = useState<
    Record<string, string>
  >({});

  function openReply(inquiry: Inquiry) {
    setReplyOpenId(inquiry._id);
    setReplyErrorId((cur) => ({ ...cur, [inquiry._id]: "" }));
    setReplyDrafts((cur) =>
      cur[inquiry._id] ? cur : { ...cur, [inquiry._id]: defaultReplyDraft() }
    );
  }

  function updateDraft(id: string, patch: Partial<{ subject: string; message: string }>) {
    setReplyDrafts((cur) => ({ ...cur, [id]: { ...cur[id], ...patch } }));
  }

  function toggleAvailability(inquiry: Inquiry, choice: "available" | "unavailable") {
    const id = inquiry._id;
    const current = replyAvailability[id];
    const next = current === choice ? undefined : choice;

    const draft = replyDrafts[id] || defaultReplyDraft();
    let message = draft.message;
    const prevInserted = insertedAvailabilityText[id];
    if (prevInserted && message.includes(prevInserted)) {
      message = message.replace(prevInserted, "").replace(/\n{3,}/g, "\n\n").trim();
    }

    let newInserted = "";
    if (next) {
      newInserted = buildAvailabilityParagraph(inquiry, next);
      message = message ? `${newInserted}\n\n${message}` : newInserted;
    }

    setReplyAvailability((cur) => ({ ...cur, [id]: next }));
    setInsertedAvailabilityText((cur) => ({ ...cur, [id]: newInserted }));
    setReplyDrafts((cur) => ({ ...cur, [id]: { ...draft, message } }));
  }

  async function sendReply(inquiry: Inquiry) {
    const draft = replyDrafts[inquiry._id];
    if (!draft?.subject.trim() || !draft?.message.trim()) return;

    setReplySendingId(inquiry._id);
    setReplyErrorId((cur) => ({ ...cur, [inquiry._id]: "" }));
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiry._id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: draft.subject, message: draft.message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to send reply.");

      // Mirror the server's status bump locally so the UI updates
      // without a full refetch.
      setInquiries((cur) =>
        cur.map((i) =>
          i._id === inquiry._id && i.status !== "booked" && i.status !== "archived"
            ? { ...i, status: "contacted" }
            : i
        )
      );
      setReplyOpenId(null);
      setReplySuccessId(inquiry._id);
      setReplyArchivedOk((cur) => ({ ...cur, [inquiry._id]: Boolean(data.archived) }));
      setTimeout(() => setReplySuccessId((cur) => (cur === inquiry._id ? null : cur)), 6000);
    } catch (err) {
      setReplyErrorId((cur) => ({
        ...cur,
        [inquiry._id]: err instanceof Error ? err.message : "Failed to send reply.",
      }));
    } finally {
      setReplySendingId(null);
    }
  }

  const visible = useMemo(() => {
    let result = inquiries;
    if (statusFilter !== "all") {
      result = result.filter((i) => i.status === statusFilter);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter((i) =>
        [i.name, i.email, i.phone, i.message, i.destination, i.packageChoice]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(q))
      );
    }
    return result;
  }, [inquiries, statusFilter, search]);

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
          <div className="flex items-center gap-5">
            <button
              onClick={() => downloadCsv(visible)}
              className="text-[11px] uppercase tracking-widest2 text-umber hover:text-ochre hover:underline"
            >
              Export CSV ({visible.length})
            </button>
            <button
              onClick={handleLogout}
              className="text-[11px] uppercase tracking-widest2 text-ochre hover:underline"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
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

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone, message…"
            className="ml-auto w-full max-w-xs border border-umber/15 bg-linen px-4 py-2.5 text-[13px] text-ink outline-none focus:border-ochre md:w-64"
          />
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
                    {inquiry.adults || 0} adult{inquiry.adults === 1 ? "" : "s"}
                    {inquiry.seniorAdults ? ` (${inquiry.seniorAdults} aged 65+)` : ""}
                    {inquiry.children ? `, ${inquiry.children} child${inquiry.children === 1 ? "" : "ren"}` : ""}
                    {inquiry.childrenAges?.length ? ` (ages ${inquiry.childrenAges.join(", ")})` : ""}
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

                <div className="flex items-center gap-3">
                  {replySuccessId === inquiry._id && (
                    <span className="text-[12px] text-acacia">
                      Reply sent ✓
                      {replyArchivedOk[inquiry._id] === false && (
                        <span className="text-ink/50"> (not confirmed in Sent — check IMAP settings)</span>
                      )}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      replyOpenId === inquiry._id
                        ? setReplyOpenId(null)
                        : openReply(inquiry)
                    }
                    className="btn-ochre"
                  >
                    {replyOpenId === inquiry._id ? "Cancel" : "Reply by Email"}
                  </button>
                </div>
              </div>

              {replyOpenId === inquiry._id && (
                <div className="mt-4 border-t border-umber/10 pt-5">
                  {isAvailabilityRelevant(inquiry) && (
                    <div>
                      <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                        Availability (optional — inserts ready-to-send wording)
                      </span>
                      <div className="mt-1.5 flex gap-2">
                        <button
                          type="button"
                          onClick={() => toggleAvailability(inquiry, "available")}
                          className={`flex items-center gap-1.5 border px-3 py-1.5 text-[12px] transition-colors ${
                            replyAvailability[inquiry._id] === "available"
                              ? "border-acacia bg-acacia text-linen"
                              : "border-umber/20 text-umber hover:border-acacia"
                          }`}
                        >
                          ✓ Available
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAvailability(inquiry, "unavailable")}
                          className={`flex items-center gap-1.5 border px-3 py-1.5 text-[12px] transition-colors ${
                            replyAvailability[inquiry._id] === "unavailable"
                              ? "border-red-600 bg-red-600 text-linen"
                              : "border-umber/20 text-umber hover:border-red-600"
                          }`}
                        >
                          ✗ Unavailable
                        </button>
                      </div>
                    </div>
                  )}
                  <label className="mt-4 block">
                    <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                      Subject
                    </span>
                    <input
                      type="text"
                      value={replyDrafts[inquiry._id]?.subject ?? ""}
                      onChange={(e) => updateDraft(inquiry._id, { subject: e.target.value })}
                      className="mt-1.5 w-full border border-umber/15 bg-linen px-3 py-2 text-[13px] text-ink outline-none focus:border-ochre"
                    />
                  </label>
                  <label className="mt-3 block">
                    <span className="text-[11px] uppercase tracking-widest2 text-ink/60">
                      Message
                    </span>
                    <textarea
                      rows={6}
                      value={replyDrafts[inquiry._id]?.message ?? ""}
                      onChange={(e) => updateDraft(inquiry._id, { message: e.target.value })}
                      className="mt-1.5 w-full border border-umber/15 bg-linen px-3 py-2 text-[13px] text-ink outline-none focus:border-ochre"
                    />
                  </label>
                  {replyErrorId[inquiry._id] && (
                    <p className="mt-2 text-[12px] text-red-600">{replyErrorId[inquiry._id]}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <a
                        href={PRIVATE_EMAIL_INBOX_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] uppercase tracking-widest2 text-ink/50 hover:text-ochre hover:underline"
                      >
                        Open Private Email inbox
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(inquiry.email);
                          setCopiedEmailId(inquiry._id);
                          setTimeout(
                            () => setCopiedEmailId((cur) => (cur === inquiry._id ? null : cur)),
                            2000
                          );
                        }}
                        className="text-[11px] uppercase tracking-widest2 text-ink/50 hover:text-ochre hover:underline"
                      >
                        {copiedEmailId === inquiry._id ? "Copied ✓" : "Copy their email"}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => sendReply(inquiry)}
                      disabled={replySendingId === inquiry._id}
                      className="btn-ochre disabled:opacity-60"
                    >
                      {replySendingId === inquiry._id ? "Sending…" : "Send Reply"}
                    </button>
                  </div>
                </div>
              )}
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
