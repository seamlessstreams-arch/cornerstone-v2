"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Award,
  ArrowUpDown,
  Search,
  Users,
  Sparkles,
  Calendar,
  Heart,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { cn } from "@/lib/utils";
import { getYPName, getStaffName } from "@/lib/seed-data";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

/* ── types ─────────────────────────────────────────────────────────────── */

type Expertise =
  | "Care planning advice"
  | "Staff training contribution"
  | "Recruitment panel"
  | "Policy co-production"
  | "Service improvement input"
  | "Inspection contribution"
  | "External speaking"
  | "Mentoring younger child"
  | "Research participation";

interface ExpertEntry {
  id: string;
  date: string;
  youngPersonExpert: string;
  expertise: Expertise;
  context: string;
  contribution: string;
  audience: string;
  preparation: string;
  accommodations: string[];
  childMotivation: string;
  childReflection: string;
  impactRecorded: string;
  recognitionGiven: string;
  tokenOfThanks: string;
  longTermLearning: string;
  reviewedBy: string;
}

/* ── seed ──────────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const SEED: ExpertEntry[] = [
  {
    id: "exp1",
    date: d(-7),
    youngPersonExpert: "yp_alex",
    expertise: "Recruitment panel",
    context: "Two new residential support worker posts being recruited. Alex volunteered to be part of the children's interview panel after the role was explained at house meeting.",
    contribution: "Alex sat on a young people's panel alongside a peer from another home. He asked all four candidates the same three questions he had drafted himself: 'What would you do if I told you I didn't want to talk to you today?', 'How do you handle it when you make a mistake?', and 'What does a good day at work look like for you?' Alex scored each candidate on a simple 1–3 traffic-light sheet and gave verbal feedback to the RM after the interviews. His feedback flagged one candidate as 'felt scripted' and that score weighed in the final decision.",
    audience: "RM, two interview candidates per session, HR colleague from head office, peer panellist from sister home",
    preparation: "Alex was offered the chance two weeks in advance. Key worker (Ryan) sat with him three times to draft his questions, practise asking them aloud, and talk through what made a 'good' or 'concerning' answer. Alex was told he could pull out at any point and that there would be no pressure to give a particular score.",
    accommodations: [
      "Questions written on cue card so Alex could read rather than memorise",
      "Five minute break between each candidate",
      "Soft drink and snacks in the room",
      "Sat next to peer panellist rather than alone",
      "Permission to step out without explanation if overwhelmed",
    ],
    childMotivation: "I want the next staff to be people who actually listen, not people who just say they listen. I've had both kinds and I know the difference.",
    childReflection: "It was harder than I thought. The second candidate gave a really good answer to my mistake question and I could tell she was being honest. I feel proud that my score actually counted.",
    impactRecorded: "One of the two appointed candidates was Alex's top-scored applicant. RM noted in the recruitment file that the children's panel changed her view of one candidate she had been minded to appoint. Process to be repeated at next recruitment round.",
    recognitionGiven: "Thank-you certificate signed by RM and HR lead, kept in Alex's memory box folder. Mentioned by name (with his permission) in the staff team meeting minutes.",
    tokenOfThanks: "£15 voucher of his choice (chose a games store voucher) and a takeaway of his choice for the house that night.",
    longTermLearning: "Children's panel to become standard part of recruitment for all child-facing roles. Question bank Alex helped draft will be offered as a starting point to future young panellists, who can adapt or replace.",
    reviewedBy: "staff_darren",
  },
  {
    id: "exp2",
    date: d(-21),
    youngPersonExpert: "yp_jordan",
    expertise: "Staff training contribution",
    context: "Annual full-team training day on 'Restraint, restriction and dignity'. Jordan asked at a house meeting whether they could 'tell staff what it actually feels like'.",
    contribution: "Jordan recorded a 6-minute audio piece (with their face hidden, voice unaltered) describing what a previous physical intervention had felt like at a former placement, what staff had got wrong, and the two things a member of staff later did that helped repair the relationship. Jordan chose what to include and what to leave out. The recording was played at the start of the training day and Jordan's written reflection was distributed as a handout.",
    audience: "Full Oak House staff team (12 staff), training facilitator, deputy manager",
    preparation: "Three sessions with key worker (Ryan) and the home's therapeutic lead to plan the recording. Jordan had full editorial control and the right to scrap the recording at any point up to the morning of the training. A trauma-informed practitioner reviewed the plan to check it would not be re-traumatising.",
    accommodations: [
      "Audio rather than live presentation, so Jordan did not have to be in the room",
      "Recording made in their bedroom on their own phone",
      "Right to listen back and re-record any section",
      "Veto over any section before sharing",
      "Therapeutic check-in scheduled for the same evening",
    ],
    childMotivation: "Staff get trained on the law and the holds, but they don't always get trained on what it does to your head afterwards. I wanted them to hear that bit.",
    childReflection: "I was nervous all day even though I wasn't there. Ryan came and told me afterwards that two staff cried. I don't want them to feel bad — I want them to remember.",
    impactRecorded: "Training feedback forms (anonymous): 11 of 12 staff cited Jordan's contribution as the most impactful part of the day. Two staff requested follow-up reflective supervision. Home's post-incident debrief template updated to add a 'repair' section directly inspired by Jordan's two examples.",
    recognitionGiven: "Personal hand-written thank-you from each staff member, collected into a small folder for Jordan (Jordan asked to see them only when ready — opened them three days later with key worker).",
    tokenOfThanks: "£25 voucher and a meal out with their key worker.",
    longTermLearning: "Restraint training day will, going forward, always include a young person voice element where a child volunteers — never as a requirement. Recording will not be re-used without Jordan's renewed consent each time.",
    reviewedBy: "staff_darren",
  },
  {
    id: "exp3",
    date: d(-45),
    youngPersonExpert: "yp_casey",
    expertise: "Policy co-production",
    context: "Home's mobile phone and online safety policy due for review. Casey, approaching 18 and articulate about digital rights, was invited to co-produce the new draft.",
    contribution: "Casey worked across four sessions with the deputy manager to rewrite the policy in plain language and reorganise it under 'What you can expect from us / What we ask of you' headings. Casey added a whole new section called 'When we get it wrong' covering how a child can challenge a phone restriction. Casey also pushed back on the original draft's blanket overnight phone removal — the final policy now allows a negotiated bedtime hand-in time per child, which Casey argued was more proportionate.",
    audience: "Deputy manager, RM, all current children (via house meeting consultation), Responsible Individual signing off final version",
    preparation: "Casey was given the existing policy two weeks ahead and asked to mark it up. Deputy manager talked through the legal framework (Quality Standards, UNCRC Article 16) so Casey was working with the same context as adult drafters.",
    accommodations: [
      "Sessions held in the kitchen over hot chocolate rather than in the office",
      "All drafts shared digitally so Casey could mark up in their own time",
      "Free to disagree with the deputy manager without it affecting their care",
      "Final draft read aloud together to check it still made sense to a child",
    ],
    childMotivation: "Policies usually get written about us, not with us. If I can leave one thing better for the next kid coming in, that's worth doing.",
    childReflection: "I feel like a grown-up doing this, but in a good way. I changed bits that mattered and they actually kept my changes in.",
    impactRecorded: "New policy adopted in full, including all of Casey's substantive amendments. Policy now opens with a one-page child-facing summary written by Casey. Approach to be replicated for the bedtime routines policy next quarter.",
    recognitionGiven: "Casey credited by name (with consent) on the policy footer as co-author. Letter of thanks from the Responsible Individual.",
    tokenOfThanks: "£40 honorarium recognising the depth of work, plus printed and bound copy of the final policy with their name on the cover.",
    longTermLearning: "Every child-facing policy will now include a 'co-produced with' line if a child has materially shaped it, or a clear statement of consultation if not. Honorarium scale for policy co-production formally added to the home's participation budget.",
    reviewedBy: "staff_darren",
  },
  {
    id: "exp4",
    date: d(-62),
    youngPersonExpert: "yp_alex",
    expertise: "Inspection contribution",
    context: "Ofsted full inspection of the home. Inspector requested confidential time with each child who consented.",
    contribution: "Alex chose to meet the inspector for 25 minutes in his bedroom (his choice of location). He answered honestly about what was working and what wasn't, and brought to the conversation a list of three things he'd written down in advance: the food rota, the way sanctions felt sometimes, and that he wished there was more to do at weekends. Alex also showed the inspector his bedroom personalisation and his memory box.",
    audience: "Ofsted inspector (one to one)",
    preparation: "RM explained the inspection process two weeks before and again the day before. Alex was reminded he could decline, could end the meeting at any time, and that nothing he said would be used against him. Advocate (NYAS) was offered and Alex declined, saying he was happy to speak alone.",
    accommodations: [
      "Choice of location in the home",
      "Choice of time of day (Alex chose mid-morning)",
      "Reminded he could pause or stop",
      "Key worker available next door if Alex wanted them mid-conversation",
      "Debrief offered immediately after — Alex chose to debrief two days later",
    ],
    childMotivation: "If I don't say what's actually going on, then who does? The inspector can't read my mind.",
    childReflection: "She really listened. She wrote stuff down. I think I said the food thing better than I usually do. I don't know what she'll write but I told her the truth.",
    impactRecorded: "Final Ofsted report quoted (anonymously) Alex's feedback on weekend activities; the home's activity offer has since been rebuilt with weekend variety as a focus. Food rota now rotates child-choice meals weekly — directly linked to Alex's input.",
    recognitionGiven: "RM thanked Alex in person the day after the inspection regardless of the eventual judgement. Alex's contribution acknowledged in the post-inspection action plan.",
    tokenOfThanks: "Cinema trip of his choice with key worker.",
    longTermLearning: "Pre-inspection child preparation pack now includes a 'things you might want to write down' template, developed from Alex's approach of bringing notes.",
    reviewedBy: "staff_darren",
  },
  {
    id: "exp5",
    date: d(-110),
    youngPersonExpert: "former_resident_sam",
    expertise: "Mentoring younger child",
    context: "Sam, a former resident now aged 19 and living independently, returned (with consent on both sides) to mentor Jordan in the first weeks after Jordan's admission. Sam had lived at Oak House between 16 and 18.",
    contribution: "Sam visited the home three times across six weeks, met Jordan informally over food, and was honest about what they had found hard at the start of their own placement. Sam stressed that 'it gets easier' and gave Jordan a few practical survival tips (asking for the laundry rota up front, knowing where the quiet space is). Sam also met with the staff team briefly to share what had helped them settle.",
    audience: "Jordan (one to one), staff team (group session)",
    preparation: "Discussion between Sam, Sam's PA, and the RM about boundaries and what Sam felt comfortable sharing. Jordan was asked first whether they wanted a peer mentor and chose to accept. Safeguarding check completed on Sam's return visits.",
    accommodations: [
      "Visits in informal spaces (kitchen, garden)",
      "No requirement to commit to a number of sessions",
      "Clear that Sam was a guest, not a staff member, and not in charge of Jordan's care",
      "Sam free to say no to any visit without explanation",
    ],
    childMotivation: "When I left I said if it ever helps anyone I'd come back. Jordan's first weeks looked like mine did. I just wanted them to know it doesn't stay like that.",
    childReflection: "Talking to Sam was different because they actually got it. Staff are good but they didn't live here. Sam did.",
    impactRecorded: "Jordan settled markedly faster than the home's average for new admissions; Jordan's key worker links this in part to the peer mentor relationship. Care-experienced peer mentoring scheme being formalised with a small named pool of former residents who have offered to be on call.",
    recognitionGiven: "Sam thanked formally by RM and given a written reference for use in any future care or youth work role they apply for.",
    tokenOfThanks: "Travel costs reimbursed in full, meal provided each visit, and a £20 voucher per visit recognising their time as professional contribution.",
    longTermLearning: "Peer mentoring by former residents is being added to the admissions pathway as an option, never an expectation. Boundaries protocol drafted with input from Sam.",
    reviewedBy: "staff_darren",
  },
  {
    id: "exp6",
    date: d(-180),
    youngPersonExpert: "yp_jordan",
    expertise: "Service improvement input",
    context: "Jordan repeatedly raised at house meetings that the bedtime routines policy felt 'one-size-fits-all'. RM invited Jordan to lead a small piece of service improvement on this.",
    contribution: "Jordan ran a short, anonymous survey of all three children in the home (with help from key worker Ryan) and produced a one-page summary of what each child wanted from a bedtime routine. Jordan presented this at a staff meeting, in person, with Ryan beside them. Jordan's specific recommendation — that bedtime should be a window rather than a fixed time, agreed individually — was adopted.",
    audience: "Full staff team at monthly team meeting, RM, deputy manager",
    preparation: "Two planning sessions with Ryan to design the survey questions, practise the presentation, and rehearse what to do if a staff member disagreed. Jordan was given the option of presenting via video instead but chose to attend in person.",
    accommodations: [
      "Ryan presented alongside, so Jordan was not on their own",
      "Slides printed in front of Jordan as a prompt",
      "Clear time limit (10 minutes) so Jordan knew the end point",
      "Permission to stop and have Ryan finish if needed",
      "Quiet hour booked in afterwards",
    ],
    childMotivation: "I'm not bad for not wanting to be in bed at 10. I just wanted staff to actually hear that there are different reasons for different kids.",
    childReflection: "Standing up there was scary but they took notes. The next week the policy actually changed. That's never happened to me before — me saying something and it changing.",
    impactRecorded: "Bedtime routines policy formally amended within four weeks. Each child now has an individually agreed bedtime window recorded in their care plan. Jordan's survey method has since been re-used for two other small service improvement pieces (snack rota, weekend activities).",
    recognitionGiven: "RM read out Jordan's contribution at the next house meeting (with consent) and thanked them in front of peers. Logged on Jordan's strengths record.",
    tokenOfThanks: "£15 voucher and a takeaway of Jordan's choice the same evening.",
    longTermLearning: "Children-led service improvement is now a standing item once a quarter at house meetings. Any child wanting to lead a piece is offered preparation support and a small honorarium.",
    reviewedBy: "staff_anna",
  },
];

/* ── constants ─────────────────────────────────────────────────────────── */

