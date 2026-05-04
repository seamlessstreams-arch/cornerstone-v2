"use client";

import { useState, useMemo } from "react";
import {
  Heart,
  Wind,
  Activity,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Sparkles,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

/* ── types ─────────────────────────────────────────────────────────────── */

interface ToolkitRecord {
  id: string;
  youngPerson: string;
  lastUpdated: string;
  primaryState: "Hyperarousal (fight/flight)" | "Hypoarousal (freeze/dissociation)" | "Mixed";
  windowOfTolerance: "Narrow" | "Moderate" | "Widening";
  sensoryStrategies: string[];
  breathingStrategies: string[];
  movementStrategies: string[];
  distractionStrategies: string[];
  coRegulationStrategies: string[];
  whatWorksAnxious: string[];
  whatWorksAngry: string[];
  whatWorksOverwhelmed: string[];
  doNotUse: string[];
  childChoseAll: boolean;
  effectivenessRating: "Highly effective" | "Effective" | "Mixed" | "Needs review";
  childVoice: string;
  staffObservation: string;
  externalSupport?: string;
  reviewDate: string;
  keyWorker: string;
}

const d = (n: number) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };

/* ── colour helpers ────────────────────────────────────────────────────── */

const STATE_COLOURS: Record<ToolkitRecord["primaryState"], string> = {
  "Hyperarousal (fight/flight)": "bg-red-100 text-red-800",
  "Hypoarousal (freeze/dissociation)": "bg-blue-100 text-blue-800",
  "Mixed": "bg-amber-100 text-amber-800",
};

const WINDOW_COLOURS: Record<ToolkitRecord["windowOfTolerance"], string> = {
  "Narrow": "bg-red-100 text-red-800",
  "Moderate": "bg-amber-100 text-amber-800",
  "Widening": "bg-emerald-100 text-emerald-800",
};

const EFFECTIVENESS_COLOURS: Record<ToolkitRecord["effectivenessRating"], string> = {
  "Highly effective": "bg-emerald-100 text-emerald-800",
  "Effective": "bg-green-100 text-green-800",
  "Mixed": "bg-amber-100 text-amber-800",
  "Needs review": "bg-red-100 text-red-800",
};

/* ── seed ──────────────────────────────────────────────────────────────── */

