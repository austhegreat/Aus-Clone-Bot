import { describe, it, expect } from "vitest";
import { formatCardForTelegram, formatObservedExpirationDate, escapeHtml } from "../src/lib/formatter";
import { SessionCard } from "../src/types";

describe("Message Formatter — Observed Bot Layout", () => {
  const sampleCard: SessionCard = {
    id: "test-card-123",
    userId: "user-456",
    statusHeading: "NETCRACK Success!",
    region: "🇯🇵 Japan",
    plan: "Premium",
    expiresAt: "2026-10-08T16:12:03.000Z",
    formattedExpiryText: "8/10/2026, 23.12.03 WIB",
    nftoken: "BgjCwOvcAxLCASQsMb4qRv9xdNEaIHyfpg+Gt/j6vA...",
    createdAt: "2026-10-08T16:12:03.000Z",
    updatedAt: "2026-10-08T16:12:03.000Z",
    deviceLinks: {
      pc: "http://localhost:3000/tv8?nftoken=test",
      mobile: "http://localhost:3000/account?nftoken=test",
      tv: "http://localhost:3000/unsupported?nftoken=test",
    },
    channelUrl: "https://t.me/aus_updates",
  };

  it("formats observed expiration date with WIB timezone", () => {
    const formatted = formatObservedExpirationDate("2026-10-08T16:12:03.000Z");
    expect(formatted).toContain("WIB");
    expect(formatted).toContain("2026");
  });

  it("escapes HTML special characters properly", () => {
    expect(escapeHtml("<script>&</script>")).toBe("&lt;script&gt;&amp;&lt;/script&gt;");
  });

  it("generates exact 1:1 Telegram HTML message structure from screenshot", () => {
    const result = formatCardForTelegram(sampleCard);
    expect(result.parse_mode).toBe("HTML");
    expect(result.text).toContain("<b>🎉 NETCRACK Success!</b>");
    expect(result.text).toContain("🌍 <b>Region:</b> 🇯🇵 Japan");
    expect(result.text).toContain("📝 <b>Plan:</b> Premium");
    expect(result.text).toContain("⌛ <b>Expires:</b> 8/10/2026, 23.12.03 WIB");
    expect(result.text).toContain("Select device to login:");
  });
});
