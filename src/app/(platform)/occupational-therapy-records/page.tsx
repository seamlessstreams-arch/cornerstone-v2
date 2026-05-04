"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Search,
  Activity,
  Clipboard,
  Wrench,
  CalendarClock,
  AlertTriangle,
  GraduationCap,
  HandHelping,
  FileCheck2,
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

type SessionType =
  | "Assessment"
  | "Direct intervention"
  | "Consultation"
  | "Review"
  | "Sensory diet planning"
  | "Equipment recommendation"
  | "Training to staff";

interface OtRecommendation {
  area: string;
  recommendation: string;
  frequency: string;
  equipment: string;
  staffSupportLevel: string;
}

interface OtRecord {
  id: string;
  youngPerson: string;
  assessmentDate: string;
  ot_name: string;
  otOrganisation: string;
  sessionType: SessionType;
  durationMinutes: number;
  location: string;
  focusAreas: string[];
  assessmentTools: string[];
  findings: string;
  sensoryProfile: string;
  recommendations: OtRecommendation[];
  sensoryDiet: string[];
  equipmentProvided: string[];
  staffTraining: string;
  homePracticeAdvised: string[];
  childResponse: string;
  familyInformedDate: string;
  progressNotedSinceLast: string;
  nextReviewDate: string;
  reportProvided: boolean;
}

/* ── helpers ───────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const SESSION_TYPE_COLOURS: Record<SessionType, string> = {
  "Assessment": "bg-blue-100 text-blue-800",
  "Direct intervention": "bg-green-100 text-green-800",
  "Consultation": "bg-purple-100 text-purple-800",
  "Review": "bg-amber-100 text-amber-800",
  "Sensory diet planning": "bg-pink-100 text-pink-800",
  "Equipment recommendation": "bg-cyan-100 text-cyan-800",
  "Training to staff": "bg-indigo-100 text-indigo-800",
};

/* ── seed ──────────────────────────────────────────────────────────────── */

