"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Car, BookOpen, CheckCircle, ChevronUp, ChevronDown, ArrowUpDown, Search, Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getYPName, getStaffName } from "@/lib/seed-data";

/* ── types ─────────────────────────────────────────────────────────────────── */

type DrivingStage =
  | "Awaiting 17th birthday"
  | "Provisional applied"
  | "Provisional held"
  | "Theory studying"
  | "Theory passed"
  | "Practical lessons"
  | "Practical booked"
  | "Practical passed"
  | "Full licence";

type FundingSource = "Leaving Care Grant" | "Pocket money" | "Family contribution" | "Mixed";

interface TheoryAttempt { date: string; result: "Pass" | "Fail"; score?: string }
interface PracticalAttempt { date: string; result: "Pass" | "Fail"; faults?: string }

interface DrivingRecord {
  id: string;
  youngPerson: string;
  recordedDate: string;
  stage: DrivingStage;
  provisionalNumber?: string;
  theoryAttempts: TheoryAttempt[];
  practicalAttempts: PracticalAttempt[];
  lessonsBookedTotal: number;
  lessonsCompletedTotal: number;
  hoursLogged: number;
  hourlyRate: number;
  costSoFar: number;
  fundingSource: FundingSource;
  instructor?: string;
  nextLesson?: string;
  childVoice: string;
  staffObservation: string;
  reviewDate: string;
  keyWorker: string;
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

const d = (n: number) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };

const STAGE_CLR: Record<DrivingStage, string> = {
  "Awaiting 17th birthday": "bg-gray-100 text-gray-800",
  "Provisional applied": "bg-sky-100 text-sky-800",
  "Provisional held": "bg-sky-100 text-sky-800",
  "Theory studying": "bg-blue-100 text-blue-800",
  "Theory passed": "bg-indigo-100 text-indigo-800",
  "Practical lessons": "bg-blue-100 text-blue-800",
  "Practical booked": "bg-amber-100 text-amber-800",
  "Practical passed": "bg-green-100 text-green-800",
  "Full licence": "bg-emerald-100 text-emerald-800",
};

const FUNDING_CLR: Record<FundingSource, string> = {
  "Leaving Care Grant": "bg-teal-100 text-teal-800",
  "Pocket money": "bg-yellow-100 text-yellow-800",
  "Family contribution": "bg-purple-100 text-purple-800",
  "Mixed": "bg-blue-100 text-blue-800",
};

const STAGES: DrivingStage[] = [
  "Awaiting 17th birthday", "Provisional applied", "Provisional held",
  "Theory studying", "Theory passed", "Practical lessons",
  "Practical booked", "Practical passed", "Full licence",
];

const fmtGBP = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0 }).format(n);

/* ── seed data ─────────────────────────────────────────────────────────────── */

const SEED: DrivingRecord[] = [
  {
    id: "drv1",
    youngPerson: "yp_jordan",
    recordedDate: d(-21),
    stage: "Theory studying",
    provisionalNumber: "JONES912047JL9XY",
    theoryAttempts: [],
    practicalAttempts: [],
    lessonsBookedTotal: 4,
    lessonsCompletedTotal: 2,
    hoursLogged: 4,
    hourlyRate: 38,
    costSoFar: 152,
    fundingSource: "Mixed",
    instructor: "Mark Driver — Pass First Time School of Motoring (ADI 412903)",
    nextLesson: d(5),
    childVoice: "I want to pass first time. The Highway Code book is harder than I thought but I'm doing the practice tests on the app every night. The football coaching money helps me pay for my own lessons.",
    staffObservation: "Jordan turned 17 three weeks ago. Provisional licence application returned within 10 days. He is genuinely committed — keeps the Highway Code book by his bed and revises during quiet times. Mark (instructor) reports a calm, attentive learner and recommends weekly lessons through summer. Funding split arranged with Gemma (Personal Adviser): Leaving Care Grant covering the theory test fee plus the first 10 practical lessons; Jordan contributing from his football coaching wages towards anything beyond. Plan reviewed at Pathway Plan meeting last fortnight.",
    reviewDate: d(28),
    keyWorker: "staff_ryan",
  },
  {
    id: "drv2",
    youngPerson: "yp_alex",
    recordedDate: d(-7),
    stage: "Awaiting 17th birthday",
    theoryAttempts: [],
    practicalAttempts: [],
    lessonsBookedTotal: 0,
    lessonsCompletedTotal: 0,
    hoursLogged: 0,
    hourlyRate: 0,
    costSoFar: 0,
    fundingSource: "Leaving Care Grant",
    childVoice: "I want to learn when I turn 17. Jordan has been telling me about his lessons.",
    staffObservation: "Placeholder record — Alex is currently 15. Discussion opened during keywork session about future driving plans. Will revisit at the Pathway Plan transition window. No action required at this stage other than to note interest and ensure provisional application is supported when eligible.",
    reviewDate: d(180),
    keyWorker: "staff_darren",
  },
];

