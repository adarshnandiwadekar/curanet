import { writeFileSync } from "node:fs";
import { directoryEntries } from "../client/src/data/directory";

const escapeCsv = (value: string) => `"${value.replaceAll('"', '""')}"`;
const headers = ["id", "name", "type", "area", "locality", "summary", "activities", "officialWebsite", "sourceUrl", "lastVerified", "caution"];
const rows = [
  headers,
  ...directoryEntries.map((entry) => [
    entry.id,
    entry.name,
    entry.type,
    entry.area,
    entry.locality,
    entry.summary,
    entry.activities.join(" | "),
    entry.officialWebsite,
    entry.sourceUrl,
    entry.lastVerified,
    entry.caution,
  ]),
];

writeFileSync("client/public/directory.csv", `${rows.map((row) => row.map(escapeCsv).join(",")).join("\n")}\n`);
console.log(`Exported ${directoryEntries.length} directory records to client/public/directory.csv`);
