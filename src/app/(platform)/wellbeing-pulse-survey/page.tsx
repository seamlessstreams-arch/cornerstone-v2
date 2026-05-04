"use client";

import { useState, useMemo } from "react";
import {
  HeartPulse, Search, ArrowUpDown, Filter,
  TrendingUp, TrendingDown, Minus, Sparkles,
  ChevronDown, ChevronUp, MessageCircle, Quote,
  AlertTriangle, CheckCircle2, Smile, Calendar,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getStaffName, getYPName } from "@/lib/seed-data";

/* ── helpers ─────────────────────────────────────────────────────────── */
const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

/* ── types ───────────────────────────────────────────────────────────── */
const METHODS = [
  "Visual cards", "1-10 scale", "Conversation",
  "Drawing", "Emoji selection", "Written",
] as const;
type Method = typeof METHODS[number];

const METHOD_COLORS: Record<Method, string> = {
  "Visual cards": "bg-purple-100 text-purple-800",
  "1-10 scale": "bg-blue-100 text-blue-800",
  "Conversation": "bg-green-100 text-green-800",
  "Drawing": "bg-pink-100 text-pink-800",
  "Emoji selection": "bg-yellow-100 text-yellow-800",
  "Written": "bg-slate-100 text-slate-800",
};

const TRENDS = ["Up", "Stable", "Down", "First survey"] as const;
type Trend = typeof TRENDS[number];

const TREND_CONFIG: Record<Trend, { color: string; icon: typeof TrendingUp }> = {
  "Up": { color: "bg-green-100 text-green-800", icon: TrendingUp },
  "Stable": { color: "bg-blue-100 text-blue-800", icon: Minus },
  "Down": { color: "bg-red-100 text-red-800", icon: TrendingDown },
  "First survey": { color: "bg-slate-100 text-slate-700", icon: Sparkles },
};

const DIMENSIONS = [
  "Feeling safe",
  "Feeling listened to",
  "Friendships",
  "School/Activities",
  "Family/Contact",
  "Mood today",
] as const;
type Dimension = typeof DIMENSIONS[number];

interface PulseSurvey {
  id: string;
  youngPerson: string;
  date: string;
  conductedBy: string;
  method: Method;
  durationMinutes: number;
  scores: Record<Dimension, number>;
  overallScore: number;
  verbatimQuote: string;
  keyThemes: string[];
  staffObservations: string;
  trendVsLast: Trend;
  actionsArising: string[];
  followUpNeeded: boolean;
  followUpBy: string;
}

