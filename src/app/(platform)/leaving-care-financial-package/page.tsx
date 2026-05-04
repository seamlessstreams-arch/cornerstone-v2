"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  PiggyBank,
  Wallet,
  ArrowUpDown,
  Search,
  Home,
  Info,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  Sparkles,
  PoundSterling,
  TrendingUp,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { cn } from "@/lib/utils";
import { getYPName, getStaffName } from "@/lib/seed-data";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

/* ── types ─────────────────────────────────────────────────────────────── */

type TransitionStage =
  | "Pre-pathway"
  | "Building (16-17)"
  | "Active leaving (17-18)"
  | "Post-care (18+)";

interface SavingsEntry {
  date: string;
  amount: number;
  source: string;
}

interface LeavingCarePackage {
  id: string;
  childInitials: string;
  youngPersonId?: string; // present for current YP
  age: number;
  transitionStage: TransitionStage;
  juniorIsaBalance: number;
  juniorIsaProvider: string;
  juniorIsaContributionsToDate: string;
  savingsBalance: number;
  savingsHistory: SavingsEntry[];
  settingUpHomeAllowance: number;
  settingUpHomeAllowanceUsed: number;
  settingUpHomeAllowanceItems: string[];
  monthlyAllowanceCurrent: number;
  financialLiteracyProgression: Record<string, string>;
  bankAccountStatus: string;
  debtAndCredit: string;
  employmentStatus: string;
  benefitsApplied: string[];
  housingPathway: string;
  costofLivingCostings: string;
  futureRiskFactors: string[];
  protectiveFinancialFactors: string[];
  reviewedDate: string;
  reviewedBy: string;
}

/* ── helpers ───────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const fmtMoney = (n: number) =>
  n.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

/* ── seed (illustrative — no real account numbers) ─────────────────────── */

