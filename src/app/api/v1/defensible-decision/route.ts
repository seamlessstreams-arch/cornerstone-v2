// ══════════════════════════════════════════════════════════════════════════════
// CARA — Defensible Decision API (Reasoning Layer)
//
// POST → structure a decision into the 14-point defensible-decision record and
//        score how defensible it currently is (flagging the classic gaps).
// GET  → a deterministic worked example so the endpoint is curl-verifiable.
//
// Guarded by ADD_OVERSIGHT. Deterministic; no model calls.
// ══════════════════════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requirePermission } from "@/lib/auth-guard";
import { PERMISSIONS } from "@/lib/permissions";
import {
  buildDefensibleDecision,
  type DefensibleDecisionInput,
} from "@/lib/cara-reasoning/defensible-decision-engine";

export const dynamic = "force-dynamic";

const DEMO: DefensibleDecisionInput = {
  childName: "Jordan",
  decisionSummary: "Increase staffing to 2:1 during community time for two weeks",
  whatHappened: "Two unplanned missing episodes from community time in the last fortnight.",
  informationConsidered: ["Missing-from-care records", "Risk assessment", "Key-worker observations"],
  childView: "Jordan says they feel embarrassed being followed but understands the worry.",
  whatWeKnow: ["Both episodes began at the same location", "Jordan returned safely each time"],
  whatWeDoNotKnow: ["Who Jordan is meeting", "Whether peers are involved"],
  risks: ["Possible exploitation during absences"],
  strengths: ["Strong relationship with key worker", "Returns willingly when called"],
  optionsConsidered: ["Maintain current staffing", "Increase to 2:1 for community time", "Pause community time"],
  rationaleForChoice: "2:1 keeps Jordan's freedom while reducing risk during the highest-risk activity.",
  whyAlternativesRejected: "Pausing community time would be disproportionate and harm trust; current staffing has not been sufficient.",
  actionRequired: "Roster 2:1 for community time and review with Jordan weekly.",
  responsibleRole: "registered_manager",
  reviewDate: "2026-06-29",
  whatWouldChangeThisDecision: "Two settled weeks, or clarity that no exploitation risk exists, would allow a return to 1:1.",
  riskLevel: "high",
};

export async function GET(req: NextRequest) {
  const auth = requirePermission(req, PERMISSIONS.ADD_OVERSIGHT);
  if (auth instanceof NextResponse) return auth;
  const today = new Date().toISOString().slice(0, 10);
  return NextResponse.json({ data: { example: true, input: DEMO, decision: buildDefensibleDecision(DEMO, today) } });
}

export async function POST(req: NextRequest) {
  const auth = requirePermission(req, PERMISSIONS.ADD_OVERSIGHT);
  if (auth instanceof NextResponse) return auth;

  let body: Partial<DefensibleDecisionInput>;
  try {
    body = (await req.json()) as Partial<DefensibleDecisionInput>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body?.decisionSummary || !body.decisionSummary.trim()) {
    return NextResponse.json({ error: "decisionSummary is required" }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);
  try {
    const decision = buildDefensibleDecision(body as DefensibleDecisionInput, today);
    return NextResponse.json({ data: { decision } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to build defensible decision", details: String(error) }, { status: 500 });
  }
}
