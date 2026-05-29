// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME FURNITURE & ROOM PERSONALISATION INTELLIGENCE API ROUTE
// GET /api/v1/home-furniture-room-personalisation-intelligence
// Cross-domain composite: furnitureAdequacyRecords + roomPersonalisationRecords +
// childChoiceRecords + comfortAssessmentRecords + dignitySpaceRecords
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeFurnitureRoomPersonalisation,
  type FurnitureAdequacyInput,
  type RoomPersonalisationInput,
  type ChildChoiceInput,
  type ComfortAssessmentInput,
  type DignitySpaceInput,
} from "@/lib/engines/home-furniture-room-personalisation-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawFurniture = (store.furnitureAdequacyRecords ?? []) as any[];
    const furniture_adequacy_records: FurnitureAdequacyInput[] = rawFurniture.map((f: any) => ({
      id: f.id ?? "",
      child_id: f.child_id ?? "",
      room_id: f.room_id ?? "",
      assessment_date: (f.assessment_date ?? today).toString(),
      assessor_name: f.assessor_name ?? "",
      bed_adequate: !!f.bed_adequate,
      wardrobe_adequate: !!f.wardrobe_adequate,
      desk_adequate: !!f.desk_adequate,
      shelving_adequate: !!f.shelving_adequate,
      seating_adequate: !!f.seating_adequate,
      storage_adequate: !!f.storage_adequate,
      lighting_adequate: !!f.lighting_adequate,
      curtains_blinds_adequate: !!f.curtains_blinds_adequate,
      floor_covering_adequate: !!f.floor_covering_adequate,
      furniture_condition: f.furniture_condition ?? "fair",
      age_appropriate: !!f.age_appropriate,
      size_appropriate: !!f.size_appropriate,
      replacement_needed: !!f.replacement_needed,
      replacement_actioned: !!f.replacement_actioned,
      child_consulted: !!f.child_consulted,
      last_inspection_date: f.last_inspection_date ?? null,
      inspection_overdue: !!f.inspection_overdue,
      created_at: (f.created_at ?? today).toString(),
    }));

    const rawPersonalisation = (store.roomPersonalisationRecords ?? []) as any[];
    const room_personalisation_records: RoomPersonalisationInput[] = rawPersonalisation.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      room_id: r.room_id ?? "",
      assessment_date: (r.assessment_date ?? today).toString(),
      has_personal_photos: !!r.has_personal_photos,
      has_chosen_bedding: !!r.has_chosen_bedding,
      has_chosen_wall_decor: !!r.has_chosen_wall_decor,
      has_personal_belongings_displayed: !!r.has_personal_belongings_displayed,
      has_chosen_colour_scheme: !!r.has_chosen_colour_scheme,
      has_name_on_door: !!r.has_name_on_door,
      has_lockable_storage: !!r.has_lockable_storage,
      has_notice_board: !!r.has_notice_board,
      personalisation_items_count: r.personalisation_items_count ?? 0,
      personalisation_budget_provided: !!r.personalisation_budget_provided,
      budget_amount_approved: r.budget_amount_approved ?? 0,
      budget_amount_spent: r.budget_amount_spent ?? 0,
      room_reflects_identity: !!r.room_reflects_identity,
      child_satisfied_with_room: !!r.child_satisfied_with_room,
      review_date: r.review_date ?? null,
      review_overdue: !!r.review_overdue,
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawChoices = (store.childChoiceRecords ?? []) as any[];
    const child_choice_records: ChildChoiceInput[] = rawChoices.map((c: any) => ({
      id: c.id ?? "",
      child_id: c.child_id ?? "",
      choice_type: c.choice_type ?? "decor",
      description: c.description ?? "",
      date_requested: (c.date_requested ?? today).toString(),
      date_fulfilled: c.date_fulfilled ?? null,
      fulfilled: !!c.fulfilled,
      child_involved_in_selection: !!c.child_involved_in_selection,
      child_satisfied_with_outcome: !!c.child_satisfied_with_outcome,
      cost_approved: c.cost_approved !== false,
      reason_not_fulfilled: c.reason_not_fulfilled ?? null,
      staff_supported: !!c.staff_supported,
      created_at: (c.created_at ?? today).toString(),
    }));

    const rawComfort = (store.comfortAssessmentRecords ?? []) as any[];
    const comfort_assessment_records: ComfortAssessmentInput[] = rawComfort.map((c: any) => ({
      id: c.id ?? "",
      child_id: c.child_id ?? "",
      room_id: c.room_id ?? "",
      assessment_date: (c.assessment_date ?? today).toString(),
      temperature_comfortable: !!c.temperature_comfortable,
      noise_level_acceptable: !!c.noise_level_acceptable,
      privacy_adequate: !!c.privacy_adequate,
      natural_light_adequate: !!c.natural_light_adequate,
      ventilation_adequate: !!c.ventilation_adequate,
      mattress_comfortable: !!c.mattress_comfortable,
      room_clean: !!c.room_clean,
      room_tidy: !!c.room_tidy,
      feels_safe_in_room: !!c.feels_safe_in_room,
      overall_comfort_rating: c.overall_comfort_rating ?? 3,
      child_reported: !!c.child_reported,
      issues_identified: c.issues_identified ?? 0,
      issues_resolved: c.issues_resolved ?? 0,
      created_at: (c.created_at ?? today).toString(),
    }));

    const rawDignity = (store.dignitySpaceRecords ?? []) as any[];
    const dignity_space_records: DignitySpaceInput[] = rawDignity.map((d: any) => ({
      id: d.id ?? "",
      child_id: d.child_id ?? "",
      room_id: d.room_id ?? "",
      assessment_date: (d.assessment_date ?? today).toString(),
      has_working_lock: !!d.has_working_lock,
      knock_before_entry_observed: !!d.knock_before_entry_observed,
      personal_space_respected: !!d.personal_space_respected,
      belongings_not_searched_without_consent: !!d.belongings_not_searched_without_consent,
      room_not_used_as_punishment: !!d.room_not_used_as_punishment,
      can_spend_time_alone: !!d.can_spend_time_alone,
      has_adequate_privacy: !!d.has_adequate_privacy,
      dignity_maintained_during_checks: !!d.dignity_maintained_during_checks,
      child_feels_room_is_theirs: !!d.child_feels_room_is_theirs,
      staff_awareness_of_dignity: !!d.staff_awareness_of_dignity,
      dignity_concern_raised: !!d.dignity_concern_raised,
      dignity_concern_resolved: !!d.dignity_concern_resolved,
      created_at: (d.created_at ?? today).toString(),
    }));

    const result = computeFurnitureRoomPersonalisation({
      today,
      total_children,
      furniture_adequacy_records,
      room_personalisation_records,
      child_choice_records,
      comfort_assessment_records,
      dignity_space_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