/* ── component ─────────────────────────────────────────────────────────────── */

export default function DrivingLessonsTrackerPage() {
  const [data] = useState<DrivingRecord[]>(SEED);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("name");
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded(expanded === id ? null : id);

  const filtered = useMemo(() => {
    let out = [...data];
    if (search) {
      const s = search.toLowerCase();
      out = out.filter(r =>
        getYPName(r.youngPerson).toLowerCase().includes(s) ||
        (r.instructor ?? "").toLowerCase().includes(s) ||
        r.stage.toLowerCase().includes(s)
      );
    }
    if (stageFilter !== "all") out = out.filter(r => r.stage === stageFilter);
    out.sort((a, b) => {
      switch (sortBy) {
        case "name": return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
        case "hours": return b.hoursLogged - a.hoursLogged;
        case "cost": return b.costSoFar - a.costSoFar;
        case "stage": return STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage);
        default: return 0;
      }
    });
    return out;
  }, [data, search, stageFilter, sortBy]);

  const inTraining = data.filter(r =>
    r.stage === "Theory studying" || r.stage === "Practical lessons" || r.stage === "Practical booked"
  ).length;
  const theoryPassedCount = data.filter(r =>
    r.theoryAttempts.some(t => t.result === "Pass") ||
    r.stage === "Theory passed" || r.stage === "Practical lessons" ||
    r.stage === "Practical booked" || r.stage === "Practical passed" || r.stage === "Full licence"
  ).length;
  const totalHours = data.reduce((s, r) => s + r.hoursLogged, 0);
  const totalCost = data.reduce((s, r) => s + r.costSoFar, 0);

  const exportCols: ExportColumn<DrivingRecord>[] = useMemo(() => [
    { header: "Young Person", accessor: (r: DrivingRecord) => getYPName(r.youngPerson) },
    { header: "Recorded Date", accessor: (r: DrivingRecord) => r.recordedDate },
    { header: "Stage", accessor: (r: DrivingRecord) => r.stage },
    { header: "Provisional Number", accessor: (r: DrivingRecord) => r.provisionalNumber ?? "" },
    { header: "Theory Attempts", accessor: (r: DrivingRecord) => r.theoryAttempts.map(t => `${t.date} ${t.result}${t.score ? ` (${t.score})` : ""}`).join("; ") },
    { header: "Practical Attempts", accessor: (r: DrivingRecord) => r.practicalAttempts.map(p => `${p.date} ${p.result}${p.faults ? ` (${p.faults})` : ""}`).join("; ") },
    { header: "Lessons Completed", accessor: (r: DrivingRecord) => r.lessonsCompletedTotal },
    { header: "Lessons Booked", accessor: (r: DrivingRecord) => r.lessonsBookedTotal },
    { header: "Hours Logged", accessor: (r: DrivingRecord) => r.hoursLogged },
    { header: "Hourly Rate", accessor: (r: DrivingRecord) => fmtGBP(r.hourlyRate) },
    { header: "Cost So Far", accessor: (r: DrivingRecord) => fmtGBP(r.costSoFar) },
    { header: "Funding Source", accessor: (r: DrivingRecord) => r.fundingSource },
    { header: "Instructor", accessor: (r: DrivingRecord) => r.instructor ?? "" },
    { header: "Next Lesson", accessor: (r: DrivingRecord) => r.nextLesson ?? "" },
    { header: "Child Voice", accessor: (r: DrivingRecord) => r.childVoice },
    { header: "Staff Observation", accessor: (r: DrivingRecord) => r.staffObservation },
    { header: "Review Date", accessor: (r: DrivingRecord) => r.reviewDate },
    { header: "Key Worker", accessor: (r: DrivingRecord) => getStaffName(r.keyWorker) },
  ], []);

  return (
    <PageShell
      title="Driving Lessons Tracker"
      subtitle="Provisional licence, theory and practical progress for over-17s — Pathway Plan and Care Leavers (England) Regulations 2010"
      actions={[
        <PrintButton key="p" title="Driving Lessons Tracker" />,
        <ExportButton key="e" data={filtered} columns={exportCols} filename="driving-lessons-tracker" />,
      ]}
    >
      <div id="print-area" className="space-y-6">

        {/* stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "In Training", value: inTraining, icon: Car, colour: "text-sky-600" },
            { label: "Theory Passed", value: theoryPassedCount, icon: BookOpen, colour: "text-blue-600" },
            { label: "Hours Logged", value: totalHours, icon: CheckCircle, colour: "text-indigo-600" },
            { label: "Total Cost", value: fmtGBP(totalCost), icon: Award, colour: "text-teal-600" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="pt-4 flex items-center gap-3">
                <s.icon className={cn("h-8 w-8", s.colour)} />
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* filter bar */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <Label className="text-xs">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="Name, instructor, stage…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="w-52">
                <Label className="text-xs">Stage</Label>
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All stages</SelectItem>
                    {STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-44">
                <Label className="text-xs flex items-center gap-1"><ArrowUpDown className="h-3 w-3" />Sort</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="stage">Stage</SelectItem>
                    <SelectItem value="hours">Hours Logged</SelectItem>
                    <SelectItem value="cost">Cost So Far</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* records */}
        <div className="space-y-3">
          {filtered.map(r => {
            const open = expanded === r.id;
            const theoryPassed = r.theoryAttempts.some(t => t.result === "Pass");
            const practicalPassed = r.practicalAttempts.some(p => p.result === "Pass");
            const nextMilestone =
              r.stage === "Awaiting 17th birthday" ? "Reach 17th birthday" :
              r.stage === "Provisional applied" ? "Receive provisional licence" :
              r.stage === "Provisional held" ? "Begin theory revision" :
              r.stage === "Theory studying" ? "Book theory test" :
              r.stage === "Theory passed" ? "Begin practical lessons" :
              r.stage === "Practical lessons" ? "Book practical test" :
              r.stage === "Practical booked" ? "Sit practical test" :
              r.stage === "Practical passed" ? "Receive full licence" :
              "Full licence held";

            return (
              <Card key={r.id} className="border-l-4 border-sky-400 bg-sky-50/30">
                <button className="w-full text-left" onClick={() => toggle(r.id)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-base">{getYPName(r.youngPerson)}</CardTitle>
                        <Badge className={cn("text-xs", STAGE_CLR[r.stage])}>{r.stage}</Badge>
                        <Badge variant="outline" className="text-xs">{r.hoursLogged} hrs</Badge>
                        <Badge variant="outline" className="text-xs">{fmtGBP(r.costSoFar)}</Badge>
                        <Badge className={cn("text-xs", FUNDING_CLR[r.fundingSource])}>{r.fundingSource}</Badge>
                        {theoryPassed && <Badge className="text-xs bg-indigo-100 text-indigo-800">Theory passed</Badge>}
                        {practicalPassed && <Badge className="text-xs bg-green-100 text-green-800">Practical passed</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Recorded: {r.recordedDate}</span>
                        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                  </CardHeader>
                </button>

                {open && (
                  <CardContent className="space-y-4 pt-0">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="rounded-lg border bg-white p-3 space-y-1">
                        <p className="text-xs font-semibold text-sky-800 flex items-center gap-1"><Car className="h-3 w-3" />Provisional</p>
                        <p className="text-xs">Number: <span className="font-mono">{r.provisionalNumber ?? "—"}</span></p>
                        <p className="text-xs">Next milestone: <strong>{nextMilestone}</strong></p>
                      </div>
                      <div className="rounded-lg border bg-white p-3 space-y-1">
                        <p className="text-xs font-semibold text-blue-800 flex items-center gap-1"><BookOpen className="h-3 w-3" />Lessons</p>
                        <p className="text-xs">Completed: <strong>{r.lessonsCompletedTotal}</strong> of {r.lessonsBookedTotal} booked</p>
                        <p className="text-xs">Hours logged: <strong>{r.hoursLogged}</strong> @ {fmtGBP(r.hourlyRate)}/hr</p>
                        {r.nextLesson && <p className="text-xs">Next lesson: <strong>{r.nextLesson}</strong></p>}
                      </div>
                    </div>

                    {/* theory attempts */}
                    <div>
                      <p className="text-xs font-semibold mb-1 flex items-center gap-1"><BookOpen className="h-3 w-3" />Theory Test Attempts</p>
                      {r.theoryAttempts.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No theory attempts recorded yet.</p>
                      ) : (
                        <ul className="text-sm space-y-1">
                          {r.theoryAttempts.map((t, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="font-medium">{t.date}</span>
                              <Badge className={cn("text-xs", t.result === "Pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>{t.result}</Badge>
                              {t.score && <span className="text-xs text-muted-foreground">{t.score}</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* practical attempts */}
                    <div>
                      <p className="text-xs font-semibold mb-1 flex items-center gap-1"><Car className="h-3 w-3" />Practical Test Attempts</p>
                      {r.practicalAttempts.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No practical attempts recorded yet.</p>
                      ) : (
                        <ul className="text-sm space-y-1">
                          {r.practicalAttempts.map((p, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="font-medium">{p.date}</span>
                              <Badge className={cn("text-xs", p.result === "Pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>{p.result}</Badge>
                              {p.faults && <span className="text-xs text-muted-foreground">{p.faults}</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* funding breakdown */}
                    <div className="rounded-lg border bg-white p-3 text-xs space-y-1">
                      <p className="font-semibold text-teal-800 flex items-center gap-1"><Award className="h-3 w-3" />Funding</p>
                      <div className="flex items-center gap-2">
                        <Badge className={cn("text-xs", FUNDING_CLR[r.fundingSource])}>{r.fundingSource}</Badge>
                        <span>Cost so far: <strong>{fmtGBP(r.costSoFar)}</strong></span>
                        {r.hourlyRate > 0 && <span>Hourly rate: <strong>{fmtGBP(r.hourlyRate)}</strong></span>}
                      </div>
                    </div>

                    {/* child voice */}
                    <div className="rounded-lg bg-sky-50 border border-sky-200 p-3">
                      <p className="text-xs font-semibold text-sky-800 mb-1">Child&apos;s Voice</p>
                      <p className="text-sm italic">&ldquo;{r.childVoice}&rdquo;</p>
                    </div>

                    {/* staff observation */}
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                      <p className="text-xs font-semibold text-blue-800 mb-1">Staff Observation</p>
                      <p className="text-sm">{r.staffObservation}</p>
                    </div>

                    {/* meta */}
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      {r.instructor && <span>Instructor: <strong>{r.instructor}</strong></span>}
                      <span>Key Worker: <strong>{getStaffName(r.keyWorker)}</strong></span>
                      <span>Review Date: <strong>{r.reviewDate}</strong></span>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* regulatory note */}
        <div className="rounded-lg bg-muted/40 border p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold">Regulatory Framework</p>
          <p>Driving lessons for care leavers are recorded against the young person&apos;s Pathway Plan under the Care Leavers (England) Regulations 2010. Funding decisions follow the Local Authority Leaving Care policy on driving lessons (Leaving Care Grant contributions, with documented contribution from the young person where appropriate). Lessons must be delivered by an Approved Driving Instructor (ADI) registered with the DVSA, and theory/practical tests booked through DVSA standards. All progress, costs and the young person&apos;s voice are reviewed at each Pathway Plan review.</p>
        </div>
      </div>
    </PageShell>
  );
}
