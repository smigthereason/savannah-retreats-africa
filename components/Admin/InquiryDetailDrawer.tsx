"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Clipboard,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Send,
  Users,
  X,
} from "lucide-react";
import {
  INQUIRY_TYPE_META,
  type Inquiry,
  type InquiryStatus,
} from "@/lib/admin/types";
import {
  InquirySourceBadge,
  InquiryStatusBadge,
} from "./InquiryBadges";

const PRIVATE_EMAIL_INBOX_URL = "https://privateemail.com/spm/mail/?f=INBOX";

function formatDate(iso?: string) {
  if (!iso) return "—";

  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso?: string) {
  if (!iso) return "—";

  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildPartySizeClause(inquiry: Inquiry) {
  if (!inquiry.adults && !inquiry.children) return "";

  const adultsPart = `${inquiry.adults ?? 0} adult${
    inquiry.adults === 1 ? "" : "s"
  }`;

  const seniorPart = inquiry.seniorAdults
    ? ` (${inquiry.seniorAdults} aged 65+)`
    : "";

  const childrenPart = inquiry.children
    ? `, ${inquiry.children} child${inquiry.children === 1 ? "" : "ren"}`
    : "";

  return ` for your group of ${adultsPart}${seniorPart}${childrenPart}`;
}

function buildAvailabilityParagraph(
  inquiry: Inquiry,
  choice: "available" | "unavailable",
) {
  const itemLabel =
    inquiry.packageChoice && inquiry.destination
      ? `${inquiry.packageChoice} in ${inquiry.destination}`
      : inquiry.packageChoice ||
        inquiry.reference?.label ||
        inquiry.destination ||
        (inquiry.destinations?.length ? inquiry.destinations.join(", ") : undefined);

  const dateRange =
    inquiry.dateStart && inquiry.dateEnd
      ? `${formatDate(inquiry.dateStart)} – ${formatDate(inquiry.dateEnd)}`
      : inquiry.dateStart || inquiry.dateEnd || "your selected dates";

  const partySize = buildPartySizeClause(inquiry);

  if (choice === "available") {
    const subject = itemLabel
      ? `${itemLabel} is available`
      : "we have availability";

    return `Good news — ${subject} for ${dateRange}${partySize}. To secure your booking, we ask for a 30% deposit to confirm the reservation, with the balance due closer to your travel date. Our team will follow up shortly with payment details and next steps — we can't wait to help you plan this trip.`;
  }

  const subject = itemLabel
    ? `${itemLabel} is not available`
    : "we don't have availability";

  return `Thank you for your patience while we checked availability. Unfortunately, ${subject} for ${dateRange}${partySize}. We'd love to help you find a wonderful alternative — let us know if you'd like us to suggest different dates or a similar experience, and we'll follow up with options.`;
}

function TagList({ values }: { values?: string[] }) {
  if (!values?.length) return <span className="text-ink/40">Not provided</span>;

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span
          key={value}
          className="border border-umber/10 bg-linen px-2.5 py-1.5 text-[11px] text-umber"
        >
          {value}
        </span>
      ))}
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 border-b border-umber/10 py-4 sm:grid-cols-[150px_1fr]">
      <p className="text-[9px] font-semibold uppercase tracking-widest2 text-ink/40">
        {label}
      </p>
      <div className="min-w-0 text-[13px] leading-6 text-umber">{children}</div>
    </div>
  );
}

function Section({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <p className="text-[9px] font-semibold uppercase tracking-widest2 text-ochre">
        {eyebrow}
      </p>
      <div className="mt-2">{children}</div>
    </section>
  );
}

type InquiryDetailDrawerProps = {
  inquiry: Inquiry | null;
  onClose: () => void;
  onStatusChange: (id: string, status: InquiryStatus) => Promise<boolean>;
  onStatusChangedLocally: (id: string, status: InquiryStatus) => void;
};