const SEED: ToolkitRecord[] = [
  {
    id: "tk1",
    youngPerson: "yp_alex",
    lastUpdated: d(-12),
    primaryState: "Hyperarousal (fight/flight)",
    windowOfTolerance: "Moderate",
    sensoryStrategies: [
      "Cold water on wrists and face",
      "Chewing gum (mint flavour)",
      "Headphones with own playlist (loud bass)",
      "Hoodie up — reduces visual input",
    ],
    breathingStrategies: [
      "Box breathing 4-4-4-4 (only when already coming down)",
      "Sighing exhale — long out-breath",
    ],
    movementStrategies: [
      "Boxing bag in the garage — 10–15 mins",
      "Skipping rope on the patio",
      "Running up and down the stairs",
      "Press-ups against the wall",
    ],
    distractionStrategies: [
      "Football video compilations on phone",
      "Drumming on legs to music",
      "Counting cars from bedroom window",
    ],
    coRegulationStrategies: [
      "Walk alongside Edward — no talking required",
      "Sit in same room as Anna with door open",
      "Cooking with staff — chopping is regulating",
    ],
    whatWorksAnxious: [
      "Movement first, then breathing",
      "Music in ears to drown out racing thoughts",
      "Asking 'do you want company or space?' — Alex picks space then comes out",
    ],
    whatWorksAngry: [
      "Boxing bag — no questions, no audience",
      "Run round the block with Edward (no eye contact)",
      "Cold water on face when starting to cool down",
    ],
    whatWorksOverwhelmed: [
      "Hoodie up, headphones in, bedroom door closed",
      "Staff drop a snack outside the door, no knock",
      "20 minutes alone, then check-in",
    ],
    doNotUse: [
      "Hugs or any unsolicited touch — Alex finds this intrusive",
      "Asking 'what's wrong?' during dysregulation — triggers shutdown",
      "Group breathing exercises — feels watched",
    ],
    childChoseAll: true,
    effectivenessRating: "Highly effective",
    childVoice: "Boxing the bag stops me wanting to break stuff. Music and a hoodie is my reset button. Don't try to hug me when I'm angry — that makes it worse.",
    staffObservation: "Movement-first regulation is consistently effective. Alex now self-initiates the boxing bag without prompting. Notable progress over six months — recovery time after dysregulation has reduced from 90 minutes to around 25.",
    externalSupport: "OT input on sensory profile (Sept 2025). CAMHS therapist supportive of physical regulation focus.",
    reviewDate: d(45),
    keyWorker: "staff_anna",
  },
  {
    id: "tk2",
    youngPerson: "yp_jordan",
    lastUpdated: d(-6),
    primaryState: "Mixed",
    windowOfTolerance: "Narrow",
    sensoryStrategies: [
      "Worry beads / tasbih — kept in pocket",
      "Warm drink held in both hands",
      "Soft prayer mat in bedroom — texture grounding",
    ],
    breathingStrategies: [
      "4-7-8 breathing (learned at the mosque from Imam Yusuf)",
      "Counting breaths during wudu (ablution)",
      "Slow nasal breathing — 6 cycles",
    ],
    movementStrategies: [
      "Football kickabout in the garden",
      "Walking with mentor Khalid on Saturdays",
      "Stretching after morning prayer",
    ],
    distractionStrategies: [
      "FIFA on the PlayStation",
      "Reciting memorised surahs quietly",
      "Drawing patterns in a sketchbook",
    ],
    coRegulationStrategies: [
      "Phone call with Khalid (mentor)",
      "Sitting with Chervelle in the kitchen — quiet company",
      "Video call with brother Tyler",
    ],
    whatWorksAnxious: [
      "4-7-8 breathing then wudu — combines spiritual and somatic",
      "Mentor phone call when contact is approaching",
      "Worry beads in pocket during difficult conversations",
    ],
    whatWorksAngry: [
      "Football outside — 20 mins minimum",
      "Step away to bedroom, prayer mat, slow breaths",
      "Don't try to talk it out in the moment",
    ],
    whatWorksOverwhelmed: [
      "Withdraw to bedroom with permission",
      "Phone call with Tyler — sibling regulation",
      "Quiet kitchen with Chervelle — no questions",
    ],
    doNotUse: [
      "Being told to 'calm down' — escalates immediately",
      "Removing prayer time as a consequence — never appropriate",
      "Suggesting 'distraction' during contact-related distress — feels dismissive",
    ],
    childChoseAll: true,
    effectivenessRating: "Effective",
    childVoice: "Breathing the way Imam Yusuf showed me actually works. When I'm angry I need to play football, not talk. Khalid on the phone helps when contact with mum is coming up.",
    staffObservation: "Window of tolerance narrows significantly around family contact. Toolkit works well in low-stakes moments but Jordan still struggles to access strategies during peak distress. Mentor calls and football consistently effective. Continue scaffolding access to strategies during dysregulation.",
    externalSupport: "Mentor Khalid (Muslim Youth Helpline, weekly). Imam Yusuf (mosque, fortnightly). CAMHS art therapist.",
    reviewDate: d(20),
    keyWorker: "staff_chervelle",
  },
  {
    id: "tk3",
    youngPerson: "yp_casey",
    lastUpdated: d(-3),
    primaryState: "Hypoarousal (freeze/dissociation)",
    windowOfTolerance: "Narrow",
    sensoryStrategies: [
      "Glitter sensory bottle (made with Anna)",
      "Weighted lap pad (4kg) on sofa",
      "Soft fleece blanket — favourite lilac one",
      "Lavender roller on wrists",
      "Smooth pebble in pocket — rubbing it slowly",
    ],
    breathingStrategies: [
      "Bumblebee breathing (humming on out-breath)",
      "Following Anna's breathing — Anna leads, Casey copies",
    ],
    movementStrategies: [
      "Slow swaying on the porch swing with Anna",
      "Gentle yoga stretches before bed",
      "Walking the dog at neighbour's house — slow pace",
    ],
    distractionStrategies: [
      "Watching the sensory bottle settle",
      "Colouring mandalas with fine pens",
      "Listening to lullaby playlist made by Gran",
    ],
    coRegulationStrategies: [
      "Sitting close to Anna on the sofa — Anna's calm presence",
      "Phone call with Gran (every Wednesday, never missed)",
      "Hand-holding when ready — Casey initiates",
    ],
    whatWorksAnxious: [
      "Weighted lap pad and sensory bottle — watching it settle",
      "Anna sits beside Casey, slows her own breathing",
      "Lavender roller and soft blanket",
    ],
    whatWorksAngry: [
      "Anger is rare — usually presents as withdrawal",
      "When it appears: gentle naming, no demands, lap pad",
      "Wait it out alongside, don't try to redirect",
    ],
    whatWorksOverwhelmed: [
      "Low-stimulation room — lights dim, no music",
      "Weighted lap pad, blanket, sensory bottle",
      "Anna present but quiet — no questions",
      "Phone call with Gran if Anna unavailable",
    ],
    doNotUse: [
      "Loud music or fast movement — pushes Casey further into freeze",
      "Multiple staff in the room at once — overwhelming",
      "Cold water or strong smells — too activating",
      "Demands to 'come back' or 'snap out of it'",
    ],
    childChoseAll: true,
    effectivenessRating: "Highly effective",
    childVoice: "When everything goes fuzzy in my head I like the lap pad and watching the glitter fall. Anna doesn't talk, she just sits. Gran phoning every Wednesday is the best bit of my week.",
    staffObservation: "Window of tolerance widening slowly — narrow but trending positive. Sensory and co-regulation strategies are consistently the route back from dissociation. Avoid any over-stimulation. Toolkit becoming a genuinely internalised resource — Casey now asks for the lap pad herself.",
    externalSupport: "OT sensory assessment (Aug 2025) informed selection. CAMHS gradual exposure work in progress. Gran is a key therapeutic relationship.",
    reviewDate: d(30),
    keyWorker: "staff_anna",
  },
];

