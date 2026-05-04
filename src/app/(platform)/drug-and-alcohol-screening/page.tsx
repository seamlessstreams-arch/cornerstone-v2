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
  Search, Filter, ArrowUpDown, ChevronDown, ChevronUp,
  AlertTriangle, ShieldAlert, HeartHandshake, Calendar, Activity,
  Lock, BookOpen, Sparkles, Lightbulb, Eye, Users, ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStaffName, getYPName } from "@/lib/seed-data";

/* ── types ─────────────────────────────────────────────────────────────────── */

type ScreeningTool = "CRAFFT" | "Internal Brief Screen" | "Conversation-based" | "AUDIT-C (older)";
type RiskLevel =
  | "No identified risk"
  | "Awareness only"
  | "Low risk"
  | "Medium risk"
  | "High risk"
  | "Active concern";

interface SubstanceScreening {
  id: string;
  youngPerson: string;
  screeningDate: string;
  conductedBy: string;
  screeningTool: ScreeningTool;
  riskLevel: RiskLevel;
  substancesIdentified: string[];
  contextOfUse: string;
  peerInfluences: string;
  familyHistory: string;
  educationProvided: string[];
  harmReductionApproach: string[];
  professionalSupportInPlace: string[];
  childInsight: string;
  childMotivation: string;
  warningSignsToWatch: string[];
  reviewSchedule: string;
  escalationCriteria: string[];
  nextScreeningDate: string;
  confidentialityFraming: string;
  sharedWithSocialWorker: boolean;
  sharedWithCAMHS: boolean;
  childAuthored: boolean;
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const RISK_CLR: Record<RiskLevel, string> = {
  "No identified risk": "bg-green-100 text-green-800",
  "Awareness only": "bg-emerald-100 text-emerald-800",
  "Low risk": "bg-yellow-100 text-yellow-800",
  "Medium risk": "bg-amber-100 text-amber-800",
  "High risk": "bg-orange-100 text-orange-800",
  "Active concern": "bg-red-100 text-red-800",
};
const RISK_BORDER: Record<RiskLevel, string> = {
  "No identified risk": "border-l-green-400",
  "Awareness only": "border-l-emerald-400",
  "Low risk": "border-l-yellow-400",
  "Medium risk": "border-l-amber-500",
  "High risk": "border-l-orange-500",
  "Active concern": "border-l-red-600",
};

const RISK_ORDER: RiskLevel[] = [
  "Active concern",
  "High risk",
  "Medium risk",
  "Low risk",
  "Awareness only",
  "No identified risk",
];

/* ── seed data ─────────────────────────────────────────────────────────────── */

const SEED: SubstanceScreening[] = [
  {
    id: "das_1",
    youngPerson: "yp_alex",
    screeningDate: d(-21),
    conductedBy: "staff_darren",
    screeningTool: "CRAFFT",
    riskLevel: "Low risk",
    substancesIdentified: [],
    contextOfUse:
      "No identified substance use. Alex (13) reports curiosity after seeing older peers at school vaping. Conversation prompted by Alex asking what 'getting high' feels like during a key work session. No exposure or experimentation reported. Awareness work proactive, not reactive.",
    peerInfluences:
      "Two older boys at school (Year 11) vape openly outside the gates. Alex describes them as 'cool' but has not been offered anything. Football peer group is protective — none use substances and the coach is firm on this. No older associates outside school have been linked to substance use.",
    familyHistory:
      "Birth mother has a history of alcohol misuse (currently in recovery, 18 months sober). Alex is aware of this in age-appropriate terms. Birth father — no known substance issues. Alex has expressed worry about 'ending up like mum' which has been gently explored.",
    educationProvided: [
      "Age-appropriate conversation about why people use substances and what they actually do to a developing brain",
      "FRANK website explored together — Alex chose what topics to read",
      "Discussion of vaping risks (nicotine addiction, lung development) using NHS resources",
      "Talked about the difference between curiosity and pressure — both are normal",
      "Reassurance that asking questions is welcome and won't trigger consequences",
    ],
    harmReductionApproach: [
      "Open-door policy: Alex can talk to any staff member without judgement, at any time",
      "No moralising or scare tactics — facts presented honestly",
      "Acknowledged that experimentation can happen and explained how to stay safe if it ever did (never alone, tell someone, know what you're taking)",
      "Reinforced that disclosure will not result in punishment",
    ],
    professionalSupportInPlace: [
      "Key worker (Darren) — fortnightly 1:1 sessions",
      "School pastoral lead aware and providing reinforcement",
      "GP aware of family history (recorded for context only)",
    ],
    childInsight:
      "Alex shows good awareness — can articulate why young brains are more vulnerable, understands the link between his mum's experience and his own potential risk. Says 'I just want to know stuff so I can make my own choice.' This maturity is a real strength.",
    childMotivation:
      "Strongly motivated by football and his goal to play at academy level. Identifies fitness, focus, and 'not letting the team down' as reasons he wouldn't want to use substances. Also motivated by not wanting to worry his birth mother in her recovery.",
    warningSignsToWatch: [
      "Withdrawal from football or fitness routines",
      "New unexplained money or possessions",
      "Changes in friendship group toward older or unknown peers",
      "Mood changes, particularly low mood or unusual irritability",
      "Loss of appetite or sleep changes outside known patterns",
    ],
    reviewSchedule:
      "Brief check-in at every fortnightly key work session. Full re-screen at 6 months unless concerns arise. Conversation kept light and embedded — not framed as a 'screening' to Alex.",
    escalationCriteria: [
      "Any disclosure or evidence of substance use, however minor",
      "Smell of substances on clothing or in room",
      "Items found (vape, lighter, rolling papers, unknown medication)",
      "Behavioural shifts matching warning signs",
      "Disclosure from peers or school",
    ],
    nextScreeningDate: d(160),
    confidentialityFraming:
      "Explained to Alex that conversations are private between him and key worker, but that we share with social worker if there's a safety concern. Alex understood and agreed. Framed as 'we look after you, not police you.'",
    sharedWithSocialWorker: true,
    sharedWithCAMHS: false,
    childAuthored: false,
  },
  {
    id: "das_2",
    youngPerson: "yp_jordan",
    screeningDate: d(-14),
    conductedBy: "staff_anna",
    screeningTool: "Conversation-based",
    riskLevel: "Low risk",
    substancesIdentified: [],
    contextOfUse:
      "No identified personal use. Jordan (13) lives in an area where cannabis use is visible — older teens smoke at the local park and shopfronts. Has reported smelling it 'all the time.' One older boy on the estate offered Jordan 'a try' approximately 3 weeks ago. Jordan declined and disclosed this voluntarily to Anna the next day.",
    peerInfluences:
      "The community context is the primary risk factor. Jordan's school peer group is mixed — some friends have older siblings who use cannabis. Jordan's closest friend at the home (resident peer) is a protective influence. No identified peer using substances directly with Jordan.",
    familyHistory:
      "Birth father — known historical cannabis and alcohol use, currently unknown status. Birth mother — no known substance issues. Older sibling (separately placed) had substance-related incidents at age 16. Family history discussed openly with Jordan in an age-appropriate way.",
    educationProvided: [
      "Cannabis facts session — what it is, how it affects developing brains, why under-18 use is higher risk",
      "Discussion of how to refuse offers without losing face — practised phrases together",
      "Talked about why people offer substances (sometimes belonging, sometimes selling, sometimes both)",
      "Used Talk to FRANK and Mind cannabis resources",
      "Acknowledged Jordan made an excellent decision in declining and disclosing",
    ],
    harmReductionApproach: [
      "Strong praise for the disclosure — reinforced trust",
      "Honest about what cannabis does (good and bad) so Jordan trusts the information",
      "Discussed safety strategies for the local area — who to walk with, places to avoid after dark",
      "Reassured Jordan that being offered does not mean he did anything wrong",
      "Made clear that future disclosures, including any experimentation, will be met with support not punishment",
    ],
    professionalSupportInPlace: [
      "Key worker (Anna) — weekly check-in for 4 weeks, then fortnightly",
      "Social worker informed of community context and protective response",
      "Local Young People's Drug & Alcohol Service contact details on file (not yet engaged — would only refer if concerns escalate)",
    ],
    childInsight:
      "Jordan articulated clearly: 'I don't want to mess my head up, and I saw what it did to my brother.' Has insight into family pattern. Worried about looking 'soft' when refusing but practised responses helped. Recognises the local area is a risk and is willing to talk about it.",
    childMotivation:
      "Wants to do well in school — has a strong interest in coding and wants to study computer science. Sees substances as a threat to focus. Also motivated by not following his older brother's path and protecting his relationship with the home.",
    warningSignsToWatch: [
      "New friendships with older teens from the estate",
      "Unexplained absences or coming home late",
      "Smell of cannabis on clothes, hair, or in bedroom",
      "Red eyes, lethargy, or unexplained appetite changes",
      "Money missing or unexplained cash",
      "Reduced engagement with school or coding activities",
    ],
    reviewSchedule:
      "Weekly check-in for 4 weeks following the disclosure, then fortnightly within key work. Full re-screen at 3 months given community context, then 6-monthly if stable.",
    escalationCriteria: [
      "Any further offers or attempts to involve Jordan",
      "Any evidence of use",
      "Identification of who offered — to inform community safeguarding response",
      "Disengagement from protective activities (school, peer group at home)",
      "Mental health changes",
    ],
    nextScreeningDate: d(76),
    confidentialityFraming:
      "Anna explained that anything Jordan shares stays between us unless safety is at risk. Specifically discussed that telling us about being offered was the right call and would not get him in trouble. Jordan agreed information could be shared with social worker as supportive context.",
    sharedWithSocialWorker: true,
    sharedWithCAMHS: false,
    childAuthored: true,
  },
  {
    id: "das_3",
    youngPerson: "yp_casey",
    screeningDate: d(-7),
    conductedBy: "staff_ryan",
    screeningTool: "Internal Brief Screen",
    riskLevel: "No identified risk",
    substancesIdentified: [],
    contextOfUse:
      "No identified substance use, exposure, or curiosity. Screening completed for completeness as part of routine health and wellbeing review. Casey reports no exposure to substances at school, home, or in the community. Conversation handled briefly and respectfully — Casey was reassured that this is asked of every young person, not because of any specific concern.",
    peerInfluences:
      "Peer group is age-appropriate and protective. School friends are engaged with school clubs and sport. No older associates of concern. Resident peer group at the home is supportive. Casey describes feeling safe in their friendships.",
    familyHistory:
      "No known substance use in immediate birth family. Casey has been informed in age-appropriate terms that this is a question we ask everyone for context, and that no concern is implied. Family record confirms no relevant history.",
    educationProvided: [
      "Light-touch awareness conversation — what to do if ever offered something",
      "Confirmed Casey knows who to talk to (key worker, any staff, school nurse)",
      "Brief mention of Talk to FRANK as a resource if curious",
      "No detailed substance education delivered — would not be developmentally appropriate without identified need",
    ],
    harmReductionApproach: [
      "Affirmed Casey's strong existing protective factors",
      "Made clear the door is always open if anything ever comes up",
      "No alarmist messaging — kept tone neutral and routine",
    ],
    professionalSupportInPlace: [
      "Key worker (Ryan) — weekly key work session covers wellbeing holistically",
      "School pastoral lead — strong relationship",
      "Routine GP and school nurse contact",
    ],
    childInsight:
      "Casey is clear about not having any interest or curiosity at this stage. Was a little puzzled at being asked at first but understood once it was framed as routine. Felt comfortable saying 'no' clearly without elaboration, which is healthy.",
    childMotivation:
      "Strong identity around school, drama club, and friendships. Talks about wanting to 'just be a kid' — this is taken as healthy. No specific anti-substance motivation needed at this stage; baseline wellbeing is strong.",
    warningSignsToWatch: [
      "Significant changes in friendship group",
      "Withdrawal from drama club or other valued activities",
      "Mood changes outside known baseline",
      "New unexplained items or money",
      "Late returns or unexplained absences",
    ],
    reviewSchedule:
      "Embedded in weekly key work — no formal screening unless triggered. Full re-screen at 12 months as part of annual health review.",
    escalationCriteria: [
      "Any disclosure, exposure, or offer",
      "Any change in friendship group toward higher-risk peers",
      "Any items found",
      "Any safeguarding referral mentioning substance context",
    ],
    nextScreeningDate: d(358),
    confidentialityFraming:
      "Ryan briefly explained that we ask every young person about this as part of looking after them, that what they share stays with us unless safety is at risk, and that the conversation does not change how Casey is seen. Casey accepted this calmly.",
    sharedWithSocialWorker: true,
    sharedWithCAMHS: false,
    childAuthored: false,
  },
];

/* ── page ──────────────────────────────────────────────────────────────────── */

export default function DrugAndAlcoholScreeningPage() {
  const [data] = useState(SEED);
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterChild, setFilterChild] = useState("all");
  const [filterTool, setFilterTool] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  /* ── derived ─────────────────────────────────────────────────────────────── */

