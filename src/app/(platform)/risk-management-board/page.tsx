"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — STRATEGIC RISK MANAGEMENT BOARD
// Organisational / board-level risk register for the children's home as a
// business. This is distinct from the per-child risk plans and the operational
// risk register: it captures the strategic risks that govern the home — workforce
// retention, regulatory exposure, cyber, reputation, financial sustainability,
// placement disruption, succession and environmental risk.
// Required by Quality Standard 13 (Leadership & Management) and corporate
// governance / RI oversight responsibilities.
// ══════════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from "react";
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
import { cn } from "@/lib/utils";
import { getStaffName } from "@/lib/seed-data";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Gauge,
  Users,
  Scale,
  Lock,
  Megaphone,
  Coins,
  Settings,
  UserCog,
  Leaf,
  Target,
  Calendar,
  Activity,
  CheckCircle2,
  AlertOctagon,
  Link2,
  Info,
} from "lucide-react";

// ── Local date helper ─────────────────────────────────────────────────────────

const TODAY = new Date("2026-05-03");
function d(n: number): string {
  // n = days offset from today; returns ISO YYYY-MM-DD
  const dt = new Date(TODAY);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
}

// ── Types ─────────────────────────────────────────────────────────────────────

type RiskCategory =
  | "Operational"
  | "Workforce"
  | "Regulatory"
  | "Financial"
  | "Reputational"
  | "Strategic"
  | "Safeguarding"
  | "Environmental"
  | "Cyber/Data";

type Velocity = "Slow" | "Moderate" | "Fast";
type Trend = "Decreasing" | "Stable" | "Increasing";
type AppetiteAlignment = "Within appetite" | "At appetite limit" | "Above appetite";
type KRIStatus = "OK" | "Warning" | "Trigger";

interface KeyRiskIndicator {
  indicator: string;
  currentValue: string;
  threshold: string;
  status: KRIStatus;
}

interface StrategicRisk {
  id: string;
  riskTitle: string;
  category: RiskCategory;
  description: string;
  currentLikelihood: number; // 1-5
  currentImpact: number; // 1-5
  inherentRiskScore: number;
  residualRiskScore: number;
  targetRiskScore: number;
  currentControls: string[];
  additionalControlsRequired: string[];
  riskOwner: string; // staff ID
  reviewFrequency: string;
  lastReviewed: string;
  nextReviewDate: string;
  escalationCriteria: string;
  boardLevel: boolean;
  keyRiskIndicators: KeyRiskIndicator[];
  velocityOfChange: Velocity;
  trend: Trend;
  riskAppetiteAlignment: AppetiteAlignment;
  interconnectedRisks: string[];
}

// ── Seed data ─────────────────────────────────────────────────────────────────

