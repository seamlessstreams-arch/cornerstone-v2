"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Wallet,
  TrendingUp,
  PiggyBank,
  AlertTriangle,
  CheckCircle2,
  Coins,
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

type BudgetCategory =
  | "Clothing & Footwear"
  | "Activities & Hobbies"
  | "School & Education"
  | "Cultural Items & Heritage"
  | "Sensory & Wellbeing"
  | "Birthdays & Anniversaries"
  | "Holidays"
  | "Personal Phone & Tech"
  | "Travel & Transport"
  | "Hairdressing & Personal Care";

interface BudgetLine {
  category: BudgetCategory;
  allocated: number;
  spent: number;
  remaining: number;
  lastSpend: string;
  notes: string;
}

interface SavingsEntry {
  date: string;
  amount: number;
  source: string;
  target: string;
}

interface ExceptionalRequest {
  request: string;
  decision: string;
  date: string;
}

interface BudgetTracker {
  id: string;
  youngPerson: string;
  financialYear: string;
  totalAnnualBudget: number;
  breakdown: BudgetLine[];
  monthlyAllowance: number;
  savingsHistory: SavingsEntry[];
  juniorIsaContributionThisYear: number;
  settingUpHomeAllowanceProgress: number;
  childInputOnSpend: string;
  agreedSpendingPriorities: string[];
  exceptionalRequests: ExceptionalRequest[];
  reviewedDate: string;
  reviewedBy: string;
  childAgreed: boolean;
}

/* ── helpers ───────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const CATEGORIES: BudgetCategory[] = [
  "Clothing & Footwear",
  "Activities & Hobbies",
  "School & Education",
  "Cultural Items & Heritage",
  "Sensory & Wellbeing",
  "Birthdays & Anniversaries",
  "Holidays",
  "Personal Phone & Tech",
  "Travel & Transport",
  "Hairdressing & Personal Care",
];

const SAVINGS_GOAL_MONTHLY = 25;

/* ── seed ──────────────────────────────────────────────────────────────── */

