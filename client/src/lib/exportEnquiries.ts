import type { LiveEnquiry } from "@shared/types";

export type EnquiryExportFilters = {
  region: "all" | "Mumbai" | "Thane";
  status: "all" | "new" | "reviewing" | "referred" | "closed";
};

const csvHeaders = ["ID", "status", "region", "created time", "requester name", "locality", "email", "phone", "urgency", "preferred contact method", "request context"];

function csvCell(value: unknown) {
  const text = value instanceof Date ? value.toISOString() : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export function buildEnquiriesCsv(enquiries: LiveEnquiry[]) {
  const rows = enquiries.map(item => [item.id, item.status, item.region, item.createdAt, item.requesterName, item.locality, item.email, item.phone, item.urgency, item.preferred, item.context]);
  return [csvHeaders, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

function filterPart(value: string) {
  return value === "all" ? "all" : value.toLowerCase();
}

export function buildEnquiriesFilename(filters: EnquiryExportFilters, extension: "csv" | "pdf", date = new Date()) {
  const day = date.toISOString().slice(0, 10);
  return `curanet-live-enquiries-${filterPart(filters.region)}-${filterPart(filters.status)}-${day}.${extension}`;
}

function utf16Hex(value: string) {
  const codePoints = Array.from(value);
  const bytes = [0xfe, 0xff];
  for (const character of codePoints) {
    const code = character.codePointAt(0) ?? 0xfffd;
    if (code <= 0xffff) bytes.push(code >> 8, code & 0xff);
    else {
      const adjusted = code - 0x10000;
      const high = 0xd800 + (adjusted >> 10);
      const low = 0xdc00 + (adjusted & 0x3ff);
      bytes.push(high >> 8, high & 0xff, low >> 8, low & 0xff);
    }
  }
  return bytes.map(byte => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function pdfLine(item: LiveEnquiry) {
  return `#${item.id} · ${item.status} · ${item.region} · ${item.requesterName} · ${item.locality} · ${item.email} · ${item.phone} · ${item.urgency} · ${item.preferred} · ${item.context}`;
}

function wrapPdfText(value: string, maxLength = 105) {
  const words = value.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (!current) current = word;
    else if ((current + " " + word).length <= maxLength) current += " " + word;
    else { lines.push(current); current = word; }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

export function buildEnquiriesPdf(enquiries: LiveEnquiry[], filters: EnquiryExportFilters, generatedAt = new Date()) {
  const heading = [
    "CuraNet Live enquiries",
    `Generated: ${generatedAt.toISOString()}`,
    `Filters: region=${filters.region}; status=${filters.status}`,
    "CONFIDENTIAL: restricted coordinator operational report. Not an allocation or eligibility decision.",
    "",
  ];
  const lines = [...heading, ...(enquiries.length ? enquiries.flatMap(pdfLine).flatMap(line => wrapPdfText(line)) : ["No enquiries in this filtered view."])];
  const pageLines = 48;
  const pages = Array.from({ length: Math.max(1, Math.ceil(lines.length / pageLines)) }, (_, index) => lines.slice(index * pageLines, (index + 1) * pageLines));

  const objects: string[] = [];
  const add = (object: string) => { objects.push(object); return objects.length; };
  const catalog = add("");
  const pagesObject = add("");
  const font = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageIds: number[] = [];
  for (const page of pages) {
    const content = ["BT", "/F1 8 Tf", "44 760 Td", ...page.map((line, index) => `${index ? "0 -14 Td " : ""}<${utf16Hex(line)}> Tj`), "ET"].join("\n");
    const contentId = add(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    const pageId = add(`<< /Type /Page /Parent ${pagesObject} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${font} 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageIds.push(pageId);
  }
  objects[catalog - 1] = `<< /Type /Catalog /Pages ${pagesObject} 0 R >>`;
  objects[pagesObject - 1] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index < offsets.length; index++) pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return new Blob([pdf], { type: "application/pdf" });
}

export function downloadExport(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
