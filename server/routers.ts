import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { coordinatorProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { notifyEligibleLiveCoordinators } from "./liveNotifications";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const enquiryAttempts = new Map<string, number[]>();
const ENQUIRY_WINDOW_MS = 15 * 60 * 1000;
const ENQUIRY_MAX_ATTEMPTS = 5;

function enforceEnquiryRateLimit(key: string) {
  const now = Date.now();
  const recent = (enquiryAttempts.get(key) ?? []).filter(timestamp => now - timestamp < ENQUIRY_WINDOW_MS);
  if (recent.length >= ENQUIRY_MAX_ATTEMPTS) return false;
  recent.push(now);
  enquiryAttempts.set(key, recent);
  return true;
}

export function resetEnquiryRateLimitForTests() {
  enquiryAttempts.clear();
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  liveEnquiries: router({
    create: publicProcedure.input(z.object({
      requesterName: z.string().trim().min(2).max(160),
      locality: z.string().trim().min(2).max(160),
      phone: z.string().trim().min(7).max(40),
      email: z.string().trim().email().max(320),
      urgency: z.string().trim().min(2).max(80),
      preferred: z.enum(["Phone", "Email", "Either"]),
      context: z.string().trim().min(10).max(5000),
      region: z.enum(["Mumbai", "Thane"]),
    })).mutation(async ({ input, ctx }) => {
      const forwarded = ctx.req.headers["x-forwarded-for"];
      const clientKey = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : ctx.req.ip || "unknown";
      if (!enforceEnquiryRateLimit(clientKey)) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Please wait before submitting another enquiry." });
      }
      const enquiry = await db.createLiveEnquiry(input);
      try {
        await notifyEligibleLiveCoordinators(enquiry);
      } catch (error) {
        console.warn("[LiveEmail] Notification path failed after enquiry commit:", error instanceof Error ? error.message : "unknown error");
      }
      return enquiry;
    }),
    list: coordinatorProcedure.input(z.object({ region: z.enum(["Mumbai", "Thane"]).optional() }).optional()).query(({ input, ctx }) => {
      return db.listLiveEnquiriesForUserInRegions(ctx.user, input?.region);
    }),
    updateStatus: coordinatorProcedure.input(z.object({
      id: z.number().int().positive(),
      status: z.enum(["new", "reviewing", "referred", "closed"]),
    })).mutation(({ input, ctx }) => db.updateLiveEnquiryStatusForUser(ctx.user, input.id, input.status)),
  }),

});

export type AppRouter = typeof appRouter;
