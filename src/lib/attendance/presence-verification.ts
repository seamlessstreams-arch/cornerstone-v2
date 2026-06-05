// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — Presence verification for sign-in (Phase 5)
//
// Discrete, opt-in ways to confirm a staff member is physically at the home when
// they clock in — without any continuous location tracking and without storing raw
// coordinates.
//
//   • Kiosk / QR code — a time-rotating code shown on a device at the home. Staff
//     enter it; you can only read it if you're actually there. Proves RECENT
//     presence (the code changes), with a grace window for clock skew.
//   • Geofence — an optional ONE-TIME geolocation check at the moment of clock-in.
//     The server checks "within the home's radius?" and returns a pass/fail + a
//     COARSE band (on_site / nearby / off_site). The raw latitude/longitude are
//     used only for that instantaneous check and are NEVER returned or stored.
//   • Manual — explicit fallback, recorded as UNVERIFIED.
//
// HARD PRIVACY RULES (enforced by these types): a PresenceResult carries no
// coordinates — only method, verified and a coarse band. There is no continuous
// tracking: verification happens once, on the clock-in action, nowhere else.
//
// Pure + deterministic (time injected) → fully unit-tested.
// ══════════════════════════════════════════════════════════════════════════════

export type PresenceMethod = "kiosk" | "geofence" | "manual";

/** Coarse on-site band — deliberately NOT a precise distance (privacy). */
export type PresenceBand = "on_site" | "nearby" | "off_site";

export interface HomeSignInConfig {
  home_id: string;
  /** Geofence centre + radius for the optional one-time location check. */
  geofence: { latitude: number; longitude: number; radius_metres: number };
  /** Secret seed used to derive the rotating kiosk code (never sent to clients). */
  kiosk_seed: string;
  /** Minutes each kiosk code is valid before rotating. */
  kiosk_window_minutes: number;
}

// Per-home config. Coordinates here are the home's fixed location (config, not a
// person's), used only to evaluate the one-time check. Seeded for the demo home.
const HOME_CONFIG: Record<string, HomeSignInConfig> = {
  home_oak: {
    home_id: "home_oak",
    geofence: { latitude: 53.4808, longitude: -2.2426, radius_metres: 150 },
    kiosk_seed: "oak-kiosk-2026",
    kiosk_window_minutes: 15,
  },
};

const DEFAULT_CONFIG: HomeSignInConfig = HOME_CONFIG.home_oak;

export function getHomeSignInConfig(homeId: string): HomeSignInConfig {
  return HOME_CONFIG[homeId] ?? { ...DEFAULT_CONFIG, home_id: homeId };
}

// ── Kiosk / QR code (time-rotating, deterministic) ────────────────────────────

/** Deterministic, non-cryptographic hash → uppercase base36 (display only). */
function hashCode(input: string): string {
  let h = 2166136261; // FNV-1a basis
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // Two unsigned base36 chunks → a stable 6-char code, ambiguous chars avoided.
  const raw = (h >>> 0).toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
  return raw.replace(/[O0I1]/g, (c) => ({ O: "Q", "0": "7", I: "K", "1": "9" }[c] as string));
}

/** The window index for a given instant (codes rotate per window). */
function windowIndex(nowIso: string, windowMinutes: number): number {
  const ms = Date.parse(nowIso);
  if (Number.isNaN(ms)) return 0;
  return Math.floor(ms / 60000 / windowMinutes);
}

/** The kiosk code currently shown at a home (what the device displays). */
export function currentKioskCode(homeId: string, nowIso: string): string {
  const cfg = getHomeSignInConfig(homeId);
  const idx = windowIndex(nowIso, cfg.kiosk_window_minutes);
  return hashCode(`${cfg.kiosk_seed}:${homeId}:${idx}`);
}

/**
 * Verify an entered kiosk code. Accepts the current window AND the previous one, so
 * a code read a few minutes before clocking in still works (clock-skew grace).
 */
export function verifyKioskCode(homeId: string, code: string, nowIso: string): boolean {
  const entered = (code ?? "").trim().toUpperCase();
  if (entered.length < 4) return false;
  const cfg = getHomeSignInConfig(homeId);
  const idx = windowIndex(nowIso, cfg.kiosk_window_minutes);
  return entered === currentKioskCode(homeId, nowIso) || entered === hashCode(`${cfg.kiosk_seed}:${homeId}:${idx - 1}`);
}

// ── Geofence (one-time check; coordinates never stored) ───────────────────────

const EARTH_RADIUS_M = 6371000;
const toRad = (d: number) => (d * Math.PI) / 180;

/** Great-circle distance in metres between two lat/lng points. */
export function haversineMetres(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export interface GeofenceCheck {
  verified: boolean;
  band: PresenceBand;
}

/**
 * Evaluate a ONE-TIME location reading against the home geofence. Returns only a
 * pass/fail + coarse band — the caller MUST NOT persist the raw coordinates.
 */
export function verifyGeofence(homeId: string, coords: { lat: number; lng: number }): GeofenceCheck {
  const cfg = getHomeSignInConfig(homeId);
  const d = haversineMetres(cfg.geofence.latitude, cfg.geofence.longitude, coords.lat, coords.lng);
  const r = cfg.geofence.radius_metres;
  if (d <= r) return { verified: true, band: "on_site" };
  if (d <= r * 4) return { verified: false, band: "nearby" };
  return { verified: false, band: "off_site" };
}

// ── Unified presence verification ─────────────────────────────────────────────

export interface PresenceInput {
  homeId: string;
  method: PresenceMethod;
  /** Kiosk code (method = kiosk). */
  code?: string;
  /** One-time coordinates (method = geofence) — used here, never stored. */
  coords?: { lat: number; lng: number };
  nowIso: string;
}

/** The privacy-safe result: NO coordinates — only method, verified and a band. */
export interface PresenceResult {
  method: PresenceMethod;
  verified: boolean;
  band: PresenceBand | null;
  /** Short, non-identifying explanation for the UI/audit. */
  detail: string;
}

/**
 * Persisted record of a sign-in presence check. NOTE: carries method/verified/band
 * only — NEVER raw coordinates. This is the durable proof-of-presence trail.
 */
export interface SignInVerification {
  id: string;
  staff_id: string;
  shift_id: string | null;
  home_id: string;
  method: PresenceMethod;
  verified: boolean;
  band: PresenceBand | null;
  created_at: string;
}

export function verifyPresence(input: PresenceInput): PresenceResult {
  if (input.method === "kiosk") {
    const ok = verifyKioskCode(input.homeId, input.code ?? "", input.nowIso);
    return {
      method: "kiosk",
      verified: ok,
      band: ok ? "on_site" : null,
      detail: ok ? "Kiosk code confirmed — on site." : "Kiosk code did not match.",
    };
  }
  if (input.method === "geofence") {
    if (!input.coords) return { method: "geofence", verified: false, band: null, detail: "No location provided." };
    const g = verifyGeofence(input.homeId, input.coords);
    return {
      method: "geofence",
      verified: g.verified,
      band: g.band,
      detail: g.verified ? "Location confirmed on site." : `Location check: ${g.band.replace("_", " ")}.`,
    };
  }
  return { method: "manual", verified: false, band: null, detail: "Signed in without presence verification." };
}
