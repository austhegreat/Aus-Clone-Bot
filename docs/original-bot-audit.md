# Original Telegram Bot Reconnaissance Audit — Aus Clone Bot

## 1. Target Identity & Observed Interface
- **Reference Bot Username:** `@netflixgetlink_bot`
- **Reference Bot URL:** `https://t.me/netflixgetlink_bot`
- **Replacement Project Name:** `Aus Clone Bot`
- **Reconnaissance Date:** Current Analysis Phase
- **Operational Policy:** Independent utility reconstruction using observable UI patterns and authorized configuration only. No collection of 3rd-party credentials, session tokens, or unauthorized account access.

## 2. Observed Message Structure & Card Layout
Upon invoking `/start`, the reference bot renders a structured result/access card containing:

1. **Header / Status Banner:** Success indicator (e.g., status heading confirming active access or generation).
2. **Region Field:** Geographic region code/name (e.g., `Australia (AU)`, `United States (US)`).
3. **Subscription Plan:** Plan tier specification (e.g., `Premium Ultra HD`, `Standard`).
4. **Expiration Timestamp:** Explicit date and time when the current pass/session expires.
5. **Instructional Prompt:** Prompt guiding the user to select their target device.
6. **Device Action Buttons (Inline Keyboard):**
   - `🖥️ Login PC` (or `Login PC`): Inline URL button directing to a device-specific launch URL.
   - `📱 Login Mobile` (or `Login Mobile`): Inline URL button directing to mobile web / deep-link.
   - `📺 Login TV` (or `Login TV`): Inline URL button directing to TV-activation / code portal.
7. **Auxiliary Action Button:**
   - `📢 Subscribe Channel`: Inline URL button directing to a public Telegram announcement channel.

## 3. Interaction Observations
- **Repeat `/start` Execution:** Re-sending `/start` renders the active result card without error, acting idempotently or retrieving the active session.
- **Button Nature:** The device buttons are Telegram inline URL buttons (`inline_keyboard` with `url` field) rather than internal state transitions.
- **Pending Inspections:** The destination URLs for PC, Mobile, and TV are marked as **Pending Inspection** awaiting destination domain verification from the user. In the replacement application, these destinations are fully configurable via admin/environment settings and use safe, authorized redirect endpoints.
