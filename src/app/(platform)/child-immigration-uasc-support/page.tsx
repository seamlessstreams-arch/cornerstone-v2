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
  Globe, FileText, Shield, ChevronUp, ChevronDown, ArrowUpDown, Search, Calendar, Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getYPName, getStaffName } from "@/lib/seed-data";

/* ── types ─────────────────────────────────────────────────────────────────── */

type ImmigrationStatus =
  | "British citizen"
  | "Settled — ILR"
  | "Pre-settled status"
  | "UASC — claim pending"
  | "Refugee status"
  | "Humanitarian Protection"
  | "Discretionary Leave"
  | "UASC Leave (until 17.5)"
  | "Appeal pending"
  | "Refused — appeals exhausted"
  | "Naturalisation in progress"
  | "Other";

type EnglishLevel = "Pre-A1" | "A1" | "A2" | "B1" | "B2" | "C1" | "Fluent" | "Native";

interface AsylumClaim {
  submittedDate: string;
  firstHearingDate?: string;
  reasonsForClaim: string[];
}

interface LegalRepresentative {
  name: string;
  firm: string;
  specialism: string;
  LAA: boolean;
}

interface HomeOfficeReference {
  reference: string;
  type: string;
}

interface ImmigrationRecord {
  id: string;
  youngPerson: string;
  recordedDate: string;
  immigrationStatus: ImmigrationStatus;
  countryOfOrigin?: string;
  arrivalUk?: string;
  ageAtArrival?: number;
  ageAssessmentCompleted?: boolean;
  ageAssessmentDate?: string;
  ageAssessmentOutcome?: string;
  asylumClaim?: AsylumClaim;
  legalRepresentative?: LegalRepresentative;
  homeOfficeReferences: HomeOfficeReference[];
  documentsHeld: string[];
  documentsAwaiting: string[];
  englishLanguageLevel: EnglishLevel;
  esolEngaged: boolean;
  familyTracingActive: boolean;
  familyTracingService?: string;
  cultureCommunityLinks: string[];
  traumaInformedSupport: string[];
  nrpfConsiderations: string[];
  pathwayPlanLinkedToImmigration: boolean;
  childVoice: string;
  staffObservation: string;
  reviewDate: string;
  keyWorker: string;
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

const d = (n: number) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };

const STATUS_CLR: Record<ImmigrationStatus, string> = {
  "British citizen": "bg-emerald-100 text-emerald-800",
  "Settled — ILR": "bg-teal-100 text-teal-800",
  "Pre-settled status": "bg-cyan-100 text-cyan-800",
  "UASC — claim pending": "bg-amber-100 text-amber-800",
  "Refugee status": "bg-green-100 text-green-800",
  "Humanitarian Protection": "bg-lime-100 text-lime-800",
  "Discretionary Leave": "bg-yellow-100 text-yellow-800",
  "UASC Leave (until 17.5)": "bg-orange-100 text-orange-800",
  "Appeal pending": "bg-rose-100 text-rose-800",
  "Refused — appeals exhausted": "bg-red-100 text-red-800",
  "Naturalisation in progress": "bg-indigo-100 text-indigo-800",
  "Other": "bg-slate-100 text-slate-800",
};

const STATUS_BORDER: Record<ImmigrationStatus, string> = {
  "British citizen": "border-emerald-400 bg-emerald-50",
  "Settled — ILR": "border-teal-400 bg-teal-50",
  "Pre-settled status": "border-cyan-400 bg-cyan-50",
  "UASC — claim pending": "border-amber-400 bg-amber-50",
  "Refugee status": "border-green-400 bg-green-50",
  "Humanitarian Protection": "border-lime-400 bg-lime-50",
  "Discretionary Leave": "border-yellow-400 bg-yellow-50",
  "UASC Leave (until 17.5)": "border-orange-400 bg-orange-50",
  "Appeal pending": "border-rose-400 bg-rose-50",
  "Refused — appeals exhausted": "border-red-400 bg-red-50",
  "Naturalisation in progress": "border-indigo-400 bg-indigo-50",
  "Other": "border-slate-400 bg-slate-50",
};

