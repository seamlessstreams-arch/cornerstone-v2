"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  CheckCircle,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WindowCheck {
  id: string;
  inspectionDate: string;
  windowLocation: string;
  windowType: "Sash" | "Casement" | "Tilt-and-turn" | "Top-hung" | "Skylight" | "Other";
  floorLevel: "Ground" | "First" | "Second" | "Third" | "Loft / above";
  restrictorPresent: boolean;
  restrictorType:
    | "Cable + key"
    | "Permanent fixed"
    | "Pin lock"
    | "Combination"
    | "Standard window lock"
    | "None — child-accessible";
  restrictorWorking: boolean;
  keyLocation?: string;
  openingMaximumCm: number;
  openingComplianceWith100mmRule: boolean;
  signageInPlace: boolean;
  childAware: boolean;
  damageNoted: string[];
  remedialActions: string[];
  outcome: "Pass" | "Pass with advisory" | "Remedial required" | "Failed — restrict immediately";
  inspectedBy: string;
  flagsConcerns: string[];
  nextDueDate: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const records: WindowCheck[] = [
  {
    id: "win_001",
    inspectionDate: d(-12),
    windowLocation: "Casey's bedroom — front elevation",
    windowType: "Casement",
    floorLevel: "First",
    restrictorPresent: true,
    restrictorType: "Cable + key",
    restrictorWorking: true,
    keyLocation: "Office safe — coded envelope 'WIN-Casey' (manager + deputy access only)",
    openingMaximumCm: 9.5,
    openingComplianceWith100mmRule: true,
    signageInPlace: true,
    childAware: true,
    damageNoted: [],
    remedialActions: [],
    outcome: "Pass",
    inspectedBy: "staff_darren",
    flagsConcerns: [],
    nextDueDate: d(78),
  },
  {
    id: "win_002",
    inspectionDate: d(-12),
    windowLocation: "Alex's bedroom — rear elevation",
    windowType: "Casement",
    floorLevel: "First",
    restrictorPresent: true,
    restrictorType: "Cable + key",
    restrictorWorking: true,
    keyLocation: "Office safe — coded envelope 'WIN-Alex'",
    openingMaximumCm: 10.0,
    openingComplianceWith100mmRule: true,
    signageInPlace: true,
    childAware: true,
    damageNoted: [],
    remedialActions: [],
    outcome: "Pass",
    inspectedBy: "staff_darren",
    flagsConcerns: [],
    nextDueDate: d(78),
  },
  {
    id: "win_003",
    inspectionDate: d(-12),
    windowLocation: "Jordan's bedroom — side elevation",
    windowType: "Casement",
    floorLevel: "First",
    restrictorPresent: true,
    restrictorType: "Cable + key",
    restrictorWorking: true,
    keyLocation: "Office safe — coded envelope 'WIN-Jordan'",
    openingMaximumCm: 9.8,
    openingComplianceWith100mmRule: true,
    signageInPlace: true,
    childAware: true,
    damageNoted: ["Minor scuff on cable sleeve — cosmetic only, no functional issue"],
    remedialActions: [],
    outcome: "Pass",
    inspectedBy: "staff_darren",
    flagsConcerns: [],
    nextDueDate: d(78),
  },
  {
    id: "win_004",
    inspectionDate: d(-12),
    windowLocation: "Family bathroom — rear elevation",
    windowType: "Top-hung",
    floorLevel: "First",
    restrictorPresent: true,
    restrictorType: "Permanent fixed",
    restrictorWorking: true,
    keyLocation: "N/A — fixed restrictor (no key)",
    openingMaximumCm: 9.0,
    openingComplianceWith100mmRule: true,
    signageInPlace: true,
    childAware: true,
    damageNoted: [],
    remedialActions: [],
    outcome: "Pass",
    inspectedBy: "staff_anna",
    flagsConcerns: [],
    nextDueDate: d(78),
  },
  {
    id: "win_005",
    inspectionDate: d(-12),
    windowLocation: "Staff sleep-in room — front elevation",
    windowType: "Casement",
    floorLevel: "First",
    restrictorPresent: true,
    restrictorType: "Standard window lock",
    restrictorWorking: true,
    keyLocation: "Office safe — coded envelope 'WIN-SleepIn'",
    openingMaximumCm: 9.5,
    openingComplianceWith100mmRule: true,
    signageInPlace: true,
    childAware: true,
    damageNoted: [],
    remedialActions: [],
    outcome: "Pass",
    inspectedBy: "staff_anna",
    flagsConcerns: [],
    nextDueDate: d(78),
  },
  {
    id: "win_006",
    inspectionDate: d(-12),
    windowLocation: "Upstairs landing — front elevation",
    windowType: "Tilt-and-turn",
    floorLevel: "First",
    restrictorPresent: true,
    restrictorType: "Cable + key",
    restrictorWorking: false,
    keyLocation: "Office safe — coded envelope 'WIN-Landing' (key withdrawn until repair)",
    openingMaximumCm: 0,
    openingComplianceWith100mmRule: true,
    signageInPlace: true,
    childAware: true,
    damageNoted: [
      "Restrictor cable sheared at anchor point — failed open under hand pressure during inspection",
      "Suspected metal fatigue at swage — original 2018 fitment, end-of-life",
    ],
    remedialActions: [
      "Window taped shut with tamper-evident seal and risk-assessed in interim (immediate)",
      "Children verbally informed not to use this window; signage upgraded to red 'Out of use' notice",
      "Emergency call-out logged with Hodson Locksmiths — repair booked within 24h",
      "Replacement cable + new anchor specified; whole-house cable batch order placed (preventive)",
      "Interim risk assessment filed; manager + RI notified same-day",
    ],
    outcome: "Failed — restrict immediately",
    inspectedBy: "staff_darren",
    flagsConcerns: [
      "Original 2018 cable batch — schedule preventive replacement of all cable restrictors at next quarter regardless of test outcome",
    ],
    nextDueDate: d(1),
  },
  {
    id: "win_007",
    inspectionDate: d(-12),
    windowLocation: "Loft / linen room — rooflight",
    windowType: "Skylight",
    floorLevel: "Loft / above",
    restrictorPresent: true,
    restrictorType: "Pin lock",
    restrictorWorking: true,
    keyLocation: "Office safe — coded envelope 'WIN-Loft'",
    openingMaximumCm: 9.5,
    openingComplianceWith100mmRule: true,
    signageInPlace: true,
    childAware: true,
    damageNoted: ["Pin lock mechanism stiff to operate — turning resistance noted"],
    remedialActions: [
      "Lubricate pin mechanism with PTFE-based lock spray (non-greasy, child-safe) at next maintenance window",
      "Re-test in 14 days; escalate if still stiff",
    ],
    outcome: "Pass with advisory",
    inspectedBy: "staff_darren",
    flagsConcerns: [],
    nextDueDate: d(78),
  },
  {
    id: "win_008",
    inspectionDate: d(-12),
    windowLocation: "Upstairs landing — rear elevation (small)",
    windowType: "Top-hung",
    floorLevel: "First",
    restrictorPresent: true,
    restrictorType: "Permanent fixed",
    restrictorWorking: true,
    keyLocation: "N/A — fixed restrictor (no key)",
    openingMaximumCm: 8.5,
    openingComplianceWith100mmRule: true,
    signageInPlace: true,
    childAware: true,
    damageNoted: [],
    remedialActions: [],
    outcome: "Pass",
    inspectedBy: "staff_anna",
    flagsConcerns: [],
    nextDueDate: d(78),
  },
  {
    id: "win_009",
    inspectionDate: d(-12),
    windowLocation: "Office (first floor, staff-only)",
    windowType: "Casement",
    floorLevel: "First",
    restrictorPresent: true,
    restrictorType: "Cable + key",
    restrictorWorking: true,
    keyLocation: "Office safe — coded envelope 'WIN-Office'",
    openingMaximumCm: 9.5,
    openingComplianceWith100mmRule: true,
    signageInPlace: true,
    childAware: true,
    damageNoted: [],
    remedialActions: [],
    outcome: "Pass",
    inspectedBy: "staff_darren",
    flagsConcerns: [],
    nextDueDate: d(78),
  },
];

