// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME CULTURAL EVENTS & CELEBRATIONS INTELLIGENCE API ROUTE
// GET /api/v1/home-cultural-events-celebrations-intelligence
// Cross-domain composite: culturalEventRecords + diversityCelebrationRecords +
// heritageDayRecords + festivalInclusionRecords + childLedActivityRecords
// CHR 2015 Reg 5 (Quality of care), Reg 7 (Children's views).
// SCCIF: Experiences and progress.
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeCulturalEventsCelebrations,
  type CulturalEventRecordInput,
  type DiversityCelebrationRecordInput,
  type HeritageDayRecordInput,
  type FestivalInclusionRecordInput,
  type ChildLedActivityRecordInput,
} from "@/lib/engines/home-cultural-events-celebrations-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    // ── Cultural Event Records ────────────────────────────────────────────
    const rawCulturalEvents = (store.culturalEventRecords ?? []) as any[];
    const cultural_event_records: CulturalEventRecordInput[] = rawCulturalEvents.map((e: any) => ({
      id: e.id ?? "",
      child_id: e.child_id ?? "",
      event_date: (e.event_date ?? today).toString(),
      event_type: e.event_type ?? "other",
      title: e.title ?? "",
      description: e.description ?? "",
      participated: !!e.participated,
      engagement_level: e.engagement_level ?? "willing",
      child_feedback_positive: !!e.child_feedback_positive,
      staff_facilitated: !!e.staff_facilitated,
      external_community_involved: !!e.external_community_involved,
      linked_to_child_heritage: !!e.linked_to_child_heritage,
      photos_consented: !!e.photos_consented,
      duration_minutes: typeof e.duration_minutes === "number" ? e.duration_minutes : 60,
      created_at: (e.created_at ?? today).toString(),
    }));

    // ── Diversity Celebration Records ─────────────────────────────────────
    const rawDiversityCelebrations = (store.diversityCelebrationRecords ?? []) as any[];
    const diversity_celebration_records: DiversityCelebrationRecordInput[] = rawDiversityCelebrations.map((c: any) => ({
      id: c.id ?? "",
      celebration_date: (c.celebration_date ?? today).toString(),
      celebration_type: c.celebration_type ?? "other",
      title: c.title ?? "",
      planned_in_advance: !!c.planned_in_advance,
      children_involved_in_planning: !!c.children_involved_in_planning,
      children_participated: Array.isArray(c.children_participated) ? c.children_participated : [],
      total_children_invited: typeof c.total_children_invited === "number" ? c.total_children_invited : total_children,
      participation_rate_pct: typeof c.participation_rate_pct === "number" ? c.participation_rate_pct : 0,
      educational_component: !!c.educational_component,
      external_speaker_or_visitor: !!c.external_speaker_or_visitor,
      food_or_cuisine_included: !!c.food_or_cuisine_included,
      display_or_decoration: !!c.display_or_decoration,
      child_feedback_collected: !!c.child_feedback_collected,
      child_feedback_positive_count: typeof c.child_feedback_positive_count === "number" ? c.child_feedback_positive_count : 0,
      staff_led_by: c.staff_led_by ?? "",
      quality_rating: typeof c.quality_rating === "number" ? c.quality_rating : 3,
      created_at: (c.created_at ?? today).toString(),
    }));

    // ── Heritage Day Records ──────────────────────────────────────────────
    const rawHeritageDays = (store.heritageDayRecords ?? []) as any[];
    const heritage_day_records: HeritageDayRecordInput[] = rawHeritageDays.map((h: any) => ({
      id: h.id ?? "",
      child_id: h.child_id ?? "",
      heritage_date: (h.heritage_date ?? today).toString(),
      heritage_type: h.heritage_type ?? "other",
      title: h.title ?? "",
      acknowledged: !!h.acknowledged,
      child_involved_in_planning: !!h.child_involved_in_planning,
      activity_description: h.activity_description ?? "",
      child_feedback_positive: !!h.child_feedback_positive,
      staff_supported: !!h.staff_supported,
      family_connection_facilitated: !!h.family_connection_facilitated,
      resources_provided: !!h.resources_provided,
      created_at: (h.created_at ?? today).toString(),
    }));

    // ── Festival Inclusion Records ────────────────────────────────────────
    const rawFestivalInclusions = (store.festivalInclusionRecords ?? []) as any[];
    const festival_inclusion_records: FestivalInclusionRecordInput[] = rawFestivalInclusions.map((f: any) => ({
      id: f.id ?? "",
      festival_date: (f.festival_date ?? today).toString(),
      festival_name: f.festival_name ?? "",
      faith_or_tradition: f.faith_or_tradition ?? "other",
      children_participated: Array.isArray(f.children_participated) ? f.children_participated : [],
      total_children_eligible: typeof f.total_children_eligible === "number" ? f.total_children_eligible : total_children,
      participation_rate_pct: typeof f.participation_rate_pct === "number" ? f.participation_rate_pct : 0,
      inclusive_planning: !!f.inclusive_planning,
      dietary_needs_accommodated: !!f.dietary_needs_accommodated,
      religious_sensitivity_observed: !!f.religious_sensitivity_observed,
      educational_element: !!f.educational_element,
      child_feedback_collected: !!f.child_feedback_collected,
      child_feedback_positive_count: typeof f.child_feedback_positive_count === "number" ? f.child_feedback_positive_count : 0,
      quality_rating: typeof f.quality_rating === "number" ? f.quality_rating : 3,
      created_at: (f.created_at ?? today).toString(),
    }));

    // ── Child-Led Activity Records ────────────────────────────────────────
    const rawChildLedActivities = (store.childLedActivityRecords ?? []) as any[];
    const child_led_activity_records: ChildLedActivityRecordInput[] = rawChildLedActivities.map((a: any) => ({
      id: a.id ?? "",
      child_id: a.child_id ?? "",
      activity_date: (a.activity_date ?? today).toString(),
      activity_type: a.activity_type ?? "other",
      title: a.title ?? "",
      description: a.description ?? "",
      child_initiated: !!a.child_initiated,
      staff_supported: !!a.staff_supported,
      peers_participated: !!a.peers_participated,
      peer_feedback_positive: !!a.peer_feedback_positive,
      child_confidence_improved: !!a.child_confidence_improved,
      linked_to_identity: !!a.linked_to_identity,
      duration_minutes: typeof a.duration_minutes === "number" ? a.duration_minutes : 30,
      child_satisfaction_rating: typeof a.child_satisfaction_rating === "number" ? a.child_satisfaction_rating : 3,
      created_at: (a.created_at ?? today).toString(),
    }));

    // ── Compute ───────────────────────────────────────────────────────────
    const result = computeCulturalEventsCelebrations({
      today,
      total_children,
      cultural_event_records,
      diversity_celebration_records,
      heritage_day_records,
      festival_inclusion_records,
      child_led_activity_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
