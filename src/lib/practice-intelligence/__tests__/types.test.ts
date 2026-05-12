import { describe, it, expect } from "vitest";
import {
  PRACTICE_INTELLIGENCE_FRAMEWORKS,
  SESSION_TYPES,
  SESSION_TYPE_LABELS,
  LEARNING_RESOURCE_TYPES,
  LEARNING_RESOURCE_TYPE_LABELS,
  OVERSIGHT_TYPES,
  OVERSIGHT_TYPE_LABELS,
  REGULATION_FRAMEWORKS,
  REGULATION_LABELS,
  SCCIF_THEMES,
  SCCIF_THEME_LABELS,
  WORKFLOW_TRIGGER_EVENTS,
  EXTENDED_FRAMEWORK_LABELS,
} from "@/types/practice-intelligence";

// ══════════════════════════════════════════════════════════════════════════════
// PRACTICE INTELLIGENCE — TYPE SYSTEM TESTS
// ══════════════════════════════════════════════════════════════════════════════

describe("PRACTICE_INTELLIGENCE_FRAMEWORKS", () => {
  it("contains the 13 original plus 5 extended frameworks", () => {
    expect(PRACTICE_INTELLIGENCE_FRAMEWORKS.length).toBe(18);
  });

  it("includes all original frameworks", () => {
    const originals = ["pace", "ddp", "arc", "trauma_informed", "therapeutic_parenting",
      "restorative", "youth_work", "psychologically_informed", "relationship_based",
      "safeguarding_led", "strengths_based", "signs_of_safety", "attachment_informed"];
    for (const f of originals) {
      expect(PRACTICE_INTELLIGENCE_FRAMEWORKS).toContain(f);
    }
  });

  it("includes all 5 new frameworks", () => {
    const newFrameworks = ["social_pedagogy", "mentalisation", "neurodiversity_informed",
      "anti_oppressive", "developmental_trauma"];
    for (const f of newFrameworks) {
      expect(PRACTICE_INTELLIGENCE_FRAMEWORKS).toContain(f);
    }
  });

  it("has labels for all 5 new frameworks", () => {
    expect(Object.keys(EXTENDED_FRAMEWORK_LABELS)).toHaveLength(5);
    expect(EXTENDED_FRAMEWORK_LABELS).toHaveProperty("social_pedagogy");
    expect(EXTENDED_FRAMEWORK_LABELS).toHaveProperty("mentalisation");
    expect(EXTENDED_FRAMEWORK_LABELS).toHaveProperty("neurodiversity_informed");
    expect(EXTENDED_FRAMEWORK_LABELS).toHaveProperty("anti_oppressive");
    expect(EXTENDED_FRAMEWORK_LABELS).toHaveProperty("developmental_trauma");
  });
});

describe("SESSION_TYPES", () => {
  it("contains exactly 35 session types", () => {
    expect(SESSION_TYPES.length).toBe(35);
  });

  it("every session type has a label", () => {
    for (const st of SESSION_TYPES) {
      expect(SESSION_TYPE_LABELS[st], `Session type "${st}" should have a label`).toBeDefined();
      expect(SESSION_TYPE_LABELS[st].length).toBeGreaterThan(0);
    }
  });

  it("includes key therapeutic session types", () => {
    expect(SESSION_TYPES).toContain("keywork_session");
    expect(SESSION_TYPES).toContain("life_story_work");
    expect(SESSION_TYPES).toContain("feelings_exploration");
    expect(SESSION_TYPES).toContain("contact_debrief");
    expect(SESSION_TYPES).toContain("safety_planning");
    expect(SESSION_TYPES).toContain("reflective_practice");
  });

  it("has no duplicate entries", () => {
    const unique = new Set(SESSION_TYPES);
    expect(unique.size).toBe(SESSION_TYPES.length);
  });
});

