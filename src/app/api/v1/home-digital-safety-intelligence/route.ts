// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME DIGITAL SAFETY INTELLIGENCE API ROUTE
// GET /api/v1/home-digital-safety-intelligence
// Online safety incidents, agreements, photo & media consents.
// KCSIE 2024: "Online safety — appropriate systems."
// CHR 2015 Reg 12/13: "Protection of children."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeDigitalSafety,
  type OnlineSafetyIncidentInput,
  type OnlineSafetyAgreementInput,
  type PhotoConsentInput,
  type MediaConsentInput,
} from "@/lib/engines/home-digital-safety-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Online safety incidents ─────────────────────────────────────────
  const incidents: OnlineSafetyIncidentInput[] = (
    (store.onlineSafetyIncidents ?? []) as any[]
  ).map((i: any) => ({
    id: (i.id ?? "").toString(),
    child_id: (i.child_id ?? "").toString(),
    date: (i.date ?? "").toString().slice(0, 10),
    category: (i.category ?? "").toString(),
    severity: (i.severity ?? "low").toString(),
    status: (i.status ?? "open").toString(),
    platform: (i.platform ?? "").toString(),
    safeguarding_referral: !!(i.safeguarding_referral),
    parent_carer_notified: !!(i.parent_carer_notified),
    actions_taken: Array.isArray(i.actions_taken) ? i.actions_taken : [],
  }));

  // ── Online safety agreements ────────────────────────────────────────
  const agreements: OnlineSafetyAgreementInput[] = (
    (store.onlineSafetyAgreements ?? []) as any[]
  ).map((a: any) => ({
    id: (a.id ?? "").toString(),
    child_id: (a.child_id ?? "").toString(),
    agreement_date: (a.agreement_date ?? "").toString().slice(0, 10),
    review_date: (a.review_date ?? "").toString().slice(0, 10),
    child_signature: !!(a.child_signature),
    devices: Array.isArray(a.devices) ? a.devices : [],
    restrictions: Array.isArray(a.restrictions) ? a.restrictions : [],
    parental_controls: (a.parental_controls ?? "").toString(),
  }));

  // ── Photo consents ──────────────────────────────────────────────────
  const photo_consents: PhotoConsentInput[] = (
    (store.photoConsentRecords ?? []) as any[]
  ).map((p: any) => ({
    id: (p.id ?? "").toString(),
    child_id: (p.child_id ?? "").toString(),
    last_review_date: (p.last_review_date ?? "").toString().slice(0, 10),
    next_review_date: (p.next_review_date ?? "").toString().slice(0, 10),
    social_worker_consent: !!(p.social_worker_consent),
    permissions_count: Array.isArray(p.permissions) ? p.permissions.length : 0,
  }));

  // ── Media consents ──────────────────────────────────────────────────
  const media_consents: MediaConsentInput[] = (
    (store.mediaPublicityConsents ?? []) as any[]
  ).map((m: any) => ({
    id: (m.id ?? "").toString(),
    child_id: (m.child_id ?? "").toString(),
    consent_requested_date: (m.consent_requested_date ?? "").toString().slice(0, 10),
    expiry_of_consent: (m.expiry_of_consent ?? "").toString().slice(0, 10),
    child_gave_consent: (m.child_gave_consent ?? "").toString(),
    parental_responsibility_consent: !!(m.parental_responsibility_consent),
    la_consent: !!(m.la_consent),
  }));

  // ── Totals ──────────────────────────────────────────────────────────
  const totalChildren = (store.youngPeople ?? []).filter(
    (yp: any) => yp.status === "current",
  ).length;

  const result = computeHomeDigitalSafety({
    today,
    incidents,
    agreements,
    photo_consents,
    media_consents,
    total_children: totalChildren,
  });

  return NextResponse.json({ data: result });
}
