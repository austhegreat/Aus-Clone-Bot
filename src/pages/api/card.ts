import type { NextApiRequest, NextApiResponse } from "next";
import { cardService } from "@/lib/card-service";
import { formatCardForTelegram } from "@/lib/formatter";
import { CardCreationSchema } from "@/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const userId = (req.query.userId as string) || "web_guest_user";
      const card = await cardService.getOrCreateSessionCard(userId);
      const formatted = formatCardForTelegram(card);

      return res.status(200).json({
        success: true,
        card,
        formattedTelegram: formatted,
      });
    }

    if (req.method === "POST") {
      const parsed = CardCreationSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          errors: parsed.error.format(),
        });
      }

      const { userId, username, region, plan, durationHours } = parsed.data;
      const card = await cardService.createNewCard(userId, username, {
        region,
        plan,
        durationHours,
      });
      const formatted = formatCardForTelegram(card);

      return res.status(201).json({
        success: true,
        card,
        formattedTelegram: formatted,
      });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error: any) {
    console.error("API /api/card error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