const SEED: BudgetTracker[] = [
  {
    id: "bt1",
    youngPerson: "yp_alex",
    financialYear: "2025-26",
    totalAnnualBudget: 4800,
    monthlyAllowance: 35,
    juniorIsaContributionThisYear: 240,
    settingUpHomeAllowanceProgress: 480,
    breakdown: [
      { category: "Clothing & Footwear",         allocated: 1200, spent: 187.50, remaining: 1012.50, lastSpend: d(-3),  notes: "On track — Alex chose own items at JD Sports and Primark." },
      { category: "Activities & Hobbies",        allocated: 600,  spent: 145.00, remaining: 455.00,  lastSpend: d(-9),  notes: "Football club subs paid Q1; gym pass renewed." },
      { category: "School & Education",          allocated: 400,  spent: 95.00,  remaining: 305.00,  lastSpend: d(-21), notes: "College stationery and a graphics calculator." },
      { category: "Cultural Items & Heritage",   allocated: 250,  spent: 30.00,  remaining: 220.00,  lastSpend: d(-40), notes: "Books on family heritage; planning museum trip." },
      { category: "Sensory & Wellbeing",         allocated: 200,  spent: 45.00,  remaining: 155.00,  lastSpend: d(-12), notes: "Weighted blanket — supports sleep routine." },
      { category: "Birthdays & Anniversaries",   allocated: 250,  spent: 0,      remaining: 250.00,  lastSpend: "—",     notes: "Birthday in November; planning under way." },
      { category: "Holidays",                    allocated: 600,  spent: 0,      remaining: 600.00,  lastSpend: "—",     notes: "Summer holiday to Cornwall scheduled August." },
      { category: "Personal Phone & Tech",       allocated: 360,  spent: 240.00, remaining: 120.00,  lastSpend: d(-18), notes: "New phone contract; child contributed £30 from own money." },
      { category: "Travel & Transport",          allocated: 300,  spent: 78.00,  remaining: 222.00,  lastSpend: d(-2),  notes: "Bus pass and contact travel." },
      { category: "Hairdressing & Personal Care",allocated: 240,  spent: 64.00,  remaining: 176.00,  lastSpend: d(-7),  notes: "Monthly haircut at preferred barber." },
    ],
    savingsHistory: [
      { date: d(-90), amount: 25, source: "Monthly allowance saving", target: "Junior ISA" },
      { date: d(-60), amount: 25, source: "Monthly allowance saving", target: "Junior ISA" },
      { date: d(-30), amount: 25, source: "Monthly allowance saving", target: "Junior ISA" },
      { date: d(-30), amount: 50, source: "Birthday gift from grandparent", target: "Personal savings account" },
      { date: d(-7),  amount: 25, source: "Monthly allowance saving", target: "Junior ISA" },
    ],
    childInputOnSpend: "Alex requested a larger allocation for activities so he can join the football academy trial weekend. Agreed to redirect £50 from cultural items.",
    agreedSpendingPriorities: [
      "Save £25/month into Junior ISA without fail",
      "Build up funds for a football academy weekend",
      "Replace winter coat before October half-term",
    ],
    exceptionalRequests: [
      { request: "£120 extra for football academy trial weekend (kit + travel)", decision: "Approved by RM — funded from contingency", date: d(-45) },
      { request: "£80 for noise-cancelling headphones for revision", decision: "Approved — sensory + education benefit, recorded against Sensory & Wellbeing", date: d(-20) },
    ],
    reviewedDate: d(-14),
    reviewedBy: "staff_darren",
    childAgreed: true,
  },
  {
    id: "bt2",
    youngPerson: "yp_jordan",
    financialYear: "2025-26",
    totalAnnualBudget: 4800,
    monthlyAllowance: 25,
    juniorIsaContributionThisYear: 100,
    settingUpHomeAllowanceProgress: 280,
    breakdown: [
      { category: "Clothing & Footwear",         allocated: 1200, spent: 95.00,  remaining: 1105.00, lastSpend: d(-10), notes: "Soft fabric items only — sensory consideration." },
      { category: "Activities & Hobbies",        allocated: 600,  spent: 60.00,  remaining: 540.00,  lastSpend: d(-22), notes: "Art supplies — Jordan engaging well with art therapy." },
      { category: "School & Education",          allocated: 400,  spent: 40.00,  remaining: 360.00,  lastSpend: d(-30), notes: "School supplies; tutor resources to follow." },
      { category: "Cultural Items & Heritage",   allocated: 250,  spent: 80.00,  remaining: 170.00,  lastSpend: d(-25), notes: "Heritage cookbook + ingredients for cultural meal evenings." },
      { category: "Sensory & Wellbeing",         allocated: 350,  spent: 130.00, remaining: 220.00,  lastSpend: d(-8),  notes: "Sensory lighting + fidget tools — care plan recommendation." },
      { category: "Birthdays & Anniversaries",   allocated: 250,  spent: 60.00,  remaining: 190.00,  lastSpend: d(-50), notes: "Mother's Day gift — supported contact." },
      { category: "Holidays",                    allocated: 600,  spent: 0,      remaining: 600.00,  lastSpend: "—",     notes: "Quiet seaside break planned (sensory-friendly)." },
      { category: "Personal Phone & Tech",       allocated: 250,  spent: 180.00, remaining: 70.00,   lastSpend: d(-15), notes: "Tablet and protective case." },
      { category: "Travel & Transport",          allocated: 300,  spent: 45.00,  remaining: 255.00,  lastSpend: d(-4),  notes: "Family contact travel reimbursements." },
      { category: "Hairdressing & Personal Care",allocated: 240,  spent: 50.00,  remaining: 190.00,  lastSpend: d(-18), notes: "Quiet salon — sensory-friendly slot." },
    ],
    savingsHistory: [
      { date: d(-120), amount: 25, source: "Monthly allowance saving", target: "Junior ISA" },
      { date: d(-90),  amount: 25, source: "Monthly allowance saving", target: "Junior ISA" },
      { date: d(-30),  amount: 25, source: "Monthly allowance saving", target: "Junior ISA" },
      { date: d(-30),  amount: 25, source: "Monthly allowance saving", target: "Junior ISA" },
    ],
    childInputOnSpend: "Jordan prefers staff to pre-select 2-3 options, then chooses. Found shopping decisions overwhelming. Has agreed clear weekly routines for spending.",
    agreedSpendingPriorities: [
      "Maintain steady Junior ISA contributions",
      "Invest in sensory regulation tools recommended by therapist",
      "Save toward a personal art kit for 14th birthday",
    ],
    exceptionalRequests: [
      { request: "£60 for weighted lap pad recommended by OT", decision: "Approved — therapeutic need", date: d(-35) },
    ],
    reviewedDate: d(-21),
    reviewedBy: "staff_anna",
    childAgreed: true,
  },
  {
    id: "bt3",
    youngPerson: "yp_casey",
    financialYear: "2025-26",
    totalAnnualBudget: 5200,
    monthlyAllowance: 45,
    juniorIsaContributionThisYear: 360,
    settingUpHomeAllowanceProgress: 1250,
    breakdown: [
      { category: "Clothing & Footwear",         allocated: 1200, spent: 245.00, remaining: 955.00,  lastSpend: d(-2),  notes: "Includes interview outfit — independence pathway milestone." },
      { category: "Activities & Hobbies",        allocated: 700,  spent: 220.00, remaining: 480.00,  lastSpend: d(-6),  notes: "Driving lessons started — pathway plan priority." },
      { category: "School & Education",          allocated: 500,  spent: 165.00, remaining: 335.00,  lastSpend: d(-11), notes: "College textbooks and laptop accessories." },
      { category: "Cultural Items & Heritage",   allocated: 250,  spent: 90.00,  remaining: 160.00,  lastSpend: d(-28), notes: "Identity-affirming books and cultural workshop fee." },
      { category: "Sensory & Wellbeing",         allocated: 200,  spent: 25.00,  remaining: 175.00,  lastSpend: d(-40), notes: "Aromatherapy kit." },
      { category: "Birthdays & Anniversaries",   allocated: 250,  spent: 90.00,  remaining: 160.00,  lastSpend: d(-60), notes: "Birthday celebration with friends." },
      { category: "Holidays",                    allocated: 700,  spent: 250.00, remaining: 450.00,  lastSpend: d(-14), notes: "Independent travel weekend with peer (planned & risk-assessed)." },
      { category: "Personal Phone & Tech",       allocated: 500,  spent: 320.00, remaining: 180.00,  lastSpend: d(-9),  notes: "Phone upgrade + laptop repair — independence pathway." },
      { category: "Travel & Transport",          allocated: 500,  spent: 175.00, remaining: 325.00,  lastSpend: d(-1),  notes: "Provisional licence + driving lesson travel." },
      { category: "Hairdressing & Personal Care",allocated: 400,  spent: 140.00, remaining: 260.00,  lastSpend: d(-12), notes: "Casey manages own appointments — encouraged." },
    ],
    savingsHistory: [
      { date: d(-150), amount: 30, source: "Monthly allowance saving", target: "Junior ISA" },
      { date: d(-120), amount: 30, source: "Monthly allowance saving", target: "Junior ISA" },
      { date: d(-90),  amount: 30, source: "Monthly allowance saving", target: "Junior ISA" },
      { date: d(-60),  amount: 30, source: "Monthly allowance saving", target: "Junior ISA" },
      { date: d(-30),  amount: 30, source: "Monthly allowance saving", target: "Junior ISA" },
      { date: d(-30),  amount: 100, source: "Part-time job earnings", target: "Personal savings — driving lessons" },
      { date: d(-7),   amount: 30, source: "Monthly allowance saving", target: "Junior ISA" },
    ],
    childInputOnSpend: "Casey is leading own budget decisions as part of independence pathway. Tracks spend in a personal app and reviews monthly with key worker.",
    agreedSpendingPriorities: [
      "Pass driving theory + practical test before 18th birthday",
      "Save consistently toward Setting Up Home costs",
      "Maintain Junior ISA contributions",
      "Build a starter wardrobe of work-appropriate clothing",
    ],
    exceptionalRequests: [
      { request: "£200 toward intensive driving course",       decision: "Approved — pathway plan priority", date: d(-22) },
      { request: "£75 for college trip to London",             decision: "Approved — educational benefit", date: d(-65) },
      { request: "£150 toward laptop repair after accident",   decision: "Part-approved — Casey contributing £40", date: d(-12) },
    ],
    reviewedDate: d(-7),
    reviewedBy: "staff_darren",
    childAgreed: true,
  },
];

