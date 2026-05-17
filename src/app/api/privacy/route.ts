// ══════════════════════════════════════════════════════════════════════════════
// Children's Privacy & Confidentiality — API Route
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  evaluateChildPrivacyCompliance,
  calculateHomePrivacyMetrics,
} from "@/lib/privacy";
import type { ChildPrivacyProfile } from "@/lib/privacy";

// ── Demo Data ─────────────────────────────────────────────────────────────────

const NOW = "2026-05-17T12:00:00Z";

const DEMO_PROFILES: ChildPrivacyProfile[] = [
  {
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
      { domain: "physical_space", complianceLevel: "fully_met", lastAssessedDate: "2026-04-01", assessedBy: "RM Darren", findings: "Own room with lock, knocking policy observed" },
      { domain: "personal_belongings", complianceLevel: "fully_met", lastAssessedDate: "2026-04-01", assessedBy: "RM Darren", findings: "Lockable drawer provided" },
      { domain: "communications", complianceLevel: "fully_met", lastAssessedDate: "2026-04-01", assessedBy: "RM Darren", findings: "Private phone use, no monitoring" },
      { domain: "digital_privacy", complianceLevel: "fully_met", lastAssessedDate: "2026-04-01", assessedBy: "RM Darren", findings: "Own phone, no monitoring, age-appropriate settings" },
      { domain: "record_keeping", complianceLevel: "fully_met", lastAssessedDate: "2026-04-01", assessedBy: "RM Darren", findings: "Secure cabinet, access log maintained" },
      { domain: "information_sharing", complianceLevel: "fully_met", lastAssessedDate: "2026-04-01", assessedBy: "RM Darren", findings: "Need-to-know adhered, child consulted" },
      { domain: "family_contact", complianceLevel: "fully_met", lastAssessedDate: "2026-04-01", assessedBy: "RM Darren", findings: "Private calls facilitated, mail unopened" },
      { domain: "medical_information", complianceLevel: "fully_met", lastAssessedDate: "2026-04-01", assessedBy: "RM Darren", findings: "Health info restricted to named staff" },
      { domain: "identity_data", complianceLevel: "fully_met", lastAssessedDate: "2026-04-01", assessedBy: "RM Darren", findings: "Care status not disclosed without consent" },
      { domain: "photography_media", complianceLevel: "fully_met", lastAssessedDate: "2026-04-01", assessedBy: "RM Darren", findings: "Consent obtained for all photos" },
    ],
    incidents: [],
    staffPrivacyTrainingCurrent: true,
    childFeelsPrivacyRespected: true,
    lastConsultationDate: "2026-04-15T10:00:00Z",
  },
  {
    childId: "child-jordan",
    childName: "Jordan",
    homeId: "home-oak",
    age: 15,
    hasOwnBedroom: true,
    hasLockableStorage: true,
    hasBathroomPrivacy: true,
    bedroomKnockingPolicy: true,
    hasOwnDevice: true,
    deviceMonitored: true,
    monitoringJustified: true,
    monitoringChildAware: true,
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
      { domain: "physical_space", complianceLevel: "fully_met", lastAssessedDate: "2026-03-15", assessedBy: "RM Darren", findings: "Full privacy standards met" },
      { domain: "digital_privacy", complianceLevel: "partially_met", lastAssessedDate: "2026-03-15", assessedBy: "RM Darren", findings: "Phone monitored — justified by online safety risk assessment. Jordan aware and understands why." },
      { domain: "record_keeping", complianceLevel: "fully_met", lastAssessedDate: "2026-03-15", assessedBy: "RM Darren", findings: "Records secure, Jordan reviewed own file Feb 2026" },
      { domain: "information_sharing", complianceLevel: "fully_met", lastAssessedDate: "2026-03-15", assessedBy: "RM Darren", findings: "Protocol followed" },
      { domain: "family_contact", complianceLevel: "fully_met", lastAssessedDate: "2026-03-15", assessedBy: "RM Darren", findings: "Private calls with mum facilitated" },
      { domain: "communications", complianceLevel: "fully_met", lastAssessedDate: "2026-03-15", assessedBy: "RM Darren", findings: "Private phone access for calls" },
      { domain: "personal_belongings", complianceLevel: "fully_met", lastAssessedDate: "2026-03-15", assessedBy: "RM Darren", findings: "Lockable cupboard available" },
      { domain: "medical_information", complianceLevel: "fully_met", lastAssessedDate: "2026-03-15", assessedBy: "RM Darren", findings: "CAMHS info restricted" },
      { domain: "identity_data", complianceLevel: "fully_met", lastAssessedDate: "2026-03-15", assessedBy: "RM Darren", findings: "School aware but friends not told" },
      { domain: "photography_media", complianceLevel: "fully_met", lastAssessedDate: "2026-03-15", assessedBy: "RM Darren", findings: "LA consent obtained for school photos" },
    ],
    incidents: [
      { id: "inc-j1", childId: "child-jordan", date: "2026-02-20T10:00:00Z", type: "room_search", description: "Room searched following safeguarding concern — smoking materials suspected", reportedBy: "staff-rm-02", severity: "medium", actionTaken: "Search conducted with Jordan present, explained reason, nothing found. Discussion about fire safety.", resolved: true, childInformed: true },
    ],
    staffPrivacyTrainingCurrent: true,
    childFeelsPrivacyRespected: true,
    lastConsultationDate: "2026-03-20T10:00:00Z",
  },
  {
    childId: "child-morgan",
    childName: "Morgan",
    homeId: "home-oak",
    age: 12,
    hasOwnBedroom: true,
    hasLockableStorage: true,
    hasBathroomPrivacy: true,
    bedroomKnockingPolicy: true,
    hasOwnDevice: true,
    deviceMonitored: true,
    monitoringJustified: true,
    monitoringChildAware: true,
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
      { domain: "physical_space", complianceLevel: "fully_met", lastAssessedDate: "2026-04-10", assessedBy: "RM Darren", findings: "Own room, lock available, knocking observed" },
      { domain: "digital_privacy", complianceLevel: "partially_met", lastAssessedDate: "2026-04-10", assessedBy: "RM Darren", findings: "Parental controls on tablet — age-appropriate, Morgan understands" },
      { domain: "record_keeping", complianceLevel: "fully_met", lastAssessedDate: "2026-04-10", assessedBy: "RM Darren", findings: "Secure storage confirmed" },
      { domain: "information_sharing", complianceLevel: "fully_met", lastAssessedDate: "2026-04-10", assessedBy: "RM Darren", findings: "Age-appropriate discussion about what is shared" },
      { domain: "family_contact", complianceLevel: "fully_met", lastAssessedDate: "2026-04-10", assessedBy: "RM Darren", findings: "Video calls with dad in private room" },
      { domain: "communications", complianceLevel: "fully_met", lastAssessedDate: "2026-04-10", assessedBy: "RM Darren", findings: "Private space for calls" },
      { domain: "personal_belongings", complianceLevel: "fully_met", lastAssessedDate: "2026-04-10", assessedBy: "RM Darren", findings: "Secure storage in room" },
      { domain: "medical_information", complianceLevel: "fully_met", lastAssessedDate: "2026-04-10", assessedBy: "RM Darren", findings: "Health info managed appropriately" },
      { domain: "identity_data", complianceLevel: "fully_met", lastAssessedDate: "2026-04-10", assessedBy: "RM Darren", findings: "Heritage info kept confidential per wishes" },
      { domain: "photography_media", complianceLevel: "fully_met", lastAssessedDate: "2026-04-10", assessedBy: "RM Darren", findings: "Parent consent for school photos obtained" },
    ],
    incidents: [],
    staffPrivacyTrainingCurrent: true,
    childFeelsPrivacyRespected: true,
    lastConsultationDate: "2026-04-10T10:00:00Z",
  },
  {
    childId: "child-sam",
    childName: "Sam",
    homeId: "home-oak",
    age: 16,
    hasOwnBedroom: true,
    hasLockableStorage: true,
    hasBathroomPrivacy: true,
    bedroomKnockingPolicy: true,
    hasOwnDevice: true,
    deviceMonitored: true,
    monitoringJustified: true,
    monitoringChildAware: false,
    childAwareOfRecords: true,
    childCanAccessOwnFile: true,
    recordsSecurelyStored: true,
    accessLogMaintained: true,
    needToKnowPolicyAdhered: true,
    childConsultedBeforeSharing: false,
    informationSharingProtocol: true,
    privatePhoneAccess: true,
    privateFamilyContact: true,
    mailNotOpened: true,
    assessments: [
      { domain: "physical_space", complianceLevel: "fully_met", lastAssessedDate: "2026-03-20", assessedBy: "RM Darren", findings: "Full privacy in room" },
      { domain: "digital_privacy", complianceLevel: "partially_met", lastAssessedDate: "2026-03-20", assessedBy: "RM Darren", findings: "CSE risk — monitoring in place, need to inform Sam" },
      { domain: "record_keeping", complianceLevel: "fully_met", lastAssessedDate: "2026-03-20", assessedBy: "RM Darren", findings: "Secure" },
      { domain: "information_sharing", complianceLevel: "partially_met", lastAssessedDate: "2026-03-20", assessedBy: "RM Darren", findings: "Sam not always consulted before info shared with SW" },
      { domain: "family_contact", complianceLevel: "fully_met", lastAssessedDate: "2026-03-20", assessedBy: "RM Darren", findings: "No family contact currently — Sam's choice" },
      { domain: "communications", complianceLevel: "fully_met", lastAssessedDate: "2026-03-20", assessedBy: "RM Darren", findings: "Private phone access available" },
    ],
    incidents: [
      { id: "inc-s1", childId: "child-sam", date: "2026-05-01T14:00:00Z", type: "unauthorised_disclosure", description: "Staff member disclosed Sam's care status to delivery driver — unintentional", reportedBy: "staff-rm-01", severity: "medium", actionTaken: "Staff supervision held, apology given to Sam, reminder of confidentiality policy", resolved: true, childInformed: true },
      { id: "inc-s2", childId: "child-sam", date: "2026-05-10T11:00:00Z", type: "communication_monitored", description: "Review of Sam's online communications per risk plan", reportedBy: "staff-rm-02", severity: "low", actionTaken: "Documented in log, need to inform Sam transparently", resolved: false, childInformed: false },
    ],
    staffPrivacyTrainingCurrent: true,
    childFeelsPrivacyRespected: null,
    lastConsultationDate: undefined,
  },
];

