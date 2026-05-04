"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Search,
  Heart,
  Shield,
  Users,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  ExternalLink,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InclusionRecord {
  id: string;
  youngPerson: string;
  lastUpdated: string;
  identityAsShared: string;
  pronouns: string;
  preferredName?: string;
  whoKnowsAtChildPace: string[];
  outAtSchool: "Yes" | "Selectively" | "No" | "Not yet decided";
  outToFamily: "Yes" | "Selectively" | "No" | "Not yet decided";
  identityAffirmingActions: string[];
  challengesFaced: string[];
  externalSupport: string[];
  staffActionsThisMonth: string[];
  pronounsUsedConsistently: boolean;
  preferredNameUsedConsistently: boolean;
  childVoice: string;
  staffObservation: string;
  flagsConcerns: string[];
  reviewDate: string;
  keyWorker: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: InclusionRecord[] = [
  {
    id: "lgbtq-001",
    youngPerson: "yp_alex",
    lastUpdated: d(-9),
    identityAsShared: "Bisexual (shared with key worker, March 2026)",
    pronouns: "they/them (started using Feb 2026)",
    preferredName: "Alex (preferred — not a new name, just consistent)",
    whoKnowsAtChildPace: [
      "Key worker (Anna) — first told",
      "Manager (Darren) — Alex chose to inform",
      "Trusted shift staff (named on Alex's plan)",
      "One close friend at school (Alex's choice)",
      "NOT family — Alex is clear they will share when ready",
      "NOT school staff yet — Alex's decision",
    ],
    outAtSchool: "Selectively",
    outToFamily: "Not yet decided",
    identityAffirmingActions: [
      "they/them pronouns used in handover and daily language by all staff",
      "Preferred name 'Alex' on bedroom door (always was — no change needed)",
      "LGBTQ+ inclusive books added to lounge bookshelf (Heartstopper, Felix Ever After)",
      "Signposted to local LGBTQ+ youth group (The Proud Trust drop-in)",
      "No pressure to come out at home visits — staff support Alex's pacing",
      "Stonewall and Mermaids resources shared with Alex (Alex chose what to read)",
      "Pride flag pin available if Alex wants — not displayed in shared areas without consent",
    ],
    challengesFaced: [
      "Worry about Mum's reaction (Mum holds traditional views) — Alex deciding pace",
      "One peer at school made an off-hand comment — Alex handled it, told Anna later",
      "Initial staff member used wrong pronouns once — apologised, corrected, no repeat",
    ],
    externalSupport: [
      "The Proud Trust (Manchester) — local LGBTQ+ youth drop-in, attended twice",
      "Stonewall Young Campaigners resources (online, Alex reads independently)",
      "Childline LGBTQ+ section (Alex aware, has used once)",
    ],
    staffActionsThisMonth: [
      "Anna had two 1:1 check-ins about identity (Alex-led pacing)",
      "Updated handover doc to ensure all staff using they/them",
      "Arranged transport to Proud Trust group (low-key, Alex's request)",
      "Reviewed contact arrangements — Mum visits remain unchanged, no disclosure pressure",
    ],
    pronounsUsedConsistently: true,
    preferredNameUsedConsistently: true,
    childVoice:
      "I told Anna because I knew she'd be cool. I'm not ready to tell Mum — she'd not get it and I don't want to lose visits. Staff using they/them feels normal now. The youth group is good — first time I've met other people like me.",
    staffObservation:
      "Alex appears settled in their identity within Oak House. Confidence has grown since first disclosure. They are clear about what they want shared and with whom — staff respect this absolutely. No signs of distress related to identity; Alex's worries are externally focused (family, school) and proportionate. Continue child-led pacing.",
    flagsConcerns: [
      "Watch for any change in mood ahead of family contact (could indicate disclosure stress)",
      "Be alert to school-based incidents — Alex hasn't named the peer who commented",
    ],
    reviewDate: d(21),
    keyWorker: "staff_anna",
  },
  {
    id: "lgbtq-002",
    youngPerson: "yp_casey",
    lastUpdated: d(-14),
    identityAsShared: "Still figuring it out — currently describes as 'maybe ace, maybe aro, not sure yet'",
    pronouns: "she/her (no change — Casey has been clear)",
    whoKnowsAtChildPace: [
      "Key worker (Anna) — Casey raised it during a quiet 1:1",
      "Art therapist (knows in general terms, Casey's choice)",
      "NOT shared with peers — Casey not interested in making it visible",
      "NOT a family conversation — Casey's mum has not asked, Casey not pursuing",
    ],
    outAtSchool: "No",
    outToFamily: "Not yet decided",
    identityAffirmingActions: [
      "No assumptions made about future relationships in care planning conversations",
      "Casey's lack of interest in dating respected — not framed as a deficit",
      "Asexuality explained gently when Casey asked (resources from AVEN shared)",
      "LGBTQ+ inclusive books on lounge shelf available, no spotlight",
      "Sex and relationships education adapted — Anna confirmed ace/aro identities are valid options",
    ],
    challengesFaced: [
      "Casey worries something is 'wrong' with not feeling attraction — reassurance ongoing",
      "Peer conversations about crushes can feel isolating — Casey opts out, supported",
    ],
    externalSupport: [
      "AVEN (Asexuality Visibility and Education Network) — written resources only",
      "Stonewall What is Asexuality? page — Casey read with Anna",
    ],
    staffActionsThisMonth: [
      "Anna affirmed that ace/aro are valid identities, no need for label commitment",
      "Reviewed any care language to remove assumed-heterosexual or assumed-attraction phrasing",
      "Made clear Casey can revisit this any time, in any direction",
    ],
    pronounsUsedConsistently: true,
    preferredNameUsedConsistently: true,
    childVoice:
      "I don't really fancy people. Anna said that's okay and there's a word for it — ace. I might be that. I might not. I don't want to tell anyone else right now and I don't want it to be a thing.",
    staffObservation:
      "Casey is exploring quietly and at her own pace. There is no urgency on her part and we do not impose any. Key task is ensuring no language or assumption in our care planning forecloses possibilities. Casey trusts Anna with this — we protect that trust by not widening the circle.",
    flagsConcerns: [
      "Watch for distress around peer dating talk — provide alternative spaces",
      "Ensure SRE delivery is inclusive of ace/aro identities",
    ],
    reviewDate: d(45),
    keyWorker: "staff_anna",
  },
];

const exportCols: ExportColumn<InclusionRecord>[] = [
  { header: "Young Person", accessor: (r: InclusionRecord) => getYPName(r.youngPerson) },
  { header: "Identity (as shared)", accessor: (r: InclusionRecord) => r.identityAsShared },
  { header: "Pronouns", accessor: (r: InclusionRecord) => r.pronouns },
  { header: "Preferred Name", accessor: (r: InclusionRecord) => r.preferredName ?? "" },
  { header: "Out at School", accessor: (r: InclusionRecord) => r.outAtSchool },
  { header: "Out to Family", accessor: (r: InclusionRecord) => r.outToFamily },
  { header: "Pronouns Used Consistently", accessor: (r: InclusionRecord) => (r.pronounsUsedConsistently ? "Yes" : "No") },
  { header: "External Support Sources", accessor: (r: InclusionRecord) => r.externalSupport.length.toString() },
  { header: "Last Updated", accessor: (r: InclusionRecord) => r.lastUpdated },
  { header: "Review Date", accessor: (r: InclusionRecord) => r.reviewDate },
  { header: "Key Worker", accessor: (r: InclusionRecord) => getStaffName(r.keyWorker) },
];

const outChip = (status: InclusionRecord["outAtSchool"]) => {
  switch (status) {
    case "Yes":
      return "bg-emerald-100 text-emerald-800";
    case "Selectively":
      return "bg-teal-100 text-teal-800";
    case "No":
      return "bg-slate-100 text-slate-700";
    case "Not yet decided":
      return "bg-purple-100 text-purple-800";
  }
};

export default function LGBTQInclusionRecordPage() {
  const [search, setSearch] = useState("");
  const [filterYP, setFilterYP] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterYP !== "all") items = items.filter((r) => r.youngPerson === filterYP);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (r) =>
          getYPName(r.youngPerson).toLowerCase().includes(q) ||
          r.identityAsShared.toLowerCase().includes(q) ||
          r.pronouns.toLowerCase().includes(q) ||
          r.externalSupport.some((s) => s.toLowerCase().includes(q)),
      );
    }
    items.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.youngPerson.localeCompare(b.youngPerson);
        case "review":
          return a.reviewDate.localeCompare(b.reviewDate);
        case "updated":
          return b.lastUpdated.localeCompare(a.lastUpdated);
        default:
          return 0;
      }
    });
    return items;
  }, [search, filterYP, sortBy]);

  const totalPlans = data.length;
  const consistencyCount = data.filter((r) => r.pronounsUsedConsistently && r.preferredNameUsedConsistently).length;
  const activeSupport = data.filter((r) => r.externalSupport.length > 0).length;
  const reviewsDue = data.filter((r) => {
    const days = (new Date(r.reviewDate).getTime() - Date.now()) / 86_400_000;
    return days <= 30;
  }).length;

  return (
    <PageShell
      title="LGBTQ+ Inclusion Record"
      subtitle="Per-child record of identity affirmation, pronouns, allyship and support — child-led, child-paced"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="lgbtq-inclusion-record" />
          <PrintButton title="LGBTQ+ Inclusion Record" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-purple-700">{totalPlans}</p>
          <p className="text-xs text-muted-foreground">Inclusion Plans</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-teal-700">
            {consistencyCount}/{totalPlans}
          </p>
          <p className="text-xs text-muted-foreground">Pronouns / Name Consistency</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-purple-700">{activeSupport}</p>
          <p className="text-xs text-muted-foreground">Active External Support</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{reviewsDue}</p>
          <p className="text-xs text-muted-foreground">Reviews Due (30d)</p>
        </div>
      </div>

      <div className="rounded-lg bg-purple-50 border border-purple-200 p-3 mb-6 flex items-start gap-2">
        <Heart className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
        <p className="text-sm text-purple-900">
          This record is child-led and child-paced. Identity is shared on the young person&apos;s terms, with the
          people they choose. Staff affirm pronouns and preferred names without conditions, never disclose without
          consent, and never apply pressure to come out — at home, school, or anywhere else.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search identity, pronouns, support…"
            className="w-full rounded-md border pl-8 pr-3 py-2 text-sm"
          />
        </div>
        <Select value={filterYP} onValueChange={setFilterYP}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="All Children" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Children</SelectItem>
            <SelectItem value="yp_alex">{getYPName("yp_alex")}</SelectItem>
            <SelectItem value="yp_casey">{getYPName("yp_casey")}</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">By Child</SelectItem>
              <SelectItem value="review">Earliest Review</SelectItem>
              <SelectItem value="updated">Recently Updated</SelectItem>
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
                  <Sparkles className="h-5 w-5 text-purple-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {getYPName(r.youngPerson)}
                      {r.preferredName ? ` · ${r.preferredName.split(" ")[0]}` : ""}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium">
                        {r.identityAsShared}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-medium">
                        {r.pronouns}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${outChip(r.outAtSchool)}`}>
                        School: {r.outAtSchool}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${outChip(r.outToFamily)}`}>
                        Family: {r.outToFamily}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {r.pronounsUsedConsistently && r.preferredNameUsedConsistently && (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  )}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">
                      <MessageCircle className="h-3 w-3 inline mr-1" />
                      Child Voice
                    </p>
                    <p className="text-sm text-purple-900 italic">&ldquo;{r.childVoice}&rdquo;</p>
                  </div>

                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-teal-800 uppercase tracking-wide mb-1">
                      Staff Observation
                    </p>
                    <p className="text-sm text-teal-900">{r.staffObservation}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        <Users className="h-3 w-3 inline mr-1" />
                        Who Knows (at child&apos;s pace)
                      </p>
                      <ul className="space-y-1">
                        {r.whoKnowsAtChildPace.map((w, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-purple-600 mt-0.5">•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        <Shield className="h-3 w-3 inline mr-1" />
                        Identity-Affirming Actions
                      </p>
                      <ul className="space-y-1">
                        {r.identityAffirmingActions.map((a, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <Heart className="h-3 w-3 text-purple-500 mt-1 shrink-0" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {r.challengesFaced.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-900 uppercase tracking-wide mb-1">
                        Challenges Faced
                      </p>
                      <ul className="space-y-1">
                        {r.challengesFaced.map((c, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      <ExternalLink className="h-3 w-3 inline mr-1" />
                      External Support
                    </p>
                    <ul className="space-y-1">
                      {r.externalSupport.map((s, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <span className="text-teal-600 mt-0.5">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Staff Actions This Month
                    </p>
                    <ul className="space-y-1">
                      {r.staffActionsThisMonth.map((a, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <CheckCircle className="h-3 w-3 text-emerald-500 mt-1 shrink-0" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {r.flagsConcerns.length > 0 && (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-rose-900 uppercase tracking-wide mb-1">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        Flags / Things to Watch
                      </p>
                      <ul className="space-y-1">
                        {r.flagsConcerns.map((f, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <AlertTriangle className="h-3 w-3 text-rose-500 mt-1 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span>
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Last updated: {r.lastUpdated}
                    </span>
                    <span>Review due: {r.reviewDate}</span>
                    <span>Key worker: {getStaffName(r.keyWorker)}</span>
                    {r.pronounsUsedConsistently && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                        Pronouns consistent
                      </span>
                    )}
                    {r.preferredNameUsedConsistently && (
                      <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-medium">
                        Preferred name consistent
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> This record supports the Equality Act 2010 (protected
          characteristics including gender reassignment and sexual orientation), Children&apos;s Homes
          Regulations 2015 Quality Standard 6 (enjoyment and achievement) and Quality Standard 7 (positive
          relationships), Keeping Children Safe in Education 2024 (LGBTQ+ pupils and safeguarding), UNCRC
          Article 8 (right to identity), and Working Together to Safeguard Children 2023 (responding to
          children&apos;s individual needs). All disclosure, contact and visibility decisions remain with the
          young person.
        </p>
      </div>
    </PageShell>
  );
}
