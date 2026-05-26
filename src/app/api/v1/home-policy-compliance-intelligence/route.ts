// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME POLICY COMPLIANCE INTELLIGENCE API ROUTE
// GET /api/v1/home-policy-compliance-intelligence
// Synthesises home policy records to assess currency, staff acknowledgement,
// regulatory coverage, and governance quality.
// CHR 2015 Reg 35, Reg 16. SCCIF: "Well-led and managed."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomePolicyCompliance,
  type PolicyInput,
} from "@/lib/engines/home-policy-compliance-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Home Policies ─────────────────────────────────────────────────
  const policies: PolicyInput[] = ((store.homePolicies ?? []) as any[])
    .map((p: any) => ({
      id: p.id ?? "",
      category: p.category ?? "other",
      status: p.status ?? "draft",
      next_review_date: (p.next_review_date ?? "").toString().slice(0, 10),
      last_reviewed: (p.last_reviewed ?? "").toString().slice(0, 10),
      acknowledged_count: Array.isArray(p.read_acknowledgements)
        ? p.read_acknowledgements.length
        : 0,
      total_staff_required: typeof p.total_staff_required === "number"
        ? p.total_staff_required
        : 0,
      has_statutory_basis: !!(p.statutory_basis),
      has_key_points: Array.isArray(p.key_points) ? p.key_points.length > 0 : !!(p.key_points),
    }));

  // ── Compute ───────────────────────────────────────────────────────
  const result = computeHomePolicyCompliance({ today, policies });

  return NextResponse.json({ data: result });
}