const SEED: LeavingCarePackage[] = [
  {
    id: "lcfp_alex",
    childInitials: "Alex (current resident)",
    youngPersonId: "yp_alex",
    age: 14,
    transitionStage: "Pre-pathway",
    juniorIsaBalance: 1284,
    juniorIsaProvider: "NatWest Adapt — Junior Cash ISA",
    juniorIsaContributionsToDate: "LA £200 annual top-up x 4 years + £15 weekly savings transfer; on track for ~£3,400 by age 18.",
    savingsBalance: 312,
    savingsHistory: [
      { date: d(-9),  amount: 15, source: "Weekly savings transfer (pocket money)" },
      { date: d(-30), amount: 200, source: "LAC corporate parent annual top-up" },
      { date: d(-45), amount: 25, source: "Birthday gift (mother) — banked with key worker" },
      { date: d(-90), amount: 15, source: "Weekly savings transfer (pocket money)" },
    ],
    settingUpHomeAllowance: 2000,
    settingUpHomeAllowanceUsed: 0,
    settingUpHomeAllowanceItems: [
      "Ring-fenced — claimable from age 16 onwards via leaving-care personal advisor",
      "Early planning workbook started in life-skills sessions (age 14)",
    ],
    monthlyAllowanceCurrent: 80,
    financialLiteracyProgression: {
      "Reading bank statements":   "Confident",
      "Budgeting weekly money":    "Confident",
      "Using a debit card":        "Developing",
      "Online banking app":        "Confident",
      "Understanding interest":    "Developing",
      "Recognising scams":         "Developing",
      "Tenancy / bills awareness": "Emerging",
      "Tax & payslips":            "Not yet introduced",
    },
    bankAccountStatus: "Junior ISA + child current account both held — child is account holder, LA joint signatory until 16.",
    debtAndCredit: "None — age-appropriate, not yet eligible for credit.",
    employmentStatus: "Full-time school (Year 9). Considering Saturday job from age 15.",
    benefitsApplied: [
      "N/A while looked after — pathway plan briefing scheduled at 15+",
    ],
    housingPathway: "Pre-pathway. Will remain in placement to age 18 with Staying Put option discussed early.",
    costofLivingCostings: "Indicative monthly budget exercise completed (£950–£1,150 for a single 18yo flat in region) — used in life-skills sessions only.",
    futureRiskFactors: [
      "Birth-mother in financial difficulty — risk of pressure to share funds",
      "Limited extended family financial scaffolding",
    ],
    protectiveFinancialFactors: [
      "Junior ISA on track — projected £3,000+ at 18",
      "Strong budgeting and digital banking confidence",
      "Stable placement — Staying Put option available",
      "Engaged with life-skills programme",
    ],
    reviewedDate: d(-12),
    reviewedBy: "staff_darren",
  },
  {
    id: "lcfp_mt",
    childInitials: "M.T. (former resident)",
    age: 16,
    transitionStage: "Building (16-17)",
    juniorIsaBalance: 2640,
    juniorIsaProvider: "Nationwide Smart Junior ISA (matures at 18)",
    juniorIsaContributionsToDate: "LA £200 annual top-up x 6 years + weekly savings; matures in ~24 months.",
    savingsBalance: 480,
    savingsHistory: [
      { date: d(-14), amount: 40, source: "Weekend job earnings (saved portion)" },
      { date: d(-45), amount: 200, source: "LAC corporate parent annual top-up" },
      { date: d(-60), amount: 30, source: "16+ care leaver bursary instalment" },
      { date: d(-120), amount: 50, source: "Birthday — godmother" },
    ],
    settingUpHomeAllowance: 2000,
    settingUpHomeAllowanceUsed: 0,
    settingUpHomeAllowanceItems: [
      "Pathway plan financial section completed with personal advisor",
      "Wishlist drafted: bedding, kitchen starter set, small white goods",
      "Voucher route preferred over cash transfer (corporate parent guidance)",
    ],
    monthlyAllowanceCurrent: 120,
    financialLiteracyProgression: {
      "Reading bank statements":   "Confident",
      "Budgeting weekly money":    "Confident",
      "Using a debit card":        "Confident",
      "Online banking app":        "Confident",
      "Understanding interest":    "Confident",
      "Recognising scams":         "Developing",
      "Tenancy / bills awareness": "Developing",
      "Tax & payslips":            "Emerging",
    },
    bankAccountStatus: "Junior ISA + 16+ adult-style current account opened (Monzo 16-17). Sole holder.",
    debtAndCredit: "No debt. Not yet using buy-now-pay-later — risks discussed in life-skills.",
    employmentStatus: "Saturday job at local café (~6 hrs/week) — paid into own account; payslips reviewed monthly.",
    benefitsApplied: [
      "Care leaver bursary (16+) — receiving",
      "16-19 college bursary application prepared for September",
    ],
    housingPathway: "Remaining in placement; Staying Put intended until 19. Trial overnight at semi-independent unit completed.",
    costofLivingCostings: "Detailed budget completed — £1,020 indicative for a one-bed in region; reviewed quarterly with personal advisor.",
    futureRiskFactors: [
      "Has indicated interest in moving in with older boyfriend — relationship & financial coercion risk discussed",
      "Limited safety-net savings outside Junior ISA",
    ],
    protectiveFinancialFactors: [
      "Junior ISA on track to mature ~£3,400",
      "Earning own income with budgeting confidence",
      "Setting Up Home Allowance fully ring-fenced",
      "Active personal advisor relationship",
      "Engaged with care leaver bursary",
    ],
    reviewedDate: d(-22),
    reviewedBy: "staff_anna",
  },
  {
    id: "lcfp_jr",
    childInitials: "J.R. (former resident)",
    age: 17,
    transitionStage: "Active leaving (17-18)",
    juniorIsaBalance: 3120,
    juniorIsaProvider: "OneFamily Junior ISA — matures in 8 months",
    juniorIsaContributionsToDate: "LA £200 annual top-up x 8 years + irregular weekly transfers; on track ~£3,300 at maturity.",
    savingsBalance: 215,
    savingsHistory: [
      { date: d(-7),  amount: 25, source: "Apprentice wages (saved portion)" },
      { date: d(-30), amount: -180, source: "Withdrawal — driving theory test + provisional licence" },
      { date: d(-60), amount: 50, source: "16+ care leaver bursary" },
      { date: d(-90), amount: 200, source: "LAC corporate parent annual top-up" },
    ],
    settingUpHomeAllowance: 2000,
    settingUpHomeAllowanceUsed: 480,
    settingUpHomeAllowanceItems: [
      "Used: bed & bedding (£260), starter kitchen set (£140), microwave (£80) — claimed via voucher",
      "Pending: small fridge, washing machine contribution, sofa (planned for move-in)",
      "Reviewed with personal advisor — full receipts on file",
    ],
    monthlyAllowanceCurrent: 0,
    financialLiteracyProgression: {
      "Reading bank statements":   "Confident",
      "Budgeting weekly money":    "Confident",
      "Using a debit card":        "Confident",
      "Online banking app":        "Confident",
      "Understanding interest":    "Confident",
      "Recognising scams":         "Confident",
      "Tenancy / bills awareness": "Confident",
      "Tax & payslips":            "Developing",
    },
    bankAccountStatus: "Adult current account (Monzo) + savings pot. Sole holder. Junior ISA matures in 8 months — guidance booked.",
    debtAndCredit: "No debt. Declined a credit card offer; understands credit-score implications. Phone contract in own name (paid on time).",
    employmentStatus: "Level 2 apprenticeship (engineering) — £252/week net. Stable since age 16.",
    benefitsApplied: [
      "Care leaver bursary (16+) — concluding at 18",
      "Council tax exemption letter prepared for first tenancy",
      "Universal Credit not required while apprentice",
    ],
    housingPathway: "Move to supported lodgings at 18 confirmed; full tenancy planned at 19. Staying Put declined — wants independence.",
    costofLivingCostings: "Detailed move-in budget agreed: £980/month rent+bills; £400 first-month buffer secured from savings + apprentice wages.",
    futureRiskFactors: [
      "Junior ISA matures into a lump sum at 18 — coaching booked to avoid impulse spending",
      "Limited social network outside care system",
      "Apprentice wage may end before next role secured",
    ],
    protectiveFinancialFactors: [
      "Junior ISA matures imminently (~£3,300)",
      "Setting Up Home Allowance partially deployed effectively",
      "Stable apprenticeship income",
      "High financial literacy across all domains",
      "Active personal advisor + Cornerstone aftercare contact",
      "Phone contract managed responsibly",
    ],
    reviewedDate: d(-6),
    reviewedBy: "staff_darren",
  },
  {
    id: "lcfp_sb",
    childInitials: "S.B. (former resident)",
    age: 19,
    transitionStage: "Post-care (18+)",
    juniorIsaBalance: 0,
    juniorIsaProvider: "Matured (Nationwide) — released at 18, transferred to adult ISA + emergency fund",
    juniorIsaContributionsToDate: "Matured at £3,180 — £2,000 retained in adult cash ISA, £1,180 deployed (driving lessons + first-month rent).",
    savingsBalance: 2150,
    savingsHistory: [
      { date: d(-10),  amount: 120, source: "Wages (saved portion)" },
      { date: d(-45),  amount: -350, source: "Withdrawal — first-month rent" },
      { date: d(-90),  amount: 180, source: "Wages (saved portion)" },
      { date: d(-180), amount: 2000, source: "Junior ISA maturity transfer to adult cash ISA" },
      { date: d(-365), amount: 1500, source: "Setting Up Home Allowance — fully deployed by age 19" },
    ],
    settingUpHomeAllowance: 2000,
    settingUpHomeAllowanceUsed: 2000,
    settingUpHomeAllowanceItems: [
      "Bed, bedding, kitchen starter set (£420)",
      "Washing machine + small fridge (£560)",
      "Sofa, small dining table (£480)",
      "Crockery, kitchen tools, vacuum, iron (£280)",
      "Council tax first-month + first-month utilities buffer (£260)",
      "All claims signed off by personal advisor; receipts archived.",
    ],
    monthlyAllowanceCurrent: 0,
    financialLiteracyProgression: {
      "Reading bank statements":   "Confident",
      "Budgeting weekly money":    "Confident",
      "Using a debit card":        "Confident",
      "Online banking app":        "Confident",
      "Understanding interest":    "Confident",
      "Recognising scams":         "Confident",
      "Tenancy / bills awareness": "Confident",
      "Tax & payslips":            "Confident",
    },
    bankAccountStatus: "Adult current account + adult cash ISA. Sole holder. Pension auto-enrolled at work.",
    debtAndCredit: "No debt. Building credit history via phone contract + small credit-builder card paid in full each month.",
    employmentStatus: "Full-time retail supervisor — £21,800 p.a. Stable 14 months.",
    benefitsApplied: [
      "Care leaver council tax exemption (until 25) — active",
      "Setting Up Home Allowance fully claimed",
      "16-25 Railcard — active",
    ],
    housingPathway: "Independent one-bedroom tenancy (12-month AST renewed). Aftercare visits monthly until 21; weekly drop-in available.",
    costofLivingCostings: "Live monthly budget: £1,140 outgoings vs £1,420 net — £280/month surplus saved.",
    futureRiskFactors: [
      "Tenancy renewal in 4 months — possible rent increase",
      "Single income — no household financial buffer beyond savings",
    ],
    protectiveFinancialFactors: [
      "£2,000 emergency fund (adult ISA) preserved post-care",
      "Stable employment with pension auto-enrolment",
      "Setting Up Home Allowance fully deployed and audited",
      "High financial literacy across all domains",
      "Active aftercare contact (until 21)",
      "Council tax exemption until 25",
      "Building positive credit history responsibly",
    ],
    reviewedDate: d(-30),
    reviewedBy: "staff_anna",
  },
];

