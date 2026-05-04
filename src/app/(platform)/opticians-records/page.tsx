"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Glasses,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OpticalRecord {
  id: string;
  youngPerson: string;
  practice: string;
  optometrist: string;
  registeredDate: string;
  status: "Active NHS" | "Active private" | "Awaiting registration";
  recallInterval: "Annual" | "2-yearly" | "Specialist follow-up";
  examHistory: { date: string; outcome: string; prescription: string; recommendations: string }[];
  currentPrescription: { rightSphere: string; rightCylinder: string; leftSphere: string; leftCylinder: string; addition: string };
  glassesIssued: { date: string; type: "Reading" | "Distance" | "Varifocals" | "Reading + screen" | "Sports glasses" | "Sunglasses (prescription)"; framesChosen: string; lensType: string; cost: number; childChose: boolean }[];
  contactLensesIssued: boolean;
  contactLensesNotes: string;
  visualImpairment: string;
  schoolNotifiedDate: string;
  reasonableAdjustments: string[];
  lastExamDate: string;
  nextExamDue: string;
  childAttitudeToOptometrist: string;
  reviewDate: string;
  reviewedBy: string;
  notes: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: OpticalRecord[] = [
  {
    id: "opt-001",
    youngPerson: "yp_alex",
    practice: "Specsavers — Riverside",
    optometrist: "Mrs Hughes (Optometrist)",
    registeredDate: "2022-02-15",
    status: "Active NHS",
    recallInterval: "Annual",
    examHistory: [
      { date: "2022-02-20", outcome: "Mild myopia identified — first prescription", prescription: "R: -0.75 / L: -0.50", recommendations: "Distance glasses for school" },
      { date: "2023-02-22", outcome: "Stable", prescription: "R: -1.00 / L: -0.75", recommendations: "Continue distance glasses" },
      { date: "2024-02-18", outcome: "Slight progression — common at adolescence", prescription: "R: -1.25 / L: -1.00", recommendations: "New glasses; consider screen-time limits" },
      { date: d(-30), outcome: "Stable; child happy with frames", prescription: "R: -1.25 / L: -1.00", recommendations: "Annual review" },
    ],
    currentPrescription: { rightSphere: "-1.25", rightCylinder: "0", leftSphere: "-1.00", leftCylinder: "0", addition: "" },
    glassesIssued: [
      { date: "2022-03-05", type: "Distance", framesChosen: "Black plastic — Alex's choice", lensType: "Standard CR-39", cost: 25, childChose: true },
      { date: "2024-03-15", type: "Distance", framesChosen: "Tortoiseshell sport-style — Alex chose", lensType: "Polycarbonate (impact-resistant for boxing)", cost: 95, childChose: true },
    ],
    contactLensesIssued: false,
    contactLensesNotes: "Discussed for boxing; not pursued — Alex prefers polycarbonate sport glasses",
    visualImpairment: "Mild myopia, well-corrected",
    schoolNotifiedDate: "2022-03-10",
    reasonableAdjustments: [
      "Glasses for school work and screen use",
      "Boxing club aware — sports glasses worn during training",
    ],
    lastExamDate: d(-30),
    nextExamDue: d(335),
    childAttitudeToOptometrist: "Comfortable. Mrs Hughes is friendly. Alex chose his last frames himself with pride.",
    reviewDate: d(-30),
    reviewedBy: "staff_anna",
    notes: "Annual check sustained. Sports-impact lenses sensible given boxing.",
  },
  {
    id: "opt-002",
    youngPerson: "yp_jordan",
    practice: "Boots Opticians — Riverside",
    optometrist: "Mr Patel (Optometrist)",
    registeredDate: "2023-10-05",
    status: "Active NHS",
    recallInterval: "2-yearly",
    examHistory: [
      { date: "2023-10-10", outcome: "First exam at Oak House — vision normal, no prescription", prescription: "Plano (no prescription needed)", recommendations: "Routine 2-yearly recall" },
      { date: d(-7), outcome: "Vision remains normal", prescription: "Plano", recommendations: "Continue 2-yearly" },
    ],
    currentPrescription: { rightSphere: "0", rightCylinder: "0", leftSphere: "0", leftCylinder: "0", addition: "" },
    glassesIssued: [],
    contactLensesIssued: false,
    contactLensesNotes: "Not required",
    visualImpairment: "None",
    schoolNotifiedDate: "",
    reasonableAdjustments: [],
    lastExamDate: d(-7),
    nextExamDue: d(723),
    childAttitudeToOptometrist: "Comfortable. Quick visits. Sport-protective awareness if needed in future.",
    reviewDate: d(-7),
    reviewedBy: "staff_chervelle",
    notes: "No issues. Routine 2-yearly recall continues.",
  },
  {
    id: "opt-003",
    youngPerson: "yp_casey",
    practice: "Specialist paediatric optometrist — Hillside Eye Care",
    optometrist: "Dr Chen (Paediatric Optometrist, sensory-aware)",
    registeredDate: "2021-09-30",
    status: "Active NHS",
    recallInterval: "Specialist follow-up",
    examHistory: [
      { date: "2021-10-05", outcome: "First exam — sensory adjustments needed throughout", prescription: "Mild astigmatism R/L", recommendations: "Glasses for screen and reading; sensory-aware approach to fitting" },
      { date: "2022-10-08", outcome: "Stable", prescription: "Mild astigmatism R/L unchanged", recommendations: "Annual specialist review" },
      { date: "2023-10-12", outcome: "Slight progression", prescription: "Slightly stronger astigmatism", recommendations: "New lens; same frames if Casey wishes" },
      { date: d(-90), outcome: "Stable; visual processing differences observed (consistent with ASD profile)", prescription: "Stable", recommendations: "Continue annual; no change to glasses" },
    ],
    currentPrescription: { rightSphere: "-0.25", rightCylinder: "-1.00", leftSphere: "-0.25", leftCylinder: "-1.00", addition: "" },
    glassesIssued: [
      { date: "2021-10-20", type: "Reading + screen", framesChosen: "Soft-frame sage green (Casey's specific choice — sensory)", lensType: "Anti-glare", cost: 65, childChose: true },
      { date: "2023-10-25", type: "Reading + screen", framesChosen: "Same sage green frame style replaced", lensType: "Updated lens; anti-glare", cost: 95, childChose: true },
    ],
    contactLensesIssued: false,
    contactLensesNotes: "Not appropriate given sensory profile",
    visualImpairment: "Mild astigmatism + visual processing differences (ASD-related)",
    schoolNotifiedDate: "2021-11-01",
    reasonableAdjustments: [
      "Sensory-aware optometrist (Dr Chen specialises)",
      "Sage green soft frames — Casey's specific sensory choice (replicated each replacement)",
      "Anti-glare lenses essential for sensory tolerance",
      "School aware of visual processing differences",
      "Reading and screen sessions limited per OT guidance",
      "Annual specialist appointments only — no walk-in care",
    ],
    lastExamDate: d(-90),
    nextExamDue: d(275),
    childAttitudeToOptometrist: "Trusts Dr Chen. Specialist sensory-aware approach essential.",
    reviewDate: d(-90),
    reviewedBy: "staff_anna",
    notes: "Specialist paediatric optometrist worth the journey. Continuity essential.",
  },
];

