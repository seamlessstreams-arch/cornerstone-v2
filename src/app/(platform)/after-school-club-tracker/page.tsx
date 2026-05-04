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
  Star,
  Heart,
  Users,
  Clock,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClubRecord {
  id: string;
  youngPerson: string;
  clubName: string;
  clubType: "Sport" | "Arts" | "Music" | "Drama" | "STEM/Coding" | "Outdoor/Adventure" | "Cultural/Heritage" | "Volunteering" | "Faith" | "Skill development";
  schedule: string;
  startedDate: string;
  ongoingStatus: "Active" | "Trialled — declined" | "On break" | "Ended";
  endedDate: string;
  reasonForEnding: string;
  cost: number;
  fundingSource: "Home budget" | "Scholarship" | "Charitable funding" | "Free" | "LA grant" | "Cornerstone Care Group";
  attendance: { sessionsHeldLastTerm: number; sessionsAttended: number; reasonForAbsence: string };
  travelArrangements: string;
  staffEscort: string;
  childEnjoymentRating: number;
  socialAspect: "Solo activity" | "With staff" | "Friend group at club" | "Group with peers" | "Mixed";
  achievementsAtClub: string[];
  challengesAtClub: string[];
  staffObservations: string;
  childComments: string;
  contributesToOutcomes: string[];
  reviewedDate: string;
  reviewedBy: string;
  notes: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: ClubRecord[] = [
  {
    id: "asc-001",
    youngPerson: "yp_alex",
    clubName: "Riverside Boxing Club — Junior Programme",
    clubType: "Sport",
    schedule: "Tuesdays 18:00-20:00, Thursdays 18:00-20:00",
    startedDate: "2024-09-12",
    ongoingStatus: "Active",
    endedDate: "",
    reasonForEnding: "",
    cost: 480,
    fundingSource: "Home budget",
    attendance: { sessionsHeldLastTerm: 26, sessionsAttended: 25, reasonForAbsence: "1 absence — unwell" },
    travelArrangements: "Lackson drives Tue + Thu; collects 21:00",
    staffEscort: "staff_lackson",
    childEnjoymentRating: 5,
    socialAspect: "Group with peers",
    achievementsAtClub: [
      "First inter-club competition selection",
      "Coach gave own gloves as recognition",
      "Captain of junior squad nominated",
      "Modelled mentor behaviour for newer juniors",
    ],
    challengesAtClub: [
      "Initial nerves at sparring (now resolved)",
      "Occasional emotional dysregulation after intense sessions — managed with staff",
    ],
    staffObservations: "Boxing is identity-defining for Alex. Coach James a positive male role model. Strong protective factor.",
    childComments: "Best thing in my life right now. Coach actually believes in me.",
    contributesToOutcomes: [
      "Identity and belonging",
      "Emotional regulation through physical exertion",
      "Discipline and routine",
      "Pro-social peer group",
      "Adult mentor relationship",
    ],
    reviewedDate: d(-21),
    reviewedBy: "staff_anna",
    notes: "Most significant intervention in Alex's life currently. Continued investment essential.",
  },
  {
    id: "asc-002",
    youngPerson: "yp_jordan",
    clubName: "Riverside FC Under-13s",
    clubType: "Sport",
    schedule: "Tuesdays + Thursdays training, Saturday matches",
    startedDate: "2024-09-08",
    ongoingStatus: "Active",
    endedDate: "",
    reasonForEnding: "",
    cost: 360,
    fundingSource: "Home budget",
    attendance: { sessionsHeldLastTerm: 32, sessionsAttended: 31, reasonForAbsence: "1 absence — minor injury" },
    travelArrangements: "Various staff transport to home/away matches; mostly Edward",
    staffEscort: "staff_edward",
    childEnjoymentRating: 5,
    socialAspect: "Group with peers",
    achievementsAtClub: [
      "Voted captain by team",
      "Top scorer for team this season",
      "Invited to academy taster day",
      "Recognised by coach for leadership and sportsmanship",
    ],
    challengesAtClub: [
      "Travel to away matches sometimes coincides with family contact",
      "Pressure of captaincy occasionally heavy",
    ],
    staffObservations: "Football is core to Jordan's identity. Coach Mike is a stable male figure. Team families know us; community integration strong.",
    childComments: "Football's everything. The lads are family.",
    contributesToOutcomes: [
      "Identity (footballer)",
      "Leadership skills",
      "Cultural pride (Black footballer role models)",
      "Pro-social peer group",
      "Physical health",
      "Future career exploration",
    ],
    reviewedDate: d(-14),
    reviewedBy: "staff_chervelle",
    notes: "Strong protective factor. Academy interest emerging — careful guidance needed around realistic vs aspirational pathways.",
  },
  {
    id: "asc-003",
    youngPerson: "yp_casey",
    clubName: "Reach Out Arts CIC — Sensory Art Group",
    clubType: "Arts",
    schedule: "Wednesdays 16:00-18:00",
    startedDate: "2023-09-20",
    ongoingStatus: "Active",
    endedDate: "",
    reasonForEnding: "",
    cost: 540,
    fundingSource: "Home budget",
    attendance: { sessionsHeldLastTerm: 12, sessionsAttended: 12, reasonForAbsence: "Perfect attendance" },
    travelArrangements: "Anna drives; quiet route, no surprises",
    staffEscort: "staff_anna",
    childEnjoymentRating: 5,
    socialAspect: "Friend group at club",
    achievementsAtClub: [
      "Piece selected for community exhibition (Casey's first public showing)",
      "First sustained friendship outside home (Ellie)",
      "Self-confidence in articulating artistic choices growing",
    ],
    challengesAtClub: [
      "Group changes (e.g., new members) require sensory preparation",
      "Christmas event last year overwhelmed Casey — adapted approach needed",
    ],
    staffObservations: "Art group is Casey's primary therapeutic space outside home. Sarah (group leader) trusted figure. First independent friendship Ellie a major milestone.",
    childComments: "I love it. It's where my brain goes quiet.",
    contributesToOutcomes: [
      "Therapeutic creative expression",
      "Identity (artist)",
      "First independent friendship",
      "Sensory-friendly community engagement",
      "Self-advocacy growth",
    ],
    reviewedDate: d(-7),
    reviewedBy: "staff_anna",
    notes: "Critical intervention. Continued at all costs.",
  },
  {
    id: "asc-004",
    youngPerson: "yp_alex",
    clubName: "Riverside Library — Reading Group",
    clubType: "Skill development",
    schedule: "Saturdays 10:30-11:30",
    startedDate: "2024-10-05",
    ongoingStatus: "Trialled — declined",
    endedDate: "2024-11-23",
    reasonForEnding: "Alex tried for 6 weeks; decided not for him. Reading still encouraged at home; choice respected.",
    cost: 0,
    fundingSource: "Free",
    attendance: { sessionsHeldLastTerm: 6, sessionsAttended: 6, reasonForAbsence: "Trialled and ended" },
    travelArrangements: "Local; Alex walked or with staff",
    staffEscort: "staff_edward",
    childEnjoymentRating: 2,
    socialAspect: "Group with peers",
    achievementsAtClub: [
      "Read 4 books during trial",
      "Tried something new",
    ],
    challengesAtClub: [
      "Format too quiet/passive for Alex's energy",
      "Group dynamic didn't connect for him",
    ],
    staffObservations: "Tried with full support. Alex's choice to step back honoured. Reading continues at home pace.",
    childComments: "Not for me. I tried. Boxing is my thing.",
    contributesToOutcomes: [
      "Tried new activity",
      "Self-knowledge developed",
      "Choice respected",
    ],
    reviewedDate: "2024-12-01",
    reviewedBy: "staff_edward",
    notes: "Healthy example of trying and choosing. Ended with respect.",
  },
  {
    id: "asc-005",
    youngPerson: "yp_jordan",
    clubName: "Cultural Heritage Saturday Club (Black-led community)",
    clubType: "Cultural/Heritage",
    schedule: "Saturdays 14:00-17:00 fortnightly",
    startedDate: "2025-02-15",
    ongoingStatus: "Active",
    endedDate: "",
    reasonForEnding: "",
    cost: 240,
    fundingSource: "Cornerstone Care Group",
    attendance: { sessionsHeldLastTerm: 6, sessionsAttended: 6, reasonForAbsence: "Perfect attendance" },
    travelArrangements: "Chervelle drives — meets cultural mentor at venue",
    staffEscort: "staff_chervelle",
    childEnjoymentRating: 5,
    socialAspect: "Group with peers",
    achievementsAtClub: [
      "Connected with Black mentor figure",
      "Learning cultural cooking and food traditions",
      "Heritage exploration — including paternal side",
      "Cousin Devon also attends — sibling-like bond",
    ],
    challengesAtClub: [
      "None significant",
    ],
    staffObservations: "Cultural identity protective factor. Mentor relationship adding adult male role model from Jordan's heritage.",
    childComments: "It feels right. People who get me without me explaining.",
    contributesToOutcomes: [
      "Cultural identity",
      "Heritage exploration",
      "Cultural mentor relationship",
      "Cousin Devon connection sustained",
    ],
    reviewedDate: d(-7),
    reviewedBy: "staff_chervelle",
    notes: "Newly added; major positive impact already. Continuing.",
  },
  {
    id: "asc-006",
    youngPerson: "yp_casey",
    clubName: "Riverside Library — Sensory-Friendly Reading Hour",
    clubType: "Skill development",
    schedule: "Mondays 16:00-17:00 (hour-of-quiet special)",
    startedDate: "2024-01-15",
    ongoingStatus: "Active",
    endedDate: "",
    reasonForEnding: "",
    cost: 0,
    fundingSource: "Free",
    attendance: { sessionsHeldLastTerm: 12, sessionsAttended: 11, reasonForAbsence: "1 absence — unwell" },
    travelArrangements: "Anna walks Casey to library — active travel + low-stim arrival",
    staffEscort: "staff_anna",
    childEnjoymentRating: 4,
    socialAspect: "Solo activity",
    achievementsAtClub: [
      "Strong reading progression — completing one book per visit",
      "Casey's library card and reading log own",
      "Trusted relationship with librarian (Sarah Mitchell)",
    ],
    challengesAtClub: [
      "Sometimes other children in space — variable sensory load",
    ],
    staffObservations: "Sensory-friendly hour is ideal. Casey reads avidly. Librarian relationship a quiet protective figure.",
    childComments: "I like the librarian. The books here are good.",
    contributesToOutcomes: [
      "Reading development",
      "Trusted adult outside home",
      "Sensory-friendly community participation",
    ],
    reviewedDate: d(-21),
    reviewedBy: "staff_anna",
    notes: "Steady, valuable engagement.",
  },
];

const statusColour: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  "Trialled — declined": "bg-blue-100 text-blue-800",
  "On break": "bg-amber-100 text-amber-800",
  Ended: "bg-slate-100 text-slate-800",
};