/* ── seed data ───────────────────────────────────────────────────────── */
const SEED: PulseSurvey[] = [
  /* ── ALEX — improving trend ─────────────────────────────────── */
  {
    id: "pulse_1", youngPerson: "yp_alex", date: d(-1), conductedBy: "staff_darren",
    method: "Visual cards", durationMinutes: 12,
    scores: {
      "Feeling safe": 9, "Feeling listened to": 8, "Friendships": 7,
      "School/Activities": 6, "Family/Contact": 5, "Mood today": 8,
    },
    overallScore: 7.2,
    verbatimQuote: "I feel like staff actually listen now. Mum visit last week was good — better than before.",
    keyThemes: ["Improved trust", "Family contact going well", "Still mixed about school"],
    staffObservations: "Alex was settled and chatty during the check-in. Made strong eye contact. Picked the 'happy lion' card for mood and said it represented feeling brave.",
    trendVsLast: "Up",
    actionsArising: ["Continue current key work approach", "Plan next family contact"],
    followUpNeeded: false, followUpBy: "",
  },
  {
    id: "pulse_2", youngPerson: "yp_alex", date: d(-8), conductedBy: "staff_anna",
    method: "1-10 scale", durationMinutes: 8,
    scores: {
      "Feeling safe": 8, "Feeling listened to": 7, "Friendships": 6,
      "School/Activities": 5, "Family/Contact": 4, "Mood today": 6,
    },
    overallScore: 6.0,
    verbatimQuote: "It's alright here. Better than the last place.",
    keyThemes: ["Settling in", "School worries", "Family contact uncertain"],
    staffObservations: "Quick chat after dinner. Alex engaged with the scale tool willingly. Some hesitation around family questions.",
    trendVsLast: "Up",
    actionsArising: ["Discuss family contact plans with SW", "Follow up on test anxiety"],
    followUpNeeded: true, followUpBy: "staff_darren",
  },
  {
    id: "pulse_3", youngPerson: "yp_alex", date: d(-16), conductedBy: "staff_darren",
    method: "Conversation", durationMinutes: 15,
    scores: {
      "Feeling safe": 6, "Feeling listened to": 5, "Friendships": 4,
      "School/Activities": 3, "Family/Contact": 3, "Mood today": 4,
    },
    overallScore: 4.2,
    verbatimQuote: "I just want to go home. Nobody gets it.",
    keyThemes: ["Low mood", "Missing family", "Disconnection from school"],
    staffObservations: "Alex was quiet and tearful at points. Cuddled toy dog throughout. Took breaks when needed. Honest engagement despite difficulty.",
    trendVsLast: "First survey",
    actionsArising: ["CAMHS referral discussion", "Daily key work check-ins", "Liaise with school re: bullying"],
    followUpNeeded: true, followUpBy: "staff_darren",
  },
  /* ── JORDAN — stable, slight dip ────────────────────────────── */
  {
    id: "pulse_4", youngPerson: "yp_jordan", date: d(-2), conductedBy: "staff_chervelle",
    method: "Emoji selection", durationMinutes: 6,
    scores: {
      "Feeling safe": 9, "Feeling listened to": 8, "Friendships": 8,
      "School/Activities": 7, "Family/Contact": 6, "Mood today": 7,
    },
    overallScore: 7.5,
    verbatimQuote: "Things are okay. The football trial made me feel proud.",
    keyThemes: ["Football achievement", "Stable mood", "Mild contact uncertainty"],
    staffObservations: "Jordan picked the 'thinking face' for mood today — explained it as 'lots on my mind but not bad'. Comfortable with the emoji format.",
    trendVsLast: "Stable",
    actionsArising: ["Celebrate football trial result with family"],
    followUpNeeded: false, followUpBy: "",
  },
  {
    id: "pulse_5", youngPerson: "yp_jordan", date: d(-9), conductedBy: "staff_edward",
    method: "Conversation", durationMinutes: 10,
    scores: {
      "Feeling safe": 9, "Feeling listened to": 8, "Friendships": 8,
      "School/Activities": 8, "Family/Contact": 7, "Mood today": 8,
    },
    overallScore: 8.0,
    verbatimQuote: "I had a really good week. Coach said I might make the squad.",
    keyThemes: ["Sport progression", "Strong friendships", "Positive engagement"],
    staffObservations: "Jordan volunteered for the chat. Animated and positive. Shared detail about football and a new friend.",
    trendVsLast: "Up",
    actionsArising: ["Support football trial preparation"],
    followUpNeeded: false, followUpBy: "",
  },
  {
    id: "pulse_6", youngPerson: "yp_jordan", date: d(-17), conductedBy: "staff_anna",
    method: "1-10 scale", durationMinutes: 7,
    scores: {
      "Feeling safe": 8, "Feeling listened to": 7, "Friendships": 7,
      "School/Activities": 7, "Family/Contact": 6, "Mood today": 7,
    },
    overallScore: 7.0,
    verbatimQuote: "Most days are alright. Just miss my brother sometimes.",
    keyThemes: ["Sibling contact", "Generally positive", "Settled"],
    staffObservations: "Jordan thoughtful but engaged. Used the scale confidently. Mentioned brother three times.",
    trendVsLast: "Stable",
    actionsArising: ["Increase sibling contact frequency if possible"],
    followUpNeeded: true, followUpBy: "staff_darren",
  },
  /* ── CASEY — concerning downward trend ──────────────────────── */
  {
    id: "pulse_7", youngPerson: "yp_casey", date: d(-3), conductedBy: "staff_anna",
    method: "Drawing", durationMinutes: 18,
    scores: {
      "Feeling safe": 7, "Feeling listened to": 6, "Friendships": 4,
      "School/Activities": 3, "Family/Contact": 3, "Mood today": 4,
    },
    overallScore: 4.5,
    verbatimQuote: "It's hard. I drew a storm because that's what's in my head most days.",
    keyThemes: ["Low mood", "Friendship struggles", "College disengagement"],
    staffObservations: "Casey chose drawing — produced a stormy seascape. Articulate about meaning. Withdrawn before but warmed up. Tearful when discussing college peers.",
    trendVsLast: "Down",
    actionsArising: ["CAMHS appointment review", "College support meeting", "Daily check-ins increased"],
    followUpNeeded: true, followUpBy: "staff_darren",
  },
  {
    id: "pulse_8", youngPerson: "yp_casey", date: d(-10), conductedBy: "staff_chervelle",
    method: "Visual cards", durationMinutes: 14,
    scores: {
      "Feeling safe": 7, "Feeling listened to": 7, "Friendships": 5,
      "School/Activities": 5, "Family/Contact": 4, "Mood today": 5,
    },
    overallScore: 5.5,
    verbatimQuote: "Some days are okay. I picked the cloudy card because that's how my head feels.",
    keyThemes: ["Mood dip", "College pressure", "Limited family contact"],
    staffObservations: "Casey willing to engage but quieter than recent weeks. Cards used effectively — chose 'cloudy' deliberately.",
    trendVsLast: "Down",
    actionsArising: ["Wellbeing plan review", "Speak with CAMHS keyworker"],
    followUpNeeded: true, followUpBy: "staff_anna",
  },
  {
    id: "pulse_9", youngPerson: "yp_casey", date: d(-18), conductedBy: "staff_edward",
    method: "Written", durationMinutes: 11,
    scores: {
      "Feeling safe": 8, "Feeling listened to": 8, "Friendships": 7,
      "School/Activities": 7, "Family/Contact": 5, "Mood today": 7,
    },
    overallScore: 7.0,
    verbatimQuote: "Life here feels safe. I wrote a poem about it last week — staff are like a roof.",
    keyThemes: ["Settled", "Creative expression", "Mild family worry"],
    staffObservations: "Casey wrote responses on a worksheet, then read them aloud. Confident and reflective. Strong emotional vocabulary.",
    trendVsLast: "Stable",
    actionsArising: ["Encourage continued creative outlets"],
    followUpNeeded: false, followUpBy: "",
  },
];