const SEED_RISKS: StrategicRisk[] = [
  {
    id: "srisk_001",
    riskTitle: "Sustained workforce retention failure",
    category: "Workforce",
    description:
      "Loss of suite of permanent residential staff would compromise consistency of care, attachment relationships, agency spend and ultimately Ofsted judgement. Sector-wide turnover pressure is elevated and the home has experienced 2 senior RSW resignations in the past 6 months.",
    currentLikelihood: 4,
    currentImpact: 5,
    inherentRiskScore: 25,
    residualRiskScore: 16,
    targetRiskScore: 8,
    currentControls: [
      "Annual pay benchmarking against regional providers (last completed Feb 2026)",
      "Clinical supervision and reflective practice embedded for all residential staff",
      "Wellbeing at Work programme — EAP, monthly wellbeing checks, paid mental health days",
      "Career pathway framework: RSW → Senior RSW → Deputy",
    ],
    additionalControlsRequired: [
      "Stay interviews for staff at 12-month service anniversary",
      "Refresh of recognition/reward scheme by Q3 2026",
      "Recruitment campaign focused on values-based attraction (Q2 2026)",
    ],
    riskOwner: "staff_darren",
    reviewFrequency: "Monthly",
    lastReviewed: d(-22),
    nextReviewDate: d(8),
    escalationCriteria:
      "Escalate to RI / Board if rolling 12m turnover > 25%, OR more than 1 senior leaver in any quarter, OR agency spend > 20% of staffing budget for 2 consecutive months.",
    boardLevel: true,
    keyRiskIndicators: [
      { indicator: "Rolling 12-month turnover", currentValue: "18%", threshold: "≤ 20%", status: "Warning" },
      { indicator: "Agency hours (last 30d)", currentValue: "9%", threshold: "≤ 10%", status: "Warning" },
      { indicator: "Vacancies open > 60 days", currentValue: "1", threshold: "0", status: "Trigger" },
    ],
    velocityOfChange: "Moderate",
    trend: "Increasing",
    riskAppetiteAlignment: "At appetite limit",
    interconnectedRisks: ["srisk_006", "srisk_002", "srisk_005"],
  },
  {
    id: "srisk_002",
    riskTitle: "Ofsted regulatory judgement deterioration",
    category: "Regulatory",
    description:
      "Decline from current Good rating to Requires Improvement or Inadequate would impact placements, commissioning relationships, staff confidence and revenue. Increased scrutiny on quality of care, leadership consistency and impact-led practice under the SCCIF.",
    currentLikelihood: 2,
    currentImpact: 5,
    inherentRiskScore: 20,
    residualRiskScore: 10,
    targetRiskScore: 6,
    currentControls: [
      "Quarterly internal Reg 44 / Reg 45 oversight by Independent Person",
      "Monthly QoC review — RM and RI sign-off, evidenced in board pack",
      "Continuous self-evaluation against SCCIF judgement descriptors",
      "Action plan tracker for prior inspection recommendations (currently 100% closed)",
    ],
    additionalControlsRequired: [
      "Mock inspection by external consultant (planned Q3 2026)",
      "Strengthen impact-evidence trail across care plans → outcomes",
    ],
    riskOwner: "staff_darren",
    reviewFrequency: "Monthly",
    lastReviewed: d(-14),
    nextReviewDate: d(16),
    escalationCriteria:
      "Escalate immediately if any compliance notice, NOC, or restriction is issued; if any Reg 44 visit identifies a serious concern; or if internal QoC self-rating drops below Good.",
    boardLevel: true,
    keyRiskIndicators: [
      { indicator: "Reg 44 actions overdue", currentValue: "0", threshold: "0", status: "OK" },
      { indicator: "Compliance notices (12m)", currentValue: "0", threshold: "0", status: "OK" },
      { indicator: "Self-rating vs SCCIF", currentValue: "Good", threshold: "≥ Good", status: "OK" },
    ],
    velocityOfChange: "Slow",
    trend: "Stable",
    riskAppetiteAlignment: "Within appetite",
    interconnectedRisks: ["srisk_001", "srisk_006", "srisk_007"],
  },
  {
    id: "srisk_003",
    riskTitle: "Cyber attack / data breach affecting children's records",
    category: "Cyber/Data",
    description:
      "A successful ransomware, phishing-led account compromise or third-party breach affecting the case management system or staff email could expose highly sensitive special category data on looked-after children, triggering ICO action and severe reputational damage.",
    currentLikelihood: 3,
    currentImpact: 5,
    inherentRiskScore: 20,
    residualRiskScore: 9,
    targetRiskScore: 6,
    currentControls: [
      "MFA enforced on all staff accounts (100%)",
      "Endpoint detection and response on all managed devices",
      "Quarterly phishing simulations with mandatory follow-up training",
      "Cyber Essentials Plus certification (renewed Jan 2026)",
      "Data Processor agreements with all SaaS vendors reviewed annually",
    ],
    additionalControlsRequired: [
      "Tabletop incident response exercise with clinical & SLT (Q2 2026)",
      "DPIA refresh for AI-assisted documentation tools",
    ],
    riskOwner: "staff_ryan",
    reviewFrequency: "Quarterly",
    lastReviewed: d(-40),
    nextReviewDate: d(50),
    escalationCriteria:
      "Escalate to RI and DPO immediately on any suspected breach, account compromise, or vendor incident affecting child data. ICO notification required within 72h of confirmed personal data breach.",
    boardLevel: true,
    keyRiskIndicators: [
      { indicator: "Phishing sim click rate", currentValue: "4%", threshold: "≤ 5%", status: "OK" },
      { indicator: "MFA coverage", currentValue: "100%", threshold: "100%", status: "OK" },
      { indicator: "Critical patches > 14 days", currentValue: "2", threshold: "0", status: "Warning" },
    ],
    velocityOfChange: "Fast",
    trend: "Increasing",
    riskAppetiteAlignment: "At appetite limit",
    interconnectedRisks: ["srisk_004", "srisk_002"],
  },
  {
    id: "srisk_004",
    riskTitle: "Reputational damage from social media exposure",
    category: "Reputational",
    description:
      "An incident involving a young person, an ex-staff member, or a viral complaint posted on social platforms could harm the home's reputation with placing authorities, prospective staff and the local community, irrespective of factual basis.",
    currentLikelihood: 3,
    currentImpact: 4,
    inherentRiskScore: 15,
    residualRiskScore: 9,
    targetRiskScore: 6,
    currentControls: [
      "Social media policy in staff handbook; signed at induction",
      "Young people's online safety plan and supported social media use",
      "Reactive comms protocol — RI / RM only authorised to make statements",
      "Monitoring of public mentions of the home (weekly)",
    ],
    additionalControlsRequired: [
      "Pre-drafted holding statements for top 5 incident types",
      "Annual media handling training for SLT",
    ],
    riskOwner: "staff_darren",
    reviewFrequency: "Quarterly",
    lastReviewed: d(-60),
    nextReviewDate: d(30),
    escalationCriteria:
      "Escalate to RI within 1 hour of any public-facing post identifying the home, any complaint published online, or any approach from a journalist. Initiate comms protocol if engagement > 100 interactions.",
    boardLevel: true,
    keyRiskIndicators: [
      { indicator: "Public mentions (30d)", currentValue: "3", threshold: "≤ 5", status: "OK" },
      { indicator: "Negative sentiment posts", currentValue: "0", threshold: "0", status: "OK" },
      { indicator: "Open formal complaints", currentValue: "1", threshold: "≤ 2", status: "OK" },
    ],
    velocityOfChange: "Fast",
    trend: "Stable",
    riskAppetiteAlignment: "Within appetite",
    interconnectedRisks: ["srisk_003", "srisk_002"],
  },
  {
    id: "srisk_005",
    riskTitle: "Financial sustainability under fee pressure",
    category: "Financial",
    description:
      "Local-authority commissioning is increasingly squeezed; static or below-inflation fees combined with rising staff, energy and clinical costs erode margin. A sustained 12-month period of under-occupancy or unfunded high-need placements would compromise the home's financial viability.",
    currentLikelihood: 3,
    currentImpact: 4,
    inherentRiskScore: 15,
    residualRiskScore: 9,
    targetRiskScore: 6,
    currentControls: [
      "Monthly management accounts reviewed by RI and Director",
      "Rolling 12-month cashflow forecast",
      "Diverse placing-authority base (no single LA > 35% of revenue)",
      "Annual fee review tied to local benchmarks and complexity tariff",
    ],
    additionalControlsRequired: [
      "Build 3-month operating cash reserve (currently 1.8 months)",
      "Develop high-need additional-needs tariff for negotiation",
    ],
    riskOwner: "staff_darren",
    reviewFrequency: "Monthly",
    lastReviewed: d(-7),
    nextReviewDate: d(23),
    escalationCriteria:
      "Escalate to Board if occupancy < 80% for 2 consecutive months, EBITDA margin < 8%, or operating cash reserve < 6 weeks.",
    boardLevel: true,
    keyRiskIndicators: [
      { indicator: "Occupancy (rolling 90d)", currentValue: "92%", threshold: "≥ 85%", status: "OK" },
      { indicator: "EBITDA margin", currentValue: "11%", threshold: "≥ 10%", status: "OK" },
      { indicator: "Operating cash (months)", currentValue: "1.8", threshold: "≥ 3.0", status: "Trigger" },
    ],
    velocityOfChange: "Moderate",
    trend: "Increasing",
    riskAppetiteAlignment: "Above appetite",
    interconnectedRisks: ["srisk_001", "srisk_006"],
  },
  {
    id: "srisk_006",
    riskTitle: "Placement disruption / unplanned ending",
    category: "Operational",
    description:
      "An unplanned placement breakdown of a young person carries severe impact on the child, team morale, regulatory profile and revenue. Recurring breakdowns are a marker of poor matching or insufficient therapeutic capacity and would attract regulatory attention.",
    currentLikelihood: 3,
    currentImpact: 4,
    inherentRiskScore: 15,
    residualRiskScore: 8,
    targetRiskScore: 6,
    currentControls: [
      "Robust matching panel — RM, key worker and clinical lead all sign off",
      "28-day impact review post-admission",
      "Therapeutic team formulation for every YP within 6 weeks",
      "Disruption meeting protocol triggered at first concerning indicator",
    ],
    additionalControlsRequired: [
      "Pre-admission compatibility tool for current cohort",
      "Strengthen transition planning where moves are foreseeable",
    ],
    riskOwner: "staff_ryan",
    reviewFrequency: "Monthly",
    lastReviewed: d(-3),
    nextReviewDate: d(27),
    escalationCriteria:
      "Escalate to RI if any unplanned ending occurs, any disruption meeting is convened, or stability indicator falls into red for any YP.",
    boardLevel: false,
    keyRiskIndicators: [
      { indicator: "Unplanned endings (12m)", currentValue: "0", threshold: "0", status: "OK" },
      { indicator: "Avg placement length", currentValue: "14m", threshold: "≥ 12m", status: "OK" },
      { indicator: "Stability red-flags open", currentValue: "1", threshold: "≤ 1", status: "Warning" },
    ],
    velocityOfChange: "Moderate",
    trend: "Stable",
    riskAppetiteAlignment: "Within appetite",
    interconnectedRisks: ["srisk_001", "srisk_002"],
  },
  {
    id: "srisk_007",
    riskTitle: "Succession planning gap — Registered Manager",
    category: "Strategic",
    description:
      "The home is materially dependent on a single Registered Manager. An unplanned absence or departure without an appointable, Ofsted-suitable successor in post would create a regulatory gap, force interim cover and risk service continuity.",
    currentLikelihood: 2,
    currentImpact: 5,
    inherentRiskScore: 15,
    residualRiskScore: 8,
    targetRiskScore: 4,
    currentControls: [
      "Deputy Manager in active Level 5 study and shadowing RM duties",
      "All RM-only processes documented in operations manual",
      "RI maintains current knowledge of operational detail (monthly walk-through)",
      "Locum RM contact list maintained for short-term cover",
    ],
    additionalControlsRequired: [
      "Formal succession plan document signed off by Board (Q2 2026)",
      "Deputy to complete Level 5 by Dec 2026",
    ],
    riskOwner: "staff_darren",
    reviewFrequency: "Half-yearly",
    lastReviewed: d(-90),
    nextReviewDate: d(90),
    escalationCriteria:
      "Escalate immediately on any signal of intended RM departure, sustained absence > 4 weeks, or if Deputy is unable to continue Level 5 progression.",
    boardLevel: true,
    keyRiskIndicators: [
      { indicator: "Deputy Level 5 progress", currentValue: "60%", threshold: "≥ 50%", status: "OK" },
      { indicator: "Documented RM processes", currentValue: "85%", threshold: "100%", status: "Warning" },
      { indicator: "Locum cover list", currentValue: "2", threshold: "≥ 2", status: "OK" },
    ],
    velocityOfChange: "Slow",
    trend: "Decreasing",
    riskAppetiteAlignment: "At appetite limit",
    interconnectedRisks: ["srisk_001", "srisk_002"],
  },
  {
    id: "srisk_008",
    riskTitle: "Environmental / building integrity failure",
    category: "Environmental",
    description:
      "A significant building failure (boiler, roof, fire system, flooding) could render the home temporarily unfit for occupation, requiring emergency placements elsewhere and eroding stability for young people. Climate-related extreme weather events are an emerging factor.",
    currentLikelihood: 2,
    currentImpact: 4,
    inherentRiskScore: 12,
    residualRiskScore: 6,
    targetRiskScore: 4,
    currentControls: [
      "Annual building condition survey",
      "Planned preventative maintenance schedule (boiler, electrics, fire system)",
      "Fire risk assessment reviewed annually; quarterly checks in date",
      "Business continuity plan with 2 emergency-decant arrangements",
    ],
    additionalControlsRequired: [
      "Climate-adaptation review (overheating risk, flood resilience) — Q4 2026",
      "Test BCP decant arrangements live (next: October 2026)",
    ],
    riskOwner: "staff_ryan",
    reviewFrequency: "Half-yearly",
    lastReviewed: d(-50),
    nextReviewDate: d(40),
    escalationCriteria:
      "Escalate to RI on any building incident requiring vacation of part of the home, any failed fire-system test, or any insurer-mandated remediation.",
    boardLevel: false,
    keyRiskIndicators: [
      { indicator: "PPM completion (90d)", currentValue: "100%", threshold: "100%", status: "OK" },
      { indicator: "Open building defects", currentValue: "3", threshold: "≤ 5", status: "OK" },
      { indicator: "BCP last tested", currentValue: "8m ago", threshold: "≤ 12m", status: "OK" },
    ],
    velocityOfChange: "Slow",
    trend: "Stable",
    riskAppetiteAlignment: "Within appetite",
    interconnectedRisks: ["srisk_006"],
  },
];

