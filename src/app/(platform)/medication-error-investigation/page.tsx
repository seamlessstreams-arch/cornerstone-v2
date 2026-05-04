"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ArrowUpDown, Pill, AlertTriangle, CheckCircle, Heart, Lightbulb } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MedicationError {
  id: string;
  dateOfError: string;
  dateDiscovered: string;
  youngPerson: string;
  errorType: "Wrong dose given" | "Wrong medication given" | "Wrong time" | "Missed dose" | "Double dose" | "Wrong patient (averted before given)" | "Allergy ignored" | "Recording error" | "Omission";
  staffInvolved: string;
  errorSeverity: "No harm" | "Minor harm" | "Moderate harm" | "Major harm — referred for medical review";
  childImpactObserved: string;
  immediateActionsTaken: string[];
  gpConsulted: boolean;
  gpAdvice: string;
  parentLAInformed: boolean;
  childInformedAgeAppropriately: boolean;
  childResponse: string;
  rootCauseAnalysis: string;
  contributingFactors: string[];
  systemicChanges: string[];
  trainingArising: string[];
  policyArising: string;
  staffEmotionalImpact: string;
  debriefHeld: boolean;
  debriefDate: string;
  ofstedNotificationRequired: boolean;
  ofstedNotificationDate: string;
  status: "Investigating" | "Closed - resolved" | "Reported - monitoring";
  preventiveActionEmbedded: boolean;
  reviewedBy: string;
  notes: string;
}

const d = (n: number) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };

const data: MedicationError[] = [
  {
    id: "mei-001", dateOfError: d(-30), dateDiscovered: d(-30), youngPerson: "yp_jordan", errorType: "Missed dose", staffInvolved: "staff_lackson",
    errorSeverity: "No harm",
    childImpactObserved: "No physical impact. Jordan flagged it himself ('I haven't had my inhaler check in this morning').",
    immediateActionsTaken: ["Inhaler check immediately performed", "MAR sheet retrospectively completed with note", "GP advised — no clinical action needed", "Acknowledged with Jordan calmly"],
    gpConsulted: true, gpAdvice: "No clinical concern; resume normal schedule",
    parentLAInformed: true, childInformedAgeAppropriately: true,
    childResponse: "Jordan said: 'No big deal — better to know.' Felt empowered by raising it.",
    rootCauseAnalysis: "Morning shift handover missed mention of preventive inhaler check (not given as routine medication, given as morning check). Process gap, not staff failure.",
    contributingFactors: ["Inhaler check is technically a check, not a dose — sat outside MAR sheet", "Verbal handover only — written prompt not in place"],
    systemicChanges: ["Inhaler check added to MAR sheet as named 'check' item", "Visual prompt in office for morning checks", "Handover template updated"],
    trainingArising: ["Brief team meeting on procedural change"],
    policyArising: "Medication policy v3.4 — checks now formally part of MAR",
    staffEmotionalImpact: "Lackson reflective; appreciated blame-free approach. No carry-over anxiety.",
    debriefHeld: true, debriefDate: d(-29),
    ofstedNotificationRequired: false, ofstedNotificationDate: "",
    status: "Closed - resolved", preventiveActionEmbedded: true,
    reviewedBy: "staff_darren",
    notes: "Excellent example of just-culture investigation. Process changed; no individual blame.",
  },
  {
    id: "mei-002", dateOfError: d(-90), dateDiscovered: d(-89), youngPerson: "yp_alex", errorType: "Recording error", staffInvolved: "staff_ryan",
    errorSeverity: "No harm",
    childImpactObserved: "No clinical impact — medication was given correctly. Recording error only.",
    immediateActionsTaken: ["MAR sheet review and correction with date stamp", "Confirmation Alex received correct dose", "Reflective conversation with Ryan"],
    gpConsulted: false, gpAdvice: "",
    parentLAInformed: false, childInformedAgeAppropriately: false,
    childResponse: "Not informed — no impact on Alex; recording-only issue",
    rootCauseAnalysis: "Multiple medication times in evening; Ryan signed for one entry but accidentally on wrong row of MAR sheet.",
    contributingFactors: ["MAR layout — closely-spaced rows", "End-of-shift fatigue", "No witness countersign for non-controlled drugs"],
    systemicChanges: ["MAR sheet redesigned with clearer row separation", "Considering electronic MAR for future"],
    trainingArising: ["Refresher on MAR completion at next team meeting"],
    policyArising: "MAR policy unchanged; design improved",
    staffEmotionalImpact: "Ryan was conscientious about it. Reflective practice supported his ownership without shame.",
    debriefHeld: true, debriefDate: d(-88),
    ofstedNotificationRequired: false, ofstedNotificationDate: "",
    status: "Closed - resolved", preventiveActionEmbedded: true,
    reviewedBy: "staff_darren",
    notes: "Recording error caught quickly. System improved. Ryan continues full medication duties.",
  },
  {
    id: "mei-003", dateOfError: d(-180), dateDiscovered: d(-180), youngPerson: "yp_casey", errorType: "Wrong dose given", staffInvolved: "staff_mirela",
    errorSeverity: "Minor harm",
    childImpactObserved: "Casey received melatonin slightly later AND a half-dose extra (2.5mg instead of 2mg) due to confusion over a recent prescription change. Mild grogginess next morning beyond usual.",
    immediateActionsTaken: ["GP called immediately for advice", "Casey monitored overnight with extra welfare checks (2-hourly)", "Anna informed and took on next-day care", "Incident report begun within 1 hour"],
    gpConsulted: true, gpAdvice: "0.5mg over-dose of melatonin clinically minor; monitor for grogginess; resume correct dose next evening; no other action needed",
    parentLAInformed: true, childInformedAgeAppropriately: true,
    childResponse: "Anna explained using visual cards: 'medication mistake, you're safe, we made it right'. Casey nodded; no distress.",
    rootCauseAnalysis: "Recent prescription change reduced dose from 2.5mg to 2mg. Mirela was new to medication on this shift; old MAR template still in folder briefly. Process gap.",
    contributingFactors: ["Prescription change just 3 days prior", "Old MAR sheet still in folder (transition period)", "Mirela's first solo medication shift", "No double-check process at the time"],
    systemicChanges: ["Old MAR sheets removed immediately on prescription change (zero-tolerance)", "New medication = mandatory second-staff witness for first 7 days", "Prescription change protocol formalised with checklist", "Visual flag on changed medications"],
    trainingArising: ["Whole team briefing on prescription change protocol", "Mirela received 1:1 reflective supervision (supportive, not punitive)"],
    policyArising: "Medication Policy v3.3 — prescription change handover protocol added",
    staffEmotionalImpact: "Mirela visibly upset; Anna and RM provided strong supportive response. Reflective supervision over multiple sessions. Mirela returned to medication duties confidently after embedding new protocol.",
    debriefHeld: true, debriefDate: d(-178),
    ofstedNotificationRequired: true, ofstedNotificationDate: d(-178),
    status: "Closed - resolved", preventiveActionEmbedded: true,
    reviewedBy: "staff_darren",
    notes: "Notification handled professionally. Ofsted acknowledged thoroughness of investigation. Significant systemic improvement resulted. Mirela's confidence rebuilt with care. Just-culture demonstrated.",
  },
];

