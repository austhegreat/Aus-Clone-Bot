import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: "ok",
    service: "Aus Clone Bot Companion API",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}
