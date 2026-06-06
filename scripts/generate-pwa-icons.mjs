// Generates the Cornerstone PWA icons from a branded SVG using sharp.
//   node scripts/generate-pwa-icons.mjs
// Outputs to public/: icon-192.png, icon-512.png, icon-maskable.png, apple-icon.png
// Brand: the Cornerstone logo — navy crescent "C" + house, teal plant sprig + sparkle, on cream.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const OUT = new URL("../public/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

// rounded: rounded-square corners (purpose "any"); false = full-bleed for maskable/apple.
// scale: foreground scale (maskable/apple need a safe-zone margin).
// Brand mark: navy crescent "C" cradling a house, with a teal plant sprig + sparkle,
// on a cream ground — a vector rendition of the Cornerstone logo.
function svg({ rounded, scale = 1 }) {
  const r = rounded ? 112 : 0;
  const art = `
    <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">
      <!-- light-teal glow echo, upper-right -->
      <path d="M 404,150 A 214,214 0 0 1 470,344" fill="none" stroke="#a9dad2" stroke-width="13" stroke-linecap="round"/>
      <!-- navy crescent C (outer circle minus inner offset circle) -->
      <path fill-rule="evenodd" fill="#1e3a5f"
            d="M 37,256 a 198,198 0 1 0 396,0 a 198,198 0 1 0 -396,0 Z
               M 130,256 a 168,168 0 1 0 336,0 a 168,168 0 1 0 -336,0 Z"/>
      <!-- house: roof + body -->
      <path fill="#1e3a5f" d="M 210,302 L 300,208 L 390,302 Z"/>
      <rect x="246" y="298" width="108" height="106" fill="#1e3a5f"/>
      <!-- window panes (cut-out to the cream ground) -->
      <rect x="276" y="322" width="22" height="22" rx="4" fill="#f4efe6"/>
      <rect x="304" y="322" width="22" height="22" rx="4" fill="#f4efe6"/>
      <rect x="276" y="350" width="22" height="22" rx="4" fill="#f4efe6"/>
      <rect x="304" y="350" width="22" height="22" rx="4" fill="#f4efe6"/>
      <!-- foundation steps -->
      <rect x="226" y="410" width="148" height="13" rx="3" fill="#1e3a5f"/>
      <rect x="238" y="430" width="124" height="13" rx="3" fill="#1e3a5f"/>
      <!-- plant sprig (stem + two leaves) -->
      <path d="M 392,434 C 384,388 400,346 404,300 C 406,288 411,280 418,272"
            fill="none" stroke="url(#leaf)" stroke-width="11" stroke-linecap="round"/>
      <path d="M 404,324 C 430,302 454,314 448,340 C 428,348 408,340 404,324 Z" fill="url(#leaf)"/>
      <path d="M 407,286 C 394,262 408,242 429,245 C 429,267 424,283 407,286 Z" fill="url(#leaf)"/>
      <!-- sparkle -->
      <path d="M 374,204 C 376,223 382,229 401,231 C 382,233 376,239 374,258 C 372,239 366,233 347,231 C 366,229 372,223 374,204 Z" fill="#34a7c2"/>
    </g>`;
  return `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1aa698"/>
        <stop offset="1" stop-color="#0b7d70"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="512" height="512" rx="${r}" fill="#f4efe6"/>
    ${art}
  </svg>`;
}

async function render(svgStr, size, file) {
  await sharp(Buffer.from(svgStr)).resize(size, size).png().toFile(OUT + file);
  console.log("wrote", file, size);
}

await render(svg({ rounded: true }), 192, "icon-192.png");
await render(svg({ rounded: true }), 512, "icon-512.png");
await render(svg({ rounded: false, scale: 0.78 }), 512, "icon-maskable.png"); // safe zone for OS masks
await render(svg({ rounded: false, scale: 0.86 }), 180, "apple-icon.png");    // iOS rounds it itself
console.log("done");
