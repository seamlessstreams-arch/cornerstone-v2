// ══════════════════════════════════════════════════════════════════════════════
// CARA OS — REBRAND GUARD
//
// Fails if user-facing legacy brand terms reappear in source. The product was
// rebranded from "C-o-r-n-e-r-s-t-o-n-e Care OS" / "A-R-I-A" to Cara OS / Cara.
//
// Internal identifiers intentionally KEEP legacy names and are NOT violations:
//   - camel/Pascal/snake identifiers (AriaCommandId, ARIA_COMMANDS, aria_logs)
//   - lowercase path segments & module ids (src/lib/aria/, /api/aria/*)
//   - lowercase accessibility attributes (aria-label etc.)
// The word-boundary patterns below only match the standalone brand words.
//
// Run: npm run check:rebrand   (also enforced by the vitest suite)
// ══════════════════════════════════════════════════════════════════════════════

const fs = require("fs");
const path = require("path");

const root = process.cwd();

const SCAN_ROOTS = ["src", "public", "docs", "scripts", "README.md", "SETUP.md", ".env.example", "next.config.ts"];

const ignoredDirs = new Set([".git", "node_modules", ".next", "dist", "build", "coverage", ".tmp"]);

// Allowed to mention legacy terms: this guard itself, migration history,
// and the audit artefacts.
const allowedLegacyFiles = [
  "scripts/check-rebrand.js",
  "supabase/migrations",
  "cara-rebrand-audit-before.txt",
  "cara-rebrand-audit-after.txt",
];

// Standalone brand words only — \b keeps AriaCommandId / ARIA_MODEL /
// aria-label / CornerstoneEvent out of scope.
const legacyPatterns = [
  /\bCornerstone Care OS\b/,
  /\bCornerstone OS\b/,
  /\bCORNERSTONE\b/,
  /\bCornerstone\b/,
  /\bARIA\b/,
  /\bAria\b/,
];

const textExtensions = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".md", ".mdx",
  ".html", ".css", ".scss", ".sql", ".yml", ".yaml", ".txt", ".svg", ".example",
]);

const violations = [];

function scanFile(fullPath) {
  const relPath = path.relative(root, fullPath);
  if (allowedLegacyFiles.some((a) => relPath === a || relPath.startsWith(`${a}/`) || relPath.startsWith(`${a}${path.sep}`))) return;
  const ext = path.extname(fullPath).toLowerCase();
  const base = path.basename(fullPath);
  if (!textExtensions.has(ext) && !base.includes(".env")) return;
  let content;
  try {
    content = fs.readFileSync(fullPath, "utf8");
  } catch {
    return;
  }
  const lines = content.split("\n");
  for (const pattern of legacyPatterns) {
    for (let i = 0; i < lines.length; i++) {
      if (pattern.test(lines[i])) {
        violations.push(`${relPath}:${i + 1}: ${pattern} → ${lines[i].trim().slice(0, 100)}`);
        break; // one report per pattern per file keeps output readable
      }
    }
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else scanFile(fullPath);
  }
}

for (const scanRoot of SCAN_ROOTS) {
  const fullPath = path.join(root, scanRoot);
  if (!fs.existsSync(fullPath)) continue;
  if (fs.statSync(fullPath).isDirectory()) walk(fullPath);
  else scanFile(fullPath);
}

if (violations.length) {
  console.error("Legacy brand references found (product is Cara OS, AI is Cara):");
  for (const v of violations) console.error(`- ${v}`);
  process.exit(1);
}

console.log("Rebrand check passed: no user-facing legacy brand terms found.");