/* ── component ───────────────────────────────────────────────────────── */
export default function WellbeingPulseSurveyPage() {
  const [records] = useState<PulseSurvey[]>(SEED);
  const [search, setSearch] = useState("");
  const [filterYP, setFilterYP] = useState("all");
  const [filterTrend, setFilterTrend] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...records];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.verbatimQuote.toLowerCase().includes(q) ||
          r.staffObservations.toLowerCase().includes(q) ||
          r.keyThemes.some((t) => t.toLowerCase().includes(q)) ||
          r.actionsArising.some((a) => a.toLowerCase().includes(q))
      );
    }
    if (filterYP !== "all") list = list.filter((r) => r.youngPerson === filterYP);
    if (filterTrend !== "all") list = list.filter((r) => r.trendVsLast === filterTrend);
    if (filterMethod !== "all") list = list.filter((r) => r.method === filterMethod);

    list.sort((a, b) => {
      switch (sortBy) {
        case "date": return b.date.localeCompare(a.date);
        case "yp": return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
        case "score-high": return b.overallScore - a.overallScore;
        case "score-low": return a.overallScore - b.overallScore;
        case "trend": return a.trendVsLast.localeCompare(b.trendVsLast);
        default: return 0;
      }
    });
    return list;
  }, [records, search, filterYP, filterTrend, filterMethod, sortBy]);

  /* stats */
  const sevenDaysAgo = d(-7);
  const thisWeek = records.filter((r) => r.date >= sevenDaysAgo).length;
  const avgOverall = records.length === 0 ? 0
    : records.reduce((s, r) => s + r.overallScore, 0) / records.length;
  const trendUp = records.filter((r) => r.trendVsLast === "Up").length;
  const trendStable = records.filter((r) => r.trendVsLast === "Stable").length;
  const trendDown = records.filter((r) => r.trendVsLast === "Down").length;
  const followUps = records.filter((r) => r.followUpNeeded).length;

  const ypIds = ["yp_alex", "yp_jordan", "yp_casey"];

  const exportCols: ExportColumn<PulseSurvey>[] = [
    { header: "ID", accessor: (r: PulseSurvey) => r.id },
    { header: "Young Person", accessor: (r: PulseSurvey) => getYPName(r.youngPerson) },
    { header: "Date", accessor: (r: PulseSurvey) => r.date },
    { header: "Conducted By", accessor: (r: PulseSurvey) => getStaffName(r.conductedBy) },
    { header: "Method", accessor: (r: PulseSurvey) => r.method },
    { header: "Duration (min)", accessor: (r: PulseSurvey) => r.durationMinutes },
    { header: "Feeling Safe", accessor: (r: PulseSurvey) => r.scores["Feeling safe"] },
    { header: "Feeling Listened To", accessor: (r: PulseSurvey) => r.scores["Feeling listened to"] },
    { header: "Friendships", accessor: (r: PulseSurvey) => r.scores["Friendships"] },
    { header: "School/Activities", accessor: (r: PulseSurvey) => r.scores["School/Activities"] },
    { header: "Family/Contact", accessor: (r: PulseSurvey) => r.scores["Family/Contact"] },
    { header: "Mood Today", accessor: (r: PulseSurvey) => r.scores["Mood today"] },
    { header: "Overall Score", accessor: (r: PulseSurvey) => r.overallScore.toFixed(1) },
    { header: "Verbatim Quote", accessor: (r: PulseSurvey) => r.verbatimQuote },
    { header: "Key Themes", accessor: (r: PulseSurvey) => r.keyThemes.join("; ") },
    { header: "Staff Observations", accessor: (r: PulseSurvey) => r.staffObservations },
    { header: "Trend", accessor: (r: PulseSurvey) => r.trendVsLast },
    { header: "Actions Arising", accessor: (r: PulseSurvey) => r.actionsArising.join("; ") },
    { header: "Follow-Up Needed", accessor: (r: PulseSurvey) => r.followUpNeeded ? "Yes" : "No" },
    { header: "Follow-Up By", accessor: (r: PulseSurvey) => r.followUpBy ? getStaffName(r.followUpBy) : "" },
  ];

  const scoreColor = (n: number) =>
    n >= 8 ? "text-green-600" :
    n >= 6 ? "text-blue-600" :
    n >= 4 ? "text-amber-600" : "text-red-600";

  const scoreBar = (n: number) =>
    n >= 8 ? "bg-green-500" :
    n >= 6 ? "bg-blue-500" :
    n >= 4 ? "bg-amber-500" : "bg-red-500";

  return (
    <PageShell
      title="Wellbeing Pulse Survey"
      subtitle="Short, frequent check-ins capturing each child's voice — distinct from full assessments"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Wellbeing Pulse Survey" />
          <ExportButton data={filtered} columns={exportCols} filename="wellbeing-pulse-survey" />
        </div>
      }
    >
      <div id="print-area" className="space-y-6">
        {/* ── stats ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border bg-white p-4 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">This Week</p>
              <p className="text-lg font-bold">{thisWeek}</p>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4 flex items-center gap-3">
            <Smile className={cn("h-5 w-5", scoreColor(avgOverall))} />
            <div>
              <p className="text-xs text-muted-foreground">Avg Overall Score</p>
              <p className={cn("text-lg font-bold", scoreColor(avgOverall))}>
                {avgOverall.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">/10</span>
              </p>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-xs text-muted-foreground mb-1">Trends</p>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-green-600 font-semibold">
                <TrendingUp className="h-3.5 w-3.5" /> {trendUp}
              </span>
              <span className="flex items-center gap-1 text-blue-600 font-semibold">
                <Minus className="h-3.5 w-3.5" /> {trendStable}
              </span>
              <span className="flex items-center gap-1 text-red-600 font-semibold">
                <TrendingDown className="h-3.5 w-3.5" /> {trendDown}
              </span>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-4 flex items-center gap-3">
            <AlertTriangle className={cn("h-5 w-5", followUps > 0 ? "text-amber-600" : "text-slate-400")} />
            <div>
              <p className="text-xs text-muted-foreground">Follow-ups Needed</p>
              <p className={cn("text-lg font-bold", followUps > 0 && "text-amber-600")}>{followUps}</p>
            </div>
          </div>
        </div>

        {/* ── alerts ────────────────────────────────────────────── */}
        {trendDown > 0 && (
          <div className="rounded-lg border-l-4 border-red-400 bg-red-50 p-4">
            <div className="flex items-start gap-2">
              <TrendingDown className="h-5 w-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-800">
                <strong>{trendDown}</strong> survey(s) show a downward trend. Review key work plans and
                consider escalation to wellbeing meeting where wellbeing is declining.
              </p>
            </div>
          </div>
        )}

        {/* ── filters ───────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 items-end">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quotes, observations, themes…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterYP} onValueChange={setFilterYP}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Children</SelectItem>
                {ypIds.map((id) => (
                  <SelectItem key={id} value={id}>{getYPName(id)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select value={filterTrend} onValueChange={setFilterTrend}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trends</SelectItem>
              {TRENDS.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterMethod} onValueChange={setFilterMethod}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              {METHODS.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Recent)</SelectItem>
                <SelectItem value="yp">Young Person</SelectItem>
                <SelectItem value="score-high">Score (High → Low)</SelectItem>
                <SelectItem value="score-low">Score (Low → High)</SelectItem>
                <SelectItem value="trend">Trend</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── list ──────────────────────────────────────────────── */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No pulse surveys match your filters.</div>
          )}
          {filtered.map((rec) => {
            const isExpanded = expandedId === rec.id;
            const trendCfg = TREND_CONFIG[rec.trendVsLast];
            const TrendIcon = trendCfg.icon;
            return (
              <div key={rec.id} className="rounded-xl border bg-white overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <HeartPulse className={cn("h-5 w-5 shrink-0", scoreColor(rec.overallScore))} />
                    <div className="min-w-0">
                      <p className="font-medium">
                        {getYPName(rec.youngPerson)} — {rec.date}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {rec.method} · {rec.durationMinutes} min · {getStaffName(rec.conductedBy)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-bold tabular-nums", scoreColor(rec.overallScore))}>
                      {rec.overallScore.toFixed(1)}
                    </span>
                    <Badge className={cn("text-xs gap-1", trendCfg.color)}>
                      <TrendIcon className="h-3 w-3" />
                      {rec.trendVsLast}
                    </Badge>
                    {rec.followUpNeeded && (
                      <Badge className="bg-amber-100 text-amber-800 text-xs">Follow-up</Badge>
                    )}
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t bg-slate-50 p-4 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Method:</span>{" "}
                        <Badge className={cn("text-xs", METHOD_COLORS[rec.method])}>{rec.method}</Badge>
                      </div>
                      <div><span className="text-muted-foreground">Duration:</span> <span className="font-medium">{rec.durationMinutes} min</span></div>
                      <div><span className="text-muted-foreground">Conducted by:</span> <span className="font-medium">{getStaffName(rec.conductedBy)}</span></div>
                      <div className="flex items-center gap-1">
                        {rec.followUpNeeded ? (
                          <>
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                            <span>Follow-up: <strong>{getStaffName(rec.followUpBy)}</strong></span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                            <span>No follow-up needed</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* dimension scores */}
                    <div className="rounded-lg bg-white border p-4">
                      <p className="text-xs font-medium text-slate-600 mb-3">Dimension Scores</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {DIMENSIONS.map((dim) => {
                          const v = rec.scores[dim];
                          return (
                            <div key={dim}>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-700">{dim}</span>
                                <span className={cn("font-bold tabular-nums", scoreColor(v))}>{v}/10</span>
                              </div>
                              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full", scoreBar(v))}
                                  style={{ width: `${v * 10}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* verbatim quote */}
                    <div className="rounded-lg bg-purple-50 border border-purple-200 p-3">
                      <div className="flex items-start gap-2">
                        <Quote className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-purple-700 mb-1">Child&apos;s Own Words</p>
                          <p className="text-sm italic text-purple-900">&ldquo;{rec.verbatimQuote}&rdquo;</p>
                        </div>
                      </div>
                    </div>

                    {/* key themes */}
                    {rec.keyThemes.length > 0 && (
                      <div className="rounded-lg bg-white border p-3">
                        <p className="text-xs font-medium text-slate-600 mb-2">Key Themes</p>
                        <div className="flex flex-wrap gap-1.5">
                          {rec.keyThemes.map((t, i) => (
                            <Badge key={i} className="bg-blue-50 text-blue-700 border border-blue-200 text-xs">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* staff observations */}
                    <div className="rounded-lg bg-white border p-3">
                      <div className="flex items-start gap-2">
                        <MessageCircle className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-slate-600 mb-1">Staff Observations</p>
                          <p className="text-sm">{rec.staffObservations}</p>
                        </div>
                      </div>
                    </div>

                    {/* actions arising */}
                    {rec.actionsArising.length > 0 && (
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                        <p className="text-xs font-medium text-amber-800 mb-2">Actions Arising</p>
                        <ul className="text-sm space-y-1">
                          {rec.actionsArising.map((a, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-600 mt-0.5">•</span>
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── reg note ──────────────────────────────────────────── */}
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900">
          <strong>Quality Standards 1 &amp; 7:</strong> The Children&apos;s Homes (England) Regulations 2015
          require homes to ensure children are listened to and that their wishes and feelings are
          actively sought. Pulse surveys are short, frequent check-ins distinct from full LAC reviews
          or wellbeing assessments — they capture each child&apos;s voice between formal touchpoints,
          surface emerging concerns early, and demonstrate ongoing engagement to Ofsted, IROs, and
          Reg 44 visitors. Patterns across surveys feed into care plan reviews and key work planning.
        </div>
      </div>
    </PageShell>
  );
}
