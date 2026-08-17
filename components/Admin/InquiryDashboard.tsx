"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  ChevronRight,
  Menu,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  INQUIRY_TYPE_META,
  type Inquiry,
  type InquiryStatus,
  type InquiryType,
} from "@/lib/admin/types";
import AdminSidebar from "./AdminSidebar";
import InquiryDetailDrawer from "./InquiryDetailDrawer";
import {
  InquirySourceBadge,
  InquiryStatusBadge,
} from "./InquiryBadges";

const STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "booked", label: "Booked" },
  { value: "archived", label: "Archived" },
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number]["value"];
type SortMode = "newest" | "oldest" | "name";

const CSV_COLUMNS: (keyof Inquiry)[] = [
  "_createdAt",
  "submittedAt",
  "type",
  "status",
  "sourcePath",
  "sourceLabel",
  "name",
  "email",
  "phone",
  "message",
  "destination",
  "destinations",
  "experiences",
  "travellerType",
  "travelTiming",
  "travelMonth",
  "duration",
  "budget",
  "accommodationPreferences",
  "interests",
  "tier",
  "dateStart",
  "dateEnd",
  "adults",
  "children",
  "childrenAges",
  "seniorAdults",
  "packageChoice",
  "accessibilityNeeds",
  "businessName",
  "serviceType",
  "serviceLocation",
];