const SEED: OtRecord[] = [
  {
    id: "ot1",
    youngPerson: "yp_casey",
    assessmentDate: d(-95),
    ot_name: "Marcia Field",
    otOrganisation: "NHS Children's OT — North West",
    sessionType: "Assessment",
    durationMinutes: 90,
    location: "Oak House — Casey's bedroom and lounge",
    focusAreas: [
      "Sensory processing (full profile)",
      "Self-regulation",
      "Fine motor skills",
      "Daily living skills",
    ],
    assessmentTools: [
      "Sensory Profile 2 (Caregiver + Child)",
      "Bruininks-Oseretsky Test of Motor Proficiency (BOT-2 screen)",
      "Clinical observation in home environment",
      "Interview with key worker",
    ],
    findings:
      "Casey presents with a sensory profile consistent with ASD — significant sensory seeking in vestibular and proprioceptive domains, hypo-responsive auditory processing, and tactile seeking behaviours. Fine motor skills age-appropriate. Self-regulation difficulties most evident during transitions and unstructured time. Strengths include strong physical coordination, motivation for movement-based activities, and capacity to self-soothe with tactile input.",
    sensoryProfile:
      "Seeking: vestibular (high), proprioceptive (high), tactile (moderate). Hypo-responsive: auditory (moderate). Typical: visual, gustatory, olfactory. Interoceptive awareness developing — Casey often does not recognise tiredness or thirst cues.",
    recommendations: [
      { area: "Daily routine", recommendation: "Embed structured movement breaks every 60–90 minutes during awake hours", frequency: "Throughout day", equipment: "Trampoline, climbing frame", staffSupportLevel: "Prompted, independent participation" },
      { area: "Transitions", recommendation: "Provide proprioceptive 'heavy work' before known transitions (carrying laundry basket, pushing shopping trolley)", frequency: "Pre-transition", equipment: "Weighted laundry basket", staffSupportLevel: "Staff-led prompt" },
      { area: "Bedtime", recommendation: "10 minutes of calming tactile input followed by deep pressure (weighted blanket)", frequency: "Nightly", equipment: "Weighted blanket 4kg, soft brush", staffSupportLevel: "Staff to supervise weighted blanket use" },
      { area: "Auditory engagement", recommendation: "Pair verbal instructions with light tactile prompt (touch on shoulder with consent) and visual cue", frequency: "All instructions", equipment: "Visual schedule cards", staffSupportLevel: "All staff" },
    ],
    sensoryDiet: [
      "Morning: 20-minute outdoor activity (run, cycle, or trampoline) before breakfast",
      "Mid-morning: 5-minute movement break — wall push-ups or chair push-ups",
      "Pre-lunch: heavy work task — help carry shopping or move chairs",
      "Afternoon: structured sport or swimming where possible",
      "Pre-homework: 10 minutes trampoline",
      "Pre-bedtime: warm bath, soft blanket wrap, weighted blanket on bed",
    ],
    equipmentProvided: [
      "Weighted blanket (4kg, single bed)",
      "Outdoor trampoline (already in garden — confirmed suitable)",
      "Sensory box: stress balls, putty, textured fidgets",
      "Soft body brush for pre-bath tactile routine",
    ],
    staffTraining:
      "Initial training delivered to all key staff (Anna, Darren, Edward) on sensory profile interpretation, safe weighted blanket use (15-minute supervised periods), and recognising sensory dysregulation versus behavioural communication.",
    homePracticeAdvised: [
      "Continue trampoline access daily",
      "Avoid removing movement opportunities as a sanction — Casey needs movement to self-regulate",
      "Pre-warn Casey of any change with at least 10 minutes notice plus visual cue",
      "Track sleep/wake patterns for 4 weeks to share at review",
    ],
    childResponse:
      "Casey engaged well with the assessment. Enjoyed the movement-based parts. Said the trampoline 'helps my brain feel quiet'. Asked thoughtful questions about why the OT was there.",
    familyInformedDate: d(-93),
    progressNotedSinceLast: "First OT input — baseline established.",
    nextReviewDate: d(-5),
    reportProvided: true,
  },
  {
    id: "ot2",
    youngPerson: "yp_casey",
    assessmentDate: d(-40),
    ot_name: "Marcia Field",
    otOrganisation: "NHS Children's OT — North West",
    sessionType: "Direct intervention",
    durationMinutes: 60,
    location: "Oak House — sensory room and garden",
    focusAreas: [
      "Modulation strategies",
      "Building tolerance for unstructured time",
      "Practising self-prompts for sensory diet",
    ],
    assessmentTools: [
      "Clinical observation",
      "Casey's self-rated regulation scale (0–5 'engine speed')",
    ],
    findings:
      "Casey now reliably uses 'engine speed' language to describe own regulation state. Independently requested trampoline twice during session when feeling 'too fast'. Tolerated 12 minutes of quiet drawing — a meaningful gain from baseline 4 minutes. Tactile defensiveness around new textures emerging that wasn't apparent at first assessment — flagged for monitoring.",
    sensoryProfile:
      "Updated: vestibular seeking unchanged. Tactile profile shifting — increased reactivity to unfamiliar textures (new clothing, certain food). Proprioceptive seeking remains protective.",
    recommendations: [
      { area: "Self-regulation language", recommendation: "Continue using 'engine speed' (Alert Program) language across all settings", frequency: "Throughout day", equipment: "Engine speed visual on bedroom wall", staffSupportLevel: "All staff to model and prompt" },
      { area: "New textures", recommendation: "Introduce new clothing/foods gradually — first explore by sight, then touch fingertips, then wear/taste briefly", frequency: "As needed", equipment: "—", staffSupportLevel: "1:1 staff support during introduction" },
      { area: "Quiet time tolerance", recommendation: "Build quiet activity stamina by 2 minutes weekly — currently at 12, target 25 over 6 weeks", frequency: "Daily quiet block", equipment: "Visual timer, drawing materials", staffSupportLevel: "Staff seated nearby, low-demand presence" },
    ],
    sensoryDiet: [
      "No major changes — current diet working well",
      "Add: fingertip-textures activity 3× weekly (rice tray, beans, fabric scraps) to build tactile tolerance",
      "Add: short 'quiet drawing' session with visual timer post-trampoline",
    ],
    equipmentProvided: [
      "Engine speed visual aid (laminated, bedroom wall)",
      "Visual timer (already in home)",
      "Tactile exploration tray with mixed textures",
    ],
    staffTraining:
      "Refresher delivered on Alert Program language. New guidance on graded texture introduction — written one-page summary left on file.",
    homePracticeAdvised: [
      "Use engine speed check-ins at meals and before bed",
      "Don't force texture exposure — graded exploration only",
      "Praise Casey's use of self-regulation language",
    ],
    childResponse:
      "Casey proud to show OT the 'engine speed' chart and described own state accurately. Engaged willingly throughout. Asked when next visit would be.",
    familyInformedDate: d(-39),
    progressNotedSinceLast:
      "Significant gain in self-awareness and regulation language. Quiet activity tolerance tripled. New tactile defensiveness noted — being monitored.",
    nextReviewDate: d(20),
    reportProvided: true,
  },
  {
    id: "ot3",
    youngPerson: "yp_casey",
    assessmentDate: d(-12),
    ot_name: "Marcia Field",
    otOrganisation: "NHS Children's OT — North West",
    sessionType: "Training to staff",
    durationMinutes: 75,
    location: "Oak House — staff office",
    focusAreas: [
      "Sensory diet implementation review",
      "Recognising co-regulation needs vs behaviour",
      "Adjusting sensory diet during school holidays",
    ],
    assessmentTools: ["Staff feedback questionnaire", "Sensory diet log review"],
    findings:
      "Staff implementing sensory diet consistently — log shows 92% adherence over the last 6 weeks. Confidence varies between team members; less experienced staff benefit from concrete scripts. Sensory diet needs slight adjustment during unstructured holiday periods to prevent dysregulation in late afternoons.",
    sensoryProfile: "No new profile data — review based on existing assessment.",
    recommendations: [
      { area: "Holiday adjustments", recommendation: "Add a second outdoor movement block at 3pm during non-school days to prevent late-afternoon dysregulation", frequency: "Holidays / weekends", equipment: "Existing equipment", staffSupportLevel: "Whole team" },
      { area: "Staff scripts", recommendation: "Use OT-provided one-page scripts for offering sensory choices (4 phrasing options for less experienced staff)", frequency: "As needed", equipment: "Printed scripts in office", staffSupportLevel: "Staff training tool" },
      { area: "Recording", recommendation: "Continue 5-minute daily sensory log entry — useful for upcoming statutory review", frequency: "Daily", equipment: "Existing log book", staffSupportLevel: "Key worker shift" },
    ],
    sensoryDiet: [
      "Existing diet retained",
      "School holidays only: add 3pm 20-minute outdoor block",
      "Existing sensory diet to be printed laminated for fridge",
    ],
    equipmentProvided: ["Laminated sensory diet schedule", "Staff scripts pack (one-page)"],
    staffTraining:
      "Full team session covering sensory diet rationale, holiday adjustments, scripts, and a Q&A on five real scenarios from the past month. Anna and Darren co-led discussion of Casey's progress.",
    homePracticeAdvised: [
      "Continue sensory diet as adjusted",
      "Bring sensory log to next OT review",
      "Flag any sleep regression promptly",
    ],
    childResponse: "Not present — staff training session.",
    familyInformedDate: d(-10),
    progressNotedSinceLast:
      "Implementation strong. Staff confidence improving. No regression.",
    nextReviewDate: d(50),
    reportProvided: false,
  },
  {
    id: "ot4",
    youngPerson: "yp_alex",
    assessmentDate: d(-25),
    ot_name: "Helen Iqbal",
    otOrganisation: "Independent OT (commissioned via CAMHS)",
    sessionType: "Sensory diet planning",
    durationMinutes: 60,
    location: "Oak House — Alex's bedroom",
    focusAreas: [
      "Sensory regulation around ADHD",
      "Pre-homework regulation routine",
      "Bedtime wind-down",
    ],
    assessmentTools: [
      "Adolescent/Adult Sensory Profile (self-report)",
      "Clinical interview with Alex",
      "Bedroom environmental review",
    ],
    findings:
      "Alex's sensory profile aligns with ADHD — high proprioceptive seeking, auditory hyper-responsivity to unpredictable sound, tactile seeking via fidget tools. Alex articulate about own regulation needs and motivated to use strategies. Strong protective factor: Alex actively self-advocates for sensory accommodations at school. Areas for development: structured pre-homework regulation routine (currently inconsistent) and electronics-free wind-down before sleep.",
    sensoryProfile:
      "Proprioceptive seeking (high), auditory hyper-responsive (moderate-high), tactile seeking (moderate). Visual, gustatory, olfactory, vestibular all within typical range.",
    recommendations: [
      { area: "Pre-homework", recommendation: "30-minute structured movement block (gym, run, or wall climbing) before any homework attempt — non-negotiable", frequency: "Every homework session", equipment: "Existing gym equipment in garage", staffSupportLevel: "Prompt only — Alex independent" },
      { area: "Homework setup", recommendation: "Weighted lap pad, fidget on desk, noise-cancelling headphones with low instrumental music", frequency: "All homework", equipment: "Lap pad, fidget set, headphones", staffSupportLevel: "Self-managed" },
      { area: "Bedtime wind-down", recommendation: "60 minutes pre-sleep: phone in bedroom dock (not in bed), 15-minute warm shower, weighted blanket on bed, dim lighting only", frequency: "Nightly", equipment: "Phone dock, weighted blanket (existing)", staffSupportLevel: "Staff to support phone dock routine" },
    ],
    sensoryDiet: [
      "Morning: 10 minutes movement (skipping or push-ups) before school",
      "After school: 30 minutes outdoor activity before homework",
      "Homework breaks every 25 minutes — 5-minute movement",
      "Pre-bed: dimming lights from 9pm, electronics off by 9:30pm, weighted blanket",
    ],
    equipmentProvided: [
      "Weighted lap pad (2kg)",
      "Fidget set (varied textures)",
      "Phone bedside dock (to stop in-bed scrolling)",
    ],
    staffTraining:
      "Brief verbal handover with Anna and Darren — emphasis on the non-negotiable nature of pre-homework movement and not framing it as a 'reward' to be removed.",
    homePracticeAdvised: [
      "Protect pre-homework movement block — even on busy evenings",
      "Phone dock to be respected — Alex agreed in principle",
      "Note any sleep onset improvements over 4 weeks",
    ],
    childResponse:
      "Alex engaged constructively, especially with the homework recommendations. Initially resistant to the bedtime phone change but accepted a 4-week trial. Said the OT 'actually got it' and 'didn't talk down'.",
    familyInformedDate: d(-23),
    progressNotedSinceLast: "First OT input for Alex — baseline established.",
    nextReviewDate: d(35),
    reportProvided: true,
  },
];

