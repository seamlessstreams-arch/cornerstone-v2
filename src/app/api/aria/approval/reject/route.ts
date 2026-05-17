// ══════════════════════════════════════════════════════════════════════════════
// API: POST /api/aria/approval/reject — Reject AI output
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { ariaApprovalEngine } from "@/lib/aria/approval";
import { sanitiseErrorForClient } from "@/lib/aria/core/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.approvalId || !body.userId || !body.userRole || !body.reason) {
      return NextResponse.json(
        { error: "Missing approvalId, userId, userRole, or reason" },
        { status: 400 },
      );
    }

    const record = ariaApprovalEngine.reject(
      body.approvalId,
      body.userId,
      body.userRole,
      body.reason,
    );

    return NextResponse.json({ record });
  } catch (error: any) {
    const safe = sanitiseErrorForClient(error);
    return NextResponse.json({ error: safe.message, code: safe.code }, { status: error?.statusCode ?? 500 });
  }
}