const exportCols: ExportColumn<WindowCheck>[] = [
  { header: "Date", accessor: (r: WindowCheck) => r.inspectionDate },
  { header: "Location", accessor: (r: WindowCheck) => r.windowLocation },
  { header: "Window Type", accessor: (r: WindowCheck) => r.windowType },
  { header: "Floor", accessor: (r: WindowCheck) => r.floorLevel },
  { header: "Restrictor Present", accessor: (r: WindowCheck) => (r.restrictorPresent ? "Yes" : "No") },
  { header: "Restrictor Type", accessor: (r: WindowCheck) => r.restrictorType },
  { header: "Restrictor Working", accessor: (r: WindowCheck) => (r.restrictorWorking ? "Yes" : "No") },
  { header: "Key Location", accessor: (r: WindowCheck) => r.keyLocation ?? "—" },
  { header: "Opening Max (cm)", accessor: (r: WindowCheck) => r.openingMaximumCm.toFixed(1) },
  {
    header: "100mm Rule Compliance",
    accessor: (r: WindowCheck) => (r.openingComplianceWith100mmRule ? "Yes" : "No"),
  },
  { header: "Signage In Place", accessor: (r: WindowCheck) => (r.signageInPlace ? "Yes" : "No") },
  { header: "Child Aware", accessor: (r: WindowCheck) => (r.childAware ? "Yes" : "No") },
  { header: "Damage Noted", accessor: (r: WindowCheck) => r.damageNoted.join("; ") },
  { header: "Remedial Actions", accessor: (r: WindowCheck) => r.remedialActions.join("; ") },
  { header: "Outcome", accessor: (r: WindowCheck) => r.outcome },
  { header: "Inspected By", accessor: (r: WindowCheck) => getStaffName(r.inspectedBy) },
  { header: "Flags / Concerns", accessor: (r: WindowCheck) => r.flagsConcerns.join("; ") },
  { header: "Next Due", accessor: (r: WindowCheck) => r.nextDueDate },
];

