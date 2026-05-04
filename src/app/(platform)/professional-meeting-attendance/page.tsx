"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  ArrowUpDown,
  Search,
  Clock,
  CheckCircle2,
  Calendar,
  FileText,
  Video,
  MapPin,
  AlertTriangle,
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

type MeetingType =
  | "LAC Review"
  | "CP Conference"
  | "Strategy Meeting"
  | "MAPPA"
  | "TAF (Team Around Family)"
  | "PEP"
  | "EHCP review"
  | "Health"
  | "Multi-agency case discussion"
  | "External professional consultation";

type ActionStatus = "pending" | "completed" | "overdue";

interface MeetingAction {
  action: string;
  deadline: string;
  status: ActionStatus;
}

interface ProfMeeting {
  id: string;
  meetingDate: string;
  meetingType: MeetingType;
  aboutChild: string;
  location: string;
  virtualOrInPerson: "virtual" | "in-person" | "hybrid";
  durationMinutes: number;
  organisedBy: string;
  ourRepresentative: string;
  homeContribution: string;
  childAttended: boolean;
  childContribution: string;
  agenciesPresent: string[];
  keyDecisions: string[];
  actionsForHome: MeetingAction[];
  nextMeeting?: string;
  reportSubmitted: boolean;
  reportSubmittedDate?: string;
  recordedBy: string;
}

