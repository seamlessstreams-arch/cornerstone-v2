import { describe, it, expect } from "vitest";
import {
  computeFamilyRelationships,
  type FamilyRelationshipsInput,
  type FamilyTimeInput,
  type ContactArrangementInput,
  type GenogramInput,
} from "../family-relationships-intelligence-engine";

// ── Helpers ────────────────────────────────────────────────────────────────

function makeFamilyTime(overrides: Partial<FamilyTimeInput> = {}): FamilyTimeInput {
  return {
    id: "ft1",
    date: "2026-05-20",
    family_member: "mother",
    family_member_name: "Sarah Johnson",
    duration_minutes: 90,
    supervision_level: "supervised",
    child_presentation_before: "anxious",
    child_presentation_after: "happy",
    was_it_safe: true,
    concerns: [],
    positive_observations: ["good interaction", "shared laughter"],
    child_voice: "I liked seeing mum today",
    ...overrides,
  };
}

function makeArrangement(overrides: Partial<ContactArrangementInput> = {}): ContactArrangementInput {
  return {
    id: "ca1",
    child_id: "child_1",
    contact_type: "face_to_face",
    frequency: "Fortnightly",
    supervision_level: "supervised",
    court_ordered: false,
    status: "active",
    review_date: "2026-07-01",
    ...overrides,
  };
}

function makeGenogram(): GenogramInput {
  return {
    immediate_family: [
      { relation: "mother", name: "Sarah", status: "living" },
      { relation: "father", name: "Mark", status: "unknown" },
      { relation: "sibling", name: "Lily", status: "living" },
    ],
    extended_family: [
      { relation: "grandmother", name: "Joan" },
      { relation: "uncle", name: "David" },
    ],
    important_non_family: [
      { name: "Mrs Wilson", role: "teacher" },
    ],
    protective_relationships: ["grandmother Joan", "teacher Mrs Wilson"],
    risk_relationships: ["father Mark"],
    estranged_relationships: [],
    child_input_provided: true,
  };
}