const statusColour: Record<string, string> = {
  "Active NHS": "bg-green-100 text-green-800",
  "Active private": "bg-blue-100 text-blue-800",
  "Awaiting registration": "bg-amber-100 text-amber-800",
};

const exportCols: ExportColumn<OpticalRecord>[] = [
  { header: "Young Person", accessor: (r: OpticalRecord) => getYPName(r.youngPerson) },
  { header: "Practice", accessor: (r: OpticalRecord) => r.practice },
  { header: "Optometrist", accessor: (r: OpticalRecord) => r.optometrist },
  { header: "Status", accessor: (r: OpticalRecord) => r.status },
  { header: "Recall", accessor: (r: OpticalRecord) => r.recallInterval },
  { header: "Last Exam", accessor: (r: OpticalRecord) => r.lastExamDate },
  { header: "Next Due", accessor: (r: OpticalRecord) => r.nextExamDue },
  { header: "Glasses", accessor: (r: OpticalRecord) => r.glassesIssued.length > 0 ? `${r.glassesIssued.length} pair(s)` : "None" },
];

export default function OpticiansRecordsPage() {
  const [filterYP, setFilterYP] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterYP !== "all") items = items.filter((r) => r.youngPerson === filterYP);
    items.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.youngPerson.localeCompare(b.youngPerson);
        case "exam":
          return a.nextExamDue.localeCompare(b.nextExamDue);
        default:
          return 0;
      }
    });
    return items;
  }, [filterYP, sortBy]);

  const total = data.length;
  const allRegistered = data.every((r) => r.status === "Active NHS" || r.status === "Active private");
  const wearingGlasses = data.filter((r) => r.glassesIssued.length > 0).length;
  const dueExam = data.filter((r) => r.nextExamDue <= d(60)).length;

  return (
    <PageShell
      title="Opticians Records"
      subtitle="Per-child eye care — registrations, prescriptions, glasses, and reasonable adjustments"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="opticians-records" />
          <PrintButton title="Opticians Records" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Active Records</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{allRegistered ? "100%" : `${data.filter((r) => r.status === "Active NHS" || r.status === "Active private").length}/${total}`}</p>
          <p className="text-xs text-muted-foreground">Registered</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{wearingGlasses}/{total}</p>
          <p className="text-xs text-muted-foreground">Wearing Glasses</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className={cn("text-2xl font-bold", dueExam > 0 ? "text-amber-600" : "text-green-600")}>{dueExam}</p>
          <p className="text-xs text-muted-foreground">Exam Due 60d</p>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mb-6 flex items-start gap-2">
        <Eye className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">
          Eye health is part of overall wellbeing and learning. Each child registered with an NHS optometrist;
          children with sensory needs may use specialist paediatric optometrists. Frames are children&apos;s
          choice. Reasonable adjustments respected.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterYP} onValueChange={setFilterYP}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Children" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Children</SelectItem>
            <SelectItem value="yp_alex">{getYPName("yp_alex")}</SelectItem>
            <SelectItem value="yp_jordan">{getYPName("yp_jordan")}</SelectItem>
            <SelectItem value="yp_casey">{getYPName("yp_casey")}</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">By Child</SelectItem>
              <SelectItem value="exam">Next Exam Due</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => {
          const isExpanded = expandedId === r.id;

          return (
            <div key={r.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : r.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Eye className="h-5 w-5 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{getYPName(r.youngPerson)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r.practice} &middot; {r.recallInterval} &middot; Last exam {r.lastExamDate} &middot; Next due {r.nextExamDue}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", statusColour[r.status])}>{r.status}</span>
                  {r.glassesIssued.length > 0 && <Glasses className="h-4 w-4 text-blue-500" />}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-white rounded-lg p-2 border text-sm">
                      <p className="text-xs text-muted-foreground">Optometrist</p>
                      <p className="font-medium">{r.optometrist}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-sm">
                      <p className="text-xs text-muted-foreground">Registered</p>
                      <p className="font-medium">{r.registeredDate}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-sm">
                      <p className="text-xs text-muted-foreground">Current Prescription</p>
                      <p className="font-mono text-xs">R: {r.currentPrescription.rightSphere} / {r.currentPrescription.rightCylinder}</p>
                      <p className="font-mono text-xs">L: {r.currentPrescription.leftSphere} / {r.currentPrescription.leftCylinder}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-sm">
                      <p className="text-xs text-muted-foreground">Visual Impairment</p>
                      <p className="font-medium">{r.visualImpairment || "None"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Exam History</p>
                    <div className="space-y-1">
                      {r.examHistory.map((e, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm">
                          <p className="font-medium">{e.date} — {e.outcome}</p>
                          <p className="text-xs text-muted-foreground">Prescription: {e.prescription}</p>
                          <p className="text-xs text-muted-foreground">Recommendations: {e.recommendations}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {r.glassesIssued.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        <Glasses className="h-3 w-3 inline mr-1" />Glasses Issued
                      </p>
                      <div className="space-y-1">
                        {r.glassesIssued.map((g, i) => (
                          <div key={i} className="bg-white rounded-lg p-2 border text-sm">
                            <p className="font-medium">{g.date} — {g.type}</p>
                            <p className="text-xs text-muted-foreground">{g.framesChosen}</p>
                            <p className="text-xs text-muted-foreground">{g.lensType} &middot; £{g.cost}{g.childChose && " (child chose)"}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {r.reasonableAdjustments.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">Reasonable Adjustments</p>
                      <ul className="space-y-1">
                        {r.reasonableAdjustments.map((a, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <CheckCircle className="h-3 w-3 text-purple-500 mt-1 shrink-0" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-pink-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1">Child&apos;s Attitude</p>
                    <p className="text-sm">{r.childAttitudeToOptometrist}</p>
                  </div>

                  {r.notes && (
                    <div className="bg-slate-50 rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-sm">{r.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span><Clock className="h-3 w-3 inline mr-1" />Last exam: {r.lastExamDate}</span>
                    <span>Next due: {r.nextExamDue}</span>
                    <span>Reviewed: {getStaffName(r.reviewedBy)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Eye care records support Quality Standard 7 (health and
          wellbeing), Care Planning Regulations 2010 (statutory annual health), and reasonable adjustments
          per Equality Act 2010. Linked to Annual Health Assessment, Healthcare Plans, EHCP Tracker, and
          Sensory Profiles.
        </p>
      </div>
    </PageShell>
  );
}