/* ── seed ──────────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const SEED: ProfMeeting[] = [
  {
    id: "pm1",
    meetingDate: d(-12),
    meetingType: "LAC Review",
    aboutChild: "yp_alex",
    location: "Oak House — Lounge",
    virtualOrInPerson: "in-person",
    durationMinutes: 90,
    organisedBy: "Lisa Morton (IRO, Manchester CC)",
    ourRepresentative: "staff_darren",
    homeContribution:
      "RM presented placement update covering settled-ness, education progress, key work themes, and contact arrangements. Provided written report 5 days in advance and tabled an updated risk assessment. Highlighted Alex's developing independence skills and suggested a 6-month review focus on pathway planning.",
    childAttended: true,
    childContribution:
      "Alex attended the full meeting and read out a prepared statement about life at Oak House. Spoke confidently about college and asked for more contact with his mother. IRO commended Alex's participation.",
    agenciesPresent: [
      "Manchester CC (Social Work & IRO)",
      "Pennine Care CAMHS",
      "Riverside College (Tutor)",
      "Oak House",
    ],
    keyDecisions: [
      "Placement to continue — meeting Alex's needs.",
      "SW to re-engage mother re: contact arrangements.",
      "CAMHS to continue fortnightly with 3-month review.",
      "Pathway planning focus to begin from next review.",
    ],
    actionsForHome: [
      { action: "Update care plan to reflect review outcomes", deadline: d(-5), status: "completed" },
      { action: "Begin independence skills action plan with key worker", deadline: d(2), status: "pending" },
      { action: "Submit minutes summary to placing authority portal", deadline: d(-7), status: "completed" },
    ],
    nextMeeting: d(170),
    reportSubmitted: true,
    reportSubmittedDate: d(-10),
    recordedBy: "staff_darren",
  },
  {
    id: "pm2",
    meetingDate: d(-8),
    meetingType: "PEP",
    aboutChild: "yp_jordan",
    location: "Riverside Academy — Pastoral Office",
    virtualOrInPerson: "in-person",
    durationMinutes: 60,
    organisedBy: "Mark Collins (Virtual School Head, Manchester)",
    ourRepresentative: "staff_ryan",
    homeContribution:
      "Deputy Manager attended with prepared home-context section covering morning routine, homework support, and Jordan's current motivators. Tabled an evidence pack of work completed at home and shared concern about social isolation at break times. Agreed to fund a structured lunchtime club from PP+.",
    childAttended: true,
    childContribution:
      "Jordan attended for the first 20 minutes using a feelings card to share views. Reported school is 'okay' but mornings are hard. Liked the coding club idea. Left to return to class.",
    agenciesPresent: [
      "Manchester Virtual School",
      "Riverside Academy (SENCo & Form Tutor)",
      "Oak House",
    ],
    keyDecisions: [
      "1:1 tutor to continue Mon/Wed mornings.",
      "Home to implement structured wake-up routine.",
      "School to enrol Jordan in coding club.",
      "PP+ mid-term spend review scheduled.",
    ],
    actionsForHome: [
      { action: "Implement structured morning routine and log compliance", deadline: d(-6), status: "completed" },
      { action: "Coordinate weekend homework pack with school", deadline: d(0), status: "pending" },
      { action: "Submit attendance/punctuality data weekly to VS", deadline: d(7), status: "pending" },
    ],
    nextMeeting: d(85),
    reportSubmitted: true,
    reportSubmittedDate: d(-7),
    recordedBy: "staff_ryan",
  },
  {
    id: "pm3",
    meetingDate: d(-30),
    meetingType: "Strategy Meeting",
    aboutChild: "yp_jordan",
    location: "Virtual (Microsoft Teams)",
    virtualOrInPerson: "virtual",
    durationMinutes: 75,
    organisedBy: "DI Rachel Singh (GMP)",
    ourRepresentative: "staff_darren",
    homeContribution:
      "RM provided placement risk profile, Jordan's current presentation, and confirmed home capacity to continue support. Agreed an information-sharing protocol with police and SW. Committed home will not initiate any conversation about the investigation with Jordan unless directed by the ABE team.",
    childAttended: false,
    childContribution:
      "Not appropriate for Jordan to attend a strategy discussion. Jordan's wishes and feelings represented by SW from prior key work and direct work sessions.",
    agenciesPresent: [
      "Greater Manchester Police",
      "Salford CC (SW)",
      "Salford MASH",
      "Royal Manchester Children's Hospital (Paediatrician)",
      "Oak House",
    ],
    keyDecisions: [
      "S47 enquiry concluded — Jordan safe in placement.",
      "Police investigation continues; home to maintain normality.",
      "CAMHS referral timed with police agreement.",
      "Information-sharing protocol agreed in writing.",
    ],
    actionsForHome: [
      { action: "Maintain heightened key-work observations and log behaviours", deadline: d(-15), status: "completed" },
      { action: "Confirm CAMHS referral once police signal timing", deadline: d(-10), status: "completed" },
      { action: "Monthly safeguarding update to placing authority", deadline: d(1), status: "pending" },
    ],
    reportSubmitted: true,
    reportSubmittedDate: d(-28),
    recordedBy: "staff_darren",
  },
  {
    id: "pm4",
    meetingDate: d(-18),
    meetingType: "CP Conference",
    aboutChild: "yp_casey",
    location: "Manchester CC — Conference Suite 2",
    virtualOrInPerson: "in-person",
    durationMinutes: 120,
    organisedBy: "Karen Field (CP Chair, Manchester CC)",
    ourRepresentative: "staff_anna",
    homeContribution:
      "Key Worker tabled the Oak House CP report with a chronology of presenting concerns since admission, an analysis of risk, protective factors, and a clear list of asks of the conference. Highlighted Casey's emerging trust with staff and her response to the keyworking model.",
    childAttended: false,
    childContribution:
      "Casey chose not to attend. An advocate met with Casey beforehand and read her wishes-and-feelings letter into the conference: she wants stability, less change of social workers, and to be told before professionals discuss her.",
    agenciesPresent: [
      "Manchester CC (CP Chair, SW, Team Manager)",
      "GMP",
      "School Nurse",
      "Bridgewater College (Pastoral)",
      "Advocacy (Coram Voice)",
      "Oak House",
    ],
    keyDecisions: [
      "Casey to remain subject to a CP plan under the category of Neglect (historic) for 3 months.",
      "Core group fortnightly.",
      "Advocate to be invited to all future conferences by default.",
      "SW continuity flagged to Team Manager.",
    ],
    actionsForHome: [
      { action: "Attend fortnightly core group with updated CP report", deadline: d(-4), status: "completed" },
      { action: "Pre-meet with Casey ahead of every CP-related event", deadline: d(0), status: "pending" },
      { action: "Submit minute corrections within 5 working days", deadline: d(-12), status: "completed" },
    ],
    nextMeeting: d(72),
    reportSubmitted: true,
    reportSubmittedDate: d(-22),
    recordedBy: "staff_anna",
  },
  {
    id: "pm5",
    meetingDate: d(-4),
    meetingType: "Health",
    aboutChild: "yp_alex",
    location: "Virtual (Attend Anywhere)",
    virtualOrInPerson: "virtual",
    durationMinutes: 45,
    organisedBy: "LAC Nurse — Pennine Care",
    ourRepresentative: "staff_chervelle",
    homeContribution:
      "Senior staff attended with Alex's most recent health log, medication chart, and dental/optical record. Raised a concern about historic eczema flaring under stress and asked for a dermatology referral. Confirmed Alex consents to information being shared with the LAC nurse.",
    childAttended: true,
    childContribution:
      "Alex joined for 15 minutes and confirmed his own preference about how appointments are arranged (afternoons, never on college days). Asked the nurse questions about his immunisation history.",
    agenciesPresent: [
      "Pennine Care LAC Health Team",
      "GP Practice (in writing)",
      "Oak House",
    ],
    keyDecisions: [
      "Dermatology referral to be raised by GP.",
      "Annual health assessment due date confirmed.",
      "Health passport to be updated and shared with Alex.",
    ],
    actionsForHome: [
      { action: "Chase GP for dermatology referral letter copy", deadline: d(6), status: "pending" },
      { action: "Print updated health passport with Alex", deadline: d(3), status: "pending" },
      { action: "Diary AHA appointment with college around exam timetable", deadline: d(20), status: "pending" },
    ],
    nextMeeting: d(180),
    reportSubmitted: true,
    reportSubmittedDate: d(-3),
    recordedBy: "staff_chervelle",
  },
  {
    id: "pm6",
    meetingDate: d(-22),
    meetingType: "EHCP review",
    aboutChild: "yp_jordan",
    location: "Riverside Academy — SEN Room",
    virtualOrInPerson: "in-person",
    durationMinutes: 90,
    organisedBy: "Mrs Akhtar (SENCo, Riverside Academy)",
    ourRepresentative: "staff_ryan",
    homeContribution:
      "Deputy Manager attended with a home-context contribution to the annual review covering communication, sensory regulation, sleep pattern, and impact at home of the school day. Provided written input to Sections A, B and E of the EHCP.",
    childAttended: true,
    childContribution:
      "Jordan completed the 'About Me' section of the review form with key worker support and joined the meeting for the agenda items he had agreed in advance.",
    agenciesPresent: [
      "Manchester SEN Team",
      "Riverside Academy (SENCo, Form Tutor, EP — written advice)",
      "SaLT (advice in writing)",
      "Oak House",
    ],
    keyDecisions: [
      "EHCP outcomes to be amended in Sections E (communication and SEMH).",
      "Provision in Section F to add a structured lunchtime offer.",
      "LA to consult on Y10 placement options early.",
    ],
    actionsForHome: [
      { action: "Submit written home contribution to LA SEN portal", deadline: d(-15), status: "completed" },
      { action: "Agree with Jordan how amendments are explained to him", deadline: d(-10), status: "completed" },
      { action: "Track LA decision letter (15-day statutory timeline)", deadline: d(5), status: "pending" },
    ],
    nextMeeting: d(345),
    reportSubmitted: true,
    reportSubmittedDate: d(-25),
    recordedBy: "staff_ryan",
  },
  {
    id: "pm7",
    meetingDate: d(-2),
    meetingType: "TAF (Team Around Family)",
    aboutChild: "yp_casey",
    location: "Manchester CC — Family Hub",
    virtualOrInPerson: "hybrid",
    durationMinutes: 60,
    organisedBy: "Family Support Worker (Early Help)",
    ourRepresentative: "staff_edward",
    homeContribution:
      "Senior care worker attended both as Casey's keyworker and to support direct work with the family. Tabled a structured update on contact, family communication patterns, and Casey's confidence around contact sessions. Offered to host the next session at Oak House if appropriate.",
    childAttended: true,
    childContribution:
      "Casey attended the second half of the meeting in person to share what is going well and what needs to change with her contact arrangements. Used a strengths-and-worries grid to communicate.",
    agenciesPresent: [
      "Manchester Early Help",
      "Family Support Service",
      "Oak House",
      "Casey's grandmother (by invitation)",
    ],
    keyDecisions: [
      "Contact to remain weekly, supervised, with grandmother.",
      "Home to support pre/post contact reflection time.",
      "Family Hub to schedule a relationship-based direct work block.",
    ],
    actionsForHome: [
      { action: "Document pre/post contact emotional check-ins for 6 weeks", deadline: d(40), status: "pending" },
      { action: "Confirm whether Oak House can host next TAF", deadline: d(10), status: "pending" },
      { action: "Send minute corrections to coordinator", deadline: d(5), status: "pending" },
    ],
    nextMeeting: d(40),
    reportSubmitted: false,
    recordedBy: "staff_edward",
  },
  {
    id: "pm8",
    meetingDate: d(-1),
    meetingType: "External professional consultation",
    aboutChild: "yp_alex",
    location: "Virtual (Zoom)",
    virtualOrInPerson: "virtual",
    durationMinutes: 50,
    organisedBy: "Dr Patel (CAMHS Consultant Clinical Psychologist)",
    ourRepresentative: "staff_darren",
    homeContribution:
      "RM convened a reflective consultation around Alex's emerging anxiety pattern at college. Tabled a 4-week behaviour and mood timeline. Asked for formulation support and indirect advice for the staff team. No direct work with Alex agreed at this stage.",
    childAttended: false,
    childContribution:
      "Consultation was about the team's approach, not about Alex directly. Alex was informed in advance that staff would be receiving advice from Dr Patel and consented.",
    agenciesPresent: [
      "Pennine Care CAMHS (Consultant CP)",
      "Oak House",
    ],
    keyDecisions: [
      "Formulation shared with the team.",
      "Six-week staff coaching block agreed (fortnightly).",
      "Outcome measures to be set with Alex's keyworker.",
    ],
    actionsForHome: [
      { action: "Schedule staff coaching block in supervision diary", deadline: d(7), status: "pending" },
      { action: "Co-produce outcome measures with Alex", deadline: d(14), status: "pending" },
      { action: "Submit anonymised consultation note to CAMHS portal", deadline: d(2), status: "pending" },
    ],
    reportSubmitted: false,
    recordedBy: "staff_darren",
  },
];

/* ── constants ─────────────────────────────────────────────────────────── */

