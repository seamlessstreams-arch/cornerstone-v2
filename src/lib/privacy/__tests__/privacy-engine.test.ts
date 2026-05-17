// ══════════════════════════════════════════════════════════════════════════════
// Children's Privacy & Confidentiality Engine — Tests
// ══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import {
  evaluateChildPrivacyCompliance,
  calculateHomePrivacyMetrics,
  getPrivacyDomainLabel,
  getIncidentTypeLabel,
} from "../privacy-engine";
import type {
  ChildPrivacyProfile,
  PrivacyAssessment,
  PrivacyIncident,
} from "../privacy-engine";

// ── Fixtures ──────────────────────────────────────────────────────────────

const NOW = "2026-05-17T12:00:00Z";

function makeAssessment(overrides: Partial<PrivacyAssessment> = {}): PrivacyAssessment {
  return {
    domain: "physical_space",
    complianceLevel: "fully_met",
    lastAssessedDate: "2026-04-01T10:00:00Z",
    assessedBy: "RM Darren",
    findings: "All physical privacy standards met",
    ...overrides,
  };
}

function makeIncident(overrides: Partial<PrivacyIncident> = {}): PrivacyIncident {
  return {
    id: "inc-001",
    childId: "child-alex",
    date: "2026-04-10T14:00:00Z",
    type: "room_search",
    description: "Room search following missing medication",
    reportedBy: "staff-rm-01",
    severity: "medium",
    actionTaken: "Search conducted with child present, nothing found, child informed of reason",
    resolved: true,
    childInformed: true,
    ...overrides,
  };
}