const EXPERTISE_OPTIONS: Expertise[] = [
  "Care planning advice",
  "Staff training contribution",
  "Recruitment panel",
  "Policy co-production",
  "Service improvement input",
  "Inspection contribution",
  "External speaking",
  "Mentoring younger child",
  "Research participation",
];

const EXPERTISE_COLOUR: Record<Expertise, string> = {
  "Care planning advice":         "bg-blue-100 text-blue-700",
  "Staff training contribution":  "bg-purple-100 text-purple-700",
  "Recruitment panel":            "bg-green-100 text-green-700",
  "Policy co-production":         "bg-amber-100 text-amber-700",
  "Service improvement input":    "bg-teal-100 text-teal-700",
  "Inspection contribution":      "bg-indigo-100 text-indigo-700",
  "External speaking":            "bg-rose-100 text-rose-700",
  "Mentoring younger child":      "bg-pink-100 text-pink-700",
  "Research participation":       "bg-cyan-100 text-cyan-700",
};

const expertDisplay = (id: string) => {
  if (id.startsWith("yp_")) return getYPName(id);
  if (id.startsWith("former_resident_")) {
    const name = id.replace("former_resident_", "");
    return `${name.charAt(0).toUpperCase()}${name.slice(1)} (former resident)`;
  }
  return id;
};

