import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN. Load your environment variables before running this migration.",
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

function extractAdditionalNotes(message) {
  if (typeof message !== "string") return undefined;
  const trimmed = message.trim();
  if (!trimmed) return undefined;

  if (!trimmed.startsWith("DESIGN YOUR JOURNEY")) {
    return trimmed;
  }

  const match = trimmed.match(/(?:^|\n)Notes:\s*([\s\S]+)$/i);
  return match?.[1]?.trim() || undefined;
}

const inquiries = await client.fetch(`
  *[
    _type == "inquiry" &&
    type == "designJourney" &&
    !defined(additionalNotes) &&
    defined(message)
  ]{_id, message}
`);

const updates = inquiries
  .map((inquiry) => ({
    id: inquiry._id,
    additionalNotes: extractAdditionalNotes(inquiry.message),
  }))
  .filter((entry) => entry.additionalNotes);

if (!updates.length) {
  console.log("No Design Your Journey notes require migration.");
  process.exit(0);
}

for (let index = 0; index < updates.length; index += 100) {
  const batch = updates.slice(index, index + 100);
  let transaction = client.transaction();

  for (const entry of batch) {
    transaction = transaction.patch(entry.id, (patch) =>
      patch.set({ additionalNotes: entry.additionalNotes }),
    );
  }

  await transaction.commit();
  console.log(`Migrated ${Math.min(index + batch.length, updates.length)}/${updates.length}`);
}

console.log(`Done. Migrated ${updates.length} inquiry note(s).`);
