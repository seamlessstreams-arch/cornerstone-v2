// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME SIBLING CONTACT & RELATIONSHIPS INTELLIGENCE API ROUTE
// GET /api/v1/home-sibling-contact-relationships-intelligence
// Cross-domain composite: siblingPlacementRecords + contactFacilitationRecords +
// relationshipAssessmentRecords + siblingEventRecords + childWishesRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeSiblingContactRelationships,
  type SiblingPlacementRecordInput,
  type ContactFacilitationRecordInput,
  type RelationshipAssessmentRecordInput,
  type SiblingEventRecordInput,
  type ChildWishesRecordInput,
} from "@/lib/engines/home-sibling-contact-relationships-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawPlacement = (store.siblingPlacementRecords ?? []) as any[];
    const sibling_placement_records: SiblingPlacementRecordInput[] = rawPlacement.map((p: any) => ({
      id: p.id ?? "",
      child_id: p.child_id ?? "",
      sibling_id: p.sibling_id ?? "",
      sibling_name: p.sibling_name ?? "",
      placement_together: !!p.placement_together,
      placement_considered: !!p.placement_considered,
      consideration_documented: !!p.consideration_documented,
      reason_for_separation: p.reason_for_separation ?? "",
      separation_justified: !!p.separation_justified,
      plan_to_reunify: !!p.plan_to_reunify,
      reunification_timeline: p.reunification_timeline ?? null,
      social_worker_consulted: !!p.social_worker_consulted,
      child_views_sought: !!p.child_views_sought,
      sibling_views_sought: !!p.sibling_views_sought,
      irm_consulted: !!p.irm_consulted,
      review_date: p.review_date ?? null,
      review_completed: !!p.review_completed,
      notes: p.notes ?? "",
      created_at: (p.created_at ?? today).toString(),
    }));

    const rawContact = (store.contactFacilitationRecords ?? []) as any[];
    const contact_facilitation_records: ContactFacilitationRecordInput[] = rawContact.map((c: any) => ({
      id: c.id ?? "",
      child_id: c.child_id ?? "",
      sibling_id: c.sibling_id ?? "",
      date: (c.date ?? today).toString(),
      contact_type: c.contact_type ?? "face_to_face",
      facilitated: !!c.facilitated,
      location: c.location ?? "",
      duration_minutes: c.duration_minutes ?? 0,
      quality_rating: c.quality_rating ?? 3,
      child_enjoyed: !!c.child_enjoyed,
      sibling_enjoyed: !!c.sibling_enjoyed,
      any_concerns: !!c.any_concerns,
      concern_details: c.concern_details ?? "",
      staff_supervised: !!c.staff_supervised,
      transport_provided: !!c.transport_provided,
      contact_plan_followed: !!c.contact_plan_followed,
      cancelled: !!c.cancelled,
      cancellation_reason: c.cancellation_reason ?? "",
      rescheduled: !!c.rescheduled,
      notes: c.notes ?? "",
      created_at: (c.created_at ?? today).toString(),
    }));

    const rawAssessment = (store.relationshipAssessmentRecords ?? []) as any[];
    const relationship_assessment_records: RelationshipAssessmentRecordInput[] = rawAssessment.map((a: any) => ({
      id: a.id ?? "",
      child_id: a.child_id ?? "",
      sibling_id: a.sibling_id ?? "",
      assessment_date: (a.assessment_date ?? today).toString(),
      assessor: a.assessor ?? "",
      relationship_quality: a.relationship_quality ?? "fair",
      attachment_strength: a.attachment_strength ?? "not_assessed",
      communication_quality: a.communication_quality ?? "fair",
      conflict_frequency: a.conflict_frequency ?? "occasional",
      positive_interactions_observed: !!a.positive_interactions_observed,
      shared_interests_identified: !!a.shared_interests_identified,
      protective_factors_present: !!a.protective_factors_present,
      risk_factors_present: !!a.risk_factors_present,
      risk_factor_details: a.risk_factor_details ?? "",
      therapeutic_support_recommended: !!a.therapeutic_support_recommended,
      therapeutic_support_in_place: !!a.therapeutic_support_in_place,
      improvement_plan_created: !!a.improvement_plan_created,
      next_review_date: a.next_review_date ?? null,
      child_participated: !!a.child_participated,
      sibling_participated: !!a.sibling_participated,
      notes: a.notes ?? "",
      created_at: (a.created_at ?? today).toString(),
    }));

    const rawEvents = (store.siblingEventRecords ?? []) as any[];
    const sibling_event_records: SiblingEventRecordInput[] = rawEvents.map((e: any) => ({
      id: e.id ?? "",
      event_name: e.event_name ?? "",
      event_type: e.event_type ?? "activity_day",
      date: (e.date ?? today).toString(),
      children_invited: Array.isArray(e.children_invited) ? e.children_invited : [],
      children_attended: Array.isArray(e.children_attended) ? e.children_attended : [],
      siblings_present: !!e.siblings_present,
      event_quality_rating: e.event_quality_rating ?? 3,
      child_feedback_positive: !!e.child_feedback_positive,
      sibling_feedback_positive: !!e.sibling_feedback_positive,
      photos_taken: !!e.photos_taken,
      memory_book_updated: !!e.memory_book_updated,
      staff_facilitated: !!e.staff_facilitated,
      any_incidents: !!e.any_incidents,
      incident_details: e.incident_details ?? "",
      planned_in_advance: !!e.planned_in_advance,
      child_involved_in_planning: !!e.child_involved_in_planning,
      notes: e.notes ?? "",
      created_at: (e.created_at ?? today).toString(),
    }));

    const rawWishes = (store.childWishesRecords ?? []) as any[];
    const child_wishes_records: ChildWishesRecordInput[] = rawWishes.map((w: any) => ({
      id: w.id ?? "",
      child_id: w.child_id ?? "",
      date: (w.date ?? today).toString(),
      wish_category: w.wish_category ?? "other",
      wish_details: w.wish_details ?? "",
      child_voice_captured: !!w.child_voice_captured,
      age_appropriate_method: !!w.age_appropriate_method,
      wish_acknowledged: !!w.wish_acknowledged,
      wish_acted_upon: !!w.wish_acted_upon,
      outcome_recorded: !!w.outcome_recorded,
      outcome_shared_with_child: !!w.outcome_shared_with_child,
      child_satisfied_with_outcome: !!w.child_satisfied_with_outcome,
      social_worker_informed: !!w.social_worker_informed,
      recorded_in_care_plan: !!w.recorded_in_care_plan,
      advocate_involved: !!w.advocate_involved,
      review_date: w.review_date ?? null,
      notes: w.notes ?? "",
      created_at: (w.created_at ?? today).toString(),
    }));

    const result = computeSiblingContactRelationships({
      today,
      total_children,
      sibling_placement_records,
      contact_facilitation_records,
      relationship_assessment_records,
      sibling_event_records,
      child_wishes_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
