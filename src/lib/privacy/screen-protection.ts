// ══════════════════════════════════════════════════════════════════════════════
// CARA — Sensitive Screen Protection (Phase 6)
//
// Pure helpers deciding WHICH content is sensitive enough to obscure on screen, and
// how to label it. This is a DEFENCE-IN-DEPTH UI layer over the server-side
// permission engine (Phase 4) — it reduces shoulder-surfing / accidental exposure of
// already-permitted content. It is NEVER a security boundary on its own: the server
// still decides what a user may load. Unifies the two sensitivity scales used in the
// app (permissions `Sensitivity` + `CommsSensitivity`).
// ══════════════════════════════════════════════════════════════════════════════

/** Every sensitivity token used across the platform (both scales). */
export type AnySensitivity =
  | "public"
  | "internal"
  | "restricted"
  | "confidential"
  | "safeguarding"
  | "highly_restricted";

/** Sensitivities whose content is obscured by default (until revealed). */
export const PROTECTED_SENSITIVITIES: ReadonlySet<string> = new Set([
  "restricted",
  "confidential",
  "safeguarding",
  "highly_restricted",
]);

/** Should content at this sensitivity be obscured on screen by default? */
export function shouldProtect(sensitivity: string | null | undefined): boolean {
  return !!sensitivity && PROTECTED_SENSITIVITIES.has(sensitivity);
}

/** Ascending rank — higher = more sensitive (for sorting / "most sensitive wins"). */
export const SENSITIVITY_RANK: Record<AnySensitivity, number> = {
  public: 0,
  internal: 1,
  restricted: 2,
  confidential: 3,
  safeguarding: 4,
  highly_restricted: 4,
};

export function sensitivityRank(s: string | null | undefined): number {
  return s && s in SENSITIVITY_RANK ? SENSITIVITY_RANK[s as AnySensitivity] : 0;
}

const LABELS: Record<AnySensitivity, string> = {
  public: "Public",
  internal: "Internal",
  restricted: "Restricted",
  confidential: "Confidential",
  safeguarding: "Safeguarding",
  highly_restricted: "Highly restricted",
};

export function sensitivityLabel(s: string | null | undefined): string {
  return s && s in LABELS ? LABELS[s as AnySensitivity] : "Sensitive";
}

/** The more sensitive of two tokens (for a record spanning several fields). */
export function maxSensitivity(a: string | null | undefined, b: string | null | undefined): string {
  return sensitivityRank(a) >= sensitivityRank(b) ? (a ?? "public") : (b ?? "public");
}

// ── Auto-lock idle policy ─────────────────────────────────────────────────────

/** Default idle time (seconds) before the privacy screen auto-locks. */
export const DEFAULT_IDLE_LOCK_SECONDS = 120;

/** Selectable auto-lock intervals for the settings menu (seconds; 0 = off). */
export const IDLE_LOCK_OPTIONS: { label: string; seconds: number }[] = [
  { label: "Off", seconds: 0 },
  { label: "1 min", seconds: 60 },
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
];

/** Pure: given last-activity + now (ms) and a threshold (s), should we be locked? */
export function isIdleLocked(lastActivityMs: number, nowMs: number, idleSeconds: number): boolean {
  if (idleSeconds <= 0) return false;
  return nowMs - lastActivityMs >= idleSeconds * 1000;
}
