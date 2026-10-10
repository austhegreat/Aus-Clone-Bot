# Original Telegram Bot Reconnaissance Audit — Aus Clone Bot

## 1. Verified Evidence from User Screenshots

Based on the three provided inspection screenshots of `@netflixgetlink_bot`, the exact UI structure, destination URLs, and parameters have been fully decoded:

### Message Card Anatomy
```text
🎉 NETCRACK Success!

🌍 Region: 🇯🇵 Japan
📝 Plan: Premium
⌛ Expires: 8/10/2026, 23.12.03 WIB

Select device to login:
```

### Exact Field Specifications
| Field | Observed Visual Format | Example Value | Notes |
|---|---|---|---|
| **Status Banner** | `🎉 NETCRACK Success!` | `🎉 NETCRACK Success!` | Celebratory emoji + system moniker + status |
| **Region** | `🌍 Region: [Flag] [Name]` | `🌍 Region: 🇯🇵 Japan` | Globe emoji + Country flag + Country name |
| **Plan** | `📝 Plan: [Plan Name]` | `📝 Plan: Premium` | Notepad emoji + subscription tier |
| **Expiration** | `⌛ Expires: D/M/YYYY, HH.MM.SS [TZ]` | `⌛ Expires: 8/10/2026, 23.12.03 WIB` | Hourglass emoji + timestamp with timezone |
| **Prompt** | `Select device to login:` | `Select device to login:` | Direct, unadorned prompt text |

### Device Action Buttons (1 Column Stack)
Unlike horizontal rows, all three device buttons are stacked vertically:
1. `🖥️ Login PC`
2. `📱 Login Mobile`
3. `📺 Login TV`

### Destination URLs & Parameter Analysis
The tooltip inspection reveals the exact destinations and query parameter schemas:

| Button | Exact Observed Destination URL | Target Path | Parameter Name |
|---|---|---|---|
| `🖥️ Login PC` | `https://www.netflix.com/tv8?nftoken={TOKEN}` | `/tv8` | `nftoken` |
| `📱 Login Mobile` | `https://www.netflix.com/account?nftoken={TOKEN}` | `/account` | `nftoken` |
| `📺 Login TV` | `https://www.netflix.com/unsupported?nftoken={TOKEN}` | `/unsupported` | `nftoken` |

#### Token Properties (`nftoken`):
- All three device buttons share the **identical** token payload in a single message turn.
- Length: ~260+ characters, Base64-like URL encoded payload with `+` and `/` delimiters.
- Purpose: Represents an encoded streaming session token or authentication ticket.

---

## 2. Ethical & Architectural Boundary Assessment

- **Analysis of Reference Bot:** The reference bot distributes shared third-party tokens under the moniker "NETCRACK" for streaming service bypass.
- **Strict Compliance Rule:** In accordance with project requirements and ethical software engineering:
  1. Aus Clone Bot will **not** crack, scrape, or harvest unauthorized third-party credentials or active Netflix account tokens.
  2. The application reproduces the complete interface structure, layout, emoji conventions, token generation mechanics (`nftoken`), and parameter routing.
  3. Destination targets (`/tv8`, `/account`, `/unsupported`) are hosted locally / configurably on the companion web application as functional simulation portals, while allowing administrators to configure any target domain via the Admin configuration panel.
