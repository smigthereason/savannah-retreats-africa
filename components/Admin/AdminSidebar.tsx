"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarCheck2,
  Compass,
  Download,
  ExternalLink,
  Handshake,
  Inbox,
  LogOut,
  MessageSquareText,
  PanelLeftClose,
  Route,
  SearchCheck,
  X,
} from "lucide-react";
import {
  INQUIRY_TYPE_META,
  type InquiryType,
} from "@/lib/admin/types";


type AdminSidebarProps = {
  mobileOpen: boolean;
  onCloseMobile: () => void;

  totalCount: number;
  typeCounts: Partial<Record<InquiryType, number>>;
  sourceFilter: "all" | InquiryType;
  onSourceFilter: (value: "all" | InquiryType) => void;
  onExport: () => void;
  exportCount: number;
  onLogout: () => void;
};

const TYPE_ICONS: Record<InquiryType, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  contact: MessageSquareText,
  tripPlanner: Route,
  booking: CalendarCheck2,
  planSafari: SearchCheck,
  partner: Handshake,
  designJourney: Compass,
};

function NavRow({
  active,
  icon: Icon,
  label,
  count,
  onClick,
}: {
  active: boolean;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left transition",
        active
          ? "bg-ochre text-white"
          : "text-ink/75 hover:bg-white/70 hover:text-umber",
      ].join(" ")}
    >
      <Icon
        className={[
          "h-4 w-4 shrink-0",
          active ? "text-white" : "text-ochre",
        ].join(" ")}
        strokeWidth={1.6}
      />
      <span className="min-w-0 flex-1 truncate text-[12px] font-medium">
        {label}
      </span>
      {count !== undefined ? (
        <span
          className={[
            "text-[10px] tabular-nums",
            active ? "text-white/75" : "text-ink/45",
          ].join(" ")}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

function SidebarBody(props: AdminSidebarProps) {
  const inquiryTypes = Object.keys(INQUIRY_TYPE_META) as InquiryType[];

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[76px] items-center justify-between border-b border-umber/10 px-5">
        <Link
          href="/admin"
          className="flex min-w-0 items-center gap-3"
          onClick={props.onCloseMobile}
        >
          <Image
            src="/admin-logo.png"
            alt="Savannah Retreats Africa"
            width={38}
            height={38}
            className="h-9 w-9 shrink-0 object-contain"
          />
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-none text-umber">
              Savannah Retreats
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-widest2 text-ink/45">
              Administration
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={props.onCloseMobile}
          className="rounded-sm p-2 text-ink/50 hover:bg-umber/5 hover:text-umber lg:hidden"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
        <p className="px-3 text-[9px] font-semibold uppercase tracking-widest2 text-ink/35">
          Inquiries
        </p>

        <div className="mt-2 space-y-1">
          <NavRow
            active={props.sourceFilter === "all"}
            icon={Inbox}
            label="All inquiries"
            count={props.totalCount}
            onClick={() => {
              props.onSourceFilter("all");
              props.onCloseMobile();
            }}
          />

          {inquiryTypes.map((type) => {
            const Icon = TYPE_ICONS[type];

            return (
              <NavRow
                key={type}
                active={props.sourceFilter === type}
                icon={Icon}
                label={INQUIRY_TYPE_META[type].label}
                count={props.typeCounts[type] || 0}
                onClick={() => {
                  props.onSourceFilter(type);
                  props.onCloseMobile();
                }}
              />
            );
          })}
        </div>

      </div>

      <div className="border-t border-umber/10 p-3">
        <button
          type="button"
          onClick={props.onExport}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-ink/70 transition hover:bg-white/70 hover:text-umber"
        >
          <Download className="h-4 w-4 text-ochre" strokeWidth={1.6} />
          <span className="flex-1 text-[11px] font-medium">Export current view</span>
          <span className="text-[10px] text-ink/40">{props.exportCount}</span>
        </button>

        <Link
          href="/"
          target="_blank"
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-ink/70 transition hover:bg-white/70 hover:text-umber"
        >
          <ExternalLink className="h-4 w-4 text-ochre" strokeWidth={1.6} />
          <span className="flex-1 text-[11px] font-medium">View live site</span>
        </Link>

        <button
          type="button"
          onClick={props.onLogout}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-ink/70 transition hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4 text-ochre" strokeWidth={1.6} />
          <span className="flex-1 text-[11px] font-medium">Sign out</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar(props: AdminSidebarProps) {
  return (
    <>
      <aside className="hidden w-[280px] shrink-0 border-r border-umber/10 bg-sand/70 lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarBody {...props} />
        </div>
      </aside>

      {props.mobileOpen ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-umber/35 backdrop-blur-[1px]"
            onClick={props.onCloseMobile}
            aria-label="Close navigation overlay"
          />
          <aside className="absolute inset-y-0 left-0 w-[86vw] max-w-[320px] border-r border-umber/10 bg-sand shadow-2xl">
            <SidebarBody {...props} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
