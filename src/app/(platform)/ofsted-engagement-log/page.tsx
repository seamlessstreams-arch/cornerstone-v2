"use client";

import { useState, useMemo } from "react";
import {
  Search, ArrowUpDown, Filter, Building2, Phone, Mail, FileText,
  ClipboardCheck, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2,
  Clock, Send, BookOpen, Calendar, MessageSquare,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getStaffName } from "@/lib/seed-data";

/* ── helpers ─────────────────────────────────────────────────────────── */
const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

/* ── types ───────────────────────────────────────────────────────────── */
type EngagementType =
  | "Statutory notification"
  | "Update letter"
  | "Phone call (HMI initiated)"
  | "Phone call (RM initiated)"
  | "Email"
  | "Monitoring visit"
  | "Mock inspection"
  | "Reg 45 submission"
  | "Annual return"
  | "Inspection (full)";

type EngagementStatus = "Closed - resolved" | "Active" | "Following up";

interface AgreedAction {
  action: string;
  owner: string;
  deadline: string;
  status: string;
}

interface OfstedEngagement {
  id: string;
  date: string;
  type: EngagementType;
  reference: string;
  inspectorOrTeam: string;
  topicOrReason: string;
  summary: string;
  ourResponse: string;
  documentsShared: string[];
  actionsAgreed: AgreedAction[];
  inspectorFeedback: string;
  ourReflection: string;
  recordedBy: string;
  nextEngagement: string;
  status: EngagementStatus;
}

const ENGAGEMENT_TYPES: EngagementType[] = [
  "Statutory notification",
  "Update letter",
  "Phone call (HMI initiated)",
  "Phone call (RM initiated)",
  "Email",
  "Monitoring visit",
  "Mock inspection",
  "Reg 45 submission",
  "Annual return",
  "Inspection (full)",
];

