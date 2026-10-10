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
  defaultHeading: process.env.DEFAULT_HEADING || "NETCRACK Success!",
  defaultRegion: process.env.DEFAULT_REGION || "🇯🇵 Japan",
  defaultPlan: process.env.DEFAULT_PLAN || "Premium",
  sessionDurationHours: parseInt(process.env.SESSION_DURATION_HOURS || "48", 10),

  // Target Domain for Destination URLs (Configurable: local simulation or external target)
  targetDomain: process.env.TARGET_DOMAIN || "http://localhost:3000",
  pcPath: process.env.PC_PATH || "/tv8",
  mobilePath: process.env.MOBILE_PATH || "/account",
  tvPath: process.env.TV_PATH || "/unsupported",

  // Security & Admin
  adminSecret: process.env.ADMIN_SECRET || "admin123",
  dataDir: process.env.DATA_DIR || "./data",
};
