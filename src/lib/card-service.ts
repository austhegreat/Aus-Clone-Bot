import { randomUUID } from "crypto";
import { appRepository, FileAppRepository } from "./storage/file-repository";
import { IAppRepository } from "./storage/repository";
import {
  SessionCard,
  SystemConfig,
  DeviceType,
  CardCreationInput,
  UpdateConfigInput,
} from "../types";

export class CardService {
  constructor(private repo: IAppRepository = appRepository) {}

  /**
   * Retrieves an active card for a user, or provisions a new one.
   * Reproduces the observed idempotent behavior where repeating /start
   * returns the same active result card.
   */
  async getOrCreateSessionCard(
    userId: string,
    username?: string,
    options?: Partial<CardCreationInput>
  ): Promise<SessionCard> {
    const existing = await this.repo.getActiveCardByUserId(userId);
    if (existing) {
      return existing;
    }

    return this.createNewCard(userId, username, options);
  }

  /**
   * Generates a new session card with configured expiration duration.
   */
  async createNewCard(
    userId: string,
    username?: string,
    options?: Partial<CardCreationInput>
  ): Promise<SessionCard> {
    const sysConfig = await this.repo.getSystemConfig();

    const durationHours = options?.durationHours || sysConfig.sessionDurationHours;
    const expiresAt = new Date(Date.now() + durationHours * 3600 * 1000).toISOString();

    const card: SessionCard = {
      id: randomUUID(),
      userId,
      username,
      statusHeading: "Success! Your access pass is active",
      region: options?.region || sysConfig.defaultRegion,
      plan: options?.plan || sysConfig.defaultPlan,
      expiresAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deviceLinks: {
        pc: sysConfig.devices.pc.targetUrl,
        mobile: sysConfig.devices.mobile.targetUrl,
        tv: sysConfig.devices.tv.targetUrl,
      },
      channelUrl: sysConfig.channelUrl,
    };

    await this.repo.saveCard(card);
    return card;
  }

  async getCardById(cardId: string): Promise<SessionCard | null> {
    return this.repo.getCardById(cardId);
  }

  async getSystemConfig(): Promise<SystemConfig> {
    return this.repo.getSystemConfig();
  }

  async updateSystemConfig(input: UpdateConfigInput): Promise<SystemConfig> {
    const current = await this.repo.getSystemConfig();

    const updated: SystemConfig = {
      ...current,
      channelUrl: input.channelUrl || current.channelUrl,
      defaultRegion: input.defaultRegion || current.defaultRegion,
      defaultPlan: input.defaultPlan || current.defaultPlan,
      sessionDurationHours: input.sessionDurationHours || current.sessionDurationHours,
      devices: {
        pc: {
          ...current.devices.pc,
          label: input.devices?.pc?.label || current.devices.pc.label,
          targetUrl: input.devices?.pc?.targetUrl || current.devices.pc.targetUrl,
        },
        mobile: {
          ...current.devices.mobile,
          label: input.devices?.mobile?.label || current.devices.mobile.label,
          targetUrl: input.devices?.mobile?.targetUrl || current.devices.mobile.targetUrl,
        },
        tv: {
          ...current.devices.tv,
          label: input.devices?.tv?.label || current.devices.tv.label,
          targetUrl: input.devices?.tv?.targetUrl || current.devices.tv.targetUrl,
        },
      },
    };

    await this.repo.saveSystemConfig(updated);
    return updated;
  }

  async resolveDeviceUrl(device: DeviceType): Promise<string> {
    const sysConfig = await this.repo.getSystemConfig();
    return sysConfig.devices[device]?.targetUrl || "/";
  }
}

export const cardService = new CardService();
