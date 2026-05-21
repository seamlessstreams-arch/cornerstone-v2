import { NextResponse } from "next/server";
import { generatePremisesIntelligenceReport } from "@/lib/premises";
import type {
  PremisesIntelligenceRecord,
  PremisesIntelligencePolicy,
  StaffPremisesTraining,
} from "@/lib/premises";

// ── Demo Data ─────────────────────────────────────────────────────────────

const DEMO_RECORDS: PremisesIntelligenceRecord[] = [
  // Sarah — fire safety, health & safety, bedroom standards
  { id: "pr-001", homeId: "home-oak", date: "2026-01-15", staffId: "staff-sarah", staffName: "Sarah", category: "fire_safety_check", outcome: "fully_compliant", hazardIdentified: true, riskMitigated: true, maintenanceCompleted: true, childFriendlyAssessed: true, documentationComplete: true, timelyRecording: true },
  { id: "pr-002", homeId: "home-oak", date: "2026-02-10", staffId: "staff-sarah", staffName: "Sarah", category: "health_safety_inspection", outcome: "fully_compliant", hazardIdentified: true, riskMitigated: true, maintenanceCompleted: true, childFriendlyAssessed: true, documentationComplete: true, timelyRecording: true },
  { id: "pr-003", homeId: "home-oak", date: "2026-03-05", staffId: "staff-sarah", staffName: "Sarah", category: "bedroom_standard", outcome: "fully_compliant", hazardIdentified: true, riskMitigated: true, maintenanceCompleted: true, childFriendlyAssessed: true, documentationComplete: true, timelyRecording: true },

  // Tom — maintenance, communal areas, garden
  { id: "pr-004", homeId: "home-oak", date: "2026-01-20", staffId: "staff-tom", staffName: "Tom", category: "maintenance_repair", outcome: "minor_issues", hazardIdentified: true, riskMitigated: true, maintenanceCompleted: true, childFriendlyAssessed: true, documentationComplete: true, timelyRecording: true },
  { id: "pr-005", homeId: "home-oak", date: "2026-02-15", staffId: "staff-tom", staffName: "Tom", category: "communal_area_check", outcome: "fully_compliant", hazardIdentified: true, riskMitigated: true, maintenanceCompleted: true, childFriendlyAssessed: true, documentationComplete: true, timelyRecording: true },
  { id: "pr-006", homeId: "home-oak", date: "2026-03-10", staffId: "staff-tom", staffName: "Tom", category: "garden_outdoor_area", outcome: "minor_issues", hazardIdentified: true, riskMitigated: true, maintenanceCompleted: true, childFriendlyAssessed: true, documentationComplete: true, timelyRecording: false },

  // Lisa — security, accessibility, fire safety
  { id: "pr-007", homeId: "home-oak", date: "2026-02-01", staffId: "staff-lisa", staffName: "Lisa", category: "security_assessment", outcome: "fully_compliant", hazardIdentified: true, riskMitigated: true, maintenanceCompleted: true, childFriendlyAssessed: true, documentationComplete: true, timelyRecording: true },
  { id: "pr-008", homeId: "home-oak", date: "2026-03-15", staffId: "staff-lisa", staffName: "Lisa", category: "accessibility_review", outcome: "fully_compliant", hazardIdentified: true, riskMitigated: true, maintenanceCompleted: true, childFriendlyAssessed: true, documentationComplete: true, timelyRecording: true },
  { id: "pr-009", homeId: "home-oak", date: "2026-04-10", staffId: "staff-lisa", staffName: "Lisa", category: "fire_safety_check", outcome: "fully_compliant", hazardIdentified: true, riskMitigated: true, maintenanceCompleted: true, childFriendlyAssessed: true, documentationComplete: true, timelyRecording: true },

  // Darren — health & safety, bedroom, communal
  { id: "pr-010", homeId: "home-oak", date: "2026-04-01", staffId: "staff-darren", staffName: "Darren", category: "health_safety_inspection", outcome: "fully_compliant", hazardIdentified: true, riskMitigated: true, maintenanceCompleted: true, childFriendlyAssessed: true, documentationComplete: true, timelyRecording: true },
  { id: "pr-011", homeId: "home-oak", date: "2026-04-10", staffId: "staff-darren", staffName: "Darren", category: "bedroom_standard", outcome: "minor_issues", hazardIdentified: false, riskMitigated: true, maintenanceCompleted: true, childFriendlyAssessed: true, documentationComplete: true, timelyRecording: true },
  { id: "pr-012", homeId: "home-oak", date: "2026-05-01", staffId: "staff-darren", staffName: "Darren", category: "communal_area_check", outcome: "fully_compliant", hazardIdentified: true, riskMitigated: true, maintenanceCompleted: false, childFriendlyAssessed: true, documentationComplete: false, timelyRecording: true },
];

const DEMO_POLICY: PremisesIntelligencePolicy = {
  healthSafetyPolicy: true,
  fireSafetyPolicy: true,
  maintenanceSchedulePolicy: true,
  bedroomStandardsPolicy: true,
  securityPolicy: true,
  accessibilityPolicy: true,
  environmentalSustainabilityPolicy: true,
};

const DEMO_STAFF: StaffPremisesTraining[] = [
  { staffId: "staff-sarah", healthSafetyKnowledge: true, fireSafetyTraining: true, maintenanceSkills: true, riskAssessmentSkills: true, firstAidTraining: true, accessibilityAwareness: true },
  { staffId: "staff-tom", healthSafetyKnowledge: true, fireSafetyTraining: true, maintenanceSkills: true, riskAssessmentSkills: true, firstAidTraining: true, accessibilityAwareness: false },
  { staffId: "staff-lisa", healthSafetyKnowledge: true, fireSafetyTraining: true, maintenanceSkills: true, riskAssessmentSkills: true, firstAidTraining: false, accessibilityAwareness: true },
  { staffId: "staff-darren", healthSafetyKnowledge: true, fireSafetyTraining: true, maintenanceSkills: true, riskAssessmentSkills: true, firstAidTraining: true, accessibilityAwareness: true },
];

// ── Handler ───────────────────────────────────────────────────────────────

export async function GET() {
  const result = generatePremisesIntelligenceReport({
    homeId: "home-oak",
    periodStart: "2026-01-01",
    periodEnd: "2026-05-20",
    records: DEMO_RECORDS,
    policy: DEMO_POLICY,
    staff: DEMO_STAFF,
  });

  return NextResponse.json({
    data: {
      ...result,
      meta: {
        generatedAt: new Date().toISOString(),
        engine: "premises-intelligence",
        version: "2.0.0",
      },
    },
  });
}
