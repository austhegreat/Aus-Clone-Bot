import { describe, it, expect } from "vitest";
import { buildDeviceKeyboard } from "../src/lib/bot/keyboards";
import { SessionCard } from "../src/types";

describe("Telegram Keyboard Generator — Observed Layout", () => {
  const mockCard: SessionCard = {
    id: "card-99",
    userId: "user-99",
    statusHeading: "NETCRACK Success!",
    region: "🇯🇵 Japan",
    plan: "Premium",
    expiresAt: "2026-10-12T00:00:00Z",
    nftoken: "sample_nftoken_12345",
    createdAt: "2026-10-10T00:00:00Z",
    updatedAt: "2026-10-10T00:00:00Z",
    deviceLinks: {
      pc: "https://www.netflix.com/tv8?nftoken=sample_nftoken_12345",
      mobile: "https://www.netflix.com/account?nftoken=sample_nftoken_12345",
      tv: "https://www.netflix.com/unsupported?nftoken=sample_nftoken_12345",
    },
    channelUrl: "https://t.me/aus_updates",
  };

  it("builds the single-column vertical layout matching the screenshot", () => {
    const keyboard = buildDeviceKeyboard(mockCard);
    const json = keyboard.inline_keyboard;

    // Must have 4 rows: PC, Mobile, TV, Channel
    expect(json.length).toBe(4);

    // Row 1: PC button (/tv8?nftoken=...)
    expect(json[0][0].text).toContain("Login PC");
    expect((json[0][0] as any).url).toContain("/tv8?nftoken=");

    // Row 2: Mobile button (/account?nftoken=...)
    expect(json[1][0].text).toContain("Login Mobile");
    expect((json[1][0] as any).url).toContain("/account?nftoken=");

    // Row 3: TV button (/unsupported?nftoken=...)
    expect(json[2][0].text).toContain("Login TV");
    expect((json[2][0] as any).url).toContain("/unsupported?nftoken=");

    // Row 4: Subscribe Channel
    expect(json[3][0].text).toContain("Subscribe Channel");
    expect((json[3][0] as any).url).toBe("https://t.me/aus_updates");
  });
});
