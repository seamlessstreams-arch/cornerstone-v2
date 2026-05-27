// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — HOME PEER DYNAMICS INTELLIGENCE API ROUTE
// GET /api/v1/home-peer-dynamics-intelligence
// Peer relationships, group atmosphere, risk management between children.
// CHR 2015 Reg 19. SCCIF: "Children feel safe with each other."
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomePeerDynamics,
  type PeerDynamicInput,
  type PeerEntryInput,
  type PeerGroupAssessmentInput,
} from "@/lib/engines/home-peer-dynamics-intelligence-engine";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  // ── Peer Dynamics ─────────────────────────────────────────────────────
  const peerDynamics: PeerDynamicInput[] = (
    (store.peerDynamics ?? []) as any[]
  ).map((p: any) => ({
    id: p.id ?? "",
    child_id_1: p.child_id_1 ?? "",
    child_id_2: p.child_id_2 ?? "",
    quality: (p.quality ?? "neutral").toString(),
    risk_level: (p.risk_level ?? "none").toString(),
    strengths: Array.isArray(p.strengths) ? p.strengths : [],
    concerns: Array.isArray(p.concerns) ? p.concerns : [],
    strategies: Array.isArray(p.strategies) ? p.strategies : [],
    entries: (Array.isArray(p.entries) ? p.entries : []).map((e: any): PeerEntryInput => ({
      id: e.id ?? "",
      date: (e.date ?? "").toString().slice(0, 10),
      type: (e.type ?? "observation").toString(),
      description: (e.description ?? "").toString(),
      staff_witness: e.staff_witness ?? "",
      intervention_used: (e.intervention_used ?? "").toString(),
      outcome: (e.outcome ?? "").toString(),
    })),
    last_review_date: (p.last_review_date ?? "").toString().slice(0, 10),
    reviewed_by: p.reviewed_by ?? "",
    next_review_due: (p.next_review_due ?? "").toString().slice(0, 10),
  }));

  // ── Group Assessments ─────────────────────────────────────────────────
  const groupAssessments: PeerGroupAssessmentInput[] = (
    (store.peerGroupDynamics ?? []) as any[]
  ).map((g: any) => ({
    id: g.id ?? "",
    assessment_date: (g.assessment_date ?? "").toString().slice(0, 10),
    assessed_by: g.assessed_by ?? "",
    overall_atmosphere: (g.overall_atmosphere ?? "mixed").toString(),
    group_strengths: Array.isArray(g.group_strengths) ? g.group_strengths : [],
    group_concerns: Array.isArray(g.group_concerns) ? g.group_concerns : [],
    recommendations: Array.isArray(g.recommendations) ? g.recommendations : [],
  }));

  // ── Total children ────────────────────────────────────────────────────
  const totalChildren = (store.youngPeople ?? []).filter(
    (yp: any) => yp.status === "current",
  ).length;

  const result = computeHomePeerDynamics({
    today,
    peer_dynamics: peerDynamics,
    group_assessments: groupAssessments,
    total_children: totalChildren,
  });

  return NextResponse.json({ data: result });
}
