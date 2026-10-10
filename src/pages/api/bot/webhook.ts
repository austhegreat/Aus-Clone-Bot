import type { NextApiRequest, NextApiResponse } from "next";
import { webhookCallback } from "grammy";
import { telegramBot } from "@/lib/bot/bot";
import { config } from "@/lib/config";

// Disable Next.js body parser if grammY needs raw, or use default JSON handler
const handleUpdate = webhookCallback(telegramBot, "next-js", {
  secretToken: config.telegramWebhookSecret,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST for webhooks." });
  }

  // Security check for Telegram webhook secret token
  if (config.telegramWebhookSecret) {
    const receivedSecret = req.headers["x-telegram-bot-api-secret-token"];
    if (receivedSecret !== config.telegramWebhookSecret) {
      console.warn("Unauthorized webhook call: invalid secret token header");
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  try {
    await handleUpdate(req, res);
  } catch (error) {
    console.error("Webhook processing error:", error);
    if (!res.writableEnded) {
      res.status(500).json({ error: "Failed to process Telegram update" });
    }
  }
}
