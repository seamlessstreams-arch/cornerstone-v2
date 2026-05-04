"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Heart, ChevronDown, ChevronUp, ArrowUpDown, MessageCircle, Sparkles,
  HandHeart, CheckCircle2, AlertTriangle, Clock, Smile, Frown, BookOpen,
  PenTool, Footprints, Palette, UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStaffName, getYPName } from "@/lib/seed-data";

/* ── types ─────────────────────────────────────────────────────────────────── */

type DebriefMethod =
  | "Conversation"
  | "Drawing"
  | "Visual cards"
  | "Walk-and-talk"
  | "Written"
  | "Through advocate";

interface ChildDebrief {
  id: string;
  youngPerson: string;
  incidentRef: string;
  incidentDate: string;
  debriefDate: string;
  debriefStaff: string;
  debriefMethod: DebriefMethod;
  childReadyToDebrief: boolean;
  readinessIndicators: string;
  childAccountOfWhatHappened: string;
  childFeelingsBeforeDuring: string;
  childFeelingsNow: string;
  whatChildWishesHadBeenDifferent: string;
  whatHelpedChild: string[];
  whatDidNotHelp: string[];
  childRequestsForFuture: string[];
  apologiesOffered: string;
  apologiesReceived: string;
  repairsAgreed: string[];
  childAcceptsOutcome: boolean;
  supportNeededNow: string;
  followUpDate: string;
  recordedBy: string;
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const daysBetween = (a: string, b: string) => {
  const ad = new Date(a).getTime();
  const bd = new Date(b).getTime();
  return Math.round(Math.abs(bd - ad) / (1000 * 60 * 60 * 24));
};

const METHOD_META: Record<DebriefMethod, { label: string; color: string; icon: typeof MessageCircle }> = {
  "Conversation": { label: "Conversation", color: "bg-blue-100 text-blue-800", icon: MessageCircle },
  "Drawing": { label: "Drawing", color: "bg-pink-100 text-pink-800", icon: Palette },
  "Visual cards": { label: "Visual cards", color: "bg-purple-100 text-purple-800", icon: BookOpen },
  "Walk-and-talk": { label: "Walk-and-talk", color: "bg-green-100 text-green-800", icon: Footprints },
  "Written": { label: "Written", color: "bg-amber-100 text-amber-800", icon: PenTool },
  "Through advocate": { label: "Through advocate", color: "bg-indigo-100 text-indigo-800", icon: UserRound },
};

/* ── seed data ─────────────────────────────────────────────────────────────── */

const SEED: ChildDebrief[] = [
  {
    id: "cd_001",
    youngPerson: "yp_alex",
    incidentRef: "INC-2026-0039",
    incidentDate: d(-10),
    debriefDate: d(-8),
    debriefStaff: "staff_edward",
    debriefMethod: "Walk-and-talk",
    childReadyToDebrief: true,
    readinessIndicators:
      "Alex slept well the night before. Asked Edward (key worker) about football scores at breakfast — first sustained conversation since the incident. Body language relaxed. Agreed to a walk to the park rather than a sit-down meeting.",
    childAccountOfWhatHappened:
      "Alex said he 'lost it' when staff started talking about the court hearing. Said his head 'went black' and he just wanted the feelings to stop. Remembered grabbing the broken CD case and trying to scratch his arm. Said he could hear Ryan saying 'I'm here, I've got you' but couldn't reply. Said being held felt 'safe and trapped at the same time'.",
    childFeelingsBeforeDuring:
      "Said he had felt 'wound up like a spring' all day after the social worker phone call. Felt panic rising when court was mentioned at tea. During the hold described feeling 'small' and 'scared' but also 'a bit relieved' that someone had stopped him.",
    childFeelingsNow:
      "Embarrassed. Worried staff are 'fed up' with him. Sore arm from the bruise — said the hold itself didn't hurt but he hates seeing the mark. Glad he didn't manage to cut himself. Tearful when talking about his mum being told.",
    whatChildWishesHadBeenDifferent:
      "Wishes the court conversation had not happened at the dinner table with everyone listening. Wishes he had asked to go to his room earlier. Doesn't blame staff for the hold — said 'you had to'.",
    whatHelpedChild: [
      "Ryan saying his name calmly throughout the hold",
      "Being told what was happening ('I'm going to hold your arms now')",
      "Edward sitting outside his room afterwards without saying anything",
      "The hot chocolate Chervelle made later",
      "Being allowed to phone his mum the next morning",
    ],
    whatDidNotHelp: [
      "The court news being shared in the lounge with other young people present",
      "Being asked 'are you okay?' lots of times in the first hour after — said he just wanted quiet",
      "The ambulance lights — made him think he was in trouble",
    ],
    childRequestsForFuture: [
      "Important news to be shared in his room or the quiet office, not the lounge",
      "If he goes quiet, staff to ask once and then 'just sit' rather than keep talking",
      "Wants a 'pause card' he can hand to staff when he needs to leave a conversation",
      "Asked for his key worker to be present at any future court conversations",
    ],
    apologiesOffered:
      "Alex apologised to Ryan and Edward — said he was sorry for swearing and for the bruise on Ryan's wrist. Asked Edward to pass on a 'sorry' to Chervelle for the broken CD case.",
    apologiesReceived:
      "Edward apologised on behalf of the team for raising court at the dinner table — acknowledged this was poor timing and not what Alex needed. Ryan also apologised separately for not noticing how 'wound up' Alex was earlier in the day.",
    repairsAgreed: [
      "Alex to help tidy the lounge for one shift (his suggestion, not staff-imposed)",
      "Team to add 'pause card' to Alex's behaviour support plan",
      "Sensitive news rule: communicated 1:1 in a private space, key worker present where possible",
      "Alex and Edward to plan how the next court update will be shared",
    ],
    childAcceptsOutcome: true,
    supportNeededNow:
      "Continued low-stimulation environment for 48 hours. Daily check-in with key worker. CAMHS appointment brought forward — already requested. Mum to visit at weekend.",
    followUpDate: d(-1),
    recordedBy: "staff_edward",
  },
  {
    id: "cd_002",
    youngPerson: "yp_casey",
    incidentRef: "INC-2026-0044",
    incidentDate: d(-5),
    debriefDate: d(-3),
    debriefStaff: "staff_chervelle",
    debriefMethod: "Drawing",
    childReadyToDebrief: true,
    readinessIndicators:
      "Casey came down to breakfast and ate without prompting. Asked Chervelle if she could 'do art with her' — Casey often uses drawing to process feelings. No fresh self-harm in 36 hours.",
    childAccountOfWhatHappened:
      "Drew a stick figure with a black scribble around the head, surrounded by smaller figures. Said the black scribble was 'the loud feeling' that came when she heard her mum wasn't coming for contact. Drew a broken pen next to the figure. Said the small figures were staff 'trying to help but everyone was too close'.",
    childFeelingsBeforeDuring:
      "Drew a thermometer reaching the top — said her feelings were 'all the way up'. Said she felt 'numb and on fire at the same time'. Wanted to feel something physical to 'switch off' the loud feeling. Said the moment Ryan and Chervelle held her hands she 'couldn't think for a minute' but then started crying.",
    childFeelingsNow:
      "Drew a thermometer at halfway. Said she feels 'tired but okay'. Worried Chervelle is 'cross' with her. Reassured this is not the case. Said she feels safe with Chervelle holding the toolkit.",
    whatChildWishesHadBeenDifferent:
      "Wishes she had told someone the cancelled contact had 'set her off'. Wishes the pen had not been left out. Drew a picture of herself asking for the toolkit before things got too much — said she'd like to learn to do this.",
    whatHelpedChild: [
      "Chervelle's voice during the hold — soft, slow",
      "Being given a weighted blanket afterwards",
      "Being allowed to draw on Chervelle's arm with a washable pen (sensory)",
      "No one asking 'why' for the rest of the evening",
      "The lavender oil on her pillow at bedtime",
    ],
    whatDidNotHelp: [
      "When the night manager phoned the duty social worker in front of her — felt 'in trouble'",
      "Bright kitchen lights stayed on during the incident — too much",
      "One staff member said 'you're okay, you're okay' on repeat — Casey said this made it worse",
    ],
    childRequestsForFuture: [
      "Distress toolkit to be visible — on the lounge shelf, not in a cupboard",
      "When contact is cancelled, Chervelle (her key worker) to tell her if possible",
      "A code word Casey can text to staff when she feels the 'loud feeling' coming",
      "Lights to be dimmed when she is escalating",
    ],
    apologiesOffered:
      "Casey wanted to apologise to the night staff for shouting. Asked Chervelle to pass this on. Did not feel she could yet say it face-to-face — Chervelle agreed this was okay.",
    apologiesReceived:
      "Chervelle apologised for the pen being left on the side and for the kitchen lights staying on. The night manager has since written Casey a short note apologising for making the safeguarding call within earshot.",
    repairsAgreed: [
      "Distress toolkit moved to lounge shelf today",
      "Code word agreed: 'pineapple'",
      "Lighting plan added to Casey's behaviour support plan — dim lounge lamps, low kitchen light when escalating",
      "Cancelled contact to be communicated by key worker with a comfort item",
      "Casey to choose a new sensory item for the toolkit (budget approved)",
    ],
    childAcceptsOutcome: true,
    supportNeededNow:
      "Daily 1:1 art time with Chervelle for the next week. CAMHS aware. Self-harm risk plan refreshed. Body map up to date.",
    followUpDate: d(4),
    recordedBy: "staff_chervelle",
  },
  {
    id: "cd_003",
    youngPerson: "yp_jordan",
    incidentRef: "INC-2026-0042",
    incidentDate: d(-3),
    debriefDate: d(-2),
    debriefStaff: "staff_anna",
    debriefMethod: "Conversation",
    childReadyToDebrief: true,
    readinessIndicators:
      "Jordan asked Anna 'can we talk about yesterday?' the morning after. Articulate, calm, made eye contact. No avoidance behaviours.",
    childAccountOfWhatHappened:
      "Said he had been trying to do his coursework in the lounge when other young people were 'mucking about with the speaker'. Asked them to turn it down twice. Said he felt 'invisible' — staff were in the kitchen and didn't come when he raised his voice. Eventually he 'got really fed up' and slammed his laptop down. Said he didn't shout at staff but 'said it sharply' when Chervelle asked what was wrong.",
    childFeelingsBeforeDuring:
      "Frustrated. Said he had been holding it in for an hour. Felt 'like nobody cared about my exam'. Embarrassed that he'd raised his voice with Chervelle.",
    childFeelingsNow:
      "Mostly fine. A bit cross still that the situation 'shouldn't have got to that point'. Said the conversation today is helpful because it shows he 'matters'.",
    whatChildWishesHadBeenDifferent:
      "Wishes staff had checked on him sooner. Wishes there was a quiet study space — said he can't concentrate in his bedroom because of the road noise.",
    whatHelpedChild: [
      "Chervelle listening properly when he explained, not getting defensive",
      "Being offered the dining room as a quiet study space straight away",
      "Anna sitting down and asking 'what would help?' rather than telling him what to do",
      "The home shop bought him noise-cancelling headphones the next day",
    ],
    whatDidNotHelp: [
      "Staff being in the kitchen with the door shut for so long",
      "Being told 'just go to your room' as the first suggestion — Jordan said this felt like a punishment",
    ],
    childRequestsForFuture: [
      "A bookable quiet study slot in the dining room during exam term",
      "Staff to do a 'lounge check' every 20 minutes during study time",
      "House rules around speaker use during evenings — agreed at next house meeting",
      "Jordan to chair the next house meeting (his idea — he wants to lead the discussion)",
    ],
    apologiesOffered:
      "Jordan apologised to Chervelle for the sharp tone. Said he should have come and found her rather than getting to the point of slamming the laptop.",
    apologiesReceived:
      "Chervelle apologised for not being present in the lounge. Anna apologised on behalf of the team for the lack of a study space — acknowledged this was a system issue, not Jordan's fault.",
    repairsAgreed: [
      "Dining room bookable as a quiet study space (rota up by Friday)",
      "Lounge check every 20 minutes during study evenings (Mon–Thu, 18:00–20:00)",
      "House meeting on speaker etiquette — Jordan to chair",
      "Noise-cancelling headphones purchased and given to Jordan",
    ],
    childAcceptsOutcome: true,
    supportNeededNow:
      "Continue to support exam preparation. Key worker session this week to talk through coursework deadlines. No further restorative work needed — Jordan is satisfied.",
    followUpDate: d(5),
    recordedBy: "staff_anna",
  },
  {
    id: "cd_004",
    youngPerson: "yp_alex",
    incidentRef: "INC-2026-0041",
    incidentDate: d(-2),
    debriefDate: d(-1),
    debriefStaff: "staff_edward",
    debriefMethod: "Visual cards",
    childReadyToDebrief: false,
    readinessIndicators:
      "Alex initially said he didn't want to talk. Edward used the emotion cards (a tool Alex chose during a previous key work session) — Alex agreed to point at cards rather than speak. Session kept short (12 minutes). Alex remained at the kitchen table with the cards visible to him at all times — was free to leave.",
    childAccountOfWhatHappened:
      "Pointed at 'angry', 'small', 'scared'. Did not want to give a verbal account of being missing. Pointed at a card showing a person walking away and one showing a phone with a cross through it. Edward did not press for more.",
    childFeelingsBeforeDuring:
      "Cards selected: 'wound up', 'fed up', 'lonely'. Said one sentence: 'I just needed to walk.'",
    childFeelingsNow:
      "Selected 'tired' and 'okay'. Said he was glad to be back. Did not want to discuss where he had been — Edward respected this. The Return Home Interview will be conducted by an independent advocate next week, as per LA process.",
    whatChildWishesHadBeenDifferent:
      "Pointed at a card showing a person putting on a coat — Edward gently asked if Alex meant 'I should have told someone I was going for a walk' — Alex nodded.",
    whatHelpedChild: [
      "Police officer who found him was calm and didn't put him in the back of the car",
      "Edward not asking too many questions on his return",
      "Hot food and a shower available straight away",
      "Mum being told but not coming to the home (Alex's preference)",
    ],
    whatDidNotHelp: [
      "Pointed at a card showing many people — Edward interpreted this as 'too many staff around when I came back'",
      "Pointed at a card showing a clock — possibly the wait at the police station before being collected",
    ],
    childRequestsForFuture: [
      "When he returns from being missing, only one staff member to greet him",
      "Permission to have a 30-minute walk in the garden before any conversations",
      "Independent advocate (Mariam) to do the formal Return Home Interview — Alex trusts her",
      "Wants to discuss agreeing 'safe walks' with key worker so he doesn't feel he has to go missing to get space",
    ],
    apologiesOffered:
      "Alex pointed at a card showing a person waving — Edward took this as Alex acknowledging he was sorry for worrying staff. Edward did not push for verbal apology.",
    apologiesReceived:
      "Edward apologised for the number of staff present on Alex's return — acknowledged this was overwhelming. Said the team is learning what Alex needs after a missing episode.",
    repairsAgreed: [
      "On return from missing: only key worker (or named staff) to greet Alex",
      "Garden walk option offered before any conversation",
      "'Safe walks' to be discussed at next CAMHS appointment and added to the care plan if appropriate",
      "Edward to liaise with Mariam (advocate) about the formal RHI date",
    ],
    childAcceptsOutcome: true,
    supportNeededNow:
      "Quiet, low-pressure week. Daily wellbeing check-ins by key worker only — minimal questions. CAMHS appointment booked. Risk assessment review tomorrow.",
    followUpDate: d(2),
    recordedBy: "staff_edward",
  },
  {
    id: "cd_005",
    youngPerson: "yp_casey",
    incidentRef: "INC-2026-0046",
    incidentDate: d(-14),
    debriefDate: d(-12),
    debriefStaff: "staff_anna",
    debriefMethod: "Through advocate",
    childReadyToDebrief: true,
    readinessIndicators:
      "Casey requested that her independent advocate (Mariam) be present for the debrief because the incident involved her feeling unheard by night staff. Casey was clear, articulate during a brief check-in. Mariam confirmed Casey was emotionally ready.",
    childAccountOfWhatHappened:
      "Casey explained, with Mariam supporting, that she had asked the night staff three times for her PRN melatonin and been told to 'try and settle first'. Said she became increasingly distressed and eventually started banging her head on the wall. Felt the staff response was slow and that she was 'treated like I was being difficult'.",
    childFeelingsBeforeDuring:
      "Said she felt 'dismissed' and 'like a number'. Anxious about not sleeping before a school assessment the next day. By the time the staff came, she was 'beyond words'.",
    childFeelingsNow:
      "Validated. Said having Mariam there 'made it real'. Still feels the night staff need to understand that her PRN request is not 'attention-seeking' — it is part of her plan.",
    whatChildWishesHadBeenDifferent:
      "Wishes the PRN had been given on first request — said this is what her plan says. Wishes the night staff knew her plan properly.",
    whatHelpedChild: [
      "Mariam being present for this debrief",
      "Anna writing things down as Casey spoke — felt 'taken seriously'",
      "RM (Darren) coming in to apologise on behalf of the home",
      "Knowing the night staff have had a refresher on her plan",
    ],
    whatDidNotHelp: [
      "Being told 'try and settle first' when her plan permits PRN on request after 22:30",
      "Being asked to explain 'why' she needed the medication — Casey said this felt like she had to justify herself",
    ],
    childRequestsForFuture: [
      "All staff (including agency) to read her sleep plan before working a night shift",
      "PRN to be given on request without being asked to 'try first', as per the plan",
      "Mariam to be invited to any future debrief involving night staff",
      "A copy of her sleep plan, in her own words, on her bedside table",
    ],
    apologiesOffered: "None requested. Casey said the responsibility was with the staff, not her.",
    apologiesReceived:
      "Anna apologised for not being on shift that night. Darren (RM) apologised in writing and in person on behalf of the home for the failure to follow the sleep plan. The two night staff have written individual letters of apology, reviewed by Mariam before being passed to Casey.",
    repairsAgreed: [
      "Sleep plan refresher delivered to all night staff and agency staff (signed off)",
      "Casey's plan summary added to the night handover sheet",
      "Bedside-table version of the plan written by Casey and laminated",
      "Mariam to be CC'd on debrief outcomes for the next 6 months at Casey's request",
      "RM to spot-check PRN compliance at next two night-shift audits",
    ],
    childAcceptsOutcome: true,
    supportNeededNow:
      "Continued advocacy involvement. CAMHS aware. Casey to lead a short item at the next staff meeting (with Mariam) about being heard. Sleep monitoring continues.",
    followUpDate: d(7),
    recordedBy: "staff_anna",
  },
];

/* ── page ──────────────────────────────────────────────────────────────────── */

export default function PostIncidentDebriefWithChildPage() {
  const [data] = useState<ChildDebrief[]>(SEED);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"debriefDate" | "incidentDate" | "youngPerson">("debriefDate");
  const [filterChild, setFilterChild] = useState<string>("all");
  const [filterMethod, setFilterMethod] = useState<string>("all");

  const filtered = useMemo(() => {
    let result = [...data];
    if (filterChild !== "all") result = result.filter((r) => r.youngPerson === filterChild);
    if (filterMethod !== "all") result = result.filter((r) => r.debriefMethod === filterMethod);
    return result.sort((a, b) => {
      switch (sortBy) {
        case "incidentDate":
          return b.incidentDate.localeCompare(a.incidentDate);
        case "youngPerson":
          return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
        default:
          return b.debriefDate.localeCompare(a.debriefDate);
      }
    });
  }, [data, sortBy, filterChild, filterMethod]);

  /* summary stats */
  const now = new Date();
  const thisMonth = now.toISOString().slice(0, 7);
  const debriefsThisMonth = data.filter((r) => r.debriefDate.startsWith(thisMonth)).length;
  const childLedCount = data.filter((r) => r.childReadyToDebrief).length;
  const childLedPct = data.length > 0 ? Math.round((childLedCount / data.length) * 100) : 0;
  const acceptsOutcomeCount = data.filter((r) => r.childAcceptsOutcome).length;
  const acceptsOutcomePct = data.length > 0 ? Math.round((acceptsOutcomeCount / data.length) * 100) : 0;
  const avgDays =
    data.length > 0
      ? Math.round(
          data.reduce((sum, r) => sum + daysBetween(r.incidentDate, r.debriefDate), 0) / data.length,
        )
      : 0;

  /* export */
  const exportCols: ExportColumn<ChildDebrief>[] = [
    { header: "ID", accessor: (r: ChildDebrief) => r.id },
    { header: "Young Person", accessor: (r: ChildDebrief) => getYPName(r.youngPerson) },
    { header: "Incident Ref", accessor: (r: ChildDebrief) => r.incidentRef },
    { header: "Incident Date", accessor: (r: ChildDebrief) => r.incidentDate },
    { header: "Debrief Date", accessor: (r: ChildDebrief) => r.debriefDate },
    { header: "Days Between", accessor: (r: ChildDebrief) => daysBetween(r.incidentDate, r.debriefDate) },
    { header: "Method", accessor: (r: ChildDebrief) => r.debriefMethod },
    { header: "Debriefed By", accessor: (r: ChildDebrief) => getStaffName(r.debriefStaff) },
    { header: "Child Ready", accessor: (r: ChildDebrief) => (r.childReadyToDebrief ? "Yes" : "No") },
    { header: "Accepts Outcome", accessor: (r: ChildDebrief) => (r.childAcceptsOutcome ? "Yes" : "No") },
    { header: "Follow-Up", accessor: (r: ChildDebrief) => r.followUpDate },
    { header: "Recorded By", accessor: (r: ChildDebrief) => getStaffName(r.recordedBy) },
  ];

  const uniqueChildren = Array.from(new Set(data.map((r) => r.youngPerson)));

  return (
    <PageShell
      title="Post-Incident Debrief with Child"
      subtitle="Restorative · Child-Led Reflection · Quality Standard 5 · Repair & Forward Planning"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Post-Incident Debrief with Child" />
          <ExportButton data={data} columns={exportCols} filename="child-debriefs" />
        </div>
      }
    >
      <div id="print-area">
        {/* summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold">{debriefsThisMonth}</p>
              <p className="text-xs text-muted-foreground">Debriefs This Month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className={cn("text-2xl font-bold", childLedPct >= 80 ? "text-green-600" : "text-amber-600")}>
                {childLedPct}%
              </p>
              <p className="text-xs text-muted-foreground">Child-Led (Ready)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className={cn("text-2xl font-bold", acceptsOutcomePct >= 80 ? "text-green-600" : "text-amber-600")}>
                {acceptsOutcomePct}%
              </p>
              <p className="text-xs text-muted-foreground">Accepts Outcome</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold">{avgDays}</p>
              <p className="text-xs text-muted-foreground">Avg. Days from Incident</p>
            </CardContent>
          </Card>
        </div>

        {/* tender banner */}
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm text-rose-900">
              <p className="font-semibold mb-1">A child&apos;s voice after an incident matters.</p>
              <p className="text-rose-800">
                These conversations are led by the child, at their pace, in the way that suits them — a walk, a drawing,
                visual cards, or with their advocate beside them. We listen first. We do not press for words that aren&apos;t
                ready. The aim is repair and understanding, never blame. Records here capture what the child shared and
                the small, real changes we have agreed in response.
              </p>
            </div>
          </div>
        </div>

        {/* filters / sort */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-[200px] h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debriefDate">Debrief date (newest)</SelectItem>
                <SelectItem value="incidentDate">Incident date (newest)</SelectItem>
                <SelectItem value="youngPerson">Young person (A–Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Select value={filterChild} onValueChange={setFilterChild}>
            <SelectTrigger className="w-[200px] h-8 text-sm">
              <SelectValue placeholder="All children" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All children</SelectItem>
              {uniqueChildren.map((yp) => (
                <SelectItem key={yp} value={yp}>{getYPName(yp)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterMethod} onValueChange={setFilterMethod}>
            <SelectTrigger className="w-[200px] h-8 text-sm">
              <SelectValue placeholder="All methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All methods</SelectItem>
              {(Object.keys(METHOD_META) as DebriefMethod[]).map((m) => (
                <SelectItem key={m} value={m}>{METHOD_META[m].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* debrief cards */}
        <div className="space-y-3">
          {filtered.map((r) => {
            const isOpen = expandedId === r.id;
            const MethodIcon = METHOD_META[r.debriefMethod].icon;
            const days = daysBetween(r.incidentDate, r.debriefDate);
            return (
              <Card
                key={r.id}
                className={cn(
                  "border-l-4",
                  r.childReadyToDebrief ? "border-l-rose-400" : "border-l-amber-400",
                )}
              >
                <CardHeader
                  className="pb-2 cursor-pointer"
                  onClick={() => setExpandedId(isOpen ? null : r.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                        <Sparkles className="h-4 w-4 text-rose-500" />
                        {getYPName(r.youngPerson)}
                        <Badge variant="outline" className={METHOD_META[r.debriefMethod].color}>
                          <MethodIcon className="h-3 w-3 mr-1" />
                          {METHOD_META[r.debriefMethod].label}
                        </Badge>
                        {r.childReadyToDebrief ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800">Child ready</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800">Adapted approach</Badge>
                        )}
                        {r.childAcceptsOutcome && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">Outcome accepted</Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Incident {r.incidentRef} · {r.incidentDate} → debrief {r.debriefDate} ({days} day{days === 1 ? "" : "s"} after) · with {getStaffName(r.debriefStaff)}
                      </p>
                    </div>
                    {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 mt-1" /> : <ChevronDown className="h-4 w-4 shrink-0 mt-1" />}
                  </div>
                </CardHeader>

                {isOpen && (
                  <CardContent className="pt-0 space-y-3 text-sm">
                    {/* readiness */}
                    <div className="bg-muted/40 rounded p-2">
                      <p className="font-medium text-xs mb-1 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Readiness Indicators
                      </p>
                      <p className="text-xs text-muted-foreground">{r.readinessIndicators}</p>
                    </div>

                    {/* child's account */}
                    <div className="bg-rose-50 border border-rose-200 rounded p-2">
                      <p className="font-medium text-xs text-rose-900 mb-1 flex items-center gap-1">
                        <MessageCircle className="h-3.5 w-3.5" /> Child&apos;s Account of What Happened
                      </p>
                      <p className="text-xs text-rose-900/90">{r.childAccountOfWhatHappened}</p>
                    </div>

                    {/* feelings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="bg-orange-50 border border-orange-200 rounded p-2">
                        <p className="font-medium text-xs text-orange-800 mb-1 flex items-center gap-1">
                          <Frown className="h-3.5 w-3.5" /> Feelings Before / During
                        </p>
                        <p className="text-xs text-orange-700">{r.childFeelingsBeforeDuring}</p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded p-2">
                        <p className="font-medium text-xs text-emerald-800 mb-1 flex items-center gap-1">
                          <Smile className="h-3.5 w-3.5" /> Feelings Now
                        </p>
                        <p className="text-xs text-emerald-700">{r.childFeelingsNow}</p>
                      </div>
                    </div>

                    {/* what they wish */}
                    <div className="bg-purple-50 border border-purple-200 rounded p-2">
                      <p className="font-medium text-xs text-purple-800 mb-1">What the Child Wishes Had Been Different</p>
                      <p className="text-xs text-purple-700">{r.whatChildWishesHadBeenDifferent}</p>
                    </div>

                    {/* what helped / didn't help */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="bg-green-50 border border-green-200 rounded p-2">
                        <p className="font-medium text-xs text-green-800 mb-1">What Helped</p>
                        <ul className="space-y-0.5">
                          {r.whatHelpedChild.map((item, i) => (
                            <li key={i} className="text-xs text-green-700 flex items-start gap-1">
                              <CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded p-2">
                        <p className="font-medium text-xs text-amber-800 mb-1">What Did Not Help</p>
                        <ul className="space-y-0.5">
                          {r.whatDidNotHelp.map((item, i) => (
                            <li key={i} className="text-xs text-amber-700 flex items-start gap-1">
                              <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* requests for future */}
                    <div className="bg-blue-50 border border-blue-200 rounded p-2">
                      <p className="font-medium text-xs text-blue-800 mb-1">Child&apos;s Requests for the Future</p>
                      <ul className="space-y-0.5">
                        {r.childRequestsForFuture.map((item, i) => (
                          <li key={i} className="text-xs text-blue-700 flex items-start gap-1">
                            <span className="text-blue-600 shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* apologies */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="bg-pink-50 border border-pink-200 rounded p-2">
                        <p className="font-medium text-xs text-pink-800 mb-1 flex items-center gap-1">
                          <HandHeart className="h-3.5 w-3.5" /> Apologies Offered (by child)
                        </p>
                        <p className="text-xs text-pink-700">{r.apologiesOffered}</p>
                      </div>
                      <div className="bg-pink-50 border border-pink-200 rounded p-2">
                        <p className="font-medium text-xs text-pink-800 mb-1 flex items-center gap-1">
                          <HandHeart className="h-3.5 w-3.5" /> Apologies Received (to child)
                        </p>
                        <p className="text-xs text-pink-700">{r.apologiesReceived}</p>
                      </div>
                    </div>

                    {/* repairs */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded p-2">
                      <p className="font-medium text-xs text-indigo-800 mb-1">Repairs Agreed</p>
                      <ul className="space-y-0.5">
                        {r.repairsAgreed.map((item, i) => (
                          <li key={i} className="text-xs text-indigo-700 flex items-start gap-1">
                            <CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5 text-indigo-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* support needed */}
                    <div>
                      <p className="font-medium text-xs mb-1">Support Needed Now</p>
                      <p className="text-xs text-muted-foreground">{r.supportNeededNow}</p>
                    </div>

                    {/* footer */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 border-t text-xs text-muted-foreground">
                      <span>Follow-up: <span className="font-medium text-foreground">{r.followUpDate}</span></span>
                      <span>Recorded by: <span className="font-medium text-foreground">{getStaffName(r.recordedBy)}</span></span>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* regulatory note */}
        <div className="mt-6 bg-muted/30 rounded-lg p-4 text-xs text-muted-foreground">
          <p className="font-semibold mb-1">Restorative Practice & Quality Standard 5</p>
          <p>
            The Children&apos;s Homes (England) Regulations 2015 — in particular Quality Standard 5 (Care Planning) and
            Quality Standard 3 (Protection of Children) — require that children are supported to express their views
            following any significant event, and that those views shape their care. Post-incident debriefs with children
            are held separately from staff debriefs and operate on restorative principles: the child leads the conversation,
            their pace is respected, and the focus is on understanding, repair, and forward planning rather than blame.
            Where a child is not yet ready to engage verbally, alternative methods (drawing, visual cards, walk-and-talk,
            written reflection, or advocacy support) are used. Records here are stored as part of the child&apos;s case file
            and reviewed at care plan reviews, behaviour support plan reviews, and where relevant by the Independent
            Reviewing Officer. Repairs agreed with the child must be tracked through to completion.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
