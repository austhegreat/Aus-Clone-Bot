import { describe, it, expect } from "vitest";
import { buildDeviceKeyboard } from "../src/lib/bot/keyboards";
import { SessionCard } from "../src/types";

describe("Telegram Keyboard Generator", () => {
  const mockCard: SessionCard = {
    id: "card-99",
    userId: "user-99",
    statusHeading: "Active",
    region: "Australia (AU)",
    plan: "Premium",
    expiresAt: "2026-10-12T00:00:00Z",
    createdAt: "2026-10-10T00:00:00Z",
    updatedAt: "2026-10-10T00:00:00Z",
    deviceLinks: {
      pc: "https://aus.example.com/pc",
      mobile: "https://aus.example.com/mobile",
      tv: "https://aus.example.com/tv",
    },
    channelUrl: "https://t.me/aus_updates",
  };

  it("builds the 2-row layout with 3 device buttons and 1 channel button", () => {
    const keyboard = buildDeviceKeyboard(mockCard);
    const json = keyboard.inline_keyboard;

    // Must have 2 rows
    expect(json.length).toBe(2);

    // Row 1: PC, Mobile, TV buttons
    const row1 = json[0];
    expect(row1.length).toBe(3);
    expect(row1[0].text).toContain("Login PC");
    expect((row1[0] as any).url).toBe("https://aus.example.com/pc");
    expect(row1[1].text).toContain("Login Mobile");
    expect((row1[1] as any).url).toBe("https://aus.example.com/mobile");
    expect(row1[2].text).toContain("Login TV");
    expect((row1[2] as any).url).toBe("https://aus.example.com/tv");

    // Row 2: Subscribe Channel button
    const row2 = json[1];
    expect(row2.length).toBe(1);
    expect(row2[0].text).toContain("Subscribe Channel");
    expect((row2[0] as any).url).toBe("https://t.me/aus_updates");
  });
});
