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
  Mic,
  Heart,
  Star,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChildLedMeeting {
  id: string;
  date: string;
  childChair: string;
  meetingPurpose: string;
  meetingType: "Children's meeting led" | "House decision discussion" | "Specific topic raised by child" | "Friend/peer chat with staff support" | "Cohort planning input";
  durationMinutes: number;
  attendees: string[];
  externalAttendees: string[];
  preMeetingPreparation: string[];
  agendaProposedByChild: string[];
  childRoleInChairing: string;
  decisionsReached: string[];
  staffRole: string;
  childOutcome: string;
  childContributorsOtherThanChair: { contributor: string; contribution: string }[];
  challengesNavigated: string[];
  proudMoments: string[];
  visibleChange: string;
  childReflectionAfter: string;
  followUp: string;
  recordedBy: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: ChildLedMeeting[] = [
  {
    id: "clm-001",
    date: d(-7),
    childChair: "yp_alex",
    meetingPurpose: "Discussing TV schedule for shared lounge",
    meetingType: "House decision discussion",
    durationMinutes: 25,
    attendees: ["yp_alex", "yp_jordan", "yp_casey", "staff_anna"],
    externalAttendees: [],
    preMeetingPreparation: [
      "Alex proposed the topic at last children's meeting",
      "Anna helped Alex draft agenda",
      "Each young person prepared their preferences",
      "Visual cards prepared for Casey",
    ],
    agendaProposedByChild: [
      "What's everyone's favourite type of show?",
      "How can we share fairly?",
      "Should we have time slots?",
      "What about Casey's quiet time needs?",
    ],
    childRoleInChairing: "Alex chaired confidently. Asked each person in turn. Used a 'talking stick' (Casey's idea — wooden spoon) to manage turns. Made sure Casey had time using visual cards.",
    decisionsReached: [
      "Football matches priority Tuesday + Saturday",
      "Quiet/sensory-friendly content default in evenings before 19:00 (Casey's wind-down time)",
      "Group film night Friday — all choose together",
      "If conflict, staff mediate but children try first",
    ],
    staffRole: "Anna observed and supported. Stepped in once to help phrase a question. Otherwise hands-off.",
    childOutcome: "Decision implemented same week. Working well so far.",
    childContributorsOtherThanChair: [
      { contributor: "yp_jordan", contribution: "Suggested rota system; agreed compromise on timing" },
      { contributor: "yp_casey", contribution: "Used visual cards to express preference for evening quiet content; agreed via thumbs up" },
    ],
    challengesNavigated: [
      "Initial heated moment between Alex and Jordan over football priority — Alex chaired through it",
      "Casey's communication needs required adapted pace",
    ],
    proudMoments: [
      "Alex chaired through tension without staff intervening",
      "Casey contributed independently and was heard",
      "All three reached consensus",
    ],
    visibleChange: "TV schedule co-produced; posted on lounge wall; working without need for staff intervention so far",
    childReflectionAfter: "Alex: 'It went better than I thought. Anna let me actually run it.'",
    followUp: "Review at next children's meeting in 4 weeks. Schedule has Casey's needs respected.",
    recordedBy: "staff_anna",
  },
  {
    id: "clm-002",
    date: d(-21),
    childChair: "yp_jordan",
    meetingPurpose: "Cultural food on the menu — making the case",
    meetingType: "Specific topic raised by child",
    durationMinutes: 40,
    attendees: ["yp_jordan", "staff_darren", "staff_chervelle"],
    externalAttendees: [],
    preMeetingPreparation: [
      "Jordan asked for time to discuss menu",
      "Chervelle helped Jordan prep his points",
      "Sample recipes from Mum gathered",
    ],
    agendaProposedByChild: [
      "Why cultural food matters to identity",
      "What I'm currently doing (cooking sessions)",
      "What would be better (regular menu)",
      "Practical solutions",
    ],
    childRoleInChairing: "Jordan led the conversation as the primary advocate. Articulate, prepared. Asked for what he needed.",
    decisionsReached: [
      "Cultural food regular menu item monthly minimum",
      "Cultural ingredients budget added",
      "Jordan invited (not required) to lead occasional sessions",
      "Mum's recipes incorporated with permission",
    ],
    staffRole: "Listened. Asked clarifying questions. Said yes to all reasonable requests. Made commitments documented.",
    childOutcome: "Major policy change resulted. Jordan saw his voice creating institutional change.",
    childContributorsOtherThanChair: [],
    challengesNavigated: [
      "Jordan was nervous initially — articulate by the end",
      "Budget conversation required collaboration",
    ],
    proudMoments: [
      "Jordan made a clear, principled case",
      "Outcome was real, visible change",
      "Set tone for future child-led advocacy",
    ],
    visibleChange: "Menu refreshed; cultural meals regular; Jordan-led when he chooses; ingredients shelf in kitchen",
    childReflectionAfter: "Jordan: 'They actually listened. It wasn't just talking. Things changed.'",
    followUp: "Review with Jordan at quarterly placement meeting. Track pattern to ensure no slippage.",
    recordedBy: "staff_chervelle",
  },
  {
    id: "clm-003",
    date: d(-45),
    childChair: "yp_casey",
    meetingPurpose: "Casey-led visual session: planning sensory upgrades to lounge",
    meetingType: "Specific topic raised by child",
    durationMinutes: 30,
    attendees: ["yp_casey", "staff_anna", "staff_darren"],
    externalAttendees: [],
    preMeetingPreparation: [
      "Casey raised this via visual cards over preceding weeks",
      "Anna helped Casey prepare a visual presentation (drawings + photos)",
      "Sample sensory items obtained for tactile reference",
    ],
    agendaProposedByChild: [
      "What sensory feels overwhelming in lounge",
      "What would help",
      "Showing examples (visual cards)",
      "Trying things out together",
    ],
    childRoleInChairing: "Casey led using visual cards and pointing. Anna interpreted some details with Casey's confirmation. Casey's preferences were primary.",
    decisionsReached: [
      "Adjustable lighting installed in lounge",
      "Sound dampening curtains added",
      "Sensory corner with weighted blankets and fidgets",
      "Casey's preferred bean bag added",
    ],
    staffRole: "Listened. Anna interpreted and confirmed back. Darren approved budget. Implementation planned.",
    childOutcome: "Lounge redesign initiative began (now embedded as service improvement).",
    childContributorsOtherThanChair: [],
    challengesNavigated: [
      "Verbal communication harder for Casey — visual format used",
      "Translating Casey's needs into actionable items took time and respect",
    ],
    proudMoments: [
      "Casey led a meeting that produced major environmental change",
      "Casey's visual presentation was sophisticated",
      "Anna's facilitation respected Casey's authorship",
    ],
    visibleChange: "Lounge sensory redesign now in progress (Phase 2); Casey directly attributed",
    childReflectionAfter: "Casey [used green visual feeling card and pointed at lounge]: 'Better.'",
    followUp: "Casey continues to advise on phase 2 and 3. Review when lounge complete.",
    recordedBy: "staff_anna",
  },
  {
    id: "clm-004",
    date: d(-90),
    childChair: "yp_alex",
    meetingPurpose: "Children's meeting (Alex chaired) — wider house items",
    meetingType: "Children's meeting led",
    durationMinutes: 30,
    attendees: ["yp_alex", "yp_jordan", "yp_casey", "staff_darren", "staff_anna"],
    externalAttendees: [],
    preMeetingPreparation: [
      "Alex elected to chair by other young people",
      "Anna supported Alex with agenda",
      "Each young person submitted items",
    ],
    agendaProposedByChild: [
      "Bedtime extension request (Alex)",
      "Pet at the home? (Alex's idea)",
      "Cultural food (Jordan)",
      "Sensory things in lounge (Casey via visual)",
      "Anything else",
    ],
    childRoleInChairing: "Alex's first time chairing children's meeting. Strong start. Inclusive of Casey. Managed time with Anna's gentle prompt once.",
    decisionsReached: [
      "Bedtime weekend extension agreed (later formalised)",
      "Fish tank in lounge agreed (compromise on dog/cat — Casey allergy considered)",
      "Cultural food and sensory lounge raised; deeper discussions to follow in dedicated meetings",
    ],
    staffRole: "Anna prompted timing once; Darren listened and offered budget context.",
    childOutcome: "Multiple co-produced changes flowed from this meeting.",
    childContributorsOtherThanChair: [
      { contributor: "yp_jordan", contribution: "Cultural food challenge; led to dedicated meeting" },
      { contributor: "yp_casey", contribution: "Sensory lounge needs raised via visual cards; led to dedicated meeting" },
    ],
    challengesNavigated: [
      "First chair experience — small wobbles",
      "Casey's pace required adaptation — managed",
    ],
    proudMoments: [
      "Alex chaired well in first attempt",
      "All three children contributed",
      "Multiple changes resulted from this single meeting",
    ],
    visibleChange: "Bedtime extension, fish tank, cultural food initiative, lounge redesign — all traceable to this meeting",
    childReflectionAfter: "Alex: 'I was nervous. Won't lie. But it was alright.'",
    followUp: "Alex chaired one more time since (this batch's record clm-001). Confidence growing.",
    recordedBy: "staff_anna",
  },
];

const exportCols: ExportColumn<ChildLedMeeting>[] = [
  { header: "Date", accessor: (r: ChildLedMeeting) => r.date },
  { header: "Child Chair", accessor: (r: ChildLedMeeting) => getYPName(r.childChair) },
  { header: "Purpose", accessor: (r: ChildLedMeeting) => r.meetingPurpose },
  { header: "Type", accessor: (r: ChildLedMeeting) => r.meetingType },
  { header: "Duration (min)", accessor: (r: ChildLedMeeting) => String(r.durationMinutes) },
  { header: "Attendees", accessor: (r: ChildLedMeeting) => String(r.attendees.length + r.externalAttendees.length) },
  { header: "Decisions Reached", accessor: (r: ChildLedMeeting) => String(r.decisionsReached.length) },
];

export default function ChildLedMeetingRecordPage() {
  const [filterChair, setFilterChair] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterChair !== "all") items = items.filter((m) => m.childChair === filterChair);
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.date.localeCompare(a.date);
        case "duration":
          return b.durationMinutes - a.durationMinutes;
        default:
          return 0;
      }
    });
    return items;
  }, [filterChair, sortBy]);

  const total = data.length;
  const uniqueChairs = new Set(data.map((m) => m.childChair)).size;
  const totalDecisions = data.reduce((sum, m) => sum + m.decisionsReached.length, 0);
  const visibleChanges = data.filter((m) => m.visibleChange).length;

  return (
    <PageShell
      title="Child-Led Meeting Record"
      subtitle="Records of meetings children themselves chaired or led — voice with audience and influence"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="child-led-meetings" />
          <PrintButton title="Child-Led Meeting Record" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Meetings Led</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{uniqueChairs}/3</p>
          <p className="text-xs text-muted-foreground">Children as Chair</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{totalDecisions}</p>
          <p className="text-xs text-muted-foreground">Decisions Reached</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{visibleChanges}</p>
          <p className="text-xs text-muted-foreground">Visible Changes</p>
        </div>
      </div>

      <div className="rounded-lg bg-purple-50 border border-purple-200 p-3 mb-6 flex items-start gap-2">
        <Mic className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
        <p className="text-sm text-purple-800">
          When children lead meetings, they have voice, audience, and influence — the four-part Lundy
          model in action. Staff support but do not steer. Decisions made are real. Children see their
          authority result in change.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterChair} onValueChange={setFilterChair}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Chairs" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chairs</SelectItem>
            <SelectItem value="yp_alex">{getYPName("yp_alex")}</SelectItem>
            <SelectItem value="yp_jordan">{getYPName("yp_jordan")}</SelectItem>
            <SelectItem value="yp_casey">{getYPName("yp_casey")}</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Most Recent</SelectItem>
              <SelectItem value="duration">Longest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((m) => {
          const isExpanded = expandedId === m.id;

          return (
            <div key={m.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : m.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Mic className="h-5 w-5 text-purple-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{m.meetingPurpose}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {m.date} &middot; Chaired by {getYPName(m.childChair)} &middot; {m.durationMinutes} mins &middot; {m.decisionsReached.length} decisions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium">{m.meetingType}</span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Pre-Meeting Preparation</p>
                    <ul className="space-y-1">
                      {m.preMeetingPreparation.map((p, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <span className="text-purple-600 mt-0.5">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Child-Proposed Agenda</p>
                    <ul className="space-y-1">
                      {m.agendaProposedByChild.map((a, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <Star className="h-3 w-3 text-amber-500 mt-1 shrink-0" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">
                      <Mic className="h-3 w-3 inline mr-1" />Child Role in Chairing
                    </p>
                    <p className="text-sm">{m.childRoleInChairing}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Decisions Reached</p>
                    <ul className="space-y-1">
                      {m.decisionsReached.map((d, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-1 shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Staff Role (Background)</p>
                    <p className="text-sm">{m.staffRole}</p>
                  </div>

                  {m.childContributorsOtherThanChair.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        <Users className="h-3 w-3 inline mr-1" />Other Children&apos;s Contributions
                      </p>
                      <div className="space-y-1">
                        {m.childContributorsOtherThanChair.map((c, i) => (
                          <div key={i} className="bg-white rounded-lg p-2 border text-sm">
                            <p className="font-medium">{getYPName(c.contributor)}</p>
                            <p className="text-xs text-muted-foreground">{c.contribution}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {m.challengesNavigated.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Challenges Navigated</p>
                      <ul className="space-y-1">
                        {m.challengesNavigated.map((c, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">Proud Moments</p>
                    <ul className="space-y-1">
                      {m.proudMoments.map((p, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <Star className="h-3 w-3 text-emerald-500 mt-1 shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-pink-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1">
                      <Heart className="h-3 w-3 inline mr-1" />Child&apos;s Reflection After
                    </p>
                    <p className="text-sm italic">&ldquo;{m.childReflectionAfter}&rdquo;</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">Visible Change</p>
                    <p className="text-sm">{m.visibleChange}</p>
                  </div>

                  {m.followUp && (
                    <div className="bg-slate-50 rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">Follow-Up</p>
                      <p className="text-sm">{m.followUp}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span><Users className="h-3 w-3 inline mr-1" />{m.attendees.length + m.externalAttendees.length} attendees</span>
                    <span><Clock className="h-3 w-3 inline mr-1" />{m.durationMinutes} mins</span>
                    <span>Recorded: {getStaffName(m.recordedBy)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Child-led meeting records support UNCRC Article 12 (right
          to be heard and taken seriously), Quality Standard 1 (child-centred care), and the Lundy model
          of participation (space, voice, audience, influence). Linked to Children&apos;s Meetings, Voice
          of Child, Children&apos;s Pledges, and Feedback Loops.
        </p>
      </div>
    </PageShell>
  );
}
