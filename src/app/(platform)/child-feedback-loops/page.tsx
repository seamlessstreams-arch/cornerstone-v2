"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  Heart,
  RefreshCw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeedbackLoop {
  id: string;
  childWhoGaveFeedback: string;
  feedbackDate: string;
  feedbackChannel: "Children's meeting" | "Key working session" | "Verbal to staff" | "Written / drawing" | "Suggestion box" | "Pulse survey" | "Children's pledge review" | "Independent advocate" | "Reg 44 visit";
  feedbackTopic: string;
  childWords: string;
  feedbackType: "Suggestion" | "Concern" | "Compliment" | "Question" | "Challenge" | "Idea";
  acknowledgedBy: string;
  acknowledgedDate: string;
  consideredAt: string;
  decisionMade: "Acted on - in full" | "Acted on - in part" | "Discussed and explored" | "Cannot do - explained" | "Pending consideration";
  decisionMaker: string;
  decisionRationale: string;
  actionsTaken: string[];
  whenChildWasTold: string;
  howChildWasTold: string;
  childResponseToOutcome: string;
  childAccepts: boolean;
  visibleChange: string;
  durationDaysToClose: number;
  followUpDate: string;
  recordedBy: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: FeedbackLoop[] = [
  {
    id: "fl-001",
    childWhoGaveFeedback: "yp_alex",
    feedbackDate: d(-21),
    feedbackChannel: "Children's meeting",
    feedbackTopic: "Bedtime extension on weekends",
    childWords: "Bedtime should be later on Fridays and Saturdays. I'm 13 now, not 10.",
    feedbackType: "Suggestion",
    acknowledgedBy: "staff_darren",
    acknowledgedDate: d(-21),
    consideredAt: d(-14),
    decisionMade: "Acted on - in full",
    decisionMaker: "staff_darren",
    decisionRationale: "Reasonable request matching age-appropriate development. Already exists informally; formalising it.",
    actionsTaken: [
      "Bedtime updated to 22:00 on Friday and Saturday for Alex",
      "Other young people offered same review",
      "Care plan updated",
      "Communicated at next children's meeting",
    ],
    whenChildWasTold: d(-14),
    howChildWasTold: "Announced at children's meeting with explanation and thanks for raising it",
    childResponseToOutcome: "Smiled. 'Cool. Thanks for actually listening.'",
    childAccepts: true,
    visibleChange: "Updated bedtime now in care plan and on bedroom door 'house agreements'",
    durationDaysToClose: 7,
    followUpDate: d(60),
    recordedBy: "staff_darren",
  },
  {
    id: "fl-002",
    childWhoGaveFeedback: "yp_casey",
    feedbackDate: d(-30),
    feedbackChannel: "Key working session",
    feedbackTopic: "Visual cards for emotions getting damaged in pocket",
    childWords: "[Pointed at damaged feelings cards then at intact ones]",
    feedbackType: "Concern",
    acknowledgedBy: "staff_anna",
    acknowledgedDate: d(-30),
    consideredAt: d(-28),
    decisionMade: "Acted on - in full",
    decisionMaker: "staff_anna",
    decisionRationale: "Casey's communication tools must work. Damaged cards are useless. Simple solution: laminate and lanyard.",
    actionsTaken: [
      "Cards laminated and reprinted",
      "Lanyard provided in Casey's preferred colour (sage green)",
      "Spare set kept in Casey's drawer",
      "Visual feeling cards added to care plan as critical comm tool",
    ],
    whenChildWasTold: d(-26),
    howChildWasTold: "Anna showed Casey the new cards next morning. Casey signed thumbs-up.",
    childResponseToOutcome: "Casey put cards on lanyard immediately. Has used them daily since.",
    childAccepts: true,
    visibleChange: "Laminated lanyard cards in use. Spare set in drawer.",
    durationDaysToClose: 4,
    followUpDate: d(90),
    recordedBy: "staff_anna",
  },
  {
    id: "fl-003",
    childWhoGaveFeedback: "yp_jordan",
    feedbackDate: d(-45),
    feedbackChannel: "Independent advocate",
    feedbackTopic: "Mum's contact arrangements should not be discussed with school",
    childWords: "School doesn't need to know about my Mum. It's not their business unless it affects things.",
    feedbackType: "Concern",
    acknowledgedBy: "staff_darren",
    acknowledgedDate: d(-44),
    consideredAt: d(-40),
    decisionMade: "Acted on - in full",
    decisionMaker: "staff_darren",
    decisionRationale: "Privacy is Jordan's right. Information sharing with school must be on need-to-know basis only. Was not happening — agreed change.",
    actionsTaken: [
      "Information sharing protocol with school refreshed",
      "School DSL briefed on what Jordan agrees to share",
      "Karen (advocate) shared decision with Jordan",
      "Apology issued to Jordan for any prior over-sharing",
    ],
    whenChildWasTold: d(-39),
    howChildWasTold: "Karen (advocate) shared with Jordan in confidential session, with letter from RM",
    childResponseToOutcome: "Jordan felt heard. 'Thanks for actually doing something about it.'",
    childAccepts: true,
    visibleChange: "Updated information sharing protocol in place",
    durationDaysToClose: 5,
    followUpDate: d(45),
    recordedBy: "staff_darren",
  },
  {
    id: "fl-004",
    childWhoGaveFeedback: "yp_alex",
    feedbackDate: d(-60),
    feedbackChannel: "Suggestion box",
    feedbackTopic: "Want a pet at the home",
    childWords: "Can we get a dog? Or a cat? Or even a fish. The house feels less like home without a pet.",
    feedbackType: "Suggestion",
    acknowledgedBy: "staff_darren",
    acknowledgedDate: d(-58),
    consideredAt: d(-50),
    decisionMade: "Discussed and explored",
    decisionMaker: "staff_darren",
    decisionRationale: "Important suggestion that needed proper exploration. Compromise reached given Casey's allergies and complexity of pet care responsibility.",
    actionsTaken: [
      "Discussed with all young people at children's meeting",
      "Casey's allergy considerations flagged",
      "Compromise: fish tank in lounge — agreed by all",
      "Visit to nearby cat sanctuary planned monthly",
      "Children chose fish together",
    ],
    whenChildWasTold: d(-45),
    howChildWasTold: "At children's meeting — discussed openly. Alex understood why dog/cat not feasible.",
    childResponseToOutcome: "Alex: 'Fish are alright. Cat trips are sick.'",
    childAccepts: true,
    visibleChange: "Fish tank in lounge with 5 fish, named by all young people. Monthly cat sanctuary visits booked.",
    durationDaysToClose: 15,
    followUpDate: d(60),
    recordedBy: "staff_darren",
  },
  {
    id: "fl-005",
    childWhoGaveFeedback: "yp_jordan",
    feedbackDate: d(-90),
    feedbackChannel: "Children's meeting",
    feedbackTopic: "Want more cultural food on menu",
    childWords: "Why is cultural food only when I cook it? Should be regular.",
    feedbackType: "Challenge",
    acknowledgedBy: "staff_chervelle",
    acknowledgedDate: d(-90),
    consideredAt: d(-85),
    decisionMade: "Acted on - in part",
    decisionMaker: "staff_darren",
    decisionRationale: "Excellent challenge. Menu shouldn't rely on Jordan to provide cultural representation. But also need to balance budget and tolerances.",
    actionsTaken: [
      "Menu refresh with monthly Caribbean and West African meals",
      "Mum's recipes incorporated (with Jordan's permission)",
      "Cultural ingredients budget added",
      "Jordan invited to plan monthly cultural Sunday lunch (with full backup if he doesn't want)",
    ],
    whenChildWasTold: d(-80),
    howChildWasTold: "At children's meeting; written into menu plan visibly",
    childResponseToOutcome: "Jordan pleased. 'Now it's not just on me.' Cultural Sunday lunch happens twice a month now.",
    childAccepts: true,
    visibleChange: "Cultural meals on menu monthly minimum. Jordan-led when he wishes; staff-led when he doesn't.",
    durationDaysToClose: 10,
    followUpDate: d(0),
    recordedBy: "staff_chervelle",
  },
  {
    id: "fl-006",
    childWhoGaveFeedback: "yp_casey",
    feedbackDate: d(-12),
    feedbackChannel: "Key working session",
    feedbackTopic: "Wants to see otters in real life",
    childWords: "[Casey communicated through visual cards: Otter (toy) → outdoors → 'real']",
    feedbackType: "Idea",
    acknowledgedBy: "staff_anna",
    acknowledgedDate: d(-12),
    consideredAt: d(-10),
    decisionMade: "Acted on - in full",
    decisionMaker: "staff_anna",
    decisionRationale: "Beautiful idea. Aligned with Casey's interests, identity, and sensory profile (low-stim wildlife setting).",
    actionsTaken: [
      "Researched otter sanctuaries within day-trip distance",
      "Booked private quiet hour at New Forest Wildlife Park",
      "Sensory preparation kit prepared",
      "Visit happened d-3, Casey loved it",
    ],
    whenChildWasTold: d(-9),
    howChildWasTold: "Anna showed Casey the booking confirmation and pictures. Visual countdown started.",
    childResponseToOutcome: "Casey's first verbal 'thank you' in months. Drew pictures of otters seen for a week afterwards.",
    childAccepts: true,
    visibleChange: "Trip happened. New artwork displayed in bedroom. Plan for return visit annual.",
    durationDaysToClose: 9,
    followUpDate: d(360),
    recordedBy: "staff_anna",
  },
  {
    id: "fl-007",
    childWhoGaveFeedback: "yp_jordan",
    feedbackDate: d(-7),
    feedbackChannel: "Verbal to staff",
    feedbackTopic: "Wants to invite friend round more often",
    childWords: "Tyrese came once. I want him round more. He gets me.",
    feedbackType: "Suggestion",
    acknowledgedBy: "staff_chervelle",
    acknowledgedDate: d(-7),
    consideredAt: d(-3),
    decisionMade: "Acted on - in full",
    decisionMaker: "staff_darren",
    decisionRationale: "Friend visits are healthy and protective. No reason to limit. Just need basic risk awareness.",
    actionsTaken: [
      "Tyrese visit policy formalised — visits any weekend day",
      "Tyrese's parents met at football — basic relational info exchanged",
      "Visits added to family contact log under 'friendship' category",
    ],
    whenChildWasTold: d(-2),
    howChildWasTold: "Chervelle told Jordan over breakfast",
    childResponseToOutcome: "Jordan: 'Sweet. Thanks.'",
    childAccepts: true,
    visibleChange: "Tyrese now visits 1-2x per fortnight",
    durationDaysToClose: 5,
    followUpDate: d(60),
    recordedBy: "staff_chervelle",
  },
  {
    id: "fl-008",
    childWhoGaveFeedback: "yp_alex",
    feedbackDate: d(-3),
    feedbackChannel: "Verbal to staff",
    feedbackTopic: "Wants Saturday afternoon TV in lounge to be football, not cooking shows",
    childWords: "Why are we watching cooking shows when there's a match on?",
    feedbackType: "Question",
    acknowledgedBy: "staff_lackson",
    acknowledgedDate: d(-3),
    consideredAt: d(-3),
    decisionMade: "Discussed and explored",
    decisionMaker: "staff_lackson",
    decisionRationale: "Casey was watching cooking show — sensory-friendly content. Football would be loud/overwhelming for Casey. Need fairness AND sensory respect.",
    actionsTaken: [
      "Compromise: lounge TV programmed in slots; football for set times; Casey-friendly content other times",
      "Alex can watch football in own room (TV available)",
      "Children's meeting agenda item next week to formalise",
    ],
    whenChildWasTold: d(-3),
    howChildWasTold: "Lackson explained in real-time, offered Alex the option",
    childResponseToOutcome: "Alex: 'Fair enough. Casey doesn't choose her brain.'",
    childAccepts: true,
    visibleChange: "TV schedule agreed at children's meeting. Pending implementation.",
    durationDaysToClose: 0,
    followUpDate: d(7),
    recordedBy: "staff_lackson",
  },
];

const decisionColour: Record<string, string> = {
  "Acted on - in full": "bg-green-100 text-green-800",
  "Acted on - in part": "bg-blue-100 text-blue-800",
  "Discussed and explored": "bg-purple-100 text-purple-800",
  "Cannot do - explained": "bg-amber-100 text-amber-800",
  "Pending consideration": "bg-slate-100 text-slate-800",
};

const exportCols: ExportColumn<FeedbackLoop>[] = [
  { header: "Child", accessor: (r: FeedbackLoop) => getYPName(r.childWhoGaveFeedback) },
  { header: "Date", accessor: (r: FeedbackLoop) => r.feedbackDate },
  { header: "Topic", accessor: (r: FeedbackLoop) => r.feedbackTopic },
  { header: "Channel", accessor: (r: FeedbackLoop) => r.feedbackChannel },
  { header: "Type", accessor: (r: FeedbackLoop) => r.feedbackType },
  { header: "Decision", accessor: (r: FeedbackLoop) => r.decisionMade },
  { header: "Days to Close", accessor: (r: FeedbackLoop) => String(r.durationDaysToClose) },
  { header: "Child Accepts", accessor: (r: FeedbackLoop) => r.childAccepts ? "Yes" : "No" },
];

export default function ChildFeedbackLoopsPage() {
  const [filterYP, setFilterYP] = useState("all");
  const [filterDecision, setFilterDecision] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterYP !== "all") items = items.filter((f) => f.childWhoGaveFeedback === filterYP);
    if (filterDecision !== "all") items = items.filter((f) => f.decisionMade === filterDecision);
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.feedbackDate.localeCompare(a.feedbackDate);
        case "duration":
          return a.durationDaysToClose - b.durationDaysToClose;
        case "child":
          return a.childWhoGaveFeedback.localeCompare(b.childWhoGaveFeedback);
        default:
          return 0;
      }
    });
    return items;
  }, [filterYP, filterDecision, sortBy]);

  const total = data.length;
  const actedOn = data.filter((f) => f.decisionMade.startsWith("Acted on")).length;
  const childAccepts = data.filter((f) => f.childAccepts).length;
  const avgDays = Math.round(data.reduce((sum, f) => sum + f.durationDaysToClose, 0) / data.length);

  return (
    <PageShell
      title="Child Feedback Loops"
      subtitle="Closing the loop on feedback children give — from raised to acknowledged to acted on to communicated back"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="child-feedback-loops" />
          <PrintButton title="Child Feedback Loops" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Feedback Loops</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{Math.round((actedOn / total) * 100)}%</p>
          <p className="text-xs text-muted-foreground">Acted On</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{childAccepts}/{total}</p>
          <p className="text-xs text-muted-foreground">Child Accepts Outcome</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{avgDays}d</p>
          <p className="text-xs text-muted-foreground">Avg Days to Close</p>
        </div>
      </div>

      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 mb-6 flex items-start gap-2">
        <RefreshCw className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
        <p className="text-sm text-emerald-800">
          Listening is necessary but insufficient. Closing the loop — telling children what we did, why,
          and how their voice changed something — is what makes participation real. We track every loop:
          when raised, when considered, when decided, when fed back.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterYP} onValueChange={setFilterYP}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Children" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Children</SelectItem>
            <SelectItem value="yp_alex">{getYPName("yp_alex")}</SelectItem>
            <SelectItem value="yp_jordan">{getYPName("yp_jordan")}</SelectItem>
            <SelectItem value="yp_casey">{getYPName("yp_casey")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterDecision} onValueChange={setFilterDecision}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Decisions" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Decisions</SelectItem>
            <SelectItem value="Acted on - in full">Acted On In Full</SelectItem>
            <SelectItem value="Acted on - in part">Acted On In Part</SelectItem>
            <SelectItem value="Discussed and explored">Discussed and Explored</SelectItem>
            <SelectItem value="Cannot do - explained">Cannot Do</SelectItem>
            <SelectItem value="Pending consideration">Pending</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Most Recent</SelectItem>
              <SelectItem value="duration">Fastest Close</SelectItem>
              <SelectItem value="child">By Child</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((f) => {
          const isExpanded = expandedId === f.id;

          return (
            <div key={f.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : f.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <MessageCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{f.feedbackTopic}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getYPName(f.childWhoGaveFeedback)} &middot; {f.feedbackDate} &middot; {f.feedbackChannel} &middot; {f.durationDaysToClose}d to close
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", decisionColour[f.decisionMade])}>
                    {f.decisionMade}
                  </span>
                  {f.childAccepts && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Child&apos;s Words</p>
                    <p className="text-sm italic">&ldquo;{f.childWords}&rdquo;</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Decision Rationale</p>
                    <p className="text-sm">{f.decisionRationale}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Actions Taken</p>
                    <ul className="space-y-1">
                      {f.actionsTaken.map((a, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-1 shrink-0" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">
                      <RefreshCw className="h-3 w-3 inline mr-1" />Loop Closed With Child
                    </p>
                    <p className="text-sm"><strong>When:</strong> {f.whenChildWasTold}</p>
                    <p className="text-sm mt-1"><strong>How:</strong> {f.howChildWasTold}</p>
                  </div>

                  <div className="bg-pink-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1">
                      <Heart className="h-3 w-3 inline mr-1" />Child&apos;s Response To Outcome
                    </p>
                    <p className="text-sm italic">&ldquo;{f.childResponseToOutcome}&rdquo;</p>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">Visible Change</p>
                    <p className="text-sm">{f.visibleChange}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span><MessageCircle className="h-3 w-3 inline mr-1" />Type: {f.feedbackType}</span>
                    <span><Clock className="h-3 w-3 inline mr-1" />{f.durationDaysToClose} days to close</span>
                    <span>Decided by: {getStaffName(f.decisionMaker)}</span>
                    <span>Recorded: {getStaffName(f.recordedBy)}</span>
                    {f.childAccepts && <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">Child Accepts</span>}
                    {!f.childAccepts && <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">Child Disagrees — Continuing Dialogue</span>}
                  </div>

                  {!f.childAccepts && (
                    <div className="bg-amber-50 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-sm">Child does not yet accept the outcome. Open dialogue continues. Follow-up scheduled for {f.followUpDate}.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Feedback loops support UNCRC Article 12 (right to be heard
          AND be taken seriously), Quality Standard 1 (child-centred care), and the Lundy model of
          participation (space, voice, audience, influence). Linked to Children&apos;s Pledges, Voice of
          Child, and Children&apos;s Meetings.
        </p>
      </div>
    </PageShell>
  );
}
