"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  Bike,
  ShieldCheck,
  Award,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  MapPin,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BikeRecord {
  id: string;
  youngPerson: string;
  recordedDate: string;
  bikeOwned: boolean;
  bikeDetails?: { make: string; model: string; size: string; colour: string; serialNumber?: string };
  helmetOwned: boolean;
  helmetCondition?: "New" | "Good" | "Replace soon" | "Damaged";
  lightsFitted: boolean;
  reflectiveGearOwned: boolean;
  lockType?: string;
  bikeStorageLocation: string;
  bikeabilityLevel: "Not started" | "Level 1 (off-road)" | "Level 2 (on-road basic)" | "Level 3 (on-road advanced)" | "Beyond — independent rider";
  bikeabilityCertificateDate?: string;
  routesRiddenIndependently: string[];
  routeRiskAssessmentDone: boolean;
  childWearsHelmetConsistently: boolean;
  maintenanceCompetence: "Adult-led" | "With prompts" | "Independent basics" | "Confident";
  theftRiskScreening: string[];
  childVoice: string;
  staffObservation: string;
  reviewDate: string;
  keyWorker: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: BikeRecord[] = [
  {
    id: "bike-001",
    youngPerson: "yp_jordan",
    recordedDate: d(-30),
    bikeOwned: true,
    bikeDetails: {
      make: "Carrera",
      model: "Subway 1 Hybrid",
      size: "Frame size L (54cm)",
      colour: "Matte black with red accents",
      serialNumber: "WCB24-J7891",
    },
    helmetOwned: true,
    helmetCondition: "Good",
    lightsFitted: true,
    reflectiveGearOwned: true,
    lockType: "Kryptonite Evolution Mini-7 D-lock + secondary cable",
    bikeStorageLocation: "Locked garden shed (CCTV-monitored), bracketed to wall",
    bikeabilityLevel: "Level 3 (on-road advanced)",
    bikeabilityCertificateDate: "2024-06-18",
    routesRiddenIndependently: [
      "Home to Riverside FC training ground (3.2 miles, cycle lane majority)",
      "Home to school (1.4 miles, agreed quiet route)",
      "Home to corner shop (0.6 miles)",
      "Sustrans NCN Route 4 short loop with staff initially, now independent",
    ],
    routeRiskAssessmentDone: true,
    childWearsHelmetConsistently: true,
    maintenanceCompetence: "Confident",
    theftRiskScreening: [
      "Bike registered on BikeRegister (UK national database)",
      "Photo evidence and serial number on file",
      "Insurance via home contents policy — confirmed cover at training venues",
      "Jordan briefed on never leaving bike unattended without D-lock to immovable object",
    ],
    childVoice:
      "Cycling to football is freedom. I do my ABCs every Saturday — Air, Brakes, Chain. Coach lets me park inside the clubhouse.",
    staffObservation:
      "Jordan is a model independent rider. Bikeability Level 3 is genuinely embedded — observed signalling, primary position, and shoulder checks on staff ride-along. Maintenance routine is self-initiated.",
    reviewDate: d(60),
    keyWorker: "staff_chervelle",
  },
  {
    id: "bike-002",
    youngPerson: "yp_alex",
    recordedDate: d(-21),
    bikeOwned: true,
    bikeDetails: {
      make: "Apollo",
      model: "Slick Hybrid (smaller frame)",
      size: "Frame size S (46cm)",
      colour: "Sage green — gender-neutral, chosen by Alex",
    },
    helmetOwned: true,
    helmetCondition: "Good",
    lightsFitted: false,
    reflectiveGearOwned: true,
    lockType: "Combination cable lock (upgrade to D-lock planned)",
    bikeStorageLocation: "Garden shed alongside Jordan's bike",
    bikeabilityLevel: "Level 2 (on-road basic)",
    bikeabilityCertificateDate: "2024-09-22",
    routesRiddenIndependently: [
      "Home park loop (0.8 miles, off-road)",
      "Home to library on quiet residential streets (with staff initially)",
    ],
    routeRiskAssessmentDone: true,
    childWearsHelmetConsistently: false,
    maintenanceCompetence: "With prompts",
    theftRiskScreening: [
      "Bike registered on BikeRegister",
      "Photo and serial on file",
      "Lock upgrade scheduled — current cable lock not adequate for off-site use",
    ],
    childVoice:
      "I like riding round the park. Sometimes I forget the helmet if I'm just going to the end of the road — but staff keep reminding me.",
    staffObservation:
      "Alex is a competent leisure rider but helmet consistency is a current focus — agreed reward chart in place. Lights need replacing before darker evenings (October target). Level 3 Bikeability offered next term.",
    reviewDate: d(30),
    keyWorker: "staff_anna",
  },
  {
    id: "bike-003",
    youngPerson: "yp_casey",
    recordedDate: d(-14),
    bikeOwned: false,
    helmetOwned: false,
    lightsFitted: false,
    reflectiveGearOwned: false,
    bikeStorageLocation: "N/A — no bike currently",
    bikeabilityLevel: "Level 1 (off-road)",
    routesRiddenIndependently: [],
    routeRiskAssessmentDone: false,
    childWearsHelmetConsistently: false,
    maintenanceCompetence: "Adult-led",
    theftRiskScreening: [],
    childVoice:
      "Bikes feel wobbly and the road is loud. I'm trying with the after-school club bikes. Maybe one day, but no rush.",
    staffObservation:
      "Casey is anxious about cycling — sensory and safety concerns. Engaging gently via after-school club Bikeability Level 1 introduction (school playground, off-road). No pressure to own a bike. Progress measured in confidence, not miles. Will revisit purchase decision once Casey expresses readiness.",
    reviewDate: d(45),
    keyWorker: "staff_anna",
  },
];

const levelOrder: Record<BikeRecord["bikeabilityLevel"], number> = {
  "Not started": 0,
  "Level 1 (off-road)": 1,
  "Level 2 (on-road basic)": 2,
  "Level 3 (on-road advanced)": 3,
  "Beyond — independent rider": 4,
};

const levelColour: Record<BikeRecord["bikeabilityLevel"], string> = {
  "Not started": "bg-slate-100 text-slate-700",
  "Level 1 (off-road)": "bg-sky-100 text-sky-800",
  "Level 2 (on-road basic)": "bg-teal-100 text-teal-800",
  "Level 3 (on-road advanced)": "bg-emerald-100 text-emerald-800",
  "Beyond — independent rider": "bg-indigo-100 text-indigo-800",
};

const maintenanceColour: Record<BikeRecord["maintenanceCompetence"], string> = {
  "Adult-led": "bg-amber-100 text-amber-800",
  "With prompts": "bg-yellow-100 text-yellow-800",
  "Independent basics": "bg-teal-100 text-teal-800",
  Confident: "bg-emerald-100 text-emerald-800",
};

const exportCols: ExportColumn<BikeRecord>[] = [
  { header: "Young Person", accessor: (r: BikeRecord) => getYPName(r.youngPerson) },
  { header: "Recorded", accessor: (r: BikeRecord) => r.recordedDate },
  { header: "Bike Owned", accessor: (r: BikeRecord) => (r.bikeOwned ? "Yes" : "No") },
  { header: "Bike", accessor: (r: BikeRecord) => (r.bikeDetails ? `${r.bikeDetails.make} ${r.bikeDetails.model} (${r.bikeDetails.size})` : "—") },
  { header: "Helmet", accessor: (r: BikeRecord) => (r.helmetOwned ? r.helmetCondition || "Owned" : "No") },
  { header: "Lights", accessor: (r: BikeRecord) => (r.lightsFitted ? "Yes" : "No") },
  { header: "Lock", accessor: (r: BikeRecord) => r.lockType || "—" },
  { header: "Bikeability", accessor: (r: BikeRecord) => r.bikeabilityLevel },
  { header: "Cert Date", accessor: (r: BikeRecord) => r.bikeabilityCertificateDate || "—" },
  { header: "Helmet Worn Consistently", accessor: (r: BikeRecord) => (r.childWearsHelmetConsistently ? "Yes" : "No") },
  { header: "Maintenance", accessor: (r: BikeRecord) => r.maintenanceCompetence },
  { header: "Routes (count)", accessor: (r: BikeRecord) => r.routesRiddenIndependently.length },
  { header: "Review Due", accessor: (r: BikeRecord) => r.reviewDate },
  { header: "Key Worker", accessor: (r: BikeRecord) => getStaffName(r.keyWorker) },
];

export default function ChildBikeCyclingTrackerPage() {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [sortBy, setSortBy] = useState("level");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (r) =>
          getYPName(r.youngPerson).toLowerCase().includes(q) ||
          r.bikeabilityLevel.toLowerCase().includes(q) ||
          (r.bikeDetails?.make.toLowerCase().includes(q) ?? false) ||
          (r.bikeDetails?.model.toLowerCase().includes(q) ?? false) ||
          r.routesRiddenIndependently.some((rt) => rt.toLowerCase().includes(q)),
      );
    }
    if (filterLevel !== "all") items = items.filter((r) => r.bikeabilityLevel === filterLevel);
    items.sort((a, b) => {
      switch (sortBy) {
        case "level":
          return levelOrder[b.bikeabilityLevel] - levelOrder[a.bikeabilityLevel];
        case "review":
          return a.reviewDate.localeCompare(b.reviewDate);
        case "name":
          return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
        default:
          return 0;
      }
    });
    return items;
  }, [search, filterLevel, sortBy]);

  const today = new Date();
  const in90 = new Date();
  in90.setDate(in90.getDate() + 90);

  const childrenWithBikes = data.filter((r) => r.bikeOwned).length;
  const bikeabilityCompleted = data.filter(
    (r) => r.bikeabilityLevel !== "Not started" && r.bikeabilityLevel !== "Level 1 (off-road)",
  ).length;
  const helmetAlwaysWorn = data.filter((r) => r.childWearsHelmetConsistently).length;
  const reviewsDue90 = data.filter((r) => {
    const dt = new Date(r.reviewDate);
    return dt >= today && dt <= in90;
  }).length;

  return (
    <PageShell
      title="Cycling & Bike Safety"
      subtitle="Per-child cycling capability, bike ownership, helmet and safety equipment, Bikeability progression, route competence, and theft prevention"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="cycling-bike-safety" />
          <PrintButton title="Cycling & Bike Safety" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-sky-600">{childrenWithBikes}</p>
          <p className="text-xs text-muted-foreground">Children With Bikes</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-teal-600">{bikeabilityCompleted}</p>
          <p className="text-xs text-muted-foreground">Bikeability Completed (L2+)</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{helmetAlwaysWorn}</p>
          <p className="text-xs text-muted-foreground">Helmet Always Worn</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{reviewsDue90}</p>
          <p className="text-xs text-muted-foreground">Reviews Due (90d)</p>
        </div>
      </div>

      <div className="rounded-lg bg-sky-50 border border-sky-200 p-3 mb-6 flex items-start gap-2">
        <Bike className="h-4 w-4 text-sky-600 mt-0.5 shrink-0" />
        <p className="text-sm text-sky-800">
          Cycling is freedom, fitness, and independence. Each child&apos;s journey is paced to their confidence —
          from off-road first wobbles to confident on-road riding. Helmet, lights, lock, and skills are non-negotiable
          before independent road riding.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by child, bike, route, or level..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border bg-white text-sm"
          />
        </div>
        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="All Bikeability Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bikeability Levels</SelectItem>
            <SelectItem value="Not started">Not started</SelectItem>
            <SelectItem value="Level 1 (off-road)">Level 1 (off-road)</SelectItem>
            <SelectItem value="Level 2 (on-road basic)">Level 2 (on-road basic)</SelectItem>
            <SelectItem value="Level 3 (on-road advanced)">Level 3 (on-road advanced)</SelectItem>
            <SelectItem value="Beyond — independent rider">Beyond — independent rider</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="level">By Level (high to low)</SelectItem>
              <SelectItem value="review">By Review Date</SelectItem>
              <SelectItem value="name">By Child Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => {
          const isExpanded = expandedId === c.id;
          return (
            <div key={c.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : c.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Bike className="h-5 w-5 text-sky-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {getYPName(c.youngPerson)}
                      {c.bikeDetails && (
                        <span className="text-muted-foreground font-normal">
                          {" "}
                          &middot; {c.bikeDetails.make} {c.bikeDetails.model}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Recorded {c.recordedDate} &middot; Key worker {getStaffName(c.keyWorker)} &middot; Review due {c.reviewDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3 flex-wrap justify-end">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", levelColour[c.bikeabilityLevel])}>
                    {c.bikeabilityLevel}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      c.bikeOwned ? "bg-sky-100 text-sky-800" : "bg-slate-100 text-slate-700",
                    )}
                  >
                    {c.bikeOwned ? "Owns bike" : "No bike"}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      c.childWearsHelmetConsistently ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800",
                    )}
                  >
                    Helmet {c.childWearsHelmetConsistently ? "consistent" : "inconsistent"}
                  </span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", maintenanceColour[c.maintenanceCompetence])}>
                    {c.maintenanceCompetence}
                  </span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  {c.bikeDetails ? (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        <Bike className="h-3 w-3 inline mr-1" />
                        Bike Details
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="bg-white rounded-lg p-2 border text-sm">
                          <p className="text-xs text-muted-foreground">Make / Model</p>
                          <p className="font-medium">
                            {c.bikeDetails.make} {c.bikeDetails.model}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-2 border text-sm">
                          <p className="text-xs text-muted-foreground">Frame</p>
                          <p className="font-medium">{c.bikeDetails.size}</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 border text-sm">
                          <p className="text-xs text-muted-foreground">Colour</p>
                          <p className="font-medium">{c.bikeDetails.colour}</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 border text-sm">
                          <p className="text-xs text-muted-foreground">Serial</p>
                          <p className="font-medium">{c.bikeDetails.serialNumber || "Not recorded"}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-3 border text-sm">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Bike Ownership
                      </p>
                      <p>No bike currently owned. Engagement is via after-school club / school programmes.</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      <ShieldCheck className="h-3 w-3 inline mr-1" />
                      Safety Equipment
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-white rounded-lg p-2 border text-sm">
                        <p className="text-xs text-muted-foreground">Helmet</p>
                        <p className="font-medium">
                          {c.helmetOwned ? c.helmetCondition || "Owned" : "Not owned"}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-2 border text-sm">
                        <p className="text-xs text-muted-foreground">Lights Fitted</p>
                        <p className={cn("font-medium", c.lightsFitted ? "text-emerald-700" : "text-amber-700")}>
                          {c.lightsFitted ? "Yes" : "No / needs fitting"}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-2 border text-sm">
                        <p className="text-xs text-muted-foreground">Reflective Gear</p>
                        <p className={cn("font-medium", c.reflectiveGearOwned ? "text-emerald-700" : "text-amber-700")}>
                          {c.reflectiveGearOwned ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-2 border text-sm">
                        <p className="text-xs text-muted-foreground">Helmet Worn Consistently</p>
                        <p className={cn("font-medium", c.childWearsHelmetConsistently ? "text-emerald-700" : "text-amber-700")}>
                          {c.childWearsHelmetConsistently ? "Yes" : "Working on it"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-white rounded-lg p-3 border text-sm">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Lock</p>
                      <p>{c.lockType || "Not applicable"}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border text-sm">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Storage</p>
                      <p>{c.bikeStorageLocation}</p>
                    </div>
                  </div>

                  <div className="bg-teal-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-teal-800 uppercase tracking-wide mb-1">
                      <Award className="h-3 w-3 inline mr-1" />
                      Bikeability
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">{c.bikeabilityLevel}</span>
                      {c.bikeabilityCertificateDate && (
                        <span className="text-muted-foreground"> &middot; Certificate dated {c.bikeabilityCertificateDate}</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      Routes Ridden Independently
                    </p>
                    {c.routesRiddenIndependently.length > 0 ? (
                      <ul className="space-y-1">
                        {c.routesRiddenIndependently.map((rt, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <MapPin className="h-3 w-3 text-sky-500 mt-1 shrink-0" />
                            <span>{rt}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">None yet — building confidence.</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Route risk assessment:{" "}
                      <span className={cn("font-medium", c.routeRiskAssessmentDone ? "text-emerald-700" : "text-amber-700")}>
                        {c.routeRiskAssessmentDone ? "Completed" : "Pending"}
                      </span>
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Maintenance Competence
                    </p>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", maintenanceColour[c.maintenanceCompetence])}>
                      {c.maintenanceCompetence}
                    </span>
                  </div>

                  {c.theftRiskScreening.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        <ShieldCheck className="h-3 w-3 inline mr-1" />
                        Theft Risk Screening
                      </p>
                      <ul className="space-y-1">
                        {c.theftRiskScreening.map((t, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <ShieldCheck className="h-3 w-3 text-teal-600 mt-1 shrink-0" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-sky-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-sky-800 uppercase tracking-wide mb-1">Child&apos;s Voice</p>
                    <p className="text-sm italic">&ldquo;{c.childVoice}&rdquo;</p>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">Staff Observation</p>
                    <p className="text-sm">{c.staffObservation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Cycling provision aligns with the National Standards for Cycle
          Training (Bikeability Trust), RoSPA cycle safety guidance, and Highway Code rules 59-82 (rules for
          cyclists). Supports Children&apos;s Homes Regulations Quality Standard 6 (Enjoyment &amp; Achievement)
          and UNCRC Article 31 (right to rest, play, and leisure). Linked to Activities, After-School Clubs,
          Risk Assessments, and Health pages.
        </p>
      </div>
    </PageShell>
  );
}
