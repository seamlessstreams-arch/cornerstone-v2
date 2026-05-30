export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeworkEnvironmentStudySpace,
  type StudySpaceRecordInput,
  type NoiseEnvironmentRecordInput,
  type EquipmentRecordInput,
  type LightingRecordInput,
  type ChildSatisfactionRecordInput,
} from "@/lib/engines/home-homework-environment-study-space-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawStudySpaces = (store.studySpaceRecords ?? []) as any[];
    const study_space_records: StudySpaceRecordInput[] = rawStudySpaces.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      assessment_date: (r.assessment_date ?? today).toString(),
      dedicated_space_available: r.dedicated_space_available ?? false,
      space_type: r.space_type ?? "bedroom_desk",
      space_adequate_size: r.space_adequate_size ?? false,
      space_clean_tidy: r.space_clean_tidy ?? false,
      space_free_from_distractions: r.space_free_from_distractions ?? false,
      private_when_needed: r.private_when_needed ?? false,
      personalised_for_child: r.personalised_for_child ?? false,
      temperature_comfortable: r.temperature_comfortable ?? false,
      ventilation_adequate: r.ventilation_adequate ?? false,
      accessibility_suitable: r.accessibility_suitable ?? false,
      storage_for_materials: r.storage_for_materials ?? false,
      assessed_by: r.assessed_by ?? "",
      issues_identified: r.issues_identified ?? [],
      issues_resolved: r.issues_resolved ?? false,
      resolution_date: r.resolution_date ?? null,
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawNoiseEnvironments = (store.noiseEnvironmentRecords ?? []) as any[];
    const noise_environment_records: NoiseEnvironmentRecordInput[] = rawNoiseEnvironments.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      assessment_date: (r.assessment_date ?? today).toString(),
      noise_level_acceptable: r.noise_level_acceptable ?? false,
      noise_source: r.noise_source ?? "none",
      noise_mitigation_in_place: r.noise_mitigation_in_place ?? false,
      mitigation_type: r.mitigation_type ?? null,
      mitigation_effective: r.mitigation_effective ?? false,
      time_of_assessment: r.time_of_assessment ?? "afternoon",
      child_reported_disturbance: r.child_reported_disturbance ?? false,
      impact_on_concentration: r.impact_on_concentration ?? "none",
      staff_action_taken: r.staff_action_taken ?? false,
      action_description: r.action_description ?? null,
      follow_up_needed: r.follow_up_needed ?? false,
      follow_up_completed: r.follow_up_completed ?? false,
      assessed_by: r.assessed_by ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawEquipment = (store.equipmentRecords ?? []) as any[];
    const equipment_records: EquipmentRecordInput[] = rawEquipment.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      assessment_date: (r.assessment_date ?? today).toString(),
      desk_available: r.desk_available ?? false,
      chair_suitable: r.chair_suitable ?? false,
      computer_laptop_available: r.computer_laptop_available ?? false,
      internet_access: r.internet_access ?? false,
      printer_access: r.printer_access ?? false,
      stationery_available: r.stationery_available ?? false,
      textbooks_available: r.textbooks_available ?? false,
      calculator_available: r.calculator_available ?? false,
      art_supplies_available: r.art_supplies_available ?? false,
      specialist_equipment_needed: r.specialist_equipment_needed ?? false,
      specialist_equipment_provided: r.specialist_equipment_provided ?? false,
      equipment_condition: r.equipment_condition ?? "good",
      equipment_age_appropriate: r.equipment_age_appropriate ?? false,
      replacement_needed: r.replacement_needed ?? false,
      replacement_actioned: r.replacement_actioned ?? false,
      assessed_by: r.assessed_by ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawLighting = (store.lightingRecords ?? []) as any[];
    const lighting_records: LightingRecordInput[] = rawLighting.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      assessment_date: (r.assessment_date ?? today).toString(),
      natural_light_adequate: r.natural_light_adequate ?? false,
      artificial_light_adequate: r.artificial_light_adequate ?? false,
      desk_lamp_available: r.desk_lamp_available ?? false,
      light_adjustable: r.light_adjustable ?? false,
      glare_free: r.glare_free ?? false,
      light_level_measured: r.light_level_measured ?? false,
      light_level_lux: r.light_level_lux ?? null,
      meets_recommended_standard: r.meets_recommended_standard ?? false,
      issues_identified: r.issues_identified ?? [],
      issues_resolved: r.issues_resolved ?? false,
      resolution_date: r.resolution_date ?? null,
      assessed_by: r.assessed_by ?? "",
      notes: r.notes ?? null,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawSatisfaction = (store.childSatisfactionRecords ?? []) as any[];
    const child_satisfaction_records: ChildSatisfactionRecordInput[] = rawSatisfaction.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      survey_date: (r.survey_date ?? today).toString(),
      overall_satisfaction: r.overall_satisfaction ?? 3,
      space_satisfaction: r.space_satisfaction ?? 3,
      noise_satisfaction: r.noise_satisfaction ?? 3,
      equipment_satisfaction: r.equipment_satisfaction ?? 3,
      lighting_satisfaction: r.lighting_satisfaction ?? 3,
      feels_able_to_concentrate: r.feels_able_to_concentrate ?? false,
      feels_supported_in_study: r.feels_supported_in_study ?? false,
      would_change_anything: r.would_change_anything ?? false,
      change_suggestions: r.change_suggestions ?? null,
      prefers_different_location: r.prefers_different_location ?? false,
      preferred_location: r.preferred_location ?? null,
      study_hours_per_week: r.study_hours_per_week ?? 0,
      homework_completion_rate_self_reported: r.homework_completion_rate_self_reported ?? 0,
      child_comments: r.child_comments ?? null,
      collected_by: r.collected_by ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeHomeworkEnvironmentStudySpace({
      today,
      total_children,
      study_space_records,
      noise_environment_records,
      equipment_records,
      lighting_records,
      child_satisfaction_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
