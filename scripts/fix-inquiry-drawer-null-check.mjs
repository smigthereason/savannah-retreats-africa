import fs from "node:fs";
import path from "node:path";

const file = path.join(
  process.cwd(),
  "components",
  "Admin",
  "InquiryDetailDrawer.tsx",
);

if (!fs.existsSync(file)) {
  console.error(`Missing file: ${file}`);
  process.exit(1);
}

const source = fs.readFileSync(file, "utf8");

const oldBlock = `  async function changeStatus(status: InquiryStatus) {
    setPendingStatus(true);

    const success = await onStatusChange(inquiry._id, status);

    if (success) {
      onStatusChangedLocally(inquiry._id, status);
    }

    setPendingStatus(false);
  }
`;

const newBlock = `  async function changeStatus(status: InquiryStatus) {
    // The drawer can be closed while this async handler exists, so do not
    // rely on the render-time \`if (!inquiry) return null\` narrowing here.
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
`;

if (!source.includes(oldBlock)) {
  if (
    source.includes("if (!inquiry) return;") &&
    source.includes("const inquiryId = inquiry._id;")
  ) {
    console.log("Null-safety fix is already applied.");
    process.exit(0);
  }

  console.error("Expected block not found. No file was changed.");
  process.exit(1);
}

const backup = `${file}.before-null-fix.bak`;
fs.copyFileSync(file, backup);
fs.writeFileSync(file, source.replace(oldBlock, newBlock), "utf8");

console.log("Fixed InquiryDetailDrawer null-safety issue.");
console.log(`Backup created: ${backup}`);
console.log("Run: npm run build");
