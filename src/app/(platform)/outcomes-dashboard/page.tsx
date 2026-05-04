"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown, ChevronUp, ArrowUpDown, Target, TrendingUp, TrendingDown,
  Activity, BarChart3, ShieldCheck, AlertTriangle, CheckCircle2, Minus,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getYPName, getStaffName } from "@/lib/seed-data";

/* ── types ─────────────────────────────────────────────────────────────────── */

type SCCIFArea =
  | "Overall Experiences and Progress"
  | "How well children are helped and protected"
  | "Effectiveness of leaders and managers";

type Domain =
  | "Education" | "Health" | "Identity" | "Family & Social"
  | "Behaviour & Emotional" | "Self-care" | "Spiritual & Cultural"
  | "Safety" | "Workforce" | "Practice";

type Trend = "Strong improvement" | "Improving" | "Stable" | "Declining" | "Concerning";

type RAG = "Green" | "Amber" | "Red";

interface OutcomeMetric {
  id: string;
  metricName: string;
  sccifJudgementArea: SCCIFArea;
  domain: Domain;
  description: string;
  currentValue: string;
  baseline: string;
  target: string;
  period: string;
  dataSource: string;
  trend: Trend;
  perChildBreakdown: Record<string, string>;
  narrative: string;
  contextualFactors: string[];
  riskRating: RAG;
  responsibleOwner: string;
  reviewDate: string;
  nextReview: string;
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

const d = (n: number) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };

const SCCIF_AREAS: SCCIFArea[] = [
  "Overall Experiences and Progress",
  "How well children are helped and protected",
  "Effectiveness of leaders and managers",
];

const DOMAINS: Domain[] = [
  "Education", "Health", "Identity", "Family & Social",
  "Behaviour & Emotional", "Self-care", "Spiritual & Cultural",
  "Safety", "Workforce", "Practice",
];

const TREND_CLR: Record<Trend, string> = {
  "Strong improvement": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "Improving": "bg-green-100 text-green-800 border-green-300",
  "Stable": "bg-blue-100 text-blue-800 border-blue-300",
  "Declining": "bg-orange-100 text-orange-800 border-orange-300",
  "Concerning": "bg-red-100 text-red-800 border-red-300",
};

const RAG_CLR: Record<RAG, string> = {
  Green: "bg-green-100 text-green-800 border-green-300",
  Amber: "bg-amber-100 text-amber-800 border-amber-300",
  Red: "bg-red-100 text-red-800 border-red-300",
};

const SCCIF_BORDER: Record<SCCIFArea, string> = {
  "Overall Experiences and Progress": "border-l-blue-500",
  "How well children are helped and protected": "border-l-purple-500",
  "Effectiveness of leaders and managers": "border-l-emerald-500",
};

