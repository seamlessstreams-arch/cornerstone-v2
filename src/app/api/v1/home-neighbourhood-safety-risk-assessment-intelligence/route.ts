// ==============================================================================
// CORNERSTONE -- HOME NEIGHBOURHOOD SAFETY & RISK ASSESSMENT INTELLIGENCE API ROUTE
// GET /api/v1/home-neighbourhood-safety-risk-assessment-intelligence
// Cross-domain composite: riskAssessmentRecords + safetyMappingRecords +
// hazardRecords + routeSafetyRecords + communityPartnershipRecords
// ==============================================================================

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeNeighbourhoodSafetyRiskAssessment,
  type RiskAssessmentRecordInput,
  type SafetyMappingRecordInput,
  type HazardRecordInput,
  type RouteSafetyRecordInput,
  type CommunityPartnershipRecordInput,
} from "@/lib/engines/home-neighbourhood-safety-risk-assessment-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    const yp = (store.youngPeople ?? []) as any[];
    const total_children = yp.filter((c: any) => c.status === "current").length;

    const rawRiskAssessments = (store.riskAssessmentRecords ?? []) as any[];
    const risk_assessment_records: RiskAssessmentRecordInput[] = rawRiskAssessments.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      assessment_type: r.assessment_type ?? "other",
      date: (r.date ?? today).toString(),
      assessor: r.assessor ?? "",
      risk_level: r.risk_level ?? "medium",
      areas_covered: Array.isArray(r.areas_covered) ? r.areas_covered : [],
      local_crime_reviewed: !!r.local_crime_reviewed,
      antisocial_behaviour_reviewed: !!r.antisocial_behaviour_reviewed,
      drug_activity_reviewed: !!r.drug_activity_reviewed,
      exploitation_risk_reviewed: !!r.exploitation_risk_reviewed,
      gang_activity_reviewed: !!r.gang_activity_reviewed,
      traffic_risk_reviewed: !!r.traffic_risk_reviewed,
      environmental_risk_reviewed: !!r.environmental_risk_reviewed,
      mitigations_documented: !!r.mitigations_documented,
      mitigations_implemented: !!r.mitigations_implemented,
      review_due_date: r.review_due_date ?? null,
      overdue: !!r.overdue,
      child_consulted: !!r.child_consulted,
      outcome_shared_with_child: !!r.outcome_shared_with_child,
      approved_by_manager: !!r.approved_by_manager,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawSafetyMappings = (store.safetyMappingRecords ?? []) as any[];
    const safety_mapping_records: SafetyMappingRecordInput[] = rawSafetyMappings.map((r: any) => ({
      id: r.id ?? "",
      area_name: r.area_name ?? "",
      date: (r.date ?? today).toString(),
      mapping_type: r.mapping_type ?? "other",
      safe_zones_identified: r.safe_zones_identified ?? 0,
      risk_zones_identified: r.risk_zones_identified ?? 0,
      child_friendly_spaces: r.child_friendly_spaces ?? 0,
      cctv_coverage_noted: !!r.cctv_coverage_noted,
      lighting_assessed: !!r.lighting_assessed,
      lighting_adequate: !!r.lighting_adequate,
      public_transport_access: !!r.public_transport_access,
      nearest_emergency_services_distance_km: r.nearest_emergency_services_distance_km ?? 0,
      child_involvement: !!r.child_involvement,
      staff_walked_area: !!r.staff_walked_area,
      last_updated: (r.last_updated ?? today).toString(),
      update_frequency_met: !!r.update_frequency_met,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawHazards = (store.hazardRecords ?? []) as any[];
    const hazard_records: HazardRecordInput[] = rawHazards.map((r: any) => ({
      id: r.id ?? "",
      hazard_type: r.hazard_type ?? "other",
      location_description: r.location_description ?? "",
      date_identified: (r.date_identified ?? today).toString(),
      severity: r.severity ?? "medium",
      reported_to_authority: !!r.reported_to_authority,
      authority_name: r.authority_name ?? "",
      date_reported: r.date_reported ?? null,
      mitigation_in_place: !!r.mitigation_in_place,
      mitigation_description: r.mitigation_description ?? "",
      children_informed: !!r.children_informed,
      resolved: !!r.resolved,
      date_resolved: r.date_resolved ?? null,
      days_to_resolve: r.days_to_resolve ?? 0,
      recurrent: !!r.recurrent,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawRouteSafety = (store.routeSafetyRecords ?? []) as any[];
    const route_safety_records: RouteSafetyRecordInput[] = rawRouteSafety.map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      route_name: r.route_name ?? "",
      route_type: r.route_type ?? "other",
      date_assessed: (r.date_assessed ?? today).toString(),
      assessed_by: r.assessed_by ?? "",
      risk_level: r.risk_level ?? "medium",
      safe_crossing_points: !!r.safe_crossing_points,
      adequate_lighting: !!r.adequate_lighting,
      cctv_present: !!r.cctv_present,
      traffic_risk_level: r.traffic_risk_level ?? "medium",
      pedestrian_access: !!r.pedestrian_access,
      public_transport_available: !!r.public_transport_available,
      known_hazards: Array.isArray(r.known_hazards) ? r.known_hazards : [],
      mitigations_in_place: !!r.mitigations_in_place,
      alternative_route_available: !!r.alternative_route_available,
      child_walked_route: !!r.child_walked_route,
      child_confident_on_route: !!r.child_confident_on_route,
      review_due_date: r.review_due_date ?? null,
      overdue: !!r.overdue,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const rawCommunityPartnerships = (store.communityPartnershipRecords ?? []) as any[];
    const community_partnership_records: CommunityPartnershipRecordInput[] = rawCommunityPartnerships.map((r: any) => ({
      id: r.id ?? "",
      partner_name: r.partner_name ?? "",
      partner_type: r.partner_type ?? "other",
      relationship_status: r.relationship_status ?? "developing",
      date_established: (r.date_established ?? today).toString(),
      last_contact_date: (r.last_contact_date ?? today).toString(),
      contact_frequency: r.contact_frequency ?? "ad_hoc",
      contact_frequency_met: !!r.contact_frequency_met,
      information_sharing_agreement: !!r.information_sharing_agreement,
      joint_risk_assessments: !!r.joint_risk_assessments,
      safeguarding_protocols_agreed: !!r.safeguarding_protocols_agreed,
      partnership_effectiveness: r.partnership_effectiveness ?? 3,
      children_benefit_documented: !!r.children_benefit_documented,
      key_contact_named: !!r.key_contact_named,
      notes: r.notes ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeNeighbourhoodSafetyRiskAssessment({
      today,
      total_children,
      risk_assessment_records,
      safety_mapping_records,
      hazard_records,
      route_safety_records,
      community_partnership_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