/* ── seed data ─────────────────────────────────────────────────────────────── */

const SEED: ImmigrationRecord[] = [
  {
    id: "im1",
    youngPerson: "incoming UASC placeholder — anonymised",
    recordedDate: d(-21),
    immigrationStatus: "UASC — claim pending",
    countryOfOrigin: "Eritrea",
    arrivalUk: d(-95),
    ageAtArrival: 15,
    ageAssessmentCompleted: true,
    ageAssessmentDate: d(-70),
    ageAssessmentOutcome: "Age accepted as 15 — Merton-compliant joint assessment by two qualified social workers. Young person engaged with the process via interpreter; age claimed accepted. Documents from country of origin pending family tracing.",
    asylumClaim: {
      submittedDate: d(-80),
      firstHearingDate: d(40),
      reasonsForClaim: [
        "Risk of forced military conscription (indefinite national service)",
        "Religious persecution in country of origin",
        "Loss of family during journey to the UK",
        "Trauma from journey through transit countries",
      ],
    },
    legalRepresentative: {
      name: "Anya Petrova",
      firm: "Greater Manchester Immigration Aid Unit",
      specialism: "Children's asylum and unaccompanied minors",
      LAA: true,
    },
    homeOfficeReferences: [
      { reference: "HO/2025/UASC/047213", type: "Home Office reference" },
      { reference: "ARC: 1234-5678-9012", type: "Application Registration Card (ARC)" },
      { reference: "PORT/MAN/0091", type: "Port reference (claim raised at port)" },
    ],
    documentsHeld: [
      "Application Registration Card (ARC)",
      "Asylum support letter (under s.20 Children Act 1989 — not s.95)",
      "Local Authority care plan",
      "Birth declaration (informal — translated)",
      "Immunisation record (initial health assessment)",
    ],
    documentsAwaiting: [
      "Biometric Residence Permit (pending decision on asylum claim)",
      "School enrolment confirmation (in progress)",
      "Original birth certificate (family tracing dependent)",
    ],
    englishLanguageLevel: "A1",
    esolEngaged: true,
    familyTracingActive: true,
    familyTracingService: "British Red Cross International Family Tracing — referral made with consent. Young person consulted at each step about safety implications of contact.",
    cultureCommunityLinks: [
      "Eritrean Orthodox Tewahedo congregation — fortnightly attendance with key worker",
      "Tigrinya-language community group — monthly social",
      "Halal-aware menu planning where preferred (faith-aware, not assumed)",
      "Cultural mentor matched via Refugee Council Children's Section",
    ],
    traumaInformedSupport: [
      "Therapeutic key work with trained worker (PIE model — Psychologically Informed Environment)",
      "Referral to Freedom from Torture for specialist therapeutic assessment",
      "CAMHS referral via LA pathway — specialist asylum-seeking children's service",
      "Consistent staff team and predictable routines to support nervous-system regulation",
      "Interpreter used for all clinical and legal appointments — not a peer or family member",
      "Sleep, food and sensory comfort planned around cultural preferences",
    ],
    nrpfConsiderations: [
      "Not applicable while child is looked-after under s.20 Children Act 1989 — LA holds full corporate parenting responsibility",
      "NRPF risk to be reviewed at age 17.5 transition planning — Care Leavers' entitlements continue under Children (Leaving Care) Act 2000 regardless of immigration status until appeal rights exhausted",
      "Pathway plan to address possible NRPF scenario post-21 if appeals exhausted — escalation route identified",
    ],
    pathwayPlanLinkedToImmigration: true,
    childVoice: "I want to learn English fast. I want to know if my mother is alive. I am safe here but I worry every day about the letter from the Home Office. The lawyer is kind — she explains things slowly. I want to stay in school and one day be a nurse.",
    staffObservation: "Settling well into the home. Engages warmly with key worker via interpreter and increasingly in English. Has shown resilience and capacity for hope. Anxiety spikes around post arrivals — we now sit with him when post is opened. Sleep improving. Faith and food are sources of comfort and identity — these are protected and resourced.",
    reviewDate: d(28),
    keyWorker: "staff_anna",
  },
  {
    id: "im2",
    youngPerson: "yp_jordan",
    recordedDate: d(-7),
    immigrationStatus: "British citizen",
    countryOfOrigin: "United Kingdom (Pakistani heritage — paternal)",
    arrivalUk: undefined,
    ageAtArrival: undefined,
    ageAssessmentCompleted: false,
    homeOfficeReferences: [],
    documentsHeld: [
      "Full UK birth certificate (issued in Nottingham)",
      "British passport (in date)",
      "NHS number and medical record",
    ],
    documentsAwaiting: [],
    englishLanguageLevel: "Native",
    esolEngaged: false,
    familyTracingActive: false,
    cultureCommunityLinks: [
      "Connection to paternal Pakistani heritage actively supported (food, festivals, language exposure)",
      "Halal dietary requirements respected and resourced",
      "Local mosque attendance at Jordan's request — transport supported",
      "Heritage and identity work included in key work and life-story sessions",
    ],
    traumaInformedSupport: [
      "Identity-affirming key work — heritage and faith treated as strengths, not 'add-ons'",
      "Staff team briefed to recognise everyday racism / micro-aggressions and respond consistently",
    ],
    nrpfConsiderations: [
      "Not applicable — British citizen with full recourse to public funds and services",
    ],
    pathwayPlanLinkedToImmigration: false,
    childVoice: "I'm British. I was born here. I want people to ask about my heritage when it matters and not assume things about me because of how I look or because my dad's family is from Pakistan.",
    staffObservation: "Record exists to (a) confirm Jordan's status is settled and well-evidenced, (b) ensure staff never make assumptions based on heritage or dietary requirements, and (c) document active support of dual-heritage identity. No immigration matters arising — record reviewed annually for completeness.",
    reviewDate: d(180),
    keyWorker: "staff_anna",
  },
];

