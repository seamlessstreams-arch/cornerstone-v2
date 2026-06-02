import { describe, it, expect } from "vitest";
import {
  computeBelongingPersonalProperty,
  type BelongingPropertyInput,
  type BelongingsInput,
  type ClothingTripInput,
  type HairAppointmentInput,
  type GiftRecordInput,
} from "../home-belonging-personal-property-intelligence-engine";

/* ── helpers ────────────────────────────────────────────────────────────────── */

function makeBelonging(childId: string, o: Partial<BelongingsInput> = {}): BelongingsInput {
  return { child_id: childId, inventory_up_to_date: true, items_lost_or_damaged: 0, items_replaced: 0, ...o };
}
function makeClothing(id: string, childId: string, o: Partial<ClothingTripInput> = {}): ClothingTripInput {
  return { id, child_id: childId, date: "2026-05-01", child_chose: true, budget_adequate: true, ...o };
}
function makeHair(id: string, childId: string, o: Partial<HairAppointmentInput> = {}): HairAppointmentInput {
  return { id, child_id: childId, date: "2026-05-01", child_preference_met: true, cultural_needs_met: true, ...o };
}
function makeGift(id: string, childId: string, o: Partial<GiftRecordInput> = {}): GiftRecordInput {
  return { id, child_id: childId, date: "2026-05-01", occasion: "birthday", age_appropriate: true, child_involved_in_choice: true, ...o };
}

function baseInput(overrides: Partial<BelongingPropertyInput> = {}): BelongingPropertyInput {
  return {
    today: "2026-05-15", total_children: 4,
    belongings: [makeBelonging("c1"), makeBelonging("c2"), makeBelonging("c3"), makeBelonging("c4")],
    clothing_trips: [makeClothing("ct1", "c1"), makeClothing("ct2", "c2"), makeClothing("ct3", "c3"), makeClothing("ct4", "c4")],
    hair_appointments: [makeHair("h1", "c1"), makeHair("h2", "c2"), makeHair("h3", "c3"), makeHair("h4", "c4")],
    gifts: [makeGift("g1", "c1"), makeGift("g2", "c2"), makeGift("g3", "c3"), makeGift("g4", "c4")],
    ...overrides,
  };
}

/* ── tests ──────────────────────────────────────────────────────────────────── */

