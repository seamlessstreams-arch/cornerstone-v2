// ══════════════════════════════════════════════════════════════════════════════
// API: POST /api/aria/studio/generate — Generate Cara Studio content
//
// Creates child-centred session plans, therapeutic activities, and resources.
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { AriaStudioEngine } from "@/lib/aria/studio/studio-engine";
import { AriaAuditLogger } from "@/lib/aria/audit/audit-logger";
import { sanitiseErrorForClient } from "@/lib/aria/core/errors";
import type { AriaStudioRequest } from "@/lib/aria/core/types";

const studioEngine = new AriaStudioEngine();
const auditLogger = new AriaAuditLogger();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.type || !body.childId || !body.userId || !body.userRole || !body.organisationId || !body.homeId) {
      return NextResponse.json(
        { error: "Missing required fields: type, childId, userId, userRole, organisationId, homeId" },
        { status: 400 },
      );
    }

    const request: AriaStudioRequest = {
      type: body.type,
      childId: body.childId,
      childContext: body.childContext ?? {},
      focusArea: body.focusArea,
      duration: body.duration,
      staffId: body.staffId,
      userId: body.userId,
      userRole: body.userRole,
      organisationId: body.organisationId,
      homeId: body.homeId,
      additionalInstructions: body.additionalInstructions,
    };

    const output = await studioEngine.generate(request);

    return NextResponse.json({
      ...output,
      _meta: {
        aiGenerated: true,
        disclaimer: "AI-generated draft — requires human review before use with children",
      },
    });
  } catch (error: any) {
    const safe = sanitiseErrorForClient(error);
    return NextResponse.json({ error: safe.message, code: safe.code }, { status: error?.statusCode ?? 500 });
  }
}
