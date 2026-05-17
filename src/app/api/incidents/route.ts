// ══════════════════════════════════════════════════════════════════════════════
// API: /api/incidents — Incident & Restraint Management
//
// Returns incident compliance data, restraint analysis, home metrics,
// and behavioural trend information. Powers the incident dashboard,
// Reg 44 reports, and restraint reduction planning.
//
// CHR 2015 Reg 35/36/40 — Behaviour management, physical intervention records.
// BILD/RRN — Restraint Reduction Network standards.
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { createServerClient, isSupabaseEnabled } from "@/lib/supabase/server";
import {
  evaluateIncidentCompliance,
  analyzeRestraints,
  calculateIncidentMetrics,
} from "@/lib/incidents";
import type { Incident, RestraintRecord } from "@/lib/incidents";

type SB = any;

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const homeId = url.searchParams.get("homeId") ?? "home-oak";
    const childId = url.searchParams.get("childId");
    const view = url.searchParams.get("view") ?? "overview";

    const sb = createServerClient();

    if (sb && isSupabaseEnabled()) {
      return await handleLiveData(sb, homeId, childId, view);
    }

    return NextResponse.json(getDemoData(homeId, childId, view));
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

// ── Live Data ──────────────────────────────────────────────────────────────

async function handleLiveData(sb: any, homeId: string, childId: string | null, view: string) {
  let query = (sb.from("incidents") as SB)
    .select("*, restraint_records(*), incident_injuries(*), incident_notifications(*)")
    .eq("home_id", homeId)
    .order("occurred_at", { ascending: false });

  if (childId) {
    query = query.eq("child_id", childId);
  }

  const { data: rows, error } = await query;
  if (error) throw error;

  const incidents: Incident[] = (rows ?? []).map(mapToIncident);

  switch (view) {
    case "overview":
      return NextResponse.json(calculateIncidentMetrics(incidents, homeId));
    case "compliance":
      return NextResponse.json({
        results: incidents.map(evaluateIncidentCompliance),
      });
    case "restraints":
      return NextResponse.json(analyzeRestraints(incidents, homeId));
    case "recent":
      return NextResponse.json({
        incidents: incidents.slice(0, 20),
        compliance: incidents.slice(0, 20).map(evaluateIncidentCompliance),
      });
    default:
      return NextResponse.json({ error: `Unknown view: ${view}` }, { status: 400 });
  }
}

function mapToIncident(row: any): Incident {
  const rr = row.restraint_records?.[0];
  return {
    id: row.id,
    childId: row.child_id,
    childName: row.child_name,
    homeId: row.home_id,
    category: row.category,
    severity: row.severity,
    occurredAt: row.occurred_at,
    reportedAt: row.reported_at,
    location: row.location ?? "",
    description: row.description ?? "",
    antecedent: row.antecedent ?? "",
    behaviour: row.behaviour ?? "",
    consequence: row.consequence ?? "",
    staffInvolved: row.staff_involved ?? [],
    staffWitnesses: row.staff_witnesses ?? [],
    childrenAffected: row.children_affected ?? [],
    restraint: rr ? mapToRestraint(rr) : undefined,
    deEscalationAttempted: row.de_escalation_attempted ?? false,
    deEscalationTechniques: row.de_escalation_techniques ?? [],
    postIncidentActions: row.post_incident_actions ?? [],
    injuries: (row.incident_injuries ?? []).map((i: any) => ({
      person: i.person,
      personType: i.person_type,
      description: i.description,
      bodyMapCompleted: i.body_map_completed ?? false,
      medicalAttentionRequired: i.medical_attention_required ?? false,
      medicalAttentionProvided: i.medical_attention_provided ?? false,
      hospitalAttendance: i.hospital_attendance ?? false,
    })),
    notifications: (row.incident_notifications ?? []).map((n: any) => ({
      recipient: n.recipient,
      type: n.type,
      notifiedAt: n.notified_at,
      method: n.method,
    })),
    completedWithin24h: row.completed_within_24h ?? true,
    signedOffBy: row.signed_off_by,
    signedOffAt: row.signed_off_at,
    loggedBy: row.logged_by,
    loggedAt: row.logged_at,
  };
}

