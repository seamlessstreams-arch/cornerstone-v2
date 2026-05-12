// ══════════════════════════════════════════════════════════════════════════════
// Tests: AriaReg45Evidence _testing exports
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { _testing } from "@/components/aria/aria-reg45-evidence";

const { STATUS_CONFIG, getDemoReg45 } = _testing;

describe("AriaReg45Evidence", () => {
  describe("STATUS_CONFIG", () => {
    it("has all evidence statuses", () => {
      expect(STATUS_CONFIG.complete).toBeDefined();
      expect(STATUS_CONFIG.partial).toBeDefined();
      expect(STATUS_CONFIG.missing).toBeDefined();
      expect(STATUS_CONFIG.not_applicable).toBeDefined();
    });

    it("each status has label, colour, bg, and dot", () => {
      for (const [, cfg] of Object.entries(STATUS_CONFIG)) {
        expect(cfg.label).toBeTruthy();
        expect(cfg.colour).toBeTruthy();
        expect(cfg.bg).toBeTruthy();
        expect(cfg.dot).toBeTruthy();
      }
    });
  });

  describe("getDemoReg45", () => {
    const data = getDemoReg45();

    it("has month label", () => {
      expect(data.monthLabel).toBeTruthy();
    });

    it("has due date and days until due", () => {
      expect(data.dueDate).toBeTruthy();
      expect(data.daysUntilDue).toBeGreaterThanOrEqual(0);
    });

    it("has 9 Reg 45 categories", () => {
      expect(data.categories).toHaveLength(9);
    });

    it("progress is between 0 and 100", () => {
      expect(data.overallProgress).toBeGreaterThanOrEqual(0);
      expect(data.overallProgress).toBeLessThanOrEqual(100);
    });

    it("completeCategories matches actual complete count", () => {
      const complete = data.categories.filter((c) => c.status === "complete").length;
      expect(data.completeCategories).toBe(complete);
    });

    it("each category has required fields", () => {
      for (const cat of data.categories) {
        expect(cat.id).toBeTruthy();
        expect(cat.label).toBeTruthy();
        expect(cat.icon).toBeTruthy();
        expect(cat.regulation).toMatch(/^Reg 45/);
        expect(cat.description).toBeTruthy();
        expect(["complete", "partial", "missing", "not_applicable"]).toContain(cat.status);
        expect(typeof cat.itemCount).toBe("number");
        expect(typeof cat.requiredCount).toBe("number");
        expect(Array.isArray(cat.gaps)).toBe(true);
      }
    });

    it("categories with gaps have status partial or missing", () => {
      for (const cat of data.categories) {
        if (cat.gaps.length > 0) {
          expect(["partial", "missing"]).toContain(cat.status);
        }
      }
    });

    it("includes safeguarding as first category", () => {
      expect(data.categories[0].id).toBe("safeguarding");
      expect(data.categories[0].regulation).toBe("Reg 45(2)(a)");
    });

    it("covers all 9 Reg 45 subsections (a through i)", () => {
      const regs = data.categories.map((c) => c.regulation);
      for (const letter of ["a", "b", "c", "d", "e", "f", "g", "h", "i"]) {
        expect(regs.some((r) => r.includes(`(${letter})`))).toBe(true);
      }
    });
  });
});
