# Cara — Install Guide kit

Print-and-share materials for getting Cara onto staff phones, tablets and
computers. Cara is an installable web app (PWA) — **no App Store download**.

**Live address:** https://cara-os-fresh.vercel.app

## What's in here
| File | Use |
|---|---|
| `Cara-Install-Guide.pdf` | One-page printable guide (with QR code) for noticeboards / onboarding |
| `Cara-Install-Guide.docx` | Editable Word version of the same guide |
| `cornerstone-install-qr.png` | Standalone QR code (800px) for posters, the wifi sign, email signatures |

Regenerate the PDF + QR any time:
```bash
node scripts/generate-install-guide.mjs        # → Cara-Install-Guide.pdf
```
(uses `qrcode` + `playwright`, both in devDependencies)

## Install steps (quick reference)

**iPhone / iPad** — use **Safari**: open the address → **Share** → **Add to Home Screen** → **Add**.

**Android** — use **Chrome**: open the address → **Install app** prompt (or **⋮ → Install app**) → **Install**.

**Mac / Windows** — **Chrome or Edge**: open the address → **install icon** in the address bar (or **⋮ → Install Cara…**).

## Good to know
- Free — no account or app store needed.
- Auto-updates to the latest version.
- Works on a weak signal (the app still opens offline) — but for safety, **live care data is never shown offline**; a banner makes the offline state clear.
