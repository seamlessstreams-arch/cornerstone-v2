// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME DBS RENEWAL & STAFF VETTING INTELLIGENCE API ROUTE
// GET /api/v1/home-dbs-renewal-staff-vetting-intelligence
// Synthesises DBS check records, enhanced DBS records, overseas police checks,
// barred list verification, and reference verification to produce an overall
// vetting compliance score.
// CHR 2015 Reg 32 (fitness of workers), Reg 33 (employment of staff).
// SCCIF: "Safety" — safer recruitment and staff vetting.
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeDbsRenewalStaffVetting,
  type DbsCheckRecordInput,
  type EnhancedDbsRecordInput,
  type OverseasCheckRecordInput,
  type BarredListRecordInput,
  type ReferenceVerificationRecordInput,
} from "@/lib/engines/home-dbs-renewal-staff-vetting-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    // ── Staff count (STAFF-focused engine — uses store.staff) ─────────
    const total_staff = ((store.staff as any[]) || []).length;

    // ── DBS Check Records ────────────────────────────────────────────
    const rawDbs = (store.dbsCheckRecords ?? []) as any[];
    const dbs_check_records: DbsCheckRecordInput[] = rawDbs.map((r: any) => ({
      id: r.id ?? "",
      staff_id: r.staff_id ?? "",
      status: r.status ?? "not_started",
      check_date: r.check_date ?? r.date ?? null,
      expiry_date: r.expiry_date ?? null,
      certificate_number: r.certificate_number ?? r.cert_number ?? "",
      is_valid: r.is_valid !== false,
      on_update_service: !!r.on_update_service,
      disclosures_found: !!r.disclosures_found,
      risk_assessment_completed: !!r.risk_assessment_completed,
      certificate_verified: !!r.certificate_verified,
      renewal_initiated_date: r.renewal_initiated_date ?? null,
      processed_within_timeframe: r.processed_within_timeframe !== false,
      created_at: (r.created_at ?? today).toString(),
    }));

    // ── Enhanced DBS Records ─────────────────────────────────────────
    const rawEnhanced = (store.enhancedDbsRecords ?? []) as any[];
    const enhanced_dbs_records: EnhancedDbsRecordInput[] = rawEnhanced.map((r: any) => ({
      id: r.id ?? "",
      staff_id: r.staff_id ?? "",
      status: r.status ?? "not_started",
      check_date: r.check_date ?? r.date ?? null,
      expiry_date: r.expiry_date ?? null,
      is_enhanced: r.is_enhanced !== false,
      includes_barred_list_check: !!r.includes_barred_list_check,
      is_valid: r.is_valid !== false,
      certificate_verified: !!r.certificate_verified,
      on_update_service: !!r.on_update_service,
      last_update_check_date: r.last_update_check_date ?? null,
      update_check_clear: !!r.update_check_clear,
      role_type: r.role_type ?? "regulated_activity",
      created_at: (r.created_at ?? today).toString(),
    }));

    // ── Overseas Police Check Records ────────────────────────────────
    const rawOverseas = (store.overseasCheckRecords ?? []) as any[];
    const overseas_check_records: OverseasCheckRecordInput[] = rawOverseas.map((r: any) => ({
      id: r.id ?? "",
      staff_id: r.staff_id ?? "",
      country: r.country ?? "",
      status: r.status ?? "not_started",
      received_date: r.received_date ?? r.date ?? null,
      is_clear: r.is_clear !== false,
      risk_assessment_completed: !!r.risk_assessment_completed,
      verified: !!r.verified,
      letter_of_good_standing: !!r.letter_of_good_standing,
      is_current: r.is_current !== false,
      created_at: (r.created_at ?? today).toString(),
    }));

    // ── Barred List Records ──────────────────────────────────────────
    const rawBarred = (store.barredListRecords ?? []) as any[];
    const barred_list_records: BarredListRecordInput[] = rawBarred.map((r: any) => ({
      id: r.id ?? "",
      staff_id: r.staff_id ?? "",
      status: r.status ?? "not_started",
      check_date: r.check_date ?? r.date ?? null,
      is_clear: r.is_clear !== false,
      children_list_checked: !!r.children_list_checked,
      adults_list_checked: !!r.adults_list_checked,
      verified: !!r.verified,
      is_current: r.is_current !== false,
      signed_off_by: r.signed_off_by ?? "",
      created_at: (r.created_at ?? today).toString(),
    }));

    // ── Reference Verification Records ───────────────────────────────
    const rawRefs = (store.referenceVerificationRecords ?? []) as any[];
    const reference_verification_records: ReferenceVerificationRecordInput[] = rawRefs.map((r: any) => ({
      id: r.id ?? "",
      staff_id: r.staff_id ?? "",
      status: r.status ?? "not_started",
      reference_type: r.reference_type ?? r.type ?? "employment",
      received_date: r.received_date ?? r.date ?? null,
      verified: !!r.verified,
      is_satisfactory: r.is_satisfactory !== false,
      concerns_raised: !!r.concerns_raised,
      concerns_followed_up: !!r.concerns_followed_up,
      gaps_explored: !!r.gaps_explored,
      covers_child_suitability: !!r.covers_child_suitability,
      obtained_before_start: !!r.obtained_before_start,
      direct_contact_made: !!r.direct_contact_made,
      created_at: (r.created_at ?? today).toString(),
    }));

    const result = computeDbsRenewalStaffVetting({
      today,
      total_staff,
      dbs_check_records,
      enhanced_dbs_records,
      overseas_check_records,
      barred_list_records,
      reference_verification_records,
    });

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
