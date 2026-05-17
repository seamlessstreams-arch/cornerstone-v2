// ══════════════════════════════════════════════════════════════════════════════
// API: /api/key-working — Key working intelligence
//
// GET  — returns metrics, compliance per child, insights
// POST — evaluates specific child compliance or generates insights
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  evaluateKeyworkCompliance,
  calculateKeyworkMetrics,
  generateKeyworkInsights,
} from "@/lib/key-working";
import type { KeyworkSession, KeyworkAllocation } from "@/lib/key-working";

// ── Demo Data ─────────────────────────────────────────────────────────────

const DEMO_ALLOCATIONS: KeyworkAllocation[] = [
  {
    childId: "child-001",
    childName: "Child A",
    primaryKeyworkerId: "staff-001",
    primaryKeyworkerName: "Emma Thompson",
    secondaryKeyworkerId: "staff-003",
    secondaryKeyworkerName: "Mike Davis",
    allocatedSince: "2025-09-01T00:00:00Z",
    expectedFrequency: "weekly",
    relationshipQuality: "strong",
  },
  {
    childId: "child-002",
    childName: "Child B",
    primaryKeyworkerId: "staff-002",
    primaryKeyworkerName: "Sarah Williams",
    allocatedSince: "2026-01-15T00:00:00Z",
    expectedFrequency: "weekly",
    relationshipQuality: "developing",
  },
  {
    childId: "child-003",
    childName: "Child C",
    primaryKeyworkerId: "staff-001",
    primaryKeyworkerName: "Emma Thompson",
    secondaryKeyworkerId: "staff-004",
    secondaryKeyworkerName: "Lisa Brown",
    allocatedSince: "2026-03-01T00:00:00Z",
    expectedFrequency: "fortnightly",
    relationshipQuality: "new",
  },
];

