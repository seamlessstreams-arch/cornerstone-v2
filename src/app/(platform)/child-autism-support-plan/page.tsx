"use client";

import { useState, useMemo } from "react";
import {
  Brain,
  Sparkles,
  Heart,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Star,
  Clock,
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

type DiagnosisStatus =
  | "Diagnosed"
  | "Self-identified"
  | "Awaiting assessment"
  | "Suspected — gathering evidence"
  | "Not currently considered";

interface SensoryDomainEntry {
  sense: string;
  seekingOrAvoiding: "Seeking" | "Avoiding" | "Mixed" | "Neutral";
  specificNotes: string;
}

interface ExternalSupport {
  agency: string;
  role: string;
  frequency: string;
}

interface AutismPlan {
  id: string;
  youngPerson: string;
  planDate: string;
  diagnosisStatus: DiagnosisStatus;
  diagnosisDate?: string;
  diagnosingClinician?: string;
  specialInterests: string[];
  communicationPreferences: string[];
  processingTime: string;
  sensoryProfile: SensoryDomainEntry[];
  predictabilityNeeds: string[];
  routineAnchors: string[];
  meltdownTriggers: string[];
  meltdownSupport: string[];
  shutdownIndicators: string[];
  shutdownSupport: string[];
  maskingAwareness: string;
  unmaskingPermissions: string[];
  transitionSupport: string[];
  socialPreferences: string[];
  staffDoStrategies: string[];
  staffDoNotStrategies: string[];
  externalSupport: ExternalSupport[];
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
  "Diagnosed": "bg-violet-100 text-violet-800 border-violet-200",
  "Self-identified": "bg-teal-100 text-teal-800 border-teal-200",
  "Awaiting assessment": "bg-amber-100 text-amber-800 border-amber-200",
  "Suspected — gathering evidence": "bg-sky-100 text-sky-800 border-sky-200",
  "Not currently considered": "bg-gray-100 text-gray-700 border-gray-200",
};

const SEEKING_COLOURS: Record<SensoryDomainEntry["seekingOrAvoiding"], string> = {
  Seeking: "bg-emerald-100 text-emerald-800",
  Avoiding: "bg-rose-100 text-rose-800",
  Mixed: "bg-amber-100 text-amber-800",
  Neutral: "bg-gray-100 text-gray-700",
};

/* ── seed data ─────────────────────────────────────────────────────────── */

const SEED: AutismPlan[] = [
  {
    id: "asp_casey_01",
    youngPerson: "yp_casey",
    planDate: d(-30),
    diagnosisStatus: "Diagnosed",
    diagnosisDate: d(-540),
    diagnosingClinician: "Dr Catherine Williams, Consultant Child & Adolescent Psychiatrist",
    specialInterests: [
      "Butterflies — species, lifecycle, migration patterns",
      "Dot painting (Indigenous Australian art technique)",
      "Animal Crossing — villager personalities and museum collection",
      "Eeyore (Winnie-the-Pooh) — comfort character",
      "Classification systems — taxonomies, Dewey Decimal, type charts",
      "Naming and sorting — collections of any kind",
    ],
    communicationPreferences: [
      "Direct, literal language — no idioms or sarcasm",
      "Concrete questions, not open-ended ones",
      "Written or text-based options when discussing difficult topics",
      "Allow 8 seconds of silence after a question — do not rephrase",
      "Use Casey's name at the start of sentences to gain attention",
      "Do not require eye contact — looking away aids processing",
      "Pre-warn before changes in tone, topic or pace",
    ],
    processingTime:
      "8 seconds minimum after a question or instruction. Casey processes deeply and sequentially (monotropic attention). Repeating or rephrasing within this window resets the processing and increases distress. Silence is working time, not avoidance.",
    sensoryProfile: [
      {
        sense: "Auditory",
        seekingOrAvoiding: "Avoiding",
        specificNotes:
          "Cutlery on plates, hand dryers, multiple overlapping voices, fluorescent light hum. Loop earplugs available — Casey self-selects. Headphones in school bag.",
      },
      {
        sense: "Tactile",
        seekingOrAvoiding: "Mixed",
        specificNotes:
          "Avoids wet/slimy textures (relevant to ARFID — see eating support plan). Seeks soft, smooth textures: weighted blanket, satin label, fluffy hoodie. Clothing tags removed.",
      },
      {
        sense: "Visual",
        seekingOrAvoiding: "Seeking",
        specificNotes:
          "Loves repetitive visual patterns — dot art, butterfly wings, lined-up objects. Lining up belongings is regulation, not symptom. Do not 'tidy' Casey's arrangements.",
      },
      {
        sense: "Olfactory",
        seekingOrAvoiding: "Avoiding",
        specificNotes:
          "Strong fragrances (perfume, scented candles, air fresheners) trigger nausea. Unscented products only in Casey's bathroom and bedroom. Staff: avoid scented body sprays on shift.",
      },
      {
        sense: "Gustatory",
        seekingOrAvoiding: "Avoiding",
        specificNotes:
          "Linked to ARFID — narrow safe-foods range. See ARFID eating support plan. Do not pressure new foods. Sensory eating is not 'fussy'.",
      },
      {
        sense: "Proprioceptive",
        seekingOrAvoiding: "Seeking",
        specificNotes:
          "Heavy work helps regulation — carrying shopping, weighted lap pad during homework, deep-pressure hugs (consent first, always). Trampoline 10 minutes calms before bedtime.",
      },
      {
        sense: "Vestibular",
        seekingOrAvoiding: "Neutral",
        specificNotes:
          "No notable seeking or avoiding. Casey enjoys swinging in garden but does not need it for regulation.",
      },
      {
        sense: "Interoceptive",
        seekingOrAvoiding: "Avoiding",
        specificNotes:
          "Reduced awareness of hunger, thirst, toilet needs and rising distress. Body-check prompts at routine times help. Casey may not realise meltdown is coming until late.",
      },
    ],
    predictabilityNeeds: [
      "Visual schedule for the day shared at breakfast",
      "Same key worker on shift for first 30 minutes after school where possible",
      "Advance notice of any change — minimum 24 hours, with reason given",
      "Same plate, same cup, same chair at meals",
      "Morning routine in fixed sequence (medication → wash → dress → breakfast)",
      "Bedtime routine identical seven nights a week",
    ],
    routineAnchors: [
      "Eeyore plush goes everywhere — never washed without warning",
      "Butterfly fact-of-the-day at breakfast (Casey shares one)",
      "Animal Crossing 30 minutes after homework",
      "Dot-painting Wednesday evenings with Chervelle",
      "Saturday morning butterfly walk in Markeaton Park",
      "Sunday classification activity (sorting collection of choice)",
    ],
    meltdownTriggers: [
      "Sustained auditory overload (over 20 mins busy environment)",
      "Unannounced change in routine, plan or person",
      "Being interrupted mid-special-interest without warning",
      "Pressure to mask (eye contact, small talk, group performance)",
      "Sensory accumulation across the day with no decompression time",
      "Questions stacked on top of one another before processing finishes",
    ],
    meltdownSupport: [
      "Move to low-stim space (Casey's bedroom or sensory corner) — do not block exit",
      "One staff member only — no audience, no extra voices",
      "Reduce language to essentials. Casey may not be able to speak — that is fine",
      "Offer (do not impose) weighted blanket, Eeyore, Loop earplugs",
      "Do not require explanation, apology or eye contact during or after",
      "Recovery can take 60–120 minutes. Do not rush re-engagement",
      "Debrief next day, in writing if Casey prefers",
      "A meltdown is sensory and neurological, not behavioural. Never sanction",
    ],
    shutdownIndicators: [
      "Goes very quiet, monosyllabic or non-speaking",
      "Withdraws under bedroom duvet or behind sofa",
      "Flat facial expression, slowed movement",
      "Stops eating and drinking",
      "Does not respond to name (this is not defiance — capacity is gone)",
    ],
    shutdownSupport: [
      "Recognise as different from low mood — shutdown is regulation, not depression",
      "Reduce sensory and social demands to zero",
      "Place water and a safe snack within reach silently",
      "Stay in adjacent room — quiet co-presence, no questions",
      "Allow sleep if Casey needs it — do not wake for routine",
      "Recovery often follows long sleep. Re-enter slowly with familiar interest",
    ],
    maskingAwareness:
      "Casey unmasks at home and masks at school. Staff observe Casey arriving home flat, exhausted and sometimes tearful — this is autistic burnout from a day of suppressing stims, forcing eye contact and performing neurotypical communication. The hour after school is decompression: no demands, no questions about the day, soft clothing, Eeyore, special interest access. Masking has long-term mental health costs (Hull et al., research on autistic burnout). Home is the unmasking sanctuary — protecting that is part of Casey's care.",
    unmaskingPermissions: [
      "Stim freely — flapping, rocking, vocal sounds, lining objects up",
      "Eat in bedroom on hard days",
      "Wear pyjamas for the rest of the evening straight after school",
      "Decline group activities without explanation",
      "Use AAC, text, or pointing instead of speech when needed",
      "Avoid eye contact without it being commented on",
      "Be alone for as long as needed — solitude is restorative, not concerning",
    ],
    transitionSupport: [
      "School → home: quiet car ride, no questions, music Casey chooses, snack in bag",
      "Home → school: visual checklist, same route, Eeyore in bag pocket",
      "Activity → activity: 10-min, 5-min, 2-min, 'now' warnings with timer",
      "Term → holidays: visual calendar two weeks ahead, special-interest plans built in",
      "Year-group transitions at school: TA-led pre-visits, photo of new room/teacher",
      "New staff member: introduction by photo and written profile a week before shift",
    ],
    socialPreferences: [
      "Parallel play / parallel presence preferred over face-to-face conversation",
      "Small group of 2–3 maximum, with familiar people",
      "Shared activity (art, games) reduces social load",
      "Online friendships through Animal Crossing valued — treat as real friendships",
      "Does not enjoy birthday parties, group meals out, or surprise gatherings",
      "One trusted friend (Maya, from school) — protect this connection",
    ],
    staffDoStrategies: [
      "Greet Casey by name, then pause — let Casey choose to engage",
      "Ask about butterflies / Animal Crossing as a connection bridge",
      "Use 'first … then …' language for transitions",
      "Offer choice between two options, not open-ended questions",
      "Validate sensory experience: 'That sounds overwhelming' not 'It's not that loud'",
      "Write down complex information — leave it for Casey to revisit",
      "Notice and name strengths: pattern recognition, deep knowledge, loyalty, honesty",
      "Use the autism plan in handover — every shift",
    ],
    staffDoNotStrategies: [
      "Do not say 'you don't look autistic' or 'everyone's a bit autistic'",
      "Do not use functioning labels ('high-functioning', 'mild')",
      "Do not interrupt a special interest to enforce a non-essential routine",
      "Do not require eye contact or 'looking at me when I'm talking'",
      "Do not punish stimming, lining up, scripting or echolalia",
      "Do not 'surprise' Casey — even with positive surprises",
      "Do not say 'try harder to fit in' — masking is the harm, not the solution",
      "Do not describe meltdowns as 'tantrums', 'attention-seeking' or 'manipulative'",
    ],
    externalSupport: [
      {
        agency: "Anna Freud Centre",
        role: "Specialist autism mental-health input — therapist Dr Priya Shah",
        frequency: "Fortnightly, Tuesdays 16:00, in-person at Centre",
      },
      {
        agency: "CAMHS Neurodevelopmental Pathway (Derbyshire)",
        role: "Care coordination, medication review (sertraline), post-diagnostic follow-up",
        frequency: "Six-weekly, Dr L. Chen",
      },
      {
        agency: "Allestree Woodlands School SENCo",
        role: "EHCP coordination, masking-load monitoring, sensory accommodations in school",
        frequency: "Half-termly review meeting + weekly email contact",
      },
      {
        agency: "National Autistic Society — Branching Out (peer group)",
        role: "Casey-led — autistic peer connection, monotropic-friendly activities",
        frequency: "Monthly Saturday session",
      },
    ],
    childVoice:
      "I'm not broken, I'm autistic. I think in patterns and pictures and butterflies. When people make me look at their eyes my brain stops working. School is loud and pretending all day makes me tired in my bones. I like being on my own — that's not sad, that's how I rest. Please don't tidy my butterfly cards. Eeyore knows me. I want staff who get it without me having to explain.",
    staffObservation:
      "Casey's monotropic focus is a remarkable strength — when engaged with a special interest, recall and pattern-recognition are exceptional. The team's task is to scaffold the world around that focus, not to redirect away from it. Burnout signs (flatness, increased shutdowns, reduced eating beyond ARFID baseline) are the early warning system — when they appear, demands must come down, not up. Progress is not measured in increased social participation; it is measured in increased self-advocacy, reduced masking, and Casey's reported wellbeing.",
    nextStep:
      "Co-produce Casey's school passport (one-page profile in Casey's own words) with SENCo before summer term. Anna Freud session next Tuesday will explore unmasking permissions Casey wants extended into school environment.",
    reviewDate: d(60),
    keyWorker: "staff_chervelle",
  },
];

/* ── flat row for export ───────────────────────────────────────────────── */

interface FlatRow {
  youngPerson: string;
  planDate: string;
  diagnosisStatus: string;
  diagnosisDate: string;
  diagnosingClinician: string;
  specialInterests: string;
  communicationPreferences: string;
  processingTime: string;
  sensoryProfile: string;
  predictabilityNeeds: string;
  routineAnchors: string;
  meltdownTriggers: string;
  meltdownSupport: string;
  shutdownIndicators: string;
  shutdownSupport: string;
  maskingAwareness: string;
  unmaskingPermissions: string;
  transitionSupport: string;
  socialPreferences: string;
  staffDoStrategies: string;
  staffDoNotStrategies: string;
  externalSupport: string;
  childVoice: string;
  staffObservation: string;
  nextStep: string;
  reviewDate: string;
  keyWorker: string;
}

const EXPORT_COLS: ExportColumn<FlatRow>[] = [
  { header: "Young Person", accessor: (r: FlatRow) => r.youngPerson },
  { header: "Plan Date", accessor: (r: FlatRow) => r.planDate },
  { header: "Diagnosis Status", accessor: (r: FlatRow) => r.diagnosisStatus },
  { header: "Diagnosis Date", accessor: (r: FlatRow) => r.diagnosisDate },
  { header: "Diagnosing Clinician", accessor: (r: FlatRow) => r.diagnosingClinician },
  { header: "Special Interests", accessor: (r: FlatRow) => r.specialInterests },
  { header: "Communication Preferences", accessor: (r: FlatRow) => r.communicationPreferences },
  { header: "Processing Time", accessor: (r: FlatRow) => r.processingTime },
  { header: "Sensory Profile", accessor: (r: FlatRow) => r.sensoryProfile },
  { header: "Predictability Needs", accessor: (r: FlatRow) => r.predictabilityNeeds },
  { header: "Routine Anchors", accessor: (r: FlatRow) => r.routineAnchors },
  { header: "Meltdown Triggers", accessor: (r: FlatRow) => r.meltdownTriggers },
  { header: "Meltdown Support", accessor: (r: FlatRow) => r.meltdownSupport },
  { header: "Shutdown Indicators", accessor: (r: FlatRow) => r.shutdownIndicators },
  { header: "Shutdown Support", accessor: (r: FlatRow) => r.shutdownSupport },
  { header: "Masking Awareness", accessor: (r: FlatRow) => r.maskingAwareness },
  { header: "Unmasking Permissions", accessor: (r: FlatRow) => r.unmaskingPermissions },
  { header: "Transition Support", accessor: (r: FlatRow) => r.transitionSupport },
  { header: "Social Preferences", accessor: (r: FlatRow) => r.socialPreferences },
  { header: "Staff DO", accessor: (r: FlatRow) => r.staffDoStrategies },
  { header: "Staff DO NOT", accessor: (r: FlatRow) => r.staffDoNotStrategies },
  { header: "External Support", accessor: (r: FlatRow) => r.externalSupport },
  { header: "Child Voice", accessor: (r: FlatRow) => r.childVoice },
  { header: "Staff Observation", accessor: (r: FlatRow) => r.staffObservation },
  { header: "Next Step", accessor: (r: FlatRow) => r.nextStep },
  { header: "Review Date", accessor: (r: FlatRow) => r.reviewDate },
  { header: "Key Worker", accessor: (r: FlatRow) => r.keyWorker },
];

/* ── component ─────────────────────────────────────────────────────────── */

export default function ChildAutismSupportPlanPage() {
  const [data] = useState<AutismPlan[]>(SEED);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  /* stats */
  const stats = useMemo(() => {
    const active = data.length;
    const diagnosed = data.filter((r) => r.diagnosisStatus === "Diagnosed").length;
    const awaiting = data.filter((r) => r.diagnosisStatus === "Awaiting assessment").length;
    const reviewSoon = data.filter((r) => r.reviewDate <= d(90)).length;
    return { active, diagnosed, awaiting, reviewSoon };
  }, [data]);

  /* filtered / sorted */
  const filtered = useMemo(() => {
    let list = data;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          getYPName(r.youngPerson).toLowerCase().includes(q) ||
          r.specialInterests.some((i) => i.toLowerCase().includes(q)) ||
          r.diagnosisStatus.toLowerCase().includes(q),
      );
    }
    if (filterStatus !== "all") {
      list = list.filter((r) => r.diagnosisStatus === filterStatus);
    }
    const out = [...list];
    switch (sortBy) {
      case "name":
        out.sort((a, b) => getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson)));
        break;
      case "review":
        out.sort((a, b) => a.reviewDate.localeCompare(b.reviewDate));
        break;
      case "interests":
        out.sort((a, b) => b.specialInterests.length - a.specialInterests.length);
        break;
    }
    return out;
  }, [data, search, filterStatus, sortBy]);

  /* export */
  const exportData = useMemo<FlatRow[]>(
    () =>
      data.map((r) => ({
        youngPerson: getYPName(r.youngPerson),
        planDate: r.planDate,
        diagnosisStatus: r.diagnosisStatus,
        diagnosisDate: r.diagnosisDate ?? "",
        diagnosingClinician: r.diagnosingClinician ?? "",
        specialInterests: r.specialInterests.join("; "),
        communicationPreferences: r.communicationPreferences.join("; "),
        processingTime: r.processingTime,
        sensoryProfile: r.sensoryProfile
          .map((s) => `${s.sense} (${s.seekingOrAvoiding}): ${s.specificNotes}`)
          .join(" | "),
        predictabilityNeeds: r.predictabilityNeeds.join("; "),
        routineAnchors: r.routineAnchors.join("; "),
        meltdownTriggers: r.meltdownTriggers.join("; "),
        meltdownSupport: r.meltdownSupport.join("; "),
        shutdownIndicators: r.shutdownIndicators.join("; "),
        shutdownSupport: r.shutdownSupport.join("; "),
        maskingAwareness: r.maskingAwareness,
        unmaskingPermissions: r.unmaskingPermissions.join("; "),
        transitionSupport: r.transitionSupport.join("; "),
        socialPreferences: r.socialPreferences.join("; "),
        staffDoStrategies: r.staffDoStrategies.join("; "),
        staffDoNotStrategies: r.staffDoNotStrategies.join("; "),
        externalSupport: r.externalSupport
          .map((e) => `${e.agency} — ${e.role} (${e.frequency})`)
          .join(" | "),
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
      title="Autism Support Plans"
      subtitle="Per-child, strength-based, neurodiversity-affirming support — monotropism, sensory regulation, masking and unmasking, meltdown vs shutdown protocols"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Autism Support Plans" />
          <ExportButton data={exportData} columns={EXPORT_COLS} filename="autism-support-plans" />
        </div>
      }
    >
      {/* ── stat strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Plans", value: stats.active, icon: Brain, colour: "text-violet-600" },
          { label: "Diagnosed", value: stats.diagnosed, icon: Sparkles, colour: "text-teal-600" },
          { label: "Awaiting Assessment", value: stats.awaiting, icon: Clock, colour: "text-amber-600" },
          { label: "Reviews Due 90d", value: stats.reviewSoon, icon: Heart, colour: "text-sky-600" },
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
            placeholder="Search children, special interests, status…"
            className="w-full rounded-md border py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[220px] h-9 text-sm">
            <SelectValue placeholder="All Diagnosis Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Diagnosis Statuses</SelectItem>
            <SelectItem value="Diagnosed">Diagnosed</SelectItem>
            <SelectItem value="Self-identified">Self-identified</SelectItem>
            <SelectItem value="Awaiting assessment">Awaiting assessment</SelectItem>
            <SelectItem value="Suspected — gathering evidence">Suspected — gathering evidence</SelectItem>
            <SelectItem value="Not currently considered">Not currently considered</SelectItem>
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
              <SelectItem value="interests">Most Interests</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── cards ──────────────────────────────────────────────────── */}
      <div className="space-y-4 mb-8">
        {filtered.map((r) => {
          const open = expanded[r.id] ?? false;
          const sensoryComplexity = r.sensoryProfile.filter(
            (s) => s.seekingOrAvoiding !== "Neutral",
          ).length;
          return (
            <div key={r.id} className="rounded-lg border bg-white">
              <button
                onClick={() => toggle(r.id)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Brain className="h-4 w-4 text-violet-500" />
                    <h3 className="font-semibold">{getYPName(r.youngPerson)}</h3>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium border",
                        STATUS_COLOURS[r.diagnosisStatus],
                      )}
                    >
                      {r.diagnosisStatus}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                      <Star className="h-3 w-3 inline mr-1" />
                      {r.specialInterests.length} special interests
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
                      Sensory: {sensoryComplexity}/{r.sensoryProfile.length} active
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
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm rounded-md bg-violet-50 border border-violet-200 p-3">
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
                    {r.diagnosingClinician && (
                      <div className="md:col-span-3">
                        <span className="text-gray-500">Clinician:</span>{" "}
                        <span className="font-medium">{r.diagnosingClinician}</span>
                      </div>
                    )}
                  </div>

                  {/* special interests */}
                  <div>
                    <h4 className="text-xs font-semibold text-violet-700 mb-2 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Special Interests (monotropic strengths)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {r.specialInterests.map((i, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-800 border border-violet-200"
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* communication */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-teal-50 border border-teal-200 p-3">
                      <h4 className="text-xs font-semibold text-teal-700 mb-1">
                        Communication Preferences
                      </h4>
                      <ul className="list-disc list-inside text-sm text-teal-900 space-y-0.5">
                        {r.communicationPreferences.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md bg-sky-50 border border-sky-200 p-3">
                      <h4 className="text-xs font-semibold text-sky-700 mb-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Processing Time
                      </h4>
                      <p className="text-sm text-sky-900">{r.processingTime}</p>
                    </div>
                  </div>

                  {/* sensory profile */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-2">Sensory Profile</h4>
                    <div className="overflow-x-auto rounded-md border">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                          <tr>
                            <th className="text-left px-3 py-2">Sense</th>
                            <th className="text-left px-3 py-2">Pattern</th>
                            <th className="text-left px-3 py-2">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {r.sensoryProfile.map((s, idx) => (
                            <tr key={idx} className="border-t">
                              <td className="px-3 py-2 font-medium">{s.sense}</td>
                              <td className="px-3 py-2">
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    SEEKING_COLOURS[s.seekingOrAvoiding],
                                  )}
                                >
                                  {s.seekingOrAvoiding}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-gray-700">{s.specificNotes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* predictability + routines */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-violet-50 border border-violet-200 p-3">
                      <h4 className="text-xs font-semibold text-violet-700 mb-1">
                        Predictability Needs
                      </h4>
                      <ul className="list-disc list-inside text-sm text-violet-900 space-y-0.5">
                        {r.predictabilityNeeds.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md bg-teal-50 border border-teal-200 p-3">
                      <h4 className="text-xs font-semibold text-teal-700 mb-1">Routine Anchors</h4>
                      <ul className="list-disc list-inside text-sm text-teal-900 space-y-0.5">
                        {r.routineAnchors.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* meltdown vs shutdown */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-2">
                      Dysregulation Support — Meltdown and Shutdown
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-md bg-rose-50 border border-rose-200 p-3 space-y-2">
                        <p className="text-xs font-semibold text-rose-700">Meltdown</p>
                        <div>
                          <p className="text-xs font-medium text-rose-700">Triggers</p>
                          <ul className="list-disc list-inside text-sm text-rose-900 space-y-0.5">
                            {r.meltdownTriggers.map((t, idx) => (
                              <li key={idx}>{t}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-rose-700">Support</p>
                          <ul className="list-disc list-inside text-sm text-rose-900 space-y-0.5">
                            {r.meltdownSupport.map((t, idx) => (
                              <li key={idx}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="rounded-md bg-indigo-50 border border-indigo-200 p-3 space-y-2">
                        <p className="text-xs font-semibold text-indigo-700">Shutdown</p>
                        <div>
                          <p className="text-xs font-medium text-indigo-700">Indicators</p>
                          <ul className="list-disc list-inside text-sm text-indigo-900 space-y-0.5">
                            {r.shutdownIndicators.map((t, idx) => (
                              <li key={idx}>{t}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-indigo-700">Support</p>
                          <ul className="list-disc list-inside text-sm text-indigo-900 space-y-0.5">
                            {r.shutdownSupport.map((t, idx) => (
                              <li key={idx}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* masking */}
                  <div className="rounded-md bg-amber-50 border border-amber-200 p-3 space-y-2">
                    <h4 className="text-xs font-semibold text-amber-700">
                      Masking Awareness and Unmasking Permissions
                    </h4>
                    <p className="text-sm text-amber-900">{r.maskingAwareness}</p>
                    <div>
                      <p className="text-xs font-medium text-amber-700 mt-2">
                        Unmasking permissions (home as sanctuary)
                      </p>
                      <ul className="list-disc list-inside text-sm text-amber-900 space-y-0.5">
                        {r.unmaskingPermissions.map((u, idx) => (
                          <li key={idx}>{u}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* transitions + social */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-sky-50 border border-sky-200 p-3">
                      <h4 className="text-xs font-semibold text-sky-700 mb-1">Transition Support</h4>
                      <ul className="list-disc list-inside text-sm text-sky-900 space-y-0.5">
                        {r.transitionSupport.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md bg-teal-50 border border-teal-200 p-3">
                      <h4 className="text-xs font-semibold text-teal-700 mb-1">Social Preferences</h4>
                      <ul className="list-disc list-inside text-sm text-teal-900 space-y-0.5">
                        {r.socialPreferences.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* DO / DO NOT */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3">
                      <h4 className="text-xs font-semibold text-emerald-700 mb-1">Staff DO</h4>
                      <ul className="list-disc list-inside text-sm text-emerald-900 space-y-0.5">
                        {r.staffDoStrategies.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md bg-rose-50 border border-rose-200 p-3">
                      <h4 className="text-xs font-semibold text-rose-700 mb-1">Staff DO NOT</h4>
                      <ul className="list-disc list-inside text-sm text-rose-900 space-y-0.5">
                        {r.staffDoNotStrategies.map((t, idx) => (
                          <li key={idx}>{t}</li>
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

                  {/* child voice */}
                  <div className="rounded-md bg-violet-50 border-l-4 border-violet-400 p-3">
                    <h4 className="text-xs font-semibold text-violet-700 mb-1">
                      Child&apos;s Voice
                    </h4>
                    <p className="text-sm text-violet-900 italic">&ldquo;{r.childVoice}&rdquo;</p>
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
      <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900 mb-6 space-y-2">
        <p>
          <strong>Regulatory and clinical framework:</strong> Plans aligned with NICE CG142
          (autism in children and young people), the Autism Act 2009, the NHS Neurodevelopmental
          Pathway, and the Equality Act 2010 (autism as a disability requires reasonable
          adjustments). Children&apos;s Homes Regulations Quality Standards 5 (health and
          wellbeing), 6 (positive relationships), 7 (protection of children), and 8 (leadership
          and management) all apply.
        </p>
        <p>
          <strong>Theoretical framing:</strong> Monotropism theory (Murray, Lawson, Lesser) — autistic
          attention is deeply channelled rather than diffuse, and special interests are a
          neurological feature, not a deficit. Strength-based, neurodiversity-affirming guidance
          drawn from the National Autistic Society, Autistica, and AsIAm. UNCRC Article 12
          (right to be heard) and Article 23 (rights of disabled children) guide the child-voice
          centring of this plan. Functioning labels are avoided.
        </p>
      </div>
    </PageShell>
  );
}
