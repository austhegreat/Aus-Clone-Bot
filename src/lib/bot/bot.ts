import { Bot } from "grammy";
import { config } from "../config";
import { cardService } from "../card-service";
import { formatCardForTelegram } from "../formatter";
import { buildDeviceKeyboard } from "./keyboards";

// Initialize grammY Bot instance
// If no token is provided in local testing, we create a bot with a mock token or export a builder
export function createTelegramBot(token: string = config.telegramBotToken): Bot {
  if (!token) {
    console.warn("Warning: TELEGRAM_BOT_TOKEN is not set. Bot will run in mock mode.");
  }

  const bot = new Bot(token || "123456789:AAFakeTokenForLocalTestingInitialization");

  // Error boundary handler
  bot.catch((err) => {
    console.error("Telegram Bot Error:", err.message);
  });

  // /start command: Core observed interaction
  bot.command("start", async (ctx) => {
    try {
      const userId = ctx.from ? String(ctx.from.id) : "anonymous_telegram_user";
      const username = ctx.from?.username || ctx.from?.first_name || "User";

      // Shared business logic: idempotent card retrieval
      const card = await cardService.getOrCreateSessionCard(userId, username);
      const formatted = formatCardForTelegram(card);
      const keyboard = buildDeviceKeyboard(card);

      await ctx.reply(formatted.text, {
        parse_mode: formatted.parse_mode,
        reply_markup: keyboard,
      });
    } catch (error) {
      console.error("Error executing /start command:", error);
      await ctx.reply("❌ Unable to provision your access card at this moment. Please try again shortly.");
    }
  });

  // /status command: View current active pass
  bot.command("status", async (ctx) => {
    try {
      const userId = ctx.from ? String(ctx.from.id) : "anonymous_telegram_user";
      const card = await cardService.getOrCreateSessionCard(userId);
      const formatted = formatCardForTelegram(card);
      const keyboard = buildDeviceKeyboard(card);

      await ctx.reply(formatted.text, {
        parse_mode: formatted.parse_mode,
        reply_markup: keyboard,
      });
    } catch (error) {
      console.error("Error checking /status:", error);
      await ctx.reply("❌ Unable to check status. Please try again.");
    }
  });

  // /refresh command: Generates a refreshed pass
  bot.command("refresh", async (ctx) => {
    try {
      const userId = ctx.from ? String(ctx.from.id) : "anonymous_telegram_user";
      const username = ctx.from?.username;
      const card = await cardService.createNewCard(userId, username);
      const formatted = formatCardForTelegram(card);
      const keyboard = buildDeviceKeyboard(card);

      await ctx.reply(`🔄 <b>Pass Refreshed!</b>\n\n${formatted.text}`, {
        parse_mode: formatted.parse_mode,
        reply_markup: keyboard,
      });
    } catch (error) {
      console.error("Error executing /refresh:", error);
      await ctx.reply("❌ Failed to refresh pass.");
    }
  });

  // /help command
  bot.command("help", async (ctx) => {
    const helpText = [
      `<b>🤖 Aus Clone Bot — Help & Commands</b>`,
      ``,
      `• /start — Retrieve or generate your device login card`,
      `• /status — Check active pass details and expiration`,
      `• /refresh — Force generation of a fresh access card`,
      `• /help — Show this help message`,
      ``,
      `<i>Click any of the device buttons below your card to log in.</i>`,
    ].join("\n");

    await ctx.reply(helpText, { parse_mode: "HTML" });
  });

  return bot;
}

export const telegramBot = createTelegramBot();
