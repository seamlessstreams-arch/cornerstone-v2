// ══════════════════════════════════════════════════════════════════════════════
// API — HOME CHILDREN'S RIGHTS & PARTICIPATION INTELLIGENCE
// Maps in-memory store → engine input → JSON response.
// CHR 2015 Reg 7, UNCRC Articles.
// ══════════════════════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeChildrensRightsParticipation,
  type ChildrensRightInput,
  type ChildLedMeetingInput,
  type FeedbackLoopInput,
  type PledgeInput,
  type ParticipationInput,
  type AdvocacyInput,
} from "@/lib/engines/home-childrens-rights-participation-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Children's Rights ─────────────────────────────────────────────────
  const rights_entries: ChildrensRightInput[] = (store.childrensRights as any[]).map((r: any) => ({
    id: r.id,
    compliance_level: r.compliance_level ?? "under_review",
    evidence_count: (r.evidence ?? []).length,
    child_feedback_provided: !!(r.child_feedback),
    action_needed_present: !!(r.action_needed),
  }));

  // ── Child-Led Meetings ────────────────────────────────────────────────
  const child_led_meetings: ChildLedMeetingInput[] = (store.childLedMeetings as any[]).map((m: any) => ({
    id: m.id,
    child_id: m.child_id,
    date: (m.date ?? "").toString().slice(0, 10),
    decisions_reached_count: (m.decisions_reached ?? []).length,
    child_agenda_count: (m.agenda_proposed_by_child ?? []).length,
    proud_moments_count: (m.proud_moments ?? []).length,
    visible_change_provided: !!(m.visible_change),
  }));

  // ── Feedback Loops ────────────────────────────────────────────────────
  const feedback_loops: FeedbackLoopInput[] = (store.childFeedbackLoops as any[]).map((f: any) => ({
    id: f.id,
    child_id: f.child_id,
    feedback_date: (f.feedback_date ?? "").toString().slice(0, 10),
    decision_made: f.decision_made ?? "not_applicable",
    child_accepts: !!(f.child_accepts),
    duration_days_to_close: f.duration_days_to_close ?? 0,
    actions_taken_count: (f.actions_taken ?? []).length,
    visible_change_provided: !!(f.visible_change),
  }));

  // ── Pledges ───────────────────────────────────────────────────────────
  const pledges: PledgeInput[] = (store.childPledges as any[]).map((p: any) => ({
    id: p.id,
    child_id: p.child_id,
    status: p.status ?? "active",
    evidence_of_delivery_count: (p.evidence_of_delivery ?? []).length,
    last_review_date: (p.last_review_date ?? "").toString().slice(0, 10),
    child_feedback_provided: !!(p.child_feedback),
  }));

  // ── Participation Entries ─────────────────────────────────────────────
  const participation_entries: ParticipationInput[] = (store.participationEntries as any[]).map((p: any) => ({
    id: p.id,
    date: (p.date ?? "").toString().slice(0, 10),
    children_involved_count: (p.children_involved ?? []).length,
    child_influenced: !!(p.child_influenced),
    feedback_given_provided: !!(p.feedback_given),
  }));

  // ── Advocacy Records ──────────────────────────────────────────────────
  const advocacy_records: AdvocacyInput[] = (store.advocacyRecords as any[]).map((a: any) => ({
    id: a.id,
    child_id: a.child_id,
    status: a.status ?? "active",
    visits_count: (a.visits ?? []).length,
    review_date: (a.review_date ?? "").toString().slice(0, 10),
    child_view_provided: !!(a.child_view),
  }));

  // ── Children count ────────────────────────────────────────────────────
  const youngPeople = (store.youngPeople ?? []) as any[];
  const total_children = youngPeople.length;

  const result = computeHomeChildrensRightsParticipation({
    today,
    rights_entries,
    child_led_meetings,
    feedback_loops,
    pledges,
    participation_entries,
    advocacy_records,
    total_children,
  });

  return NextResponse.json({ data: result });
}
