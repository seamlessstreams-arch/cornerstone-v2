import { NextRequest, NextResponse } from "next/server";
import { LEGACY_HANDLERS } from "@/lib/legacy-api/dispatcher";

export const dynamic = "force-dynamic";

function resolveHandler(segments: string[]) {
  return LEGACY_HANDLERS[segments.join("/")];
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ segments: string[] }> },
) {
  try {
    const { segments } = await ctx.params;
    const handler = resolveHandler(segments);
    if (!handler?.GET) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return handler.GET(req);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ segments: string[] }> },
) {
  try {
    const { segments } = await ctx.params;
    const handler = resolveHandler(segments);
    if (!handler?.POST) return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    return handler.POST(req);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