/* ── seed data ───────────────────────────────────────────────────────── */
const SEED: OfstedEngagement[] = [
  {
    id: "ofs_eng_1",
    date: d(-12),
    type: "Reg 45 submission",
    reference: "OFS-REG45-2026-002",
    inspectorOrTeam: "Ofsted Social Care (regional inbox)",
    topicOrReason: "Six-monthly Regulation 45 review of quality of care",
    summary:
      "Latest Reg 45 review submitted covering the previous six months. Report includes analysis of children's progress, complaints, safeguarding events, restraints, missing episodes, and outcomes against the Statement of Purpose.",
    ourResponse:
      "Submitted via Ofsted online portal alongside cover letter from RM. Independent reviewer (Reg 44 visitor) input incorporated. Children's views captured through key working sessions and consultation activity.",
    documentsShared: [
      "Reg 45 report (Apr-Sep 2026)",
      "Statement of Purpose v5.2",
      "Children's consultation summary",
      "Reg 44 visitor reports (last 6 months)",
    ],
    actionsAgreed: [
      {
        action: "Embed children's voice section more visibly in next Reg 45 cycle",
        owner: "staff_darren",
        deadline: d(150),
        status: "In progress",
      },
    ],
    inspectorFeedback: "Acknowledgement of receipt received. No queries raised at this stage.",
    ourReflection:
      "Cycle was tighter than the last submission — we built the report progressively rather than scrambling at the deadline. Next round we want to add more triangulation between behaviour data and education outcomes.",
    recordedBy: "staff_darren",
    nextEngagement: "Next Reg 45 submission due in approximately 6 months",
    status: "Closed - resolved",
  },
  {
    id: "ofs_eng_2",
    date: d(-28),
    type: "Annual return",
    reference: "OFS-AR-2026-001",
    inspectorOrTeam: "Ofsted Provider Information Return team",
    topicOrReason: "Annual return / Provider Information Return submission",
    summary:
      "Annual return submitted covering staffing structure, occupancy, placements, training compliance, and key incident metrics. All sections completed and signed off by RM.",
    ourResponse:
      "Submitted on time via Ofsted portal. Cross-checked figures against HR records, training matrix, occupancy log, and incident register before submission.",
    documentsShared: [
      "Annual return form (signed)",
      "Training compliance summary",
      "Occupancy figures spreadsheet",
    ],
    actionsAgreed: [],
    inspectorFeedback: "Automated portal acknowledgement received. No follow-up required.",
    ourReflection:
      "Pulling the data was much faster this year now that we have a single source of truth in the system. Set a reminder 8 weeks ahead for next year's window.",
    recordedBy: "staff_darren",
    nextEngagement: "Next annual return due Q1 2027",
    status: "Closed - resolved",
  },
  {
    id: "ofs_eng_3",
    date: d(-65),
    type: "Monitoring visit",
    reference: "OFS-MON-2025-014",
    inspectorOrTeam: "HMI K. Ahmed (lead) + HMI J. Patterson",
    topicOrReason:
      "Interim monitoring visit following last full inspection (Good rating) — focus on leadership and behaviour management",
    summary:
      "Two HMIs on site for half a day. Met with RM, two children (those who consented), key worker, and reviewed records including behaviour log, restraint records, complaints log and Reg 44 reports. No formal grade issued; positive feedback throughout.",
    ourResponse:
      "Pre-visit pack prepared and shared on arrival. RM gave overview of changes since last inspection. Inspectors invited to access any record, including drafts. Children spoken with privately at their request.",
    documentsShared: [
      "Statement of Purpose",
      "Behaviour log (last 90 days)",
      "Restraint records",
      "Reg 44 visitor reports",
      "Complaints log",
      "Staff training matrix",
      "Children's voice records",
    ],
    actionsAgreed: [
      {
        action: "Strengthen audit trail linking children's views to care plan reviews",
        owner: "staff_darren",
        deadline: d(-20),
        status: "Completed",
      },
      {
        action: "Add quarterly trend analysis to behaviour log dashboard",
        owner: "staff_ryan",
        deadline: d(20),
        status: "In progress",
      },
    ],
    inspectorFeedback:
      "Verbal feedback at end of visit was positive. Lead HMI commented that leadership was visible, children appeared settled, and records were of a high standard. Two areas for development noted (above).",
    ourReflection:
      "Useful visit — the action around children's voice has already led to better-quality care plan reviews. Behaviour trend analysis is underway and will feed the next Reg 45.",
    recordedBy: "staff_darren",
    nextEngagement: "Next full inspection window opens in approximately 6-9 months",
    status: "Following up",
  },
  {
    id: "ofs_eng_4",
    date: d(-110),
    type: "Phone call (HMI initiated)",
    reference: "OFS-CALL-2025-007",
    inspectorOrTeam: "HMI K. Ahmed",
    topicOrReason:
      "Clarification call following statutory notification of Casey missing episode (exploitation flag)",
    summary:
      "HMI Ahmed phoned for clarification on the contextual safeguarding actions taken following the missing episode notification. Wanted to understand multi-agency response, child's return interview, and any pattern indicators.",
    ourResponse:
      "RM took the call live, then followed up within the hour with a written summary by email confirming actions: missing return interview completed by independent person, MET (missing/exploited/trafficked) team consulted, location risk assessment updated, and information shared with placing authority.",
    documentsShared: [
      "Missing return interview (redacted summary)",
      "Updated safeguarding plan",
      "Multi-agency meeting minutes",
    ],
    actionsAgreed: [
      {
        action: "Send written confirmation of multi-agency steps taken",
        owner: "staff_darren",
        deadline: d(-110),
        status: "Completed",
      },
    ],
    inspectorFeedback:
      "HMI satisfied with response on the call. Confirmed by email two days later that no further action was required from Ofsted.",
    ourReflection:
      "Reinforced the value of having the contextual safeguarding response documented in real time. The call was answered confidently because the underlying work was already in place.",
    recordedBy: "staff_darren",
    nextEngagement: "No further engagement expected on this thread",
    status: "Closed - resolved",
  },
  {
    id: "ofs_eng_5",
    date: d(-150),
    type: "Statutory notification",
    reference: "OFS-NOT-2025-022",
    inspectorOrTeam: "Ofsted notification portal",
    topicOrReason: "Reg 40 notification — use of physical intervention (TCI hold, 3 minutes)",
    summary:
      "Reg 40(4)(b) notification submitted within 24 hours of a brief physical intervention with Casey during a heightened incident. No injuries; debrief and body map completed.",
    ourResponse:
      "Notification submitted via portal with full incident summary, de-escalation steps attempted, duration, hold type, debrief outcome and child's view recorded.",
    documentsShared: ["Reg 40 notification record", "Incident report extract"],
    actionsAgreed: [],
    inspectorFeedback: "Portal acknowledgement received. No follow-up queries raised.",
    ourReflection:
      "Notification timing was strong (within 24 hrs). Continue to ensure child's view is captured and recorded promptly post-incident.",
    recordedBy: "staff_ryan",
    nextEngagement: "None unless pattern emerges",
    status: "Closed - resolved",
  },
  {
    id: "ofs_eng_6",
    date: d(-220),
    type: "Statutory notification",
    reference: "OFS-NOT-2025-018",
    inspectorOrTeam: "Ofsted notification portal",
    topicOrReason: "Reg 40 notification — Section 47 enquiry initiated for Jordan (relating to birth family)",
    summary:
      "Reg 40(4)(c) notification submitted in respect of a Section 47 enquiry initiated by the local authority concerning Jordan's birth family contact arrangements. Concern did not relate to care at Oak House.",
    ourResponse:
      "Notification submitted within 24 hours. Information shared was proportionate and clearly distinguished what was within Oak House's purview vs the placing authority's investigation.",
    documentsShared: ["Reg 40 notification record"],
    actionsAgreed: [],
    inspectorFeedback: "Portal acknowledgement received. No further engagement requested.",
    ourReflection:
      "Useful learning point in team meeting: notify Ofsted even where the concern is external, as the child is in our care and any S47 enquiry is reportable.",
    recordedBy: "staff_darren",
    nextEngagement: "None — closed at notification",
    status: "Closed - resolved",
  },
  {
    id: "ofs_eng_7",
    date: d(-300),
    type: "Update letter",
    reference: "OFS-LET-2025-003",
    inspectorOrTeam: "Ofsted Social Care (regional inbox)",
    topicOrReason: "Update letter following minor change to Statement of Purpose",
    summary:
      "Sent an update letter to Ofsted noting a minor revision to the Statement of Purpose (refreshed staffing structure section and clarified admission criteria). Not a registered details change — courtesy notification only.",
    ourResponse:
      "Letter signed by RM and emailed to regional inbox with revised SoP attached. Logged on the registration changes log.",
    documentsShared: ["Cover letter", "Statement of Purpose v5.1"],
    actionsAgreed: [
      {
        action: "Confirm whether change should also be filed as a registered details change",
        owner: "staff_darren",
        deadline: d(-290),
        status: "Completed",
      },
    ],
    inspectorFeedback: "Email acknowledgement confirming no formal application required for this change.",
    ourReflection:
      "Right to err on the side of telling Ofsted. Will keep a low bar for proactive communication on SoP changes.",
    recordedBy: "staff_darren",
    nextEngagement: "Next SoP review scheduled annually",
    status: "Closed - resolved",
  },
];

