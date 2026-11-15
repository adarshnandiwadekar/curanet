import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { coordinatorProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { z } from "zod";

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
    })).mutation(({ input }) => db.createLiveEnquiry(input)),
    list: coordinatorProcedure.input(z.object({ region: z.enum(["Mumbai", "Thane"]).optional() }).optional()).query(({ input, ctx }) => {
      if (ctx.user.role === "admin" && input?.region) return db.listLiveEnquiries(input.region);
      return db.listLiveEnquiriesForUser(ctx.user);
    }),
    updateStatus: coordinatorProcedure.input(z.object({
      id: z.number().int().positive(),
      status: z.enum(["new", "reviewing", "referred", "closed"]),
    })).mutation(({ input }) => db.updateLiveEnquiryStatus(input.id, input.status)),
  }),

});

export type AppRouter = typeof appRouter;
