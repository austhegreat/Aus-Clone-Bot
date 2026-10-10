import type { NextApiRequest, NextApiResponse } from "next";
import { cardService } from "@/lib/card-service";
import { config } from "@/lib/config";
import { UpdateConfigSchema } from "@/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const currentConfig = await cardService.getSystemConfig();
      return res.status(200).json({ success: true, config: currentConfig });
    }

    if (req.method === "POST") {
      // Validate admin authorization
      const authHeader = req.headers["x-admin-secret"];
      if (authHeader !== config.adminSecret) {
        return res.status(401).json({ success: false, error: "Unauthorized: Invalid admin secret" });
      }

      const parsed = UpdateConfigSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, errors: parsed.error.format() });
      }

      const updated = await cardService.updateSystemConfig(parsed.data);
      return res.status(200).json({ success: true, config: updated });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error: any) {
    console.error("API /api/config error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
