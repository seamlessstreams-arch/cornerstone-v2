// ══════════════════════════════════════════════════════════════════════════════
// CARA OS — CANONICAL BRAND CONFIG
//
// Single source of truth for product naming. Import BRAND rather than
// hard-coding the product name in chrome, metadata or templates.
//
// History: the product and its AI layer were rebranded to Cara / Cara OS in
// June 2026. Internal identifiers from the original brand (AriaCommandId,
// aria_* tables, /api/aria/* endpoints, ARIA_* env vars, the cs-/--cs- CSS
// prefix) keep their legacy names for stability — they are never user-facing.
// New env vars use CARA_* with the legacy ARIA_* still honoured as a fallback.
// ══════════════════════════════════════════════════════════════════════════════

export const BRAND = {
  productName: process.env.NEXT_PUBLIC_APP_NAME || "Cara OS",
  shortName: process.env.NEXT_PUBLIC_APP_SHORT_NAME || "Cara",
  legalName: "Cara OS",
  intelligenceName: process.env.NEXT_PUBLIC_AI_NAME || "Cara Intelligence",
  insightsName: "Cara Insights",
  assistantName: process.env.NEXT_PUBLIC_ASSISTANT_NAME || "Cara Assistant",
  studioName: "Cara Studio",
  draftsName: "Cara Drafts",
  advisesName: "Cara Advises",
  recognisesName: "Cara Recognises",
  knowledgeBankName: "Cara Knowledge Bank",
  practiceIntelligenceName: "Cara Practice Intelligence",
  tagline:
    "Care intelligence, quality assurance, and operational oversight for children's homes.",
  description:
    "Cara OS brings care records, quality assurance, workforce oversight, compliance workflows, and Cara Intelligence together in one secure operating system for children's homes.",
} as const;

export type BrandKey = keyof typeof BRAND;
