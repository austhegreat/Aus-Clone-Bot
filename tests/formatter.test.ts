import { describe, it, expect } from "vitest";
import { formatCardForTelegram, formatExpirationDate, escapeHtml } from "../src/lib/formatter";
import { SessionCard } from "../src/types";

describe("Message Formatter", () => {
  const sampleCard: SessionCard = {
    id: "test-card-123",
    userId: "user-456",
    statusHeading: "Success! Your access pass is active",
    region: "Australia (AU)",
    plan: "Premium Ultra HD (4K)",
    expiresAt: "2026-10-12T16:30:00.000Z",
    createdAt: "2026-10-10T16:30:00.000Z",
    updatedAt: "2026-10-10T16:30:00.000Z",
    deviceLinks: {
      pc: "http://localhost:3000/preview/pc",
      mobile: "http://localhost:3000/preview/mobile",
      tv: "http://localhost:3000/preview/tv",
    },
    channelUrl: "https://t.me/aus_updates",
  };

  it("formats expiration date into UTC string", () => {
    const formatted = formatExpirationDate("2026-10-12T16:30:00.000Z");
    expect(formatted).toBe("2026-10-12 16:30:00 UTC");
  });

  it("escapes HTML special characters properly", () => {
    expect(escapeHtml("<script>alert('xss')&\"test\"</script>")).toBe(
      "&lt;script&gt;alert('xss')&amp;&quot;test&quot;&lt;/script&gt;"
    );
  });

  it("generates correct Telegram HTML message structure", () => {
    const result = formatCardForTelegram(sampleCard);
    expect(result.parse_mode).toBe("HTML");
    expect(result.text).toContain("<b>✅ Success! Your access pass is active</b>");
    expect(result.text).toContain("📍 <b>Region:</b> <code>Australia (AU)</code>");
    expect(result.text).toContain("💎 <b>Plan:</b> <code>Premium Ultra HD (4K)</code>");
    expect(result.text).toContain("⏳ <b>Expiration:</b> <code>2026-10-12 16:30:00 UTC</code>");
    expect(result.text).toContain("👇 <b>Please select your device to proceed:</b>");
  });
});
