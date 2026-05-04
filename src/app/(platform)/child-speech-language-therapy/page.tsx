"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  Mic,
  BookOpen,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SaltRecord {
  id: string;
  youngPerson: string;
  recordedDate: string;
  area:
    | "Articulation"
    | "Phonology"
    | "Receptive language"
    | "Expressive language"
    | "Pragmatic / social communication"
    | "Voice"
    | "Stammer / fluency"
    | "Selective mutism"
    | "AAC (alternative communication)"
    | "Literacy linked";
  status: "Awaiting referral" | "Assessed — no SaLT needed" | "Active" | "Maintenance / monitoring" | "Discharged";
  saltService: string;
  saltClinician?: string;
  startDate?: string;
  goals: { goal: string; baselineDate: string; targetDate?: string; status: "Achieved" | "On track" | "Slow progress" | "Not started" }[];
  strategiesUsed: string[];
  toolsResources: string[];
  homeProgrammeFrequency?: string;
  homeProgrammeWhoSupports: string[];
  schoolInvolvement: string[];
  hearingClearance: boolean;
  bilingualConsiderations?: string;
  childComfortDiscussingComm: 1 | 2 | 3 | 4 | 5;
  flagsConcerns: string[];
  childVoice: string;
  staffObservation: string;
  nextAppointment?: string;
  reviewDate: string;
  keyWorker: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const records: SaltRecord[] = [
  {
    id: "salt_001",
    youngPerson: "yp_casey",
    recordedDate: d(-30),
    area: "Pragmatic / social communication",
    status: "Active",
    saltService: "Community Children's Speech & Language Therapy (NHS)",
    saltClinician: "Naomi Thackeray (HCPC reg)",
    startDate: d(-180),
    goals: [
      { goal: "Increase use of repair strategies (e.g., 'I didn't get that, can you say again?')", baselineDate: d(-180), targetDate: d(60), status: "On track" },
      { goal: "Recognise and respond to non-literal language (idioms, sarcasm) in age-appropriate contexts", baselineDate: d(-180), targetDate: d(120), status: "Slow progress" },
      { goal: "Use 5-stage 'social problem-solving' visual sequence for peer disagreement", baselineDate: d(-150), targetDate: d(30), status: "Achieved" },
      { goal: "Lengthen turn-taking in conversation from 3 turns to 6+ turns", baselineDate: d(-90), targetDate: d(90), status: "On track" },
    ],
    strategiesUsed: [
      "Visual schedule for conversation turns",
      "Comic strip conversations (Carol Gray)",
      "Social Stories (Carol Gray) for predictable difficult situations",
      "Modelling of repair phrases by Anna",
      "Video-self-modelling using consented short clips",
    ],
    toolsResources: [
      "Naomi's bespoke 'How to ask for help' booklet",
      "Visual prompt cards stored in Casey's bedroom drawer",
      "Conversation cube (sensory-friendly)",
      "Time Timer for turn-taking practice",
    ],
    homeProgrammeFrequency: "10-15 minutes, 3x weekly",
    homeProgrammeWhoSupports: [
      "Anna (primary)",
      "Edward (alternate weeks)",
      "Casey self-leads when motivated",
    ],
    schoolInvolvement: [
      "School SENCO has copy of Naomi's care plan",
      "TA does 1x weekly 5-min booster session at lunch",
      "Class teacher uses repair phrase modelling consistently",
      "Casey has visual prompt card in pencil case",
    ],
    hearingClearance: true,
    bilingualConsiderations: "English mother tongue. Some BSL signs picked up via Ellie's cousin Mia — positively integrated.",
    childComfortDiscussingComm: 4,
    flagsConcerns: [
      "Watch for masking — Casey can present as more communicatively confident at school than at home",
    ],
    childVoice:
      "I don't always know when people are joking. The card helps. I asked Anna to slow down twice this week and she did — that worked. I like Naomi because she doesn't talk down to me.",
    staffObservation:
      "Steady, child-led progress. Naomi's pragmatic communication focus aligns well with Casey's autistic profile (see autism-support-plan). Repair strategies used spontaneously 4 times this week — a real shift. Continuing weekly home practice with Anna.",
    nextAppointment: d(14),
    reviewDate: d(60),
    keyWorker: "staff_anna",
  },
  {
    id: "salt_002",
    youngPerson: "yp_alex",
    recordedDate: d(-60),
    area: "Voice",
    status: "Maintenance / monitoring",
    saltService: "CAMHS gender-aware SaLT (private referral via local authority leaving care fund)",
    saltClinician: "Rebecca Wallis (HCPC, gender-aware specialism)",
    startDate: d(-240),
    goals: [
      { goal: "Voice care during puberty — vocal hygiene", baselineDate: d(-240), targetDate: d(120), status: "Achieved" },
      { goal: "If Alex chooses, voice-coaching introduction (no pressure, child-led timing)", baselineDate: d(-240), status: "Not started" },
    ],
    strategiesUsed: [
      "Vocal hygiene basics (hydration, no shouting, no whispering)",
      "Information-only sessions about voice options for non-binary young people",
    ],
    toolsResources: [
      "Rebecca's age-appropriate explainer pack on voice + identity",
    ],
    homeProgrammeFrequency: "Self-led — Alex chooses pace",
    homeProgrammeWhoSupports: ["Anna available if Alex wants to talk"],
    schoolInvolvement: [],
    hearingClearance: true,
    bilingualConsiderations: "English only.",
    childComfortDiscussingComm: 5,
    flagsConcerns: [],
    childVoice:
      "I'm not into voice coaching right now. Maybe later, maybe not. I like that Rebecca told me my voice is mine and that's enough. Just nice to know the option exists.",
    staffObservation:
      "Watchful waiting model. Alex empowered with information, no expectation. Rebecca's affirming approach has been valuable. Maintenance review only — Alex will indicate if more is wanted.",
    nextAppointment: d(180),
    reviewDate: d(180),
    keyWorker: "staff_anna",
  },
];

const exportCols: ExportColumn<SaltRecord>[] = [
  { header: "Young Person", accessor: (r: SaltRecord) => getYPName(r.youngPerson) },
  { header: "Recorded", accessor: (r: SaltRecord) => r.recordedDate },
  { header: "Area", accessor: (r: SaltRecord) => r.area },
  { header: "Status", accessor: (r: SaltRecord) => r.status },
  { header: "Service", accessor: (r: SaltRecord) => r.saltService },
  { header: "Clinician", accessor: (r: SaltRecord) => r.saltClinician ?? "—" },
  { header: "Started", accessor: (r: SaltRecord) => r.startDate ?? "—" },
  { header: "Goals achieved", accessor: (r: SaltRecord) => `${r.goals.filter((g) => g.status === "Achieved").length}/${r.goals.length}` },
  { header: "Hearing cleared", accessor: (r: SaltRecord) => (r.hearingClearance ? "Yes" : "No") },
  { header: "Home Frequency", accessor: (r: SaltRecord) => r.homeProgrammeFrequency ?? "—" },
  { header: "Bilingual notes", accessor: (r: SaltRecord) => r.bilingualConsiderations ?? "—" },
  { header: "Child comfort 1-5", accessor: (r: SaltRecord) => `${r.childComfortDiscussingComm}` },
  { header: "Child Voice", accessor: (r: SaltRecord) => r.childVoice },
  { header: "Next appt", accessor: (r: SaltRecord) => r.nextAppointment ?? "—" },
  { header: "Review", accessor: (r: SaltRecord) => r.reviewDate },
  { header: "Key Worker", accessor: (r: SaltRecord) => getStaffName(r.keyWorker) },
];

const statusColour: Record<SaltRecord["status"], string> = {
  "Awaiting referral": "bg-amber-100 text-amber-800 border-amber-200",
  "Assessed — no SaLT needed": "bg-slate-100 text-slate-800 border-slate-200",
  Active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Maintenance / monitoring": "bg-blue-100 text-blue-800 border-blue-200",
  Discharged: "bg-slate-100 text-slate-800 border-slate-200",
};

const goalStatusColour: Record<SaltRecord["goals"][number]["status"], string> = {
  Achieved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "On track": "bg-blue-100 text-blue-800 border-blue-200",
  "Slow progress": "bg-amber-100 text-amber-800 border-amber-200",
  "Not started": "bg-slate-100 text-slate-800 border-slate-200",
};

export default function ChildSpeechLanguageTherapyPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "status" | "review">("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = records.filter((rec) => {
      const matchesSearch =
        !search ||
        getYPName(rec.youngPerson).toLowerCase().includes(search.toLowerCase()) ||
        rec.area.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || rec.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    r = [...r].sort((a, b) => {
      if (sortBy === "name") return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
      if (sortBy === "status") return a.status.localeCompare(b.status);
      if (sortBy === "review") return a.reviewDate.localeCompare(b.reviewDate);
      return b.recordedDate.localeCompare(a.recordedDate);
    });
    return r;
  }, [search, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const active = records.filter((r) => r.status === "Active").length;
    const goalsAchieved = records.reduce((acc, r) => acc + r.goals.filter((g) => g.status === "Achieved").length, 0);
    const homeProgrammeRunning = records.filter((r) => r.homeProgrammeFrequency).length;
    const reviewsDue = records.filter((r) => r.reviewDate <= d(60)).length;
    return { active, goalsAchieved, homeProgrammeRunning, reviewsDue };
  }, []);

  return (
    <PageShell
      title="Speech & Language Therapy"
      subtitle="Per-child SaLT plans — articulation, language, social communication, voice, fluency, AAC. Goals, strategies, home programme, school involvement, child voice. RCSLT-aligned, child-paced."
      actions={
        <div className="flex gap-2">
          <ExportButton data={filtered} columns={exportCols} filename="child-speech-language-therapy" />
          <PrintButton title="Speech & Language Therapy" />
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <MessageCircle className="h-4 w-4" />
            <span>Active plans</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.active}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <CheckCircle className="h-4 w-4" />
            <span>Goals achieved</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.goalsAchieved}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <BookOpen className="h-4 w-4" />
            <span>Home programmes</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.homeProgrammeRunning}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Reviews due (60d)</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.reviewsDue}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search young person or area..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Awaiting referral">Awaiting referral</SelectItem>
            <SelectItem value="Maintenance / monitoring">Maintenance / monitoring</SelectItem>
            <SelectItem value="Assessed — no SaLT needed">No SaLT needed</SelectItem>
            <SelectItem value="Discharged">Discharged</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-full sm:w-48">
            <ArrowUpDown className="h-4 w-4 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Most recent</SelectItem>
            <SelectItem value="name">Young person A→Z</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="review">Review date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => {
          const isOpen = expandedId === r.id;
          return (
            <div key={r.id} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
              <button
                onClick={() => setExpandedId(isOpen ? null : r.id)}
                className="w-full p-4 flex items-start justify-between gap-3 hover:bg-slate-50 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-slate-900">{getYPName(r.youngPerson)}</span>
                    <span className="text-slate-700">{r.area}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border", statusColour[r.status])}>
                      {r.status}
                    </span>
                    {r.saltClinician ? (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-200">
                        <Mic className="h-3 w-3 inline mr-1" />{r.saltClinician}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-sm text-slate-600">
                    Recorded {r.recordedDate} · Review {r.reviewDate} · {getStaffName(r.keyWorker)}
                  </div>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
              </button>
              {isOpen ? (
                <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50/50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Child Voice</div>
                      <p className="text-sm text-slate-700 italic">&ldquo;{r.childVoice}&rdquo;</p>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Staff Observation</div>
                      <p className="text-sm text-slate-700">{r.staffObservation}</p>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Goals</div>
                      <div className="space-y-2">
                        {r.goals.map((g, i) => (
                          <div key={i} className="flex items-start justify-between gap-3 text-sm">
                            <div className="flex-1">
                              <div className="text-slate-800">{g.goal}</div>
                              <div className="text-xs text-slate-500">Baseline {g.baselineDate}{g.targetDate ? ` · target ${g.targetDate}` : ""}</div>
                            </div>
                            <span className={cn("text-xs px-2 py-0.5 rounded-full border shrink-0", goalStatusColour[g.status])}>
                              {g.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Strategies used</div>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {r.strategiesUsed.map((s, i) => (
                          <li key={i} className="flex gap-2"><span className="text-slate-400">·</span><span>{s}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Tools & resources</div>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {r.toolsResources.map((s, i) => (
                          <li key={i} className="flex gap-2"><span className="text-slate-400">·</span><span>{s}</span></li>
                        ))}
                      </ul>
                    </div>
                    {r.homeProgrammeFrequency ? (
                      <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                        <div className="text-xs font-semibold text-emerald-700 uppercase mb-2">Home programme</div>
                        <div className="text-sm text-emerald-900 space-y-1">
                          <div><span className="text-emerald-700">Frequency:</span> {r.homeProgrammeFrequency}</div>
                          <div><span className="text-emerald-700">Supported by:</span></div>
                          <ul className="space-y-0.5 ml-1">
                            {r.homeProgrammeWhoSupports.map((s, i) => (
                              <li key={i} className="flex gap-2"><span>·</span><span>{s}</span></li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : null}
                    {r.schoolInvolvement.length ? (
                      <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                        <div className="text-xs font-semibold text-blue-800 uppercase mb-2">School involvement</div>
                        <ul className="text-sm text-blue-900 space-y-1">
                          {r.schoolInvolvement.map((s, i) => (
                            <li key={i} className="flex gap-2"><span>·</span><span>{s}</span></li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Context</div>
                      <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                        <div><span className="text-slate-500">Hearing cleared:</span> {r.hearingClearance ? "Yes" : "No"}</div>
                        <div><span className="text-slate-500">Child comfort 1-5:</span> {r.childComfortDiscussingComm}</div>
                        {r.bilingualConsiderations ? (
                          <div className="col-span-2"><span className="text-slate-500">Bilingual:</span> {r.bilingualConsiderations}</div>
                        ) : null}
                        {r.nextAppointment ? (
                          <div><span className="text-slate-500">Next appt:</span> {r.nextAppointment}</div>
                        ) : null}
                      </div>
                    </div>
                    {r.flagsConcerns.length ? (
                      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 lg:col-span-2">
                        <div className="text-xs font-semibold text-amber-800 uppercase mb-2">Flags / concerns</div>
                        <ul className="text-sm text-amber-900 space-y-1">
                          {r.flagsConcerns.map((f, i) => (
                            <li key={i} className="flex gap-2"><span>!</span><span>{f}</span></li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
        <div className="font-semibold mb-1">Regulatory framework</div>
        <p>
          Practice is grounded in Royal College of Speech & Language Therapists (RCSLT) guidance, NHS Children&rsquo;s
          SaLT pathway, the SEND Code of Practice 2015, Children&rsquo;s Homes Regulations Quality Standards 5
          (Education) and 8 (Health), and UNCRC Articles 12 (voice) and 13 (expression). Communication is a right.
          Hearing is screened before SaLT diagnosis. Bilingual considerations are factored in. Voice work is
          identity-respectful and child-paced.
        </p>
      </div>
    </PageShell>
  );
}