/* ── component ─────────────────────────────────────────────────────────────── */

export default function ChildImmigrationUascSupportPage() {
  const [data] = useState<ImmigrationRecord[]>(SEED);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("status");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId(expandedId === id ? null : id);

  const ypLabel = (id: string) => {
    if (id.startsWith("yp_")) return getYPName(id);
    return id;
  };

  const filtered = useMemo(() => {
    let out = [...data];
    if (search) {
      const s = search.toLowerCase();
      out = out.filter(r =>
        ypLabel(r.youngPerson).toLowerCase().includes(s) ||
        r.immigrationStatus.toLowerCase().includes(s) ||
        (r.countryOfOrigin?.toLowerCase().includes(s) ?? false)
      );
    }
    if (statusFilter !== "all") out = out.filter(r => r.immigrationStatus === statusFilter);
    out.sort((a, b) => {
      switch (sortBy) {
        case "yp": return ypLabel(a.youngPerson).localeCompare(ypLabel(b.youngPerson));
        case "review": return a.reviewDate.localeCompare(b.reviewDate);
        case "recorded": return b.recordedDate.localeCompare(a.recordedDate);
        default: {
          const ord: ImmigrationStatus[] = [
            "UASC — claim pending", "Appeal pending", "UASC Leave (until 17.5)",
            "Discretionary Leave", "Humanitarian Protection", "Refugee status",
            "Pre-settled status", "Settled — ILR", "Naturalisation in progress",
            "British citizen", "Refused — appeals exhausted", "Other",
          ];
          return ord.indexOf(a.immigrationStatus) - ord.indexOf(b.immigrationStatus);
        }
      }
    });
    return out;
  }, [data, search, statusFilter, sortBy]);

  const activeMatters = data.filter(r =>
    r.immigrationStatus !== "British citizen" &&
    r.immigrationStatus !== "Settled — ILR"
  ).length;
  const claimsPending = data.filter(r =>
    r.immigrationStatus === "UASC — claim pending" || r.immigrationStatus === "Appeal pending"
  ).length;
  const ageAssessmentsCompleted = data.filter(r => r.ageAssessmentCompleted).length;
  const reviewsDue90 = data.filter(r => {
    if (!r.reviewDate) return false;
    const dt = new Date(r.reviewDate).getTime();
    const now = Date.now();
    return dt - now <= 90 * 24 * 60 * 60 * 1000 && dt - now >= 0;
  }).length;

  const exportCols: ExportColumn<ImmigrationRecord>[] = useMemo(() => [
    { header: "Young Person", accessor: (r: ImmigrationRecord) => ypLabel(r.youngPerson) },
    { header: "Recorded Date", accessor: (r: ImmigrationRecord) => r.recordedDate },
    { header: "Immigration Status", accessor: (r: ImmigrationRecord) => r.immigrationStatus },
    { header: "Country of Origin", accessor: (r: ImmigrationRecord) => r.countryOfOrigin ?? "" },
    { header: "Arrival UK", accessor: (r: ImmigrationRecord) => r.arrivalUk ?? "" },
    { header: "Age at Arrival", accessor: (r: ImmigrationRecord) => r.ageAtArrival ?? "" },
    { header: "Age Assessment Completed", accessor: (r: ImmigrationRecord) => r.ageAssessmentCompleted ? "Yes" : "No" },
    { header: "Age Assessment Date", accessor: (r: ImmigrationRecord) => r.ageAssessmentDate ?? "" },
    { header: "Age Assessment Outcome", accessor: (r: ImmigrationRecord) => r.ageAssessmentOutcome ?? "" },
    { header: "Asylum Claim Submitted", accessor: (r: ImmigrationRecord) => r.asylumClaim?.submittedDate ?? "" },
    { header: "Asylum First Hearing", accessor: (r: ImmigrationRecord) => r.asylumClaim?.firstHearingDate ?? "" },
    { header: "Asylum Reasons", accessor: (r: ImmigrationRecord) => r.asylumClaim?.reasonsForClaim.join("; ") ?? "" },
    { header: "Legal Rep", accessor: (r: ImmigrationRecord) => r.legalRepresentative ? `${r.legalRepresentative.name} (${r.legalRepresentative.firm})` : "" },
    { header: "Legal Rep LAA-funded", accessor: (r: ImmigrationRecord) => r.legalRepresentative ? (r.legalRepresentative.LAA ? "Yes" : "No") : "" },
    { header: "Home Office References", accessor: (r: ImmigrationRecord) => r.homeOfficeReferences.map(h => `${h.type}: ${h.reference}`).join("; ") },
    { header: "Documents Held", accessor: (r: ImmigrationRecord) => r.documentsHeld.join("; ") },
    { header: "Documents Awaiting", accessor: (r: ImmigrationRecord) => r.documentsAwaiting.join("; ") },
    { header: "English Level", accessor: (r: ImmigrationRecord) => r.englishLanguageLevel },
    { header: "ESOL Engaged", accessor: (r: ImmigrationRecord) => r.esolEngaged ? "Yes" : "No" },
    { header: "Family Tracing Active", accessor: (r: ImmigrationRecord) => r.familyTracingActive ? "Yes" : "No" },
    { header: "Family Tracing Service", accessor: (r: ImmigrationRecord) => r.familyTracingService ?? "" },
    { header: "Culture / Community Links", accessor: (r: ImmigrationRecord) => r.cultureCommunityLinks.join("; ") },
    { header: "Trauma-Informed Support", accessor: (r: ImmigrationRecord) => r.traumaInformedSupport.join("; ") },
    { header: "NRPF Considerations", accessor: (r: ImmigrationRecord) => r.nrpfConsiderations.join("; ") },
    { header: "Pathway Plan Linked", accessor: (r: ImmigrationRecord) => r.pathwayPlanLinkedToImmigration ? "Yes" : "No" },
    { header: "Child's Voice", accessor: (r: ImmigrationRecord) => r.childVoice },
    { header: "Staff Observation", accessor: (r: ImmigrationRecord) => r.staffObservation },
    { header: "Review Date", accessor: (r: ImmigrationRecord) => r.reviewDate },
    { header: "Key Worker", accessor: (r: ImmigrationRecord) => getStaffName(r.keyWorker) },
  ], []);

  return (
    <PageShell
      title="Child Immigration & UASC Support"
      subtitle="Per-child immigration status, age assessment, asylum claim, family tracing, leave-to-remain reviews — handled with trauma-informed care"
      actions={[
        <PrintButton key="p" title="Immigration & UASC Support" />,
        <ExportButton key="e" data={filtered} columns={exportCols} filename="child-immigration-uasc-support" />,
      ]}
    >
      <div id="print-area" className="space-y-6">

        {/* sensitivity / framing note */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 flex items-start gap-3">
          <Globe className="h-5 w-5 text-amber-700 mt-0.5" />
          <div>
            <p className="font-semibold">Every child's immigration status matters — and is handled with care</p>
            <p className="text-xs mt-1">Whether a child is a UK citizen, holds settled status, or is an unaccompanied asylum-seeking child (UASC), this record helps us hold the right information about identity, entitlements and risk in one place. We work with specialist immigration solicitors, the British Red Cross and the Refugee Council. We never treat heritage as suspicion. We never gather facial or biometric data outside lawful Home Office processes. We support family tracing only with the young person's informed consent and with safety paramount.</p>
          </div>
        </div>

        {/* summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Children with active immigration matters", value: activeMatters, icon: Globe, colour: "text-amber-700" },
            { label: "Asylum claims pending", value: claimsPending, icon: FileText, colour: "text-rose-700" },
            { label: "Age assessments completed", value: ageAssessmentsCompleted, icon: Shield, colour: "text-teal-700" },
            { label: "Reviews due in 90 days", value: reviewsDue90, icon: Calendar, colour: "text-indigo-700" },
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

        {/* filters / sort */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <Label className="text-xs">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-8" placeholder="Young person, country, status…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="w-56">
                <Label className="text-xs">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {(Object.keys(STATUS_CLR) as ImmigrationStatus[]).map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-44">
                <Label className="text-xs flex items-center gap-1"><ArrowUpDown className="h-3 w-3" />Sort</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">Stage priority</SelectItem>
                    <SelectItem value="yp">Young person</SelectItem>
                    <SelectItem value="review">Review date</SelectItem>
                    <SelectItem value="recorded">Recorded date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* expandable cards */}
        <div className="space-y-3">
          {filtered.map(r => {
            const open = expandedId === r.id;
            return (
              <Card key={r.id} className={cn("border-l-4", STATUS_BORDER[r.immigrationStatus])}>
                <button className="w-full text-left" onClick={() => toggle(r.id)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-base">{ypLabel(r.youngPerson)}</CardTitle>
                        <Badge className={cn("text-xs", STATUS_CLR[r.immigrationStatus])}>{r.immigrationStatus}</Badge>
                        {r.countryOfOrigin && (
                          <Badge variant="outline" className="text-xs"><Globe className="h-3 w-3 mr-1" />{r.countryOfOrigin}</Badge>
                        )}
                        {r.asylumClaim && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />Asylum claim {r.asylumClaim.firstHearingDate ? "— hearing booked" : "— submitted"}
                          </Badge>
                        )}
                        {r.familyTracingActive && (
                          <Badge variant="outline" className="text-xs bg-rose-50 text-rose-800 border-rose-200">Family tracing active</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Key worker: {getStaffName(r.keyWorker)}</span>
                        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                  </CardHeader>
                </button>
                {open && (
                  <CardContent className="space-y-4 pt-0">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold mb-1 flex items-center gap-1"><Calendar className="h-3 w-3" />Arrival & age</p>
                        <ul className="text-xs space-y-0.5">
                          <li><span className="text-muted-foreground">Country of origin:</span> <strong>{r.countryOfOrigin ?? "—"}</strong></li>
                          <li><span className="text-muted-foreground">Arrival in UK:</span> <strong>{r.arrivalUk ?? "—"}</strong></li>
                          <li><span className="text-muted-foreground">Age at arrival:</span> <strong>{r.ageAtArrival ?? "—"}</strong></li>
                          <li><span className="text-muted-foreground">Recorded:</span> <strong>{r.recordedDate}</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-1 flex items-center gap-1"><Shield className="h-3 w-3" />Age assessment</p>
                        {r.ageAssessmentCompleted ? (
                          <>
                            <p className="text-xs"><span className="text-muted-foreground">Completed:</span> <strong>{r.ageAssessmentDate ?? "—"}</strong></p>
                            <p className="text-sm mt-1">{r.ageAssessmentOutcome ?? "—"}</p>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not applicable / not required.</p>
                        )}
                      </div>
                    </div>

                    {/* asylum claim */}
                    {r.asylumClaim && (
                      <div className="rounded-lg bg-rose-50 border border-rose-200 p-3">
                        <p className="text-xs font-semibold text-rose-800 mb-1 flex items-center gap-1"><FileText className="h-3 w-3" />Asylum claim</p>
                        <ul className="text-xs space-y-0.5 text-rose-900">
                          <li><span className="text-rose-700">Submitted:</span> <strong>{r.asylumClaim.submittedDate}</strong></li>
                          <li><span className="text-rose-700">First hearing:</span> <strong>{r.asylumClaim.firstHearingDate ?? "—"}</strong></li>
                        </ul>
                        <p className="text-xs font-semibold text-rose-800 mt-2">Reasons for claim</p>
                        <ul className="text-sm text-rose-900 list-disc list-inside space-y-0.5">
                          {r.asylumClaim.reasonsForClaim.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                    )}

                    {/* legal rep + Home Office references */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-3">
                        <p className="text-xs font-semibold text-indigo-800 mb-1">Legal representative</p>
                        {r.legalRepresentative ? (
                          <ul className="text-sm text-indigo-900 space-y-0.5">
                            <li><strong>{r.legalRepresentative.name}</strong> — {r.legalRepresentative.firm}</li>
                            <li className="text-xs">Specialism: {r.legalRepresentative.specialism}</li>
                            <li className="text-xs">LAA-funded: <strong>{r.legalRepresentative.LAA ? "Yes" : "No"}</strong></li>
                          </ul>
                        ) : <p className="text-sm text-indigo-900">Not engaged.</p>}
                      </div>
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                        <p className="text-xs font-semibold text-slate-800 mb-1">Home Office references</p>
                        {r.homeOfficeReferences.length > 0 ? (
                          <ul className="text-sm text-slate-900 space-y-0.5">
                            {r.homeOfficeReferences.map((h, i) => (
                              <li key={i} className="text-xs"><span className="text-slate-600">{h.type}:</span> <strong className="font-mono">{h.reference}</strong></li>
                            ))}
                          </ul>
                        ) : <p className="text-sm text-slate-900">No Home Office references — not applicable.</p>}
                      </div>
                    </div>

                    {/* documents */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                        <p className="text-xs font-semibold text-emerald-800 mb-1">Documents held</p>
                        {r.documentsHeld.length > 0 ? (
                          <ul className="text-sm text-emerald-900 list-disc list-inside space-y-0.5">
                            {r.documentsHeld.map((d, i) => <li key={i}>{d}</li>)}
                          </ul>
                        ) : <p className="text-sm text-emerald-900">None recorded.</p>}
                      </div>
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                        <p className="text-xs font-semibold text-amber-800 mb-1">Documents awaiting</p>
                        {r.documentsAwaiting.length > 0 ? (
                          <ul className="text-sm text-amber-900 list-disc list-inside space-y-0.5">
                            {r.documentsAwaiting.map((d, i) => <li key={i}>{d}</li>)}
                          </ul>
                        ) : <p className="text-sm text-amber-900">None outstanding.</p>}
                      </div>
                    </div>

                    {/* English / ESOL / family tracing */}
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold mb-1">English language</p>
                        <p className="text-xs"><span className="text-muted-foreground">CEFR level:</span> <strong>{r.englishLanguageLevel}</strong></p>
                        <p className="text-xs"><span className="text-muted-foreground">ESOL engaged:</span> <strong>{r.esolEngaged ? "Yes" : "No"}</strong></p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-1">Family tracing</p>
                        <p className="text-xs"><span className="text-muted-foreground">Active:</span> <strong>{r.familyTracingActive ? "Yes" : "No"}</strong></p>
                        {r.familyTracingService && <p className="text-xs mt-1">{r.familyTracingService}</p>}
                      </div>
                    </div>

                    {/* culture community + trauma support */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="rounded-lg bg-teal-50 border border-teal-200 p-3">
                        <p className="text-xs font-semibold text-teal-800 mb-1 flex items-center gap-1"><Heart className="h-3 w-3" />Culture & community links</p>
                        <ul className="text-sm text-teal-900 list-disc list-inside space-y-0.5">
                          {r.cultureCommunityLinks.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                      <div className="rounded-lg bg-purple-50 border border-purple-200 p-3">
                        <p className="text-xs font-semibold text-purple-800 mb-1 flex items-center gap-1"><Shield className="h-3 w-3" />Trauma-informed support</p>
                        <ul className="text-sm text-purple-900 list-disc list-inside space-y-0.5">
                          {r.traumaInformedSupport.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                    </div>

                    {/* NRPF */}
                    <div className="rounded-lg bg-orange-50 border border-orange-200 p-3">
                      <p className="text-xs font-semibold text-orange-800 mb-1">NRPF (No Recourse to Public Funds) considerations</p>
                      <ul className="text-sm text-orange-900 list-disc list-inside space-y-0.5">
                        {r.nrpfConsiderations.map((n, i) => <li key={i}>{n}</li>)}
                      </ul>
                      <p className="text-xs text-orange-700 mt-2">Pathway plan linked to immigration status: <strong>{r.pathwayPlanLinkedToImmigration ? "Yes" : "No"}</strong></p>
                    </div>

                    {/* child voice */}
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                      <p className="text-xs font-semibold text-amber-800 mb-1">Child's voice</p>
                      <p className="text-sm italic text-amber-900">&ldquo;{r.childVoice}&rdquo;</p>
                    </div>

                    {/* staff observation */}
                    <div>
                      <p className="text-xs font-semibold mb-1">Staff observation</p>
                      <p className="text-sm text-muted-foreground">{r.staffObservation}</p>
                    </div>

                    {/* meta */}
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>Key worker: <strong>{getStaffName(r.keyWorker)}</strong></span>
                      <span>Recorded: <strong>{r.recordedDate}</strong></span>
                      <span>Review: <strong>{r.reviewDate}</strong></span>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* regulatory note */}
        <div className="rounded-lg bg-muted/40 border p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold">Regulatory & practice framework</p>
          <p>Immigration Act 1971 and Nationality and Borders Act 2022 — primary statutes governing immigration status, asylum claims and removal. Children Act 1989 — local authority duties to UASC under s.20 (accommodation) and s.17 (children in need); LA holds full corporate parenting responsibility regardless of immigration status. Children (Leaving Care) Act 2000 — care leaver entitlements continue for eligible/relevant/former-relevant young people while immigration matters resolve. Modern Slavery Act 2015 — National Referral Mechanism (NRM) where trafficking is a reasonable suspicion. Statutory Guidance for Local Authorities on the care of unaccompanied asylum-seeking and trafficked children (DfE 2017). Hillingdon Judgment (R (Hillingdon LBC) v Secretary of State 2003) — confirms LA duty to provide s.20 accommodation to UASC. Merton-compliant principles (R (B) v Merton LBC 2003) and ADCS Age Assessment Guidance (AAR) — joint assessment by two qualified social workers, benefit of the doubt, interpreter, appropriate adult, no purely visual assessments. Working Together to Safeguard Children 2023. UNCRC Articles 7 (identity), 8 (preservation of identity), 22 (refugee children). External partners: British Red Cross International Family Tracing; Refugee Council Children's Section; Freedom from Torture; Helen Bamber Foundation; UK Visas and Immigration. Records retained securely; access controlled; data shared only on lawful basis with the child's interests paramount.</p>
        </div>
      </div>
    </PageShell>
  );
}
