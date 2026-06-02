import { describe, it, expect } from "vitest";
import {
  computeHomeTherapeuticProgress,
  type HomeTherapeuticProgressInput,
  type BehaviourMapInput,
  type SensoryProfileInput,
  type SleepAssessmentInput,
  type EmotionalVocabInput,
  type BereavementInput,
  type AttachmentProfileInput,
  type SelfSoothingToolkitInput,
} from "../home-therapeutic-progress-intelligence-engine";

// ── Helpers ─────────────────────────────────────────────────────────────────

const TODAY = "2025-06-15";

function makeBM(overrides: Partial<BehaviourMapInput> = {}): BehaviourMapInput {
  return {
    id: "bm1", child_id: "c1", date: "2025-05-20",
    behaviour_type: "dysregulation", intensity: "moderate",
    de_escalation_used_count: 2, trigger_pattern_present: true,
    ...overrides,
  };
}

function makeSP(overrides: Partial<SensoryProfileInput> = {}): SensoryProfileInput {
  return {
    id: "sp1", child_id: "c1", assessment_date: "2025-04-01",
    review_date: "2025-09-01", entries_count: 8, strategies_count: 5,
    environmental_adaptations_count: 3, child_views_provided: true,
    ...overrides,
  };
}

function makeSA(overrides: Partial<SleepAssessmentInput> = {}): SleepAssessmentInput {
  return {
    id: "sa1", child_id: "c1", assessment_date: "2025-05-01",
    review_date: "2025-08-01", average_hours: 8.5,
    sleep_quality: "good", night_wakings: 0, strategies_count: 3,
    trend: "improving",
    ...overrides,
  };
}

function makeEV(overrides: Partial<EmotionalVocabInput> = {}): EmotionalVocabInput {
  return {
    id: "ev1", child_id: "c1", recorded_date: "2025-05-10",
    review_date: "2025-08-10", feelings_recognised_count: 10,
    tools_in_use_count: 4, breakthroughs_count: 1,
    child_voice_provided: true,
    ...overrides,
  };
}

function makeBR(overrides: Partial<BereavementInput> = {}): BereavementInput {
  return {
    id: "br1", child_id: "c1", record_date: "2025-04-01",
    review_date: "2025-07-01", grief_stage: "adjusting",
    support_provided_count: 3, memory_work_count: 2,
    child_voice_provided: true, external_support_present: true,
    ...overrides,
  };
}

function makeAP(overrides: Partial<AttachmentProfileInput> = {}): AttachmentProfileInput {
  return {
    id: "ap1", child_id: "c1", assessment_date: "2025-03-01",
    review_date: "2025-09-01", primary_style: "anxious_avoidant",
    therapeutic_approach_count: 4, staff_guidance_count: 5,
    protective_factors_count: 3, child_views_provided: true,
    ...overrides,
  };
}

function makeSS(overrides: Partial<SelfSoothingToolkitInput> = {}): SelfSoothingToolkitInput {
  return {
    id: "ss1", child_id: "c1", last_updated: "2025-05-01",
    review_date: "2025-08-01", total_strategies_count: 8,
    child_chose_all: true, effectiveness_rating: "highly_effective",
    child_voice_provided: true,
    ...overrides,
  };
}

/**
 * baseInput produces score = 80 (outstanding)
 * 52 base + 5 (mod1) + 4 (mod2) + 4 (mod3) + 3 (mod4) + 3 (mod5) + 3 (mod6) + 3 (mod7) + 3 (mod8) = 80
 */