describe("LEARNING_RESOURCE_TYPES", () => {
  it("contains exactly 21 resource types", () => {
    expect(LEARNING_RESOURCE_TYPES.length).toBe(21);
  });

  it("every resource type has a label", () => {
    for (const rt of LEARNING_RESOURCE_TYPES) {
      expect(LEARNING_RESOURCE_TYPE_LABELS[rt], `Resource type "${rt}" should have a label`).toBeDefined();
      expect(LEARNING_RESOURCE_TYPE_LABELS[rt].length).toBeGreaterThan(0);
    }
  });

  it("includes core resource types", () => {
    expect(LEARNING_RESOURCE_TYPES).toContain("staff_training");
    expect(LEARNING_RESOURCE_TYPES).toContain("quiz");
    expect(LEARNING_RESOURCE_TYPES).toContain("flashcards");
    expect(LEARNING_RESOURCE_TYPES).toContain("role_play_scenario");
    expect(LEARNING_RESOURCE_TYPES).toContain("pace_language_alternatives");
    expect(LEARNING_RESOURCE_TYPES).toContain("induction_guide");
  });

  it("has no duplicate entries", () => {
    const unique = new Set(LEARNING_RESOURCE_TYPES);
    expect(unique.size).toBe(LEARNING_RESOURCE_TYPES.length);
  });
});

describe("OVERSIGHT_TYPES", () => {
  it("contains exactly 19 oversight types", () => {
    expect(OVERSIGHT_TYPES.length).toBe(19);
  });

  it("every oversight type has a label", () => {
    for (const ot of OVERSIGHT_TYPES) {
      expect(OVERSIGHT_TYPE_LABELS[ot], `Oversight type "${ot}" should have a label`).toBeDefined();
      expect(OVERSIGHT_TYPE_LABELS[ot].length).toBeGreaterThan(0);
    }
  });

  it("includes critical oversight types", () => {
    expect(OVERSIGHT_TYPES).toContain("daily_log_oversight");
    expect(OVERSIGHT_TYPES).toContain("incident_oversight");
    expect(OVERSIGHT_TYPES).toContain("missing_from_care_oversight");
    expect(OVERSIGHT_TYPES).toContain("safeguarding_oversight");
    expect(OVERSIGHT_TYPES).toContain("restraint_oversight");
    expect(OVERSIGHT_TYPES).toContain("staff_supervision_oversight");
  });

  it("has no duplicate entries", () => {
    const unique = new Set(OVERSIGHT_TYPES);
    expect(unique.size).toBe(OVERSIGHT_TYPES.length);
  });
});

describe("REGULATION_FRAMEWORKS", () => {
  it("contains exactly 10 regulatory frameworks", () => {
    expect(REGULATION_FRAMEWORKS.length).toBe(10);
  });

  it("every framework has a label", () => {
    for (const rf of REGULATION_FRAMEWORKS) {
      expect(REGULATION_LABELS[rf], `Regulation "${rf}" should have a label`).toBeDefined();
    }
  });

  it("includes the primary children's home regulations", () => {
    expect(REGULATION_FRAMEWORKS).toContain("childrens_homes_regs_2015");
    expect(REGULATION_FRAMEWORKS).toContain("quality_standards_2015");
    expect(REGULATION_FRAMEWORKS).toContain("sccif");
  });
});

describe("SCCIF_THEMES", () => {
  it("contains exactly 3 SCCIF themes", () => {
    expect(SCCIF_THEMES.length).toBe(3);
  });

  it("has labels for all 3 themes", () => {
    for (const theme of SCCIF_THEMES) {
      expect(SCCIF_THEME_LABELS[theme], `SCCIF theme "${theme}" should have a label`).toBeDefined();
    }
  });

  it("covers the three SCCIF inspection areas", () => {
    expect(SCCIF_THEMES).toContain("overall_experiences_progress");
    expect(SCCIF_THEMES).toContain("how_well_children_helped_protected");
    expect(SCCIF_THEMES).toContain("effectiveness_leaders_managers");
  });
});

describe("WORKFLOW_TRIGGER_EVENTS", () => {
  it("has at least 20 trigger events", () => {
    expect(WORKFLOW_TRIGGER_EVENTS.length).toBeGreaterThanOrEqual(20);
  });

  it("includes critical safety events", () => {
    expect(WORKFLOW_TRIGGER_EVENTS).toContain("incident_created");
    expect(WORKFLOW_TRIGGER_EVENTS).toContain("missing_episode_created");
    expect(WORKFLOW_TRIGGER_EVENTS).toContain("restraint_recorded");
    expect(WORKFLOW_TRIGGER_EVENTS).toContain("safeguarding_concern_raised");
  });

  it("has no duplicate entries", () => {
    const unique = new Set(WORKFLOW_TRIGGER_EVENTS);
    expect(unique.size).toBe(WORKFLOW_TRIGGER_EVENTS.length);
  });
});
