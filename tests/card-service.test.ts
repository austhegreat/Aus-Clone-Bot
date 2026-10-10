import { describe, it, expect, beforeEach } from "vitest";
import { CardService } from "../src/lib/card-service";
import { FileAppRepository } from "../src/lib/storage/file-repository";
import fs from "fs";
import path from "path";

describe("CardService Business Logic", () => {
  const testDataFile = path.resolve("./data/test-state.json");
  let repo: FileAppRepository;
  let service: CardService;

  beforeEach(() => {
    if (fs.existsSync(testDataFile)) {
      fs.unlinkSync(testDataFile);
    }
    repo = new FileAppRepository(testDataFile);
    service = new CardService(repo);
  });

  it("provisions a new card when user has no active pass", async () => {
    const card = await service.getOrCreateSessionCard("telegram_user_1", "testuser");
    expect(card).toBeDefined();
    expect(card.userId).toBe("telegram_user_1");
    expect(card.region).toBe("Australia (AU)");
    expect(card.plan).toBe("Premium Ultra HD (4K)");
    expect(new Date(card.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  it("is idempotent: re-calling getOrCreateSessionCard returns identical active card", async () => {
    const card1 = await service.getOrCreateSessionCard("user_repeat");
    const card2 = await service.getOrCreateSessionCard("user_repeat");

    expect(card1.id).toBe(card2.id);
    expect(card1.expiresAt).toBe(card2.expiresAt);
  });

  it("forces a fresh card upon explicit creation", async () => {
    const card1 = await service.getOrCreateSessionCard("user_force_new");
    const card2 = await service.createNewCard("user_force_new", "user_force_new", {
      region: "United Kingdom (UK)",
    });

    expect(card2.id).not.toBe(card1.id);
    expect(card2.region).toBe("United Kingdom (UK)");
  });

  it("updates and persists system configuration", async () => {
    await service.updateSystemConfig({
      defaultRegion: "New Zealand (NZ)",
      channelUrl: "https://t.me/custom_channel",
      devices: {
        pc: { targetUrl: "https://custom.portal/pc" },
      },
    });

    const updatedConfig = await service.getSystemConfig();
    expect(updatedConfig.defaultRegion).toBe("New Zealand (NZ)");
    expect(updatedConfig.channelUrl).toBe("https://t.me/custom_channel");
    expect(updatedConfig.devices.pc.targetUrl).toBe("https://custom.portal/pc");
  });
});
