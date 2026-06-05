import { describe, it, expect } from "vitest";
import {
  haversineMetres, verifyGeofence, currentKioskCode, verifyKioskCode, verifyPresence,
  getHomeSignInConfig,
} from "../presence-verification";

const NOW = "2026-09-20T10:00:00.000Z";
const HOME = "home_oak";
const cfg = getHomeSignInConfig(HOME); // 53.4808, -2.2426, r=150

describe("haversineMetres", () => {
  it("is 0 for the same point", () => {
    expect(haversineMetres(53.4808, -2.2426, 53.4808, -2.2426)).toBe(0);
  });
  it("≈111km for one degree of latitude", () => {
    const d = haversineMetres(53, -2, 54, -2);
    expect(d).toBeGreaterThan(110000);
    expect(d).toBeLessThan(112000);
  });
});

describe("verifyGeofence (coarse bands, no precise distance leaked)", () => {
  it("on_site within the radius → verified", () => {
    const g = verifyGeofence(HOME, { lat: 53.48125, lng: -2.2426 }); // ~50m
    expect(g.verified).toBe(true);
    expect(g.band).toBe("on_site");
  });
  it("nearby (just outside radius, within 4x) → not verified", () => {
    const g = verifyGeofence(HOME, { lat: 53.4835, lng: -2.2426 }); // ~300m
    expect(g.verified).toBe(false);
    expect(g.band).toBe("nearby");
  });
  it("off_site far away → not verified", () => {
    const g = verifyGeofence(HOME, { lat: 53.6, lng: -2.5 });
    expect(g.verified).toBe(false);
    expect(g.band).toBe("off_site");
  });
});

describe("kiosk code (time-rotating, deterministic)", () => {
  it("is stable within a window and rotates across windows", () => {
    const a = currentKioskCode(HOME, NOW);
    const b = currentKioskCode(HOME, "2026-09-20T10:05:00.000Z"); // same 15-min window
    const c = currentKioskCode(HOME, "2026-09-20T11:00:00.000Z"); // later window
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).toHaveLength(6);
    expect(a).not.toMatch(/[O0I1]/); // ambiguous chars removed
  });

  it("verifies the current code and the previous-window code (grace), rejects others", () => {
    const code = currentKioskCode(HOME, NOW);
    expect(verifyKioskCode(HOME, code, NOW)).toBe(true);
    // a code from the previous window still works (read it, then clocked in)
    const prev = currentKioskCode(HOME, "2026-09-20T09:50:00.000Z");
    expect(verifyKioskCode(HOME, prev, NOW)).toBe(true);
    // a code from two windows ago does not
    const old = currentKioskCode(HOME, "2026-09-20T09:30:00.000Z");
    expect(verifyKioskCode(HOME, old, NOW)).toBe(false);
    expect(verifyKioskCode(HOME, "ZZZZZZ", NOW)).toBe(false);
    expect(verifyKioskCode(HOME, "12", NOW)).toBe(false);
  });
});

describe("verifyPresence", () => {
  it("kiosk: valid code verified, invalid not", () => {
    const code = currentKioskCode(HOME, NOW);
    expect(verifyPresence({ homeId: HOME, method: "kiosk", code, nowIso: NOW }).verified).toBe(true);
    expect(verifyPresence({ homeId: HOME, method: "kiosk", code: "NOPE12", nowIso: NOW }).verified).toBe(false);
  });
  it("geofence: on-site verified, off-site not; missing coords → not verified", () => {
    expect(verifyPresence({ homeId: HOME, method: "geofence", coords: { lat: 53.4808, lng: -2.2426 }, nowIso: NOW }).verified).toBe(true);
    expect(verifyPresence({ homeId: HOME, method: "geofence", coords: { lat: 53.6, lng: -2.5 }, nowIso: NOW }).verified).toBe(false);
    expect(verifyPresence({ homeId: HOME, method: "geofence", nowIso: NOW }).verified).toBe(false);
  });
  it("manual is recorded but never verified", () => {
    expect(verifyPresence({ homeId: HOME, method: "manual", nowIso: NOW }).verified).toBe(false);
  });

  it("PRIVACY: the result never carries coordinates", () => {
    const r = verifyPresence({ homeId: HOME, method: "geofence", coords: { lat: 53.4808, lng: -2.2426 }, nowIso: NOW });
    expect(Object.keys(r)).toEqual(expect.arrayContaining(["method", "verified", "band", "detail"]));
    expect(JSON.stringify(r)).not.toMatch(/lat|lng|coord|53\.48|-2\.24/);
  });
});

describe("home config", () => {
  it("home_oak has a geofence + kiosk window", () => {
    expect(cfg.geofence.radius_metres).toBeGreaterThan(0);
    expect(cfg.kiosk_window_minutes).toBeGreaterThan(0);
  });
});