/* ── constants ─────────────────────────────────────────────────────────── */

const STAGE_META: Record<TransitionStage, { colour: string }> = {
  "Pre-pathway":          { colour: "bg-blue-100 text-blue-700" },
  "Building (16-17)":     { colour: "bg-amber-100 text-amber-700" },
  "Active leaving (17-18)": { colour: "bg-orange-100 text-orange-700" },
  "Post-care (18+)":      { colour: "bg-green-100 text-green-700" },
};

const SKILL_COLOUR: Record<string, string> = {
  "Confident":           "bg-green-100 text-green-700",
  "Developing":          "bg-amber-100 text-amber-700",
  "Emerging":            "bg-orange-100 text-orange-700",
  "Not yet introduced":  "bg-gray-100 text-gray-600",
};

/* ── component ─────────────────────────────────────────────────────────── */

export default function LeavingCareFinancialPackagePage() {
  const [data] = useState<LeavingCarePackage[]>(SEED);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [sortBy, setSortBy] = useState("stage");

  const stats = useMemo(() => {
    return {
      activePackages: data.length,
      totalSavings: data.reduce(
        (s, r) => s + r.juniorIsaBalance + r.savingsBalance,
        0,
      ),
      settingUpSpend: data.reduce((s, r) => s + r.settingUpHomeAllowanceUsed, 0),
      livingIndependently: data.filter(
        (r) => r.transitionStage === "Post-care (18+)",
      ).length,
    };
  }, [data]);

  const filtered = useMemo(() => {
    let list = [...data];
    if (filterStage !== "all")
      list = list.filter((r) => r.transitionStage === filterStage);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.childInitials.toLowerCase().includes(q) ||
          r.juniorIsaProvider.toLowerCase().includes(q) ||
          r.housingPathway.toLowerCase().includes(q) ||
          r.employmentStatus.toLowerCase().includes(q),
      );
    }
    const stageOrder: Record<TransitionStage, number> = {
      "Pre-pathway": 0,
      "Building (16-17)": 1,
      "Active leaving (17-18)": 2,
      "Post-care (18+)": 3,
    };
    list.sort((a, b) => {
      switch (sortBy) {
        case "age":      return a.age - b.age;
        case "savings":  return (b.juniorIsaBalance + b.savingsBalance) - (a.juniorIsaBalance + a.savingsBalance);
        case "review":   return a.reviewedDate.localeCompare(b.reviewedDate);
        default:         return stageOrder[a.transitionStage] - stageOrder[b.transitionStage];
      }
    });
    return list;
  }, [data, filterStage, search, sortBy]);

  const exportCols: ExportColumn<LeavingCarePackage>[] = [
    { header: "Child",                         accessor: (r: LeavingCarePackage) => r.youngPersonId ? getYPName(r.youngPersonId) : r.childInitials },
    { header: "Age",                           accessor: (r: LeavingCarePackage) => r.age },
    { header: "Transition Stage",              accessor: (r: LeavingCarePackage) => r.transitionStage },
    { header: "Junior ISA Balance",            accessor: (r: LeavingCarePackage) => fmtMoney(r.juniorIsaBalance) },
    { header: "Junior ISA Provider",           accessor: (r: LeavingCarePackage) => r.juniorIsaProvider },
    { header: "Junior ISA Contributions",      accessor: (r: LeavingCarePackage) => r.juniorIsaContributionsToDate },
    { header: "Savings Balance",               accessor: (r: LeavingCarePackage) => fmtMoney(r.savingsBalance) },
    { header: "Setting Up Home Allowance",     accessor: (r: LeavingCarePackage) => fmtMoney(r.settingUpHomeAllowance) },
    { header: "Setting Up Home Allowance Used", accessor: (r: LeavingCarePackage) => fmtMoney(r.settingUpHomeAllowanceUsed) },
    { header: "Setting Up Items",              accessor: (r: LeavingCarePackage) => r.settingUpHomeAllowanceItems.join("; ") },
    { header: "Monthly Allowance",             accessor: (r: LeavingCarePackage) => fmtMoney(r.monthlyAllowanceCurrent) },
    { header: "Bank Account Status",           accessor: (r: LeavingCarePackage) => r.bankAccountStatus },
    { header: "Debt & Credit",                 accessor: (r: LeavingCarePackage) => r.debtAndCredit },
    { header: "Employment Status",             accessor: (r: LeavingCarePackage) => r.employmentStatus },
    { header: "Benefits Applied",              accessor: (r: LeavingCarePackage) => r.benefitsApplied.join("; ") },
    { header: "Housing Pathway",               accessor: (r: LeavingCarePackage) => r.housingPathway },
    { header: "Cost of Living Costings",       accessor: (r: LeavingCarePackage) => r.costofLivingCostings },
    { header: "Future Risk Factors",           accessor: (r: LeavingCarePackage) => r.futureRiskFactors.join("; ") },
    { header: "Protective Financial Factors",  accessor: (r: LeavingCarePackage) => r.protectiveFinancialFactors.join("; ") },
    { header: "Reviewed Date",                 accessor: (r: LeavingCarePackage) => r.reviewedDate },
    { header: "Reviewed By",                   accessor: (r: LeavingCarePackage) => getStaffName(r.reviewedBy) },
  ];

  const stages: TransitionStage[] = [
    "Pre-pathway",
    "Building (16-17)",
    "Active leaving (17-18)",
    "Post-care (18+)",
  ];

  return (
    <PageShell
      title="Leaving Care Financial Package"
      subtitle="Children (Leaving Care) Act 2000 — Setting Up Home Allowance · Junior ISA · savings · financial literacy progression"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="leaving-care-financial-package" />
          <PrintButton title="Leaving Care Financial Package" />
        </div>
      }
    >
      <div id="print-area" className="space-y-6">
        {/* Banner */}
        <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <strong>Statutory financial duty to care leavers.</strong> Under the Children (Leaving Care) Act 2000 the local authority — as corporate parent — must prepare each looked-after child for adulthood, including a Setting Up Home Allowance (typically £2,000+), Junior ISA top-ups, ring-fenced savings, and progressive financial literacy. Cornerstone tracks each young person&apos;s package from pre-pathway through to post-care aftercare. <em>All account balances shown are illustrative for review purposes only — no real account numbers, sort codes, or credentials are stored. Anonymised initials used for former residents.</em>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { l: "Active Packages",        v: stats.activePackages,                icon: Wallet,        c: "text-blue-600" },
            { l: "Total Savings (illus.)", v: fmtMoney(stats.totalSavings),        icon: PiggyBank,     c: "text-green-600" },
            { l: "Setting Up Spend",       v: fmtMoney(stats.settingUpSpend),      icon: Home,          c: "text-purple-600" },
            { l: "Living Independently",   v: stats.livingIndependently,           icon: Sparkles,      c: "text-amber-600" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg border bg-white p-3 text-center">
              <s.icon className={cn("mx-auto h-5 w-5 mb-1", s.c)} />
              <p className="text-2xl font-bold">{s.v}</p>
              <p className="text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Filters / sort */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search initials, provider, pathway, employment…"
              className="w-full rounded-md border pl-8 pr-3 py-2 text-sm"
            />
          </div>
          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger className="w-[220px]"><SelectValue placeholder="Transition stage" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1 text-sm">
            <ArrowUpDown className="h-4 w-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border px-2 py-1.5 text-sm"
            >
              <option value="stage">Stage (pre → post-care)</option>
              <option value="age">Age (low → high)</option>
              <option value="savings">Total savings (high → low)</option>
              <option value="review">Last reviewed</option>
            </select>
          </div>
        </div>

        {/* Cards */}
        {filtered.map((rec) => {
          const open = expandedId === rec.id;
          const totalSavings = rec.juniorIsaBalance + rec.savingsBalance;
          const sehaPct = rec.settingUpHomeAllowance > 0
            ? Math.min(100, Math.round((rec.settingUpHomeAllowanceUsed / rec.settingUpHomeAllowance) * 100))
            : 0;
          const displayName = rec.youngPersonId ? getYPName(rec.youngPersonId) : rec.childInitials;

          return (
            <div key={rec.id} className="rounded-lg border bg-white overflow-hidden">
              <button
                onClick={() => setExpandedId(open ? null : rec.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <PoundSterling className="h-5 w-5 text-brand" />
                  <div className="text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{displayName}</h3>
                      <span className="text-sm text-muted-foreground">— age {rec.age}</span>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", STAGE_META[rec.transitionStage].colour)}>
                        {rec.transitionStage}
                      </span>
                      {rec.youngPersonId && (
                        <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs text-pink-700">Current resident</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Junior ISA {fmtMoney(rec.juniorIsaBalance)} · Savings {fmtMoney(rec.savingsBalance)} · SUHA used {fmtMoney(rec.settingUpHomeAllowanceUsed)}/{fmtMoney(rec.settingUpHomeAllowance)} · Total {fmtMoney(totalSavings)}
                    </p>
                  </div>
                </div>
                {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>

              {open && (
                <div className="border-t p-4 space-y-4">
                  {/* Top facts */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Age:</span> {rec.age}</div>
                    <div><span className="text-muted-foreground">Stage:</span> {rec.transitionStage}</div>
                    <div><span className="text-muted-foreground">Monthly allowance:</span> {fmtMoney(rec.monthlyAllowanceCurrent)}</div>
                    <div><span className="text-muted-foreground">Reviewed:</span> {rec.reviewedDate} ({getStaffName(rec.reviewedBy)})</div>
                  </div>

                  {/* Junior ISA */}
                  <div className="rounded-lg bg-gray-50 p-3 text-sm space-y-1">
                    <p className="flex items-center gap-1 font-semibold"><PiggyBank className="h-4 w-4" /> Junior ISA</p>
                    <p><span className="text-muted-foreground">Provider:</span> {rec.juniorIsaProvider}</p>
                    <p><span className="text-muted-foreground">Balance (illustrative):</span> {fmtMoney(rec.juniorIsaBalance)}</p>
                    <p><span className="text-muted-foreground">Contributions to date:</span> {rec.juniorIsaContributionsToDate}</p>
                  </div>

                  {/* Setting Up Home Allowance */}
                  <div>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span className="font-semibold flex items-center gap-1"><Home className="h-4 w-4" /> Setting Up Home Allowance</span>
                      <span className="text-muted-foreground">{fmtMoney(rec.settingUpHomeAllowanceUsed)} / {fmtMoney(rec.settingUpHomeAllowance)} used ({sehaPct}%)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded bg-gray-100 mb-2">
                      <div className="h-full bg-brand" style={{ width: `${sehaPct}%` }} />
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {rec.settingUpHomeAllowanceItems.map((i, idx) => <li key={idx}>{i}</li>)}
                    </ul>
                  </div>

                  {/* Savings history */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1"><TrendingUp className="h-4 w-4" /> Savings history (illustrative — current balance {fmtMoney(rec.savingsBalance)})</h4>
                    <div className="space-y-2">
                      {rec.savingsHistory.map((s, i) => (
                        <div key={i} className="rounded border p-2 text-sm flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm">{s.source}</p>
                            <p className="text-xs text-muted-foreground">{s.date}</p>
                          </div>
                          <span className={cn("font-semibold whitespace-nowrap", s.amount < 0 ? "text-red-700" : "text-green-700")}>
                            {s.amount < 0 ? "−" : "+"}{fmtMoney(Math.abs(s.amount))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial literacy */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1"><GraduationCap className="h-4 w-4" /> Financial literacy progression</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(rec.financialLiteracyProgression).map(([skill, level]) => (
                        <div key={skill} className="flex items-center justify-between rounded border px-3 py-1.5 text-sm">
                          <span>{skill}</span>
                          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", SKILL_COLOUR[level] || "bg-gray-100 text-gray-700")}>
                            {level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Banking, debt, employment */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="rounded-lg bg-blue-50 p-3">
                      <h4 className="text-sm font-semibold text-blue-800 mb-1 flex items-center gap-1"><Wallet className="h-4 w-4" /> Bank account status</h4>
                      <p className="text-blue-900">{rec.bankAccountStatus}</p>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-3">
                      <h4 className="text-sm font-semibold text-purple-800 mb-1">Debt &amp; credit</h4>
                      <p className="text-purple-900">{rec.debtAndCredit}</p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-3">
                      <h4 className="text-sm font-semibold text-green-800 mb-1 flex items-center gap-1"><Briefcase className="h-4 w-4" /> Employment status</h4>
                      <p className="text-green-900">{rec.employmentStatus}</p>
                    </div>
                  </div>

                  {/* Benefits + housing + costings */}
                  <div className="rounded-lg border p-3 space-y-2 text-sm">
                    <div>
                      <h4 className="font-semibold">Benefits applied / care leaver entitlements</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {rec.benefitsApplied.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold">Housing pathway</h4>
                      <p className="text-muted-foreground">{rec.housingPathway}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Cost-of-living costings</h4>
                      <p className="text-muted-foreground">{rec.costofLivingCostings}</p>
                    </div>
                  </div>

                  {/* Risk vs protective */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-red-50 p-3">
                      <h4 className="text-sm font-semibold text-red-800 mb-1 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" /> Future financial risk factors
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-900">
                        {rec.futureRiskFactors.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-lg bg-green-50 p-3">
                      <h4 className="text-sm font-semibold text-green-800 mb-1 flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4" /> Protective financial factors
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-green-900">
                        {rec.protectiveFinancialFactors.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* Review */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm rounded-lg border p-3">
                    <div><span className="text-muted-foreground">Last review:</span> {rec.reviewedDate}</div>
                    <div><span className="text-muted-foreground">Reviewed by:</span> {getStaffName(rec.reviewedBy)}</div>
                    <div><span className="text-muted-foreground">Identifier:</span> {rec.childInitials}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Regulatory note */}
        <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-4 text-sm text-blue-900">
          <strong>Children (Leaving Care) Act 2000 &amp; Quality Standard 1.</strong> The corporate parent must give every eligible looked-after child a personal advisor, a pathway plan, and a financial package that includes the Setting Up Home Allowance, ring-fenced savings (Junior ISA top-ups while in care), and progressive financial-literacy support — covering banking, budgeting, tenancy, payslips, debt awareness and scam recognition. Aftercare duties continue to age 21 (or 25 in education). Cornerstone tracks each young person&apos;s journey from pre-pathway through to post-care so transitions are planned, not reactive. <em>All balances shown are illustrative — Cornerstone never stores real account numbers, sort codes, or credentials. Former residents are referenced by anonymised initials only.</em>
        </div>
      </div>
    </PageShell>
  );
}
