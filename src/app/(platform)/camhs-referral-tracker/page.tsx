"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Brain,
  ArrowUpDown,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HeartHandshake,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { cn } from "@/lib/utils";
import { getYPName, getStaffName } from "@/lib/seed-data";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

/* ── types ─────────────────────────────────────────────────────────────── */

type Pathway = "Standard CAMHS" | "ASD/Neurodevelopmental" | "Trauma-focused" | "Crisis" | "Routine";
type Urgency = "Routine" | "Soon" | "Urgent" | "Emergency";
type ReferralStatus = "Submitted" | "Triaged" | "On waiting list" | "Active engagement" | "Discharged" | "Re-referred";
type EngagementLevel = "Strong" | "Building" | "Inconsistent" | "Disengaged";

interface CamhsReferral {
  id: string;
  youngPerson: string;
  referralDate: string;
  referralReason: string;
  referrer: string;
  pathwayApplied: Pathway;
  urgency: Urgency;
  referralStatus: ReferralStatus;
  waitingTimeWeeks: number;
  firstAppointmentDate: string | null;
  currentClinician: string;
  currentTherapeuticApproach: string;
  sessionsHeld: number;
  sessionsScheduled: number;
  currentEngagementLevel: EngagementLevel;
  childView: string;
  parentalConsent: boolean;
  referralOutcome: string;
  reviewedDate: string;
  nextReviewDate: string;
  escalationOptions: string;
}

/* ── seed ──────────────────────────────────────────────────────────────── */

const d = (n: number) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };

const SEED: CamhsReferral[] = [
  {
    id: "camhs1",
    youngPerson: "yp_alex",
    referralDate: d(-180),
    referralReason: "Following placement at Oak House and disclosure of pre-care trauma, Alex presented with intrusive memories, hypervigilance and sleep disturbance. SDQ scores indicated elevated emotional and conduct symptoms. RM and GP made joint referral for trauma-focused therapeutic intervention.",
    referrer: "staff_darren",
    pathwayApplied: "Trauma-focused",
    urgency: "Soon",
    referralStatus: "Active engagement",
    waitingTimeWeeks: 11,
    firstAppointmentDate: d(-103),
    currentClinician: "Dr Helena Markham (Clinical Psychologist) — Specialist Trauma CAMHS Team",
    currentTherapeuticApproach: "EMDR (Eye Movement Desensitisation and Reprocessing) following stabilisation phase. Initial sessions focused on resourcing, grounding techniques and emotional literacy. Now moving into reprocessing of identified target memories. Sessions weekly, 60 minutes, attended at the CAMHS clinic with key worker transport.",
    sessionsHeld: 14,
    sessionsScheduled: 6,
    currentEngagementLevel: "Strong",
    childView: "Going to therapy was scary at first but Helena is really kind. She doesn't make me talk about everything straight away. The eye movement stuff is weird but it actually helps — the bad memories don't feel as loud now. I want to keep going.",
    parentalConsent: true,
    referralOutcome: "Working diagnosis: Complex PTSD (provisional) with co-morbid sleep disturbance. Treatment plan: 8-phase EMDR protocol, currently phase 4 (desensitisation). Anticipated total course 24-30 sessions. Sleep hygiene plan in place at the home.",
    reviewedDate: d(-21),
    nextReviewDate: d(63),
    escalationOptions: "Direct line to clinician for crisis. CAMHS Crisis Team (out-of-hours) details held by waking night staff. Escalation pathway documented in Alex's risk management plan. SW notified of all reviews.",
  },
  {
    id: "camhs2",
    youngPerson: "yp_jordan",
    referralDate: d(-140),
    referralReason: "Referral following persistent low mood, social withdrawal and self-reported anxiety in school. Concerns also raised about emerging difficulties around emotional regulation following the online safety incident. SDQ and Mood and Feelings Questionnaire (MFQ) completed by key worker — both indicated clinical-range scores warranting CAMHS assessment.",
    referrer: "staff_darren",
    pathwayApplied: "Standard CAMHS",
    urgency: "Routine",
    referralStatus: "Active engagement",
    waitingTimeWeeks: 18,
    firstAppointmentDate: d(-14),
    currentClinician: "Sarah Adesina (CAMHS Practitioner) — Generic CAMHS Team",
    currentTherapeuticApproach: "Initial assessment completed. Moving into low-intensity CBT (cognitive behavioural therapy) focused on mood, anxiety and emotional regulation. Sessions fortnightly at the home (Jordan's preference) for first 6 sessions, then to be reviewed. Psychoeducation materials shared with key worker to reinforce between sessions.",
    sessionsHeld: 2,
    sessionsScheduled: 4,
    currentEngagementLevel: "Building",
    childView: "I thought CAMHS would be like school counsellors but Sarah is alright. She comes here so I don't have to go anywhere weird. I haven't said much yet but I don't hate it. Some of the stuff she explains makes sense — like why my chest goes tight.",
    parentalConsent: true,
    referralOutcome: "Assessment outcome: Mixed anxiety and depressive symptoms — does not currently meet threshold for specific diagnosis. Treatment plan: 8-12 sessions low-intensity CBT, with review at session 6. Home to support psychoeducation tasks between sessions.",
    reviewedDate: d(-7),
    nextReviewDate: d(35),
    escalationOptions: "Crisis number issued to home and held in office. Key worker to monitor mood weekly using Wellbeing Scale. If deterioration, RM to escalate via Sarah Adesina or directly to CAMHS duty desk. Same-day GP appointment as fallback.",
  },
  {
    id: "camhs3",
    youngPerson: "yp_casey",
    referralDate: d(-540),
    referralReason: "Referral made by previous placement at age 14 due to long-standing social communication difficulties, sensory sensitivities and rigid thinking patterns. Initial referral was for neurodevelopmental assessment. Casey transferred to Oak House mid-pathway and the referral was followed up by current RM to ensure continuity.",
    referrer: "staff_anna",
    pathwayApplied: "ASD/Neurodevelopmental",
    urgency: "Routine",
    referralStatus: "Active engagement",
    waitingTimeWeeks: 42,
    firstAppointmentDate: d(-246),
    currentClinician: "Dr Imran Qureshi (Consultant Child Psychiatrist) and Lara Tomlinson (Specialist OT) — Neurodevelopmental Pathway",
    currentTherapeuticApproach: "Diagnostic assessment completed (ADOS-2, ADI-R, sensory profile). Casey received a diagnosis of Autism Spectrum Condition. Post-diagnostic support now in place: monthly OT-led sensory regulation sessions, and 6-weekly psychiatry review. Home implementing recommended environmental adaptations (low-stimulation zones, predictable routines, visual schedules).",
    sessionsHeld: 22,
    sessionsScheduled: 3,
    currentEngagementLevel: "Strong",
    childView: "Getting the diagnosis made things make sense. I'm not weird, my brain just works differently. Lara helps me with the sensory stuff — like why I hate certain lights. I like that the home has changed things to make it easier for me. I want to keep seeing them after I turn 18.",
    parentalConsent: true,
    referralOutcome: "Confirmed diagnosis: Autism Spectrum Condition (ICD-11: 6A02). Co-occurring sensory processing difficulties. Treatment plan: ongoing post-diagnostic support, sensory regulation programme, transition planning with adult ASD services initiated 6 months pre-18. EHCP review requested.",
    reviewedDate: d(-30),
    nextReviewDate: d(12),
    escalationOptions: "Crisis support via CAMHS duty for any acute presentation. Casey has named clinician for direct contact. Pre-18 transition pathway agreed with Adult Mental Health Services to prevent gap in care.",
  },
  {
    id: "camhs4",
    youngPerson: "yp_jordan",
    referralDate: d(-365),
    referralReason: "Historical crisis referral made for a previous resident (anonymised here for learning purposes — record retained per Reg 36 record-keeping requirements). Acute presentation: suicidal ideation following bereavement. Out-of-hours CAMHS Crisis Team contacted by RM at 22:40. Same-night assessment in A&E with CAMHS Liaison.",
    referrer: "staff_darren",
    pathwayApplied: "Crisis",
    urgency: "Emergency",
    referralStatus: "Discharged",
    waitingTimeWeeks: 0,
    firstAppointmentDate: d(-365),
    currentClinician: "CAMHS Crisis Team (initial) → Generic CAMHS (follow-on, now discharged)",
    currentTherapeuticApproach: "Same-night risk assessment, safety planning with young person and home. 72-hour follow-up by CAMHS Crisis Team, then stepped down to 6 sessions of brief solution-focused therapy. Discharged with relapse-prevention plan held by home and key worker.",
    sessionsHeld: 7,
    sessionsScheduled: 0,
    currentEngagementLevel: "Strong",
    childView: "(Recorded at discharge by previous YP) — I didn't think anyone would come that night but they did. Talking about what to do if I felt like that again helped. I know who to ring now.",
    parentalConsent: true,
    referralOutcome: "Outcome: stabilised, no further suicidal ideation reported across follow-on period. Discharged with safety plan, GP letter, and re-referral pathway clearly identified for the home. Lessons-learned review completed by RM and shared with team.",
    reviewedDate: d(-300),
    nextReviewDate: d(-300),
    escalationOptions: "Re-referral route documented: same-day via CAMHS duty or out-of-hours via Crisis Team. Home retains relapse-prevention plan as a worked example for staff training on Reg 7 health responses.",
  },
];

