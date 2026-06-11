// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME WELFARE CHECK COMPLIANCE INTELLIGENCE API ROUTE
// GET /api/v1/home-welfare-check-compliance-intelligence
// Synthesises welfare check rounds to assess check completion, building
// security, distress response, fire exit compliance, environmental safety,
// and documentation quality.
// CHR 2015 Reg 12, 6, 25. SCCIF: "Helped and protected."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeWelfareCheckCompliance,
  type WelfareCheckRecordInput,
} from "@/lib/engines/home-welfare-check-compliance-intelligence-engine";

export async function GET() {
  try {
    const store = getStore();
    const today = new Date().toISOString().slice(0, 10);

    // ── Children count ────────────────────────────────────────────────
    const youngPeople = (store.youngPeople ?? []) as any[];
    const total_children = youngPeople.length;

    // ── Welfare check rounds ──────────────────────────────────────────
    const rawRounds = (store.welfareCheckRounds ?? []) as any[];
    const rounds: WelfareCheckRecordInput[] = rawRounds.map((r: any) => {
      const checks = (r.checks ?? []) as any[];
      const expectedChecks = total_children;
      const completedChecks = checks.length;
      const distressedChildren = checks.filter(
        (c: any) => c.mood === "distressed" || c.mood === "upset" || c.status === "distressed",
      );
      const distressedCount = distressedChildren.length;
      const allDistressedActioned = distressedCount === 0
        ? true
        : distressedChildren.every((c: any) => c.notes && c.notes.trim().length > 0);
      const windowsSecure = checks.filter((c: any) => c.window_secure === true).length;
      const tempIssues = checks.filter(
        (c: any) => c.room_temperature === "too_warm" || c.room_temperature === "too_cold",
      ).length;
      const hasNotes = checks.some((c: any) => c.notes && c.notes.trim().length > 0);

      return {
        id: r.id ?? "",
        round_date: (r.round_date ?? today).toString().slice(0, 10),
        round_time: r.round_time ?? "",
        shift_type: r.shift_type ?? "waking_night",
        checks_completed: completedChecks,
        expected_checks: expectedChecks,
        all_children_checked: r.all_children_checked ?? (completedChecks >= expectedChecks),
        building_secure: r.building_secure ?? false,
        fire_exits_clear: r.fire_exits_clear ?? false,
        external_doors_locked: r.external_doors_locked ?? false,
        alarm_set: r.alarm_set ?? false,
        distressed_count: distressedCount,
        all_distressed_actioned: allDistressedActioned,
        has_notes: hasNotes,
        windows_secure_count: windowsSecure,
        windows_total: checks.length,
        temperature_issues_count: tempIssues,
      };
    });

    const result = computeWelfareCheckCompliance({ today, total_children, rounds });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