const DEMO_SESSIONS: KeyworkSession[] = [
  // Child A - well-engaged, 4 sessions this month
  {
    id: "ks-001", childId: "child-001", childName: "Child A", keyworkerId: "staff-001", keyworkerName: "Emma Thompson", homeId: "home-001",
    sessionType: "formal_keywork", plannedDate: "2026-05-03T14:00:00Z", actualDate: "2026-05-03T14:00:00Z",
    durationMinutes: 45, location: "Quiet room", outcome: "completed",
    engagementLevel: 4, moodBefore: 3, moodAfter: 4,
    topicsDiscussed: ["school progress", "friendship group"], childVoice: "I actually like maths now, the teacher helps me.",
    goalsWorkedOn: ["Build confidence in education"], achievementsNoted: ["Got a merit in maths"], concernsRaised: [],
    actionsAgreed: [{ description: "Arrange school visit with keyworker", assignedTo: "keyworker", dueDate: "2026-05-10T00:00:00Z", completed: true, completedDate: "2026-05-08T00:00:00Z" }],
    followUpRequired: false, notes: "Really positive session. Child excited about school.", createdAt: "2026-05-03T15:00:00Z", signedOff: true, signedOffBy: "staff-001",
  },
  {
    id: "ks-002", childId: "child-001", childName: "Child A", keyworkerId: "staff-001", keyworkerName: "Emma Thompson", homeId: "home-001",
    sessionType: "informal_check_in", plannedDate: "2026-05-07T18:00:00Z", actualDate: "2026-05-07T18:00:00Z",
    durationMinutes: 20, location: "Garden", outcome: "completed",
    engagementLevel: 5, moodBefore: 4, moodAfter: 5,
    topicsDiscussed: ["football", "weekend plans"], childVoice: "Can we go to the park on Saturday? I want to practise penalties.",
    goalsWorkedOn: [], achievementsNoted: ["Initiated conversation about plans"], concernsRaised: [],
    actionsAgreed: [], followUpRequired: false, notes: "Relaxed chat in garden. Great rapport.", createdAt: "2026-05-07T18:30:00Z", signedOff: true, signedOffBy: "staff-001",
  },
  {
    id: "ks-003", childId: "child-001", childName: "Child A", keyworkerId: "staff-001", keyworkerName: "Emma Thompson", homeId: "home-001",
    sessionType: "goal_review", plannedDate: "2026-05-10T14:00:00Z", actualDate: "2026-05-10T14:30:00Z",
    durationMinutes: 40, location: "Office", outcome: "completed",
    engagementLevel: 3, moodBefore: 2, moodAfter: 3,
    topicsDiscussed: ["care plan goals", "LAC review prep", "family contact"],
    childVoice: "I do not want to talk about my mum right now. Can we do it another day?",
    goalsWorkedOn: ["Build confidence in education", "Maintain family relationships"],
    achievementsNoted: [], concernsRaised: ["Became withdrawn when family contact discussed"],
    actionsAgreed: [{ description: "Revisit family topic next session gently", assignedTo: "keyworker", dueDate: "2026-05-17T00:00:00Z", completed: false }],
    followUpRequired: true, followUpDetails: "Monitor mood around family contact day",
    notes: "Engagement dropped when family discussed. Respected boundary.", createdAt: "2026-05-10T15:30:00Z", signedOff: true, signedOffBy: "staff-001",
  },
  {
    id: "ks-004", childId: "child-001", childName: "Child A", keyworkerId: "staff-001", keyworkerName: "Emma Thompson", homeId: "home-001",
    sessionType: "direct_work", plannedDate: "2026-05-14T15:00:00Z", actualDate: "2026-05-14T15:00:00Z",
    durationMinutes: 50, location: "Activity room", outcome: "completed",
    engagementLevel: 5, moodBefore: 4, moodAfter: 5,
    topicsDiscussed: ["strengths and interests", "future aspirations"],
    childVoice: "I think I want to be a sports coach when I grow up. Or maybe work with animals.",
    goalsWorkedOn: ["Develop aspirations and future planning"],
    achievementsNoted: ["Articulated clear future goals for first time"], concernsRaised: [],
    actionsAgreed: [{ description: "Research sports coaching courses", assignedTo: "keyworker", dueDate: "2026-05-21T00:00:00Z", completed: false }],
    followUpRequired: false, notes: "Fantastic session. Child lit up talking about future.", createdAt: "2026-05-14T16:00:00Z", signedOff: true, signedOffBy: "staff-001",
  },
  // Child B - moderate engagement
  {
    id: "ks-005", childId: "child-002", childName: "Child B", keyworkerId: "staff-002", keyworkerName: "Sarah Williams", homeId: "home-001",
    sessionType: "formal_keywork", plannedDate: "2026-05-06T14:00:00Z", actualDate: "2026-05-06T14:00:00Z",
    durationMinutes: 30, location: "Child B room", outcome: "completed",
    engagementLevel: 3, moodBefore: 2, moodAfter: 3,
    topicsDiscussed: ["feelings about placement", "social worker visit"],
    childVoice: "It is alright here I suppose.",
    goalsWorkedOn: ["Settle into placement"], achievementsNoted: [], concernsRaised: ["Still unsettled at night"],
    actionsAgreed: [{ description: "Review bedtime routine", assignedTo: "other_staff", dueDate: "2026-05-10T00:00:00Z", completed: true }],
    followUpRequired: true, followUpDetails: "Check sleep pattern improvement",
    notes: "Guarded but participated.", createdAt: "2026-05-06T15:00:00Z", signedOff: true, signedOffBy: "staff-002",
  },
  {
    id: "ks-006", childId: "child-002", childName: "Child B", keyworkerId: "staff-002", keyworkerName: "Sarah Williams", homeId: "home-001",
    sessionType: "formal_keywork", plannedDate: "2026-05-13T14:00:00Z", actualDate: "2026-05-13T14:00:00Z",
    durationMinutes: 25, location: "Quiet room", outcome: "partially_completed",
    engagementLevel: 2, moodBefore: 2, moodAfter: 2,
    topicsDiscussed: ["school", "family"],
    childVoice: "I do not want to talk about school.",
    goalsWorkedOn: [], achievementsNoted: [], concernsRaised: ["Refused to discuss school"],
    actionsAgreed: [], followUpRequired: true, followUpDetails: "Explore school refusal with education team",
    notes: "Difficult session. Child shut down.", createdAt: "2026-05-13T14:40:00Z", signedOff: true, signedOffBy: "staff-002",
  },
];

// ── GET Handler ───────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const homeId = url.searchParams.get("homeId") ?? "home-001";
  const childId = url.searchParams.get("childId");

  if (childId) {
    // Return individual child insights
    const allocation = DEMO_ALLOCATIONS.find(a => a.childId === childId);
    if (!allocation) {
      return NextResponse.json({ error: "Child not found in allocations" }, { status: 404 });
    }
    const compliance = evaluateKeyworkCompliance(DEMO_SESSIONS, allocation);
    const insights = generateKeyworkInsights(DEMO_SESSIONS, childId);
    return NextResponse.json({ allocation, compliance, insights });
  }

  // Home-level metrics
  const metrics = calculateKeyworkMetrics(DEMO_SESSIONS, DEMO_ALLOCATIONS, homeId);

  return NextResponse.json({
    metrics,
    allocations: DEMO_ALLOCATIONS,
  });
}

// ── POST Handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === "compliance") {
    const { childId } = body;
    const allocation = DEMO_ALLOCATIONS.find(a => a.childId === childId);
    if (!allocation) {
      return NextResponse.json({ error: "Allocation not found" }, { status: 404 });
    }
    const result = evaluateKeyworkCompliance(DEMO_SESSIONS, allocation);
    return NextResponse.json({ compliance: result });
  }

  if (action === "insights") {
    const { childId } = body;
    const insights = generateKeyworkInsights(DEMO_SESSIONS, childId);
    return NextResponse.json({ insights });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
