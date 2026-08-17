import {
  INQUIRY_TYPE_META,
  type InquiryStatus,
  type InquiryType,
} from "@/lib/admin/types";

const STATUS_STYLES: Record<InquiryStatus, string> = {
  new: "border-ochre/20 bg-ochre/10 text-ochre",
  contacted: "border-acacia/20 bg-acacia/10 text-acacia",
  booked: "border-umber/20 bg-umber text-linen",
  archived: "border-ink/10 bg-ink/10 text-ink/60",
};

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span
      className={[
        "inline-flex items-center border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest2",
        STATUS_STYLES[status],
      ].join(" ")}
    >
      {status}
    </span>
  );
}

export function InquirySourceBadge({ type }: { type: InquiryType }) {
  return (
    <span className="inline-flex items-center border border-umber/10 bg-white px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest2 text-ink/55">
      {INQUIRY_TYPE_META[type].label}
    </span>
  );
}
