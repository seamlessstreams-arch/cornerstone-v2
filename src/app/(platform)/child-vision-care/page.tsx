"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Eye, Glasses, Calendar, ChevronUp, ChevronDown, ArrowUpDown, Search, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStaffName, getYPName } from "@/lib/seed-data";

/* ── types ─────────────────────────────────────────────────────────────────── */

type VisionStatus =
  | "No correction needed"
  | "Prescription glasses"
  | "Contact lenses"
  | "Glasses + contacts"
  | "Awaiting test"
  | "Specialist referral active";

type WearConsistency = "Always" | "Mostly" | "Inconsistent" | "Resists";

interface VisionRecord {
  id: string;
  youngPerson: string;
  recordedDate: string;
  status: VisionStatus;
  lastSightTestDate?: string;
  nextSightTestDue?: string;
  optometrist?: string;
  prescription?: { right: string; left: string };
  glassesFrames?: { brand: string; model: string; purchaseDate: string };
  spareGlassesAvailable: boolean;
  contactLensType?: string;
  symptomsReported: string[];
  specialistReferral?: { service: string; date: string; reason: string };
  schoolAware: boolean;
  childWearsConsistently?: WearConsistency;
  cleaningRoutine: string[];
  childVoice: string;
  staffObservation: string;
  reviewDate: string;
  keyWorker: string;
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const STATUS_CLR: Record<VisionStatus, string> = {
  "No correction needed": "bg-emerald-100 text-emerald-800",
  "Prescription glasses": "bg-sky-100 text-sky-800",
  "Contact lenses": "bg-teal-100 text-teal-800",
  "Glasses + contacts": "bg-cyan-100 text-cyan-800",
  "Awaiting test": "bg-amber-100 text-amber-800",
  "Specialist referral active": "bg-rose-100 text-rose-800",
};

const BORDER_STATUS: Record<VisionStatus, string> = {
  "No correction needed": "border-l-emerald-400",
  "Prescription glasses": "border-l-sky-500",
  "Contact lenses": "border-l-teal-500",
  "Glasses + contacts": "border-l-cyan-500",
  "Awaiting test": "border-l-amber-500",
  "Specialist referral active": "border-l-rose-500",
};

const WEAR_CLR: Record<WearConsistency, string> = {
  "Always": "bg-emerald-100 text-emerald-800",
  "Mostly": "bg-sky-100 text-sky-800",
  "Inconsistent": "bg-amber-100 text-amber-800",
  "Resists": "bg-rose-100 text-rose-800",
};

const STATUSES: VisionStatus[] = [
  "No correction needed",
  "Prescription glasses",
  "Contact lenses",
  "Glasses + contacts",
  "Awaiting test",
  "Specialist referral active",
];

const isOverdue = (dateStr?: string) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
};