const severityColour: Record<string, string> = {
  "No harm": "bg-green-100 text-green-800",
  "Minor harm": "bg-amber-100 text-amber-800",
  "Moderate harm": "bg-orange-100 text-orange-800",
  "Major harm — referred for medical review": "bg-red-100 text-red-800",
};

const statusColour: Record<string, string> = {
  Investigating: "bg-blue-100 text-blue-800",
  "Closed - resolved": "bg-green-100 text-green-800",
  "Reported - monitoring": "bg-purple-100 text-purple-800",
};

const exportCols: ExportColumn<MedicationError>[] = [
  { header: "Date", accessor: (r: MedicationError) => r.dateOfError },
  { header: "Child", accessor: (r: MedicationError) => getYPName(r.youngPerson) },
  { header: "Error Type", accessor: (r: MedicationError) => r.errorType },
  { header: "Staff", accessor: (r: MedicationError) => getStaffName(r.staffInvolved) },
  { header: "Severity", accessor: (r: MedicationError) => r.errorSeverity },
  { header: "Status", accessor: (r: MedicationError) => r.status },
  { header: "Ofsted Notified", accessor: (r: MedicationError) => r.ofstedNotificationRequired ? "Yes" : "No" },
  { header: "Embedded", accessor: (r: MedicationError) => r.preventiveActionEmbedded ? "Yes" : "No" },
];

