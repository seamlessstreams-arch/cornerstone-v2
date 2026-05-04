"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, ChevronDown, ChevronUp, Phone, AlertTriangle, ShieldCheck, Clock, Users, Filter, PhoneCall, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStaffName } from "@/lib/seed-data";

/* ── types ─────────────────────────────────────────────────────────────────── */

interface OnCallCall {
  datetime: string;
  from: string;
  type: string;
  durationMins: number;
  outcome: string;
  escalated: boolean;
}

type OnCallRole = "First-line on-call (RM)" | "Second-line on-call (Deputy)" | "Senior practitioner cover";
type ShiftPattern = "Weekday evenings 17:00-08:00" | "Weekend full" | "Bank holiday" | "Standard rota slot";

interface OnCallShift {
  id: string;
  dateFrom: string;
  dateTo: string;
  role: OnCallRole;
  onCallStaff: string;
  backupStaff: string;
  contactNumber: string;
  shiftPattern: ShiftPattern;
  callsReceived: OnCallCall[];
  criticalIncidentsHandled: number;
  routineCallsHandled: number;
  advisoryCallsHandled: number;
  staffWellbeingDuringOnCall: string;
  feedbackOnArrangements: string;
  reviewNotes: string;
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

const d = (n: number) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };

/* ── seed data ─────────────────────────────────────────────────────────────── */