function makeProfile(overrides: Partial<ChildPrivacyProfile> = {}): ChildPrivacyProfile {
  return {
    childId: "child-alex",
    childName: "Alex",
    homeId: "home-oak",
    age: 14,
    hasOwnBedroom: true,
    hasLockableStorage: true,
    hasBathroomPrivacy: true,
    bedroomKnockingPolicy: true,
    hasOwnDevice: true,
    deviceMonitored: false,
    monitoringJustified: false,
    monitoringChildAware: false,
    childAwareOfRecords: true,
    childCanAccessOwnFile: true,
    recordsSecurelyStored: true,
    accessLogMaintained: true,
    needToKnowPolicyAdhered: true,
    childConsultedBeforeSharing: true,
    informationSharingProtocol: true,
    privatePhoneAccess: true,
    privateFamilyContact: true,
    mailNotOpened: true,
    assessments: [
      makeAssessment({ domain: "physical_space" }),
      makeAssessment({ domain: "personal_belongings" }),
      makeAssessment({ domain: "communications" }),
      makeAssessment({ domain: "digital_privacy" }),
      makeAssessment({ domain: "record_keeping" }),
      makeAssessment({ domain: "information_sharing" }),
      makeAssessment({ domain: "family_contact" }),
      makeAssessment({ domain: "medical_information" }),
      makeAssessment({ domain: "identity_data" }),
      makeAssessment({ domain: "photography_media" }),
    ],
    incidents: [],
    staffPrivacyTrainingCurrent: true,
    childFeelsPrivacyRespected: true,
    lastConsultationDate: "2026-04-01T10:00:00Z",
    ...overrides,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Compliance Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("evaluateChildPrivacyCompliance", () => {
  it("marks fully compliant child", () => {
    const result = evaluateChildPrivacyCompliance(makeProfile(), NOW);
    expect(result.isCompliant).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.overallPrivacyScore).toBeGreaterThan(90);
    expect(result.physicalPrivacyScore).toBe(100);
    expect(result.dataProtectionScore).toBe(100);
  });

  it("flags no own bedroom", () => {
    const profile = makeProfile({ hasOwnBedroom: false });
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    expect(result.issues.some(i => i.includes("bedroom"))).toBe(true);
    expect(result.physicalPrivacyScore).toBeLessThan(100);
  });

  it("flags no bathroom privacy", () => {
    const profile = makeProfile({ hasBathroomPrivacy: false });
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    expect(result.issues.some(i => i.includes("Bathroom"))).toBe(true);
  });

  it("flags no knocking policy", () => {
    const profile = makeProfile({ bedroomKnockingPolicy: false });
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    expect(result.issues.some(i => i.includes("knocking"))).toBe(true);
  });

  it("warns about lockable storage", () => {
    const profile = makeProfile({ hasLockableStorage: false });
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    expect(result.warnings.some(w => w.includes("lockable storage"))).toBe(true);
  });

  it("flags unjustified device monitoring", () => {
    const profile = makeProfile({
      deviceMonitored: true,
      monitoringJustified: false,
      monitoringChildAware: false,
    });
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    expect(result.issues.some(i => i.includes("monitored without"))).toBe(true);
  });

  it("warns about device monitoring without child awareness", () => {
    const profile = makeProfile({
      deviceMonitored: true,
      monitoringJustified: true,
      monitoringChildAware: false,
    });
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    expect(result.warnings.some(w => w.includes("not fully informed"))).toBe(true);
  });

  it("accepts justified and transparent monitoring", () => {
    const profile = makeProfile({
      deviceMonitored: true,
      monitoringJustified: true,
      monitoringChildAware: true,
    });
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    expect(result.issues.filter(i => i.includes("monitor"))).toHaveLength(0);
    expect(result.digitalPrivacyScore).toBeGreaterThan(70);
  });

  it("flags mail being opened", () => {
    const profile = makeProfile({ mailNotOpened: false });
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    expect(result.issues.some(i => i.includes("mail"))).toBe(true);
  });

  it("flags insecure records", () => {
    const profile = makeProfile({ recordsSecurelyStored: false });
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    expect(result.issues.some(i => i.includes("securely stored"))).toBe(true);
  });

  it("flags need-to-know breach", () => {
    const profile = makeProfile({ needToKnowPolicyAdhered: false });
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    expect(result.issues.some(i => i.includes("Need-to-know"))).toBe(true);
  });

  it("flags no private family contact", () => {
    const profile = makeProfile({ privateFamilyContact: false });
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    expect(result.issues.some(i => i.includes("family contact"))).toBe(true);
  });

  it("flags unresolved incidents", () => {
    const profile = makeProfile({
      incidents: [
        makeIncident({ id: "inc-1", resolved: false }),
        makeIncident({ id: "inc-2", resolved: false }),
      ],
    });
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    expect(result.unresolvedIncidents).toBe(2);
    expect(result.issues.some(i => i.includes("unresolved"))).toBe(true);
  });

  it("warns about high severity incidents", () => {
    const profile = makeProfile({
      incidents: [
        makeIncident({ id: "inc-1", severity: "high", resolved: true }),
      ],
    });
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    expect(result.highSeverityIncidents).toBe(1);
    expect(result.warnings.some(w => w.includes("high-severity"))).toBe(true);
  });

  it("warns about low assessment coverage", () => {
    const profile = makeProfile({
      assessments: [
        makeAssessment({ domain: "physical_space" }),
        makeAssessment({ domain: "personal_belongings" }),
      ],
    });
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    expect(result.assessmentCoverage).toBeLessThan(80);
    expect(result.warnings.some(w => w.includes("assessed"))).toBe(true);
  });

  it("warns when child not consulted", () => {
    const profile = makeProfile({ childFeelsPrivacyRespected: null });
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    expect(result.childConsulted).toBe(false);
    expect(result.warnings.some(w => w.includes("consulted"))).toBe(true);
  });

  it("warns about stale staff training", () => {
    const profile = makeProfile({ staffPrivacyTrainingCurrent: false });
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    expect(result.warnings.some(w => w.includes("training"))).toBe(true);
  });

  it("calculates overall score as weighted average", () => {
    const result = evaluateChildPrivacyCompliance(makeProfile(), NOW);
    // All 100s → overall should be 100
    expect(result.overallPrivacyScore).toBe(100);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Home Metrics Tests
// ══════════════════════════════════════════════════════════════════════════════

describe("calculateHomePrivacyMetrics", () => {
  it("calculates metrics for home", () => {
    const profiles = [
      makeProfile({ childId: "child-alex" }),
      makeProfile({ childId: "child-jordan", childName: "Jordan" }),
    ];
    const result = calculateHomePrivacyMetrics(profiles, "home-oak", NOW);
    expect(result.totalChildren).toBe(2);
    expect(result.averageOverallScore).toBe(100);
    expect(result.childrenWithIssues).toBe(0);
    expect(result.knockingPolicyRate).toBe(100);
    expect(result.ownBedroomRate).toBe(100);
  });

  it("identifies children with issues", () => {
    const profiles = [
      makeProfile({ childId: "child-alex" }),
      makeProfile({ childId: "child-jordan", childName: "Jordan", hasOwnBedroom: false }),
    ];
    const result = calculateHomePrivacyMetrics(profiles, "home-oak", NOW);
    expect(result.childrenWithIssues).toBe(1);
    expect(result.ownBedroomRate).toBe(50);
  });

  it("counts incidents across children", () => {
    const profiles = [
      makeProfile({ childId: "child-alex", incidents: [makeIncident({ id: "i1", resolved: false })] }),
      makeProfile({ childId: "child-jordan", childName: "Jordan", incidents: [makeIncident({ id: "i2", resolved: true })] }),
    ];
    const result = calculateHomePrivacyMetrics(profiles, "home-oak", NOW);
    expect(result.totalIncidents).toBe(2);
    expect(result.unresolvedIncidents).toBe(1);
  });

  it("handles empty profiles", () => {
    const result = calculateHomePrivacyMetrics([], "home-oak", NOW);
    expect(result.totalChildren).toBe(0);
    expect(result.overallScore).toBe(0);
  });

  it("reports staff training status", () => {
    const profiles = [
      makeProfile({ childId: "child-alex", staffPrivacyTrainingCurrent: true }),
      makeProfile({ childId: "child-jordan", childName: "Jordan", staffPrivacyTrainingCurrent: false }),
    ];
    const result = calculateHomePrivacyMetrics(profiles, "home-oak", NOW);
    expect(result.staffTrainingCurrent).toBe(false);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Label Helpers
// ══════════════════════════════════════════════════════════════════════════════

describe("Label helpers", () => {
  it("getPrivacyDomainLabel returns readable labels", () => {
    expect(getPrivacyDomainLabel("physical_space")).toBe("Physical Space");
    expect(getPrivacyDomainLabel("digital_privacy")).toBe("Digital Privacy");
  });

  it("getIncidentTypeLabel returns readable labels", () => {
    expect(getIncidentTypeLabel("data_breach")).toBe("Data Breach");
    expect(getIncidentTypeLabel("room_search")).toBe("Room Search");
  });
});