export default function MedicationErrorInvestigationPage() {
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterSeverity !== "all") items = items.filter((e) => e.errorSeverity === filterSeverity);
    if (filterStatus !== "all") items = items.filter((e) => e.status === filterStatus);
    items.sort((a, b) => sortBy === "date" ? b.dateOfError.localeCompare(a.dateOfError) : 0);
    return items;
  }, [filterSeverity, filterStatus, sortBy]);

  const total = data.length;
  const noHarm = data.filter((e) => e.errorSeverity === "No harm").length;
  const ofstedNotified = data.filter((e) => e.ofstedNotificationRequired).length;
  const embedded = data.filter((e) => e.preventiveActionEmbedded).length;

  return (
    <PageShell title="Medication Error Investigation" subtitle="Where harm or near-harm occurred — investigated through just-culture lens, learning embedded"
      actions={<div className="flex items-center gap-2"><ExportButton data={data} columns={exportCols} filename="medication-error-investigation" /><PrintButton title="Medication Error Investigation" /></div>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center"><p className="text-2xl font-bold">{total}</p><p className="text-xs text-muted-foreground">Investigations</p></div>
        <div className="rounded-xl border bg-white p-4 text-center"><p className="text-2xl font-bold text-green-600">{noHarm}/{total}</p><p className="text-xs text-muted-foreground">No Harm</p></div>
        <div className="rounded-xl border bg-white p-4 text-center"><p className="text-2xl font-bold text-purple-600">{ofstedNotified}</p><p className="text-xs text-muted-foreground">Ofsted Notified</p></div>
        <div className="rounded-xl border bg-white p-4 text-center"><p className="text-2xl font-bold text-blue-600">{embedded}/{total}</p><p className="text-xs text-muted-foreground">Embedded Learning</p></div>
      </div>
      <div className="rounded-lg bg-purple-50 border border-purple-200 p-3 mb-6 flex items-start gap-2">
        <Lightbulb className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
        <p className="text-sm text-purple-800">Just-culture investigation. Errors investigated for systemic causes — not blamed on individuals. Staff supported; learning embedded; child kept safe and informed appropriately. Distinct from near-misses (caught before harm).</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterSeverity} onValueChange={setFilterSeverity}><SelectTrigger className="w-[180px]"><SelectValue placeholder="All Severity" /></SelectTrigger><SelectContent><SelectItem value="all">All Severities</SelectItem>{(["No harm","Minor harm","Moderate harm","Major harm — referred for medical review"]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-[180px]"><SelectValue placeholder="All Statuses" /></SelectTrigger><SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="Investigating">Investigating</SelectItem><SelectItem value="Closed - resolved">Closed</SelectItem><SelectItem value="Reported - monitoring">Monitoring</SelectItem></SelectContent></Select>
        <div className="flex items-center gap-1"><ArrowUpDown className="h-4 w-4 text-muted-foreground" /><Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="date">Most Recent</SelectItem></SelectContent></Select></div>
      </div>
      <div className="space-y-3">
        {filtered.map((e) => {
          const isExpanded = expandedId === e.id;
          return (
            <div key={e.id} className="rounded-xl border bg-white overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors" onClick={() => setExpandedId(isExpanded ? null : e.id)}>
                <div className="flex items-center gap-3 flex-1 min-w-0"><Pill className="h-5 w-5 text-purple-600 shrink-0" /><div className="min-w-0"><p className="font-medium truncate">{getYPName(e.youngPerson)} — {e.errorType}</p><p className="text-xs text-muted-foreground mt-0.5">{e.dateOfError} &middot; Staff: {getStaffName(e.staffInvolved)}</p></div></div>
                <div className="flex items-center gap-2 shrink-0 ml-3"><span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", severityColour[e.errorSeverity])}>{e.errorSeverity}</span><span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", statusColour[e.status])}>{e.status}</span>{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</div>
              </button>
              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-3 text-sm">
                  <div className="bg-amber-50 rounded-lg p-3"><p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1"><AlertTriangle className="h-3 w-3 inline mr-1" />Child Impact</p><p>{e.childImpactObserved}</p></div>
                  <div className="bg-blue-50 rounded-lg p-3"><p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Immediate Actions Taken</p><ul className="space-y-1">{e.immediateActionsTaken.map((a, i) => <li key={i} className="flex items-start gap-1"><CheckCircle className="h-3 w-3 text-blue-500 mt-1 shrink-0" /><span>{a}</span></li>)}</ul></div>
                  <div className="bg-purple-50 rounded-lg p-3"><p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1"><Lightbulb className="h-3 w-3 inline mr-1" />Root Cause Analysis</p><p>{e.rootCauseAnalysis}</p></div>
                  {e.contributingFactors.length > 0 && <div><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Contributing Factors</p><ul className="space-y-1">{e.contributingFactors.map((f, i) => <li key={i} className="flex items-start gap-1"><span className="text-amber-600 mt-0.5">•</span><span>{f}</span></li>)}</ul></div>}
                  <div className="bg-emerald-50 rounded-lg p-3"><p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">Systemic Changes</p><ul className="space-y-1">{e.systemicChanges.map((c, i) => <li key={i} className="flex items-start gap-1"><CheckCircle className="h-3 w-3 text-emerald-500 mt-1 shrink-0" /><span>{c}</span></li>)}</ul></div>
                  <div className="bg-pink-50 rounded-lg p-3"><p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1"><Heart className="h-3 w-3 inline mr-1" />Staff Emotional Impact &amp; Support</p><p>{e.staffEmotionalImpact}</p></div>
                  {e.childInformedAgeAppropriately && <div className="bg-blue-50 rounded-lg p-3"><p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Child&apos;s Response</p><p>{e.childResponse}</p></div>}
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span>GP consulted: {e.gpConsulted ? "Yes" : "No"}</span>
                    <span>LA informed: {e.parentLAInformed ? "Yes" : "No"}</span>
                    {e.ofstedNotificationRequired && <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium">Ofsted notified {e.ofstedNotificationDate}</span>}
                    {e.preventiveActionEmbedded && <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">Embedded</span>}
                    <span>Reviewed: {getStaffName(e.reviewedBy)}</span>
                  </div>
                  {e.notes && <div className="bg-slate-50 rounded-lg p-3 border"><p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">Notes</p><p>{e.notes}</p></div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-8 rounded-lg bg-muted/50 border p-4"><p className="text-xs text-muted-foreground"><strong>Regulatory Context:</strong> Medication errors investigated per CQC standards, NICE NG5, and Reg 40 (notification where required). Just-culture lens. Linked to Medication Near-Miss Log, MAR Sheet, and Lessons Learned Register.</p></div>
    </PageShell>
  );
}
