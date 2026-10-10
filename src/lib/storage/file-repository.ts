import fs from "fs";
import path from "path";
import { config } from "../config";
import { IAppRepository, UserRecord } from "./repository";
import { SessionCard, SystemConfig } from "../../types";

interface StorageState {
  users: Record<string, UserRecord>;
  cards: Record<string, SessionCard>;
  systemConfig: SystemConfig;
}

export class FileAppRepository implements IAppRepository {
  private filePath: string;
  private state: StorageState;

  constructor(filePath?: string) {
    const dataDir = path.resolve(config.dataDir);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.filePath = filePath || path.join(dataDir, "app-state.json");
    this.state = this.loadState();
  }

  private getDefaultConfig(): SystemConfig {
    return {
      channelUrl: config.telegramChannelUrl,
      defaultRegion: config.defaultRegion,
      defaultPlan: config.defaultPlan,
      sessionDurationHours: config.sessionDurationHours,
      devices: {
        pc: {
          deviceType: "pc",
          label: "Login PC",
          targetUrl: config.pcLoginUrl,
          icon: "monitor",
          isActive: true,
        },
        mobile: {
          deviceType: "mobile",
          label: "Login Mobile",
          targetUrl: config.mobileLoginUrl,
          icon: "smartphone",
          isActive: true,
        },
        tv: {
          deviceType: "tv",
          label: "Login TV",
          targetUrl: config.tvLoginUrl,
          icon: "tv",
          isActive: true,
        },
      },
    };
  }

  private loadState(): StorageState {
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        const parsed = JSON.parse(raw);
        return {
          users: parsed.users || {},
          cards: parsed.cards || {},
          systemConfig: parsed.systemConfig || this.getDefaultConfig(),
        };
      } catch (err) {
        console.error("Failed to parse storage file, reinitializing:", err);
      }
    }
    const defaultState: StorageState = {
      users: {},
      cards: {},
      systemConfig: this.getDefaultConfig(),
    };
    this.saveState(defaultState);
    return defaultState;
  }

  private saveState(state: StorageState): void {
    const tempPath = `${this.filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(state, null, 2), "utf-8");
    fs.renameSync(tempPath, this.filePath);
  }

  async getUserByTelegramId(telegramId: number): Promise<UserRecord | null> {
    const user = Object.values(this.state.users).find((u) => u.telegramId === telegramId);
    return user || null;
  }

  async getUserById(id: string): Promise<UserRecord | null> {
    return this.state.users[id] || null;
  }

  async saveUser(user: UserRecord): Promise<void> {
    this.state.users[user.id] = user;
    this.saveState(this.state);
  }

  async getActiveCardByUserId(userId: string): Promise<SessionCard | null> {
    const now = new Date().toISOString();
    const userCards = Object.values(this.state.cards).filter(
      (c) => c.userId === userId && c.expiresAt > now
    );
    if (userCards.length === 0) return null;
    // Return latest created card
    userCards.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return userCards[0];
  }

  async getCardById(cardId: string): Promise<SessionCard | null> {
    return this.state.cards[cardId] || null;
  }

  async saveCard(card: SessionCard): Promise<void> {
    this.state.cards[card.id] = card;
    this.saveState(this.state);
  }

  async getAllCards(): Promise<SessionCard[]> {
    return Object.values(this.state.cards);
  }

  async getSystemConfig(): Promise<SystemConfig> {
    return this.state.systemConfig;
  }

  async saveSystemConfig(newConfig: SystemConfig): Promise<void> {
    this.state.systemConfig = newConfig;
    this.saveState(this.state);
  }
}

// Global singleton instance
export const appRepository = new FileAppRepository();
