// ==============================================================================
// CARA -- HOME TECHNOLOGY & DIGITAL INCLUSION INTELLIGENCE API ROUTE
// GET /api/v1/home-technology-digital-inclusion-intelligence
// Cross-domain composite: deviceAccessRecords + digitalSkillsRecords +
// assistiveTechnologyRecords + internetSafetyRecords + technologyLearningRecords
// ==============================================================================

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeTechnologyDigitalInclusion,
  type DeviceAccessRecordInput,
  type DigitalSkillsRecordInput,
  type AssistiveTechnologyRecordInput,
  type InternetSafetyRecordInput,
  type TechnologyLearningRecordInput,
} from "@/lib/engines/home-technology-digital-inclusion-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawDeviceAccess = (store.deviceAccessRecords ?? []) as any[];
    const device_access_records: DeviceAccessRecordInput[] = rawDeviceAccess.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      device_type: r.device_type ?? "other",
      ownership: r.ownership ?? "other",
      condition: r.condition ?? "fair",
      internet_enabled: !!r.internet_enabled,
      age_appropriate_filters: !!r.age_appropriate_filters,
      accessible_when_needed: !!r.accessible_when_needed,
      private_use_available: !!r.private_use_available,
      date: (r.date ?? today).toString(),
      child_satisfaction: r.child_satisfaction ?? 3,
      issues_reported: Array.isArray(r.issues_reported) ? r.issues_reported : [],
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawDigitalSkills = (store.digitalSkillsRecords ?? []) as any[];
    const digital_skills_records: DigitalSkillsRecordInput[] = rawDigitalSkills.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      skill_area: r.skill_area ?? "other",
      assessment_date: (r.assessment_date ?? today).toString(),
      baseline_level: r.baseline_level ?? "none",
      current_level: r.current_level ?? "none",
      plan_in_place: !!r.plan_in_place,
      sessions_planned: r.sessions_planned ?? 0,
      sessions_completed: r.sessions_completed ?? 0,
      progress_evidenced: !!r.progress_evidenced,
      child_engaged: !!r.child_engaged,
      staff_supported: !!r.staff_supported,
      child_confidence_rating: r.child_confidence_rating ?? 3,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawAssistiveTechnology = (store.assistiveTechnologyRecords ?? []) as any[];
    const assistive_technology_records: AssistiveTechnologyRecordInput[] = rawAssistiveTechnology.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      need_identified: !!r.need_identified,
      need_type: r.need_type ?? "none",
      technology_type: r.technology_type ?? "",
      provided: !!r.provided,
      date_provided: r.date_provided ?? null,
      training_given: !!r.training_given,
      staff_trained: !!r.staff_trained,
      effectiveness_rating: r.effectiveness_rating ?? 3,
      child_uses_independently: !!r.child_uses_independently,
      review_date: r.review_date ?? null,
      barriers_encountered: Array.isArray(r.barriers_encountered) ? r.barriers_encountered : [],
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawInternetSafety = (store.internetSafetyRecords ?? []) as any[];
    const internet_safety_records: InternetSafetyRecordInput[] = rawInternetSafety.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      session_date: (r.session_date ?? today).toString(),
      topic: r.topic ?? "other",
      session_type: r.session_type ?? "other",
      completed: !!r.completed,
      child_engaged: !!r.child_engaged,
      child_demonstrated_understanding: !!r.child_demonstrated_understanding,
      follow_up_needed: !!r.follow_up_needed,
      follow_up_completed: !!r.follow_up_completed,
      child_confidence_rating: r.child_confidence_rating ?? 3,
      staff_delivered: !!r.staff_delivered,
      external_provider: r.external_provider ?? null,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawTechnologyLearning = (store.technologyLearningRecords ?? []) as any[];
    const technology_learning_records: TechnologyLearningRecordInput[] = rawTechnologyLearning.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      learning_context: r.learning_context ?? "other",
      technology_used: r.technology_used ?? "",
      date: (r.date ?? today).toString(),
      effective: !!r.effective,
      child_supported: !!r.child_supported,
      staff_facilitated: !!r.staff_facilitated,
      educational_outcome_documented: !!r.educational_outcome_documented,
      child_satisfaction: r.child_satisfaction ?? 3,
      barriers_encountered: Array.isArray(r.barriers_encountered) ? r.barriers_encountered : [],
      accessibility_needs_met: !!r.accessibility_needs_met,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeTechnologyDigitalInclusion({
      today,
      total_children,
      device_access_records,
      digital_skills_records,
      assistive_technology_records,
      internet_safety_records,
      technology_learning_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
