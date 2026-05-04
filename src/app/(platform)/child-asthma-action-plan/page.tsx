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
  Wind, AlertTriangle, Phone, ChevronUp, ChevronDown, ArrowUpDown, Search, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getYPName, getStaffName } from "@/lib/seed-data";

/* ── types ─────────────────────────────────────────────────────────────────── */

interface AsthmaPlan {
  id: string;
  youngPerson: string;
  planDate: string;
  diagnosis: "Mild intermittent" | "Mild persistent" | "Moderate persistent" | "Severe persistent" | "Exercise-induced only";
  knownTriggers: string[];
  preventerInhaler?: { name: string; dose: string; timing: string };
  relieverInhaler?: { name: string; dose: string };
  spacerNeeded: boolean;
  peakFlowBest?: number;
  peakFlowGreenZone?: string;
  peakFlowAmberZone?: string;
  peakFlowRedZone?: string;
  greenZoneActions: string[];
  amberZoneActions: string[];
  redZoneActions: string[];
  hospitalAdmissions: { date: string; reason: string; outcome: string }[];
  childCanSelfMedicate: boolean;
  spareInhalerLocations: string[];
  schoolHasInhaler: boolean;
  emergencyContacts: { name: string; role: string; phone: string }[];
  childVoice: string;
  staffObservation: string;
  reviewDate: string;
  keyWorker: string;
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

const d = (n: number) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };

/* ── seed data ─────────────────────────────────────────────────────────────── */

