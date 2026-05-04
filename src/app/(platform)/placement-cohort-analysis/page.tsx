"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  ArrowUpDown,
  Search,
  TrendingUp,
  Heart,
  AlertTriangle,
  CalendarRange,
  UserPlus,
  Activity,
  ShieldCheck,
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

type PairDynamic = "Strong friendship" | "Neutral" | "Some friction" | "Active conflict";

interface PeerRelationshipPair {
  pair: string;
  dynamic: PairDynamic;
  notes: string;
}

interface CohortAnalysis {
  id: string;
  analysisDate: string;
  period: string;
  authoredBy: string;
  cohortMembers: string[];
  demographicProfile: string;
  strengthsOfCohort: string[];
  tensionsOrDynamics: string[];
  peerRelationshipMap: PeerRelationshipPair[];
  individualImpactsOnGroup: Record<string, string>;
  groupImpactsOnIndividual: Record<string, string>;
  groupActivities: string[];
  individualisedSupportInGroupContext: Record<string, string>;
  conflictResolutionInstances: number;
  positiveDynamicsInstances: number;
  staffingChallengesArising: string;
  proposedAdmissionConsiderations: string;
  recommendedActions: string[];
}

/* ── helpers ───────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const DYNAMIC_COLOURS: Record<PairDynamic, string> = {
  "Strong friendship": "bg-green-100 text-green-800",
  "Neutral":           "bg-gray-100 text-gray-700",
  "Some friction":     "bg-amber-100 text-amber-800",
  "Active conflict":   "bg-red-100 text-red-800",
};

/* ── seed data ─────────────────────────────────────────────────────────── */

