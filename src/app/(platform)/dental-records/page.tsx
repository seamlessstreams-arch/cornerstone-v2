"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — DENTAL RECORDS
// Tracks dental care for each child: registrations, check-ups, treatments,
// daily oral hygiene, anxiety, reasonable adjustments, and recall intervals.
// Required by Quality Standard 7 (Health & Wellbeing) and NICE oral health
// guidelines for looked-after children.
// ══════════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PrintButton } from "@/components/ui/print-button";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  Search, ArrowUpDown, X, ChevronUp, ChevronDown, Smile,
  CheckCircle2, AlertTriangle, Clock, Stethoscope, Shield,
  CalendarDays, Sparkles, FileText, User, Heart, ClipboardList,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type RegistrationStatus =
  | "Active NHS"
  | "Active private"
  | "Awaiting registration"
  | "Inactive";

type RecallInterval = "3 monthly" | "6 monthly" | "12 monthly";

interface OralHygienePractice {
  practice: string;
  completed: boolean;
}

interface CheckUpEntry {
  date: string;
  dentist: string;
  findings: string;
  treatmentRecommended: string;
  treatmentReceived: string;
}

interface DentalRecord {
  id: string;
  youngPerson: string;
  dentalPractice: string;
  dentistName: string;
  registeredDate: string;
  registrationStatus: RegistrationStatus;
  dailyOralHygiene: OralHygienePractice[];
  lastCheckUpDate: string;
  nextCheckUpDue: string;
  recallInterval: RecallInterval;
  checkUpsHistory: CheckUpEntry[];
  currentTreatmentNotes: string;
  anxietyAroundDentistry: string;
  reasonableAdjustments: string[];
  childAttitudeToDentistry: string;
  orthodontics: string;
  fluorideSupplements: boolean;
  childAware: boolean;
  reviewDate: string;
  recordedBy: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<RegistrationStatus, { colour: string }> = {
  "Active NHS":            { colour: "bg-green-100 text-green-700 border-green-200" },
  "Active private":        { colour: "bg-blue-100 text-blue-700 border-blue-200" },
  "Awaiting registration": { colour: "bg-amber-100 text-amber-700 border-amber-200" },
  "Inactive":              { colour: "bg-gray-100 text-gray-600 border-gray-200" },
};

// ── Date helper ───────────────────────────────────────────────────────────────

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

// ── Seed Data ─────────────────────────────────────────────────────────────────

const SEED: DentalRecord[] = [
  {
    id: "dental_001",
    youngPerson: "yp_alex",
    dentalPractice: "Allestree Dental Practice",
    dentistName: "Dr. Priya Sharma",
    registeredDate: d(-420),
    registrationStatus: "Active NHS",
    dailyOralHygiene: [
      { practice: "Brush twice daily (morning and bedtime) with fluoride toothpaste", completed: true },
      { practice: "Replace toothbrush every 3 months", completed: true },
      { practice: "Floss / interdental brushes daily", completed: false },
      { practice: "Limit sugary drinks/snacks between meals", completed: true },
      { practice: "Mouthwash after lunch (school)", completed: true },
    ],
    lastCheckUpDate: d(-95),
    nextCheckUpDue: d(85),
    recallInterval: "6 monthly",
    checkUpsHistory: [
      {
        date: d(-95),
        dentist: "Dr. Priya Sharma",
        findings: "All teeth healthy. Good oral hygiene. No decay or gum issues. Mild plaque on lower incisors.",
        treatmentRecommended: "Routine scale and polish. Continue current oral hygiene routine.",
        treatmentReceived: "Scale and polish completed at appointment. Fluoride varnish applied.",
      },
      {
        date: d(-280),
        dentist: "Dr. Priya Sharma",
        findings: "Healthy dentition. One mild calculus deposit on lower front teeth.",
        treatmentRecommended: "Hygienist clean. Reinforce flossing.",
        treatmentReceived: "Cleaning done. Flossing demo provided to Alex and key worker.",
      },
    ],
    currentTreatmentNotes: "No active treatment. Next routine 6-monthly recall scheduled.",
    anxietyAroundDentistry: "Minimal — Alex tolerates appointments well. Likes to know what to expect beforehand.",
    reasonableAdjustments: [
      "Brief pre-visit explanation of what will happen",
      "First or last appointment of the day to reduce waiting",
    ],
    childAttitudeToDentistry: "Confident and cooperative. Has positive view of dental visits since establishing routine at Oak House.",
    orthodontics: "Not required — natural alignment good. No referral needed.",
    fluorideSupplements: false,
    childAware: true,
    reviewDate: d(85),
    recordedBy: "staff_anna",
  },
  {
    id: "dental_002",
    youngPerson: "yp_jordan",
    dentalPractice: "Smile Dental Practice, Normanton Road",
    dentistName: "Mr. K. Ahmed",
    registeredDate: d(-150),
    registrationStatus: "Active NHS",
    dailyOralHygiene: [
      { practice: "Brush twice daily with fluoride toothpaste (1450ppm)", completed: true },
      { practice: "Use disclosing tablets weekly to check brushing technique", completed: true },
      { practice: "Floss daily after evening brush", completed: true },
      { practice: "Avoid sugary snacks between meals", completed: true },
      { practice: "Drink water after meals at school", completed: true },
    ],
    lastCheckUpDate: d(-30),
    nextCheckUpDue: d(150),
    recallInterval: "6 monthly",
    checkUpsHistory: [
      {
        date: d(-30),
        dentist: "Mr. K. Ahmed",
        findings: "Cavity treated successfully. Healing well. No new decay. Plaque levels much improved.",
        treatmentRecommended: "Continue current oral hygiene. Standard 6-monthly recall.",
        treatmentReceived: "Review and polish. No further treatment needed.",
      },
      {
        date: d(-75),
        dentist: "Mr. K. Ahmed",
        findings: "Filling placed in lower-right first molar.",
        treatmentRecommended: "Composite filling under local anaesthetic.",
        treatmentReceived: "Filling completed. Jordan tolerated well with key worker present.",
      },
      {
        date: d(-120),
        dentist: "Mr. K. Ahmed",
        findings: "Cavity in lower-right first molar (LR6). No prior dental record on transfer — first registration since placement. Moderate plaque.",
        treatmentRecommended: "Filling required. Hygiene reinforcement. Diet review with key worker.",
        treatmentReceived: "Treatment plan agreed. Hygiene pack provided.",
      },
    ],
    currentTreatmentNotes: "Recently caught up after gap in dental care prior to placement. Cavity treated. Now stable on standard 6-monthly recall.",
    anxietyAroundDentistry: "Some anxiety initially due to long gap in care. Now significantly reduced — knows the practice and dentist.",
    reasonableAdjustments: [
      "Key worker (Anna) accompanies to all appointments",
      "Verbal countdown before any procedure",
      "Headphones permitted during treatment",
    ],
    childAttitudeToDentistry: "Initially reluctant. Now engaged — proud of cavity-free check-up and improved hygiene routine.",
    orthodontics: "Mild crowding noted — referral to be considered at next 12-month review if Jordan wishes.",
    fluorideSupplements: false,
    childAware: true,
    reviewDate: d(150),
    recordedBy: "staff_anna",
  },
  {
    id: "dental_003",
    youngPerson: "yp_casey",
    dentalPractice: "Derby Paediatric Dental Specialists",
    dentistName: "Dr. Helen Marsh (Specialist Paediatric Dentist)",
    registeredDate: d(-210),
    registrationStatus: "Active NHS",
    dailyOralHygiene: [
      { practice: "Brush twice daily — soft-bristled brush, mild flavoured toothpaste", completed: true },
      { practice: "Use of weighted toothbrush handle for grip and sensory feedback", completed: true },
      { practice: "Visual timer (2 mins) used to support routine", completed: true },
      { practice: "Floss with key worker support 3x weekly", completed: false },
      { practice: "Quiet environment at brushing times", completed: true },
    ],
    lastCheckUpDate: d(-60),
    nextCheckUpDue: d(30),
    recallInterval: "3 monthly",
    checkUpsHistory: [
      {
        date: d(-60),
        dentist: "Dr. Helen Marsh",
        findings: "All teeth healthy. No decay. Casey allowed full examination for first time without distress.",
        treatmentRecommended: "Continue 3-monthly recall. Reduce to 6-monthly if next two visits remain settled.",
        treatmentReceived: "Examination, gentle polish, fluoride varnish.",
      },
      {
        date: d(-150),
        dentist: "Dr. Helen Marsh",
        findings: "Examination achieved with sensory accommodations. No decay visible.",
        treatmentRecommended: "Continue desensitisation. Maintain 3-monthly visits.",
        treatmentReceived: "Mirror examination only — no instruments. Fluoride varnish applied at end.",
      },
      {
        date: d(-200),
        dentist: "Dr. Helen Marsh",
        findings: "Initial assessment. Casey unable to sit in chair for full examination. Familiarisation visit only.",
        treatmentRecommended: "Series of monthly desensitisation visits before full examination attempted.",
        treatmentReceived: "Practice tour, met dentist, sat in chair briefly, took home sticker and toothbrush.",
      },
    ],
    currentTreatmentNotes: "Sensory-aware paediatric pathway. Historically attended monthly desensitisation visits — now stable on 3-monthly. Considering reducing to 6-monthly if next two visits go well.",
    anxietyAroundDentistry: "Significant — sensory sensitivities (sound of drill, bright light, latex gloves, mint flavour). Has improved markedly with consistent specialist care.",
    reasonableAdjustments: [
      "Specialist paediatric dentist with sensory-aware practice",
      "Non-latex gloves used at all appointments",
      "Bright examination light dimmed during oral check",
      "Noise-cancelling headphones provided",
      "No mint toothpaste — strawberry flavour used",
      "Same dentist and dental nurse at every visit (continuity)",
      "Visual schedule shown before each step",
      "Key worker present throughout",
    ],
    childAttitudeToDentistry: "Anxious but engaging. Proud of progress — keeps reward charts and chooses sticker after each visit.",
    orthodontics: "Not yet assessed — to be considered at age 12 once dental anxiety further reduced.",
    fluorideSupplements: true,
    childAware: true,
    reviewDate: d(30),
    recordedBy: "staff_darren",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function DentalRecordsPage() {
  const [records] = useState<DentalRecord[]>(SEED);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("nextDue");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  /* ── Filtering & sort ───────────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = [...records];
    if (statusFilter !== "all") {
      list = list.filter(r => r.registrationStatus === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        getYPName(r.youngPerson).toLowerCase().includes(q) ||
        r.dentalPractice.toLowerCase().includes(q) ||
        r.dentistName.toLowerCase().includes(q) ||
        r.currentTreatmentNotes.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      switch (sortBy) {
        case "nextDue":   return a.nextCheckUpDue.localeCompare(b.nextCheckUpDue);
        case "lastVisit": return b.lastCheckUpDate.localeCompare(a.lastCheckUpDate);
        case "child":     return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
        case "status":    return a.registrationStatus.localeCompare(b.registrationStatus);
        default: return 0;
      }
    });
    return list;
  }, [records, search, statusFilter, sortBy]);

  /* ── Stats ──────────────────────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const registered = records.filter(r =>
      r.registrationStatus === "Active NHS" || r.registrationStatus === "Active private"
    ).length;
    const upToDate = records.filter(r => r.nextCheckUpDue >= today).length;
    const treatmentInProgress = records.filter(r =>
      /treat|filling|in progress|caries|cavity/i.test(r.currentTreatmentNotes) &&
      !/no further|stable|no active/i.test(r.currentTreatmentNotes)
    ).length;
    const adjusted = records.filter(r => r.reasonableAdjustments.length >= 3).length;
    return { registered, upToDate, treatmentInProgress, adjusted };
  }, [records, today]);

  /* ── Export ─────────────────────────────────────────────────────────────── */
  const exportCols: ExportColumn<DentalRecord>[] = [
    { header: "ID",                    accessor: (r: DentalRecord) => r.id },
    { header: "Child",                 accessor: (r: DentalRecord) => getYPName(r.youngPerson) },
    { header: "Practice",              accessor: (r: DentalRecord) => r.dentalPractice },
    { header: "Dentist",               accessor: (r: DentalRecord) => r.dentistName },
    { header: "Registered",            accessor: (r: DentalRecord) => r.registeredDate },
    { header: "Status",                accessor: (r: DentalRecord) => r.registrationStatus },
    { header: "Last Check-up",         accessor: (r: DentalRecord) => r.lastCheckUpDate },
    { header: "Next Due",              accessor: (r: DentalRecord) => r.nextCheckUpDue },
    { header: "Recall",                accessor: (r: DentalRecord) => r.recallInterval },
    { header: "Current Treatment",     accessor: (r: DentalRecord) => r.currentTreatmentNotes },
    { header: "Anxiety",               accessor: (r: DentalRecord) => r.anxietyAroundDentistry },
    { header: "Reasonable Adjustments",accessor: (r: DentalRecord) => r.reasonableAdjustments.join("; ") },
    { header: "Attitude",              accessor: (r: DentalRecord) => r.childAttitudeToDentistry },
    { header: "Orthodontics",          accessor: (r: DentalRecord) => r.orthodontics },
    { header: "Fluoride Supplements",  accessor: (r: DentalRecord) => r.fluorideSupplements ? "Yes" : "No" },
    { header: "Child Aware",           accessor: (r: DentalRecord) => r.childAware ? "Yes" : "No" },
    { header: "Review Date",           accessor: (r: DentalRecord) => r.reviewDate },
    { header: "Recorded By",           accessor: (r: DentalRecord) => getStaffName(r.recordedBy) },
  ];

  return (
    <PageShell
      title="Dental Records"
      subtitle="Registrations, check-ups, and treatment for each child"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Dental Records" />
          <ExportButton data={filtered} columns={exportCols} filename="dental-records" />
        </div>
      }
    >
      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Children registered",    value: stats.registered,          icon: Smile,         c: "text-cyan-600"  },
          { label: "Up to date",             value: stats.upToDate,            icon: CheckCircle2,  c: "text-green-600" },
          { label: "Treatments in progress", value: stats.treatmentInProgress, icon: Stethoscope,   c: "text-amber-600" },
          { label: "Adjusted approach",      value: stats.adjusted,            icon: Sparkles,      c: "text-purple-600"},
        ].map(s => (
          <div key={s.label} className="rounded-lg border bg-card p-3 flex items-center gap-3">
            <s.icon className={cn("h-5 w-5", s.c)} />
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search child, practice, dentist..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-2.5">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {(Object.keys(STATUS_CONFIG) as RegistrationStatus[]).map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="nextDue">Next Check-up Due</SelectItem>
              <SelectItem value="lastVisit">Last Visit</SelectItem>
              <SelectItem value="child">By Child</SelectItem>
              <SelectItem value="status">By Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        {(search || statusFilter !== "all") && " (filtered)"}
      </p>

      {/* ── Records ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3" id="dental-records-print">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Smile className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="font-medium">No dental records found</p>
          </div>
        )}

        {filtered.map(rec => {
          const isOpen = expandedId === rec.id;
          const sc = STATUS_CONFIG[rec.registrationStatus];
          const overdue = rec.nextCheckUpDue < today;
          const dueSoon = !overdue && rec.nextCheckUpDue < d(30);

          return (
            <div
              key={rec.id}
              className={cn(
                "rounded-lg border bg-card overflow-hidden",
                overdue && "border-red-200 ring-1 ring-red-100"
              )}
            >
              <button
                onClick={() => setExpandedId(isOpen ? null : rec.id)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="rounded-full p-1.5 shrink-0 bg-cyan-100 text-cyan-700">
                  <Smile className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{getYPName(rec.youngPerson)}</span>
                    <Badge variant="outline" className={cn("text-xs", sc.colour)}>
                      {rec.registrationStatus}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {rec.recallInterval}
                    </Badge>
                    {overdue && (
                      <Badge className="text-xs bg-red-600 text-white">OVERDUE</Badge>
                    )}
                    {dueSoon && (
                      <Badge className="text-xs bg-amber-500 text-white">DUE SOON</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {rec.dentalPractice} · {rec.dentistName} · Next due {rec.nextCheckUpDue}
                  </p>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
              </button>

              {isOpen && (
                <div className="border-t px-4 py-4 space-y-4 bg-muted/30">
                  {/* Registration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Practice</p>
                      <p>{rec.dentalPractice}</p>
                      <p className="text-xs text-muted-foreground">Dentist: {rec.dentistName}</p>
                      <p className="text-xs text-muted-foreground">Registered: {rec.registeredDate}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Recall</p>
                      <p>{rec.recallInterval}</p>
                      <p className="text-xs text-muted-foreground">Last check-up: {rec.lastCheckUpDate}</p>
                      <p className="text-xs text-muted-foreground">Next due: {rec.nextCheckUpDue}</p>
                    </div>
                  </div>

                  {/* Daily oral hygiene */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1">
                      <ClipboardList className="h-3.5 w-3.5" /> Daily Oral Hygiene
                    </p>
                    <ul className="space-y-1">
                      {rec.dailyOralHygiene.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          {p.completed
                            ? <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            : <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          }
                          <span className={cn(!p.completed && "text-muted-foreground")}>{p.practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Current treatment */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                      <Stethoscope className="h-3.5 w-3.5" /> Current Treatment
                    </p>
                    <p className="text-sm">{rec.currentTreatmentNotes}</p>
                  </div>

                  {/* Anxiety & adjustments */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" /> Anxiety Around Dentistry
                      </p>
                      <p className="text-sm">{rec.anxietyAroundDentistry}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" /> Reasonable Adjustments
                      </p>
                      {rec.reasonableAdjustments.length === 0 ? (
                        <p className="text-sm text-muted-foreground">None recorded</p>
                      ) : (
                        <ul className="text-sm list-disc list-inside space-y-0.5">
                          {rec.reasonableAdjustments.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Attitude / orthodontics / fluoride */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Child's Attitude</p>
                      <p>{rec.childAttitudeToDentistry}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Orthodontics</p>
                      <p>{rec.orthodontics}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Fluoride / Awareness</p>
                      <p>Fluoride supplements: <strong>{rec.fluorideSupplements ? "Yes" : "No"}</strong></p>
                      <p>Child aware of plan: <strong>{rec.childAware ? "Yes" : "No"}</strong></p>
                    </div>
                  </div>

                  {/* Check-ups history */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" /> Check-up History
                    </p>
                    <div className="space-y-2">
                      {rec.checkUpsHistory.map((c, i) => (
                        <div key={i} className="rounded border bg-background p-3 text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">{c.date}</Badge>
                            <span className="text-xs text-muted-foreground">{c.dentist}</span>
                          </div>
                          <p><span className="font-medium">Findings: </span>{c.findings}</p>
                          <p><span className="font-medium">Recommended: </span>{c.treatmentRecommended}</p>
                          <p><span className="font-medium">Received: </span>{c.treatmentReceived}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-1 border-t">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Review date: {rec.reviewDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" /> Recorded by: {getStaffName(rec.recordedBy)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" /> {rec.id}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Regulatory Note ───────────────────────────────────────────────────── */}
      <div className="mt-8 rounded-lg border border-dashed p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-semibold">Regulatory Context</p>
            <p>
              <strong>Quality Standard 7 (Health & Wellbeing)</strong> requires the registered person to ensure each
              child is registered with a dentist and that their oral health needs are met. <strong>NICE guideline NG194</strong>
              {" "}and the NICE oral health guidance for looked-after children recommend recall intervals tailored to risk
              (3–12 monthly), daily fluoride toothpaste use, and reasonable adjustments for anxiety or sensory needs.
              Missed dental appointments must be rebooked promptly and recorded. Children should be supported to
              understand their own oral health and participate in decisions about their care.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
