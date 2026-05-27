// ══════════════════════════════════════════════════════════════════════════════
// API — HOME SAFEGUARDING DEPTH INTELLIGENCE
// Maps in-memory store → engine input → JSON response.
// CHR 2015 Reg 12/13.
// ══════════════════════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeSafeguardingDepth,
  type BodyMapInput,
  type DisclosureInput,
  type EscalationInput,
  type LADOReferralInput,
  type SafeguardingSupervisionInput,
  type SafeTouchProtocolInput,
  type SubstanceScreeningInput,
} from "@/lib/engines/home-safeguarding-depth-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  const body_maps: BodyMapInput[] = (store.bodyMap as any[]).map((b: any) => ({
    id: b.id,
    child_id: b.child_id,
    date: (b.date ?? "").toString().slice(0, 10),
    areas_documented: b.areas_documented ?? b.areas?.length ?? 0,
    photo_evidence: !!(b.photo_evidence),
    staff_signed: !!(b.staff_signed),
    manager_reviewed: !!(b.manager_reviewed),
    child_explanation_recorded: !!(b.child_explanation),
  }));

  const disclosures_input: DisclosureInput[] = (store.disclosures as any[]).map((d: any) => ({
    id: d.id,
    child_id: d.child_id,
    date: (d.date ?? "").toString().slice(0, 10),
    response_within_1h: !!(d.response_within_1h),
    escalated_appropriately: !!(d.escalated_appropriately),
    child_informed_of_process: !!(d.child_informed_of_process),
    written_up_within_24h: !!(d.written_up_within_24h),
    outcome_recorded: !!(d.outcome_recorded),
  }));

  const escalations_input: EscalationInput[] = (store.escalations as any[]).map((e: any) => ({
    id: e.id,
    date: (e.date ?? "").toString().slice(0, 10),
    multi_agency_engaged: !!(e.multi_agency_engaged),
    resolution_date: (e.resolution_date ?? "").toString().slice(0, 10),
    outcome_documented: !!(e.outcome_documented),
    learning_captured: !!(e.learning_captured),
  }));

  const lado_referrals: LADOReferralInput[] = (store.ladoReferrals as any[]).map((l: any) => ({
    id: l.id,
    date: (l.date ?? "").toString().slice(0, 10),
    referred_within_1_business_day: !!(l.referred_within_1_business_day),
    outcome_recorded: !!(l.outcome_recorded),
    staff_support_documented: !!(l.staff_support_documented),
    learning_shared: !!(l.learning_shared),
    review_date: (l.review_date ?? "").toString().slice(0, 10),
  }));

  const safeguarding_supervisions: SafeguardingSupervisionInput[] = (store.safeguardingSupervisionRecords as any[]).map((s: any) => ({
    id: s.id,
    staff_id: s.staff_id,
    date: (s.date ?? "").toString().slice(0, 10),
    cases_discussed: s.cases_discussed ?? s.cases?.length ?? 0,
    actions_set: s.actions_set ?? s.actions?.length ?? 0,
    actions_completed: s.actions_completed ?? 0,
    reflective_practice: !!(s.reflective_practice),
  }));

  const safe_touch_protocols: SafeTouchProtocolInput[] = (store.safeTouchProtocolRecords as any[]).map((p: any) => ({
    id: p.id,
    child_id: p.child_id,
    consent_obtained: !!(p.consent_obtained),
    protocol_documented: !!(p.protocol_documented),
    child_voice_captured: !!(p.child_voice_captured ?? p.child_voice),
    review_date: (p.review_date ?? "").toString().slice(0, 10),
  }));

  const substance_screenings: SubstanceScreeningInput[] = (store.substanceScreenings as any[]).map((s: any) => ({
    id: s.id,
    date: (s.date ?? "").toString().slice(0, 10),
    child_id: s.child_id,
    result: s.result ?? "inconclusive",
    follow_up_actioned: !!(s.follow_up_actioned),
    child_supported: !!(s.child_supported),
  }));

  const result = computeHomeSafeguardingDepth({
    today,
    body_maps,
    disclosures: disclosures_input,
    escalations: escalations_input,
    lado_referrals,
    safeguarding_supervisions,
    safe_touch_protocols,
    substance_screenings,
    total_children: store.children?.length ?? 0,
    total_staff: store.staff?.length ?? 0,
  });

  return NextResponse.json({ data: result });
}
