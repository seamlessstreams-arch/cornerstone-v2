import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import type {
  EvidenceSection,
  InspectionEvidenceAnalysis,
  SignalColour,
} from "@/lib/cara-visual-toolkit/types";

export const dynamic = "force-dynamic";

function daysBetween(a: string, b: string): number {
  const d1 = new Date(a).getTime();
  const d2 = new Date(b).getTime();
  if (isNaN(d1) || isNaN(d2)) return 0;
  return Math.round(Math.abs(d1 - d2) / 86_400_000);
}

function sig(score: number): SignalColour {
  if (score >= 3) return "green";
  if (score >= 2) return "amber";
  return "red";
}

export async function GET() {
  const store = getStore();
  const today = new Date().toISOString().slice(0, 10);
  const thirtyAgo = new Date(new Date().getTime() - 30 * 86_400_000).toISOString().slice(0, 10);
  const ninetyAgo = new Date(new Date().getTime() - 90 * 86_400_000).toISOString().slice(0, 10);

  const youngPeople = (store.youngPeople as any[]) ?? [];
  const incidents = (store.incidents as any[]) ?? [];
  const keyWorkingSessions = (store.keyWorkingSessions as any[]) ?? [];
  const staff = (store.staff as any[]) ?? [];
  const trainingRecords = (store.trainingRecords as any[]) ?? [];
  const reflectiveSupervisions = (store.reflectiveSupervisions as any[]) ?? [];
  const reg44 = (store.reg44VisitReports as any[]) ?? [];
  const riskAssessments = (store.riskAssessments as any[]) ?? [];
  const missingEpisodes = (store.missingEpisodes as any[]) ?? [];
  const debriefs = (store.debriefRecords as any[]) ?? [];

  const activeChildren = youngPeople.filter(
    (y: any) => y.status !== "moved_on" && y.status !== "discharged"
  );
  const activeStaff = staff.filter(
    (s: any) => s.employment_status !== "left" && s.is_active !== false
  );

  // ── Section 1: Children's outcomes and experiences ─────────────────────
  const recentKW = keyWorkingSessions.filter((k: any) => (k.date ?? "") >= thirtyAgo);
  const voiceCount = keyWorkingSessions.filter(
    (k: any) => k.child_voice && String(k.child_voice).trim().length > 10
  ).length;
  let s1 = 0;
  if (recentKW.length > 0) s1++;
  if (voiceCount > 0) s1++;
  if (activeChildren.length > 0 && new Set(recentKW.map((k: any) => k.child_id)).size >= activeChildren.length * 0.7) s1++;
  const section1: EvidenceSection = {
    id: "outcomes",
    title: "Children's outcomes and experiences",
    regulatoryRef: "CHR 2015 Reg 6, 7; UN CRC Article 12; Ofsted SCCIF",
    signal: sig(s1),
    keyFindings: [
      `${recentKW.length} key work sessions in last 30 days across ${new Set(recentKW.map((k: any) => k.child_id)).size} children`,
      `${voiceCount} sessions with child voice recorded`,
    ],
    evidenceStrengths: [
      recentKW.length > 0 ? "Regular key work sessions demonstrating relational practice" : "",
      voiceCount > 0 ? "Child voice is being recorded in key work" : "",
    ].filter(Boolean),
    gaps: [
      voiceCount === 0 ? "No child voice recorded in key work sessions — this will be a significant concern for Ofsted" : "",
      activeChildren.length > 0 && new Set(recentKW.map((k: any) => k.child_id)).size < activeChildren.length * 0.7
        ? "Not all children have had recent key work"
        : "",
    ].filter(Boolean),
  };

  // ── Section 2: Safeguarding ───────────────────────────────────────────
  const openCritical = incidents.filter(
    (i: any) => i.severity === "critical" && i.status !== "closed"
  ).length;
  const missingWithRHI = missingEpisodes.filter(
    (m: any) => !m.current_missing && m.return_interview_completed === true
  ).length;
  const totalReturned = missingEpisodes.filter((m: any) => !m.current_missing).length;
  const rhiRate = totalReturned > 0 ? Math.round((missingWithRHI / totalReturned) * 100) : 100;
  let s2 = 0;
  if (openCritical === 0) s2++;
  if (rhiRate >= 80) s2++;
  if (riskAssessments.filter((r: any) => r.status !== "closed").length > 0) s2++;
  const section2: EvidenceSection = {
    id: "safeguarding",
    title: "Safeguarding",
    regulatoryRef: "CHR 2015 Reg 12, 34, 40; Working Together 2023; Ofsted SCCIF",
    signal: sig(s2),
    keyFindings: [
      `${incidents.length} incidents on record`,
      `Return home interview completion rate: ${rhiRate}%`,
      `${riskAssessments.filter((r: any) => r.status !== "closed").length} active risk assessments`,
    ],
    evidenceStrengths: [
      openCritical === 0 ? "No open critical incidents" : "",
      rhiRate === 100 && totalReturned > 0 ? "100% return home interview completion" : "",
    ].filter(Boolean),
    gaps: [
      openCritical > 0 ? `${openCritical} critical incident${openCritical > 1 ? "s" : ""} still open` : "",
      rhiRate < 80 ? `Return home interview completion rate is ${rhiRate}% (below 80%)` : "",
    ].filter(Boolean),
  };

  // ── Section 3: Quality of care ─────────────────────────────────────────
  const debriefRate = incidents.length > 0
    ? Math.round((debriefs.filter((d: any) => d.linked_incident_id).length / incidents.length) * 100)
    : 100;
  const latestReg44 = reg44.sort((a: any, b: any) =>
    (b.visit_date ?? "").localeCompare(a.visit_date ?? "")
  )[0];
  const reg44Age = latestReg44?.visit_date ? daysBetween(today, latestReg44.visit_date) : 999;
  let s3 = 0;
  if (reg44.length > 0 && reg44Age <= 28) s3++;
  if (latestReg44?.overall_judgement === "good" || latestReg44?.overall_judgement === "outstanding") s3++;
  if (debriefRate >= 60) s3++;
  const section3: EvidenceSection = {
    id: "quality_of_care",
    title: "Quality of care",
    regulatoryRef: "CHR 2015 Reg 44, 45; Ofsted SCCIF",
    signal: sig(s3),
    keyFindings: [
      latestReg44 ? `Most recent Reg 44: ${latestReg44.visit_date} — ${latestReg44.overall_judgement ?? "no judgement"}` : "No Reg 44 visits recorded",
      `Post-incident debrief completion: ${debriefRate}%`,
    ],
    evidenceStrengths: [
      reg44Age <= 28 ? "Reg 44 visits are within the statutory 28-day requirement" : "",
      latestReg44?.overall_judgement === "good" ? "Most recent Reg 44 judgement is good" : "",
      debriefRate >= 80 ? "Strong post-incident debrief completion rate" : "",
    ].filter(Boolean),
    gaps: [
      reg44Age > 28 ? `Reg 44 visit is overdue (${reg44Age < 999 ? `${reg44Age} days` : "no visits on record"})` : "",
      debriefRate < 60 ? `Post-incident debrief rate is low (${debriefRate}%)` : "",
    ].filter(Boolean),
  };

  // ── Section 4: Leadership, management and governance ──────────────────
  const supCoverage = activeStaff.length > 0
    ? Math.round(
        (new Set(
          reflectiveSupervisions
            .filter((s: any) => (s.date ?? "") >= ninetyAgo)
            .map((s: any) => s.staff_id)
        ).size /
          activeStaff.length) *
          100
      )
    : 100;
  const mandatory = trainingRecords.filter((t: any) => t.is_mandatory === true);
  const compliant = mandatory.filter(
    (t: any) => t.status === "completed" && (!t.expiry_date || t.expiry_date >= today)
  );
  const trainingRate = mandatory.length > 0 ? Math.round((compliant.length / mandatory.length) * 100) : 100;
  let s4 = 0;
  if (supCoverage >= 80) s4++;
  if (trainingRate >= 80) s4++;
  if (activeStaff.length > 0) s4++;
  const section4: EvidenceSection = {
    id: "leadership",
    title: "Leadership, management and governance",
    regulatoryRef: "CHR 2015 Reg 32, 33, 34, 44; Ofsted SCCIF",
    signal: sig(s4),
    keyFindings: [
      `Supervision coverage (90 days): ${supCoverage}%`,
      `Mandatory training compliance: ${trainingRate}%`,
      `Active workforce: ${activeStaff.length} staff`,
    ],
    evidenceStrengths: [
      supCoverage >= 80 ? `${supCoverage}% of staff have had supervision in the last 90 days` : "",
      trainingRate === 100 ? "Full mandatory training compliance across the workforce" : "",
    ].filter(Boolean),
    gaps: [
      supCoverage < 80 ? `Only ${supCoverage}% of staff have had supervision in the last 90 days` : "",
      trainingRate < 80 ? `Mandatory training compliance is ${trainingRate}% — below 80%` : "",
    ].filter(Boolean),
  };

  // ── Section 5: Children's wishes and feelings ─────────────────────────
  const wishesFeelings = keyWorkingSessions.filter(
    (k: any) => k.child_voice && String(k.child_voice).trim().length > 20
  ).length;
  const childrenWithVoice = new Set(
    keyWorkingSessions
      .filter((k: any) => k.child_voice && String(k.child_voice).trim().length > 20)
      .map((k: any) => k.child_id)
  ).size;
  let s5 = 0;
  if (wishesFeelings > 0) s5++;
  if (childrenWithVoice >= Math.ceil(activeChildren.length * 0.5)) s5++;
  if (childrenWithVoice >= activeChildren.length) s5++;
  const section5: EvidenceSection = {
    id: "wishes_feelings",
    title: "Children's wishes and feelings",
    regulatoryRef: "CHR 2015 Reg 7; UN CRC Article 12; Ofsted SCCIF",
    signal: sig(s5),
    keyFindings: [
      `${wishesFeelings} sessions with wishes and feelings recorded`,
      `${childrenWithVoice} of ${activeChildren.length} children have voice in records`,
    ],
    evidenceStrengths: [
      childrenWithVoice === activeChildren.length && activeChildren.length > 0
        ? "All children have wishes and feelings recorded in key work"
        : "",
      wishesFeelings > 5 ? "Regular recording of children's perspective" : "",
    ].filter(Boolean),
    gaps: [
      childrenWithVoice < activeChildren.length
        ? `${activeChildren.length - childrenWithVoice} children do not have wishes and feelings recorded`
        : "",
      wishesFeelings === 0 ? "No wishes and feelings recorded — Ofsted will ask children directly" : "",
    ].filter(Boolean),
  };

  const sections = [section1, section2, section3, section4, section5];
  const greenSections = sections.filter((s) => s.signal === "green").length;
  const amberSections = sections.filter((s) => s.signal === "amber").length;
  const redSections = sections.filter((s) => s.signal === "red").length;

  const overallReadiness: SignalColour =
    redSections >= 2 ? "red" : redSections > 0 || amberSections >= 3 ? "amber" : "green";
  const readinessLabel =
    overallReadiness === "green"
      ? "Good evidence base — continue building"
      : overallReadiness === "amber"
      ? "Some gaps identified — action needed before inspection"
      : "Significant gaps — prioritise immediately";

  const priorityActions = sections
    .filter((s) => s.signal !== "green")
    .flatMap((s) => s.gaps)
    .filter(Boolean)
    .slice(0, 8);

  const result: InspectionEvidenceAnalysis = {
    overallReadiness,
    readinessLabel,
    greenSections,
    amberSections,
    redSections,
    sections,
    priorityActions,
    regulatoryNote:
      "This tool provides a snapshot of inspection readiness based on current records. It does not replace the Registered Manager's own self-evaluation or Reg 44 / Reg 45 processes. Ofsted inspections are evidence-based — every finding in this tool should be traceable to records.",
  };

  return NextResponse.json({ data: result });
}
