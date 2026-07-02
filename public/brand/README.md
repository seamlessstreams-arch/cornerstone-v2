# Brand assets

`app-icon-source.png` — the master source for the app icon (house-in-crescent
mark: navy house, teal sparkle + sprout, on a cream tile), 1254×1254.

The favicon + PWA icon set is generated from this with `sharp`:

```js
const sharp = require("sharp");
const SRC = "public/brand/app-icon-source.png";
await sharp(SRC).resize(192,192,{kernel:"lanczos3"}).png().toFile("src/app/icon.png");      // favicon
await sharp(SRC).resize(180,180,{kernel:"lanczos3"}).png().toFile("public/apple-icon.png");  // Apple touch
await sharp(SRC).resize(192,192,{kernel:"lanczos3"}).png().toFile("public/icon-192.png");     // PWA
await sharp(SRC).resize(512,512,{kernel:"lanczos3"}).png().toFile("public/icon-512.png");     // PWA
await sharp(SRC).resize(512,512,{kernel:"lanczos3"}).png().toFile("public/icon-maskable.png");// PWA maskable
```

Referenced by `src/app/layout.tsx` (metadata), `src/app/manifest.ts` (PWA), and
`src/components/layout/sidebar.tsx` (in-app logo, via `/icon-192.png`).