const outcomeColour: Record<WindowCheck["outcome"], string> = {
  Pass: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Pass with advisory": "bg-amber-100 text-amber-800 border-amber-200",
  "Remedial required": "bg-orange-100 text-orange-900 border-orange-200",
  "Failed — restrict immediately": "bg-red-100 text-red-900 border-red-300",
};

const restrictorColour: Record<WindowCheck["restrictorType"], string> = {
  "Cable + key": "bg-sky-100 text-sky-800 border-sky-200",
  "Permanent fixed": "bg-teal-100 text-teal-800 border-teal-200",
  "Pin lock": "bg-indigo-100 text-indigo-800 border-indigo-200",
  Combination: "bg-violet-100 text-violet-800 border-violet-200",
  "Standard window lock": "bg-slate-100 text-slate-800 border-slate-200",
  "None — child-accessible": "bg-red-100 text-red-900 border-red-300",
};

export default function BuildingWindowRestrictorChecksPage() {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "location" | "outcome" | "nextdue">("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const locations = useMemo(() => Array.from(new Set(records.map((r) => r.windowLocation))).sort(), []);

  const filtered = useMemo(() => {
    let r = records.filter((rec) => {
      const matchesSearch =
        !search ||
        rec.windowLocation.toLowerCase().includes(search.toLowerCase()) ||
        rec.windowType.toLowerCase().includes(search.toLowerCase()) ||
        rec.restrictorType.toLowerCase().includes(search.toLowerCase());
      const matchesLocation = locationFilter === "all" || rec.windowLocation === locationFilter;
      return matchesSearch && matchesLocation;
    });
    r = [...r].sort((a, b) => {
      if (sortBy === "location") return a.windowLocation.localeCompare(b.windowLocation);
      if (sortBy === "outcome") return a.outcome.localeCompare(b.outcome);
      if (sortBy === "nextdue") return a.nextDueDate.localeCompare(b.nextDueDate);
      return b.inspectionDate.localeCompare(a.inspectionDate);
    });
    return r;
  }, [search, locationFilter, sortBy]);

  const stats = useMemo(() => {
    const quarterStart = d(-90);
    const checkedThisQuarter = records.filter((r) => r.inspectionDate >= quarterStart).length;
    const allPass = records.filter((r) => r.outcome === "Pass").length;
    const remedialOpen = records.filter(
      (r) => r.outcome === "Remedial required" || r.outcome === "Failed — restrict immediately",
    ).length;
    const dueSoon = records.filter((r) => r.nextDueDate >= d(0) && r.nextDueDate <= d(30)).length;
    return { checkedThisQuarter, allPass, remedialOpen, dueSoon };
  }, []);

  return (
    <PageShell
      title="Building — Window Restrictor & High-Window Safety Checks"
      subtitle="Quarterly inspection of all upstairs and at-height windows. Restrictor functioning, key location, child awareness, no-tampering signage, school-age-appropriate locks. RoSPA falls-from-windows guidance and the 100mm aperture rule applied throughout. Children's Homes (England) Regulations 2015 Reg 25 (premises and grounds), Health & Safety at Work etc. Act 1974, Building Regulations Approved Document K (protection from falling)."
      actions={
        <div className="flex gap-2">
          <ExportButton data={filtered} columns={exportCols} filename="building-window-restrictor-checks" />
          <PrintButton title="Window Restrictor Checks" />
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
          <div className="flex items-center gap-2 text-sky-800 text-sm mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Windows checked (quarter)</span>
          </div>
          <div className="text-2xl font-semibold text-sky-900">{stats.checkedThisQuarter}</div>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-emerald-800 text-sm mb-1">
            <CheckCircle className="h-4 w-4" />
            <span>All-pass count</span>
          </div>
          <div className="text-2xl font-semibold text-emerald-900">{stats.allPass}</div>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-red-800 text-sm mb-1">
            <AlertTriangle className="h-4 w-4" />
            <span>Remedial open</span>
          </div>
          <div className="text-2xl font-semibold text-red-900">{stats.remedialOpen}</div>
        </div>
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
          <div className="flex items-center gap-2 text-teal-800 text-sm mb-1">
            <Calendar className="h-4 w-4" />
            <span>Next due (30d)</span>
          </div>
          <div className="text-2xl font-semibold text-teal-900">{stats.dueSoon}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search location, window type or restrictor..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full sm:w-72">
            <SelectValue placeholder="Window location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All window locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-full sm:w-48">
            <ArrowUpDown className="h-4 w-4 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Most recent</SelectItem>
            <SelectItem value="location">Location</SelectItem>
            <SelectItem value="outcome">Outcome</SelectItem>
            <SelectItem value="nextdue">Next due</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => {
          const isOpen = expandedId === r.id;
          const failed = r.outcome === "Failed — restrict immediately";
          const dueSoon = r.nextDueDate >= d(0) && r.nextDueDate <= d(30);
          const overdue = r.nextDueDate < d(0);
          return (
            <div
              key={r.id}
              className={cn(
                "rounded-lg border bg-white overflow-hidden",
                failed ? "border-red-300 ring-1 ring-red-200" : "border-slate-200",
              )}
            >
              <button
                onClick={() => setExpandedId(isOpen ? null : r.id)}
                className={cn(
                  "w-full p-4 flex items-start justify-between gap-3 text-left",
                  failed ? "hover:bg-red-50/40" : "hover:bg-sky-50/40",
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {failed ? (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    ) : (
                      <ShieldCheck className="h-4 w-4 text-sky-600" />
                    )}
                    <span className="font-semibold text-slate-900">{r.inspectionDate}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border", outcomeColour[r.outcome])}>
                      {r.outcome}
                    </span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border", restrictorColour[r.restrictorType])}>
                      {r.restrictorType}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full border",
                        r.openingComplianceWith100mmRule
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : "bg-red-100 text-red-900 border-red-300",
                      )}
                    >
                      Opening {r.openingMaximumCm.toFixed(1)} cm
                    </span>
                    {r.childAware ? (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-teal-100 text-teal-800 border-teal-200">
                        Child aware
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-amber-100 text-amber-800 border-amber-200">
                        Child not yet briefed
                      </span>
                    )}
                    {overdue ? (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-red-100 text-red-800 border-red-200">
                        Re-check overdue · {r.nextDueDate}
                      </span>
                    ) : dueSoon ? (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-amber-100 text-amber-800 border-amber-200">
                        Re-check {r.nextDueDate}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-sm text-slate-600">
                    {r.windowLocation} · {r.windowType} · {r.floorLevel} floor
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>
              {isOpen ? (
                <div
                  className={cn(
                    "px-4 pb-4 border-t",
                    failed ? "border-red-100 bg-red-50/30" : "border-slate-100 bg-sky-50/20",
                  )}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Inspection details</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-slate-700">
                        <div>
                          <span className="text-slate-500">Location:</span> {r.windowLocation}
                        </div>
                        <div>
                          <span className="text-slate-500">Window type:</span> {r.windowType}
                        </div>
                        <div>
                          <span className="text-slate-500">Floor level:</span> {r.floorLevel}
                        </div>
                        <div>
                          <span className="text-slate-500">Inspected:</span> {r.inspectionDate}
                        </div>
                        <div>
                          <span className="text-slate-500">Inspected by:</span> {getStaffName(r.inspectedBy)}
                        </div>
                        <div>
                          <span className="text-slate-500">Outcome:</span> {r.outcome}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border border-sky-200 bg-sky-50 p-3">
                      <div className="text-xs font-semibold text-sky-800 uppercase mb-2">Restrictor</div>
                      <div className="text-sm text-sky-900 space-y-1">
                        <div>
                          <span className="text-sky-700">Present:</span> {r.restrictorPresent ? "Yes" : "No"}
                        </div>
                        <div>
                          <span className="text-sky-700">Type:</span> {r.restrictorType}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sky-700">Working:</span>
                          {r.restrictorWorking ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700">
                              <CheckCircle className="h-3.5 w-3.5" /> Yes — tested
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-700">
                              <AlertTriangle className="h-3.5 w-3.5" /> No — failed under test
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border border-indigo-200 bg-indigo-50 p-3">
                      <div className="text-xs font-semibold text-indigo-800 uppercase mb-2">Key location</div>
                      <div className="text-sm text-indigo-900">{r.keyLocation ?? "—"}</div>
                      <div className="text-xs text-indigo-700 mt-2">
                        Keys held only by manager and deputy. Never on the window, frame or accessible to children.
                      </div>
                    </div>

                    <div
                      className={cn(
                        "rounded-md border p-3 lg:col-span-2",
                        r.openingComplianceWith100mmRule
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-red-300 bg-red-50",
                      )}
                    >
                      <div
                        className={cn(
                          "text-xs font-semibold uppercase mb-2",
                          r.openingComplianceWith100mmRule ? "text-emerald-800" : "text-red-800",
                        )}
                      >
                        Opening aperture vs 100mm rule
                      </div>
                      <div
                        className={cn(
                          "text-sm",
                          r.openingComplianceWith100mmRule ? "text-emerald-900" : "text-red-900",
                        )}
                      >
                        Maximum opening measured: <span className="font-semibold">{r.openingMaximumCm.toFixed(1)} cm</span>{" "}
                        ({r.openingMaximumCm <= 10 ? "within" : "exceeds"} the 100mm / 10cm industry standard for
                        children's settings — RoSPA falls-from-windows guidance).{" "}
                        {r.openingComplianceWith100mmRule ? "Compliant." : "NON-COMPLIANT — restrict immediately."}
                      </div>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Signage in place</div>
                      <div className="text-sm text-slate-700">
                        {r.signageInPlace ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700">
                            <CheckCircle className="h-3.5 w-3.5" /> Yes — &lsquo;Do not tamper&rsquo; notice present
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700">
                            <AlertTriangle className="h-3.5 w-3.5" /> No — to be added
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Child awareness</div>
                      <div className="text-sm text-slate-700">
                        {r.childAware ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700">
                            <CheckCircle className="h-3.5 w-3.5" /> Briefed age-appropriately — knows not to tamper
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700">
                            <AlertTriangle className="h-3.5 w-3.5" /> Brief outstanding
                          </span>
                        )}
                      </div>
                    </div>

                    {r.damageNoted.length ? (
                      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 lg:col-span-2">
                        <div className="text-xs font-semibold text-amber-800 uppercase mb-2">Damage noted</div>
                        <ul className="text-sm text-amber-900 space-y-1">
                          {r.damageNoted.map((dmg, i) => (
                            <li key={i} className="flex gap-2">
                              <span>·</span>
                              <span>{dmg}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {r.remedialActions.length ? (
                      <div
                        className={cn(
                          "rounded-md border p-3 lg:col-span-2",
                          failed ? "border-red-300 bg-red-50" : "border-orange-200 bg-orange-50",
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className={cn("h-4 w-4", failed ? "text-red-700" : "text-orange-700")} />
                          <div
                            className={cn(
                              "text-xs font-semibold uppercase",
                              failed ? "text-red-800" : "text-orange-800",
                            )}
                          >
                            Remedial actions
                          </div>
                        </div>
                        <ul className={cn("text-sm space-y-1", failed ? "text-red-900" : "text-orange-900")}>
                          {r.remedialActions.map((a, i) => (
                            <li key={i} className="flex gap-2">
                              <span>·</span>
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {r.flagsConcerns.length ? (
                      <div className="rounded-md border border-red-200 bg-red-50 p-3 lg:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-red-700" />
                          <div className="text-xs font-semibold text-red-800 uppercase">Flags / concerns</div>
                        </div>
                        <ul className="text-sm text-red-900 space-y-1">
                          {r.flagsConcerns.map((f, i) => (
                            <li key={i} className="flex gap-2">
                              <span>!</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Next due</div>
                      <div className="text-sm text-slate-700">
                        Re-check by <span className="font-medium">{r.nextDueDate}</span>{" "}
                        {failed
                          ? "(emergency re-test post-repair)"
                          : "(quarterly cycle — RoSPA guidance for child-occupied premises)"}
                      </div>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2 text-xs text-slate-500">
                      Inspected by {getStaffName(r.inspectedBy)}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
        <div className="font-semibold mb-1">Regulatory framework</div>
        <p>
          Children&rsquo;s Homes (England) Regulations 2015 Reg 25 (premises and grounds — fit for purpose, safe and
          maintained). RoSPA falls-from-windows guidance and the 100mm / 10cm aperture rule (industry standard for
          children&rsquo;s settings — windows above ground floor restricted so a child&rsquo;s torso cannot pass).
          Health &amp; Safety at Work etc. Act 1974. Building Regulations Approved Document K (protection from falling).
          Restrictor keys are held only by manager and deputy in the office safe, never on the window or accessible to
          children. Quarterly inspection of every upstairs and at-height window is recorded; any failure restricts the
          window immediately, triggers risk assessment, and is repaired within 24 hours. Records retained 7+ years and
          available to Ofsted on request.
        </p>
      </div>
    </PageShell>
  );
}
