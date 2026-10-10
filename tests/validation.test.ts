import { describe, it, expect } from "vitest";
import { CardCreationSchema, UpdateConfigSchema, DeviceTypeSchema } from "../src/types";

describe("Zod Validation Schemas", () => {
  it("validates valid CardCreationInput", () => {
    const valid = {
      userId: "user_123",
      region: "Australia (AU)",
      plan: "Premium",
      durationHours: 24,
    };
    const result = CardCreationSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("fails CardCreationInput when userId is missing", () => {
    const invalid = {
      region: "Australia (AU)",
    };
    const result = CardCreationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("validates valid DeviceType", () => {
    expect(DeviceTypeSchema.safeParse("pc").success).toBe(true);
    expect(DeviceTypeSchema.safeParse("mobile").success).toBe(true);
    expect(DeviceTypeSchema.safeParse("tv").success).toBe(true);
    expect(DeviceTypeSchema.safeParse("smartwatch").success).toBe(false);
  });

  it("validates valid UpdateConfigSchema and rejects invalid URLs", () => {
    const valid = {
      channelUrl: "https://t.me/aus_updates",
      devices: {
        pc: { targetUrl: "https://aus.app/pc" },
      },
    };
    expect(UpdateConfigSchema.safeParse(valid).success).toBe(true);

    const invalid = {
      channelUrl: "not-a-valid-url",
    };
    expect(UpdateConfigSchema.safeParse(invalid).success).toBe(false);
  });
});
