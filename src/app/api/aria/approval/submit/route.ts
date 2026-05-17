// ══════════════════════════════════════════════════════════════════════════════
// API: POST /api/aria/approval/submit — Submit AI output for review
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { ariaApprovalEngine } from "@/lib/aria/approval";
import { sanitiseErrorForClient } from "@/lib/aria/core/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.approvalId || !body.userId) {
      return NextResponse.json({ error: "Missing approvalId or userId" }, { status: 400 });
    }

    const record = ariaApprovalEngine.submitForReview(body.approvalId, body.userId);
    return NextResponse.json({ record });
  } catch (error: any) {
    const safe = sanitiseErrorForClient(error);
    return NextResponse.json({ error: safe.message, code: safe.code }, { status: error?.statusCode ?? 500 });
  }
}
