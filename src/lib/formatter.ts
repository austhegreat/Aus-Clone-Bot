import { SessionCard, FormattedMessage } from "../types";

/**
 * Formats a Date into a clean, human-readable UTC timestamp
 * e.g. "2026-10-12 16:30:00 UTC"
 */
export function formatExpirationDate(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const mins = String(date.getUTCMinutes()).padStart(2, "0");
  const secs = String(date.getUTCSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hours}:${mins}:${secs} UTC`;
}

/**
 * Generates the Telegram HTML formatted message matching the reference bot structure:
 * - Success heading
 * - Region information
 * - Subscription-plan information
 * - Expiration date and time
 * - Device selection prompt
 */
export function formatCardForTelegram(card: SessionCard): FormattedMessage {
  const formattedExpiry = formatExpirationDate(card.expiresAt);

  const text = [
    `<b>✅ ${escapeHtml(card.statusHeading)}</b>`,
    ``,
    `📍 <b>Region:</b> <code>${escapeHtml(card.region)}</code>`,
    `💎 <b>Plan:</b> <code>${escapeHtml(card.plan)}</code>`,
    `⏳ <b>Expiration:</b> <code>${formattedExpiry}</code>`,
    ``,
    `👇 <b>Please select your device to proceed:</b>`,
  ].join("\n");

  return {
    text,
    parse_mode: "HTML",
  };
}

/**
 * Helper to escape HTML characters for Telegram HTML parse_mode
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
