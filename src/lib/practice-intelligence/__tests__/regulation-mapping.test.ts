import { describe, it, expect, vi } from "vitest";

// ══════════════════════════════════════════════════════════════════════════════
// PRACTICE INTELLIGENCE — REGULATION MAPPING SERVICE TESTS
// ══════════════════════════════════════════════════════════════════════════════

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: vi.fn(() => null),
}));

import {
  CHILDRENS_HOMES_REGULATIONS,
  RECORD_TYPE_REGULATION_MAP,
  mapArtifactToRegulations,
  getRegulationCoverage,
  getSCCIFReadiness,
} from "../regulation-mapping.service";

describe("CHILDRENS_HOMES_REGULATIONS", () => {
  it("has at least 15 regulation entries", () => {
    const keys = Object.keys(CHILDRENS_HOMES_REGULATIONS);
    expect(keys.length).toBeGreaterThanOrEqual(15);
  });

  it("includes critical regulations", () => {
    expect(CHILDRENS_HOMES_REGULATIONS).toHaveProperty("reg_5");
    expect(CHILDRENS_HOMES_REGULATIONS).toHaveProperty("reg_6");
    expect(CHILDRENS_HOMES_REGULATIONS).toHaveProperty("reg_7");
    expect(CHILDRENS_HOMES_REGULATIONS).toHaveProperty("reg_12");
    expect(CHILDRENS_HOMES_REGULATIONS).toHaveProperty("reg_13");
    expect(CHILDRENS_HOMES_REGULATIONS).toHaveProperty("reg_44");
    expect(CHILDRENS_HOMES_REGULATIONS).toHaveProperty("reg_45");
  });

  it("each regulation has required fields", () => {
    for (const [key, reg] of Object.entries(CHILDRENS_HOMES_REGULATIONS)) {
      expect(reg.regulation, `${key} should have regulation`).toBeDefined();
      expect(reg.title, `${key} should have title`).toBeDefined();
      expect(Array.isArray(reg.quality_standards), `${key} should have quality_standards array`).toBe(true);
      expect(Array.isArray(reg.sccif_themes), `${key} should have sccif_themes array`).toBe(true);
      expect(reg.sccif_themes.length, `${key} should have at least one SCCIF theme`).toBeGreaterThan(0);
    }
  });

  it("SCCIF themes are valid values", () => {
    const validThemes = [
      "overall_experiences_progress",
      "how_well_children_helped_protected",
      "effectiveness_leaders_managers",
    ];
    for (const [key, reg] of Object.entries(CHILDRENS_HOMES_REGULATIONS)) {
      for (const theme of reg.sccif_themes) {
        expect(validThemes, `${key} has invalid SCCIF theme: ${theme}`).toContain(theme);
      }
    }
  });

  it("Reg 12 maps to protection SCCIF theme", () => {
    expect(CHILDRENS_HOMES_REGULATIONS.reg_12.sccif_themes).toContain(
      "how_well_children_helped_protected"
    );
  });

  it("Reg 13 maps to leaders & managers SCCIF theme", () => {
    expect(CHILDRENS_HOMES_REGULATIONS.reg_13.sccif_themes).toContain(
      "effectiveness_leaders_managers"
    );
  });

  it("Reg 6 maps to overall experiences SCCIF theme", () => {
    expect(CHILDRENS_HOMES_REGULATIONS.reg_6.sccif_themes).toContain(
      "overall_experiences_progress"
    );
  });
});

describe("RECORD_TYPE_REGULATION_MAP", () => {
  it("has at least 20 record type mappings", () => {
    expect(Object.keys(RECORD_TYPE_REGULATION_MAP).length).toBeGreaterThanOrEqual(20);
  });

  it("critical record types map to expected regulations", () => {
    expect(RECORD_TYPE_REGULATION_MAP.incident).toContain("reg_12");
    expect(RECORD_TYPE_REGULATION_MAP.missing_from_care).toContain("reg_12");
    expect(RECORD_TYPE_REGULATION_MAP.restraint).toContain("reg_12");
    expect(RECORD_TYPE_REGULATION_MAP.safeguarding).toContain("reg_12");
    expect(RECORD_TYPE_REGULATION_MAP.complaint).toContain("reg_16");
    expect(RECORD_TYPE_REGULATION_MAP.reg45).toContain("reg_45");
  });

  it("each mapped regulation key exists in CHILDRENS_HOMES_REGULATIONS", () => {
    for (const [recordType, regKeys] of Object.entries(RECORD_TYPE_REGULATION_MAP)) {
      for (const regKey of regKeys) {
        expect(
          CHILDRENS_HOMES_REGULATIONS,
          `Record type "${recordType}" references unknown regulation "${regKey}"`
        ).toHaveProperty(regKey);
      }
    }
  });
});

describe("mapArtifactToRegulations", () => {
  it("returns regulatory references for an incident", () => {
    const refs = mapArtifactToRegulations("incident", "Test incident content");
    expect(Array.isArray(refs)).toBe(true);
    expect(refs.length).toBeGreaterThan(0);
  });

  it("each reference has framework, regulation, and sccif_theme", () => {
    const refs = mapArtifactToRegulations("incident");
    for (const r of refs) {
      expect(r.framework).toBeDefined();
      expect(r.regulation).toBeDefined();
      expect(r.sccif_theme).toBeDefined();
    }
  });

  it("incident maps to Regulation 12", () => {
    const refs = mapArtifactToRegulations("incident");
    const regTexts = refs.map((r) => r.regulation);
    const hasReg12 = regTexts.some((t) => t.includes("Regulation 12"));
    expect(hasReg12).toBe(true);
  });

  it("returns empty array for unknown record type", () => {
    const refs = mapArtifactToRegulations("unknown_type");
    expect(refs).toHaveLength(0);
  });

  it("includes evidence_text when content is provided", () => {
    const refs = mapArtifactToRegulations("daily_log", "Child had a good day at school.");
    for (const r of refs) {
      expect(r.evidence_text).toBeDefined();
      expect(r.evidence_text.length).toBeGreaterThan(0);
    }
  });
});

describe("getRegulationCoverage (demo mode)", () => {
  it("returns an array of coverage entries", async () => {
    const coverage = await getRegulationCoverage();
    expect(Array.isArray(coverage)).toBe(true);
    expect(coverage.length).toBeGreaterThan(0);
  });
});

describe("getSCCIFReadiness (demo mode)", () => {
  it("returns an array of SCCIF readiness entries", async () => {
    const readiness = await getSCCIFReadiness();
    expect(Array.isArray(readiness)).toBe(true);
    expect(readiness.length).toBeGreaterThan(0);
  });
});
