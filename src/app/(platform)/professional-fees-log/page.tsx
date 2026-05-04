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
  Receipt,
  CheckCircle,
  Clock,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeeRecord {
  id: string;
  practitioner: string;
  organisation: string;
  practitionerType: "Therapist" | "Advocate" | "Coach" | "Tutor" | "Mentor" | "Specialist Assessor" | "Translator" | "Cultural Mentor" | "Activity Provider";
  feeFor: string;
  youngPerson: string;
  invoiceDate: string;
  invoicePeriod: string;
  amountGross: number;
  vat: number;
  amountNet: number;
  contractRef: string;
  fundingSource: "Home budget" | "Local Authority funded" | "Charitable funding" | "Cornerstone Care Group" | "Health-funded";
  fundingApproved: boolean;
  approvedBy: string;
  paymentDate: string;
  paymentMethod: "BACS" | "Cheque" | "Card" | "Cash";
  outcomesEvidenced: string[];
  hoursDelivered: number;
  hourlyRate: number;
  status: "Pending approval" | "Approved" | "Paid" | "Disputed" | "Refunded";
  recurringContract: boolean;
  contractEndDate: string;
  performanceReviewDate: string;
  reviewedBy: string;
  reviewNotes: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: FeeRecord[] = [
  {
    id: "fr-001",
    practitioner: "Dr Priya Patel",
    organisation: "Riverside CAMHS (NHS)",
    practitionerType: "Therapist",
    feeFor: "Weekly EMDR therapy sessions for Alex (March 2026)",
    youngPerson: "yp_alex",
    invoiceDate: d(-7),
    invoicePeriod: "March 2026",
    amountGross: 0,
    vat: 0,
    amountNet: 0,
    contractRef: "NHS-CAMHS-2026-A-001",
    fundingSource: "Health-funded",
    fundingApproved: true,
    approvedBy: "staff_darren",
    paymentDate: "",
    paymentMethod: "BACS",
    outcomesEvidenced: [
      "Trauma symptoms reduced (TSCC scores improving)",
      "Alex engaging consistently",
      "Relational repair with maternal contact strengthened",
    ],
    hoursDelivered: 4,
    hourlyRate: 0,
    status: "Approved",
    recurringContract: true,
    contractEndDate: d(180),
    performanceReviewDate: d(60),
    reviewedBy: "staff_darren",
    reviewNotes: "NHS-funded — no payment required. Excellent outcomes. Continuing.",
  },
  {
    id: "fr-002",
    practitioner: "Karen Hughes",
    organisation: "Coram Voice (charitable)",
    practitionerType: "Advocate",
    feeFor: "Independent advocacy sessions for Jordan (February-April 2026)",
    youngPerson: "yp_jordan",
    invoiceDate: d(-3),
    invoicePeriod: "Feb-Apr 2026",
    amountGross: 480,
    vat: 0,
    amountNet: 480,
    contractRef: "COV-2026-J-002",
    fundingSource: "Local Authority funded",
    fundingApproved: true,
    approvedBy: "staff_darren",
    paymentDate: d(-1),
    paymentMethod: "BACS",
    outcomesEvidenced: [
      "Jordan attended Coram Voice 6 times",
      "Active in CP review and resolution meeting",
      "Confidential support during pre-release planning for Mum",
      "Cultural sensitivity in advocacy approach",
    ],
    hoursDelivered: 12,
    hourlyRate: 40,
    status: "Paid",
    recurringContract: true,
    contractEndDate: d(120),
    performanceReviewDate: d(60),
    reviewedBy: "staff_darren",
    reviewNotes: "Outstanding service. Karen builds trust quickly. Cultural awareness strong. Renewal recommended.",
  },
  {
    id: "fr-003",
    practitioner: "Sarah Greenwood",
    organisation: "Reach Out Arts CIC",
    practitionerType: "Therapist",
    feeFor: "Art therapy weekly sessions for Casey (Q1 2026)",
    youngPerson: "yp_casey",
    invoiceDate: d(-14),
    invoicePeriod: "Q1 2026",
    amountGross: 1080,
    vat: 0,
    amountNet: 1080,
    contractRef: "ROA-2026-C-003",
    fundingSource: "Home budget",
    fundingApproved: true,
    approvedBy: "staff_darren",
    paymentDate: d(-7),
    paymentMethod: "BACS",
    outcomesEvidenced: [
      "Casey's art therapy progress documented",
      "Identified by CAMHS as primary therapeutic intervention",
      "Casey's piece selected for community exhibition",
      "Trauma symptoms reduced significantly (TSCC)",
    ],
    hoursDelivered: 12,
    hourlyRate: 90,
    status: "Paid",
    recurringContract: true,
    contractEndDate: d(180),
    performanceReviewDate: d(90),
    reviewedBy: "staff_darren",
    reviewNotes: "Sarah's work with Casey is exceptional. Outcomes evidence in TSCC. Renewal essential.",
  },
  {
    id: "fr-004",
    practitioner: "James Walker",
    organisation: "Riverside Boxing Club (volunteer)",
    practitionerType: "Coach",
    feeFor: "Boxing coaching membership and equipment for Alex (annual)",
    youngPerson: "yp_alex",
    invoiceDate: d(-30),
    invoicePeriod: "Annual 2026",
    amountGross: 480,
    vat: 0,
    amountNet: 480,
    contractRef: "RBC-2026-A-004",
    fundingSource: "Home budget",
    fundingApproved: true,
    approvedBy: "staff_darren",
    paymentDate: d(-25),
    paymentMethod: "BACS",
    outcomesEvidenced: [
      "Alex attends twice weekly",
      "Significant identity-protective factor",
      "Coach reports leadership emerging",
      "Selected for inter-club competition",
    ],
    hoursDelivered: 96,
    hourlyRate: 5,
    status: "Paid",
    recurringContract: true,
    contractEndDate: d(335),
    performanceReviewDate: d(180),
    reviewedBy: "staff_darren",
    reviewNotes: "Coach James is volunteer; fees cover club membership and equipment. Best ROI of any intervention. Continue.",
  },
  {
    id: "fr-005",
    practitioner: "Marcus Davies",
    organisation: "Independent Cultural Mentor",
    practitionerType: "Cultural Mentor",
    feeFor: "Cultural mentoring for Jordan — heritage exploration and identity work",
    youngPerson: "yp_jordan",
    invoiceDate: d(-2),
    invoicePeriod: "Q1 2026 (April start)",
    amountGross: 800,
    vat: 0,
    amountNet: 800,
    contractRef: "ICM-2026-J-005",
    fundingSource: "Cornerstone Care Group",
    fundingApproved: true,
    approvedBy: "staff_darren",
    paymentDate: "",
    paymentMethod: "BACS",
    outcomesEvidenced: [
      "Newly commissioned — outcomes to follow",
      "Will support cultural identity work with Jordan",
      "Linked to upcoming Mum-release transition",
    ],
    hoursDelivered: 0,
    hourlyRate: 50,
    status: "Approved",
    recurringContract: true,
    contractEndDate: d(180),
    performanceReviewDate: d(90),
    reviewedBy: "staff_darren",
    reviewNotes: "Newly commissioned. First quarter to evaluate impact. Important investment.",
  },
  {
    id: "fr-006",
    practitioner: "Helen Frost",
    organisation: "Riverside LSCB (Independent)",
    practitionerType: "Specialist Assessor",
    feeFor: "Reg 44 Independent Visitor monthly visits (Q1 2026)",
    youngPerson: "yp_alex",
    invoiceDate: d(-21),
    invoicePeriod: "Q1 2026",
    amountGross: 720,
    vat: 144,
    amountNet: 576,
    contractRef: "LSCB-REG44-2026-006",
    fundingSource: "Home budget",
    fundingApproved: true,
    approvedBy: "staff_darren",
    paymentDate: d(-14),
    paymentMethod: "BACS",
    outcomesEvidenced: [
      "Three monthly Reg 44 visits completed",
      "Reports filed within 14 days each time",
      "All children spoke privately with Helen",
      "No concerns raised; positive feedback",
    ],
    hoursDelivered: 9,
    hourlyRate: 80,
    status: "Paid",
    recurringContract: true,
    contractEndDate: d(270),
    performanceReviewDate: d(180),
    reviewedBy: "staff_darren",
    reviewNotes: "Statutory requirement (Reg 44). Helen's approach excellent — children respond positively. Continue.",
  },
  {
    id: "fr-007",
    practitioner: "Sarah Mitchell",
    organisation: "Skills4Life",
    practitionerType: "Tutor",
    feeFor: "Independent travel training (sensory-aware) for Casey",
    youngPerson: "yp_casey",
    invoiceDate: d(0),
    invoicePeriod: "April 2026",
    amountGross: 320,
    vat: 0,
    amountNet: 320,
    contractRef: "SK4L-2026-C-007",
    fundingSource: "Home budget",
    fundingApproved: false,
    approvedBy: "",
    paymentDate: "",
    paymentMethod: "BACS",
    outcomesEvidenced: [
      "Pending approval — newly proposed",
    ],
    hoursDelivered: 0,
    hourlyRate: 80,
    status: "Pending approval",
    recurringContract: false,
    contractEndDate: d(60),
    performanceReviewDate: d(60),
    reviewedBy: "",
    reviewNotes: "Awaiting approval. Cost considered against transition planning needs and Casey's specific support requirements.",
  },
];

const statusColour: Record<string, string> = {
  "Pending approval": "bg-amber-100 text-amber-800",
  Approved: "bg-blue-100 text-blue-800",
  Paid: "bg-green-100 text-green-800",
  Disputed: "bg-red-100 text-red-800",
  Refunded: "bg-purple-100 text-purple-800",
};

const exportCols: ExportColumn<FeeRecord>[] = [
  { header: "Practitioner", accessor: (r: FeeRecord) => r.practitioner },
  { header: "Organisation", accessor: (r: FeeRecord) => r.organisation },
  { header: "Type", accessor: (r: FeeRecord) => r.practitionerType },
  { header: "For", accessor: (r: FeeRecord) => r.feeFor },
  { header: "Young Person", accessor: (r: FeeRecord) => getYPName(r.youngPerson) },
  { header: "Invoice Date", accessor: (r: FeeRecord) => r.invoiceDate },
  { header: "Period", accessor: (r: FeeRecord) => r.invoicePeriod },
  { header: "Net £", accessor: (r: FeeRecord) => `£${r.amountNet.toFixed(2)}` },
  { header: "VAT £", accessor: (r: FeeRecord) => `£${r.vat.toFixed(2)}` },
  { header: "Gross £", accessor: (r: FeeRecord) => `£${r.amountGross.toFixed(2)}` },
  { header: "Funding", accessor: (r: FeeRecord) => r.fundingSource },
  { header: "Status", accessor: (r: FeeRecord) => r.status },
];

export default function ProfessionalFeesLogPage() {
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterType !== "all") items = items.filter((r) => r.practitionerType === filterType);
    if (filterStatus !== "all") items = items.filter((r) => r.status === filterStatus);
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.invoiceDate.localeCompare(a.invoiceDate);
        case "amount":
          return b.amountGross - a.amountGross;
        case "type":
          return a.practitionerType.localeCompare(b.practitionerType);
        default:
          return 0;
      }
    });
    return items;
  }, [filterType, filterStatus, sortBy]);

  const total = data.length;
  const totalSpend = data.reduce((sum, r) => sum + r.amountGross, 0);
  const pending = data.filter((r) => r.status === "Pending approval").length;
  const paid = data.filter((r) => r.status === "Paid").length;

  return (
    <PageShell
      title="Professional Fees Log"
      subtitle="Records of payments to external practitioners — therapists, advocates, coaches, tutors, mentors"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="professional-fees-log" />
          <PrintButton title="Professional Fees Log" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Active Engagements</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">£{totalSpend.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground">Total Recorded</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{paid}/{total}</p>
          <p className="text-xs text-muted-foreground">Paid</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className={cn("text-2xl font-bold", pending > 0 ? "text-amber-600" : "text-green-600")}>{pending}</p>
          <p className="text-xs text-muted-foreground">Pending Approval</p>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mb-6 flex items-start gap-2">
        <Receipt className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">
          We invest in external practitioners — therapists, advocates, coaches — because outcomes for children
          are best when supported by a network of expertise. Every fee is auditable, outcomes-evidenced, and
          reviewed for value to the children we look after.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Therapist">Therapist</SelectItem>
            <SelectItem value="Advocate">Advocate</SelectItem>
            <SelectItem value="Coach">Coach</SelectItem>
            <SelectItem value="Tutor">Tutor</SelectItem>
            <SelectItem value="Mentor">Mentor</SelectItem>
            <SelectItem value="Cultural Mentor">Cultural Mentor</SelectItem>
            <SelectItem value="Specialist Assessor">Specialist Assessor</SelectItem>
            <SelectItem value="Activity Provider">Activity Provider</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending approval">Pending Approval</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Disputed">Disputed</SelectItem>
            <SelectItem value="Refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Most Recent</SelectItem>
              <SelectItem value="amount">Highest Amount</SelectItem>
              <SelectItem value="type">By Type</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => {
          const isExpanded = expandedId === r.id;

          return (
            <div key={r.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : r.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Receipt className="h-5 w-5 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{r.practitioner} ({r.organisation})</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r.practitionerType} &middot; {r.feeFor.slice(0, 60)} &middot; {r.invoicePeriod} &middot; {getYPName(r.youngPerson)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-sm font-bold">£{r.amountGross.toFixed(0)}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", statusColour[r.status])}>{r.status}</span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Engagement</p>
                      <p className="text-sm">{r.feeFor}</p>
                      <p className="text-xs text-muted-foreground mt-1">Contract: {r.contractRef}</p>
                      <p className="text-xs text-muted-foreground">{r.recurringContract ? `Recurring contract until ${r.contractEndDate}` : "Single engagement"}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Financial</p>
                      <p className="text-sm">Net: £{r.amountNet.toFixed(2)}</p>
                      {r.vat > 0 && <p className="text-sm">VAT: £{r.vat.toFixed(2)}</p>}
                      <p className="text-sm font-bold">Gross: £{r.amountGross.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{r.hoursDelivered}h @ £{r.hourlyRate}/h</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">
                      <Wallet className="h-3 w-3 inline mr-1" />Funding
                    </p>
                    <p className="text-sm">Source: <strong>{r.fundingSource}</strong></p>
                    {r.fundingApproved ? (
                      <p className="text-xs text-blue-700 mt-1">
                        <CheckCircle className="h-3 w-3 inline mr-1" />Approved by {getStaffName(r.approvedBy)}
                      </p>
                    ) : (
                      <p className="text-xs text-amber-700 mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />Approval pending
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Outcomes Evidenced</p>
                    <ul className="space-y-1">
                      {r.outcomesEvidenced.map((o, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-1 shrink-0" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {r.reviewNotes && (
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">Performance Review</p>
                      <p className="text-sm">{r.reviewNotes}</p>
                      {r.reviewedBy && <p className="text-xs text-emerald-700 mt-1">By: {getStaffName(r.reviewedBy)}</p>}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span><Receipt className="h-3 w-3 inline mr-1" />Invoice: {r.invoiceDate}</span>
                    {r.paymentDate && <span>Paid: {r.paymentDate} ({r.paymentMethod})</span>}
                    <span>Performance review: {r.performanceReviewDate}</span>
                    {r.contractEndDate && <span>Contract ends: {r.contractEndDate}</span>}
                  </div>

                  {r.status === "Disputed" && (
                    <div className="bg-red-50 rounded-lg p-3 flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-sm">Invoice in dispute — see notes for details.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Professional fees records support Quality Standard 13
          (leadership and management — financial governance), Reg 22 (records), and corporate finance
          obligations. Every engagement is performance-reviewed against outcomes for children. Linked to
          Therapeutic Input, Advocacy, and external practitioner contracts.
        </p>
      </div>
    </PageShell>
  );
}
