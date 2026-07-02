// ══════════════════════════════════════════════════════════════════════════════
// CARA — RECORDING QUALITY API ROUTE
// GET /api/v1/recording-quality
//
// Scores the WRITING of the home's narrative records (daily logs, incidents,
// key-working) across six Ofsted-relevant dimensions, with per-record suggestions
// and a home-level QA view. Distinct from the record-quality (workflow) engine.
// ══════════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeRecordingQuality } from "@/lib/recording-quality/recording-quality-engine";
import { mapStoreToRecords } from "@/lib/recording-quality/store-records";

export async function GET() {
  const result = computeRecordingQuality({ records: mapStoreToRecords(getStore()) });
  return NextResponse.json({ data: result });
}
