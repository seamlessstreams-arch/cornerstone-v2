import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requirePermission } from "@/lib/auth-guard";
import { PERMISSIONS } from "@/lib/permissions";
import { db } from "@/lib/db/store";
import type { IssueType } from "@/lib/writing-assistant/types";

export const dynamic = "force-dynamic";

const VALID_ACTIONS = ["accepted", "ignored"] as const;

export async function POST(req: NextRequest) {
  const auth = requirePermission(req, PERMISSIONS.USE_CARA_INTELLIGENCE);
  if (auth instanceof NextResponse) return auth;

  const uid = req.headers.get("x-user-id") ?? req.headers.get("x-cs-user-id");
  if (!uid) return NextResponse.json({ error: "x-user-id required" }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const action = body.action as string;
  if (!VALID_ACTIONS.includes(action as "accepted" | "ignored")) {
    return NextResponse.json({ error: "action must be 'accepted' or 'ignored'" }, { status: 400 });
  }
  const issue_type = typeof body.issue_type === "string" ? (body.issue_type as IssueType) : undefined;
  if (!issue_type) return NextResponse.json({ error: "issue_type required" }, { status: 400 });

  const rec = db.writingAssistant.logAudit({
    user_id: uid,
    action: action as "accepted" | "ignored",
    issue_type,
    original_text: typeof body.original_text === "string" ? body.original_text.slice(0, 200) : "",
    replacement_text: typeof body.replacement_text === "string" ? body.replacement_text.slice(0, 200) : undefined,
    record_type: typeof body.record_type === "string" ? body.record_type : undefined,
    field_name: typeof body.field_name === "string" ? body.field_name : undefined,
    child_id: typeof body.child_id === "string" ? body.child_id : undefined,
  });

  return NextResponse.json({ data: rec }, { status: 201 });
}
