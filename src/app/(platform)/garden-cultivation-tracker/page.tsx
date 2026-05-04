"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  Sprout,
  Leaf,
  Sun,
  Calendar,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Users,
  Clock,
  Heart,
  Wrench,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlotRecord {
  id: string;
  plotName: string;
  location: "Back garden" | "Side bed" | "Vegetable patch" | "Greenhouse" | "Allotment plot" | "Pots/containers";
  size?: string;
  leadChild?: string;
  contributingChildren: string[];
  leadStaff: string;
  currentPlanting: { crop: string; planted: string; expectedHarvest: string; status: "Growing" | "Ready" | "Harvested" | "Failed" }[];
  seasonalPlan: string[];
  toolsAccessible: string[];
  childChosenCrops: string[];
  harvestSoFar: string[];
  hoursThisMonth: number;
  sensoryBenefits: string[];
  skillsLearned: string[];
  challengesIssues: string[];
  childVoice: string;
  staffObservation: string;
  nextStep: string;
  reviewDate: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: PlotRecord[] = [
  {
    id: "plot-001",
    plotName: "Caribbean Heritage Vegetable Patch",
    location: "Vegetable patch",
    size: "Approx. 3m x 4m raised bed",
    leadChild: "yp_jordan",
    contributingChildren: ["yp_jordan", "yp_casey"],
    leadStaff: "staff_chervelle",
    currentPlanting: [
      { crop: "Callaloo (amaranth)", planted: "2026-04-08", expectedHarvest: "2026-06-15", status: "Growing" },
      { crop: "Scotch bonnet peppers", planted: "2026-03-22", expectedHarvest: "2026-08-01", status: "Growing" },
      { crop: "Sweet potato slips", planted: "2026-04-20", expectedHarvest: "2026-09-30", status: "Growing" },
      { crop: "Thyme (West Indian)", planted: "2026-02-10", expectedHarvest: "2026-05-01", status: "Ready" },
    ],
    seasonalPlan: [
      "Spring: started callaloo and pepper seeds indoors with Chervelle",
      "Summer: regular watering rota; Jordan owns the watering can",
      "Late summer: harvest scotch bonnets and dry some for cooking",
      "Autumn: lift sweet potatoes; cook a Caribbean meal from the patch with Jordan choosing the menu",
    ],
    toolsAccessible: ["Hand trowel", "Child-size fork", "Watering can", "Seed trays", "Plant labels"],
    childChosenCrops: [
      "Callaloo — Jordan asked for it after a conversation about Auntie's cooking",
      "Scotch bonnets — Jordan: 'proper food, not bland'",
      "Sweet potato — chosen for the trailing vines and cooking link",
    ],
    harvestSoFar: ["First cutting of thyme — used in Sunday rice and peas", "Salad leaves x2 cuttings"],
    hoursThisMonth: 14,
    sensoryBenefits: [
      "Aromatic crushing of thyme leaves — strong olfactory link to family cooking",
      "Warm peppery scent of scotch bonnet plants",
      "Tactile soil work calms Jordan after school",
    ],
    skillsLearned: [
      "Seed-to-plate cycle understood",
      "Patience with germination (initial frustration — now resolved)",
      "Identifying weeds vs seedlings",
      "Knife safety for harvesting (with Chervelle)",
    ],
    challengesIssues: [
      "Slugs took early callaloo seedlings — replanted with copper tape barrier",
      "Jordan initially impatient when nothing visible for 10 days",
    ],
    childVoice: "This patch is mine and Auntie's recipes. When I cook callaloo I grew, that's something nobody can take.",
    staffObservation: "Heritage food growing is one of the most powerful identity interventions Jordan has engaged with. Chervelle's leadership here is irreplaceable — she shares the cultural reference points authentically.",
    nextStep: "Plan a harvest meal in late August. Jordan to invite cousin Devon and cook together. Document recipe in life-story book.",
    reviewDate: d(-5),
  },
  {
    id: "plot-002",
    plotName: "Casey's Sensory Flower Bed",
    location: "Back garden",
    size: "Approx. 2m x 2m corner bed",
    leadChild: "yp_casey",
    contributingChildren: ["yp_casey"],
    leadStaff: "staff_anna",
    currentPlanting: [
      { crop: "Lavender (Hidcote)", planted: "2025-09-10", expectedHarvest: "2026-07-01", status: "Growing" },
      { crop: "Mint (apple + spearmint)", planted: "2025-04-15", expectedHarvest: "2026-05-15", status: "Ready" },
      { crop: "Sunflowers (giant + dwarf mix)", planted: "2026-04-12", expectedHarvest: "2026-08-20", status: "Growing" },
      { crop: "Lamb's ear (Stachys)", planted: "2025-05-20", expectedHarvest: "2026-06-01", status: "Growing" },
      { crop: "Sweet pea", planted: "2026-03-30", expectedHarvest: "2026-07-10", status: "Growing" },
    ],
    seasonalPlan: [
      "Spring: Casey chose seeds at the garden centre — strong tactile preference for fuzzy and soft leaves",
      "Summer: daily morning visit before school — sensory regulation routine",
      "July: lavender harvest for drying and small lavender bags (Casey making one for Anna)",
      "Autumn: save sunflower seeds for next year's planting; reflect on what worked",
    ],
    toolsAccessible: ["Padded kneeler", "Child-size trowel", "Snips for cutting", "Watering can", "Sensory-safe gloves"],
    childChosenCrops: [
      "Lavender — for the smell and bees",
      "Lamb's ear — Casey loves the soft fuzzy leaves",
      "Sunflowers — chose by size at the garden centre, picked giants and dwarves together",
      "Mint — to crush and smell",
    ],
    harvestSoFar: ["First mint cuttings — used in cold drinks", "Sunflower seedlings transplanted by Casey"],
    hoursThisMonth: 18,
    sensoryBenefits: [
      "Lavender — calming aromatic, used pre-bedtime",
      "Lamb's ear — tactile soothing, Casey strokes leaves when dysregulated",
      "Bees on lavender — Casey watches and counts (special interest)",
      "Mint crushing — strong olfactory grounding tool",
      "Sunflower height — visible growth measurable week-by-week (sense of progress)",
    ],
    skillsLearned: [
      "Watering judgement (when soil is dry)",
      "Plant recognition by leaf",
      "Pricking out and transplanting seedlings",
      "Naming pollinators (bees, hoverflies)",
    ],
    challengesIssues: [
      "Aphids on sweet peas — Casey distressed, learned to spray with soap solution rather than discard plant",
      "Slug damage to early sunflowers — copper rings added",
    ],
    childVoice: "It's quiet here. The bees don't shout. The plants don't ask anything from me. I just look and they grow.",
    staffObservation: "The bed functions as a regulation space for Casey. Sensory garden principles work powerfully — chose plants by touch and smell, not appearance. Anna structures visits as a routine without demand. Trauma-informed gardening at its best.",
    nextStep: "Build a small willow den at the bed edge for further enclosure/safety feeling. Lavender harvest event with Casey leading.",
    reviewDate: d(-12),
  },
  {
    id: "plot-003",
    plotName: "Greenhouse — Tomatoes & Easy Wins",
    location: "Greenhouse",
    size: "6ft x 4ft polycarbonate greenhouse",
    leadChild: undefined,
    contributingChildren: ["yp_alex", "yp_jordan", "yp_casey"],
    leadStaff: "staff_edward",
    currentPlanting: [
      { crop: "Cherry tomatoes (Sungold)", planted: "2026-03-15", expectedHarvest: "2026-07-01", status: "Growing" },
      { crop: "Beefsteak tomatoes", planted: "2026-03-15", expectedHarvest: "2026-08-01", status: "Growing" },
      { crop: "Basil", planted: "2026-04-01", expectedHarvest: "2026-06-01", status: "Growing" },
      { crop: "Cucumber (mini)", planted: "2026-04-05", expectedHarvest: "2026-07-15", status: "Growing" },
      { crop: "Pea shoots (microgreens)", planted: "2026-04-22", expectedHarvest: "2026-05-10", status: "Ready" },
    ],
    seasonalPlan: [
      "Spring: communal sowing afternoon — all three children together with cake",
      "Summer: tomato side-shooting and feeding (weekly rota)",
      "Mid-summer: first ripe Sungold celebrated — sharing with whoever picked first",
      "Late summer: tomato sauce-making session for autumn freezer",
    ],
    toolsAccessible: ["Watering can", "Tomato feed", "Plant ties", "Snips", "Tray of pots and labels"],
    childChosenCrops: [
      "Sungold — picked by Casey for the sweetness reputation",
      "Cucumbers — Alex's choice for size satisfaction",
      "Basil — Jordan for cooking (pasta sauces)",
    ],
    harvestSoFar: ["Three cuttings of pea shoots used in salads", "Microgreen tray sold at home for £1 to Mark"],
    hoursThisMonth: 22,
    sensoryBenefits: [
      "Warm humid scent on entering — distinctive sensory marker",
      "Tomato leaf smell — universally engaging",
      "Visual progress — daily growth visible to all three",
      "Shared activity without forced eye contact (low-demand co-presence)",
    ],
    skillsLearned: [
      "Tomato side-shooting technique",
      "Watering at the base, not the leaves",
      "Pollination — gentle shake of trusses",
      "Reading plant labels and timing",
    ],
    challengesIssues: [
      "Hot day in late April — almost lost basil to scorch; ventilation routine now established",
      "Disagreement over watering rota — resolved with whiteboard schedule",
    ],
    childVoice: "Greenhouse is the easy one. Stuff actually grows. We all do it.",
    staffObservation: "The greenhouse provides high-success, low-stakes shared activity. Eco-therapy principle of nurturing relationships through nurturing plants. Edward keeps the demand-level low — children attend voluntarily.",
    nextStep: "First Sungold tasting in early July — invite as a celebration moment. Plan a sauce-making afternoon for August.",
    reviewDate: d(-3),
  },
  {
    id: "plot-004",
    plotName: "Wildlife & Bug Hotel Side Bed",
    location: "Side bed",
    size: "Approx. 1.5m x 3m strip along fence",
    leadChild: "yp_alex",
    contributingChildren: ["yp_alex"],
    leadStaff: "staff_lackson",
    currentPlanting: [
      { crop: "Native wildflower mix (yellow rattle, knapweed, oxeye daisy)", planted: "2025-09-15", expectedHarvest: "2026-07-01", status: "Growing" },
      { crop: "Foxglove (biennial)", planted: "2025-05-10", expectedHarvest: "2026-06-15", status: "Growing" },
      { crop: "Comfrey (for liquid feed)", planted: "2025-04-20", expectedHarvest: "2026-05-20", status: "Ready" },
      { crop: "Buddleia (butterfly bush)", planted: "2024-10-08", expectedHarvest: "2026-08-01", status: "Growing" },
    ],
    seasonalPlan: [
      "Built bug hotel from pallets, bamboo, pinecones — Alex's research-led design",
      "Spring: monitoring solitary bee residents in tubes",
      "Summer: butterfly count weekly (Big Butterfly Count submission)",
      "Autumn: leave seedheads standing for birds; build hibernaculum from logs",
    ],
    toolsAccessible: ["Notebook + pencil for recording", "Magnifying glass", "Loppers (with Lackson)", "Field guide books"],
    childChosenCrops: [
      "Wildflower mix — Alex researched native species online",
      "Comfrey — chose specifically for the liquid feed link to greenhouse",
      "Buddleia — for butterflies",
    ],
    harvestSoFar: ["First batch of comfrey leaves steeped for liquid feed (smelly — Alex amused)"],
    hoursThisMonth: 9,
    sensoryBenefits: [
      "Solo, contemplative space — Alex prefers being unobserved here",
      "Bug observation as a regulating activity",
      "Quiet outdoor presence without conversational demand",
    ],
    skillsLearned: [
      "Native plant identification",
      "Insect taxonomy (orders and families)",
      "Citizen science recording method",
      "Comfrey liquid feed making (link to greenhouse)",
    ],
    challengesIssues: [
      "Alex prefers to work alone here — staff respect this and stay nearby but not present",
      "Bug hotel got slightly waterlogged — drainage modification needed",
    ],
    childVoice: "It's not really gardening. It's habitat. The plants are for the bugs, not for us. That's the point.",
    staffObservation: "Forest school approach in microcosm. Alex's project is research-led, ecological, and solo. We follow his interest rather than impose a shared model. Lackson supports without intruding — perfect attuned distance.",
    nextStep: "Help Alex submit Big Butterfly Count results in late July. Plan a winter logpile build for hibernating insects.",
    reviewDate: d(-18),
  },
];

const statusColour: Record<string, string> = {
  Growing: "bg-green-100 text-green-800",
  Ready: "bg-amber-100 text-amber-800",
  Harvested: "bg-blue-100 text-blue-800",
  Failed: "bg-rose-100 text-rose-800",
};

const exportCols: ExportColumn<PlotRecord>[] = [
  { header: "Plot", accessor: (r: PlotRecord) => r.plotName },
  { header: "Location", accessor: (r: PlotRecord) => r.location },
  { header: "Size", accessor: (r: PlotRecord) => r.size ?? "" },
  { header: "Lead Child", accessor: (r: PlotRecord) => (r.leadChild ? getYPName(r.leadChild) : "Shared") },
  { header: "Contributing Children", accessor: (r: PlotRecord) => r.contributingChildren.map(getYPName).join("; ") },
  { header: "Lead Staff", accessor: (r: PlotRecord) => getStaffName(r.leadStaff) },
  { header: "Current Crops", accessor: (r: PlotRecord) => r.currentPlanting.map((p) => `${p.crop} (${p.status})`).join("; ") },
  { header: "Hours This Month", accessor: (r: PlotRecord) => r.hoursThisMonth },
  { header: "Harvest So Far", accessor: (r: PlotRecord) => r.harvestSoFar.join("; ") },
  { header: "Next Step", accessor: (r: PlotRecord) => r.nextStep },
  { header: "Reviewed", accessor: (r: PlotRecord) => r.reviewDate },
];

const monthIndex = new Date().getMonth();
const seasonOf = (m: number) => {
  if (m >= 2 && m <= 4) return "Spring";
  if (m >= 5 && m <= 7) return "Summer";
  if (m >= 8 && m <= 10) return "Autumn";
  return "Winter";
};
const currentSeason = seasonOf(monthIndex);

export default function GardenCultivationTrackerPage() {
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");
  const [sortBy, setSortBy] = useState("hours");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterLocation !== "all") items = items.filter((r) => r.location === filterLocation);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((r) =>
        r.plotName.toLowerCase().includes(q) ||
        r.currentPlanting.some((p) => p.crop.toLowerCase().includes(q)) ||
        r.childChosenCrops.some((c) => c.toLowerCase().includes(q)) ||
        r.skillsLearned.some((s) => s.toLowerCase().includes(q)) ||
        (r.leadChild ? getYPName(r.leadChild).toLowerCase().includes(q) : false)
      );
    }
    items.sort((a, b) => {
      switch (sortBy) {
        case "hours":
          return b.hoursThisMonth - a.hoursThisMonth;
        case "crops":
          return b.currentPlanting.length - a.currentPlanting.length;
        case "review":
          return a.reviewDate.localeCompare(b.reviewDate);
        case "name":
          return a.plotName.localeCompare(b.plotName);
        default:
          return 0;
      }
    });
    return items;
  }, [search, filterLocation, sortBy]);

  const activePlots = data.length;
  const hoursThisMonth = data.reduce((sum, r) => sum + r.hoursThisMonth, 0);
  const cropsGrowing = data.reduce(
    (sum, r) => sum + r.currentPlanting.filter((p) => p.status === "Growing" || p.status === "Ready").length,
    0
  );
  const childrenInvolved = new Set(data.flatMap((r) => r.contributingChildren)).size;

  return (
    <PageShell
      title="Garden Cultivation Tracker"
      subtitle="Therapeutic gardening with our children — plots, plants, harvest, sensory work and seasonal planning"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="garden-cultivation" />
          <PrintButton title="Garden Cultivation Tracker" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{activePlots}</p>
          <p className="text-xs text-muted-foreground">Active Plots</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-lime-700">{hoursThisMonth}</p>
          <p className="text-xs text-muted-foreground">Hours This Month</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">{cropsGrowing}</p>
          <p className="text-xs text-muted-foreground">Crops Growing / Ready</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{childrenInvolved}</p>
          <p className="text-xs text-muted-foreground">Children Involved</p>
        </div>
      </div>

      <div className="rounded-lg bg-lime-50 border border-lime-200 p-3 mb-6 flex items-start gap-2">
        <Sprout className="h-4 w-4 text-lime-700 mt-0.5 shrink-0" />
        <p className="text-sm text-lime-900">
          Gardening is therapy. Forest-school principles, eco-therapy and sensory horticulture are woven through
          each plot. Each child&apos;s relationship with the soil is theirs — we follow interest, not impose
          a shared template.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search plots, crops, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 h-9 rounded-md border bg-white text-sm w-[260px] focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
        </div>
        <Select value={filterLocation} onValueChange={setFilterLocation}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Locations" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="Back garden">Back garden</SelectItem>
            <SelectItem value="Side bed">Side bed</SelectItem>
            <SelectItem value="Vegetable patch">Vegetable patch</SelectItem>
            <SelectItem value="Greenhouse">Greenhouse</SelectItem>
            <SelectItem value="Allotment plot">Allotment plot</SelectItem>
            <SelectItem value="Pots/containers">Pots/containers</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hours">By Hours This Month</SelectItem>
              <SelectItem value="crops">By Crop Count</SelectItem>
              <SelectItem value="review">By Review Date</SelectItem>
              <SelectItem value="name">By Plot Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((p) => {
          const isExpanded = expandedId === p.id;

          return (
            <div key={p.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-lime-50/50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Sprout className="h-5 w-5 text-green-700 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{p.plotName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {p.size ? `${p.size} · ` : ""}Lead staff: {getStaffName(p.leadStaff)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3 flex-wrap justify-end">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800">
                    <Leaf className="h-3 w-3 inline mr-1" />{p.location}
                  </span>
                  {p.leadChild && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-pink-100 text-pink-800">
                      Lead: {getYPName(p.leadChild)}
                    </span>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-lime-100 text-lime-800">
                    <Clock className="h-3 w-3 inline mr-1" />{p.hoursThisMonth}h
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800">
                    <Sun className="h-3 w-3 inline mr-1" />{currentSeason}
                  </span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-lime-50/40 space-y-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Child Voice</p>
                    <p className="text-sm italic">&ldquo;{p.childVoice}&rdquo;</p>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">Staff Observation</p>
                    <p className="text-sm">{p.staffObservation}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      <Sprout className="h-3 w-3 inline mr-1" />Current Planting
                    </p>
                    <div className="space-y-2">
                      {p.currentPlanting.map((c, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 border flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-sm">{c.crop}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              <Calendar className="h-3 w-3 inline mr-1" />Planted {c.planted} · Expected harvest {c.expectedHarvest}
                            </p>
                          </div>
                          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium shrink-0", statusColour[c.status])}>
                            {c.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      <Calendar className="h-3 w-3 inline mr-1" />Seasonal Plan
                    </p>
                    <ul className="space-y-1">
                      {p.seasonalPlan.map((s, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <Sun className="h-3 w-3 text-amber-500 mt-1 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {p.childChosenCrops.length > 0 && (
                    <div className="bg-pink-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1">Child-Chosen Crops</p>
                      <ul className="space-y-1">
                        {p.childChosenCrops.map((c, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <Heart className="h-3 w-3 text-pink-500 mt-1 shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {p.harvestSoFar.length > 0 && (
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Harvest So Far</p>
                      <ul className="space-y-1">
                        {p.harvestSoFar.map((h, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <Leaf className="h-3 w-3 text-amber-600 mt-1 shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">Sensory Benefits</p>
                    <ul className="space-y-1">
                      {p.sensoryBenefits.map((s, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <span className="text-purple-500 mt-0.5">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-sky-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-sky-800 uppercase tracking-wide mb-1">Skills Learned</p>
                    <ul className="space-y-1">
                      {p.skillsLearned.map((s, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <span className="text-sky-600 mt-0.5">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {p.challengesIssues.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Challenges / Issues</p>
                      <ul className="space-y-1">
                        {p.challengesIssues.map((c, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-rose-600 mt-0.5">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <p className="text-xs font-semibold text-green-800 uppercase tracking-wide mb-1">Next Step</p>
                    <p className="text-sm">{p.nextStep}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span>
                      <Users className="h-3 w-3 inline mr-1" />
                      Contributors: {p.contributingChildren.map(getYPName).join(", ")}
                    </span>
                    <span>
                      <Wrench className="h-3 w-3 inline mr-1" />
                      Tools: {p.toolsAccessible.join(", ")}
                    </span>
                    <span>Reviewed {p.reviewDate}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Therapeutic gardening evidences Quality Standard 6 (enjoyment
          and achievement) and supports Quality Standard 7 (health and wellbeing). Practice draws on
          forest-school principles, eco-therapy evidence (nature contact and trauma recovery), and
          sensory-horticulture approaches for children with developmental trauma. UNCRC Article 31 (rest,
          play and leisure) underpins the right to unhurried, child-led outdoor time. Linked to Activities,
          Sensory Profiles, Cultural Identity and Outcomes pages.
        </p>
      </div>
    </PageShell>
  );
}