const exportCols: ExportColumn<ClubRecord>[] = [
  { header: "Young Person", accessor: (r: ClubRecord) => getYPName(r.youngPerson) },
  { header: "Club", accessor: (r: ClubRecord) => r.clubName },
  { header: "Type", accessor: (r: ClubRecord) => r.clubType },
  { header: "Schedule", accessor: (r: ClubRecord) => r.schedule },
  { header: "Started", accessor: (r: ClubRecord) => r.startedDate },
  { header: "Status", accessor: (r: ClubRecord) => r.ongoingStatus },
  { header: "Attendance", accessor: (r: ClubRecord) => `${r.attendance.sessionsAttended}/${r.attendance.sessionsHeldLastTerm}` },
  { header: "Enjoyment", accessor: (r: ClubRecord) => `${r.childEnjoymentRating}/5` },
  { header: "Cost £", accessor: (r: ClubRecord) => `£${r.cost}` },
];

export default function AfterSchoolClubTrackerPage() {
  const [filterYP, setFilterYP] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("status");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterYP !== "all") items = items.filter((r) => r.youngPerson === filterYP);
    if (filterStatus !== "all") items = items.filter((r) => r.ongoingStatus === filterStatus);
    items.sort((a, b) => {
      switch (sortBy) {
        case "status":
          const ord = { Active: 0, "On break": 1, "Trialled — declined": 2, Ended: 3 };
          return ord[a.ongoingStatus] - ord[b.ongoingStatus];
        case "attendance":
          const pctA = a.attendance.sessionsAttended / Math.max(1, a.attendance.sessionsHeldLastTerm);
          const pctB = b.attendance.sessionsAttended / Math.max(1, b.attendance.sessionsHeldLastTerm);
          return pctB - pctA;
        case "enjoyment":
          return b.childEnjoymentRating - a.childEnjoymentRating;
        default:
          return 0;
      }
    });
    return items;
  }, [filterYP, filterStatus, sortBy]);

  const total = data.length;
  const active = data.filter((r) => r.ongoingStatus === "Active").length;
  const totalCost = data.filter((r) => r.ongoingStatus === "Active").reduce((sum, r) => sum + r.cost, 0);
  const avgEnjoyment = (data.filter((r) => r.ongoingStatus === "Active").reduce((sum, r) => sum + r.childEnjoymentRating, 0) / Math.max(1, active)).toFixed(1);

  return (
    <PageShell
      title="After-School Club Tracker"
      subtitle="Per-child club and activity engagement — investments in identity, belonging, and skill"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="after-school-clubs" />
          <PrintButton title="After-School Club Tracker" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Total Records</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{active}</p>
          <p className="text-xs text-muted-foreground">Active Engagements</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">£{totalCost}</p>
          <p className="text-xs text-muted-foreground">Annual Investment (active)</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{avgEnjoyment}/5</p>
          <p className="text-xs text-muted-foreground">Avg Enjoyment</p>
        </div>
      </div>

      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 mb-6 flex items-start gap-2">
        <Star className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800">
          Clubs and activities are not just hobbies — they are identity, belonging, and protective relationships.
          We invest in each child&apos;s clubs intentionally. Trying and choosing not to continue is also valid.
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
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Trialled — declined">Trialled — Declined</SelectItem>
            <SelectItem value="On break">On Break</SelectItem>
            <SelectItem value="Ended">Ended</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="status">By Status</SelectItem>
              <SelectItem value="attendance">By Attendance</SelectItem>
              <SelectItem value="enjoyment">By Enjoyment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((c) => {
          const isExpanded = expandedId === c.id;
          const attPct = Math.round((c.attendance.sessionsAttended / Math.max(1, c.attendance.sessionsHeldLastTerm)) * 100);

          return (
            <div key={c.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : c.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Star className="h-5 w-5 text-amber-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{c.clubName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getYPName(c.youngPerson)} &middot; {c.clubType} &middot; {c.schedule}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", statusColour[c.ongoingStatus])}>
                    {c.ongoingStatus}
                  </span>
                  <span className="text-sm font-bold text-amber-600">{c.childEnjoymentRating}/5</span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-white rounded-lg p-2 border text-center text-sm">
                      <p className="text-xs text-muted-foreground">Started</p>
                      <p className="font-medium">{c.startedDate}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center text-sm">
                      <p className="text-xs text-muted-foreground">Attendance</p>
                      <p className="font-medium">{c.attendance.sessionsAttended}/{c.attendance.sessionsHeldLastTerm} ({attPct}%)</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center text-sm">
                      <p className="text-xs text-muted-foreground">Cost</p>
                      <p className="font-medium">£{c.cost}/yr</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center text-sm">
                      <p className="text-xs text-muted-foreground">Funding</p>
                      <p className="font-medium">{c.fundingSource}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      <Star className="h-3 w-3 inline mr-1" />Achievements
                    </p>
                    <ul className="space-y-1">
                      {c.achievementsAtClub.map((a, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <Star className="h-3 w-3 text-amber-500 mt-1 shrink-0" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {c.challengesAtClub.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Challenges</p>
                      <ul className="space-y-1">
                        {c.challengesAtClub.map((ch, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>{ch}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Child&apos;s Comments</p>
                    <p className="text-sm italic">&ldquo;{c.childComments}&rdquo;</p>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">Staff Observations</p>
                    <p className="text-sm">{c.staffObservations}</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">Contributes To</p>
                    <ul className="space-y-1">
                      {c.contributesToOutcomes.map((o, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <Heart className="h-3 w-3 text-purple-500 mt-1 shrink-0" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {c.endedDate && (
                    <div className="bg-slate-50 rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">Ended {c.endedDate}</p>
                      <p className="text-sm">{c.reasonForEnding}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span><Calendar className="h-3 w-3 inline mr-1" />{c.schedule}</span>
                    <span><Users className="h-3 w-3 inline mr-1" />{c.socialAspect}</span>
                    <span>Travel: {c.travelArrangements}</span>
                    <span>Staff: {getStaffName(c.staffEscort)}</span>
                  </div>

                  {c.notes && (
                    <div className="bg-slate-50 rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-sm">{c.notes}</p>
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
          <strong>Regulatory Context:</strong> After-school clubs and activities support Quality Standard 6
          (positive relationships), Quality Standard 7 (health and wellbeing), Quality Standard 1 (child-centred
          care), and UNCRC Article 31 (right to play and leisure). Activity budget allocated per child.
          Linked to Activities, Community Engagement, and Outcomes pages.
        </p>
      </div>
    </PageShell>
  );
}
