// ══════════════════════════════════════════════════════════════════════════════
// CARA — SAFER RECRUITMENT COMMAND CENTRE API
// Per-candidate compliance roll-up: traffic light, start-eligibility gate,
// blockers, reference chase ladder, missing evidence and the Ofsted-ready
// staff-file index. Read-only; every suitability decision stays human.
// ══════════════════════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { computeSaferRecruitmentCommand } from "@/lib/engines/safer-recruitment-command-engine";
import { assembleCommandCandidates } from "@/lib/safer-recruitment/command-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const result = computeSaferRecruitmentCommand({ today, candidates: assembleCommandCandidates() });
  return NextResponse.json({ data: result });
}
