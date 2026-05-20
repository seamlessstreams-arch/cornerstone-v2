import { NextResponse } from "next/server";
import { generateSaferRecruitmentIntelligence } from "@/lib/safer-recruitment";
import type {
  SaferRecruitmentRecord,
  SaferRecruitmentPolicy,
  StaffSaferRecruitmentTraining,
} from "@/lib/safer-recruitment";

// ── Demo Data ─────────────────────────────────────────────────────────────

const DEMO_RECORDS: SaferRecruitmentRecord[] = [
  // Sarah Johnson — DBS, reference, interview, identity
  { id: "sr-001", homeId: "home-oak", date: "2026-01-15", staffId: "staff-sarah", staffName: "Sarah Johnson", category: "dbs_check", outcome: "fully_compliant", dbsCheckCompleted: true, referencesVerified: true, interviewConducted: true, identityConfirmed: true, documentationComplete: true, timelyRecording: true },
  { id: "sr-002", homeId: "home-oak", date: "2026-02-10", staffId: "staff-sarah", staffName: "Sarah Johnson", category: "reference_verification", outcome: "fully_compliant", dbsCheckCompleted: true, referencesVerified: true, interviewConducted: true, identityConfirmed: true, documentationComplete: true, timelyRecording: true },
  { id: "sr-003", homeId: "home-oak", date: "2026-03-05", staffId: "staff-sarah", staffName: "Sarah Johnson", category: "interview_assessment", outcome: "fully_compliant", dbsCheckCompleted: true, referencesVerified: true, interviewConducted: true, identityConfirmed: true, documentationComplete: true, timelyRecording: true },

  // Tom Richards — qualification, right to work, employment history
  { id: "sr-004", homeId: "home-oak", date: "2026-01-20", staffId: "staff-tom", staffName: "Tom Richards", category: "qualification_check", outcome: "fully_compliant", dbsCheckCompleted: true, referencesVerified: true, interviewConducted: true, identityConfirmed: true, documentationComplete: true, timelyRecording: true },
  { id: "sr-005", homeId: "home-oak", date: "2026-02-15", staffId: "staff-tom", staffName: "Tom Richards", category: "right_to_work_check", outcome: "fully_compliant", dbsCheckCompleted: true, referencesVerified: true, interviewConducted: true, identityConfirmed: true, documentationComplete: true, timelyRecording: true },
  { id: "sr-006", homeId: "home-oak", date: "2026-03-10", staffId: "staff-tom", staffName: "Tom Richards", category: "employment_history_review", outcome: "minor_gap", dbsCheckCompleted: true, referencesVerified: true, interviewConducted: true, identityConfirmed: true, documentationComplete: true, timelyRecording: false },

  // Lisa Williams — identity, risk assessment, DBS
  { id: "sr-007", homeId: "home-oak", date: "2026-02-01", staffId: "staff-lisa", staffName: "Lisa Williams", category: "identity_verification", outcome: "fully_compliant", dbsCheckCompleted: true, referencesVerified: true, interviewConducted: true, identityConfirmed: true, documentationComplete: true, timelyRecording: true },
  { id: "sr-008", homeId: "home-oak", date: "2026-03-15", staffId: "staff-lisa", staffName: "Lisa Williams", category: "risk_assessment", outcome: "fully_compliant", dbsCheckCompleted: true, referencesVerified: true, interviewConducted: true, identityConfirmed: true, documentationComplete: true, timelyRecording: true },
  { id: "sr-009", homeId: "home-oak", date: "2026-04-10", staffId: "staff-lisa", staffName: "Lisa Williams", category: "dbs_check", outcome: "fully_compliant", dbsCheckCompleted: true, referencesVerified: true, interviewConducted: true, identityConfirmed: true, documentationComplete: true, timelyRecording: true },

  // Darren Laville — reference, interview, qualification
  { id: "sr-010", homeId: "home-oak", date: "2026-02-20", staffId: "staff-darren", staffName: "Darren Laville", category: "reference_verification", outcome: "fully_compliant", dbsCheckCompleted: true, referencesVerified: true, interviewConducted: true, identityConfirmed: true, documentationComplete: true, timelyRecording: true },
  { id: "sr-011", homeId: "home-oak", date: "2026-03-20", staffId: "staff-darren", staffName: "Darren Laville", category: "interview_assessment", outcome: "fully_compliant", dbsCheckCompleted: true, referencesVerified: true, interviewConducted: true, identityConfirmed: true, documentationComplete: true, timelyRecording: true },
  { id: "sr-012", homeId: "home-oak", date: "2026-04-15", staffId: "staff-darren", staffName: "Darren Laville", category: "qualification_check", outcome: "fully_compliant", dbsCheckCompleted: true, referencesVerified: true, interviewConducted: false, identityConfirmed: true, documentationComplete: true, timelyRecording: true },
];

const DEMO_POLICY: SaferRecruitmentPolicy = {
  saferRecruitmentPolicy: true,
  dbsRenewalPolicy: true,
  referenceCheckProcedure: true,
  interviewProtocol: true,
  disqualificationByAssociationPolicy: true,
  inductionPolicy: true,
  ongoingVigilancePolicy: true,
};

const DEMO_STAFF: StaffSaferRecruitmentTraining[] = [
  { staffId: "staff-sarah", safeguardingRecruitment: true, dbsProcessKnowledge: true, interviewTechniques: true, referenceVerification: true, disqualificationAwareness: true, whistleblowingAwareness: true },
  { staffId: "staff-tom", safeguardingRecruitment: true, dbsProcessKnowledge: true, interviewTechniques: true, referenceVerification: true, disqualificationAwareness: true, whistleblowingAwareness: false },
  { staffId: "staff-lisa", safeguardingRecruitment: true, dbsProcessKnowledge: true, interviewTechniques: true, referenceVerification: true, disqualificationAwareness: false, whistleblowingAwareness: true },
  { staffId: "staff-darren", safeguardingRecruitment: true, dbsProcessKnowledge: true, interviewTechniques: true, referenceVerification: true, disqualificationAwareness: true, whistleblowingAwareness: true },
];

// ── Handler ───────────────────────────────────────────────────────────────

export async function GET() {
  const result = generateSaferRecruitmentIntelligence({
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
        engine: "safer-recruitment",
        version: "2.0.0",
      },
    },
  });
}
