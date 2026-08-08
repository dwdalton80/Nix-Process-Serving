import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { Resend } from "resend";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const serviceRequestInput = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(7).max(40),
  service: z.enum(["Service of Process", "Skip Tracing", "Court Filings", "Notary Services", "Other / Not sure"]),
  location: z.string().trim().max(240).optional(),
  details: z.string().trim().max(3000).optional(),
  website: z.string().max(0).optional(),
});

function asEmailText(input: z.infer<typeof serviceRequestInput>) {
  return [
    "Nix Process Serving service request",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    `Requested service: ${input.service}`,
    `Service location: ${input.location || "Not provided"}`,
    "",
    "Request details:",
    input.details || "Not provided",
  ].join("\n");
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

  contact: router({
    submit: publicProcedure.input(serviceRequestInput).mutation(async ({ input }) => {
      // A hidden field that bots commonly complete. Pretend success to avoid revealing the honeypot.
      if (input.website) return { success: true } as const;

      const apiKey = process.env.RESEND_API_KEY;
      const from = process.env.RESEND_FROM_EMAIL;
      if (!apiKey || !from) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Email delivery is not configured." });
      }

      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from,
        to: ["rickynix3467@gmail.com"],
        replyTo: input.email,
        subject: `New service request — ${input.service}`,
        text: asEmailText(input),
      });

      if (error || !data?.id) {
        console.error("[contact.submit] Resend delivery failed", error?.message ?? "No email ID returned");
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "We could not send your request. Please call us at 580-775-3467." });
      }

      return { success: true, emailId: data.id } as const;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