const daysUntil = (dateStr?: string) => {
  if (!dateStr) return Infinity;
  const ms = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

/* ── seed data ─────────────────────────────────────────────────────────────── */

const SEED: VisionRecord[] = [
  {
    id: "vis_1",
    youngPerson: "yp_casey",
    recordedDate: d(-30),
    status: "Prescription glasses",
    lastSightTestDate: d(-90),
    nextSightTestDue: d(275),
    optometrist: "Specsavers — Derby City",
    prescription: { right: "-1.25 sph", left: "-1.50 sph" },
    glassesFrames: {
      brand: "Specsavers Kids",
      model: "Tortoiseshell round (£45 NHS voucher)",
      purchaseDate: d(-85),
    },
    spareGlassesAvailable: true,
    symptomsReported: ["Squinting at whiteboard before test", "Headaches when reading small print"],
    schoolAware: true,
    childWearsConsistently: "Mostly",
    cleaningRoutine: [
      "Daily prompt at breakfast — microfibre cloth",
      "Weekly rinse with lukewarm water",
      "Stored in hard case overnight",
    ],
    childVoice:
      "I like my round ones, they're better than the square pair. Sometimes I forget them when I rush to school though.",
    staffObservation:
      "Casey wears glasses for school and reading. Forgets them when going out with friends — gentle prompt at the door now part of routine. Spare pair kept in bedroom drawer in case of breakage. No complaints of headaches since prescription started.",
    reviewDate: d(60),
    keyWorker: "staff_chervelle",
  },
  {
    id: "vis_2",
    youngPerson: "yp_alex",
    recordedDate: d(-20),
    status: "No correction needed",
    lastSightTestDate: d(-330),
    nextSightTestDue: d(35),
    optometrist: "Boots Opticians — Derby Westfield",
    spareGlassesAvailable: false,
    symptomsReported: [],
    schoolAware: true,
    cleaningRoutine: [],
    childVoice:
      "My eyes are fine. The eye drops were weird but the lady was nice. I don't need glasses.",
    staffObservation:
      "Alex passed last NHS sight test with no correction needed. Heavy screen-time use (gaming, schoolwork) — staff prompt 20-20-20 rule (every 20 mins, look 20 ft away for 20 sec). Next annual test booked for next month. No reported symptoms.",
    reviewDate: d(35),
    keyWorker: "staff_edward",
  },
  {
    id: "vis_3",
    youngPerson: "yp_jordan",
    recordedDate: d(-5),
    status: "Awaiting test",
    lastSightTestDate: d(-420),
    nextSightTestDue: d(-60),
    optometrist: "Vision Express — Intu Derby (booked)",
    spareGlassesAvailable: false,
    symptomsReported: [
      "Headaches when reading reported over past 3 weeks",
      "Holding book/phone closer than usual",
      "Rubbing eyes after homework",
    ],
    schoolAware: true,
    cleaningRoutine: [],
    childVoice:
      "My head hurts when I do my homework. The words go a bit fuzzy if I read for ages. I don't really want glasses but I'll try.",
    staffObservation:
      "Last NHS test 14 months ago — overdue per annual under-16 entitlement. Headaches and reading difficulty reported by Jordan to keyworker on key work session. Appointment booked at Vision Express for next week. School informed and have moved Jordan closer to whiteboard as interim measure. Will support Jordan at appointment and discuss any anxieties about wearing glasses beforehand.",
    reviewDate: d(14),
    keyWorker: "staff_anna",
  },
];

/* ── page ──────────────────────────────────────────────────────────────────── */

export default function ChildVisionCarePage() {
  const [data] = useState(SEED);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("review-asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId((p) => (p === id ? null : id));

  /* ── derived ─────────────────────────────────────────────────────────────── */

  const filtered = useMemo(() => {
    let rows = data.filter((r) => {
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          getYPName(r.youngPerson).toLowerCase().includes(q) ||
          (r.optometrist ?? "").toLowerCase().includes(q) ||
          r.staffObservation.toLowerCase().includes(q) ||
          r.childVoice.toLowerCase().includes(q) ||
          r.symptomsReported.some((s) => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
    rows = [...rows].sort((a, b) => {
      switch (sortBy) {
        case "review-asc": return a.reviewDate.localeCompare(b.reviewDate);
        case "review-desc": return b.reviewDate.localeCompare(a.reviewDate);
        case "yp": return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
        case "status": return a.status.localeCompare(b.status);
        case "test-overdue": {
          const ao = isOverdue(a.nextSightTestDue) ? 0 : 1;
          const bo = isOverdue(b.nextSightTestDue) ? 0 : 1;
          if (ao !== bo) return ao - bo;
          return (a.nextSightTestDue ?? "").localeCompare(b.nextSightTestDue ?? "");
        }
        default: return 0;
      }
    });
    return rows;
  }, [data, search, filterStatus, sortBy]);

  /* ── stats ───────────────────────────────────────────────────────────────── */

  const prescriptionCount = data.filter(
    (r) => r.status === "Prescription glasses" || r.status === "Contact lenses" || r.status === "Glasses + contacts",
  ).length;

  const overdueTests = data.filter((r) => isOverdue(r.nextSightTestDue)).length;

  const sparesAvailable = data.filter((r) => r.spareGlassesAvailable).length;

  const reviewsDue90 = data.filter((r) => {
    const days = daysUntil(r.reviewDate);
    return days >= 0 && days <= 90;
  }).length;

  /* ── export ──────────────────────────────────────────────────────────────── */

  const exportCols: ExportColumn<VisionRecord>[] = [
    { header: "Young Person", accessor: (r: VisionRecord) => getYPName(r.youngPerson) },
    { header: "Recorded Date", accessor: (r: VisionRecord) => r.recordedDate },
    { header: "Status", accessor: (r: VisionRecord) => r.status },
    { header: "Last Sight Test", accessor: (r: VisionRecord) => r.lastSightTestDate ?? "" },
    { header: "Next Sight Test Due", accessor: (r: VisionRecord) => r.nextSightTestDue ?? "" },
    { header: "Optometrist", accessor: (r: VisionRecord) => r.optometrist ?? "" },
    { header: "Right Eye", accessor: (r: VisionRecord) => r.prescription?.right ?? "" },
    { header: "Left Eye", accessor: (r: VisionRecord) => r.prescription?.left ?? "" },
    { header: "Frame Brand", accessor: (r: VisionRecord) => r.glassesFrames?.brand ?? "" },
    { header: "Frame Model", accessor: (r: VisionRecord) => r.glassesFrames?.model ?? "" },
    { header: "Frame Purchase Date", accessor: (r: VisionRecord) => r.glassesFrames?.purchaseDate ?? "" },
    { header: "Spare Glasses Available", accessor: (r: VisionRecord) => (r.spareGlassesAvailable ? "Yes" : "No") },
    { header: "Contact Lens Type", accessor: (r: VisionRecord) => r.contactLensType ?? "" },
    { header: "Symptoms Reported", accessor: (r: VisionRecord) => r.symptomsReported.join("; ") },
    { header: "Specialist Service", accessor: (r: VisionRecord) => r.specialistReferral?.service ?? "" },
    { header: "Specialist Referral Date", accessor: (r: VisionRecord) => r.specialistReferral?.date ?? "" },
    { header: "Specialist Reason", accessor: (r: VisionRecord) => r.specialistReferral?.reason ?? "" },
    { header: "School Aware", accessor: (r: VisionRecord) => (r.schoolAware ? "Yes" : "No") },
    { header: "Wears Consistently", accessor: (r: VisionRecord) => r.childWearsConsistently ?? "" },
    { header: "Cleaning Routine", accessor: (r: VisionRecord) => r.cleaningRoutine.join("; ") },
    { header: "Child Voice", accessor: (r: VisionRecord) => r.childVoice },
    { header: "Staff Observation", accessor: (r: VisionRecord) => r.staffObservation },
    { header: "Review Date", accessor: (r: VisionRecord) => r.reviewDate },
    { header: "Key Worker", accessor: (r: VisionRecord) => getStaffName(r.keyWorker) },
  ];

  /* ── render ──────────────────────────────────────────────────────────────── */

  return (
    <PageShell
      title="Child Vision Care"
      subtitle="Quality Standard 8 (Health) · NHS sight test entitlement · UNCRC Art. 24 · GOC standards"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Vision Care" />
          <ExportButton data={filtered} columns={exportCols} filename="child-vision-care" />
        </div>
      }
    >
      <div id="print-area">
        {/* ── stat strip ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Children with Prescriptions", value: prescriptionCount, icon: Glasses, clr: "text-sky-600" },
            { label: "Sight Tests Overdue", value: overdueTests, icon: AlertTriangle, clr: "text-rose-600" },
            { label: "Spare Glasses Available", value: sparesAvailable, icon: Eye, clr: "text-teal-600" },
            { label: "Reviews Due (90d)", value: reviewsDue90, icon: Calendar, clr: "text-cyan-600" },
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

        {/* ── overdue banner ───────────────────────────────────────────────── */}
        {overdueTests > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 mb-4 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-rose-800">
                {overdueTests} child / children overdue for an NHS sight test
              </p>
              <p className="text-rose-700">
                Under-16s in education are entitled to a free NHS sight test annually. Care leavers under 25 in
                continuing education also retain free entitlement. Book promptly and record outcomes here.
              </p>
            </div>
          </div>
        )}

        {/* ── NHS entitlement banner ───────────────────────────────────────── */}
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 mb-6 flex items-start gap-2">
          <Eye className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="text-sm flex-1">
            <p className="font-semibold text-sky-800">NHS Sight Test Entitlement</p>
            <p className="text-sky-700">
              Free NHS sight tests for under-16s, full-time students up to 18, and care leavers under 25. NHS optical
              vouchers cover frame and lens costs for eligible looked-after children. Record optometrist details, both
              eye prescriptions, frame information and child&apos;s own voice on wearing glasses or lenses.
            </p>
          </div>
        </div>

        {/* ── filters ──────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search child, optometrist, symptoms…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[210px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]"><ArrowUpDown className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="review-asc">Review Soonest</SelectItem>
              <SelectItem value="review-desc">Review Latest</SelectItem>
              <SelectItem value="test-overdue">Test Overdue First</SelectItem>
              <SelectItem value="yp">By Child</SelectItem>
              <SelectItem value="status">By Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ── records ──────────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {filtered.map((r) => {
            const open = expandedId === r.id;
            const overdue = isOverdue(r.nextSightTestDue);
            return (
              <Card key={r.id} className={cn("border-l-4", BORDER_STATUS[r.status])}>
                <CardHeader className="pb-2 cursor-pointer" onClick={() => toggle(r.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                        {getYPName(r.youngPerson)}
                        <Badge variant="outline" className={STATUS_CLR[r.status]}>{r.status}</Badge>
                        {r.lastSightTestDate && (
                          <Badge variant="outline" className="bg-slate-100 text-slate-700">
                            <Calendar className="h-3 w-3 mr-1" /> Tested {r.lastSightTestDate}
                          </Badge>
                        )}
                        {r.childWearsConsistently && (
                          <Badge variant="outline" className={WEAR_CLR[r.childWearsConsistently]}>
                            Wears: {r.childWearsConsistently}
                          </Badge>
                        )}
                        {overdue && (
                          <Badge variant="outline" className="bg-rose-100 text-rose-800 border-rose-300">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Test overdue
                          </Badge>
                        )}
                        {r.specialistReferral && (
                          <Badge variant="outline" className="bg-rose-50 text-rose-700">
                            Specialist: {r.specialistReferral.service}
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Recorded {r.recordedDate} · Key worker: {getStaffName(r.keyWorker)} · Review {r.reviewDate}
                      </p>
                    </div>
                    {open ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground mt-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground mt-1" />
                    )}
                  </div>
                </CardHeader>
                {open && (
                  <CardContent className="pt-0 space-y-4 text-sm">
                    {/* test summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-sky-50 rounded p-2">
                        <p className="font-medium text-xs">Last Sight Test</p>
                        <p className="text-xs text-muted-foreground">{r.lastSightTestDate ?? "—"}</p>
                      </div>
                      <div className={cn("rounded p-2", overdue ? "bg-rose-50" : "bg-teal-50")}>
                        <p className="font-medium text-xs">Next Test Due</p>
                        <p className="text-xs text-muted-foreground">{r.nextSightTestDue ?? "—"}</p>
                      </div>
                      <div className="bg-muted/40 rounded p-2">
                        <p className="font-medium text-xs">Optometrist</p>
                        <p className="text-xs text-muted-foreground">{r.optometrist ?? "—"}</p>
                      </div>
                      <div className="bg-muted/40 rounded p-2">
                        <p className="font-medium text-xs">School Aware</p>
                        <p className="text-xs text-muted-foreground">{r.schoolAware ? "Yes" : "No"}</p>
                      </div>
                    </div>

                    {/* prescription / frames */}
                    {(r.prescription || r.glassesFrames || r.contactLensType) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {r.prescription && (
                          <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
                            <p className="font-medium mb-1 flex items-center gap-1 text-sky-800">
                              <Eye className="h-4 w-4" /> Prescription
                            </p>
                            <p className="text-xs text-sky-900">Right eye: {r.prescription.right}</p>
                            <p className="text-xs text-sky-900">Left eye: {r.prescription.left}</p>
                          </div>
                        )}
                        {r.glassesFrames && (
                          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                            <p className="font-medium mb-1 flex items-center gap-1 text-teal-800">
                              <Glasses className="h-4 w-4" /> Frames
                            </p>
                            <p className="text-xs text-teal-900">
                              {r.glassesFrames.brand} — {r.glassesFrames.model}
                            </p>
                            <p className="text-xs text-teal-900">Purchased: {r.glassesFrames.purchaseDate}</p>
                            <p className="text-xs text-teal-900 mt-1">
                              Spare pair: {r.spareGlassesAvailable ? "Yes" : "No"}
                            </p>
                          </div>
                        )}
                        {r.contactLensType && (
                          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 md:col-span-2">
                            <p className="font-medium mb-1 text-cyan-800">Contact Lenses</p>
                            <p className="text-xs text-cyan-900">{r.contactLensType}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* specialist referral */}
                    {r.specialistReferral && (
                      <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                        <p className="font-medium text-rose-800 flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" /> Specialist referral active
                        </p>
                        <p className="text-xs text-rose-700 mt-1">
                          {r.specialistReferral.service} · referred {r.specialistReferral.date}
                        </p>
                        <p className="text-xs text-rose-700">Reason: {r.specialistReferral.reason}</p>
                      </div>
                    )}

                    {/* symptoms */}
                    {r.symptomsReported.length > 0 && (
                      <div>
                        <p className="font-medium mb-1">Symptoms Reported</p>
                        <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                          {r.symptomsReported.map((s, i) => (<li key={i}>{s}</li>))}
                        </ul>
                      </div>
                    )}

                    {/* cleaning routine */}
                    {r.cleaningRoutine.length > 0 && (
                      <div>
                        <p className="font-medium mb-1">Cleaning &amp; Care Routine</p>
                        <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                          {r.cleaningRoutine.map((c, i) => (<li key={i}>{c}</li>))}
                        </ul>
                      </div>
                    )}

                    {/* child voice */}
                    <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
                      <p className="font-medium text-sky-800 mb-1">Child&apos;s Voice</p>
                      <p className="text-sky-900 italic">&ldquo;{r.childVoice}&rdquo;</p>
                    </div>

                    {/* staff observation */}
                    <div>
                      <p className="font-medium mb-1">Staff Observation</p>
                      <p className="text-muted-foreground">{r.staffObservation}</p>
                    </div>

                    {/* footer */}
                    <div className="flex flex-wrap justify-between items-center pt-2 border-t text-xs text-muted-foreground gap-2">
                      <span>Key worker: {getStaffName(r.keyWorker)}</span>
                      <span>Next review: {r.reviewDate}</span>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* ── regulatory note ────────────────────────────────────────────── */}
        <div className="mt-6 bg-muted/30 rounded-lg p-4 text-xs text-muted-foreground">
          <p className="font-semibold mb-1">Regulatory Framework</p>
          <p>
            Children&apos;s Homes (England) Regulations 2015, Quality Standard 8 (Health and well-being) — children
            must receive timely health interventions and have their physical, emotional and mental health needs met.
            Vision care forms part of the routine annual health assessment alongside dental, hearing and developmental
            screening. NHS sight test entitlement: free annual sight tests for under-16s, full-time students to age
            18, and care leavers under 25. NHS optical vouchers cover frames and lenses for eligible looked-after
            children. UNCRC Article 24 — every child has the right to the highest attainable standard of health.
            General Optical Council (GOC) standards govern professional optometric practice. Records retained until
            the child&apos;s 25th birthday (or 75 years for looked-after children, per Reg 37).
          </p>
        </div>
      </div>
    </PageShell>
  );
}
