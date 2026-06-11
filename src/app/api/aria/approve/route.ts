// ══════════════════════════════════════════════════════════════════════════════
// API: /api/aria/approve
// Convenience wrapper — applies an approval decision to an Cara output.
// POST with decision "approve", "reject", "commit", "request_changes", or "withdraw".
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { applyApprovalDecision, type AriaApprovalDecision } from "@/lib/aria/aria-service";
import type { AriaActor, AriaPermission, AriaRole } from "@/lib/aria/aria-permissions";

const VALID_DECISIONS: AriaApprovalDecision[] = [
  "approve", "reject", "request_changes", "commit", "withdraw",
];

function actorFromBody(body: Record<string, unknown>): AriaActor | null {
  const userId = typeof body.actorUserId === "string" ? body.actorUserId : "";
  const role = typeof body.actorRole === "string" ? (body.actorRole as AriaRole) : "none";
  if (!userId) return null;
  return { userId, role, organisationId: typeof body.organisationId === "string" ? body.organisationId : undefined, homeId: typeof body.homeId === "string" ? body.homeId : undefined };
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const actor = actorFromBody(body);
  if (!actor) return NextResponse.json({ error: "actorUserId is required" }, { status: 400 });

  const outputId = typeof body.outputId === "string" ? body.outputId : "";
  if (!outputId) return NextResponse.json({ error: "outputId is required" }, { status: 400 });

  const decision = body.decision as AriaApprovalDecision | undefined;
  if (!decision || !VALID_DECISIONS.includes(decision)) {
    return NextResponse.json({ error: `decision must be one of: ${VALID_DECISIONS.join(", ")}` }, { status: 400 });
  }

  const requiredPermission: AriaPermission =
    decision === "approve" ? "aria.approve_outputs" :
    decision === "reject" ? "aria.reject_outputs" :
    decision === "commit" ? "aria.commit_to_records" : "aria.use";

  const outcome = await applyApprovalDecision({
    actor,
    requiredPermission,
    outputId,
    decision,
    decisionText: typeof body.decisionText === "string" ? body.decisionText : undefined,
    editedText: typeof body.editedText === "string" ? body.editedText : undefined,
    committedRecordType: typeof body.committedRecordType === "string" ? body.committedRecordType : undefined,
    committedRecordId: typeof body.committedRecordId === "string" ? body.committedRecordId : undefined,
  });

  if (!outcome.ok) {
    return NextResponse.json({ error: outcome.errorReason ?? "Decision failed" }, { status: outcome.status });
  }
  return NextResponse.json({ data: { ok: true, decision } });
}
