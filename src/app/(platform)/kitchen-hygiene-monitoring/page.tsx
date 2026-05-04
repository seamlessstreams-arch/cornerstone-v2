"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Utensils,
  Thermometer,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HygieneCheckEntry {
  id: string;
  date: string;
  time: string;
  staffMember: string;
  shiftType: "Early" | "Late" | "Sleep-in" | "Wake-night";
  fridgeTemperature: number;
  fridgeWithinRange: boolean;
  freezerTemperature: number;
  freezerWithinRange: boolean;
  cookingTempsRecorded: { meal: string; tempReading: number; minRequired: number; pass: boolean }[];
  fridgeOrganisation: "Excellent" | "Good" | "Adequate" | "Needs attention";
  fridgeRotation: boolean;
  expiredItemsFound: { item: string; expiryDate: string; disposed: boolean }[];
  surfacesCleaned: boolean;
  cleaningProductsCorrect: boolean;
  handwashingObserved: boolean;
  apronsAndHairCovers: boolean;
  childrenPreparingFoodSupervision: string;
  cookingActivitySafetyBriefingDone: boolean;
  pestsObserved: boolean;
  pestActions: string;
  bins: "Empty" | "Half full" | "Full" | "Overflow";
  binEmptiedTime: string;
  dishwasherCycleNotes: string;
  cuttingBoardSegregation: boolean;
  allergenLabelling: boolean;
  defrostingPractice: string;
  hotHoldingTemps: { item: string; temp: number; pass: boolean }[];
  overallVerdict: "Pass" | "Pass with minor actions" | "Fail";
  immediateActions: string[];
  followUpActions: string[];
  notes: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: HygieneCheckEntry[] = [
  {
    id: "kh-001",
    date: d(0),
    time: "08:00",
    staffMember: "staff_anna",
    shiftType: "Early",
    fridgeTemperature: 4,
    fridgeWithinRange: true,
    freezerTemperature: -19,
    freezerWithinRange: true,
    cookingTempsRecorded: [],
    fridgeOrganisation: "Excellent",
    fridgeRotation: true,
    expiredItemsFound: [],
    surfacesCleaned: true,
    cleaningProductsCorrect: true,
    handwashingObserved: true,
    apronsAndHairCovers: false,
    childrenPreparingFoodSupervision: "Casey making own breakfast — supervised by Anna; sensory-aware",
    cookingActivitySafetyBriefingDone: false,
    pestsObserved: false,
    pestActions: "",
    bins: "Empty",
    binEmptiedTime: "07:50",
    dishwasherCycleNotes: "Dishwasher cycled overnight; loaded again 08:30",
    cuttingBoardSegregation: true,
    allergenLabelling: true,
    defrostingPractice: "Tomorrow's chicken in fridge bottom shelf",
    hotHoldingTemps: [],
    overallVerdict: "Pass",
    immediateActions: [],
    followUpActions: [],
    notes: "Routine morning check. Kitchen in good shape.",
  },
  {
    id: "kh-002",
    date: d(0),
    time: "12:30",
    staffMember: "staff_chervelle",
    shiftType: "Late",
    fridgeTemperature: 5,
    fridgeWithinRange: true,
    freezerTemperature: -18,
    freezerWithinRange: true,
    cookingTempsRecorded: [
      { meal: "Lunch — chicken stir-fry", tempReading: 78, minRequired: 75, pass: true },
    ],
    fridgeOrganisation: "Good",
    fridgeRotation: true,
    expiredItemsFound: [],
    surfacesCleaned: true,
    cleaningProductsCorrect: true,
    handwashingObserved: true,
    apronsAndHairCovers: true,
    childrenPreparingFoodSupervision: "Jordan helped chop vegetables — appropriate supervision",
    cookingActivitySafetyBriefingDone: true,
    pestsObserved: false,
    pestActions: "",
    bins: "Half full",
    binEmptiedTime: "Will empty post-lunch",
    dishwasherCycleNotes: "Cycled after lunch",
    cuttingBoardSegregation: true,
    allergenLabelling: true,
    defrostingPractice: "Standard",
    hotHoldingTemps: [
      { item: "Lunch (kept warm 5 mins service)", temp: 76, pass: true },
    ],
    overallVerdict: "Pass",
    immediateActions: [],
    followUpActions: [],
    notes: "Cooking with Jordan went well. Safety briefing covered.",
  },
  {
    id: "kh-003",
    date: d(-1),
    time: "18:00",
    staffMember: "staff_lackson",
    shiftType: "Late",
    fridgeTemperature: 6,
    fridgeWithinRange: true,
    freezerTemperature: -18,
    freezerWithinRange: true,
    cookingTempsRecorded: [
      { meal: "Dinner — beef bolognese", tempReading: 82, minRequired: 75, pass: true },
    ],
    fridgeOrganisation: "Good",
    fridgeRotation: true,
    expiredItemsFound: [
      { item: "Salad bag", expiryDate: d(-1), disposed: true },
    ],
    surfacesCleaned: true,
    cleaningProductsCorrect: true,
    handwashingObserved: true,
    apronsAndHairCovers: true,
    childrenPreparingFoodSupervision: "Alex set table; brief help with garlic bread",
    cookingActivitySafetyBriefingDone: true,
    pestsObserved: false,
    pestActions: "",
    bins: "Half full",
    binEmptiedTime: "Post-dinner",
    dishwasherCycleNotes: "Cycled after dinner",
    cuttingBoardSegregation: true,
    allergenLabelling: true,
    defrostingPractice: "Standard",
    hotHoldingTemps: [],
    overallVerdict: "Pass with minor actions",
    immediateActions: [
      "Expired salad bag disposed",
      "Reordered fresh salad",
    ],
    followUpActions: [
      "Build expiry sweep into morning check",
    ],
    notes: "Salad caught at expiry — disposed promptly. Reorder placed.",
  },
  {
    id: "kh-004",
    date: d(-2),
    time: "07:30",
    staffMember: "staff_anna",
    shiftType: "Early",
    fridgeTemperature: 4,
    fridgeWithinRange: true,
    freezerTemperature: -19,
    freezerWithinRange: true,
    cookingTempsRecorded: [],
    fridgeOrganisation: "Excellent",
    fridgeRotation: true,
    expiredItemsFound: [],
    surfacesCleaned: true,
    cleaningProductsCorrect: true,
    handwashingObserved: true,
    apronsAndHairCovers: false,
    childrenPreparingFoodSupervision: "Casey making own breakfast",
    cookingActivitySafetyBriefingDone: false,
    pestsObserved: false,
    pestActions: "",
    bins: "Empty",
    binEmptiedTime: "07:10",
    dishwasherCycleNotes: "Standard",
    cuttingBoardSegregation: true,
    allergenLabelling: true,
    defrostingPractice: "Standard",
    hotHoldingTemps: [],
    overallVerdict: "Pass",
    immediateActions: [],
    followUpActions: [],
    notes: "",
  },
  {
    id: "kh-005",
    date: d(-3),
    time: "20:00",
    staffMember: "staff_ryan",
    shiftType: "Late",
    fridgeTemperature: 7,
    fridgeWithinRange: false,
    freezerTemperature: -18,
    freezerWithinRange: true,
    cookingTempsRecorded: [
      { meal: "Dinner — fish pie", tempReading: 76, minRequired: 75, pass: true },
    ],
    fridgeOrganisation: "Adequate",
    fridgeRotation: true,
    expiredItemsFound: [],
    surfacesCleaned: true,
    cleaningProductsCorrect: true,
    handwashingObserved: true,
    apronsAndHairCovers: true,
    childrenPreparingFoodSupervision: "None during this check",
    cookingActivitySafetyBriefingDone: false,
    pestsObserved: false,
    pestActions: "",
    bins: "Full",
    binEmptiedTime: "20:30 (during check)",
    dishwasherCycleNotes: "Cycled",
    cuttingBoardSegregation: true,
    allergenLabelling: true,
    defrostingPractice: "Standard",
    hotHoldingTemps: [],
    overallVerdict: "Pass with minor actions",
    immediateActions: [
      "Fridge temp 7°C — out of range. Investigated: door slightly ajar. Closed firmly. Reading rechecked at 22:00 — back to 4°C.",
      "Checked critical items (dairy, fresh meat) — within tolerance per Food Standards Agency guidance for brief excursion",
    ],
    followUpActions: [
      "Add fridge door visual reminder (children sometimes leave door slightly open)",
      "Recheck fridge temperature in morning",
    ],
    notes: "Brief temp deviation managed. No food compromised. Action: visual reminder added. Followed up next morning — back to range.",
  },
  {
    id: "kh-006",
    date: d(-7),
    time: "14:00",
    staffMember: "staff_chervelle",
    shiftType: "Late",
    fridgeTemperature: 4,
    fridgeWithinRange: true,
    freezerTemperature: -19,
    freezerWithinRange: true,
    cookingTempsRecorded: [],
    fridgeOrganisation: "Excellent",
    fridgeRotation: true,
    expiredItemsFound: [],
    surfacesCleaned: true,
    cleaningProductsCorrect: true,
    handwashingObserved: true,
    apronsAndHairCovers: true,
    childrenPreparingFoodSupervision: "Cultural cooking session — Jordan led with Chervelle. Jollof rice. Full safety briefing.",
    cookingActivitySafetyBriefingDone: true,
    pestsObserved: false,
    pestActions: "",
    bins: "Half full",
    binEmptiedTime: "Mid-session",
    dishwasherCycleNotes: "Cycled",
    cuttingBoardSegregation: true,
    allergenLabelling: true,
    defrostingPractice: "Standard",
    hotHoldingTemps: [
      { item: "Jollof rice — hot held for 15 mins service", temp: 76, pass: true },
    ],
    overallVerdict: "Pass",
    immediateActions: [],
    followUpActions: [],
    notes: "Cultural cooking session went well. Strong meal, strong learning.",
  },
];

const verdictColour: Record<string, string> = {
  Pass: "bg-green-100 text-green-800",
  "Pass with minor actions": "bg-amber-100 text-amber-800",
  Fail: "bg-red-100 text-red-800",
};

const cleanColour: Record<string, string> = {
  Excellent: "bg-emerald-100 text-emerald-800",
  Good: "bg-blue-100 text-blue-800",
  Adequate: "bg-amber-100 text-amber-800",
  "Needs attention": "bg-red-100 text-red-800",
};

const exportCols: ExportColumn<HygieneCheckEntry>[] = [
  { header: "Date", accessor: (r: HygieneCheckEntry) => r.date },
  { header: "Time", accessor: (r: HygieneCheckEntry) => r.time },
  { header: "Staff", accessor: (r: HygieneCheckEntry) => getStaffName(r.staffMember) },
  { header: "Fridge °C", accessor: (r: HygieneCheckEntry) => `${r.fridgeTemperature}°C` },
  { header: "Freezer °C", accessor: (r: HygieneCheckEntry) => `${r.freezerTemperature}°C` },
  { header: "Verdict", accessor: (r: HygieneCheckEntry) => r.overallVerdict },
  { header: "Cleanliness", accessor: (r: HygieneCheckEntry) => r.fridgeOrganisation },
  { header: "Bins", accessor: (r: HygieneCheckEntry) => r.bins },
];

export default function KitchenHygieneMonitoringPage() {
  const [filterShift, setFilterShift] = useState("all");
  const [filterVerdict, setFilterVerdict] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterShift !== "all") items = items.filter((c) => c.shiftType === filterShift);
    if (filterVerdict !== "all") items = items.filter((c) => c.overallVerdict === filterVerdict);
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (b.date + b.time).localeCompare(a.date + a.time);
        case "verdict":
          const ord = { Fail: 0, "Pass with minor actions": 1, Pass: 2 };
          return ord[a.overallVerdict] - ord[b.overallVerdict];
        default:
          return 0;
      }
    });
    return items;
  }, [filterShift, filterVerdict, sortBy]);

  const total = data.length;
  const passed = data.filter((c) => c.overallVerdict === "Pass").length;
  const tempIssues = data.filter((c) => !c.fridgeWithinRange || !c.freezerWithinRange).length;
  const expiredFound = data.reduce((sum, c) => sum + c.expiredItemsFound.length, 0);

  return (
    <PageShell
      title="Kitchen Hygiene Monitoring"
      subtitle="Daily kitchen hygiene checks — temperatures, cleanliness, food safety, child cooking supervision"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="kitchen-hygiene-monitoring" />
          <PrintButton title="Kitchen Hygiene Monitoring" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Recent Checks</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{Math.round((passed / total) * 100)}%</p>
          <p className="text-xs text-muted-foreground">Full Pass Rate</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className={cn("text-2xl font-bold", tempIssues > 0 ? "text-amber-600" : "text-green-600")}>{tempIssues}</p>
          <p className="text-xs text-muted-foreground">Temp Deviations</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className={cn("text-2xl font-bold", expiredFound > 0 ? "text-amber-600" : "text-green-600")}>{expiredFound}</p>
          <p className="text-xs text-muted-foreground">Expired Items Caught</p>
        </div>
      </div>

      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 mb-6 flex items-start gap-2">
        <Utensils className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
        <p className="text-sm text-emerald-800">
          Kitchen hygiene is checked at every shift handover and before any food preparation. Temperatures
          recorded, cleanliness verified, child-led cooking supported safely. Aligned with Food Standards
          Agency &lsquo;Safer Food, Better Business&rsquo; framework.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterShift} onValueChange={setFilterShift}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Shifts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shifts</SelectItem>
            <SelectItem value="Early">Early</SelectItem>
            <SelectItem value="Late">Late</SelectItem>
            <SelectItem value="Sleep-in">Sleep-in</SelectItem>
            <SelectItem value="Wake-night">Wake-night</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterVerdict} onValueChange={setFilterVerdict}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Verdicts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Verdicts</SelectItem>
            <SelectItem value="Pass">Pass</SelectItem>
            <SelectItem value="Pass with minor actions">Pass with Minor Actions</SelectItem>
            <SelectItem value="Fail">Fail</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Most Recent</SelectItem>
              <SelectItem value="verdict">By Verdict</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => {
          const isExpanded = expandedId === c.id;
          const hasIssues = !c.fridgeWithinRange || !c.freezerWithinRange || c.expiredItemsFound.length > 0;

          return (
            <div key={c.id} className={cn("rounded-xl border bg-white overflow-hidden",
              hasIssues && "border-l-4 border-l-amber-500"
            )}>
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : c.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Utensils className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{c.date} {c.time} — {c.shiftType} ({getStaffName(c.staffMember)})</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Fridge {c.fridgeTemperature}°C &middot; Freezer {c.freezerTemperature}°C &middot; Bins {c.bins}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", verdictColour[c.overallVerdict])}>
                    {c.overallVerdict}
                  </span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className={cn("rounded-lg p-2 text-center text-sm", c.fridgeWithinRange ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800")}>
                      <Thermometer className="h-3 w-3 inline mr-1" />Fridge {c.fridgeTemperature}°C
                      <p className="text-xs">(2-8°C target)</p>
                    </div>
                    <div className={cn("rounded-lg p-2 text-center text-sm", c.freezerWithinRange ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800")}>
                      <Thermometer className="h-3 w-3 inline mr-1" />Freezer {c.freezerTemperature}°C
                      <p className="text-xs">(-18°C+)</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center text-sm">
                      <p className="text-xs text-muted-foreground">Cleanliness</p>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", cleanColour[c.fridgeOrganisation])}>{c.fridgeOrganisation}</span>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center text-sm">
                      <p className="text-xs text-muted-foreground">Bins</p>
                      <p className="font-medium">{c.bins}</p>
                    </div>
                  </div>

                  {c.cookingTempsRecorded.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Cooking Temperatures</p>
                      <div className="space-y-1">
                        {c.cookingTempsRecorded.map((t, i) => (
                          <div key={i} className="bg-white rounded-lg p-2 border text-sm flex items-center justify-between">
                            <span>{t.meal}</span>
                            <span className={cn("text-sm font-medium", t.pass ? "text-green-600" : "text-red-600")}>
                              {t.tempReading}°C (min {t.minRequired}°C)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {c.hotHoldingTemps.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Hot Holding</p>
                      <div className="space-y-1">
                        {c.hotHoldingTemps.map((h, i) => (
                          <div key={i} className="bg-white rounded-lg p-2 border text-sm flex items-center justify-between">
                            <span>{h.item}</span>
                            <span className={cn("text-sm font-medium", h.pass ? "text-green-600" : "text-red-600")}>
                              {h.temp}°C
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border space-y-1 text-sm">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">General Hygiene</p>
                      <p className="flex items-center gap-1">{c.surfacesCleaned ? <CheckCircle className="h-3 w-3 text-green-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />} Surfaces cleaned</p>
                      <p className="flex items-center gap-1">{c.cleaningProductsCorrect ? <CheckCircle className="h-3 w-3 text-green-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />} Correct products used</p>
                      <p className="flex items-center gap-1">{c.handwashingObserved ? <CheckCircle className="h-3 w-3 text-green-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />} Handwashing observed</p>
                      <p className="flex items-center gap-1">{c.cuttingBoardSegregation ? <CheckCircle className="h-3 w-3 text-green-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />} Board segregation</p>
                      <p className="flex items-center gap-1">{c.allergenLabelling ? <CheckCircle className="h-3 w-3 text-green-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />} Allergen labelling</p>
                      <p className="flex items-center gap-1">{c.fridgeRotation ? <CheckCircle className="h-3 w-3 text-green-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />} Stock rotation</p>
                      <p className="flex items-center gap-1">{!c.pestsObserved ? <CheckCircle className="h-3 w-3 text-green-500" /> : <AlertTriangle className="h-3 w-3 text-red-500" />} No pests</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border space-y-1 text-sm">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Children Cooking</p>
                      <p>{c.childrenPreparingFoodSupervision || "No children preparing food this check"}</p>
                      {c.cookingActivitySafetyBriefingDone && (
                        <p className="text-xs text-green-700 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Safety briefing done</p>
                      )}
                    </div>
                  </div>

                  {c.expiredItemsFound.length > 0 && (
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />Expired Items Caught &amp; Disposed
                      </p>
                      <ul className="space-y-1">
                        {c.expiredItemsFound.map((e, i) => (
                          <li key={i} className="text-sm">
                            <strong>{e.item}</strong> (expired {e.expiryDate}) — {e.disposed ? "disposed" : "pending disposal"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {c.immediateActions.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Immediate Actions</p>
                      <ul className="space-y-1">
                        {c.immediateActions.map((a, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <CheckCircle className="h-3 w-3 text-blue-500 mt-1 shrink-0" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {c.followUpActions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Follow-Up Actions</p>
                      <ul className="space-y-1">
                        {c.followUpActions.map((a, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <Clock className="h-3 w-3 text-amber-500 mt-1 shrink-0" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {c.notes && (
                    <div className="bg-slate-50 rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-sm">{c.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span><Sparkles className="h-3 w-3 inline mr-1" />Bins: {c.bins} (emptied {c.binEmptiedTime})</span>
                    <span>Dishwasher: {c.dishwasherCycleNotes}</span>
                    <span>Defrosting: {c.defrostingPractice}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Kitchen hygiene monitoring supports Food Hygiene Regulations
          (EC) No 852/2004, Food Safety Act 1990, FSA &lsquo;Safer Food, Better Business&rsquo; framework,
          and Quality Standard 7 (health and wellbeing). Linked to Food Hygiene, Menu Planning, and Health
          and Safety records.
        </p>
      </div>
    </PageShell>
  );
}
