// ══════════════════════════════════════════════════════════════════════════════
// API — PRACTICE INTELLIGENCE: SESSION BUILDER
// GET  ?childId=x&type=y   → list sessions (filterable)
// GET  ?groups=true        → get session type groups
// POST { sessionType, ... }→ generate a new session
// PUT  { sessionId, action }→ approve or record delivery
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  generateSession,
  listGeneratedSessions,
  approveSession,
  recordSessionDelivery,
  getSessionTypeGroups,
} from "@/lib/practice-intelligence";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    if (searchParams.get("groups") === "true") {
      return NextResponse.json({ ok: true, data: getSessionTypeGroups() });
    }

    const sessions = await listGeneratedSessions({
      childId: searchParams.get("childId") ?? undefined,
      sessionType: (searchParams.get("type") as any) ?? undefined,
      status: searchParams.get("status") ?? undefined,
      limit: parseInt(searchParams.get("limit") ?? "20", 10),
    });

    return NextResponse.json({ ok: true, data: sessions });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionType, childId, framework, tone, additionalContext, createdBy } = body;

    if (!sessionType) {
      return NextResponse.json({ ok: false, error: "sessionType is required" }, { status: 400 });
    }

    const session = await generateSession({
      sessionType,
      childId,
      framework,
      tone,
      additionalContext,
      createdBy: createdBy ?? "system",
    });

    return NextResponse.json({ ok: true, data: session });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, action, approvedBy, deliveredBy, notes, followUpActions } = body;

    if (!sessionId) {
      return NextResponse.json({ ok: false, error: "sessionId is required" }, { status: 400 });
    }

    if (action === "approve") {
      const session = await approveSession(sessionId, approvedBy ?? "system");
      return NextResponse.json({ ok: true, data: session });
    }

    if (action === "record_delivery") {
      const session = await recordSessionDelivery(sessionId, deliveredBy ?? "system", notes, followUpActions);
      return NextResponse.json({ ok: true, data: session });
    }

    return NextResponse.json({ ok: false, error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