const COHORT_ANALYSES: CohortAnalysis[] = [
  {
    id: "ca_q1_2026",
    analysisDate: d(-14),
    period: "Q1 2026",
    authoredBy: "staff_darren",
    cohortMembers: ["yp_alex", "yp_jordan", "yp_casey"],
    demographicProfile:
      "Three children aged 11–14, mixed gender, one with diagnosed autism (Jordan), two of dual heritage. Mixed school placements (one mainstream, one specialist, one with EHCP support in mainstream). Two long-term placements (>12 months), one approaching 6-month settling period. Stable group composition this quarter — no admissions or departures.",
    strengthsOfCohort: [
      "Alex and Casey form a stabilising friendship dyad — natural peer modelling",
      "All three children have mutually compatible bedtime routines after recent staggering changes",
      "Children share genuine curiosity in each other's interests — Casey now joins Jordan's Lego sessions",
      "No bullying behaviours observed across the quarter",
      "Group meals attended together 5+ days/week — viewed positively by all three",
    ],
    tensionsOrDynamics: [
      "Sensory mismatch — Casey's after-school energy still triggers Jordan's withdrawal",
      "Alex occasionally caught between mediating Jordan's quiet needs and Casey's enthusiasm",
      "Bathroom rota friction on school mornings (now resolved with new schedule)",
      "Two minor verbal disagreements over TV remote — both de-escalated by staff within minutes",
    ],
    peerRelationshipMap: [
      { pair: "Alex ↔ Casey",  dynamic: "Strong friendship", notes: "Genuine, age-appropriate friendship. Alex provides positive role-modelling; Casey looks up to Alex. Stable and life-giving for both." },
      { pair: "Alex ↔ Jordan", dynamic: "Neutral",           notes: "Improving steadily. Alex has learnt to moderate volume around Jordan; Jordan tolerates Alex's presence well in shared spaces." },
      { pair: "Jordan ↔ Casey", dynamic: "Some friction",    notes: "Sensory incompatibility persists. Structured shared activities (art) are bridge — unstructured time still requires staff scaffolding." },
    ],
    individualImpactsOnGroup: {
      yp_alex:   "Acts as informal cohesion-builder. Alex's openness sets the tone for shared meals and group activities. Occasional language slips set examples Casey copies — staff actively manage.",
      yp_jordan: "Jordan's calm and reflective presence balances the home's energy. Their need for quiet has shaped a more thoughtful shared culture, which benefits everyone.",
      yp_casey:  "Casey brings energy, humour and warmth. Their enthusiasm can dysregulate Jordan but lifts Alex's mood. Casey is learning — visible progress in self-awareness this quarter.",
    },
    groupImpactsOnIndividual: {
      yp_alex:   "The group provides Alex with belonging and the social mirroring they previously lacked. Risk: Alex sometimes performs the 'helpful older one' role at cost of their own needs.",
      yp_jordan: "The group has stretched Jordan's tolerance for noise and unpredictability — therapeutic in measured doses. Risk: chronic over-stimulation could erode coping reserves.",
      yp_casey:  "The group offers Casey models of regulated behaviour and friendship. Risk: Casey can feel 'told off' more than the others when their energy is the trigger.",
    },
    groupActivities: [
      "Weekly Sunday cooking session — all three plus key worker (12/13 weeks attended)",
      "Bi-weekly cinema night with chosen film rota (everyone gets a turn)",
      "Joint art table set up Tuesday evenings — calm parallel activity",
      "Garden football on dry afternoons — Alex and Casey, Jordan optional",
      "Quarterly 'house meeting' with biscuits — children helped set agenda",
    ],
    individualisedSupportInGroupContext: {
      yp_alex:   "Key worker checks in 1:1 weekly to ensure Alex isn't over-functioning as peer mentor. Personal time protected — Alex's bedroom is their sanctuary.",
      yp_jordan: "Sensory toolkit available in lounge. Pre-warning system before high-energy events (e.g. Casey returning from school) so Jordan can choose space. Headphones normalised.",
      yp_casey:  "Decompression routine on school return — kitchen snack with staff before joining communal spaces. Strengths-based reframing of energy ('your energy is welcome, let's land it gently').",
    },
    conflictResolutionInstances: 4,
    positiveDynamicsInstances: 47,
    staffingChallengesArising:
      "Sensory awareness training refreshed for two staff this quarter. Need for proactive supervision during after-school transitions has increased staffing intensity 4–6pm — currently met with adjusted shift overlap. No critical staffing gaps. One agency-staff weekend created brief regression in Jordan's settledness — rota now avoids agency cover during pinch-points where possible.",
    proposedAdmissionConsiderations:
      "Any prospective fourth admission must be assessed against current sensory ecology — a high-energy or behaviourally dysregulated child would risk destabilising Jordan's hard-won tolerance and could overload Alex's mediator role. Ideal next admission would be a child with calm-to-moderate presentation, similar age range (10–14), and ability to engage in structured group activity. Two-week impact assessment with phased introduction recommended.",
    recommendedActions: [
      "Continue current cohort composition — no changes recommended",
      "Maintain weekly Sunday cooking and bi-weekly cinema as anchor rituals",
      "Refresh sensory awareness for any incoming staff (induction requirement)",
      "Revisit Casey's decompression routine in 6 weeks — adjust if school changes",
      "Begin gentle conversation with Jordan about whether they'd welcome a fourth child if matched well",
      "Avoid agency staff during 4–6pm transition window where possible",
    ],
  },
  {
    id: "ca_q4_2025",
    analysisDate: d(-104),
    period: "Q4 2025",
    authoredBy: "staff_ryan",
    cohortMembers: ["yp_alex", "yp_jordan", "yp_casey"],
    demographicProfile:
      "Three children aged 11–14. Casey newly admitted at start of quarter — first quarter as a settled threesome. Mixed sensory and behavioural profiles; one autism diagnosis. Group composition stable through the quarter.",
    strengthsOfCohort: [
      "Alex welcomed Casey warmly from day one — early friendship bond formed",
      "Jordan tolerated the new admission better than initial impact assessment predicted",
      "Christmas period went well — children participated in shared traditions",
      "First joint outing (cinema) successful — established as new routine",
    ],
    tensionsOrDynamics: [
      "Settling-in friction between Casey and Jordan — sensory mismatch became apparent in week 3",
      "Bathroom rota required two iterations before working",
      "Alex briefly destabilised mid-quarter — felt 'demoted' from only-child position; resolved with key-worker work",
      "Mealtime volume an early issue — addressed with seating changes",
    ],
    peerRelationshipMap: [
      { pair: "Alex ↔ Casey",  dynamic: "Strong friendship", notes: "Bond formed within first month. Genuine and age-appropriate." },
      { pair: "Alex ↔ Jordan", dynamic: "Some friction",     notes: "Alex's attention-shift to Casey caused Jordan to feel sidelined initially. Recovered by quarter end." },
      { pair: "Jordan ↔ Casey", dynamic: "Some friction",    notes: "Sensory clash visible from week 3. Strategies introduced; required active management throughout quarter." },
    ],
    individualImpactsOnGroup: {
      yp_alex:   "Alex's welcoming approach made Casey's settling possible. Their leadership in shared activities set a positive group tone.",
      yp_jordan: "Jordan's quiet predictability provided continuity through the admission transition. Their adjustment took longer but was significant.",
      yp_casey:  "Casey's arrival re-energised the home. Their initial dysregulation was understandable settling behaviour; required patient management.",
    },
    groupImpactsOnIndividual: {
      yp_alex:   "The arrival challenged Alex's place in the home — productive growth around sharing attention. Increased confidence as 'older sibling' figure.",
      yp_jordan: "The transition was demanding for Jordan — sleep disruption, increased anxiety in week 3–6. Stabilised with sensory plan adjustments.",
      yp_casey:  "Group provided Casey with structure and friendship they had lacked in previous placement. Visible regulation gains by quarter end.",
    },
    groupActivities: [
      "Christmas decorating — all three plus key worker (introduced as bonding ritual)",
      "Sunday cooking sessions established (8/12 weeks attended in this quarter)",
      "Cinema trips established as routine",
      "Bonfire night attended together — successful first outing",
    ],
    individualisedSupportInGroupContext: {
      yp_alex:   "Increased 1:1 time during weeks 2–4 to address 'demotion' feelings. Alex retained a special weekly outing with key worker.",
      yp_jordan: "Sensory plan adjustments — quiet hour introduced 5–6pm. Bedroom established as protected retreat. Headphones available throughout home.",
      yp_casey:  "Settling protocol — minimal demands first 2 weeks. Visual home routine displayed in their room. Daily key-worker check-ins.",
    },
    conflictResolutionInstances: 9,
    positiveDynamicsInstances: 28,
    staffingChallengesArising:
      "Admission period required intensified staffing — additional waking nights for first two weeks. Sensory plan rewriting consumed key-worker time. Christmas cover required careful planning to avoid agency-only shifts during Casey's first festive period in placement.",
    proposedAdmissionConsiderations:
      "No further admissions recommended in next quarter — group requires consolidation period. Re-evaluate at end of Q1 2026 once cohort stability confirmed.",
    recommendedActions: [
      "Hold composition stable for full Q1 2026 — no admissions",
      "Continue sensory plan; review at 6-month settling point",
      "Maintain Alex's protected 1:1 outing weekly",
      "Build on emerging Christmas/cinema rituals",
      "Begin formal peer-relationship mapping in Q1 2026",
    ],
  },
  {
    id: "ca_q3_2025",
    analysisDate: d(-195),
    period: "Q3 2025",
    authoredBy: "staff_darren",
    cohortMembers: ["yp_alex", "yp_jordan"],
    demographicProfile:
      "Two children aged 12–14 prior to Casey's admission at end of quarter. Long-established placement dyad — both 12+ months in placement. Calm, low-stimulus group ecology. Casey introduced in final two weeks of quarter under phased admission protocol.",
    strengthsOfCohort: [
      "Alex and Jordan had reached a settled, predictable rhythm — quietly companionable",
      "Both children comfortable in shared spaces without forced interaction",
      "Established mealtime, bedtime and weekend routines well-embedded",
      "Strong individual key-worker relationships freed staff to focus on admissions prep",
    ],
    tensionsOrDynamics: [
      "Limited peer interaction — neither child sought the other out, which was developmentally fine but a thin peer ecology",
      "Pre-admission anxiety in Alex during final fortnight — needed reassurance about their place",
      "Jordan's first overlap days with Casey produced sensory overload — anticipated, planned for",
    ],
    peerRelationshipMap: [
      { pair: "Alex ↔ Jordan", dynamic: "Neutral", notes: "Companionable co-existence rather than friendship. Both content with this." },
    ],
    individualImpactsOnGroup: {
      yp_alex:   "Alex's open and chatty presence kept the home feeling lived-in. Set a low-pressure social tone.",
      yp_jordan: "Jordan's predictability was the home's anchor. Routines built around their needs benefited Alex too.",
    },
    groupImpactsOnIndividual: {
      yp_alex:   "The dyad gave Alex peer presence without demand. Stretched their patience with difference.",
      yp_jordan: "Two-child dynamic was sustainable for Jordan; the planned move to three was approached cautiously.",
    },
    groupActivities: [
      "Occasional shared meals (3–4x/week)",
      "Garden time on weekends — parallel rather than joint",
      "Summer day-trip together — successful low-key outing",
    ],
    individualisedSupportInGroupContext: {
      yp_alex:   "Preparation for new admission — Alex involved in age-appropriate way (helped choose welcome card).",
      yp_jordan: "Pre-admission sensory planning intensified. Bedroom protected. Visual schedule of admission timeline shared with Jordan.",
    },
    conflictResolutionInstances: 1,
    positiveDynamicsInstances: 14,
    staffingChallengesArising:
      "Quiet quarter for staffing demand until final two weeks. Admission preparation consumed senior staff time. Brief transition window to three-child staffing model required ratio review.",
    proposedAdmissionConsiderations:
      "Casey's admission completed at quarter end under phased protocol (overnight visits, week-long settling, full move). Recommendation that no further admissions be considered for at least two full quarters to allow new threesome to consolidate.",
    recommendedActions: [
      "Complete Casey's settling protocol into Q4 2025",
      "Hold three-child composition stable through Q4 and Q1 2026",
      "Establish formal cohort analysis cycle from Q4 onwards",
      "Refresh sensory awareness training for all staff before admission",
      "Continue Jordan's pre-admission sensory plan beyond settling period",
    ],
  },
];