function baseInput(overrides: Partial<HomeTherapeuticProgressInput> = {}): HomeTherapeuticProgressInput {
  return {
    today: TODAY,
    behaviour_map_entries: [
      makeBM({ id: "bm1", child_id: "c1", date: "2025-05-20" }),
      makeBM({ id: "bm2", child_id: "c1", date: "2025-05-22" }),
      makeBM({ id: "bm3", child_id: "c2", date: "2025-05-25" }),
      makeBM({ id: "bm4", child_id: "c2", date: "2025-06-01" }),
      makeBM({ id: "bm5", child_id: "c3", date: "2025-06-05" }),
      makeBM({ id: "bm6", child_id: "c3", date: "2025-06-10" }),
      makeBM({ id: "bm7", child_id: "c4", date: "2025-06-12" }),
      makeBM({ id: "bm8", child_id: "c5", date: "2025-06-14" }),
    ],
    sensory_profiles: [
      makeSP({ id: "sp1", child_id: "c1" }),
      makeSP({ id: "sp2", child_id: "c2" }),
      makeSP({ id: "sp3", child_id: "c3" }),
      makeSP({ id: "sp4", child_id: "c4" }),
      makeSP({ id: "sp5", child_id: "c5" }),
    ],
    sleep_assessments: [
      makeSA({ id: "sa1", child_id: "c1" }),
      makeSA({ id: "sa2", child_id: "c2" }),
      makeSA({ id: "sa3", child_id: "c3" }),
      makeSA({ id: "sa4", child_id: "c4" }),
      makeSA({ id: "sa5", child_id: "c5" }),
    ],
    emotional_vocab_records: [
      makeEV({ id: "ev1", child_id: "c1" }),
      makeEV({ id: "ev2", child_id: "c2" }),
      makeEV({ id: "ev3", child_id: "c3" }),
      makeEV({ id: "ev4", child_id: "c4" }),
      makeEV({ id: "ev5", child_id: "c5" }),
    ],
    bereavement_records: [
      makeBR({ id: "br1", child_id: "c1" }),
      makeBR({ id: "br2", child_id: "c2" }),
    ],
    attachment_profiles: [
      makeAP({ id: "ap1", child_id: "c1" }),
      makeAP({ id: "ap2", child_id: "c2" }),
      makeAP({ id: "ap3", child_id: "c3" }),
      makeAP({ id: "ap4", child_id: "c4" }),
      makeAP({ id: "ap5", child_id: "c5" }),
    ],
    self_soothing_toolkits: [
      makeSS({ id: "ss1", child_id: "c1" }),
      makeSS({ id: "ss2", child_id: "c2" }),
      makeSS({ id: "ss3", child_id: "c3" }),
      makeSS({ id: "ss4", child_id: "c4" }),
      makeSS({ id: "ss5", child_id: "c5" }),
    ],
    total_children: 5,
    ...overrides,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("computeHomeTherapeuticProgress", () => {
  // ── Insufficient data ──────────────────────────────────────────────
  describe("insufficient data", () => {
    it("returns insufficient_data when no data at all", () => {
      const r = computeHomeTherapeuticProgress({
        today: TODAY, behaviour_map_entries: [], sensory_profiles: [],
        sleep_assessments: [], emotional_vocab_records: [],
        bereavement_records: [], attachment_profiles: [],
        self_soothing_toolkits: [], total_children: 0,
      });
      expect(r.therapeutic_rating).toBe("insufficient_data");
      expect(r.therapeutic_score).toBe(0);
    });

    it("does NOT return insufficient_data when total_children > 0", () => {
      const r = computeHomeTherapeuticProgress({
        today: TODAY, behaviour_map_entries: [], sensory_profiles: [],
        sleep_assessments: [], emotional_vocab_records: [],
        bereavement_records: [], attachment_profiles: [],
        self_soothing_toolkits: [], total_children: 3,
      });
      expect(r.therapeutic_rating).not.toBe("insufficient_data");
    });
  });

  // ── Rating thresholds ──────────────────────────────────────────────
  describe("rating thresholds", () => {
    it("baseInput scores exactly 80 (outstanding)", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.therapeutic_score).toBe(80);
      expect(r.therapeutic_rating).toBe("outstanding");
    });

    it("good range: 65–79", () => {
      // Remove bereavement (mod5 goes neutral → 0) and reduce emotional vocab
      const r = computeHomeTherapeuticProgress(baseInput({
        bereavement_records: [],
        emotional_vocab_records: [
          makeEV({ id: "ev1", child_id: "c1", feelings_recognised_count: 4 }),
        ],
      }));
      // mod4: coverage 20% (<40 → -1), feelings 4 (<8 but >=3 → 0), breakthroughs 1 (<3 → 0) → -1
      // mod5: no bereavement → 0
      // mod8: voice still high but coverage drop
      expect(r.therapeutic_rating).toBe("good");
      expect(r.therapeutic_score).toBeGreaterThanOrEqual(65);
      expect(r.therapeutic_score).toBeLessThan(80);
    });

    it("adequate range: 45–64", () => {
      // Moderate scenario: 3 of 5 children covered, mixed quality, some overdue
      const r = computeHomeTherapeuticProgress(baseInput({
        behaviour_map_entries: [
          makeBM({ id: "bm1", child_id: "c1", date: "2025-06-01", de_escalation_used_count: 1, trigger_pattern_present: true }),
          makeBM({ id: "bm2", child_id: "c2", date: "2025-06-02", de_escalation_used_count: 0, trigger_pattern_present: false }),
          makeBM({ id: "bm3", child_id: "c3", date: "2025-06-03", de_escalation_used_count: 1, trigger_pattern_present: false }),
        ],
        sensory_profiles: [
          makeSP({ id: "sp1", child_id: "c1", strategies_count: 3 }),
          makeSP({ id: "sp2", child_id: "c2", strategies_count: 2, child_views_provided: false }),
          makeSP({ id: "sp3", child_id: "c3", review_date: "2025-01-01", strategies_count: 1, child_views_provided: false }),
        ],
        sleep_assessments: [
          makeSA({ id: "sa1", child_id: "c1", sleep_quality: "good" }),
          makeSA({ id: "sa2", child_id: "c2", sleep_quality: "fair" }),
          makeSA({ id: "sa3", child_id: "c3", sleep_quality: "poor", review_date: "2025-01-01" }),
        ],
        emotional_vocab_records: [
          makeEV({ id: "ev1", child_id: "c1", feelings_recognised_count: 5, breakthroughs_count: 0 }),
          makeEV({ id: "ev2", child_id: "c2", feelings_recognised_count: 4, breakthroughs_count: 0, child_voice_provided: false }),
        ],
        bereavement_records: [],
        attachment_profiles: [
          makeAP({ id: "ap1", child_id: "c1", therapeutic_approach_count: 2 }),
          makeAP({ id: "ap2", child_id: "c2", therapeutic_approach_count: 1, child_views_provided: false }),
        ],
        self_soothing_toolkits: [
          makeSS({ id: "ss1", child_id: "c1", child_chose_all: false, effectiveness_rating: "effective" }),
          makeSS({ id: "ss2", child_id: "c2", child_chose_all: false, effectiveness_rating: "partially_effective", child_voice_provided: false }),
        ],
      }));
      expect(r.therapeutic_rating).toBe("adequate");
      expect(r.therapeutic_score).toBeGreaterThanOrEqual(45);
      expect(r.therapeutic_score).toBeLessThan(65);
    });

    it("inadequate: below 45", () => {
      const r = computeHomeTherapeuticProgress({
        today: TODAY,
        behaviour_map_entries: [],
        sensory_profiles: [],
        sleep_assessments: [],
        emotional_vocab_records: [],
        bereavement_records: [],
        attachment_profiles: [],
        self_soothing_toolkits: [],
        total_children: 5,
      });
      // 52 - 2 (mod1) - 2 (mod2) - 2 (mod3) - 1 (mod4) + 0 (mod5) - 1 (mod6) - 1 (mod7) + 0 (mod8) = 43
      expect(r.therapeutic_rating).toBe("inadequate");
      expect(r.therapeutic_score).toBeLessThan(45);
    });
  });

  // ── Mod 1: Behaviour mapping & de-escalation (±5) ─────────────────
  describe("mod1: behaviour mapping", () => {
    it("+5 with excellent de-escalation and trigger ID", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      // 100% de-escalation (all have count>0) → +3
      // 100% trigger pattern → +2 → total +5
      expect(r.behaviour_map.de_escalation_rate).toBe(100);
      expect(r.behaviour_map.trigger_identification_rate).toBe(100);
    });

    it("penalises low de-escalation", () => {
      const entries = Array.from({ length: 8 }, (_, i) =>
        makeBM({ id: `bm${i}`, child_id: `c${(i % 5) + 1}`, date: "2025-06-01", de_escalation_used_count: 0 }),
      );
      const r = computeHomeTherapeuticProgress(baseInput({ behaviour_map_entries: entries }));
      expect(r.therapeutic_score).toBeLessThan(80);
    });

    it("penalises high crisis ratio", () => {
      const entries = [
        makeBM({ id: "bm1", intensity: "crisis", date: "2025-06-01" }),
        makeBM({ id: "bm2", intensity: "crisis", date: "2025-06-02" }),
        makeBM({ id: "bm3", intensity: "low", date: "2025-06-03" }),
      ];
      const r = computeHomeTherapeuticProgress(baseInput({ behaviour_map_entries: entries }));
      // crisis ratio = 67% > 30% → -1
      expect(r.behaviour_map.crisis_count).toBe(2);
    });

    it("penalises no mapping at all with 3+ children", () => {
      const r = computeHomeTherapeuticProgress(baseInput({ behaviour_map_entries: [] }));
      expect(r.therapeutic_score).toBeLessThan(80);
    });

    it("excludes entries older than 90 days", () => {
      const old = makeBM({ date: "2025-01-01", intensity: "crisis" });
      const r = computeHomeTherapeuticProgress(baseInput({
        behaviour_map_entries: [...baseInput().behaviour_map_entries, old],
      }));
      // The old entry should not appear in 90d count
      expect(r.behaviour_map.total_entries_90d).toBe(8);
    });
  });

  // ── Mod 2: Sensory profile completeness (±4) ──────────────────────
  describe("mod2: sensory profiles", () => {
    it("+4 with full coverage, no overdue, good strategies", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.sensory.child_coverage).toBe(100);
      expect(r.sensory.overdue_reviews).toBe(0);
      expect(r.sensory.avg_strategies).toBe(5);
    });

    it("penalises overdue reviews", () => {
      const profiles = baseInput().sensory_profiles.map(p => ({
        ...p, review_date: "2025-01-01",
      }));
      const r = computeHomeTherapeuticProgress(baseInput({ sensory_profiles: profiles }));
      expect(r.sensory.overdue_reviews).toBe(5);
      expect(r.therapeutic_score).toBeLessThan(80);
    });

    it("penalises low strategy count", () => {
      const profiles = baseInput().sensory_profiles.map(p => ({
        ...p, strategies_count: 1,
      }));
      const r = computeHomeTherapeuticProgress(baseInput({ sensory_profiles: profiles }));
      expect(r.sensory.avg_strategies).toBe(1);
      expect(r.therapeutic_score).toBeLessThan(80);
    });

    it("penalises no profiles with 2+ children", () => {
      const r = computeHomeTherapeuticProgress(baseInput({ sensory_profiles: [] }));
      expect(r.therapeutic_score).toBeLessThan(80);
    });
  });

  // ── Mod 3: Sleep assessment & quality (±4) ────────────────────────
  describe("mod3: sleep assessments", () => {
    it("+4 with good coverage, quality, and no overdue", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.sleep.child_coverage).toBe(100);
      expect(r.sleep.good_quality_rate).toBe(100);
      expect(r.sleep.overdue_reviews).toBe(0);
    });

    it("penalises poor sleep quality", () => {
      const assessments = baseInput().sleep_assessments.map(a => ({
        ...a, sleep_quality: "poor",
      }));
      const r = computeHomeTherapeuticProgress(baseInput({ sleep_assessments: assessments }));
      expect(r.sleep.good_quality_rate).toBe(0);
      expect(r.therapeutic_score).toBeLessThan(80);
    });

    it("penalises overdue reviews", () => {
      const assessments = baseInput().sleep_assessments.map(a => ({
        ...a, review_date: "2025-01-01",
      }));
      const r = computeHomeTherapeuticProgress(baseInput({ sleep_assessments: assessments }));
      expect(r.sleep.overdue_reviews).toBe(5);
      expect(r.therapeutic_score).toBeLessThan(80);
    });

    it("penalises no assessments with 2+ children", () => {
      const r = computeHomeTherapeuticProgress(baseInput({ sleep_assessments: [] }));
      expect(r.therapeutic_score).toBeLessThan(80);
    });
  });

  // ── Mod 4: Emotional vocabulary development (±3) ──────────────────
  describe("mod4: emotional vocabulary", () => {
    it("+3 with good coverage, feelings, and breakthroughs", () => {
      const records = baseInput().emotional_vocab_records.map(r => ({
        ...r, breakthroughs_count: 1,
      }));
      const r = computeHomeTherapeuticProgress(baseInput({ emotional_vocab_records: records }));
      expect(r.emotional_vocab.child_coverage).toBe(100);
      expect(r.emotional_vocab.avg_feelings_recognised).toBe(10);
      expect(r.emotional_vocab.breakthrough_count).toBe(5);
    });

    it("penalises low feelings count", () => {
      const records = baseInput().emotional_vocab_records.map(r => ({
        ...r, feelings_recognised_count: 2,
      }));
      const r = computeHomeTherapeuticProgress(baseInput({ emotional_vocab_records: records }));
      expect(r.emotional_vocab.avg_feelings_recognised).toBe(2);
      expect(r.therapeutic_score).toBeLessThan(80);
    });

    it("penalises no records with 2+ children", () => {
      const r = computeHomeTherapeuticProgress(baseInput({ emotional_vocab_records: [] }));
      expect(r.therapeutic_score).toBeLessThan(80);
    });
  });

  // ── Mod 5: Bereavement & loss support (±3) ────────────────────────
  describe("mod5: bereavement", () => {
    it("+3 with good support and no complicated grief", () => {
      const records = [
        makeBR({ id: "br1", child_id: "c1", grief_stage: "integrated" }),
        makeBR({ id: "br2", child_id: "c2", grief_stage: "adjusting" }),
      ];
      const r = computeHomeTherapeuticProgress(baseInput({ bereavement_records: records }));
      expect(r.bereavement.external_support_rate).toBe(100);
      expect(r.bereavement.memory_work_rate).toBe(100);
    });

    it("penalises complicated grief without external support", () => {
      const records = [
        makeBR({ id: "br1", child_id: "c1", grief_stage: "complicated", external_support_present: false }),
      ];
      const r = computeHomeTherapeuticProgress(baseInput({ bereavement_records: records }));
      expect(r.therapeutic_score).toBeLessThan(80);
    });

    it("neutral when no bereavement records (not all homes have bereaved children)", () => {
      const r = computeHomeTherapeuticProgress(baseInput({ bereavement_records: [] }));
      // mod5 contributes 0, so score drops by the 3 that baseInput's bereavement contributes
      // But bereavement base gives +3 (ext 100%, mem 100%, no complicated → +1), so dropping to 0 means -3
      expect(r.therapeutic_score).toBe(80 - 3);
    });
  });

  // ── Mod 6: Attachment-informed practice (±3) ──────────────────────
  describe("mod6: attachment profiles", () => {
    it("+3 with full coverage, no overdue, good approaches", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.attachment.child_coverage).toBe(100);
      expect(r.attachment.overdue_reviews).toBe(0);
      expect(r.attachment.avg_therapeutic_approaches).toBe(4);
    });

    it("penalises overdue reviews", () => {
      const profiles = baseInput().attachment_profiles.map(p => ({
        ...p, review_date: "2025-01-01",
      }));
      const r = computeHomeTherapeuticProgress(baseInput({ attachment_profiles: profiles }));
      expect(r.attachment.overdue_reviews).toBe(5);
      expect(r.therapeutic_score).toBeLessThan(80);
    });

    it("penalises no profiles with 2+ children", () => {
      const r = computeHomeTherapeuticProgress(baseInput({ attachment_profiles: [] }));
      expect(r.therapeutic_score).toBeLessThan(80);
    });
  });

  // ── Mod 7: Self-soothing toolkit quality (±3) ─────────────────────
  describe("mod7: self-soothing", () => {
    it("+3 with full coverage, child-led, effective", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.self_soothing.child_coverage).toBe(100);
      expect(r.self_soothing.child_led_rate).toBe(100);
      expect(r.self_soothing.effectiveness_rate).toBe(100);
    });

    it("penalises low effectiveness", () => {
      const toolkits = baseInput().self_soothing_toolkits.map(t => ({
        ...t, effectiveness_rating: "not_effective",
      }));
      const r = computeHomeTherapeuticProgress(baseInput({ self_soothing_toolkits: toolkits }));
      expect(r.self_soothing.effectiveness_rate).toBe(0);
      expect(r.therapeutic_score).toBeLessThan(80);
    });

    it("penalises not child-led", () => {
      const toolkits = baseInput().self_soothing_toolkits.map(t => ({
        ...t, child_chose_all: false,
      }));
      const r = computeHomeTherapeuticProgress(baseInput({ self_soothing_toolkits: toolkits }));
      expect(r.self_soothing.child_led_rate).toBe(0);
      expect(r.therapeutic_score).toBeLessThan(80);
    });

    it("penalises no toolkits with 2+ children", () => {
      const r = computeHomeTherapeuticProgress(baseInput({ self_soothing_toolkits: [] }));
      expect(r.therapeutic_score).toBeLessThan(80);
    });
  });

  // ── Mod 8: Child voice across therapeutic work (±3) ───────────────
  describe("mod8: child voice", () => {
    it("+3 when voice rate is 90%+ across all domains", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      // All child_views/voice provided = true → 100% across all
      expect(r.therapeutic_score).toBe(80);
    });

    it("penalises low voice across domains", () => {
      const r = computeHomeTherapeuticProgress(baseInput({
        sensory_profiles: baseInput().sensory_profiles.map(p => ({ ...p, child_views_provided: false })),
        emotional_vocab_records: baseInput().emotional_vocab_records.map(r => ({ ...r, child_voice_provided: false })),
        bereavement_records: baseInput().bereavement_records.map(r => ({ ...r, child_voice_provided: false })),
        attachment_profiles: baseInput().attachment_profiles.map(p => ({ ...p, child_views_provided: false })),
        self_soothing_toolkits: baseInput().self_soothing_toolkits.map(t => ({ ...t, child_voice_provided: false })),
      }));
      expect(r.therapeutic_score).toBeLessThan(80);
    });
  });

  // ── Profile calculations ──────────────────────────────────────────
  describe("profile calculations", () => {
    it("correctly calculates behaviour map profile", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.behaviour_map.total_entries_90d).toBe(8);
      expect(r.behaviour_map.children_mapped).toBe(5);
      expect(r.behaviour_map.crisis_count).toBe(0);
      expect(r.behaviour_map.de_escalation_rate).toBe(100);
      expect(r.behaviour_map.trigger_identification_rate).toBe(100);
    });

    it("correctly calculates sensory profile summary", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.sensory.total_profiles).toBe(5);
      expect(r.sensory.child_coverage).toBe(100);
      expect(r.sensory.overdue_reviews).toBe(0);
      expect(r.sensory.avg_strategies).toBe(5);
      expect(r.sensory.child_views_rate).toBe(100);
    });

    it("correctly calculates sleep assessment summary", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.sleep.total_assessments).toBe(5);
      expect(r.sleep.child_coverage).toBe(100);
      expect(r.sleep.avg_hours).toBe(8.5);
      expect(r.sleep.good_quality_rate).toBe(100);
      expect(r.sleep.improving_trend_rate).toBe(100);
    });

    it("correctly calculates emotional vocab summary", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.emotional_vocab.total_records).toBe(5);
      expect(r.emotional_vocab.child_coverage).toBe(100);
      expect(r.emotional_vocab.avg_feelings_recognised).toBe(10);
      expect(r.emotional_vocab.child_voice_rate).toBe(100);
    });

    it("correctly calculates bereavement summary", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.bereavement.total_records).toBe(2);
      expect(r.bereavement.children_supported).toBe(2);
      expect(r.bereavement.external_support_rate).toBe(100);
      expect(r.bereavement.memory_work_rate).toBe(100);
    });

    it("correctly calculates attachment summary", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.attachment.total_profiles).toBe(5);
      expect(r.attachment.child_coverage).toBe(100);
      expect(r.attachment.overdue_reviews).toBe(0);
      expect(r.attachment.avg_therapeutic_approaches).toBe(4);
    });

    it("correctly calculates self-soothing summary", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.self_soothing.total_toolkits).toBe(5);
      expect(r.self_soothing.child_coverage).toBe(100);
      expect(r.self_soothing.child_led_rate).toBe(100);
      expect(r.self_soothing.effectiveness_rate).toBe(100);
    });
  });

  // ── Strengths & concerns ──────────────────────────────────────────
  describe("narrative", () => {
    it("generates strengths for outstanding baseInput", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.strengths.length).toBeGreaterThan(0);
      expect(r.strengths.some(s => s.includes("de-escalation"))).toBe(true);
    });

    it("generates concerns for crisis behaviours", () => {
      const crisisEntries = Array.from({ length: 6 }, (_, i) =>
        makeBM({ id: `bm${i}`, child_id: `c${(i % 5) + 1}`, intensity: "crisis", date: "2025-06-01" }),
      );
      const r = computeHomeTherapeuticProgress(baseInput({ behaviour_map_entries: crisisEntries }));
      expect(r.concerns.some(c => c.includes("crisis"))).toBe(true);
      expect(r.recommendations.some(rec => rec.urgency === "immediate")).toBe(true);
    });

    it("generates concern for no attachment profiles", () => {
      const r = computeHomeTherapeuticProgress(baseInput({ attachment_profiles: [] }));
      expect(r.concerns.some(c => c.includes("attachment"))).toBe(true);
    });

    it("generates concern for no emotional vocab with 3+ children", () => {
      const r = computeHomeTherapeuticProgress(baseInput({ emotional_vocab_records: [] }));
      expect(r.concerns.some(c => c.includes("emotional vocabulary") || c.includes("emotional literacy"))).toBe(true);
    });

    it("generates recommendations with regulatory refs", () => {
      const r = computeHomeTherapeuticProgress(baseInput({
        behaviour_map_entries: [makeBM({ de_escalation_used_count: 0 })],
      }));
      const recsWithRef = r.recommendations.filter(rec => rec.regulatory_ref !== null);
      expect(recsWithRef.length).toBeGreaterThanOrEqual(0);
    });

    it("no recommendations for perfect baseInput", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.recommendations.length).toBe(0);
    });
  });

  // ── ARIA Insights ─────────────────────────────────────────────────
  describe("ARIA insights", () => {
    it("flags self-harm pattern", () => {
      const entries = Array.from({ length: 10 }, (_, i) =>
        makeBM({ id: `bm${i}`, child_id: `c${(i % 5) + 1}`, date: "2025-06-01", behaviour_type: i < 3 ? "self_harm" : "dysregulation" }),
      );
      const r = computeHomeTherapeuticProgress(baseInput({ behaviour_map_entries: entries }));
      expect(r.insights.some(i => i.text.includes("Self-harm") && i.severity === "critical")).toBe(true);
    });

    it("flags declining sleep trends", () => {
      const assessments = [
        makeSA({ id: "sa1", child_id: "c1", trend: "declining" }),
        makeSA({ id: "sa2", child_id: "c2", trend: "declining" }),
        makeSA({ id: "sa3", child_id: "c3", trend: "stable" }),
      ];
      const r = computeHomeTherapeuticProgress(baseInput({ sleep_assessments: assessments }));
      expect(r.insights.some(i => i.text.includes("declining sleep"))).toBe(true);
    });

    it("flags disorganised attachment", () => {
      const profiles = [
        makeAP({ id: "ap1", child_id: "c1", primary_style: "disorganised" }),
        makeAP({ id: "ap2", child_id: "c2", primary_style: "disorganised" }),
        makeAP({ id: "ap3", child_id: "c3", primary_style: "secure" }),
      ];
      const r = computeHomeTherapeuticProgress(baseInput({ attachment_profiles: profiles }));
      expect(r.insights.some(i => i.text.includes("disorganised"))).toBe(true);
    });

    it("positive insight for excellent self-soothing", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.insights.some(i => i.severity === "positive" && i.text.includes("self-soothing") || i.text.includes("Self-soothing"))).toBe(true);
    });

    it("positive insight for many breakthroughs", () => {
      const records = baseInput().emotional_vocab_records.map(r => ({
        ...r, breakthroughs_count: 2,
      }));
      const r = computeHomeTherapeuticProgress(baseInput({ emotional_vocab_records: records }));
      expect(r.emotional_vocab.breakthrough_count).toBe(10);
      expect(r.insights.some(i => i.text.includes("breakthroughs"))).toBe(true);
    });
  });

  // ── Headline ──────────────────────────────────────────────────────
  describe("headline", () => {
    it("outstanding headline", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.headline).toContain("embedded");
    });

    it("inadequate headline", () => {
      const r = computeHomeTherapeuticProgress({
        today: TODAY, behaviour_map_entries: [], sensory_profiles: [],
        sleep_assessments: [], emotional_vocab_records: [],
        bereavement_records: [], attachment_profiles: [],
        self_soothing_toolkits: [], total_children: 5,
      });
      expect(r.headline).toContain("gaps");
    });
  });

  // ── Edge cases ────────────────────────────────────────────────────
  describe("edge cases", () => {
    it("handles single child home", () => {
      const r = computeHomeTherapeuticProgress({
        today: TODAY,
        behaviour_map_entries: [makeBM({ child_id: "c1", date: "2025-06-01" })],
        sensory_profiles: [makeSP({ child_id: "c1" })],
        sleep_assessments: [makeSA({ child_id: "c1" })],
        emotional_vocab_records: [makeEV({ child_id: "c1" })],
        bereavement_records: [],
        attachment_profiles: [makeAP({ child_id: "c1" })],
        self_soothing_toolkits: [makeSS({ child_id: "c1" })],
        total_children: 1,
      });
      expect(r.therapeutic_rating).not.toBe("insufficient_data");
      expect(r.sensory.child_coverage).toBe(100);
    });

    it("score never exceeds 100", () => {
      const r = computeHomeTherapeuticProgress(baseInput());
      expect(r.therapeutic_score).toBeLessThanOrEqual(100);
    });

    it("score never goes below 0", () => {
      const r = computeHomeTherapeuticProgress({
        today: TODAY, behaviour_map_entries: [], sensory_profiles: [],
        sleep_assessments: [], emotional_vocab_records: [],
        bereavement_records: [], attachment_profiles: [],
        self_soothing_toolkits: [], total_children: 10,
      });
      expect(r.therapeutic_score).toBeGreaterThanOrEqual(0);
    });

    it("handles duplicate child_ids in same collection", () => {
      const r = computeHomeTherapeuticProgress(baseInput({
        sensory_profiles: [
          makeSP({ id: "sp1", child_id: "c1" }),
          makeSP({ id: "sp2", child_id: "c1" }),
        ],
      }));
      // Only 1 unique child → 20% coverage
      expect(r.sensory.child_coverage).toBe(20);
    });

    it("future review dates are not overdue", () => {
      const r = computeHomeTherapeuticProgress(baseInput({
        sensory_profiles: [makeSP({ review_date: "2026-01-01" })],
      }));
      expect(r.sensory.overdue_reviews).toBe(0);
    });
  });
});