/* ── constants ─────────────────────────────────────────────────────────── */

const PATHWAYS: Pathway[] = ["Standard CAMHS", "ASD/Neurodevelopmental", "Trauma-focused", "Crisis", "Routine"];
const URGENCIES: Urgency[] = ["Routine", "Soon", "Urgent", "Emergency"];
const STATUSES: ReferralStatus[] = ["Submitted", "Triaged", "On waiting list", "Active engagement", "Discharged", "Re-referred"];

const STATUS_META: Record<ReferralStatus, { colour: string }> = {
  "Submitted":          { colour: "bg-blue-100 text-blue-700" },
  "Triaged":            { colour: "bg-indigo-100 text-indigo-700" },
  "On waiting list":    { colour: "bg-amber-100 text-amber-700" },
  "Active engagement":  { colour: "bg-green-100 text-green-700" },
  "Discharged":         { colour: "bg-gray-100 text-gray-700" },
  "Re-referred":        { colour: "bg-purple-100 text-purple-700" },
};

const URGENCY_META: Record<Urgency, { colour: string }> = {
  "Routine":   { colour: "bg-gray-100 text-gray-700" },
  "Soon":      { colour: "bg-blue-100 text-blue-700" },
  "Urgent":    { colour: "bg-amber-100 text-amber-700" },
  "Emergency": { colour: "bg-red-100 text-red-700" },
};

const ENGAGEMENT_META: Record<EngagementLevel, { colour: string }> = {
  "Strong":       { colour: "bg-green-100 text-green-700" },
  "Building":     { colour: "bg-blue-100 text-blue-700" },
  "Inconsistent": { colour: "bg-amber-100 text-amber-700" },
  "Disengaged":   { colour: "bg-red-100 text-red-700" },
};

/* ── component ─────────────────────────────────────────────────────────── */

