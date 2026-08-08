import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { appRouter } from "./routers";

function createContext(): TrpcContext {
  return {
    user: null,
    req: { headers: {}, protocol: "https" } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("contact.submit", () => {
  it("sends completed service requests directly to the Nix inbox", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.RESEND_FROM_EMAIL = "Nix Process Serving <requests@example.com>";
    sendMock.mockResolvedValueOnce({ data: { id: "email_123" }, error: null });

    const caller = appRouter.createCaller(createContext());
    await expect(caller.contact.submit({
      name: "Jordan Smith",
      email: "jordan@example.com",
      phone: "580-555-0199",
      service: "Service of Process",
      location: "Lehigh, Oklahoma",
      details: "Please contact me about availability.",
    })).resolves.toEqual({ success: true, emailId: "email_123" });

    expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({
      to: ["rickynix3467@gmail.com"],
      replyTo: "jordan@example.com",
      subject: "New service request — Service of Process",
    }));
  });

  it("returns a clear server error when Resend cannot deliver a request", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.RESEND_FROM_EMAIL = "Nix Process Serving <requests@example.com>";
    sendMock.mockResolvedValueOnce({ data: null, error: { message: "Delivery temporarily unavailable" } });

    const caller = appRouter.createCaller(createContext());
    await expect(caller.contact.submit({
      name: "Jordan Smith",
      email: "jordan@example.com",
      phone: "580-555-0199",
      service: "Court Filings",
    })).rejects.toMatchObject({ code: "INTERNAL_SERVER_ERROR" });
  });
});
