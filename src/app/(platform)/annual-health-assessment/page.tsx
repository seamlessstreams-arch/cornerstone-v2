"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown, ChevronUp, ArrowUpDown, CheckCircle2, AlertCircle,
  Search, Heart, Stethoscope, ShieldCheck, CalendarClock, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getYPName, getStaffName } from "@/lib/seed-data";

/* ── types ─────────────────────────────────────────────────────────────────── */

interface HealthDomain {
  domain: string;
  findings: string;
  actions: string;
  followUp: string;
}

interface HealthAssessment {
  id: string;
  youngPerson: string;
  assessmentDate: string;
  assessmentDueDate: string;
  assessor: string;
  location: string;
  completedWithinDeadline: boolean;
  height: string;
  weight: string;
  bmiCentile: string;
  growthOnTrack: boolean;
  domains: HealthDomain[];
  immunisationsUpToDate: boolean;
  dentalCheckUpToDate: boolean;
  opticalCheckUpToDate: boolean;
  childContribution: string;
  reportShared: boolean;
  reportSharedWith: string[];
  recommendations: string[];
  nextAssessmentDate: string;
  signedOffByLA: boolean;
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

const d = (n: number) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };

/* ── seed data ─────────────────────────────────────────────────────────────── */

const SEED: HealthAssessment[] = [
  {
    id: "aha_001",
    youngPerson: "yp_alex",
    assessmentDate: d(-42),
    assessmentDueDate: d(-30),
    assessor: "Dr Helena Marsh, Consultant Paediatrician (LAC team)",
    location: "Northgate Health Centre, LAC clinic",
    completedWithinDeadline: false,
    height: "172cm",
    weight: "64kg",
    bmiCentile: "55th centile",
    growthOnTrack: true,
    domains: [
      {
        domain: "Physical health",
        findings: "Generally well. Mild eczema on inner elbows, well-managed with emollient. No chronic conditions. Asthma history (last attack 2022) — preventer inhaler not currently required. BP, pulse, chest examination all normal.",
        actions: "Continue emollient. Reissue salbutamol inhaler for emergency use. GP to review asthma plan annually.",
        followUp: "GP review in 12 months",
      },
      {
        domain: "Mental health",
        findings: "Alex presents with low mood, ongoing CAMHS engagement for trauma-related symptoms. Sleep disturbance (nightmares) reported. Self-harm risk historically — none in last 6 months.",
        actions: "Continue weekly CAMHS sessions. Liaise with key worker re sleep hygiene. Safety plan in place at home.",
        followUp: "CAMHS review at next case discussion (4 weeks)",
      },
      {
        domain: "Sexual health (age-appropriate)",
        findings: "Age-appropriate discussion completed. Alex (15) aware of consent and contraception. No current concerns. CSE risk historical — placement plan addresses this.",
        actions: "Signposted to Brook for confidential support. RSE programme via key work continues.",
        followUp: "Revisit at next AHA",
      },
      {
        domain: "Substance awareness",
        findings: "Alex disclosed occasional cannabis use (last 3 months ago). No alcohol misuse. Aware of risks.",
        actions: "Referral to YP substance misuse worker (CGL). Key worker direct work session weekly.",
        followUp: "CGL initial appointment within 2 weeks",
      },
      {
        domain: "Diet and nutrition",
        findings: "Balanced diet at Oak House. Skips breakfast on school days. Iron level borderline-low on bloods (11.8 g/dL).",
        actions: "Encourage breakfast routine. Iron-rich foods discussed. Repeat FBC in 3 months.",
        followUp: "Bloods 3 months",
      },
      {
        domain: "Exercise",
        findings: "Plays football at school 2x weekly. Active.",
        actions: "Continue. Consider community football club.",
        followUp: "Review at next AHA",
      },
      {
        domain: "Sleep",
        findings: "7-8 hours but disturbed by nightmares. Phone use late at night noted.",
        actions: "Sleep hygiene plan: phone out of bedroom by 10pm. Wind-down routine.",
        followUp: "Key worker monthly review",
      },
      {
        domain: "Hygiene",
        findings: "Good personal hygiene. Skin care for eczema understood.",
        actions: "None required.",
        followUp: "N/A",
      },
    ],
    immunisationsUpToDate: true,
    dentalCheckUpToDate: true,
    opticalCheckUpToDate: false,
    childContribution: "Alex engaged well with the assessment. Asked questions about cannabis effects on the brain and was open about substance use. Said he 'felt heard' and appreciated the LAC nurse's manner. Wants help with sleep.",
    reportShared: true,
    reportSharedWith: ["Alex (young person)", "Local Authority (Lewisham)", "GP", "School nurse", "Oak House (Registered Manager)"],
    recommendations: [
      "Refer to CGL substance misuse service",
      "Arrange optician appointment within 4 weeks",
      "Repeat FBC in 3 months for iron level",
      "Continue CAMHS engagement",
      "Implement sleep hygiene plan",
      "Reissue emergency salbutamol inhaler",
    ],
    nextAssessmentDate: d(323),
    signedOffByLA: true,
  },
  {
    id: "aha_002",
    youngPerson: "yp_jordan",
    assessmentDate: d(-15),
    assessmentDueDate: d(-10),
    assessor: "Sarah Okafor, Specialist LAC Nurse",
    location: "Oak House (home visit at YP request)",
    completedWithinDeadline: false,
    height: "168cm",
    weight: "58kg",
    bmiCentile: "42nd centile",
    growthOnTrack: true,
    domains: [
      {
        domain: "Physical health",
        findings: "Well. No chronic conditions. Hayfever in spring (loratadine PRN). Old fracture (left wrist, 2021) fully healed.",
        actions: "Antihistamine stocked. No further action.",
        followUp: "GP review if symptoms worsen",
      },
      {
        domain: "Mental health",
        findings: "Anxiety, particularly around school transitions and contact arrangements. Engaging with school counsellor weekly. No self-harm. Mood generally stable.",
        actions: "Continue school counselling. Anxiety toolkit shared with key worker. Consider CAMHS referral if escalation.",
        followUp: "Review at next case discussion (6 weeks)",
      },
      {
        domain: "Sexual health (age-appropriate)",
        findings: "Jordan (14) — age-appropriate conversation about puberty, body changes, and consent. No concerns.",
        actions: "Continue RSE through key work. Resources from Brook provided.",
        followUp: "Revisit at next AHA",
      },
      {
        domain: "Substance awareness",
        findings: "Denies any substance or alcohol use. Aware of risks. Positive peer group at school.",
        actions: "None required at present. Continue preventative messaging.",
        followUp: "Revisit at next AHA",
      },
      {
        domain: "Diet and nutrition",
        findings: "Balanced diet. Vegetarian by choice (3 years). B12 checked — within range. Good appetite.",
        actions: "Continue varied vegetarian diet. Annual B12 check.",
        followUp: "Bloods annually",
      },
      {
        domain: "Exercise",
        findings: "Dance class weekly. Swims with key worker fortnightly. Active.",
        actions: "Continue. Encouraged to try new activities.",
        followUp: "N/A",
      },
      {
        domain: "Sleep",
        findings: "9 hours nightly. Good routine. No issues.",
        actions: "None.",
        followUp: "N/A",
      },
      {
        domain: "Hygiene",
        findings: "Excellent. Independent in self-care. Understands menstrual hygiene.",
        actions: "None required.",
        followUp: "N/A",
      },
    ],
    immunisationsUpToDate: true,
    dentalCheckUpToDate: true,
    opticalCheckUpToDate: true,
    childContribution: "Jordan asked for the assessment to take place at Oak House rather than the clinic, which was accommodated. Engaged thoughtfully. Said the assessment 'wasn't as bad as last year' and appreciated the LAC nurse remembering her from previous years. Wants help managing exam anxiety.",
    reportShared: true,
    reportSharedWith: ["Jordan (young person)", "Local Authority (Southwark)", "GP", "School", "Oak House (Registered Manager)", "Birth mother (with YP consent)"],
    recommendations: [
      "Continue weekly school counselling",
      "Share anxiety toolkit with all key workers",
      "Consider CAMHS referral if anxiety escalates",
      "Annual B12 monitoring",
      "Ongoing RSE through key work",
    ],
    nextAssessmentDate: d(350),
    signedOffByLA: true,
  },
  {
    id: "aha_003",
    youngPerson: "yp_casey",
    assessmentDate: d(45),
    assessmentDueDate: d(28),
    assessor: "Dr Helena Marsh, Consultant Paediatrician (LAC team) — appointment booked",
    location: "Northgate Health Centre, LAC clinic",
    completedWithinDeadline: false,
    height: "142cm (last measured 6mo ago)",
    weight: "36kg (last measured 6mo ago)",
    bmiCentile: "Pending — to be measured at AHA",
    growthOnTrack: true,
    domains: [
      {
        domain: "Physical health",
        findings: "Pending current assessment. Known: ADHD diagnosis, on methylphenidate (modified release) 30mg morning. Last paediatric review 4 months ago — stable.",
        actions: "AHA appointment booked. Medication review at same visit. Bring growth chart.",
        followUp: "AHA on scheduled date",
      },
      {
        domain: "Mental health",
        findings: "Pending. Known: ADHD with emotional dysregulation. Engaging with therapeutic input via Anna (key worker). No CAMHS involvement currently.",
        actions: "Discuss CAMHS referral threshold at AHA. Therapeutic plan ongoing.",
        followUp: "Post-AHA discussion at LAC review",
      },
      {
        domain: "Sexual health (age-appropriate)",
        findings: "Pending. Casey (10) — age-appropriate body autonomy and PANTS rule conversations covered through key work.",
        actions: "Continue PANTS-based safeguarding work via key worker.",
        followUp: "Revisit at next AHA",
      },
      {
        domain: "Substance awareness",
        findings: "Pending. Age-appropriate awareness of medicines and not taking others' medication.",
        actions: "Key work session on medicine safety.",
        followUp: "Revisit at next AHA",
      },
      {
        domain: "Diet and nutrition",
        findings: "Pending. Known: appetite suppression on methylphenidate — encourages high-calorie breakfast and evening snack to compensate. Weight tracked monthly.",
        actions: "Monthly weight monitoring. Discuss with paediatrician at AHA.",
        followUp: "Monthly weights, paediatrician at AHA",
      },
      {
        domain: "Exercise",
        findings: "Pending. Trampolining weekly. Park visits with staff. Active.",
        actions: "Continue.",
        followUp: "N/A",
      },
      {
        domain: "Sleep",
        findings: "Pending. Sleep difficulties common with ADHD/methylphenidate. Bedtime routine being implemented (currently inconsistent — averages 7 hours).",
        actions: "Discuss melatonin or medication timing at AHA. Implement consistent bedtime routine.",
        followUp: "Paediatrician at AHA",
      },
      {
        domain: "Hygiene",
        findings: "Pending. Requires staff support and prompts for personal hygiene. Improving with consistent routine.",
        actions: "Continue staff-supported hygiene routine. Visual prompts in bathroom.",
        followUp: "Key worker monthly review",
      },
    ],
    immunisationsUpToDate: false,
    dentalCheckUpToDate: true,
    opticalCheckUpToDate: false,
    childContribution: "Casey expressed nervousness about the upcoming appointment. Anna (key worker) has prepared a social story and visit plan. Casey wants 'just Anna' to attend with her. Will be supported with sensory items (fidget, ear defenders).",
    reportShared: false,
    reportSharedWith: [],
    recommendations: [
      "Booster MMR overdue — arrange with GP within 4 weeks",
      "Optician appointment to be booked",
      "Discuss sleep with paediatrician at AHA — consider melatonin",
      "Review methylphenidate dose given growth and appetite",
      "Consider CAMHS referral for emotional regulation support",
      "Sensory-aware appointment planning to be repeated",
    ],
    nextAssessmentDate: d(410),
    signedOffByLA: false,
  },
];

