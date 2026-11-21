import { and, desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertLiveEnquiry, InsertUser, liveEnquiries, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available");
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createLiveEnquiry(enquiry: InsertLiveEnquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(liveEnquiries).values(enquiry);
  const id = Number(result[0].insertId);
  const rows = await db.select().from(liveEnquiries).where(eq(liveEnquiries.id, id)).limit(1);
  return rows[0];
}

export async function listLiveEnquiries(region?: "Mumbai" | "Thane") {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const query = db.select().from(liveEnquiries).orderBy(desc(liveEnquiries.createdAt));
  return region ? query.where(eq(liveEnquiries.region, region)) : query;
}

export async function listLiveEnquiriesForUser(user: { role: "user" | "coordinator" | "admin"; partnerRegions: string | null }) {
  if (user.role === "admin") return listLiveEnquiries();
  return listLiveEnquiriesForUserInRegions(user);
}

function parsePartnerRegions(partnerRegions: string | null): Array<"Mumbai" | "Thane"> {
  return (partnerRegions ?? "").split(",").map(value => value.trim()).filter((value): value is "Mumbai" | "Thane" => value === "Mumbai" || value === "Thane");
}

export async function listLiveEnquiriesForUserInRegions(user: { role: "user" | "coordinator" | "admin"; partnerVerified?: boolean; partnerRegions: string | null }, requestedRegion?: "Mumbai" | "Thane") {
  if (user.role === "admin") return listLiveEnquiries(requestedRegion);
  if (user.role !== "coordinator" || user.partnerVerified !== true) return [];
  const regions = parsePartnerRegions(user.partnerRegions);
  const allowedRegions = requestedRegion ? regions.filter(region => region === requestedRegion) : regions;
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  if (allowedRegions.length === 0) return [];
  return db.select().from(liveEnquiries).where(inArray(liveEnquiries.region, allowedRegions)).orderBy(desc(liveEnquiries.createdAt));
}

export async function updateLiveEnquiryStatusForUser(user: { id: number; role: "user" | "coordinator" | "admin"; partnerVerified?: boolean; partnerRegions: string | null }, id: number, status: "new" | "reviewing" | "referred" | "closed") {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await db.select().from(liveEnquiries).where(eq(liveEnquiries.id, id)).limit(1);
  const enquiry = existing[0];
  if (!enquiry) return undefined;
  if (user.role !== "admin" && (user.role !== "coordinator" || user.partnerVerified !== true || !parsePartnerRegions(user.partnerRegions).includes(enquiry.region))) return undefined;
  const values = user.role === "admin" ? { status } : { status, assignedTo: user.id };
  await db.update(liveEnquiries).set(values).where(eq(liveEnquiries.id, id));
  const rows = await db.select().from(liveEnquiries).where(eq(liveEnquiries.id, id)).limit(1);
  return rows[0];
}

export async function listEligibleCoordinatorEmails(region: "Mumbai" | "Thane") {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const candidates = await db.select({ email: users.email, partnerRegions: users.partnerRegions }).from(users).where(and(eq(users.role, "coordinator"), eq(users.partnerVerified, true)));
  return candidates
    .filter(candidate => Boolean(candidate.email) && parsePartnerRegions(candidate.partnerRegions).includes(region))
    .map(candidate => ({ email: candidate.email!.trim().toLowerCase() }))
    .filter((candidate, index, all) => all.findIndex(item => item.email === candidate.email) === index);
}
