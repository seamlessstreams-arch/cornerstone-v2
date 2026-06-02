import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import {
  computeHomePlacementJourney,
  type PreAdmissionChecklistInput, type WarmWelcomePackInput, type WelcomeTourInput,
  type ReturnInterviewInput, type PlacementObjectiveInput, type PlacementAnniversaryInput,
} from "@/lib/engines/home-placement-journey-intelligence-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);

  const pre_admission_checklists: PreAdmissionChecklistInput[] = (store.preAdmissionChecklists as any[]).map((p: any) => ({
    id: p.id, child_id: p.child_id ?? "",
    completed_date: (p.referral_date ?? "").toString().slice(0, 10),
    risk_assessment_included: !!(p.risk_considerations?.length),
    all_sections_complete: p.status === "completed" || !!(p.items?.every?.((i: any) => i.completed)),
    placing_authority_consulted: !!(p.local_authority),
    child_visited_home: !!(p.impact_assessment_done),
  }));

  const warm_welcome_packs: WarmWelcomePackInput[] = (store.warmWelcomePacks as any[]).map((w: any) => ({
    id: w.id, child_id: w.child_id ?? "",
    provided_date: (w.preparedDate ?? w.admissionDate ?? "").toString().slice(0, 10),
    personalised: !!(w.personalTouches?.length),
    child_friendly: w.status === "delivered" || w.status === "completed" || !!(w.childFeedback),
    photos_included: !!(w.items?.some?.((i: any) => i.category === "photos" || i.item?.toLowerCase?.().includes?.("photo"))),
  }));

  const welcome_tours: WelcomeTourInput[] = (store.welcomeTours as any[]).map((t: any) => ({
    id: t.id, child_id: t.child_id ?? "",
    tour_date: (t.tourDate ?? t.arrivalDate ?? "").toString().slice(0, 10),
    completed: !!(t.toursteps?.length && t.toursteps.every((s: any) => s.shown)),
    child_feedback_captured: !!(t.bedroomFirstSighting || t.childChoseFirstActivity),
    buddy_assigned: !!(t.meetingChildrenDuringTour?.length),
  }));

  const return_interviews: ReturnInterviewInput[] = (store.returnInterviews as any[]).map((r: any) => ({
    id: r.id, child_id: r.child_id ?? "",
    date: (r.interview_date ?? r.return_date ?? "").toString().slice(0, 10),
    conducted_within_24h: r.interview_date && r.return_date
      ? Math.abs(new Date(r.interview_date).getTime() - new Date(r.return_date).getTime()) <= 86_400_000
      : false,
    child_views_recorded: !!(r.child_view_on_safety || r.what_would_help),
    actions_identified: r.actions_agreed?.length ?? 0,
    actions_completed: r.actions_agreed?.filter?.((a: any) => a.status === "completed")?.length ?? 0,
  }));

  const placement_objectives: PlacementObjectiveInput[] = (store.placementObjectives as any[]).map((o: any) => ({
    id: o.id, child_id: o.child_id ?? "",
    set_date: (o.start_date ?? o.created_at ?? "").toString().slice(0, 10),
    progress_status: o.current_status === "on_track" ? "on_track"
      : o.current_status === "achieved" ? "achieved"
      : o.current_status === "not_started" ? "not_started"
      : "behind",
    review_date: (o.review_date ?? "").toString().slice(0, 10),
    child_involved: !!(o.progress_notes),
  }));

  const placement_anniversaries: PlacementAnniversaryInput[] = (store.placementAnniversaryEntries as any[]).map((a: any) => ({
    id: a.id, child_id: a.child_id ?? "",
    anniversary_date: (a.date ?? "").toString().slice(0, 10),
    celebrated: !!(a.agreed_approach?.length),
    child_voice_captured: !!(a.reviewed_with_child),
    memory_box_updated: !!(a.remembrance_practices?.length),
  }));

  const result = computeHomePlacementJourney({
    today, pre_admission_checklists, warm_welcome_packs, welcome_tours,
    return_interviews, placement_objectives, placement_anniversaries,
    total_children: store.children?.length ?? 0,
  });

  return NextResponse.json({ data: result });
}
