import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeStaffRecognitionMorale,
  type StaffRecognitionInput,
} from "@/lib/engines/home-staff-recognition-morale-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const staff = store.staff ?? [];
  const today = new Date().toISOString().slice(0, 10);

  // Staff recognition records → StaffRecognitionInput[]
  const rawRecognitions = (store.staffRecognitionRecords as any[] ?? []);
  const recognitions: StaffRecognitionInput[] = rawRecognitions.map((r: any) => ({
    id: r.id ?? "",
    staff_member: r.staff_member ?? "",
    recognition_type: r.recognition_type ?? "above_and_beyond",
    recognised_by: r.recognised_by ?? "registered_manager",
    has_impact_description: !!(r.impact_description && r.impact_description.trim().length > 0),
    has_child_impact: !!(r.child_impact && r.child_impact.trim().length > 0),
    public_celebration: !!(r.public_celebration),
    child_contributed_nomination: !!(r.child_contributed_nomination),
    has_staff_response: !!(r.staff_response && r.staff_response.trim().length > 0),
    ways_marked_count: (r.way_marked ?? []).length,
  }));

  const result = computeStaffRecognitionMorale({
    today,
    total_staff: (staff as any[]).length,
    recognitions,
  });

  return NextResponse.json({ data: result });
}
