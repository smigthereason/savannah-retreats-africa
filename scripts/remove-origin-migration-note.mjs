/**
 * Production cleanup:
 * Removes the temporary origin-page migration notice from AdminSidebar.
 *
 * Run:
 *   node scripts/remove-origin-migration-note.mjs
 *
 * Result:
 * If there are no origin pages for the current dataset/filter, the sidebar
 * simply renders nothing in that area instead of displaying the migration
 * explanation.
 */

import fs from "node:fs";
import path from "node:path";

const target = path.join(
  process.cwd(),
  "components",
  "Admin",
  "AdminSidebar.tsx",
);

if (!fs.existsSync(target)) {
  console.error(`Could not find ${target}`);
  process.exit(1);
}

const source = fs.readFileSync(target, "utf8");

const oldBlock = `          ) : (
            <p className="px-3 py-2 text-[11px] leading-5 text-ink/45">
              Exact page tracking begins with enquiries submitted after this
              release.
            </p>
          )}`;

const newBlock = `          ) : null}`;

if (!source.includes(oldBlock)) {
  if (source.includes(newBlock)) {
    console.log("Migration notice is already removed. No change needed.");
    process.exit(0);
  }

  console.error(
    "The expected migration notice was not found. AdminSidebar.tsx may have changed; no file was modified.",
  );
  process.exit(1);
}

const backup = `${target}.before-origin-notice-removal.bak`;
fs.copyFileSync(target, backup);

fs.writeFileSync(target, source.replace(oldBlock, newBlock), "utf8");

console.log("Removed the temporary Origin pages migration notice.");
console.log(`Backup created: ${backup}`);
console.log("");
console.log("Restart/rebuild Next.js and verify /admin before deploying.");