const SEED: OnCallShift[] = [
  {
    id: "oc1",
    dateFrom: d(-1),
    dateTo: d(0),
    role: "First-line on-call (RM)",
    onCallStaff: "staff_darren",
    backupStaff: "staff_ryan",
    contactNumber: "07*** *** 401",
    shiftPattern: "Weekday evenings 17:00-08:00",
    callsReceived: [
      { datetime: `${d(-1)} 19:42`, from: "Sleep-in staff (Chervelle)", type: "Routine update", durationMins: 6, outcome: "Confirmed plan to manage Alex's bedtime anxiety; no action required", escalated: false },
      { datetime: `${d(-1)} 23:18`, from: "Night staff (Lackson)", type: "Advisory", durationMins: 12, outcome: "Discussed appropriate response to Jordan's phone use after lights out; agreed to log and review in morning handover", escalated: false },
    ],
    criticalIncidentsHandled: 0,
    routineCallsHandled: 1,
    advisoryCallsHandled: 1,
    staffWellbeingDuringOnCall: "Calm shift overall. Sleep undisturbed after 23:30. RM reported feeling well-rested and able to be present for early handover.",
    feedbackOnArrangements: "Backup line clear and tested at start of shift. No issues with phone signal at home address.",
    reviewNotes: "Both calls handled within first-line scope. No escalation needed.",
  },
  {
    id: "oc2",
    dateFrom: d(-3),
    dateTo: d(-2),
    role: "Second-line on-call (Deputy)",
    onCallStaff: "staff_ryan",
    backupStaff: "staff_darren",
    contactNumber: "07*** *** 402",
    shiftPattern: "Weekday evenings 17:00-08:00",
    callsReceived: [],
    criticalIncidentsHandled: 0,
    routineCallsHandled: 0,
    advisoryCallsHandled: 0,
    staffWellbeingDuringOnCall: "Quiet shift, no calls received. Deputy used time to catch up on reading and rest.",
    feedbackOnArrangements: "On-call phone tested at 17:00 handover. All systems functional.",
    reviewNotes: "No incidents. Quiet rota slot.",
  },
  {
    id: "oc3",
    dateFrom: d(-4),
    dateTo: d(-2),
    role: "First-line on-call (RM)",
    onCallStaff: "staff_darren",
    backupStaff: "staff_ryan",
    contactNumber: "07*** *** 401",
    shiftPattern: "Weekend full",
    callsReceived: [
      { datetime: `${d(-4)} 21:05`, from: "Senior on shift (Anna)", type: "Critical incident", durationMins: 38, outcome: "Casey self-harm episode — supported Anna through immediate response, advised on body-map completion and out-of-hours CAMHS contact. Agreed RM would attend home in person.", escalated: true },
      { datetime: `${d(-4)} 21:50`, from: "Out-of-hours CAMHS", type: "Multi-agency liaison", durationMins: 22, outcome: "Triage call with CAMHS practitioner. Agreed home-based monitoring overnight, follow-up appointment booked for Monday morning.", escalated: true },
      { datetime: `${d(-4)} 23:15`, from: "EDT social worker", type: "Notification", durationMins: 14, outcome: "Notified EDT of incident as per safeguarding protocol. Confirmed no statutory response required overnight, allocated SW to be informed Monday.", escalated: false },
      { datetime: `${d(-3)} 02:40`, from: "Night staff (Edward)", type: "Welfare check-in", durationMins: 8, outcome: "Casey settled and asleep. Plan holding. Advised Edward to wake RM only if Casey's presentation changed.", escalated: false },
      { datetime: `${d(-3)} 09:20`, from: "Day shift (Mirela)", type: "Handover support", durationMins: 18, outcome: "RM provided detailed handover, supported Mirela in framing the day for Casey, confirmed RM remained available throughout.", escalated: false },
      { datetime: `${d(-2)} 14:10`, from: "Sleep-in staff", type: "Routine update", durationMins: 5, outcome: "Confirmed Casey engaging well with afternoon activity. Plan continuing to hold.", escalated: false },
    ],
    criticalIncidentsHandled: 1,
    routineCallsHandled: 2,
    advisoryCallsHandled: 3,
    staffWellbeingDuringOnCall: "Demanding shift. RM attended the home in person between 21:30 and 02:00 Saturday night. Sleep significantly disrupted. Took rest day on Monday as agreed under post-incident wellbeing protocol.",
    feedbackOnArrangements: "Backup arrangements worked well — Deputy was contactable within 4 minutes when consulted. CAMHS out-of-hours line answered within 2 rings. Recording of calls into oncall log completed retrospectively due to incident demands; this is a known pattern after critical events and is acceptable.",
    reviewNotes: "Escalation pathway worked as intended. Post-incident review scheduled. RM took compensatory rest. Casey safeguarding plan updated. RI notified on Monday morning under Reg 40.",
  },
  {
    id: "oc4",
    dateFrom: d(-6),
    dateTo: d(-5),
    role: "First-line on-call (RM)",
    onCallStaff: "staff_darren",
    backupStaff: "staff_ryan",
    contactNumber: "07*** *** 401",
    shiftPattern: "Weekday evenings 17:00-08:00",
    callsReceived: [
      { datetime: `${d(-6)} 18:30`, from: "Sleep-in staff", type: "Routine update", durationMins: 4, outcome: "Confirmed evening routine going well, all young people settled.", escalated: false },
    ],
    criticalIncidentsHandled: 0,
    routineCallsHandled: 1,
    advisoryCallsHandled: 0,
    staffWellbeingDuringOnCall: "Quiet shift. Sleep undisturbed.",
    feedbackOnArrangements: "All systems functional. Phone signal good.",
    reviewNotes: "Routine shift. No incidents.",
  },
  {
    id: "oc5",
    dateFrom: d(-8),
    dateTo: d(-7),
    role: "Second-line on-call (Deputy)",
    onCallStaff: "staff_ryan",
    backupStaff: "staff_darren",
    contactNumber: "07*** *** 402",
    shiftPattern: "Weekday evenings 17:00-08:00",
    callsReceived: [
      { datetime: `${d(-8)} 20:15`, from: "Senior on shift (Chervelle)", type: "Advisory", durationMins: 15, outcome: "Discussed approach to Jordan's request to attend a peer's house — Deputy supported staff to use contextual safeguarding assessment in the moment. Decision to permit with check-in arrangement.", escalated: false },
    ],
    criticalIncidentsHandled: 0,
    routineCallsHandled: 0,
    advisoryCallsHandled: 1,
    staffWellbeingDuringOnCall: "Felt confident in decision-making support. Sleep undisturbed after 21:00.",
    feedbackOnArrangements: "Decision-tree document referenced and helpful. No need to escalate to first-line.",
    reviewNotes: "Good example of second-line cover preventing unnecessary RM disturbance while supporting staff confidence.",
  },
  {
    id: "oc6",
    dateFrom: d(-10),
    dateTo: d(-9),
    role: "First-line on-call (RM)",
    onCallStaff: "staff_darren",
    backupStaff: "staff_ryan",
    contactNumber: "07*** *** 401",
    shiftPattern: "Weekday evenings 17:00-08:00",
    callsReceived: [
      { datetime: `${d(-10)} 22:50`, from: "Night staff", type: "Advisory", durationMins: 9, outcome: "Brief consult on responding to Alex's nightmares; reinforced grounding strategy. No follow-up required.", escalated: false },
    ],
    criticalIncidentsHandled: 0,
    routineCallsHandled: 0,
    advisoryCallsHandled: 1,
    staffWellbeingDuringOnCall: "Settled shift. Single brief call. Slept well.",
    feedbackOnArrangements: "No issues.",
    reviewNotes: "Routine.",
  },
  {
    id: "oc7",
    dateFrom: d(-11),
    dateTo: d(-9),
    role: "Senior practitioner cover",
    onCallStaff: "staff_ryan",
    backupStaff: "staff_darren",
    contactNumber: "07*** *** 403",
    shiftPattern: "Weekend full",
    callsReceived: [
      { datetime: `${d(-11)} 19:00`, from: "Sleep-in staff", type: "Routine update", durationMins: 5, outcome: "All young people settled. Activity plan went well.", escalated: false },
      { datetime: `${d(-10)} 11:30`, from: "Senior on shift", type: "Advisory", durationMins: 10, outcome: "Supported team decision around weekend visit logistics for Casey.", escalated: false },
      { datetime: `${d(-9)} 16:45`, from: "Sleep-in staff", type: "Routine update", durationMins: 4, outcome: "Confirmed Sunday afternoon plan in place.", escalated: false },
    ],
    criticalIncidentsHandled: 0,
    routineCallsHandled: 2,
    advisoryCallsHandled: 1,
    staffWellbeingDuringOnCall: "Good weekend rota cover. Calls were spread out and manageable. Maintained own routine throughout.",
    feedbackOnArrangements: "Senior practitioner cover model working well — providing accessible advice without RM disturbance.",
    reviewNotes: "Strong example of distributed on-call reducing RM burden.",
  },
  {
    id: "oc8",
    dateFrom: d(-14),
    dateTo: d(-13),
    role: "First-line on-call (RM)",
    onCallStaff: "staff_darren",
    backupStaff: "staff_ryan",
    contactNumber: "07*** *** 401",
    shiftPattern: "Bank holiday",
    callsReceived: [
      { datetime: `${d(-14)} 13:20`, from: "Senior on shift", type: "Advisory", durationMins: 11, outcome: "Discussed appropriate staff response to family contact arrangements over the bank holiday. Confirmed care plan stipulations.", escalated: false },
      { datetime: `${d(-14)} 19:55`, from: "Sleep-in staff", type: "Routine update", durationMins: 6, outcome: "Confirmed evening routine on track.", escalated: false },
    ],
    criticalIncidentsHandled: 0,
    routineCallsHandled: 1,
    advisoryCallsHandled: 1,
    staffWellbeingDuringOnCall: "Bank holiday cover. RM remained available but had family time around calls.",
    feedbackOnArrangements: "Bank holiday cover arrangements clear in advance. No confusion about who was on-call.",
    reviewNotes: "Routine bank holiday shift.",
  },
];

