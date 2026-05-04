"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  Shirt,
  WashingMachine,
  Wind,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Award,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── types ───────────────────────────────────────────────────────────────────
interface LaundryRecord {
  id: string;
  youngPerson: string;
  recordedDate: string;
  overallStage:
    | "Stage 1 — Observed"
    | "Stage 2 — Did with staff"
    | "Stage 3 — Did with prompts"
    | "Stage 4 — Did independently"
    | "Stage 5 — Manages own laundry routine";
  skills: { name: string; level: "Not yet" | "Learning" | "Confident" | "Independent" }[];
  routineFrequency: string;
  ownsBasket: boolean;
  knowsCareSymbols: boolean;
  ironCompetent: boolean;
  challengesNoted: string[];
  childVoice: string;
  staffObservation: string;
  nextSkill: string;
  reviewDate: string;
  keyWorker: string;
}

// ── seed data ───────────────────────────────────────────────────────────────
const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: LaundryRecord[] = [
  {
    id: "lsc-001",
    youngPerson: "yp_jordan",
    recordedDate: d(-5),
    overallStage: "Stage 4 — Did independently",
    skills: [
      { name: "Sorts whites, colours, darks", level: "Independent" },
      { name: "Reads care labels & symbols", level: "Confident" },
      { name: "Uses washing machine (cycle, detergent, dose)", level: "Independent" },
      { name: "Uses tumble dryer or air-dries", level: "Independent" },
      { name: "Irons school shirts", level: "Confident" },
      { name: "Folds and puts away clothes", level: "Independent" },
      { name: "Manages weekly routine without prompts", level: "Confident" },
    ],
    routineFrequency: "Weekly — Sunday afternoon, self-led",
    ownsBasket: true,
    knowsCareSymbols: true,
    ironCompetent: true,
    challengesNoted: [
      "Occasionally leaves wash in machine overnight — not a safety issue",
    ],
    childVoice:
      "I like doing my own washing — means I always have my football kit ready. I'd rather do it myself than have someone in my room going through my stuff.",
    staffObservation:
      "Jordan has built a strong, predictable routine. Irons own school shirts to a high standard. Linked to Pathway Plan independence outcomes — preparing well for semi-independent living at 17/18.",
    nextSkill:
      "Introduce hand-washing delicates and reading symbols on more technical fabrics (sportswear with mesh panels).",
    reviewDate: d(28),
    keyWorker: "staff_anna",
  },
  {
    id: "lsc-002",
    youngPerson: "yp_alex",
    recordedDate: d(-9),
    overallStage: "Stage 3 — Did with prompts",
    skills: [
      { name: "Sorts whites, colours, darks", level: "Confident" },
      { name: "Reads care labels & symbols", level: "Learning" },
      { name: "Uses washing machine (cycle, detergent, dose)", level: "Confident" },
      { name: "Uses tumble dryer or air-dries", level: "Confident" },
      { name: "Irons clothes safely", level: "Learning" },
      { name: "Folds and puts away clothes", level: "Confident" },
      { name: "Manages weekly routine without prompts", level: "Learning" },
    ],
    routineFrequency: "Twice weekly with verbal prompt from staff",
    ownsBasket: true,
    knowsCareSymbols: false,
    ironCompetent: false,
    challengesNoted: [
      "Wary of hot iron — linked to historic trauma involving heat",
      "Needs prompt to begin routine; once started, completes well",
    ],
    childVoice:
      "I can do most of it now. The iron still scares me a bit. Edward is showing me slowly and I'm getting there.",
    staffObservation:
      "Alex makes steady, real progress. Trauma-informed approach to ironing — never forced, always paced by Alex. Confidence growing week on week. Practising on tea towels first before clothing.",
    nextSkill:
      "Continue graded ironing exposure with Edward. Add care-symbol flashcards to bedroom door for daily exposure.",
    reviewDate: d(14),
    keyWorker: "staff_edward",
  },
  {
    id: "lsc-003",
    youngPerson: "yp_casey",
    recordedDate: d(-12),
    overallStage: "Stage 2 — Did with staff",
    skills: [
      { name: "Sorts whites, colours, darks", level: "Learning" },
      { name: "Reads care labels & symbols", level: "Not yet" },
      { name: "Uses washing machine (cycle, detergent, dose)", level: "Learning" },
      { name: "Uses tumble dryer or air-dries", level: "Learning" },
      { name: "Irons clothes safely", level: "Not yet" },
      { name: "Folds and puts away clothes", level: "Confident" },
      { name: "Manages weekly routine without prompts", level: "Not yet" },
    ],
    routineFrequency: "Alongside Anna every Saturday morning",
    ownsBasket: true,
    knowsCareSymbols: false,
    ironCompetent: false,
    challengesNoted: [
      "Sorts colours using visual chart on laundry-room wall",
      "Runs machine alongside Anna — selects cycle from picture guide",
      "Folding and putting away is a real strength — meticulous and proud of own drawers",
      "No iron use yet — age-appropriate; not a current goal",
    ],
    childVoice:
      "I like folding because my drawers look really nice. The machine is loud but Anna shows me which buttons.",
    staffObservation:
      "Casey is at the right developmental stage. Visual supports work well. Folding and putting away is a genuine strength worth celebrating. Building a positive identity around laundry as a calm, satisfying activity.",
    nextSkill:
      "Introduce reading the temperature symbol (one symbol at a time). Begin teaching detergent dosing.",
    reviewDate: d(7),
    keyWorker: "staff_anna",
  },
];

