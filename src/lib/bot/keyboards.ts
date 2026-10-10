import { InlineKeyboard } from "grammy";
import { SessionCard, SystemConfig } from "../../types";

/**
 * Builds the Telegram Inline Keyboard matching the observed reference bot layout:
 * [ Login PC ] [ Login Mobile ] [ Login TV ]
 * [ Subscribe Channel ]
 */
export function buildDeviceKeyboard(card: SessionCard, config?: SystemConfig): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  const pcLabel = config?.devices.pc.label || "Login PC";
  const mobileLabel = config?.devices.mobile.label || "Login Mobile";
  const tvLabel = config?.devices.tv.label || "Login TV";

  const pcUrl = card.deviceLinks.pc || config?.devices.pc.targetUrl || "http://localhost:3000/preview/pc";
  const mobileUrl = card.deviceLinks.mobile || config?.devices.mobile.targetUrl || "http://localhost:3000/preview/mobile";
  const tvUrl = card.deviceLinks.tv || config?.devices.tv.targetUrl || "http://localhost:3000/preview/tv";
  const channelUrl = card.channelUrl || config?.channelUrl || "https://t.me/aus_updates";

  // Row 1: The 3 Device Login URL buttons
  keyboard
    .url(pcLabel, pcUrl)
    .url(mobileLabel, mobileUrl)
    .url(tvLabel, tvUrl)
    .row();

  // Row 2: Channel Subscription URL button
  keyboard.url("📢 Subscribe Channel", channelUrl);

  return keyboard;
}
