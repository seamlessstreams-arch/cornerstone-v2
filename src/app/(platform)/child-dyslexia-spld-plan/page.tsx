"use client";

import { useState, useMemo } from "react";
import {
  BookOpen,
  Sparkles,
  Lightbulb,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Award,
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

type SpLDCondition =
  | "Dyslexia"
  | "Dyscalculia"
  | "Dysgraphia"
  | "DCD / Dyspraxia"
  | "Auditory processing difficulty"
  | "Visual processing difficulty";

type DiagnosisStatus =
  | "Diagnosed"
  | "Awaiting assessment"
  | "Suspected"
  | "Self-identified";

type TechOutcome =
  | "Loves it"
  | "Useful"
  | "Tried — not useful"
  | "Resists";

interface TechnologyTried {
  name: string;
  outcome: TechOutcome;
}

interface ExternalSupport {
  agency: string;
  role: string;
  frequency: string;
}

interface SpLDPlan {
  id: string;
  youngPerson: string;
  planDate: string;
  conditions: SpLDCondition[];
  diagnosisStatus: DiagnosisStatus;
  diagnosingProfessional?: string;
  diagnosisDate?: string;
  strengths: string[];
  challenges: string[];
  technologyInUse: string[];
  technologyTried: TechnologyTried[];
  schoolAccessArrangements: string[];
  examConcessionsAgreed: string[];
  homeStudySupport: string[];
  staffStrategies: string[];
  externalSupport: ExternalSupport[];
  identityWork: string[];
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

const STATUS_COLOURS: Record<DiagnosisStatus, string> = {
  "Diagnosed": "bg-sky-100 text-sky-800 border-sky-200",
  "Awaiting assessment": "bg-amber-100 text-amber-800 border-amber-200",
  "Suspected": "bg-violet-100 text-violet-800 border-violet-200",
  "Self-identified": "bg-teal-100 text-teal-800 border-teal-200",
};

const CONDITION_COLOURS: Record<SpLDCondition, string> = {
  "Dyslexia": "bg-sky-50 text-sky-700 border-sky-200",
  "Dyscalculia": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Dysgraphia": "bg-violet-50 text-violet-700 border-violet-200",
  "DCD / Dyspraxia": "bg-teal-50 text-teal-700 border-teal-200",
  "Auditory processing difficulty": "bg-amber-50 text-amber-700 border-amber-200",
  "Visual processing difficulty": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
};

const TECH_OUTCOME_COLOURS: Record<TechOutcome, string> = {
  "Loves it": "bg-emerald-100 text-emerald-800",
  "Useful": "bg-teal-100 text-teal-800",
  "Tried — not useful": "bg-amber-100 text-amber-800",
  "Resists": "bg-rose-100 text-rose-800",
};

/* ── seed data ─────────────────────────────────────────────────────────── */

const SEED: SpLDPlan[] = [
  {
    id: "spld_jordan_01",
    youngPerson: "yp_jordan",
    planDate: d(-21),
    conditions: ["Dyslexia"],
    diagnosisStatus: "Diagnosed",
    diagnosingProfessional:
      "Dr Helen Marsden, Chartered Educational Psychologist (BPS-registered, AMBDA)",
    diagnosisDate: d(-1825),
    strengths: [
      "Exceptional oral reasoning — talks ideas out before writing them",
      "Big-picture pattern thinker — sees connections others miss",
      "Outstanding football tactical awareness — reads play three moves ahead",
      "Strong empathy and social intelligence with peers",
      "Vivid visual-spatial imagination — draws plays and diagrams",
      "Verbal vocabulary above chronological age (assessor noted)",
      "Resilience — has worked twice as hard as peers and kept going",
    ],
    challenges: [
      "Working memory weaker than verbal reasoning (significant discrepancy)",
      "Reading speed below chronological age — fatigues over long texts",
      "Spelling — phonologically plausible but inconsistent",
      "Note-taking in class — cannot listen and write at the same time",
      "Long-form essays — ideas faster than handwriting",
      "Sequencing multi-step instructions given verbally without visual back-up",
    ],
    technologyInUse: [
      "Read&Write Gold (Texthelp) — text-to-speech across school and home",
      "Audible — audiobooks for English literature set texts and pleasure reading",
      "OneNote with voice notes — captures lesson content without writing pressure",
      "Microsoft Immersive Reader for online articles",
      "ClaroSpeak on phone — for reading menus, signs, longer messages",
      "Iron-on shirt labels — Jordan no longer mis-spells own surname on PE kit",
    ],
    technologyTried: [
      { name: "Read&Write Gold", outcome: "Loves it" },
      { name: "Audible audiobooks", outcome: "Loves it" },
      { name: "OneNote voice notes", outcome: "Useful" },
      { name: "Mind-mapping (MindView)", outcome: "Useful" },
      { name: "Dragon NaturallySpeaking dictation", outcome: "Tried — not useful" },
      { name: "Coloured overlays (blue tint)", outcome: "Resists" },
    ],
    schoolAccessArrangements: [
      "Sit at the front of the class — reduces visual distraction load",
      "Print handouts on cream paper, 12pt sans-serif (Arial), 1.5 line spacing",
      "Laptop in lessons for any extended writing task",
      "Copy of teacher slides emailed before each lesson (no copying from board)",
      "Spelling not penalised in subjects other than English language",
      "Verbal feedback alongside written marking — avoids 'red-pen overwhelm'",
      "Reduced homework reading load — same content, audiobook or summary version",
    ],
    examConcessionsAgreed: [
      "25% extra time (JCQ Form 8 evidence on file via SENCo)",
      "Use of a reader for English literature and language papers",
      "Use of a word processor with spell-check disabled (per JCQ rules)",
      "Separate small room for exams — reduces pace anxiety",
      "Rest breaks (supervised) on papers over 90 minutes",
    ],
    homeStudySupport: [
      "Anna (key worker) reads-along sometimes for non-fiction homework",
      "Audiobook + paperback paired reading — listen and follow along",
      "20-minute homework chunks with 5-minute movement breaks",
      "Spelling words practised with magnetic letters not pen-and-paper",
      "Voice-note draft answers first, then type up using text-to-speech to check",
      "No 'reading aloud in front of others' at home unless Jordan chooses",
      "Library trip every fortnight — Jordan picks audiobook and matched paperback",
    ],
    staffStrategies: [
      "Give instructions one step at a time, in writing if possible",
      "Allow Jordan to talk through the answer before writing — never 'just write it down'",
      "Praise effort and strategy, not output volume — a half-page of clear thinking is the goal",
      "Never ask Jordan to read aloud cold — offer rehearsal time or right to pass",
      "Use mind-maps or diagrams when explaining new concepts",
      "Spell-check is a tool, not cheating — model using it openly",
      "Notice the strengths daily — name them out loud",
    ],
    externalSupport: [
      {
        agency: "Allestree Woodlands School SENCo",
        role: "Access arrangements coordination, JCQ Form 8 evidence holder, exam concessions liaison",
        frequency: "Half-termly review meeting + email contact as needed",
      },
    ],
    identityWork: [
      "Jordan now describes dyslexia in own words: 'I think differently — that's why I'm good at football tactics.'",
      "Watched Steven Spielberg, Keira Knightley and Jamie Oliver dyslexia interviews together with Anna",
      "Joined British Dyslexia Association youth ambassadors mailing list (Jordan's choice)",
      "Reframed primary-school 'lazy' label — read old reports together and named what was actually going on",
      "Football-tactics journal — Jordan dictates plays into OneNote, prints diagrams. This is writing too.",
    ],
    childVoice:
      "I'm not stupid. I used to think I was because I read slow and my spelling looks weird. Now I know my brain just works different. I'm good at seeing things on a football pitch before they happen — that's the same brain. Read&Write means I can read what I want, not just what I can manage. I like audiobooks more than my mates do, actually. The best thing staff do is not make me read out loud in front of people. The worst thing teachers used to do was give me a red-penned page back and call it 'careless.'",
    staffObservation:
      "Jordan's confidence has grown markedly since the strength-based reframe began — eye contact, willingness to attempt unfamiliar texts, and a reduced 'I can't' response are all visible. Working memory remains the area of greatest impact and JCQ access arrangements are critical for upcoming GCSEs. The team should hold the line on spelling not being penalised in non-English subjects — this is a reasonable adjustment under the Equality Act 2010, not a favour. Jordan's identity work is the foundation: every other accommodation lands better when Jordan owns the dyslexic identity positively.",
    nextStep:
      "Confirm JCQ Form 8 evidence is current with SENCo at next half-term meeting (covers GCSEs in 2026). Trial mind-mapping software (MindView) for revision planning. Anna to source a Year 11 dyslexic peer mentor through BDA youth network if Jordan would like one.",
    reviewDate: d(75),
    keyWorker: "staff_anna",
  },
  {
    id: "spld_casey_01",
    youngPerson: "yp_casey",
    planDate: d(-10),
    conditions: ["DCD / Dyspraxia"],
    diagnosisStatus: "Awaiting assessment",
    strengths: [
      "Strong creative ideas — verbal and visual planning is rich",
      "Patient with self when scaffolding is in place",
      "Good listener — picks up tone and meaning that peers miss",
      "Empathic — supports younger children with kindness",
    ],
    challenges: [
      "Fine-motor handwriting endurance — hand pain after 10 minutes",
      "Letter formation inconsistent and slow",
      "Coordination — cutlery, shoelaces, ball skills all effortful",
      "Organising belongings and PE kit without prompts",
      "Spatial awareness in busy corridors and crowded rooms",
    ],
    technologyInUse: [
      "Pencil grip (Stetro) trialled in school",
      "Sloped writing board on Casey's desk at home",
      "Velcro shoes (Casey's choice — laces being practised separately)",
    ],
    technologyTried: [
      { name: "Pencil grip (Stetro)", outcome: "Useful" },
      { name: "Sloped writing board", outcome: "Useful" },
      { name: "Touch-typing programme (BBC Dance Mat)", outcome: "Loves it" },
      { name: "Weighted pen", outcome: "Tried — not useful" },
    ],
    schoolAccessArrangements: [
      "Reduced volume of handwritten work where laptop alternative exists",
      "Extra time for fine-motor practical tasks (DT, art, science apparatus)",
      "Pre-agreed PE adaptations — Casey not 'last picked' for team games",
      "Lunchtime pass to leave classroom 2 minutes early to avoid corridor crush",
    ],
    examConcessionsAgreed: [
      "Pending paediatric OT assessment — JCQ evidence will follow if recommended",
    ],
    homeStudySupport: [
      "Touch-typing 10 minutes a day before screen time — making it routine, not a chore",
      "Homework dictated to staff scribe when handwriting endurance fails",
      "Shoelace practice as 'side activity' during Casey's chosen TV programme",
      "Backpack repacked together at bedtime — visual checklist on door",
    ],
    staffStrategies: [
      "Avoid 'just try harder' or 'you did it yesterday' language — DCD effort is not consistent",
      "Praise the strategy used, not the output",
      "Build rest breaks into any handwriting task",
      "Never use handwriting as punishment ('lines') — it would be cruel and counter-productive",
      "Watch for fatigue and frustration cues; offer the dictation route before tears",
    ],
    externalSupport: [
      {
        agency: "Royal Derby Hospital — Paediatric Occupational Therapy",
        role: "DCD assessment pathway — referral made, on waiting list",
        frequency: "Awaiting first appointment (estimated 14 weeks)",
      },
    ],
    identityWork: [
      "Casey aware of dyspraxia possibility and curious, not anxious — language used is 'your brain and body talk to each other in their own way'",
      "Daniel Radcliffe and Cara Delevingne mentioned as people Casey knows of who have dyspraxia",
      "Avoided the word 'clumsy' — replaced with 'still learning that pathway'",
    ],
    childVoice:
      "My hands get tired before my brain is finished. I want to type more. I'm not bad at PE on purpose — please don't make me captain or last-picked. I like that staff don't laugh when I drop things.",
    staffObservation:
      "Casey's awareness of own difficulties is age-appropriate and the strength-based language is taking root well. The OT assessment is the gateway to formal accommodations and should be chased monthly. Touch-typing is the highest-leverage intervention — building the skill now means Year 9 onward Casey can choose laptop in lessons. Staff should resist any school suggestion of 'practising handwriting more' — endurance does not improve with volume in DCD; it requires assessment and strategy.",
    nextStep:
      "Anna to ring paediatric OT secretary fortnightly for cancellation slots. Establish touch-typing baseline (words per minute) this week so progress is visible to Casey. Discuss Casey's preferences for PE arrangements with school PE lead before next half-term.",
    reviewDate: d(45),
    keyWorker: "staff_anna",
  },
];

/* ── flat row for export ───────────────────────────────────────────────── */

interface FlatRow {
  youngPerson: string;
  planDate: string;
  conditions: string;
  diagnosisStatus: string;
  diagnosingProfessional: string;
  diagnosisDate: string;
  strengths: string;
  challenges: string;
  technologyInUse: string;
  technologyTried: string;
  schoolAccessArrangements: string;
  examConcessionsAgreed: string;
  homeStudySupport: string;
  staffStrategies: string;
  externalSupport: string;
  identityWork: string;
  childVoice: string;
  staffObservation: string;
  nextStep: string;
  reviewDate: string;
  keyWorker: string;
}

const EXPORT_COLS: ExportColumn<FlatRow>[] = [
  { header: "Young Person", accessor: (r: FlatRow) => r.youngPerson },
  { header: "Plan Date", accessor: (r: FlatRow) => r.planDate },
  { header: "Conditions", accessor: (r: FlatRow) => r.conditions },
  { header: "Diagnosis Status", accessor: (r: FlatRow) => r.diagnosisStatus },
  { header: "Diagnosing Professional", accessor: (r: FlatRow) => r.diagnosingProfessional },
  { header: "Diagnosis Date", accessor: (r: FlatRow) => r.diagnosisDate },
  { header: "Strengths", accessor: (r: FlatRow) => r.strengths },
  { header: "Challenges", accessor: (r: FlatRow) => r.challenges },
  { header: "Technology In Use", accessor: (r: FlatRow) => r.technologyInUse },
  { header: "Technology Tried", accessor: (r: FlatRow) => r.technologyTried },
  { header: "School Access Arrangements", accessor: (r: FlatRow) => r.schoolAccessArrangements },
  { header: "Exam Concessions", accessor: (r: FlatRow) => r.examConcessionsAgreed },
  { header: "Home Study Support", accessor: (r: FlatRow) => r.homeStudySupport },
  { header: "Staff Strategies", accessor: (r: FlatRow) => r.staffStrategies },
  { header: "External Support", accessor: (r: FlatRow) => r.externalSupport },
  { header: "Identity Work", accessor: (r: FlatRow) => r.identityWork },
  { header: "Child Voice", accessor: (r: FlatRow) => r.childVoice },
  { header: "Staff Observation", accessor: (r: FlatRow) => r.staffObservation },
  { header: "Next Step", accessor: (r: FlatRow) => r.nextStep },
  { header: "Review Date", accessor: (r: FlatRow) => r.reviewDate },
  { header: "Key Worker", accessor: (r: FlatRow) => r.keyWorker },
];

/* ── component ─────────────────────────────────────────────────────────── */

export default function ChildDyslexiaSpLDPlanPage() {
  const [data] = useState<SpLDPlan[]>(SEED);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [filterCondition, setFilterCondition] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  /* stats */
  const stats = useMemo(() => {
    const active = data.length;
    const diagnosed = data.filter((r) => r.diagnosisStatus === "Diagnosed").length;
    const examAccess = data.filter((r) => r.examConcessionsAgreed.length > 0).length;
    const reviewSoon = data.filter((r) => r.reviewDate <= d(90)).length;
    return { active, diagnosed, examAccess, reviewSoon };
  }, [data]);

  /* filtered / sorted */
  const filtered = useMemo(() => {
    let list = data;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          getYPName(r.youngPerson).toLowerCase().includes(q) ||
          r.conditions.some((c) => c.toLowerCase().includes(q)) ||
          r.diagnosisStatus.toLowerCase().includes(q) ||
          r.strengths.some((s) => s.toLowerCase().includes(q)),
      );
    }
    if (filterCondition !== "all") {
      list = list.filter((r) => r.conditions.includes(filterCondition as SpLDCondition));
    }
    const out = [...list];
    switch (sortBy) {
      case "name":
        out.sort((a, b) => getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson)));
        break;
      case "review":
        out.sort((a, b) => a.reviewDate.localeCompare(b.reviewDate));
        break;
      case "strengths":
        out.sort((a, b) => b.strengths.length - a.strengths.length);
        break;
    }
    return out;
  }, [data, search, filterCondition, sortBy]);

  /* export */
  const exportData = useMemo<FlatRow[]>(
    () =>
      data.map((r) => ({
        youngPerson: getYPName(r.youngPerson),
        planDate: r.planDate,
        conditions: r.conditions.join("; "),
        diagnosisStatus: r.diagnosisStatus,
        diagnosingProfessional: r.diagnosingProfessional ?? "",
        diagnosisDate: r.diagnosisDate ?? "",
        strengths: r.strengths.join("; "),
        challenges: r.challenges.join("; "),
        technologyInUse: r.technologyInUse.join("; "),
        technologyTried: r.technologyTried
          .map((t) => `${t.name} (${t.outcome})`)
          .join(" | "),
        schoolAccessArrangements: r.schoolAccessArrangements.join("; "),
        examConcessionsAgreed: r.examConcessionsAgreed.join("; "),
        homeStudySupport: r.homeStudySupport.join("; "),
        staffStrategies: r.staffStrategies.join("; "),
        externalSupport: r.externalSupport
          .map((e) => `${e.agency} — ${e.role} (${e.frequency})`)
          .join(" | "),
        identityWork: r.identityWork.join("; "),
        childVoice: r.childVoice,
        staffObservation: r.staffObservation,
        nextStep: r.nextStep,
        reviewDate: r.reviewDate,
        keyWorker: getStaffName(r.keyWorker),
      })),
    [data],
  );

  return (
    <PageShell
      title="SpLD Support Plans"
      subtitle="Per-child Specific Learning Difficulty plan — dyslexia, dyscalculia, dysgraphia, DCD/dyspraxia. Strength-based, neurodiversity-affirming, technology-led."
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="SpLD Support Plans" />
          <ExportButton data={exportData} columns={EXPORT_COLS} filename="spld-support-plans" />
        </div>
      }
    >
      {/* ── stat strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Plans", value: stats.active, icon: BookOpen, colour: "text-sky-600" },
          { label: "Diagnosed", value: stats.diagnosed, icon: Award, colour: "text-teal-600" },
          { label: "Exam Access In Place", value: stats.examAccess, icon: Lightbulb, colour: "text-indigo-600" },
          { label: "Reviews Due 90d", value: stats.reviewSoon, icon: Sparkles, colour: "text-amber-600" },
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

      {/* ── filters ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search children, conditions, strengths…"
            className="w-full rounded-md border py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <Select value={filterCondition} onValueChange={setFilterCondition}>
          <SelectTrigger className="w-[240px] h-9 text-sm">
            <SelectValue placeholder="All Conditions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            <SelectItem value="Dyslexia">Dyslexia</SelectItem>
            <SelectItem value="Dyscalculia">Dyscalculia</SelectItem>
            <SelectItem value="Dysgraphia">Dysgraphia</SelectItem>
            <SelectItem value="DCD / Dyspraxia">DCD / Dyspraxia</SelectItem>
            <SelectItem value="Auditory processing difficulty">Auditory processing</SelectItem>
            <SelectItem value="Visual processing difficulty">Visual processing</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <ArrowUpDown className="h-4 w-4" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="review">Review Date</SelectItem>
              <SelectItem value="strengths">Most Strengths</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── cards ──────────────────────────────────────────────────── */}
      <div className="space-y-4 mb-8">
        {filtered.map((r) => {
          const open = expanded[r.id] ?? false;
          return (
            <div key={r.id} className="rounded-lg border bg-white">
              <button
                onClick={() => toggle(r.id)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <BookOpen className="h-4 w-4 text-sky-500" />
                    <h3 className="font-semibold">{getYPName(r.youngPerson)}</h3>
                    {r.conditions.map((c) => (
                      <span
                        key={c}
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium border",
                          CONDITION_COLOURS[c],
                        )}
                      >
                        {c}
                      </span>
                    ))}
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium border",
                        STATUS_COLOURS[r.diagnosisStatus],
                      )}
                    >
                      {r.diagnosisStatus}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <Lightbulb className="h-3 w-3 inline mr-1" />
                      {r.examConcessionsAgreed.length} exam access
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Plan {r.planDate} · Key worker {getStaffName(r.keyWorker)} · Review{" "}
                    <span className={cn(r.reviewDate <= d(0) ? "text-red-600 font-medium" : "")}>
                      {r.reviewDate}
                    </span>
                  </p>
                </div>
                {open ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {open && (
                <div className="border-t px-4 pb-4 space-y-5">
                  {/* diagnosis info */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm rounded-md bg-sky-50 border border-sky-200 p-3">
                    <div>
                      <span className="text-gray-500">Status:</span>{" "}
                      <span className="font-medium">{r.diagnosisStatus}</span>
                    </div>
                    {r.diagnosisDate && (
                      <div>
                        <span className="text-gray-500">Diagnosed:</span>{" "}
                        <span className="font-medium">{r.diagnosisDate}</span>
                      </div>
                    )}
                    {r.diagnosingProfessional && (
                      <div className="md:col-span-3">
                        <span className="text-gray-500">Professional:</span>{" "}
                        <span className="font-medium">{r.diagnosingProfessional}</span>
                      </div>
                    )}
                  </div>

                  {/* strengths + challenges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3">
                      <h4 className="text-xs font-semibold text-emerald-700 mb-1 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Strengths
                      </h4>
                      <ul className="list-disc list-inside text-sm text-emerald-900 space-y-0.5">
                        {r.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                      <h4 className="text-xs font-semibold text-amber-700 mb-1">
                        Challenges
                      </h4>
                      <ul className="list-disc list-inside text-sm text-amber-900 space-y-0.5">
                        {r.challenges.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* technology in use */}
                  <div className="rounded-md bg-teal-50 border border-teal-200 p-3">
                    <h4 className="text-xs font-semibold text-teal-700 mb-1">
                      Technology In Use
                    </h4>
                    <ul className="list-disc list-inside text-sm text-teal-900 space-y-0.5">
                      {r.technologyInUse.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  {/* technology tried */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-2">
                      Technology Tried — Outcomes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {r.technologyTried.map((t, idx) => (
                        <span
                          key={idx}
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-medium",
                            TECH_OUTCOME_COLOURS[t.outcome],
                          )}
                        >
                          {t.name} — {t.outcome}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* school access + exam concessions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-sky-50 border border-sky-200 p-3">
                      <h4 className="text-xs font-semibold text-sky-700 mb-1">
                        School Access Arrangements
                      </h4>
                      <ul className="list-disc list-inside text-sm text-sky-900 space-y-0.5">
                        {r.schoolAccessArrangements.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md bg-indigo-50 border border-indigo-200 p-3">
                      <h4 className="text-xs font-semibold text-indigo-700 mb-1 flex items-center gap-1">
                        <Lightbulb className="h-3 w-3" /> Exam Access (JCQ)
                      </h4>
                      {r.examConcessionsAgreed.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-indigo-900 space-y-0.5">
                          {r.examConcessionsAgreed.map((e, idx) => (
                            <li key={idx}>{e}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-indigo-900 italic">None agreed yet.</p>
                      )}
                    </div>
                  </div>

                  {/* home study + staff strategies */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-teal-50 border border-teal-200 p-3">
                      <h4 className="text-xs font-semibold text-teal-700 mb-1">
                        Home Study Support
                      </h4>
                      <ul className="list-disc list-inside text-sm text-teal-900 space-y-0.5">
                        {r.homeStudySupport.map((h, idx) => (
                          <li key={idx}>{h}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md bg-violet-50 border border-violet-200 p-3">
                      <h4 className="text-xs font-semibold text-violet-700 mb-1">
                        Staff Strategies
                      </h4>
                      <ul className="list-disc list-inside text-sm text-violet-900 space-y-0.5">
                        {r.staffStrategies.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* external support */}
                  {r.externalSupport.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 mb-2">External Support</h4>
                      <div className="overflow-x-auto rounded-md border">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                            <tr>
                              <th className="text-left px-3 py-2">Agency</th>
                              <th className="text-left px-3 py-2">Role</th>
                              <th className="text-left px-3 py-2">Frequency</th>
                            </tr>
                          </thead>
                          <tbody>
                            {r.externalSupport.map((e, idx) => (
                              <tr key={idx} className="border-t">
                                <td className="px-3 py-2 font-medium">{e.agency}</td>
                                <td className="px-3 py-2 text-gray-700">{e.role}</td>
                                <td className="px-3 py-2 text-gray-700">{e.frequency}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* identity work — highlighted rose */}
                  <div className="rounded-md bg-rose-50 border-l-4 border-rose-400 p-3">
                    <h4 className="text-xs font-semibold text-rose-700 mb-1 flex items-center gap-1">
                      <Award className="h-3 w-3" /> Identity Work — Reframing
                    </h4>
                    <ul className="list-disc list-inside text-sm text-rose-900 space-y-0.5">
                      {r.identityWork.map((i, idx) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  </div>

                  {/* child voice */}
                  <div className="rounded-md bg-sky-50 border-l-4 border-sky-400 p-3">
                    <h4 className="text-xs font-semibold text-sky-700 mb-1">
                      Child&apos;s Voice
                    </h4>
                    <p className="text-sm text-sky-900 italic">&ldquo;{r.childVoice}&rdquo;</p>
                  </div>

                  {/* staff observation */}
                  <div className="rounded-md bg-gray-50 border border-gray-200 p-3">
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">Staff Observation</h4>
                    <p className="text-sm text-gray-800">{r.staffObservation}</p>
                  </div>

                  {/* next step */}
                  <div className="rounded-md bg-teal-50 border border-teal-200 p-3">
                    <h4 className="text-xs font-semibold text-teal-700 mb-1">Next Step</h4>
                    <p className="text-sm text-teal-900">{r.nextStep}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── regulatory note ────────────────────────────────────────── */}
      <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900 mb-6 space-y-2">
        <p>
          <strong>Regulatory and clinical framework:</strong> Plans aligned with the NICE / NHS
          neurodevelopmental pathway for SpLD, the British Dyslexia Association code of practice
          (BDA Quality Mark standards), JCQ Access Arrangements and Reasonable Adjustments
          (annual guidance — Form 8 evidence held by school SENCo), the Equality Act 2010
          (SpLD as a protected disability requiring reasonable adjustments in education) and
          the SEND Code of Practice 2015. Children&apos;s Homes Regulations Quality Standard 5
          (health and wellbeing) and Quality Standard 6 (education) apply.
        </p>
        <p>
          <strong>Theoretical framing:</strong> Strength-based, neurodiversity-affirming practice
          drawn from the British Dyslexia Association, the Dyspraxia Foundation and Made By
          Dyslexia. SpLDs are differences in cognitive processing, not deficits in intelligence
          or effort. Identity reframing — moving from internalised &ldquo;lazy / stupid&rdquo;
          labels to a positive cognitive identity — is the foundation that makes every other
          accommodation effective. UNCRC Article 12 (right to be heard), Article 23 (rights of
          disabled children), Article 28 (right to education) and Article 29 (education aims to
          develop the child&apos;s talents and abilities to their fullest potential) centre
          this plan in the child&apos;s own voice and chosen identity.
        </p>
      </div>
    </PageShell>
  );
}
