// ══════════════════════════════════════════════════════════════════════════════
// API: POST /api/aria/providers/test — Test provider connectivity
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { testProviderConnection } from "@/lib/aria/providers";
import { sanitiseErrorForClient } from "@/lib/aria/core/errors";
import type { AriaProviderName } from "@/lib/aria/core/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.provider) {
      return NextResponse.json({ error: "Missing provider name" }, { status: 400 });
    }

    const result = await testProviderConnection(body.provider as AriaProviderName);

    return NextResponse.json({
      provider: body.provider,
      ...result,
    });
  } catch (error: any) {
    const safe = sanitiseErrorForClient(error);
    return NextResponse.json({ error: safe.message, code: safe.code }, { status: error?.statusCode ?? 500 });
  }
}