/* ── flat row for export ──────────────────────────────────────────────── */

interface FlatRow {
  youngPerson: string;
  lastUpdated: string;
  primaryState: string;
  windowOfTolerance: string;
  effectivenessRating: string;
  sensoryStrategies: string;
  breathingStrategies: string;
  movementStrategies: string;
  distractionStrategies: string;
  coRegulationStrategies: string;
  whatWorksAnxious: string;
  whatWorksAngry: string;
  whatWorksOverwhelmed: string;
  doNotUse: string;
  childChoseAll: string;
  childVoice: string;
  staffObservation: string;
  externalSupport: string;
  reviewDate: string;
  keyWorker: string;
}

const EXPORT_COLS: ExportColumn<FlatRow>[] = [
  { header: "Young Person",       accessor: (r: FlatRow) => r.youngPerson },
  { header: "Last Updated",       accessor: (r: FlatRow) => r.lastUpdated },
  { header: "Primary State",      accessor: (r: FlatRow) => r.primaryState },
  { header: "Window of Tolerance",accessor: (r: FlatRow) => r.windowOfTolerance },
  { header: "Effectiveness",      accessor: (r: FlatRow) => r.effectivenessRating },
  { header: "Sensory",            accessor: (r: FlatRow) => r.sensoryStrategies },
  { header: "Breathing",          accessor: (r: FlatRow) => r.breathingStrategies },
  { header: "Movement",           accessor: (r: FlatRow) => r.movementStrategies },
  { header: "Distraction",        accessor: (r: FlatRow) => r.distractionStrategies },
  { header: "Co-Regulation",      accessor: (r: FlatRow) => r.coRegulationStrategies },
  { header: "Anxious — Works",    accessor: (r: FlatRow) => r.whatWorksAnxious },
  { header: "Angry — Works",      accessor: (r: FlatRow) => r.whatWorksAngry },
  { header: "Overwhelmed — Works",accessor: (r: FlatRow) => r.whatWorksOverwhelmed },
  { header: "Do Not Use",         accessor: (r: FlatRow) => r.doNotUse },
  { header: "Child Chose All",    accessor: (r: FlatRow) => r.childChoseAll },
  { header: "Child Voice",        accessor: (r: FlatRow) => r.childVoice },
  { header: "Staff Observation",  accessor: (r: FlatRow) => r.staffObservation },
  { header: "External Support",   accessor: (r: FlatRow) => r.externalSupport },
  { header: "Review Date",        accessor: (r: FlatRow) => r.reviewDate },
  { header: "Key Worker",         accessor: (r: FlatRow) => r.keyWorker },
];

/* ── component ────────────────────────────────────────────────────────── */

