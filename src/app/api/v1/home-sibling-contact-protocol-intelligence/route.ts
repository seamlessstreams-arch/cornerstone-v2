import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeSiblingContactProtocol } from "@/lib/engines/home-sibling-contact-protocol-intelligence-engine";
import type { SiblingContactRecordInput } from "@/lib/engines/home-sibling-contact-protocol-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = getStore();
    const raw = store.siblingContactProtocolRecords as any[];
    const total_children = (store.youngPeople ?? []).length;
    const today = new Date().toISOString().slice(0, 10);
    const todayMs = new Date(today).getTime();

    const records: SiblingContactRecordInput[] = raw.map((r: any) => {
      const recentContacts = Array.isArray(r.recent_contacts) ? r.recent_contacts : [];
      const recentWithin30 = recentContacts.filter((c: any) => {
        if (!c.date) return false;
        return (todayMs - new Date(c.date).getTime()) <= 30 * 86400000;
      }).length;

      return {
        id: r.id,
        child_id: r.child_id,
        sibling_name: r.sibling_name || "",
        current_relationship_quality: r.current_relationship_quality || "good",
        contact_frequency: r.contact_frequency || "monthly",
        contact_type_count: Array.isArray(r.contact_types) ? r.contact_types.length : 0,
        has_agreed_plan: !!(r.agreed_contact_plan && r.agreed_contact_plan.trim()),
        has_child_preferences: !!(r.child_preferences && r.child_preferences.trim()),
        has_sibling_preferences: !!(r.sibling_preferences && r.sibling_preferences.trim()),
        risk_factor_count: Array.isArray(r.risk_factors_to_contact) ? r.risk_factors_to_contact.length : 0,
        protective_factor_count: Array.isArray(r.protective_factors_to_contact) ? r.protective_factors_to_contact.length : 0,
        supervision_required: !!r.supervision_required,
        has_transport_arrangements: !!(r.transport_arrangements && r.transport_arrangements.trim()),
        location_count: Array.isArray(r.locations_for_contact) ? r.locations_for_contact.length : 0,
        has_birthday_plan: !!(r.birthday_celebration_plan && r.birthday_celebration_plan.trim()),
        has_christmas_plan: !!(r.christmas_arrangements && r.christmas_arrangements.trim()),
        court_ordered: !!r.court_ordered_contact,
        has_court_order_terms: !!(r.court_order_terms && r.court_order_terms.trim()),
        recent_contact_count: recentContacts.length,
        recent_contact_within_30_days: recentWithin30,
        review_date: r.review_date ? r.review_date.toString().slice(0, 10) : "",
        has_reviewer: !!(r.reviewed_by && r.reviewed_by.trim()),
      };
    });

    const result = computeSiblingContactProtocol({ today, total_children, records });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
