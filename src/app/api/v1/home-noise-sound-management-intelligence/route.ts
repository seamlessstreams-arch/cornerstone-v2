// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME NOISE & SOUND MANAGEMENT INTELLIGENCE API ROUTE
// GET /api/v1/home-noise-sound-management-intelligence
// Cross-domain composite: noiseMonitoringRecords + quietHoursRecords +
// sensoryEnvironmentRecords + soundInsulationRecords + childComfortRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeNoiseSoundManagement,
  type NoiseMonitoringRecordInput,
  type QuietHoursRecordInput,
  type SensoryEnvironmentRecordInput,
  type SoundInsulationRecordInput,
  type ChildComfortRecordInput,
} from "@/lib/engines/home-noise-sound-management-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawNoiseMonitoring = (store.noiseMonitoringRecords ?? []) as any[];
    const noise_monitoring_records: NoiseMonitoringRecordInput[] = rawNoiseMonitoring.map((r: any) => ({
      id: r.id ?? "",
      date: (r.date ?? today).toString(),
      time_of_day: r.time_of_day ?? "morning",
      location: r.location ?? "communal_area",
      decibel_reading: r.decibel_reading ?? 0,
      acceptable_level: !!r.acceptable_level,
      source_identified: !!r.source_identified,
      source_type: r.source_type ?? "other",
      action_taken: !!r.action_taken,
      action_description: r.action_description ?? "",
      staff_member: r.staff_member ?? "",
      monitoring_method: r.monitoring_method ?? "observation",
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawQuietHours = (store.quietHoursRecords ?? []) as any[];
    const quiet_hours_records: QuietHoursRecordInput[] = rawQuietHours.map((r: any) => ({
      id: r.id ?? "",
      date: (r.date ?? today).toString(),
      quiet_hours_start: r.quiet_hours_start ?? "21:00",
      quiet_hours_end: r.quiet_hours_end ?? "07:00",
      compliant: !!r.compliant,
      disruptions_count: r.disruptions_count ?? 0,
      disruption_type: r.disruption_type ?? "none",
      duration_of_disruption_minutes: r.duration_of_disruption_minutes ?? 0,
      children_affected_count: r.children_affected_count ?? 0,
      resolution_effective: !!r.resolution_effective,
      staff_responded_promptly: !!r.staff_responded_promptly,
      child_feedback_obtained: !!r.child_feedback_obtained,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawSensoryEnvironment = (store.sensoryEnvironmentRecords ?? []) as any[];
    const sensory_environment_records: SensoryEnvironmentRecordInput[] = rawSensoryEnvironment.map((r: any) => ({
      id: r.id ?? "",
      date: (r.date ?? today).toString(),
      child_id: r.child_id ?? "",
      adaptation_type: r.adaptation_type ?? "quiet_space",
      adaptation_in_place: !!r.adaptation_in_place,
      child_using_adaptation: !!r.child_using_adaptation,
      effectiveness_rating: r.effectiveness_rating ?? 3,
      child_feedback_positive: !!r.child_feedback_positive,
      reviewed_with_child: !!r.reviewed_with_child,
      linked_to_care_plan: !!r.linked_to_care_plan,
      professional_recommended: !!r.professional_recommended,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawSoundInsulation = (store.soundInsulationRecords ?? []) as any[];
    const sound_insulation_records: SoundInsulationRecordInput[] = rawSoundInsulation.map((r: any) => ({
      id: r.id ?? "",
      date: (r.date ?? today).toString(),
      location: r.location ?? "communal_area",
      insulation_type: r.insulation_type ?? "walls",
      condition: r.condition ?? "good",
      meets_standard: !!r.meets_standard,
      last_inspected: (r.last_inspected ?? today).toString(),
      maintenance_needed: !!r.maintenance_needed,
      maintenance_scheduled: !!r.maintenance_scheduled,
      maintenance_completed: !!r.maintenance_completed,
      impact_on_children: r.impact_on_children ?? "none",
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawChildComfort = (store.childComfortRecords ?? []) as any[];
    const child_comfort_records: ChildComfortRecordInput[] = rawChildComfort.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? today).toString(),
      comfort_level: r.comfort_level ?? "neutral",
      noise_sensitivity: r.noise_sensitivity ?? "moderate",
      sleep_disrupted_by_noise: !!r.sleep_disrupted_by_noise,
      specific_noise_concerns: Array.isArray(r.specific_noise_concerns) ? r.specific_noise_concerns : [],
      feels_heard_about_noise: !!r.feels_heard_about_noise,
      preferred_noise_level: r.preferred_noise_level ?? "moderate",
      staff_responsive_to_concerns: !!r.staff_responsive_to_concerns,
      adaptations_helpful: !!r.adaptations_helpful,
      overall_satisfaction: r.overall_satisfaction ?? 3,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeNoiseSoundManagement({
      today,
      total_children,
      noise_monitoring_records,
      quiet_hours_records,
      sensory_environment_records,
      sound_insulation_records,
      child_comfort_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
