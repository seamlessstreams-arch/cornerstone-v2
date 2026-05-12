// ══════════════════════════════════════════════════════════════════════════════
// API: /api/aria/usage
// GET — returns ARIA usage details for a specific source record. Used by the
// AriaUsageBadge component to show what ARIA commands were used on a record.
// ══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { getAriaUsageForRecord } from "@/lib/aria/aria-smart-linking";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sourceTable = url.searchParams.get("sourceTable") ?? "";
  const recordId = url.searchParams.get("recordId") ?? "";

  if (!sourceTable || !recordId) {
    return NextResponse.json(
      { error: "sourceTable and recordId query params are required" },
      { status: 400 },
    );
  }

  const usages = await getAriaUsageForRecord(sourceTable, recordId);
  return NextResponse.json({ data: usages });
}
