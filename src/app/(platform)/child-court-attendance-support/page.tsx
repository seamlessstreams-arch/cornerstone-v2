"use client";

import { useState, useMemo } from "react";
import {
  Scale,
  Shield,
  Users,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { cn } from "@/lib/utils";
import { getYPName, getStaffName } from "@/lib/seed-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ── types ─────────────────────────────────────────────────────────────── */

type CourtType =
  | "Family Court (care proceedings)"
  | "Family Court (contact / private law)"
  | "Youth Court (criminal — defendant)"
  | "Crown Court (witness)"
  | "Magistrates (witness)"
  | "ABE interview"
  | "Court familiarisation visit"
  | "Other tribunal";

type ChildRole =
  | "Subject of proceedings"
  | "Witness"
  | "Defendant"
  | "Special party (Re W)"
  | "Observer / familiarisation";

interface CourtRecord {
  id: string;
  youngPerson: string;
  recordedDate: string;
  courtType: CourtType;
  childRole: ChildRole;
  hearingDate?: string;
  hearingTime?: string;
  courtLocation?: string;
  legalRep?: string;
  guardianAdLitem?: string;
  socialWorkerInvolved?: string;
  specialMeasuresAgreed: string[];
  preHearingPrep: string[];
  whoAttendsWithChild: string[];
  travelArrangements?: string;
  riskAssessmentDone: boolean;
  riskFactors: string[];
  protectiveFactors: string[];
  outcomes?: string;
  postHearingSupport: string[];
  childVoice: string;
  staffObservation: string;
  flagsConcerns: string[];
  followUpDate?: string;
  keyWorker: string;
}

/* ── seed ──────────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const SEED: CourtRecord[] = [
  {
    id: "court1",
    youngPerson: "yp_casey",
    recordedDate: d(-21),
    courtType: "Family Court (care proceedings)",
    childRole: "Subject of proceedings",
    hearingDate: d(7),
    hearingTime: "10:30",
    courtLocation: "Derby Family Court, Morledge",
    legalRep: "Helen Watts (Coram Children's Legal Centre)",
    guardianAdLitem: "Sarah Lewis (CAFCASS)",
    socialWorkerInvolved: "Fiona Brennan (Derbyshire CC)",
    specialMeasuresAgreed: [
      "Casey not present in courtroom — Re W threshold considered",
      "Anna (key worker) attends as supporter, available outside courtroom",
      "Judge to receive summary of Casey's wishes and feelings via guardian",
    ],
    preHearingPrep: [
      "Two preparation sessions with Mark Reid (advocate) over past fortnight",
      "Court familiarisation visit completed — Casey shown empty courtroom on Tues",
      "Casey's wishes recorded in age-appropriate format with guardian Sarah Lewis",
      "Picture book about court used to explain process at Casey's developmental level",
    ],
    whoAttendsWithChild: [
      "Anna (key worker — present at court building, not in court)",
      "Mark Reid (advocate — attends pre-hearing meeting)",
      "Sarah Lewis (guardian — represents Casey's voice in court)",
    ],
    travelArrangements:
      "Anna will drive Casey to court. Quiet route planned. Snacks and comfort items packed. Soft toy permitted in waiting area. Will arrive 30 mins early to settle.",
    riskAssessmentDone: true,
    riskFactors: [
      "Possibility of seeing mum in court building — corridors shared",
      "Casey may experience emotional dysregulation hearing about contact decisions",
      "Sleep disturbance pattern — hearing day may be difficult",
    ],
    protectiveFactors: [
      "Strong attachment to Anna — primary support",
      "Familiarisation visit reduced anticipatory anxiety",
      "Guardian has built rapport with Casey over six visits",
      "Home will protect quiet evening with calm activity post-hearing",
    ],
    outcomes:
      "Hearing pending. Court to decide on contact arrangements with mum following s.34 application. Casey's expressed wish: monthly supervised contact, not weekly.",
    postHearingSupport: [
      "Anna to debrief gently with Casey same evening — child-led pace",
      "No school next morning — protected day",
      "Guardian Sarah to visit within 7 days to explain outcome in age-appropriate way",
      "Therapeutic check-in scheduled with play therapist",
    ],
    childVoice:
      "I don't want to go in the room with the judge. Anna said I don't have to. Sarah is going to tell them what I think. I want to see mum but not so much. Maybe like one time a month is enough.",
    staffObservation:
      "Casey has engaged thoughtfully with preparation. Familiarisation visit was important — she walked into the empty courtroom, sat in the witness box and the judge's chair, asked good questions. Anticipatory anxiety has reduced. Some sleep disturbance noted in the past week. Anna is well-placed to support; relationship is secure.",
    flagsConcerns: [
      "Risk of seeing mum unexpectedly in court building",
      "Outcome uncertainty — Casey's preferred contact level may not be ordered",
    ],
    followUpDate: d(14),
    keyWorker: "staff_chervelle",
  },
  {
    id: "court2",
    youngPerson: "yp_alex",
    recordedDate: d(-10),
    courtType: "ABE interview",
    childRole: "Witness",
    hearingDate: d(-3),
    hearingTime: "11:00",
    courtLocation: "Derbyshire Police video suite, St Mary's Wharf",
    legalRep: "N/A — interview phase",
    guardianAdLitem: undefined,
    socialWorkerInvolved: "Karen Holding (Derby City)",
    specialMeasuresAgreed: [
      "Video-recorded interview (s.27 YJCEA 1999) — to be played at any future trial",
      "ABE-trained officer (DC Hughes) conducting — known to Alex from prep",
      "Interview broken into short segments with breaks at Alex's pace",
      "Anna present in adjoining room throughout — Alex could see her on screen",
    ],
    preHearingPrep: [
      "Three preparation sessions with Anna and DC Hughes — building trust, no leading content",
      "Alex shown the video suite the week before — sat in chair, met camera",
      "Sensory plan agreed — water, fidget object, low-arousal lighting",
      "Trauma-informed pacing discussed — Alex chose 'green/amber/red' break signals",
      "No discussion of evidence content during prep — strictly procedural",
    ],
    whoAttendsWithChild: [
      "Anna (key worker — adjoining room, visible on screen)",
      "DC Hughes (ABE-trained interviewing officer)",
      "Karen Holding (social worker — debriefed after, not present in interview)",
    ],
    travelArrangements:
      "Anna drove Alex. Familiar route. Music chosen by Alex. Arrival 20 mins early to use bathroom and settle. Same return route home — direct, no stops.",
    riskAssessmentDone: true,
    riskFactors: [
      "Disclosure relates to historic harm — emotional distress likely during/after",
      "Risk of dysregulation, self-harm urges post-interview",
      "Possibility of recall-triggered nightmares",
      "Alex prone to dissociation when overwhelmed",
    ],
    protectiveFactors: [
      "Trusted relationship with Anna — primary attachment figure on shift",
      "ABE officer is trauma-informed and known to Alex",
      "Therapeutic team aware and on standby",
      "Home prepared for low-arousal evening",
    ],
    outcomes:
      "Interview completed. Alex spoke for 47 minutes across three segments with two breaks. DC Hughes confirmed evidence captured to required standard. No further interview required at this stage. Police will update on charging decision in 6–8 weeks.",
    postHearingSupport: [
      "Low-arousal evening at home — Alex chose film, hot chocolate, weighted blanket",
      "Anna stayed on shift past usual finish to remain with Alex",
      "Therapeutic check-in within 48 hours — completed, Alex regulated",
      "Sleep monitored for 7 days — two disturbed nights, otherwise settled",
      "Police FLO contact details on Alex's bedside table — Alex's choice",
    ],
    childVoice:
      "It was hard. But the man was nice and Anna was there on the screen so I didn't feel alone. I'm glad I said it. I don't want to do it again though. Can we have pizza now.",
    staffObservation:
      "Alex showed remarkable courage. Used the amber signal twice to take a break and reset. Post-interview presented as flat, then tearful, then sought physical proximity to Anna — appropriate regulation cycle. Slept eight hours that night. Two nightmares since. Overall: well-prepared, well-supported, no crisis.",
    flagsConcerns: [
      "Monitor for delayed trauma response over coming weeks",
      "If charging decision is no further action, prepare Alex sensitively",
      "Anniversary effect — note in calendar 12 months on",
    ],
    followUpDate: d(21),
    keyWorker: "staff_anna",
  },
  {
    id: "court3",
    youngPerson: "yp_jordan",
    recordedDate: d(-5),
    courtType: "Family Court (contact / private law)",
    childRole: "Observer / familiarisation",
    hearingDate: d(-1),
    hearingTime: "14:00",
    courtLocation: "Nottingham Family Court",
    legalRep: "Not represented — Jordan is 16 and chose not to give live evidence",
    guardianAdLitem: undefined,
    socialWorkerInvolved: "Michael Osei (Notts CC)",
    specialMeasuresAgreed: [
      "Jordan attended waiting area only — did not enter courtroom for hearing",
      "Familiarisation only — Jordan exercising right under FJC Children's Guide to be present in building",
      "Mum present on opposing side — separate waiting areas arranged in advance",
    ],
    preHearingPrep: [
      "Conversation with Mark Reid (advocate) about Jordan's options under Re W",
      "Jordan informed of right to give evidence, write a letter to judge, or attend as observer",
      "Jordan chose familiarisation only — wanted to 'be there but not speak'",
      "Mark Reid confirmed Jordan's choice with judge in advance",
    ],
    whoAttendsWithChild: [
      "Mirela (secondary worker — attended day off rota to support Jordan)",
      "Mark Reid (advocate — met Jordan in building, conveyed Jordan's wishes to court)",
    ],
    travelArrangements:
      "Mirela and Jordan travelled by train — Jordan's preference. Lunch beforehand at chosen cafe. Return train booked with flexibility in case hearing ran late.",
    riskAssessmentDone: true,
    riskFactors: [
      "First time in same building as mum since placement",
      "Mum's side may attempt informal contact in corridor",
      "Hearing content may be distressing even from waiting area",
    ],
    protectiveFactors: [
      "Jordan is 16, articulate, and made an informed choice",
      "Mirela has known Jordan since admission — secure relationship",
      "Mark Reid pre-arranged separate waiting areas with court usher",
      "Jordan had clear exit plan if needed",
    ],
    outcomes:
      "Hearing completed. Court reserved judgment for two weeks. Jordan did not encounter mum in building — separation arrangements held. Jordan reported feeling 'glad I went' and 'glad I didn't go in'.",
    postHearingSupport: [
      "Train home — Jordan chose silence for first half, talked second half",
      "Pizza ordered on return to home — Jordan's request",
      "Check-in with key worker next day — Jordan low but settled",
      "Judgment outcome to be shared with Jordan when received — in person, not by phone",
    ],
    childVoice:
      "I didn't want to give evidence but I wanted to be there. Like, I exist in this. They were talking about me. I needed to be in the building. I'm glad Mirela came on her day off — that meant a lot.",
    staffObservation:
      "Jordan handled the day with maturity. Quiet on outward leg, more communicative on return. No encounter with mum — separation held. Jordan articulated afterwards a sense of agency from having attended on own terms. Sleep that night was disturbed but not significantly. Monitoring for impact when judgment lands.",
    flagsConcerns: [
      "Judgment outcome in two weeks — prepare Jordan sensitively whichever way it goes",
      "Mum may attempt indirect contact via social media post-hearing — online safety briefing refreshed",
    ],
    followUpDate: d(13),
    keyWorker: "staff_anna",
  },
];

/* ── constants ─────────────────────────────────────────────────────────── */

const COURT_TYPES: CourtType[] = [
  "Family Court (care proceedings)",
  "Family Court (contact / private law)",
  "Youth Court (criminal — defendant)",
  "Crown Court (witness)",
  "Magistrates (witness)",
  "ABE interview",
  "Court familiarisation visit",
  "Other tribunal",
];

const ROLE_COLOURS: Record<ChildRole, string> = {
  "Subject of proceedings": "bg-sky-100 text-sky-800",
  Witness: "bg-teal-100 text-teal-800",
  Defendant: "bg-amber-100 text-amber-800",
  "Special party (Re W)": "bg-purple-100 text-purple-800",
  "Observer / familiarisation": "bg-slate-100 text-slate-700",
};

/* ── component ─────────────────────────────────────────────────────────── */

export default function ChildCourtAttendanceSupportPage() {
  const [data] = useState<CourtRecord[]>(SEED);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCourt, setFilterCourt] = useState("all");
  const [sortBy, setSortBy] = useState("hearing");

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const monthStart = today.slice(0, 7);
    return {
      activeProceedings: data.filter(
        (r) => !r.outcomes || /pending|reserved|no further action.*sensitively/i.test(r.outcomes)
      ).length,
      thisMonth: data.filter((r) => r.hearingDate?.startsWith(monthStart)).length,
      specialMeasures: data.reduce((s, r) => s + r.specialMeasuresAgreed.length, 0),
      followUpsDue: data.filter((r) => r.followUpDate && r.followUpDate >= today).length,
    };
  }, [data]);

  const filtered = useMemo(() => {
    let list = [...data];
    if (filterCourt !== "all") list = list.filter((r) => r.courtType === filterCourt);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          getYPName(r.youngPerson).toLowerCase().includes(q) ||
          r.courtType.toLowerCase().includes(q) ||
          r.childRole.toLowerCase().includes(q) ||
          (r.courtLocation ?? "").toLowerCase().includes(q) ||
          (r.legalRep ?? "").toLowerCase().includes(q) ||
          r.childVoice.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      switch (sortBy) {
        case "yp":
          return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
        case "court":
          return a.courtType.localeCompare(b.courtType);
        case "recorded":
          return b.recordedDate.localeCompare(a.recordedDate);
        default:
          return (b.hearingDate ?? "").localeCompare(a.hearingDate ?? "");
      }
    });
    return list;
  }, [data, filterCourt, search, sortBy]);

  const exportData = useMemo(
    () =>
      data.map((r) => ({
        youngPerson: getYPName(r.youngPerson),
        recordedDate: r.recordedDate,
        courtType: r.courtType,
        childRole: r.childRole,
        hearingDate: r.hearingDate ?? "",
        hearingTime: r.hearingTime ?? "",
        courtLocation: r.courtLocation ?? "",
        legalRep: r.legalRep ?? "",
        guardianAdLitem: r.guardianAdLitem ?? "",
        socialWorkerInvolved: r.socialWorkerInvolved ?? "",
        specialMeasuresAgreed: r.specialMeasuresAgreed.join("; "),
        preHearingPrep: r.preHearingPrep.join("; "),
        whoAttendsWithChild: r.whoAttendsWithChild.join("; "),
        travelArrangements: r.travelArrangements ?? "",
        riskAssessmentDone: r.riskAssessmentDone ? "Yes" : "No",
        riskFactors: r.riskFactors.join("; "),
        protectiveFactors: r.protectiveFactors.join("; "),
        outcomes: r.outcomes ?? "",
        postHearingSupport: r.postHearingSupport.join("; "),
        childVoice: r.childVoice,
        staffObservation: r.staffObservation,
        flagsConcerns: r.flagsConcerns.join("; "),
        followUpDate: r.followUpDate ?? "",
        keyWorker: getStaffName(r.keyWorker),
      })),
    [data]
  );

  type CourtExportRow = (typeof exportData)[number];

  const exportCols: ExportColumn<CourtExportRow>[] = [
    { header: "Young Person", accessor: (r: CourtExportRow) => r.youngPerson },
    { header: "Recorded Date", accessor: (r: CourtExportRow) => r.recordedDate },
    { header: "Court Type", accessor: (r: CourtExportRow) => r.courtType },
    { header: "Child Role", accessor: (r: CourtExportRow) => r.childRole },
    { header: "Hearing Date", accessor: (r: CourtExportRow) => r.hearingDate },
    { header: "Hearing Time", accessor: (r: CourtExportRow) => r.hearingTime },
    { header: "Court Location", accessor: (r: CourtExportRow) => r.courtLocation },
    { header: "Legal Rep", accessor: (r: CourtExportRow) => r.legalRep },
    { header: "Guardian ad litem", accessor: (r: CourtExportRow) => r.guardianAdLitem },
    { header: "Social Worker", accessor: (r: CourtExportRow) => r.socialWorkerInvolved },
    { header: "Special Measures", accessor: (r: CourtExportRow) => r.specialMeasuresAgreed },
    { header: "Pre-Hearing Prep", accessor: (r: CourtExportRow) => r.preHearingPrep },
    { header: "Attends With Child", accessor: (r: CourtExportRow) => r.whoAttendsWithChild },
    { header: "Travel", accessor: (r: CourtExportRow) => r.travelArrangements },
    { header: "Risk Assessment", accessor: (r: CourtExportRow) => r.riskAssessmentDone },
    { header: "Risk Factors", accessor: (r: CourtExportRow) => r.riskFactors },
    { header: "Protective Factors", accessor: (r: CourtExportRow) => r.protectiveFactors },
    { header: "Outcomes", accessor: (r: CourtExportRow) => r.outcomes },
    { header: "Post-Hearing Support", accessor: (r: CourtExportRow) => r.postHearingSupport },
    { header: "Child Voice", accessor: (r: CourtExportRow) => r.childVoice },
    { header: "Staff Observation", accessor: (r: CourtExportRow) => r.staffObservation },
    { header: "Flags / Concerns", accessor: (r: CourtExportRow) => r.flagsConcerns },
    { header: "Follow-up Date", accessor: (r: CourtExportRow) => r.followUpDate },
    { header: "Key Worker", accessor: (r: CourtExportRow) => r.keyWorker },
  ];

  return (
    <PageShell
      title="Court Attendance Support"
      subtitle="Per-child preparation and support for family, criminal, youth and tribunal proceedings — child-led, trauma-informed, dignified"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={exportData} columns={exportCols} filename="court-attendance-support" />
          <PrintButton title="Court Attendance Support" />
        </div>
      }
    >
      <div id="print-area" className="space-y-6">
        {/* stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { l: "Active Proceedings", v: stats.activeProceedings, icon: Scale, c: "text-sky-600" },
            { l: "This Month's Hearings", v: stats.thisMonth, icon: Calendar, c: "text-teal-600" },
            { l: "Special Measures Agreed", v: stats.specialMeasures, icon: Shield, c: "text-purple-600" },
            { l: "Follow-ups Due", v: stats.followUpsDue, icon: AlertTriangle, c: "text-amber-600" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg border bg-white p-3 text-center">
              <s.icon className={cn("mx-auto h-5 w-5 mb-1", s.c)} />
              <p className="text-2xl font-bold">{s.v}</p>
              <p className="text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        {/* filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search child, court, role, location…"
              className="w-full rounded-md border pl-8 pr-3 py-2 text-sm"
            />
          </div>
          <Select value={filterCourt} onValueChange={setFilterCourt}>
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="Court Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Court Types</SelectItem>
              {COURT_TYPES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
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
              <option value="hearing">Hearing Date</option>
              <option value="recorded">Recorded Date</option>
              <option value="yp">Young Person</option>
              <option value="court">Court Type</option>
            </select>
          </div>
        </div>

        {/* records */}
        {filtered.map((rec) => (
          <div key={rec.id} className="rounded-lg border bg-white overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-sky-50/50"
            >
              <div className="flex items-center gap-3">
                <Scale className="h-5 w-5 text-sky-600" />
                <div className="text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{getYPName(rec.youngPerson)}</h3>
                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800">
                      {rec.courtType}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        ROLE_COLOURS[rec.childRole]
                      )}
                    >
                      {rec.childRole}
                    </span>
                    {rec.hearingDate && (
                      <span className="rounded-full bg-teal-50 border border-teal-200 px-2 py-0.5 text-xs text-teal-800 inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {rec.hearingDate}
                        {rec.hearingTime ? ` · ${rec.hearingTime}` : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Key worker: {getStaffName(rec.keyWorker)}
                    {rec.courtLocation ? ` · ${rec.courtLocation}` : ""}
                  </p>
                </div>
              </div>
              {expanded === rec.id ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            {expanded === rec.id && (
              <div className="border-t p-4 space-y-4 bg-sky-50/30">
                {/* hearing details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  {rec.hearingDate && (
                    <div>
                      <span className="text-muted-foreground">Hearing date:</span> {rec.hearingDate}
                    </div>
                  )}
                  {rec.hearingTime && (
                    <div>
                      <span className="text-muted-foreground">Time:</span> {rec.hearingTime}
                    </div>
                  )}
                  {rec.courtLocation && (
                    <div>
                      <span className="text-muted-foreground">Location:</span> {rec.courtLocation}
                    </div>
                  )}
                  {rec.legalRep && (
                    <div className="col-span-2 md:col-span-3">
                      <span className="text-muted-foreground">Legal rep:</span> {rec.legalRep}
                    </div>
                  )}
                  {rec.guardianAdLitem && (
                    <div className="col-span-2 md:col-span-3">
                      <span className="text-muted-foreground">Guardian ad litem:</span>{" "}
                      {rec.guardianAdLitem}
                    </div>
                  )}
                  {rec.socialWorkerInvolved && (
                    <div className="col-span-2 md:col-span-3">
                      <span className="text-muted-foreground">Social worker:</span>{" "}
                      {rec.socialWorkerInvolved}
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Recorded:</span> {rec.recordedDate}
                  </div>
                  {rec.followUpDate && (
                    <div>
                      <span className="text-muted-foreground">Follow-up:</span> {rec.followUpDate}
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Risk assessment:</span>{" "}
                    {rec.riskAssessmentDone ? "Completed" : "Outstanding"}
                  </div>
                </div>

                {/* special measures */}
                {rec.specialMeasuresAgreed.length > 0 && (
                  <div className="rounded-lg bg-purple-50 border border-purple-200 p-3">
                    <h4 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-1">
                      <Shield className="h-4 w-4" /> Special Measures Agreed
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {rec.specialMeasuresAgreed.map((m, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-white border border-purple-200 px-2 py-0.5 text-xs text-purple-900"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* pre-hearing prep */}
                <div>
                  <h4 className="text-sm font-semibold mb-1">Pre-Hearing Preparation</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {rec.preHearingPrep.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                {/* who attends */}
                <div className="rounded-lg bg-teal-50 border border-teal-200 p-3">
                  <h4 className="text-sm font-semibold text-teal-900 mb-2 flex items-center gap-1">
                    <Users className="h-4 w-4" /> Who Attends With Child
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-teal-900">
                    {rec.whoAttendsWithChild.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>

                {/* travel */}
                {rec.travelArrangements && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Travel Arrangements</h4>
                    <p className="text-sm text-muted-foreground">{rec.travelArrangements}</p>
                  </div>
                )}

                {/* risk + protective */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <h4 className="text-sm font-semibold text-amber-900 mb-1 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" /> Risk Factors
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-amber-900">
                      {rec.riskFactors.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                    <h4 className="text-sm font-semibold text-emerald-900 mb-1">Protective Factors</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-emerald-900">
                      {rec.protectiveFactors.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* outcomes */}
                {rec.outcomes && (
                  <div className="rounded-lg bg-white border p-3">
                    <h4 className="text-sm font-semibold mb-1">Outcomes</h4>
                    <p className="text-sm text-muted-foreground">{rec.outcomes}</p>
                  </div>
                )}

                {/* post-hearing support */}
                <div>
                  <h4 className="text-sm font-semibold mb-1">Post-Hearing Support</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {rec.postHearingSupport.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                {/* child voice */}
                <div className="rounded-lg bg-sky-50 border border-sky-200 p-3">
                  <h4 className="text-sm font-semibold text-sky-900 mb-1">Child&apos;s Voice</h4>
                  <p className="text-sm text-sky-900 italic">&ldquo;{rec.childVoice}&rdquo;</p>
                </div>

                {/* staff observation */}
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">Staff Observation</h4>
                  <p className="text-sm text-slate-800">{rec.staffObservation}</p>
                </div>

                {/* flags */}
                {rec.flagsConcerns.length > 0 && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                    <h4 className="text-sm font-semibold text-red-900 mb-1 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" /> Flags / Concerns
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-900">
                      {rec.flagsConcerns.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* regulatory footer */}
        <div className="rounded-lg border-l-4 border-sky-400 bg-sky-50 p-4 text-sm text-sky-900">
          <strong>Regulatory framework</strong> — Children Act 1989 s.41 (guardian ad litem);
          Re W (Children) [2010] UKSC 12 (child evidence in family proceedings); Achieving Best
          Evidence (ABE) guidance (MoJ); Youth Justice and Criminal Evidence Act 1999 (special
          measures, ss.16–33); Family Justice Council Children&apos;s Guide; Witness Service support;
          Working Together to Safeguard Children 2023; Children&apos;s Homes Quality Standards 7
          (Positive Relationships) and 9 (Protection); UNCRC Articles 12 (right to be heard) and 40
          (juvenile justice). Court attendance is always child-led, well-prepared, and supported by
          a trusted adult.
        </div>
      </div>
    </PageShell>
  );
}
