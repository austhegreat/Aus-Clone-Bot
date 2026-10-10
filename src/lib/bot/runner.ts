import { createTelegramBot } from "./bot";
import { config } from "../config";

export async function startBotPolling() {
  if (!config.telegramBotToken) {
    console.error("Cannot start bot in polling mode: TELEGRAM_BOT_TOKEN is not defined in .env");
    process.exit(1);
  }

  const bot = createTelegramBot(config.telegramBotToken);
  console.log("Starting Aus Clone Bot in Long Polling mode...");

  await bot.start({
    onStart: (botInfo) => {
      console.log(`Bot started successfully as @${botInfo.username}`);
    },
  });
}

if (require.main === module) {
  startBotPolling().catch((err) => {
    console.error("Fatal bot error:", err);
    process.exit(1);
  });
}
