"use client";

import { useState, useMemo } from "react";
import {
  Activity,
  Users,
  Heart,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  CheckCircle,
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

type TherapyType =
  | "Physiotherapy"
  | "Occupational Therapy"
  | "Both"
  | "Hand therapy"
  | "Sensory integration OT"
  | "Hydrotherapy"
  | "Awaiting referral";

type GoalStatus = "Achieved" | "On track" | "Slow progress" | "Not started";

interface TherapyGoal {
  goal: string;
  status: GoalStatus;
  targetDate?: string;
}

interface ExerciseProgram {
  name: string;
  frequency: string;
  whoSupports: string;
}

interface TherapyPlan {
  id: string;
  youngPerson: string;
  therapyType: TherapyType;
  reasonForReferral: string;
  therapistName?: string;
  therapistService: string;
  startDate?: string;
  reviewFrequency?: string;
  goals: TherapyGoal[];
  exercisesPrograms: ExerciseProgram[];
  equipment: string[];
  schoolPlanInPlace: boolean;
  homeEnvironmentAdaptations: string[];
  childMotivation: string;
  staffSupportNeeded: string[];
  childVoice: string;
  staffObservation: string;
  nextAppointment?: string;
  reviewDate: string;
  keyWorker: string;
}

/* ── helpers ───────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const THERAPY_TYPE_COLOURS: Record<TherapyType, string> = {
  "Physiotherapy": "bg-sky-100 text-sky-800",
  "Occupational Therapy": "bg-teal-100 text-teal-800",
  "Both": "bg-indigo-100 text-indigo-800",
  "Hand therapy": "bg-amber-100 text-amber-800",
  "Sensory integration OT": "bg-purple-100 text-purple-800",
  "Hydrotherapy": "bg-cyan-100 text-cyan-800",
  "Awaiting referral": "bg-gray-100 text-gray-700",
};

const GOAL_STATUS_COLOURS: Record<GoalStatus, string> = {
  "Achieved": "bg-green-100 text-green-800 border-green-200",
  "On track": "bg-sky-100 text-sky-800 border-sky-200",
  "Slow progress": "bg-amber-100 text-amber-800 border-amber-200",
  "Not started": "bg-gray-100 text-gray-700 border-gray-200",
};

/* ── seed ──────────────────────────────────────────────────────────────── */

const SEED: TherapyPlan[] = [
  {
    id: "tp_casey_si",
    youngPerson: "yp_casey",
    therapyType: "Sensory integration OT",
    reasonForReferral:
      "Tactile defensiveness affecting daily routines (clothing, grooming, food textures), proprioceptive seeking presenting as crashing/heavy contact behaviours, handwriting fatigue at school. Referred by Anna Freud Centre therapist with paediatric OT input commissioned via local NHS Children's Therapy Services pathway.",
    therapistName: "Beth Cole",
    therapistService: "Paediatric OT (Ayres Sensory Integration accredited)",
    startDate: d(-150),
    reviewFrequency: "Monthly clinic + 6-weekly review at home",
    goals: [
      { goal: "Reduce tactile defensiveness — tolerate label-free clothing, brushed cotton on neck/wrists without distress", status: "On track", targetDate: d(60) },
      { goal: "Channel proprioceptive seeking into structured heavy work, reducing unsafe crashing into furniture", status: "On track", targetDate: d(45) },
      { goal: "Build handwriting endurance — sustain legible writing for 15 minutes without hand fatigue", status: "Slow progress", targetDate: d(90) },
      { goal: "Self-identify regulation state and request a sensory tool independently", status: "Achieved" },
    ],
    exercisesPrograms: [
      { name: "Heavy work circuit (wall push-ups, weighted basket carry, pushing laundry trolley)", frequency: "Twice daily — morning + pre-homework", whoSupports: "Key worker on shift; school TA at lunchtime" },
      { name: "Wilbarger brushing protocol", frequency: "PAUSED — Casey reported 'it didn't help' after 3 weeks; OT agreed to discontinue", whoSupports: "N/A — not currently in use" },
      { name: "Garden swing — linear vestibular input", frequency: "10 minutes after school + as requested", whoSupports: "Casey self-directs; staff supervise" },
      { name: "Weighted lap pad for handwriting tasks", frequency: "All seated desk work over 5 minutes", whoSupports: "Self-managed at home; school aware" },
    ],
    equipment: [
      "Sensory bottle (calming visual)",
      "Weighted blanket (4kg)",
      "Weighted lap pad (1.5kg)",
      "Fidget tools — putty, tangle, textured rings",
      "Garden swing",
    ],
    schoolPlanInPlace: true,
    homeEnvironmentAdaptations: [
      "Sensory corner in lounge — beanbag, low warm lamp, soft throw, fidget basket",
      "Soft lighting in bedroom (no overheads after 7pm)",
      "Hooks and labelled drawers for predictable clothing access",
      "Quiet zone signposted for staff to honour when Casey withdraws there",
    ],
    childMotivation:
      "Casey is highly motivated when activities feel purposeful and adult-respectful. Resistance appears when interventions feel babyish or imposed (the brushing protocol was a clear example). Responds well to being co-author of the plan.",
    staffSupportNeeded: [
      "Read OT one-pager during induction; refresh every 6 months",
      "Prompt — never force — sensory tools",
      "Log heavy work delivery on shift handover",
      "Flag sleep disturbance promptly to OT (proxy for dysregulation)",
    ],
    childVoice:
      "I like the swing and the lap pad. The brushing thing was weird and I told Beth and she actually listened. The sensory corner is mine.",
    staffObservation:
      "Casey now requests the lap pad before homework without prompting (last 4 weeks). Crashing behaviours down approximately 60% since heavy work circuit established. Handwriting endurance still a struggle — slow progress noted at last review.",
    nextAppointment: d(11),
    reviewDate: d(40),
    keyWorker: "staff_chervelle",
  },
  {
    id: "tp_alex_physio",
    youngPerson: "yp_alex",
    therapyType: "Physiotherapy",
    reasonForReferral:
      "Preventive shoulder strengthening following recurrent low-grade discomfort linked to boxing training. Referred by GP to NHS musculoskeletal physiotherapy. No injury — focus on biomechanics, rotator cuff conditioning and posture.",
    therapistName: "James Holroyd",
    therapistService: "NHS MSK Physiotherapy (paediatric pathway)",
    startDate: d(-60),
    reviewFrequency: "Fortnightly clinic for 8 weeks, then review",
    goals: [
      { goal: "Pain-free overhead reach bilaterally", status: "Achieved" },
      { goal: "Build rotator cuff endurance — complete full band programme without compensatory shrug", status: "On track", targetDate: d(20) },
      { goal: "Maintain shoulder hygiene routine independently after physio discharge", status: "On track", targetDate: d(50) },
    ],
    exercisesPrograms: [
      { name: "Resistance band external/internal rotation (3 sets x 12)", frequency: "Daily", whoSupports: "Self-managed; staff visible reminder card on bedroom door" },
      { name: "Scapular setting + wall slides", frequency: "Pre-training", whoSupports: "Self-managed" },
      { name: "Foam roller thoracic mobility", frequency: "3x weekly", whoSupports: "Self-managed; equipment in shared lounge" },
    ],
    equipment: [
      "Resistance band set (light/medium/heavy)",
      "Foam roller",
      "Printed exercise card on bedroom door",
    ],
    schoolPlanInPlace: false,
    homeEnvironmentAdaptations: [
      "Mirror in lounge for form-checking band work",
      "Foam roller stored accessibly",
    ],
    childMotivation:
      "Alex is intrinsically motivated — boxing is a strong protective interest. Frames the programme as performance care, not rehab. Adherence has been excellent (logged 27/30 days last month).",
    staffSupportNeeded: [
      "Light-touch only — Alex prefers self-management",
      "Acknowledge adherence at key worker sessions",
      "Flag any new pain or asymmetry to physio promptly",
    ],
    childVoice:
      "It's not a big deal. The bands are easy. I just want my shoulders strong for sparring.",
    staffObservation:
      "Excellent independent engagement. No flare-ups since programme started. Physio happy with progress at last clinic.",
    nextAppointment: d(7),
    reviewDate: d(28),
    keyWorker: "staff_edward",
  },
];

/* ── flat row for export ───────────────────────────────────────────────── */

interface FlatRow {
  youngPerson: string;
  therapyType: string;
  therapistName: string;
  therapistService: string;
  reasonForReferral: string;
  startDate: string;
  reviewFrequency: string;
  goals: string;
  exercisesPrograms: string;
  equipment: string;
  schoolPlanInPlace: string;
  homeEnvironmentAdaptations: string;
  childMotivation: string;
  staffSupportNeeded: string;
  childVoice: string;
  staffObservation: string;
  nextAppointment: string;
  reviewDate: string;
  keyWorker: string;
}

const EXPORT_COLS: ExportColumn<FlatRow>[] = [
  { header: "Young Person",          accessor: (r: FlatRow) => r.youngPerson },
  { header: "Therapy Type",          accessor: (r: FlatRow) => r.therapyType },
  { header: "Therapist",             accessor: (r: FlatRow) => r.therapistName },
  { header: "Therapist Service",     accessor: (r: FlatRow) => r.therapistService },
  { header: "Reason for Referral",   accessor: (r: FlatRow) => r.reasonForReferral },
  { header: "Start Date",            accessor: (r: FlatRow) => r.startDate },
  { header: "Review Frequency",      accessor: (r: FlatRow) => r.reviewFrequency },
  { header: "Goals",                 accessor: (r: FlatRow) => r.goals },
  { header: "Exercises / Programs",  accessor: (r: FlatRow) => r.exercisesPrograms },
  { header: "Equipment",             accessor: (r: FlatRow) => r.equipment },
  { header: "School Plan in Place",  accessor: (r: FlatRow) => r.schoolPlanInPlace },
  { header: "Home Adaptations",      accessor: (r: FlatRow) => r.homeEnvironmentAdaptations },
  { header: "Child Motivation",      accessor: (r: FlatRow) => r.childMotivation },
  { header: "Staff Support Needed",  accessor: (r: FlatRow) => r.staffSupportNeeded },
  { header: "Child Voice",           accessor: (r: FlatRow) => r.childVoice },
  { header: "Staff Observation",     accessor: (r: FlatRow) => r.staffObservation },
  { header: "Next Appointment",      accessor: (r: FlatRow) => r.nextAppointment },
  { header: "Review Date",           accessor: (r: FlatRow) => r.reviewDate },
  { header: "Key Worker",            accessor: (r: FlatRow) => r.keyWorker },
];

const THERAPY_TYPES: TherapyType[] = [
  "Physiotherapy",
  "Occupational Therapy",
  "Both",
  "Hand therapy",
  "Sensory integration OT",
  "Hydrotherapy",
  "Awaiting referral",
];

/* ── component ─────────────────────────────────────────────────────────── */

export default function ChildPhysioOtPlanPage() {
  const [data] = useState<TherapyPlan[]>(SEED);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("review_asc");

  const toggle = (id: string) =>
    setExpandedId((cur) => (cur === id ? null : id));

  /* ── stats ───────────────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const today = d(0);
    const ninety = d(90);

    const activePlans = data.filter(
      (r) => r.therapyType !== "Awaiting referral"
    ).length;

    const goalsOnTrack = data.reduce(
      (n, r) =>
        n +
        r.goals.filter(
          (g) => g.status === "On track" || g.status === "Achieved"
        ).length,
      0
    );

    const equipmentSupplied = data.reduce(
      (n, r) => n + r.equipment.length,
      0
    );

    const reviewsDue = data.filter(
      (r) => r.reviewDate >= today && r.reviewDate <= ninety
    ).length;

    return { activePlans, goalsOnTrack, equipmentSupplied, reviewsDue };
  }, [data]);

  /* ── filter + sort ───────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = data;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          getYPName(r.youngPerson).toLowerCase().includes(q) ||
          (r.therapistName ?? "").toLowerCase().includes(q) ||
          r.therapistService.toLowerCase().includes(q) ||
          r.reasonForReferral.toLowerCase().includes(q) ||
          r.goals.some((g) => g.goal.toLowerCase().includes(q))
      );
    }
    if (filterType !== "all") list = list.filter((r) => r.therapyType === filterType);

    const out = [...list];
    switch (sortBy) {
      case "review_asc":
        out.sort((a, b) => a.reviewDate.localeCompare(b.reviewDate));
        break;
      case "review_desc":
        out.sort((a, b) => b.reviewDate.localeCompare(a.reviewDate));
        break;
      case "child":
        out.sort((a, b) =>
          getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson))
        );
        break;
      case "type":
        out.sort((a, b) => a.therapyType.localeCompare(b.therapyType));
        break;
    }
    return out;
  }, [data, search, filterType, sortBy]);

  /* ── export rows ─────────────────────────────────────────────────── */
  const exportData = useMemo<FlatRow[]>(
    () =>
      data.map((r) => ({
        youngPerson: getYPName(r.youngPerson),
        therapyType: r.therapyType,
        therapistName: r.therapistName ?? "",
        therapistService: r.therapistService,
        reasonForReferral: r.reasonForReferral,
        startDate: r.startDate ?? "",
        reviewFrequency: r.reviewFrequency ?? "",
        goals: r.goals
          .map(
            (g) =>
              `${g.goal} [${g.status}${g.targetDate ? `, target ${g.targetDate}` : ""}]`
          )
          .join(" | "),
        exercisesPrograms: r.exercisesPrograms
          .map(
            (e) => `${e.name} (Freq: ${e.frequency}; Support: ${e.whoSupports})`
          )
          .join(" | "),
        equipment: r.equipment.join("; "),
        schoolPlanInPlace: r.schoolPlanInPlace ? "Yes" : "No",
        homeEnvironmentAdaptations: r.homeEnvironmentAdaptations.join("; "),
        childMotivation: r.childMotivation,
        staffSupportNeeded: r.staffSupportNeeded.join("; "),
        childVoice: r.childVoice,
        staffObservation: r.staffObservation,
        nextAppointment: r.nextAppointment ?? "",
        reviewDate: r.reviewDate,
        keyWorker: getStaffName(r.keyWorker),
      })),
    [data]
  );

  return (
    <PageShell
      title="Physio & OT Plans"
      subtitle="Per-child physiotherapy and occupational therapy plans — physical, sensory, motor and self-care needs (QS 8)"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Physio & OT Plans" />
          <ExportButton
            data={exportData}
            columns={EXPORT_COLS}
            filename="child-physio-ot-plans"
          />
        </div>
      }
    >
      {/* ── stat strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active plans", value: stats.activePlans, icon: Activity, colour: "text-sky-600" },
          { label: "Goals on track / achieved", value: stats.goalsOnTrack, icon: CheckCircle, colour: "text-teal-600" },
          { label: "Equipment supplied", value: stats.equipmentSupplied, icon: Heart, colour: "text-rose-500" },
          { label: "Reviews due (90d)", value: stats.reviewsDue, icon: Users, colour: stats.reviewsDue > 0 ? "text-amber-600" : "text-gray-400" },
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

      {/* ── filters / sort ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search child, therapist, service or goal…"
            className="w-full rounded-md border py-2 pl-9 pr-3 text-sm"
          />
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[210px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All therapy types</SelectItem>
            {THERAPY_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <ArrowUpDown className="h-4 w-4" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="review_asc">Soonest review</SelectItem>
              <SelectItem value="review_desc">Latest review</SelectItem>
              <SelectItem value="child">Child name</SelectItem>
              <SelectItem value="type">Therapy type</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── plans ──────────────────────────────────────────────────── */}
      <div className="space-y-4 mb-8">
        {filtered.length === 0 && (
          <div className="rounded-lg border bg-white p-8 text-center text-sm text-gray-500">
            No therapy plans match the current filters.
          </div>
        )}

        {filtered.map((r) => {
          const open = expandedId === r.id;
          const goalsOnTrackCount = r.goals.filter(
            (g) => g.status === "On track" || g.status === "Achieved"
          ).length;

          return (
            <div key={r.id} className="rounded-lg border bg-white">
              <button
                onClick={() => toggle(r.id)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-sky-50/40"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Activity className="h-4 w-4 text-sky-500" />
                    <h3 className="font-semibold">{getYPName(r.youngPerson)}</h3>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", THERAPY_TYPE_COLOURS[r.therapyType])}>
                      {r.therapyType}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                      {r.therapistService}
                    </span>
                    {r.schoolPlanInPlace && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <CheckCircle className="h-3 w-3" /> School plan
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      {goalsOnTrackCount}/{r.goals.length} goals on track
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {r.therapistName ? `${r.therapistName} · ` : ""}
                    Key worker {getStaffName(r.keyWorker)} · Next review {r.reviewDate}
                    {r.nextAppointment ? ` · Next appt ${r.nextAppointment}` : ""}
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
                    <div><span className="text-gray-500">Start date:</span> <span className="font-medium">{r.startDate ?? "—"}</span></div>
                    <div><span className="text-gray-500">Review cadence:</span> <span className="font-medium">{r.reviewFrequency ?? "—"}</span></div>
                    <div><span className="text-gray-500">Next appointment:</span> <span className="font-medium">{r.nextAppointment ?? "—"}</span></div>
                    <div><span className="text-gray-500">Plan review:</span> <span className="font-medium">{r.reviewDate}</span></div>
                  </div>

                  {/* reason for referral */}
                  <div className="rounded-md bg-sky-50 border border-sky-200 p-3">
                    <h4 className="text-xs font-semibold text-sky-700 mb-1">Reason for Referral</h4>
                    <p className="text-sm text-sky-900">{r.reasonForReferral}</p>
                  </div>

                  {/* goals */}
                  {r.goals.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 mb-2">Goals</h4>
                      <ul className="space-y-2">
                        {r.goals.map((g, i) => (
                          <li key={i} className="flex items-start justify-between gap-3 rounded-md border p-3">
                            <div className="flex-1">
                              <p className="text-sm">{g.goal}</p>
                              {g.targetDate && (
                                <p className="text-xs text-gray-500 mt-0.5">Target: {g.targetDate}</p>
                              )}
                            </div>
                            <span className={cn("shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border", GOAL_STATUS_COLOURS[g.status])}>
                              {g.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* exercises programs */}
                  {r.exercisesPrograms.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 mb-2">Exercises / Programmes</h4>
                      <div className="overflow-x-auto rounded-md border">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                              <th className="px-3 py-2 text-left">Programme</th>
                              <th className="px-3 py-2 text-left">Frequency</th>
                              <th className="px-3 py-2 text-left">Who Supports</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {r.exercisesPrograms.map((e, i) => (
                              <tr key={i}>
                                <td className="px-3 py-2 font-medium">{e.name}</td>
                                <td className="px-3 py-2 text-gray-600">{e.frequency}</td>
                                <td className="px-3 py-2 text-gray-600">{e.whoSupports}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* equipment + home adaptations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {r.equipment.length > 0 && (
                      <div className="rounded-md bg-cyan-50 border border-cyan-200 p-3">
                        <h4 className="text-xs font-semibold text-cyan-700 mb-1">Equipment</h4>
                        <ul className="list-disc list-inside text-sm text-cyan-900 space-y-0.5">
                          {r.equipment.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                      </div>
                    )}
                    {r.homeEnvironmentAdaptations.length > 0 && (
                      <div className="rounded-md bg-teal-50 border border-teal-200 p-3">
                        <h4 className="text-xs font-semibold text-teal-700 mb-1">Home Environment Adaptations</h4>
                        <ul className="list-disc list-inside text-sm text-teal-900 space-y-0.5">
                          {r.homeEnvironmentAdaptations.map((h, i) => <li key={i}>{h}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* motivation + staff support */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-md bg-rose-50 border border-rose-200 p-3">
                      <h4 className="text-xs font-semibold text-rose-700 mb-1">Child Motivation</h4>
                      <p className="text-sm text-rose-900">{r.childMotivation}</p>
                    </div>
                    {r.staffSupportNeeded.length > 0 && (
                      <div className="rounded-md bg-indigo-50 border border-indigo-200 p-3">
                        <h4 className="text-xs font-semibold text-indigo-700 mb-1">Staff Support Needed</h4>
                        <ul className="list-disc list-inside text-sm text-indigo-900 space-y-0.5">
                          {r.staffSupportNeeded.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* child voice */}
                  {r.childVoice && (
                    <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                      <h4 className="text-xs font-semibold text-amber-700 mb-1">Child&apos;s Voice</h4>
                      <p className="text-sm text-amber-900 italic">&ldquo;{r.childVoice}&rdquo;</p>
                    </div>
                  )}

                  {/* staff observation */}
                  {r.staffObservation && (
                    <div className="rounded-md bg-gray-50 border p-3">
                      <h4 className="text-xs font-semibold text-gray-600 mb-1">Staff Observation</h4>
                      <p className="text-sm text-gray-800">{r.staffObservation}</p>
                    </div>
                  )}

                  {/* footer */}
                  <div className="text-xs text-gray-400 pt-2 border-t">
                    Coordinated by key worker {getStaffName(r.keyWorker)} · Plan reviewed by {getStaffName("staff_darren")}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── regulatory note ────────────────────────────────────────── */}
      <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800 mb-6">
        <strong>Quality Standard 8 — Children&apos;s Health and Wellbeing:</strong> Children must receive specialist therapy input where assessed need exists, with clear individualised plans, equipment provision, environmental adaptations and shared school-home implementation. Plans here align with NHS Children&apos;s Therapy Services pathways, Royal College of Occupational Therapists guidance, Chartered Society of Physiotherapy paediatric standards, the SEND Code of Practice, and UNCRC Article 23 (the right of disabled children to a full and decent life with active participation in the community). The child&apos;s voice — including their right to refuse a programme that isn&apos;t working — is central.
      </div>
    </PageShell>
  );
}
