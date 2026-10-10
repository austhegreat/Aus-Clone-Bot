# Aus Clone Bot — Telegram Utility Bot & Companion Web Application

Independent reconstruction of the utility pass generator based on the observable interface of `@netflixgetlink_bot`. Built with **TypeScript**, **Next.js 14**, **Tailwind CSS**, **grammY**, and **Vitest**.

---

## 1. System Architecture

```text
                  TELEGRAM CLIENT
                         |
                  Telegram Bot API
                         |
                  grammY Bot Layer
                  (Polling or Webhook)
                         |
                         v
  WEB CLIENT --------> SHARED BACKEND API <-------- ADMIN PANEL
 (Next.js 14)       (/api/card, /api/config)     (URL & Plan Settings)
                         |
               Shared Core Business Logic
             - card-service.ts (Pass Provisioning)
             - formatter.ts (Telegram HTML & Date Formatter)
             - keyboards.ts (Device Buttons Layout)
                         |
                  Storage Layer
            - FileAppRepository (Local ACID JSON)
            - PostgreSQL (Production DDL in database/)
```

Both the **Telegram Bot** and the **Web Application** consume the identical business logic:
- `card-service.ts` ensures **idempotent session retrieval**: re-sending `/start` returns the active card rather than generating unnecessary duplicates.
- `formatter.ts` formats consistent card attributes (Status Heading, Region, Plan, Expiration, Device prompt).
- `keyboards.ts` builds the observed 2-row layout (`Login PC`, `Login Mobile`, `Login TV`, and `Subscribe Channel`).

---

## 2. Feature Parity Matrix

| Feature | Reference Bot (`@netflixgetlink_bot`) | Aus Clone Bot (Telegram) | Aus Clone Bot (Web App) | Test Coverage |
|---|---|---|---|---|
| **Result Card Header** | Observed (`Success! ...`) | ✅ Verified | ✅ Verified | `formatter.test.ts` |
| **Region Identifier** | Observed (`Australia (AU)`) | ✅ Verified | ✅ Verified | `formatter.test.ts` |
| **Subscription Plan** | Observed (`Premium Ultra HD`) | ✅ Verified | ✅ Verified | `formatter.test.ts` |
| **Expiration UTC** | Observed timestamp | ✅ Verified | ✅ Verified (with live countdown) | `formatter.test.ts` |
| **Device Selection Prompt**| Observed prompt | ✅ Verified | ✅ Verified | `formatter.test.ts` |
| **Login PC Action** | Observed URL Button | ✅ Verified | ✅ Verified (with PC Preview portal) | `keyboards.test.ts` |
| **Login Mobile Action** | Observed URL Button | ✅ Verified | ✅ Verified (with Mobile Gateway) | `keyboards.test.ts` |
| **Login TV Action** | Observed URL Button | ✅ Verified | ✅ Verified (with 6-Digit TV Gateway) | `keyboards.test.ts` |
| **Subscribe Channel** | Observed Channel Link | ✅ Verified | ✅ Verified | `keyboards.test.ts` |
| **Idempotent `/start`** | Returns active card | ✅ Verified | ✅ Verified | `card-service.test.ts` |
| **Interactive Simulator**| N/A | N/A | ✅ Embedded in Web Dashboard | Interactive |
| **Configurable URLs** | Unknown backend | ✅ Admin config | ✅ Live Admin tab (`/api/config`) | `card-service.test.ts` |

---

## 3. Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24.20.0)
- npm 9+ (tested on npm 12.0.2)

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Configuration
Copy the template to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials:
```env
# Optional for local Web testing, required for live Telegram Bot:
TELEGRAM_BOT_TOKEN=your_botfather_token_here
TELEGRAM_CHANNEL_URL=https://t.me/aus_updates

# Device Destination URLs (Configurable to any target domain):
PC_LOGIN_URL=http://localhost:3000/preview/pc
MOBILE_LOGIN_URL=http://localhost:3000/preview/mobile
TV_LOGIN_URL=http://localhost:3000/preview/tv

ADMIN_SECRET=admin123
```

### 3. Run Automated Tests
Execute the Vitest test suite:
```bash
npm test
```
All 12 unit and integration tests will run and report pass status.

### 4. Start the Web Dashboard
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view:
- **Pass Card**: The exact reconstructed card with device launchers and live countdown.
- **Bot Simulator**: An interactive in-browser Telegram chat simulator.
- **Admin Config**: Live editor to adjust region, plan, expiration duration, and device destination URLs.
- **Device Portals**:
  - PC Portal: [http://localhost:3000/preview/pc](http://localhost:3000/preview/pc)
  - Mobile Portal: [http://localhost:3000/preview/mobile](http://localhost:3000/preview/mobile)
  - Smart TV Portal: [http://localhost:3000/preview/tv](http://localhost:3000/preview/tv)

### 5. Running the Telegram Bot
You have two execution modes:

#### Mode A: Long Polling (Local Development)
No public domain or tunnel needed.
```bash
npm run bot:poll
```

#### Mode B: Webhook (Production)
Set your webhook via the Telegram Bot API:
```bash
curl -F "url=https://your-domain.com/api/bot/webhook" \
     -F "secret_token=your_secret_webhook_token_here" \
     https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook
```
Incoming updates are processed securely by `src/pages/api/bot/webhook.ts`.

---

## 4. API Endpoints

- `GET /api/health` — Service health check.
- `GET /api/card?userId=<id>` — Retrieve active user session card.
- `POST /api/card` — Provision or refresh session card.
- `GET /api/config` — View current system and device configuration.
- `POST /api/config` — Update destination URLs and defaults (requires `x-admin-secret` header).
- `GET /api/devices/:device?redirect=1` — Resolves and redirects to the configured device portal.
- `POST /api/bot/webhook` — Telegram webhook handler.

---

## 5. Security & Operational Policy

1. **Non-Harvesting Policy**: Aus Clone Bot does not collect, scrape, or store third-party credentials, cookies, or session tokens.
2. **Safe Destination Routing**: Device buttons open explicitly configured URLs managed by the application administrator.
3. **Admin Protection**: Modification of destination links and system defaults is protected by `ADMIN_SECRET`.
4. **Idempotency & Rate Safety**: Duplicate `/start` calls return the cached active session, preventing redundant database writes or token exhaustion.