export default function ChildSelfSoothingToolkitPage() {
  const [data] = useState<ToolkitRecord[]>(SEED);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [filterEffect, setFilterEffect] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  /* ── stats ────────────────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const withToolkits = data.length;
    const highlyEffective = data.filter((r) => r.effectivenessRating === "Highly effective").length;
    const reviewsDue = data.filter((r) => r.reviewDate <= d(21)).length;
    const widening = data.filter((r) => r.windowOfTolerance === "Widening").length;
    return { withToolkits, highlyEffective, reviewsDue, widening };
  }, [data]);

  /* ── filtered / sorted ────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = data;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        getYPName(r.youngPerson).toLowerCase().includes(q) ||
        r.primaryState.toLowerCase().includes(q) ||
        r.effectivenessRating.toLowerCase().includes(q)
      );
    }
    if (filterEffect !== "all") list = list.filter((r) => r.effectivenessRating === filterEffect);
    const out = [...list];
    switch (sortBy) {
      case "name":
        out.sort((a, b) => getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson)));
        break;
      case "effectiveness": {
        const order: Record<ToolkitRecord["effectivenessRating"], number> = {
          "Highly effective": 0, "Effective": 1, "Mixed": 2, "Needs review": 3,
        };
        out.sort((a, b) => order[a.effectivenessRating] - order[b.effectivenessRating]);
        break;
      }
      case "review":
        out.sort((a, b) => a.reviewDate.localeCompare(b.reviewDate));
        break;
    }
    return out;
  }, [data, search, filterEffect, sortBy]);

  /* ── export ───────────────────────────────────────────────────────── */
  const exportData = useMemo<FlatRow[]>(() =>
    data.map((r) => ({
      youngPerson: getYPName(r.youngPerson),
      lastUpdated: r.lastUpdated,
      primaryState: r.primaryState,
      windowOfTolerance: r.windowOfTolerance,
      effectivenessRating: r.effectivenessRating,
      sensoryStrategies: r.sensoryStrategies.join("; "),
      breathingStrategies: r.breathingStrategies.join("; "),
      movementStrategies: r.movementStrategies.join("; "),
      distractionStrategies: r.distractionStrategies.join("; "),
      coRegulationStrategies: r.coRegulationStrategies.join("; "),
      whatWorksAnxious: r.whatWorksAnxious.join("; "),
      whatWorksAngry: r.whatWorksAngry.join("; "),
      whatWorksOverwhelmed: r.whatWorksOverwhelmed.join("; "),
      doNotUse: r.doNotUse.join("; "),
      childChoseAll: r.childChoseAll ? "Yes" : "No",
      childVoice: r.childVoice,
      staffObservation: r.staffObservation,
      externalSupport: r.externalSupport ?? "",
      reviewDate: r.reviewDate,
      keyWorker: getStaffName(r.keyWorker),
    })), [data]);

  return (
    <PageShell
      title="Child Self-Soothing Toolkit"
      subtitle="Per-child library of regulation strategies — sensory, breathing, movement, distraction and co-regulation"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Self-Soothing Toolkit" />
          <ExportButton data={exportData} columns={EXPORT_COLS} filename="child-self-soothing-toolkit" />
        </div>
      }
    >
      {/* ── stat strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Children with toolkits", value: stats.withToolkits, icon: Heart, colour: "text-violet-600" },
          { label: "Highly effective", value: stats.highlyEffective, icon: Sparkles, colour: stats.highlyEffective > 0 ? "text-emerald-600" : "text-gray-400" },
          { label: "Reviews due (21 d)", value: stats.reviewsDue, icon: Wind, colour: stats.reviewsDue > 0 ? "text-amber-600" : "text-gray-400" },
          { label: "Window widening", value: stats.widening, icon: Activity, colour: stats.widening > 0 ? "text-emerald-600" : "text-gray-400" },
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
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search children, states, effectiveness…"
            className="w-full rounded-md border py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <Select value={filterEffect} onValueChange={setFilterEffect}>
          <SelectTrigger className="w-[180px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All effectiveness</SelectItem>
            <SelectItem value="Highly effective">Highly effective</SelectItem>
            <SelectItem value="Effective">Effective</SelectItem>
            <SelectItem value="Mixed">Mixed</SelectItem>
            <SelectItem value="Needs review">Needs review</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <ArrowUpDown className="h-4 w-4" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="effectiveness">Effectiveness</SelectItem>
              <SelectItem value="review">Review date</SelectItem>
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
                className="flex w-full items-center justify-between p-4 text-left hover:bg-violet-50/40"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Heart className="h-4 w-4 text-violet-500" />
                    <h3 className="font-semibold">{getYPName(r.youngPerson)}</h3>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", STATE_COLOURS[r.primaryState])}>
                      {r.primaryState}
                    </span>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", WINDOW_COLOURS[r.windowOfTolerance])}>
                      Window: {r.windowOfTolerance}
                    </span>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", EFFECTIVENESS_COLOURS[r.effectivenessRating])}>
                      {r.effectivenessRating}
                    </span>
                    {r.childChoseAll && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                        Child-chosen
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Key worker: {getStaffName(r.keyWorker)} · Updated {r.lastUpdated} · Review {r.reviewDate}
                  </p>
                </div>
                {open ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>

              {open && (
                <div className="border-t px-4 pb-4 space-y-4">
                  {/* strategies grouped by category */}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-violet-50 border border-violet-200 p-3">
                      <h4 className="text-xs font-semibold text-violet-700 mb-1">Sensory</h4>
                      <ul className="list-disc list-inside text-sm text-violet-900 space-y-0.5">
                        {r.sensoryStrategies.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-md bg-sky-50 border border-sky-200 p-3">
                      <h4 className="text-xs font-semibold text-sky-700 mb-1">Breathing</h4>
                      <ul className="list-disc list-inside text-sm text-sky-900 space-y-0.5">
                        {r.breathingStrategies.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                      <h4 className="text-xs font-semibold text-amber-700 mb-1">Movement</h4>
                      <ul className="list-disc list-inside text-sm text-amber-900 space-y-0.5">
                        {r.movementStrategies.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-md bg-indigo-50 border border-indigo-200 p-3">
                      <h4 className="text-xs font-semibold text-indigo-700 mb-1">Distraction</h4>
                      <ul className="list-disc list-inside text-sm text-indigo-900 space-y-0.5">
                        {r.distractionStrategies.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-md bg-fuchsia-50 border border-fuchsia-200 p-3 md:col-span-2">
                      <h4 className="text-xs font-semibold text-fuchsia-700 mb-1">Co-Regulation</h4>
                      <ul className="list-disc list-inside text-sm text-fuchsia-900 space-y-0.5">
                        {r.coRegulationStrategies.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* what works in different states */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-2">What works in each state</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="rounded-md border border-amber-200 bg-amber-50/60 p-3">
                        <p className="text-xs font-semibold text-amber-700 mb-1">When anxious</p>
                        <ul className="list-disc list-inside text-xs text-amber-900 space-y-0.5">
                          {r.whatWorksAnxious.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                      <div className="rounded-md border border-rose-200 bg-rose-50/60 p-3">
                        <p className="text-xs font-semibold text-rose-700 mb-1">When angry</p>
                        <ul className="list-disc list-inside text-xs text-rose-900 space-y-0.5">
                          {r.whatWorksAngry.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                      <div className="rounded-md border border-blue-200 bg-blue-50/60 p-3">
                        <p className="text-xs font-semibold text-blue-700 mb-1">When overwhelmed</p>
                        <ul className="list-disc list-inside text-xs text-blue-900 space-y-0.5">
                          {r.whatWorksOverwhelmed.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* do not use */}
                  <div className="rounded-md bg-red-50 border border-red-200 p-3">
                    <h4 className="text-xs font-semibold text-red-700 mb-1">Do NOT use</h4>
                    <ul className="list-disc list-inside text-sm text-red-800 space-y-0.5">
                      {r.doNotUse.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>

                  {/* child voice */}
                  <div className="rounded-md bg-violet-50 border border-violet-200 p-3">
                    <h4 className="text-xs font-semibold text-violet-700 mb-1">Child&apos;s voice</h4>
                    <p className="text-sm italic text-violet-900">&ldquo;{r.childVoice}&rdquo;</p>
                  </div>

                  {/* staff observation */}
                  <div className="rounded-md bg-gray-50 p-3">
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">Staff observation</h4>
                    <p className="text-sm">{r.staffObservation}</p>
                  </div>

                  {/* external support */}
                  {r.externalSupport && (
                    <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3">
                      <h4 className="text-xs font-semibold text-emerald-700 mb-1">External support</h4>
                      <p className="text-sm text-emerald-900">{r.externalSupport}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── regulatory footer ──────────────────────────────────────── */}
      <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900">
        <strong>Trauma-informed practice:</strong> Self-soothing toolkits are grounded in polyvagal theory (Porges) and the
        window of tolerance model (Siegel/Ogden). Strategies are co-produced with each child using Dan Hughes&apos; PACE
        framework — Playfulness, Acceptance, Curiosity, Empathy. Regulation is built through repeated co-regulation
        before children can self-regulate. This supports Children&apos;s Homes Quality Standards 5 (Care &amp; Support)
        and 7 (Positive Relationships), and gives effect to UNCRC Article 12 — the child&apos;s right to be heard in
        decisions affecting them. Toolkits must be reviewed regularly and updated as the child&apos;s needs evolve.
      </div>
    </PageShell>
  );
}
