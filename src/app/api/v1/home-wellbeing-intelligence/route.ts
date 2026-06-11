// ══════════════════════════════════════════════════════════════════════════════
// CARA — HOME WELLBEING INTELLIGENCE API ROUTE
// GET /api/v1/home-wellbeing-intelligence
// Home-level engine: aggregates mood trends, sleep quality, welfare checks,
// incidents, and activity engagement across all children in the home.
// Surfaces the "emotional temperature" of the home.
// CHR 2015 Reg 6 (quality of care), Reg 7 (welfare), Reg 34 (welfare of children).
// SCCIF: "Experiences and progress of children."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeWellbeing,
  type ChildRef,
  type MoodEntryInput,
  type SleepEntryInput,
  type WelfareCheckEntryInput,
  type IncidentEntryInput,
  type ActivityEntryInput,
} from "@/lib/engines/home-wellbeing-intelligence-engine";

// ── Night-time welfare check → sleep quality mapping ────────────────────────

function deriveSleepQuality(checks: Array<{ status: string; mood?: string }>): string {
  // All asleep and settled → good
  // Any restless but asleep → fair
  // Any awake at night → poor
  // Any concern or marks → disturbed
  const hasConcern = checks.some((c) => c.status === "concern");
  const hasAwake = checks.some((c) => c.status === "awake" || c.status === "not_in_room");
  const hasRestless = checks.some((c) => c.mood === "restless" || c.mood === "unsettled" || c.mood === "anxious");
  const hasRefused = checks.some((c) => c.status === "refused");

  if (hasConcern) return "disturbed";
  if (hasAwake || hasRefused) return "poor";
  if (hasRestless) return "fair";
  return "good";
}

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

  // ── Mood Entries ────────────────────────────────────────────────────────
  // Derived from daily log entries that have a mood_score
  const mood_entries: MoodEntryInput[] = (store.dailyLog ?? [])
    .filter((l: any) => l.child_id && childIds.has(l.child_id) && typeof l.mood_score === "number" && l.mood_score > 0)
    .map((l: any) => ({
      child_id: l.child_id,
      date: typeof l.date === "string" ? l.date.slice(0, 10) : today,
      mood_score: l.mood_score as number,
    }));

  // ── Sleep Entries ──────────────────────────────────────────────────────
  // Derived from: (1) night-time welfare checks grouped by child+date
  //               (2) sleep log disturbances
  const sleep_entries: SleepEntryInput[] = [];
  const sleepMap = new Map<string, { checks: Array<{ status: string; mood?: string }>; disturbances: number }>();

  // From welfare checks at night (22:00-06:00)
  const allWelfareChecks = (store.welfareChecks ?? []) as any[];
  for (const wc of allWelfareChecks) {
    if (!wc.child_id || !childIds.has(wc.child_id)) continue;
    const time = wc.check_time ?? "";
    if (!isNightTime(time)) continue;

    const date = typeof wc.check_date === "string" ? wc.check_date.slice(0, 10) : today;
    const key = `${wc.child_id}|${date}`;
    if (!sleepMap.has(key)) sleepMap.set(key, { checks: [], disturbances: 0 });
    sleepMap.get(key)!.checks.push({ status: wc.status ?? "ok", mood: wc.mood });
  }

  // From sleep log disturbances (per young person)
  const sleepLogs = (store.sleepLog ?? []) as any[];
  for (const sl of sleepLogs) {
    const date = typeof sl.date === "string" ? sl.date.slice(0, 10) : today;
    if (!Array.isArray(sl.disturbances)) continue;
    for (const dist of sl.disturbances) {
      const ypId = dist.young_person ?? "";
      if (!ypId || !childIds.has(ypId)) continue;
      const key = `${ypId}|${date}`;
      if (!sleepMap.has(key)) sleepMap.set(key, { checks: [], disturbances: 0 });
      sleepMap.get(key)!.disturbances += 1;
    }
  }

  for (const [key, val] of sleepMap) {
    const [child_id, date] = key.split("|");
    const quality = val.checks.length > 0 ? deriveSleepQuality(val.checks) : (val.disturbances > 0 ? "poor" : "good");
    sleep_entries.push({
      child_id,
      date,
      quality,
      disturbance_count: val.disturbances,
    });
  }

  // ── Welfare Checks ─────────────────────────────────────────────────────
  // Map WelfareCheck status to engine outcome
  const welfare_checks: WelfareCheckEntryInput[] = allWelfareChecks
    .filter((w: any) => w.child_id && childIds.has(w.child_id))
    .map((w: any) => {
      const status = w.status ?? "ok";
      // Map welfare check status to engine's ok/concern
      const outcome = (status === "concern" || w.concern_details || w.physical_marks_noted) ? "concern" : "ok";
      return {
        child_id: w.child_id,
        date: typeof w.check_date === "string" ? w.check_date.slice(0, 10) : today,
        outcome,
      };
    });

  // Also include welfare rounds that may not be flattened
  const welfareRounds = ((store as any).welfareCheckRounds ?? []) as any[];
  for (const round of welfareRounds) {
    if (!Array.isArray(round.checks)) continue;
    for (const c of round.checks) {
      if (!c.child_id || !childIds.has(c.child_id)) continue;
      // Avoid duplicates — welfare round checks should already be in welfareChecks
      // (store flattens them). Skip if already present.
      const alreadyIncluded = welfare_checks.some(
        (wc) => wc.child_id === c.child_id && wc.date === (typeof round.round_date === "string" ? round.round_date.slice(0, 10) : today),
      );
      if (alreadyIncluded) continue;

      const status = c.status ?? "ok";
      const outcome = (status === "concern" || c.concern_details || c.physical_marks_noted) ? "concern" : "ok";
      welfare_checks.push({
        child_id: c.child_id,
        date: typeof round.round_date === "string" ? round.round_date.slice(0, 10) : today,
        outcome,
      });
    }
  }

  // ── Incidents ──────────────────────────────────────────────────────────
  const incidents: IncidentEntryInput[] = (store.incidents ?? [])
    .filter((inc: any) => inc.child_id && childIds.has(inc.child_id))
    .map((inc: any) => ({
      child_id: inc.child_id,
      date: typeof inc.date === "string" ? inc.date.slice(0, 10) : today,
      severity: inc.severity ?? "low",
    }));

  // Some incidents use involved_children array instead of child_id
  for (const inc of (store.incidents ?? []) as any[]) {
    if (inc.child_id) continue; // Already handled above
    if (!Array.isArray((inc as any).involved_children)) continue;
    for (const cid of (inc as any).involved_children) {
      if (!childIds.has(cid)) continue;
      incidents.push({
        child_id: cid,
        date: typeof inc.date === "string" ? inc.date.slice(0, 10) : today,
        severity: inc.severity ?? "low",
      });
    }
  }

  // ── Activities ─────────────────────────────────────────────────────────
  const activities: ActivityEntryInput[] = [];
  for (const act of (store.activities ?? []) as any[]) {
    const date = typeof act.date === "string" ? act.date.slice(0, 10) : (act.start_date ?? act.created_at ?? today).toString().slice(0, 10);

    // Activity has child_id directly
    if (act.child_id && childIds.has(act.child_id)) {
      const eng = act.engagement ?? "willing";
      activities.push({
        child_id: act.child_id,
        date,
        participated: eng !== "refused",
      });
      continue;
    }

    // Activity uses participants array
    if (Array.isArray(act.participants)) {
      for (const pid of act.participants) {
        if (!childIds.has(pid)) continue;
        activities.push({
          child_id: pid,
          date,
          participated: true,
        });
      }
    }
  }

  // ── Compute ────────────────────────────────────────────────────────────
  const result = computeHomeWellbeing({
    today,
    children,
    mood_entries,
    sleep_entries,
    welfare_checks,
    incidents,
    activities,
  });

  return NextResponse.json({ data: result });
}
