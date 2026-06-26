// ══════════════════════════════════════════════════════════════════════════════
// CARA — WORD-BOUNDARY KEYWORD MATCHING
//
// The shared, correct way to test whether a piece of free text mentions a
// keyword. Plain `text.includes(keyword)` is wrong for keyword detection: short
// keywords match INSIDE unrelated words ("firefighter" ⊃ "fight", "commissioning"
// ⊃ "missing", "decrying" ⊃ "crying"), producing false signals — the recurring
// keyword-matching bug class in this codebase.
//
// This requires a word boundary BEFORE the keyword, which removes the
// internal-substring false positives while STILL matching natural suffixes
// ("image" → "images") — important so genuine concerns are never missed.
// Multi-word and hyphenated keywords ("county lines", "self-harm") work.
// ══════════════════════════════════════════════════════════════════════════════

const _cache = new Map<string, RegExp>();

function boundaryRegex(keyword: string): RegExp {
  let re = _cache.get(keyword);
  if (!re) {
    re = new RegExp("\\b" + keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    _cache.set(keyword, re);
  }
  return re;
}

/** True if `text` mentions `keyword` at a word boundary (case-insensitive). */
export function matchesKeyword(text: string, keyword: string): boolean {
  if (!text || !keyword) return false;
  return boundaryRegex(keyword).test(text);
}

/** Keywords from `keywords` that appear in `text` (word-boundary matched). */
export function matchedKeywords(text: string, keywords: readonly string[]): string[] {
  if (!text) return [];
  return keywords.filter((kw) => matchesKeyword(text, kw));
}

/** True if ANY of `keywords` appears in `text`. */
export function containsAnyKeyword(text: string, keywords: readonly string[]): boolean {
  if (!text) return false;
  return keywords.some((kw) => matchesKeyword(text, kw));
}