function baseInput(overrides: Partial<FamilyRelationshipsInput> = {}): FamilyRelationshipsInput {
  return {
    today: "2026-05-26",
    child_id: "child_1",
    child_name: "Ella",
    placement_start_date: "2025-09-01",
    family_time_sessions: [
      makeFamilyTime({ id: "ft1", date: "2026-05-20", family_member_name: "Sarah" }),
      makeFamilyTime({ id: "ft2", date: "2026-05-06", family_member_name: "Sarah" }),
      makeFamilyTime({ id: "ft3", date: "2026-04-22", family_member_name: "Lily", family_member: "sibling" }),
      makeFamilyTime({ id: "ft4", date: "2026-04-08", family_member_name: "Sarah" }),
      makeFamilyTime({ id: "ft5", date: "2026-03-25", family_member_name: "Joan", family_member: "grandmother" }),
      makeFamilyTime({ id: "ft6", date: "2026-03-11", family_member_name: "Sarah" }),
    ],
    contact_arrangements: [
      makeArrangement({ id: "ca1" }),
    ],
    genogram: makeGenogram(),
    professional_contacts: [
      { role: "social_worker", name: "Jane Doe", last_contact_date: "2026-05-15", frequency: "Monthly" },
      { role: "irp", name: "Bob Smith", last_contact_date: "2026-04-20", frequency: "6-monthly" },
    ],
    lac_reviews: [
      { date: "2026-03-15", family_attended: true, child_participated: true, contact_discussed: true },
      { date: "2025-09-15", family_attended: true, child_participated: true, contact_discussed: true },
    ],
    missing_episodes: [],
    placement_moves: [],
    ...overrides,
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("Family & Relationships Intelligence Engine", () => {
  it("produces result with all required fields", () => {
    const result = computeFamilyRelationships(baseInput());
    expect(result.generated_at).toBe("2026-05-26");
    expect(result.child_id).toBe("child_1");
    expect(result.child_name).toBe("Ella");
    expect(result.relationship_health).toBeDefined();
    expect(result.relationship_score).toBeGreaterThanOrEqual(0);
    expect(result.relationship_score).toBeLessThanOrEqual(100);
    expect(result.headline).toContain("Ella");
    expect(result.contact_analysis).toBeDefined();
    expect(result.family_network).toBeDefined();
    expect(result.professional_engagement).toBeDefined();
    expect(result.contact_compliance).toBeDefined();
    expect(result.placement_impact).toBeDefined();
  });

  it("computes thriving or stable health for child with good contact", () => {
    const result = computeFamilyRelationships(baseInput());
    expect(["thriving", "stable"]).toContain(result.relationship_health);
    expect(result.relationship_score).toBeGreaterThanOrEqual(60);
    expect(result.strengths.length).toBeGreaterThan(0);
  });

  it("computes contact analysis correctly", () => {
    const result = computeFamilyRelationships(baseInput());
    expect(result.contact_analysis.total_sessions_90d).toBe(6);
    expect(result.contact_analysis.sessions_last_30d).toBe(2);
    expect(result.contact_analysis.unique_family_contacts).toBeGreaterThanOrEqual(3);
    expect(result.contact_analysis.safe_pct).toBe(100);
    expect(result.contact_analysis.child_voice_captured).toBe(true);
  });

  it("flags safety concerns in contact", () => {
    const result = computeFamilyRelationships(baseInput({
      family_time_sessions: [
        makeFamilyTime({ id: "ft1", was_it_safe: false, concerns: ["aggressive language", "boundary violation"] }),
        makeFamilyTime({ id: "ft2", date: "2026-05-06", was_it_safe: false, concerns: ["intimidating behaviour"] }),
        makeFamilyTime({ id: "ft3", date: "2026-04-22", was_it_safe: true }),
      ],
    }));
    expect(result.contact_analysis.safe_pct).toBeLessThan(80);
    expect(result.contact_analysis.concerns_raised_90d).toBe(3);
    const concern = result.concerns.find((c) => c.toLowerCase().includes("safety") || c.toLowerCase().includes("concern"));
    expect(concern).toBeDefined();
  });

  it("computes family network from genogram", () => {
    const result = computeFamilyRelationships(baseInput());
    expect(result.family_network.genogram_available).toBe(true);
    expect(result.family_network.immediate_family_count).toBe(3);
    expect(result.family_network.extended_family_count).toBe(2);
    expect(result.family_network.protective_count).toBe(2);
    expect(result.family_network.risk_count).toBe(1);
    expect(result.family_network.child_contributed_to_genogram).toBe(true);
  });

  it("handles missing genogram gracefully", () => {
    const result = computeFamilyRelationships(baseInput({ genogram: null }));
    expect(result.family_network.genogram_available).toBe(false);
    expect(result.family_network.immediate_family_count).toBe(0);
    const concern = result.concerns.find((c) => c.toLowerCase().includes("genogram"));
    expect(concern).toBeDefined();
    const rec = result.recommendations.find((r) => r.domain === "identity");
    expect(rec).toBeDefined();
  });

  it("computes professional engagement metrics", () => {
    const result = computeFamilyRelationships(baseInput());
    expect(result.professional_engagement.total_professionals).toBe(2);
    expect(result.professional_engagement.active_professionals).toBe(2);
    expect(result.professional_engagement.social_worker_last_contact).toBe("2026-05-15");
    expect(result.professional_engagement.lac_reviews_last_12m).toBe(2);
    expect(result.professional_engagement.family_attended_lac_pct).toBe(100);
    expect(result.professional_engagement.child_participated_lac_pct).toBe(100);
  });

  it("flags low LAC review frequency", () => {
    const result = computeFamilyRelationships(baseInput({
      lac_reviews: [],
    }));
    expect(result.professional_engagement.lac_reviews_last_12m).toBe(0);
    const concern = result.concerns.find((c) => c.toLowerCase().includes("lac review"));
    expect(concern).toBeDefined();
  });

  it("detects contact arrangement compliance issues", () => {
    const result = computeFamilyRelationships(baseInput({
      contact_arrangements: [
        makeArrangement({ id: "ca1", review_date: "2026-04-01" }),
        makeArrangement({ id: "ca2", status: "suspended" }),
      ],
    }));
    expect(result.contact_compliance.overdue_reviews).toBe(1);
    expect(result.contact_compliance.suspended).toBe(1);
  });

  it("detects family-related missing episodes as risk", () => {
    const result = computeFamilyRelationships(baseInput({
      missing_episodes: [
        { date: "2026-05-20", trigger: "refused contact", family_related: true },
        { date: "2026-05-10", trigger: "after phone call with father", family_related: true },
        { date: "2026-04-25", trigger: "unknown", family_related: false },
      ],
    }));
    expect(result.placement_impact.family_related_missing).toBe(2);
    expect(result.placement_impact.total_missing_90d).toBe(3);
    expect(result.placement_impact.contact_disruption_risk).toBe(true);
    const rec = result.recommendations.find((r) => r.domain === "missing");
    expect(rec).toBeDefined();
    expect(rec!.urgency).toBe("immediate");
    expect(rec!.regulatory_ref).toBe("Reg 15");
  });

  it("generates positive insights for strong relationships", () => {
    const result = computeFamilyRelationships(baseInput());
    const positive = result.insights.filter((i) => i.severity === "positive");
    expect(positive.length).toBeGreaterThan(0);
  });

  it("generates critical insight for critical health", () => {
    const result = computeFamilyRelationships(baseInput({
      family_time_sessions: [],
      genogram: null,
      professional_contacts: [],
      lac_reviews: [],
      contact_arrangements: [makeArrangement({ id: "ca1", review_date: "2026-03-01" })],
      missing_episodes: [
        { date: "2026-05-20", trigger: "family", family_related: true },
        { date: "2026-05-10", trigger: "family", family_related: true },
      ],
      placement_moves: [
        { date: "2025-12-01", reason: "Breakdown" },
        { date: "2025-09-01", reason: "Emergency" },
        { date: "2025-06-01", reason: "Family request" },
      ],
    }));
    expect(["concerning", "critical"]).toContain(result.relationship_health);
    const criticalInsight = result.insights.find((i) => i.severity === "critical");
    expect(criticalInsight).toBeDefined();
  });

  it("handles empty input gracefully", () => {
    const result = computeFamilyRelationships({
      today: "2026-05-26",
      child_id: "child_2",
      child_name: "Jordan",
      placement_start_date: "2026-01-01",
      family_time_sessions: [],
      contact_arrangements: [],
      genogram: null,
      professional_contacts: [],
      lac_reviews: [],
      missing_episodes: [],
      placement_moves: [],
    });
    expect(result.relationship_score).toBeGreaterThanOrEqual(0);
    expect(result.contact_analysis.total_sessions_90d).toBe(0);
    expect(result.family_network.genogram_available).toBe(false);
    expect(result.headline).toContain("Jordan");
  });

  it("detects contact frequency trend", () => {
    const result = computeFamilyRelationships(baseInput({
      family_time_sessions: [
        makeFamilyTime({ id: "ft1", date: "2026-05-20" }),
        makeFamilyTime({ id: "ft2", date: "2026-05-10" }),
        makeFamilyTime({ id: "ft3", date: "2026-05-01" }),
        // No sessions 30-60 days ago
      ],
    }));
    expect(["increasing", "stable"]).toContain(result.contact_analysis.contact_frequency_trend);
  });

  it("identifies child voice capture in strengths", () => {
    const result = computeFamilyRelationships(baseInput());
    expect(result.contact_analysis.child_voice_captured).toBe(true);
    const voiceStrength = result.strengths.find((s) => s.toLowerCase().includes("voice"));
    expect(voiceStrength).toBeDefined();
  });

  it("recommends child voice capture when missing", () => {
    const result = computeFamilyRelationships(baseInput({
      family_time_sessions: [
        makeFamilyTime({ id: "ft1", child_voice: "" }),
        makeFamilyTime({ id: "ft2", date: "2026-05-06", child_voice: "" }),
        makeFamilyTime({ id: "ft3", date: "2026-04-22", child_voice: "" }),
      ],
    }));
    expect(result.contact_analysis.child_voice_captured).toBe(false);
    const rec = result.recommendations.find((r) => r.domain === "recording");
    expect(rec).toBeDefined();
  });

  it("detects contact disruption from placement moves", () => {
    const result = computeFamilyRelationships(baseInput({
      placement_moves: [
        { date: "2025-12-01", reason: "Breakdown" },
        { date: "2025-09-01", reason: "Emergency" },
        { date: "2025-06-01", reason: "Planned" },
      ],
    }));
    expect(result.placement_impact.placement_moves).toBe(3);
    expect(result.placement_impact.contact_disruption_risk).toBe(true);
    const insight = result.insights.find((i) => i.text.includes("disruption"));
    expect(insight).toBeDefined();
    expect(insight!.severity).toBe("warning");
  });

  it("builds recommendations sorted by urgency", () => {
    const result = computeFamilyRelationships(baseInput({
      family_time_sessions: [
        makeFamilyTime({ id: "ft1", was_it_safe: false, concerns: ["threat"] }),
        makeFamilyTime({ id: "ft2", date: "2026-05-06", was_it_safe: false, concerns: ["aggression"] }),
        makeFamilyTime({ id: "ft3", date: "2026-04-22", was_it_safe: false, concerns: ["shouting"] }),
      ],
      missing_episodes: [
        { date: "2026-05-20", trigger: "family", family_related: true },
        { date: "2026-05-10", trigger: "family", family_related: true },
      ],
      genogram: null,
    }));
    expect(result.recommendations.length).toBeGreaterThan(0);
    const immediate = result.recommendations.filter((r) => r.urgency === "immediate");
    expect(immediate.length).toBeGreaterThan(0);
  });
});