/* ── component ───────────────────────────────────────────────────────── */
export default function OfstedEngagementLogPage() {
  const [records] = useState<OfstedEngagement[]>(SEED);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* ── derived data ────────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = [...records];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.topicOrReason.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q) ||
          r.inspectorOrTeam.toLowerCase().includes(q) ||
          r.reference.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
      );
    }
    if (filterType !== "all") {
      list = list.filter((r) => r.type === filterType);
    }
    if (filterStatus !== "all") {
      list = list.filter((r) => r.status === filterStatus);
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.date.localeCompare(a.date);
        case "date_asc":
          return a.date.localeCompare(b.date);
        case "type":
          return a.type.localeCompare(b.type);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
    return list;
  }, [records, search, filterType, filterStatus, sortBy]);

  /* ── stats ───────────────────────────────────────────────────────── */
  const today = new Date();
  const yearAgo = new Date();
  yearAgo.setFullYear(today.getFullYear() - 1);

  const engagementsThisYear = records.filter((r) => new Date(r.date) >= yearAgo).length;
  const notificationsSubmitted = records.filter((r) => r.type === "Statutory notification").length;
  const outstandingActions = records.reduce(
    (sum, r) =>
      sum +
      r.actionsAgreed.filter((a) => a.status !== "Completed" && a.status !== "Closed").length,
    0
  );
  const lastEngagementDate = records
    .map((r) => r.date)
    .sort((a, b) => b.localeCompare(a))[0];
  const daysSinceLast = lastEngagementDate
    ? Math.floor(
        (today.getTime() - new Date(lastEngagementDate).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  /* ── icon helper ─────────────────────────────────────────────────── */
  const iconFor = (type: EngagementType) => {
    switch (type) {
      case "Phone call (HMI initiated)":
      case "Phone call (RM initiated)":
        return Phone;
      case "Email":
        return Mail;
      case "Monitoring visit":
      case "Inspection (full)":
        return ClipboardCheck;
      case "Mock inspection":
        return ClipboardCheck;
      case "Statutory notification":
        return Send;
      case "Reg 45 submission":
      case "Annual return":
      case "Update letter":
        return FileText;
      default:
        return Building2;
    }
  };

  /* ── export columns ──────────────────────────────────────────────── */
  const exportCols: ExportColumn<OfstedEngagement>[] = [
    { header: "ID", accessor: (r: OfstedEngagement) => r.id },
    { header: "Date", accessor: (r: OfstedEngagement) => r.date },
    { header: "Type", accessor: (r: OfstedEngagement) => r.type },
    { header: "Reference", accessor: (r: OfstedEngagement) => r.reference },
    { header: "Inspector / Team", accessor: (r: OfstedEngagement) => r.inspectorOrTeam },
    { header: "Topic / Reason", accessor: (r: OfstedEngagement) => r.topicOrReason },
    { header: "Summary", accessor: (r: OfstedEngagement) => r.summary },
    { header: "Our Response", accessor: (r: OfstedEngagement) => r.ourResponse },
    {
      header: "Documents Shared",
      accessor: (r: OfstedEngagement) => r.documentsShared.join("; "),
    },
    {
      header: "Actions Agreed",
      accessor: (r: OfstedEngagement) =>
        r.actionsAgreed
          .map((a) => `${a.action} (owner: ${getStaffName(a.owner)}, due ${a.deadline}, ${a.status})`)
          .join(" | "),
    },
    { header: "Inspector Feedback", accessor: (r: OfstedEngagement) => r.inspectorFeedback },
    { header: "Our Reflection", accessor: (r: OfstedEngagement) => r.ourReflection },
    { header: "Recorded By", accessor: (r: OfstedEngagement) => getStaffName(r.recordedBy) },
    { header: "Next Engagement", accessor: (r: OfstedEngagement) => r.nextEngagement },
    { header: "Status", accessor: (r: OfstedEngagement) => r.status },
  ];

  return (
    <PageShell
      title="Ofsted Engagement Log"
      subtitle="All contact with Ofsted between full inspections — notifications, calls, emails, monitoring visits and statutory submissions"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Ofsted Engagement Log" />
          <ExportButton data={filtered} columns={exportCols} filename="ofsted-engagement-log" />
        </div>
      }
    >
      <div id="print-area" className="space-y-6">
        {/* ── summary stats ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Engagements this year",
              value: engagementsThisYear,
              icon: Building2,
              colour: "text-blue-600",
            },
            {
              label: "Notifications submitted",
              value: notificationsSubmitted,
              icon: Send,
              colour: "text-indigo-600",
            },
            {
              label: "Outstanding actions",
              value: outstandingActions,
              icon: AlertTriangle,
              colour: outstandingActions > 0 ? "text-amber-600" : "text-slate-400",
            },
            {
              label: "Days since last engagement",
              value: daysSinceLast,
              icon: Calendar,
              colour: "text-emerald-600",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border bg-white p-4 flex items-center gap-3"
            >
              <s.icon className={cn("h-5 w-5", s.colour)} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── outstanding actions banner ─────────────────────────── */}
        {outstandingActions > 0 && (
          <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">
                  {outstandingActions} action{outstandingActions > 1 ? "s" : ""} agreed with Ofsted
                  still open.
                </p>
                <p className="mt-1">
                  Track progress against agreed actions and reflect closure in the next Reg 45 cycle.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── filters ────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 items-end">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search engagements..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[210px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {ENGAGEMENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Following up">Following up</SelectItem>
              <SelectItem value="Closed - resolved">Closed - resolved</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Recent)</SelectItem>
                <SelectItem value="date_asc">Date (Oldest)</SelectItem>
                <SelectItem value="type">Type</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── engagement cards ───────────────────────────────────── */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No engagements match your filters.
            </div>
          )}
          {filtered.map((rec) => {
            const isExpanded = expandedId === rec.id;
            const TypeIcon = iconFor(rec.type);
            const openActions = rec.actionsAgreed.filter(
              (a) => a.status !== "Completed" && a.status !== "Closed"
            ).length;

            return (
              <div key={rec.id} className="rounded-xl border bg-white overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <TypeIcon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        rec.status === "Active"
                          ? "text-amber-600"
                          : rec.status === "Following up"
                          ? "text-blue-600"
                          : "text-slate-500"
                      )}
                    />
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {rec.type} &middot;{" "}
                        <span className="text-muted-foreground font-normal">{rec.reference}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {rec.date} &middot; {rec.inspectorOrTeam} &middot;{" "}
                        {getStaffName(rec.recordedBy)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {openActions > 0 && (
                      <Badge className="text-xs bg-amber-100 text-amber-800">
                        {openActions} open action{openActions > 1 ? "s" : ""}
                      </Badge>
                    )}
                    <Badge
                      className={cn(
                        "text-xs",
                        rec.status === "Closed - resolved"
                          ? "bg-green-100 text-green-800"
                          : rec.status === "Following up"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      )}
                    >
                      {rec.status}
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t bg-slate-50 p-4 space-y-4">
                    {/* topic / reason */}
                    <div className="rounded-lg bg-white border p-3">
                      <p className="text-xs text-muted-foreground mb-1 font-medium">
                        Topic / Reason
                      </p>
                      <p className="text-sm">{rec.topicOrReason}</p>
                    </div>

                    {/* summary + our response */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-lg bg-white border p-3">
                        <p className="text-xs text-muted-foreground mb-1 font-medium">Summary</p>
                        <p className="text-sm">{rec.summary}</p>
                      </div>
                      <div className="rounded-lg bg-white border p-3">
                        <p className="text-xs text-muted-foreground mb-1 font-medium">Our Response</p>
                        <p className="text-sm">{rec.ourResponse}</p>
                      </div>
                    </div>

                    {/* documents shared */}
                    {rec.documentsShared.length > 0 && (
                      <div className="rounded-lg bg-white border p-3">
                        <p className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" />
                          Documents Shared
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {rec.documentsShared.map((doc, i) => (
                            <Badge
                              key={`${rec.id}-doc-${i}`}
                              className="bg-slate-100 text-slate-700 text-xs font-normal"
                            >
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* actions agreed */}
                    {rec.actionsAgreed.length > 0 && (
                      <div className="rounded-lg bg-white border p-3">
                        <p className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-1">
                          <ClipboardCheck className="h-3.5 w-3.5" />
                          Actions Agreed
                        </p>
                        <ul className="space-y-2">
                          {rec.actionsAgreed.map((a, i) => {
                            const done = a.status === "Completed" || a.status === "Closed";
                            return (
                              <li
                                key={`${rec.id}-act-${i}`}
                                className={cn(
                                  "rounded border p-2 text-sm",
                                  done
                                    ? "bg-green-50 border-green-200"
                                    : "bg-amber-50 border-amber-200"
                                )}
                              >
                                <div className="flex items-start gap-2">
                                  {done ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium">{a.action}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      Owner: {getStaffName(a.owner)} &middot; Due: {a.deadline}{" "}
                                      &middot; Status: {a.status}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {/* feedback + reflection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                        <p className="text-xs font-medium text-blue-700 mb-1 flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          Inspector Feedback
                        </p>
                        <p className="text-sm">{rec.inspectorFeedback}</p>
                      </div>
                      <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-3">
                        <p className="text-xs font-medium text-indigo-700 mb-1 flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          Our Reflection
                        </p>
                        <p className="text-sm">{rec.ourReflection}</p>
                      </div>
                    </div>

                    {/* footer details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">Recorded by:</span>{" "}
                        {getStaffName(rec.recordedBy)}
                      </div>
                      <div>
                        <span className="font-medium">Next engagement:</span> {rec.nextEngagement}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── regulatory note ────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              Quality Standard 13 — Leadership and Management
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3 text-muted-foreground">
            <p>
              The Children&apos;s Homes (England) Regulations 2015, Regulation 13 (the leadership
              and management standard), requires the registered person to lead and manage the home
              effectively and develop strong, transparent relationships with the regulator and
              other partners.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-lg bg-slate-50 border p-3">
                <p className="font-medium text-slate-900 mb-1">Why we keep this log</p>
                <ul className="space-y-1 text-xs">
                  <li>Demonstrates open, ongoing relationship with Ofsted between inspections</li>
                  <li>Provides an audit trail for every notification, call, email and visit</li>
                  <li>Captures actions agreed and tracks them through to closure</li>
                  <li>Feeds into Reg 45 reporting and inspection readiness work</li>
                  <li>Supports learning by recording our reflection on each engagement</li>
                </ul>
              </div>
              <div className="rounded-lg bg-slate-50 border p-3">
                <p className="font-medium text-slate-900 mb-1">What good practice looks like</p>
                <ul className="space-y-1 text-xs">
                  <li>Notify Ofsted on awareness of a Reg 40 event, not on confirmation</li>
                  <li>Confirm verbal exchanges (calls) in writing the same day</li>
                  <li>Share supporting documents proactively where they aid context</li>
                  <li>Record the inspector&apos;s feedback verbatim where possible</li>
                  <li>
                    Reflect honestly on what the engagement told us — including where we could have
                    done better
                  </li>
                  <li>Close the loop on every agreed action with evidence of completion</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