function csvEscape(value: unknown) {
  if (value === undefined || value === null) return "";

  const str = Array.isArray(value) ? value.join("; ") : String(value);

  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

function downloadCsv(rows: Inquiry[]) {
  const header = CSV_COLUMNS.join(",");
  const body = rows
    .map((row) =>
      CSV_COLUMNS.map((column) => csvEscape(row[column])).join(","),
    )
    .join("\n");

  const blob = new Blob([`${header}\n${body}`], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `savannah-inquiries-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function timestamp(inquiry: Inquiry) {
  return new Date(inquiry.submittedAt || inquiry._createdAt).getTime();
}

function formatReceived(inquiry: Inquiry) {
  const value = inquiry.submittedAt || inquiry._createdAt;
  const date = new Date(value);

  const today = new Date();
  const sameDate =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  if (sameDate) {
    return `Today · ${date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year:
      date.getFullYear() === today.getFullYear() ? undefined : "numeric",
  });
}


function inquiryContext(inquiry: Inquiry) {
  if (inquiry.type === "designJourney") {
    const destination = inquiry.destinations?.slice(0, 2).join(", ");
    const more =
      inquiry.destinations && inquiry.destinations.length > 2
        ? ` +${inquiry.destinations.length - 2}`
        : "";

    return destination ? `${destination}${more}` : "Kenya journey discovery";
  }

  if (inquiry.packageChoice && inquiry.destination) {
    return `${inquiry.packageChoice} · ${inquiry.destination}`;
  }

  if (inquiry.reference?.label) return inquiry.reference.label;
  if (inquiry.destination) return inquiry.destination;

  if (inquiry.destinations?.length) {
    return inquiry.destinations.slice(0, 2).join(", ");
  }

  if (inquiry.businessName) return inquiry.businessName;
  if (inquiry.message) return inquiry.message.slice(0, 80);

  return "No additional context";
}

function StatsCard({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: number;
  emphasis?: boolean;
}) {
  return (
    <div
      className={[
        "border px-5 py-5",
        emphasis
          ? "border-ochre/20 bg-ochre/10"
          : "border-umber/10 bg-white",
      ].join(" ")}
    >
      <p className="text-[9px] uppercase tracking-widest2 text-ink/45">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl leading-none text-umber">
        {value}
      </p>
    </div>
  );
}

export default function InquiryDashboard({
  initialInquiries,
}: {
  initialInquiries: Inquiry[];
}) {
  const [inquiries, setInquiries] = useState(initialInquiries);

  const [sourceFilter, setSourceFilter] = useState<"all" | InquiryType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [search, setSearch] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedInquiry = useMemo(
    () => inquiries.find((item) => item._id === selectedId) || null,
    [inquiries, selectedId],
  );

  const typeCounts = useMemo(() => {
    const counts: Partial<Record<InquiryType, number>> = {};

    for (const inquiry of inquiries) {
      counts[inquiry.type] = (counts[inquiry.type] || 0) + 1;
    }

    return counts;
  }, [inquiries]);


  const counts = useMemo(() => {
    const result = {
      all: inquiries.length,
      new: 0,
      contacted: 0,
      booked: 0,
      archived: 0,
    };

    for (const inquiry of inquiries) {
      result[inquiry.status] += 1;
    }

    return result;
  }, [inquiries]);

  const visible = useMemo(() => {
    let result = [...inquiries];

    if (sourceFilter !== "all") {
      result = result.filter((inquiry) => inquiry.type === sourceFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((inquiry) => inquiry.status === statusFilter);
    }

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((inquiry) => {
        const searchable = [
          inquiry.name,
          inquiry.email,
          inquiry.phone,
          inquiry.message,
          inquiry.sourcePath,
          inquiry.sourceLabel,
          inquiry.destination,
          inquiry.packageChoice,
          inquiry.businessName,
          inquiry.serviceType,
          inquiry.serviceLocation,
          inquiry.travellerType,
          inquiry.travelTiming,
          inquiry.travelMonth,
          inquiry.duration,
          inquiry.budget,
          ...(inquiry.destinations || []),
          ...(inquiry.experiences || []),
          ...(inquiry.accommodationPreferences || []),
          ...(inquiry.interests || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(query);
      });
    }

    result.sort((a, b) => {
      if (sortMode === "oldest") return timestamp(a) - timestamp(b);

      if (sortMode === "name") {
        return (a.name || a.email).localeCompare(b.name || b.email);
      }

      return timestamp(b) - timestamp(a);
    });

    return result;
  }, [
    inquiries,
    sourceFilter,
    statusFilter,
    search,
    sortMode,
  ]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  async function persistStatus(
    id: string,
    status: InquiryStatus,
  ): Promise<boolean> {
    const previous = inquiries;

    setInquiries((current) =>
      current.map((inquiry) =>
        inquiry._id === id ? { ...inquiry, status } : inquiry,
      ),
    );

    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error();

      return true;
    } catch {
      setInquiries(previous);
      return false;
    }
  }

  function updateStatusLocally(id: string, status: InquiryStatus) {
    setInquiries((current) =>
      current.map((inquiry) =>
        inquiry._id === id ? { ...inquiry, status } : inquiry,
      ),
    );
  }

  const activeContextLabel =
    sourceFilter !== "all"
      ? INQUIRY_TYPE_META[sourceFilter].label
      : "All inquiries";

  return (
    <section className="min-h-screen bg-linen text-umber">
      <div className="flex min-h-screen">
        <AdminSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          totalCount={inquiries.length}
          typeCounts={typeCounts}
          sourceFilter={sourceFilter}
          onSourceFilter={setSourceFilter}
          onExport={() => downloadCsv(visible)}
          exportCount={visible.length}
          onLogout={handleLogout}
        />

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex h-[76px] items-center justify-between border-b border-umber/10 bg-linen/95 px-5 backdrop-blur sm:px-7 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-sm border border-umber/10 p-2.5 text-umber lg:hidden"
                aria-label="Open navigation"
              >
                <Menu size={18} />
              </button>

              <div className="min-w-0">
                <p className="truncate text-[9px] uppercase tracking-widest2 text-ink/40">
                  Savannah Retreats Africa
                </p>
                <h1 className="mt-1 truncate font-display text-2xl leading-none text-umber">
                  Inquiries
                </h1>
              </div>
            </div>

            <div className="hidden items-center gap-2 text-[10px] text-ink/45 sm:flex">
              <span>{activeContextLabel}</span>
              <span>·</span>
              <span>{visible.length} shown</span>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-7 lg:px-10 lg:py-9">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="eyebrow">Lead management</span>
                <h2 className="mt-3 font-display text-4xl text-umber md:text-5xl">
                  {activeContextLabel}
                </h2>
                <p className="mt-3 max-w-2xl text-[13px] leading-6 text-ink/60">
                  Review traveller enquiries, understand their source, respond
                  from the shared mailbox and keep each lead moving.
                </p>
              </div>

              {(sourceFilter !== "all" ||
                statusFilter !== "all" ||
                search) ? (
                <button
                  type="button"
                  onClick={() => {
                    setSourceFilter("all");
                    setStatusFilter("all");
                    setSearch("");
                  }}
                  className="w-fit text-[10px] uppercase tracking-widest2 text-ochre hover:underline"
                >
                  Clear all filters
                </button>
              ) : null}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
              <StatsCard label="Total inquiries" value={counts.all} />
              <StatsCard label="New leads" value={counts.new} emphasis />
              <StatsCard label="Contacted" value={counts.contacted} />
              <StatsCard label="Booked" value={counts.booked} />
            </div>

            <div className="mt-6 border border-umber/10 bg-white p-3">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <label className="relative min-w-0 flex-1">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search traveller, email, destination, journey preference…"
                    className="w-full border border-umber/10 bg-linen py-3 pl-10 pr-4 text-[12px] text-umber outline-none placeholder:text-ink/35 focus:border-ochre"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3 xl:flex">
                  <label className="relative">
                    <SlidersHorizontal
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35"
                    />
                    <select
                      value={statusFilter}
                      onChange={(event) =>
                        setStatusFilter(event.target.value as StatusFilter)
                      }
                      className="w-full appearance-none border border-umber/10 bg-linen py-3 pl-9 pr-8 text-[11px] text-umber outline-none focus:border-ochre xl:min-w-[160px]"
                    >
                      {STATUS_FILTERS.map((filter) => (
                        <option key={filter.value} value={filter.value}>
                          {filter.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="relative">
                    <ArrowDownUp
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35"
                    />
                    <select
                      value={sortMode}
                      onChange={(event) =>
                        setSortMode(event.target.value as SortMode)
                      }
                      className="w-full appearance-none border border-umber/10 bg-linen py-3 pl-9 pr-8 text-[11px] text-umber outline-none focus:border-ochre xl:min-w-[150px]"
                    >
                      <option value="newest">Newest first</option>
                      <option value="oldest">Oldest first</option>
                      <option value="name">Name A–Z</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-5 overflow-hidden border border-umber/10 bg-white">
              <div className="hidden grid-cols-[1.5fr_1.1fr_1.7fr_0.8fr_0.8fr_28px] gap-4 border-b border-umber/10 bg-sand/50 px-5 py-3 text-[9px] font-semibold uppercase tracking-widest2 text-ink/40 lg:grid">
                <span>Traveller</span>
                <span>Source</span>
                <span>Context</span>
                <span>Status</span>
                <span>Received</span>
                <span />
              </div>

              {visible.length > 0 ? (
                visible.map((inquiry) => (
                  <button
                    key={inquiry._id}
                    type="button"
                    onClick={() => setSelectedId(inquiry._id)}
                    className="group block w-full border-b border-umber/10 px-5 py-5 text-left transition last:border-b-0 hover:bg-sand/35 lg:grid lg:grid-cols-[1.5fr_1.1fr_1.7fr_0.8fr_0.8fr_28px] lg:items-center lg:gap-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-display text-xl text-umber lg:text-lg">
                        {inquiry.name || inquiry.email}
                      </p>
                      <p className="mt-1 truncate text-[11px] text-ink/45">
                        {inquiry.email}
                      </p>
                      {inquiry.phone ? (
                        <p className="mt-0.5 text-[10px] text-ink/35 lg:hidden">
                          {inquiry.phone}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-3 lg:mt-0">
                      <InquirySourceBadge type={inquiry.type} />
                      {inquiry.sourcePath ? (
                        <p
                          className="mt-1.5 truncate font-mono text-[9px] text-ink/35"
                          title={inquiry.sourcePath}
                        >
                          {inquiry.sourcePath}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-3 min-w-0 lg:mt-0">
                      <p className="line-clamp-2 text-[12px] leading-5 text-ink/70">
                        {inquiryContext(inquiry)}
                      </p>

                      {inquiry.type === "designJourney" &&
                      inquiry.budget ? (
                        <p className="mt-1 text-[10px] text-ink/40">
                          {inquiry.duration || "Duration not set"} ·{" "}
                          {inquiry.budget}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-3 lg:mt-0">
                      <InquiryStatusBadge status={inquiry.status} />
                    </div>

                    <p className="mt-3 text-[10px] text-ink/40 lg:mt-0">
                      {formatReceived(inquiry)}
                    </p>

                    <ChevronRight
                      size={17}
                      className="mt-3 text-ink/25 transition group-hover:translate-x-0.5 group-hover:text-ochre lg:mt-0"
                    />
                  </button>
                ))
              ) : (
                <div className="px-6 py-16 text-center">
                  <p className="font-display text-2xl text-umber">
                    No inquiries match this view.
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-[12px] leading-6 text-ink/50">
                    Change the source, page, status or search filters to see
                    other leads.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <InquiryDetailDrawer
        inquiry={selectedInquiry}
        onClose={() => setSelectedId(null)}
        onStatusChange={persistStatus}
        onStatusChangedLocally={updateStatusLocally}
      />
    </section>
  );
}