function mapToRestraint(row: any): RestraintRecord {
  return {
    type: row.type,
    startTime: row.start_time,
    endTime: row.end_time,
    durationMinutes: row.duration_minutes,
    reason: row.reason ?? "",
    staffApplyingRestraint: row.staff_applying ?? [],
    approvedTechnique: row.approved_technique ?? true,
    trainingProvider: row.training_provider ?? "PRICE",
    childDebriefed: row.child_debriefed ?? false,
    childDebriefDate: row.child_debrief_date,
    staffDebriefed: row.staff_debriefed ?? false,
    staffDebriefDate: row.staff_debrief_date,
  };
}

// ── Demo Data ─────────────────────────────────────────────────────────────

function getDemoData(homeId: string, childId: string | null, view: string) {
  const allIncidents = getDemoIncidents(homeId);
  const incidents = childId ? allIncidents.filter(i => i.childId === childId) : allIncidents;

  switch (view) {
    case "overview":
      return calculateIncidentMetrics(allIncidents, homeId);
    case "compliance":
      return { results: incidents.map(evaluateIncidentCompliance) };
    case "restraints":
      return analyzeRestraints(allIncidents, homeId);
    case "recent":
      return {
        incidents: incidents.slice(0, 20),
        compliance: incidents.slice(0, 20).map(evaluateIncidentCompliance),
      };
    default:
      return { error: `Unknown view: ${view}` };
  }
}

