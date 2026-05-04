"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CHILD KEY DOCUMENT TRACKER
// Tracks the critical legal, identity, health and education documents the home
// holds on behalf of each young person — birth certificate, NHS card, passport,
// EHCP, court orders, IDs, etc. Required by Regulation 36 (records) and a vital
// part of preparation for transition to adulthood (handing the young person
// their own paperwork when they leave care).
// ══════════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PrintButton } from "@/components/ui/print-button";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getYPName, getStaffName } from "@/lib/seed-data";
import {
  Search, Filter, ArrowUpDown, ChevronDown, ChevronUp,
  AlertTriangle, AlertOctagon, ShieldCheck, CheckCircle2,
  FileText, Calendar, User, Eye, Lock, Package, BookOpen,
  Clock, Users, FileWarning, Stamp,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type DocStatus = "Held" | "Awaiting" | "Expired" | "With LA" | "With family" | "Lost — replacing";
type OriginalOrCopy = "Original" | "Certified Copy" | "Photocopy";

interface AccessLogEntry {
  date: string;
  accessor: string;
  reason: string;
}

interface KeyDoc {
  id: string;
  youngPerson: string;
  documentType: string;
  documentReference: string;
  originalOrCopy: OriginalOrCopy;
  status: DocStatus;
  location: string;
  keyHolder: string;
  expiryDate: string;
  renewalRequired: boolean;
  childAware: boolean;
  childCanRequestSight: boolean;
  partOfTransitionPack: boolean;
  purposeOfHolding: string;
  accessLog: AccessLogEntry[];
  lastReviewedDate: string;
  reviewedBy: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<DocStatus, { colour: string }> = {
  "Held":             { colour: "bg-green-100 text-green-700" },
  "Awaiting":         { colour: "bg-amber-100 text-amber-700" },
  "Expired":          { colour: "bg-red-100 text-red-700" },
  "With LA":          { colour: "bg-blue-100 text-blue-700" },
  "With family":      { colour: "bg-purple-100 text-purple-700" },
  "Lost — replacing": { colour: "bg-red-100 text-red-700" },
};

// ── Date Helper ───────────────────────────────────────────────────────────────

const d = (n: number) => {
  const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10);
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  if (!iso) return "—";
  const dt = new Date(iso);
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

const SEED_DOCS: KeyDoc[] = [
  // ── Alex (4 documents) ──
  {
    id: "kd_001",
    youngPerson: "yp_alex",
    documentType: "Birth Certificate",
    documentReference: "BC-XXXX-A1",
    originalOrCopy: "Certified Copy",
    status: "Held",
    location: "Locked legal file (office)",
    keyHolder: "staff_darren",
    expiryDate: "",
    renewalRequired: false,
    childAware: true,
    childCanRequestSight: true,
    partOfTransitionPack: true,
    purposeOfHolding: "Identity verification, school applications, passport applications. Original held by birth family.",
    accessLog: [
      { date: d(-120), accessor: "staff_anna", reason: "School enrolment paperwork" },
      { date: d(-40),  accessor: "staff_darren", reason: "Passport renewal application" },
    ],
    lastReviewedDate: d(-30),
    reviewedBy: "staff_darren",
  },
  {
    id: "kd_002",
    youngPerson: "yp_alex",
    documentType: "Passport",
    documentReference: "PP-XXXX-A2",
    originalOrCopy: "Original",
    status: "Held",
    location: "Office safe",
    keyHolder: "staff_darren",
    expiryDate: d(180),
    renewalRequired: true,
    childAware: true,
    childCanRequestSight: true,
    partOfTransitionPack: true,
    purposeOfHolding: "Travel, ID verification. Renewal scheduled before residential trip planned for next summer.",
    accessLog: [
      { date: d(-200), accessor: "staff_darren", reason: "Annual review check" },
      { date: d(-90),  accessor: "staff_anna", reason: "ID for college enrolment" },
    ],
    lastReviewedDate: d(-15),
    reviewedBy: "staff_darren",
  },
  {
    id: "kd_003",
    youngPerson: "yp_alex",
    documentType: "EHCP",
    documentReference: "EHCP-XXXX-A3",
    originalOrCopy: "Original",
    status: "Held",
    location: "Locked legal file (office)",
    keyHolder: "staff_darren",
    expiryDate: "",
    renewalRequired: true,
    childAware: true,
    childCanRequestSight: true,
    partOfTransitionPack: true,
    purposeOfHolding: "Statutory plan for special educational needs. Annual review with LA SEN team.",
    accessLog: [
      { date: d(-60), accessor: "staff_anna", reason: "Annual EHCP review preparation" },
      { date: d(-10), accessor: "staff_darren", reason: "Shared with school SENCo" },
    ],
    lastReviewedDate: d(-10),
    reviewedBy: "staff_anna",
  },
  {
    id: "kd_004",
    youngPerson: "yp_alex",
    documentType: "Care Order",
    documentReference: "CO-XXXX-A4",
    originalOrCopy: "Certified Copy",
    status: "Held",
    location: "Locked legal file (office)",
    keyHolder: "staff_darren",
    expiryDate: "",
    renewalRequired: false,
    childAware: true,
    childCanRequestSight: true,
    partOfTransitionPack: false,
    purposeOfHolding: "Section 31 Care Order — evidences LA's parental responsibility. Original held by LA legal team.",
    accessLog: [
      { date: d(-150), accessor: "staff_darren", reason: "Initial admission paperwork" },
    ],
    lastReviewedDate: d(-30),
    reviewedBy: "staff_darren",
  },

  // ── Jordan (4 documents) ──
  {
    id: "kd_005",
    youngPerson: "yp_jordan",
    documentType: "NHS Card",
    documentReference: "NHS-XXXX-J1",
    originalOrCopy: "Original",
    status: "Held",
    location: "Locked legal file (office)",
    keyHolder: "staff_anna",
    expiryDate: "",
    renewalRequired: false,
    childAware: true,
    childCanRequestSight: true,
    partOfTransitionPack: true,
    purposeOfHolding: "GP registration, hospital appointments, prescription verification.",
    accessLog: [
      { date: d(-75), accessor: "staff_anna", reason: "GP registration on placement start" },
      { date: d(-20), accessor: "staff_anna", reason: "Hospital appointment" },
    ],
    lastReviewedDate: d(-20),
    reviewedBy: "staff_anna",
  },
  {
    id: "kd_006",
    youngPerson: "yp_jordan",
    documentType: "Passport",
    documentReference: "PP-XXXX-J2",
    originalOrCopy: "Original",
    status: "Expired",
    location: "Office safe",
    keyHolder: "staff_darren",
    expiryDate: d(-45),
    renewalRequired: true,
    childAware: true,
    childCanRequestSight: true,
    partOfTransitionPack: false,
    purposeOfHolding: "Travel and ID. EXPIRED — renewal application submitted, awaiting return.",
    accessLog: [
      { date: d(-50), accessor: "staff_darren", reason: "Identified expiry, renewal application started" },
      { date: d(-15), accessor: "staff_darren", reason: "Posted renewal application to HMPO" },
    ],
    lastReviewedDate: d(-15),
    reviewedBy: "staff_darren",
  },
  {
    id: "kd_007",
    youngPerson: "yp_jordan",
    documentType: "Pathway Plan",
    documentReference: "PWP-XXXX-J3",
    originalOrCopy: "Original",
    status: "Held",
    location: "Locked legal file (office)",
    keyHolder: "staff_darren",
    expiryDate: "",
    renewalRequired: true,
    childAware: true,
    childCanRequestSight: true,
    partOfTransitionPack: true,
    purposeOfHolding: "Statutory pathway plan (Care Leavers Act). Reviewed every 6 months by LA personal advisor.",
    accessLog: [
      { date: d(-90), accessor: "staff_darren", reason: "PA visit — review meeting" },
      { date: d(-25), accessor: "staff_anna", reason: "Independent living skills planning" },
    ],
    lastReviewedDate: d(-25),
    reviewedBy: "staff_darren",
  },
  {
    id: "kd_008",
    youngPerson: "yp_jordan",
    documentType: "School Records",
    documentReference: "SR-XXXX-J4",
    originalOrCopy: "Photocopy",
    status: "Held",
    location: "Locked legal file (office)",
    keyHolder: "staff_anna",
    expiryDate: "",
    renewalRequired: false,
    childAware: true,
    childCanRequestSight: true,
    partOfTransitionPack: true,
    purposeOfHolding: "Historical school reports, exam certificates, attendance records — needed for college and employment applications.",
    accessLog: [
      { date: d(-110), accessor: "staff_anna", reason: "College application — predicted grades" },
    ],
    lastReviewedDate: d(-40),
    reviewedBy: "staff_anna",
  },

  // ── Casey (4 documents) ──
  {
    id: "kd_009",
    youngPerson: "yp_casey",
    documentType: "Birth Certificate",
    documentReference: "BC-XXXX-C1",
    originalOrCopy: "Certified Copy",
    status: "Awaiting",
    location: "—",
    keyHolder: "staff_darren",
    expiryDate: "",
    renewalRequired: false,
    childAware: true,
    childCanRequestSight: false,
    partOfTransitionPack: true,
    purposeOfHolding: "Awaiting transfer from previous placement. Chasing weekly with social worker.",
    accessLog: [
      { date: d(-30), accessor: "staff_darren", reason: "Initial request to LA" },
      { date: d(-7),  accessor: "staff_darren", reason: "Follow-up call with social worker" },
    ],
    lastReviewedDate: d(-7),
    reviewedBy: "staff_darren",
  },
  {
    id: "kd_010",
    youngPerson: "yp_casey",
    documentType: "Passport",
    documentReference: "PP-XXXX-C2",
    originalOrCopy: "Original",
    status: "Held",
    location: "Office safe",
    keyHolder: "staff_darren",
    expiryDate: d(60),
    renewalRequired: true,
    childAware: true,
    childCanRequestSight: true,
    partOfTransitionPack: true,
    purposeOfHolding: "ID and travel. EXPIRING SOON — renewal application being prepared.",
    accessLog: [
      { date: d(-30), accessor: "staff_darren", reason: "Annual document review identified upcoming expiry" },
    ],
    lastReviewedDate: d(-30),
    reviewedBy: "staff_darren",
  },
  {
    id: "kd_011",
    youngPerson: "yp_casey",
    documentType: "Adoption Order",
    documentReference: "AO-XXXX-C3",
    originalOrCopy: "Certified Copy",
    status: "With LA",
    location: "With LA legal team",
    keyHolder: "staff_darren",
    expiryDate: "",
    renewalRequired: false,
    childAware: false,
    childCanRequestSight: true,
    partOfTransitionPack: false,
    purposeOfHolding: "Adoption order from previous placement which broke down. Held by LA pending Life Story work — sensitive, age-appropriate disclosure being planned.",
    accessLog: [
      { date: d(-180), accessor: "staff_darren", reason: "Reviewed with social worker for Life Story planning" },
    ],
    lastReviewedDate: d(-45),
    reviewedBy: "staff_darren",
  },
  {
    id: "kd_012",
    youngPerson: "yp_casey",
    documentType: "Health Records",
    documentReference: "HR-XXXX-C4",
    originalOrCopy: "Photocopy",
    status: "Lost — replacing",
    location: "—",
    keyHolder: "staff_anna",
    expiryDate: "",
    renewalRequired: false,
    childAware: false,
    childCanRequestSight: true,
    partOfTransitionPack: true,
    purposeOfHolding: "Comprehensive health history including immunisations and CAMHS records. Lost in transit between placements — replacement copies requested from GP and previous LAC nurse.",
    accessLog: [
      { date: d(-60), accessor: "staff_anna", reason: "Identified missing during admission audit" },
      { date: d(-25), accessor: "staff_anna", reason: "Replacement requested from GP" },
    ],
    lastReviewedDate: d(-25),
    reviewedBy: "staff_anna",
  },
];

const YP_IDS = ["yp_alex", "yp_jordan", "yp_casey"] as const;

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export default function ChildKeyDocumentTrackerPage() {
  const [docs] = useState<KeyDoc[]>(SEED_DOCS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterYP, setFilterYP] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<DocStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"yp" | "type" | "expiry" | "status">("yp");

  // ── Filtering & Sorting ───────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let results = [...docs];

    if (filterYP !== "all") {
      results = results.filter(r => r.youngPerson === filterYP);
    }
    if (filterStatus !== "all") {
      results = results.filter(r => r.status === filterStatus);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(r =>
        r.documentType.toLowerCase().includes(q) ||
        r.documentReference.toLowerCase().includes(q) ||
        getYPName(r.youngPerson).toLowerCase().includes(q) ||
        r.purposeOfHolding.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      );
    }

    if (sortBy === "yp") {
      results.sort((a, b) => getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson)));
    } else if (sortBy === "type") {
      results.sort((a, b) => a.documentType.localeCompare(b.documentType));
    } else if (sortBy === "expiry") {
      results.sort((a, b) => {
        if (!a.expiryDate && !b.expiryDate) return 0;
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      });
    } else if (sortBy === "status") {
      results.sort((a, b) => a.status.localeCompare(b.status));
    }

    return results;
  }, [docs, filterYP, filterStatus, searchQuery, sortBy]);

  // ── Stats ─────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const totalHeld = docs.filter(r => r.status === "Held").length;
    const expiring12mo = docs.filter(r => {
      if (!r.expiryDate) return false;
      const days = daysUntil(r.expiryDate);
      return days <= 365 && days >= -365;
    }).length;
    const awaitingOrLost = docs.filter(r => r.status === "Awaiting" || r.status === "Lost — replacing").length;

    // Children with full pack — every document for them is in "Held" status
    const fullPack = YP_IDS.filter(ypId => {
      const ypDocs = docs.filter(r => r.youngPerson === ypId);
      if (ypDocs.length === 0) return false;
      return ypDocs.every(r => r.status === "Held");
    }).length;

    return { totalHeld, expiring12mo, awaitingOrLost, fullPack, totalChildren: YP_IDS.length };
  }, [docs]);

  // ── Export Columns ────────────────────────────────────────────────────────

  const exportCols: ExportColumn<KeyDoc>[] = [
    { header: "ID", accessor: (r: KeyDoc) => r.id },
    { header: "Young Person", accessor: (r: KeyDoc) => getYPName(r.youngPerson) },
    { header: "Document Type", accessor: (r: KeyDoc) => r.documentType },
    { header: "Reference", accessor: (r: KeyDoc) => r.documentReference },
    { header: "Original/Copy", accessor: (r: KeyDoc) => r.originalOrCopy },
    { header: "Status", accessor: (r: KeyDoc) => r.status },
    { header: "Location", accessor: (r: KeyDoc) => r.location },
    { header: "Key Holder", accessor: (r: KeyDoc) => getStaffName(r.keyHolder) },
    { header: "Expiry Date", accessor: (r: KeyDoc) => r.expiryDate || "N/A" },
    { header: "Renewal Required", accessor: (r: KeyDoc) => r.renewalRequired ? "Yes" : "No" },
    { header: "Child Aware", accessor: (r: KeyDoc) => r.childAware ? "Yes" : "No" },
    { header: "Child Can Request Sight", accessor: (r: KeyDoc) => r.childCanRequestSight ? "Yes" : "No" },
    { header: "Transition Pack", accessor: (r: KeyDoc) => r.partOfTransitionPack ? "Yes" : "No" },
    { header: "Purpose of Holding", accessor: (r: KeyDoc) => r.purposeOfHolding },
    { header: "Last Reviewed", accessor: (r: KeyDoc) => r.lastReviewedDate },
    { header: "Reviewed By", accessor: (r: KeyDoc) => getStaffName(r.reviewedBy) },
    { header: "Access Log Entries", accessor: (r: KeyDoc) => r.accessLog.length.toString() },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <PageShell
      title="Child Key Document Tracker"
      subtitle="Critical legal, identity, health & education documents held for each young person — Reg 36 records and transition-to-adulthood preparation"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Child Key Document Tracker" />
          <ExportButton data={filtered} columns={exportCols} filename="child-key-document-tracker" />
        </div>
      }
    >
      {/* ── Summary Stats ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Documents Held", value: stats.totalHeld, icon: ShieldCheck, c: "text-green-600" },
          { label: "Expiring (12 mo)", value: stats.expiring12mo, icon: AlertTriangle, c: "text-amber-600" },
          { label: "Awaiting / Lost", value: stats.awaitingOrLost, icon: FileWarning, c: "text-red-600" },
          { label: "Children Full Pack", value: `${stats.fullPack}/${stats.totalChildren}`, icon: Package, c: "text-blue-600" },
        ].map(s => (
          <div key={s.label} className="rounded-lg border bg-card p-3 flex items-center gap-3">
            <s.icon className={cn("h-5 w-5", s.c)} />
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Alert Banner ───────────────────────────────────────────────────── */}
      {stats.awaitingOrLost > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 p-3 mb-6 flex items-center gap-3">
          <AlertOctagon className="h-5 w-5 text-red-600 shrink-0" />
          <div className="text-sm text-red-800 dark:text-red-300">
            <strong>{stats.awaitingOrLost} document{stats.awaitingOrLost > 1 ? "s" : ""} awaiting receipt or being replaced.</strong>{" "}
            Missing key documents impede transition planning and can delay college, passport, and benefits applications. Chase weekly until resolved.
          </div>
        </div>
      )}

      {/* ── Filters & Search ───────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents, references, purpose..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-1">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterYP} onValueChange={setFilterYP}>
            <SelectTrigger className="w-[170px]"><SelectValue placeholder="Young Person" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Young People</SelectItem>
              {YP_IDS.map(id => (
                <SelectItem key={id} value={id}>{getYPName(id)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as DocStatus | "all")}>
          <SelectTrigger className="w-[170px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {(Object.keys(STATUS_CONFIG) as DocStatus[]).map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yp">By Young Person</SelectItem>
              <SelectItem value="type">By Document Type</SelectItem>
              <SelectItem value="expiry">By Expiry Date</SelectItem>
              <SelectItem value="status">By Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Document List ──────────────────────────────────────────────────── */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="font-medium">No documents found</p>
          </div>
        )}

        {filtered.map(doc => {
          const isOpen = expandedId === doc.id;
          const sc = STATUS_CONFIG[doc.status];
          const days = doc.expiryDate ? daysUntil(doc.expiryDate) : null;
          const expiringSoon = days !== null && days <= 90 && days >= 0;
          const expired = days !== null && days < 0;

          return (
            <div
              key={doc.id}
              className={cn(
                "rounded-lg border bg-card overflow-hidden",
                (doc.status === "Expired" || doc.status === "Lost — replacing") && "border-red-200",
                doc.status === "Awaiting" && "border-amber-200",
                expiringSoon && "border-amber-200",
              )}
            >
              <button
                onClick={() => setExpandedId(isOpen ? null : doc.id)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="rounded-full p-1.5 shrink-0 bg-blue-100 text-blue-700">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{doc.documentType}</span>
                    <Badge variant="outline" className="text-xs">
                      <User className="h-3 w-3 mr-0.5" />
                      {getYPName(doc.youngPerson)}
                    </Badge>
                    <Badge variant="outline" className={cn("text-xs", sc.colour)}>{doc.status}</Badge>
                    <Badge variant="outline" className="text-xs">
                      <Stamp className="h-3 w-3 mr-0.5" />
                      {doc.originalOrCopy}
                    </Badge>
                    {doc.partOfTransitionPack && (
                      <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                        <Package className="h-3 w-3 mr-0.5" />
                        Transition Pack
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ref: {doc.documentReference}
                    {" · "}
                    {doc.location}
                    {doc.expiryDate && (
                      <>
                        {" · "}
                        <Calendar className="inline h-3 w-3 mr-0.5" />
                        Expires: {formatDate(doc.expiryDate)}
                        {expired && <span className="text-red-600 font-semibold"> (expired {Math.abs(days!)}d ago)</span>}
                        {!expired && expiringSoon && <span className="text-amber-600 font-semibold"> ({days}d left)</span>}
                      </>
                    )}
                  </p>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
              </button>

              {isOpen && (
                <div className="border-t px-4 py-3 space-y-4 bg-muted/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Document Reference</p>
                      <p className="text-sm font-mono">{doc.documentReference}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Original / Copy</p>
                      <p className="text-sm">{doc.originalOrCopy}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Location</p>
                      <p className="text-sm flex items-center gap-1"><Lock className="h-3.5 w-3.5" />{doc.location}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Key Holder</p>
                      <p className="text-sm">{getStaffName(doc.keyHolder)}</p>
                    </div>
                    {doc.expiryDate && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Expiry Date</p>
                        <p className={cn("text-sm",
                          expired && "text-red-600 font-semibold",
                          !expired && expiringSoon && "text-amber-600 font-semibold"
                        )}>
                          {formatDate(doc.expiryDate)}
                          {expired && ` (expired ${Math.abs(days!)} days ago)`}
                          {!expired && expiringSoon && ` (${days} days remaining)`}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Renewal Required</p>
                      <p className="text-sm">{doc.renewalRequired ? "Yes" : "No"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Purpose of Holding</p>
                    <p className="text-sm">{doc.purposeOfHolding}</p>
                  </div>

                  {/* Child involvement flags */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className={cn("rounded-md border p-2 flex items-center gap-2 text-xs",
                      doc.childAware ? "bg-green-50 border-green-200 text-green-800" : "bg-muted text-muted-foreground"
                    )}>
                      {doc.childAware ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      Child aware: {doc.childAware ? "Yes" : "No"}
                    </div>
                    <div className={cn("rounded-md border p-2 flex items-center gap-2 text-xs",
                      doc.childCanRequestSight ? "bg-green-50 border-green-200 text-green-800" : "bg-muted text-muted-foreground"
                    )}>
                      <Eye className="h-3.5 w-3.5" />
                      Can request sight: {doc.childCanRequestSight ? "Yes" : "No"}
                    </div>
                    <div className={cn("rounded-md border p-2 flex items-center gap-2 text-xs",
                      doc.partOfTransitionPack ? "bg-indigo-50 border-indigo-200 text-indigo-800" : "bg-muted text-muted-foreground"
                    )}>
                      <Package className="h-3.5 w-3.5" />
                      Transition pack: {doc.partOfTransitionPack ? "Yes" : "No"}
                    </div>
                  </div>

                  {/* Access log */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Access Log ({doc.accessLog.length} entries)</p>
                    {doc.accessLog.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No recorded access events.</p>
                    ) : (
                      <div className="space-y-1">
                        {doc.accessLog.map((entry, i) => (
                          <div key={i} className="rounded-md border bg-background p-2 text-xs flex items-start gap-2">
                            <Clock className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                            <div className="flex-1">
                              <span className="font-medium">{formatDate(entry.date)}</span>
                              {" — "}
                              <span>{getStaffName(entry.accessor)}</span>
                              <p className="text-muted-foreground">{entry.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-2 border-t">
                    <span><Calendar className="inline h-3.5 w-3.5 mr-0.5" />Last reviewed: {formatDate(doc.lastReviewedDate)}</span>
                    <span><User className="inline h-3.5 w-3.5 mr-0.5" />Reviewed by: {getStaffName(doc.reviewedBy)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Regulatory Context ─────────────────────────────────────────────── */}
      <div className="mt-8 rounded-lg border border-dashed p-4">
        <div className="flex items-start gap-3">
          <BookOpen className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-semibold">Regulatory Context</p>
            <p>
              <strong>Regulation 36 (Records)</strong> of the Children&apos;s Homes (England) Regulations 2015
              requires the registered person to maintain accurate, comprehensive records on each child, including
              identity, legal status, health and education documentation. Schedule 3 sets out specific record-keeping
              requirements covering personal history, plans, and key documents.
            </p>
            <p>
              The home holds these documents in trust for the young person. Quality Standard 7 (Positive Relationships)
              and Quality Standard 11 (Health & Wellbeing) both depend on the home being able to evidence and act on
              key information. Critically, this register supports <strong>preparation for transition to adulthood</strong>:
              when a young person moves on, they should leave with a complete set of their own documents — birth certificate,
              passport, NHS card, school records, pathway plan and identity papers — so they can access housing,
              employment, healthcare and benefits without delay. Children&apos;s right to see their own records
              (under GDPR / Data Protection Act 2018) is reflected in the &quot;child can request sight&quot; flag.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