/* ── flat row for export ─────────────────────────────────────────────── */

const EXPORT_COLS: ExportColumn<CohortAnalysis>[] = [
  { header: "Period",                accessor: (r: CohortAnalysis) => r.period },
  { header: "Analysis Date",         accessor: (r: CohortAnalysis) => r.analysisDate },
  { header: "Authored By",           accessor: (r: CohortAnalysis) => getStaffName(r.authoredBy) },
  { header: "Cohort Members",        accessor: (r: CohortAnalysis) => r.cohortMembers.map(getYPName).join(", ") },
  { header: "Demographic Profile",   accessor: (r: CohortAnalysis) => r.demographicProfile },
  { header: "Strengths",             accessor: (r: CohortAnalysis) => r.strengthsOfCohort.join("; ") },
  { header: "Tensions/Dynamics",     accessor: (r: CohortAnalysis) => r.tensionsOrDynamics.join("; ") },
  { header: "Peer Map",              accessor: (r: CohortAnalysis) => r.peerRelationshipMap.map((p) => `${p.pair}: ${p.dynamic}`).join("; ") },
  { header: "Group Activities",      accessor: (r: CohortAnalysis) => r.groupActivities.join("; ") },
  { header: "Conflict Resolutions",  accessor: (r: CohortAnalysis) => String(r.conflictResolutionInstances) },
  { header: "Positive Dynamics",     accessor: (r: CohortAnalysis) => String(r.positiveDynamicsInstances) },
  { header: "Staffing Challenges",   accessor: (r: CohortAnalysis) => r.staffingChallengesArising },
  { header: "Admission Considerations", accessor: (r: CohortAnalysis) => r.proposedAdmissionConsiderations },
  { header: "Recommended Actions",   accessor: (r: CohortAnalysis) => r.recommendedActions.join("; ") },
];