export default function CamhsReferralTrackerPage() {
  const [data] = useState<CamhsReferral[]>(SEED);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPathway, setFilterPathway] = useState("all");
  const [filterYP, setFilterYP] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const stats = useMemo(() => {
    const active = data.filter((r) => r.referralStatus === "Active engagement").length;
    const waiting = data.filter((r) => r.referralStatus === "On waiting list" || r.referralStatus === "Triaged" || r.referralStatus === "Submitted").length;
    const discharged = data.filter((r) => r.referralStatus === "Discharged").length;
    const waitsCounted = data.filter((r) => r.waitingTimeWeeks > 0);
    const avgWait = waitsCounted.length
      ? Math.round(waitsCounted.reduce((s, r) => s + r.waitingTimeWeeks, 0) / waitsCounted.length)
      : 0;
    return { active, waiting, avgWait, discharged };
  }, [data]);

  const filtered = useMemo(() => {
    let list = [...data];
    if (filterStatus !== "all") list = list.filter((r) => r.referralStatus === filterStatus);
    if (filterPathway !== "all") list = list.filter((r) => r.pathwayApplied === filterPathway);
    if (filterYP !== "all") list = list.filter((r) => r.youngPerson === filterYP);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        r.referralReason.toLowerCase().includes(q) ||
        r.currentClinician.toLowerCase().includes(q) ||
        r.referralOutcome.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => {
      switch (sortBy) {
        case "urgency": return URGENCIES.indexOf(b.urgency) - URGENCIES.indexOf(a.urgency);
        case "wait":    return b.waitingTimeWeeks - a.waitingTimeWeeks;
        case "yp":      return a.youngPerson.localeCompare(b.youngPerson);
        case "review":  return a.nextReviewDate.localeCompare(b.nextReviewDate);
        default:        return b.referralDate.localeCompare(a.referralDate);
      }
    });
    return list;
  }, [data, filterStatus, filterPathway, filterYP, search, sortBy]);

  const exportCols: ExportColumn<CamhsReferral>[] = [
    { header: "Young Person",           accessor: (r: CamhsReferral) => getYPName(r.youngPerson) },
    { header: "Referral Date",          accessor: (r: CamhsReferral) => r.referralDate },
    { header: "Referrer",               accessor: (r: CamhsReferral) => getStaffName(r.referrer) },
    { header: "Reason",                 accessor: (r: CamhsReferral) => r.referralReason },
    { header: "Pathway",                accessor: (r: CamhsReferral) => r.pathwayApplied },
    { header: "Urgency",                accessor: (r: CamhsReferral) => r.urgency },
    { header: "Status",                 accessor: (r: CamhsReferral) => r.referralStatus },
    { header: "Wait (weeks)",           accessor: (r: CamhsReferral) => String(r.waitingTimeWeeks) },
    { header: "First Appointment",      accessor: (r: CamhsReferral) => r.firstAppointmentDate || "—" },
    { header: "Clinician",              accessor: (r: CamhsReferral) => r.currentClinician },
    { header: "Approach",               accessor: (r: CamhsReferral) => r.currentTherapeuticApproach },
    { header: "Sessions Held",          accessor: (r: CamhsReferral) => String(r.sessionsHeld) },
    { header: "Sessions Scheduled",     accessor: (r: CamhsReferral) => String(r.sessionsScheduled) },
    { header: "Engagement",             accessor: (r: CamhsReferral) => r.currentEngagementLevel },
    { header: "Child's View",           accessor: (r: CamhsReferral) => r.childView },
    { header: "Parental Consent",       accessor: (r: CamhsReferral) => r.parentalConsent ? "Yes" : "No" },
    { header: "Outcome",                accessor: (r: CamhsReferral) => r.referralOutcome },
    { header: "Reviewed",               accessor: (r: CamhsReferral) => r.reviewedDate },
    { header: "Next Review",            accessor: (r: CamhsReferral) => r.nextReviewDate },
    { header: "Escalation Options",     accessor: (r: CamhsReferral) => r.escalationOptions },
  ];

  const ypIds = [...new Set(data.map((r) => r.youngPerson))];

  return (
    <PageShell
      title="CAMHS Referral Tracker"
      subtitle="Quality Standard 7 (Health) — CAMHS referrals from initial concern to ongoing engagement"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="camhs-referrals" />
          <PrintButton title="CAMHS Referral Tracker" />
        </div>
      }
    >
      <div id="print-area" className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { l: "Active Engagements", v: stats.active,     icon: HeartHandshake, c: "text-green-600" },
            { l: "On Waiting List",    v: stats.waiting,    icon: Clock,          c: "text-amber-600" },
            { l: "Avg Wait (weeks)",   v: stats.avgWait,    icon: AlertTriangle,  c: "text-red-600" },
            { l: "Discharged",         v: stats.discharged, icon: CheckCircle2,   c: "text-gray-600" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg border bg-white p-3 text-center">
              <s.icon className={cn("mx-auto h-5 w-5 mb-1", s.c)} />
              <p className="text-2xl font-bold">{s.v}</p>
              <p className="text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reason, clinician, outcome…"
              className="w-full rounded-md border pl-8 pr-3 py-2 text-sm"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterPathway} onValueChange={setFilterPathway}>
            <SelectTrigger className="w-[210px]"><SelectValue placeholder="Pathway" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pathways</SelectItem>
              {PATHWAYS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterYP} onValueChange={setFilterYP}>
            <SelectTrigger className="w-[170px]"><SelectValue placeholder="Young Person" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Children</SelectItem>
              {ypIds.map((id) => <SelectItem key={id} value={id}>{getYPName(id)}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1 text-sm">
            <ArrowUpDown className="h-4 w-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border px-2 py-1.5 text-sm"
            >
              <option value="date">Referral Date</option>
              <option value="urgency">Urgency</option>
              <option value="wait">Wait Time</option>
              <option value="review">Next Review</option>
              <option value="yp">Young Person</option>
            </select>
          </div>
        </div>

        {filtered.map((rec) => (
          <div key={rec.id} className="rounded-lg border bg-white overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-brand" />
                <div className="text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{getYPName(rec.youngPerson)}</h3>
                    <span className="text-sm text-muted-foreground">— {rec.pathwayApplied}</span>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", STATUS_META[rec.referralStatus].colour)}>
                      {rec.referralStatus}
                    </span>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", URGENCY_META[rec.urgency].colour)}>
                      {rec.urgency}
                    </span>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", ENGAGEMENT_META[rec.currentEngagementLevel].colour)}>
                      Engagement: {rec.currentEngagementLevel}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Referred {rec.referralDate} by {getStaffName(rec.referrer)} · Wait {rec.waitingTimeWeeks}w · {rec.sessionsHeld} sessions held
                  </p>
                </div>
              </div>
              {expandedId === rec.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>

            {expandedId === rec.id && (
              <div className="border-t p-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Referral Date:</span> {rec.referralDate}</div>
                  <div><span className="text-muted-foreground">First Appointment:</span> {rec.firstAppointmentDate || "—"}</div>
                  <div><span className="text-muted-foreground">Wait:</span> {rec.waitingTimeWeeks} weeks</div>
                  <div><span className="text-muted-foreground">Parental Consent:</span> {rec.parentalConsent ? "Yes" : "No"}</div>
                  <div><span className="text-muted-foreground">Sessions Held:</span> {rec.sessionsHeld}</div>
                  <div><span className="text-muted-foreground">Sessions Scheduled:</span> {rec.sessionsScheduled}</div>
                  <div><span className="text-muted-foreground">Last Reviewed:</span> {rec.reviewedDate}</div>
                  <div><span className="text-muted-foreground">Next Review:</span> {rec.nextReviewDate}</div>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <h4 className="text-sm font-semibold mb-1">Referral Reason</h4>
                  <p className="text-sm text-muted-foreground">{rec.referralReason}</p>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                  <h4 className="text-sm font-semibold text-blue-800 mb-1">Current Clinician &amp; Approach</h4>
                  <p className="text-sm text-blue-900 font-medium">{rec.currentClinician}</p>
                  <p className="text-sm text-blue-900 mt-1">{rec.currentTherapeuticApproach}</p>
                </div>

                <div className="rounded-lg bg-pink-50 border border-pink-200 p-3">
                  <h4 className="text-sm font-semibold text-pink-800 mb-1">Child&apos;s View</h4>
                  <p className="text-sm text-pink-900 italic">&ldquo;{rec.childView}&rdquo;</p>
                </div>

                <div className="rounded-lg bg-green-50 p-3">
                  <h4 className="text-sm font-semibold text-green-800 mb-1">Outcome &amp; Treatment Plan</h4>
                  <p className="text-sm text-green-900">{rec.referralOutcome}</p>
                </div>

                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                  <h4 className="text-sm font-semibold text-amber-800 mb-1">Escalation Options</h4>
                  <p className="text-sm text-amber-900">{rec.escalationOptions}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-4 text-sm text-blue-900">
          <strong>Quality Standard 7 (Health) &amp; Working Together 2023</strong> — Children must be supported to access timely health care, including specialist mental health services. CAMHS referrals must be tracked from initial concern through triage, waiting period, first appointment and ongoing engagement. Where waits are long, the home must agree interim support and clearly documented escalation options. The child&apos;s view of the referral and intervention must be recorded and revisited at every review.
        </div>
      </div>
    </PageShell>
  );
}
