// ══════════════════════════════════════════════════════════════════════════════
// API — PRACTICE INTELLIGENCE: LEARNING STUDIO
// GET  ?type=x&audience=y  → list resources (filterable)
// GET  ?groups=true        → get resource type groups
// POST { resourceType, ... }→ generate a new resource
// PUT  { resourceId, action }→ publish resource
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import {
  generateLearningResource,
  listLearningResources,
  publishLearningResource,
  getResourceTypeGroups,
} from "@/lib/practice-intelligence";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    if (searchParams.get("groups") === "true") {
      return NextResponse.json({ ok: true, data: getResourceTypeGroups() });
    }

    const resources = await listLearningResources({
      resourceType: (searchParams.get("type") as any) ?? undefined,
      targetAudience: searchParams.get("audience") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      limit: parseInt(searchParams.get("limit") ?? "20", 10),
    });

    return NextResponse.json({ ok: true, data: resources });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resourceType, topic, framework, tone, targetAudience, readingLevel, additionalContext, createdBy } = body;

    if (!resourceType || !topic) {
      return NextResponse.json({ ok: false, error: "resourceType and topic are required" }, { status: 400 });
    }

    const resource = await generateLearningResource({
      resourceType,
      topic,
      framework,
      tone,
      targetAudience,
      readingLevel,
      additionalContext,
      createdBy: createdBy ?? "system",
    });

    return NextResponse.json({ ok: true, data: resource });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { resourceId, action } = body;

    if (!resourceId) {
      return NextResponse.json({ ok: false, error: "resourceId is required" }, { status: 400 });
    }

    if (action === "publish") {
      const resource = await publishLearningResource(resourceId);
      return NextResponse.json({ ok: true, data: resource });
    }

    return NextResponse.json({ ok: false, error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