// ── helpers ─────────────────────────────────────────────────────────────────
function stageColour(stage: LaundryRecord["overallStage"]): string {
  if (stage.startsWith("Stage 5")) return "bg-emerald-100 text-emerald-800";
  if (stage.startsWith("Stage 4")) return "bg-teal-100 text-teal-800";
  if (stage.startsWith("Stage 3")) return "bg-sky-100 text-sky-800";
  if (stage.startsWith("Stage 2")) return "bg-blue-100 text-blue-800";
  return "bg-slate-100 text-slate-800";
}

function levelColour(level: LaundryRecord["skills"][number]["level"]): string {
  switch (level) {
    case "Independent":
      return "bg-emerald-100 text-emerald-800";
    case "Confident":
      return "bg-teal-100 text-teal-800";
    case "Learning":
      return "bg-sky-100 text-sky-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

// ── export columns ──────────────────────────────────────────────────────────
const exportCols: ExportColumn<LaundryRecord>[] = [
  { header: "Young Person", accessor: (r: LaundryRecord) => getYPName(r.youngPerson) },
  { header: "Recorded", accessor: (r: LaundryRecord) => r.recordedDate },
  { header: "Stage", accessor: (r: LaundryRecord) => r.overallStage },
  { header: "Routine", accessor: (r: LaundryRecord) => r.routineFrequency },
  { header: "Owns Basket", accessor: (r: LaundryRecord) => (r.ownsBasket ? "Yes" : "No") },
  { header: "Knows Care Symbols", accessor: (r: LaundryRecord) => (r.knowsCareSymbols ? "Yes" : "No") },
  { header: "Iron Competent", accessor: (r: LaundryRecord) => (r.ironCompetent ? "Yes" : "No") },
  { header: "Next Skill", accessor: (r: LaundryRecord) => r.nextSkill },
  { header: "Review Date", accessor: (r: LaundryRecord) => r.reviewDate },
  { header: "Key Worker", accessor: (r: LaundryRecord) => getStaffName(r.keyWorker) },
];

// ── component ───────────────────────────────────────────────────────────────
export default function ChildLaundrySelfCarePage() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (stageFilter !== "all") items = items.filter((r) => r.overallStage === stageFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (r) =>
          getYPName(r.youngPerson).toLowerCase().includes(q) ||
          r.overallStage.toLowerCase().includes(q) ||
          r.nextSkill.toLowerCase().includes(q),
      );
    }

    items.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
        case "stage":
          return a.overallStage.localeCompare(b.overallStage);
        case "review":
          return a.reviewDate.localeCompare(b.reviewDate);
        default:
          return 0;
      }
    });
    return items;
  }, [search, stageFilter, sortBy]);

  // ── stats ─────────────────────────────────────────────────────────────────
  const childrenWithRoutine = data.filter(
    (r) => !r.overallStage.startsWith("Stage 1"),
  ).length;
  const fullyIndependent = data.filter(
    (r) => r.overallStage.startsWith("Stage 4") || r.overallStage.startsWith("Stage 5"),
  ).length;
  const promptsNeeded = data.filter(
    (r) => r.overallStage.startsWith("Stage 2") || r.overallStage.startsWith("Stage 3"),
  ).length;
  const reviewsDue = data.filter((r) => r.reviewDate <= d(14)).length;

  return (
    <PageShell
      title="Laundry Self-Care"
      subtitle="Per-child laundry independence — sorting, machine use, drying, ironing, folding. Co-produced with each young person; linked to Pathway Plans for over-16s."
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="laundry-self-care" />
          <PrintButton title="Laundry Self-Care" />
        </div>
      }
    >
      {/* ── summary stats ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-sky-600">{childrenWithRoutine}</p>
          <p className="text-xs text-muted-foreground">Children With Routines</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{fullyIndependent}</p>
          <p className="text-xs text-muted-foreground">Fully Independent</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-teal-600">{promptsNeeded}</p>
          <p className="text-xs text-muted-foreground">Prompts Needed</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{reviewsDue}</p>
          <p className="text-xs text-muted-foreground">Reviews Due (14d)</p>
        </div>
      </div>

      {/* ── ethos banner ──────────────────────────────────────────── */}
      <div className="rounded-lg bg-sky-50 border border-sky-200 p-3 mb-6 flex items-start gap-2">
        <Shirt className="h-4 w-4 text-sky-600 mt-0.5 shrink-0" />
        <p className="text-sm text-sky-900">
          Independence skills are taught at each child&apos;s pace — never forced. Progress is celebrated,
          and ironing in particular is approached with sensitivity to past trauma. Every step builds
          confidence, dignity, and readiness for adult life.
        </p>
      </div>

      {/* ── filters/sort ───────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search child, stage, or skill…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="Stage 1 — Observed">Stage 1 — Observed</SelectItem>
            <SelectItem value="Stage 2 — Did with staff">Stage 2 — Did with staff</SelectItem>
            <SelectItem value="Stage 3 — Did with prompts">Stage 3 — Did with prompts</SelectItem>
            <SelectItem value="Stage 4 — Did independently">Stage 4 — Did independently</SelectItem>
            <SelectItem value="Stage 5 — Manages own laundry routine">
              Stage 5 — Manages own routine
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">By Child</SelectItem>
              <SelectItem value="stage">By Stage</SelectItem>
              <SelectItem value="review">By Review Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── records ──────────────────────────────────────────────── */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No records match your filters.
          </div>
        )}
        {filtered.map((rec) => {
          const isExpanded = expandedId === rec.id;

          return (
            <div key={rec.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : rec.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Shirt className="h-5 w-5 text-sky-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{getYPName(rec.youngPerson)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Routine: {rec.routineFrequency} &middot; Recorded {rec.recordedDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3 flex-wrap justify-end">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      stageColour(rec.overallStage),
                    )}
                  >
                    {rec.overallStage}
                  </span>
                  {rec.ownsBasket && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-teal-100 text-teal-800">
                      Own Basket
                    </span>
                  )}
                  {rec.knowsCareSymbols && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-sky-100 text-sky-800">
                      Knows Symbols
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  {/* skills checklist */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      <Award className="h-3 w-3 inline mr-1" />
                      Skills Checklist
                    </p>
                    <div className="space-y-1.5">
                      {rec.skills.map((s, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-lg p-2 border flex items-center justify-between text-sm"
                        >
                          <span className="flex-1">{s.name}</span>
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
                              levelColour(s.level),
                            )}
                          >
                            {s.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* equipment / capability chips */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="bg-white rounded-lg p-2 border flex items-center gap-2">
                      <WashingMachine className="h-4 w-4 text-sky-600" />
                      <div>
                        <p className="text-xs font-medium">Routine</p>
                        <p className="text-xs text-muted-foreground">{rec.routineFrequency}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-2 border flex items-center gap-2">
                      <Wind className="h-4 w-4 text-teal-600" />
                      <div>
                        <p className="text-xs font-medium">Iron Competent</p>
                        <p className="text-xs text-muted-foreground">
                          {rec.ironCompetent ? "Yes" : "Not yet"}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-2 border flex items-center gap-2">
                      <Shirt className="h-4 w-4 text-emerald-600" />
                      <div>
                        <p className="text-xs font-medium">Care Symbols</p>
                        <p className="text-xs text-muted-foreground">
                          {rec.knowsCareSymbols ? "Confident" : "Learning"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* child voice */}
                  <div className="bg-sky-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-sky-800 uppercase tracking-wide mb-1">
                      Child&apos;s Voice
                    </p>
                    <p className="text-sm italic text-sky-900">&ldquo;{rec.childVoice}&rdquo;</p>
                  </div>

                  {/* staff observation */}
                  <div className="bg-teal-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-teal-800 uppercase tracking-wide mb-1">
                      Staff Observation
                    </p>
                    <p className="text-sm text-teal-900">{rec.staffObservation}</p>
                  </div>

                  {/* challenges */}
                  {rec.challengesNoted.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Challenges &amp; Notes
                      </p>
                      <ul className="space-y-1">
                        {rec.challengesNoted.map((c, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* next skill */}
                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">
                      Next Skill
                    </p>
                    <p className="text-sm text-emerald-900">{rec.nextSkill}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span>Recorded: {rec.recordedDate}</span>
                    <span>Review: {rec.reviewDate}</span>
                    <span>Key Worker: {getStaffName(rec.keyWorker)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── regulatory note ────────────────────────────────────────────── */}
      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Laundry self-care evidences Quality Standard 6
          (enjoyment and achievement) and the Pathway Plan independence outcomes for over-16s.
          Each child&apos;s voice and pace is upheld per UNCRC Article 12. Records link to
          Independence Skills Tracker and Daily Routines.
        </p>
      </div>
    </PageShell>
  );
}
