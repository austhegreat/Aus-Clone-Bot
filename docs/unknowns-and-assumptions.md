# Unknowns, Assumptions, and Missing Evidence — Aus Clone Bot

## 1. Verified Evidence
- **Bot Handle:** `@netflixgetlink_bot` (`https://t.me/netflixgetlink_bot`)
- **Key Interface Components:**
  - Status/Success Heading.
  - Region indicator.
  - Subscription plan details.
  - Expiration date and time.
  - Device selection prompt.
  - 3 Device Action Buttons: `Login PC`, `Login Mobile`, `Login TV`.
  - 1 Channel Subscription Button: `Subscribe Channel`.
- **Observed Behavior:**
  - Re-issuing `/start` produces the same result card idempotently.
  - `Subscribe Channel` directs to a Telegram channel link.
  - Device buttons open external URLs.

## 2. Pending Evidence & Unknowns
1. **Device Destination URLs:**
   - The exact domains and path structures for `Login PC`, `Login Mobile`, and `Login TV` have not yet been provided.
   - **Resolution in Aus Clone Bot:** Configurable URL parameters with authorized internal redirect and demo landing pages for each device (PC portal, Mobile web simulation, and TV activation code entry). Once the user supplies the exact public domains and screenshots, these endpoints can be updated instantly without structural changes.
2. **Channel Destination:**
   - The specific public channel handle/URL for `Subscribe Channel` is pending user specification.
   - **Resolution in Aus Clone Bot:** Configurable via `TELEGRAM_CHANNEL_URL` in environment / database settings (default: `https://t.me/aus_updates`).
3. **Third-Party Credential Policy:**
   - **Strict Non-Infringement Rule:** In compliance with ethical software engineering, Aus Clone Bot does not store, harvest, scrape, or automate third-party passwords, cookies, or session tokens. All access credentials/tokens managed by the bot represent internal session tokens, authorized API keys, or demonstration data.
