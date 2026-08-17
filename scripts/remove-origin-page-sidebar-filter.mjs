import fs from "node:fs";
import path from "node:path";

const sidebarPath = path.join(process.cwd(), "components", "Admin", "AdminSidebar.tsx");
const dashboardPath = path.join(process.cwd(), "components", "Admin", "InquiryDashboard.tsx");

for (const file of [sidebarPath, dashboardPath]) {
  if (!fs.existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    process.exit(1);
  }
}

const sidebar = fs.readFileSync(sidebarPath, "utf8");
const dashboard = fs.readFileSync(dashboardPath, "utf8");

if (!sidebar.includes("Origin pages") && !dashboard.includes("pageFilter")) {
  console.log("Origin-page sidebar filtering is already removed.");
  process.exit(0);
}

const backupSidebar = `${sidebarPath}.before-origin-filter-removal.bak`;
const backupDashboard = `${dashboardPath}.before-origin-filter-removal.bak`;

fs.copyFileSync(sidebarPath, backupSidebar);
fs.copyFileSync(dashboardPath, backupDashboard);

let s = sidebar;

s = s.replace("  MapPin,\n", "");
s = s.replace(/\nexport type PageOrigin = \{\n  path: string;\n  label: string;\n  count: number;\n\};\n/, "\n");
s = s.replace("  pageOrigins: PageOrigin[];\n\n", "");
s = s.replace('  pageFilter: "all" | string;\n\n', "");
s = s.replace('  onPageFilter: (value: "all" | string) => void;\n\n', "");
s = s.replace(
  '            active={props.sourceFilter === "all" && props.pageFilter === "all"}',
  '            active={props.sourceFilter === "all"}',
);
s = s.replace(
`            onClick={() => {
              props.onPageFilter("all");
              props.onSourceFilter("all");
              props.onCloseMobile();
            }}`,
`            onClick={() => {
              props.onSourceFilter("all");
              props.onCloseMobile();
            }}`,
);
s = s.replace(
  '                active={props.sourceFilter === type && props.pageFilter === "all"}',
  '                active={props.sourceFilter === type}',
);
s = s.replace(
`                onClick={() => {
                  props.onPageFilter("all");
                  props.onSourceFilter(type);
                  props.onCloseMobile();
                }}`,
`                onClick={() => {
                  props.onSourceFilter(type);
                  props.onCloseMobile();
                }}`,
);

const originStart = `        <div className="my-5 border-t border-umber/10" />

        <div className="flex items-center justify-between px-3">
          <p className="text-[9px] font-semibold uppercase tracking-widest2 text-ink/35">
            Origin pages
          </p>
`;

const originEnd = `        </div>
      </div>

      <div className="border-t border-umber/10 p-3">`;

const start = s.indexOf(originStart);
const end = s.indexOf(originEnd);

if (start === -1 || end === -1 || end <= start) {
  console.error("Could not identify the Origin pages UI block. Restoring backups.");
  fs.copyFileSync(backupSidebar, sidebarPath);
  fs.copyFileSync(backupDashboard, dashboardPath);
  process.exit(1);
}

s =
  s.slice(0, start) +
  `      </div>

      <div className="border-t border-umber/10 p-3">` +
  s.slice(end + originEnd.length);

let d = dashboard;

d = d.replace(
  'import AdminSidebar, { type PageOrigin } from "./AdminSidebar";',
  'import AdminSidebar from "./AdminSidebar";',
);
d = d.replace('  const [pageFilter, setPageFilter] = useState<"all" | string>("all");\n', "");
d = d.replace(/\nfunction pageLabel\(path: string, sourceLabel\?: string\) \{[\s\S]*?\n\}\n/, "\n");
d = d.replace(/\n  const pageOrigins = useMemo<PageOrigin\[\]>\(\(\) => \{[\s\S]*?\n  \}, \[inquiries\]\);\n/, "\n");
d = d.replace(
`    if (pageFilter !== "all") {
      result = result.filter((inquiry) => inquiry.sourcePath === pageFilter);
    }

`,
"",
);
d = d.replace("    pageFilter,\n", "");

d = d.replace(
`  const activeContextLabel =
    pageFilter !== "all"
      ? pageLabel(pageFilter)
      : sourceFilter !== "all"
        ? INQUIRY_TYPE_META[sourceFilter].label
        : "All inquiries";
`,
`  const activeContextLabel =
    sourceFilter !== "all"
      ? INQUIRY_TYPE_META[sourceFilter].label
      : "All inquiries";
`,
);

d = d.replace("          pageOrigins={pageOrigins}\n", "");
d = d.replace("          pageFilter={pageFilter}\n", "");
d = d.replace("          onPageFilter={setPageFilter}\n", "");

d = d.replace(
`              {(sourceFilter !== "all" ||
                pageFilter !== "all" ||
                statusFilter !== "all" ||
                search) ? (`,
`              {(sourceFilter !== "all" ||
                statusFilter !== "all" ||
                search) ? (`,
);

d = d.replace('                    setPageFilter("all");\n', "");

fs.writeFileSync(sidebarPath, s, "utf8");
fs.writeFileSync(dashboardPath, d, "utf8");

console.log("Removed Origin Pages filtering from the admin sidebar.");
console.log("");
console.log("Preserved:");
console.log("- sourcePath/sourceLabel data");
console.log("- Origin details in the inquiry drawer");
console.log("- origin fields in CSV export");
console.log("- origin fields in search");
console.log("");
console.log("Backups:");
console.log(`- ${backupSidebar}`);
console.log(`- ${backupDashboard}`);
console.log("");
console.log("Now run: npm run build");
