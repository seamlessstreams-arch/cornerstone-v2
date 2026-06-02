// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME THERAPEUTIC CLIMATE INTELLIGENCE API ROUTE
// GET /api/v1/home-therapeutic-climate-intelligence
// Meta-analysis combining behaviour log, restraints, incidents, and missing
// episodes to assess the overall therapeutic atmosphere of the home.
// CHR 2015 Reg 19, Reg 20, Reg 35. SCCIF: "How well children are helped
// and protected" / "The effectiveness of leaders and managers."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomeTherapeuticClimate,
  type BehaviourLogInput,
  type RestraintInput,
  type ClimateIncidentInput,
  type ClimateMissingInput,
} from "@/lib/engines/home-therapeutic-climate-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Behaviour Log ───────────────────────────────────────────
  const behaviour_log: BehaviourLogInput[] = ((store.behaviourLog ?? []) as any[])
    .map((b: any) => ({
      id: b.id ?? "",
      child_id: b.child_id ?? "",
      date: (b.date ?? "").toString().slice(0, 10),
      direction: (b.direction ?? "concerning").toString(),
      intensity: (b.intensity ?? "low").toString(),
    }));

  // ── Restraints ──────────────────────────────────────────────
  const restraints: RestraintInput[] = ((store.restraints ?? []) as any[])
    .map((r: any) => ({
      id: r.id ?? "",
      child_id: r.child_id ?? "",
      date: (r.date ?? "").toString().slice(0, 10),
      duration_minutes: typeof r.duration === "number" ? r.duration : 0,
      de_escalation_count: Array.isArray(r.de_escalation_attempts) ? r.de_escalation_attempts.length : 0,
      child_debriefed: !!(r.child_debriefed),
      staff_debriefed: !!(r.staff_debriefed),
      injuries_count: Array.isArray(r.injuries) ? r.injuries.length : 0,
    }));

  // ── Incidents ───────────────────────────────────────────────
  const incidents: ClimateIncidentInput[] = ((store.incidents ?? []) as any[])
    .map((inc: any) => ({
      id: inc.id ?? "",
      child_id: inc.child_id ?? "",
      date: (inc.date ?? "").toString().slice(0, 10),
      severity: (inc.severity ?? "low").toString(),
    }));

  // ── Missing Episodes ────────────────────────────────────────
  const missing_episodes: ClimateMissingInput[] = ((store.missingEpisodes ?? []) as any[])
    .map((ep: any) => ({
      id: ep.id ?? "",
      child_id: ep.child_id ?? "",
      date: (ep.date_missing ?? "").toString().slice(0, 10),
    }));

  // ── Total children ──────────────────────────────────────────
  const totalChildren = (store.youngPeople ?? [])
    .filter((yp: any) => yp.status === "current").length;

  const result = computeHomeTherapeuticClimate({
    today,
    behaviour_log,
    restraints,
    incidents,
    missing_episodes,
    total_children: totalChildren,
  });

  return NextResponse.json({ data: result });
}
