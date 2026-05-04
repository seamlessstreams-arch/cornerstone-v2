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
  Award,
  Heart,
  Star,
  Users,
  Sparkles,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecognitionEntry {
  id: string;
  date: string;
  staffMember: string;
  recognitionType: "Above and beyond" | "Quiet excellence" | "Team contribution" | "Child-recognised" | "Anniversary milestone" | "Qualification achieved" | "Wellbeing leadership" | "Innovation" | "Cultural awareness";
  recognisedBy: "Registered Manager" | "Deputy" | "Peer" | "Child" | "Parent" | "External professional" | "Whole team";
  recognisedByName: string;
  whatHappened: string;
  impactDescription: string;
  childImpact: string;
  organisationalImpact: string;
  wayMarked: ("Verbal recognition" | "Card / handwritten note" | "Team meeting share" | "Wall of awesome" | "Newsletter mention" | "Voucher / token" | "Time off in lieu" | "Bonus")[];
  monetaryValue: number;
  publicCelebration: boolean;
  childContributedNomination: boolean;
  staffResponse: string;
  reflectionFromManager: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: RecognitionEntry[] = [
  {
    id: "rec-001",
    date: d(-3),
    staffMember: "staff_anna",
    recognitionType: "Child-recognised",
    recognisedBy: "Child",
    recognisedByName: "Casey",
    whatHappened: "Casey nominated Anna at children's meeting: 'Anna gets it. She knows when I need quiet, when I need a card, when I need her to just sit. She doesn't make me explain.'",
    impactDescription: "Casey has chosen to formally recognise Anna's care. This is exceptional given Casey's communication profile. Demonstrates the relational depth Anna has built.",
    childImpact: "Casey feels seen and understood — the gold standard of relational care.",
    organisationalImpact: "Sets standard for sensory and relational responsiveness. Other staff learning from Anna's approach.",
    wayMarked: ["Card / handwritten note", "Team meeting share", "Wall of awesome"],
    monetaryValue: 0,
    publicCelebration: true,
    childContributedNomination: true,
    staffResponse: "Anna teary. Said: 'This is everything. Casey trusting me to be silent is the highest compliment.'",
    reflectionFromManager: "Anna's quiet excellence with Casey is a masterclass. She's mentoring Mirela informally on similar approaches.",
  },
  {
    id: "rec-002",
    date: d(-7),
    staffMember: "staff_lackson",
    recognitionType: "Above and beyond",
    recognisedBy: "Registered Manager",
    recognisedByName: "staff_darren",
    whatHappened: "Lackson volunteered to drive Alex to inter-club boxing competition on his day off. Stayed throughout, supported Alex through nerves, celebrated the win.",
    impactDescription: "Boxing identity is one of Alex's strongest protective factors. Lackson's commitment beyond rota strengthened that.",
    childImpact: "Alex won and described Lackson as 'family'.",
    organisationalImpact: "Modelling commitment. Inspired team conversation on what 'going beyond' looks like — and recognising it without expecting it.",
    wayMarked: ["Verbal recognition", "Time off in lieu", "Newsletter mention"],
    monetaryValue: 0,
    publicCelebration: true,
    childContributedNomination: false,
    staffResponse: "Lackson said: 'Just love watching Alex thrive. Day off well spent.'",
    reflectionFromManager: "Lackson takes time off in lieu — important to ensure boundaries protected even as we recognise.",
  },
  {
    id: "rec-003",
    date: d(-12),
    staffMember: "staff_mirela",
    recognitionType: "Quiet excellence",
    recognisedBy: "Peer",
    recognisedByName: "staff_chervelle",
    whatHappened: "Chervelle nominated Mirela: 'During the recent crisis with Casey, Mirela held the rest of the home steady — Alex and Jordan didn't even know there was a crisis. That's invisible work, but it's what makes the home work.'",
    impactDescription: "Mirela protected stability for the other young people during Casey's crisis. This kind of contribution often goes unseen.",
    childImpact: "Alex and Jordan continued routines undisturbed.",
    organisationalImpact: "Recognition that team work isn't only the visible response — it's also the holding of normality.",
    wayMarked: ["Card / handwritten note", "Team meeting share", "Wall of awesome"],
    monetaryValue: 25,
    publicCelebration: true,
    childContributedNomination: false,
    staffResponse: "Mirela: 'Thank you for noticing. I sometimes feel the quiet work doesn't count.'",
    reflectionFromManager: "Important culturally — naming invisible work as essential. Mirela now gets a small voucher as token. Quiet excellence noticed.",
  },
  {
    id: "rec-004",
    date: d(-21),
    staffMember: "staff_edward",
    recognitionType: "Innovation",
    recognisedBy: "Registered Manager",
    recognisedByName: "staff_darren",
    whatHappened: "Edward designed and implemented the new visual handover summary template after the handover audit identified gaps. Within 2 weeks of use, handover quality scores rose noticeably.",
    impactDescription: "Edward turned an audit finding into a practical, sustainable improvement.",
    childImpact: "Better handovers mean fewer missed details about children — direct impact on care continuity.",
    organisationalImpact: "Process improvement now embedded. Other homes in the group asking about the template.",
    wayMarked: ["Verbal recognition", "Team meeting share", "Newsletter mention"],
    monetaryValue: 0,
    publicCelebration: true,
    childContributedNomination: false,
    staffResponse: "Edward: 'Audit gave us the data. I just put it into something usable.'",
    reflectionFromManager: "Edward's quiet practical innovation is hugely valuable. Encouraging him to share at sector event.",
  },
  {
    id: "rec-005",
    date: d(-30),
    staffMember: "staff_chervelle",
    recognitionType: "Cultural awareness",
    recognisedBy: "Child",
    recognisedByName: "Jordan",
    whatHappened: "Jordan nominated Chervelle: 'Chervelle gets my background. She doesn't just learn about it from a website — she lives parts of it. I feel seen here.'",
    impactDescription: "Cultural matching has been transformative for Jordan. Chervelle's lived experience makes a difference.",
    childImpact: "Identity affirmed. Cultural mentor relationship strong.",
    organisationalImpact: "Diversity in the team is a strength — children name it themselves. Hiring strategy validated.",
    wayMarked: ["Card / handwritten note", "Team meeting share", "Wall of awesome", "Newsletter mention"],
    monetaryValue: 0,
    publicCelebration: true,
    childContributedNomination: true,
    staffResponse: "Chervelle: 'Means everything. I came into care work because of relationships like this.'",
    reflectionFromManager: "Cultural responsiveness is a core capability. Chervelle exemplifies it.",
  },
  {
    id: "rec-006",
    date: d(-45),
    staffMember: "staff_ryan",
    recognitionType: "Wellbeing leadership",
    recognisedBy: "Whole team",
    recognisedByName: "staff_team",
    whatHappened: "Team nominated Ryan: 'Ryan introduced reflective practice supervision and protected it through scheduling pressure. Has changed how we feel at work.'",
    impactDescription: "Ryan's championing of reflective practice has meaningfully shifted team wellbeing.",
    childImpact: "Better-regulated staff = better care for children.",
    organisationalImpact: "Reflective practice now a feature, not a nice-to-have. Featured in Reg 45 report.",
    wayMarked: ["Card / handwritten note", "Team meeting share", "Voucher / token"],
    monetaryValue: 50,
    publicCelebration: true,
    childContributedNomination: false,
    staffResponse: "Ryan: 'Glad it lands. Wellbeing isn't soft — it's the work.'",
    reflectionFromManager: "Ryan's deputy leadership model is one of the home's strengths. Important to recognise and protect.",
  },
  {
    id: "rec-007",
    date: d(-60),
    staffMember: "staff_anna",
    recognitionType: "Anniversary milestone",
    recognisedBy: "Registered Manager",
    recognisedByName: "staff_darren",
    whatHappened: "5 years at Oak House. Anna's first day was Casey's arrival day. She's been Casey's key worker since.",
    impactDescription: "5 years is rare in this sector. Anna's continuity is gold for the children.",
    childImpact: "Casey's primary attachment within the home.",
    organisationalImpact: "Long service evidences positive workplace. Sector retention models need this.",
    wayMarked: ["Card / handwritten note", "Team meeting share", "Voucher / token", "Time off in lieu"],
    monetaryValue: 100,
    publicCelebration: true,
    childContributedNomination: false,
    staffResponse: "Anna emotional. Said: 'Hard to believe. Best decision I ever made.'",
    reflectionFromManager: "Long service awards matter. Anna's stability is part of why this home works.",
  },
];

const typeColour: Record<string, string> = {
  "Above and beyond": "bg-amber-100 text-amber-800",
  "Quiet excellence": "bg-purple-100 text-purple-800",
  "Team contribution": "bg-blue-100 text-blue-800",
  "Child-recognised": "bg-pink-100 text-pink-800",
  "Anniversary milestone": "bg-emerald-100 text-emerald-800",
  "Qualification achieved": "bg-indigo-100 text-indigo-800",
  "Wellbeing leadership": "bg-rose-100 text-rose-800",
  "Innovation": "bg-cyan-100 text-cyan-800",
  "Cultural awareness": "bg-amber-100 text-amber-800",
};

const exportCols: ExportColumn<RecognitionEntry>[] = [
  { header: "Date", accessor: (r: RecognitionEntry) => r.date },
  { header: "Staff Member", accessor: (r: RecognitionEntry) => getStaffName(r.staffMember) },
  { header: "Type", accessor: (r: RecognitionEntry) => r.recognitionType },
  { header: "Recognised By", accessor: (r: RecognitionEntry) => r.recognisedBy },
  { header: "What Happened", accessor: (r: RecognitionEntry) => r.whatHappened },
  { header: "Marked With", accessor: (r: RecognitionEntry) => r.wayMarked.join("; ") },
  { header: "Value £", accessor: (r: RecognitionEntry) => `£${r.monetaryValue}` },
  { header: "Child-Nominated", accessor: (r: RecognitionEntry) => r.childContributedNomination ? "Yes" : "No" },
];

export default function StaffRecognitionLogPage() {
  const [filterType, setFilterType] = useState("all");
  const [filterStaff, setFilterStaff] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterType !== "all") items = items.filter((r) => r.recognitionType === filterType);
    if (filterStaff !== "all") items = items.filter((r) => r.staffMember === filterStaff);
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.date.localeCompare(a.date);
        case "type":
          return a.recognitionType.localeCompare(b.recognitionType);
        default:
          return 0;
      }
    });
    return items;
  }, [filterType, filterStaff, sortBy]);

  const total = data.length;
  const childRecognised = data.filter((r) => r.childContributedNomination).length;
  const uniqueStaff = new Set(data.map((r) => r.staffMember)).size;
  const totalSpend = data.reduce((sum, r) => sum + r.monetaryValue, 0);

  const allStaff = Array.from(new Set(data.map((r) => r.staffMember)));

  return (
    <PageShell
      title="Staff Recognition Log"
      subtitle="Recognising contributions, milestones, and relational excellence — formally and warmly"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="staff-recognition-log" />
          <PrintButton title="Staff Recognition Log" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Recognitions</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-pink-600">{childRecognised}</p>
          <p className="text-xs text-muted-foreground">Child-Nominated</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{uniqueStaff}/7</p>
          <p className="text-xs text-muted-foreground">Staff Recognised</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">£{totalSpend}</p>
          <p className="text-xs text-muted-foreground">Token Spend</p>
        </div>
      </div>

      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 mb-6 flex items-start gap-2">
        <Award className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800">
          People do their best work when they feel seen. We recognise above-and-beyond moments AND quiet
          excellence, AND children&apos;s nominations. Recognition is regular, specific, and shared in ways
          that match how the person likes to be celebrated.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Above and beyond">Above and Beyond</SelectItem>
            <SelectItem value="Quiet excellence">Quiet Excellence</SelectItem>
            <SelectItem value="Team contribution">Team Contribution</SelectItem>
            <SelectItem value="Child-recognised">Child-Recognised</SelectItem>
            <SelectItem value="Anniversary milestone">Anniversary Milestone</SelectItem>
            <SelectItem value="Qualification achieved">Qualification Achieved</SelectItem>
            <SelectItem value="Wellbeing leadership">Wellbeing Leadership</SelectItem>
            <SelectItem value="Innovation">Innovation</SelectItem>
            <SelectItem value="Cultural awareness">Cultural Awareness</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStaff} onValueChange={setFilterStaff}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Staff" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Staff</SelectItem>
            {allStaff.map((s) => (
              <SelectItem key={s} value={s}>{getStaffName(s)}</SelectItem>
            ))}
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
                  <Award className="h-5 w-5 text-amber-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{getStaffName(r.staffMember)} &middot; {r.recognitionType}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r.date} &middot; Recognised by {r.recognisedBy === "Child" ? `child (${r.recognisedByName})` : r.recognisedBy === "Whole team" ? "whole team" : r.recognisedByName.startsWith("staff_") ? getStaffName(r.recognisedByName) : r.recognisedByName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", typeColour[r.recognitionType])}>
                    {r.recognitionType}
                  </span>
                  {r.childContributedNomination && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 font-medium flex items-center gap-1">
                      <Heart className="h-3 w-3" />Child
                    </span>
                  )}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">What Happened</p>
                    <p className="text-sm">{r.whatHappened}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Impact</p>
                    <p className="text-sm">{r.impactDescription}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-pink-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1">
                        <Heart className="h-3 w-3 inline mr-1" />Child Impact
                      </p>
                      <p className="text-sm">{r.childImpact}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">
                        <Users className="h-3 w-3 inline mr-1" />Organisational Impact
                      </p>
                      <p className="text-sm">{r.organisationalImpact}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Marked With</p>
                    <div className="flex flex-wrap gap-1">
                      {r.wayMarked.map((w, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />{w}
                        </span>
                      ))}
                    </div>
                    {r.monetaryValue > 0 && <p className="text-xs text-emerald-700 mt-2">Token value: £{r.monetaryValue}</p>}
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">Staff Response</p>
                    <p className="text-sm italic">&ldquo;{r.staffResponse}&rdquo;</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 border">
                    <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">Manager Reflection</p>
                    <p className="text-sm">{r.reflectionFromManager}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span><Star className="h-3 w-3 inline mr-1" />{r.recognitionType}</span>
                    <span>Recognised: {r.date}</span>
                    {r.publicCelebration && <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">Public Celebration</span>}
                    {r.childContributedNomination && <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 font-medium">Child Nominated</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Staff recognition supports Quality Standard 13 (leadership and
          management — workforce wellbeing), Reg 32 (fitness of workers), and best-practice retention models.
          Recognition is a feature of the home&apos;s positive workplace culture. Linked to Staff Wellbeing,
          Annual Reviews, and Supervision.
        </p>
      </div>
    </PageShell>
  );
}
