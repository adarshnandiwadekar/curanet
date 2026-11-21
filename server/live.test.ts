import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  createLiveEnquiry: vi.fn(),
  listLiveEnquiriesForUserInRegions: vi.fn(),
  updateLiveEnquiryStatusForUser: vi.fn(),
}));
const notificationMocks = vi.hoisted(() => ({ notifyEligibleLiveCoordinators: vi.fn() }));
vi.mock("./db", () => dbMocks);
vi.mock("./liveNotifications", () => notificationMocks);

import { appRouter, resetEnquiryRateLimitForTests } from "./routers";

type User = NonNullable<TrpcContext["user"]>;

function user(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    openId: "test-user",
    email: "coordinator@example.org",
    name: "Coordinator",
    loginMethod: "manus",
    role: "coordinator",
    partnerVerified: true,
    partnerRegions: "Mumbai",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };
}

function caller(currentUser: User | null) {
  return appRouter.createCaller({
    user: currentUser,
    req: { headers: {}, ip: "127.0.0.1" } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  });
}

const storedEnquiry = {
  id: 7,
  requesterName: "Asha",
  locality: "Andheri",
  phone: "+91 90000 00000",
  email: "asha@example.org",
  urgency: "Routine planning",
  preferred: "Either" as const,
  context: "Need help understanding a mobility aid",
  region: "Mumbai" as const,
  status: "new" as const,
  assignedTo: null,
  createdAt: new Date("2026-11-21T10:00:00.000Z"),
  updatedAt: new Date("2026-11-21T10:00:00.000Z"),
};

beforeEach(() => {
  vi.clearAllMocks();
  resetEnquiryRateLimitForTests();
  dbMocks.createLiveEnquiry.mockResolvedValue(storedEnquiry);
  dbMocks.listLiveEnquiriesForUserInRegions.mockResolvedValue([storedEnquiry]);
  dbMocks.updateLiveEnquiryStatusForUser.mockResolvedValue({ ...storedEnquiry, status: "reviewing" });
  notificationMocks.notifyEligibleLiveCoordinators.mockResolvedValue({ attempted: 1, accepted: 1 });
});

describe("Live coordinator authorization", () => {
  it("denies unauthenticated and unverified users", async () => {
    await expect(caller(null).liveEnquiries.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller(user({ partnerVerified: false })).liveEnquiries.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("passes the requested region to a verified coordinator scope query", async () => {
    await caller(user({ partnerRegions: "Mumbai,Thane" })).liveEnquiries.list({ region: "Thane" });
    expect(dbMocks.listLiveEnquiriesForUserInRegions).toHaveBeenCalledWith(expect.objectContaining({ partnerVerified: true, partnerRegions: "Mumbai,Thane" }), "Thane");
  });

  it("allows admins to request all or a selected region", async () => {
    await caller(user({ role: "admin", partnerVerified: false, partnerRegions: null })).liveEnquiries.list({ region: "Thane" });
    expect(dbMocks.listLiveEnquiriesForUserInRegions).toHaveBeenCalledWith(expect.objectContaining({ role: "admin" }), "Thane");
  });

  it("requires authorization before status updates", async () => {
    await expect(caller(user({ partnerVerified: false })).liveEnquiries.updateStatus({ id: 7, status: "closed" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await caller(user()).liveEnquiries.updateStatus({ id: 7, status: "reviewing" });
    expect(dbMocks.updateLiveEnquiryStatusForUser).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }), 7, "reviewing");
  });
});

describe("Live enquiry creation", () => {
  it("persists first and then attempts coordinator notification", async () => {
    const result = await caller(null).liveEnquiries.create({
      requesterName: "Asha",
      locality: "Andheri",
      phone: "+91 90000 00000",
      email: "asha@example.org",
      urgency: "Routine planning",
      preferred: "Either",
      context: "Need help understanding a mobility aid",
      region: "Mumbai",
    });
    expect(result).toEqual(storedEnquiry);
    expect(dbMocks.createLiveEnquiry).toHaveBeenCalledOnce();
    expect(notificationMocks.notifyEligibleLiveCoordinators).toHaveBeenCalledWith(storedEnquiry);
    expect(dbMocks.createLiveEnquiry.mock.invocationCallOrder[0]).toBeLessThan(notificationMocks.notifyEligibleLiveCoordinators.mock.invocationCallOrder[0]);
  });

  it("rejects invalid requester input and rate-limits repeated submissions", async () => {
    await expect(caller(null).liveEnquiries.create({
      requesterName: "A",
      locality: "A",
      phone: "bad",
      email: "bad",
      urgency: "x",
      preferred: "Either",
      context: "short",
      region: "Mumbai",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });

    const input = { requesterName: "Asha", locality: "Andheri", phone: "+91 90000 00000", email: "asha@example.org", urgency: "Routine planning", preferred: "Either" as const, context: "Need help understanding a mobility aid", region: "Mumbai" as const };
    for (let attempt = 0; attempt < 5; attempt++) await caller(null).liveEnquiries.create(input);
    await expect(caller(null).liveEnquiries.create(input)).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
  });
});