/* ── component ─────────────────────────────────────────────────────────── */

export default function PlacementBudgetTrackerPage() {
  const [data] = useState<BudgetTracker[]>(SEED);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterYP, setFilterYP] = useState("all");
  const [sortBy, setSortBy] = useState("youngPerson");

  /* summary stats */
  const stats = useMemo(() => {
    const totalAllocated = data.reduce((s, r) => s + r.totalAnnualBudget, 0);
    const totalSpent = data.reduce(
      (s, r) => s + r.breakdown.reduce((a, b) => a + b.spent, 0),
      0,
    );
    const monthsElapsed = 7; // illustrative — through November of FY
    const meetingSavingsGoal = data.filter((r) => {
      const ytdSavings = r.savingsHistory
        .filter((h) => h.target.toLowerCase().includes("isa") || h.source.toLowerCase().includes("monthly allowance"))
        .reduce((a, b) => a + b.amount, 0);
      return ytdSavings >= SAVINGS_GOAL_MONTHLY * monthsElapsed * 0.6;
    }).length;
    const exceptional = data.reduce((s, r) => s + r.exceptionalRequests.length, 0);
    return { totalAllocated, totalSpent, meetingSavingsGoal, exceptional };
  }, [data]);

  /* sorted/filtered list */
  const list = useMemo(() => {
    let l = [...data];
    if (filterYP !== "all") l = l.filter((r) => r.youngPerson === filterYP);
    l.sort((a, b) => {
      switch (sortBy) {
        case "spent": {
          const aS = a.breakdown.reduce((s, x) => s + x.spent, 0);
          const bS = b.breakdown.reduce((s, x) => s + x.spent, 0);
          return bS - aS;
        }
        case "remaining": {
          const aR = a.totalAnnualBudget - a.breakdown.reduce((s, x) => s + x.spent, 0);
          const bR = b.totalAnnualBudget - b.breakdown.reduce((s, x) => s + x.spent, 0);
          return bR - aR;
        }
        case "reviewed":
          return b.reviewedDate.localeCompare(a.reviewedDate);
        default:
          return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
      }
    });
    return l;
  }, [data, filterYP, sortBy]);

  /* export — flatten breakdown rows */
  const exportData = useMemo(
    () =>
      data.flatMap((r) =>
        r.breakdown.map((b) => ({
          id: r.id,
          youngPerson: r.youngPerson,
          financialYear: r.financialYear,
          totalAnnualBudget: r.totalAnnualBudget,
          breakdown: r.breakdown,
          monthlyAllowance: r.monthlyAllowance,
          savingsHistory: r.savingsHistory,
          juniorIsaContributionThisYear: r.juniorIsaContributionThisYear,
          settingUpHomeAllowanceProgress: r.settingUpHomeAllowanceProgress,
          childInputOnSpend: r.childInputOnSpend,
          agreedSpendingPriorities: r.agreedSpendingPriorities,
          exceptionalRequests: r.exceptionalRequests,
          reviewedDate: r.reviewedDate,
          reviewedBy: r.reviewedBy,
          childAgreed: r.childAgreed,
          _category: b.category,
          _allocated: b.allocated,
          _spent: b.spent,
          _remaining: b.remaining,
          _lastSpend: b.lastSpend,
          _notes: b.notes,
        })),
      ),
    [data],
  );

  type ExportRow = typeof exportData[number];

  const exportCols: ExportColumn<ExportRow>[] = [
    { header: "Young Person",       accessor: (r: ExportRow) => getYPName(r.youngPerson) },
    { header: "Financial Year",     accessor: (r: ExportRow) => r.financialYear },
    { header: "Total Annual Budget",accessor: (r: ExportRow) => `£${r.totalAnnualBudget.toFixed(2)}` },
    { header: "Monthly Allowance",  accessor: (r: ExportRow) => `£${r.monthlyAllowance.toFixed(2)}` },
    { header: "Category",           accessor: (r: ExportRow) => r._category },
    { header: "Allocated",          accessor: (r: ExportRow) => `£${r._allocated.toFixed(2)}` },
    { header: "Spent",              accessor: (r: ExportRow) => `£${r._spent.toFixed(2)}` },
    { header: "Remaining",          accessor: (r: ExportRow) => `£${r._remaining.toFixed(2)}` },
    { header: "Last Spend",         accessor: (r: ExportRow) => r._lastSpend },
    { header: "Notes",              accessor: (r: ExportRow) => r._notes },
    { header: "Junior ISA YTD",     accessor: (r: ExportRow) => `£${r.juniorIsaContributionThisYear.toFixed(2)}` },
    { header: "Setting Up Home £",  accessor: (r: ExportRow) => `£${r.settingUpHomeAllowanceProgress.toFixed(2)}` },
    { header: "Reviewed Date",      accessor: (r: ExportRow) => r.reviewedDate },
    { header: "Reviewed By",        accessor: (r: ExportRow) => getStaffName(r.reviewedBy) },
    { header: "Child Agreed",       accessor: (r: ExportRow) => (r.childAgreed ? "Yes" : "No") },
  ];

  return (
    <PageShell
      title="Placement Budget Tracker"
      subtitle="Each child's annual budget across categories — financial governance, transparency and corporate parenting (illustrative figures)"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={exportData} columns={exportCols} filename="placement-budget-tracker" />
          <PrintButton title="Placement Budget Tracker" />
        </div>
      }
    >
      <div id="print-area" className="space-y-6">
        {/* summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { l: "Total Allocated",          v: `£${stats.totalAllocated.toLocaleString()}`, icon: Wallet,        c: "text-blue-600" },
            { l: "Total Spent YTD",          v: `£${stats.totalSpent.toFixed(2)}`,           icon: TrendingUp,    c: "text-amber-600" },
            { l: "Meeting Savings Goal",     v: `${stats.meetingSavingsGoal} / ${data.length}`, icon: PiggyBank,  c: "text-green-600" },
            { l: "Exceptional Requests",     v: stats.exceptional,                            icon: AlertTriangle, c: "text-purple-600" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg border bg-white p-3 text-center">
              <s.icon className={cn("mx-auto h-5 w-5 mb-1", s.c)} />
              <p className="text-2xl font-bold">{s.v}</p>
              <p className="text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        {/* filters / sort */}
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={filterYP} onValueChange={setFilterYP}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Young Person" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Children</SelectItem>
              {data.map((r) => (
                <SelectItem key={r.youngPerson} value={r.youngPerson}>{getYPName(r.youngPerson)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 text-sm">
            <ArrowUpDown className="h-4 w-4" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="youngPerson">Young Person (A–Z)</SelectItem>
                <SelectItem value="spent">Total Spent</SelectItem>
                <SelectItem value="remaining">Remaining</SelectItem>
                <SelectItem value="reviewed">Last Reviewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* expandable per-child cards */}
        <div className="space-y-3">
          {list.map((rec) => {
            const totalSpent = rec.breakdown.reduce((s, x) => s + x.spent, 0);
            const remaining = rec.totalAnnualBudget - totalSpent;
            const pct = (totalSpent / rec.totalAnnualBudget) * 100;
            const isOpen = expandedId === rec.id;
            return (
              <div key={rec.id} className="rounded-lg border bg-white overflow-hidden">
                <button
                  onClick={() => setExpandedId(isOpen ? null : rec.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 text-left">
                    <Coins className="h-5 w-5 text-brand" />
                    <div>
                      <h3 className="font-semibold">{getYPName(rec.youngPerson)}</h3>
                      <p className="text-xs text-muted-foreground">
                        FY {rec.financialYear} · £{totalSpent.toFixed(2)} / £{rec.totalAnnualBudget.toLocaleString()} ·
                        {" "}Reviewed {rec.reviewedDate} by {getStaffName(rec.reviewedBy)}
                        {" "}{rec.childAgreed ? "· Child agreed" : "· Awaiting child sign-off"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block w-40">
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            pct > 90 ? "bg-red-400" : pct > 70 ? "bg-amber-400" : "bg-green-400",
                          )}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-muted-foreground mt-0.5">
                        <span>£{remaining.toFixed(0)} left</span>
                        <span>{Math.round(pct)}%</span>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t p-4 space-y-5">
                    {/* breakdown table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-xs text-muted-foreground">
                            <th className="pb-2 pr-3">Category</th>
                            <th className="pb-2 pr-3">Allocated</th>
                            <th className="pb-2 pr-3">Spent</th>
                            <th className="pb-2 pr-3">Remaining</th>
                            <th className="pb-2 pr-3">Last Spend</th>
                            <th className="pb-2">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rec.breakdown.map((b) => {
                            const linePct = (b.spent / b.allocated) * 100;
                            return (
                              <tr key={b.category} className="border-b last:border-0">
                                <td className="py-2 pr-3 font-medium">{b.category}</td>
                                <td className="py-2 pr-3">£{b.allocated.toFixed(2)}</td>
                                <td className="py-2 pr-3">£{b.spent.toFixed(2)}</td>
                                <td className="py-2 pr-3">
                                  <span
                                    className={cn(
                                      "font-medium",
                                      linePct > 90 ? "text-red-600" : linePct > 70 ? "text-amber-600" : "text-green-600",
                                    )}
                                  >
                                    £{b.remaining.toFixed(2)}
                                  </span>
                                </td>
                                <td className="py-2 pr-3 whitespace-nowrap">{b.lastSpend}</td>
                                <td className="py-2 text-muted-foreground">{b.notes}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* summary boxes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="rounded-lg bg-blue-50 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Wallet className="h-4 w-4 text-blue-700" />
                          <h4 className="text-sm font-semibold text-blue-900">Monthly Allowance</h4>
                        </div>
                        <p className="text-xl font-bold text-blue-900">£{rec.monthlyAllowance.toFixed(2)}</p>
                        <p className="text-xs text-blue-800">paid weekly/monthly to young person</p>
                      </div>
                      <div className="rounded-lg bg-green-50 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <PiggyBank className="h-4 w-4 text-green-700" />
                          <h4 className="text-sm font-semibold text-green-900">Junior ISA — YTD</h4>
                        </div>
                        <p className="text-xl font-bold text-green-900">£{rec.juniorIsaContributionThisYear.toFixed(2)}</p>
                        <p className="text-xs text-green-800">contributions this financial year</p>
                      </div>
                      <div className="rounded-lg bg-purple-50 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="h-4 w-4 text-purple-700" />
                          <h4 className="text-sm font-semibold text-purple-900">Setting Up Home</h4>
                        </div>
                        <p className="text-xl font-bold text-purple-900">£{rec.settingUpHomeAllowanceProgress.toFixed(2)}</p>
                        <p className="text-xs text-purple-800">earned/accrued toward leaving-care grant</p>
                      </div>
                    </div>

                    {/* savings history */}
                    <div className="rounded-lg border p-3">
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-1"><PiggyBank className="h-4 w-4" /> Savings History</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b text-left text-xs text-muted-foreground">
                              <th className="pb-2 pr-3">Date</th>
                              <th className="pb-2 pr-3">Amount</th>
                              <th className="pb-2 pr-3">Source</th>
                              <th className="pb-2">Target</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rec.savingsHistory.map((s, i) => (
                              <tr key={i} className="border-b last:border-0">
                                <td className="py-1.5 pr-3 whitespace-nowrap">{s.date}</td>
                                <td className="py-1.5 pr-3 font-medium">£{s.amount.toFixed(2)}</td>
                                <td className="py-1.5 pr-3">{s.source}</td>
                                <td className="py-1.5">{s.target}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* child input */}
                    <div className="rounded-lg bg-pink-50 p-3">
                      <h4 className="text-sm font-semibold text-pink-800 mb-1">Child's Input on Spend</h4>
                      <p className="text-sm text-pink-900">{rec.childInputOnSpend}</p>
                    </div>

                    {/* agreed priorities */}
                    <div className="rounded-lg bg-amber-50 p-3">
                      <h4 className="text-sm font-semibold text-amber-900 mb-1">Agreed Spending Priorities</h4>
                      <ul className="list-disc list-inside text-sm text-amber-900">
                        {rec.agreedSpendingPriorities.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>

                    {/* exceptional requests */}
                    {rec.exceptionalRequests.length > 0 && (
                      <div className="rounded-lg border p-3">
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-amber-600" /> Exceptional Requests this Year
                        </h4>
                        <ul className="space-y-2 text-sm">
                          {rec.exceptionalRequests.map((er, i) => (
                            <li key={i} className="border-l-2 border-amber-300 pl-3">
                              <p className="font-medium">{er.request}</p>
                              <p className="text-xs text-muted-foreground">{er.date} — {er.decision}</p>
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

        {/* regulatory note */}
        <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-4 text-sm text-blue-900">
          <strong>Quality Standard 13 — Leadership &amp; management / financial governance.</strong>{" "}
          Each child's placement is properly funded and money is spent in their best interests, reflecting corporate
          parenting principles. Budgets must be transparent, agreed with the child where age-appropriate, regularly
          reviewed and recorded. Junior ISAs and Setting Up Home allowances should be tracked to ensure entitlements
          are protected. All figures shown are illustrative only (£ GBP).
        </div>
      </div>
    </PageShell>
  );
}