const SEED: AsthmaPlan[] = [
  {
    id: "aap_001",
    youngPerson: "yp_casey",
    planDate: d(-21),
    diagnosis: "Mild persistent",
    knownTriggers: ["House dust mites", "Cold air", "Viral upper respiratory infections", "Exercise (mild)", "Pollen (late spring)"],
    preventerInhaler: {
      name: "Clenil Modulite (beclometasone) — BROWN",
      dose: "100mcg, 2 puffs",
      timing: "Twice daily (morning and evening), via spacer, after brushing teeth",
    },
    relieverInhaler: {
      name: "Salbutamol (Ventolin) — BLUE",
      dose: "100mcg, 2 puffs PRN, up to 10 puffs in an attack",
    },
    spacerNeeded: true,
    peakFlowBest: 280,
    peakFlowGreenZone: "220+ L/min (≥80% of best)",
    peakFlowAmberZone: "140–220 L/min (50–79% of best)",
    peakFlowRedZone: "<140 L/min (<50% of best)",
    greenZoneActions: [
      "Take preventer (brown) twice daily as prescribed",
      "Continue all normal activities including PE and trampolining",
      "Record peak flow each morning before preventer",
      "No reliever needed routinely; pre-exercise 1 puff Salbutamol if cold day",
    ],
    amberZoneActions: [
      "Give 4 puffs of blue Salbutamol via spacer (one at a time)",
      "Continue brown preventer at usual dose",
      "Reassess peak flow after 20 minutes",
      "If symptoms persist > 24 hours, contact GP same day",
      "Inform key worker and log on health record",
    ],
    redZoneActions: [
      "Sit Casey upright — do not lie down",
      "Give 10 puffs of blue Salbutamol via spacer (one puff per breath, 6 breaths each)",
      "If no improvement within 5 minutes — DIAL 999, state 'severe asthma attack, child'",
      "Repeat 10 puffs every 10 minutes while waiting for ambulance",
      "Stay calm, reassure Casey, send another staff member to bring records and medication",
      "Notify Registered Manager, on-call placing authority, and emergency contact",
    ],
    hospitalAdmissions: [
      { date: d(-410), reason: "Acute exacerbation triggered by RSV — pre-placement", outcome: "Overnight admission, discharged with stepped-up preventer; no PICU" },
    ],
    childCanSelfMedicate: true,
    spareInhalerLocations: [
      "Casey's school bag (front pocket, labelled)",
      "Casey's bedroom bedside drawer",
      "Downstairs medication cupboard (locked, accessible to all staff)",
      "Anna's (key worker) on-call kit for trips out",
      "School office (named pupil inhaler with care plan)",
    ],
    schoolHasInhaler: true,
    emergencyContacts: [
      { name: "Dr Helena Marsh", role: "GP — Northgate Health Centre", phone: "020 8123 4567" },
      { name: "Dr Aisha Patel", role: "Paediatric Respiratory Consultant — King's College Hospital", phone: "020 3299 0000" },
      { name: "Anna Coleman", role: "Key Worker, Oak House", phone: "07700 900112" },
      { name: "Oak House on-call", role: "Registered Manager (24h)", phone: "07700 900100" },
      { name: "NHS 111 / 999", role: "Out-of-hours / emergency", phone: "111 or 999" },
    ],
    childVoice: "I know my brown one stops it and the blue one helps when I can't breathe. The spacer makes the puffs taste better. I don't like missing PE but Anna says I can do it if I take my puff before. I want everyone to know what to do so I'm not scared.",
    staffObservation: "Casey is increasingly confident with self-administration when prompted. Demonstrates good technique with spacer following recent review by school nurse. Tends to under-report mild symptoms — staff to remain alert to subtle signs (quiet voice, reluctance to play, increased nasal flaring). Plan reviewed with all permanent staff; shared with school and printed copy in medication folder.",
    reviewDate: d(160),
    keyWorker: "staff_anna",
  },
  {
    id: "aap_002",
    youngPerson: "yp_alex",
    planDate: d(-90),
    diagnosis: "Exercise-induced only",
    knownTriggers: ["Strenuous exercise in cold weather", "Football matches in winter"],
    relieverInhaler: {
      name: "Salbutamol (Ventolin) — BLUE",
      dose: "100mcg, 2 puffs 15 minutes pre-exercise; up to 10 puffs in an attack",
    },
    spacerNeeded: false,
    greenZoneActions: [
      "Pre-exercise reliever only when needed (cold-weather sport)",
      "No daily preventer required",
      "GP review annually or sooner if attacks return",
    ],
    amberZoneActions: [
      "If wheeze or cough at rest occurs — contact GP same day",
      "Re-introduce daily preventer only on GP advice",
    ],
    redZoneActions: [
      "Sit upright; 10 puffs blue Salbutamol",
      "If no improvement in 5 minutes — dial 999",
      "Notify Registered Manager and key worker",
    ],
    hospitalAdmissions: [],
    childCanSelfMedicate: true,
    spareInhalerLocations: ["School PE bag", "Bedroom drawer", "Downstairs medication cupboard"],
    schoolHasInhaler: true,
    emergencyContacts: [
      { name: "Dr Helena Marsh", role: "GP — Northgate Health Centre", phone: "020 8123 4567" },
      { name: "Oak House on-call", role: "Registered Manager (24h)", phone: "07700 900100" },
      { name: "NHS 111 / 999", role: "Out-of-hours / emergency", phone: "111 or 999" },
    ],
    childVoice: "I only really need my puffer for football in winter. I take it before so I can play properly with my mates.",
    staffObservation: "Last attack 2022 (pre-placement). Stable on reliever-only regimen. PE staff aware. No preventer required at present per GP letter on file.",
    reviewDate: d(275),
    keyWorker: "staff_marcus",
  },
];

/* ── page ──────────────────────────────────────────────────────────────────── */