/* ── flat row for export ───────────────────────────────────────────────── */

interface FlatRow {
  youngPerson: string;
  assessmentDate: string;
  otName: string;
  otOrganisation: string;
  sessionType: string;
  durationMinutes: string;
  location: string;
  focusAreas: string;
  assessmentTools: string;
  findings: string;
  sensoryProfile: string;
  recommendations: string;
  sensoryDiet: string;
  equipmentProvided: string;
  staffTraining: string;
  homePracticeAdvised: string;
  childResponse: string;
  familyInformedDate: string;
  progressNotedSinceLast: string;
  nextReviewDate: string;
  reportProvided: string;
}

const EXPORT_COLS: ExportColumn<FlatRow>[] = [
  { header: "Young Person",          accessor: (r: FlatRow) => r.youngPerson },
  { header: "Assessment Date",       accessor: (r: FlatRow) => r.assessmentDate },
  { header: "OT Name",               accessor: (r: FlatRow) => r.otName },
  { header: "Organisation",          accessor: (r: FlatRow) => r.otOrganisation },
  { header: "Session Type",          accessor: (r: FlatRow) => r.sessionType },
  { header: "Duration (mins)",       accessor: (r: FlatRow) => r.durationMinutes },
  { header: "Location",              accessor: (r: FlatRow) => r.location },
  { header: "Focus Areas",           accessor: (r: FlatRow) => r.focusAreas },
  { header: "Assessment Tools",      accessor: (r: FlatRow) => r.assessmentTools },
  { header: "Findings",              accessor: (r: FlatRow) => r.findings },
  { header: "Sensory Profile",       accessor: (r: FlatRow) => r.sensoryProfile },
  { header: "Recommendations",       accessor: (r: FlatRow) => r.recommendations },
  { header: "Sensory Diet",          accessor: (r: FlatRow) => r.sensoryDiet },
  { header: "Equipment Provided",    accessor: (r: FlatRow) => r.equipmentProvided },
  { header: "Staff Training",        accessor: (r: FlatRow) => r.staffTraining },
  { header: "Home Practice Advised", accessor: (r: FlatRow) => r.homePracticeAdvised },
  { header: "Child Response",        accessor: (r: FlatRow) => r.childResponse },
  { header: "Family Informed",       accessor: (r: FlatRow) => r.familyInformedDate },
  { header: "Progress Since Last",   accessor: (r: FlatRow) => r.progressNotedSinceLast },
  { header: "Next Review",           accessor: (r: FlatRow) => r.nextReviewDate },
  { header: "Report Provided",       accessor: (r: FlatRow) => r.reportProvided },
];

