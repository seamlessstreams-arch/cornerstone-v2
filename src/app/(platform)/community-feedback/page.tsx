"use client";

import { useState, useMemo } from "react";
import {
  MessageSquare, Search, ArrowUpDown, Filter, Users, Home,
  AlertCircle, ThumbsUp, ChevronDown, ChevronUp, Building2,
  Sparkles, MapPin, ShieldCheck,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getStaffName } from "@/lib/seed-data";

/* ── helpers ─────────────────────────────────────────────────────────── */
const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

/* ── types ───────────────────────────────────────────────────────────── */
const SOURCES = [
  "Neighbour",
  "Local business",
  "Member of public",
  "Local Councillor",
  "Police community team",
  "Place of worship",
  "School",
  "Anonymous",
] as const;
type Source = typeof SOURCES[number];

const FEEDBACK_TYPES = [
  "Compliment",
  "Concern",
  "Suggestion",
  "Question",
  "Complaint",
  "Recognition",
] as const;
type FeedbackType = typeof FEEDBACK_TYPES[number];

const TYPE_COLOURS: Record<FeedbackType, string> = {
  Compliment: "bg-green-100 text-green-800",
  Concern: "bg-amber-100 text-amber-800",
  Suggestion: "bg-blue-100 text-blue-800",
  Question: "bg-slate-100 text-slate-800",
  Complaint: "bg-red-100 text-red-800",
  Recognition: "bg-purple-100 text-purple-800",
};

const SOURCE_ICON: Record<Source, typeof Home> = {
  "Neighbour": Home,
  "Local business": Building2,
  "Member of public": Users,
  "Local Councillor": ShieldCheck,
  "Police community team": ShieldCheck,
  "Place of worship": MapPin,
  "School": Building2,
  "Anonymous": MessageSquare,
};

interface CommunityFeedback {
  id: string;
  dateReceived: string;
  source: Source;
  sourceContact: string;
  feedbackType: FeedbackType;
  summary: string;
  fullDescription: string;
  receivedBy: string;
  responseRequired: boolean;
  responseSent: boolean;
  responseDate: string;
  responseSummary: string;
  escalatedTo: string;
  patternIndicator: string;
  childrenInformedOfPositiveFeedback: boolean;
  policyOrPracticeArising: string;
  reviewedDate: string;
}