export default function ChildAsthmaActionPlanPage() {
  const [data] = useState(SEED);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterDiagnosis, setFilterDiagnosis] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        getYPName(r.youngPerson).toLowerCase().includes(q) ||
        r.diagnosis.toLowerCase().includes(q) ||
        r.knownTriggers.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (filterDiagnosis !== "all") rows = rows.filter((r) => r.diagnosis === filterDiagnosis);
    rows.sort((a, b) =>
      sortBy === "newest"
        ? b.planDate.localeCompare(a.planDate)
        : a.planDate.localeCompare(b.planDate),
    );
    return rows;
  }, [data, search, filterDiagnosis, sortBy]);

  const total = data.length;
  const recentlyGreen = data.filter((r) => r.peakFlowBest && r.peakFlowGreenZone).length;
  const ytdAdmissions = data.reduce((acc, r) => {
    const yearStart = new Date();
    yearStart.setMonth(0, 1);
    return acc + r.hospitalAdmissions.filter((a) => new Date(a.date) >= yearStart).length;
  }, 0);
  const today = d(0);
  const ninetyDays = d(90);
  const reviewsDue90 = data.filter((r) => r.reviewDate >= today && r.reviewDate <= ninetyDays).length;

  const exportCols: ExportColumn<AsthmaPlan>[] = [
    { header: "Young Person", accessor: (r: AsthmaPlan) => getYPName(r.youngPerson) },
    { header: "Plan Date", accessor: (r: AsthmaPlan) => r.planDate },
    { header: "Diagnosis", accessor: (r: AsthmaPlan) => r.diagnosis },
    { header: "Known Triggers", accessor: (r: AsthmaPlan) => r.knownTriggers.join("; ") },
    { header: "Preventer", accessor: (r: AsthmaPlan) => r.preventerInhaler ? `${r.preventerInhaler.name} ${r.preventerInhaler.dose} ${r.preventerInhaler.timing}` : "—" },
    { header: "Reliever", accessor: (r: AsthmaPlan) => r.relieverInhaler ? `${r.relieverInhaler.name} ${r.relieverInhaler.dose}` : "—" },
    { header: "Spacer", accessor: (r: AsthmaPlan) => r.spacerNeeded ? "Yes" : "No" },
    { header: "Peak Flow Best", accessor: (r: AsthmaPlan) => r.peakFlowBest ? String(r.peakFlowBest) : "—" },
    { header: "Green Zone", accessor: (r: AsthmaPlan) => r.peakFlowGreenZone ?? "—" },
    { header: "Amber Zone", accessor: (r: AsthmaPlan) => r.peakFlowAmberZone ?? "—" },
    { header: "Red Zone", accessor: (r: AsthmaPlan) => r.peakFlowRedZone ?? "—" },
    { header: "Hospital Admissions", accessor: (r: AsthmaPlan) => String(r.hospitalAdmissions.length) },
    { header: "Self-Medicates", accessor: (r: AsthmaPlan) => r.childCanSelfMedicate ? "Yes" : "No" },
    { header: "School Has Inhaler", accessor: (r: AsthmaPlan) => r.schoolHasInhaler ? "Yes" : "No" },
    { header: "Spare Inhaler Locations", accessor: (r: AsthmaPlan) => r.spareInhalerLocations.join("; ") },
    { header: "Review Date", accessor: (r: AsthmaPlan) => r.reviewDate },
    { header: "Key Worker", accessor: (r: AsthmaPlan) => getStaffName(r.keyWorker) },
  ];

  return (
    <PageShell
      title="Child Asthma Action Plan"
      subtitle="Personal Asthma Action Plan · BTS/SIGN 158 · NICE NG80 · Quality Standard 8"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Asthma Action Plans" />
          <ExportButton data={data} columns={exportCols} filename="child-asthma-action-plan" />
        </div>
      }
    >
      <div id="print-area">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Active Plans", value: total, icon: Wind, clr: "text-sky-600" },
            { label: "Peak Flow in Green", value: recentlyGreen, icon: Activity, clr: "text-green-600" },
            { label: "Hospital Admissions YTD", value: ytdAdmissions, icon: AlertTriangle, clr: "text-red-600" },
            { label: "Reviews Due 90d", value: reviewsDue90, icon: Phone, clr: "text-amber-600" },
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

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search young person, diagnosis or trigger..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterDiagnosis} onValueChange={setFilterDiagnosis}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Diagnosis" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Diagnoses</SelectItem>
              <SelectItem value="Mild intermittent">Mild intermittent</SelectItem>
              <SelectItem value="Mild persistent">Mild persistent</SelectItem>
              <SelectItem value="Moderate persistent">Moderate persistent</SelectItem>
              <SelectItem value="Severe persistent">Severe persistent</SelectItem>
              <SelectItem value="Exercise-induced only">Exercise-induced only</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <ArrowUpDown className="h-4 w-4 mr-1" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filtered.map((r) => {
            const isOpen = expandedId === r.id;
            const borderClr = r.diagnosis === "Severe persistent"
              ? "border-l-red-500"
              : r.diagnosis === "Moderate persistent"
                ? "border-l-amber-500"
                : "border-l-sky-400";
            return (
              <Card key={r.id} className={cn("border-l-4", borderClr)}>
                <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpandedId(isOpen ? null : r.id)}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                        {getYPName(r.youngPerson)}
                        <Badge variant="outline" className="bg-sky-100 text-sky-800">{r.diagnosis}</Badge>
                        {r.childCanSelfMedicate && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">Self-medicates</Badge>
                        )}
                        {r.schoolHasInhaler && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">School inhaler held</Badge>
                        )}
                        {r.hospitalAdmissions.length > 0 && (
                          <Badge variant="outline" className="bg-red-50 text-red-700">Prior admission</Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Plan: {r.planDate} · Key worker: {getStaffName(r.keyWorker)} · Review: {r.reviewDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-muted/50">{r.knownTriggers.length} triggers</Badge>
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>

                {isOpen && (
                  <CardContent className="pt-0 space-y-3 text-sm">
                    <div>
                      <p className="font-medium mb-1 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Known Triggers
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {r.knownTriggers.map((t, i) => (
                          <Badge key={i} variant="outline" className="bg-amber-50 text-amber-800">{t}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="rounded p-2 border-l-4 border-l-amber-700 bg-amber-50">
                        <p className="text-xs font-semibold text-amber-900">Preventer (BROWN) — daily</p>
                        {r.preventerInhaler ? (
                          <>
                            <p className="text-xs mt-1">{r.preventerInhaler.name}</p>
                            <p className="text-xs text-muted-foreground">{r.preventerInhaler.dose}</p>
                            <p className="text-xs text-muted-foreground">{r.preventerInhaler.timing}</p>
                          </>
                        ) : (
                          <p className="text-xs italic text-muted-foreground mt-1">Not currently prescribed</p>
                        )}
                        {r.spacerNeeded && (
                          <Badge variant="outline" className="mt-1 bg-white">Spacer required</Badge>
                        )}
                      </div>
                      <div className="rounded p-2 border-l-4 border-l-blue-600 bg-blue-50">
                        <p className="text-xs font-semibold text-blue-900">Reliever (BLUE) — as needed</p>
                        {r.relieverInhaler ? (
                          <>
                            <p className="text-xs mt-1">{r.relieverInhaler.name}</p>
                            <p className="text-xs text-muted-foreground">{r.relieverInhaler.dose}</p>
                          </>
                        ) : (
                          <p className="text-xs italic text-muted-foreground mt-1">Not currently prescribed</p>
                        )}
                      </div>
                    </div>

                    {r.peakFlowBest && (
                      <div className="bg-muted/40 rounded p-2">
                        <p className="text-xs font-semibold mb-1">Peak Flow — Personal Best: {r.peakFlowBest} L/min</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
                          <div className="rounded p-2 border border-green-300 bg-green-50">
                            <p className="text-xs font-semibold text-green-800">GREEN — Doing well</p>
                            <p className="text-xs text-green-700 mt-0.5">{r.peakFlowGreenZone}</p>
                          </div>
                          <div className="rounded p-2 border border-amber-300 bg-amber-50">
                            <p className="text-xs font-semibold text-amber-800">AMBER — Caution</p>
                            <p className="text-xs text-amber-700 mt-0.5">{r.peakFlowAmberZone}</p>
                          </div>
                          <div className="rounded p-2 border border-red-300 bg-red-50">
                            <p className="text-xs font-semibold text-red-800">RED — Emergency</p>
                            <p className="text-xs text-red-700 mt-0.5">{r.peakFlowRedZone}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="rounded p-2 border border-green-300 bg-green-50">
                        <p className="text-xs font-semibold text-green-800 mb-1">Green Zone — Actions</p>
                        <ul className="space-y-1">
                          {r.greenZoneActions.map((a, i) => (
                            <li key={i} className="text-xs text-green-900">• {a}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded p-2 border border-amber-300 bg-amber-50">
                        <p className="text-xs font-semibold text-amber-800 mb-1">Amber Zone — Actions</p>
                        <ul className="space-y-1">
                          {r.amberZoneActions.map((a, i) => (
                            <li key={i} className="text-xs text-amber-900">• {a}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded p-2 border border-red-300 bg-red-50">
                        <p className="text-xs font-semibold text-red-800 mb-1 flex items-center gap-1">
                          <Phone className="h-3 w-3" /> Red Zone — Dial 999
                        </p>
                        <ul className="space-y-1">
                          {r.redZoneActions.map((a, i) => (
                            <li key={i} className="text-xs text-red-900">• {a}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {r.hospitalAdmissions.length > 0 && (
                      <div>
                        <p className="font-medium mb-1">Hospital Admission History</p>
                        <div className="space-y-1">
                          {r.hospitalAdmissions.map((a, i) => (
                            <div key={i} className="border rounded p-2 text-xs">
                              <p className="font-semibold">{a.date}</p>
                              <p><span className="text-muted-foreground">Reason: </span>{a.reason}</p>
                              <p><span className="text-muted-foreground">Outcome: </span>{a.outcome}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="bg-muted/30 rounded p-2">
                        <p className="text-xs font-medium mb-1">Spare Inhaler Locations</p>
                        <ul className="space-y-0.5">
                          {r.spareInhalerLocations.map((loc, i) => (
                            <li key={i} className="text-xs text-muted-foreground">• {loc}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-muted/30 rounded p-2">
                        <p className="text-xs font-medium mb-1 flex items-center gap-1">
                          <Phone className="h-3 w-3" /> Emergency Contacts
                        </p>
                        <ul className="space-y-0.5">
                          {r.emergencyContacts.map((c, i) => (
                            <li key={i} className="text-xs">
                              <span className="font-medium">{c.name}</span>
                              <span className="text-muted-foreground"> — {c.role}: {c.phone}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded p-2">
                      <p className="font-medium text-xs text-purple-800 mb-1">Child&apos;s Voice</p>
                      <p className="text-xs text-purple-700 italic">&ldquo;{r.childVoice}&rdquo;</p>
                    </div>

                    <div className="bg-sky-50 border border-sky-200 rounded p-2">
                      <p className="font-medium text-xs text-sky-800 mb-1">Staff Observation</p>
                      <p className="text-xs text-sky-700">{r.staffObservation}</p>
                    </div>

                    <div className="text-xs text-muted-foreground border-t pt-2">
                      Plan logged by {getStaffName("staff_darren")} · Reviewed with {getStaffName(r.keyWorker)} · Next review: {r.reviewDate}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        <div className="mt-6 bg-muted/30 rounded-lg p-4 text-xs text-muted-foreground">
          <p className="font-semibold mb-1">Regulatory Framework — Personal Asthma Action Plans</p>
          <p>
            Every child with asthma must have a written personal asthma action plan (PAAP) following the format recommended by BTS/SIGN Guideline 158 (British Thoracic Society / Scottish Intercollegiate Guidelines Network, 2019, with 2024 update) and NICE NG80 (Asthma: diagnosis, monitoring and chronic asthma management). The plan must specify daily preventer therapy, reliever use, identified triggers, peak flow zones (green/amber/red) where age-appropriate, and clear actions at each zone including when to dial 999. Children&apos;s Homes (England) Regulations 2015, Quality Standard 8 (Health and wellbeing) requires the registered person to ensure each child receives healthcare that meets their needs and that staff are trained to recognise and respond to acute deterioration. The Asthma + Lung UK personal asthma plan template is the recommended pro-forma. Staff competency in inhaler technique, spacer use and recognition of severe attack must be evidenced through training records. The plan must be reviewed at least annually, after every acute attack, and shared with school under the Supporting Pupils with Medical Conditions statutory guidance (DfE, 2015). The child&apos;s voice and preferences must be central to the plan, in line with UNCRC Article 24 (right to the highest attainable standard of health) and Article 12 (right to be heard).
          </p>
        </div>
      </div>
    </PageShell>
  );
}
