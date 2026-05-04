"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  Heart,
  Users,
  Phone,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Search,
  Star,
  Shield,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChosenFamilyRecord {
  id: string;
  youngPerson: string;
  personName: string;
  relationship:
    | "Mentor"
    | "Coach"
    | "Teacher"
    | "Faith leader"
    | "Neighbour"
    | "Family friend"
    | "Ex foster carer"
    | "Grandparent figure"
    | "Older friend"
    | "Sports/club leader"
    | "Other significant adult";
  howMet: string;
  yearsKnown: number;
  contactFrequency:
    | "Daily"
    | "Weekly"
    | "Monthly"
    | "Quarterly"
    | "Annually"
    | "As needed";
  contactType: string[];
  importanceToChild:
    | "Significant"
    | "Very significant"
    | "Like family"
    | "Central figure";
  rolePlayed: string[];
  safeguardingChecked: boolean;
  safeguardingCheckDate?: string;
  childInitiatedRelationship: boolean;
  reciprocal: boolean;
  childVoice: string;
  staffObservation: string;
  riskFactors: string[];
  protectiveFactors: string[];
  reviewDate: string;
  keyWorker: string;
}

const data: ChosenFamilyRecord[] = [
  {
    id: "cf-001",
    youngPerson: "yp_jordan",
    personName: "Imam Yusuf Rahman",
    relationship: "Faith leader",
    howMet:
      "Jordan started attending Friday prayers at the local mosque shortly after admission. Imam Yusuf welcomed him warmly and has supported his faith journey ever since.",
    yearsKnown: 4,
    contactFrequency: "Weekly",
    contactType: ["In person at mosque", "Phone calls", "Youth group"],
    importanceToChild: "Central figure",
    rolePlayed: [
      "Spiritual guide",
      "Cultural anchor",
      "Father figure",
      "Moral counsel",
      "Community connector",
    ],
    safeguardingChecked: true,
    safeguardingCheckDate: "2025-09-12",
    childInitiatedRelationship: true,
    reciprocal: true,
    childVoice:
      "Imam Yusuf gets it. When my mum's in prison and the world's loud, the mosque is quiet and he just lets me be. He's family — proper family.",
    staffObservation:
      "Jordan is markedly settled after Friday prayers. The Imam phones the home if Jordan misses two weeks. Genuine pastoral care, fully appropriate boundaries.",
    riskFactors: [],
    protectiveFactors: [
      "Cultural and religious continuity",
      "Stable adult presence",
      "Community belonging",
      "Routine anchor",
      "Source of identity",
    ],
    reviewDate: "2026-09-12",
    keyWorker: "staff_chervelle",
  },
  {
    id: "cf-002",
    youngPerson: "yp_jordan",
    personName: "Coach Mike Thompson",
    relationship: "Sports/club leader",
    howMet:
      "Jordan joined the Saturday football club aged 12. Coach Mike spotted his ability and stuck with him through the chaotic first year.",
    yearsKnown: 3,
    contactFrequency: "Weekly",
    contactType: ["Training sessions", "Match days", "Club WhatsApp group"],
    importanceToChild: "Very significant",
    rolePlayed: [
      "Mentor",
      "Positive male role model",
      "Believer in him",
      "Discipline through encouragement",
    ],
    safeguardingChecked: true,
    safeguardingCheckDate: "2025-08-04",
    childInitiatedRelationship: false,
    reciprocal: true,
    childVoice:
      "Mike never gave up on me even when I was being a div. He came to my Year 9 awards. No one else did.",
    staffObservation:
      "FA-checked, club has full safeguarding policy. Mike attended Jordan's PEP last term as a positive adult voice. Excellent boundaries.",
    riskFactors: [],
    protectiveFactors: [
      "Physical activity",
      "Team belonging",
      "Adult outside care system",
      "Recognition of progress",
    ],
    reviewDate: "2026-08-04",
    keyWorker: "staff_chervelle",
  },
  {
    id: "cf-003",
    youngPerson: "yp_alex",
    personName: "Khalid Mahmood (Boxing Coach)",
    relationship: "Coach",
    howMet:
      "Alex was referred to the boxing club via the school PE teacher as a positive outlet. Khalid runs the gym, ex-amateur champion, mentors several looked-after children.",
    yearsKnown: 2,
    contactFrequency: "Weekly",
    contactType: [
      "Twice-weekly training",
      "Pre-fight preparation",
      "Phone check-ins between sessions",
    ],
    importanceToChild: "Very significant",
    rolePlayed: [
      "Coach",
      "Mentor",
      "Discipline anchor",
      "Source of self-belief",
      "Calm in crisis",
    ],
    safeguardingChecked: true,
    safeguardingCheckDate: "2025-07-22",
    childInitiatedRelationship: false,
    reciprocal: true,
    childVoice:
      "Khalid says I'm allowed to be angry but not allowed to be lazy with it. He's straight with me and that means more than people who tiptoe.",
    staffObservation:
      "DBS verified, gym has insurance and safeguarding lead. Khalid called staff once when Alex disclosed a worry mid-session — handled it impeccably. Trusted partner.",
    riskFactors: [
      "Boxing environment requires careful framing for a child with anger history — actively managed and going well",
    ],
    protectiveFactors: [
      "Channelled physical outlet",
      "Mentorship from same heritage",
      "Routine three times a week",
      "Adult who keeps showing up",
    ],
    reviewDate: "2026-07-22",
    keyWorker: "staff_anna",
  },
  {
    id: "cf-004",
    youngPerson: "yp_alex",
    personName: "Ms Hassan (English teacher)",
    relationship: "Teacher",
    howMet:
      "Year 9 English teacher. Spotted Alex's writing ability and started recommending books. Their email correspondence is now into its second year.",
    yearsKnown: 2,
    contactFrequency: "Weekly",
    contactType: [
      "School lessons",
      "Weekly email about books",
      "Lunch club Tuesdays",
    ],
    importanceToChild: "Significant",
    rolePlayed: [
      "Encourager",
      "Intellectual mentor",
      "Person who believes he is clever",
      "Safe adult at school",
    ],
    safeguardingChecked: true,
    safeguardingCheckDate: "2025-09-01",
    childInitiatedRelationship: false,
    reciprocal: true,
    childVoice:
      "She told me I write like someone who's read more than I have. I don't think anyone's said something like that to me before.",
    staffObservation:
      "School email correspondence is appropriate, monitored via school systems. Ms Hassan attends Alex's PEPs. The first adult in education to consistently see his strengths.",
    riskFactors: [],
    protectiveFactors: [
      "Educational engagement",
      "Identity as 'clever kid' rather than 'difficult kid'",
      "Safe adult during school day",
    ],
    reviewDate: "2026-09-01",
    keyWorker: "staff_anna",
  },
  {
    id: "cf-005",
    youngPerson: "yp_casey",
    personName: "Linda Reeves (best friend Ellie's mum)",
    relationship: "Family friend",
    howMet:
      "Casey and Ellie became best friends at school. Linda made a point of including Casey from the start — sleepovers, dinners, family outings.",
    yearsKnown: 2,
    contactFrequency: "Weekly",
    contactType: [
      "Tea at theirs after school",
      "Weekend visits",
      "Texts to staff to coordinate",
      "Birthdays and Sunday lunches",
    ],
    importanceToChild: "Like family",
    rolePlayed: [
      "Surrogate mum figure",
      "Warmth and ordinariness",
      "Keeps a spare hoodie of Casey's",
      "Includes Casey in family celebrations",
    ],
    safeguardingChecked: true,
    safeguardingCheckDate: "2025-06-18",
    childInitiatedRelationship: true,
    reciprocal: true,
    childVoice:
      "Linda just... folds me in. I don't have to be anything different at hers. She knows my order at the chippy.",
    staffObservation:
      "Linda has visited the home, met staff, completed safer-recruitment style chat with RM. Genuinely lovely woman, strong protective factor for Casey. Ellie's house is a regular safe place.",
    riskFactors: [],
    protectiveFactors: [
      "Stable peer + adult relationship combined",
      "Experience of ordinary family life",
      "Sense of being chosen and wanted",
      "Belonging beyond the home",
    ],
    reviewDate: "2026-06-18",
    keyWorker: "staff_anna",
  },
  {
    id: "cf-006",
    youngPerson: "yp_casey",
    personName: "Mrs Patel (next-door neighbour)",
    relationship: "Neighbour",
    howMet:
      "Mrs Patel has lived next door for over twenty years. She introduced herself to Casey on day three and has since become a quiet, steady presence.",
    yearsKnown: 1,
    contactFrequency: "Weekly",
    contactType: [
      "Weekly tea visits",
      "Garden chats",
      "Helps with Casey's plants",
      "Cards on important days",
    ],
    importanceToChild: "Very significant",
    rolePlayed: [
      "Grandma figure",
      "Calm presence",
      "Cultural conversation (food, festivals)",
      "Steady weekly ritual",
    ],
    safeguardingChecked: true,
    safeguardingCheckDate: "2025-05-10",
    childInitiatedRelationship: false,
    reciprocal: true,
    childVoice:
      "Mrs Patel doesn't ask me hard questions. She just makes proper chai and tells me about her grandkids in Leicester. It's the easiest hour of my week.",
    staffObservation:
      "Long-term neighbour, references via the community. Casey visits with a member of staff aware. Tea visits are a fixed Wednesday ritual Casey looks forward to. Mrs Patel sent a card after Casey's grandad Tom died.",
    riskFactors: [],
    protectiveFactors: [
      "Continuity through bereavement",
      "Intergenerational relationship",
      "Cultural exchange and warmth",
      "Predictable weekly comfort",
    ],
    reviewDate: "2026-05-10",
    keyWorker: "staff_anna",
  },
];