/* ── seed data ───────────────────────────────────────────────────────── */
const SEED: CommunityFeedback[] = [
  {
    id: "cf_1",
    dateReceived: d(-4),
    source: "Neighbour",
    sourceContact: "Resident, adjacent property (no. 14)",
    feedbackType: "Compliment",
    summary: "Praised young people for helping clear leaves from her drive.",
    fullDescription:
      "Neighbour stopped by to say two of our young people noticed she was struggling to clear autumn leaves from her drive at the weekend and offered to help unprompted. Said they were polite, worked hard, and refused her offer of payment. Wanted us to know how much it meant to her as a widow living alone.",
    receivedBy: "staff_darren",
    responseRequired: true,
    responseSent: true,
    responseDate: d(-4),
    responseSummary:
      "Thanked neighbour personally at the door. Letter of thanks sent the same evening. Children told individually and as a group at house meeting — they were proud.",
    escalatedTo: "",
    patternIndicator: "Pro-social behaviour in community (3rd instance this quarter)",
    childrenInformedOfPositiveFeedback: true,
    policyOrPracticeArising:
      "Story added to Statement of Purpose evidence file. To be referenced in next Reg 44 visit briefing.",
    reviewedDate: d(-3),
  },
  {
    id: "cf_2",
    dateReceived: d(-9),
    source: "Local business",
    sourceContact: "Manager, corner convenience shop (High Street)",
    feedbackType: "Recognition",
    summary: "Thanked us for the polite manner of young people using the shop.",
    fullDescription:
      "Shop manager phoned to say our young people are 'a credit to the home' — always polite, never any issues, and one had recently returned a £10 note that had been dropped by another customer. Wanted to formally let us know as he had previously dealt with negative experiences from another local provider.",
    receivedBy: "staff_ryan",
    responseRequired: true,
    responseSent: true,
    responseDate: d(-9),
    responseSummary:
      "Thanked manager and offered to keep open dialogue. Visited shop in person the following day with key worker.",
    escalatedTo: "",
    patternIndicator: "Strong local business relationship",
    childrenInformedOfPositiveFeedback: true,
    policyOrPracticeArising:
      "Confirmed our 'community first' induction approach — every new young person is walked round local shops with key worker in first fortnight.",
    reviewedDate: d(-8),
  },
  {
    id: "cf_3",
    dateReceived: d(-15),
    source: "Neighbour",
    sourceContact: "Resident, opposite property",
    feedbackType: "Concern",
    summary: "Raised concern about late-night noise (raised voices) on a Friday.",
    fullDescription:
      "Neighbour came to the door to say he had heard raised voices from the garden around 22:40 on Friday. Not aggressive, but loud enough to wake him. Was friendly and apologetic about raising it; said it had only happened once.",
    receivedBy: "staff_darren",
    responseRequired: true,
    responseSent: true,
    responseDate: d(-15),
    responseSummary:
      "Apologised on the doorstep. Explained — without breaching confidentiality — that one young person had been distressed and staff were supporting them. Provided direct mobile number for any future concerns rather than calling police. Neighbour was very satisfied with response.",
    escalatedTo: "RM (informed)",
    patternIndicator: "Single occurrence — no pattern",
    childrenInformedOfPositiveFeedback: false,
    policyOrPracticeArising:
      "Reviewed evening de-escalation practice in team meeting. Reminder issued to staff: move conversations indoors after 21:30 where possible.",
    reviewedDate: d(-14),
  },
  {
    id: "cf_4",
    dateReceived: d(-22),
    source: "Local Councillor",
    sourceContact: "Ward Councillor (via email)",
    feedbackType: "Compliment",
    summary: "Following community open afternoon — praised our transparency.",
    fullDescription:
      "Councillor attended our autumn community open afternoon. Emailed afterwards to say he had been very impressed with the home, the obvious warmth of the staff team, and our willingness to be open with neighbours. Said he would be happy to advocate for us if any planning or community matters arose.",
    receivedBy: "staff_darren",
    responseRequired: true,
    responseSent: true,
    responseDate: d(-21),
    responseSummary:
      "Replied with thanks. Added to mailing list for our quarterly community newsletter. Saved as positive contact in stakeholder map.",
    escalatedTo: "",
    patternIndicator: "Community openness producing measurable goodwill",
    childrenInformedOfPositiveFeedback: true,
    policyOrPracticeArising:
      "Open afternoon to become biannual fixture (spring + autumn). Added to development plan.",
    reviewedDate: d(-20),
  },
  {
    id: "cf_5",
    dateReceived: d(-30),
    source: "Police community team",
    sourceContact: "PCSO (local SNT)",
    feedbackType: "Recognition",
    summary: "PCSO noted excellent communication on a missing-from-care episode.",
    fullDescription:
      "PCSO from the local Safer Neighbourhood Team called following a recent missing episode that resolved well. Wanted to flag — informally and formally — that our staff communication, risk information sharing, and post-return debrief evidence had been the best she had encountered with any local provider.",
    receivedBy: "staff_darren",
    responseRequired: true,
    responseSent: true,
    responseDate: d(-30),
    responseSummary:
      "Thanked PCSO and arranged a follow-up coffee meeting to share return-home interview practice. Linked into our missing-from-care procedure review.",
    escalatedTo: "",
    patternIndicator: "Strong police partnership — 2nd positive contact this quarter",
    childrenInformedOfPositiveFeedback: false,
    policyOrPracticeArising:
      "PCSO invited to contribute to staff training on contextual safeguarding (scheduled).",
    reviewedDate: d(-29),
  },
  {
    id: "cf_6",
    dateReceived: d(-38),
    source: "Member of public",
    sourceContact: "Dog walker, local park",
    feedbackType: "Compliment",
    summary: "Young person helped retrieve an escaped dog at the park.",
    fullDescription:
      "Member of public came to the home to thank us — one of our young people had helped catch her elderly Labrador after it slipped its lead at the park. Said the young person was calm, kind and refused to take the £20 she offered. Brought a card and a tin of biscuits.",
    receivedBy: "staff_ryan",
    responseRequired: false,
    responseSent: true,
    responseDate: d(-38),
    responseSummary:
      "Card displayed (with consent) on the kitchen noticeboard. Young person told and photo of card shared with social worker for LAC review.",
    escalatedTo: "",
    patternIndicator: "Pro-social behaviour in community (recurring positive theme)",
    childrenInformedOfPositiveFeedback: true,
    policyOrPracticeArising:
      "Anecdote added to LAC review evidence as outcome indicator.",
    reviewedDate: d(-37),
  },
  {
    id: "cf_7",
    dateReceived: d(-45),
    source: "Place of worship",
    sourceContact: "Verger, parish church",
    feedbackType: "Suggestion",
    summary: "Invited us to participate in the church's annual community fete.",
    fullDescription:
      "Verger phoned to invite the home to run a stall at the parish summer fete. Said they had been impressed by our involvement in the litter-pick last year and would value the link. Suggested young people might like to bake or run a tombola.",
    receivedBy: "staff_darren",
    responseRequired: true,
    responseSent: true,
    responseDate: d(-44),
    responseSummary:
      "Accepted invitation. Children's meeting agreed to run a 'guess the cake weight' stall. Date booked into activity planner.",
    escalatedTo: "",
    patternIndicator: "Faith community partnership growing",
    childrenInformedOfPositiveFeedback: true,
    policyOrPracticeArising:
      "Added church fete to annual community calendar.",
    reviewedDate: d(-43),
  },
  {
    id: "cf_8",
    dateReceived: d(-55),
    source: "School",
    sourceContact: "Headteacher, partner secondary school",
    feedbackType: "Recognition",
    summary: "Thanked the home for consistent, prompt attendance support.",
    fullDescription:
      "Headteacher wrote a formal letter recognising the home's contribution to attendance and engagement of our young people. Singled out morning routines, prompt response to absence calls, and the key worker's regular school visits as best practice.",
    receivedBy: "staff_darren",
    responseRequired: true,
    responseSent: true,
    responseDate: d(-54),
    responseSummary:
      "Replied with thanks. Letter scanned to PEP file for the relevant young person. Shared anonymously at staff meeting.",
    escalatedTo: "",
    patternIndicator: "Strong school partnership — formal recognition",
    childrenInformedOfPositiveFeedback: true,
    policyOrPracticeArising:
      "Confirmed continuation of weekly key-worker school visit as standard practice.",
    reviewedDate: d(-53),
  },
];

