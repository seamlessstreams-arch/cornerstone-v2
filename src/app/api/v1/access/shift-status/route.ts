import { NextRequest, NextResponse } from "next/server";
import { buildShiftAccessOverview } from "@/lib/permissions/shift-enforcement";

export const dynamic = "force-dynamic";

// GET /api/v1/access/shift-status[?preview=1]
//
// Runs the REAL permission engine for the acting user against the shift-sensitive
// operational capabilities, and reports what they can/can't do right now. Reflects
// whether shift-based enforcement is live (the SHIFT_BASED_ACCESS_ENFORCED flag).
//
// ?preview=1 computes the result as if enforcement were ON (display-only) so a
// manager can see exactly what general staff would lose off shift BEFORE enabling
// the flag. Preview never changes real access.
export async function GET(req: NextRequest) {
  const staffId = req.headers.get("x-user-id") || "staff_darren";
  const preview = req.nextUrl.searchParams.get("preview") === "1";
  const overview = buildShiftAccessOverview(staffId, { preview });
  return NextResponse.json({ data: overview });
}
