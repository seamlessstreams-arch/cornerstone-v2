"use client";

import React, { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { cn } from "@/lib/utils";
import { getStaffName, getYPName } from "@/lib/seed-data";
import {
  ArrowUpDown, ChevronDown, ChevronUp, Search,
  Users, Clock, CheckCircle2, AlertTriangle,
  Calendar, Heart, Smile, ShieldAlert, ClipboardList,
  Megaphone, Sparkles, MessageSquare,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
type MeetingType =
  | "Morning huddle"
  | "Shift change handover summary"
  | "End-of-day debrief"
  | "Weekly team meeting"
  | "Crisis briefing"
  | "RM 1-2-1 with deputy";

type ActionStatus = "open" | "in_progress" | "complete";

interface OperationalAction {
  action: string;
  owner: string;
  deadline: string;
  status: ActionStatus;
}

interface OperationalMeeting {
  id: string;
  date: string;
  time: string;
  type: MeetingType;
  durationMinutes: number;
  chair: string;
  attendees: string[];
  agenda: string[];
  keyDecisions: string[];
  childUpdates: Record<string, string>;
  risksIdentified: string[];
  staffWellbeingObservations: string;
  actionsAgreed: OperationalAction[];
  positiveMomentsShared: string[];
  nextMeeting: string;
  minutedBy: string;
}

const TYPE_META: Record<MeetingType, { color: string; border: string; icon: React.ReactNode }> = {
  "Morning huddle":                 { color: "bg-blue-100 text-blue-800",     border: "border-l-blue-400",   icon: <Megaphone className="h-3.5 w-3.5" /> },
  "Shift change handover summary":  { color: "bg-cyan-100 text-cyan-800",     border: "border-l-cyan-400",   icon: <Users className="h-3.5 w-3.5" /> },
  "End-of-day debrief":             { color: "bg-indigo-100 text-indigo-800", border: "border-l-indigo-400", icon: <ClipboardList className="h-3.5 w-3.5" /> },
  "Weekly team meeting":            { color: "bg-purple-100 text-purple-800", border: "border-l-purple-400", icon: <Users className="h-3.5 w-3.5" /> },
  "Crisis briefing":                { color: "bg-red-100 text-red-800",       border: "border-l-red-400",    icon: <ShieldAlert className="h-3.5 w-3.5" /> },
  "RM 1-2-1 with deputy":           { color: "bg-emerald-100 text-emerald-800", border: "border-l-emerald-400", icon: <MessageSquare className="h-3.5 w-3.5" /> },
};

const STATUS_META: Record<ActionStatus, { label: string; color: string }> = {
  open:        { label: "Open",        color: "text-amber-600" },
  in_progress: { label: "In progress", color: "text-blue-600" },
  complete:    { label: "Complete",    color: "text-green-600" },
};

// ── Date helper ──────────────────────────────────────────────────────────────
const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

// ── Seed data ────────────────────────────────────────────────────────────────
const SEED: OperationalMeeting[] = [
  {
    id: "om_001",
    date: d(0), time: "08:30", type: "Morning huddle", durationMinutes: 15,
    chair: "staff_darren",
    attendees: ["staff_darren", "staff_ryan", "staff_anna", "staff_chervelle"],
    agenda: [
      "Overnight events and sleep quality",
      "Today's appointments and transport",
      "Staff allocation for key work",
      "Any safeguarding flags from last 24h",
    ],
    keyDecisions: [
      "Anna to take Jordan to CAMHS appointment at 14:00",
      "Chervelle on key work session with Casey after school",
    ],
    childUpdates: {
      yp_alex: "Slept well. College drop-off at 08:45. On track with independence plan.",
      yp_jordan: "Restless sleep — woke twice. CAMHS appointment today, Anna to update plan after.",
      yp_casey: "Settled overnight. Excited about art club this evening.",
    },
    risksIdentified: [
      "Jordan low mood post-contact cancellation — monitor closely",
    ],
    staffWellbeingObservations: "Team energised this morning. Ryan flagged tiredness after long shift yesterday — ensured he has scheduled break today.",
    actionsAgreed: [
      { action: "Update Jordan's care plan after CAMHS feedback", owner: "staff_anna", deadline: d(0), status: "in_progress" },
      { action: "Confirm transport for college pick-up", owner: "staff_chervelle", deadline: d(0), status: "complete" },
    ],
    positiveMomentsShared: [
      "Casey said good morning to everyone unprompted",
      "Alex prepared his own breakfast and lunchbox",
    ],
    nextMeeting: d(1) + " 08:30",
    minutedBy: "staff_darren",
  },
  {
    id: "om_002",
    date: d(0), time: "21:30", type: "End-of-day debrief", durationMinutes: 25,
    chair: "staff_ryan",
    attendees: ["staff_ryan", "staff_anna", "staff_edward"],
    agenda: [
      "Review of the day per young person",
      "Outstanding actions from morning huddle",
      "Plan for waking-night and morning shift",
      "Any incidents or near-misses",
    ],
    keyDecisions: [
      "Increase visual checks on Jordan during night to 30-min intervals",
      "Hold informal reflective space tomorrow lunchtime",
    ],
    childUpdates: {
      yp_alex: "Good day at college. Tutor reports excellent engagement.",
      yp_jordan: "CAMHS appointment positive. New coping strategy introduced — to be embedded by team.",
      yp_casey: "Enjoyed art club. Brought home a painting for keyworker.",
    },
    risksIdentified: [
      "Jordan emotionally tired after CAMHS — risk of disturbed sleep",
    ],
    staffWellbeingObservations: "Anna emotionally invested after CAMHS — debriefed. Edward starting to look fatigued by week's end; offered earlier finish tomorrow.",
    actionsAgreed: [
      { action: "Brief night staff on Jordan's check intervals", owner: "staff_ryan", deadline: d(0), status: "complete" },
      { action: "Share new coping strategy with full team", owner: "staff_anna", deadline: d(1), status: "open" },
    ],
    positiveMomentsShared: [
      "Casey spontaneously hugged Anna",
      "Jordan thanked the team at bedtime",
    ],
    nextMeeting: d(1) + " 08:30",
    minutedBy: "staff_ryan",
  },
  {
    id: "om_003",
    date: d(-1), time: "14:00", type: "Shift change handover summary", durationMinutes: 20,
    chair: "staff_anna",
    attendees: ["staff_anna", "staff_chervelle", "staff_lackson"],
    agenda: [
      "Handover of each young person's status",
      "Medication administered today",
      "Outstanding tasks for evening shift",
      "Any visitor or appointment expected",
    ],
    keyDecisions: [
      "Lackson to lead Casey's evening routine",
      "Chervelle to support Alex's college homework",
    ],
    childUpdates: {
      yp_alex: "Returned from college on time. Mood good.",
      yp_jordan: "Quiet morning. Engaged in 1-2-1 with Anna for 30 mins.",
      yp_casey: "Lunchtime meltdown — settled with sensory tools. PRN not required.",
    },
    risksIdentified: [
      "Casey's lunchtime trigger pattern — needs review at next team meeting",
    ],
    staffWellbeingObservations: "Anna calm and well-paced. Handover unhurried. Chervelle reports feeling well-supported this week.",
    actionsAgreed: [
      { action: "Log Casey's lunchtime incident on behaviour log", owner: "staff_anna", deadline: d(-1), status: "complete" },
      { action: "Review sensory toolkit stock", owner: "staff_lackson", deadline: d(2), status: "open" },
    ],
    positiveMomentsShared: [
      "Jordan opened up about feelings during 1-2-1",
    ],
    nextMeeting: d(-1) + " 21:30",
    minutedBy: "staff_anna",
  },
  {
    id: "om_004",
    date: d(-2), time: "08:30", type: "Morning huddle", durationMinutes: 20,
    chair: "staff_darren",
    attendees: ["staff_darren", "staff_ryan", "staff_mirela", "staff_edward"],
    agenda: [
      "Overnight summary",
      "Transport diary for the day",
      "Any pending Reg 44 actions",
      "Wellbeing check-in",
    ],
    keyDecisions: [
      "Edward to cover school run with Mirela shadowing",
      "Darren to call placing authority re: Jordan's review date",
    ],
    childUpdates: {
      yp_alex: "Up early, doing well.",
      yp_jordan: "Tearful at bedtime. Settled by 22:00.",
      yp_casey: "Very chatty this morning. Looking forward to swimming.",
    },
    risksIdentified: [
      "Jordan emotional regulation — keep eye on triggers today",
      "Mirela still in induction — pair with experienced staff",
    ],
    staffWellbeingObservations: "Mirela settling in well. Edward proactive in offering mentoring. Team morale strong.",
    actionsAgreed: [
      { action: "Call placing authority for Jordan", owner: "staff_darren", deadline: d(-2), status: "complete" },
      { action: "Mirela induction sign-off section 4", owner: "staff_ryan", deadline: d(3), status: "in_progress" },
    ],
    positiveMomentsShared: [
      "Casey laughed at breakfast story",
      "Alex asked after Mirela by name",
    ],
    nextMeeting: d(-2) + " 21:30",
    minutedBy: "staff_darren",
  },
  {
    id: "om_005",
    date: d(-3), time: "16:45", type: "Crisis briefing", durationMinutes: 35,
    chair: "staff_darren",
    attendees: ["staff_darren", "staff_ryan", "staff_anna", "staff_chervelle", "staff_edward"],
    agenda: [
      "Brief on incident at school involving Jordan",
      "Immediate safety planning",
      "Communication with placing authority and parents",
      "Staff support and reflective time",
    ],
    keyDecisions: [
      "Implement enhanced check-ins for Jordan for 72 hours",
      "Notify placing social worker within 24h (Reg 40)",
      "Offer reflective debrief to Anna who responded on the day",
    ],
    childUpdates: {
      yp_jordan: "Safe and home. Has had warm meal and key worker time. Coping strategies in use.",
      yp_alex: "Aware of incident; reassured by Edward.",
      yp_casey: "Unaware — protected from detail.",
    },
    risksIdentified: [
      "Risk of Jordan internalising shame — increase emotional containment",
      "Risk of secondary trauma for Anna — formal debrief booked",
    ],
    staffWellbeingObservations: "Anna shaken but professional. Whole team rallied. Darren to offer 1-2-1 supervision to Anna within 48h.",
    actionsAgreed: [
      { action: "Notify placing authority (Reg 40)", owner: "staff_darren", deadline: d(-3), status: "complete" },
      { action: "Book Anna formal debrief", owner: "staff_darren", deadline: d(-2), status: "complete" },
      { action: "Update Jordan's risk assessment", owner: "staff_ryan", deadline: d(-1), status: "complete" },
      { action: "Schedule reflective practice for full team", owner: "staff_darren", deadline: d(4), status: "open" },
    ],
    positiveMomentsShared: [
      "Team cohesion during crisis was excellent",
      "Jordan accepted comfort from Anna without resistance",
    ],
    nextMeeting: d(-3) + " 21:30",
    minutedBy: "staff_ryan",
  },
  {
    id: "om_006",
    date: d(-4), time: "10:00", type: "Weekly team meeting", durationMinutes: 75,
    chair: "staff_darren",
    attendees: ["staff_darren", "staff_ryan", "staff_anna", "staff_chervelle", "staff_edward", "staff_lackson"],
    agenda: [
      "Reflection on the week per young person",
      "Care plan updates and goals progress",
      "Rota and cover for next week",
      "Training, supervision, and wellbeing",
      "AOB",
    ],
    keyDecisions: [
      "Adopt new bedtime visual schedule for Casey",
      "Anna to lead therapeutic story-time three evenings per week",
      "Lackson to take lead on community access for Alex",
    ],
    childUpdates: {
      yp_alex: "Excellent week — independence goals on track. College reports praise.",
      yp_jordan: "Mixed week. Improvement post-CAMHS noted but emotional volatility remains.",
      yp_casey: "Great progress with morning routine. Visual schedule needed for bedtime.",
    },
    risksIdentified: [
      "Jordan's emotional volatility post-contact",
      "Burnout risk — Edward worked 4 long days; rota to be balanced",
    ],
    staffWellbeingObservations: "Whole team engaged and reflective. Chervelle requested supervision sooner than scheduled — booked. General positive atmosphere.",
    actionsAgreed: [
      { action: "Print and laminate Casey's bedtime schedule", owner: "staff_chervelle", deadline: d(-2), status: "complete" },
      { action: "Bring forward Chervelle supervision", owner: "staff_darren", deadline: d(0), status: "complete" },
      { action: "Rebalance next week's rota", owner: "staff_ryan", deadline: d(-3), status: "complete" },
      { action: "Book trauma-informed care refresher", owner: "staff_darren", deadline: d(10), status: "open" },
    ],
    positiveMomentsShared: [
      "Alex offered to help Mirela learn the kitchen layout",
      "Casey's first full week without a meltdown at school",
      "Jordan asked for hug from Anna unprompted",
    ],
    nextMeeting: d(3) + " 10:00",
    minutedBy: "staff_darren",
  },
  {
    id: "om_007",
    date: d(-5), time: "13:30", type: "RM 1-2-1 with deputy", durationMinutes: 45,
    chair: "staff_darren",
    attendees: ["staff_darren", "staff_ryan"],
    agenda: [
      "Operational priorities for the week",
      "Quality assurance — daily logs and care plans",
      "Outstanding regulatory tasks",
      "Deputy development plan",
    ],
    keyDecisions: [
      "Ryan to lead next month's Reg 44 preparation",
      "Joint audit of behaviour logs to be completed Friday",
    ],
    childUpdates: {
      yp_jordan: "Discussed escalation pattern; agreed plan with Anna.",
      yp_alex: "Discussed transition planning toward 17th birthday.",
    },
    risksIdentified: [
      "Reg 44 visit due — ensure all records ready",
    ],
    staffWellbeingObservations: "Ryan reports feeling stretched but well-supported. Agreed two protected admin afternoons next week.",
    actionsAgreed: [
      { action: "Complete behaviour log audit", owner: "staff_ryan", deadline: d(-1), status: "complete" },
      { action: "Block protected admin time in rota", owner: "staff_darren", deadline: d(-3), status: "complete" },
      { action: "Draft Alex transition outline", owner: "staff_ryan", deadline: d(7), status: "in_progress" },
    ],
    positiveMomentsShared: [
      "Reflected on team's strong response to recent crisis",
    ],
    nextMeeting: d(2) + " 13:30",
    minutedBy: "staff_darren",
  },
  {
    id: "om_008",
    date: d(-6), time: "07:00", type: "Shift change handover summary", durationMinutes: 15,
    chair: "staff_edward",
    attendees: ["staff_edward", "staff_darren", "staff_chervelle"],
    agenda: [
      "Waking-night summary",
      "Morning routine readiness",
      "Medication and breakfast plan",
      "Any flags to morning team",
    ],
    keyDecisions: [
      "Casey's bedroom door to remain ajar at her request",
      "Jordan to have quiet breakfast — sensory low",
    ],
    childUpdates: {
      yp_alex: "Slept through. No disturbances.",
      yp_jordan: "Up twice — settled with brief reassurance. Looked tired this morning.",
      yp_casey: "Asked for door open — accommodated. Settled by 21:45.",
    },
    risksIdentified: [
      "Jordan tiredness — potential dysregulation if pushed",
    ],
    staffWellbeingObservations: "Edward calm and grounded after night shift. Reminded to log mileage and take rest.",
    actionsAgreed: [
      { action: "Note Casey's door preference in care plan", owner: "staff_darren", deadline: d(-5), status: "complete" },
      { action: "Plan low-stimulation morning for Jordan", owner: "staff_chervelle", deadline: d(-6), status: "complete" },
    ],
    positiveMomentsShared: [
      "Casey said 'goodnight' to night staff for first time",
    ],
    nextMeeting: d(-6) + " 21:30",
    minutedBy: "staff_edward",
  },
];

// ── Export columns ───────────────────────────────────────────────────────────
const EXPORT_COLS: ExportColumn<OperationalMeeting>[] = [
  { header: "ID",                accessor: (r: OperationalMeeting) => r.id },
  { header: "Date",              accessor: (r: OperationalMeeting) => r.date },
  { header: "Time",              accessor: (r: OperationalMeeting) => r.time },
  { header: "Type",              accessor: (r: OperationalMeeting) => r.type },
  { header: "Duration (mins)",   accessor: (r: OperationalMeeting) => r.durationMinutes },
  { header: "Chair",             accessor: (r: OperationalMeeting) => getStaffName(r.chair) },
  { header: "Attendees",         accessor: (r: OperationalMeeting) => r.attendees.map(getStaffName).join(", ") },
  { header: "Agenda",            accessor: (r: OperationalMeeting) => r.agenda.join("; ") },
  { header: "Key Decisions",     accessor: (r: OperationalMeeting) => r.keyDecisions.join("; ") },
  { header: "Child Updates",     accessor: (r: OperationalMeeting) => Object.entries(r.childUpdates).map(([id, u]) => `${getYPName(id)}: ${u}`).join(" | ") },
  { header: "Risks",             accessor: (r: OperationalMeeting) => r.risksIdentified.join("; ") },
  { header: "Wellbeing",         accessor: (r: OperationalMeeting) => r.staffWellbeingObservations },
  { header: "Actions Agreed",    accessor: (r: OperationalMeeting) => r.actionsAgreed.map((a) => `${a.action} (${getStaffName(a.owner)}, due ${a.deadline}, ${STATUS_META[a.status].label})`).join("; ") },
  { header: "Positive Moments",  accessor: (r: OperationalMeeting) => r.positiveMomentsShared.join("; ") },
  { header: "Next Meeting",      accessor: (r: OperationalMeeting) => r.nextMeeting },
  { header: "Minuted By",        accessor: (r: OperationalMeeting) => getStaffName(r.minutedBy) },
];

// ══════════════════════════════════════════════════════════════════════════════
export default function OperationalMeetingsPage() {
  const [meetings] = useState<OperationalMeeting[]>(SEED);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date_desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId((cur) => (cur === id ? null : id));

  const filtered = useMemo(() => {
    let list = [...meetings];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((m) =>
        m.type.toLowerCase().includes(s) ||
        m.agenda.some((a) => a.toLowerCase().includes(s)) ||
        m.keyDecisions.some((k) => k.toLowerCase().includes(s)) ||
        Object.values(m.childUpdates).some((u) => u.toLowerCase().includes(s)) ||
        m.staffWellbeingObservations.toLowerCase().includes(s)
      );
    }
    if (typeFilter !== "all") list = list.filter((m) => m.type === typeFilter);

    list.sort((a, b) => {
      switch (sortBy) {
        case "date_desc":     return (b.date + b.time).localeCompare(a.date + a.time);
        case "date_asc":      return (a.date + a.time).localeCompare(b.date + b.time);
        case "duration_desc": return b.durationMinutes - a.durationMinutes;
        case "type":          return a.type.localeCompare(b.type);
        default:              return 0;
      }
    });
    return list;
  }, [meetings, search, typeFilter, sortBy]);

  const stats = useMemo(() => {
    const sevenDaysAgo = d(-6);
    const thisWeek = meetings.filter((m) => m.date >= sevenDaysAgo);
    const avgDuration = meetings.length
      ? Math.round(meetings.reduce((sum, m) => sum + m.durationMinutes, 0) / meetings.length)
      : 0;
    const openActions = meetings.flatMap((m) => m.actionsAgreed).filter((a) => a.status !== "complete").length;
    const wellbeingChecks = meetings.filter((m) => m.staffWellbeingObservations.trim().length > 0).length;
    return {
      thisWeek: thisWeek.length,
      avgDuration,
      openActions,
      wellbeingChecks,
    };
  }, [meetings]);

  return (
    <PageShell
      title="Operational Meetings"
      subtitle="Daily huddles, handovers, debriefs, and weekly team meetings (QS 13)"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Operational Meetings" />
          <ExportButton data={filtered} columns={EXPORT_COLS} filename="operational-meetings" />
        </div>
      }
    >
      <div id="print-area" className="space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Meetings this week", value: stats.thisWeek,        icon: <Calendar className="h-4 w-4" />,        color: "text-blue-600" },
            { label: "Avg duration",       value: `${stats.avgDuration} mins`, icon: <Clock className="h-4 w-4" />,     color: "text-indigo-600" },
            { label: "Open actions",       value: stats.openActions,     icon: <AlertTriangle className="h-4 w-4" />,   color: "text-amber-600" },
            { label: "Wellbeing checks",   value: stats.wellbeingChecks, icon: <Heart className="h-4 w-4" />,           color: "text-rose-600" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-3 flex items-center gap-3">
                <div className={cn("p-2 rounded-lg bg-muted", s.color)}>{s.icon}</div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters / sort */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meetings, agenda, decisions, updates…"
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[220px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {(Object.keys(TYPE_META) as MeetingType[]).map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Newest first</SelectItem>
                <SelectItem value="date_asc">Oldest first</SelectItem>
                <SelectItem value="duration_desc">Longest first</SelectItem>
                <SelectItem value="type">By type</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Meeting cards */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No meetings match your filters.</p>
          )}
          {filtered.map((m) => {
            const open = expandedId === m.id;
            const meta = TYPE_META[m.type];
            const openCount = m.actionsAgreed.filter((a) => a.status !== "complete").length;

            return (
              <Card key={m.id} className={cn("border-l-4", meta.border)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between cursor-pointer" onClick={() => toggle(m.id)}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge className={cn("text-xs flex items-center gap-1", meta.color)}>
                          {meta.icon}{m.type}
                        </Badge>
                        {openCount > 0 && (
                          <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                            {openCount} open action{openCount === 1 ? "" : "s"}
                          </Badge>
                        )}
                      </div>
                      <p className="font-semibold">
                        {m.date} · {m.time} · {m.durationMinutes} mins
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1 flex-wrap">
                        <span>Chair: {getStaffName(m.chair)}</span>
                        <span>{m.attendees.length} attended</span>
                        <span>Minuted by: {getStaffName(m.minutedBy)}</span>
                      </div>
                    </div>
                    {open
                      ? <ChevronUp className="h-4 w-4 mt-1 text-muted-foreground" />
                      : <ChevronDown className="h-4 w-4 mt-1 text-muted-foreground" />
                    }
                  </div>

                  {open && (
                    <div className="mt-4 space-y-4 border-t pt-3 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground mb-1">Attendees</p>
                        <div className="flex flex-wrap gap-1">
                          {m.attendees.map((a) => (
                            <Badge key={a} variant="secondary" className="text-xs">{getStaffName(a)}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="font-medium text-muted-foreground mb-1">Agenda</p>
                        <ul className="list-disc pl-5 space-y-0.5 text-xs">
                          {m.agenda.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                      </div>

                      {m.keyDecisions.length > 0 && (
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Key decisions</p>
                          <ul className="space-y-1">
                            {m.keyDecisions.map((k, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{k}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {Object.keys(m.childUpdates).length > 0 && (
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Child updates</p>
                          <div className="space-y-1.5">
                            {Object.entries(m.childUpdates).map(([id, update]) => (
                              <div key={id} className="bg-muted/40 p-2 rounded text-xs">
                                <span className="font-medium">{getYPName(id)}:</span>{" "}
                                <span className="text-muted-foreground">{update}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {m.risksIdentified.length > 0 && (
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Risks identified</p>
                          <ul className="space-y-1">
                            {m.risksIdentified.map((r, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs">
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {m.staffWellbeingObservations && (
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Staff wellbeing observations</p>
                          <p className="text-xs flex items-start gap-1.5">
                            <Heart className="h-3.5 w-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                            <span>{m.staffWellbeingObservations}</span>
                          </p>
                        </div>
                      )}

                      {m.actionsAgreed.length > 0 && (
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Actions agreed</p>
                          <div className="space-y-1">
                            {m.actionsAgreed.map((a, i) => {
                              const sm = STATUS_META[a.status];
                              return (
                                <div key={i} className="flex items-center gap-2 text-xs flex-wrap">
                                  {a.status === "complete"
                                    ? <CheckCircle2 className={cn("h-3.5 w-3.5", sm.color)} />
                                    : <Clock className={cn("h-3.5 w-3.5", sm.color)} />}
                                  <span>{a.action}</span>
                                  <span className="text-muted-foreground">({getStaffName(a.owner)})</span>
                                  <Badge variant="outline" className="text-xs">Due: {a.deadline}</Badge>
                                  <Badge variant="outline" className={cn("text-xs", sm.color)}>{sm.label}</Badge>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {m.positiveMomentsShared.length > 0 && (
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Positive moments shared</p>
                          <ul className="space-y-1">
                            {m.positiveMomentsShared.map((p, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs">
                                <Smile className="h-3.5 w-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground pt-1 border-t">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Next meeting: {m.nextMeeting}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Regulatory note */}
        <Card className="bg-muted/40">
          <CardContent className="p-3 text-xs text-muted-foreground flex items-start gap-2">
            <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Quality Standard 13 (Leadership and Management):</strong> The registered manager
              must lead and manage the home effectively. Daily operational meetings — huddles,
              handovers, and debriefs — provide the rhythm of safe, child-centred practice. Records
              of decisions, child updates, risks, actions, and staff wellbeing checks must be
              maintained and made available for inspection (Reg 33, Reg 44/45).
            </span>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
