"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — END-OF-SHIFT CHECKLIST
// Standardised closing-down tasks completed by staff before handover.
// Required by Quality Standard 13 (Leadership & Management) and Reg 33.
// ══════════════════════════════════════════════════════════════════════════════

import React, { useMemo, useState } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Pill,
  Building2,
  BookOpen,
  Heart,
  Users,
  Clock,
  CalendarClock,
  Lock,
  ChefHat,
  PawPrint,
  MessageSquare,
  ArrowRightLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStaffName } from "@/lib/seed-data";

// ── Local date helper ────────────────────────────────────────────────────────
const d = (n: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return date.toISOString().slice(0, 10);
};

// ── Types ────────────────────────────────────────────────────────────────────
type ShiftType = "Early" | "Late" | "Sleep-in" | "Wake-night";

type CheckCategory =
  | "Safeguarding"
  | "Medication"
  | "Environment & Security"
  | "Records"
  | "Children's wellbeing"
  | "Communication";

interface ChecklistItem {
  category: CheckCategory;
  item: string;
  completed: boolean;
  notes: string;
}

interface ShiftChecklist {
  id: string;
  date: string;
  shiftType: ShiftType;
  shiftStart: string;
  shiftEnd: string;
  staffMember: string;
  checks: ChecklistItem[];
  anyEscalations: string[];
  keyHandoverPoints: string[];
  childObservations: string;
  staffWellbeingCheckIn: string;
  buildingSecurityChecked: boolean;
  medicationCabinetLocked: boolean;
  petsCaredFor: boolean;
  kitchenClosed: boolean;
  nextShiftStaff: string;
  handoverDelivered: boolean;
  allTasksComplete: boolean;
}

// ── Standard checklist template ──────────────────────────────────────────────
const STANDARD_CHECKS = (
  overrides: Partial<Record<string, { completed: boolean; notes: string }>> = {},
): ChecklistItem[] => {
  const base: Array<Omit<ChecklistItem, "completed" | "notes">> = [
    { category: "Safeguarding", item: "Reviewed open safeguarding flags and confirmed no new concerns left unrecorded" },
    { category: "Safeguarding", item: "Body map / accident book reviewed for the shift" },
    { category: "Medication", item: "MAR sheet up to date and signed for every administration this shift" },
    { category: "Medication", item: "Medication cabinet locked, keys returned to safe location" },
    { category: "Medication", item: "Controlled drugs stock count completed and signed (where applicable)" },
    { category: "Environment & Security", item: "All external doors and windows secured" },
    { category: "Environment & Security", item: "Building walk-round completed, no hazards left in communal areas" },
    { category: "Environment & Security", item: "Kitchen cleaned, appliances off, fridge temperature checked" },
    { category: "Records", item: "Daily logs written for each young person on shift" },
    { category: "Records", item: "Incidents, sanctions and physical interventions recorded" },
    { category: "Records", item: "Petty cash and pocket money reconciled where used" },
    { category: "Children's wellbeing", item: "Each young person checked in on; mood and presentation noted" },
    { category: "Children's wellbeing", item: "Bedtime / wake routine supported in line with care plan" },
    { category: "Communication", item: "Verbal handover delivered to incoming staff, key risks named" },
    { category: "Communication", item: "Outstanding tasks and follow-ups passed on in writing" },
  ];
  return base.map((b) => ({
    ...b,
    completed: overrides[b.item]?.completed ?? true,
    notes: overrides[b.item]?.notes ?? "",
  }));
};

