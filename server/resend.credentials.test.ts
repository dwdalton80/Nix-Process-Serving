import { describe, expect, it } from "vitest";

describe("Resend credentials", () => {
  it("authenticates with the configured Resend API key", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey, "RESEND_API_KEY must be configured").toMatch(/^re_/);

    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    expect(response.status, await response.text()).toBe(200);
  });
});