function getDemoIncidents(homeId: string): Incident[] {
  return [
    // ── Physical Intervention — Jordan (well-managed) ──
    {
      id: "inc-001",
      childId: "child-jordan",
      childName: "Jordan Williams",
      homeId,
      category: "physical_intervention",
      severity: 3,
      occurredAt: "2026-05-10T18:25:00Z",
      reportedAt: "2026-05-10T19:30:00Z",
      location: "Lounge area",
      description: "Physical aggression towards peer during disagreement. PI applied for 7 minutes.",
      antecedent: "Argument with peer over TV choice. Verbal warnings escalated.",
      behaviour: "Punching towards peer, then staff when they intervened.",
      consequence: "Standing hold applied. Calmed after 7 minutes. Debriefed same evening.",
      staffInvolved: ["staff-001", "staff-002"],
      staffWitnesses: ["staff-003"],
      childrenAffected: ["child-alex"],
      restraint: {
        type: "standing_hold",
        startTime: "2026-05-10T18:30:00Z",
        endTime: "2026-05-10T18:37:00Z",
        durationMinutes: 7,
        reason: "Immediate danger of harm to peer and staff",
        staffApplyingRestraint: ["staff-001", "staff-002"],
        approvedTechnique: true,
        trainingProvider: "PRICE",
        childDebriefed: true,
        childDebriefDate: "2026-05-10T19:00:00Z",
        staffDebriefed: true,
        staffDebriefDate: "2026-05-10T20:00:00Z",
      },
      deEscalationAttempted: true,
      deEscalationTechniques: ["verbal_reassurance", "offering_choices", "change_of_environment"],
      postIncidentActions: ["child_debrief", "staff_debrief", "medical_check", "parent_notified", "social_worker_notified", "rm_notified", "risk_assessment_updated"],
      injuries: [],
      notifications: [
        { recipient: "RM — Sarah Mitchell", type: "rm_notified", notifiedAt: "2026-05-10T19:45:00Z", method: "phone" },
        { recipient: "SW — Jane Peters", type: "social_worker_notified", notifiedAt: "2026-05-10T20:00:00Z", method: "email" },
      ],
      completedWithin24h: true,
      signedOffBy: "staff-rm-001",
      signedOffAt: "2026-05-11T09:00:00Z",
      loggedBy: "staff-001",
      loggedAt: "2026-05-10T19:30:00Z",
    },

    // ── Verbal Aggression — Alex (no restraint) ──
    {
      id: "inc-002",
      childId: "child-alex",
      childName: "Alex Reeves",
      homeId,
      category: "verbal_aggression",
      severity: 2,
      occurredAt: "2026-05-08T20:15:00Z",
      reportedAt: "2026-05-08T21:00:00Z",
      location: "Dining room",
      description: "Shouting and swearing at staff after being asked to help clear table.",
      antecedent: "Routine request to help clear dinner things. Alex refused and became verbal.",
      behaviour: "Raised voice, swearing, threatening language. Refused to go to room.",
      consequence: "Staff used low arousal. Alex went to garden for 10 min then apologised.",
      staffInvolved: ["staff-002"],
      staffWitnesses: ["staff-003"],
      childrenAffected: [],
      restraint: undefined,
      deEscalationAttempted: true,
      deEscalationTechniques: ["low_arousal_approach", "time_away", "offering_choices"],
      postIncidentActions: ["child_debrief", "parent_notified"],
      injuries: [],
      notifications: [],
      completedWithin24h: true,
      signedOffBy: "staff-tl-001",
      signedOffAt: "2026-05-09T08:00:00Z",
      loggedBy: "staff-002",
      loggedAt: "2026-05-08T21:00:00Z",
    },

    // ── Self-Harm — Mia (severity 4 — Ofsted notified) ──
    {
      id: "inc-003",
      childId: "child-mia",
      childName: "Mia Chen",
      homeId,
      category: "self_harm",
      severity: 4,
      occurredAt: "2026-05-06T22:30:00Z",
      reportedAt: "2026-05-06T22:45:00Z",
      location: "Bedroom",
      description: "Self-harm discovered during night check. Superficial cuts to forearm.",
      antecedent: "Received upsetting message from family member on phone.",
      behaviour: "Self-inflicted cuts using broken pencil sharpener blade.",
      consequence: "First aid administered. Child supported. A&E attendance for wound care.",
      staffInvolved: ["staff-003", "staff-001"],
      staffWitnesses: [],
      childrenAffected: [],
      restraint: undefined,
      deEscalationAttempted: false,
      deEscalationTechniques: [],
      postIncidentActions: ["child_debrief", "staff_debrief", "medical_check", "body_map_completed", "parent_notified", "social_worker_notified", "rm_notified", "ofsted_notified", "risk_assessment_updated", "care_plan_updated", "referral_made"],
      injuries: [
        { person: "Mia Chen", personType: "child", description: "Superficial cuts to left forearm (x3)", bodyMapCompleted: true, medicalAttentionRequired: true, medicalAttentionProvided: true, hospitalAttendance: true },
      ],
      notifications: [
        { recipient: "RM — Sarah Mitchell", type: "rm_notified", notifiedAt: "2026-05-06T22:50:00Z", method: "phone" },
        { recipient: "SW — David Lee", type: "social_worker_notified", notifiedAt: "2026-05-07T08:00:00Z", method: "phone" },
        { recipient: "Ofsted", type: "ofsted_notified", notifiedAt: "2026-05-07T09:00:00Z", method: "form" },
      ],
      completedWithin24h: true,
      signedOffBy: "staff-rm-001",
      signedOffAt: "2026-05-07T10:00:00Z",
      loggedBy: "staff-003",
      loggedAt: "2026-05-06T22:45:00Z",
    },

    // ── Property Damage — Jordan ──
    {
      id: "inc-004",
      childId: "child-jordan",
      childName: "Jordan Williams",
      homeId,
      category: "property_damage",
      severity: 2,
      occurredAt: "2026-04-28T16:00:00Z",
      reportedAt: "2026-04-28T16:30:00Z",
      location: "Bedroom",
      description: "Punched hole in bedroom wall plaster during frustrated outburst.",
      antecedent: "Told could not go to friend's house due to grounding from previous incident.",
      behaviour: "Punched wall twice. No self-injury.",
      consequence: "Staff spoke with child. Agreed to use punching bag in future. Wall to be repaired.",
      staffInvolved: ["staff-002"],
      staffWitnesses: [],
      childrenAffected: [],
      restraint: undefined,
      deEscalationAttempted: true,
      deEscalationTechniques: ["verbal_reassurance", "offering_choices"],
      postIncidentActions: ["child_debrief", "parent_notified"],
      injuries: [],
      notifications: [],
      completedWithin24h: true,
      signedOffBy: "staff-tl-001",
      signedOffAt: "2026-04-29T09:00:00Z",
      loggedBy: "staff-002",
      loggedAt: "2026-04-28T16:30:00Z",
    },

    // ── Physical Intervention — Alex (longer, with injury) ──
    {
      id: "inc-005",
      childId: "child-alex",
      childName: "Alex Reeves",
      homeId,
      category: "physical_intervention",
      severity: 4,
      occurredAt: "2026-04-15T19:00:00Z",
      reportedAt: "2026-04-15T20:30:00Z",
      location: "Hallway",
      description: "Attempted to leave building with knife from kitchen. PI required for safety.",
      antecedent: "Altercation with peer. Went to kitchen and picked up knife. Staff blocked exit.",
      behaviour: "Holding knife, refusing to put down, attempting to pass staff to leave building.",
      consequence: "Disarm and seated hold. 12 minutes. Police called as backup. No one harmed by knife.",
      staffInvolved: ["staff-001", "staff-002", "staff-003"],
      staffWitnesses: [],
      childrenAffected: ["child-jordan", "child-mia"],
      restraint: {
        type: "seated_hold",
        startTime: "2026-04-15T19:05:00Z",
        endTime: "2026-04-15T19:17:00Z",
        durationMinutes: 12,
        reason: "Immediate danger — child in possession of knife attempting to leave",
        staffApplyingRestraint: ["staff-001", "staff-002"],
        approvedTechnique: true,
        trainingProvider: "PRICE",
        childDebriefed: true,
        childDebriefDate: "2026-04-16T10:00:00Z",
        staffDebriefed: true,
        staffDebriefDate: "2026-04-15T21:00:00Z",
      },
      deEscalationAttempted: true,
      deEscalationTechniques: ["verbal_reassurance", "scripted_response"],
      postIncidentActions: ["child_debrief", "staff_debrief", "medical_check", "body_map_completed", "parent_notified", "social_worker_notified", "rm_notified", "ofsted_notified", "police_notified", "risk_assessment_updated", "care_plan_updated"],
      injuries: [
        { person: "Staff-001", personType: "staff", description: "Scratch to right forearm during disarm", bodyMapCompleted: false, medicalAttentionRequired: false, medicalAttentionProvided: false, hospitalAttendance: false },
        { person: "Alex Reeves", personType: "child", description: "Red marks to both wrists from hold", bodyMapCompleted: true, medicalAttentionRequired: false, medicalAttentionProvided: true, hospitalAttendance: false },
      ],
      notifications: [
        { recipient: "RM — Sarah Mitchell", type: "rm_notified", notifiedAt: "2026-04-15T19:25:00Z", method: "phone" },
        { recipient: "Police", type: "police_notified", notifiedAt: "2026-04-15T19:10:00Z", method: "phone" },
        { recipient: "Ofsted", type: "ofsted_notified", notifiedAt: "2026-04-16T09:00:00Z", method: "form" },
      ],
      completedWithin24h: true,
      signedOffBy: "staff-rm-001",
      signedOffAt: "2026-04-16T11:00:00Z",
      loggedBy: "staff-001",
      loggedAt: "2026-04-15T20:30:00Z",
    },

    // ── Near Miss — no injury ──
    {
      id: "inc-006",
      childId: "child-jordan",
      childName: "Jordan Williams",
      homeId,
      category: "near_miss",
      severity: 1,
      occurredAt: "2026-05-14T14:00:00Z",
      reportedAt: "2026-05-14T14:30:00Z",
      location: "Kitchen",
      description: "Child reached for sharp knife while unsupervised in kitchen. Staff intervened verbally.",
      antecedent: "Making sandwich. Staff stepped out for 30 seconds.",
      behaviour: "Picked up chef's knife to cut bread (not aggressive — poor judgement).",
      consequence: "Verbal reminder about kitchen rules. Supervised for remainder.",
      staffInvolved: ["staff-002"],
      staffWitnesses: [],
      childrenAffected: [],
      restraint: undefined,
      deEscalationAttempted: false,
      deEscalationTechniques: [],
      postIncidentActions: ["child_debrief", "parent_notified"],
      injuries: [],
      notifications: [],
      completedWithin24h: true,
      loggedBy: "staff-002",
      loggedAt: "2026-05-14T14:30:00Z",
    },
  ];
}
