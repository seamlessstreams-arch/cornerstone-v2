import { NextResponse } from "next/server";
import {
  generateDigitalLiteracyDevelopmentIntelligence,
  getSessionTypeLabel,
  getCompetencyLevelLabel,
  getRatingLabel,
} from "@/lib/digital-literacy-development";
import type {
  DigitalSession,
  DigitalPolicy,
  StaffDigitalTraining,
} from "@/lib/digital-literacy-development";

const DEMO_SESSIONS: DigitalSession[] = [
  { id: "ds-1", childId: "child-alex", childName: "Alex", sessionDate: "2026-04-01", sessionType: "online_safety", competencyLevel: "advanced", onlineSafetyDemonstrated: true, ageAppropriateContent: true, supervisedAccess: true, documentedInPlan: true, staffSupported: true, progressRecorded: true },
  { id: "ds-2", childId: "child-alex", childName: "Alex", sessionDate: "2026-04-08", sessionType: "coding_skills", competencyLevel: "proficient", onlineSafetyDemonstrated: true, ageAppropriateContent: true, supervisedAccess: true, documentedInPlan: true, staffSupported: true, progressRecorded: true },
  { id: "ds-3", childId: "child-alex", childName: "Alex", sessionDate: "2026-04-15", sessionType: "digital_creativity", competencyLevel: "advanced", onlineSafetyDemonstrated: true, ageAppropriateContent: true, supervisedAccess: true, documentedInPlan: true, staffSupported: true, progressRecorded: true },
  { id: "ds-4", childId: "child-jordan", childName: "Jordan", sessionDate: "2026-04-01", sessionType: "research_skills", competencyLevel: "advanced", onlineSafetyDemonstrated: true, ageAppropriateContent: true, supervisedAccess: true, documentedInPlan: true, staffSupported: true, progressRecorded: true },
  { id: "ds-5", childId: "child-jordan", childName: "Jordan", sessionDate: "2026-04-08", sessionType: "social_media_awareness", competencyLevel: "proficient", onlineSafetyDemonstrated: true, ageAppropriateContent: true, supervisedAccess: true, documentedInPlan: true, staffSupported: true, progressRecorded: true },
  { id: "ds-6", childId: "child-jordan", childName: "Jordan", sessionDate: "2026-04-15", sessionType: "cyberbullying_education", competencyLevel: "advanced", onlineSafetyDemonstrated: true, ageAppropriateContent: true, supervisedAccess: true, documentedInPlan: true, staffSupported: true, progressRecorded: true },
  { id: "ds-7", childId: "child-morgan", childName: "Morgan", sessionDate: "2026-04-01", sessionType: "privacy_management", competencyLevel: "advanced", onlineSafetyDemonstrated: true, ageAppropriateContent: true, supervisedAccess: true, documentedInPlan: true, staffSupported: true, progressRecorded: true },
  { id: "ds-8", childId: "child-morgan", childName: "Morgan", sessionDate: "2026-04-08", sessionType: "digital_communication", competencyLevel: "proficient", onlineSafetyDemonstrated: true, ageAppropriateContent: true, supervisedAccess: true, documentedInPlan: true, staffSupported: true, progressRecorded: true },
];

const DEMO_POLICY: DigitalPolicy = {
  id: "dp-1",
  onlineSafetyPolicy: true,
  deviceUsageGuidelines: true,
  socialMediaPolicy: true,
  ageVerificationProtocol: true,
  monitoringFramework: true,
  incidentResponsePlan: true,
  regularReview: true,
};

const DEMO_TRAINING: StaffDigitalTraining[] = [
  { id: "dt-1", staffId: "staff-sarah", staffName: "Sarah Johnson", onlineSafety: true, digitalLiteracy: true, socialMediaAwareness: true, cyberbullyingResponse: true, privacyProtection: true, monitoringSkills: true },
  { id: "dt-2", staffId: "staff-tom", staffName: "Tom Richards", onlineSafety: true, digitalLiteracy: true, socialMediaAwareness: true, cyberbullyingResponse: true, privacyProtection: true, monitoringSkills: true },
  { id: "dt-3", staffId: "staff-lisa", staffName: "Lisa Williams", onlineSafety: true, digitalLiteracy: true, socialMediaAwareness: true, cyberbullyingResponse: true, privacyProtection: true, monitoringSkills: true },
  { id: "dt-4", staffId: "staff-darren", staffName: "Darren Laville", onlineSafety: true, digitalLiteracy: true, socialMediaAwareness: true, cyberbullyingResponse: true, privacyProtection: true, monitoringSkills: true },
];

export async function GET() {
  const result = generateDigitalLiteracyDevelopmentIntelligence(
    DEMO_SESSIONS, DEMO_POLICY, DEMO_TRAINING, "oak-house", "2026-01-01", "2026-05-19",
  );

  return NextResponse.json({
    data: {
      ...result,
      meta: {
        sessionTypeLabels: Object.fromEntries(
          (["online_safety", "coding_skills", "digital_creativity", "research_skills", "social_media_awareness", "cyberbullying_education", "privacy_management", "digital_communication"] as const).map((t) => [t, getSessionTypeLabel(t)]),
        ),
        competencyLevelLabels: Object.fromEntries(
          (["advanced", "proficient", "developing", "beginner", "not_assessed"] as const).map((c) => [c, getCompetencyLevelLabel(c)]),
        ),
        ratingLabels: Object.fromEntries(
          (["outstanding", "good", "requires_improvement", "inadequate"] as const).map((r) => [r, getRatingLabel(r)]),
        ),
      },
    },
  });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const { sessions, policy, training, homeId, periodStart, periodEnd } = body as {
    sessions?: DigitalSession[]; policy?: DigitalPolicy | null; training?: StaffDigitalTraining[];
    homeId?: string; periodStart?: string; periodEnd?: string;
  };

  if (!periodStart || !periodEnd) return NextResponse.json({ error: "periodStart and periodEnd are required" }, { status: 400 });

  const result = generateDigitalLiteracyDevelopmentIntelligence(
    sessions ?? [], policy ?? null, training ?? [], homeId ?? "unknown", periodStart, periodEnd,
  );

  return NextResponse.json({ data: result });
}
