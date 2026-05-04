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
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Award,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegistrationChange {
  id: string;
  changeType: "Initial registration" | "Change to Statement of Purpose" | "Manager change (Reg 28)" | "Responsible Individual change" | "Premises variation" | "Maximum number variation" | "Type of accommodation variation" | "Conditions of registration" | "Cancellation request" | "Annual return submission" | "Notification to Ofsted (Reg 40)";
  dateApplied: string;
  status: "Submitted" | "Pending" | "Approved" | "Refused" | "Withdrawn" | "Active";
  ofstedReference: string;
  changeDescription: string;
  reasonForChange: string;
  preparedBy: string;
  documentsSubmitted: string[];
  ofstedResponseDate: string;
  ofstedResponseSummary: string;
  effectiveDate: string;
  childrenAffected: string;
  childrenInformedHow: string;
  staffInformed: boolean;
  staffInformedHow: string;
  laInformed: boolean;
  reviewDate: string;
  notes: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: RegistrationChange[] = [
  {
    id: "rc-001",
    changeType: "Initial registration",
    dateApplied: "2018-04-15",
    status: "Approved",
    ofstedReference: "SC-XXXXXX",
    changeDescription: "Initial registration as Children's Home — Oak House",
    reasonForChange: "Establishment of new home",
    preparedBy: "staff_darren",
    documentsSubmitted: [
      "Statement of Purpose v1",
      "Children's Guide v1",
      "Floor plans",
      "Insurance certificates",
      "RM and RI Schedule 2 declarations",
      "DBS certificates",
      "Fitness statements",
      "Local Authority designation",
    ],
    ofstedResponseDate: "2018-07-20",
    ofstedResponseSummary: "Registration granted. Conditions: maximum 3 children aged 8-17.",
    effectiveDate: "2018-08-01",
    childrenAffected: "N/A — pre-opening",
    childrenInformedHow: "N/A",
    staffInformed: true,
    staffInformedHow: "Whole team meeting at opening",
    laInformed: true,
    reviewDate: d(-365),
    notes: "Foundation registration. Conditions remain in force.",
  },
  {
    id: "rc-002",
    changeType: "Change to Statement of Purpose",
    dateApplied: "2024-09-15",
    status: "Approved",
    ofstedReference: "SC-XXXXXX-SOP-2024",
    changeDescription: "Statement of Purpose v4.2 — updated therapeutic care model section to reflect TIAR framework adoption",
    reasonForChange: "Practice evolution — embedding trauma-informed assessment & response model",
    preparedBy: "staff_darren",
    documentsSubmitted: [
      "Statement of Purpose v4.2",
      "Comparison document showing changes from v4.1",
      "Cover letter",
    ],
    ofstedResponseDate: "2024-10-08",
    ofstedResponseSummary: "Acknowledged. No objections. Updated SoP filed.",
    effectiveDate: "2024-10-15",
    childrenAffected: "All current children",
    childrenInformedHow: "Children's meeting; child-friendly version updated",
    staffInformed: true,
    staffInformedHow: "Whole team training session on TIAR",
    laInformed: true,
    reviewDate: d(-180),
    notes: "Significant practice update — TIAR adoption brought into formal documentation.",
  },
  {
    id: "rc-003",
    changeType: "Annual return submission",
    dateApplied: "2025-04-30",
    status: "Approved",
    ofstedReference: "SC-XXXXXX-AR-2025",
    changeDescription: "Annual return for year ending 31 March 2025",
    reasonForChange: "Statutory annual submission",
    preparedBy: "staff_darren",
    documentsSubmitted: [
      "Annual return form completed",
      "Confirmation of insurance",
      "Statement of compliance",
    ],
    ofstedResponseDate: "2025-05-12",
    ofstedResponseSummary: "Return acknowledged. No further action.",
    effectiveDate: "2025-05-12",
    childrenAffected: "N/A — administrative",
    childrenInformedHow: "N/A",
    staffInformed: true,
    staffInformedHow: "Brief mention in team meeting",
    laInformed: false,
    reviewDate: d(0),
    notes: "Annual statutory return.",
  },
  {
    id: "rc-004",
    changeType: "Notification to Ofsted (Reg 40)",
    dateApplied: d(-45),
    status: "Approved",
    ofstedReference: "SC-XXXXXX-NOT-2026-XXX",
    changeDescription: "Reg 40 notification of serious incident — restraint episode (Casey, sensory crisis)",
    reasonForChange: "Statutory notification per Reg 40",
    preparedBy: "staff_darren",
    documentsSubmitted: [
      "Incident report",
      "Restraint debrief",
      "Casey's wishes (via visual cards)",
      "OT consultation post-event",
    ],
    ofstedResponseDate: d(-40),
    ofstedResponseSummary: "Acknowledged. Inspector appreciated thorough recording. No further action required.",
    effectiveDate: d(-45),
    childrenAffected: "Casey",
    childrenInformedHow: "Casey informed using visual cards that report was filed; reassured no negative consequence",
    staffInformed: true,
    staffInformedHow: "Reflective supervision session; lessons-learned register entry",
    laInformed: true,
    reviewDate: d(-30),
    notes: "Notification handled professionally. Demonstrated mature recording and reflective culture.",
  },
  {
    id: "rc-005",
    changeType: "Conditions of registration",
    dateApplied: "2023-03-10",
    status: "Approved",
    ofstedReference: "SC-XXXXXX-COND-2023",
    changeDescription: "Variation to add specialist accommodation criterion for ASD-aware sensory adjustments",
    reasonForChange: "Casey's admission and ongoing demand for specialist sensory provision",
    preparedBy: "staff_darren",
    documentsSubmitted: [
      "Variation request",
      "Floor plan showing sensory space additions",
      "OT report supporting sensory provision",
      "Updated SoP referencing specialist capability",
    ],
    ofstedResponseDate: "2023-04-15",
    ofstedResponseSummary: "Variation approved. Added specialist sensory capability to registration profile.",
    effectiveDate: "2023-05-01",
    childrenAffected: "Casey + future ASD-profile admissions",
    childrenInformedHow: "Casey informed through Anna; child-friendly explanation",
    staffInformed: true,
    staffInformedHow: "ASD specialist training delivered prior to variation",
    laInformed: true,
    reviewDate: "2024-04-15",
    notes: "Significant variation enabling appropriate provision for Casey and similar profiles.",
  },
  {
    id: "rc-006",
    changeType: "Change to Statement of Purpose",
    dateApplied: d(0),
    status: "Pending",
    ofstedReference: "SC-XXXXXX-SOP-2026 (pending)",
    changeDescription: "Statement of Purpose v5 — annual review including service improvement initiatives",
    reasonForChange: "Annual review per regulation",
    preparedBy: "staff_darren",
    documentsSubmitted: [
      "Statement of Purpose v5 draft",
      "Children's input documentation",
      "Cover letter",
    ],
    ofstedResponseDate: "",
    ofstedResponseSummary: "",
    effectiveDate: "",
    childrenAffected: "All current children",
    childrenInformedHow: "Children consulted in v5 draft; feedback included",
    staffInformed: true,
    staffInformedHow: "Whole team review session",
    laInformed: true,
    reviewDate: d(0),
    notes: "Submitted today; awaiting Ofsted acknowledgement.",
  },
];

const statusColour: Record<string, string> = {
  Submitted: "bg-blue-100 text-blue-800",
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-green-100 text-green-800",
  Refused: "bg-red-100 text-red-800",
  Withdrawn: "bg-slate-100 text-slate-800",
  Active: "bg-emerald-100 text-emerald-800",
};

const exportCols: ExportColumn<RegistrationChange>[] = [
  { header: "Type", accessor: (r: RegistrationChange) => r.changeType },
  { header: "Date Applied", accessor: (r: RegistrationChange) => r.dateApplied },
  { header: "Status", accessor: (r: RegistrationChange) => r.status },
  { header: "Reference", accessor: (r: RegistrationChange) => r.ofstedReference },
  { header: "Description", accessor: (r: RegistrationChange) => r.changeDescription },
  { header: "Effective Date", accessor: (r: RegistrationChange) => r.effectiveDate },
  { header: "Prepared By", accessor: (r: RegistrationChange) => getStaffName(r.preparedBy) },
];

export default function RegistrationChangesLogPage() {
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterType !== "all") items = items.filter((r) => r.changeType === filterType);
    if (filterStatus !== "all") items = items.filter((r) => r.status === filterStatus);
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.dateApplied.localeCompare(a.dateApplied);
        case "type":
          return a.changeType.localeCompare(b.changeType);
        default:
          return 0;
      }
    });
    return items;
  }, [filterType, filterStatus, sortBy]);

  const total = data.length;
  const approved = data.filter((r) => r.status === "Approved" || r.status === "Active").length;
  const pending = data.filter((r) => r.status === "Pending" || r.status === "Submitted").length;
  const thisYear = data.filter((r) => r.dateApplied.startsWith(new Date().getFullYear().toString())).length;

  return (
    <PageShell
      title="Registration Changes Log"
      subtitle="History of all changes to the home's registration with Ofsted — initial registration, variations, notifications"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="registration-changes-log" />
          <PrintButton title="Registration Changes Log" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Total Changes</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{approved}</p>
          <p className="text-xs text-muted-foreground">Approved</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className={cn("text-2xl font-bold", pending > 0 ? "text-amber-600" : "text-green-600")}>{pending}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{thisYear}</p>
          <p className="text-xs text-muted-foreground">This Year</p>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mb-6 flex items-start gap-2">
        <FileText className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">
          The home&apos;s registration with Ofsted is a living legal foundation. Every change — Statement
          of Purpose updates, manager changes, notifications, conditions — is tracked here with documents,
          rationale, response, and how children and staff were informed.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[220px]"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Initial registration">Initial Registration</SelectItem>
            <SelectItem value="Change to Statement of Purpose">SoP Change</SelectItem>
            <SelectItem value="Manager change (Reg 28)">Manager Change</SelectItem>
            <SelectItem value="Responsible Individual change">RI Change</SelectItem>
            <SelectItem value="Premises variation">Premises Variation</SelectItem>
            <SelectItem value="Maximum number variation">Max Number Variation</SelectItem>
            <SelectItem value="Type of accommodation variation">Type Variation</SelectItem>
            <SelectItem value="Conditions of registration">Conditions</SelectItem>
            <SelectItem value="Annual return submission">Annual Return</SelectItem>
            <SelectItem value="Notification to Ofsted (Reg 40)">Reg 40 Notification</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Refused">Refused</SelectItem>
            <SelectItem value="Withdrawn">Withdrawn</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Most Recent</SelectItem>
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
                  <Award className="h-5 w-5 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{r.changeType}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Applied {r.dateApplied} &middot; {r.changeDescription.slice(0, 90)}{r.changeDescription.length > 90 ? "..." : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", statusColour[r.status])}>{r.status}</span>
                  {r.status === "Approved" || r.status === "Active" ? <CheckCircle className="h-4 w-4 text-green-500" /> : null}
                  {r.status === "Pending" || r.status === "Submitted" ? <Clock className="h-4 w-4 text-amber-500" /> : null}
                  {r.status === "Refused" ? <AlertTriangle className="h-4 w-4 text-red-500" /> : null}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Description</p>
                    <p className="text-sm">{r.changeDescription}</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Reason for Change</p>
                    <p className="text-sm">{r.reasonForChange}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Documents Submitted</p>
                    <ul className="space-y-1">
                      {r.documentsSubmitted.map((d, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <FileText className="h-3 w-3 text-blue-500 mt-1 shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {r.ofstedResponseSummary && (
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">Ofsted Response</p>
                      <p className="text-sm font-medium">{r.ofstedResponseDate && `[${r.ofstedResponseDate}] `}{r.ofstedResponseSummary}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-pink-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1">Children Affected</p>
                      <p className="text-sm">{r.childrenAffected}</p>
                      {r.childrenInformedHow && <p className="text-xs text-muted-foreground mt-1">Informed: {r.childrenInformedHow}</p>}
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">Staff Informed</p>
                      <p className="text-sm">{r.staffInformed ? "Yes" : "No"}</p>
                      {r.staffInformedHow && <p className="text-xs text-muted-foreground mt-1">{r.staffInformedHow}</p>}
                    </div>
                  </div>

                  {r.notes && (
                    <div className="bg-slate-50 rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-sm">{r.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span><FileText className="h-3 w-3 inline mr-1" />Ref: {r.ofstedReference}</span>
                    <span>Prepared: {getStaffName(r.preparedBy)}</span>
                    {r.effectiveDate && <span>Effective: {r.effectiveDate}</span>}
                    {r.laInformed && <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">LA Informed</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Registration changes log supports Children&apos;s Homes
          Regulations 2015 — registration regime, Quality Standard 13 (leadership and management), and
          Ofsted&apos;s Single Children&apos;s Homes (England) Inspection Framework. All variations,
          notifications, and SoP changes documented permanently. Linked to Statement of Purpose,
          Notification Log, and Reg 45 reports.
        </p>
      </div>
    </PageShell>
  );
}
