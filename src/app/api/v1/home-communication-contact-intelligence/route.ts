// ══════════════════════════════════════════════════════════════════════════════
// API — HOME COMMUNICATION & CONTACT INTELLIGENCE
// Maps in-memory store → engine input → JSON response.
// ══════════════════════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeCommunicationContact,
  type CommBookInput,
  type CorrespondenceInput,
  type ContactPlanInput,
  type CommProfileInput,
} from "@/lib/engines/home-communication-contact-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Communication Book Entries ──────────────────────────────────────
  const comm_book_entries: CommBookInput[] = (store.communicationBookEntries as any[]).map((e: any) => ({
    id: e.id,
    date: (e.date ?? "").toString().slice(0, 10),
    priority: e.priority ?? "normal",
    action_required: !!(e.action_required),
    action_completed: !!(e.action_completed_by),
    related_yp_present: !!(e.related_yp),
  }));

  // ── Correspondence Entries ──────────────────────────────────────────
  const correspondence_entries: CorrespondenceInput[] = (store.correspondenceEntries as any[]).map((e: any) => ({
    id: e.id,
    date: (e.date ?? "").toString().slice(0, 10),
    direction: e.direction ?? "incoming",
    priority: e.priority ?? "normal",
    status: e.status ?? "received",
    action_required_present: !!(e.action_required),
    action_due: e.action_due ? (e.action_due).toString().slice(0, 10) : null,
    child_related: !!(e.child_id),
  }));

  // ── Contact Plans ──────────────────────────────────────────────────
  const contact_plans: ContactPlanInput[] = (store.contactPlans as any[]).map((p: any) => ({
    id: p.id,
    child_id: p.child_id,
    review_date: (p.review_date ?? "").toString().slice(0, 10),
    status: p.status ?? "active",
    arrangements_count: p.arrangements?.length ?? 0,
    child_wishes_provided: !!(p.child_wishes),
    risk_factors_count: p.risk_factors?.length ?? 0,
    next_scheduled_contact: (p.next_scheduled_contact ?? "").toString().slice(0, 10),
  }));

  // ── Communication Profiles ─────────────────────────────────────────
  const communication_profiles: CommProfileInput[] = (store.communicationProfiles as any[]).map((p: any) => ({
    id: p.id,
    child_id: p.child_id,
    last_review_date: (p.last_review_date ?? "").toString().slice(0, 10),
    interpreter_required: !!(p.interpreter_required),
    salt_involved: !!(p.salt_involved),
    strategies_count: p.strategies?.length ?? 0,
    aac_tools_count: p.aac_tools?.length ?? 0,
    child_views_provided: !!(p.child_views),
  }));

  const result = computeHomeCommunicationContact({
    today,
    comm_book_entries,
    correspondence_entries,
    contact_plans,
    communication_profiles,
    total_children: store.youngPeople?.length ?? 0,
    total_staff: store.staff?.length ?? 0,
  });

  return NextResponse.json({ data: result });
}
