// ══════════════════════════════════════════════════════════════════════════════
// API: /api/complaints-engine — Complaints & Compliments
//
// GET  — returns metrics overview, individual compliance, or combined dashboard data
// POST — evaluate a specific complaint or calculate custom metrics
//
// CHR 2015 Reg 39 — Complaints and representations
// CHR 2015 Reg 40(2)(q) — Complaints records
// SCCIF — Children know how to complain and feel their views are heard
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  evaluateComplaintCompliance,
  calculateComplaintsMetrics,
} from "@/lib/complaints";
import type { Complaint, Compliment } from "@/lib/complaints";

// ── GET Handler ───────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const homeId = url.searchParams.get("homeId") ?? "home-oak";
  const mode = url.searchParams.get("mode") ?? "dashboard";
  const now = new Date().toISOString();

  const complaints = getDemoComplaints(homeId);
  const compliments = getDemoCompliments(homeId);

  if (mode === "metrics") {
    const metrics = calculateComplaintsMetrics(complaints, compliments, homeId, now);
    return NextResponse.json(metrics);
  }

  if (mode === "compliance") {
    const results = complaints.map(c => evaluateComplaintCompliance(c, now));
    return NextResponse.json({ complaints: results });
  }

  // Default: dashboard — metrics + recent + compliance summary
  const metrics = calculateComplaintsMetrics(complaints, compliments, homeId, now);
  const complianceResults = complaints.map(c => ({
    ...evaluateComplaintCompliance(c, now),
    title: c.title,
    category: c.category,
    stage: c.stage,
    status: c.status,
  }));

  return NextResponse.json({
    metrics,
    complaints: complianceResults,
    recentCompliments: compliments.slice(0, 5),
  });
}

// ── POST Handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === "evaluate") {
    const { complaint, now } = body;
    if (!complaint) {
      return NextResponse.json({ error: "complaint required" }, { status: 400 });
    }
    const result = evaluateComplaintCompliance(complaint as Complaint, now);
    return NextResponse.json(result);
  }

  if (action === "metrics") {
    const { complaints, compliments, homeId, now } = body;
    if (!complaints || !homeId) {
      return NextResponse.json({ error: "complaints and homeId required" }, { status: 400 });
    }
    const result = calculateComplaintsMetrics(
      complaints as Complaint[],
      (compliments ?? []) as Compliment[],
      homeId,
      now,
    );
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Invalid action. Use 'evaluate' or 'metrics'" }, { status: 400 });
}

// ── Demo Data ─────────────────────────────────────────────────────────────