const relationshipColour: Record<string, string> = {
  Mentor: "bg-purple-100 text-purple-800",
  Coach: "bg-amber-100 text-amber-800",
  Teacher: "bg-blue-100 text-blue-800",
  "Faith leader": "bg-emerald-100 text-emerald-800",
  Neighbour: "bg-rose-100 text-rose-800",
  "Family friend": "bg-pink-100 text-pink-800",
  "Ex foster carer": "bg-indigo-100 text-indigo-800",
  "Grandparent figure": "bg-orange-100 text-orange-800",
  "Older friend": "bg-cyan-100 text-cyan-800",
  "Sports/club leader": "bg-yellow-100 text-yellow-800",
  "Other significant adult": "bg-slate-100 text-slate-800",
};

const importanceColour: Record<string, string> = {
  Significant: "bg-rose-50 text-rose-700 border border-rose-200",
  "Very significant": "bg-rose-100 text-rose-800 border border-rose-300",
  "Like family": "bg-purple-100 text-purple-800 border border-purple-300",
  "Central figure": "bg-amber-100 text-amber-900 border border-amber-300",
};

const exportCols: ExportColumn<ChosenFamilyRecord>[] = [
  { header: "Young Person", accessor: (r: ChosenFamilyRecord) => getYPName(r.youngPerson) },
  { header: "Person", accessor: (r: ChosenFamilyRecord) => r.personName },
  { header: "Relationship", accessor: (r: ChosenFamilyRecord) => r.relationship },
  { header: "Years Known", accessor: (r: ChosenFamilyRecord) => r.yearsKnown },
  { header: "Frequency", accessor: (r: ChosenFamilyRecord) => r.contactFrequency },
  { header: "Importance", accessor: (r: ChosenFamilyRecord) => r.importanceToChild },
  { header: "Safeguarding Checked", accessor: (r: ChosenFamilyRecord) => r.safeguardingChecked ? "Yes" : "No" },
  { header: "Safeguarding Date", accessor: (r: ChosenFamilyRecord) => r.safeguardingCheckDate ?? "—" },
  { header: "Child Initiated", accessor: (r: ChosenFamilyRecord) => r.childInitiatedRelationship ? "Yes" : "No" },
  { header: "Reciprocal", accessor: (r: ChosenFamilyRecord) => r.reciprocal ? "Yes" : "No" },
  { header: "Review Date", accessor: (r: ChosenFamilyRecord) => r.reviewDate },
  { header: "Key Worker", accessor: (r: ChosenFamilyRecord) => getStaffName(r.keyWorker) },
];