export default function InquiryDetailDrawer({
  inquiry,
  onClose,
  onStatusChange,
  onStatusChangedLocally,
}: InquiryDetailDrawerProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replySubject, setReplySubject] = useState(
    "Re: Your enquiry — Savannah Retreats Africa",
  );
  const [replyMessage, setReplyMessage] = useState(
    "Thanks for reaching out to Savannah Retreats Africa.\n\n",
  );
  const [replySending, setReplySending] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [replySuccess, setReplySuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(false);
  const [availabilityChoice, setAvailabilityChoice] = useState<
    "available" | "unavailable" | undefined
  >();
  const [availabilityText, setAvailabilityText] = useState("");

  useEffect(() => {
    setReplyOpen(false);
    setReplySubject("Re: Your enquiry — Savannah Retreats Africa");
    setReplyMessage("Thanks for reaching out to Savannah Retreats Africa.\n\n");
    setReplyError("");
    setReplySuccess("");
    setCopied(false);
    setAvailabilityChoice(undefined);
    setAvailabilityText("");
  }, [inquiry?._id]);

  useEffect(() => {
    if (!inquiry) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inquiry, onClose]);

  const isAvailabilityRelevant = Boolean(
    inquiry?.dateStart || inquiry?.dateEnd,
  );

  const displayMessage = useMemo(() => {
    if (!inquiry?.message) return undefined;

    if (
      inquiry.type === "designJourney" &&
      inquiry.message.startsWith("DESIGN YOUR JOURNEY")
    ) {
      return undefined;
    }

    return inquiry.message;
  }, [inquiry]);

  if (!inquiry) return null;

  async function changeStatus(status: InquiryStatus) {
    // The drawer can be closed while this async handler exists, so do not
    // rely on the render-time `if (!inquiry) return null` narrowing here.
    if (!inquiry) return;

    const inquiryId = inquiry._id;
    setPendingStatus(true);

    try {
      const success = await onStatusChange(inquiryId, status);

      if (success) {
        onStatusChangedLocally(inquiryId, status);
      }
    } finally {
      setPendingStatus(false);
    }
  }

  function toggleAvailability(choice: "available" | "unavailable") {
    // `inquiry` is nullable at the component prop level. Even though the
    // render returns early when it is null, TypeScript does not preserve
    // that narrowing inside a separately declared callback.
    if (!inquiry) return;

    const currentInquiry = inquiry;
    const next = availabilityChoice === choice ? undefined : choice;

    let message = replyMessage;

    if (availabilityText && message.includes(availabilityText)) {
      message = message
        .replace(availabilityText, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    }

    let nextText = "";

    if (next) {
      nextText = buildAvailabilityParagraph(currentInquiry, next);
      message = message ? `${nextText}\n\n${message}` : nextText;
    }

    setAvailabilityChoice(next);
    setAvailabilityText(nextText);
    setReplyMessage(message);
  }

  async function sendReply() {
    if (!inquiry) return;
    if (!replySubject.trim() || !replyMessage.trim()) return;

    // Capture the values needed by this async operation before awaiting.
    // This keeps the function null-safe even if the drawer closes while
    // the request is in flight.
    const inquiryId = inquiry._id;
    const inquiryStatus = inquiry.status;

    setReplySending(true);
    setReplyError("");
    setReplySuccess("");

    try {
      const res = await fetch(
        `/api/admin/inquiries/${inquiryId}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: replySubject.trim(),
            message: replyMessage.trim(),
          }),
        },
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to send reply.");
      }

      if (inquiryStatus !== "booked" && inquiryStatus !== "archived") {
        onStatusChangedLocally(inquiryId, "contacted");
      }

      setReplySuccess(
        data.archived === false
          ? "Reply sent. The Sent-folder archive could not be confirmed."
          : "Reply sent successfully.",
      );
      setReplyOpen(false);
    } catch (err) {
      setReplyError(
        err instanceof Error ? err.message : "Failed to send reply.",
      );
    } finally {
      setReplySending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-umber/35 backdrop-blur-[1px]"
        aria-label="Close inquiry details"
      />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[720px] flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-5 border-b border-umber/10 px-5 py-5 sm:px-7">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <InquirySourceBadge type={inquiry.type} />
              <InquiryStatusBadge status={inquiry.status} />
            </div>

            <h2 className="mt-3 truncate font-display text-3xl text-umber">
              {inquiry.name || inquiry.email}
            </h2>

            <p className="mt-1 text-[11px] text-ink/45">
              Received {formatDateTime(inquiry.submittedAt || inquiry._createdAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-umber/10 p-2.5 text-ink/50 transition hover:border-ochre hover:text-ochre"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-10 sm:px-7">
          <Section eyebrow="Contact">
            <DetailRow label="Email">
              <a
                href={`mailto:${inquiry.email}`}
                className="inline-flex items-center gap-2 text-umber hover:text-ochre"
              >
                <Mail size={14} className="text-ochre" />
                {inquiry.email}
              </a>
            </DetailRow>

            {inquiry.phone ? (
              <DetailRow label="Phone">
                <a
                  href={`tel:${inquiry.phone}`}
                  className="inline-flex items-center gap-2 text-umber hover:text-ochre"
                >
                  <Phone size={14} className="text-ochre" />
                  {inquiry.phone}
                </a>
              </DetailRow>
            ) : null}

            {(inquiry.adults !== undefined ||
              inquiry.children !== undefined) ? (
              <DetailRow label="Party">
                <span className="inline-flex items-start gap-2">
                  <Users size={14} className="mt-1 text-ochre" />
                  <span>
                    {inquiry.adults ?? 0} adult
                    {inquiry.adults === 1 ? "" : "s"}
                    {inquiry.seniorAdults
                      ? ` (${inquiry.seniorAdults} aged 65+)`
                      : ""}
                    {inquiry.children
                      ? `, ${inquiry.children} child${
                          inquiry.children === 1 ? "" : "ren"
                        }`
                      : ""}
                    {inquiry.childrenAges?.length
                      ? ` — ages ${inquiry.childrenAges.join(", ")}`
                      : ""}
                  </span>
                </span>
              </DetailRow>
            ) : null}
          </Section>

          <Section eyebrow="Origin">
            <DetailRow label="Form">
              {INQUIRY_TYPE_META[inquiry.type].label}
            </DetailRow>

            {inquiry.sourcePath ? (
              <DetailRow label="Page">
                <span className="inline-flex min-w-0 items-start gap-2">
                  <MapPin size={14} className="mt-1 shrink-0 text-ochre" />
                  <span className="min-w-0">
                    <span className="block">
                      {inquiry.sourceLabel || inquiry.sourcePath}
                    </span>
                    <span className="block break-all font-mono text-[10px] text-ink/40">
                      {inquiry.sourcePath}
                    </span>
                  </span>
                </span>
              </DetailRow>
            ) : (
              <DetailRow label="Page">
                <span className="text-ink/40">
                  Not captured for this older enquiry.
                </span>
              </DetailRow>
            )}

            {inquiry.reference ? (
              <DetailRow label={inquiry.reference.refType || "Reference"}>
                {inquiry.reference.label}
              </DetailRow>
            ) : null}
          </Section>

          {inquiry.type === "designJourney" ? (
            <Section eyebrow="Journey brief">
              <DetailRow label="Kenya regions">
                <TagList values={inquiry.destinations} />
              </DetailRow>

              <DetailRow label="Experiences">
                <TagList values={inquiry.experiences} />
              </DetailRow>

              {inquiry.travellerType ? (
                <DetailRow label="Travelling as">
                  {inquiry.travellerType}
                </DetailRow>
              ) : null}

              {inquiry.travelTiming || inquiry.travelMonth ? (
                <DetailRow label="Timing">
                  <span className="inline-flex items-start gap-2">
                    <CalendarDays
                      size={14}
                      className="mt-1 shrink-0 text-ochre"
                    />
                    <span>
                      {inquiry.travelTiming || "Timing not specified"}
                      {inquiry.travelMonth
                        ? ` · ${inquiry.travelMonth}`
                        : ""}
                    </span>
                  </span>
                </DetailRow>
              ) : null}

              {inquiry.duration ? (
                <DetailRow label="Duration">{inquiry.duration}</DetailRow>
              ) : null}

              {inquiry.budget ? (
                <DetailRow label="Investment">{inquiry.budget}</DetailRow>
              ) : null}

              <DetailRow label="Accommodation">
                <TagList values={inquiry.accommodationPreferences} />
              </DetailRow>

              <DetailRow label="Interests">
                <TagList values={inquiry.interests} />
              </DetailRow>
            </Section>
          ) : (
            <Section eyebrow="Enquiry details">
              {inquiry.destination ? (
                <DetailRow label="Destination">
                  {inquiry.destination}
                </DetailRow>
              ) : null}

              {inquiry.destinations?.length ? (
                <DetailRow label="Destinations">
                  <TagList values={inquiry.destinations} />
                </DetailRow>
              ) : null}

              {inquiry.packageChoice ? (
                <DetailRow label="Package">
                  {inquiry.packageChoice}
                </DetailRow>
              ) : null}

              {inquiry.tier ? (
                <DetailRow label="Comfort tier">{inquiry.tier}</DetailRow>
              ) : null}

              {inquiry.dateStart || inquiry.dateEnd ? (
                <DetailRow label="Travel dates">
                  {formatDate(inquiry.dateStart)} –{" "}
                  {formatDate(inquiry.dateEnd)}
                </DetailRow>
              ) : null}

              {inquiry.businessName ? (
                <DetailRow label="Business">
                  {inquiry.businessName}
                </DetailRow>
              ) : null}

              {inquiry.serviceType ? (
                <DetailRow label="Service type">
                  {inquiry.serviceType}
                </DetailRow>
              ) : null}

              {inquiry.serviceLocation ? (
                <DetailRow label="Service location">
                  {inquiry.serviceLocation}
                </DetailRow>
              ) : null}
            </Section>
          )}

          {displayMessage ? (
            <Section eyebrow={inquiry.type === "designJourney" ? "Traveller notes" : "Message"}>
              <div className="mt-2 whitespace-pre-wrap border-l-2 border-ochre bg-linen px-4 py-4 text-[13px] leading-6 text-ink">
                {displayMessage}
              </div>
            </Section>
          ) : null}

          {inquiry.accessibilityNeeds ? (
            <Section eyebrow="Accessibility / accommodation needs">
              <div className="mt-2 border-l-2 border-ochre bg-[#FDF3E7] px-4 py-4 text-[13px] leading-6 text-umber">
                {inquiry.accessibilityNeeds}
              </div>
            </Section>
          ) : null}

          <Section eyebrow="Lead management">
            <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <label>
                <span className="text-[9px] font-semibold uppercase tracking-widest2 text-ink/40">
                  Status
                </span>

                <div className="relative mt-2">
                  <select
                    value={inquiry.status}
                    disabled={pendingStatus}
                    onChange={(event) =>
                      changeStatus(event.target.value as InquiryStatus)
                    }
                    className="w-full appearance-none border border-umber/15 bg-linen px-4 py-3 pr-10 text-[12px] text-umber outline-none focus:border-ochre disabled:opacity-50"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="booked">Booked</option>
                    <option value="archived">Archived</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40"
                  />
                </div>
              </label>

              <button
                type="button"
                onClick={() => setReplyOpen((value) => !value)}
                className="btn-ochre h-[45px] whitespace-nowrap"
              >
                {replyOpen ? "Close reply" : "Reply by email"}
              </button>
            </div>

            {replySuccess ? (
              <div className="mt-4 flex items-start gap-2 border border-acacia/20 bg-acacia/10 px-3 py-3 text-[12px] leading-5 text-acacia">
                <Check size={15} className="mt-0.5 shrink-0" />
                {replySuccess}
              </div>
            ) : null}

            {replyOpen ? (
              <div className="mt-5 border-t border-umber/10 pt-5">
                {isAvailabilityRelevant ? (
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-widest2 text-ink/40">
                      Availability helper
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => toggleAvailability("available")}
                        className={[
                          "border px-3 py-2 text-[11px] transition",
                          availabilityChoice === "available"
                            ? "border-acacia bg-acacia text-white"
                            : "border-umber/15 text-umber hover:border-acacia",
                        ].join(" ")}
                      >
                        ✓ Available
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleAvailability("unavailable")}
                        className={[
                          "border px-3 py-2 text-[11px] transition",
                          availabilityChoice === "unavailable"
                            ? "border-red-600 bg-red-600 text-white"
                            : "border-umber/15 text-umber hover:border-red-600",
                        ].join(" ")}
                      >
                        ✕ Unavailable
                      </button>
                    </div>
                  </div>
                ) : null}

                <label className="mt-5 block">
                  <span className="text-[9px] font-semibold uppercase tracking-widest2 text-ink/40">
                    Subject
                  </span>
                  <input
                    value={replySubject}
                    onChange={(event) => setReplySubject(event.target.value)}
                    className="mt-2 w-full border border-umber/15 bg-linen px-4 py-3 text-[13px] text-umber outline-none focus:border-ochre"
                  />
                </label>

                <label className="mt-4 block">
                  <span className="text-[9px] font-semibold uppercase tracking-widest2 text-ink/40">
                    Message
                  </span>
                  <textarea
                    rows={8}
                    value={replyMessage}
                    onChange={(event) => setReplyMessage(event.target.value)}
                    className="mt-2 w-full resize-y border border-umber/15 bg-linen px-4 py-3 text-[13px] leading-6 text-umber outline-none focus:border-ochre"
                  />
                </label>

                {replyError ? (
                  <p className="mt-3 text-[12px] text-red-600">
                    {replyError}
                  </p>
                ) : null}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={PRIVATE_EMAIL_INBOX_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest2 text-ink/45 hover:text-ochre"
                    >
                      <ExternalLink size={12} />
                      Private Email
                    </a>

                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(inquiry.email);
                        setCopied(true);
                        window.setTimeout(() => setCopied(false), 1800);
                      }}
                      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest2 text-ink/45 hover:text-ochre"
                    >
                      <Clipboard size={12} />
                      {copied ? "Copied" : "Copy email"}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={sendReply}
                    disabled={replySending}
                    className="btn-ochre inline-flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send size={14} />
                    {replySending ? "Sending…" : "Send reply"}
                  </button>
                </div>
              </div>
            ) : null}
          </Section>
        </div>
      </aside>
    </div>
  );
}