function getDemoComplaints(homeId: string): Complaint[] {
  return [
    {
      id: "comp-001",
      homeId,
      title: "Food quality concern",
      description: "Meals repetitive and lacking variety. Same meals rotating weekly.",
      category: "food_nutrition",
      stage: "stage_1",
      status: "resolved",
      complainantType: "child",
      childId: "child-001",
      childName: "Jordan Williams",
      receivedAt: "2026-04-20T10:00:00Z",
      acknowledgedAt: "2026-04-21T09:00:00Z",
      investigatorAssigned: "staff-rm-01",
      targetResponseDate: "2026-05-04T10:00:00Z",
      resolvedAt: "2026-04-30T14:00:00Z",
      outcome: "upheld",
      outcomeDescription: "Menu variety improved, children consulted on choices",
      actionsTaken: ["Menu review", "Children consulted", "New supplier engaged"],
      lessonsLearned: "Regular menu consultation with children should be embedded",
      complainantSatisfied: true,
      ofstedNotified: false,
      loggedBy: "staff-rm-01",
    },
    {
      id: "comp-002",
      homeId,
      title: "Privacy not respected during phone call",
      description: "Staff member entered room during private phone call with social worker",
      category: "privacy",
      stage: "informal",
      status: "resolved",
      complainantType: "child",
      childId: "child-002",
      childName: "Aisha Patel",
      receivedAt: "2026-04-25T14:00:00Z",
      acknowledgedAt: "2026-04-25T15:00:00Z",
      investigatorAssigned: "staff-rm-01",
      targetResponseDate: "2026-05-09T14:00:00Z",
      resolvedAt: "2026-04-27T10:00:00Z",
      outcome: "upheld",
      outcomeDescription: "Apology given, protocol reinforced with team",
      actionsTaken: ["Staff discussion", "Privacy protocol reminder", "Door signs provided"],
      lessonsLearned: "Children to have access to 'Do Not Disturb' signs",
      complainantSatisfied: true,
      ofstedNotified: false,
      loggedBy: "staff-rm-01",
    },
    {
      id: "comp-003",
      homeId,
      title: "Restraint concern — excessive force alleged",
      description: "Parent reported child said excessive force used during restraint incident on 3rd May",
      category: "restraint",
      stage: "stage_2",
      status: "investigating",
      complainantType: "parent_carer",
      complainantName: "Mrs Thompson",
      childId: "child-003",
      childName: "Callum Thompson",
      receivedAt: "2026-05-05T09:00:00Z",
      acknowledgedAt: "2026-05-06T10:00:00Z",
      investigatorAssigned: "staff-ind-01",
      targetResponseDate: "2026-06-02T09:00:00Z",
      outcome: undefined,
      actionsTaken: ["Independent investigator appointed", "Body cam reviewed", "Staff suspended pending"],
      complainantSatisfied: undefined,
      ofstedNotified: true,
      loggedBy: "staff-rm-01",
    },
    {
      id: "comp-004",
      homeId,
      title: "Wi-Fi restrictions unfair",
      description: "Complaint that Wi-Fi curfew applied inconsistently between children",
      category: "activities",
      stage: "stage_1",
      status: "open",
      complainantType: "child",
      childId: "child-001",
      childName: "Jordan Williams",
      receivedAt: "2026-05-12T16:00:00Z",
      acknowledgedAt: "2026-05-13T09:00:00Z",
      investigatorAssigned: "staff-sw-01",
      targetResponseDate: "2026-05-26T16:00:00Z",
      outcome: undefined,
      actionsTaken: [],
      complainantSatisfied: undefined,
      ofstedNotified: false,
      loggedBy: "staff-sw-01",
    },
    {
      id: "comp-005",
      homeId,
      title: "Staff attitude concern",
      description: "Social worker reports child feels talked down to by night staff",
      category: "staff_conduct",
      stage: "stage_1",
      status: "investigating",
      complainantType: "social_worker",
      complainantName: "Beverley Marsh (SW)",
      childId: "child-002",
      childName: "Aisha Patel",
      receivedAt: "2026-05-01T11:00:00Z",
      acknowledgedAt: "2026-05-02T09:00:00Z",
      investigatorAssigned: "staff-rm-01",
      targetResponseDate: "2026-05-15T11:00:00Z",
      outcome: undefined,
      actionsTaken: ["Night staff interview", "Keywork session with child"],
      lessonsLearned: undefined,
      complainantSatisfied: undefined,
      ofstedNotified: false,
      loggedBy: "staff-rm-01",
    },
    {
      id: "comp-006",
      homeId,
      title: "Medication given late repeatedly",
      description: "Child reports morning medication given late 3 times in past week causing school tardiness",
      category: "medication",
      stage: "stage_1",
      status: "resolved",
      complainantType: "child",
      childId: "child-003",
      childName: "Callum Thompson",
      receivedAt: "2026-04-10T08:00:00Z",
      acknowledgedAt: "2026-04-11T09:00:00Z",
      investigatorAssigned: "staff-rm-01",
      targetResponseDate: "2026-04-24T08:00:00Z",
      resolvedAt: "2026-04-18T12:00:00Z",
      outcome: "upheld",
      outcomeDescription: "Medication rota adjusted, earlier wake time agreed with child",
      actionsTaken: ["Rota adjusted", "Alarm set for medication staff", "School notified"],
      lessonsLearned: "Morning medication must be prioritised in handover notes",
      complainantSatisfied: true,
      ofstedNotified: false,
      loggedBy: "staff-rm-01",
    },
  ];
}

function getDemoCompliments(homeId: string): Compliment[] {
  return [
    {
      id: "cmpl-001",
      homeId,
      source: "parent_carer",
      sourceName: "Mrs Williams",
      description: "Thank you for the fantastic birthday celebration for Jordan — he said it was the best birthday ever",
      category: "care_quality",
      receivedAt: "2026-05-05T10:00:00Z",
      sharedWithTeam: true,
      loggedBy: "staff-rm-01",
    },
    {
      id: "cmpl-002",
      homeId,
      source: "social_worker",
      sourceName: "Beverley Marsh",
      description: "Really impressed by the quality of LAC review reports — thorough and child-centred",
      category: "education",
      receivedAt: "2026-05-08T14:00:00Z",
      sharedWithTeam: true,
      loggedBy: "staff-rm-01",
    },
    {
      id: "cmpl-003",
      homeId,
      source: "child",
      childId: "child-002",
      childName: "Aisha Patel",
      description: "I love the new garden area — it's really peaceful and makes me feel calm",
      category: "environment",
      receivedAt: "2026-05-10T16:00:00Z",
      sharedWithTeam: true,
      loggedBy: "staff-sw-01",
    },
    {
      id: "cmpl-004",
      homeId,
      source: "external",
      sourceName: "CAMHS Therapist",
      description: "Staff consistently attend appointments and provide excellent transition support",
      category: "health",
      receivedAt: "2026-04-28T11:00:00Z",
      sharedWithTeam: true,
      loggedBy: "staff-rm-01",
    },
    {
      id: "cmpl-005",
      homeId,
      source: "child",
      childId: "child-001",
      childName: "Jordan Williams",
      description: "My keyworker really listens to me and helps me when I'm angry",
      category: "care_quality",
      receivedAt: "2026-05-14T09:00:00Z",
      sharedWithTeam: true,
      loggedBy: "staff-sw-01",
    },
  ];
}
