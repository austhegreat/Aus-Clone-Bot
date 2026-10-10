import type { NextApiRequest, NextApiResponse } from "next";
import { cardService } from "@/lib/card-service";
import { DeviceTypeSchema } from "@/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { device, redirect } = req.query;

  const parsedDevice = DeviceTypeSchema.safeParse(device);
  if (!parsedDevice.success) {
    return res.status(400).json({ success: false, error: "Invalid device. Must be 'pc', 'mobile', or 'tv'" });
  }

  try {
    const targetUrl = await cardService.resolveDeviceUrl(parsedDevice.data);

    if (redirect === "true" || redirect === "1") {
      return res.redirect(302, targetUrl);
    }

    return res.status(200).json({
      success: true,
      device: parsedDevice.data,
      targetUrl,
    });
  } catch (error) {
    console.error("Device resolver error:", error);
    return res.status(500).json({ success: false, error: "Failed to resolve device URL" });
  }
}