// ── GET Handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") ?? "dashboard";
  const homeId = searchParams.get("homeId") ?? "home-oak";
  const childId = searchParams.get("childId");

  if (mode === "dashboard") {
    const homeProfiles = DEMO_PROFILES.filter(p => p.homeId === homeId);
    const metrics = calculateHomePrivacyMetrics(homeProfiles, homeId, NOW);
    const childResults = homeProfiles.map(p => evaluateChildPrivacyCompliance(p, NOW));
    return NextResponse.json({ metrics, childResults });
  }

  if (mode === "child" && childId) {
    const profile = DEMO_PROFILES.find(p => p.childId === childId);
    if (!profile) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }
    const result = evaluateChildPrivacyCompliance(profile, NOW);
    return NextResponse.json({ result, profile });
  }

  if (mode === "metrics") {
    const homeProfiles = DEMO_PROFILES.filter(p => p.homeId === homeId);
    const metrics = calculateHomePrivacyMetrics(homeProfiles, homeId, NOW);
    return NextResponse.json(metrics);
  }

  return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
}

// ── POST Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === "evaluate") {
    const profile = body.profile as ChildPrivacyProfile;
    if (!profile) {
      return NextResponse.json({ error: "Missing profile" }, { status: 400 });
    }
    const result = evaluateChildPrivacyCompliance(profile, body.now ?? NOW);
    return NextResponse.json(result);
  }

  if (action === "metrics") {
    const profiles = body.profiles as ChildPrivacyProfile[];
    const homeId = body.homeId as string;
    if (!profiles || !homeId) {
      return NextResponse.json({ error: "Missing profiles or homeId" }, { status: 400 });
    }
    const metrics = calculateHomePrivacyMetrics(profiles, homeId, body.now ?? NOW);
    return NextResponse.json(metrics);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