/* ── page ──────────────────────────────────────────────────────────────────── */

export default function AnnualHealthAssessmentPage() {
  const [data] = useState(SEED);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterDeadline, setFilterDeadline] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        getYPName(r.youngPerson).toLowerCase().includes(q) ||
        r.assessor.toLowerCase().includes(q),
      );
    }
    if (filterDeadline === "within") rows = rows.filter((r) => r.completedWithinDeadline);
    if (filterDeadline === "outside") rows = rows.filter((r) => !r.completedWithinDeadline);
    rows.sort((a, b) =>
      sortBy === "newest"
        ? b.assessmentDate.localeCompare(a.assessmentDate)
        : a.assessmentDate.localeCompare(b.assessmentDate),
    );
    return rows;
  }, [data, search, filterDeadline, sortBy]);

  const total = data.length;
  const withinDeadlinePct = total > 0
    ? Math.round((data.filter((r) => r.completedWithinDeadline).length / total) * 100)
    : 0;
  const fullHealthPack = data.filter((r) =>
    r.immunisationsUpToDate && r.dentalCheckUpToDate && r.opticalCheckUpToDate,
  ).length;
  const today = d(0);
  const sixtyDays = d(60);
  const reviewsDue60 = data.filter((r) =>
    r.nextAssessmentDate >= today && r.nextAssessmentDate <= sixtyDays,
  ).length;

  const exportCols: ExportColumn<HealthAssessment>[] = [
    { header: "Young Person", accessor: (r: HealthAssessment) => getYPName(r.youngPerson) },
    { header: "Assessment Date", accessor: (r: HealthAssessment) => r.assessmentDate },
    { header: "Due Date", accessor: (r: HealthAssessment) => r.assessmentDueDate },
    { header: "Assessor", accessor: (r: HealthAssessment) => r.assessor },
    { header: "Location", accessor: (r: HealthAssessment) => r.location },
    { header: "Within Deadline", accessor: (r: HealthAssessment) => r.completedWithinDeadline ? "Yes" : "No" },
    { header: "Height", accessor: (r: HealthAssessment) => r.height },
    { header: "Weight", accessor: (r: HealthAssessment) => r.weight },
    { header: "BMI Centile", accessor: (r: HealthAssessment) => r.bmiCentile },
    { header: "Growth On Track", accessor: (r: HealthAssessment) => r.growthOnTrack ? "Yes" : "No" },
    { header: "Immunisations", accessor: (r: HealthAssessment) => r.immunisationsUpToDate ? "Up to date" : "Outstanding" },
    { header: "Dental", accessor: (r: HealthAssessment) => r.dentalCheckUpToDate ? "Up to date" : "Outstanding" },
    { header: "Optical", accessor: (r: HealthAssessment) => r.opticalCheckUpToDate ? "Up to date" : "Outstanding" },
    { header: "Report Shared", accessor: (r: HealthAssessment) => r.reportShared ? "Yes" : "No" },
    { header: "Signed Off (LA)", accessor: (r: HealthAssessment) => r.signedOffByLA ? "Yes" : "No" },
    { header: "Next Assessment", accessor: (r: HealthAssessment) => r.nextAssessmentDate },
  ];

  return (
    <PageShell
      title="Annual Health Assessment"
      subtitle="Statutory AHA · Care Planning Regulations 2010 · Quality Standard 7"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Annual Health Assessment" />
          <ExportButton data={data} columns={exportCols} filename="annual-health-assessment" />
        </div>
      }
    >
      <div id="print-area">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Active Assessments", value: total, icon: Heart, clr: "text-rose-600" },
            { label: "Within Deadline %", value: `${withinDeadlinePct}%`, icon: CalendarClock, clr: "text-blue-600" },
            { label: "Full Health Pack", value: `${fullHealthPack}/${total}`, icon: ShieldCheck, clr: "text-green-600" },
            { label: "Reviews Due 60d", value: reviewsDue60, icon: Activity, clr: "text-amber-600" },
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
              placeholder="Search young person or assessor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterDeadline} onValueChange={setFilterDeadline}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Deadline" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assessments</SelectItem>
              <SelectItem value="within">Within Deadline</SelectItem>
              <SelectItem value="outside">Outside Deadline</SelectItem>
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
            const borderClr = r.completedWithinDeadline
              ? "border-l-green-400"
              : new Date(r.assessmentDate) > new Date()
                ? "border-l-amber-400"
                : "border-l-red-500";
            return (
              <Card key={r.id} className={cn("border-l-4", borderClr)}>
                <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpandedId(isOpen ? null : r.id)}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                        {getYPName(r.youngPerson)}
                        <Badge variant="outline" className={r.completedWithinDeadline ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                          {r.completedWithinDeadline ? "Within Deadline" : "Outside Deadline"}
                        </Badge>
                        {r.signedOffByLA && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">LA Signed Off</Badge>
                        )}
                        {r.immunisationsUpToDate && r.dentalCheckUpToDate && r.opticalCheckUpToDate && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">Full Health Pack</Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Assessment: {r.assessmentDate} · Due: {r.assessmentDueDate} · Assessor: {r.assessor.split(",")[0]} · Next: {r.nextAssessmentDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-muted/50">{r.domains.length} domains</Badge>
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>

                {isOpen && (
                  <CardContent className="pt-0 space-y-3 text-sm">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-muted/40 rounded p-2">
                        <p className="text-xs text-muted-foreground">Height</p>
                        <p className="text-xs font-medium">{r.height}</p>
                      </div>
                      <div className="bg-muted/40 rounded p-2">
                        <p className="text-xs text-muted-foreground">Weight</p>
                        <p className="text-xs font-medium">{r.weight}</p>
                      </div>
                      <div className="bg-muted/40 rounded p-2">
                        <p className="text-xs text-muted-foreground">BMI Centile</p>
                        <p className="text-xs font-medium">{r.bmiCentile}</p>
                      </div>
                      <div className="bg-muted/40 rounded p-2">
                        <p className="text-xs text-muted-foreground">Growth</p>
                        <p className="text-xs font-medium">{r.growthOnTrack ? "On track" : "Concerns"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className={cn("rounded p-2 border", r.immunisationsUpToDate ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
                        <p className="text-xs font-medium flex items-center gap-1">
                          {r.immunisationsUpToDate ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <AlertCircle className="h-3 w-3 text-red-600" />}
                          Immunisations
                        </p>
                        <p className="text-xs text-muted-foreground">{r.immunisationsUpToDate ? "Up to date" : "Outstanding"}</p>
                      </div>
                      <div className={cn("rounded p-2 border", r.dentalCheckUpToDate ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
                        <p className="text-xs font-medium flex items-center gap-1">
                          {r.dentalCheckUpToDate ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <AlertCircle className="h-3 w-3 text-red-600" />}
                          Dental
                        </p>
                        <p className="text-xs text-muted-foreground">{r.dentalCheckUpToDate ? "Up to date" : "Outstanding"}</p>
                      </div>
                      <div className={cn("rounded p-2 border", r.opticalCheckUpToDate ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
                        <p className="text-xs font-medium flex items-center gap-1">
                          {r.opticalCheckUpToDate ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <AlertCircle className="h-3 w-3 text-red-600" />}
                          Optical
                        </p>
                        <p className="text-xs text-muted-foreground">{r.opticalCheckUpToDate ? "Up to date" : "Outstanding"}</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium mb-1 flex items-center gap-1">
                        <Stethoscope className="h-3.5 w-3.5" /> Assessment Domains
                      </p>
                      <div className="space-y-2">
                        {r.domains.map((dom, i) => (
                          <div key={i} className="border rounded p-2">
                            <p className="text-xs font-semibold">{dom.domain}</p>
                            <p className="text-xs mt-1"><span className="text-muted-foreground">Findings: </span>{dom.findings}</p>
                            <p className="text-xs mt-1"><span className="text-muted-foreground">Actions: </span>{dom.actions}</p>
                            <p className="text-xs mt-1"><span className="text-muted-foreground">Follow-up: </span>{dom.followUp}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded p-2">
                      <p className="font-medium text-xs text-purple-800 mb-1">Child&apos;s Contribution</p>
                      <p className="text-xs text-purple-700 italic">&ldquo;{r.childContribution}&rdquo;</p>
                    </div>

                    {r.recommendations.length > 0 && (
                      <div>
                        <p className="font-medium mb-1">Recommendations</p>
                        <ul className="space-y-1">{r.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}</ul>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-muted/30 rounded p-2">
                        <p className="text-xs font-medium mb-1">Report Shared</p>
                        <p className="text-xs text-muted-foreground">{r.reportShared ? "Yes" : "Not yet shared"}</p>
                        {r.reportSharedWith.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {r.reportSharedWith.map((p, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{p}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="bg-muted/30 rounded p-2">
                        <p className="text-xs font-medium mb-1">LA Sign-Off</p>
                        <p className="text-xs text-muted-foreground">{r.signedOffByLA ? "Signed off by Local Authority" : "Awaiting LA sign-off"}</p>
                        <p className="text-xs text-muted-foreground mt-1">Logged by {getStaffName("staff_darren")}</p>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground border-t pt-2">
                      Location: {r.location} · Assessor: {r.assessor}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        <div className="mt-6 bg-muted/30 rounded-lg p-4 text-xs text-muted-foreground">
          <p className="font-semibold mb-1">Statutory Framework — Annual Health Assessment</p>
          <p>
            Looked-after children must receive an Annual Health Assessment (AHA) under the Care Planning, Placement and Case Review (England) Regulations 2010, regulation 7, and Quality Standard 7 of the Children&apos;s Homes Regulations 2015 (Health and wellbeing). For children aged 5 and over, the AHA must take place at least once every 12 months and be carried out by a registered medical practitioner or appropriately qualified nurse (typically the LAC nurse or paediatrician). The assessment must address physical, emotional and mental health needs, and inform the child&apos;s Health Plan, which feeds into the overall Care Plan. The young person&apos;s wishes and feelings must be sought and recorded. The completed assessment is shared with the responsible Local Authority, GP, school nurse and (with consent where appropriate) parents/carers. Outside-deadline completions, missing immunisations, dental or optical checks must be tracked and escalated. Reviews are monitored through Reg 44/45 reporting and Ofsted inspection of health outcomes.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
