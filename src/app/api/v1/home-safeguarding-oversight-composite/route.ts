import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { computeSafeguardingOversight } from "@/lib/engines/home-safeguarding-oversight-composite-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = getStore();
  const children = store.youngPeople ?? [];
  const tc = (children as any[]).length;

  // Safeguarding referrals
  const sgRefs = (store.safeguardingReferrals as any[] ?? []);
  const sgResolved = sgRefs.filter((r: any) => r.status === "resolved" || r.status === "closed").length;
  const sgOpen = sgRefs.filter((r: any) => r.status === "open" || r.status === "active").length;

  // Safeguarding supervision
  const sgSup = (store.safeguardingSupervisionRecords as any[] ?? []);
  const sgSupCompleted = sgSup.filter((s: any) => s.completed || s.status === "completed").length;

  // Exploitation screenings
  const expScreenings = (store.exploitationScreenings as any[] ?? []);
  const expCompleted = expScreenings.filter((e: any) => e.completed || e.status === "completed").length;
  const expHighRisk = expScreenings.filter((e: any) => e.risk_level === "high" || e.outcome === "high").length;

  // Missing episodes
  const missing = (store.missingEpisodes as any[] ?? []);
  const withRI = missing.filter((m: any) => m.return_interview_completed || m.return_interview || m.ri_completed).length;
  const childMissingCounts: Record<string, number> = {};
  missing.forEach((m: any) => {
    const cid = m.child_id ?? m.young_person_id;
    if (cid) childMissingCounts[cid] = (childMissingCounts[cid] ?? 0) + 1;
  });
  const repeatMissing = Object.values(childMissingCounts).filter(c => c >= 2).length;

  // Restraints
  const restraints = (store.restraints as any[] ?? []);
  const restraintChildren = new Set(restraints.map((r: any) => r.child_id ?? r.young_person_id).filter(Boolean));
  const debriefs = restraints.filter((r: any) => r.debrief_completed || r.debrief || r.post_incident_debrief).length;

  // Incidents
  const incidents = store.incidents ?? [];
  const incArr = incidents as any[];
  const serious = incArr.filter((i: any) => i.severity === "serious" || i.severity === "major" || i.category === "serious").length;
  const withFollowup = incArr.filter((i: any) => i.followup_completed || i.follow_up_completed || i.resolved).length;

  // Notifiable events
  const notifiable = (store.notifiableEvents as any[] ?? []);
  const neOnTime = notifiable.filter((n: any) => n.reported_on_time || n.timely || n.status === "reported").length;

  // Disclosures
  const disclosures = (store.disclosures as any[] ?? []);
  const discActed = disclosures.filter((d: any) => d.acted_on || d.action_taken || d.status === "actioned").length;

  // LADO
  const lado = (store.ladoReferrals as any[] ?? []);
  const ladoResolved = lado.filter((l: any) => l.status === "resolved" || l.status === "closed").length;

  // Multi-agency
  const maMeetings = (store.multiAgencyMeetings as any[] ?? []);
  const maAttended = maMeetings.filter((m: any) => m.attended || m.status === "attended").length;

  // Contextual safeguarding
  const ctxRisks = (store.contextualSafeguardingRisks as any[] ?? []);
  const ctxMitigated = ctxRisks.filter((c: any) => c.mitigated || c.status === "mitigated" || c.status === "resolved").length;

  const result = computeSafeguardingOversight({
    today: new Date().toISOString().slice(0, 10),
    total_children: tc,
    safeguarding_referrals_total: sgRefs.length,
    safeguarding_referrals_resolved: sgResolved,
    safeguarding_referrals_open: sgOpen,
    safeguarding_supervision_sessions: sgSupCompleted,
    safeguarding_supervision_due: sgSup.length,
    exploitation_screenings_completed: expCompleted,
    exploitation_screenings_due: expScreenings.length,
    children_high_risk_exploitation: expHighRisk,
    missing_episodes_total: missing.length,
    missing_episodes_with_return_interview: withRI,
    children_with_repeat_missing: repeatMissing,
    restraint_incidents: restraints.length,
    children_with_restraints: restraintChildren.size,
    restraint_debrief_completed: debriefs,
    restraint_debrief_due: restraints.length,
    incidents_total: incArr.length,
    incidents_serious: serious,
    incidents_with_followup: withFollowup,
    notifiable_events_total: notifiable.length,
    notifiable_events_reported_on_time: neOnTime,
    disclosures_total: disclosures.length,
    disclosures_acted_on: discActed,
    lado_referrals: lado.length,
    lado_referrals_resolved: ladoResolved,
    multi_agency_meetings_attended: maAttended,
    multi_agency_meetings_due: maMeetings.length,
    contextual_risks_identified: ctxRisks.length,
    contextual_risks_mitigated: ctxMitigated,
  });

  return NextResponse.json({ data: result });
}
