"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Eye,
  Brain,
  Lightbulb,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStaffName, getYPName } from "@/lib/seed-data";

/* ── types ─────────────────────────────────────────────────────────────────── */

type FocusArea =
  | "Child presentation"
  | "Family dynamics"
  | "Multi-agency working"
  | "Own assumptions"
  | "Risk assessment"
  | "Cultural awareness"
  | "Child voice";

interface CuriosityEntry {
  id: string;
  date: string;
  raisedBy: string;
  focusArea: FocusArea;
  aboutChild: string; // yp id, can be empty for general/team-level
  assumptionChallenged: string;
  originalNarrative: string;
  curiousQuestionRaised: string;
  evidenceConsidered: string[];
  alternativeExplanations: string[];
  wasInitialAssumptionWrong: boolean;
  revisedUnderstanding: string;
  actionsTaken: string[];
  outcomeImpact: string;
  childOutcomeImpact: string;
  widerLearning: string;
  discussedInSupervision: boolean;
  discussedInTeamMeeting: boolean;
  embeddedInPractice: string;
  reflectionPattern: string;
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const FOCUS_LABEL: Record<FocusArea, string> = {
  "Child presentation": "Child presentation",
  "Family dynamics": "Family dynamics",
  "Multi-agency working": "Multi-agency working",
  "Own assumptions": "Own assumptions",
  "Risk assessment": "Risk assessment",
  "Cultural awareness": "Cultural awareness",
  "Child voice": "Child voice",
};

const FOCUS_CLR: Record<FocusArea, string> = {
  "Child presentation": "bg-blue-100 text-blue-800",
  "Family dynamics": "bg-purple-100 text-purple-800",
  "Multi-agency working": "bg-indigo-100 text-indigo-800",
  "Own assumptions": "bg-amber-100 text-amber-800",
  "Risk assessment": "bg-red-100 text-red-800",
  "Cultural awareness": "bg-teal-100 text-teal-800",
  "Child voice": "bg-pink-100 text-pink-800",
};

const FOCUS_ICON: Record<FocusArea, typeof Eye> = {
  "Child presentation": Eye,
  "Family dynamics": Brain,
  "Multi-agency working": Sparkles,
  "Own assumptions": HelpCircle,
  "Risk assessment": ShieldAlert,
  "Cultural awareness": Lightbulb,
  "Child voice": HelpCircle,
};

/* ── seed data ─────────────────────────────────────────────────────────────── */

const SEED: CuriosityEntry[] = [
  {
    id: "pc1",
    date: d(-4),
    raisedBy: "staff_anna",
    focusArea: "Child presentation",
    aboutChild: "yp_jordan",
    assumptionChallenged:
      "That Jordan's reduced eating at evening meals was 'just a phase' or sensory-related to current menu.",
    originalNarrative:
      "Team had attributed Jordan's quieter, withdrawn presentation at the dinner table to autism-related sensory overload. Staff were modifying menus and reducing kitchen noise.",
    curiousQuestionRaised:
      "If this were sensory, why is it only at evening meals — when breakfast in a similar environment is fine? What changed for Jordan recently outside the home?",
    evidenceConsidered: [
      "Jordan's eating pattern shifted three weeks ago, coinciding with start of new term",
      "School reports noted Jordan eating alone in classroom rather than dining hall",
      "Bus driver mentioned Jordan moved seats twice in fortnight",
      "Jordan's tablet showed late-night searches about 'how to ignore people'",
    ],
    alternativeExplanations: [
      "School-based bullying or social exclusion",
      "Difficulty with a specific peer group rather than environment",
      "Internalised distress being expressed at the safer 'home' time of day",
    ],
    wasInitialAssumptionWrong: true,
    revisedUnderstanding:
      "Jordan was being targeted by a small group of older pupils on the bus and at lunch. The withdrawal at evening meals reflected residual emotional shutdown after carrying it all day. Sensory factors were a secondary, not primary, driver.",
    actionsTaken: [
      "Gentle, non-leading conversation with Jordan during a calm car journey",
      "Liaison with school SENCo and pastoral lead",
      "Bus seating reviewed with school transport",
      "Restorative meeting arranged at school with Jordan's consent",
      "Trauma-informed plan updated with social anxiety strand",
    ],
    outcomeImpact:
      "Bullying acknowledged by school and addressed within five working days. Jordan reported feeling 'believed for the first time'.",
    childOutcomeImpact:
      "Jordan resumed eating with the household within two weeks. Mood scores improved. School attendance protected. Trust in staff visibly strengthened.",
    widerLearning:
      "Behavioural changes that 'fit a known diagnosis' can mask separate, urgent issues. Diagnosis must never close the curiosity loop.",
    discussedInSupervision: true,
    discussedInTeamMeeting: true,
    embeddedInPractice:
      "Added 'second-explanation check' prompt to handover: when a behavioural change is attributed to existing diagnosis, staff must record at least one alternative hypothesis considered.",
    reflectionPattern:
      "Diagnostic overshadowing — the most common bias in residential care of disabled children.",
  },
  {
    id: "pc2",
    date: d(-11),
    raisedBy: "staff_darren",
    focusArea: "Family dynamics",
    aboutChild: "yp_alex",
    assumptionChallenged:
      "That Alex's father was a positive, cooperative parent and an obvious resource for contact and reunification planning.",
    originalNarrative:
      "Father attended every meeting, presented well, completed parenting course, agreed with all professional recommendations. Was widely described in records as 'engaged' and 'protective'.",
    curiousQuestionRaised:
      "Why does Alex consistently regulate worse for 48 hours after every contact with father, but better after contact with maternal grandmother — when father is the 'safer' parent on paper?",
    evidenceConsidered: [
      "Behaviour data showing post-contact dysregulation pattern over six months",
      "Mother's recent disclosure (during her own therapy) of historical coercive control",
      "Alex's drawing in art therapy showing father as a large figure and self as small",
      "Father's pattern of subtly correcting mother's account in joint meetings",
      "School noting Alex 'shrinks' physically when father collects",
    ],
    alternativeExplanations: [
      "Hidden coercive and controlling behaviour from father toward mother and children",
      "Alex experiencing fear-based compliance, not affection",
      "'Cooperative' presentation as a strategy of perpetrators in professional spaces",
    ],
    wasInitialAssumptionWrong: true,
    revisedUnderstanding:
      "Father's cooperation was a presentation strategy. Coercive control had been hidden in plain sight. Alex's nervous system was telling us what records had missed.",
    actionsTaken: [
      "Strategy discussion convened with social worker and IRO",
      "Contact with father suspended pending re-assessment under DASH framework",
      "Specialist domestic abuse assessment commissioned",
      "Mother offered IDVA support",
      "Alex offered child-focused support around relationships and safety",
    ],
    outcomeImpact:
      "Plan rewritten on accurate risk picture. IRO commended the home for the curiosity that surfaced this.",
    childOutcomeImpact:
      "Alex's post-contact dysregulation reduced significantly. Therapist reports increased emotional openness. Mother reports Alex now 'looks like himself' again.",
    widerLearning:
      "'Cooperative' is not the same as 'safe'. Professionals can be the audience for a performance. The child's body and behaviour are often the most honest data we have.",
    discussedInSupervision: true,
    discussedInTeamMeeting: true,
    embeddedInPractice:
      "Pre-contact and post-contact regulation observations now logged for every child in family time, with quarterly pattern review feeding into contact risk assessments.",
    reflectionPattern:
      "Professional optimism / 'rule of optimism' — repeatedly named in serious case reviews (Working Together 2023).",
  },
  {
    id: "pc3",
    date: d(-18),
    raisedBy: "staff_chervelle",
    focusArea: "Own assumptions",
    aboutChild: "yp_casey",
    assumptionChallenged:
      "That because Casey was quiet, polite and 'no trouble', she was emotionally okay.",
    originalNarrative:
      "Casey rarely sought staff attention, complied with routines, smiled appropriately, never raised concerns. Team had begun to spend disproportionately more time with louder, more dysregulated peers.",
    curiousQuestionRaised:
      "When did I last sit one-to-one with Casey for no reason at all? What does her quiet actually contain — calm, or shutdown?",
    evidenceConsidered: [
      "Key-work logs showed Casey received the least direct one-to-one time of the household",
      "Casey's sleep tracker showed broken sleep four nights a week",
      "Therapist had flagged 'fawn response' as Casey's primary trauma strategy",
      "Recent journal entry contained the line 'I'm fine I'm fine I'm fine'",
      "Weight had dropped subtly over two months",
    ],
    alternativeExplanations: [
      "Quiet as protective compliance, not contentment",
      "Internalising distress invisible to a busy team",
      "Staff bandwidth being captured by the most visible needs",
    ],
    wasInitialAssumptionWrong: true,
    revisedUnderstanding:
      "Casey's quiet was a survival strategy, not a state of wellbeing. The home had inadvertently rewarded it by reducing attention. Quiet was the symptom we were missing.",
    actionsTaken: [
      "Protected one-to-one time scheduled for Casey three times a week",
      "Key-work time minimums introduced for all young people, audited weekly",
      "Casey's plan updated to name fawn response explicitly",
      "Therapist session frequency reviewed",
      "Staff trained on internalising vs externalising distress",
    ],
    outcomeImpact:
      "Team practice shifted. Quiet young people are now actively sought out, not relied upon to be 'easy'.",
    childOutcomeImpact:
      "Casey began initiating conversation. Sleep improved. Weight stabilised. She told her keyworker, 'I didn't know you'd notice'.",
    widerLearning:
      "Compliance is not consent and quiet is not safe. Attention should be allocated by need, not by volume of presentation.",
    discussedInSupervision: true,
    discussedInTeamMeeting: true,
    embeddedInPractice:
      "Weekly 'quietest child check' added to team meeting agenda — naming the young person who had the least staff time that week and what we will do about it.",
    reflectionPattern:
      "Squeaky wheel bias — the loudest need crowds out the deepest.",
  },
  {
    id: "pc4",
    date: d(-25),
    raisedBy: "staff_ryan",
    focusArea: "Risk assessment",
    aboutChild: "yp_jordan",
    assumptionChallenged:
      "That the older youths Jordan met at the skate park were 'just friends' and the friendship was a positive social development.",
    originalNarrative:
      "Jordan, who has historically struggled to make peer connections, had begun spending afternoons with a group of 17-19 year olds. Staff had welcomed this as 'finally finding his tribe'.",
    curiousQuestionRaised:
      "Why are 18-year-olds choosing to spend three afternoons a week with a 14-year-old? What do they get from this friendship that an age-equivalent peer would not provide?",
    evidenceConsidered: [
      "Age gap and one-directional pattern of contact (they pick him up, he doesn't go to them)",
      "New unexplained items appearing in Jordan's room (vape, branded trainers)",
      "Jordan's phone showing unsaved numbers and disappearing messages",
      "Jordan's protectiveness when staff asked basic questions about the group",
      "MACE / contextual safeguarding intelligence noted similar pattern at neighbouring authority",
    ],
    alternativeExplanations: [
      "Grooming and exploitation, with the friendship as the entry point",
      "County-lines style associative recruitment",
      "Jordan being used to access spaces or carry items",
    ],
    wasInitialAssumptionWrong: true,
    revisedUnderstanding:
      "This was not a friendship. It was the recognisable early-stage pattern of child criminal exploitation. The age gap was the warning, not an incidental detail.",
    actionsTaken: [
      "Contextual safeguarding referral made same day",
      "Information shared with police missing / exploitation team",
      "MACE-style mapping commissioned for the skate park location",
      "Jordan offered exploitation-aware support worker (avoiding shaming language)",
      "Disruption activity planned with police licensing team",
    ],
    outcomeImpact:
      "Two of the older youths were already known to exploitation services. Disruption work commenced. Other young people in the area also protected.",
    childOutcomeImpact:
      "Jordan kept safe without losing trust in staff. Conversation reframed as 'we worry because we care, not because you're bad'. He has since made an age-appropriate friend at the youth club.",
    widerLearning:
      "Exploitation rarely arrives advertised as exploitation. It arrives as friendship, belonging, identity. Curiosity about age gaps is a safeguarding duty, not a social judgment.",
    discussedInSupervision: true,
    discussedInTeamMeeting: true,
    embeddedInPractice:
      "Any peer relationship with a 3+ year age gap now triggers a contextual safeguarding screening conversation in the next handover, regardless of how the relationship presents.",
    reflectionPattern:
      "Normalisation bias in contextual safeguarding — friendships as the disguise.",
  },
  {
    id: "pc5",
    date: d(-33),
    raisedBy: "staff_edward",
    focusArea: "Multi-agency working",
    aboutChild: "yp_alex",
    assumptionChallenged:
      "That the secondary school's framing of Alex as 'difficult, defiant and a behaviour problem' was an objective account that staff should accept and work with.",
    originalNarrative:
      "School issued repeated isolation sanctions and was moving toward managed move. Several professionals had begun to mirror the school's language in meetings.",
    curiousQuestionRaised:
      "Whose voice is missing from this account? What does the same behaviour look like described by someone who knows Alex's trauma history rather than someone managing a classroom of 30?",
    evidenceConsidered: [
      "Pattern of incidents clustered around supply teachers and specific lesson types",
      "No incidents in subjects with relational, trauma-aware staff",
      "School EHCP review three years overdue",
      "Alex's account: 'They shout and I freeze and then I get angry that I froze'",
      "Therapist's note that Alex's 'defiance' is dorsal-vagal shutdown misread as refusal",
    ],
    alternativeExplanations: [
      "Behaviour as communication of unmet SEN need",
      "School environment retraumatising rather than supporting",
      "'Difficult' as a frame that benefits the system, not the child",
    ],
    wasInitialAssumptionWrong: true,
    revisedUnderstanding:
      "Alex was not 'a difficult child'. He was a traumatised child in an environment that had run out of strategies. The 'difficulty' was a system gap projected onto the young person.",
    actionsTaken: [
      "Formal advocacy at next professionals meeting reframing the picture",
      "EHCP statutory review demanded and dates secured",
      "Trauma-informed teaching profile shared with all of Alex's teachers",
      "Independent advocate appointed for Alex",
      "Managed move paused pending reassessment",
    ],
    outcomeImpact:
      "Language across the network shifted from 'behaviour' to 'need'. Managed move avoided. School committed to two relational interventions.",
    childOutcomeImpact:
      "Alex described feeling 'on his side for the first time'. Exclusions reduced from weekly to nil over a half term. Attendance climbed.",
    widerLearning:
      "We are advocates, not echoes. Children in care are uniquely vulnerable to having a single professional narrative harden into 'truth' across a network. Curiosity is the antidote.",
    discussedInSupervision: true,
    discussedInTeamMeeting: true,
    embeddedInPractice:
      "Before any external meeting we now ask: whose framing dominates this child's record, and what is missing? The answer goes into the briefing note.",
    reflectionPattern:
      "Confirmation bias across professional networks — labels travel faster than evidence.",
  },
  {
    id: "pc6",
    date: d(-46),
    raisedBy: "staff_darren",
    focusArea: "Own assumptions",
    aboutChild: "",
    assumptionChallenged:
      "That my own irritation in response to one young person's challenging behaviour was a neutral, professional reaction — not a clue about me.",
    originalNarrative:
      "I had noticed I was consistently more clipped, less playful and quicker to apply consequences with one specific young person, while extending grace to others for similar behaviour. I had told myself this was 'firm boundaries'.",
    curiousQuestionRaised:
      "Is this firm boundary-setting, or is something in this child activating something in me? Whose distress am I actually responding to in the moment — theirs or mine?",
    evidenceConsidered: [
      "Pattern in my own logs: shorter scripts, faster sanctions for this young person",
      "Body sensation noticed in supervision — tightening when his name came up on rota",
      "His presentation echoes a difficult dynamic from my own earlier career",
      "Other staff describing the young person warmly — different child, same behaviour, different response",
    ],
    alternativeExplanations: [
      "Countertransference — my history showing up in the present",
      "Burnout-adjacent compassion narrowing",
      "An unconscious bias I had not interrogated",
    ],
    wasInitialAssumptionWrong: true,
    revisedUnderstanding:
      "This was not about boundaries. It was about me. The young person was meeting an unexamined part of my own story, and he was the one paying for it.",
    actionsTaken: [
      "Took it to clinical supervision rather than only managerial supervision",
      "Co-regulation work with myself before shifts including this young person",
      "Intentionally rebalanced my one-to-one time with him",
      "Asked a colleague to gently flag if my tone shortened with him in the moment",
      "Reflected in writing weekly until the reaction softened",
    ],
    outcomeImpact:
      "My response evened out across the team. Modelled to staff that leaders examine their own reactions, not just manage others'.",
    childOutcomeImpact:
      "Young person's relationship with me visibly warmed. He commented, 'you're nicer now'. He did not need to know why — he just needed it to change.",
    widerLearning:
      "Children do not get to choose the staff who shape them. Our self-awareness is a safeguarding intervention. The most dangerous bias is the one we are sure we don't have.",
    discussedInSupervision: true,
    discussedInTeamMeeting: false,
    embeddedInPractice:
      "Manager-level practice: a standing supervision question — 'Which young person are you finding hardest right now, and what might that be telling you about yourself?'",
    reflectionPattern:
      "Countertransference and unexamined bias — the practitioner as variable, not constant.",
  },
];

/* ── component ─────────────────────────────────────────────────────────────── */

export default function ProfessionalCuriosityLogPage() {
  const [data] = useState<CuriosityEntry[]>(SEED);
  const [search, setSearch] = useState("");
  const [focusFilter, setFocusFilter] = useState("all");
  const [staffFilter, setStaffFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId(expandedId === id ? null : id);
  const staffIds = [...new Set(data.map((r) => r.raisedBy))];

  const filtered = useMemo(() => {
    let out = [...data];
    if (search) {
      const s = search.toLowerCase();
      out = out.filter(
        (r) =>
          r.assumptionChallenged.toLowerCase().includes(s) ||
          r.curiousQuestionRaised.toLowerCase().includes(s) ||
          getStaffName(r.raisedBy).toLowerCase().includes(s) ||
          (r.aboutChild && getYPName(r.aboutChild).toLowerCase().includes(s))
      );
    }
    if (focusFilter !== "all") out = out.filter((r) => r.focusArea === focusFilter);
    if (staffFilter !== "all") out = out.filter((r) => r.raisedBy === staffFilter);
    out.sort((a, b) =>
      sortBy === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
    );
    return out;
  }, [data, search, focusFilter, staffFilter, sortBy]);

  const quarterStart = d(-90);
  const entriesThisQuarter = data.filter((r) => r.date >= quarterStart).length;
  const assumptionsRevised = data.filter((r) => r.wasInitialAssumptionWrong).length;
  const outcomesImproved = data.filter((r) => r.childOutcomeImpact.trim().length > 0).length;
  const embeddedLearnings = data.filter((r) => r.embeddedInPractice.trim().length > 0).length;

  const exportCols: ExportColumn<CuriosityEntry>[] = useMemo(
    () => [
      { header: "Date", accessor: (r: CuriosityEntry) => r.date },
      { header: "Raised By", accessor: (r: CuriosityEntry) => getStaffName(r.raisedBy) },
      { header: "Focus Area", accessor: (r: CuriosityEntry) => r.focusArea },
      {
        header: "About Child",
        accessor: (r: CuriosityEntry) => (r.aboutChild ? getYPName(r.aboutChild) : "General / team"),
      },
      { header: "Assumption Challenged", accessor: (r: CuriosityEntry) => r.assumptionChallenged },
      { header: "Curious Question", accessor: (r: CuriosityEntry) => r.curiousQuestionRaised },
      {
        header: "Initial Assumption Wrong?",
        accessor: (r: CuriosityEntry) => (r.wasInitialAssumptionWrong ? "Yes" : "No"),
      },
      { header: "Revised Understanding", accessor: (r: CuriosityEntry) => r.revisedUnderstanding },
      {
        header: "Actions Taken",
        accessor: (r: CuriosityEntry) => r.actionsTaken.join("; "),
      },
      { header: "Outcome Impact", accessor: (r: CuriosityEntry) => r.outcomeImpact },
      { header: "Child Outcome Impact", accessor: (r: CuriosityEntry) => r.childOutcomeImpact },
      { header: "Wider Learning", accessor: (r: CuriosityEntry) => r.widerLearning },
      {
        header: "Supervision",
        accessor: (r: CuriosityEntry) => (r.discussedInSupervision ? "Yes" : "No"),
      },
      {
        header: "Team Meeting",
        accessor: (r: CuriosityEntry) => (r.discussedInTeamMeeting ? "Yes" : "No"),
      },
      { header: "Embedded In Practice", accessor: (r: CuriosityEntry) => r.embeddedInPractice },
      { header: "Reflection Pattern", accessor: (r: CuriosityEntry) => r.reflectionPattern },
    ],
    []
  );

  return (
    <PageShell
      title="Professional Curiosity Log"
      subtitle="Reflective practice — challenging our assumptions about children, families, professionals and ourselves"
      actions={[
        <PrintButton key="p" title="Professional Curiosity Log" />,
        <ExportButton
          key="e"
          data={filtered}
          columns={exportCols}
          filename="professional-curiosity-log"
        />,
      ]}
    >
      <div id="print-area" className="space-y-6">
        {/* summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Entries this quarter",
              value: entriesThisQuarter,
              icon: Brain,
              colour: "text-blue-600",
            },
            {
              label: "Assumptions revised",
              value: assumptionsRevised,
              icon: HelpCircle,
              colour: "text-amber-600",
            },
            {
              label: "Outcomes improved",
              value: outcomesImproved,
              icon: CheckCircle2,
              colour: "text-green-600",
            },
            {
              label: "Embedded learnings",
              value: embeddedLearnings,
              icon: Lightbulb,
              colour: "text-purple-600",
            },
          ].map((s) => (
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

        {/* philosophy banner */}
        <div className="rounded-lg border border-indigo-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="h-6 w-6 text-indigo-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-base md:text-lg font-semibold text-indigo-900">
                &ldquo;Professional curiosity is the most powerful safeguarding tool we have.&rdquo;
              </p>
              <p className="text-xs text-indigo-800/80">
                Named in Working Together 2023 and Quality Standard 5. Repeatedly identified in
                serious case reviews as the practice that, when missing, costs children dearly —
                and when present, changes lives.
              </p>
            </div>
          </div>
        </div>

        {/* filters / sort */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <Label className="text-xs">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-8"
                    placeholder="Assumption, question, staff, child…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-52">
                <Label className="text-xs flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  Focus area
                </Label>
                <Select value={focusFilter} onValueChange={setFocusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All focus areas</SelectItem>
                    {(Object.keys(FOCUS_LABEL) as FocusArea[]).map((k) => (
                      <SelectItem key={k} value={k}>
                        {FOCUS_LABEL[k]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-44">
                <Label className="text-xs">Raised by</Label>
                <Select value={staffFilter} onValueChange={setStaffFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All staff</SelectItem>
                    {staffIds.map((id) => (
                      <SelectItem key={id} value={id}>
                        {getStaffName(id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-36">
                <Label className="text-xs flex items-center gap-1">
                  <ArrowUpDown className="h-3 w-3" />
                  Sort
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* expandable card list */}
        <div className="space-y-3">
          {filtered.map((r) => {
            const open = expandedId === r.id;
            const Icon = FOCUS_ICON[r.focusArea];
            return (
              <Card key={r.id}>
                <button
                  className="w-full text-left"
                  onClick={() => toggle(r.id)}
                  aria-expanded={open}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-wrap">
                        <Icon className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                          <CardTitle className="text-base leading-snug">
                            {r.assumptionChallenged}
                          </CardTitle>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={cn("text-xs", FOCUS_CLR[r.focusArea])}>
                              {r.focusArea}
                            </Badge>
                            {r.aboutChild ? (
                              <Badge variant="outline" className="text-xs">
                                {getYPName(r.aboutChild)}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                General / team
                              </Badge>
                            )}
                            {r.wasInitialAssumptionWrong && (
                              <Badge className="text-xs bg-amber-100 text-amber-800">
                                Assumption revised
                              </Badge>
                            )}
                            {r.discussedInSupervision && (
                              <Badge className="text-xs bg-purple-100 text-purple-800">
                                Supervision
                              </Badge>
                            )}
                            {r.discussedInTeamMeeting && (
                              <Badge className="text-xs bg-indigo-100 text-indigo-800">
                                Team meeting
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {r.date} · {getStaffName(r.raisedBy)}
                        </span>
                        {open ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </button>
                {open && (
                  <CardContent className="space-y-3 pt-0">
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                      <p className="text-xs font-semibold text-slate-700 mb-1">
                        Original narrative
                      </p>
                      <p className="text-sm text-slate-900">{r.originalNarrative}</p>
                    </div>
                    <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-3">
                      <p className="text-xs font-semibold text-indigo-800 mb-1">
                        The curious question raised
                      </p>
                      <p className="text-sm text-indigo-900 italic">
                        &ldquo;{r.curiousQuestionRaised}&rdquo;
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                        <p className="text-xs font-semibold text-blue-800 mb-1">
                          Evidence considered
                        </p>
                        <ul className="list-disc list-inside text-sm text-blue-900 space-y-0.5">
                          {r.evidenceConsidered.map((e, i) => (
                            <li key={i}>{e}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                        <p className="text-xs font-semibold text-amber-800 mb-1">
                          Alternative explanations
                        </p>
                        <ul className="list-disc list-inside text-sm text-amber-900 space-y-0.5">
                          {r.alternativeExplanations.map((e, i) => (
                            <li key={i}>{e}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                      <p className="text-xs font-semibold text-emerald-800 mb-1">
                        Revised understanding
                      </p>
                      <p className="text-sm text-emerald-900">{r.revisedUnderstanding}</p>
                    </div>
                    <div className="rounded-lg bg-purple-50 border border-purple-200 p-3">
                      <p className="text-xs font-semibold text-purple-800 mb-1">Actions taken</p>
                      <ul className="list-disc list-inside text-sm text-purple-900 space-y-0.5">
                        {r.actionsTaken.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-lg bg-teal-50 border border-teal-200 p-3">
                        <p className="text-xs font-semibold text-teal-800 mb-1">
                          Outcome / impact (system)
                        </p>
                        <p className="text-sm text-teal-900">{r.outcomeImpact}</p>
                      </div>
                      <div className="rounded-lg bg-pink-50 border border-pink-200 p-3">
                        <p className="text-xs font-semibold text-pink-800 mb-1">
                          Child outcome / impact
                        </p>
                        <p className="text-sm text-pink-900">{r.childOutcomeImpact}</p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                      <p className="text-xs font-semibold text-yellow-800 mb-1">Wider learning</p>
                      <p className="text-sm text-yellow-900">{r.widerLearning}</p>
                    </div>
                    <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-3">
                      <p className="text-xs font-semibold text-indigo-800 mb-1">
                        Embedded in practice
                      </p>
                      <p className="text-sm text-indigo-900">{r.embeddedInPractice}</p>
                    </div>
                    <div className="text-xs text-muted-foreground pt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <span>
                        <span className="font-medium">Reflection pattern:</span>{" "}
                        {r.reflectionPattern}
                      </span>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No curiosity entries match the current filters.
              </CardContent>
            </Card>
          )}
        </div>

        {/* regulatory note */}
        <div className="rounded-lg bg-muted/40 border p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold">Regulatory framework</p>
          <p>
            Professional curiosity is a named requirement under Working Together to Safeguard
            Children 2023 and Quality Standard 5 (Care planning) of the Children&apos;s Homes
            (England) Regulations. It is repeatedly identified in serious case reviews and Local
            Child Safeguarding Practice Reviews as a practice whose absence contributed to harm.
            This log evidences how the home actively challenges its own assumptions and embeds the
            resulting learning in day-to-day practice, supervision and team meetings.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
