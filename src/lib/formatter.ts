import { SessionCard, FormattedMessage } from "../types";

/**
 * Formats a Date into the exact observed format:
 * D/M/YYYY, HH.MM.SS WIB
 * e.g. "8/10/2026, 23.12.03 WIB"
 */
export function formatObservedExpirationDate(isoString: string, timeZone: string = "Asia/Jakarta"): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const day = parts.find((p) => p.type === "day")?.value || "";
    const month = parts.find((p) => p.type === "month")?.value || "";
    const year = parts.find((p) => p.type === "year")?.value || "";
    const hour = parts.find((p) => p.type === "hour")?.value || "00";
    const minute = parts.find((p) => p.type === "minute")?.value || "00";
    const second = parts.find((p) => p.type === "second")?.value || "00";

    // Format as: D/M/YYYY, HH.MM.SS WIB
    return `${parseInt(day, 10)}/${parseInt(month, 10)}/${year}, ${hour}.${minute}.${second} WIB`;
  } catch {
    return date.toISOString();
  }
}

/**
 * Generates the exact Telegram HTML formatted message matching the reference bot:
 *
 * 🎉 NETCRACK Success!
 *
 * 🌍 Region: 🇯🇵 Japan
 * 📝 Plan: Premium
 * ⌛ Expires: 8/10/2026, 23.12.03 WIB
 *
 * Select device to login:
 */
export function formatCardForTelegram(card: SessionCard): FormattedMessage {
  const formattedExpiry = card.formattedExpiryText || formatObservedExpirationDate(card.expiresAt);

  const text = [
    `<b>🎉 ${escapeHtml(card.statusHeading)}</b>`,
    ``,
    `🌍 <b>Region:</b> ${card.region}`,
    `📝 <b>Plan:</b> ${card.plan}`,
    `⌛ <b>Expires:</b> ${formattedExpiry}`,
    ``,
    `Select device to login:`,
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
