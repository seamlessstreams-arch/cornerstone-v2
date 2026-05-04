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
  Sparkles,
  Clock,
  CheckCircle,
  Heart,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SensoryRoomUse {
  id: string;
  youngPerson: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  initiatedBy: "Self" | "Staff prompted" | "Routine scheduled" | "Crisis de-escalation";
  preceedingState: string;
  preStateRating: number;
  toolsUsed: string[];
  staffPresent: string[];
  postStateRating: number;
  effectivenessRating: number;
  childComment: string;
  staffObservation: string;
  outcomesAchieved: string[];
  followUpNeeded: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: SensoryRoomUse[] = [
  {
    id: "sru-001",
    youngPerson: "yp_casey",
    date: d(-1),
    startTime: "16:30",
    endTime: "17:15",
    durationMinutes: 45,
    initiatedBy: "Self",
    preceedingState: "Casey came home from school agitated — sensory overload from noisy assembly. Came straight to sensory space without prompting.",
    preStateRating: 3,
    toolsUsed: ["Weighted lap blanket", "Bubble lamp (slow setting)", "Brown noise speaker", "Putty fidget", "Low lighting"],
    staffPresent: ["staff_anna"],
    postStateRating: 8,
    effectivenessRating: 5,
    childComment: "I needed it. The bubbles helped my brain go slow.",
    staffObservation: "Casey self-regulated independently. Anna present but not interactive — Casey directed. After 45 mins, Casey emerged calm, asked for snack, joined evening routine without difficulty.",
    outcomesAchieved: [
      "Self-initiated regulation (huge milestone)",
      "Avoided escalation",
      "Joined evening routine after",
    ],
    followUpNeeded: "None — self-managed beautifully. Note self-initiation in care plan as growing capacity.",
  },
  {
    id: "sru-002",
    youngPerson: "yp_alex",
    date: d(-2),
    startTime: "20:15",
    endTime: "20:45",
    durationMinutes: 30,
    initiatedBy: "Staff prompted",
    preceedingState: "Alex argument with Jordan over gaming console. Voice raised. Anna suggested taking a moment in sensory space.",
    preStateRating: 4,
    toolsUsed: ["Beanbag", "Weighted blanket", "Music (Alex's playlist)", "Stress ball"],
    staffPresent: ["staff_anna"],
    postStateRating: 7,
    effectivenessRating: 4,
    childComment: "It was good. I needed to chill out. I didn't realise I was that wound up.",
    staffObservation: "Alex initially reluctant but engaged after 5 minutes. Used the time well. Returned to lounge ready to repair with Jordan.",
    outcomesAchieved: [
      "Avoided escalation into incident",
      "Self-awareness developed",
      "Restorative conversation followed",
    ],
    followUpNeeded: "Restorative conversation between Alex and Jordan held same evening. No further action.",
  },
  {
    id: "sru-003",
    youngPerson: "yp_casey",
    date: d(-3),
    startTime: "09:30",
    endTime: "09:50",
    durationMinutes: 20,
    initiatedBy: "Routine scheduled",
    preceedingState: "Casey's morning routine — proactive sensory regulation before school. Visual schedule includes 20-min sensory time.",
    preStateRating: 6,
    toolsUsed: ["Weighted lap blanket", "Visual timer", "Brown noise"],
    staffPresent: ["staff_anna"],
    postStateRating: 8,
    effectivenessRating: 5,
    childComment: "[Pointed at green visual feeling card]",
    staffObservation: "Routine sensory time builds capacity. Casey enters school regulated. Strong evidence base for proactive use.",
    outcomesAchieved: [
      "School transition went smoothly",
      "No school-day dysregulation reported",
    ],
    followUpNeeded: "Continue daily routine. Working very well.",
  },
  {
    id: "sru-004",
    youngPerson: "yp_jordan",
    date: d(-5),
    startTime: "21:00",
    endTime: "21:25",
    durationMinutes: 25,
    initiatedBy: "Staff prompted",
    preceedingState: "Jordan visibly low after phone call with Mum (Mum upset on call). Chervelle suggested sensory room as space.",
    preStateRating: 4,
    toolsUsed: ["Beanbag", "Weighted blanket", "Music (Jordan's playlist)"],
    staffPresent: ["staff_chervelle"],
    postStateRating: 6,
    effectivenessRating: 3,
    childComment: "Music helped. I'm not over it but I'm okay.",
    staffObservation: "Sensory room used for emotional regulation, not just sensory. Jordan engaged with quiet music. Chervelle present without intrusion. Helped move through, not through.",
    outcomesAchieved: [
      "Provided private, regulating space",
      "Music as comfort tool",
      "Bridge to bedtime",
    ],
    followUpNeeded: "Key working session next day to talk about call. Therapy session within 5 days flagged.",
  },
  {
    id: "sru-005",
    youngPerson: "yp_casey",
    date: d(-7),
    startTime: "14:00",
    endTime: "15:30",
    durationMinutes: 90,
    initiatedBy: "Crisis de-escalation",
    preceedingState: "Major sensory crisis triggered by school trip cancellation announcement (last-minute change). Casey rocking, hands over ears, vocal distress.",
    preStateRating: 1,
    toolsUsed: ["Weighted blanket (heavy)", "Compression vest", "Total darkness", "White noise (Casey's specific track)", "Otter (soft toy)", "No talking"],
    staffPresent: ["staff_anna"],
    postStateRating: 6,
    effectivenessRating: 4,
    childComment: "[Communicated by visual feeling cards over 90 mins]",
    staffObservation: "Significant sensory crisis. Anna provided silent, low-stim presence. Used full sensory toolkit. Recovery slow but steady. After 60 mins Casey began to settle. After 90 mins able to communicate via cards. Never fully verbal that afternoon.",
    outcomesAchieved: [
      "Avoided escalation to physical distress",
      "Casey's protocol followed precisely",
      "Recovery without intervention from CAMHS",
    ],
    followUpNeeded: "Trip change communication review — visual schedule must be updated SIMULTANEOUSLY with verbal change. Lessons for school.",
  },
  {
    id: "sru-006",
    youngPerson: "yp_alex",
    date: d(-10),
    startTime: "19:45",
    endTime: "20:00",
    durationMinutes: 15,
    initiatedBy: "Self",
    preceedingState: "Alex feeling 'wound up' after homework challenge. Asked to use sensory space briefly.",
    preStateRating: 5,
    toolsUsed: ["Stress ball", "Music", "Beanbag"],
    staffPresent: [],
    postStateRating: 7,
    effectivenessRating: 4,
    childComment: "Just needed 15 mins. Sorted now.",
    staffObservation: "Alex self-managed. 15 mins sufficient. Returned to homework with renewed focus. Self-awareness and self-care evident.",
    outcomesAchieved: [
      "Self-regulation",
      "Returned to task",
      "Built self-knowledge",
    ],
    followUpNeeded: "None — celebrate self-initiation in next key working.",
  },
  {
    id: "sru-007",
    youngPerson: "yp_jordan",
    date: d(-14),
    startTime: "17:00",
    endTime: "17:30",
    durationMinutes: 30,
    initiatedBy: "Self",
    preceedingState: "Jordan came home from football practice tired and overstimulated. Asked for quiet time in sensory space.",
    preStateRating: 6,
    toolsUsed: ["Beanbag", "Music (chill playlist)", "Phone (low scroll)"],
    staffPresent: [],
    postStateRating: 8,
    effectivenessRating: 4,
    childComment: "Just zoning out. I'm good.",
    staffObservation: "Jordan using sensory space proactively for downtime. Healthy use. Models well for other young people.",
    outcomesAchieved: [
      "Downtime regulation",
      "Pre-dinner reset",
    ],
    followUpNeeded: "None.",
  },
];

const initiatedByColour: Record<string, string> = {
  "Self": "bg-green-100 text-green-800",
  "Staff prompted": "bg-blue-100 text-blue-800",
  "Routine scheduled": "bg-purple-100 text-purple-800",
  "Crisis de-escalation": "bg-red-100 text-red-800",
};

const exportCols: ExportColumn<SensoryRoomUse>[] = [
  { header: "Young Person", accessor: (r: SensoryRoomUse) => getYPName(r.youngPerson) },
  { header: "Date", accessor: (r: SensoryRoomUse) => r.date },
  { header: "Duration (min)", accessor: (r: SensoryRoomUse) => String(r.durationMinutes) },
  { header: "Initiated By", accessor: (r: SensoryRoomUse) => r.initiatedBy },
  { header: "Pre State", accessor: (r: SensoryRoomUse) => `${r.preStateRating}/10` },
  { header: "Post State", accessor: (r: SensoryRoomUse) => `${r.postStateRating}/10` },
  { header: "Improvement", accessor: (r: SensoryRoomUse) => String(r.postStateRating - r.preStateRating) },
  { header: "Effectiveness", accessor: (r: SensoryRoomUse) => `${r.effectivenessRating}/5` },
];

export default function SensoryRoomUsagePage() {
  const [filterYP, setFilterYP] = useState("all");
  const [filterInitiated, setFilterInitiated] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterYP !== "all") items = items.filter((u) => u.youngPerson === filterYP);
    if (filterInitiated !== "all") items = items.filter((u) => u.initiatedBy === filterInitiated);
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.date.localeCompare(a.date);
        case "improvement":
          return (b.postStateRating - b.preStateRating) - (a.postStateRating - a.preStateRating);
        case "duration":
          return b.durationMinutes - a.durationMinutes;
        default:
          return 0;
      }
    });
    return items;
  }, [filterYP, filterInitiated, sortBy]);

  const total = data.length;
  const selfInitiated = data.filter((u) => u.initiatedBy === "Self").length;
  const avgImprovement = (data.reduce((sum, u) => sum + (u.postStateRating - u.preStateRating), 0) / data.length).toFixed(1);
  const totalMinutes = data.reduce((sum, u) => sum + u.durationMinutes, 0);

  return (
    <PageShell
      title="Sensory Room Usage"
      subtitle="Records of sensory regulation space use — self-initiated, staff-prompted, scheduled, and crisis"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="sensory-room-usage" />
          <PrintButton title="Sensory Room Usage" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Recent Uses</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{selfInitiated}</p>
          <p className="text-xs text-muted-foreground">Self-Initiated</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">+{avgImprovement}</p>
          <p className="text-xs text-muted-foreground">Avg State Improvement</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{totalMinutes}m</p>
          <p className="text-xs text-muted-foreground">Total Time</p>
        </div>
      </div>

      <div className="rounded-lg bg-purple-50 border border-purple-200 p-3 mb-6 flex items-start gap-2">
        <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
        <p className="text-sm text-purple-800">
          The sensory space is a regulating tool, not a punishment or seclusion. Children can self-initiate
          its use; staff may suggest it; routines may include it; and it can be used for crisis de-escalation
          with full child consent. Never used as restraint or restriction.
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
        <Select value={filterInitiated} onValueChange={setFilterInitiated}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Initiations" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Initiations</SelectItem>
            <SelectItem value="Self">Self</SelectItem>
            <SelectItem value="Staff prompted">Staff prompted</SelectItem>
            <SelectItem value="Routine scheduled">Routine scheduled</SelectItem>
            <SelectItem value="Crisis de-escalation">Crisis de-escalation</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Most Recent</SelectItem>
              <SelectItem value="improvement">Best Improvement</SelectItem>
              <SelectItem value="duration">Longest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((u) => {
          const isExpanded = expandedId === u.id;
          const improvement = u.postStateRating - u.preStateRating;

          return (
            <div key={u.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : u.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Sparkles className="h-5 w-5 text-purple-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{getYPName(u.youngPerson)} &middot; {u.date} {u.startTime}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {u.durationMinutes} mins &middot; {u.preStateRating}/10 → {u.postStateRating}/10 &middot; {u.toolsUsed.length} tools
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", initiatedByColour[u.initiatedBy])}>
                    {u.initiatedBy}
                  </span>
                  <span className={cn("text-sm font-bold", improvement >= 3 ? "text-green-600" : improvement >= 1 ? "text-blue-600" : "text-amber-600")}>+{improvement}</span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Preceding State (rated {u.preStateRating}/10)</p>
                    <p className="text-sm">{u.preceedingState}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Tools Used</p>
                    <div className="flex flex-wrap gap-1">
                      {u.toolsUsed.map((t, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Child&apos;s Comment</p>
                    <p className="text-sm italic">&ldquo;{u.childComment}&rdquo;</p>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">Post State (rated {u.postStateRating}/10) &middot; Effectiveness {u.effectivenessRating}/5</p>
                    <p className="text-sm">{u.staffObservation}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Outcomes Achieved</p>
                    <ul className="space-y-1">
                      {u.outcomesAchieved.map((o, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <CheckCircle className="h-3 w-3 text-emerald-500 mt-1 shrink-0" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {u.followUpNeeded && (
                    <div className="bg-slate-50 rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">Follow-Up</p>
                      <p className="text-sm">{u.followUpNeeded}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span><Clock className="h-3 w-3 inline mr-1" />{u.startTime} – {u.endTime}</span>
                    <span><Eye className="h-3 w-3 inline mr-1" />{u.staffPresent.length === 0 ? "No staff present" : `Staff: ${u.staffPresent.map(getStaffName).join(", ")}`}</span>
                    <span><Heart className="h-3 w-3 inline mr-1" />Effectiveness: {u.effectivenessRating}/5</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Sensory room usage records support Quality Standard 7 (health
          and wellbeing), Quality Standard 5 (protection — non-restrictive practice), and trauma-informed
          care principles. Use is always voluntary and child-led. Linked to Sensory Profiles, Behaviour
          Support Plans, and Bedtime/Wake-Up Routines.
        </p>
      </div>
    </PageShell>
  );
}
