// ══════════════════════════════════════════════════════════════════════════════
// Tests: AriaPatternAlert _testing exports
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { _testing } from "@/components/aria/aria-pattern-alert";

const { CATEGORY_CONFIG, SEVERITY_CONFIG, generateDemoPatterns } = _testing;

describe("AriaPatternAlert", () => {
  // ── Config ────────────────────────────────────────────────────────────────
  describe("CATEGORY_CONFIG", () => {
    it("has all 8 pattern categories", () => {
      const cats = [
        "incident_escalation", "mood_decline", "missing_repeat",
        "behaviour_cycle", "safeguarding_theme", "medication_concern",
        "positive_trend", "contact_disruption",
      ];
      for (const c of cats) {
        expect(CATEGORY_CONFIG[c as keyof typeof CATEGORY_CONFIG]).toBeDefined();
      }
    });

    it("each category has label, icon, colour, bg", () => {
      for (const [, cfg] of Object.entries(CATEGORY_CONFIG)) {
        expect(cfg.label).toBeTruthy();
        expect(cfg.icon).toBeTruthy();
        expect(cfg.colour).toBeTruthy();
        expect(cfg.bg).toBeTruthy();
      }
    });
  });

  describe("SEVERITY_CONFIG", () => {
    it("has all 4 severity levels", () => {
      expect(SEVERITY_CONFIG.critical).toBeDefined();
      expect(SEVERITY_CONFIG.elevated).toBeDefined();
      expect(SEVERITY_CONFIG.monitor).toBeDefined();
      expect(SEVERITY_CONFIG.positive).toBeDefined();
    });

    it("each severity has label, colour, bg, border, ring", () => {
      for (const [, cfg] of Object.entries(SEVERITY_CONFIG)) {
        expect(cfg.label).toBeTruthy();
        expect(cfg.colour).toBeTruthy();
        expect(cfg.bg).toBeTruthy();
        expect(cfg.border).toBeTruthy();
        expect(cfg.ring).toBeTruthy();
      }
    });
  });

  // ── generateDemoPatterns ──────────────────────────────────────────────────
  describe("generateDemoPatterns", () => {
    it("generates child-scope patterns", () => {
      const patterns = generateDemoPatterns("child", "Alex W");
      expect(patterns.length).toBeGreaterThan(0);
      for (const p of patterns) {
        expect(p.id).toBeTruthy();
        expect(p.category).toBeTruthy();
        expect(p.severity).toBeTruthy();
        expect(p.title).toBeTruthy();
        expect(p.description).toBeTruthy();
        expect(p.suggestedAction).toBeTruthy();
        expect(p.period).toBeTruthy();
        expect(typeof p.dataPoints).toBe("number");
        expect(p.detectedAt).toBeTruthy();
      }
    });

    it("generates home-scope patterns", () => {
      const patterns = generateDemoPatterns("home");
      expect(patterns.length).toBeGreaterThan(0);
    });

    it("child patterns include child name", () => {
      const patterns = generateDemoPatterns("child", "Jordan M");
      const withName = patterns.filter((p) => p.childName === "Jordan M");
      expect(withName.length).toBeGreaterThan(0);
    });

    it("includes both concerning and positive patterns", () => {
      const childPatterns = generateDemoPatterns("child", "Alex W");
      const positives = childPatterns.filter((p) => p.severity === "positive");
      const concerns = childPatterns.filter((p) => p.severity !== "positive");
      expect(positives.length).toBeGreaterThan(0);
      expect(concerns.length).toBeGreaterThan(0);
    });

    it("home patterns include critical severity", () => {
      const patterns = generateDemoPatterns("home");
      const critical = patterns.filter((p) => p.severity === "critical");
      expect(critical.length).toBeGreaterThan(0);
    });

    it("each pattern has a suggested action", () => {
      const patterns = [
        ...generateDemoPatterns("child", "Test"),
        ...generateDemoPatterns("home"),
      ];
      for (const p of patterns) {
        expect(p.suggestedAction.length).toBeGreaterThan(20);
      }
    });

    it("data points are positive numbers", () => {
      const patterns = [
        ...generateDemoPatterns("child", "Test"),
        ...generateDemoPatterns("home"),
      ];
      for (const p of patterns) {
        expect(p.dataPoints).toBeGreaterThan(0);
      }
    });
  });
});
