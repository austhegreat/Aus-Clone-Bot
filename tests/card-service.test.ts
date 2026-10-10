import { describe, it, expect, beforeEach } from "vitest";
import { CardService } from "../src/lib/card-service";
import { FileAppRepository } from "../src/lib/storage/file-repository";
import fs from "fs";
import path from "path";

describe("CardService Business Logic — Token & Destinations", () => {
  const testDataFile = path.resolve("./data/test-state-v2.json");
  let repo: FileAppRepository;
  let service: CardService;

  beforeEach(() => {
    if (fs.existsSync(testDataFile)) {
      fs.unlinkSync(testDataFile);
    }
    repo = new FileAppRepository(testDataFile);
    service = new CardService(repo);
  });

  it("provisions a new card with nftoken attached to all 3 device endpoints", async () => {
    const card = await service.getOrCreateSessionCard("telegram_user_1", "testuser");
    expect(card).toBeDefined();
    expect(card.userId).toBe("telegram_user_1");
    expect(card.statusHeading).toBe("NETCRACK Success!");
    expect(card.region).toBe("🇯🇵 Japan");
    expect(card.plan).toBe("Premium");
    expect(card.nftoken).toBeDefined();
    expect(card.nftoken.length).toBeGreaterThan(50);

    // Verify token is bound to PC, Mobile, and TV URLs
    expect(card.deviceLinks.pc).toContain("/tv8");
    expect(card.deviceLinks.pc).toContain("nftoken=");
    expect(card.deviceLinks.mobile).toContain("/account");
    expect(card.deviceLinks.mobile).toContain("nftoken=");
    expect(card.deviceLinks.tv).toContain("/unsupported");
    expect(card.deviceLinks.tv).toContain("nftoken=");
  });

  it("is idempotent: re-calling getOrCreateSessionCard returns identical card and token", async () => {
    const card1 = await service.getOrCreateSessionCard("user_repeat");
    const card2 = await service.getOrCreateSessionCard("user_repeat");

    expect(card1.id).toBe(card2.id);
    expect(card1.nftoken).toBe(card2.nftoken);
    expect(card1.deviceLinks.pc).toBe(card2.deviceLinks.pc);
  });

  it("forces a fresh card upon explicit creation with new token", async () => {
    const card1 = await service.getOrCreateSessionCard("user_force_new");
    const card2 = await service.createNewCard("user_force_new", "user_force_new", {
      region: "🇦🇺 Australia",
    });

    expect(card2.id).not.toBe(card1.id);
    expect(card2.region).toBe("🇦🇺 Australia");
  });
});
