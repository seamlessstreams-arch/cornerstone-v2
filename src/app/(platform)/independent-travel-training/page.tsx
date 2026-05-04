"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  Bus,
  Train,
  MapPin,
  Phone,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Shield,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── types ───────────────────────────────────────────────────────────────────
interface TravelRecord {
  id: string;
  youngPerson: string;
  lastUpdated: string;
  currentStage:
    | "Stage 1 — Accompanied"
    | "Stage 2 — Staff shadowing"
    | "Stage 3 — Solo familiar route"
    | "Stage 4 — Solo new route"
    | "Independent traveller";
  routesMastered: { from: string; to: string; mode: string; achievedDate: string }[];
  routesLearning: { from: string; to: string; mode: string; nextStep: string }[];
  travelCardsHeld: string[];
  monthlyTravelBudget: number;
  phoneAndChargerCheck: boolean;
  whatIfLostPlan: string;
  checkInProtocol: string;
  riskFactors: string[];
  protectiveFactors: string[];
  childConfidence:
    | "Anxious"
    | "Cautious"
    | "Building"
    | "Confident"
    | "Highly confident";
  staffObservation: string;
  childVoice: string;
  reviewDate: string;
  keyWorker: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

// ── seed data ───────────────────────────────────────────────────────────────
const records: TravelRecord[] = [
  {
    id: "itt-001",
    youngPerson: "yp_jordan",
    lastUpdated: d(-4),
    currentStage: "Independent traveller",
    routesMastered: [
      {
        from: "Oak House",
        to: "Highfields Academy",
        mode: "Bus (Trent Barton 24)",
        achievedDate: d(-180),
      },
      {
        from: "Oak House",
        to: "Forest Recreation Ground (football coaching gig)",
        mode: "Train + 10-min walk",
        achievedDate: d(-95),
      },
      {
        from: "Oak House",
        to: "Nottingham city centre (Old Market Square)",
        mode: "Bus + walking",
        achievedDate: d(-60),
      },
      {
        from: "Oak House",
        to: "Jamia Mosque (Friday prayers)",
        mode: "Bus + 5-min walk",
        achievedDate: d(-30),
      },
    ],
    routesLearning: [
      {
        from: "Oak House",
        to: "Away football fixtures (variable venues)",
        mode: "Train, sometimes coach",
        nextStep:
          "Plan upcoming Sheffield away day — Jordan to research route and present plan",
      },
    ],
    travelCardsHeld: [
      "Robin Hood card (16-18 zone)",
      "Trent Barton MANGO card",
      "Young Persons Railcard (16-25)",
    ],
    monthlyTravelBudget: 65,
    phoneAndChargerCheck: true,
    whatIfLostPlan:
      "Jordan has memorised Oak House landline and the duty mobile. Knows to find a member of staff at any train station, look for a uniformed bus inspector, or step into a shop and ask to use a phone if his battery dies. Has £10 emergency cash zipped into wallet at all times.",
    checkInProtocol:
      "Text on arrival at destination and when leaving. No mid-journey check required. WhatsApp location pin only required for first trip on a new route. Trusted to message if running more than 30 minutes late.",
    riskFactors: [
      "Travels at peak fan times around football fixtures (overstimulation)",
      "Some routes pass through areas where older peers are known",
    ],
    protectiveFactors: [
      "Strong route memory and orientation skills",
      "Confident asking strangers for directions",
      "Phone always charged — has own portable charger",
      "Active mosque community provides safe stops on city-centre routes",
      "Football coaching role reinforces purposeful travel",
    ],
    childConfidence: "Highly confident",
    staffObservation:
      "Jordan navigates the city with maturity and self-assurance well beyond peer norms. Has progressed faster than the staged plan anticipated. Now models independent travel for younger residents — joined Casey on her first staff-shadowed bus journey as peer mentor. Pathway plan reflects readiness to extend to inter-city travel.",
    childVoice:
      "I know the routes — I don't need someone watching me get on a bus. I'd rather you trust me and I message when I land. Helping Casey with her first bus felt good — I remember being scared of buses when I first came.",
    reviewDate: d(85),
    keyWorker: "staff_anna",
  },
  {
    id: "itt-002",
    youngPerson: "yp_alex",
    lastUpdated: d(-9),
    currentStage: "Stage 3 — Solo familiar route",
    routesMastered: [
      {
        from: "Oak House",
        to: "Derby Alternative Provision (school)",
        mode: "Bus (Arriva 38)",
        achievedDate: d(-70),
      },
      {
        from: "Oak House",
        to: "Iron Gate Boxing Gym",
        mode: "Bus + 8-min walk",
        achievedDate: d(-21),
      },
    ],
    routesLearning: [
      {
        from: "Oak House",
        to: "Derby College (Roundhouse) — taster day",
        mode: "Bus change at city centre",
        nextStep:
          "Practice run with key worker Edward this Saturday — Alex to lead navigation. Solo trial booked for following Wednesday.",
      },
    ],
    travelCardsHeld: [
      "B_Line card (Derby U19)",
      "Pre-loaded contactless debit card (£20 ceiling)",
    ],
    monthlyTravelBudget: 50,
    phoneAndChargerCheck: true,
    whatIfLostPlan:
      "Alex carries a printed laminated card in wallet with: Oak House address, duty mobile, social worker phone, and the words 'I am a looked-after child — please can you help me phone my home?'. Phone has 'find my' enabled with location sharing optional (Alex chooses when to enable). Knows to stay put if lost rather than walk further.",
    checkInProtocol:
      "Text on departure, mid-journey if a connection is involved, and on arrival. Location share enabled for the new college route during learning phase — Alex can disable once Stage 4 is achieved. Phone call (not text) if any deviation from plan.",
    riskFactors: [
      "History of going missing during periods of distress",
      "Known older peer reportedly approaches Alex in some community areas (criminal exploitation concern)",
      "Trauma response can present as dissociation — increased risk of disorientation when triggered",
    ],
    protectiveFactors: [
      "Boxing gym staff know Alex by name and have agreed safe-stop status",
      "School attendance officer holds Oak House contact",
      "Key worker Edward has practised crisis-grounding techniques travel-specific",
      "Pre-loaded card prevents cash being demanded by peers",
    ],
    childConfidence: "Building",
    staffObservation:
      "Alex's solo journeys to school and the boxing gym have been consistent over the last six weeks with no deviations. Confidence grows visibly when journeys go well. Some hesitancy remains around routes that pass the area where the older peer is sometimes seen — Alex now uses a slightly longer alternate bus route by choice. Stage 4 readiness confirmed for the controlled college taster trip.",
    childVoice:
      "I like having my card so I'm not carrying cash. I take the long way to the gym sometimes because I don't want to see [redacted] — staff said that's a smart choice not a fail. The college trip scares me a bit but I want to do it.",
    reviewDate: d(28),
    keyWorker: "staff_edward",
  },
  {
    id: "itt-003",
    youngPerson: "yp_casey",
    lastUpdated: d(-2),
    currentStage: "Stage 2 — Staff shadowing",
    routesMastered: [],
    routesLearning: [
      {
        from: "Oak House",
        to: "Derby Moorways Sports Village (swimming)",
        mode: "Bus (Arriva 7) — single change avoided",
        nextStep:
          "Two more shadowed trips with key worker Chervelle, then attempt with peer mentor Jordan walking 10 paces behind. Aim Stage 3 by end of next month.",
      },
    ],
    travelCardsHeld: ["B_Line card (Derby U16)"],
    monthlyTravelBudget: 25,
    phoneAndChargerCheck: true,
    whatIfLostPlan:
      "Casey carries a wallet card with Oak House contact details and the words 'please help me call home'. Practised twice with key worker: 'find a shop assistant or a parent with children and ask to use a phone'. Has memorised her preferred name and the home name. Knows NOT to leave the bus stop or station if she gets off at the wrong place — staff will come.",
    checkInProtocol:
      "Currently shadowed — staff travel with Casey but sit one row away to build independence. Phone always carried with location share permanently on (Casey's request — she likes knowing staff can see her). Verbal check-in at every stage of the journey during shadowing.",
    riskFactors: [
      "Travel anxiety — has had two panic episodes on previous bus attempts (six months ago)",
      "Sleep disturbance can mean low energy on early morning journeys",
      "Younger age — more vulnerable to adult attention on public transport",
    ],
    protectiveFactors: [
      "Loves swimming — high motivation for the destination drives engagement",
      "Has formed bond with key worker Chervelle who shadows journeys",
      "Peer mentor Jordan is an ally and role model",
      "Bus driver on the regular route (Arriva 7, 16:00) recognises Casey and Chervelle",
    ],
    childConfidence: "Anxious",
    staffObservation:
      "Casey has progressed from full accompaniment to staff shadowing over the last two months. Tolerated three full shadowed journeys with no panic episodes. Initial bus-stop anxiety reduced when consistent driver was identified. Confidence in the destination (swimming) is helping bridge the journey-anxiety gap. Pace of progression is appropriate — no pressure to advance until Casey indicates readiness.",
    childVoice:
      "I like that Chervelle sits a bit away from me — it feels more grown up. I get scared at the busy stop but the swimming is worth it. I want Jordan to come with me next, not staff. I don't want to do it on my own yet.",
    reviewDate: d(14),
    keyWorker: "staff_chervelle",
  },
];

// ── helpers ─────────────────────────────────────────────────────────────────
const stageOrder: Record<TravelRecord["currentStage"], number> = {
  "Stage 1 — Accompanied": 1,
  "Stage 2 — Staff shadowing": 2,
  "Stage 3 — Solo familiar route": 3,
  "Stage 4 — Solo new route": 4,
  "Independent traveller": 5,
};

const stageChip = (s: TravelRecord["currentStage"]) => {
  switch (s) {
    case "Stage 1 — Accompanied":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "Stage 2 — Staff shadowing":
      return "bg-amber-100 text-amber-900 border-amber-300";
    case "Stage 3 — Solo familiar route":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Stage 4 — Solo new route":
      return "bg-sky-100 text-sky-800 border-sky-300";
    case "Independent traveller":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
  }
};

const confidenceChip = (c: TravelRecord["childConfidence"]) => {
  switch (c) {
    case "Anxious":
      return "bg-red-100 text-red-800 border-red-300";
    case "Cautious":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "Building":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "Confident":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Highly confident":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
  }
};

// ── page ────────────────────────────────────────────────────────────────────
export default function IndependentTravelTrainingPage() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"stage" | "name" | "review">("stage");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = records.filter((r) => {
      if (stageFilter !== "all" && r.currentStage !== stageFilter) return false;
      if (!q) return true;
      const hay = [
        getYPName(r.youngPerson),
        r.currentStage,
        r.childVoice,
        r.staffObservation,
        r.routesMastered.map((x) => `${x.from} ${x.to} ${x.mode}`).join(" "),
        r.routesLearning.map((x) => `${x.from} ${x.to} ${x.mode}`).join(" "),
        r.travelCardsHeld.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
    list = [...list].sort((a, b) => {
      if (sortBy === "stage")
        return stageOrder[b.currentStage] - stageOrder[a.currentStage];
      if (sortBy === "name")
        return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
      return a.reviewDate.localeCompare(b.reviewDate);
    });
    return list;
  }, [search, stageFilter, sortBy]);

  // ── stats ─────────────────────────────────────────────────────────────────
  const stats = {
    inTraining: records.filter((r) => r.currentStage !== "Independent traveller")
      .length,
    independent: records.filter((r) => r.currentStage === "Independent traveller")
      .length,
    routesMastered: records.reduce((sum, r) => sum + r.routesMastered.length, 0),
    reviewsDue: records.filter((r) => r.reviewDate <= d(60)).length,
  };

  // ── export ────────────────────────────────────────────────────────────────
  const exportColumns: ExportColumn<TravelRecord>[] = [
    {
      header: "Young person",
      accessor: (r: TravelRecord) => getYPName(r.youngPerson),
    },
    { header: "Last updated", accessor: (r: TravelRecord) => r.lastUpdated },
    { header: "Current stage", accessor: (r: TravelRecord) => r.currentStage },
    {
      header: "Confidence",
      accessor: (r: TravelRecord) => r.childConfidence,
    },
    {
      header: "Routes mastered (count)",
      accessor: (r: TravelRecord) => r.routesMastered.length,
    },
    {
      header: "Routes mastered",
      accessor: (r: TravelRecord) =>
        r.routesMastered
          .map((x) => `${x.from} → ${x.to} (${x.mode})`)
          .join("; "),
    },
    {
      header: "Routes learning",
      accessor: (r: TravelRecord) =>
        r.routesLearning
          .map((x) => `${x.from} → ${x.to} (${x.mode}) — next: ${x.nextStep}`)
          .join("; "),
    },
    {
      header: "Travel cards",
      accessor: (r: TravelRecord) => r.travelCardsHeld.join("; "),
    },
    {
      header: "Monthly budget (£)",
      accessor: (r: TravelRecord) => r.monthlyTravelBudget,
    },
    {
      header: "Phone + charger check",
      accessor: (r: TravelRecord) => (r.phoneAndChargerCheck ? "Yes" : "No"),
    },
    {
      header: "What-if-lost plan",
      accessor: (r: TravelRecord) => r.whatIfLostPlan,
    },
    {
      header: "Check-in protocol",
      accessor: (r: TravelRecord) => r.checkInProtocol,
    },
    {
      header: "Risk factors",
      accessor: (r: TravelRecord) => r.riskFactors.join("; "),
    },
    {
      header: "Protective factors",
      accessor: (r: TravelRecord) => r.protectiveFactors.join("; "),
    },
    { header: "Child voice", accessor: (r: TravelRecord) => r.childVoice },
    {
      header: "Staff observation",
      accessor: (r: TravelRecord) => r.staffObservation,
    },
    { header: "Review date", accessor: (r: TravelRecord) => r.reviewDate },
    {
      header: "Key worker",
      accessor: (r: TravelRecord) => getStaffName(r.keyWorker),
    },
  ];

  return (
    <PageShell
      title="Independent Travel Training"
      subtitle="Stage-based plans preparing young people (especially 14–18) for confident independent travel on public transport. Tracks routes mastered, routes in learning, travel cards, monthly budget, what-if-lost protocols, safety check-ins, and the child's own voice on readiness."
      actions={
        <div className="flex items-center gap-2">
          <ExportButton
            data={filtered}
            columns={exportColumns}
            filename="independent-travel-training"
          />
          <PrintButton title="Independent Travel Training" />
        </div>
      }
    >
      {/* ── stats ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-lg border border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-sky-700">
              YPs in training
            </span>
            <Bus className="h-4 w-4 text-sky-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-sky-900">
            {stats.inTraining}
          </div>
          <div className="text-xs text-sky-700/70">
            young people on a staged training pathway
          </div>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              Independent travellers
            </span>
            <Train className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-emerald-900">
            {stats.independent}
          </div>
          <div className="text-xs text-emerald-700/70">
            achieved full independent travel
          </div>
        </div>

        <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-blue-700">
              Routes mastered
            </span>
            <MapPin className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-blue-900">
            {stats.routesMastered}
          </div>
          <div className="text-xs text-blue-700/70">total across all YPs</div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-amber-700">
              Reviews due
            </span>
            <Shield className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-amber-900">
            {stats.reviewsDue}
          </div>
          <div className="text-xs text-amber-700/70">within next 60 days</div>
        </div>
      </div>

      {/* ── filters ───────────────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by child, route, mode, or note…"
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="All stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            <SelectItem value="Stage 1 — Accompanied">
              Stage 1 — Accompanied
            </SelectItem>
            <SelectItem value="Stage 2 — Staff shadowing">
              Stage 2 — Staff shadowing
            </SelectItem>
            <SelectItem value="Stage 3 — Solo familiar route">
              Stage 3 — Solo familiar route
            </SelectItem>
            <SelectItem value="Stage 4 — Solo new route">
              Stage 4 — Solo new route
            </SelectItem>
            <SelectItem value="Independent traveller">
              Independent traveller
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(v) => setSortBy(v as "stage" | "name" | "review")}
        >
          <SelectTrigger className="w-full sm:w-44">
            <ArrowUpDown className="mr-1 h-4 w-4 text-slate-500" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stage">Sort: stage</SelectItem>
            <SelectItem value="name">Sort: child name</SelectItem>
            <SelectItem value="review">Sort: review date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── cards ─────────────────────────────────────────────────────────── */}
      <div className="mt-4 space-y-3">
        {filtered.map((r) => {
          const open = expandedId === r.id;
          return (
            <div
              key={r.id}
              className="rounded-lg border border-sky-200 bg-white shadow-sm transition hover:border-sky-300"
            >
              <button
                onClick={() => setExpandedId(open ? null : r.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-blue-100">
                    <Bus className="h-5 w-5 text-sky-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-slate-900">
                        {getYPName(r.youngPerson)}
                      </span>
                      <span className="text-xs text-slate-500">
                        · key worker {getStaffName(r.keyWorker)}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                          stageChip(r.currentStage)
                        )}
                      >
                        {r.currentStage}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                          confidenceChip(r.childConfidence)
                        )}
                      >
                        Confidence: {r.childConfidence}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
                        £{r.monthlyTravelBudget}/month
                      </span>
                      {r.phoneAndChargerCheck && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                          <Phone className="h-3 w-3" /> phone + charger
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-xs text-slate-500">
                  <span>Review {r.reviewDate}</span>
                  {open ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </button>

              {open && (
                <div className="border-t border-sky-100 bg-sky-50/30 px-4 py-4 space-y-4">
                  {/* Child voice */}
                  <div className="rounded-md border border-sky-200 bg-white p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                      Child voice
                    </div>
                    <p className="mt-1 text-sm italic text-slate-800">
                      “{r.childVoice}”
                    </p>
                  </div>

                  {/* Staff observation */}
                  <div className="rounded-md border border-slate-200 bg-white p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Staff observation
                    </div>
                    <p className="mt-1 text-sm text-slate-800">
                      {r.staffObservation}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {/* Routes mastered */}
                    <div className="rounded-md border border-emerald-200 bg-emerald-50/60 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                        Routes mastered ({r.routesMastered.length})
                      </div>
                      {r.routesMastered.length === 0 ? (
                        <p className="mt-1 text-sm text-slate-600">
                          No routes mastered yet — early in pathway.
                        </p>
                      ) : (
                        <ul className="mt-1 space-y-2 text-sm text-slate-800">
                          {r.routesMastered.map((x, i) => (
                            <li
                              key={i}
                              className="rounded border border-emerald-200/70 bg-white p-2"
                            >
                              <div className="font-medium text-slate-900">
                                {x.from} → {x.to}
                              </div>
                              <div className="text-xs text-slate-600">
                                {x.mode} · achieved {x.achievedDate}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Routes learning */}
                    <div className="rounded-md border border-amber-200 bg-amber-50/50 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                        Routes in learning ({r.routesLearning.length})
                      </div>
                      {r.routesLearning.length === 0 ? (
                        <p className="mt-1 text-sm text-slate-600">
                          No active learning routes.
                        </p>
                      ) : (
                        <ul className="mt-1 space-y-2 text-sm text-slate-800">
                          {r.routesLearning.map((x, i) => (
                            <li
                              key={i}
                              className="rounded border border-amber-200/70 bg-white p-2"
                            >
                              <div className="font-medium text-slate-900">
                                {x.from} → {x.to}
                              </div>
                              <div className="text-xs text-slate-600">
                                {x.mode}
                              </div>
                              <div className="mt-1 text-xs text-amber-900">
                                Next step: {x.nextStep}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* What-if-lost plan */}
                    <div className="rounded-md border border-blue-200 bg-blue-50/40 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-blue-800">
                        What-if-lost plan
                      </div>
                      <p className="mt-1 text-sm text-slate-800">
                        {r.whatIfLostPlan}
                      </p>
                    </div>

                    {/* Check-in protocol */}
                    <div className="rounded-md border border-sky-200 bg-white p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                        Check-in protocol
                      </div>
                      <p className="mt-1 text-sm text-slate-800">
                        {r.checkInProtocol}
                      </p>
                    </div>

                    {/* Risk factors */}
                    <div className="rounded-md border border-red-200 bg-red-50/60 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-red-800">
                        Risk factors
                      </div>
                      {r.riskFactors.length === 0 ? (
                        <p className="mt-1 text-sm text-slate-600">
                          None recorded.
                        </p>
                      ) : (
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-red-900">
                          {r.riskFactors.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Protective factors */}
                    <div className="rounded-md border border-emerald-200 bg-emerald-50/60 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                        Protective factors
                      </div>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-emerald-900">
                        {r.protectiveFactors.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Travel cards */}
                  <div className="rounded-md border border-blue-200 bg-white p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-blue-800">
                      Travel cards held
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {r.travelCardsHeld.map((c, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-800"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer meta */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>Last updated {r.lastUpdated}</span>
                    <span>·</span>
                    <span>Next review {r.reviewDate}</span>
                    <span>·</span>
                    <span>Key worker: {getStaffName(r.keyWorker)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No travel training records match the current filters.
          </div>
        )}
      </div>

      {/* ── regulatory footer ─────────────────────────────────────────────── */}
      <div className="mt-6 rounded-lg border border-sky-200 bg-sky-50/40 p-4 text-xs text-sky-900/80">
        <div className="font-semibold text-sky-900">Regulatory framework</div>
        <p className="mt-1">
          This record supports the Children&apos;s Homes (England) Regulations 2015
          Quality Standard 6 (enjoyment and achievement — supporting young people to
          access community, leisure and education through real-world skills) and
          Quality Standard 7 (positive relationships — staged, attuned scaffolding
          from a trusted key worker). Travel training forms part of the young
          person&apos;s pathway plan under the Care Leavers (England) Regulations 2010
          and contributes to readiness for adulthood. Routes are subject to lone-working
          and individual risk-assessment principles, balanced against the child&apos;s
          right to community participation and rest/leisure under UNCRC Article 31.
          The child&apos;s voice and pace of readiness are weighted alongside staff
          observation in line with UNCRC Article 12.
        </p>
      </div>
    </PageShell>
  );
}
