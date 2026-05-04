"use client";

import { useState, useMemo } from "react";
import {
  Zap,
  Sparkles,
  Clock,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Brain,
  Pill,
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

interface ADHDPlan {
  id: string;
  youngPerson: string;
  planDate: string;
  diagnosisStatus:
    | "Diagnosed"
    | "Awaiting assessment"
    | "Suspected — being explored"
    | "Self-identified"
    | "Not currently considered";
  presentation?:
    | "Predominantly inattentive"
    | "Predominantly hyperactive-impulsive"
    | "Combined"
    | "Unspecified";
  diagnosisDate?: string;
  diagnosingClinician?: string;
  strengths: string[];
  challenges: string[];
  medication?: {
    name: string;
    dose: string;
    timing: string;
    sideEffectsBeingMonitored: string[];
    reviewDate: string;
  };
  medicationHolidayPlan?: string;
  executiveFunctionSupport: string[];
  timeBlindnessStrategies: string[];
  hyperfocusManagement: string[];
  rsdAwareness: string;
  rsdSupport: string[];
  schoolAdjustments: string[];
  homeAdjustments: string[];
  bodyDoublingNotes?: string;
  externalSupport: { agency: string; role: string; frequency: string }[];
  staffDoStrategies: string[];
  staffDoNotStrategies: string[];
  childVoice: string;
  staffObservation: string;
  nextStep: string;
  reviewDate: string;
  keyWorker: string;
}

/* ── helpers ───────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const STATUS_COLOURS: Record<ADHDPlan["diagnosisStatus"], string> = {
  "Diagnosed": "bg-violet-100 text-violet-800",
  "Awaiting assessment": "bg-sky-100 text-sky-800",
  "Suspected — being explored": "bg-amber-100 text-amber-800",
  "Self-identified": "bg-pink-100 text-pink-800",
  "Not currently considered": "bg-gray-100 text-gray-700",
};

/* ── seed ──────────────────────────────────────────────────────────────── */

const SEED: ADHDPlan[] = [
  {
    id: "adhd1",
    youngPerson: "yp_alex",
    planDate: d(-45),
    diagnosisStatus: "Diagnosed",
    presentation: "Combined",
    diagnosisDate: "2024-08-12",
    diagnosingClinician: "Dr. R. Mehta, Derbyshire CAMHS Neurodevelopmental Team",
    strengths: [
      "Hyperfocus on poetry — produces deeply original work in long sittings",
      "Boxing — channels physical energy and builds discipline; coach reports excellent ring focus",
      "Creative, lateral thinking — makes connections others miss",
      "Strong sense of justice — advocates passionately for peers",
      "Empathy for those who feel different",
      "Learns very quickly when interest is sparked",
    ],
    challenges: [
      "Executive function on multi-step tasks (homework, tidying, packing for trips)",
      "Working memory — loses thread mid-task; forgets verbal instructions within minutes",
      "Time blindness — struggles to estimate how long activities take",
      "Rejection Sensitive Dysphoria (significant) — perceived criticism triggers acute distress, exacerbated post coming-out trauma",
      "Task initiation — can stall for an hour before starting something difficult",
      "Emotional regulation when tired or under-stimulated",
    ],
    medication: {
      name: "Methylphenidate XL (Concerta)",
      dose: "36mg",
      timing: "Once daily, 07:30 with breakfast (school days)",
      sideEffectsBeingMonitored: [
        "Appetite suppression — weight + height monitored monthly",
        "Sleep onset latency — bedtime sleep diary kept",
        "Tics or motor stereotypies (none observed to date)",
        "Mood flattening / blunting in late afternoon as dose wears off",
        "Cardiovascular: BP and pulse checked at every CAMHS review",
        "Rebound irritability around 17:00–18:00",
      ],
      reviewDate: d(60),
    },
    medicationHolidayPlan:
      "Weekend holiday option agreed with CAMHS — Alex may skip Saturday and Sunday doses if no demanding cognitive activity planned. Helps protect appetite and growth. Always taken on school days. Holiday option also discussed for half-term and summer holidays — review with prescriber before each break.",
    executiveFunctionSupport: [
      "Visual checklist on bedroom door for morning routine (with photos, not just text)",
      "Tasks broken into single-step instructions — no chains of more than two steps verbally",
      "External working memory: whiteboard in bedroom for today's three priorities",
      "Phone alarms with labels for medication, school bus, and homework start",
      "Body doubling for homework: Anna sits in the room (not directing — just present)",
      "Movement break every 20 minutes during sustained focus tasks",
      "'First / then' framing for transitions (first boxing, then dinner)",
    ],
    timeBlindnessStrategies: [
      "Analogue clock in bedroom and study area — easier to visualise time passing than digital",
      "Time Timer (visual countdown) used for homework blocks",
      "Buffer time built into every transition — leave the house 15 minutes earlier than 'should' work",
      "Backwards-planning out loud with key worker for events ('we need to leave at 8, so eat at 7:30, so wake at 7…')",
      "No vague timeframes ('soon', 'in a bit') — always give a specific time or visual",
    ],
    hyperfocusManagement: [
      "Hyperfocus is a strength — protect it for poetry and boxing wherever possible",
      "Gentle 5-minute warning before transitioning out of hyperfocus state",
      "Never criticise the activity Alex is hyperfocused on — validate before redirecting",
      "Build in physical anchors (stand up, drink water) when emerging from a long focus session",
      "Watch for forgotten meals, hydration and toilet breaks during hyperfocus — prompt without nagging",
    ],
    rsdAwareness:
      "Rejection Sensitive Dysphoria is one of Alex's most significant ADHD features. Perceived criticism, rejection or disapproval can trigger an acute, physically painful emotional response — disproportionate to the trigger but absolutely real. Significantly heightened since the coming-out experience. Staff must understand this is neurological, not 'attention-seeking' or 'over-sensitivity'.",
    rsdSupport: [
      "Separate behaviour from identity — never use shaming language ('you always…', 'why can't you…')",
      "Lead with connection before correction — repair the relationship first, address the behaviour after",
      "Name what you saw, not what it 'meant' — describe behaviour factually without interpretation",
      "Validate the feeling even if the trigger seems small ('that landed really hard for you, didn't it')",
      "Allow space to retreat without it being treated as defiance — RSD often needs 20+ minutes to settle",
      "Repair after rupture — explicitly name 'we're okay' once Alex is regulated",
      "Avoid public correction at all costs — pull aside privately every time",
    ],
    schoolAdjustments: [
      "Extra time in exams (25%) — agreed via Access Arrangements",
      "Permitted fidget tools at desk (silicone, non-distracting)",
      "Movement breaks every lesson — pre-agreed exit card",
      "Teacher of record (Form Tutor Mr. Chen) briefed on AuDHD profile and RSD",
      "Seating near front, away from window/door",
      "Instructions given in writing as well as verbally (printed lesson outline)",
      "Reduced homework load during medication titration phase",
      "Safe space pass for the SEN room when overwhelmed",
    ],
    homeAdjustments: [
      "Quiet study corner in bedroom with noise-cancelling headphones",
      "Body doubling available for homework (Anna or Edward)",
      "Predictable evening routine with visual schedule",
      "Boxing equipment accessible — physical regulation tool, not 'reward'",
      "Phone parked in kitchen during homework to reduce dopamine-pull distraction",
      "Snacks available all evening to compensate for daytime appetite suppression",
      "Later, flexible bedtime on Friday and Saturday to allow medication-free decompression",
    ],
    bodyDoublingNotes:
      "Anna has become Alex's primary body double for homework — sits at the desk with her own paperwork, no instruction or supervision, just companionable presence. Alex reports homework completion has roughly doubled since this started in November. Edward is the back-up body double on Anna's days off. Body doubling is a recognised ADHD strategy — not babysitting and not surveillance.",
    externalSupport: [
      {
        agency: "Derbyshire CAMHS Neurodevelopmental Team",
        role: "Prescribing clinician (Dr. R. Mehta) — medication review and ADHD/autism follow-up",
        frequency: "Every 12 weeks (more frequent during titration)",
      },
      {
        agency: "School SENCO (Ms. Patel)",
        role: "EHCP coordination, exam access arrangements, classroom adjustments",
        frequency: "Half-termly review meeting",
      },
      {
        agency: "ADHD Foundation Neurodiversity Charity",
        role: "Peer support group for teens — Alex attends fortnightly online sessions",
        frequency: "Fortnightly",
      },
      {
        agency: "Boxing club (Riverside ABC)",
        role: "Coach Mike — informal mentor, channels regulation through sport",
        frequency: "Three sessions per week",
      },
    ],
    staffDoStrategies: [
      "Lead with strengths — name what Alex is doing well before any redirection",
      "Use 'I noticed…' language rather than 'you did…' when raising concerns",
      "Offer choices wherever possible to support agency",
      "Build movement into every transition — walk and talk rather than sit and lecture",
      "Honour hyperfocus — protect it as a gift, give warning before interrupting",
      "Validate emotions first; problem-solve only when regulated",
      "Repair after every rupture — name when things are okay again",
      "Believe time blindness is real — no moralising about lateness",
    ],
    staffDoNotStrategies: [
      "Don't shame, sigh, or roll eyes when Alex forgets or loses things — it's the condition, not character",
      "Don't say 'you should know better by now' — working memory does not work that way",
      "Don't correct in front of peers — RSD makes this catastrophic",
      "Don't punish executive function failures (forgotten kit, missed deadlines) — scaffold instead",
      "Don't use medication as leverage ('if you don't behave you won't get your tablet') — medication is healthcare, not currency",
      "Don't withhold poetry, boxing, or other passion activities as punishment — these are regulation tools",
      "Don't minimise RSD pain ('it's not a big deal') — to Alex it physically is",
    ],
    childVoice:
      "I'm not lazy. My brain just doesn't start the engine when I tell it to. People think I don't care because I forget things — I care so much it actually hurts. The medication helps me get through school but I like the weekends without it because I feel more like me. Boxing and poetry are the two things where my brain finally goes quiet. When someone tells me off in front of others I feel like I'm going to physically die — please just pull me aside.",
    staffObservation:
      "Alex's titration onto Concerta has gone well — focus and task initiation visibly improved at school, sleep impact manageable. The body doubling arrangement with Anna has been transformative for homework completion. Greatest remaining concern is RSD — particularly during peer conflict and any perceived rejection from staff. Strengths-led, neuro-affirming approach is working: Alex is increasingly able to name their own ADHD experience without shame.",
    nextStep:
      "Three-month CAMHS medication review on review date below. Continue exploring AuDHD pattern (autistic traits also under assessment with same team — joint assessment requested). Update EHCP at next annual review to reflect new diagnosis. Continue body doubling and review effectiveness at next placement plan meeting.",
    reviewDate: d(60),
    keyWorker: "staff_edward",
  },
];

/* ── flat row for export ───────────────────────────────────────────────── */

const EXPORT_COLS: ExportColumn<ADHDPlan>[] = [
  { header: "Young Person", accessor: (r: ADHDPlan) => getYPName(r.youngPerson) },
  { header: "Plan Date", accessor: (r: ADHDPlan) => r.planDate },
  { header: "Diagnosis Status", accessor: (r: ADHDPlan) => r.diagnosisStatus },
  { header: "Presentation", accessor: (r: ADHDPlan) => r.presentation ?? "" },
  { header: "Diagnosis Date", accessor: (r: ADHDPlan) => r.diagnosisDate ?? "" },
  { header: "Diagnosing Clinician", accessor: (r: ADHDPlan) => r.diagnosingClinician ?? "" },
  { header: "Strengths", accessor: (r: ADHDPlan) => r.strengths.join("; ") },
  { header: "Challenges", accessor: (r: ADHDPlan) => r.challenges.join("; ") },
  { header: "Medication", accessor: (r: ADHDPlan) => r.medication ? `${r.medication.name} ${r.medication.dose} (${r.medication.timing})` : "" },
  { header: "Side Effects Monitored", accessor: (r: ADHDPlan) => r.medication?.sideEffectsBeingMonitored.join("; ") ?? "" },
  { header: "Medication Holiday Plan", accessor: (r: ADHDPlan) => r.medicationHolidayPlan ?? "" },
  { header: "Executive Function Support", accessor: (r: ADHDPlan) => r.executiveFunctionSupport.join("; ") },
  { header: "Time Blindness Strategies", accessor: (r: ADHDPlan) => r.timeBlindnessStrategies.join("; ") },
  { header: "Hyperfocus Management", accessor: (r: ADHDPlan) => r.hyperfocusManagement.join("; ") },
  { header: "RSD Awareness", accessor: (r: ADHDPlan) => r.rsdAwareness },
  { header: "RSD Support", accessor: (r: ADHDPlan) => r.rsdSupport.join("; ") },
  { header: "School Adjustments", accessor: (r: ADHDPlan) => r.schoolAdjustments.join("; ") },
  { header: "Home Adjustments", accessor: (r: ADHDPlan) => r.homeAdjustments.join("; ") },
  { header: "Body Doubling Notes", accessor: (r: ADHDPlan) => r.bodyDoublingNotes ?? "" },
  { header: "External Support", accessor: (r: ADHDPlan) => r.externalSupport.map((e) => `${e.agency} (${e.role}) — ${e.frequency}`).join(" | ") },
  { header: "Staff DO", accessor: (r: ADHDPlan) => r.staffDoStrategies.join("; ") },
  { header: "Staff DO NOT", accessor: (r: ADHDPlan) => r.staffDoNotStrategies.join("; ") },
  { header: "Child Voice", accessor: (r: ADHDPlan) => r.childVoice },
  { header: "Staff Observation", accessor: (r: ADHDPlan) => r.staffObservation },
  { header: "Next Step", accessor: (r: ADHDPlan) => r.nextStep },
  { header: "Review Date", accessor: (r: ADHDPlan) => r.reviewDate },
  { header: "Key Worker", accessor: (r: ADHDPlan) => getStaffName(r.keyWorker) },
];

/* ── component ─────────────────────────────────────────────────────────── */

export default function ChildADHDSupportPlanPage() {
  const [data] = useState<ADHDPlan[]>(SEED);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const toggle = (id: string) =>
    setExpanded((p) => ({ ...p, [id]: !p[id] }));

  /* ── stats ─────────────────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const active = data.length;
    const onMeds = data.filter((r) => r.medication).length;
    const schoolAdj = data.filter((r) => r.schoolAdjustments.length > 0).length;
    const reviewsDue = data.filter(
      (r) => r.reviewDate >= d(0) && r.reviewDate <= d(90),
    ).length;
    return { active, onMeds, schoolAdj, reviewsDue };
  }, [data]);

  /* ── filtered / sorted ─────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = data;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          getYPName(r.youngPerson).toLowerCase().includes(q) ||
          r.diagnosisStatus.toLowerCase().includes(q) ||
          (r.presentation?.toLowerCase().includes(q) ?? false),
      );
    }
    if (filterStatus !== "all") {
      list = list.filter((r) => r.diagnosisStatus === filterStatus);
    }
    const out = [...list];
    switch (sortBy) {
      case "name":
        out.sort((a, b) =>
          getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson)),
        );
        break;
      case "review":
        out.sort((a, b) => a.reviewDate.localeCompare(b.reviewDate));
        break;
      case "planDate":
        out.sort((a, b) => b.planDate.localeCompare(a.planDate));
        break;
    }
    return out;
  }, [data, search, filterStatus, sortBy]);

  return (
    <PageShell
      title="ADHD Support Plans"
      subtitle="Per-child, strength-based ADHD support planning — neurodiversity-affirming, NICE NG87 aligned"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="ADHD Support Plans" />
          <ExportButton
            data={data}
            columns={EXPORT_COLS}
            filename="adhd-support-plans"
          />
        </div>
      }
    >
      {/* ── stat strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Plans", value: stats.active, icon: Brain, colour: "text-violet-600" },
          { label: "On Medication", value: stats.onMeds, icon: Pill, colour: "text-amber-600" },
          { label: "School Adjustments Active", value: stats.schoolAdj, icon: Sparkles, colour: "text-sky-600" },
          { label: "Reviews Due (90d)", value: stats.reviewsDue, icon: Clock, colour: stats.reviewsDue > 0 ? "text-amber-600" : "text-gray-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg border bg-white p-4 flex items-center gap-3"
          >
            <s.icon className={cn("h-6 w-6", s.colour)} />
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── filters ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search children, diagnosis status or presentation…"
            className="w-full rounded-md border py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[210px] h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Diagnosis Statuses</SelectItem>
            {(Object.keys(STATUS_COLOURS) as ADHDPlan["diagnosisStatus"][]).map(
              (k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <ArrowUpDown className="h-4 w-4" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="review">Review Due</SelectItem>
              <SelectItem value="planDate">Most Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── cards ──────────────────────────────────────────────────── */}
      <div className="space-y-4 mb-8">
        {filtered.map((r) => {
          const open = expanded[r.id] ?? false;
          return (
            <div
              key={r.id}
              className="rounded-lg border border-violet-100 bg-white"
            >
              <button
                onClick={() => toggle(r.id)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-violet-50/50"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Brain className="h-4 w-4 text-violet-500" />
                    <h3 className="font-semibold">
                      {getYPName(r.youngPerson)}
                    </h3>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        STATUS_COLOURS[r.diagnosisStatus],
                      )}
                    >
                      {r.diagnosisStatus}
                    </span>
                    {r.presentation && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                        {r.presentation}
                      </span>
                    )}
                    {r.medication && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <Pill className="h-3 w-3" />
                        On medication
                      </span>
                    )}
                    {r.rsdAwareness && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                        RSD-aware
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Plan {r.planDate} · Key worker {getStaffName(r.keyWorker)} ·{" "}
                    Review {r.reviewDate}
                  </p>
                </div>
                {open ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {open && (
                <div className="border-t border-violet-100 px-4 pb-4 space-y-4">
                  {/* meta row */}
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Plan date:</span>{" "}
                      <span className="font-medium">{r.planDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Diagnosis date:</span>{" "}
                      <span className="font-medium">
                        {r.diagnosisDate ?? "—"}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Clinician:</span>{" "}
                      <span className="font-medium">
                        {r.diagnosingClinician ?? "—"}
                      </span>
                    </div>
                  </div>

                  {/* strengths + challenges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                      <h4 className="text-xs font-semibold text-emerald-700 mb-1 inline-flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Strengths
                      </h4>
                      <ul className="list-disc list-inside text-sm text-emerald-900 space-y-0.5">
                        {r.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                      <h4 className="text-xs font-semibold text-amber-700 mb-1">
                        Challenges
                      </h4>
                      <ul className="list-disc list-inside text-sm text-amber-900 space-y-0.5">
                        {r.challenges.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* medication */}
                  {r.medication && (
                    <div className="rounded-md border border-amber-300 bg-amber-50 p-3">
                      <h4 className="text-xs font-semibold text-amber-800 mb-2 inline-flex items-center gap-1">
                        <Pill className="h-3 w-3" /> Medication
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-amber-900 mb-2">
                        <div>
                          <span className="text-amber-700">Name:</span>{" "}
                          <span className="font-medium">
                            {r.medication.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-amber-700">Dose:</span>{" "}
                          <span className="font-medium">
                            {r.medication.dose}
                          </span>
                        </div>
                        <div>
                          <span className="text-amber-700">Timing:</span>{" "}
                          <span className="font-medium">
                            {r.medication.timing}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-amber-900">
                        <p className="font-medium mb-1">
                          Side effects being monitored:
                        </p>
                        <ul className="list-disc list-inside space-y-0.5">
                          {r.medication.sideEffectsBeingMonitored.map(
                            (s, i) => (
                              <li key={i}>{s}</li>
                            ),
                          )}
                        </ul>
                      </div>
                      <p className="text-xs text-amber-700 mt-2">
                        Next medication review:{" "}
                        <span className="font-medium">
                          {r.medication.reviewDate}
                        </span>
                      </p>
                      {r.medicationHolidayPlan && (
                        <div className="mt-2 rounded bg-white/60 p-2 text-sm text-amber-900">
                          <span className="font-medium">
                            Medication holiday plan:
                          </span>{" "}
                          {r.medicationHolidayPlan}
                        </div>
                      )}
                    </div>
                  )}

                  {/* executive function */}
                  <div className="rounded-md border border-violet-200 bg-violet-50 p-3">
                    <h4 className="text-xs font-semibold text-violet-700 mb-1 inline-flex items-center gap-1">
                      <Brain className="h-3 w-3" /> Executive Function Support
                    </h4>
                    <ul className="list-disc list-inside text-sm text-violet-900 space-y-0.5">
                      {r.executiveFunctionSupport.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* time blindness + hyperfocus */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md border border-sky-200 bg-sky-50 p-3">
                      <h4 className="text-xs font-semibold text-sky-700 mb-1 inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Time Blindness Strategies
                      </h4>
                      <ul className="list-disc list-inside text-sm text-sky-900 space-y-0.5">
                        {r.timeBlindnessStrategies.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md border border-violet-200 bg-violet-50 p-3">
                      <h4 className="text-xs font-semibold text-violet-700 mb-1 inline-flex items-center gap-1">
                        <Zap className="h-3 w-3" /> Hyperfocus Management
                      </h4>
                      <ul className="list-disc list-inside text-sm text-violet-900 space-y-0.5">
                        {r.hyperfocusManagement.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* RSD */}
                  <div className="rounded-md border border-pink-200 bg-pink-50 p-3">
                    <h4 className="text-xs font-semibold text-pink-700 mb-1">
                      Rejection Sensitive Dysphoria (RSD) — Awareness
                    </h4>
                    <p className="text-sm text-pink-900 mb-2">
                      {r.rsdAwareness}
                    </p>
                    {r.rsdSupport.length > 0 && (
                      <>
                        <h5 className="text-xs font-semibold text-pink-700 mb-1">
                          RSD support
                        </h5>
                        <ul className="list-disc list-inside text-sm text-pink-900 space-y-0.5">
                          {r.rsdSupport.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  {/* school + home adjustments */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md border border-sky-200 bg-sky-50 p-3">
                      <h4 className="text-xs font-semibold text-sky-700 mb-1">
                        School Adjustments
                      </h4>
                      <ul className="list-disc list-inside text-sm text-sky-900 space-y-0.5">
                        {r.schoolAdjustments.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md border border-violet-200 bg-violet-50 p-3">
                      <h4 className="text-xs font-semibold text-violet-700 mb-1">
                        Home Adjustments
                      </h4>
                      <ul className="list-disc list-inside text-sm text-violet-900 space-y-0.5">
                        {r.homeAdjustments.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* body doubling */}
                  {r.bodyDoublingNotes && (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                      <h4 className="text-xs font-semibold text-emerald-700 mb-1">
                        Body Doubling
                      </h4>
                      <p className="text-sm text-emerald-900">
                        {r.bodyDoublingNotes}
                      </p>
                    </div>
                  )}

                  {/* external support */}
                  {r.externalSupport.length > 0 && (
                    <div className="rounded-md border bg-white p-3">
                      <h4 className="text-xs font-semibold text-gray-500 mb-2">
                        External Support
                      </h4>
                      <div className="space-y-2">
                        {r.externalSupport.map((e, i) => (
                          <div
                            key={i}
                            className="rounded bg-gray-50 p-2 text-sm"
                          >
                            <p className="font-medium">{e.agency}</p>
                            <p className="text-gray-700">{e.role}</p>
                            <p className="text-xs text-gray-500">
                              Frequency: {e.frequency}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* staff DO / DO NOT */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                      <h4 className="text-xs font-semibold text-emerald-700 mb-1">
                        Staff DO
                      </h4>
                      <ul className="list-disc list-inside text-sm text-emerald-900 space-y-0.5">
                        {r.staffDoStrategies.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md border border-rose-200 bg-rose-50 p-3">
                      <h4 className="text-xs font-semibold text-rose-700 mb-1">
                        Staff DO NOT
                      </h4>
                      <ul className="list-disc list-inside text-sm text-rose-900 space-y-0.5">
                        {r.staffDoNotStrategies.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* child voice */}
                  <div className="rounded-md border border-pink-200 bg-pink-50 p-3">
                    <h4 className="text-xs font-semibold text-pink-700 mb-1">
                      Child&apos;s Voice
                    </h4>
                    <p className="text-sm italic text-pink-900">
                      {r.childVoice}
                    </p>
                  </div>

                  {/* staff observation */}
                  <div className="rounded-md bg-gray-50 p-3">
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">
                      Staff Observation
                    </h4>
                    <p className="text-sm text-gray-800">
                      {r.staffObservation}
                    </p>
                  </div>

                  {/* next step */}
                  <div className="rounded-md border border-sky-200 bg-sky-50 p-3">
                    <h4 className="text-xs font-semibold text-sky-700 mb-1">
                      Next Step
                    </h4>
                    <p className="text-sm text-sky-900">{r.nextStep}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── regulatory note ────────────────────────────────────────── */}
      <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900 mb-6">
        <strong>Regulatory framework:</strong> ADHD support planning aligns
        with NICE NG87 (Attention deficit hyperactivity disorder: diagnosis
        and management), NHS Right to Choose pathway for assessment, ADHD UK
        and ADHD Foundation guidance, the Equality Act 2010, the Children&apos;s
        Homes (England) Regulations 2015 Quality Standards 5 (Education), 6
        (Enjoyment and Achievement), 7 (Health and Well-being) and 8
        (Positive Relationships), and UNCRC Articles 12 (right to be heard)
        and 23 (rights of disabled children). Plans are strength-based and
        neurodiversity-affirming — ADHD is a difference in cognitive style,
        not a deficit of character.
      </div>
    </PageShell>
  );
}