/* ── component ─────────────────────────────────────────────────────────── */

export default function OccupationalTherapyRecordsPage() {
  const [data] = useState<OtRecord[]>(SEED);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterChild, setFilterChild] = useState("all");
  const [filterSession, setFilterSession] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  const toggle = (id: string) =>
    setExpandedId((cur) => (cur === id ? null : id));

  /* ── stats ───────────────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const today = d(0);
    const ninetyDaysAgo = d(-90);

    const childrenWithActiveOT = new Set(
      data
        .filter((r) => r.assessmentDate >= ninetyDaysAgo)
        .map((r) => r.youngPerson)
    ).size;

    const sessionsThisQuarter = data.filter(
      (r) => r.assessmentDate >= ninetyDaysAgo
    ).length;

    const reviewsDue = data.filter(
      (r) => r.nextReviewDate <= today
    ).length;

    const equipmentInPlace = data.reduce(
      (s, r) => s + r.equipmentProvided.length,
      0
    );

    return { childrenWithActiveOT, sessionsThisQuarter, reviewsDue, equipmentInPlace };
  }, [data]);

  /* ── filtered + sorted ───────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = data;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          getYPName(r.youngPerson).toLowerCase().includes(q) ||
          r.ot_name.toLowerCase().includes(q) ||
          r.findings.toLowerCase().includes(q) ||
          r.focusAreas.some((f) => f.toLowerCase().includes(q))
      );
    }
    if (filterChild !== "all") list = list.filter((r) => r.youngPerson === filterChild);
    if (filterSession !== "all") list = list.filter((r) => r.sessionType === filterSession);

    const out = [...list];
    switch (sortBy) {
      case "date_desc":
        out.sort((a, b) => b.assessmentDate.localeCompare(a.assessmentDate));
        break;
      case "date_asc":
        out.sort((a, b) => a.assessmentDate.localeCompare(b.assessmentDate));
        break;
      case "review":
        out.sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
        break;
      case "child":
        out.sort((a, b) =>
          getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson))
        );
        break;
    }
    return out;
  }, [data, search, filterChild, filterSession, sortBy]);

  /* ── export rows ─────────────────────────────────────────────────── */
  const exportData = useMemo<FlatRow[]>(
    () =>
      data.map((r) => ({
        youngPerson: getYPName(r.youngPerson),
        assessmentDate: r.assessmentDate,
        otName: r.ot_name,
        otOrganisation: r.otOrganisation,
        sessionType: r.sessionType,
        durationMinutes: String(r.durationMinutes),
        location: r.location,
        focusAreas: r.focusAreas.join("; "),
        assessmentTools: r.assessmentTools.join("; "),
        findings: r.findings,
        sensoryProfile: r.sensoryProfile,
        recommendations: r.recommendations
          .map(
            (rec) =>
              `${rec.area} — ${rec.recommendation} (Freq: ${rec.frequency}; Equip: ${rec.equipment}; Support: ${rec.staffSupportLevel})`
          )
          .join(" | "),
        sensoryDiet: r.sensoryDiet.join("; "),
        equipmentProvided: r.equipmentProvided.join("; "),
        staffTraining: r.staffTraining,
        homePracticeAdvised: r.homePracticeAdvised.join("; "),
        childResponse: r.childResponse,
        familyInformedDate: r.familyInformedDate,
        progressNotedSinceLast: r.progressNotedSinceLast,
        nextReviewDate: r.nextReviewDate,
        reportProvided: r.reportProvided ? "Yes" : "No",
      })),
    [data]
  );

  const SESSION_TYPES: SessionType[] = [
    "Assessment",
    "Direct intervention",
    "Consultation",
    "Review",
    "Sensory diet planning",
    "Equipment recommendation",
    "Training to staff",
  ];

  return (
    <PageShell
      title="Occupational Therapy Records"
      subtitle="OT input per child — assessments, recommendations, sensory diets and progress (QS 7)"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Occupational Therapy Records" />
          <ExportButton
            data={exportData}
            columns={EXPORT_COLS}
            filename="occupational-therapy-records"
          />
        </div>
      }
    >
      {/* ── stat strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active OT input", value: stats.childrenWithActiveOT, icon: Activity, colour: "text-blue-600" },
          { label: "Sessions this quarter", value: stats.sessionsThisQuarter, icon: Clipboard, colour: "text-green-600" },
          { label: "Reviews due", value: stats.reviewsDue, icon: CalendarClock, colour: stats.reviewsDue > 0 ? "text-amber-600" : "text-gray-400" },
          { label: "Equipment in place", value: stats.equipmentInPlace, icon: Wrench, colour: "text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border bg-white p-4 flex items-center gap-3">
            <s.icon className={cn("h-6 w-6", s.colour)} />
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── overdue review banner ──────────────────────────────────── */}
      {stats.reviewsDue > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800">OT review overdue</p>
            <p className="text-sm text-amber-700">
              One or more children have an OT review date in the past. Please contact the relevant OT service to schedule the next session.
            </p>
          </div>
        </div>
      )}

      {/* ── filters / sort ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search child, OT, focus area or findings…"
            className="w-full rounded-md border py-2 pl-9 pr-3 text-sm"
          />
        </div>

        <Select value={filterChild} onValueChange={setFilterChild}>
          <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All children</SelectItem>
            {["yp_alex", "yp_jordan", "yp_casey"].map((id) => (
              <SelectItem key={id} value={id}>{getYPName(id)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterSession} onValueChange={setFilterSession}>
          <SelectTrigger className="w-[200px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All session types</SelectItem>
            {SESSION_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <ArrowUpDown className="h-4 w-4" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[170px] h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date_desc">Newest first</SelectItem>
              <SelectItem value="date_asc">Oldest first</SelectItem>
              <SelectItem value="review">Next review</SelectItem>
              <SelectItem value="child">Child name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── records ────────────────────────────────────────────────── */}
      <div className="space-y-4 mb-8">
        {filtered.length === 0 && (
          <div className="rounded-lg border bg-white p-8 text-center text-sm text-gray-500">
            No OT records match the current filters.
          </div>
        )}

        {filtered.map((r) => {
          const open = expandedId === r.id;
          const reviewOverdue = r.nextReviewDate <= d(0);

          return (
            <div key={r.id} className="rounded-lg border bg-white">
              <button
                onClick={() => toggle(r.id)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <h3 className="font-semibold">{getYPName(r.youngPerson)}</h3>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", SESSION_TYPE_COLOURS[r.sessionType])}>
                      {r.sessionType}
                    </span>
                    {r.reportProvided && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <FileCheck2 className="h-3 w-3" /> Report on file
                      </span>
                    )}
                    {reviewOverdue && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                        <AlertTriangle className="h-3 w-3" /> Review overdue
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {r.assessmentDate} · {r.ot_name} ({r.otOrganisation}) · {r.durationMinutes} mins · {r.location}
                  </p>
                </div>
                {open
                  ? <ChevronUp className="h-5 w-5 text-gray-400" />
                  : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>

              {open && (
                <div className="border-t px-4 pb-4 space-y-4">
                  {/* meta row */}
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div><span className="text-gray-500">Date:</span> <span className="font-medium">{r.assessmentDate}</span></div>
                    <div><span className="text-gray-500">Duration:</span> <span className="font-medium">{r.durationMinutes} mins</span></div>
                    <div><span className="text-gray-500">Family informed:</span> <span className="font-medium">{r.familyInformedDate}</span></div>
                    <div><span className="text-gray-500">Next review:</span> <span className={cn("font-medium", reviewOverdue ? "text-red-600" : "")}>{r.nextReviewDate}</span></div>
                  </div>

                  {/* focus areas + tools */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-md bg-gray-50 p-3">
                      <h4 className="text-xs font-semibold text-gray-500 mb-1">Focus Areas</h4>
                      <ul className="list-disc list-inside text-sm space-y-0.5">
                        {r.focusAreas.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-md bg-gray-50 p-3">
                      <h4 className="text-xs font-semibold text-gray-500 mb-1">Assessment Tools</h4>
                      <ul className="list-disc list-inside text-sm space-y-0.5">
                        {r.assessmentTools.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* findings */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">Findings</h4>
                    <p className="text-sm text-gray-800">{r.findings}</p>
                  </div>

                  {/* sensory profile */}
                  {r.sensoryProfile && (
                    <div className="rounded-md bg-purple-50 border border-purple-200 p-3">
                      <h4 className="text-xs font-semibold text-purple-700 mb-1">Sensory Profile</h4>
                      <p className="text-sm text-purple-900">{r.sensoryProfile}</p>
                    </div>
                  )}

                  {/* recommendations table */}
                  {r.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 mb-2">Recommendations</h4>
                      <div className="overflow-x-auto rounded-md border">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                              <th className="px-3 py-2 text-left">Area</th>
                              <th className="px-3 py-2 text-left">Recommendation</th>
                              <th className="px-3 py-2 text-left">Frequency</th>
                              <th className="px-3 py-2 text-left">Equipment</th>
                              <th className="px-3 py-2 text-left">Staff Support</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {r.recommendations.map((rec, i) => (
                              <tr key={i}>
                                <td className="px-3 py-2 font-medium">{rec.area}</td>
                                <td className="px-3 py-2">{rec.recommendation}</td>
                                <td className="px-3 py-2 text-gray-600">{rec.frequency}</td>
                                <td className="px-3 py-2 text-gray-600">{rec.equipment}</td>
                                <td className="px-3 py-2 text-gray-600">{rec.staffSupportLevel}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* sensory diet + equipment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {r.sensoryDiet.length > 0 && (
                      <div className="rounded-md bg-pink-50 border border-pink-200 p-3">
                        <h4 className="text-xs font-semibold text-pink-700 mb-1">Sensory Diet</h4>
                        <ul className="list-disc list-inside text-sm text-pink-900 space-y-0.5">
                          {r.sensoryDiet.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                    {r.equipmentProvided.length > 0 && (
                      <div className="rounded-md bg-cyan-50 border border-cyan-200 p-3">
                        <h4 className="text-xs font-semibold text-cyan-700 mb-1 flex items-center gap-1">
                          <Wrench className="h-3 w-3" /> Equipment Provided
                        </h4>
                        <ul className="list-disc list-inside text-sm text-cyan-900 space-y-0.5">
                          {r.equipmentProvided.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* staff training */}
                  {r.staffTraining && (
                    <div className="rounded-md bg-indigo-50 border border-indigo-200 p-3">
                      <h4 className="text-xs font-semibold text-indigo-700 mb-1 flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" /> Staff Training
                      </h4>
                      <p className="text-sm text-indigo-900">{r.staffTraining}</p>
                    </div>
                  )}

                  {/* home practice */}
                  {r.homePracticeAdvised.length > 0 && (
                    <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
                      <h4 className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                        <HandHelping className="h-3 w-3" /> Home Practice Advised
                      </h4>
                      <ul className="list-disc list-inside text-sm text-blue-900 space-y-0.5">
                        {r.homePracticeAdvised.map((h, i) => <li key={i}>{h}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* child response + progress */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {r.childResponse && (
                      <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                        <h4 className="text-xs font-semibold text-amber-700 mb-1">Child&apos;s Response</h4>
                        <p className="text-sm text-amber-900">{r.childResponse}</p>
                      </div>
                    )}
                    {r.progressNotedSinceLast && (
                      <div className="rounded-md bg-green-50 border border-green-200 p-3">
                        <h4 className="text-xs font-semibold text-green-700 mb-1">Progress Since Last</h4>
                        <p className="text-sm text-green-900">{r.progressNotedSinceLast}</p>
                      </div>
                    )}
                  </div>

                  {/* logged-by */}
                  <div className="text-xs text-gray-400 pt-2 border-t">
                    Coordinated by {getStaffName("staff_anna")} · Reviewed by {getStaffName("staff_darren")} · Report on file: {r.reportProvided ? "yes" : "no"}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── regulatory note ────────────────────────────────────────── */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 mb-6">
        <strong>Quality Standard 7 — The Health and Wellbeing Standard:</strong> Children must be supported to access all health services they need, including specialist therapies. OT recommendations must be implemented consistently across the staff team, equipment provided as advised, and progress reviewed at agreed intervals. Sensory needs identified by an OT are clinical recommendations, not optional preferences — staff must be trained, supported and held accountable for implementation.
      </div>
    </PageShell>
  );
}
