import { describe, expect, it } from "vitest";
import { buildEnquiriesCsv, buildEnquiriesFilename, buildEnquiriesPdf } from "./exportEnquiries";

const enquiry = {
  id: 12,
  requesterName: 'Asha, "A"',
  locality: "Thane\nWest",
  phone: "+91 90000 00000",
  email: "asha@example.org",
  urgency: "Within a few weeks",
  preferred: "Either" as const,
  context: "Need a ramp, with a quote",
  region: "Thane" as const,
  status: "new" as const,
  assignedTo: null,
  createdAt: new Date("2026-11-21T10:00:00.000Z"),
  updatedAt: new Date("2026-11-21T10:00:00.000Z"),
};

describe("Live enquiry exports", () => {
  it("escapes CSV commas, quotes, newlines, and dates", () => {
    const csv = buildEnquiriesCsv([enquiry]);
    expect(csv).toContain('"Asha, ""A"""');
    expect(csv).toContain('"Thane\nWest"');
    expect(csv).toContain('"2026-11-21T10:00:00.000Z"');
    expect(csv.endsWith("\r\n")).toBe(true);
  });

  it("includes filter context in descriptive filenames", () => {
    expect(buildEnquiriesFilename({ region: "Thane", status: "new" }, "csv", new Date("2026-11-21T10:00:00.000Z"))).toBe("curanet-live-enquiries-thane-new-2026-11-21.csv");
  });

  it("creates a real PDF document", async () => {
    const pdf = buildEnquiriesPdf([enquiry], { region: "Thane", status: "new" });
    const content = await pdf.text();
    expect(pdf.type).toBe("application/pdf");
    expect(content.startsWith("%PDF-1.4")).toBe(true);
    expect(content).toContain("/Type /Page");
    expect(content).toContain("xref");
    expect(content.endsWith("%%EOF\n")).toBe(true);
  });
});