const SCCIF_BADGE: Record<SCCIFArea, string> = {
  "Overall Experiences and Progress": "bg-blue-50 text-blue-700 border-blue-200",
  "How well children are helped and protected": "bg-purple-50 text-purple-700 border-purple-200",
  "Effectiveness of leaders and managers": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const trendIcon = (t: Trend) => {
  if (t === "Strong improvement" || t === "Improving") return <TrendingUp className="h-3.5 w-3.5" />;
  if (t === "Declining" || t === "Concerning") return <TrendingDown className="h-3.5 w-3.5" />;
  return <Minus className="h-3.5 w-3.5" />;
};

/* ── seed data ─────────────────────────────────────────────────────────────── */

const SEED: OutcomeMetric[] = [
  /* ── Overall Experiences and Progress (5) ── */
  {
    id: "om_001",
    metricName: "School Attendance",
    sccifJudgementArea: "Overall Experiences and Progress",
    domain: "Education",
    description: "Average percentage attendance across the rolling academic term for all children of statutory school age.",
    currentValue: "87%",
    baseline: "71% (start of year)",
    target: "92%",
    period: "Spring term 2026",
    dataSource: "School registers (Arbor MIS) cross-checked with daily logs",
    trend: "Improving",
    perChildBreakdown: {
      yp_alex: "82% — improved from 68%; two FTEs in autumn term",
      yp_jordan: "94% — strong term, only 2 authorised absences",
      yp_casey: "85% — anxiety-related lates resolved through morning routine plan",
    },
    narrative: "Coordinated work with virtual school heads, on-site tutoring on inset days and consistent morning routines have lifted attendance by 16 points year-on-year. Alex remains the priority case and is now in a reduced timetable arrangement with reintegration plan.",
    contextualFactors: [
      "Two new admissions disrupted Alex's friendship group in October",
      "Local school strike action affected one full week",
      "Casey's school transport issue resolved in January",
    ],
    riskRating: "Amber",
    responsibleOwner: "staff_darren",
    reviewDate: d(-12),
    nextReview: d(18),
  },
  {
    id: "om_002",
    metricName: "Voice of the Child Engagement",
    sccifJudgementArea: "Overall Experiences and Progress",
    domain: "Identity",
    description: "Percentage of monthly key-work and reflective sessions completed and meaningfully recorded for each child.",
    currentValue: "96%",
    baseline: "78%",
    target: "95%",
    period: "Last 6 months",
    dataSource: "Key-work logs and child consultation records",
    trend: "Strong improvement",
    perChildBreakdown: {
      yp_alex: "100% — uses art journal as preferred medium",
      yp_jordan: "92% — one missed session covered the following week",
      yp_casey: "96% — strong relationship with primary key worker",
    },
    narrative: "Introduction of the consultation toolkit and the embedding of Mind of My Own across the staff team has significantly improved both completion rates and the quality of evidenced child voice. Children's views are now visibly threading through care plans.",
    contextualFactors: [
      "All staff completed advocacy training in November",
      "New child-friendly review templates piloted in December",
    ],
    riskRating: "Green",
    responsibleOwner: "staff_ryan",
    reviewDate: d(-7),
    nextReview: d(23),
  },
  {
    id: "om_003",
    metricName: "Therapeutic Progress (CORS / SDQ)",
    sccifJudgementArea: "Overall Experiences and Progress",
    domain: "Behaviour & Emotional",
    description: "Average movement on Strengths and Difficulties Questionnaire and CORS scores against admission baseline.",
    currentValue: "+4.1 points (improvement)",
    baseline: "0 (admission)",
    target: "+3 points",
    period: "12 months rolling",
    dataSource: "CAMHS quarterly reviews and in-house SDQ scoring",
    trend: "Improving",
    perChildBreakdown: {
      yp_alex: "+5.2 — significant reduction in conduct subscale",
      yp_jordan: "+3.8 — peer relationships improved markedly",
      yp_casey: "+3.3 — emotional symptoms still elevated but trending down",
    },
    narrative: "Therapeutic parenting model is showing measurable improvements in emotional regulation. Casey's score remains the lowest absolute value but trajectory is positive and CAMHS engagement is consistent.",
    contextualFactors: [
      "Loss of long-term therapist for Casey in Q3 — replacement now embedded",
      "PACE training refresher delivered to all staff in February",
    ],
    riskRating: "Green",
    responsibleOwner: "staff_darren",
    reviewDate: d(-30),
    nextReview: d(60),
  },
  {
    id: "om_004",
    metricName: "Family Contact Maintained",
    sccifJudgementArea: "Overall Experiences and Progress",
    domain: "Family & Social",
    description: "Percentage of planned family contact arrangements upheld in line with care plans and any court directions.",
    currentValue: "89%",
    baseline: "82%",
    target: "90%",
    period: "Last quarter",
    dataSource: "Contact logs and supervision records",
    trend: "Stable",
    perChildBreakdown: {
      yp_alex: "100% — all monthly supervised contact achieved",
      yp_jordan: "78% — sibling contact disrupted by foster carer illness",
      yp_casey: "92% — extended family contact growing well",
    },
    narrative: "Contact remains a strength but Jordan's disruption is concerning. Local Authority is being pressed for a contact resilience plan. Cultural identity work is being woven through contact for Casey.",
    contextualFactors: [
      "Sibling foster carer hospitalisation",
      "Geographic distance to Jordan's family — transport remains a pressure point",
    ],
    riskRating: "Amber",
    responsibleOwner: "staff_ryan",
    reviewDate: d(-15),
    nextReview: d(15),
  },
  {
    id: "om_005",
    metricName: "Child Satisfaction with Care",
    sccifJudgementArea: "Overall Experiences and Progress",
    domain: "Self-care",
    description: "Aggregate satisfaction across termly children's questionnaires, house meetings and independent advocacy feedback.",
    currentValue: "8.4 / 10",
    baseline: "7.1 / 10",
    target: "8.0 / 10",
    period: "Spring term",
    dataSource: "Termly survey, house meeting minutes, advocate feedback",
    trend: "Strong improvement",
    perChildBreakdown: {
      yp_alex: "8.7 — particularly positive about food and activities",
      yp_jordan: "8.0 — wants more bedroom personalisation budget",
      yp_casey: "8.5 — values consistency of staff team",
    },
    narrative: "Children describe the home as 'somewhere I can be myself'. Top-rated themes are food, activities and staff relationships. Lowest-rated is bedroom personalisation — an action plan and budget allocation has been agreed.",
    contextualFactors: [
      "Independent advocate visits monthly",
      "House meetings now chaired by children on rotation",
    ],
    riskRating: "Green",
    responsibleOwner: "staff_darren",
    reviewDate: d(-5),
    nextReview: d(85),
  },

  /* ── How well children are helped and protected (4) ── */
  {
    id: "om_006",
    metricName: "Behaviour Incidents — Physical Intervention",
    sccifJudgementArea: "How well children are helped and protected",
    domain: "Behaviour & Emotional",
    description: "Number of recorded physical interventions and proportion debriefed within 24 hours.",
    currentValue: "6 incidents · 100% debriefed",
    baseline: "14 incidents (prior 6 months)",
    target: "<10 with 100% debrief",
    period: "Last 6 months",
    dataSource: "Behaviour log and Reg 35 notifications",
    trend: "Strong improvement",
    perChildBreakdown: {
      yp_alex: "4 incidents — all in first quarter, none in last 12 weeks",
      yp_jordan: "1 incident — single early intervention, no escalation",
      yp_casey: "1 incident — debriefed and resulted in safety plan update",
    },
    narrative: "Therapeutic parenting model and proactive behaviour mapping has materially reduced restrictive interventions. All incidents are debriefed with the child within 24 hours and reviewed in monthly behaviour clinic.",
    contextualFactors: [
      "All staff Team Teach refreshed in November",
      "Behaviour mapping introduced for all three children",
      "Sleep-in staff increased on identified high-risk weekends",
    ],
    riskRating: "Green",
    responsibleOwner: "staff_darren",
    reviewDate: d(-10),
    nextReview: d(20),
  },
  {
    id: "om_007",
    metricName: "Missing-from-Home Episodes",
    sccifJudgementArea: "How well children are helped and protected",
    domain: "Safety",
    description: "Number of missing or unauthorised absence episodes and percentage with completed return-home interview.",
    currentValue: "3 episodes · 100% RHI completed",
    baseline: "9 episodes (prior 6 months)",
    target: "<5 with 100% RHI",
    period: "Last 6 months",
    dataSource: "Missing log, RHI records, Reg 40 notifications",
    trend: "Improving",
    perChildBreakdown: {
      yp_alex: "0 episodes",
      yp_jordan: "3 episodes — all short duration, returned voluntarily",
      yp_casey: "0 episodes",
    },
    narrative: "Sustained reduction reflects targeted relational work with Jordan, including a peer mapping intervention and updated safety plan. All RHIs are completed by an independent person within 72 hours.",
    contextualFactors: [
      "Police philosophy meeting held in October",
      "Updated CSE/CCE risk assessment for Jordan",
    ],
    riskRating: "Amber",
    responsibleOwner: "staff_ryan",
    reviewDate: d(-8),
    nextReview: d(22),
  },
  {
    id: "om_008",
    metricName: "Health Outcomes — Annual Health Assessment",
    sccifJudgementArea: "How well children are helped and protected",
    domain: "Health",
    description: "Percentage of children with statutory health assessments completed within timeframe and resulting actions in train.",
    currentValue: "100%",
    baseline: "67%",
    target: "100%",
    period: "Current year",
    dataSource: "LAC nurse records and AHA reports",
    trend: "Strong improvement",
    perChildBreakdown: {
      yp_alex: "Completed; dental and optical actions complete",
      yp_jordan: "Completed; specialist CAMHS referral progressed",
      yp_casey: "Completed; immunisation catch-up scheduled",
    },
    narrative: "All annual and initial health assessments are now in date with no overdue actions. Health passports are reviewed at every Reg 25 visit and signed by the child where age-appropriate.",
    contextualFactors: [
      "Dedicated LAC nurse access established",
      "Health assessment tracker now triggers 28-day pre-warning",
    ],
    riskRating: "Green",
    responsibleOwner: "staff_darren",
    reviewDate: d(-25),
    nextReview: d(95),
  },
  {
    id: "om_009",
    metricName: "Bullying and Peer-on-Peer Incidents",
    sccifJudgementArea: "How well children are helped and protected",
    domain: "Safety",
    description: "Number of recorded peer-on-peer concerns or bullying incidents and resolution time.",
    currentValue: "2 incidents · avg 4 days to resolution",
    baseline: "5 incidents · avg 9 days",
    target: "<3 incidents · <7 days",
    period: "Last 6 months",
    dataSource: "Bullying log and resolution records",
    trend: "Improving",
    perChildBreakdown: {
      yp_alex: "1 incident as instigator — restorative work completed",
      yp_jordan: "0 incidents recorded",
      yp_casey: "1 incident as recipient — fully resolved with safety plan",
    },
    narrative: "Group dynamics are positive and reflective restorative work is becoming embedded. Children's house meetings now include a 'how is the home feeling' check-in which surfaces concerns earlier.",
    contextualFactors: [
      "Shared interest activities increased in February",
      "External restorative practice training delivered",
    ],
    riskRating: "Green",
    responsibleOwner: "staff_ryan",
    reviewDate: d(-18),
    nextReview: d(12),
  },

  /* ── Effectiveness of leaders and managers (3) ── */
  {
    id: "om_010",
    metricName: "Staff Retention",
    sccifJudgementArea: "Effectiveness of leaders and managers",
    domain: "Workforce",
    description: "Twelve-month rolling staff retention rate for the residential team excluding planned career moves.",
    currentValue: "92%",
    baseline: "78%",
    target: "85%",
    period: "Rolling 12 months",
    dataSource: "HR records and exit interview data",
    trend: "Strong improvement",
    perChildBreakdown: {
      yp_alex: "Retained both primary and co-key worker for 18 months",
      yp_jordan: "Primary key worker retained 14 months; co-key worker change once",
      yp_casey: "Full key-team continuity for 12 months",
    },
    narrative: "Consistency of staff team is the single biggest contributor to the improvements seen across child-level metrics. Reflective supervision, predictable rotas and clinical input have all supported retention.",
    contextualFactors: [
      "New supervision policy launched in September",
      "Wellbeing budget introduced January",
      "Two staff completed Level 5 Diploma",
    ],
    riskRating: "Green",
    responsibleOwner: "staff_darren",
    reviewDate: d(-22),
    nextReview: d(38),
  },
  {
    id: "om_011",
    metricName: "Complaint Resolution Time",
    sccifJudgementArea: "Effectiveness of leaders and managers",
    domain: "Practice",
    description: "Average days from logged complaint or representation to documented resolution and feedback to complainant.",
    currentValue: "9 days average",
    baseline: "21 days",
    target: "<14 days",
    period: "Last 12 months",
    dataSource: "Complaints log and resolution outcomes",
    trend: "Improving",
    perChildBreakdown: {
      yp_alex: "1 complaint about food choice — resolved in 4 days",
      yp_jordan: "1 representation about pocket money — resolved in 12 days",
      yp_casey: "0 complaints raised",
    },
    narrative: "All complaints are acknowledged within 24 hours and a named officer assigned. Children's complaints are tracked separately and an annual learning summary is produced for the responsible individual.",
    contextualFactors: [
      "Children's complaints box accessible in living room",
      "Independent advocate reviewed all responses",
    ],
    riskRating: "Green",
    responsibleOwner: "staff_ryan",
    reviewDate: d(-14),
    nextReview: d(46),
  },
  {
    id: "om_012",
    metricName: "Mandatory Training Compliance",
    sccifJudgementArea: "Effectiveness of leaders and managers",
    domain: "Workforce",
    description: "Percentage of staff fully compliant with mandatory training matrix including safeguarding, first aid, Team Teach and medication.",
    currentValue: "94%",
    baseline: "81%",
    target: "100%",
    period: "Live matrix",
    dataSource: "Training tracker and certificates",
    trend: "Stable",
    perChildBreakdown: {
      yp_alex: "All staff working with Alex hold up-to-date safeguarding and Team Teach",
      yp_jordan: "Two staff have a medication refresher booked next month",
      yp_casey: "All staff up to date including LGBTQ+ awareness",
    },
    narrative: "Compliance is strong but the 6% gap is being closed by scheduled refreshers in May. The training tracker triggers automated 60-day pre-expiry alerts to managers.",
    contextualFactors: [
      "Two new starters in March still completing induction matrix",
      "Annual safeguarding refresh week scheduled",
    ],
    riskRating: "Amber",
    responsibleOwner: "staff_darren",
    reviewDate: d(-3),
    nextReview: d(27),
  },
];

/* ── component ─────────────────────────────────────────────────────────────── */

export default function OutcomesDashboardPage() {
  const [data] = useState<OutcomeMetric[]>(SEED);
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterDomain, setFilterDomain] = useState<string>("all");
  const [filterRAG, setFilterRAG] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("area");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (filterArea !== "all") rows = rows.filter((r) => r.sccifJudgementArea === filterArea);
    if (filterDomain !== "all") rows = rows.filter((r) => r.domain === filterDomain);
    if (filterRAG !== "all") rows = rows.filter((r) => r.riskRating === filterRAG);
    rows.sort((a, b) => {
      switch (sortBy) {
        case "area": return a.sccifJudgementArea.localeCompare(b.sccifJudgementArea);
        case "domain": return a.domain.localeCompare(b.domain);
        case "rag": {
          const order: Record<RAG, number> = { Red: 0, Amber: 1, Green: 2 };
          return order[a.riskRating] - order[b.riskRating];
        }
        case "trend": {
          const order: Record<Trend, number> = {
            "Concerning": 0, "Declining": 1, "Stable": 2, "Improving": 3, "Strong improvement": 4,
          };
          return order[a.trend] - order[b.trend];
        }
        case "name": return a.metricName.localeCompare(b.metricName);
        default: return 0;
      }
    });
    return rows;
  }, [data, filterArea, filterDomain, filterRAG, sortBy]);

  /* ── summary stats ── */
  const totalMetrics = data.length;
  const strongOrImproving = data.filter((r) => r.trend === "Strong improvement" || r.trend === "Improving").length;
  const strongPct = totalMetrics > 0 ? Math.round((strongOrImproving / totalMetrics) * 100) : 0;
  const decliningOrConcerning = data.filter((r) => r.trend === "Declining" || r.trend === "Concerning").length;
  const greenRag = data.filter((r) => r.riskRating === "Green").length;

  const exportCols: ExportColumn<OutcomeMetric>[] = [
    { header: "Metric", accessor: (r: OutcomeMetric) => r.metricName },
    { header: "SCCIF Judgement Area", accessor: (r: OutcomeMetric) => r.sccifJudgementArea },
    { header: "Domain", accessor: (r: OutcomeMetric) => r.domain },
    { header: "Description", accessor: (r: OutcomeMetric) => r.description },
    { header: "Current Value", accessor: (r: OutcomeMetric) => r.currentValue },
    { header: "Baseline", accessor: (r: OutcomeMetric) => r.baseline },
    { header: "Target", accessor: (r: OutcomeMetric) => r.target },
    { header: "Period", accessor: (r: OutcomeMetric) => r.period },
    { header: "Data Source", accessor: (r: OutcomeMetric) => r.dataSource },
    { header: "Trend", accessor: (r: OutcomeMetric) => r.trend },
    { header: "Per-Child Breakdown", accessor: (r: OutcomeMetric) => Object.entries(r.perChildBreakdown).map(([yp, v]) => `${getYPName(yp)}: ${v}`).join(" | ") },
    { header: "Narrative", accessor: (r: OutcomeMetric) => r.narrative },
    { header: "Contextual Factors", accessor: (r: OutcomeMetric) => r.contextualFactors.join("; ") },
    { header: "RAG", accessor: (r: OutcomeMetric) => r.riskRating },
    { header: "Owner", accessor: (r: OutcomeMetric) => getStaffName(r.responsibleOwner) },
    { header: "Review Date", accessor: (r: OutcomeMetric) => r.reviewDate },
    { header: "Next Review", accessor: (r: OutcomeMetric) => r.nextReview },
  ];

  return (
    <PageShell
      title="Outcomes Dashboard"
      subtitle="Aggregated Quality of Care · SCCIF Judgement Areas · Reg 45 / QS 13"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Outcomes Dashboard" />
          <ExportButton data={data} columns={exportCols} filename="outcomes-dashboard" />
        </div>
      }
    >
      <div id="print-area">
        {/* ── summary stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Metrics Tracked", value: String(totalMetrics), icon: BarChart3, clr: "text-blue-600" },
            { label: "Strong / Improving", value: `${strongPct}%`, icon: TrendingUp, clr: "text-emerald-600" },
            { label: "Declining / Concerning", value: String(decliningOrConcerning), icon: AlertTriangle, clr: "text-orange-600" },
            { label: "Green RAG", value: `${greenRag} / ${totalMetrics}`, icon: CheckCircle2, clr: "text-green-600" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-3 text-center">
                <s.icon className={cn("h-5 w-5 mx-auto mb-1", s.clr)} />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── filters / sort ── */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger className="w-[260px]"><SelectValue placeholder="SCCIF Area" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All SCCIF Areas</SelectItem>
              {SCCIF_AREAS.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterDomain} onValueChange={setFilterDomain}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Domain" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              {DOMAINS.map((dom) => (
                <SelectItem key={dom} value={dom}>{dom}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterRAG} onValueChange={setFilterRAG}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="RAG" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All RAG</SelectItem>
              <SelectItem value="Green">Green</SelectItem>
              <SelectItem value="Amber">Amber</SelectItem>
              <SelectItem value="Red">Red</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-1">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <SelectValue placeholder="Sort" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="area">SCCIF Area</SelectItem>
              <SelectItem value="domain">Domain A-Z</SelectItem>
              <SelectItem value="rag">RAG (Red first)</SelectItem>
              <SelectItem value="trend">Trend (worst first)</SelectItem>
              <SelectItem value="name">Metric A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ── card list ── */}
        <div className="space-y-3">
          {filtered.map((r) => {
            const isOpen = expandedId === r.id;
            return (
              <Card key={r.id} className={cn("border-l-4", SCCIF_BORDER[r.sccifJudgementArea])}>
                <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpandedId(isOpen ? null : r.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                        <Activity className="h-4 w-4 text-muted-foreground shrink-0" />
                        {r.metricName}
                        <Badge variant="outline" className={SCCIF_BADGE[r.sccifJudgementArea]}>
                          {r.sccifJudgementArea}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                          {r.domain}
                        </Badge>
                        <Badge variant="outline" className={RAG_CLR[r.riskRating]}>
                          {r.riskRating}
                        </Badge>
                        <Badge variant="outline" className={cn("flex items-center gap-1", TREND_CLR[r.trend])}>
                          {trendIcon(r.trend)}
                          {r.trend}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{r.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Period: {r.period} · Owner: {getStaffName(r.responsibleOwner)} · Next review: {r.nextReview}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="hidden sm:flex flex-col items-end text-right">
                        <span className="text-base font-semibold">{r.currentValue}</span>
                        <span className="text-[10px] text-muted-foreground">vs target {r.target}</span>
                      </div>
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>

                {isOpen && (
                  <CardContent className="pt-0 space-y-3 text-sm">
                    {/* Headline values */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-blue-50 border border-blue-200 rounded p-2">
                        <p className="text-[10px] uppercase tracking-wide text-blue-700">Current</p>
                        <p className="text-sm font-semibold text-blue-900">{r.currentValue}</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-2">
                        <p className="text-[10px] uppercase tracking-wide text-slate-600">Baseline</p>
                        <p className="text-sm font-semibold text-slate-800">{r.baseline}</p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded p-2">
                        <p className="text-[10px] uppercase tracking-wide text-emerald-700">Target</p>
                        <p className="text-sm font-semibold text-emerald-900">{r.target}</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded p-2">
                        <p className="text-[10px] uppercase tracking-wide text-purple-700">Data Source</p>
                        <p className="text-xs text-purple-900">{r.dataSource}</p>
                      </div>
                    </div>

                    {/* Narrative */}
                    <div>
                      <p className="font-medium mb-1">Narrative</p>
                      <p className="text-muted-foreground text-xs">{r.narrative}</p>
                    </div>

                    {/* Per-child breakdown */}
                    <div>
                      <p className="font-medium mb-1 flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-blue-600" />
                        Per-Child Breakdown
                      </p>
                      <ul className="space-y-1">
                        {Object.entries(r.perChildBreakdown).map(([yp, v]) => (
                          <li key={yp} className="flex items-start gap-2 text-xs">
                            <Target className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <span><strong>{getYPName(yp)}:</strong> {v}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Contextual factors */}
                    {r.contextualFactors.length > 0 && (
                      <div>
                        <p className="font-medium mb-1 text-amber-700">Contextual Factors</p>
                        <ul className="space-y-1">
                          {r.contextualFactors.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <ShieldCheck className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Footer meta */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground border-t pt-2">
                      <span>Last review: {r.reviewDate}</span>
                      <span>Next review: {r.nextReview}</span>
                      <span>Owner: {getStaffName(r.responsibleOwner)}</span>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No outcome metrics match the current filters.
          </div>
        )}

        {/* ── regulatory note ── */}
        <Card className="mt-6 border-l-4 border-l-amber-500 bg-amber-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-600" />
              Regulatory Basis
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>
              The Outcomes Dashboard supports the Registered Manager&apos;s duty under
              <strong> Regulation 45 of the Children&apos;s Homes (England) Regulations 2015</strong> to
              keep the quality of care under continuous review, and evidences progress against the
              <strong> Quality Standards</strong> — in particular Quality Standard 13 (the leadership
              and management standard).
            </p>
            <p>
              Metrics are mapped to the three SCCIF judgement areas used by Ofsted inspectors:
              Overall Experiences and Progress, How well children are helped and protected, and
              Effectiveness of leaders and managers. Where a metric trends Amber or Red, the
              responsible owner is required to update the linked action plan and revisit at the
              next monitoring meeting.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
