import { describe, it, expect } from "vitest";

// ══════════════════════════════════════════════════════════════════════════════
// ARIA — INTELLIGENCE PERMISSIONS UNIT TESTS
//
// Tests for hasIntelligencePermission RBAC gating and the
// ARIA_INTELLIGENCE_PERMISSIONS constant.
// ══════════════════════════════════════════════════════════════════════════════

import {
  hasIntelligencePermission,
  ARIA_INTELLIGENCE_PERMISSIONS,
} from "../intelligence-permissions";

describe("ARIA_INTELLIGENCE_PERMISSIONS", () => {
  it("defines all expected permission keys", () => {
    const keys = Object.keys(ARIA_INTELLIGENCE_PERMISSIONS);
    expect(keys).toContain("askAria");
    expect(keys).toContain("viewEvidence");
    expect(keys).toContain("approveAiDraft");
    expect(keys).toContain("commitSuggestedUpdates");
    expect(keys).toContain("viewOfstedReadiness");
    expect(keys).toContain("runMockInspection");
    expect(keys).toContain("viewStaffSignals");
    expect(keys).toContain("manageAiGovernance");
  });

  it("has exactly 8 permission keys", () => {
    expect(Object.keys(ARIA_INTELLIGENCE_PERMISSIONS)).toHaveLength(8);
  });
});

describe("hasIntelligencePermission", () => {
  // --- RSW role ---

  it("allows RSW to askAria", () => {
    expect(hasIntelligencePermission("rsw", "askAria")).toBe(true);
  });

  it("denies RSW from viewEvidence", () => {
    expect(hasIntelligencePermission("rsw", "viewEvidence")).toBe(false);
  });

  it("denies RSW from approveAiDraft", () => {
    expect(hasIntelligencePermission("rsw", "approveAiDraft")).toBe(false);
  });

  it("denies RSW from manageAiGovernance", () => {
    expect(hasIntelligencePermission("rsw", "manageAiGovernance")).toBe(false);
  });

  // --- Senior role ---

  it("allows senior to askAria", () => {
    expect(hasIntelligencePermission("senior", "askAria")).toBe(true);
  });

  it("allows senior to viewEvidence", () => {
    expect(hasIntelligencePermission("senior", "viewEvidence")).toBe(true);
  });

  it("allows senior to runMockInspection", () => {
    expect(hasIntelligencePermission("senior", "runMockInspection")).toBe(true);
  });

  it("denies senior from approveAiDraft", () => {
    expect(hasIntelligencePermission("senior", "approveAiDraft")).toBe(false);
  });

  it("denies senior from commitSuggestedUpdates", () => {
    expect(hasIntelligencePermission("senior", "commitSuggestedUpdates")).toBe(false);
  });

  // --- Deputy manager role ---

  it("allows deputy_manager to approveAiDraft", () => {
    expect(hasIntelligencePermission("deputy_manager", "approveAiDraft")).toBe(true);
  });

  it("allows deputy_manager to viewOfstedReadiness", () => {
    expect(hasIntelligencePermission("deputy_manager", "viewOfstedReadiness")).toBe(true);
  });

  it("denies deputy_manager from commitSuggestedUpdates", () => {
    expect(hasIntelligencePermission("deputy_manager", "commitSuggestedUpdates")).toBe(false);
  });

  // --- Registered manager role ---

  it("allows registered_manager to askAria", () => {
    expect(hasIntelligencePermission("registered_manager", "askAria")).toBe(true);
  });

  it("allows registered_manager to commitSuggestedUpdates", () => {
    expect(hasIntelligencePermission("registered_manager", "commitSuggestedUpdates")).toBe(true);
  });

  it("allows registered_manager to viewStaffSignals", () => {
    expect(hasIntelligencePermission("registered_manager", "viewStaffSignals")).toBe(true);
  });

  it("denies registered_manager from manageAiGovernance", () => {
    expect(hasIntelligencePermission("registered_manager", "manageAiGovernance")).toBe(false);
  });

  // --- Director role (full access) ---

  it("allows director to askAria", () => {
    expect(hasIntelligencePermission("director", "askAria")).toBe(true);
  });

  it("allows director to approveAiDraft", () => {
    expect(hasIntelligencePermission("director", "approveAiDraft")).toBe(true);
  });

  it("allows director to commitSuggestedUpdates", () => {
    expect(hasIntelligencePermission("director", "commitSuggestedUpdates")).toBe(true);
  });

  it("allows director to manageAiGovernance", () => {
    expect(hasIntelligencePermission("director", "manageAiGovernance")).toBe(true);
  });

  it("allows director for every permission", () => {
    const allPermissions = Object.keys(ARIA_INTELLIGENCE_PERMISSIONS) as Array<
      keyof typeof ARIA_INTELLIGENCE_PERMISSIONS
    >;
    for (const perm of allPermissions) {
      expect(hasIntelligencePermission("director", perm)).toBe(true);
    }
  });

  // --- Unknown and edge-case roles ---

  it("returns false for an unknown role", () => {
    expect(hasIntelligencePermission("visitor", "askAria")).toBe(false);
  });

  it("returns false for an empty string role", () => {
    expect(hasIntelligencePermission("", "askAria")).toBe(false);
  });

  it("returns false for unknown role across all permissions", () => {
    const allPermissions = Object.keys(ARIA_INTELLIGENCE_PERMISSIONS) as Array<
      keyof typeof ARIA_INTELLIGENCE_PERMISSIONS
    >;
    for (const perm of allPermissions) {
      expect(hasIntelligencePermission("intern", perm)).toBe(false);
    }
  });

  // --- system_admin role ---

  it("allows system_admin to manageAiGovernance", () => {
    expect(hasIntelligencePermission("system_admin", "manageAiGovernance")).toBe(true);
  });

  it("denies system_admin from askAria", () => {
    expect(hasIntelligencePermission("system_admin", "askAria")).toBe(false);
  });
});