/* ── component ───────────────────────────────────────────────────────── */
export default function CommunityFeedbackPage() {
  const [records] = useState<CommunityFeedback[]>(SEED);
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...records];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.summary.toLowerCase().includes(q) ||
          r.fullDescription.toLowerCase().includes(q) ||
          r.sourceContact.toLowerCase().includes(q),
      );
    }
    if (filterSource !== "all") list = list.filter((r) => r.source === filterSource);
    if (filterType !== "all") list = list.filter((r) => r.feedbackType === filterType);

    list.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.dateReceived.localeCompare(a.dateReceived);
        case "source":
          return a.source.localeCompare(b.source);
        case "type":
          return a.feedbackType.localeCompare(b.feedbackType);
        default:
          return 0;
      }
    });
    return list;
  }, [records, search, filterSource, filterType, sortBy]);

  /* stats */
  const ninetyDaysAgo = d(-90);
  const thisQuarter = records.filter((r) => r.dateReceived >= ninetyDaysAgo).length;
  const compliments = records.filter(
    (r) => r.feedbackType === "Compliment" || r.feedbackType === "Recognition",
  ).length;
  const concernsResolved = records.filter(
    (r) =>
      (r.feedbackType === "Concern" || r.feedbackType === "Complaint") &&
      r.responseSent,
  ).length;
  const sourceDiversity = new Set(records.map((r) => r.source)).size;

  const exportCols: ExportColumn<CommunityFeedback>[] = [
    { header: "ID", accessor: (r: CommunityFeedback) => r.id },
    { header: "Date Received", accessor: (r: CommunityFeedback) => r.dateReceived },
    { header: "Source", accessor: (r: CommunityFeedback) => r.source },
    { header: "Source Contact", accessor: (r: CommunityFeedback) => r.sourceContact },
    { header: "Feedback Type", accessor: (r: CommunityFeedback) => r.feedbackType },
    { header: "Summary", accessor: (r: CommunityFeedback) => r.summary },
    { header: "Full Description", accessor: (r: CommunityFeedback) => r.fullDescription },
    { header: "Received By", accessor: (r: CommunityFeedback) => getStaffName(r.receivedBy) },
    { header: "Response Required", accessor: (r: CommunityFeedback) => r.responseRequired ? "Yes" : "No" },
    { header: "Response Sent", accessor: (r: CommunityFeedback) => r.responseSent ? "Yes" : "No" },
    { header: "Response Date", accessor: (r: CommunityFeedback) => r.responseDate },
    { header: "Response Summary", accessor: (r: CommunityFeedback) => r.responseSummary },
    { header: "Escalated To", accessor: (r: CommunityFeedback) => r.escalatedTo },
    { header: "Pattern Indicator", accessor: (r: CommunityFeedback) => r.patternIndicator },
    { header: "Children Informed (Positive)", accessor: (r: CommunityFeedback) => r.childrenInformedOfPositiveFeedback ? "Yes" : "No" },
    { header: "Policy/Practice Arising", accessor: (r: CommunityFeedback) => r.policyOrPracticeArising },
    { header: "Reviewed Date", accessor: (r: CommunityFeedback) => r.reviewedDate },
  ];

  return (
    <PageShell
      title="Community Feedback"
      subtitle="Voices from our neighbours, local businesses, and the wider community"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Community Feedback" />
          <ExportButton data={filtered} columns={exportCols} filename="community-feedback" />
        </div>
      }
    >
      <div id="print-area" className="space-y-6">
        {/* ── community banner ──────────────────────────────────── */}
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="h-6 w-6 text-emerald-600 mt-0.5" />
            <div>
              <h2 className="text-base font-semibold text-emerald-900">
                Part of the local community
              </h2>
              <p className="text-sm text-emerald-800 mt-1">
                Our home isn&apos;t a building set apart — it&apos;s part of this street, this
                neighbourhood, this town. We listen carefully to our neighbours, local
                businesses, councillors and visitors. Their feedback helps us keep the home
                welcoming, accountable, and rooted in the everyday life of the community our
                children share.
              </p>
            </div>
          </div>
        </div>

        {/* ── stats ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "This Quarter", value: thisQuarter, icon: MessageSquare, colour: "text-blue-600" },
            { label: "Compliments", value: compliments, icon: ThumbsUp, colour: "text-green-600" },
            { label: "Concerns Resolved", value: concernsResolved, icon: ShieldCheck, colour: "text-emerald-600" },
            { label: "Source Diversity", value: sourceDiversity, icon: Users, colour: "text-purple-600" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border bg-white p-4 flex items-center gap-3">
              <s.icon className={cn("h-5 w-5", s.colour)} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── filters / sort ────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 items-end">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search feedback, contacts, descriptions…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {FEEDBACK_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Recent)</SelectItem>
                <SelectItem value="source">Source</SelectItem>
                <SelectItem value="type">Feedback Type</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── list ──────────────────────────────────────────────── */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No community feedback matches your filters.
            </div>
          )}
          {filtered.map((r) => {
            const isExpanded = expandedId === r.id;
            const SourceIcon = SOURCE_ICON[r.source];
            const isPositive =
              r.feedbackType === "Compliment" ||
              r.feedbackType === "Recognition";
            const isNegative =
              r.feedbackType === "Concern" || r.feedbackType === "Complaint";

            return (
              <div key={r.id} className="rounded-xl border bg-white overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : r.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <SourceIcon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isPositive
                          ? "text-emerald-600"
                          : isNegative
                          ? "text-amber-600"
                          : "text-blue-600",
                      )}
                    />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{r.summary}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {r.dateReceived} · {r.source} · {r.sourceContact}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {r.responseRequired && !r.responseSent && (
                      <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                        Response pending
                      </Badge>
                    )}
                    <Badge className={cn("text-xs", TYPE_COLOURS[r.feedbackType])}>
                      {r.feedbackType}
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t bg-slate-50 p-4 space-y-4">
                    {/* description */}
                    <div className="rounded-lg bg-white border p-3">
                      <p className="text-xs text-muted-foreground mb-1 font-medium">
                        Full Description
                      </p>
                      <p className="text-sm">{r.fullDescription}</p>
                    </div>

                    {/* response */}
                    {r.responseSent && r.responseSummary && (
                      <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                        <p className="text-xs font-medium text-green-700 mb-1">
                          Our Response · {r.responseDate}
                        </p>
                        <p className="text-sm">{r.responseSummary}</p>
                      </div>
                    )}

                    {/* pattern + escalation */}
                    {(r.patternIndicator || r.escalatedTo) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {r.patternIndicator && (
                          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                            <div className="flex items-center gap-1 mb-1">
                              <AlertCircle className="h-4 w-4 text-blue-600" />
                              <p className="text-xs font-medium text-blue-700">
                                Pattern / Theme
                              </p>
                            </div>
                            <p className="text-sm">{r.patternIndicator}</p>
                          </div>
                        )}
                        {r.escalatedTo && (
                          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                            <p className="text-xs font-medium text-amber-700 mb-1">
                              Escalated To
                            </p>
                            <p className="text-sm">{r.escalatedTo}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* policy / practice */}
                    {r.policyOrPracticeArising && (
                      <div className="rounded-lg bg-purple-50 border border-purple-200 p-3">
                        <p className="text-xs font-medium text-purple-700 mb-1">
                          Policy / Practice Arising
                        </p>
                        <p className="text-sm">{r.policyOrPracticeArising}</p>
                      </div>
                    )}

                    {/* meta */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Received By:</span>{" "}
                        <span className="font-medium">{getStaffName(r.receivedBy)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Response Required:</span>{" "}
                        <span className="font-medium">
                          {r.responseRequired ? "Yes" : "No"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Children Informed:</span>{" "}
                        <span
                          className={cn(
                            "font-medium",
                            r.childrenInformedOfPositiveFeedback
                              ? "text-green-600"
                              : "text-slate-500",
                          )}
                        >
                          {isPositive
                            ? r.childrenInformedOfPositiveFeedback
                              ? "Yes"
                              : "Not yet"
                            : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reviewed:</span>{" "}
                        <span className="font-medium">{r.reviewedDate}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── regulatory note ───────────────────────────────────── */}
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-900">
          <strong>Quality Standard 13 (Leadership &amp; Management):</strong> Registered
          providers and managers must understand the views of the local community and
          ensure the home contributes positively to it. Community feedback — compliments,
          concerns and suggestions — must be recorded, responded to, reviewed for patterns,
          and used to inform practice. Positive feedback should be shared with children to
          support self-esteem and a sense of belonging.
        </div>
      </div>
    </PageShell>
  );
}
