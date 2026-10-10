import { z } from "zod";

export type DeviceType = "pc" | "mobile" | "tv";

export interface DeviceConfig {
  deviceType: DeviceType;
  label: string;
  path: string; // e.g. '/tv8', '/account', '/unsupported'
  targetUrl: string;
  icon: string;
  isActive: boolean;
}

export interface SessionCard {
  id: string;
  userId: string;
  username?: string;
  statusHeading: string;
  region: string;
  plan: string;
  expiresAt: string; // ISO 8601 string
  formattedExpiryText?: string;
  nftoken: string; // The token parameter passed across all 3 device URLs
  createdAt: string;
  updatedAt: string;
  deviceLinks: {
    pc: string;
    mobile: string;
    tv: string;
  };
  channelUrl: string;
}

export interface SystemConfig {
  channelUrl: string;
  defaultHeading: string;
  defaultRegion: string;
  defaultPlan: string;
  sessionDurationHours: number;
  targetDomain: string; // Base domain for device URLs (e.g., http://localhost:3000 or custom)
  devices: Record<DeviceType, DeviceConfig>;
}

// Validation schemas using Zod
export const DeviceTypeSchema = z.enum(["pc", "mobile", "tv"]);

export const CardCreationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  username: z.string().optional(),
  statusHeading: z.string().optional(),
  region: z.string().optional(),
  plan: z.string().optional(),
  durationHours: z.number().int().positive().max(720).optional(),
});

export type CardCreationInput = z.infer<typeof CardCreationSchema>;

export const UpdateConfigSchema = z.object({
  channelUrl: z.string().url("Must be a valid URL").optional(),
  defaultHeading: z.string().min(1).optional(),
  defaultRegion: z.string().min(2).max(100).optional(),
  defaultPlan: z.string().min(2).max(100).optional(),
  sessionDurationHours: z.number().int().positive().max(720).optional(),
  targetDomain: z.string().optional(),
  devices: z
    .object({
      pc: z.object({ label: z.string().optional(), targetUrl: z.string().optional() }).optional(),
      mobile: z.object({ label: z.string().optional(), targetUrl: z.string().optional() }).optional(),
      tv: z.object({ label: z.string().optional(), targetUrl: z.string().optional() }).optional(),
    })
    .optional(),
});

export type UpdateConfigInput = z.infer<typeof UpdateConfigSchema>;

export interface FormattedMessage {
  text: string;
  parse_mode: "HTML" | "MarkdownV2";
}