// ── Seed records (most recent first) ─────────────────────────────────────────
const RECORDS: ShiftChecklist[] = [
  {
    id: "eos_007",
    date: d(0),
    shiftType: "Late",
    shiftStart: "14:00",
    shiftEnd: "22:00",
    staffMember: "staff_darren",
    checks: STANDARD_CHECKS(),
    anyEscalations: [],
    keyHandoverPoints: [
      "Alex settled well after evening call with mum — no further support needed tonight",
      "Casey's prescription collection due tomorrow morning before 10:00",
      "Jordan's social worker confirmed visit Friday at 16:00",
    ],
    childObservations:
      "All three young people in good spirits. Casey shared positive feedback about her new keyworker session structure. Alex spent time in the lounge with Jordan, which is a notable positive after last week's friction.",
    staffWellbeingCheckIn:
      "Felt well-supported on shift, manageable workload, no issues to raise.",
    buildingSecurityChecked: true,
    medicationCabinetLocked: true,
    petsCaredFor: true,
    kitchenClosed: true,
    nextShiftStaff: "staff_anna",
    handoverDelivered: true,
    allTasksComplete: true,
  },
  {
    id: "eos_006",
    date: d(0),
    shiftType: "Early",
    shiftStart: "07:00",
    shiftEnd: "14:00",
    staffMember: "staff_ryan",
    checks: STANDARD_CHECKS(),
    anyEscalations: [],
    keyHandoverPoints: [
      "All three young people attended education on time",
      "Maintenance team booked to fix bathroom radiator Thursday morning",
      "Casey requested earlier dinner tomorrow — agreed for 17:30",
    ],
    childObservations:
      "Calm morning routine. Jordan a little quiet at breakfast — no triggers identified, will be monitored. Alex engaged well with chores and earned all four points.",
    staffWellbeingCheckIn:
      "Good shift. Plenty of cover and clear handover received from waking-night.",
    buildingSecurityChecked: true,
    medicationCabinetLocked: true,
    petsCaredFor: true,
    kitchenClosed: true,
    nextShiftStaff: "staff_darren",
    handoverDelivered: true,
    allTasksComplete: true,
  },
  {
    id: "eos_005",
    date: d(-1),
    shiftType: "Wake-night",
    shiftStart: "22:00",
    shiftEnd: "07:00",
    staffMember: "staff_chervelle",
    checks: STANDARD_CHECKS(),
    anyEscalations: [],
    keyHandoverPoints: [
      "All young people slept through with no disturbances",
      "Hourly walk-round logs completed",
      "Heating boiler reset at 03:15 after low-pressure warning — operational since",
    ],
    childObservations:
      "Settled night for all three. Alex up briefly at 02:00 for water, returned to bed without prompting.",
    staffWellbeingCheckIn:
      "Quiet shift, used downtime to update house diary and clean staff office.",
    buildingSecurityChecked: true,
    medicationCabinetLocked: true,
    petsCaredFor: true,
    kitchenClosed: true,
    nextShiftStaff: "staff_ryan",
    handoverDelivered: true,
    allTasksComplete: true,
  },
  {
    id: "eos_004",
    date: d(-1),
    shiftType: "Late",
    shiftStart: "14:00",
    shiftEnd: "22:00",
    staffMember: "staff_anna",
    checks: STANDARD_CHECKS({
      "Petty cash and pocket money reconciled where used": {
        completed: false,
        notes:
          "Receipt from Casey's clothing trip not yet matched — receipt left in petty cash tin for finance team to verify in the morning.",
      },
    }),
    anyEscalations: [
      "Behaviour escalation — Jordan refused medication at 20:00. De-escalation successful by 20:35, medication taken under supervision. Behaviour log written, ARIA prompt completed, on-call manager (Darren) informed by phone at 20:40.",
    ],
    keyHandoverPoints: [
      "Jordan medication refusal earlier — manager aware, no further follow-up tonight",
      "Casey clothing receipt to be reconciled in the morning",
      "Alex requested family contact call to be moved to Saturday — agreed pending social worker confirmation",
    ],
    childObservations:
      "Jordan presented as anxious about tomorrow's contact arrangements — root cause of the medication refusal. Casey calm and engaged. Alex cooperative throughout.",
    staffWellbeingCheckIn:
      "Felt the situation with Jordan well — debrief with Darren by phone helpful. Will reflect in supervision.",
    buildingSecurityChecked: true,
    medicationCabinetLocked: true,
    petsCaredFor: true,
    kitchenClosed: true,
    nextShiftStaff: "staff_chervelle",
    handoverDelivered: true,
    allTasksComplete: false,
  },
  {
    id: "eos_003",
    date: d(-2),
    shiftType: "Sleep-in",
    shiftStart: "22:00",
    shiftEnd: "07:00",
    staffMember: "staff_edward",
    checks: STANDARD_CHECKS(),
    anyEscalations: [],
    keyHandoverPoints: [
      "Quiet sleep-in, no disturbances",
      "Boiler operating normally — flagged for routine service next week",
      "Casey's school PE kit washed and ready",
    ],
    childObservations:
      "All settled. No overnight calls or interactions needed.",
    staffWellbeingCheckIn:
      "Restful sleep-in, fully alert at 06:45 wake.",
    buildingSecurityChecked: true,
    medicationCabinetLocked: true,
    petsCaredFor: true,
    kitchenClosed: true,
    nextShiftStaff: "staff_lackson",
    handoverDelivered: true,
    allTasksComplete: true,
  },
  {
    id: "eos_002",
    date: d(-3),
    shiftType: "Late",
    shiftStart: "14:00",
    shiftEnd: "22:00",
    staffMember: "staff_lackson",
    checks: STANDARD_CHECKS(),
    anyEscalations: [],
    keyHandoverPoints: [
      "Casey completed first homework session of the term — celebrate with her tomorrow",
      "Alex's bedroom radiator still warmer than other rooms — maintenance ticket open",
      "House meeting scheduled for Sunday at 18:00",
    ],
    childObservations:
      "Positive evening across the house. Jordan helped prepare dinner — confidence visibly growing.",
    staffWellbeingCheckIn:
      "Productive shift, time well-distributed across all three young people.",
    buildingSecurityChecked: true,
    medicationCabinetLocked: true,
    petsCaredFor: true,
    kitchenClosed: true,
    nextShiftStaff: "staff_edward",
    handoverDelivered: true,
    allTasksComplete: true,
  },
  {
    id: "eos_001",
    date: d(-4),
    shiftType: "Early",
    shiftStart: "07:00",
    shiftEnd: "14:00",
    staffMember: "staff_mirela",
    checks: STANDARD_CHECKS(),
    anyEscalations: [],
    keyHandoverPoints: [
      "School transport ran 10 minutes late — communicated to all three schools",
      "Casey collected new bus pass from reception",
      "Cleaning rota updated and shared in staff WhatsApp",
    ],
    childObservations:
      "Smooth morning. Alex needed extra encouragement to leave for school but went without escalation.",
    staffWellbeingCheckIn:
      "Felt confident managing the morning rush solo with sleep-in support overlap.",
    buildingSecurityChecked: true,
    medicationCabinetLocked: true,
    petsCaredFor: true,
    kitchenClosed: true,
    nextShiftStaff: "staff_lackson",
    handoverDelivered: true,
    allTasksComplete: true,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const shiftColour = (s: ShiftType): string => {
  switch (s) {
    case "Early":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Late":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "Sleep-in":
      return "bg-violet-100 text-violet-800 border-violet-200";
    case "Wake-night":
      return "bg-slate-200 text-slate-800 border-slate-300";
  }
};

const categoryIcon: Record<CheckCategory, React.ReactNode> = {
  Safeguarding: <ShieldCheck className="h-4 w-4" />,
  Medication: <Pill className="h-4 w-4" />,
  "Environment & Security": <Building2 className="h-4 w-4" />,
  Records: <BookOpen className="h-4 w-4" />,
  "Children's wellbeing": <Heart className="h-4 w-4" />,
  Communication: <MessageSquare className="h-4 w-4" />,
};

const formatPretty = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const completionPct = (r: ShiftChecklist): number => {
  if (r.checks.length === 0) return 0;
  const done = r.checks.filter((c) => c.completed).length;
  return Math.round((done / r.checks.length) * 100);
};

// ── Sort options ─────────────────────────────────────────────────────────────
type SortKey =
  | "date_desc"
  | "date_asc"
  | "completion_desc"
  | "completion_asc"
  | "shift";

// ── Page ─────────────────────────────────────────────────────────────────────
export default function EndOfShiftChecklistPage() {
  const [sortKey, setSortKey] = useState<SortKey>("date_desc");
  const [filterShift, setFilterShift] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Summary stats ──────────────────────────────────────────────────────────
  const summary = useMemo(() => {
    const seven = new Date();
    seven.setDate(seven.getDate() - 7);
    const recent = RECORDS.filter((r) => new Date(r.date) >= seven);
    const totalChecks = RECORDS.reduce((s, r) => s + r.checks.length, 0);
    const completed = RECORDS.reduce(
      (s, r) => s + r.checks.filter((c) => c.completed).length,
      0,
    );
    const completionRate =
      totalChecks > 0 ? Math.round((completed / totalChecks) * 100) : 0;
    const escalations = recent.reduce(
      (s, r) => s + r.anyEscalations.length,
      0,
    );
    const avgComplete = Math.round(
      RECORDS.reduce((s, r) => s + completionPct(r), 0) /
        Math.max(RECORDS.length, 1),
    );
    return {
      shiftsLogged: RECORDS.length,
      completionRate,
      escalations,
      avgComplete,
    };
  }, []);

  // ── Filtered + sorted ──────────────────────────────────────────────────────
  const visible = useMemo(() => {
    let list = [...RECORDS];
    if (filterShift !== "all") {
      list = list.filter((r) => r.shiftType === filterShift);
    }
    switch (sortKey) {
      case "date_desc":
        list.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case "date_asc":
        list.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case "completion_desc":
        list.sort((a, b) => completionPct(b) - completionPct(a));
        break;
      case "completion_asc":
        list.sort((a, b) => completionPct(a) - completionPct(b));
        break;
      case "shift": {
        const order: Record<ShiftType, number> = {
          Early: 0,
          Late: 1,
          "Sleep-in": 2,
          "Wake-night": 3,
        };
        list.sort((a, b) => order[a.shiftType] - order[b.shiftType]);
        break;
      }
    }
    return list;
  }, [sortKey, filterShift]);

  // ── Export columns ─────────────────────────────────────────────────────────
  const exportColumns: ExportColumn<ShiftChecklist>[] = [
    { header: "ID", accessor: (r: ShiftChecklist) => r.id },
    { header: "Date", accessor: (r: ShiftChecklist) => r.date },
    { header: "Shift type", accessor: (r: ShiftChecklist) => r.shiftType },
    { header: "Shift start", accessor: (r: ShiftChecklist) => r.shiftStart },
    { header: "Shift end", accessor: (r: ShiftChecklist) => r.shiftEnd },
    {
      header: "Staff member",
      accessor: (r: ShiftChecklist) => getStaffName(r.staffMember),
    },
    {
      header: "Tasks complete",
      accessor: (r: ShiftChecklist) =>
        `${r.checks.filter((c) => c.completed).length}/${r.checks.length}`,
    },
    {
      header: "Completion %",
      accessor: (r: ShiftChecklist) => String(completionPct(r)),
    },
    {
      header: "All tasks complete",
      accessor: (r: ShiftChecklist) => (r.allTasksComplete ? "Yes" : "No"),
    },
    {
      header: "Escalations",
      accessor: (r: ShiftChecklist) => r.anyEscalations.join(" | "),
    },
    {
      header: "Key handover points",
      accessor: (r: ShiftChecklist) => r.keyHandoverPoints.join(" | "),
    },
    {
      header: "Child observations",
      accessor: (r: ShiftChecklist) => r.childObservations,
    },
    {
      header: "Staff wellbeing check-in",
      accessor: (r: ShiftChecklist) => r.staffWellbeingCheckIn,
    },
    {
      header: "Building secured",
      accessor: (r: ShiftChecklist) =>
        r.buildingSecurityChecked ? "Yes" : "No",
    },
    {
      header: "Medication cabinet locked",
      accessor: (r: ShiftChecklist) =>
        r.medicationCabinetLocked ? "Yes" : "No",
    },
    {
      header: "Pets cared for",
      accessor: (r: ShiftChecklist) => (r.petsCaredFor ? "Yes" : "No"),
    },
    {
      header: "Kitchen closed",
      accessor: (r: ShiftChecklist) => (r.kitchenClosed ? "Yes" : "No"),
    },
    {
      header: "Next shift staff",
      accessor: (r: ShiftChecklist) => getStaffName(r.nextShiftStaff),
    },
    {
      header: "Handover delivered",
      accessor: (r: ShiftChecklist) => (r.handoverDelivered ? "Yes" : "No"),
    },
  ];

  return (
    <PageShell
      title="End-of-Shift Checklist"
      subtitle="Standardised closing-down tasks completed by every member of staff before handover."
      actions={
        <div className="flex items-center gap-2">
          <ExportButton
            data={visible}
            columns={exportColumns}
            filename="end-of-shift-checklist"
          />
          <PrintButton title="End-of-Shift Checklists" />
        </div>
      }
    >
      {/* Banner */}
      <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
        <div className="flex items-start gap-3">
          <ClipboardCheck className="h-5 w-5 flex-shrink-0 text-indigo-700 mt-0.5" />
          <div className="text-sm text-indigo-900">
            <p className="font-semibold">
              Closing the shift well is part of safeguarding.
            </p>
            <p className="mt-1">
              A consistent end-of-shift discipline protects children's safety,
              continuity of medication, and quality of records — and gives the
              incoming team the steady foundation they need. Each completed
              checklist forms part of the evidence base for Quality Standard 13
              and Reg 33.
            </p>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 uppercase tracking-wide">
            <CalendarClock className="h-4 w-4" /> Shifts logged
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {summary.shiftsLogged}
          </div>
          <div className="mt-1 text-xs text-slate-500">recent shifts</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 uppercase tracking-wide">
            <CheckCircle2 className="h-4 w-4" /> Completion rate
          </div>
          <div
            className={cn(
              "mt-2 text-3xl font-semibold",
              summary.completionRate >= 95
                ? "text-emerald-700"
                : summary.completionRate >= 85
                  ? "text-amber-700"
                  : "text-rose-700",
            )}
          >
            {summary.completionRate}%
          </div>
          <div className="mt-1 text-xs text-slate-500">across all tasks</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 uppercase tracking-wide">
            <AlertTriangle className="h-4 w-4" /> Escalations (week)
          </div>
          <div
            className={cn(
              "mt-2 text-3xl font-semibold",
              summary.escalations === 0 ? "text-emerald-700" : "text-amber-700",
            )}
          >
            {summary.escalations}
          </div>
          <div className="mt-1 text-xs text-slate-500">last 7 days</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 uppercase tracking-wide">
            <Sparkles className="h-4 w-4" /> Avg tasks complete
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {summary.avgComplete}%
          </div>
          <div className="mt-1 text-xs text-slate-500">per shift</div>
        </div>
      </div>

      {/* Filters / sort */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600">Shift</span>
          <Select value={filterShift} onValueChange={setFilterShift}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Early">Early</SelectItem>
              <SelectItem value="Late">Late</SelectItem>
              <SelectItem value="Sleep-in">Sleep-in</SelectItem>
              <SelectItem value="Wake-night">Wake-night</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-600">Sort by</span>
          <Select
            value={sortKey}
            onValueChange={(v: string) => setSortKey(v as SortKey)}
          >
            <SelectTrigger className="w-[220px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_desc">Date (newest first)</SelectItem>
              <SelectItem value="date_asc">Date (oldest first)</SelectItem>
              <SelectItem value="completion_desc">
                Completion (highest)
              </SelectItem>
              <SelectItem value="completion_asc">
                Completion (lowest)
              </SelectItem>
              <SelectItem value="shift">Shift type</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="ml-auto text-xs text-slate-500">
          Showing {visible.length} of {RECORDS.length}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {visible.map((r) => {
          const isOpen = expandedId === r.id;
          const pct = completionPct(r);
          const totalDone = r.checks.filter((c) => c.completed).length;
          return (
            <div
              key={r.id}
              className="rounded-lg border border-slate-200 bg-white shadow-sm"
            >
              {/* Header */}
              <button
                type="button"
                onClick={() =>
                  setExpandedId((current) => (current === r.id ? null : r.id))
                }
                className="flex w-full items-start justify-between gap-4 p-4 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {getStaffName(r.staffMember)}
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-xs font-medium",
                        shiftColour(r.shiftType),
                      )}
                    >
                      {r.shiftType}
                    </span>
                    {r.allTasksComplete ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        All complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Outstanding
                      </span>
                    )}
                    {r.anyEscalations.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-800">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Escalation
                      </span>
                    )}
                    <span className="text-sm font-semibold text-slate-700">
                      {totalDone}/{r.checks.length} ({pct}%)
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {formatPretty(r.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {r.shiftStart}–{r.shiftEnd}
                    </span>
                    <span className="flex items-center gap-1">
                      <ArrowRightLeft className="h-3.5 w-3.5" />
                      Handover to {getStaffName(r.nextShiftStaff)}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 pt-1">
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Body */}
              {isOpen && (
                <div className="border-t border-slate-200 p-4 space-y-5">
                  {/* Closing-down summary */}
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div
                      className={cn(
                        "rounded-md border p-3",
                        r.buildingSecurityChecked
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-rose-200 bg-rose-50",
                      )}
                    >
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <Lock className="h-4 w-4" /> Building secured
                      </div>
                      <div
                        className={cn(
                          "mt-1 text-sm font-semibold",
                          r.buildingSecurityChecked
                            ? "text-emerald-800"
                            : "text-rose-800",
                        )}
                      >
                        {r.buildingSecurityChecked ? "Yes" : "No"}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "rounded-md border p-3",
                        r.medicationCabinetLocked
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-rose-200 bg-rose-50",
                      )}
                    >
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <Pill className="h-4 w-4" /> Med cabinet locked
                      </div>
                      <div
                        className={cn(
                          "mt-1 text-sm font-semibold",
                          r.medicationCabinetLocked
                            ? "text-emerald-800"
                            : "text-rose-800",
                        )}
                      >
                        {r.medicationCabinetLocked ? "Yes" : "No"}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "rounded-md border p-3",
                        r.kitchenClosed
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-rose-200 bg-rose-50",
                      )}
                    >
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <ChefHat className="h-4 w-4" /> Kitchen closed
                      </div>
                      <div
                        className={cn(
                          "mt-1 text-sm font-semibold",
                          r.kitchenClosed
                            ? "text-emerald-800"
                            : "text-rose-800",
                        )}
                      >
                        {r.kitchenClosed ? "Yes" : "No"}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "rounded-md border p-3",
                        r.petsCaredFor
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-rose-200 bg-rose-50",
                      )}
                    >
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <PawPrint className="h-4 w-4" /> Pets cared for
                      </div>
                      <div
                        className={cn(
                          "mt-1 text-sm font-semibold",
                          r.petsCaredFor
                            ? "text-emerald-800"
                            : "text-rose-800",
                        )}
                      >
                        {r.petsCaredFor ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>

                  {/* Checks grouped by category */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
                      <ClipboardCheck className="h-4 w-4" /> Checklist items
                    </h3>
                    <div className="space-y-3">
                      {(
                        [
                          "Safeguarding",
                          "Medication",
                          "Environment & Security",
                          "Records",
                          "Children's wellbeing",
                          "Communication",
                        ] as CheckCategory[]
                      ).map((cat) => {
                        const items = r.checks.filter((c) => c.category === cat);
                        if (items.length === 0) return null;
                        return (
                          <div
                            key={cat}
                            className="rounded-md border border-slate-200"
                          >
                            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 uppercase tracking-wide">
                              {categoryIcon[cat]}
                              {cat}
                            </div>
                            <ul className="divide-y divide-slate-100">
                              {items.map((it, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-3 px-3 py-2 text-sm"
                                >
                                  {it.completed ? (
                                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600 mt-0.5" />
                                  ) : (
                                    <XCircle className="h-4 w-4 flex-shrink-0 text-rose-600 mt-0.5" />
                                  )}
                                  <div className="flex-1">
                                    <div
                                      className={cn(
                                        "text-slate-800",
                                        !it.completed && "font-medium",
                                      )}
                                    >
                                      {it.item}
                                    </div>
                                    {it.notes && (
                                      <div className="mt-1 text-xs text-slate-600 italic">
                                        {it.notes}
                                      </div>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Escalations */}
                  {r.anyEscalations.length > 0 && (
                    <div className="rounded-md border border-rose-200 bg-rose-50 p-3">
                      <h4 className="text-sm font-semibold text-rose-900 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> Escalations during
                        shift
                      </h4>
                      <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-rose-900">
                        {r.anyEscalations.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key handover points */}
                  <div className="rounded-md border border-indigo-200 bg-indigo-50 p-3">
                    <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                      <ArrowRightLeft className="h-4 w-4" /> Key handover points
                    </h4>
                    {r.keyHandoverPoints.length > 0 ? (
                      <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-indigo-900">
                        {r.keyHandoverPoints.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-indigo-800 italic">
                        Nothing additional handed over.
                      </p>
                    )}
                  </div>

                  {/* Observations + wellbeing */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-md border border-slate-200 p-3">
                      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Heart className="h-4 w-4" /> Child observations
                      </h4>
                      <p className="mt-1 text-sm text-slate-700">
                        {r.childObservations}
                      </p>
                    </div>
                    <div className="rounded-md border border-slate-200 p-3">
                      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Users className="h-4 w-4" /> Staff wellbeing check-in
                      </h4>
                      <p className="mt-1 text-sm text-slate-700">
                        {r.staffWellbeingCheckIn}
                      </p>
                    </div>
                  </div>

                  {/* Footer line */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-500 border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Record ID: {r.id}
                    </span>
                    <span className="flex items-center gap-1">
                      <ArrowRightLeft className="h-3.5 w-3.5" />
                      Handover delivered:{" "}
                      <span
                        className={cn(
                          "font-medium",
                          r.handoverDelivered
                            ? "text-emerald-700"
                            : "text-rose-700",
                        )}
                      >
                        {r.handoverDelivered ? "Yes" : "No"}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {visible.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No checklists match the current filters.
          </div>
        )}
      </div>

      {/* Regulatory note */}
      <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <BookOpen className="h-4 w-4" /> Regulatory basis
        </h3>
        <p>
          The Children's Homes (England) Regulations 2015 — Quality Standard 13
          (Leadership and Management) requires the Registered Manager to ensure
          staff work as a team and that systems for safeguarding, medication,
          environment, and records are robust at every transition between
          shifts. Reg 33 visits ask the Independent Person to confirm that
          children are effectively safeguarded and that information flows
          reliably between staff. A standardised end-of-shift checklist — with
          consistent escalation and handover behaviour — is one of the clearest
          direct evidence sources for both, feeding Reg 45 quality of care
          reviews and the SCCIF self-evaluation.
        </p>
      </div>
    </PageShell>
  );
}
