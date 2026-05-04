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
  Pill,
  Lock,
  Thermometer,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuditCheckItem {
  item: string;
  pass: boolean;
  observation: string;
  actionRequired: string;
}

interface StorageAudit {
  id: string;
  auditDate: string;
  auditor: string;
  cabinetLocation: string;
  cabinetType: "Main lockable medicine cabinet" | "PRN cabinet" | "Controlled drugs safe" | "Refrigerated storage" | "Children's room (specific medication)";
  checks: AuditCheckItem[];
  temperatureRange: string;
  temperatureRecorded: number;
  temperatureWithinRange: boolean;
  expiryCheckCompleted: boolean;
  expiringSoon: { medication: string; expiryDate: string }[];
  expiredFound: { medication: string; expiryDate: string; disposalDate: string }[];
  controlledDrugsBalanceCorrect: boolean;
  controlledDrugsDiscrepancies: string[];
  cleanlinessRating: "Excellent" | "Good" | "Adequate" | "Needs attention";
  securityCheckPass: boolean;
  keysAccountedFor: boolean;
  recordKeepingPass: boolean;
  overallVerdict: "Pass" | "Pass with minor actions" | "Fail - immediate action required";
  immediateActionsTaken: string[];
  followUpActions: { action: string; owner: string; deadline: string; status: "Open" | "In Progress" | "Done" }[];
  nextAuditDue: string;
  signedOffBy: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: StorageAudit[] = [
  {
    id: "msa-001",
    auditDate: d(-3),
    auditor: "staff_ryan",
    cabinetLocation: "Office (locked)",
    cabinetType: "Main lockable medicine cabinet",
    checks: [
      { item: "Cabinet locked when not in use", pass: true, observation: "All staff observed locking after each access", actionRequired: "" },
      { item: "Two-key access for controlled drugs", pass: true, observation: "Procedure followed", actionRequired: "" },
      { item: "Temperature monitoring chart up to date", pass: true, observation: "Daily readings recorded", actionRequired: "" },
      { item: "Original packaging retained", pass: true, observation: "All medications in original boxes", actionRequired: "" },
      { item: "Patient information leaflets accessible", pass: true, observation: "All filed", actionRequired: "" },
      { item: "Stock balance matches MAR sheet", pass: true, observation: "Reconciled accurately", actionRequired: "" },
      { item: "No expired medications present", pass: true, observation: "All within date", actionRequired: "" },
      { item: "Spare keys held securely", pass: true, observation: "RM safe", actionRequired: "" },
      { item: "Cabinet labelled with controlled drugs warning", pass: true, observation: "Visible signage", actionRequired: "" },
      { item: "Disposal records up to date", pass: true, observation: "Quarterly disposal logged", actionRequired: "" },
    ],
    temperatureRange: "8-25°C",
    temperatureRecorded: 19,
    temperatureWithinRange: true,
    expiryCheckCompleted: true,
    expiringSoon: [
      { medication: "Salbutamol inhaler (Jordan)", expiryDate: d(45) },
      { medication: "Methylphenidate XL (Alex)", expiryDate: d(60) },
    ],
    expiredFound: [],
    controlledDrugsBalanceCorrect: true,
    controlledDrugsDiscrepancies: [],
    cleanlinessRating: "Excellent",
    securityCheckPass: true,
    keysAccountedFor: true,
    recordKeepingPass: true,
    overallVerdict: "Pass",
    immediateActionsTaken: [],
    followUpActions: [
      { action: "Reorder Salbutamol with 30-day buffer", owner: "staff_anna", deadline: d(15), status: "In Progress" },
      { action: "Reorder Methylphenidate with 30-day buffer", owner: "staff_anna", deadline: d(30), status: "Open" },
    ],
    nextAuditDue: d(28),
    signedOffBy: "staff_darren",
  },
  {
    id: "msa-002",
    auditDate: d(-10),
    auditor: "staff_anna",
    cabinetLocation: "Kitchen (locked PRN cabinet)",
    cabinetType: "PRN cabinet",
    checks: [
      { item: "Cabinet locked when not in use", pass: true, observation: "Locked", actionRequired: "" },
      { item: "PRN protocols visible", pass: true, observation: "Protocols on inside cabinet door", actionRequired: "" },
      { item: "Stock matches PRN log", pass: true, observation: "Reconciled", actionRequired: "" },
      { item: "Temperature appropriate", pass: true, observation: "Stable", actionRequired: "" },
      { item: "No expired medications", pass: false, observation: "Found 1 paracetamol box expired by 2 weeks", actionRequired: "Disposed via pharmacy and recorded; reorder placed" },
      { item: "Original packaging retained", pass: true, observation: "Yes", actionRequired: "" },
    ],
    temperatureRange: "8-25°C",
    temperatureRecorded: 21,
    temperatureWithinRange: true,
    expiryCheckCompleted: true,
    expiringSoon: [
      { medication: "Ibuprofen 200mg", expiryDate: d(60) },
    ],
    expiredFound: [
      { medication: "Paracetamol 500mg (PRN)", expiryDate: d(-14), disposalDate: d(-10) },
    ],
    controlledDrugsBalanceCorrect: true,
    controlledDrugsDiscrepancies: [],
    cleanlinessRating: "Good",
    securityCheckPass: true,
    keysAccountedFor: true,
    recordKeepingPass: true,
    overallVerdict: "Pass with minor actions",
    immediateActionsTaken: [
      "Expired paracetamol bagged and disposed via pharmacy on day of audit",
      "Disposal recorded in disposal log",
      "PRN log reviewed — no doses given from expired stock (caught early)",
    ],
    followUpActions: [
      { action: "Reorder paracetamol PRN", owner: "staff_anna", deadline: d(-7), status: "Done" },
      { action: "Add monthly expiry sweep to recurring shift checks", owner: "staff_darren", deadline: d(0), status: "Done" },
      { action: "Brief team on early-warning expiry threshold (60-day reorder)", owner: "staff_ryan", deadline: d(-3), status: "Done" },
    ],
    nextAuditDue: d(18),
    signedOffBy: "staff_darren",
  },
  {
    id: "msa-003",
    auditDate: d(-17),
    auditor: "staff_darren",
    cabinetLocation: "Office (controlled drugs safe)",
    cabinetType: "Controlled drugs safe",
    checks: [
      { item: "Two-key access maintained", pass: true, observation: "Both keys with authorised staff only", actionRequired: "" },
      { item: "CD register accurate and signed", pass: true, observation: "Every entry double-signed; balance correct", actionRequired: "" },
      { item: "Stock balance matches register", pass: true, observation: "Reconciled to single dose", actionRequired: "" },
      { item: "Witness procedure followed for every administration", pass: true, observation: "Confirmed via MAR sheet review", actionRequired: "" },
      { item: "Safe within fixed location (anchored)", pass: true, observation: "Yes", actionRequired: "" },
      { item: "Access log up to date", pass: true, observation: "Every access logged", actionRequired: "" },
      { item: "No expired CDs", pass: true, observation: "All within date", actionRequired: "" },
    ],
    temperatureRange: "15-25°C (room temp)",
    temperatureRecorded: 20,
    temperatureWithinRange: true,
    expiryCheckCompleted: true,
    expiringSoon: [],
    expiredFound: [],
    controlledDrugsBalanceCorrect: true,
    controlledDrugsDiscrepancies: [],
    cleanlinessRating: "Excellent",
    securityCheckPass: true,
    keysAccountedFor: true,
    recordKeepingPass: true,
    overallVerdict: "Pass",
    immediateActionsTaken: [],
    followUpActions: [],
    nextAuditDue: d(11),
    signedOffBy: "staff_darren",
  },
  {
    id: "msa-004",
    auditDate: d(-24),
    auditor: "staff_ryan",
    cabinetLocation: "Kitchen fridge (separate locked compartment)",
    cabinetType: "Refrigerated storage",
    checks: [
      { item: "Fridge temperature recorded daily", pass: true, observation: "Daily log up to date", actionRequired: "" },
      { item: "Temperature 2-8°C maintained", pass: false, observation: "One reading 9°C noted last week — fridge briefly opened too long during stocking", actionRequired: "Investigated; no medications affected (rapid recovery within 30 mins). Staff briefed." },
      { item: "Lockable compartment secure", pass: true, observation: "Locked", actionRequired: "" },
      { item: "Medication separated from food", pass: true, observation: "Separate compartment", actionRequired: "" },
      { item: "Expiry dates checked", pass: true, observation: "All within date", actionRequired: "" },
    ],
    temperatureRange: "2-8°C",
    temperatureRecorded: 4,
    temperatureWithinRange: true,
    expiryCheckCompleted: true,
    expiringSoon: [],
    expiredFound: [],
    controlledDrugsBalanceCorrect: true,
    controlledDrugsDiscrepancies: [],
    cleanlinessRating: "Good",
    securityCheckPass: true,
    keysAccountedFor: true,
    recordKeepingPass: true,
    overallVerdict: "Pass with minor actions",
    immediateActionsTaken: [
      "Temperature deviation investigated — no medication compromised",
      "Pharmacist consulted — confirmed brief excursion within tolerance",
      "Recorded in temperature deviation log",
    ],
    followUpActions: [
      { action: "Brief team on minimising fridge open-time", owner: "staff_ryan", deadline: d(-21), status: "Done" },
      { action: "Add second thermometer for redundancy", owner: "staff_anna", deadline: d(7), status: "In Progress" },
    ],
    nextAuditDue: d(4),
    signedOffBy: "staff_darren",
  },
  {
    id: "msa-005",
    auditDate: d(-30),
    auditor: "staff_anna",
    cabinetLocation: "Casey's bedroom (specific lockable container for melatonin)",
    cabinetType: "Children's room (specific medication)",
    checks: [
      { item: "Container locked", pass: true, observation: "Locked with key held by staff only", actionRequired: "" },
      { item: "Out of Casey's reach", pass: true, observation: "Top of wardrobe — Casey aware and agreed", actionRequired: "" },
      { item: "Casey informed of arrangement", pass: true, observation: "Discussed with Casey; visual reminder card", actionRequired: "" },
      { item: "Stock matches MAR sheet", pass: true, observation: "Reconciled", actionRequired: "" },
      { item: "Temperature appropriate", pass: true, observation: "Room temp stable", actionRequired: "" },
      { item: "Expiry within range", pass: true, observation: "Within date", actionRequired: "" },
    ],
    temperatureRange: "8-25°C",
    temperatureRecorded: 18,
    temperatureWithinRange: true,
    expiryCheckCompleted: true,
    expiringSoon: [],
    expiredFound: [],
    controlledDrugsBalanceCorrect: true,
    controlledDrugsDiscrepancies: [],
    cleanlinessRating: "Excellent",
    securityCheckPass: true,
    keysAccountedFor: true,
    recordKeepingPass: true,
    overallVerdict: "Pass",
    immediateActionsTaken: [],
    followUpActions: [],
    nextAuditDue: d(-2),
    signedOffBy: "staff_darren",
  },
];

const verdictColour: Record<string, string> = {
  Pass: "bg-green-100 text-green-800",
  "Pass with minor actions": "bg-amber-100 text-amber-800",
  "Fail - immediate action required": "bg-red-100 text-red-800",
};

const cleanColour: Record<string, string> = {
  Excellent: "bg-emerald-100 text-emerald-800",
  Good: "bg-blue-100 text-blue-800",
  Adequate: "bg-amber-100 text-amber-800",
  "Needs attention": "bg-red-100 text-red-800",
};

const exportCols: ExportColumn<StorageAudit>[] = [
  { header: "Date", accessor: (r: StorageAudit) => r.auditDate },
  { header: "Auditor", accessor: (r: StorageAudit) => getStaffName(r.auditor) },
  { header: "Cabinet", accessor: (r: StorageAudit) => r.cabinetLocation },
  { header: "Type", accessor: (r: StorageAudit) => r.cabinetType },
  { header: "Temp Recorded", accessor: (r: StorageAudit) => `${r.temperatureRecorded}°C` },
  { header: "Verdict", accessor: (r: StorageAudit) => r.overallVerdict },
  { header: "Cleanliness", accessor: (r: StorageAudit) => r.cleanlinessRating },
  { header: "Expired Found", accessor: (r: StorageAudit) => String(r.expiredFound.length) },
  { header: "Next Audit", accessor: (r: StorageAudit) => r.nextAuditDue },
];

export default function MedicationStorageAuditPage() {
  const [filterCabinet, setFilterCabinet] = useState("all");
  const [filterVerdict, setFilterVerdict] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterCabinet !== "all") items = items.filter((a) => a.cabinetType === filterCabinet);
    if (filterVerdict !== "all") items = items.filter((a) => a.overallVerdict === filterVerdict);
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.auditDate.localeCompare(a.auditDate);
        case "verdict":
          const ord = { "Fail - immediate action required": 0, "Pass with minor actions": 1, Pass: 2 };
          return ord[a.overallVerdict] - ord[b.overallVerdict];
        case "next":
          return a.nextAuditDue.localeCompare(b.nextAuditDue);
        default:
          return 0;
      }
    });
    return items;
  }, [filterCabinet, filterVerdict, sortBy]);

  const total = data.length;
  const passed = data.filter((a) => a.overallVerdict === "Pass").length;
  const expiredFound = data.reduce((sum, a) => sum + a.expiredFound.length, 0);
  const overdueAudits = data.filter((a) => a.nextAuditDue < d(0)).length;

  return (
    <PageShell
      title="Medication Storage Audit"
      subtitle="Regular audits of all medication storage locations — security, temperature, expiry, records"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="medication-storage-audit" />
          <PrintButton title="Medication Storage Audits" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Recent Audits</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{Math.round((passed / total) * 100)}%</p>
          <p className="text-xs text-muted-foreground">Full Pass Rate</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className={cn("text-2xl font-bold", expiredFound > 0 ? "text-amber-600" : "text-green-600")}>{expiredFound}</p>
          <p className="text-xs text-muted-foreground">Expired Items Caught</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className={cn("text-2xl font-bold", overdueAudits > 0 ? "text-red-600" : "text-green-600")}>{overdueAudits}</p>
          <p className="text-xs text-muted-foreground">Audits Overdue</p>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mb-6 flex items-start gap-2">
        <Pill className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">
          Medication storage is audited on a rolling 4-weekly schedule across all cabinets, with controlled
          drug safe audited weekly. Audits check security, temperature, expiry, stock balance, and record
          keeping. Findings inform learning, not blame.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterCabinet} onValueChange={setFilterCabinet}>
          <SelectTrigger className="w-[220px]"><SelectValue placeholder="All Cabinets" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cabinet Types</SelectItem>
            <SelectItem value="Main lockable medicine cabinet">Main Cabinet</SelectItem>
            <SelectItem value="PRN cabinet">PRN Cabinet</SelectItem>
            <SelectItem value="Controlled drugs safe">Controlled Drugs Safe</SelectItem>
            <SelectItem value="Refrigerated storage">Refrigerated</SelectItem>
            <SelectItem value="Children's room (specific medication)">Children&apos;s Room</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterVerdict} onValueChange={setFilterVerdict}>
          <SelectTrigger className="w-[220px]"><SelectValue placeholder="All Verdicts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Verdicts</SelectItem>
            <SelectItem value="Pass">Pass</SelectItem>
            <SelectItem value="Pass with minor actions">Pass with Minor Actions</SelectItem>
            <SelectItem value="Fail - immediate action required">Fail</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Most Recent</SelectItem>
              <SelectItem value="verdict">By Verdict</SelectItem>
              <SelectItem value="next">Earliest Next</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((a) => {
          const isExpanded = expandedId === a.id;
          const passedChecks = a.checks.filter((c) => c.pass).length;

          return (
            <div key={a.id} className={cn("rounded-xl border bg-white overflow-hidden",
              a.overallVerdict === "Fail - immediate action required" && "border-l-4 border-l-red-500"
            )}>
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-consistent transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : a.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Lock className="h-5 w-5 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{a.cabinetLocation}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {a.auditDate} &middot; {a.cabinetType} &middot; {passedChecks}/{a.checks.length} checks &middot; {a.temperatureRecorded}°C
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", verdictColour[a.overallVerdict])}>
                    {a.overallVerdict}
                  </span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-white rounded-lg p-2 border text-center">
                      <p className="text-xs text-muted-foreground">Cleanliness</p>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", cleanColour[a.cleanlinessRating])}>{a.cleanlinessRating}</span>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center">
                      <p className="text-xs text-muted-foreground">Security</p>
                      <p className="text-sm font-medium text-green-600">{a.securityCheckPass ? "Pass" : "Fail"}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center">
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p className="text-sm font-medium">{a.temperatureRecorded}°C ({a.temperatureRange})</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center">
                      <p className="text-xs text-muted-foreground">CD Balance</p>
                      <p className="text-sm font-medium text-green-600">{a.controlledDrugsBalanceCorrect ? "Correct" : "Discrepancy"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Audit Checks</p>
                    <div className="space-y-1">
                      {a.checks.map((c, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm flex items-start gap-2">
                          {c.pass ? <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" /> : <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />}
                          <div className="flex-1">
                            <p className="font-medium">{c.item}</p>
                            <p className="text-xs text-muted-foreground">{c.observation}</p>
                            {c.actionRequired && <p className="text-xs text-amber-700 mt-1"><strong>Action:</strong> {c.actionRequired}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {a.expiringSoon.length > 0 && (
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                        <Clock className="h-3 w-3 inline mr-1" />Expiring Soon (within 60 days)
                      </p>
                      <ul className="space-y-1">
                        {a.expiringSoon.map((e, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span><strong>{e.medication}</strong> — expires {e.expiryDate}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {a.expiredFound.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-800 uppercase tracking-wide mb-1">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />Expired Items Found &amp; Disposed
                      </p>
                      <ul className="space-y-1">
                        {a.expiredFound.map((e, i) => (
                          <li key={i} className="text-sm">
                            <strong>{e.medication}</strong> (expired {e.expiryDate}) — disposed {e.disposalDate}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {a.immediateActionsTaken.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Immediate Actions Taken</p>
                      <ul className="space-y-1">
                        {a.immediateActionsTaken.map((act, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <CheckCircle className="h-3 w-3 text-blue-500 mt-1 shrink-0" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {a.followUpActions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Follow-Up Actions</p>
                      <div className="space-y-1">
                        {a.followUpActions.map((f, i) => (
                          <div key={i} className="bg-white rounded-lg p-2 border text-sm flex items-start justify-between gap-2">
                            <span className="flex-1">{f.action}</span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {getStaffName(f.owner)} &middot; {f.deadline}
                            </span>
                            <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
                              f.status === "Done" ? "bg-green-100 text-green-800" :
                              f.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                              "bg-amber-100 text-amber-800"
                            )}>
                              {f.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span><Thermometer className="h-3 w-3 inline mr-1" />{a.temperatureRecorded}°C / range {a.temperatureRange}</span>
                    <span>Audited by: {getStaffName(a.auditor)}</span>
                    <span>Signed off: {getStaffName(a.signedOffBy)}</span>
                    <span>Next audit: {a.nextAuditDue}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Medication storage audits support Quality Standard 7 (health
          and wellbeing), Care Quality Commission medication standards, NICE NG5 (managing medicines), and
          MHRA Yellow Card scheme. Audited rolling 4-weekly minimum; controlled drugs safe weekly. Linked
          to MAR Sheet, Medication Audit, Medication Stock Check, and Medication Near-Miss Log.
        </p>
      </div>
    </PageShell>
  );
}