export default function ChosenFamilyTrackerPage() {
  const [search, setSearch] = useState("");
  const [filterRel, setFilterRel] = useState("all");
  const [sortBy, setSortBy] = useState("importance");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (r) =>
          r.personName.toLowerCase().includes(q) ||
          getYPName(r.youngPerson).toLowerCase().includes(q) ||
          r.relationship.toLowerCase().includes(q) ||
          r.howMet.toLowerCase().includes(q),
      );
    }
    if (filterRel !== "all") items = items.filter((r) => r.relationship === filterRel);

    const importanceRank: Record<string, number> = {
      "Central figure": 4,
      "Like family": 3,
      "Very significant": 2,
      Significant: 1,
    };

    items.sort((a, b) => {
      switch (sortBy) {
        case "importance":
          return (importanceRank[b.importanceToChild] ?? 0) - (importanceRank[a.importanceToChild] ?? 0);
        case "years":
          return b.yearsKnown - a.yearsKnown;
        case "child":
          return a.youngPerson.localeCompare(b.youngPerson);
        case "review":
          return a.reviewDate.localeCompare(b.reviewDate);
        default:
          return 0;
      }
    });
    return items;
  }, [search, filterRel, sortBy]);

  const total = data.length;
  const centralFigures = data.filter((r) => r.importanceToChild === "Central figure" || r.importanceToChild === "Like family").length;
  const safeguarded = data.filter((r) => r.safeguardingChecked).length;
  const weeklyOrMore = data.filter((r) => r.contactFrequency === "Daily" || r.contactFrequency === "Weekly").length;

  return (
    <PageShell
      title="Chosen Family Tracker"
      subtitle="Significant non-family adults in each child's life — chosen family is real family"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="chosen-family-tracker" />
          <PrintButton title="Chosen Family" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <Users className="h-5 w-5 text-rose-600 mx-auto mb-1" />
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Significant Adults Tracked</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <Heart className="h-5 w-5 text-purple-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-purple-600">{centralFigures}</p>
          <p className="text-xs text-muted-foreground">Central / Like Family</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <Shield className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-emerald-600">{safeguarded}/{total}</p>
          <p className="text-xs text-muted-foreground">Safeguarding Checked</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <Phone className="h-5 w-5 text-amber-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-amber-600">{weeklyOrMore}</p>
          <p className="text-xs text-muted-foreground">Contact This Month</p>
        </div>
      </div>

      <div className="rounded-lg bg-gradient-to-r from-rose-50 via-purple-50 to-amber-50 border border-rose-200 p-4 mb-6 flex items-start gap-3">
        <Heart className="h-5 w-5 text-rose-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-rose-900 font-medium mb-1">Family is more than blood.</p>
          <p className="text-sm text-rose-800">
            Chosen family — mentors, coaches, teachers, neighbours, faith elders, ex-carers — is a real
            protective factor for children in care, and especially for LGBTQ+ young people. We track these
            relationships, safeguard them properly, and treat them with the seriousness they deserve.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by person, child, or how they met..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm rounded-md border bg-white"
          />
        </div>
        <Select value={filterRel} onValueChange={setFilterRel}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Relationships" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Relationships</SelectItem>
            <SelectItem value="Mentor">Mentor</SelectItem>
            <SelectItem value="Coach">Coach</SelectItem>
            <SelectItem value="Teacher">Teacher</SelectItem>
            <SelectItem value="Faith leader">Faith leader</SelectItem>
            <SelectItem value="Neighbour">Neighbour</SelectItem>
            <SelectItem value="Family friend">Family friend</SelectItem>
            <SelectItem value="Ex foster carer">Ex foster carer</SelectItem>
            <SelectItem value="Grandparent figure">Grandparent figure</SelectItem>
            <SelectItem value="Older friend">Older friend</SelectItem>
            <SelectItem value="Sports/club leader">Sports/club leader</SelectItem>
            <SelectItem value="Other significant adult">Other significant adult</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="importance">By Importance</SelectItem>
              <SelectItem value="years">Years Known</SelectItem>
              <SelectItem value="child">By Child</SelectItem>
              <SelectItem value="review">Next Review</SelectItem>
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
                className="w-full flex items-center justify-between p-4 text-left hover:bg-rose-50/40 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : r.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Heart className="h-5 w-5 text-rose-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {getYPName(r.youngPerson)} &mdash; {r.personName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r.yearsKnown} {r.yearsKnown === 1 ? "year" : "years"} known &middot; {r.contactFrequency.toLowerCase()} contact &middot; key worker {getStaffName(r.keyWorker)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3 flex-wrap justify-end">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", relationshipColour[r.relationship])}>
                    {r.relationship}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700">
                    {r.contactFrequency}
                  </span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", importanceColour[r.importanceToChild])}>
                    {r.importanceToChild}
                  </span>
                  {r.safeguardingChecked && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                      <Shield className="h-3 w-3" />Safeguarded
                    </span>
                  )}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-rose-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-rose-800 uppercase tracking-wide mb-1">How They Met</p>
                      <p className="text-sm">{r.howMet}</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                        <Star className="h-3 w-3 inline mr-1" />Role Played in Child&apos;s Life
                      </p>
                      <ul className="text-sm space-y-0.5">
                        {r.rolePlayed.map((role, i) => (
                          <li key={i}>&middot; {role}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">Child&apos;s Voice — Why This Person Matters</p>
                    <p className="text-sm italic text-purple-900">&ldquo;{r.childVoice}&rdquo;</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Staff Observation</p>
                    <p className="text-sm">{r.staffObservation}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-cyan-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-cyan-800 uppercase tracking-wide mb-1">
                        <Phone className="h-3 w-3 inline mr-1" />Contact Types
                      </p>
                      <ul className="text-sm space-y-0.5">
                        {r.contactType.map((c, i) => (
                          <li key={i}>&middot; {c}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">
                        <Shield className="h-3 w-3 inline mr-1" />Safeguarding
                      </p>
                      <p className="text-sm">
                        {r.safeguardingChecked
                          ? `Checked ${r.safeguardingCheckDate ?? ""} — appropriate boundaries verified`
                          : "Not yet checked — to be progressed"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">Protective Factors</p>
                      {r.protectiveFactors.length > 0 ? (
                        <ul className="text-sm space-y-0.5">
                          {r.protectiveFactors.map((p, i) => (
                            <li key={i}>&middot; {p}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">None recorded</p>
                      )}
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-orange-800 uppercase tracking-wide mb-1">Risk Factors</p>
                      {r.riskFactors.length > 0 ? (
                        <ul className="text-sm space-y-0.5">
                          {r.riskFactors.map((rf, i) => (
                            <li key={i}>&middot; {rf}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">None identified</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", r.childInitiatedRelationship ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-700")}>
                      {r.childInitiatedRelationship ? "Child sought this relationship" : "Adult-introduced, child embraced"}
                    </span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", r.reciprocal ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800")}>
                      {r.reciprocal ? "Reciprocal relationship" : "One-sided — monitor"}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800">
                      Next review: {r.reviewDate}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700">
                      Key worker: {getStaffName(r.keyWorker)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Quality Standard 7 (Positive Relationships) &middot; Working
          Together to Safeguard Children 2023 &middot; UNCRC Articles 8 (identity) and 12 (voice) &middot;
          Care Planning Regulations 2010 duty to maintain &ldquo;important relationships&rdquo; &middot;
          contextual safeguarding (Carlene Firmin). Linked to Family Contact, Attachment Profiles, Life Story
          Work, Cultural &amp; Religious Identity, and PEP records.
        </p>
      </div>
    </PageShell>
  );
}
