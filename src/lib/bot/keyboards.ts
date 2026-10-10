import { InlineKeyboard } from "grammy";
import { SessionCard, SystemConfig } from "../../types";

/**
 * Builds the Telegram Inline Keyboard matching the observed reference bot layout:
 * [ 🖥️ Login PC ]     (opens /tv8?nftoken=...)
 * [ 📱 Login Mobile ] (opens /account?nftoken=...)
 * [ 📺 Login TV ]     (opens /unsupported?nftoken=...)
 * [ 📢 Subscribe Channel ]
 */
export function buildDeviceKeyboard(card: SessionCard, config?: SystemConfig): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  const pcLabel = config?.devices.pc.label || "🖥️ Login PC";
  const mobileLabel = config?.devices.mobile.label || "📱 Login Mobile";
  const tvLabel = config?.devices.tv.label || "📺 Login TV";

  const pcUrl = card.deviceLinks.pc;
  const mobileUrl = card.deviceLinks.mobile;
  const tvUrl = card.deviceLinks.tv;
  const channelUrl = card.channelUrl;

  // Single column vertical layout matching the screenshot
  keyboard.url(pcLabel, pcUrl).row();
  keyboard.url(mobileLabel, mobileUrl).row();
  keyboard.url(tvLabel, tvUrl).row();

  // Channel button on the bottom row if available
  if (channelUrl) {
    keyboard.url("📢 Subscribe Channel", channelUrl);
  }

  return keyboard;
}