  const filtered = useMemo(() => {
    let rows = data.filter((r) => {
      if (filterRisk !== "all" && r.riskLevel !== filterRisk) return false;
      if (filterChild !== "all" && r.youngPerson !== filterChild) return false;
      if (filterTool !== "all" && r.screeningTool !== filterTool) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          getYPName(r.youngPerson).toLowerCase().includes(q) ||
          r.contextOfUse.toLowerCase().includes(q) ||
          r.peerInfluences.toLowerCase().includes(q) ||
          r.screeningTool.toLowerCase().includes(q)
        );
      }
      return true;
    });
    rows = [...rows].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return b.screeningDate.localeCompare(a.screeningDate);
        case "date-asc":
          return a.screeningDate.localeCompare(b.screeningDate);
        case "risk":
          return RISK_ORDER.indexOf(a.riskLevel) - RISK_ORDER.indexOf(b.riskLevel);
        case "review":
          return a.nextScreeningDate.localeCompare(b.nextScreeningDate);
        default:
          return 0;
      }
    });
    return rows;
  }, [data, search, filterRisk, filterChild, filterTool, sortBy]);

  /* ── stats ───────────────────────────────────────────────────────────────── */

  const today = new Date();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(today.getDate() - 90);
  const thirtyDaysAhead = new Date();
  thirtyDaysAhead.setDate(today.getDate() + 30);

  const activeScreenings = data.length;
  const atRisk = data.filter((r) =>
    ["Low risk", "Medium risk", "High risk", "Active concern"].includes(r.riskLevel),
  ).length;
  const screenedLast90 = data.filter((r) => new Date(r.screeningDate) >= ninetyDaysAgo).length;
  const reviewsDue30 = data.filter((r) => {
    const next = new Date(r.nextScreeningDate);
    return next >= today && next <= thirtyDaysAhead;
  }).length;

  /* ── export ──────────────────────────────────────────────────────────────── */

  const exportCols: ExportColumn<SubstanceScreening>[] = [
    { header: "Date", accessor: (r: SubstanceScreening) => r.screeningDate },
    { header: "Child", accessor: (r: SubstanceScreening) => getYPName(r.youngPerson) },
    { header: "Screening Tool", accessor: (r: SubstanceScreening) => r.screeningTool },
    { header: "Risk Level", accessor: (r: SubstanceScreening) => r.riskLevel },
    {
      header: "Substances Identified",
      accessor: (r: SubstanceScreening) =>
        r.substancesIdentified.length ? r.substancesIdentified.join(", ") : "None",
    },
    { header: "Context", accessor: (r: SubstanceScreening) => r.contextOfUse },
    { header: "Peer Influences", accessor: (r: SubstanceScreening) => r.peerInfluences },
    { header: "Family History", accessor: (r: SubstanceScreening) => r.familyHistory },
    {
      header: "Education Provided",
      accessor: (r: SubstanceScreening) => r.educationProvided.join("; "),
    },
    {
      header: "Harm Reduction",
      accessor: (r: SubstanceScreening) => r.harmReductionApproach.join("; "),
    },
    {
      header: "Professional Support",
      accessor: (r: SubstanceScreening) => r.professionalSupportInPlace.join("; "),
    },
    { header: "Child Insight", accessor: (r: SubstanceScreening) => r.childInsight },
    { header: "Child Motivation", accessor: (r: SubstanceScreening) => r.childMotivation },
    {
      header: "Warning Signs",
      accessor: (r: SubstanceScreening) => r.warningSignsToWatch.join("; "),
    },
    { header: "Review Schedule", accessor: (r: SubstanceScreening) => r.reviewSchedule },
    {
      header: "Escalation Criteria",
      accessor: (r: SubstanceScreening) => r.escalationCriteria.join("; "),
    },
    { header: "Next Screening", accessor: (r: SubstanceScreening) => r.nextScreeningDate },
    {
      header: "Confidentiality Framing",
      accessor: (r: SubstanceScreening) => r.confidentialityFraming,
    },
    {
      header: "Shared with SW",
      accessor: (r: SubstanceScreening) => (r.sharedWithSocialWorker ? "Yes" : "No"),
    },
    {
      header: "Shared with CAMHS",
      accessor: (r: SubstanceScreening) => (r.sharedWithCAMHS ? "Yes" : "No"),
    },
    {
      header: "Child Authored",
      accessor: (r: SubstanceScreening) => (r.childAuthored ? "Yes" : "No"),
    },
    { header: "Conducted By", accessor: (r: SubstanceScreening) => getStaffName(r.conductedBy) },
  ];

  /* ── render ──────────────────────────────────────────────────────────────── */

  return (
    <PageShell
      title="Drug and Alcohol Screening"
      subtitle="Substance use risk screening · Early identification · Harm reduction · Quality Standard 5 · Working Together 2023"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Drug and Alcohol Screening" />
          <ExportButton
            data={filtered}
            columns={exportCols}
            filename="drug-and-alcohol-screening"
          />
        </div>
      }
    >
      <div id="print-area">
        {/* ── stat strip ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Active Screenings",
              value: activeScreenings,
              icon: ClipboardList,
              clr: "text-blue-600",
            },
            {
              label: "At-risk Children",
              value: atRisk,
              icon: AlertTriangle,
              clr: "text-amber-600",
            },
            {
              label: "Screened Last 90 Days",
              value: screenedLast90,
              icon: Activity,
              clr: "text-emerald-600",
            },
            {
              label: "Reviews Due 30d",
              value: reviewsDue30,
              icon: Calendar,
              clr: "text-purple-600",
            },
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

        {/* ── sensitive content notice ────────────────────────────────────── */}
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <HeartHandshake className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <p className="font-semibold text-rose-900">Sensitive content — handled with care</p>
            <p className="text-rose-800">
              These records discuss substance use in the context of children we look after. The
              approach is non-judgemental, harm-reduction led, and trauma-informed. We do not use
              shaming language. Conversations with children are voluntary, age-appropriate, and
              framed around safety, not surveillance. Information is shared only on a need-to-know
              basis with the social worker and, where clinically relevant, CAMHS. Children are told
              up front what will and will not be shared, and disclosure is never met with
              punishment.
            </p>
          </div>
        </div>

        {/* ── filters ──────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search child, context, peer influences…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterRisk} onValueChange={setFilterRisk}>
            <SelectTrigger className="w-[170px]">
              <Filter className="h-4 w-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              {(Object.keys(RISK_CLR) as RiskLevel[]).map((k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterChild} onValueChange={setFilterChild}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Children</SelectItem>
              <SelectItem value="yp_alex">Alex</SelectItem>
              <SelectItem value="yp_jordan">Jordan</SelectItem>
              <SelectItem value="yp_casey">Casey</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterTool} onValueChange={setFilterTool}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tools</SelectItem>
              <SelectItem value="CRAFFT">CRAFFT</SelectItem>
              <SelectItem value="Internal Brief Screen">Internal Brief Screen</SelectItem>
              <SelectItem value="Conversation-based">Conversation-based</SelectItem>
              <SelectItem value="AUDIT-C (older)">AUDIT-C (older)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[170px]">
              <ArrowUpDown className="h-4 w-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="risk">By Risk Level</SelectItem>
              <SelectItem value="review">By Next Review</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ── screening records ────────────────────────────────────────────── */}
        <div className="space-y-4">
          {filtered.map((r) => {
            const open = expandedId === r.id;
            return (
              <Card key={r.id} className={cn("border-l-4", RISK_BORDER[r.riskLevel])}>
                <CardHeader className="pb-2 cursor-pointer" onClick={() => toggle(r.id)}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                        {getYPName(r.youngPerson)}
                        <Badge variant="outline" className={RISK_CLR[r.riskLevel]}>
                          {r.riskLevel}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-100 text-slate-800">
                          {r.screeningTool}
                        </Badge>
                        {r.childAuthored && (
                          <Badge variant="outline" className="bg-violet-100 text-violet-800">
                            Child contributed
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Screened: {r.screeningDate} · Conducted by: {getStaffName(r.conductedBy)} ·
                        Next review: {r.nextScreeningDate}
                      </p>
                    </div>
                    {open ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                {open && (
                  <CardContent className="pt-0 space-y-4 text-sm">
                    {/* substances identified */}
                    <div>
                      <p className="font-medium mb-1">Substances Identified</p>
                      {r.substancesIdentified.length ? (
                        <div className="flex flex-wrap gap-1">
                          {r.substancesIdentified.map((s, i) => (
                            <Badge key={i} variant="outline" className="bg-amber-50 text-amber-800">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          No substances identified at this screening.
                        </p>
                      )}
                    </div>

                    {/* context */}
                    <div>
                      <p className="font-medium mb-1">Context</p>
                      <p className="text-muted-foreground text-xs">{r.contextOfUse}</p>
                    </div>

                    {/* peer & family */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="font-medium text-amber-800 mb-1 flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> Peer Influences
                        </p>
                        <p className="text-amber-700 text-xs">{r.peerInfluences}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="font-medium text-blue-800 mb-1 flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> Family History
                        </p>
                        <p className="text-blue-700 text-xs">{r.familyHistory}</p>
                      </div>
                    </div>

                    {/* education & harm reduction */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-emerald-50 rounded-lg p-3">
                        <p className="font-medium text-emerald-800 mb-2 flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" /> Education Provided
                        </p>
                        <ul className="space-y-1">
                          {r.educationProvided.map((e, i) => (
                            <li
                              key={i}
                              className="text-xs text-emerald-700 flex items-start gap-1"
                            >
                              <span className="shrink-0 mt-0.5">•</span> {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-teal-50 rounded-lg p-3">
                        <p className="font-medium text-teal-800 mb-2 flex items-center gap-1">
                          <HeartHandshake className="h-3.5 w-3.5" /> Harm Reduction Approach
                        </p>
                        <ul className="space-y-1">
                          {r.harmReductionApproach.map((h, i) => (
                            <li key={i} className="text-xs text-teal-700 flex items-start gap-1">
                              <span className="shrink-0 mt-0.5">•</span> {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* professional support */}
                    <div>
                      <p className="font-medium mb-2">Professional Support in Place</p>
                      <div className="flex flex-wrap gap-1">
                        {r.professionalSupportInPlace.map((p, i) => (
                          <Badge key={i} variant="outline" className="bg-muted/40 text-xs">
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* child voice */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-violet-50 rounded-lg p-3">
                        <p className="font-medium text-violet-800 mb-1 flex items-center gap-1">
                          <Lightbulb className="h-3.5 w-3.5" /> Child&apos;s Insight
                        </p>
                        <p className="text-violet-700 text-xs">{r.childInsight}</p>
                      </div>
                      <div className="bg-fuchsia-50 rounded-lg p-3">
                        <p className="font-medium text-fuchsia-800 mb-1 flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5" /> Child&apos;s Motivation
                        </p>
                        <p className="text-fuchsia-700 text-xs">{r.childMotivation}</p>
                      </div>
                    </div>

                    {/* warning signs */}
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <p className="font-medium text-yellow-800 mb-2 flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" /> Warning Signs to Watch
                      </p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {r.warningSignsToWatch.map((w, i) => (
                          <li key={i} className="text-xs text-yellow-800 flex items-start gap-1">
                            <span className="shrink-0 mt-0.5">•</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* review & escalation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium mb-1">Review Schedule</p>
                        <p className="text-muted-foreground text-xs">{r.reviewSchedule}</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3">
                        <p className="font-medium text-orange-800 mb-2 flex items-center gap-1">
                          <ShieldAlert className="h-3.5 w-3.5" /> Escalation Criteria
                        </p>
                        <ul className="space-y-1">
                          {r.escalationCriteria.map((esc, i) => (
                            <li
                              key={i}
                              className="text-xs text-orange-700 flex items-start gap-1"
                            >
                              <span className="shrink-0 mt-0.5">•</span> {esc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* confidentiality */}
                    <div className="bg-indigo-50 rounded-lg p-3">
                      <p className="font-medium text-indigo-800 mb-1 flex items-center gap-1">
                        <Lock className="h-3.5 w-3.5" /> Confidentiality Framing
                      </p>
                      <p className="text-indigo-700 text-xs">{r.confidentialityFraming}</p>
                    </div>

                    {/* sharing */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <div className="bg-muted/40 rounded p-2">
                        <p className="font-medium text-xs">Shared with Social Worker</p>
                        <p className="text-xs text-muted-foreground">
                          {r.sharedWithSocialWorker ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="bg-muted/40 rounded p-2">
                        <p className="font-medium text-xs">Shared with CAMHS</p>
                        <p className="text-xs text-muted-foreground">
                          {r.sharedWithCAMHS ? "Yes" : "No"}
                        </p>
                      </div>
                      <div className="bg-muted/40 rounded p-2">
                        <p className="font-medium text-xs">Child Contributed to Record</p>
                        <p className="text-xs text-muted-foreground">
                          {r.childAuthored ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>

                    {/* footer */}
                    <div className="flex justify-between items-center pt-2 border-t text-xs text-muted-foreground">
                      <span>Conducted by: {getStaffName(r.conductedBy)}</span>
                      <span>Next screening: {r.nextScreeningDate}</span>
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
            Children&apos;s Homes (England) Regulations 2015, Quality Standard 5 (positive
            relationships) and Quality Standard 4 (protection of children) — duty to support
            children&apos;s health, including risks from substance use. Working Together to
            Safeguard Children 2023 — multi-agency response to identified risks. NICE NG87 (drug
            misuse prevention in vulnerable children and young people). Talk to FRANK and CEOP
            resources used to inform age-appropriate education. Approach is harm-reduction led,
            non-judgemental, and trauma-informed — disclosures are met with support, never
            punishment. Information sharing follows GDPR and statutory guidance: only as needed for
            safety, with the child informed in advance.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
