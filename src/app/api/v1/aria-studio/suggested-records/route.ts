// ══════════════════════════════════════════════════════════════════════════════
// API — ARIA Suggested Records (Commit Queue)
//
// GET    → list suggestions for a home (optional ?status=)
// GET ?committed=1 → list committed records for a home
// POST   → propose a new suggestion (RBAC: aria.generate_drafts)
// PATCH  → routes via body.action:
//   - "edit"    → aria.rewrite           (refuses if not pending)
//   - "reject"  → aria.reject_outputs    (refuses if not pending)
//   - "commit"  → aria.commit_to_records (sensitive types also flagged)
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { requireAriaStudioPermission } from "@/lib/aria/aria-studio-guard";
import {
  proposeSuggestedRecord,
  editSuggestedRecord,
  rejectSuggestedRecord,
  commitSuggestedRecord,
  loadSuggestedRecords,
  loadCommittedRecords,
  isSafeguardingSensitiveRecordType,
} from "@/lib/aria/aria-suggested-records";
import type {
  AriaSuggestedRecordStatus,
  AriaSuggestedRecordType,
  AriaSuggestedSourceRef,
} from "@/types/aria-studio";

const DEFAULT_HOME_ID = "home_oak";

const VALID_TYPES: AriaSuggestedRecordType[] = [
  "daily_log_summary",
  "reflection",
  "keywork_summary",
  "behaviour_note",
  "risk_update",
  "care_plan_update",
  "incident_summary",
];

const VALID_STATUSES: AriaSuggestedRecordStatus[] = [
  "pending",
  "committed",
  "rejected",
  "superseded",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const homeId = searchParams.get("home_id") ?? DEFAULT_HOME_ID;
  if (searchParams.get("committed") === "1") {
    return NextResponse.json({ data: loadCommittedRecords(homeId) });
  }
  const statusParam = searchParams.get("status");
  const status = VALID_STATUSES.includes(statusParam as AriaSuggestedRecordStatus)
    ? (statusParam as AriaSuggestedRecordStatus)
    : undefined;
  return NextResponse.json({ data: loadSuggestedRecords(homeId, status) });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const homeId = typeof body.home_id === "string" ? body.home_id : DEFAULT_HOME_ID;
  const recordType = body.record_type as AriaSuggestedRecordType | undefined;
  if (!recordType || !VALID_TYPES.includes(recordType)) {
    return NextResponse.json({ error: "record_type is required" }, { status: 400 });
  }
  if (typeof body.suggested_title !== "string" || typeof body.suggested_body !== "string") {
    return NextResponse.json(
      { error: "suggested_title and suggested_body are required" },
      { status: 400 },
    );
  }

  const guard = requireAriaStudioPermission(req, body, {
    permission: "aria.generate_drafts",
    homeId,
    intent: `propose suggested_record:${recordType}`,
  });
  if (!guard.ok) return guard.response;

  const sourceEvidence = Array.isArray(body.source_evidence)
    ? (body.source_evidence as AriaSuggestedSourceRef[])
    : [];
  const suggestedFields =
    body.suggested_fields && typeof body.suggested_fields === "object"
      ? (body.suggested_fields as Record<string, string | number | boolean | null>)
      : undefined;

  const rec = proposeSuggestedRecord({
    homeId,
    childId: typeof body.child_id === "string" ? body.child_id : null,
    recordType,
    suggestedTitle: body.suggested_title,
    suggestedBody: body.suggested_body,
    suggestedFields,
    sourceEvidence,
    generatedBy: guard.actor.userId,
    targetLabel: typeof body.target_label === "string" ? body.target_label : undefined,
  });
  return NextResponse.json({ data: rec }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : null;
  const action = typeof body.action === "string" ? body.action : null;
  if (!id || !action) {
    return NextResponse.json({ error: "id and action are required" }, { status: 400 });
  }

  const existing = db.ariaSuggestedRecords.findById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.status !== "pending") {
    return NextResponse.json(
      { error: `Suggestion is ${existing.status}; no further changes allowed` },
      { status: 409 },
    );
  }

  const note = typeof body.note === "string" ? body.note : null;

  if (action === "edit") {
    const guard = requireAriaStudioPermission(req, body, {
      permission: "aria.rewrite",
      homeId: existing.home_id,
      childId: existing.child_id,
      intent: "edit suggested_record",
    });
    if (!guard.ok) return guard.response;
    const suggestedFields =
      body.suggested_fields && typeof body.suggested_fields === "object"
        ? (body.suggested_fields as Record<string, string | number | boolean | null>)
        : undefined;
    const updated = editSuggestedRecord(id, {
      suggestedTitle:
        typeof body.suggested_title === "string" ? body.suggested_title : undefined,
      suggestedBody:
        typeof body.suggested_body === "string" ? body.suggested_body : undefined,
      suggestedFields,
    });
    return NextResponse.json({ data: updated });
  }

  if (action === "reject") {
    const guard = requireAriaStudioPermission(req, body, {
      permission: "aria.reject_outputs",
      homeId: existing.home_id,
      childId: existing.child_id,
      intent: "reject suggested_record",
    });
    if (!guard.ok) return guard.response;
    const updated = rejectSuggestedRecord(id, guard.actor.userId, note);
    return NextResponse.json({ data: updated });
  }

  if (action === "commit") {
    const sensitive = isSafeguardingSensitiveRecordType(existing.record_type);
    const guard = requireAriaStudioPermission(req, body, {
      permission: "aria.commit_to_records",
      homeId: existing.home_id,
      childId: existing.child_id,
      intent: `commit suggested_record:${existing.record_type}`,
      isSafeguardingSensitive: sensitive,
    });
    if (!guard.ok) return guard.response;
    const result = commitSuggestedRecord(id, guard.actor.userId, note);
    if (!result) {
      return NextResponse.json({ error: "Commit failed" }, { status: 409 });
    }
    return NextResponse.json({ data: result });
  }

  return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
}