/* ── component ─────────────────────────────────────────────────────────── */

export default function ChildrenAsExpertsPage() {
  const [data] = useState<ExpertEntry[]>(SEED);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterExpertise, setFilterExpertise] = useState("all");
  const [filterChild, setFilterChild] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const stats = useMemo(() => {
    const ninetyDaysAgo = d(-90);
    const byType: Record<string, number> = {};
    data.forEach((r) => {
      byType[r.expertise] = (byType[r.expertise] || 0) + 1;
    });
    return {
      total: data.length,
      byType,
      typeCount: Object.keys(byType).length,
      contributors: new Set(data.map((r) => r.youngPersonExpert)).size,
      recent: data.filter((r) => r.date >= ninetyDaysAgo).length,
    };
  }, [data]);

  const filtered = useMemo(() => {
    let list = [...data];
    if (filterExpertise !== "all") list = list.filter((r) => r.expertise === filterExpertise);
    if (filterChild !== "all") list = list.filter((r) => r.youngPersonExpert === filterChild);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.context.toLowerCase().includes(q) ||
          r.contribution.toLowerCase().includes(q) ||
          r.audience.toLowerCase().includes(q) ||
          r.impactRecorded.toLowerCase().includes(q),
      );
    }
    list.sort((a, b) => {
      switch (sortBy) {
        case "expertise": return a.expertise.localeCompare(b.expertise);
        case "child":     return expertDisplay(a.youngPersonExpert).localeCompare(expertDisplay(b.youngPersonExpert));
        default:          return b.date.localeCompare(a.date);
      }
    });
    return list;
  }, [data, filterExpertise, filterChild, search, sortBy]);

  const exportCols: ExportColumn<ExpertEntry>[] = [
    { header: "Date",              accessor: (r: ExpertEntry) => r.date },
    { header: "Child",             accessor: (r: ExpertEntry) => expertDisplay(r.youngPersonExpert) },
    { header: "Expertise",         accessor: (r: ExpertEntry) => r.expertise },
    { header: "Context",           accessor: (r: ExpertEntry) => r.context },
    { header: "Contribution",      accessor: (r: ExpertEntry) => r.contribution },
    { header: "Audience",          accessor: (r: ExpertEntry) => r.audience },
    { header: "Preparation",       accessor: (r: ExpertEntry) => r.preparation },
    { header: "Accommodations",    accessor: (r: ExpertEntry) => r.accommodations.join("; ") },
    { header: "Child Motivation",  accessor: (r: ExpertEntry) => r.childMotivation },
    { header: "Child Reflection",  accessor: (r: ExpertEntry) => r.childReflection },
    { header: "Impact",            accessor: (r: ExpertEntry) => r.impactRecorded },
    { header: "Recognition",       accessor: (r: ExpertEntry) => r.recognitionGiven },
    { header: "Token of Thanks",   accessor: (r: ExpertEntry) => r.tokenOfThanks },
    { header: "Long-term Learning",accessor: (r: ExpertEntry) => r.longTermLearning },
    { header: "Reviewed By",       accessor: (r: ExpertEntry) => getStaffName(r.reviewedBy) },
  ];

  const childIds = [...new Set(data.map((r) => r.youngPersonExpert))];

  return (
    <PageShell
      title="Children as Experts by Experience"
      subtitle="UNCRC Article 12 · Quality Standard 1 — children advising the home, shaping policy, training staff, recruiting"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="children-as-experts" />
          <PrintButton title="Children as Experts by Experience" />
        </div>
      }
    >
      <div id="print-area" className="space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { l: "Expert Entries",    v: stats.total,       icon: Award,    c: "text-amber-600" },
            { l: "Expertise Types",   v: stats.typeCount,   icon: Sparkles, c: "text-purple-600" },
            { l: "Children Contributing", v: stats.contributors, icon: Users, c: "text-blue-600" },
            { l: "Recent (90 days)",  v: stats.recent,      icon: Calendar, c: "text-green-600" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg border bg-white p-3 text-center">
              <s.icon className={cn("mx-auto h-5 w-5 mb-1", s.c)} />
              <p className="text-2xl font-bold">{s.v}</p>
              <p className="text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        {/* By expertise type breakdown */}
        <div className="rounded-lg border bg-white p-4">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" /> By expertise type
          </h3>
          <div className="flex flex-wrap gap-2">
            {EXPERTISE_OPTIONS.filter((e) => stats.byType[e]).map((e) => (
              <span key={e} className={cn("rounded-full px-3 py-1 text-xs font-medium", EXPERTISE_COLOUR[e])}>
                {e} · {stats.byType[e]}
              </span>
            ))}
          </div>
        </div>

        {/* Philosophy banner */}
        <div className="rounded-lg border-l-4 border-amber-400 bg-gradient-to-r from-amber-50 to-pink-50 p-5">
          <div className="flex items-start gap-3">
            <Heart className="h-6 w-6 text-rose-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-base font-semibold text-amber-900">
                &ldquo;The children who live here are the experts on this place.&rdquo;
              </p>
              <p className="mt-1 text-sm text-amber-800">
                Expertise by experience is real expertise. We log it, recognise it, pay for it where appropriate, and let it change how the home is run.
              </p>
            </div>
          </div>
        </div>

        {/* Filters & sort */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search context, contribution, impact…"
              className="w-full rounded-md border pl-8 pr-3 py-2 text-sm"
            />
          </div>
          <Select value={filterExpertise} onValueChange={setFilterExpertise}>
            <SelectTrigger className="w-[210px]"><SelectValue placeholder="Expertise" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All expertise types</SelectItem>
              {EXPERTISE_OPTIONS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterChild} onValueChange={setFilterChild}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Child" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All children</SelectItem>
              {childIds.map((id) => <SelectItem key={id} value={id}>{expertDisplay(id)}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1 text-sm">
            <ArrowUpDown className="h-4 w-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border px-2 py-1.5 text-sm"
            >
              <option value="date">Date</option>
              <option value="expertise">Expertise</option>
              <option value="child">Child</option>
            </select>
          </div>
        </div>

        {/* Expandable cards */}
        {filtered.map((rec) => (
          <div key={rec.id} className="rounded-lg border bg-white overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-amber-600" />
                <div className="text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{expertDisplay(rec.youngPersonExpert)}</h3>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", EXPERTISE_COLOUR[rec.expertise])}>
                      {rec.expertise}
                    </span>
                    <span className="text-xs text-muted-foreground">{rec.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{rec.context}</p>
                </div>
              </div>
              {expandedId === rec.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>

            {expandedId === rec.id && (
              <div className="border-t p-4 space-y-4">
                <div className="rounded-lg bg-gray-50 p-3">
                  <h4 className="text-sm font-semibold mb-1">Context</h4>
                  <p className="text-sm text-muted-foreground">{rec.context}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-1">What the child did</h4>
                  <p className="text-sm text-muted-foreground">{rec.contribution}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <h4 className="text-sm font-semibold mb-1">Audience</h4>
                    <p className="text-sm text-muted-foreground">{rec.audience}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h4 className="text-sm font-semibold mb-1">Preparation &amp; support</h4>
                    <p className="text-sm text-muted-foreground">{rec.preparation}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                  <h4 className="text-sm font-semibold text-blue-800 mb-1">Accommodations that made it accessible</h4>
                  <ul className="list-disc list-inside text-sm text-blue-900 space-y-0.5">
                    {rec.accommodations.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-pink-50 border border-pink-200 p-3">
                    <h4 className="text-sm font-semibold text-pink-800 mb-1">Why the child wanted to do it</h4>
                    <p className="text-sm text-pink-900 italic">&ldquo;{rec.childMotivation}&rdquo;</p>
                  </div>
                  <div className="rounded-lg bg-rose-50 border border-rose-200 p-3">
                    <h4 className="text-sm font-semibold text-rose-800 mb-1">Child&apos;s reflection afterwards</h4>
                    <p className="text-sm text-rose-900 italic">&ldquo;{rec.childReflection}&rdquo;</p>
                  </div>
                </div>

                <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                  <h4 className="text-sm font-semibold text-green-800 mb-1">Impact recorded</h4>
                  <p className="text-sm text-green-900">{rec.impactRecorded}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <h4 className="text-sm font-semibold text-amber-800 mb-1">Recognition</h4>
                    <p className="text-sm text-amber-900">{rec.recognitionGiven}</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <h4 className="text-sm font-semibold text-amber-800 mb-1">Token of thanks</h4>
                    <p className="text-sm text-amber-900">{rec.tokenOfThanks}</p>
                  </div>
                  <div className="rounded-lg bg-purple-50 border border-purple-200 p-3">
                    <h4 className="text-sm font-semibold text-purple-800 mb-1">Long-term learning for the home</h4>
                    <p className="text-sm text-purple-900">{rec.longTermLearning}</p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground border-t pt-2">
                  Reviewed by <span className="font-medium">{getStaffName(rec.reviewedBy)}</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Regulatory note */}
        <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-4 text-sm text-blue-900">
          <strong>UNCRC Article 12 &amp; Quality Standard 1 (Children&apos;s Views, Wishes and Feelings)</strong> — Children must be supported not just to give views about their own care, but to influence the home itself. Recording instances of children acting as experts by experience evidences that the home treats children&apos;s expertise as real expertise: prepared for, accommodated, recognised, paid for where appropriate, and translated into lasting change. Participation must always be genuinely optional, never tokenistic, and accessible — the child sets the terms.
        </div>
      </div>
    </PageShell>
  );
}