const MEETING_TYPES: MeetingType[] = [
  "LAC Review",
  "CP Conference",
  "Strategy Meeting",
  "MAPPA",
  "TAF (Team Around Family)",
  "PEP",
  "EHCP review",
  "Health",
  "Multi-agency case discussion",
  "External professional consultation",
];

const TYPE_COLOUR: Record<MeetingType, string> = {
  "LAC Review": "bg-blue-100 text-blue-700",
  "CP Conference": "bg-red-100 text-red-700",
  "Strategy Meeting": "bg-orange-100 text-orange-700",
  "MAPPA": "bg-purple-100 text-purple-700",
  "TAF (Team Around Family)": "bg-teal-100 text-teal-700",
  "PEP": "bg-indigo-100 text-indigo-700",
  "EHCP review": "bg-violet-100 text-violet-700",
  "Health": "bg-emerald-100 text-emerald-700",
  "Multi-agency case discussion": "bg-amber-100 text-amber-700",
  "External professional consultation": "bg-slate-100 text-slate-700",
};

const ACTION_COLOUR: Record<ActionStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
};

/* ── component ─────────────────────────────────────────────────────────── */

export default function ProfessionalMeetingAttendancePage() {
  const [data] = useState<ProfMeeting[]>(SEED);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterYP, setFilterYP] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const stats = useMemo(() => {
    const today = new Date();
    const quarterStart = new Date(today);
    quarterStart.setDate(today.getDate() - 90);
    const thisQuarter = data.filter((m) => new Date(m.meetingDate) >= quarterStart);
    const allActions = data.flatMap((m) => m.actionsForHome);
    const childAttendedCount = data.filter((m) => m.childAttended).length;
    return {
      thisQuarter: thisQuarter.length,
      childAttendedPct: data.length === 0 ? 0 : Math.round((childAttendedCount / data.length) * 100),
      openActions: allActions.filter((a) => a.status === "pending" || a.status === "overdue").length,
      reportsSubmitted: data.filter((m) => m.reportSubmitted).length,
    };
  }, [data]);

  const filtered = useMemo(() => {
    let list = [...data];
    if (filterType !== "all") list = list.filter((m) => m.meetingType === filterType);
    if (filterYP !== "all") list = list.filter((m) => m.aboutChild === filterYP);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.meetingType.toLowerCase().includes(q) ||
          m.organisedBy.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q) ||
          m.homeContribution.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => {
      switch (sortBy) {
        case "type":
          return a.meetingType.localeCompare(b.meetingType);
        case "child":
          return a.aboutChild.localeCompare(b.aboutChild);
        case "duration":
          return b.durationMinutes - a.durationMinutes;
        default:
          return b.meetingDate.localeCompare(a.meetingDate);
      }
    });
    return list;
  }, [data, filterType, filterYP, search, sortBy]);

  const exportCols: ExportColumn<ProfMeeting>[] = [
    { header: "Meeting Date", accessor: (r: ProfMeeting) => r.meetingDate },
    { header: "Meeting Type", accessor: (r: ProfMeeting) => r.meetingType },
    { header: "Child", accessor: (r: ProfMeeting) => getYPName(r.aboutChild) },
    { header: "Location", accessor: (r: ProfMeeting) => r.location },
    { header: "Mode", accessor: (r: ProfMeeting) => r.virtualOrInPerson },
    { header: "Duration (mins)", accessor: (r: ProfMeeting) => String(r.durationMinutes) },
    { header: "Organised By", accessor: (r: ProfMeeting) => r.organisedBy },
    { header: "Our Representative", accessor: (r: ProfMeeting) => getStaffName(r.ourRepresentative) },
    { header: "Home Contribution", accessor: (r: ProfMeeting) => r.homeContribution },
    { header: "Child Attended", accessor: (r: ProfMeeting) => (r.childAttended ? "Yes" : "No") },
    { header: "Child Contribution", accessor: (r: ProfMeeting) => r.childContribution },
    { header: "Agencies Present", accessor: (r: ProfMeeting) => r.agenciesPresent.join("; ") },
    { header: "Key Decisions", accessor: (r: ProfMeeting) => r.keyDecisions.join("; ") },
    {
      header: "Actions for Home",
      accessor: (r: ProfMeeting) =>
        r.actionsForHome.map((a) => `${a.action} (due ${a.deadline}, ${a.status})`).join("; "),
    },
    { header: "Next Meeting", accessor: (r: ProfMeeting) => r.nextMeeting ?? "" },
    { header: "Report Submitted", accessor: (r: ProfMeeting) => (r.reportSubmitted ? "Yes" : "No") },
    { header: "Report Submitted Date", accessor: (r: ProfMeeting) => r.reportSubmittedDate ?? "" },
    { header: "Recorded By", accessor: (r: ProfMeeting) => getStaffName(r.recordedBy) },
  ];

  const ypIds = [...new Set(data.map((m) => m.aboutChild))];

  return (
    <PageShell
      title="Professional Meeting Attendance"
      subtitle="Home representation at multi-agency professional meetings — Quality Standard 4 & 13, Working Together 2023"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="professional-meeting-attendance" />
          <PrintButton title="Professional Meeting Attendance" />
        </div>
      }
    >
      <div id="print-area" className="space-y-6">
        {/* summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { l: "Meetings This Quarter", v: stats.thisQuarter, icon: Calendar, c: "text-blue-600" },
            { l: "Child Attended %", v: `${stats.childAttendedPct}%`, icon: Users, c: "text-pink-600" },
            { l: "Open Actions", v: stats.openActions, icon: Clock, c: stats.openActions > 0 ? "text-amber-600" : "text-gray-400" },
            { l: "Reports Submitted", v: `${stats.reportsSubmitted}/${data.length}`, icon: FileText, c: "text-green-600" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg border bg-white p-3 text-center">
              <s.icon className={cn("mx-auto h-5 w-5 mb-1", s.c)} />
              <p className="text-2xl font-bold">{s.v}</p>
              <p className="text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        {/* filters / sort */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search meetings…"
              className="w-full rounded-md border pl-8 pr-3 py-2 text-sm"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[210px]">
              <SelectValue placeholder="Meeting Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {MEETING_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterYP} onValueChange={setFilterYP}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Child" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Children</SelectItem>
              {ypIds.map((id) => (
                <SelectItem key={id} value={id}>
                  {getYPName(id)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1 text-sm">
            <ArrowUpDown className="h-4 w-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border px-2 py-1.5 text-sm"
            >
              <option value="date">Most recent</option>
              <option value="type">Meeting type</option>
              <option value="child">Child</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>

        {/* card list */}
        {filtered.map((m) => {
          const open = expandedId === m.id;
          const openActionCount = m.actionsForHome.filter(
            (a) => a.status === "pending" || a.status === "overdue",
          ).length;

          return (
            <div key={m.id} className="rounded-lg border bg-white overflow-hidden">
              <button
                onClick={() => setExpandedId(open ? null : m.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-brand" />
                  <div className="text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{m.meetingType}</h3>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", TYPE_COLOUR[m.meetingType])}>
                        {m.meetingType}
                      </span>
                      <span className="text-sm text-muted-foreground">— {getYPName(m.aboutChild)}</span>
                      {m.childAttended && (
                        <span className="rounded-full bg-pink-100 text-pink-700 px-2 py-0.5 text-xs font-medium">
                          Child attended
                        </span>
                      )}
                      {!m.reportSubmitted && (
                        <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-medium inline-flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Report pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {m.meetingDate} · {m.durationMinutes} mins · Organised by {m.organisedBy} · Rep:{" "}
                      {getStaffName(m.ourRepresentative)}
                    </p>
                  </div>
                </div>
                {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>

              {open && (
                <div className="border-t p-4 space-y-4">
                  {/* meta */}
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      {m.virtualOrInPerson === "virtual" ? (
                        <Video className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      ) : (
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">{m.location}</p>
                        <p className="text-xs text-muted-foreground capitalize">{m.virtualOrInPerson}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{m.durationMinutes} minutes</p>
                        {m.nextMeeting && (
                          <p className="text-xs text-muted-foreground">Next meeting: {m.nextMeeting}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* home contribution */}
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                    <h4 className="text-sm font-semibold text-blue-800 mb-1">Home Contribution</h4>
                    <p className="text-sm text-blue-900">{m.homeContribution}</p>
                  </div>

                  {/* child voice */}
                  <div
                    className={cn(
                      "rounded-lg border p-3",
                      m.childAttended ? "bg-pink-50 border-pink-200" : "bg-gray-50",
                    )}
                  >
                    <h4 className="text-sm font-semibold mb-1">
                      {m.childAttended ? "Child Attended & Contributed" : "Child Did Not Attend"}
                    </h4>
                    <p className="text-sm text-muted-foreground">{m.childContribution}</p>
                  </div>

                  {/* agencies */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Agencies Present</h4>
                    <div className="flex flex-wrap gap-2">
                      {m.agenciesPresent.map((a) => (
                        <span key={a} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* decisions */}
                  {m.keyDecisions.length > 0 && (
                    <div className="rounded-lg bg-indigo-50 p-3">
                      <h4 className="text-sm font-semibold text-indigo-800 mb-2">Key Decisions</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-indigo-900">
                        {m.keyDecisions.map((dec, i) => (
                          <li key={i}>{dec}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* actions for home */}
                  {m.actionsForHome.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">
                        Actions for Home ({openActionCount} open)
                      </h4>
                      <div className="space-y-2">
                        {m.actionsForHome.map((a, i) => (
                          <div
                            key={i}
                            className="rounded border p-2 flex items-start justify-between gap-2"
                          >
                            <div>
                              <p className="text-sm">{a.action}</p>
                              <p className="text-xs text-muted-foreground">Due {a.deadline}</p>
                            </div>
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                                ACTION_COLOUR[a.status],
                              )}
                            >
                              {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* report status */}
                  <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-3 text-sm">
                    <div className="flex items-center gap-2">
                      {m.reportSubmitted ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      )}
                      <span className="font-medium">
                        {m.reportSubmitted
                          ? `Home report submitted ${m.reportSubmittedDate ?? ""}`
                          : "Home report not yet submitted"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Recorded by {getStaffName(m.recordedBy)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* regulatory note */}
        <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-4 text-sm text-blue-900">
          <strong>Quality Standards 4 (Education) &amp; 13 (Leadership and Management) · Working Together to Safeguard Children 2023</strong>{" "}
          — The home must ensure that children are represented effectively at all multi-agency meetings concerning them, that the child&apos;s voice is heard or sensitively represented, that decisions and actions are tracked, and that the home submits its written contribution within agreed timescales.
        </div>
      </div>
    </PageShell>
  );
}
