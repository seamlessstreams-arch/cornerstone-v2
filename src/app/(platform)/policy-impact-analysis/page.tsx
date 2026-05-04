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
  FileText,
  TrendingUp,
  TrendingDown,
  Heart,
  CheckCircle,
  Users,
  AlertTriangle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PolicyImpact {
  id: string;
  policyName: string;
  policyVersion: string;
  changeDate: string;
  changeReason: string;
  policyArea: "Safeguarding" | "Behaviour" | "Voice & Participation" | "Health" | "Education" | "Privacy" | "Cultural" | "Workforce" | "Recording" | "Risk";
  changeType: "New policy" | "Major revision" | "Minor amendment" | "Practice clarification" | "Withdrawn";
  whatChanged: string[];
  impactedChildren: ("All current children" | "yp_alex" | "yp_jordan" | "yp_casey" | "Future admissions")[];
  childInvolvementInChange: string;
  childFriendlyVersionUpdated: boolean;
  childFriendlyUpdateDate: string;
  expectedImpactPositive: string[];
  expectedImpactRisks: string[];
  staffTrainingDelivered: boolean;
  staffTrainingDate: string;
  staffTrainingFormat: string;
  childrenInformedDate: string;
  childrenInformedFormat: string;
  outcomesObservedAt30d: string;
  outcomesObservedAt90d: string;
  outcomesObservedAt180d: string;
  unintendedConsequences: string[];
  childFeedbackPostChange: string[];
  reviewVerdict: "Working as intended" | "Mostly working" | "Needs amendment" | "Withdrawn / replaced";
  reviewDate: string;
  reviewedBy: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: PolicyImpact[] = [
  {
    id: "pi-001",
    policyName: "Behaviour Management & Positive Handling Policy",
    policyVersion: "v3.1",
    changeDate: d(-90),
    changeReason: "Embedding restorative approach following team training and Reg 44 feedback. Removing all sanction language.",
    policyArea: "Behaviour",
    changeType: "Major revision",
    whatChanged: [
      "Removed all reference to 'sanctions' and 'consequences'",
      "Introduced restorative questions framework",
      "Embedded the Consequence Framework (relational repair)",
      "Made explicit: no removal of pocket money, contact, or activities as punishment",
      "Added child-friendly version v2.4 alongside",
    ],
    impactedChildren: ["All current children", "Future admissions"],
    childInvolvementInChange: "All three young people contributed to drafting via children's meetings. Casey reviewed using visual cards. Final version reviewed by all and signed.",
    childFriendlyVersionUpdated: true,
    childFriendlyUpdateDate: d(-87),
    expectedImpactPositive: [
      "Reduced shame-based language in interactions",
      "Stronger relational repair after incidents",
      "Children understand they won't be 'punished' for distress",
      "Staff equipped with restorative questions",
    ],
    expectedImpactRisks: [
      "Some staff may worry about lack of consequences",
      "Possibility of perceived inconsistency until embedded",
    ],
    staffTrainingDelivered: true,
    staffTrainingDate: d(-85),
    staffTrainingFormat: "Half-day workshop with role-play, plus monthly reflective practice sessions",
    childrenInformedDate: d(-83),
    childrenInformedFormat: "Children's meeting with child-friendly version reviewed together. Posters of restorative questions added to private spaces.",
    outcomesObservedAt30d: "Initial team uncertainty. Some staff used old language out of habit. Children noticed and challenged.",
    outcomesObservedAt90d: "Embedded. Restorative questions used routinely. Reduced incidents requiring formal logging by ~30%. Children name approach as feeling 'fairer'.",
    outcomesObservedAt180d: "Strongly embedded. New starters trained from this version. Featured in Reg 45 report as positive change.",
    unintendedConsequences: [
      "Initial confusion about what 'natural consequences' meant in practice — clarified through training",
      "Some parents queried at first — addressed via communication",
    ],
    childFeedbackPostChange: [
      "Alex: 'They actually do what they said. I made a mistake and we talked, no big consequences threat.'",
      "Jordan: 'It's different from anywhere else I've been. I trust them more.'",
      "Casey: [Pointed at green visual feeling card when asked about behaviour approach]",
    ],
    reviewVerdict: "Working as intended",
    reviewDate: d(-7),
    reviewedBy: "staff_darren",
  },
  {
    id: "pi-002",
    policyName: "Privacy & Personal Space Policy",
    policyVersion: "v2.0",
    changeDate: d(-180),
    changeReason: "Updated following Reg 44 visit feedback and a child complaint about bedroom searches. Strengthened child consent and privacy.",
    policyArea: "Privacy",
    changeType: "Major revision",
    whatChanged: [
      "Bedroom search protocol now requires child briefing before AND debrief after",
      "Lockable drawer for each child's personal items",
      "Knock and 10-second wait standard (was 'knock and announce')",
      "Phone privacy explicitly protected",
      "Information sharing protocol with school updated to need-to-know only",
    ],
    impactedChildren: ["All current children", "Future admissions"],
    childInvolvementInChange: "Drafted with children's meeting input. Particular concerns from Jordan addressed (school information sharing). Casey contributed sensory privacy needs.",
    childFriendlyVersionUpdated: true,
    childFriendlyUpdateDate: d(-178),
    expectedImpactPositive: [
      "Children feel respected",
      "Reduced complaints about privacy",
      "Improved trust in staff",
      "Searches conducted only when proportionate",
    ],
    expectedImpactRisks: [
      "Risk of information gaps if school not informed of relevant safeguarding info — mitigated by clear need-to-know criteria",
    ],
    staffTrainingDelivered: true,
    staffTrainingDate: d(-175),
    staffTrainingFormat: "Whole-team briefing + role-play of bedroom entry; one-off",
    childrenInformedDate: d(-173),
    childrenInformedFormat: "Children's meeting + posters in bedrooms reminding 'they will knock and wait'",
    outcomesObservedAt30d: "Complaints about privacy dropped to zero. Children noticing and welcoming changes.",
    outcomesObservedAt90d: "No further privacy complaints. Children spontaneously commenting positively on staff knocking. Information sharing with school now consistent with policy.",
    outcomesObservedAt180d: "Embedded. Featured positively in latest Reg 44 visit. Care plan now includes 'privacy preferences' section per child.",
    unintendedConsequences: [
      "School initially confused by reduced information sharing — meeting held; protocol agreed jointly",
    ],
    childFeedbackPostChange: [
      "Alex: 'They always knock and wait. Feels respectful.'",
      "Jordan: 'School doesn't know everything anymore. That's right.'",
      "Casey: [Visual feedback positive]",
    ],
    reviewVerdict: "Working as intended",
    reviewDate: d(-30),
    reviewedBy: "staff_darren",
  },
  {
    id: "pi-003",
    policyName: "Children's Voice & Participation Policy",
    policyVersion: "v2.8",
    changeDate: d(-60),
    changeReason: "Adding feedback loop tracking after children noted 'they listen but I don't always know what happens with what I said'.",
    policyArea: "Voice & Participation",
    changeType: "Minor amendment",
    whatChanged: [
      "Added requirement to close every feedback loop within 14 days",
      "Established Child Feedback Loops register (this page)",
      "Each loop tracked: raised → acknowledged → considered → decided → fed back to child",
      "If 'cannot do', child must receive explanation in age-appropriate format",
    ],
    impactedChildren: ["All current children", "Future admissions"],
    childInvolvementInChange: "Children proposed the change. Co-designed the tracking format.",
    childFriendlyVersionUpdated: true,
    childFriendlyUpdateDate: d(-58),
    expectedImpactPositive: [
      "Children see their voice resulting in change (or clear reasons why not)",
      "Trust in participation strengthens",
      "Improved Lundy-model influence",
    ],
    expectedImpactRisks: [
      "Risk of feeling 'over-formal' if not handled warmly — mitigated by relational approach",
    ],
    staffTrainingDelivered: true,
    staffTrainingDate: d(-56),
    staffTrainingFormat: "Brief team meeting demo of new tracking + practice scenarios",
    childrenInformedDate: d(-55),
    childrenInformedFormat: "Children's meeting with demonstration",
    outcomesObservedAt30d: "Multiple loops opened. Average closure time 8 days.",
    outcomesObservedAt90d: "Embedded. 100% of loops closed within target. Children commenting they 'always know what happens'.",
    outcomesObservedAt180d: "Not yet — change is recent.",
    unintendedConsequences: [
      "Some staff initially overwhelmed by recording; simplified template introduced",
    ],
    childFeedbackPostChange: [
      "Alex: 'Now I see what they actually did. Better than just saying thanks.'",
      "Jordan: 'It's quicker too. Things move now.'",
      "Casey: [Used visual cards approvingly]",
    ],
    reviewVerdict: "Working as intended",
    reviewDate: d(-7),
    reviewedBy: "staff_darren",
  },
  {
    id: "pi-004",
    policyName: "Cultural Identity & Heritage Support Policy",
    policyVersion: "v1.3",
    changeDate: d(-45),
    changeReason: "Following Jordan's challenge that 'cultural food is only when I cook it'. Strengthened systemic responsibility.",
    policyArea: "Cultural",
    changeType: "Minor amendment",
    whatChanged: [
      "Cultural food on monthly menu rota minimum (not dependent on child's labour)",
      "Cultural mentor commissioning where matched ethnicity not in team",
      "Heritage events supported with budget allocation",
      "Cultural artefacts and resources budgeted",
    ],
    impactedChildren: ["yp_jordan", "All current children", "Future admissions"],
    childInvolvementInChange: "Jordan led the change. Other young people contributed.",
    childFriendlyVersionUpdated: true,
    childFriendlyUpdateDate: d(-43),
    expectedImpactPositive: [
      "Cultural identity affirmed institutionally not just personally",
      "Reduced burden on child to be sole cultural provider",
      "Heritage celebration as norm",
    ],
    expectedImpactRisks: [
      "Risk of tokenism if not done well — mitigated by training and external mentor input",
    ],
    staffTrainingDelivered: true,
    staffTrainingDate: d(-40),
    staffTrainingFormat: "Cultural responsiveness workshop with external trainer",
    childrenInformedDate: d(-38),
    childrenInformedFormat: "Children's meeting with menu rota shown",
    outcomesObservedAt30d: "Menu refreshed. Jordan invited to optionally lead, with team backup. Cultural mentor commissioned.",
    outcomesObservedAt90d: "Pending — change is recent. Early signal positive.",
    outcomesObservedAt180d: "Pending — change is recent.",
    unintendedConsequences: [
      "Increased food budget — agreed with operations as essential",
    ],
    childFeedbackPostChange: [
      "Jordan: 'Now it's not just on me. They actually changed it. That hit different.'",
    ],
    reviewVerdict: "Working as intended",
    reviewDate: d(-7),
    reviewedBy: "staff_chervelle",
  },
  {
    id: "pi-005",
    policyName: "Phone & Device Use Policy",
    policyVersion: "v2.0",
    changeDate: d(-30),
    changeReason: "Following children's challenge that policy was 'too much like school' and not age-appropriate. Co-produced redraft.",
    policyArea: "Privacy",
    changeType: "Major revision",
    whatChanged: [
      "Phone hand-in time co-agreed per child",
      "Music allowed at bedtime if soothing",
      "Personal phones recognised as personal property — staff don't read messages",
      "10-minute warning before screen off — agreed",
      "Friday/Saturday extended use up to 22:00",
    ],
    impactedChildren: ["All current children", "Future admissions"],
    childInvolvementInChange: "All three children contributed in children's meeting. Co-drafted.",
    childFriendlyVersionUpdated: true,
    childFriendlyUpdateDate: d(-28),
    expectedImpactPositive: [
      "Reduced friction at bedtime",
      "Increased autonomy and trust",
      "Age-appropriate boundaries",
    ],
    expectedImpactRisks: [
      "Risk of harder-to-monitor late-night use — mitigated by trust-based approach with risk indicators",
    ],
    staffTrainingDelivered: true,
    staffTrainingDate: d(-27),
    staffTrainingFormat: "Team meeting with role-play",
    childrenInformedDate: d(-26),
    childrenInformedFormat: "Children's meeting + posters with new agreement",
    outcomesObservedAt30d: "Reduced bedtime conflict. Children compliant with hand-in. No incidents.",
    outcomesObservedAt90d: "Pending — recent change.",
    outcomesObservedAt180d: "Pending — recent change.",
    unintendedConsequences: [],
    childFeedbackPostChange: [
      "Alex: 'They actually listened. Bedtime is less of a fight.'",
      "Jordan: 'Music is allowed now. I sleep better.'",
    ],
    reviewVerdict: "Mostly working",
    reviewDate: d(-3),
    reviewedBy: "staff_darren",
  },
];

const verdictColour: Record<string, string> = {
  "Working as intended": "bg-green-100 text-green-800",
  "Mostly working": "bg-blue-100 text-blue-800",
  "Needs amendment": "bg-amber-100 text-amber-800",
  "Withdrawn / replaced": "bg-red-100 text-red-800",
};

const exportCols: ExportColumn<PolicyImpact>[] = [
  { header: "Policy", accessor: (r: PolicyImpact) => r.policyName },
  { header: "Version", accessor: (r: PolicyImpact) => r.policyVersion },
  { header: "Change Date", accessor: (r: PolicyImpact) => r.changeDate },
  { header: "Area", accessor: (r: PolicyImpact) => r.policyArea },
  { header: "Type", accessor: (r: PolicyImpact) => r.changeType },
  { header: "Verdict", accessor: (r: PolicyImpact) => r.reviewVerdict },
  { header: "Child-Friendly Updated", accessor: (r: PolicyImpact) => r.childFriendlyVersionUpdated ? "Yes" : "No" },
];

export default function PolicyImpactAnalysisPage() {
  const [filterArea, setFilterArea] = useState("all");
  const [filterVerdict, setFilterVerdict] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterArea !== "all") items = items.filter((p) => p.policyArea === filterArea);
    if (filterVerdict !== "all") items = items.filter((p) => p.reviewVerdict === filterVerdict);
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.changeDate.localeCompare(a.changeDate);
        case "area":
          return a.policyArea.localeCompare(b.policyArea);
        default:
          return 0;
      }
    });
    return items;
  }, [filterArea, filterVerdict, sortBy]);

  const total = data.length;
  const working = data.filter((p) => p.reviewVerdict === "Working as intended").length;
  const childFriendlyUpdated = data.filter((p) => p.childFriendlyVersionUpdated).length;

  return (
    <PageShell
      title="Policy Impact Analysis"
      subtitle="Tracking how policy changes actually land — for children, staff, and the home"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="policy-impact-analysis" />
          <PrintButton title="Policy Impact Analysis" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Recent Changes</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{working}</p>
          <p className="text-xs text-muted-foreground">Working as Intended</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{childFriendlyUpdated}/{total}</p>
          <p className="text-xs text-muted-foreground">Child-Friendly Updated</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">100%</p>
          <p className="text-xs text-muted-foreground">Children Informed</p>
        </div>
      </div>

      <div className="rounded-lg bg-purple-50 border border-purple-200 p-3 mb-6 flex items-start gap-2">
        <FileText className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
        <p className="text-sm text-purple-800">
          A policy on paper means nothing. We track every policy change through to lived experience —
          how children are affected, how staff adapt, what works, what surprises us, and how children
          respond. Policies serve children, not the other way around.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterArea} onValueChange={setFilterArea}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Areas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Policy Areas</SelectItem>
            <SelectItem value="Safeguarding">Safeguarding</SelectItem>
            <SelectItem value="Behaviour">Behaviour</SelectItem>
            <SelectItem value="Voice & Participation">Voice &amp; Participation</SelectItem>
            <SelectItem value="Health">Health</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Privacy">Privacy</SelectItem>
            <SelectItem value="Cultural">Cultural</SelectItem>
            <SelectItem value="Workforce">Workforce</SelectItem>
            <SelectItem value="Recording">Recording</SelectItem>
            <SelectItem value="Risk">Risk</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterVerdict} onValueChange={setFilterVerdict}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Verdicts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Verdicts</SelectItem>
            <SelectItem value="Working as intended">Working as Intended</SelectItem>
            <SelectItem value="Mostly working">Mostly Working</SelectItem>
            <SelectItem value="Needs amendment">Needs Amendment</SelectItem>
            <SelectItem value="Withdrawn / replaced">Withdrawn / Replaced</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Most Recent</SelectItem>
              <SelectItem value="area">By Area</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((p) => {
          const isExpanded = expandedId === p.id;

          return (
            <div key={p.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="h-5 w-5 text-purple-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{p.policyName} ({p.policyVersion})</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {p.changeDate} &middot; {p.policyArea} &middot; {p.changeType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", verdictColour[p.reviewVerdict])}>
                    {p.reviewVerdict}
                  </span>
                  {p.childFriendlyVersionUpdated && <Heart className="h-4 w-4 text-pink-500" />}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">Why This Changed</p>
                    <p className="text-sm">{p.changeReason}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">What Changed</p>
                    <ul className="space-y-1">
                      {p.whatChanged.map((c, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <CheckCircle className="h-3 w-3 text-blue-500 mt-1 shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-pink-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1">
                      <Users className="h-3 w-3 inline mr-1" />Child Involvement in Change
                    </p>
                    <p className="text-sm">{p.childInvolvementInChange}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-800 uppercase tracking-wide mb-1">
                        <TrendingUp className="h-3 w-3 inline mr-1" />Expected Positive Impact
                      </p>
                      <ul className="space-y-1">
                        {p.expectedImpactPositive.map((e, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-green-600 mt-0.5">•</span>
                            <span>{e}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />Risks &amp; Mitigations
                      </p>
                      <ul className="space-y-1">
                        {p.expectedImpactRisks.map((e, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>{e}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">At 30 Days</p>
                      <p className="text-sm">{p.outcomesObservedAt30d}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">At 90 Days</p>
                      <p className="text-sm">{p.outcomesObservedAt90d}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">At 180 Days</p>
                      <p className="text-sm">{p.outcomesObservedAt180d}</p>
                    </div>
                  </div>

                  {p.unintendedConsequences.length > 0 && (
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                        <TrendingDown className="h-3 w-3 inline mr-1" />Unintended Consequences
                      </p>
                      <ul className="space-y-1">
                        {p.unintendedConsequences.map((c, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Children&apos;s Feedback Post-Change</p>
                    <ul className="space-y-1">
                      {p.childFeedbackPostChange.map((f, i) => (
                        <li key={i} className="text-sm italic">&ldquo;{f}&rdquo;</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span>Staff trained: {p.staffTrainingDelivered ? `${p.staffTrainingDate} (${p.staffTrainingFormat})` : "Not yet"}</span>
                    <span>Children informed: {p.childrenInformedDate}</span>
                    {p.childFriendlyVersionUpdated && (
                      <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 font-medium">
                        Child-friendly v {p.childFriendlyUpdateDate}
                      </span>
                    )}
                    <span>Reviewed: {p.reviewDate} by {getStaffName(p.reviewedBy)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Policy impact analysis supports Quality Standard 13 (leadership
          and management — evidence-based practice), Reg 45 (review of quality of care), and continuous
          improvement principles. Linked to Policies, Child-Friendly Policies, and Lessons Learned Register.
        </p>
      </div>
    </PageShell>
  );
}