describe("Home Belonging & Personal Property Intelligence Engine", () => {
  describe("insufficient data", () => {
    it("returns insufficient_data when no children", () => {
      const r = computeBelongingPersonalProperty({ today: "2026-05-15", total_children: 0, belongings: [], clothing_trips: [], hair_appointments: [], gifts: [] });
      expect(r.belonging_rating).toBe("insufficient_data");
    });
  });

  describe("outstanding threshold (≥80)", () => {
    it("rates outstanding with comprehensive property care", () => {
      const r = computeBelongingPersonalProperty(baseInput());
      expect(r.belonging_score).toBeGreaterThanOrEqual(80);
      expect(r.belonging_rating).toBe("outstanding");
    });
  });

  describe("good threshold (65–79)", () => {
    it("rates good with some gaps", () => {
      const r = computeBelongingPersonalProperty(baseInput({
        belongings: [
          makeBelonging("c1"), makeBelonging("c2"),
          makeBelonging("c3", { inventory_up_to_date: false }),
          makeBelonging("c4", { items_lost_or_damaged: 2, items_replaced: 2 }),
        ],
        clothing_trips: [
          makeClothing("ct1", "c1"), makeClothing("ct2", "c2"),
          makeClothing("ct3", "c3", { child_chose: false }),
          makeClothing("ct4", "c4"),
        ],
        hair_appointments: [
          makeHair("h1", "c1"), makeHair("h2", "c2"),
          makeHair("h3", "c3", { cultural_needs_met: false }),
          makeHair("h4", "c4"),
        ],
        gifts: [
          makeGift("g1", "c1"), makeGift("g2", "c2"),
          makeGift("g3", "c3", { child_involved_in_choice: false }),
        ],
      }));
      expect(r.belonging_score).toBeGreaterThanOrEqual(65);
      expect(r.belonging_score).toBeLessThan(80);
      expect(r.belonging_rating).toBe("good");
    });
  });

  describe("inadequate threshold (<45)", () => {
    it("rates inadequate with severe property neglect", () => {
      const r = computeBelongingPersonalProperty(baseInput({
        belongings: [
          makeBelonging("c1", { inventory_up_to_date: false, items_lost_or_damaged: 5, items_replaced: 0 }),
          makeBelonging("c2", { inventory_up_to_date: false, items_lost_or_damaged: 4, items_replaced: 1 }),
        ],
        clothing_trips: [],
        hair_appointments: [
          makeHair("h1", "c1", { cultural_needs_met: false, child_preference_met: false }),
        ],
        gifts: [],
      }));
      expect(r.belonging_score).toBeLessThan(45);
      expect(r.belonging_rating).toBe("inadequate");
    });
  });

  describe("metrics", () => {
    it("calculates inventory rate correctly", () => {
      const r = computeBelongingPersonalProperty(baseInput());
      expect(r.children_with_inventory).toBe(4);
    });

    it("calculates clothing choice rate", () => {
      const r = computeBelongingPersonalProperty(baseInput());
      expect(r.clothing_choice_rate).toBe(100);
    });

    it("calculates hair cultural rate", () => {
      const r = computeBelongingPersonalProperty(baseInput());
      expect(r.hair_cultural_rate).toBe(100);
    });
  });

  describe("strengths", () => {
    it("generates inventory strength", () => {
      const r = computeBelongingPersonalProperty(baseInput());
      expect(r.strengths.some(s => s.includes("inventories") || s.includes("inventory"))).toBe(true);
    });

    it("generates clothing choice strength", () => {
      const r = computeBelongingPersonalProperty(baseInput());
      expect(r.strengths.some(s => s.includes("clothing") || s.includes("choice"))).toBe(true);
    });

    it("generates zero loss strength", () => {
      const r = computeBelongingPersonalProperty(baseInput());
      expect(r.strengths.some(s => s.includes("Zero belongings lost"))).toBe(true);
    });
  });

  describe("concerns", () => {
    it("raises concern for low inventory rate", () => {
      const r = computeBelongingPersonalProperty(baseInput({
        belongings: [makeBelonging("c1", { inventory_up_to_date: false })],
      }));
      expect(r.concerns.some(c => c.includes("inventories") || c.includes("inventory"))).toBe(true);
    });

    it("raises concern for high property loss", () => {
      const r = computeBelongingPersonalProperty(baseInput({
        belongings: [
          makeBelonging("c1", { items_lost_or_damaged: 5, items_replaced: 1 }),
          makeBelonging("c2", { items_lost_or_damaged: 4, items_replaced: 0 }),
          makeBelonging("c3", { items_lost_or_damaged: 6, items_replaced: 2 }),
          makeBelonging("c4", { items_lost_or_damaged: 3, items_replaced: 1 }),
        ],
      }));
      expect(r.concerns.some(c => c.includes("lost") || c.includes("damaged"))).toBe(true);
    });
  });

  describe("insights", () => {
    it("generates outstanding positive insight", () => {
      const r = computeBelongingPersonalProperty(baseInput());
      expect(r.insights.some(i => i.severity === "positive")).toBe(true);
    });

    it("generates child agency insight when clothing and hair choice high", () => {
      const r = computeBelongingPersonalProperty(baseInput());
      expect(r.insights.some(i => i.text.includes("agency") || i.text.includes("individuality"))).toBe(true);
    });
  });

  describe("headline", () => {
    it("outstanding headline", () => {
      const r = computeBelongingPersonalProperty(baseInput());
      expect(r.headline).toContain("Outstanding");
    });
  });

  describe("edge cases", () => {
    it("handles empty collections with children", () => {
      const r = computeBelongingPersonalProperty(baseInput({
        belongings: [], clothing_trips: [], hair_appointments: [], gifts: [],
      }));
      expect(r.belonging_rating).not.toBe("insufficient_data");
    });

    it("scores are 0-100", () => {
      const r = computeBelongingPersonalProperty(baseInput());
      expect(r.belonging_score).toBeGreaterThanOrEqual(0);
      expect(r.belonging_score).toBeLessThanOrEqual(100);
    });
  });
});
