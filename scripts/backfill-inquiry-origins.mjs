/**
 * Backfill sourcePath/sourceLabel for historical Savannah Retreats enquiries.
 *
 * SAFE BY DEFAULT:
 *   node --env-file=.env.local scripts/backfill-inquiry-origins.mjs
 *
 * APPLY CHANGES:
 *   node --env-file=.env.local scripts/backfill-inquiry-origins.mjs --apply
 *
 * The script ONLY fills fields that are currently missing.
 * It never overwrites an existing sourcePath/sourceLabel.
 *
 * IMPORTANT:
 * We deliberately do not guess routes for enquiry types whose historic
 * submission page cannot be proved from the stored document.
 */

import { createClient } from "next-sanity";

const APPLY = process.argv.includes("--apply");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Run with --env-file=.env.local.",
  );
  process.exit(1);
}

if (!token) {
  console.error(
    "Missing SANITY_API_TOKEN. Run with --env-file=.env.local and make sure the token has write access.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

/**
 * SAFE historical mappings.
 *
 * These are routes we can determine from the implementation:
 * - Contact enquiries are submitted through the Contact page.
 * - Design Your Journey has its own dedicated route.
 *
 * For other types, put the real route here ONLY if you know for certain that
 * the form has always lived on that one page.
 */
const TYPE_DEFAULTS = {
  contact: {
    sourcePath: "/contact",
    sourceLabel: "Contact",
  },

  designJourney: {
    sourcePath: "/design-your-journey",
    sourceLabel: "Design Your Journey",
  },

  // Uncomment ONLY after confirming the actual historical routes:
  //
  // tripPlanner: {
  //   sourcePath: "/YOUR-REAL-TRIP-PLANNER-PATH",
  //   sourceLabel: "Trip Planner",
  // },
  //
  // planSafari: {
  //   sourcePath: "/YOUR-REAL-PLAN-SAFARI-PATH",
  //   sourceLabel: "Plan Safari",
  // },
  //
  // partner: {
  //   sourcePath: "/YOUR-REAL-PARTNER-PATH",
  //   sourceLabel: "Partner With Us",
  // },
};

/**
 * Optional per-document overrides.
 *
 * Use this when an old enquiry's exact page is known but cannot be inferred
 * from its type.
 *
 * Example:
 *
 * const DOCUMENT_OVERRIDES = {
 *   "abc123": {
 *     sourcePath: "/packages/maasai-mara",
 *     sourceLabel: "Maasai Mara Safari",
 *   },
 * };
 */
const DOCUMENT_OVERRIDES = {};

function prettyPath(path) {
  if (!path || path === "/") return "Home";

  return path
    .split("/")
    .filter(Boolean)
    .map((part) =>
      part
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
    )
    .join(" / ");
}

function determineOrigin(inquiry) {
  const override = DOCUMENT_OVERRIDES[inquiry._id];

  if (override) {
    return {
      sourcePath: inquiry.sourcePath || override.sourcePath,
      sourceLabel:
        inquiry.sourceLabel ||
        override.sourceLabel ||
        prettyPath(override.sourcePath),
      reason: "document override",
    };
  }

  const mapped = TYPE_DEFAULTS[inquiry.type];

  if (mapped) {
    return {
      sourcePath: inquiry.sourcePath || mapped.sourcePath,
      sourceLabel:
        inquiry.sourceLabel ||
        mapped.sourceLabel ||
        prettyPath(mapped.sourcePath),
      reason: `safe ${inquiry.type} mapping`,
    };
  }

  // A path was already captured, but older code may not have stored a label.
  if (inquiry.sourcePath && !inquiry.sourceLabel) {
    return {
      sourcePath: inquiry.sourcePath,
      sourceLabel: prettyPath(inquiry.sourcePath),
      reason: "derive missing label from existing path",
    };
  }

  return null;
}

const inquiries = await client.fetch(`
  *[
    _type == "inquiry" &&
    (!defined(sourcePath) || sourcePath == "" || !defined(sourceLabel) || sourceLabel == "")
  ] | order(coalesce(submittedAt, _createdAt) asc) {
    _id,
    _createdAt,
    submittedAt,
    type,
    name,
    email,
    sourcePath,
    sourceLabel,
    reference
  }
`);

console.log("");
console.log("Savannah Retreats Africa — inquiry origin backfill");
console.log("====================================================");
console.log(`Dataset: ${dataset}`);
console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN"}`);
console.log(`Candidates: ${inquiries.length}`);
console.log("");

const updates = [];
const unresolved = [];

for (const inquiry of inquiries) {
  const origin = determineOrigin(inquiry);

  if (!origin) {
    unresolved.push(inquiry);
    continue;
  }

  const patch = {};

  if (!inquiry.sourcePath && origin.sourcePath) {
    patch.sourcePath = origin.sourcePath;
  }

  if (!inquiry.sourceLabel && origin.sourceLabel) {
    patch.sourceLabel = origin.sourceLabel;
  }

  if (Object.keys(patch).length === 0) {
    continue;
  }

  updates.push({
    inquiry,
    patch,
    reason: origin.reason,
  });
}

if (updates.length > 0) {
  console.log("Will backfill:");
  console.log("");

  for (const { inquiry, patch, reason } of updates) {
    console.log(
      `  ${inquiry._id} | ${inquiry.type} | ${inquiry.name || inquiry.email || "Unknown"}`,
    );
    console.log(`    ${JSON.stringify(patch)}`);
    console.log(`    reason: ${reason}`);
  }

  console.log("");
}

if (unresolved.length > 0) {
  console.log("Left unresolved intentionally:");
  console.log("");

  for (const inquiry of unresolved) {
    console.log(
      `  ${inquiry._id} | ${inquiry.type} | ${inquiry.name || inquiry.email || "Unknown"}`,
    );
  }

  console.log("");
  console.log(
    "These were NOT guessed. Add a confirmed TYPE_DEFAULTS mapping or DOCUMENT_OVERRIDES entry if you know their historical page.",
  );
  console.log("");
}

if (!APPLY) {
  console.log(`Dry run complete. ${updates.length} document(s) can be updated.`);
  console.log("");
  console.log("Review the output above.");
  console.log("If it is correct, run:");
  console.log(
    "  node --env-file=.env.local scripts/backfill-inquiry-origins.mjs --apply",
  );
  console.log("");
  process.exit(0);
}

if (updates.length === 0) {
  console.log("Nothing to update.");
  process.exit(0);
}

let transaction = client.transaction();

for (const { inquiry, patch } of updates) {
  transaction = transaction.patch(inquiry._id, (p) => p.set(patch));
}

const result = await transaction.commit();

console.log(`Applied ${updates.length} update(s) successfully.`);
console.log(`Transaction ID: ${result.transactionId || "completed"}`);
console.log("");
console.log(
  "Refresh /admin. Historical Contact and Design Your Journey enquiries should now participate in Origin pages filtering.",
);
