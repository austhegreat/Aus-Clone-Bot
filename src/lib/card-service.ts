import { randomBytes, randomUUID } from "crypto";
import { appRepository } from "./storage/file-repository";
import { IAppRepository } from "./storage/repository";
import { formatObservedExpirationDate } from "./formatter";
import {
  SessionCard,
  SystemConfig,
  DeviceType,
  CardCreationInput,
  UpdateConfigInput,
} from "../types";

/**
 * Generates a realistic token payload mirroring the observed Base64-like structure of `nftoken`
 */
export function generateNftoken(): string {
  const prefix = "BgjCwOvcAxLCASQsMb4qRv9xdNEaIHyfpg+Gt/j6vA/GRaVfu8koL1yIF4nP77EkM8L/";
  const randomPayload = randomBytes(96).toString("base64");
  return `${prefix}${randomPayload}`;
}

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
    const formattedExpiryText = formatObservedExpirationDate(expiresAt);

    // Generate shared token parameter for all 3 device buttons
    const nftoken = generateNftoken();

    // Construct destination URLs appending ?nftoken=...
    const pcBase = sysConfig.devices.pc.targetUrl;
    const mobileBase = sysConfig.devices.mobile.targetUrl;
    const tvBase = sysConfig.devices.tv.targetUrl;

    const appendToken = (baseUrl: string, token: string) => {
      const separator = baseUrl.includes("?") ? "&" : "?";
      return `${baseUrl}${separator}nftoken=${encodeURIComponent(token)}`;
    };

    const card: SessionCard = {
      id: randomUUID(),
      userId,
      username,
      statusHeading: options?.statusHeading || sysConfig.defaultHeading || "NETCRACK Success!",
      region: options?.region || sysConfig.defaultRegion || "🇯🇵 Japan",
      plan: options?.plan || sysConfig.defaultPlan || "Premium",
      expiresAt,
      formattedExpiryText,
      nftoken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deviceLinks: {
        pc: appendToken(pcBase, nftoken),
        mobile: appendToken(mobileBase, nftoken),
        tv: appendToken(tvBase, nftoken),
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
      defaultHeading: input.defaultHeading || current.defaultHeading,
      defaultRegion: input.defaultRegion || current.defaultRegion,
      defaultPlan: input.defaultPlan || current.defaultPlan,
      sessionDurationHours: input.sessionDurationHours || current.sessionDurationHours,
      targetDomain: input.targetDomain || current.targetDomain,
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
