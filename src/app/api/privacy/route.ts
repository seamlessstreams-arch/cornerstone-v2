import { NextResponse } from "next/server";
import {
  generatePrivacyIntelligence,
} from "@/lib/privacy";
import type { PrivacyRecord, PrivacyPolicy, StaffPrivacyTraining } from "@/lib/privacy";

// ── Demo Data ──────────────────────────────────────────────────────────────

const demoRecords: PrivacyRecord[] = [
  // Alex — strong privacy practices
  { id: "prv-1", homeId: "oak-house", date: "2026-02-10", childId: "child-alex", childName: "Alex", category: "personal_space", outcome: "fully_respected", personalSpaceRespected: true, confidentialityMaintained: true, dignityPreserved: true, consentObtained: true, documentationComplete: true, timelyRecording: true },
  { id: "prv-2", homeId: "oak-house", date: "2026-03-05", childId: "child-alex", childName: "Alex", category: "confidentiality", outcome: "fully_respected", personalSpaceRespected: true, confidentialityMaintained: true, dignityPreserved: true, consentObtained: true, documentationComplete: true, timelyRecording: true },
  { id: "prv-3", homeId: "oak-house", date: "2026-03-22", childId: "child-alex", childName: "Alex", category: "dignity_care", outcome: "fully_respected", personalSpaceRespected: true, confidentialityMaintained: true, dignityPreserved: true, consentObtained: true, documentationComplete: true, timelyRecording: true },
  { id: "prv-4", homeId: "oak-house", date: "2026-04-15", childId: "child-alex", childName: "Alex", category: "data_protection", outcome: "fully_respected", personalSpaceRespected: true, confidentialityMaintained: true, dignityPreserved: true, consentObtained: false, documentationComplete: true, timelyRecording: true },

  // Jordan — mixed results, some minor breaches
  { id: "prv-5", homeId: "oak-house", date: "2026-02-18", childId: "child-jordan", childName: "Jordan", category: "communication_privacy", outcome: "fully_respected", personalSpaceRespected: true, confidentialityMaintained: true, dignityPreserved: true, consentObtained: true, documentationComplete: true, timelyRecording: true },
  { id: "prv-6", homeId: "oak-house", date: "2026-03-10", childId: "child-jordan", childName: "Jordan", category: "medical_privacy", outcome: "minor_breach", personalSpaceRespected: true, confidentialityMaintained: false, dignityPreserved: true, consentObtained: true, documentationComplete: true, timelyRecording: false },
  { id: "prv-7", homeId: "oak-house", date: "2026-04-02", childId: "child-jordan", childName: "Jordan", category: "family_contact_privacy", outcome: "fully_respected", personalSpaceRespected: false, confidentialityMaintained: true, dignityPreserved: true, consentObtained: true, documentationComplete: false, timelyRecording: true },
  { id: "prv-8", homeId: "oak-house", date: "2026-04-25", childId: "child-jordan", childName: "Jordan", category: "digital_privacy", outcome: "fully_respected", personalSpaceRespected: true, confidentialityMaintained: true, dignityPreserved: false, consentObtained: true, documentationComplete: true, timelyRecording: true },

  // Morgan — newer, fewer records
  { id: "prv-9", homeId: "oak-house", date: "2026-03-15", childId: "child-morgan", childName: "Morgan", category: "personal_space", outcome: "fully_respected", personalSpaceRespected: true, confidentialityMaintained: true, dignityPreserved: true, consentObtained: true, documentationComplete: true, timelyRecording: true },
  { id: "prv-10", homeId: "oak-house", date: "2026-04-08", childId: "child-morgan", childName: "Morgan", category: "confidentiality", outcome: "fully_respected", personalSpaceRespected: true, confidentialityMaintained: true, dignityPreserved: true, consentObtained: false, documentationComplete: true, timelyRecording: false },
  { id: "prv-11", homeId: "oak-house", date: "2026-04-28", childId: "child-morgan", childName: "Morgan", category: "dignity_care", outcome: "fully_respected", personalSpaceRespected: true, confidentialityMaintained: true, dignityPreserved: true, consentObtained: true, documentationComplete: true, timelyRecording: true },
  { id: "prv-12", homeId: "oak-house", date: "2026-05-10", childId: "child-morgan", childName: "Morgan", category: "data_protection", outcome: "minor_breach", personalSpaceRespected: false, confidentialityMaintained: true, dignityPreserved: true, consentObtained: true, documentationComplete: false, timelyRecording: true },
];

const demoPolicy: PrivacyPolicy = {
  privacyPolicy: true,
  confidentialityProcedure: true,
  dataProtectionPolicy: true,
  dignityInCarePolicy: true,
  consentFramework: true,
  digitalPrivacyPolicy: true,
  informationSharingProtocol: true,
};

const demoStaff: StaffPrivacyTraining[] = [
  { staffId: "staff-sarah", dataProtectionTraining: true, confidentialityAwareness: true, dignityInCareTraining: true, consentPractice: true, digitalPrivacySkills: true, informationSharingKnowledge: true },
  { staffId: "staff-tom", dataProtectionTraining: true, confidentialityAwareness: true, dignityInCareTraining: true, consentPractice: false, digitalPrivacySkills: false, informationSharingKnowledge: true },
  { staffId: "staff-lisa", dataProtectionTraining: true, confidentialityAwareness: true, dignityInCareTraining: false, consentPractice: true, digitalPrivacySkills: true, informationSharingKnowledge: false },
  { staffId: "staff-darren", dataProtectionTraining: true, confidentialityAwareness: true, dignityInCareTraining: true, consentPractice: true, digitalPrivacySkills: true, informationSharingKnowledge: true },
];

// ── Handler ────────────────────────────────────────────────────────────────

export async function GET() {
  const result = generatePrivacyIntelligence({
    homeId: "oak-house",
    periodStart: "2026-01-01",
    periodEnd: "2026-05-20",
    records: demoRecords,
    policy: demoPolicy,
    staff: demoStaff,
  });

  return NextResponse.json({
    data: {
      ...result,
      meta: { generatedAt: new Date().toISOString(), engine: "privacy", version: "2.0.0" },
    },
  });
}
