// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME NIGHT SAFETY INTELLIGENCE API ROUTE
// GET /api/v1/home-night-safety-intelligence
// Home-level engine: aggregates overnight safety — welfare check compliance,
// night disturbances, overnight incidents, security, and staffing coverage.
// CHR 2015 Reg 12 (health & safety), Reg 34 (welfare of children).
// SCCIF: "Safety of children."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeNightSafety,
  type ChildRef,
  type WelfareCheckInput,
  type NightCheckInput,
  type NightIncidentInput,
  type NightLogSummary,
  type SleepDisturbanceInput,
} from "@/lib/engines/home-night-safety-intelligence-engine";

function isNightTime(time: string): boolean {
  if (!time) return false;
  const hour = parseInt(time.split(":")[0], 10);
  return hour >= 22 || hour < 6;
}

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Children ────────────────────────────────────────────────────────────
  const children: ChildRef[] = (store.youngPeople ?? []).map((yp: any) => ({
    id: yp.id,
    name: (yp.name ?? `${yp.first_name ?? ""} ${yp.last_name ?? ""}`.trim()) || yp.id,
  }));

  const childIds = new Set(children.map((c) => c.id));

  // ── Welfare Checks (night-time only) ───────────────────────────────────
  const welfare_checks: WelfareCheckInput[] = [];
  const allWelfareChecks = (store.welfareChecks ?? []) as any[];

  for (const wc of allWelfareChecks) {
    if (!wc.child_id || !childIds.has(wc.child_id)) continue;
    const time = wc.check_time ?? "";
    if (!isNightTime(time)) continue;

    welfare_checks.push({
      child_id: wc.child_id,
      date: typeof wc.check_date === "string" ? wc.check_date.slice(0, 10) : today,
      time,
      status: wc.status ?? "ok",
      mood: wc.mood,
    });
  }

  // Also from welfare check rounds (night-time)
  const welfareRounds = ((store as any).welfareCheckRounds ?? []) as any[];
  for (const round of welfareRounds) {
    const roundTime = round.round_time ?? "";
    if (!isNightTime(roundTime)) continue;
    if (!Array.isArray(round.checks)) continue;

    for (const c of round.checks) {
      if (!c.child_id || !childIds.has(c.child_id)) continue;
      // Skip if already captured via flattened welfareChecks
      const date = typeof round.round_date === "string" ? round.round_date.slice(0, 10) : today;
      const alreadyHave = welfare_checks.some(
        (wc) => wc.child_id === c.child_id && wc.date === date && wc.time === roundTime,
      );
      if (alreadyHave) continue;

      welfare_checks.push({
        child_id: c.child_id,
        date,
        time: roundTime,
        status: c.status ?? "ok",
        mood: c.mood,
      });
    }
  }

  // ── Night Checks (from night log entries) ──────────────────────────────
  const night_checks: NightCheckInput[] = [];
  const night_logs_summary: NightLogSummary[] = [];

  const nightLogs = (store.nightLogs ?? []) as any[];
  for (const nl of nightLogs) {
    const date = typeof nl.date === "string" ? nl.date.slice(0, 10) : today;

    // Extract checks from night log
    if (Array.isArray(nl.checks)) {
      for (const check of nl.checks) {
        if (!check.child_id || !childIds.has(check.child_id)) continue;
        night_checks.push({
          child_id: check.child_id,
          date,
          time: check.time ?? "00:00",
          status: check.status ?? "asleep",
        });
      }
    }

    // Build night log summary
    night_logs_summary.push({
      date,
      has_waking_night: Array.isArray(nl.waking_night_staff) && nl.waking_night_staff.length > 0,
      has_sleep_in: !!nl.sleep_in_staff,
      check_count: Array.isArray(nl.checks) ? nl.checks.length : 0,
      incident_count: Array.isArray(nl.incidents) ? nl.incidents.length : 0,
      security_issues: Array.isArray(nl.security_checks)
        ? nl.security_checks.filter((sc: any) => sc.status === "issue").length
        : 0,
      has_concerns: !!nl.concerns,
    });
  }

  // ── Night Incidents ────────────────────────────────────────────────────
  const night_incidents: NightIncidentInput[] = [];

  // From night log incident entries
  for (const nl of nightLogs) {
    const date = typeof nl.date === "string" ? nl.date.slice(0, 10) : today;
    if (!Array.isArray(nl.incidents)) continue;

    for (const inc of nl.incidents) {
      night_incidents.push({
        date,
        child_id: inc.child_id ?? null,
        incident_type: inc.incident_type ?? "other",
        escalated: !!inc.escalated,
      });
    }
  }

  // Also check main incidents for overnight ones (time-based)
  for (const inc of (store.incidents ?? []) as any[]) {
    const time = inc.time ?? "";
    if (!isNightTime(time)) continue;
    if (!inc.child_id || !childIds.has(inc.child_id)) continue;

    const date = typeof inc.date === "string" ? inc.date.slice(0, 10) : today;
    night_incidents.push({
      date,
      child_id: inc.child_id,
      incident_type: inc.type ?? "other",
      escalated: inc.requires_oversight ?? false,
    });
  }

  // ── Sleep Disturbances ─────────────────────────────────────────────────
  const sleep_disturbances: SleepDisturbanceInput[] = [];

  const sleepLogs = (store.sleepLog ?? []) as any[];
  for (const sl of sleepLogs) {
    const date = typeof sl.date === "string" ? sl.date.slice(0, 10) : today;
    if (!Array.isArray(sl.disturbances)) continue;

    for (const dist of sl.disturbances) {
      const ypId = dist.young_person ?? "";
      if (!ypId || !childIds.has(ypId)) continue;
      sleep_disturbances.push({
        child_id: ypId,
        date,
        duration_minutes: typeof dist.duration === "number" ? dist.duration : 15,
      });
    }
  }

  // ── Compute ────────────────────────────────────────────────────────────
  const result = computeHomeNightSafety({
    today,
    children,
    welfare_checks,
    night_checks,
    night_incidents,
    night_logs: night_logs_summary,
    sleep_disturbances,
  });

  return NextResponse.json({ data: result });
}