/* ── component ─────────────────────────────────────────────────────────────── */

export default function OnCallRotaPage() {
  const [data] = useState<OnCallShift[]>(SEED);
  const [roleFilter, setRoleFilter] = useState("all");
  const [staffFilter, setStaffFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId(expandedId === id ? null : id);

  const staffIds = [...new Set(data.map(r => r.onCallStaff))];
  const roles: OnCallRole[] = ["First-line on-call (RM)", "Second-line on-call (Deputy)", "Senior practitioner cover"];

  const filtered = useMemo(() => {
    let out = [...data];
    if (roleFilter !== "all") out = out.filter(r => r.role === roleFilter);
    if (staffFilter !== "all") out = out.filter(r => r.onCallStaff === staffFilter);
    out.sort((a, b) => sortBy === "oldest" ? a.dateFrom.localeCompare(b.dateFrom) : b.dateFrom.localeCompare(a.dateFrom));
    return out;
  }, [data, roleFilter, staffFilter, sortBy]);

  const shiftsThisFortnight = data.filter(r => r.dateFrom >= d(-14)).length;
  const totalCalls = data.reduce((sum, r) => sum + r.callsReceived.length, 0);
  const criticalIncidents = data.reduce((sum, r) => sum + r.criticalIncidentsHandled, 0);
  const avgCallsPerShift = data.length ? (totalCalls / data.length).toFixed(1) : "0";

  const exportCols: ExportColumn<OnCallShift>[] = useMemo(() => [
    { header: "From", accessor: (r: OnCallShift) => r.dateFrom },
    { header: "To", accessor: (r: OnCallShift) => r.dateTo },
    { header: "Role", accessor: (r: OnCallShift) => r.role },
    { header: "On-Call Staff", accessor: (r: OnCallShift) => getStaffName(r.onCallStaff) },
    { header: "Backup Staff", accessor: (r: OnCallShift) => getStaffName(r.backupStaff) },
    { header: "Contact Number", accessor: (r: OnCallShift) => r.contactNumber },
    { header: "Shift Pattern", accessor: (r: OnCallShift) => r.shiftPattern },
    { header: "Calls Received", accessor: (r: OnCallShift) => r.callsReceived.length },
    { header: "Critical Incidents", accessor: (r: OnCallShift) => r.criticalIncidentsHandled },
    { header: "Routine Calls", accessor: (r: OnCallShift) => r.routineCallsHandled },
    { header: "Advisory Calls", accessor: (r: OnCallShift) => r.advisoryCallsHandled },
    { header: "Staff Wellbeing", accessor: (r: OnCallShift) => r.staffWellbeingDuringOnCall },
    { header: "Feedback", accessor: (r: OnCallShift) => r.feedbackOnArrangements },
    { header: "Review Notes", accessor: (r: OnCallShift) => r.reviewNotes },
  ], []);

  return (
    <PageShell
      title="On-Call Rota"
      subtitle="Duty cover providing 24/7 escalation route — managers and senior practitioners ensuring staff and children are never without support"
      actions={[
        <PrintButton key="p" title="On-Call Rota" />,
        <ExportButton key="e" data={filtered} columns={exportCols} filename="on-call-rota" />,
      ]}
    >
      <div id="print-area" className="space-y-6">

        {/* info banner */}
        <div className="rounded-lg bg-sky-50 border border-sky-200 p-4 flex gap-3">
          <ShieldCheck className="h-5 w-5 text-sky-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-sky-900">On-call cover is a vital safety net</p>
            <p className="text-sky-800">A robust on-call rota ensures that staff supporting children in the home always have access to a senior decision-maker. First-line on-call sits with the Registered Manager, with deputy and senior practitioner cover layered behind. Required by Quality Standard 13 (the leadership and management standard) and underpins Reg 33 oversight expectations.</p>
          </div>
        </div>

        {/* summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Shifts This Fortnight", value: shiftsThisFortnight, icon: Clock, colour: "text-sky-600" },
            { label: "Calls Received Total", value: totalCalls, icon: PhoneCall, colour: "text-blue-600" },
            { label: "Critical Incidents", value: criticalIncidents, icon: AlertTriangle, colour: "text-amber-600" },
            { label: "Avg Calls / Shift", value: avgCallsPerShift, icon: Phone, colour: "text-green-600" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="pt-4 flex items-center gap-3">
                <s.icon className={cn("h-8 w-8", s.colour)} />
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* filters / sort */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="w-64">
                <Label className="text-xs flex items-center gap-1"><Filter className="h-3 w-3" />Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-56">
                <Label className="text-xs flex items-center gap-1"><Users className="h-3 w-3" />On-Call Staff</Label>
                <Select value={staffFilter} onValueChange={setStaffFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Staff</SelectItem>
                    {staffIds.map(id => <SelectItem key={id} value={id}>{getStaffName(id)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-44">
                <Label className="text-xs flex items-center gap-1"><ArrowUpDown className="h-3 w-3" />Sort</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* shift cards */}
        <div className="space-y-3">
          {filtered.map(r => {
            const open = expandedId === r.id;
            const hasCritical = r.criticalIncidentsHandled > 0;
            return (
              <Card key={r.id} className={cn(hasCritical && "border-amber-300 ring-1 ring-amber-200")}>
                <button className="w-full text-left" onClick={() => toggle(r.id)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-base">{getStaffName(r.onCallStaff)}</CardTitle>
                        <Badge variant="outline" className="text-xs">{r.role}</Badge>
                        <Badge variant="outline" className="text-xs">{r.shiftPattern}</Badge>
                        <Badge className="text-xs bg-blue-100 text-blue-800">{r.callsReceived.length} call{r.callsReceived.length === 1 ? "" : "s"}</Badge>
                        {hasCritical && (
                          <Badge className="text-xs bg-amber-100 text-amber-800 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />Critical incident
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground">{r.dateFrom}{r.dateFrom !== r.dateTo ? ` → ${r.dateTo}` : ""}</span>
                        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                  </CardHeader>
                </button>
                {open && (
                  <CardContent className="space-y-3 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 flex items-start gap-2">
                        <Users className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-700">Backup</p>
                          <p className="text-sm text-slate-900">{getStaffName(r.backupStaff)}</p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 flex items-start gap-2">
                        <Phone className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-700">Contact number</p>
                          <p className="text-sm text-slate-900 font-mono">{r.contactNumber}</p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 flex items-start gap-2">
                        <Clock className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-700">Pattern</p>
                          <p className="text-sm text-slate-900">{r.shiftPattern}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                        <p className="text-xs font-semibold text-amber-800">Critical</p>
                        <p className="text-2xl font-bold text-amber-900">{r.criticalIncidentsHandled}</p>
                      </div>
                      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                        <p className="text-xs font-semibold text-blue-800">Advisory</p>
                        <p className="text-2xl font-bold text-blue-900">{r.advisoryCallsHandled}</p>
                      </div>
                      <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                        <p className="text-xs font-semibold text-green-800">Routine</p>
                        <p className="text-2xl font-bold text-green-900">{r.routineCallsHandled}</p>
                      </div>
                    </div>

                    {r.callsReceived.length > 0 ? (
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                        <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                          <PhoneCall className="h-3 w-3" />Call log ({r.callsReceived.length})
                        </p>
                        <ul className="space-y-2">
                          {r.callsReceived.map((c, i) => (
                            <li key={i} className="border-l-2 border-slate-300 pl-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-mono text-slate-600">{c.datetime}</span>
                                <Badge variant="outline" className="text-xs">{c.type}</Badge>
                                <Badge variant="outline" className="text-xs">{c.durationMins} min</Badge>
                                {c.escalated && <Badge className="text-xs bg-amber-100 text-amber-800">Escalated</Badge>}
                              </div>
                              <p className="text-xs text-slate-700 mt-0.5">From: {c.from}</p>
                              <p className="text-sm text-slate-900 mt-1">{c.outcome}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-900">
                        Quiet shift — no calls received.
                      </div>
                    )}

                    <div className="rounded-lg bg-pink-50 border border-pink-200 p-3 flex gap-2 items-start">
                      <Heart className="h-4 w-4 text-pink-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-pink-800">Staff wellbeing during on-call</p>
                        <p className="text-sm text-pink-900">{r.staffWellbeingDuringOnCall}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                        <p className="text-xs font-semibold text-blue-800 mb-1">Feedback on arrangements</p>
                        <p className="text-sm text-blue-900">{r.feedbackOnArrangements}</p>
                      </div>
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                        <p className="text-xs font-semibold text-amber-800 mb-1">Review notes</p>
                        <p className="text-sm text-amber-900">{r.reviewNotes}</p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* regulatory note */}
        <div className="rounded-lg bg-muted/40 border p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold">Regulatory framework</p>
          <p>The on-call rota is the operational expression of Quality Standard 13 — the leadership and management standard — which requires that the home is led and managed by people who provide direction, support and guidance, including outside of office hours. It also supports the Independent Person's monitoring under Reg 33 by evidencing that escalation routes exist and are used appropriately. On-call records form part of the home's audit trail, demonstrating the responsiveness of senior staff, the calibration of decision thresholds, and the wellbeing impact of out-of-hours cover on the people who provide it.</p>
        </div>
      </div>
    </PageShell>
  );
}