// ── Category config ───────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  RiskCategory,
  { icon: React.ElementType; color: string; bg: string; border: string }
> = {
  Operational:    { icon: Settings,    color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200"    },
  Workforce:      { icon: Users,       color: "text-indigo-700",  bg: "bg-indigo-50",  border: "border-indigo-200"  },
  Regulatory:     { icon: Scale,       color: "text-violet-700",  bg: "bg-violet-50",  border: "border-violet-200"  },
  Financial:      { icon: Coins,       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  Reputational:   { icon: Megaphone,   color: "text-rose-700",    bg: "bg-rose-50",    border: "border-rose-200"    },
  Strategic:      { icon: Target,      color: "text-slate-700",   bg: "bg-slate-50",   border: "border-slate-200"   },
  Safeguarding:   { icon: ShieldAlert, color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200"     },
  Environmental:  { icon: Leaf,        color: "text-teal-700",    bg: "bg-teal-50",    border: "border-teal-200"    },
  "Cyber/Data":   { icon: Lock,        color: "text-cyan-700",    bg: "bg-cyan-50",    border: "border-cyan-200"    },
};

const APPETITE_CONFIG: Record<
  AppetiteAlignment,
  { color: string; bg: string; border: string }
> = {
  "Within appetite":   { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  "At appetite limit": { color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200"   },
  "Above appetite":    { color: "text-red-700",     bg: "bg-red-100",    border: "border-red-300"     },
};

const KRI_CONFIG: Record<KRIStatus, { color: string; bg: string; border: string }> = {
  OK:      { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  Warning: { color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200"   },
  Trigger: { color: "text-red-700",     bg: "bg-red-100",    border: "border-red-300"     },
};

function scoreLevel(score: number): { label: string; color: string; bg: string; border: string } {
  if (score >= 20) return { label: "Severe",   color: "text-red-700",     bg: "bg-red-100",    border: "border-red-300"    };
  if (score >= 15) return { label: "High",     color: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-300" };
  if (score >= 8)  return { label: "Moderate", color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200"  };
  return            { label: "Low",      color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" };
}

function trendIcon(t: Trend) {
  if (t === "Increasing") return TrendingUp;
  if (t === "Decreasing") return TrendingDown;
  return Minus;
}

function trendColor(t: Trend) {
  if (t === "Increasing") return "text-red-600";
  if (t === "Decreasing") return "text-emerald-600";
  return "text-slate-500";
}

// ── Export columns ────────────────────────────────────────────────────────────

const EXPORT_COLS: ExportColumn<StrategicRisk>[] = [
  { header: "ID",                   accessor: (r: StrategicRisk) => r.id },
  { header: "Risk",                 accessor: (r: StrategicRisk) => r.riskTitle },
  { header: "Category",             accessor: (r: StrategicRisk) => r.category },
  { header: "Description",          accessor: (r: StrategicRisk) => r.description },
  { header: "Likelihood",           accessor: (r: StrategicRisk) => r.currentLikelihood },
  { header: "Impact",               accessor: (r: StrategicRisk) => r.currentImpact },
  { header: "Inherent score",       accessor: (r: StrategicRisk) => r.inherentRiskScore },
  { header: "Residual score",       accessor: (r: StrategicRisk) => r.residualRiskScore },
  { header: "Target score",         accessor: (r: StrategicRisk) => r.targetRiskScore },
  { header: "Owner",                accessor: (r: StrategicRisk) => getStaffName(r.riskOwner) },
  { header: "Review frequency",     accessor: (r: StrategicRisk) => r.reviewFrequency },
  { header: "Last reviewed",        accessor: (r: StrategicRisk) => r.lastReviewed },
  { header: "Next review",          accessor: (r: StrategicRisk) => r.nextReviewDate },
  { header: "Board level",          accessor: (r: StrategicRisk) => (r.boardLevel ? "Yes" : "No") },
  { header: "Velocity",             accessor: (r: StrategicRisk) => r.velocityOfChange },
  { header: "Trend",                accessor: (r: StrategicRisk) => r.trend },
  { header: "Appetite alignment",   accessor: (r: StrategicRisk) => r.riskAppetiteAlignment },
  { header: "Current controls",     accessor: (r: StrategicRisk) => r.currentControls.join("; ") },
  { header: "Additional controls",  accessor: (r: StrategicRisk) => r.additionalControlsRequired.join("; ") },
  { header: "Escalation criteria",  accessor: (r: StrategicRisk) => r.escalationCriteria },
  { header: "Interconnected risks", accessor: (r: StrategicRisk) => r.interconnectedRisks.join(", ") },
  {
    header: "KRIs",
    accessor: (r: StrategicRisk) =>
      r.keyRiskIndicators
        .map((k) => `${k.indicator}: ${k.currentValue} (threshold ${k.threshold}, ${k.status})`)
        .join(" | "),
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RiskManagementBoardPage() {
  const [risks] = useState<StrategicRisk[]>(SEED_RISKS);
  const [categoryFilter, setCategoryFilter] = useState<RiskCategory | "all">("all");
  const [appetiteFilter, setAppetiteFilter] = useState<AppetiteAlignment | "all">("all");
  const [sortBy, setSortBy] = useState("residual-desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const today = TODAY.toISOString().slice(0, 10);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = risks.length;
    const highImpact = risks.filter((r) => r.residualRiskScore >= 15).length;
    const aboveAppetite = risks.filter((r) => r.riskAppetiteAlignment === "Above appetite").length;
    const reviewsDue30 = risks.filter((r) => {
      const diff =
        (new Date(r.nextReviewDate).getTime() - new Date(today).getTime()) /
        (1000 * 60 * 60 * 24);
      return diff <= 30;
    }).length;
    return { total, highImpact, aboveAppetite, reviewsDue30 };
  }, [risks, today]);

  // ── Filter + sort ───────────────────────────────────────────────────────────
  const visible = useMemo(() => {
    let list = [...risks];

    if (categoryFilter !== "all") {
      list = list.filter((r) => r.category === categoryFilter);
    }
    if (appetiteFilter !== "all") {
      list = list.filter((r) => r.riskAppetiteAlignment === appetiteFilter);
    }

    switch (sortBy) {
      case "residual-desc":
        list.sort((a, b) => b.residualRiskScore - a.residualRiskScore);
        break;
      case "residual-asc":
        list.sort((a, b) => a.residualRiskScore - b.residualRiskScore);
        break;
      case "inherent-desc":
        list.sort((a, b) => b.inherentRiskScore - a.inherentRiskScore);
        break;
      case "review-asc":
        list.sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
        break;
      case "category":
        list.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "title":
        list.sort((a, b) => a.riskTitle.localeCompare(b.riskTitle));
        break;
    }

    return list;
  }, [risks, categoryFilter, appetiteFilter, sortBy]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <PageShell
      title="Strategic Risk Management Board"
      subtitle="Organisational risk register — board-level oversight of risks to the home as a regulated business"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton
            data={visible}
            columns={EXPORT_COLS}
            filename="strategic-risk-register"
          />
          <PrintButton title="Strategic Risk Management Board" />
        </div>
      }
    >
      {/* Banner — distinct from operational / per-child risk */}
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 mb-6 flex items-start gap-3">
        <Info className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-indigo-900">
            Strategic / organisational risk — not per-child risk
          </p>
          <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
            This board tracks risks to the home as a regulated business: workforce,
            regulatory, financial, cyber, reputational, succession and environmental.
            It is the governance counterpart to the operational risk register and
            the per-child risk plans, which sit under the Risk Register and individual
            care plans respectively. Required by Quality Standard 13 (Leadership &amp;
            Management) and reviewed by the Responsible Individual.
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Total strategic risks",
            value: stats.total,
            color: "text-slate-700",
            bg: "bg-slate-50",
            border: "border-slate-200",
            icon: Gauge,
          },
          {
            label: "High impact (residual ≥ 15)",
            value: stats.highImpact,
            color: "text-orange-700",
            bg: "bg-orange-50",
            border: "border-orange-200",
            icon: AlertTriangle,
          },
          {
            label: "Above risk appetite",
            value: stats.aboveAppetite,
            color: "text-red-700",
            bg: "bg-red-50",
            border: "border-red-200",
            icon: AlertOctagon,
          },
          {
            label: "Reviews due within 30 days",
            value: stats.reviewsDue30,
            color: "text-amber-700",
            bg: "bg-amber-50",
            border: "border-amber-200",
            icon: Calendar,
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={cn("rounded-lg border p-3 flex items-center gap-3", s.bg, s.border)}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", s.color)} />
              <div>
                <div className={cn("text-xl font-bold leading-none", s.color)}>
                  {s.value}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">
                  {s.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters / sort */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v as RiskCategory | "all")}
        >
          <SelectTrigger className="h-8 w-[170px] text-xs">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {(Object.keys(CATEGORY_CONFIG) as RiskCategory[]).map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={appetiteFilter}
          onValueChange={(v) => setAppetiteFilter(v as AppetiteAlignment | "all")}
        >
          <SelectTrigger className="h-8 w-[180px] text-xs">
            <SelectValue placeholder="Appetite" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All appetite alignments</SelectItem>
            <SelectItem value="Within appetite">Within appetite</SelectItem>
            <SelectItem value="At appetite limit">At appetite limit</SelectItem>
            <SelectItem value="Above appetite">Above appetite</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-8 w-[180px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residual-desc">Residual score (high → low)</SelectItem>
              <SelectItem value="residual-asc">Residual score (low → high)</SelectItem>
              <SelectItem value="inherent-desc">Inherent score (high → low)</SelectItem>
              <SelectItem value="review-asc">Next review (soonest)</SelectItem>
              <SelectItem value="category">Category (A → Z)</SelectItem>
              <SelectItem value="title">Title (A → Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="ml-auto text-[11px] text-slate-500">
          Showing {visible.length} of {risks.length}
        </span>
      </div>

      {/* Risk list */}
      <div className="space-y-3">
        {visible.map((r) => {
          const cat = CATEGORY_CONFIG[r.category];
          const CatIcon = cat.icon;
          const residual = scoreLevel(r.residualRiskScore);
          const inherent = scoreLevel(r.inherentRiskScore);
          const target = scoreLevel(r.targetRiskScore);
          const appetite = APPETITE_CONFIG[r.riskAppetiteAlignment];
          const TrendIcon = trendIcon(r.trend);
          const isExpanded = expandedId === r.id;

          return (
            <div
              key={r.id}
              className={cn(
                "rounded-lg border bg-white transition-all",
                r.riskAppetiteAlignment === "Above appetite" &&
                  "ring-2 ring-red-300 border-red-200",
              )}
            >
              {/* Header */}
              <div
                className="flex items-start gap-3 p-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : r.id)}
              >
                <div
                  className={cn(
                    "mt-0.5 rounded-md p-1.5 border flex-shrink-0",
                    cat.bg,
                    cat.border,
                  )}
                >
                  <CatIcon className={cn("h-4 w-4", cat.color)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {r.riskTitle}
                    </h3>
                    {r.boardLevel && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        Board-level
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500">
                    <span className={cn("flex items-center gap-1 font-medium", cat.color)}>
                      <CatIcon className="h-3 w-3" />
                      {r.category}
                    </span>
                    <span>·</span>
                    <span>Owner: {getStaffName(r.riskOwner)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Next review: {r.nextReviewDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className={cn("text-[10px] font-semibold px-2 py-1 rounded border", residual.bg, residual.color, residual.border)}>
                    Residual {r.residualRiskScore} · {residual.label}
                  </div>
                  <div className={cn("text-[10px] font-medium px-2 py-1 rounded border flex items-center gap-1", appetite.bg, appetite.color, appetite.border)}>
                    {r.riskAppetiteAlignment}
                  </div>
                  <div className={cn("flex items-center gap-1", trendColor(r.trend))}>
                    <TrendIcon className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-medium">{r.trend}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded body */}
              {isExpanded && (
                <div className="border-t px-4 pb-4 pt-3 space-y-4">
                  {/* Description */}
                  <div>
                    <h4 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1">
                      Description
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {r.description}
                    </p>
                  </div>

                  {/* Score grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="rounded-lg bg-slate-50 border border-slate-100 p-2.5 text-center">
                      <div className="text-lg font-bold text-slate-700">
                        {r.currentLikelihood}
                      </div>
                      <div className="text-[10px] text-slate-500">Likelihood (1-5)</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 border border-slate-100 p-2.5 text-center">
                      <div className="text-lg font-bold text-slate-700">
                        {r.currentImpact}
                      </div>
                      <div className="text-[10px] text-slate-500">Impact (1-5)</div>
                    </div>
                    <div className={cn("rounded-lg border p-2.5 text-center", inherent.bg, inherent.border)}>
                      <div className={cn("text-lg font-bold", inherent.color)}>
                        {r.inherentRiskScore}
                      </div>
                      <div className="text-[10px] text-slate-500">Inherent</div>
                    </div>
                    <div className={cn("rounded-lg border p-2.5 text-center", residual.bg, residual.border)}>
                      <div className={cn("text-lg font-bold", residual.color)}>
                        {r.residualRiskScore}
                      </div>
                      <div className="text-[10px] text-slate-500">Residual</div>
                    </div>
                    <div className={cn("rounded-lg border p-2.5 text-center", target.bg, target.border)}>
                      <div className={cn("text-lg font-bold", target.color)}>
                        {r.targetRiskScore}
                      </div>
                      <div className="text-[10px] text-slate-500">Target</div>
                    </div>
                  </div>

                  {/* Velocity / trend / appetite row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-md border border-slate-100 bg-slate-50 p-2.5">
                      <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-0.5">
                        Velocity of change
                      </div>
                      <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Activity className="h-3 w-3" />
                        {r.velocityOfChange}
                      </div>
                    </div>
                    <div className="rounded-md border border-slate-100 bg-slate-50 p-2.5">
                      <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-0.5">
                        Trend
                      </div>
                      <div className={cn("text-xs font-semibold flex items-center gap-1.5", trendColor(r.trend))}>
                        <TrendIcon className="h-3 w-3" />
                        {r.trend}
                      </div>
                    </div>
                    <div className={cn("rounded-md border p-2.5", appetite.bg, appetite.border)}>
                      <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-0.5">
                        Appetite alignment
                      </div>
                      <div className={cn("text-xs font-semibold", appetite.color)}>
                        {r.riskAppetiteAlignment}
                      </div>
                    </div>
                  </div>

                  {/* Current controls */}
                  <div>
                    <h4 className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                      Current controls ({r.currentControls.length})
                    </h4>
                    <ul className="space-y-1.5">
                      {r.currentControls.map((c, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-slate-700"
                        >
                          <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Additional controls required */}
                  {r.additionalControlsRequired.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide mb-2">
                        Additional controls required ({r.additionalControlsRequired.length})
                      </h4>
                      <ul className="space-y-1.5">
                        {r.additionalControlsRequired.map((c, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-slate-700"
                          >
                            <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* KRIs */}
                  <div>
                    <h4 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-2">
                      Key risk indicators
                    </h4>
                    <div className="overflow-hidden border border-slate-100 rounded-md">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50">
                          <tr className="text-left">
                            <th className="px-2.5 py-1.5 font-medium text-slate-600 text-[10px] uppercase tracking-wide">Indicator</th>
                            <th className="px-2.5 py-1.5 font-medium text-slate-600 text-[10px] uppercase tracking-wide">Current</th>
                            <th className="px-2.5 py-1.5 font-medium text-slate-600 text-[10px] uppercase tracking-wide">Threshold</th>
                            <th className="px-2.5 py-1.5 font-medium text-slate-600 text-[10px] uppercase tracking-wide">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {r.keyRiskIndicators.map((k, i) => {
                            const cfg = KRI_CONFIG[k.status];
                            return (
                              <tr key={i} className="border-t border-slate-100">
                                <td className="px-2.5 py-1.5 text-slate-700">{k.indicator}</td>
                                <td className="px-2.5 py-1.5 text-slate-700 font-medium">{k.currentValue}</td>
                                <td className="px-2.5 py-1.5 text-slate-500">{k.threshold}</td>
                                <td className="px-2.5 py-1.5">
                                  <span className={cn("inline-block text-[10px] font-semibold px-2 py-0.5 rounded border", cfg.bg, cfg.color, cfg.border)}>
                                    {k.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Escalation criteria */}
                  <div className="rounded-md border border-rose-100 bg-rose-50 p-3">
                    <div className="text-[10px] uppercase tracking-wide text-rose-700 font-semibold mb-1 flex items-center gap-1">
                      <AlertOctagon className="h-3 w-3" />
                      Escalation criteria
                    </div>
                    <p className="text-xs text-rose-900 leading-relaxed">
                      {r.escalationCriteria}
                    </p>
                  </div>

                  {/* Interconnected risks */}
                  {r.interconnectedRisks.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                        <Link2 className="h-3 w-3" />
                        Interconnected risks
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {r.interconnectedRisks.map((id) => {
                          const linked = risks.find((x) => x.id === id);
                          return (
                            <span
                              key={id}
                              className="text-[10px] px-2 py-0.5 rounded border bg-slate-50 border-slate-200 text-slate-600"
                            >
                              {linked ? linked.riskTitle : id}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Footer meta */}
                  <div className="flex items-center gap-4 flex-wrap text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <UserCog className="h-3 w-3" />
                      Owner: {getStaffName(r.riskOwner)}
                    </span>
                    <span>Review frequency: {r.reviewFrequency}</span>
                    <span>Last reviewed: {r.lastReviewed}</span>
                    <span>Next review: {r.nextReviewDate}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {visible.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <ShieldAlert className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No strategic risks match the current filters</p>
            <p className="text-xs mt-1">Adjust category or appetite filter to see results</p>
          </div>
        )}
      </div>

      {/* Regulatory note */}
      <div className="mt-8 rounded-lg bg-slate-50 border border-slate-200 p-4">
        <div className="flex items-start gap-3">
          <Scale className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-1">
              About the Strategic Risk Management Board
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              This board is the home&apos;s organisational risk register. It captures
              risks to the home as a regulated business and is reviewed by the
              Registered Manager and Responsible Individual on the cadence shown
              against each risk. It is the evidence base for The Children&apos;s Homes
              (England) Regulations 2015, Schedule 1 and the Quality Standards —
              specifically Quality Standard 13 (Leadership &amp; Management), which
              requires the Registered Manager to understand and mitigate risks to
              the quality of care, and to demonstrate clear accountability,
              decision-making and oversight at board level. Strategic risks
              recorded here are distinct from operational risks held in the Risk
              Register and individual risk plans recorded in each child&apos;s care
              plan.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
