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
  Sparkles,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CleaningEntry {
  id: string;
  date: string;
  shift: "Morning" | "Late" | "Sleep-in" | "Wake-night" | "Deep clean (scheduled)";
  area: "Kitchen" | "Lounge" | "Hallway/Stairs" | "Office" | "Communal bathroom" | "Laundry" | "Garden/External" | "Sensory space" | "Children's bathrooms (with consent)" | "Whole home (deep clean)";
  staffMember: string;
  cleaningType: "Routine" | "Spot clean" | "Deep clean" | "Post-incident" | "Hygiene escalation";
  durationMinutes: number;
  tasksCompleted: { task: string; completed: boolean; notes: string }[];
  productsUsed: string[];
  alleryAware: boolean;
  childInvolvement: "None" | "Observed" | "Helped (age-appropriate)" | "Lead with support";
  childrenWhoHelped: string;
  childLearningPoints: string;
  itemsRequiringAttention: string[];
  defectsLogged: string[];
  followUpActions: string[];
  signedOff: boolean;
  signedOffBy: string;
  notes: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: CleaningEntry[] = [
  {
    id: "cl-001",
    date: d(0),
    shift: "Morning",
    area: "Kitchen",
    staffMember: "staff_anna",
    cleaningType: "Routine",
    durationMinutes: 30,
    tasksCompleted: [
      { task: "Surfaces wiped down", completed: true, notes: "Antibacterial spray used" },
      { task: "Fridge front and handle cleaned", completed: true, notes: "" },
      { task: "Hob and oven exterior cleaned", completed: true, notes: "" },
      { task: "Sink scrubbed", completed: true, notes: "" },
      { task: "Floor swept and mopped", completed: true, notes: "" },
      { task: "Bins emptied", completed: true, notes: "Recycling separated" },
      { task: "Kettle descaled (weekly)", completed: false, notes: "Done yesterday" },
    ],
    productsUsed: ["Antibacterial spray", "Fairy washing-up liquid", "Floor cleaner (eco-friendly)"],
    alleryAware: true,
    childInvolvement: "Helped (age-appropriate)",
    childrenWhoHelped: "Casey wiped own breakfast surface (independence skill)",
    childLearningPoints: "Casey enjoys structured cleaning task — adds to sensory routine",
    itemsRequiringAttention: [],
    defectsLogged: [],
    followUpActions: [],
    signedOff: true,
    signedOffBy: "staff_anna",
    notes: "Routine morning kitchen clean. Casey participated independently.",
  },
  {
    id: "cl-002",
    date: d(0),
    shift: "Late",
    area: "Lounge",
    staffMember: "staff_chervelle",
    cleaningType: "Routine",
    durationMinutes: 25,
    tasksCompleted: [
      { task: "Cushions plumped/replaced", completed: true, notes: "" },
      { task: "Surfaces dusted", completed: true, notes: "" },
      { task: "Floor vacuumed", completed: true, notes: "Sensory mat avoided" },
      { task: "Coffee table cleaned", completed: true, notes: "" },
      { task: "TV remote and gaming controllers wiped", completed: true, notes: "Antibacterial wipe" },
    ],
    productsUsed: ["Multi-surface spray", "Antibacterial wipes"],
    alleryAware: true,
    childInvolvement: "None",
    childrenWhoHelped: "",
    childLearningPoints: "",
    itemsRequiringAttention: [],
    defectsLogged: [],
    followUpActions: [],
    signedOff: true,
    signedOffBy: "staff_chervelle",
    notes: "Standard end-of-evening lounge tidy.",
  },
  {
    id: "cl-003",
    date: d(-1),
    shift: "Deep clean (scheduled)",
    area: "Whole home (deep clean)",
    staffMember: "staff_lackson",
    cleaningType: "Deep clean",
    durationMinutes: 240,
    tasksCompleted: [
      { task: "All surfaces (incl. high)", completed: true, notes: "" },
      { task: "Behind appliances kitchen", completed: true, notes: "" },
      { task: "All floors (mop + carpet shampoo)", completed: true, notes: "Carpet steam in lounge" },
      { task: "Communal bathrooms deep clean", completed: true, notes: "" },
      { task: "Skirting boards", completed: true, notes: "" },
      { task: "Curtains hoovered", completed: true, notes: "" },
      { task: "Light fittings dusted", completed: true, notes: "" },
      { task: "Inside cupboards (kitchen + storage)", completed: true, notes: "Out of date items removed" },
      { task: "External windows", completed: true, notes: "Contractor visited" },
    ],
    productsUsed: ["Multi-surface deep clean", "Carpet shampoo", "Bathroom limescale remover", "External window cleaning (contractor)"],
    alleryAware: true,
    childInvolvement: "Observed",
    childrenWhoHelped: "Children at school during day; returned to fresh home",
    childLearningPoints: "",
    itemsRequiringAttention: [
      "Lounge carpet showing wear — replacement budgeted for 2026/27",
    ],
    defectsLogged: [
      "Hairline crack in bathroom tile noted — maintenance log",
    ],
    followUpActions: [
      "Maintenance request raised for bathroom tile",
    ],
    signedOff: true,
    signedOffBy: "staff_darren",
    notes: "Quarterly deep clean. External window cleaning scheduled with contractor. Children returned to fresh home.",
  },
  {
    id: "cl-004",
    date: d(-2),
    shift: "Morning",
    area: "Communal bathroom",
    staffMember: "staff_mirela",
    cleaningType: "Routine",
    durationMinutes: 25,
    tasksCompleted: [
      { task: "Toilet thorough clean", completed: true, notes: "" },
      { task: "Sink and taps cleaned", completed: true, notes: "" },
      { task: "Shower thoroughly cleaned", completed: true, notes: "" },
      { task: "Floor mopped", completed: true, notes: "" },
      { task: "Bins emptied", completed: true, notes: "" },
      { task: "Toiletry stock checked", completed: true, notes: "Hand soap refilled" },
    ],
    productsUsed: ["Bathroom cleaner (eco)", "Limescale remover", "Floor cleaner"],
    alleryAware: true,
    childInvolvement: "None",
    childrenWhoHelped: "",
    childLearningPoints: "",
    itemsRequiringAttention: [],
    defectsLogged: [],
    followUpActions: [],
    signedOff: true,
    signedOffBy: "staff_mirela",
    notes: "Daily bathroom routine.",
  },
  {
    id: "cl-005",
    date: d(-3),
    shift: "Late",
    area: "Kitchen",
    staffMember: "staff_chervelle",
    cleaningType: "Hygiene escalation",
    durationMinutes: 45,
    tasksCompleted: [
      { task: "Standard kitchen clean", completed: true, notes: "" },
      { task: "Hob deep clean — extra (cooking incident)", completed: true, notes: "Sauce spillage during cooking session" },
      { task: "Floor extra mop", completed: true, notes: "" },
    ],
    productsUsed: ["Standard kitchen products", "Heavy-duty hob cleaner"],
    alleryAware: true,
    childInvolvement: "Helped (age-appropriate)",
    childrenWhoHelped: "Jordan helped clean up after his cooking session — accountability and skill",
    childLearningPoints: "Jordan understood the importance of cleaning after cooking",
    itemsRequiringAttention: [],
    defectsLogged: [],
    followUpActions: [],
    signedOff: true,
    signedOffBy: "staff_chervelle",
    notes: "Cultural cooking session generated more cleanup; Jordan participated.",
  },
  {
    id: "cl-006",
    date: d(-4),
    shift: "Late",
    area: "Sensory space",
    staffMember: "staff_anna",
    cleaningType: "Routine",
    durationMinutes: 20,
    tasksCompleted: [
      { task: "Bean bags spot-cleaned", completed: true, notes: "" },
      { task: "Weighted blankets aired", completed: true, notes: "" },
      { task: "Surfaces wiped (Casey-approved products only)", completed: true, notes: "Unscented" },
      { task: "Floor mopped (unscented eco product)", completed: true, notes: "Casey-friendly" },
    ],
    productsUsed: ["Unscented eco floor cleaner", "Casey's preferred surface spray (no fragrance)"],
    alleryAware: true,
    childInvolvement: "None",
    childrenWhoHelped: "",
    childLearningPoints: "",
    itemsRequiringAttention: [],
    defectsLogged: [],
    followUpActions: [],
    signedOff: true,
    signedOffBy: "staff_anna",
    notes: "Sensory space cleaned with sensory-aware products only — Casey's profile primary consideration.",
  },
  {
    id: "cl-007",
    date: d(-5),
    shift: "Morning",
    area: "Hallway/Stairs",
    staffMember: "staff_edward",
    cleaningType: "Routine",
    durationMinutes: 20,
    tasksCompleted: [
      { task: "Vacuumed", completed: true, notes: "" },
      { task: "Banisters wiped", completed: true, notes: "" },
      { task: "Door handles antibac wipe", completed: true, notes: "" },
      { task: "Coats organised", completed: true, notes: "" },
    ],
    productsUsed: ["Antibacterial wipes", "Multi-surface spray"],
    alleryAware: true,
    childInvolvement: "None",
    childrenWhoHelped: "",
    childLearningPoints: "",
    itemsRequiringAttention: [],
    defectsLogged: [],
    followUpActions: [],
    signedOff: true,
    signedOffBy: "staff_edward",
    notes: "Routine.",
  },
  {
    id: "cl-008",
    date: d(-7),
    shift: "Late",
    area: "Lounge",
    staffMember: "staff_chervelle",
    cleaningType: "Post-incident",
    durationMinutes: 30,
    tasksCompleted: [
      { task: "Standard lounge tidy", completed: true, notes: "" },
      { task: "Cushions replaced (one slightly damaged)", completed: true, notes: "Replaced same evening" },
      { task: "Floor swept + checked for fragments", completed: true, notes: "Nothing found" },
    ],
    productsUsed: ["Multi-surface", "Antibacterial"],
    alleryAware: true,
    childInvolvement: "Helped (age-appropriate)",
    childrenWhoHelped: "Alex helped tidy after restorative conversation — repair as accountability",
    childLearningPoints: "Cleaning together as part of restorative repair after incident",
    itemsRequiringAttention: [],
    defectsLogged: [],
    followUpActions: [],
    signedOff: true,
    signedOffBy: "staff_darren",
    notes: "Post-incident clean. Alex helped — restorative practice in action. Damaged cushion replaced same evening.",
  },
];

const cleaningTypeColour: Record<string, string> = {
  Routine: "bg-blue-100 text-blue-800",
  "Spot clean": "bg-emerald-100 text-emerald-800",
  "Deep clean": "bg-purple-100 text-purple-800",
  "Post-incident": "bg-amber-100 text-amber-800",
  "Hygiene escalation": "bg-red-100 text-red-800",
};

const exportCols: ExportColumn<CleaningEntry>[] = [
  { header: "Date", accessor: (r: CleaningEntry) => r.date },
  { header: "Shift", accessor: (r: CleaningEntry) => r.shift },
  { header: "Area", accessor: (r: CleaningEntry) => r.area },
  { header: "Staff", accessor: (r: CleaningEntry) => getStaffName(r.staffMember) },
  { header: "Type", accessor: (r: CleaningEntry) => r.cleaningType },
  { header: "Duration", accessor: (r: CleaningEntry) => `${r.durationMinutes}m` },
  { header: "Tasks Completed", accessor: (r: CleaningEntry) => `${r.tasksCompleted.filter((t) => t.completed).length}/${r.tasksCompleted.length}` },
  { header: "Child Involvement", accessor: (r: CleaningEntry) => r.childInvolvement },
];

export default function CleaningRotaPage() {
  const [filterType, setFilterType] = useState("all");
  const [filterArea, setFilterArea] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterType !== "all") items = items.filter((c) => c.cleaningType === filterType);
    if (filterArea !== "all") items = items.filter((c) => c.area === filterArea);
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.date.localeCompare(a.date);
        case "duration":
          return b.durationMinutes - a.durationMinutes;
        default:
          return 0;
      }
    });
    return items;
  }, [filterType, filterArea, sortBy]);

  const total = data.length;
  const totalMinutes = data.reduce((sum, c) => sum + c.durationMinutes, 0);
  const childInvolved = data.filter((c) => c.childInvolvement.startsWith("Helped") || c.childInvolvement.startsWith("Lead")).length;
  const allSignedOff = data.every((c) => c.signedOff);

  return (
    <PageShell
      title="Cleaning Rota"
      subtitle="Daily and deep cleaning records — areas, products, child involvement, and follow-up"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="cleaning-rota" />
          <PrintButton title="Cleaning Rota" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Cleaning Entries</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{Math.round(totalMinutes / 60)}h</p>
          <p className="text-xs text-muted-foreground">Total Time</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{childInvolved}</p>
          <p className="text-xs text-muted-foreground">Child Involvement</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{allSignedOff ? "100%" : `${data.filter((c) => c.signedOff).length}/${total}`}</p>
          <p className="text-xs text-muted-foreground">Signed Off</p>
        </div>
      </div>

      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 mb-6 flex items-start gap-2">
        <Sparkles className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
        <p className="text-sm text-emerald-800">
          A clean home is a homely home. Routine cleaning happens every shift; deep cleans quarterly;
          age-appropriate child involvement builds independence skills and accountability. Sensory-aware
          products used in Casey&apos;s spaces.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Routine">Routine</SelectItem>
            <SelectItem value="Spot clean">Spot Clean</SelectItem>
            <SelectItem value="Deep clean">Deep Clean</SelectItem>
            <SelectItem value="Post-incident">Post-Incident</SelectItem>
            <SelectItem value="Hygiene escalation">Hygiene Escalation</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterArea} onValueChange={setFilterArea}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Areas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            <SelectItem value="Kitchen">Kitchen</SelectItem>
            <SelectItem value="Lounge">Lounge</SelectItem>
            <SelectItem value="Hallway/Stairs">Hallway/Stairs</SelectItem>
            <SelectItem value="Office">Office</SelectItem>
            <SelectItem value="Communal bathroom">Communal Bathroom</SelectItem>
            <SelectItem value="Laundry">Laundry</SelectItem>
            <SelectItem value="Sensory space">Sensory Space</SelectItem>
            <SelectItem value="Garden/External">Garden/External</SelectItem>
            <SelectItem value="Whole home (deep clean)">Whole Home Deep Clean</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Most Recent</SelectItem>
              <SelectItem value="duration">Longest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => {
          const isExpanded = expandedId === c.id;
          const taskPct = Math.round((c.tasksCompleted.filter((t) => t.completed).length / c.tasksCompleted.length) * 100);

          return (
            <div key={c.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : c.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Sparkles className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{c.date} — {c.area} ({c.shift})</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getStaffName(c.staffMember)} &middot; {c.durationMinutes} mins &middot; {taskPct}% tasks
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", cleaningTypeColour[c.cleaningType])}>
                    {c.cleaningType}
                  </span>
                  {c.signedOff && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tasks Completed</p>
                    <div className="space-y-1">
                      {c.tasksCompleted.map((t, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm flex items-start gap-2">
                          {t.completed ? <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" /> : <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />}
                          <div className="flex-1">
                            <span className={cn(t.completed ? "text-slate-700" : "text-slate-500")}>{t.task}</span>
                            {t.notes && <p className="text-xs text-muted-foreground">{t.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Products Used</p>
                    <div className="flex flex-wrap gap-1">
                      {c.productsUsed.map((p, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{p}</span>
                      ))}
                    </div>
                    {c.alleryAware && <p className="text-xs text-emerald-700 mt-1"><CheckCircle className="h-3 w-3 inline mr-1" />Allergy-aware (Casey-friendly products in Casey&apos;s spaces)</p>}
                  </div>

                  {c.childInvolvement !== "None" && (
                    <div className="bg-pink-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1">Child Involvement</p>
                      <p className="text-sm font-medium">{c.childInvolvement}</p>
                      {c.childrenWhoHelped && <p className="text-sm">{c.childrenWhoHelped}</p>}
                      {c.childLearningPoints && <p className="text-xs text-pink-700 mt-1 italic">{c.childLearningPoints}</p>}
                    </div>
                  )}

                  {c.itemsRequiringAttention.length > 0 && (
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Items Requiring Attention</p>
                      <ul className="space-y-1">
                        {c.itemsRequiringAttention.map((it, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <AlertTriangle className="h-3 w-3 text-amber-500 mt-1 shrink-0" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {c.defectsLogged.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-800 uppercase tracking-wide mb-1">Defects Logged</p>
                      <ul className="space-y-1">
                        {c.defectsLogged.map((d, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-red-600 mt-0.5">•</span>
                            <span>{d}</span>
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
                    <span><Clock className="h-3 w-3 inline mr-1" />{c.durationMinutes} mins</span>
                    <span>Signed off: {c.signedOff ? getStaffName(c.signedOffBy) : "Pending"}</span>
                    <span><Calendar className="h-3 w-3 inline mr-1" />{c.shift}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Cleaning records support Quality Standard 5 (protection —
          hygiene), Quality Standard 7 (health and wellbeing), Reg 22 (records), Schedule 1 (homely
          environment), and infection control best practice. Linked to Kitchen Hygiene Monitoring,
          Maintenance Schedule, and Infection Control.
        </p>
      </div>
    </PageShell>
  );
}
