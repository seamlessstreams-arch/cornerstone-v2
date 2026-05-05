"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  Shield,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  CheckCircle,
  Calendar,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AsbestosRecord {
  id: string;
  surveyDate: string;
  surveyType:
    | "Management Survey"
    | "Refurbishment & Demolition Survey"
    | "Re-inspection"
    | "Air monitoring"
    | "Removal record";
  surveyor: string;
  surveyorAccreditation: string;
  certificateNumber: string;
  buildingArea: string;
  acmIdentified: boolean;
  acmType?: string;
  conditionRating:
    | "No ACM identified"
    | "Good condition — sealed"
    | "Minor damage — encapsulated"
    | "Significant damage — action required"
    | "Removed";
  managementAction: string;
  removalContractor?: { name: string; hseLicenceNumber: string; date: string };
  encapsulationDetails?: string;
  reinspectionFrequency:
    | "Annual"
    | "Bi-annual"
    | "On disturbance only"
    | "Not applicable";
  nextInspectionDue?: string;
  tradespersonBriefingsRequired: boolean;
  notesForContractors?: string;
  recordedBy: string;
  flagsConcerns: string[];
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const records: AsbestosRecord[] = [
  {
    id: "asb_001",
    surveyDate: d(-540),
    surveyType: "Management Survey",
    surveyor: "Helena Brookes — Sentinel Asbestos Consultants Ltd",
    surveyorAccreditation:
      "BOHS P402 (Building Surveys & Bulk Sampling) · UKAS 17020 inspection body · UKAS 17025 lab analysis (chain of custody)",
    certificateNumber: "SAC-MS-2024-CSH-014",
    buildingArea:
      "Whole property — 1990s brick-built two-storey detached house, single-storey rear extension (2008), detached garage (2008), and pitched-roof loft / attic void above main house",
    acmIdentified: true,
    acmType:
      "Loft attic — original boarded floor finished with Artex-style decorative textured coating on underside boards. Sample SAC-014-S03 returned chrysotile (white asbestos) at 2-3% w/w. No other ACMs found in main living areas (modern build post-2000 plasterboard, no asbestos cement, no AIB, no vinyl floor tiles of concern).",
    conditionRating: "Good condition — sealed",
    managementAction:
      "Manage in situ — material is in good condition, sealed, and in a low-traffic enclosed loft void. Risk assessed as LOW (Material Assessment score 4 / Priority Assessment score 3 per HSG264). Encapsulation already provided by paint layer; no remedial work required at this time. Annual visual re-inspection by competent person to confirm condition.",
    encapsulationDetails:
      "Existing paint layer over Artex acts as encapsulation. No additional sealing applied during survey. Loft hatch labelled with asbestos warning sticker (yellow/black) on internal hatch face — visible on entry. Sticker references this register entry SAC-MS-2024-CSH-014.",
    reinspectionFrequency: "Annual",
    nextInspectionDue: d(-175),
    tradespersonBriefingsRequired: true,
    notesForContractors:
      "ANY work in the loft / attic — boiler engineer, aerial installer, electrician, IT cabling, water tank, insulation top-up — must be briefed before access. Do NOT drill, scrape, sand, screw into, or remove any of the boarded loft floor or its textured finish. Walk only on existing walkway boards laid over (not under) the original floor. If any disturbance is unavoidable, work must STOP and a Refurbishment & Demolition Survey commissioned before proceeding (HSE licensed contractor only). Briefing must be signed before access — see briefing log below.",
    recordedBy: "staff_darren",
    flagsConcerns: [
      "On any change of use of the loft (e.g. conversion to bedroom, insulation upgrade) a Refurbishment & Demolition Survey is required BEFORE works tender — flag at any future buildings planning",
    ],
  },
  {
    id: "asb_002",
    surveyDate: d(-540),
    surveyType: "Management Survey",
    surveyor: "Helena Brookes — Sentinel Asbestos Consultants Ltd",
    surveyorAccreditation:
      "BOHS P402 · UKAS 17020 · UKAS 17025",
    certificateNumber: "SAC-MS-2024-CSH-014 (main building findings)",
    buildingArea:
      "Main living areas — ground & first floor (excluding loft void)",
    acmIdentified: false,
    conditionRating: "No ACM identified",
    managementAction:
      "No management action required. 18 presumed-asbestos sample points checked across kitchen, utility, bathrooms, airing cupboard, boiler casing, stair spindles, soffits, and downpipe. All negative. House construction post-2000 — no asbestos cement, no asbestos insulating board (AIB), no textured coatings in living areas, no vinyl floor tiles of concern. Garage (2008 build) also negative.",
    reinspectionFrequency: "Not applicable",
    tradespersonBriefingsRequired: false,
    recordedBy: "staff_darren",
    flagsConcerns: [],
  },
  {
    id: "asb_003",
    surveyDate: d(-175),
    surveyType: "Re-inspection",
    surveyor: "Helena Brookes — Sentinel Asbestos Consultants Ltd",
    surveyorAccreditation: "BOHS P402 · UKAS 17020",
    certificateNumber: "SAC-RI-2025-CSH-008",
    buildingArea: "Loft attic void — boarded floor with Artex-style textured coating (re-inspection of asb_001 finding)",
    acmIdentified: true,
    acmType: "Chrysotile-containing textured coating — as previously surveyed (SAC-MS-2024-CSH-014)",
    conditionRating: "Good condition — sealed",
    managementAction:
      "Continue manage in situ — no change in condition since 2024 baseline. Visual inspection from walkway boards confirmed: no flaking, no cracking, no water damage, no signs of disturbance. Paint layer intact across all visible boards. Warning sticker on hatch confirmed legible. Photographs taken (SAC-RI-2025-CSH-008-P01 to P12, filed in Buildings folder).",
    encapsulationDetails:
      "Existing paint encapsulation remains intact — no new sealing required. Surveyor recommended retaining current management approach.",
    reinspectionFrequency: "Annual",
    nextInspectionDue: d(190),
    tradespersonBriefingsRequired: true,
    notesForContractors:
      "Position unchanged — see asb_001. Continue to brief any tradesperson entering the loft. Walkway boards remain the only safe footing.",
    recordedBy: "staff_darren",
    flagsConcerns: [],
  },
  {
    id: "asb_004",
    surveyDate: d(-62),
    surveyType: "Management Survey",
    surveyor: "Manager-led briefing — referencing existing P402 survey",
    surveyorAccreditation: "Internal record — pre-works contractor briefing (NOT a survey; references SAC-MS-2024-CSH-014)",
    certificateNumber: "CSH-BRIEFING-2026-03",
    buildingArea: "Loft attic — access required for boiler header tank inspection and overflow pipe re-route",
    acmIdentified: true,
    acmType: "Existing identified Artex-style chrysotile coating on loft floor (no new ACM)",
    conditionRating: "Good condition — sealed",
    managementAction:
      "Pre-works briefing log: WPS Heating Engineers (gas-safe ID 524817) attended for header tank work. Engineer (Tom Whittaker) shown asbestos register entry asb_001 BEFORE entering loft. Briefed verbally and in writing on: (1) existence of chrysotile coating on loft floor boards, (2) requirement to walk only on walkway boards, (3) no drilling/screwing/cutting into floor boards, (4) what to do if accidental disturbance occurred (stop work, evacuate loft, ventilate, contact manager, do not vacuum). Briefing signed by engineer at 09:14. Work completed 11:40 — no disturbance, no contact with floor boards. Engineer signed exit confirmation.",
    reinspectionFrequency: "On disturbance only",
    tradespersonBriefingsRequired: true,
    notesForContractors:
      "This briefing log is the template format. Every contractor entering loft must complete this briefing before access — pre-printed form held in Buildings folder section B-7. Manager (Darren) or deputy must witness the signature.",
    recordedBy: "staff_darren",
    flagsConcerns: [],
  },
];

const exportCols: ExportColumn<AsbestosRecord>[] = [
  { header: "Survey Date", accessor: (r: AsbestosRecord) => r.surveyDate },
  { header: "Survey Type", accessor: (r: AsbestosRecord) => r.surveyType },
  { header: "Surveyor", accessor: (r: AsbestosRecord) => r.surveyor },
  { header: "Accreditation", accessor: (r: AsbestosRecord) => r.surveyorAccreditation },
  { header: "Certificate Number", accessor: (r: AsbestosRecord) => r.certificateNumber },
  { header: "Building Area", accessor: (r: AsbestosRecord) => r.buildingArea },
  { header: "ACM Identified", accessor: (r: AsbestosRecord) => (r.acmIdentified ? "Yes" : "No") },
  { header: "ACM Type", accessor: (r: AsbestosRecord) => r.acmType ?? "—" },
  { header: "Condition Rating", accessor: (r: AsbestosRecord) => r.conditionRating },
  { header: "Management Action", accessor: (r: AsbestosRecord) => r.managementAction },
  {
    header: "Removal Contractor",
    accessor: (r: AsbestosRecord) =>
      r.removalContractor
        ? `${r.removalContractor.name} (HSE licence ${r.removalContractor.hseLicenceNumber}, ${r.removalContractor.date})`
        : "—",
  },
  { header: "Encapsulation Details", accessor: (r: AsbestosRecord) => r.encapsulationDetails ?? "—" },
  { header: "Re-inspection Frequency", accessor: (r: AsbestosRecord) => r.reinspectionFrequency },
  { header: "Next Inspection Due", accessor: (r: AsbestosRecord) => r.nextInspectionDue ?? "—" },
  {
    header: "Tradesperson Briefings Required",
    accessor: (r: AsbestosRecord) => (r.tradespersonBriefingsRequired ? "Yes" : "No"),
  },
  { header: "Notes for Contractors", accessor: (r: AsbestosRecord) => r.notesForContractors ?? "—" },
  { header: "Recorded By", accessor: (r: AsbestosRecord) => getStaffName(r.recordedBy) },
  { header: "Flags / Concerns", accessor: (r: AsbestosRecord) => r.flagsConcerns.join("; ") },
];

const surveyTypeColour: Record<AsbestosRecord["surveyType"], string> = {
  "Management Survey": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Refurbishment & Demolition Survey": "bg-rose-100 text-rose-800 border-rose-200",
  "Re-inspection": "bg-sky-100 text-sky-800 border-sky-200",
  "Air monitoring": "bg-violet-100 text-violet-800 border-violet-200",
  "Removal record": "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const conditionColour: Record<AsbestosRecord["conditionRating"], string> = {
  "No ACM identified": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Good condition — sealed": "bg-amber-100 text-amber-900 border-amber-200",
  "Minor damage — encapsulated": "bg-orange-100 text-orange-900 border-orange-200",
  "Significant damage — action required": "bg-red-100 text-red-900 border-red-200",
  Removed: "bg-slate-100 text-slate-800 border-slate-200",
};

export default function BuildingAsbestosRegisterPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "type" | "condition" | "nextInspection">("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = records.filter((rec) => {
      const matchesSearch =
        !search ||
        rec.buildingArea.toLowerCase().includes(search.toLowerCase()) ||
        rec.surveyor.toLowerCase().includes(search.toLowerCase()) ||
        (rec.acmType ?? "").toLowerCase().includes(search.toLowerCase()) ||
        rec.certificateNumber.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || rec.surveyType === typeFilter;
      return matchesSearch && matchesType;
    });
    r = [...r].sort((a, b) => {
      if (sortBy === "type") return a.surveyType.localeCompare(b.surveyType);
      if (sortBy === "condition") return a.conditionRating.localeCompare(b.conditionRating);
      if (sortBy === "nextInspection") {
        const aN = a.nextInspectionDue ?? "9999-99-99";
        const bN = b.nextInspectionDue ?? "9999-99-99";
        return aN.localeCompare(bN);
      }
      return b.surveyDate.localeCompare(a.surveyDate);
    });
    return r;
  }, [search, typeFilter, sortBy]);

  const stats = useMemo(() => {
    const surveysCompleted = records.filter(
      (r) =>
        r.surveyType === "Management Survey" ||
        r.surveyType === "Refurbishment & Demolition Survey" ||
        r.surveyType === "Re-inspection",
    ).length;
    const acmsIdentified = records.filter(
      (r) =>
        r.acmIdentified &&
        (r.surveyType === "Management Survey" ||
          r.surveyType === "Refurbishment & Demolition Survey"),
    ).length;
    const nextInspection60d = records.filter(
      (r) =>
        r.nextInspectionDue &&
        r.nextInspectionDue >= d(0) &&
        r.nextInspectionDue <= d(60),
    ).length;
    const yearStart = d(-365);
    const briefingsYTD = records.filter(
      (r) =>
        r.surveyDate >= yearStart &&
        r.certificateNumber.includes("BRIEFING"),
    ).length;
    return { surveysCompleted, acmsIdentified, nextInspection60d, briefingsYTD };
  }, []);

  return (
    <PageShell
      title="Asbestos Register & Management Plan"
      subtitle="Statutory asbestos register and management plan for the home premises — Control of Asbestos Regulations 2012 (CAR 2012). Records of survey type, location of any asbestos-containing materials (ACMs), condition rating per HSG264, encapsulation, removal records, contractor licence details, and pre-works tradesperson briefings before any drilling or disturbance work. Children's Homes Regs Reg 25 (premises) and Quality Standard 10."
      actions={
        <div className="flex gap-2">
          <ExportButton data={filtered} columns={exportCols} filename="building-asbestos-register" />
          <PrintButton title="Asbestos Register" />
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-700 text-sm mb-1">
            <FileText className="h-4 w-4" />
            <span>Surveys completed</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.surveysCompleted}</div>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-amber-800 text-sm mb-1">
            <AlertTriangle className="h-4 w-4" />
            <span>ACMs identified</span>
          </div>
          <div className="text-2xl font-semibold text-amber-900">{stats.acmsIdentified}</div>
        </div>
        <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
          <div className="flex items-center gap-2 text-sky-800 text-sm mb-1">
            <Calendar className="h-4 w-4" />
            <span>Inspection due (60d)</span>
          </div>
          <div className="text-2xl font-semibold text-sky-900">{stats.nextInspection60d}</div>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-emerald-800 text-sm mb-1">
            <Shield className="h-4 w-4" />
            <span>Contractor briefings YTD</span>
          </div>
          <div className="text-2xl font-semibold text-emerald-900">{stats.briefingsYTD}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search area, surveyor, ACM type or certificate..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-72">
            <SelectValue placeholder="Survey type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All survey types</SelectItem>
            <SelectItem value="Management Survey">Management Survey</SelectItem>
            <SelectItem value="Refurbishment & Demolition Survey">
              Refurbishment &amp; Demolition Survey
            </SelectItem>
            <SelectItem value="Re-inspection">Re-inspection</SelectItem>
            <SelectItem value="Air monitoring">Air monitoring</SelectItem>
            <SelectItem value="Removal record">Removal record</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-full sm:w-52">
            <ArrowUpDown className="h-4 w-4 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Most recent</SelectItem>
            <SelectItem value="type">Survey type</SelectItem>
            <SelectItem value="condition">Condition rating</SelectItem>
            <SelectItem value="nextInspection">Next inspection due</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => {
          const isOpen = expandedId === r.id;
          const inspectionSoon =
            r.nextInspectionDue &&
            r.nextInspectionDue >= d(0) &&
            r.nextInspectionDue <= d(60);
          const inspectionOverdue =
            r.nextInspectionDue && r.nextInspectionDue < d(0);
          return (
            <div key={r.id} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
              <button
                onClick={() => setExpandedId(isOpen ? null : r.id)}
                className="w-full p-4 flex items-start justify-between gap-3 hover:bg-amber-50/40 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Shield className="h-4 w-4 text-amber-600" />
                    <span className="font-semibold text-slate-900">{r.surveyDate}</span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full border",
                        surveyTypeColour[r.surveyType],
                      )}
                    >
                      {r.surveyType}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full border",
                        conditionColour[r.conditionRating],
                      )}
                    >
                      {r.conditionRating}
                    </span>
                    {r.acmIdentified ? (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-amber-100 text-amber-900 border-amber-200">
                        ACM present
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-emerald-100 text-emerald-800 border-emerald-200">
                        No ACM
                      </span>
                    )}
                    {r.nextInspectionDue ? (
                      inspectionOverdue ? (
                        <span className="text-xs px-2 py-0.5 rounded-full border bg-red-100 text-red-800 border-red-200">
                          Inspection overdue · {r.nextInspectionDue}
                        </span>
                      ) : inspectionSoon ? (
                        <span className="text-xs px-2 py-0.5 rounded-full border bg-amber-100 text-amber-800 border-amber-200">
                          Next inspection {r.nextInspectionDue}
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full border bg-sky-100 text-sky-800 border-sky-200">
                          Next inspection {r.nextInspectionDue}
                        </span>
                      )
                    ) : null}
                  </div>
                  <div className="text-sm text-slate-600">
                    {r.buildingArea.length > 110
                      ? `${r.buildingArea.slice(0, 110)}…`
                      : r.buildingArea}
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>
              {isOpen ? (
                <div className="px-4 pb-4 border-t border-slate-100 bg-amber-50/20">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Surveyor</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                        <div>
                          <span className="text-slate-500">Surveyor:</span> {r.surveyor}
                        </div>
                        <div>
                          <span className="text-slate-500">Accreditation:</span>{" "}
                          {r.surveyorAccreditation}
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-slate-500">Certificate number:</span>{" "}
                          <span className="font-mono">{r.certificateNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                        Building area surveyed
                      </div>
                      <p className="text-sm text-slate-700">{r.buildingArea}</p>
                    </div>

                    <div
                      className={cn(
                        "rounded-md border p-3",
                        r.acmIdentified
                          ? "border-amber-200 bg-amber-50"
                          : "border-emerald-200 bg-emerald-50",
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {r.acmIdentified ? (
                          <AlertTriangle className="h-4 w-4 text-amber-700" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-emerald-700" />
                        )}
                        <div
                          className={cn(
                            "text-xs font-semibold uppercase",
                            r.acmIdentified ? "text-amber-800" : "text-emerald-800",
                          )}
                        >
                          ACM details
                        </div>
                      </div>
                      <div
                        className={cn(
                          "text-sm",
                          r.acmIdentified ? "text-amber-900" : "text-emerald-900",
                        )}
                      >
                        {r.acmIdentified
                          ? r.acmType ?? "ACM identified — see register entry"
                          : "No asbestos-containing materials identified in this scope."}
                      </div>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                        Condition rating
                      </div>
                      <div className="text-sm text-slate-700">{r.conditionRating}</div>
                    </div>

                    <div className="rounded-md border border-indigo-200 bg-indigo-50 p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-indigo-800 uppercase mb-2">
                        Management action
                      </div>
                      <p className="text-sm text-indigo-900">{r.managementAction}</p>
                    </div>

                    {r.encapsulationDetails ? (
                      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 lg:col-span-2">
                        <div className="text-xs font-semibold text-amber-800 uppercase mb-2">
                          Encapsulation
                        </div>
                        <p className="text-sm text-amber-900">{r.encapsulationDetails}</p>
                      </div>
                    ) : null}

                    {r.removalContractor ? (
                      <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 lg:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-emerald-700" />
                          <div className="text-xs font-semibold text-emerald-800 uppercase">
                            Licensed removal contractor
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-emerald-900">
                          <div>
                            <span className="text-emerald-700">Contractor:</span>{" "}
                            {r.removalContractor.name}
                          </div>
                          <div>
                            <span className="text-emerald-700">HSE licence:</span>{" "}
                            <span className="font-mono">{r.removalContractor.hseLicenceNumber}</span>
                          </div>
                          <div>
                            <span className="text-emerald-700">Removal date:</span>{" "}
                            {r.removalContractor.date}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                        Re-inspection cadence
                      </div>
                      <div className="text-sm text-slate-700">{r.reinspectionFrequency}</div>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                        Next inspection due
                      </div>
                      <div className="text-sm text-slate-700">
                        {r.nextInspectionDue ?? "—"}
                      </div>
                    </div>

                    {r.tradespersonBriefingsRequired ? (
                      <div className="rounded-md border-2 border-amber-300 bg-amber-50 p-3 lg:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-amber-700" />
                          <div className="text-xs font-semibold text-amber-800 uppercase">
                            Tradesperson briefing required before any drilling / disturbance
                          </div>
                        </div>
                        <p className="text-sm text-amber-900">
                          {r.notesForContractors ??
                            "All contractors must be briefed on the location and condition of identified ACMs before any work begins. Briefing record must be signed and held in the Buildings folder."}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2 text-sm text-slate-600">
                        No tradesperson briefing required for this entry.
                      </div>
                    )}

                    {r.flagsConcerns.length ? (
                      <div className="rounded-md border border-red-200 bg-red-50 p-3 lg:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-red-700" />
                          <div className="text-xs font-semibold text-red-800 uppercase">
                            Flags / concerns
                          </div>
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

                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2 text-xs text-slate-500">
                      Recorded by {getStaffName(r.recordedBy)}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="font-semibold mb-1">Regulatory framework</div>
        <p>
          Control of Asbestos Regulations 2012 (CAR 2012) — duty to manage asbestos in non-domestic
          premises (Reg 4) applies to communal areas of children&rsquo;s homes; HSE HSG264{" "}
          <em>Asbestos: The Survey Guide</em> sets the standard for management surveys and
          refurbishment &amp; demolition surveys; HSE HSG227{" "}
          <em>A comprehensive guide to managing asbestos in premises</em> covers the duty-holder&rsquo;s
          management plan; Children&rsquo;s Homes (England) Regulations 2015 Reg 25 (premises) and
          Quality Standard 10 (Care planning); Health &amp; Safety at Work etc. Act 1974. ACM
          identification, condition rating, sealing/encapsulation in good condition, and
          pre-works contractor briefings are recorded here. Licensed removal work is undertaken only
          by HSE-licensed contractors. Register reviewed annually as a minimum and on any change of
          building use, and made available to Ofsted, contractors, and emergency services on request.
        </p>
      </div>
    </PageShell>
  );
}
