import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeMissingEpisode } from "@/lib/engines/home-missing-episode-intelligence-engine";
import type { MissingEpisodeRecordInput } from "@/lib/engines/home-missing-episode-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const store = getStore();
    const raw = store.missingEpisodes as any[];
    const total_children = (store.youngPeople ?? []).length;
    const today = new Date().toISOString().slice(0, 10);

    const episodes: MissingEpisodeRecordInput[] = raw.map((r: any) => {
      const dateMissing = r.date_missing ? r.date_missing.toString().slice(0, 10) : "";
      const dateReturned = r.date_returned ? r.date_returned.toString().slice(0, 10) : "";
      const stillMissing = !dateReturned;

      // Compute return_interview_within_72hrs
      let within72 = false;
      if (r.return_interview_completed && r.return_interview_date && dateReturned) {
        const retDate = new Date(dateReturned);
        const intDate = new Date(r.return_interview_date.toString().slice(0, 10));
        const diffMs = intDate.getTime() - retDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        within72 = diffDays >= 0 && diffDays <= 3;
      }

      return {
        id: r.id,
        child_id: r.child_id || "",
        date_missing: dateMissing,
        date_returned: dateReturned,
        duration_hours: typeof r.duration_hours === "number" ? r.duration_hours : 0,
        risk_level: r.risk_level || "medium",
        reported_to_police: !!r.reported_to_police,
        reported_to_la: !!r.reported_to_la,
        return_interview_completed: !!r.return_interview_completed,
        return_interview_within_72hrs: within72,
        has_contextual_safeguarding_risk: !!r.contextual_safeguarding_risk,
        has_pattern_notes: !!(r.pattern_notes && r.pattern_notes.trim()),
        status: r.status || "closed",
        still_missing: stillMissing,
      };
    });

    const result = computeMissingEpisode({ today, total_children, episodes });
    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
