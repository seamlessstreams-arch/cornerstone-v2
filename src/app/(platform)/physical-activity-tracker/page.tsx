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
  Activity,
  Heart,
  TrendingUp,
  Clock,
  Star,
  Smile,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityEntry {
  id: string;
  youngPerson: string;
  date: string;
  activity: string;
  category: "Sport" | "Walking/Hiking" | "Cycling" | "Dance/Movement" | "Active play" | "Swimming" | "Gym" | "Outdoor adventure" | "Daily activity (e.g., school PE)" | "Active travel";
  intensity: "Light" | "Moderate" | "Vigorous";
  durationMinutes: number;
  initiatedBy: "Child" | "Routine" | "Staff suggested" | "Group activity";
  staffPresent: string;
  location: string;
  enjoymentRating: number;
  socialAspect: "Solo" | "With staff" | "With friend" | "Team" | "Family";
  childComment: string;
  staffObservation: string;
  partOfWeeklyTarget: boolean;
  contributesToOutcome: string;
  notes: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: ActivityEntry[] = [
  {
    id: "act-001",
    youngPerson: "yp_alex",
    date: d(-1),
    activity: "Boxing club training session",
    category: "Sport",
    intensity: "Vigorous",
    durationMinutes: 90,
    initiatedBy: "Routine",
    staffPresent: "staff_lackson",
    location: "Riverside Boxing Gym",
    enjoymentRating: 5,
    socialAspect: "Team",
    childComment: "Smashed it tonight. Coach said I'm getting really technical now.",
    staffObservation: "Alex full energy. Strong technical progress noted by coach. Identity-protective activity at its best.",
    partOfWeeklyTarget: true,
    contributesToOutcome: "Identity, regulation, sustained engagement (twice weekly)",
    notes: "Twice-weekly boxing is core to Alex's wellbeing. Coach builds him up.",
  },
  {
    id: "act-002",
    youngPerson: "yp_jordan",
    date: d(-2),
    activity: "Football match (away) — Riverside FC vs Westside",
    category: "Sport",
    intensity: "Vigorous",
    durationMinutes: 120,
    initiatedBy: "Routine",
    staffPresent: "staff_edward",
    location: "Riverside Recreation Ground (away)",
    enjoymentRating: 5,
    socialAspect: "Team",
    childComment: "We won 3-1, I scored. Coach said captain's leadership stood out.",
    staffObservation: "Jordan thrived. Leadership evident on the pitch. Post-match team meal — strong sense of belonging.",
    partOfWeeklyTarget: true,
    contributesToOutcome: "Identity, peer relationships, leadership skills, physical health",
    notes: "Match days are highlight of Jordan's week. Strong protective factor.",
  },
  {
    id: "act-003",
    youngPerson: "yp_casey",
    date: d(-3),
    activity: "Nature walk at local woodland",
    category: "Walking/Hiking",
    intensity: "Moderate",
    durationMinutes: 90,
    initiatedBy: "Child",
    staffPresent: "staff_anna",
    location: "Riverside Nature Reserve",
    enjoymentRating: 5,
    socialAspect: "With staff",
    childComment: "[Casey pointed at green visual feeling card and at deer footprints found]",
    staffObservation: "Casey requested the walk after seeing the visual schedule slot. Found deer footprints, photographed them, animated discussion using familiar vocabulary. Sensory-friendly setting. Casey paced selves well.",
    partOfWeeklyTarget: true,
    contributesToOutcome: "Sensory regulation, identity, low-stim physical activity",
    notes: "Nature walks are Casey's chosen form of activity — quiet, exploratory, animal-connected.",
  },
  {
    id: "act-004",
    youngPerson: "yp_alex",
    date: d(-4),
    activity: "School PE — basketball",
    category: "Daily activity (e.g., school PE)",
    intensity: "Moderate",
    durationMinutes: 60,
    initiatedBy: "Routine",
    staffPresent: "School staff (PE teacher)",
    location: "School gym",
    enjoymentRating: 4,
    socialAspect: "Team",
    childComment: "Basketball's alright. Not boxing but I'm getting better at it.",
    staffObservation: "Reported via school. Engaged well. Selected for next inter-school basketball — Alex agreed.",
    partOfWeeklyTarget: true,
    contributesToOutcome: "Education engagement, peer relationships, transferable physical skills",
    notes: "PE engagement strong this term — significant change from previous year.",
  },
  {
    id: "act-005",
    youngPerson: "yp_jordan",
    date: d(-5),
    activity: "Football training",
    category: "Sport",
    intensity: "Vigorous",
    durationMinutes: 90,
    initiatedBy: "Routine",
    staffPresent: "staff_edward",
    location: "Riverside Recreation Ground",
    enjoymentRating: 5,
    socialAspect: "Team",
    childComment: "Coach is doing tactical work for Saturday. I'm liking it.",
    staffObservation: "Engaged through full session. Tactical thinking developing. Coach values Jordan as captain.",
    partOfWeeklyTarget: true,
    contributesToOutcome: "Identity, leadership, physical health, peer relationships",
    notes: "",
  },
  {
    id: "act-006",
    youngPerson: "yp_casey",
    date: d(-6),
    activity: "Library walk (active travel) and short woodland loop",
    category: "Active travel",
    intensity: "Light",
    durationMinutes: 45,
    initiatedBy: "Routine",
    staffPresent: "staff_anna",
    location: "Library route",
    enjoymentRating: 4,
    socialAspect: "With staff",
    childComment: "[Visual cards: walking + green]",
    staffObservation: "Active travel route to library. Casey wore comfortable shoes; pace good. Returned settled.",
    partOfWeeklyTarget: true,
    contributesToOutcome: "Active travel habit, low-stim activity",
    notes: "Active travel embedded as part of routine where possible.",
  },
  {
    id: "act-007",
    youngPerson: "yp_alex",
    date: d(-6),
    activity: "Boxing club session",
    category: "Sport",
    intensity: "Vigorous",
    durationMinutes: 90,
    initiatedBy: "Routine",
    staffPresent: "staff_lackson",
    location: "Riverside Boxing Gym",
    enjoymentRating: 5,
    socialAspect: "Team",
    childComment: "Felt powerful tonight.",
    staffObservation: "Alex regulated through physical exertion. Good emotional state after.",
    partOfWeeklyTarget: true,
    contributesToOutcome: "Identity, regulation, peer connection",
    notes: "",
  },
  {
    id: "act-008",
    youngPerson: "yp_jordan",
    date: d(-9),
    activity: "Cousin Devon visit — kickabout in garden",
    category: "Active play",
    intensity: "Moderate",
    durationMinutes: 75,
    initiatedBy: "Child",
    staffPresent: "staff_chervelle",
    location: "Oak House garden",
    enjoymentRating: 5,
    socialAspect: "Family",
    childComment: "Devon's getting better. Good to see him.",
    staffObservation: "Sustained physical play. Cousin connection important. Sociable, light-hearted.",
    partOfWeeklyTarget: true,
    contributesToOutcome: "Family connection, peer play, physical activity",
    notes: "",
  },
  {
    id: "act-009",
    youngPerson: "yp_casey",
    date: d(-10),
    activity: "Sensory play — tactile garden activity",
    category: "Active play",
    intensity: "Light",
    durationMinutes: 30,
    initiatedBy: "Child",
    staffPresent: "staff_anna",
    location: "Garden",
    enjoymentRating: 4,
    socialAspect: "With staff",
    childComment: "[Pointed at chosen tactile materials — leaves, bark, water]",
    staffObservation: "Casey self-initiated. Sensory garden activity blends light physical movement with regulation.",
    partOfWeeklyTarget: false,
    contributesToOutcome: "Sensory regulation, light physical activity",
    notes: "",
  },
  {
    id: "act-010",
    youngPerson: "yp_alex",
    date: d(-10),
    activity: "Walk to school (active travel)",
    category: "Active travel",
    intensity: "Light",
    durationMinutes: 25,
    initiatedBy: "Routine",
    staffPresent: "staff_edward",
    location: "School route",
    enjoymentRating: 4,
    socialAspect: "With staff",
    childComment: "Better than the bus. Wakes me up.",
    staffObservation: "Active travel to school 3x weekly. Helps with ADHD-related morning regulation.",
    partOfWeeklyTarget: true,
    contributesToOutcome: "Active travel habit, regulation, education engagement",
    notes: "",
  },
];

const categoryColour: Record<string, string> = {
  "Sport": "bg-red-100 text-red-800",
  "Walking/Hiking": "bg-emerald-100 text-emerald-800",
  "Cycling": "bg-blue-100 text-blue-800",
  "Dance/Movement": "bg-pink-100 text-pink-800",
  "Active play": "bg-amber-100 text-amber-800",
  "Swimming": "bg-cyan-100 text-cyan-800",
  "Gym": "bg-purple-100 text-purple-800",
  "Outdoor adventure": "bg-emerald-100 text-emerald-800",
  "Daily activity (e.g., school PE)": "bg-slate-100 text-slate-800",
  "Active travel": "bg-blue-100 text-blue-800",
};

const intensityColour: Record<string, string> = {
  Light: "bg-blue-100 text-blue-800",
  Moderate: "bg-amber-100 text-amber-800",
  Vigorous: "bg-red-100 text-red-800",
};

const exportCols: ExportColumn<ActivityEntry>[] = [
  { header: "Young Person", accessor: (r: ActivityEntry) => getYPName(r.youngPerson) },
  { header: "Date", accessor: (r: ActivityEntry) => r.date },
  { header: "Activity", accessor: (r: ActivityEntry) => r.activity },
  { header: "Category", accessor: (r: ActivityEntry) => r.category },
  { header: "Intensity", accessor: (r: ActivityEntry) => r.intensity },
  { header: "Duration (min)", accessor: (r: ActivityEntry) => String(r.durationMinutes) },
  { header: "Initiated By", accessor: (r: ActivityEntry) => r.initiatedBy },
  { header: "Enjoyment", accessor: (r: ActivityEntry) => `${r.enjoymentRating}/5` },
  { header: "Social", accessor: (r: ActivityEntry) => r.socialAspect },
];

export default function PhysicalActivityTrackerPage() {
  const [filterYP, setFilterYP] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterIntensity, setFilterIntensity] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterYP !== "all") items = items.filter((a) => a.youngPerson === filterYP);
    if (filterCategory !== "all") items = items.filter((a) => a.category === filterCategory);
    if (filterIntensity !== "all") items = items.filter((a) => a.intensity === filterIntensity);
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.date.localeCompare(a.date);
        case "duration":
          return b.durationMinutes - a.durationMinutes;
        case "enjoyment":
          return b.enjoymentRating - a.enjoymentRating;
        default:
          return 0;
      }
    });
    return items;
  }, [filterYP, filterCategory, filterIntensity, sortBy]);

  const total = data.length;
  const totalMinutes = data.reduce((sum, a) => sum + a.durationMinutes, 0);
  const childInitiated = data.filter((a) => a.initiatedBy === "Child").length;
  const avgEnjoyment = (data.reduce((sum, a) => sum + a.enjoymentRating, 0) / data.length).toFixed(1);

  return (
    <PageShell
      title="Physical Activity Tracker"
      subtitle="Per-child physical activity — variety, enjoyment, identity, regulation"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="physical-activity-tracker" />
          <PrintButton title="Physical Activity Tracker" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Recent Activities</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{Math.round(totalMinutes / 60)}h</p>
          <p className="text-xs text-muted-foreground">Total Minutes</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{childInitiated}</p>
          <p className="text-xs text-muted-foreground">Child-Initiated</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{avgEnjoyment}/5</p>
          <p className="text-xs text-muted-foreground">Avg Enjoyment</p>
        </div>
      </div>

      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 mb-6 flex items-start gap-2">
        <Activity className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
        <p className="text-sm text-emerald-800">
          Physical activity is enjoyment, identity, regulation, and health all at once. We track variety,
          intensity, and child voice — the goal isn&apos;t a step count, it&apos;s a thriving body and a
          curious mind. Every child&apos;s activity profile looks different, and that&apos;s the point.
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
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Sport">Sport</SelectItem>
            <SelectItem value="Walking/Hiking">Walking/Hiking</SelectItem>
            <SelectItem value="Cycling">Cycling</SelectItem>
            <SelectItem value="Dance/Movement">Dance/Movement</SelectItem>
            <SelectItem value="Active play">Active Play</SelectItem>
            <SelectItem value="Swimming">Swimming</SelectItem>
            <SelectItem value="Gym">Gym</SelectItem>
            <SelectItem value="Outdoor adventure">Outdoor Adventure</SelectItem>
            <SelectItem value="Daily activity (e.g., school PE)">Daily / School PE</SelectItem>
            <SelectItem value="Active travel">Active Travel</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterIntensity} onValueChange={setFilterIntensity}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="All Intensity" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Intensities</SelectItem>
            <SelectItem value="Light">Light</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="Vigorous">Vigorous</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Most Recent</SelectItem>
              <SelectItem value="duration">Longest First</SelectItem>
              <SelectItem value="enjoyment">Most Enjoyed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((a) => {
          const isExpanded = expandedId === a.id;

          return (
            <div key={a.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : a.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Activity className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{a.activity}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {a.date} &middot; {getYPName(a.youngPerson)} &middot; {a.durationMinutes} mins &middot; {a.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", categoryColour[a.category])}>
                    {a.category}
                  </span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", intensityColour[a.intensity])}>
                    {a.intensity}
                  </span>
                  <span className="text-sm font-bold text-amber-600">{a.enjoymentRating}/5</span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-white rounded-lg p-2 border text-center">
                      <p className="text-xs text-muted-foreground">Initiated By</p>
                      <p className="text-sm font-medium">{a.initiatedBy}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center">
                      <p className="text-xs text-muted-foreground">Social</p>
                      <p className="text-sm font-medium">{a.socialAspect}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center">
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-medium">{a.durationMinutes} mins</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center">
                      <p className="text-xs text-muted-foreground">Enjoyment</p>
                      <p className="text-sm font-medium">{a.enjoymentRating}/5</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">
                      <Smile className="h-3 w-3 inline mr-1" />Child&apos;s Comment
                    </p>
                    <p className="text-sm italic">&ldquo;{a.childComment}&rdquo;</p>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">Staff Observation</p>
                    <p className="text-sm">{a.staffObservation}</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">
                      <TrendingUp className="h-3 w-3 inline mr-1" />Contributes To
                    </p>
                    <p className="text-sm">{a.contributesToOutcome}</p>
                  </div>

                  {a.notes && (
                    <div className="bg-slate-50 rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-sm">{a.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span><Clock className="h-3 w-3 inline mr-1" />{a.durationMinutes} mins</span>
                    <span>Staff: {a.staffPresent.startsWith("staff_") ? getStaffName(a.staffPresent) : a.staffPresent}</span>
                    <span><Heart className="h-3 w-3 inline mr-1" />{a.enjoymentRating}/5</span>
                    {a.partOfWeeklyTarget && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium"><Star className="h-3 w-3 inline mr-0.5" />Counts to weekly target</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Physical activity tracking supports Quality Standard 7 (health
          and wellbeing), CMO physical activity guidelines for children (60 min/day moderate-vigorous), and
          identity-based wellbeing approaches. Linked to Outcomes, Activities, and Healthcare Plans.
        </p>
      </div>
    </PageShell>
  );
}
