import dotenv from "dotenv";
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  
  // Telegram Bot Credentials
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
  telegramChannelUrl: process.env.TELEGRAM_CHANNEL_URL || "https://t.me/aus_updates",
  telegramWebhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET || "aus_bot_secret_token",
  
  // Defaults for Session Cards
  defaultRegion: process.env.DEFAULT_REGION || "Australia (AU)",
  defaultPlan: process.env.DEFAULT_PLAN || "Premium Ultra HD (4K)",
  sessionDurationHours: parseInt(process.env.SESSION_DURATION_HOURS || "48", 10),

  // Device Destination URLs (Pending Inspection / Configurable)
  pcLoginUrl: process.env.PC_LOGIN_URL || "http://localhost:3000/preview/pc",
  mobileLoginUrl: process.env.MOBILE_LOGIN_URL || "http://localhost:3000/preview/mobile",
  tvLoginUrl: process.env.TV_LOGIN_URL || "http://localhost:3000/preview/tv",

  // Security & Admin
  adminSecret: process.env.ADMIN_SECRET || "admin123",
  dataDir: process.env.DATA_DIR || "./data",
};