/* ── component ────────────────────────────────────────────────────────── */

export default function PlacementCohortAnalysisPage() {
  const [analyses] = useState<CohortAnalysis[]>(COHORT_ANALYSES);
  const [expandedId, setExpandedId] = useState<string | null>(analyses[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const toggle = (id: string) => setExpandedId((p) => (p === id ? null : id));

  /* ── stats ────────────────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const latest = [...analyses].sort((a, b) => b.analysisDate.localeCompare(a.analysisDate))[0];
    const cohortSize = latest?.cohortMembers.length ?? 0;
    const quartersAnalysed = analyses.length;

    const sortedAsc = [...analyses].sort((a, b) => a.analysisDate.localeCompare(b.analysisDate));
    let trend: "up" | "down" | "flat" = "flat";
    if (sortedAsc.length >= 2) {
      const first = sortedAsc[0].positiveDynamicsInstances;
      const last = sortedAsc[sortedAsc.length - 1].positiveDynamicsInstances;
      if (last > first) trend = "up";
      else if (last < first) trend = "down";
    }
    const totalTensions = analyses.reduce((s, a) => s + a.tensionsOrDynamics.length, 0);
    return { cohortSize, quartersAnalysed, trend, totalTensions };
  }, [analyses]);

  /* ── filtered / sorted ────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = analyses;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((a) =>
        a.period.toLowerCase().includes(q) ||
        a.cohortMembers.some((m) => getYPName(m).toLowerCase().includes(q)) ||
        a.demographicProfile.toLowerCase().includes(q)
      );
    }
    if (filterPeriod !== "all") list = list.filter((a) => a.period === filterPeriod);
    const out = [...list];
    switch (sortBy) {
      case "recent":   out.sort((a, b) => b.analysisDate.localeCompare(a.analysisDate)); break;
      case "oldest":   out.sort((a, b) => a.analysisDate.localeCompare(b.analysisDate)); break;
      case "positive": out.sort((a, b) => b.positiveDynamicsInstances - a.positiveDynamicsInstances); break;
      case "tensions": out.sort((a, b) => b.conflictResolutionInstances - a.conflictResolutionInstances); break;
    }
    return out;
  }, [analyses, search, filterPeriod, sortBy]);

  const periodOptions = useMemo(
    () => Array.from(new Set(analyses.map((a) => a.period))),
    [analyses]
  );

  const trendLabel = stats.trend === "up" ? "Improving" : stats.trend === "down" ? "Declining" : "Stable";
  const trendColour = stats.trend === "up" ? "text-green-600" : stats.trend === "down" ? "text-red-600" : "text-gray-500";

  return (
    <PageShell
      title="Placement Cohort Analysis"
      subtitle="Quarterly analysis of group dynamics, peer relationships and the developmental impact of group living"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Placement Cohort Analysis" />
          <ExportButton data={analyses} columns={EXPORT_COLS} filename="placement-cohort-analysis" />
        </div>
      }
    >
      {/* ── banner ─────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 mb-6 text-sm text-purple-900">
        <div className="flex items-start gap-2">
          <Users className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold mb-0.5">Group living is its own developmental experience.</p>
            <p>
              Children in our care don't just receive support as individuals — they shape and are shaped by the cohort they live with.
              How peers interact, what dynamics emerge, what supports cohesion and what destabilises it are themselves a form of care.
              This analysis is reviewed quarterly and informs every admission decision.
            </p>
          </div>
        </div>
      </div>

      {/* ── stat strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Children in Cohort",     value: stats.cohortSize,        icon: Users,        colour: "text-blue-600" },
          { label: "Quarters Analysed",      value: stats.quartersAnalysed,  icon: CalendarRange, colour: "text-gray-600" },
          { label: `Positive Dynamics: ${trendLabel}`, value: trendLabel,    icon: TrendingUp,   colour: trendColour },
          { label: "Tensions Tracked",       value: stats.totalTensions,     icon: AlertTriangle, colour: stats.totalTensions > 0 ? "text-amber-600" : "text-gray-400" },
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
            placeholder="Search period, child or profile…"
            className="w-full rounded-md border py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Periods</SelectItem>
            {periodOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <ArrowUpDown className="h-4 w-4" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="positive">Most Positive</SelectItem>
              <SelectItem value="tensions">Most Conflict</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── analyses list ──────────────────────────────────────────── */}
      <div className="space-y-4 mb-8">
        {filtered.map((a) => {
          const open = expandedId === a.id;
          return (
            <div key={a.id} className="rounded-lg border bg-white">
              <button
                onClick={() => toggle(a.id)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{a.period}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {a.cohortMembers.length} children
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Heart className="inline h-3 w-3 mr-0.5" />
                      {a.positiveDynamicsInstances} positive
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      a.conflictResolutionInstances > 5 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"
                    )}>
                      {a.conflictResolutionInstances} resolutions
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {a.analysisDate} — Authored by {getStaffName(a.authoredBy)} · Cohort: {a.cohortMembers.map(getYPName).join(", ")}
                  </p>
                </div>
                {open ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>

              {open && (
                <div className="border-t px-4 pb-4 space-y-4">
                  {/* demographic profile */}
                  <div className="mt-3 rounded-md bg-gray-50 p-3">
                    <h4 className="text-xs font-semibold text-gray-700 mb-1">Demographic Profile</h4>
                    <p className="text-sm text-gray-800">{a.demographicProfile}</p>
                  </div>

                  {/* strengths / tensions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-green-50 p-3">
                      <h4 className="text-xs font-semibold text-green-700 mb-1">Strengths of Cohort</h4>
                      <ul className="list-disc list-inside text-sm text-green-800 space-y-0.5">
                        {a.strengthsOfCohort.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-md bg-amber-50 p-3">
                      <h4 className="text-xs font-semibold text-amber-700 mb-1">Tensions &amp; Dynamics</h4>
                      <ul className="list-disc list-inside text-sm text-amber-800 space-y-0.5">
                        {a.tensionsOrDynamics.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* peer map */}
                  <div className="rounded-md border p-3">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Peer Relationship Map</h4>
                    <div className="space-y-2">
                      {a.peerRelationshipMap.map((p, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="min-w-[140px]">
                            <span className="text-sm font-medium">{p.pair}</span>
                          </div>
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium shrink-0", DYNAMIC_COLOURS[p.dynamic])}>
                            {p.dynamic}
                          </span>
                          <p className="text-sm text-gray-700 flex-1">{p.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* impacts: individual on group / group on individual */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-blue-50 p-3">
                      <h4 className="text-xs font-semibold text-blue-700 mb-2">Individual → Group Impact</h4>
                      <div className="space-y-2">
                        {a.cohortMembers.map((m) => (
                          <div key={m}>
                            <p className="text-xs font-semibold text-blue-900">{getYPName(m)}</p>
                            <p className="text-sm text-blue-800">{a.individualImpactsOnGroup[m] ?? "—"}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-indigo-50 p-3">
                      <h4 className="text-xs font-semibold text-indigo-700 mb-2">Group → Individual Impact</h4>
                      <div className="space-y-2">
                        {a.cohortMembers.map((m) => (
                          <div key={m}>
                            <p className="text-xs font-semibold text-indigo-900">{getYPName(m)}</p>
                            <p className="text-sm text-indigo-800">{a.groupImpactsOnIndividual[m] ?? "—"}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* group activities */}
                  <div className="rounded-md bg-emerald-50 p-3">
                    <h4 className="text-xs font-semibold text-emerald-700 mb-1 flex items-center gap-1">
                      <Activity className="h-3 w-3" /> Group Activities
                    </h4>
                    <ul className="list-disc list-inside text-sm text-emerald-800 space-y-0.5">
                      {a.groupActivities.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                  </div>

                  {/* individualised support in group context */}
                  <div className="rounded-md bg-pink-50 border border-pink-200 p-3">
                    <h4 className="text-xs font-semibold text-pink-700 mb-2">Individualised Support in Group Context</h4>
                    <div className="space-y-2">
                      {a.cohortMembers.map((m) => (
                        <div key={m}>
                          <p className="text-xs font-semibold text-pink-900">{getYPName(m)}</p>
                          <p className="text-sm text-pink-800">{a.individualisedSupportInGroupContext[m] ?? "—"}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* counts */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-md border p-3 flex items-center gap-3">
                      <Heart className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-lg font-bold">{a.positiveDynamicsInstances}</p>
                        <p className="text-xs text-gray-500">Positive Dynamics Recorded</p>
                      </div>
                    </div>
                    <div className="rounded-md border p-3 flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="text-lg font-bold">{a.conflictResolutionInstances}</p>
                        <p className="text-xs text-gray-500">Conflict Resolutions</p>
                      </div>
                    </div>
                  </div>

                  {/* staffing challenges */}
                  <div className="rounded-md bg-orange-50 border border-orange-200 p-3">
                    <h4 className="text-xs font-semibold text-orange-700 mb-1">Staffing Challenges Arising</h4>
                    <p className="text-sm text-orange-800">{a.staffingChallengesArising}</p>
                  </div>

                  {/* admission considerations */}
                  <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3">
                    <h4 className="text-xs font-semibold text-yellow-700 mb-1 flex items-center gap-1">
                      <UserPlus className="h-3 w-3" /> Proposed Admission Considerations
                    </h4>
                    <p className="text-sm text-yellow-900">{a.proposedAdmissionConsiderations}</p>
                  </div>

                  {/* recommended actions */}
                  <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
                    <h4 className="text-xs font-semibold text-blue-700 mb-1">Recommended Actions</h4>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-0.5">
                      {a.recommendedActions.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── regulatory note ────────────────────────────────────────── */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 mb-6">
        <strong>Regulation 14 &amp; Quality Standard 6:</strong> Reg 14 requires the registered person to assess, before any admission,
        the impact of that admission on existing children and the suitability of the home for the child's needs alongside the existing cohort.
        Quality Standard 6 (positive relationships) requires that children are helped to develop, and benefit from, relationships with peers
        and adults that support their welfare and development. Quarterly cohort analysis evidences how the home actively manages group living
        as a developmental experience and provides the structured basis for every admission impact assessment.
      </div>
    </PageShell>
  );
}
