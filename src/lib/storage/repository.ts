import { SessionCard, SystemConfig } from "../../types";

export interface UserRecord {
  id: string;
  telegramId?: number;
  username?: string;
  firstName?: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface IAppRepository {
  getUserByTelegramId(telegramId: number): Promise<UserRecord | null>;
  getUserById(id: string): Promise<UserRecord | null>;
  saveUser(user: UserRecord): Promise<void>;
  
  getActiveCardByUserId(userId: string): Promise<SessionCard | null>;
  getCardById(cardId: string): Promise<SessionCard | null>;
  saveCard(card: SessionCard): Promise<void>;
  getAllCards(): Promise<SessionCard[]>;

  getSystemConfig(): Promise<SystemConfig>;
  saveSystemConfig(config: SystemConfig): Promise<void>;
}
