import nodemailer from "nodemailer";
import type { LiveEnquiry } from "../drizzle/schema";
import { ENV } from "./_core/env";
import * as db from "./db";

export type LiveNotificationRecipient = {
  email: string;
};

type MailTransport = ReturnType<typeof nodemailer.createTransport>;
let transporter: MailTransport | null = null;

function getRequiredConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const from = process.env.SMTP_FROM?.trim();
  if (!host || !from) return null;

  const port = Number(process.env.SMTP_PORT ?? "587");
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid port number");
  }

  return {
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    user: process.env.SMTP_USER?.trim(),
    password: process.env.SMTP_PASSWORD,
    from,
  };
}

function getTransporter(): { transport: MailTransport; from: string } | null {
  const config = getRequiredConfig();
  if (!config) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.user && config.password ? { user: config.user, pass: config.password } : undefined,
      requireTLS: !config.secure,
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 30_000,
    });
  }
  return { transport: transporter, from: config.from };
}

export function resetLiveNotificationTransportForTests() {
  transporter = null;
}

function dashboardUrl() {
  const configured = process.env.LIVE_COORDINATOR_DASHBOARD_URL?.trim() || process.env.PUBLIC_APP_URL?.trim();
  if (!configured) return null;
  try {
    const parsed = new URL(configured);
    if (parsed.protocol !== "https:") return null;
    return parsed.toString().replace(/\/$/, "") + "/admin/live";
  } catch {
    return null;
  }
}

export function buildLiveNotificationMessage(enquiry: Pick<LiveEnquiry, "id" | "region" | "status" | "createdAt">) {
  const link = dashboardUrl();
  if (!link) return null;
  const createdAt = new Date(enquiry.createdAt).toISOString();
  return {
    subject: `New CuraNet Live enquiry — ${enquiry.region} — #${enquiry.id}`,
    text: [
      "A new CuraNet Live enquiry is ready for verified coordinator review.",
      "",
      `Enquiry ID: #${enquiry.id}`,
      `Region: ${enquiry.region}`,
      `Created: ${createdAt}`,
      `Status: ${enquiry.status}`,
      "",
      `Open the restricted coordinator dashboard: ${link}`,
      "",
      "The dashboard contains restricted requester information. This record is not an allocation, eligibility decision, or response guarantee.",
    ].join("\n"),
  };
}

export async function notifyEligibleLiveCoordinators(enquiry: LiveEnquiry): Promise<{ attempted: number; accepted: number }> {
  const recipients = await db.listEligibleCoordinatorEmails(enquiry.region);
  if (recipients.length === 0) return { attempted: 0, accepted: 0 };

  const message = buildLiveNotificationMessage(enquiry);
  const configured = getTransporter();
  if (!message || !configured) {
    console.warn("[LiveEmail] SMTP or secure dashboard URL is not configured; enquiry was saved without coordinator notification.");
    return { attempted: recipients.length, accepted: 0 };
  }

  try {
    const info = await configured.transport.sendMail({
      from: configured.from,
      to: recipients.map(({ email }) => email),
      subject: message.subject,
      text: message.text,
    });
    return { attempted: recipients.length, accepted: info.accepted?.length ?? 0 };
  } catch (error) {
    console.warn("[LiveEmail] Coordinator notification failed:", error instanceof Error ? error.message : "unknown error");
    return { attempted: recipients.length, accepted: 0 };
  }
}

export function hasConfiguredSmtp() {
  return Boolean(getRequiredConfig() && dashboardUrl() && ENV.databaseUrl);
}
