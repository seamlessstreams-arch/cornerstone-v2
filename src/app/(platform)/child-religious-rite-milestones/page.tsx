"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Star,
  Heart,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Calendar,
  Award,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RiteRecord {
  id: string;
  youngPerson: string;
  recordedDate: string;
  riteName: string;
  faithTradition:
    | "Islam"
    | "Christianity"
    | "Judaism"
    | "Hinduism"
    | "Sikhism"
    | "Buddhism"
    | "Rastafari"
    | "Multi-faith / family choice"
    | "Other";
  childAgeAtRite?: number;
  status:
    | "Already done (pre-care)"
    | "Planned with home support"
    | "Considering — child-led"
    | "Declined by child"
    | "Postponed"
    | "Not applicable"
    | "Done in care";
  significance: string;
  preparation: string[];
  whoOfficiates?: string;
  venue?: string;
  guestsInvolved: string[];
  homeSupportProvided: string[];
  costFunding?: { amount: number; source: string };
  childChoice:
    | "Strongly chose"
    | "Family-influenced choice"
    | "Choosing between options"
    | "Not yet old enough to choose";
  birthFamilyInvolvement?: string;
  recordKept: string[];
  childVoice: string;
  staffObservation: string;
  flagsForReview: string[];
  reviewDate: string;
  keyWorker: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const records: RiteRecord[] = [
  {
    id: "rite_001",
    youngPerson: "yp_jordan",
    recordedDate: d(-60),
    riteName: "Aqeeqah (hair-shaving & naming ceremony)",
    faithTradition: "Islam",
    childAgeAtRite: 0,
    status: "Already done (pre-care)",
    significance:
      "Aqeeqah is the Islamic welcoming rite for a newborn — traditionally on the seventh day. Hair is shaved, the baby is named, and an animal is sacrificed with meat shared with family and the poor. For Jordan, this rite was completed in infancy with his paternal family in Pakistan and is a meaningful link to his heritage and to relatives he no longer sees.",
    preparation: [
      "No preparation needed in care — historic record only",
      "Life-story work session held with Jordan to confirm what he remembers being told",
      "Mum confirmed details on contact call and shared one photo via WhatsApp",
    ],
    whoOfficiates: "Paternal grandfather (Dada-ji), supported by local Imam in Lahore",
    venue: "Paternal family home, Lahore, Pakistan",
    guestsInvolved: [
      "Paternal grandparents",
      "Paternal aunts and uncles",
      "Mum and dad (then together)",
      "Local Imam",
    ],
    homeSupportProvided: [
      "Stored Aqeeqah certificate (Urdu + English translation) in Jordan's life-story box",
      "Two photos preserved in protective sleeve",
      "Discussed significance with Jordan during life-story work",
      "Imam Yusuf at local mosque confirmed and explained meaning when Jordan asked",
    ],
    childChoice: "Not yet old enough to choose",
    birthFamilyInvolvement:
      "Mum shared the date and the name-meaning. Paternal family no longer in contact but the rite itself remains a positive heritage anchor.",
    recordKept: [
      "Aqeeqah certificate — life-story box (locked cupboard, key-worker access)",
      "Two photos — life-story album",
      "Audio note: Jordan's mum explaining the day (recorded on contact call with consent)",
    ],
    childVoice:
      "I didn't know what Aqeeqah was until Imam Yusuf told me. I like that my family in Pakistan did it for me. It means I belong to them too even though I don't see them.",
    staffObservation:
      "Honouring this rite as a recorded part of Jordan's identity — even though it pre-dates care — strengthens his sense of heritage. Jordan was visibly moved to learn the meaning.",
    flagsForReview: [],
    reviewDate: d(180),
    keyWorker: "staff_anna",
  },
  {
    id: "rite_002",
    youngPerson: "yp_jordan",
    recordedDate: d(-14),
    riteName: "Beard milestone — facial hair & dignity in Muslim adulthood",
    faithTradition: "Islam",
    childAgeAtRite: 15,
    status: "Considering — child-led",
    significance:
      "Not a formal canonical rite, but a meaningful coming-of-age milestone for many Muslim young men. The beard carries spiritual significance in Sunni tradition and growing it is a personal step into adult faith identity. Jordan is approaching this with curiosity and pride and has discussed it with Imam Yusuf.",
    preparation: [
      "Conversation with Imam Yusuf at mosque (Jordan-led)",
      "Halal grooming products researched and purchased (alcohol-free beard oil)",
      "Private bathroom shelf agreed for Jordan's grooming items",
      "Key-worker check-in scheduled monthly to support without intruding",
    ],
    whoOfficiates: "No formal officiant — Imam Yusuf as mentor",
    venue: "Home (private, dignified)",
    guestsInvolved: [],
    homeSupportProvided: [
      "Halal/alcohol-free beard oil and trimmer purchased from cultural budget",
      "Privacy and dignity around facial hair growth — no teasing tolerated",
      "Staff briefed not to comment on appearance unless Jordan invites it",
      "Imam Yusuf offered to talk through religious aspects if Jordan wants",
    ],
    costFunding: { amount: 28.5, source: "Cultural & identity budget" },
    childChoice: "Strongly chose",
    birthFamilyInvolvement:
      "Mum aware and supportive on contact call — said dad would be proud. Jordan asked staff not to push this with mum (private to him).",
    recordKept: [
      "Note in identity plan",
      "Receipt for grooming products in cultural-budget log",
    ],
    childVoice:
      "It's not a big deal but it kind of is. My dad had a beard. I'm not making it religious yet but I want to be allowed to let it grow without anyone making a joke. Imam Yusuf said there's no rush.",
    staffObservation:
      "Jordan is approaching this milestone with maturity and self-direction. Honouring it as a noted milestone — rather than ignoring it — affirms his developing adult Muslim identity. Staff team briefed on dignity expectations.",
    flagsForReview: [
      "Confirm at next key-worker session whether Jordan wants this added to his Identity Plan formally",
    ],
    reviewDate: d(60),
    keyWorker: "staff_anna",
  },
  {
    id: "rite_003",
    youngPerson: "yp_casey",
    recordedDate: d(-90),
    riteName: "Confirmation (Church of England)",
    faithTradition: "Christianity",
    childAgeAtRite: 11,
    status: "Already done (pre-care)",
    significance:
      "Casey was confirmed at age 11 in the Church of England, with their grandad Tom standing as a sponsor. Grandad Tom has since passed away. The Bible he gifted Casey at confirmation is one of Casey's most treasured belongings and a tangible bond with him.",
    preparation: [
      "No preparation needed in care — historic record",
      "Life-story session held to capture Casey's memory of the day",
      "Photos from grandad's house retrieved by maternal aunt and copied for memory box",
    ],
    whoOfficiates: "Bishop (Diocese of Lincoln) at Casey's grandad's parish church",
    venue: "St Mary's Parish Church, Lincolnshire (grandad Tom's home parish)",
    guestsInvolved: [
      "Grandad Tom (sponsor — now deceased)",
      "Casey's mum",
      "Maternal aunt",
      "Two godparents",
    ],
    homeSupportProvided: [
      "Bible gifted by grandad kept on Casey's bedside table — never moved without permission",
      "Confirmation photos in memory box",
      "Bereavement-loss work links this rite to grief work around grandad",
      "Local Anglican vicar (Reverend Marsh) introduced as gentle ongoing contact if Casey wants",
    ],
    childChoice: "Family-influenced choice",
    birthFamilyInvolvement:
      "Grandad Tom was the central figure. Mum supportive but quiet on faith. Aunt has shared photos and is willing to talk about the day if Casey asks.",
    recordKept: [
      "Confirmation certificate — memory box",
      "Bible from grandad — Casey's bedside",
      "Four photos — memory box and life-story album",
      "Order of service from the day — memory box",
    ],
    childVoice:
      "Grandad gave me my Bible and he wrote in the front. I read what he wrote when I miss him. I don't go to church now but I'm still confirmed and that matters.",
    staffObservation:
      "This rite is interwoven with bereavement. Casey's relationship with the Bible and the words grandad wrote inside is sacred to them. Staff treat the Bible with absolute care. Reverend Marsh visit was warm and Casey decided independently they don't currently want to attend services.",
    flagsForReview: [
      "Sensitive to grief anniversaries — rite anniversary falls near grandad's death anniversary",
    ],
    reviewDate: d(90),
    keyWorker: "staff_darren",
  },
];

const exportCols: ExportColumn<RiteRecord>[] = [
  { header: "Young Person", accessor: (r: RiteRecord) => getYPName(r.youngPerson) },
  { header: "Recorded Date", accessor: (r: RiteRecord) => r.recordedDate },
  { header: "Rite", accessor: (r: RiteRecord) => r.riteName },
  { header: "Faith Tradition", accessor: (r: RiteRecord) => r.faithTradition },
  {
    header: "Age at Rite",
    accessor: (r: RiteRecord) => (r.childAgeAtRite !== undefined ? String(r.childAgeAtRite) : "—"),
  },
  { header: "Status", accessor: (r: RiteRecord) => r.status },
  { header: "Child Choice", accessor: (r: RiteRecord) => r.childChoice },
  { header: "Significance", accessor: (r: RiteRecord) => r.significance },
  { header: "Officiant", accessor: (r: RiteRecord) => r.whoOfficiates ?? "—" },
  { header: "Venue", accessor: (r: RiteRecord) => r.venue ?? "—" },
  { header: "Guests", accessor: (r: RiteRecord) => r.guestsInvolved.join("; ") },
  { header: "Home Support", accessor: (r: RiteRecord) => r.homeSupportProvided.join("; ") },
  {
    header: "Cost / Funding",
    accessor: (r: RiteRecord) =>
      r.costFunding ? `£${r.costFunding.amount.toFixed(2)} (${r.costFunding.source})` : "—",
  },
  {
    header: "Birth Family Involvement",
    accessor: (r: RiteRecord) => r.birthFamilyInvolvement ?? "—",
  },
  { header: "Record Kept", accessor: (r: RiteRecord) => r.recordKept.join("; ") },
  { header: "Child Voice", accessor: (r: RiteRecord) => r.childVoice },
  { header: "Staff Observation", accessor: (r: RiteRecord) => r.staffObservation },
  { header: "Flags for Review", accessor: (r: RiteRecord) => r.flagsForReview.join("; ") },
  { header: "Review Date", accessor: (r: RiteRecord) => r.reviewDate },
  { header: "Key Worker", accessor: (r: RiteRecord) => getStaffName(r.keyWorker) },
];

const faithColour: Record<RiteRecord["faithTradition"], string> = {
  Islam: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Christianity: "bg-rose-100 text-rose-800 border-rose-200",
  Judaism: "bg-blue-100 text-blue-800 border-blue-200",
  Hinduism: "bg-amber-100 text-amber-800 border-amber-200",
  Sikhism: "bg-orange-100 text-orange-800 border-orange-200",
  Buddhism: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Rastafari: "bg-green-100 text-green-800 border-green-200",
  "Multi-faith / family choice": "bg-purple-100 text-purple-800 border-purple-200",
  Other: "bg-slate-100 text-slate-800 border-slate-200",
};

const statusColour: Record<RiteRecord["status"], string> = {
  "Already done (pre-care)": "bg-teal-100 text-teal-800 border-teal-200",
  "Planned with home support": "bg-amber-100 text-amber-800 border-amber-200",
  "Considering — child-led": "bg-sky-100 text-sky-800 border-sky-200",
  "Declined by child": "bg-slate-100 text-slate-700 border-slate-200",
  Postponed: "bg-stone-100 text-stone-800 border-stone-200",
  "Not applicable": "bg-slate-100 text-slate-600 border-slate-200",
  "Done in care": "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const choiceColour: Record<RiteRecord["childChoice"], string> = {
  "Strongly chose": "bg-rose-100 text-rose-800 border-rose-200",
  "Family-influenced choice": "bg-amber-100 text-amber-800 border-amber-200",
  "Choosing between options": "bg-sky-100 text-sky-800 border-sky-200",
  "Not yet old enough to choose": "bg-slate-100 text-slate-700 border-slate-200",
};

export default function ChildReligiousRiteMilestonesPage() {
  const [search, setSearch] = useState("");
  const [faithFilter, setFaithFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "rite" | "faith" | "child">("recent");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = records.filter((rec) => {
      const matchesSearch =
        !search ||
        rec.riteName.toLowerCase().includes(search.toLowerCase()) ||
        rec.significance.toLowerCase().includes(search.toLowerCase()) ||
        getYPName(rec.youngPerson).toLowerCase().includes(search.toLowerCase());
      const matchesFaith = faithFilter === "all" || rec.faithTradition === faithFilter;
      return matchesSearch && matchesFaith;
    });
    r = [...r].sort((a, b) => {
      if (sortBy === "rite") return a.riteName.localeCompare(b.riteName);
      if (sortBy === "faith") return a.faithTradition.localeCompare(b.faithTradition);
      if (sortBy === "child") return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
      return b.recordedDate.localeCompare(a.recordedDate);
    });
    return r;
  }, [search, faithFilter, sortBy]);

  const stats = useMemo(() => {
    const total = records.length;
    const planned = records.filter(
      (r) => r.status === "Planned with home support" || r.status === "Done in care",
    ).length;
    const childChose = records.filter((r) => r.childChoice === "Strongly chose").length;
    const reviewSoon = records.filter((r) => r.reviewDate <= d(90) && r.reviewDate >= d(0)).length;
    return { total, planned, childChose, reviewSoon };
  }, []);

  return (
    <PageShell
      title="Religious Rites & Milestones"
      subtitle="Per-child rite-of-passage record — honouring faith milestones in care, including those that pre-date the placement"
      actions={
        <div className="flex gap-2">
          <ExportButton
            data={filtered}
            columns={exportCols}
            filename="child-religious-rite-milestones"
          />
          <PrintButton title="Religious Rites & Milestones" />
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-amber-800 text-sm mb-1">
            <Award className="h-4 w-4" />
            <span>Rites recorded</span>
          </div>
          <div className="text-2xl font-semibold text-amber-900">{stats.total}</div>
        </div>
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
          <div className="flex items-center gap-2 text-teal-800 text-sm mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Planned / done in care</span>
          </div>
          <div className="text-2xl font-semibold text-teal-900">{stats.planned}</div>
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-center gap-2 text-rose-800 text-sm mb-1">
            <Heart className="h-4 w-4" />
            <span>Child strongly chose</span>
          </div>
          <div className="text-2xl font-semibold text-rose-900">{stats.childChose}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Calendar className="h-4 w-4" />
            <span>Reviews due (90d)</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.reviewSoon}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rite, child or significance..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Select value={faithFilter} onValueChange={setFaithFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Faith tradition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All faith traditions</SelectItem>
            <SelectItem value="Islam">Islam</SelectItem>
            <SelectItem value="Christianity">Christianity</SelectItem>
            <SelectItem value="Judaism">Judaism</SelectItem>
            <SelectItem value="Hinduism">Hinduism</SelectItem>
            <SelectItem value="Sikhism">Sikhism</SelectItem>
            <SelectItem value="Buddhism">Buddhism</SelectItem>
            <SelectItem value="Rastafari">Rastafari</SelectItem>
            <SelectItem value="Multi-faith / family choice">
              Multi-faith / family choice
            </SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-full sm:w-52">
            <ArrowUpDown className="h-4 w-4 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recently recorded</SelectItem>
            <SelectItem value="rite">Rite name A→Z</SelectItem>
            <SelectItem value="faith">Faith A→Z</SelectItem>
            <SelectItem value="child">Child A→Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => {
          const isOpen = expandedId === r.id;
          return (
            <div
              key={r.id}
              className="rounded-lg border border-slate-200 bg-white overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(isOpen ? null : r.id)}
                className="w-full p-4 flex items-start justify-between gap-3 hover:bg-slate-50 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Star className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="font-semibold text-slate-900">{r.riteName}</span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full border",
                        faithColour[r.faithTradition],
                      )}
                    >
                      {r.faithTradition}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full border",
                        statusColour[r.status],
                      )}
                    >
                      {r.status}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full border",
                        choiceColour[r.childChoice],
                      )}
                    >
                      {r.childChoice}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">
                    {getYPName(r.youngPerson)}
                    {r.childAgeAtRite !== undefined ? ` · age ${r.childAgeAtRite} at rite` : ""}
                    {" · recorded "}
                    {r.recordedDate} · review {r.reviewDate}
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen ? (
                <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50/50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-amber-800 uppercase mb-2">
                        Rite & significance
                      </div>
                      <div className="text-sm font-semibold text-amber-900 mb-1">{r.riteName}</div>
                      <p className="text-sm text-amber-900">{r.significance}</p>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                        Preparation
                      </div>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {r.preparation.map((t, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-slate-400">·</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                        Officiant & venue
                      </div>
                      <div className="text-sm text-slate-700 space-y-1">
                        <div>
                          <span className="text-slate-500">Officiant: </span>
                          <span>{r.whoOfficiates ?? "—"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Venue: </span>
                          <span>{r.venue ?? "—"}</span>
                        </div>
                      </div>
                    </div>

                    {r.guestsInvolved.length ? (
                      <div className="rounded-md border border-slate-200 bg-white p-3">
                        <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                          Guests involved
                        </div>
                        <ul className="text-sm text-slate-700 space-y-1">
                          {r.guestsInvolved.map((t, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-slate-400">·</span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <div className="rounded-md border border-teal-200 bg-teal-50 p-3">
                      <div className="text-xs font-semibold text-teal-800 uppercase mb-2">
                        Home support provided
                      </div>
                      <ul className="text-sm text-teal-900 space-y-1">
                        {r.homeSupportProvided.map((t, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-teal-500">·</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                        Cost / funding
                      </div>
                      <p className="text-sm text-slate-700">
                        {r.costFunding
                          ? `£${r.costFunding.amount.toFixed(2)} — ${r.costFunding.source}`
                          : "No cost / not applicable"}
                      </p>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                        Child choice
                      </div>
                      <p className="text-sm text-slate-700">{r.childChoice}</p>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                        Birth family involvement
                      </div>
                      <p className="text-sm text-slate-700">
                        {r.birthFamilyInvolvement ?? "—"}
                      </p>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                        Record kept (where stored)
                      </div>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {r.recordKept.map((t, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-amber-500">·</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-md border border-rose-200 bg-rose-50 p-3">
                      <div className="text-xs font-semibold text-rose-800 uppercase mb-2">
                        Child voice
                      </div>
                      <p className="text-sm text-rose-900 italic">
                        &ldquo;{r.childVoice}&rdquo;
                      </p>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                        Staff observation
                      </div>
                      <p className="text-sm text-slate-700">{r.staffObservation}</p>
                    </div>

                    {r.flagsForReview.length ? (
                      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 lg:col-span-2">
                        <div className="text-xs font-semibold text-amber-800 uppercase mb-2">
                          Flags for review
                        </div>
                        <ul className="text-sm text-amber-900 space-y-1">
                          {r.flagsForReview.map((t, i) => (
                            <li key={i} className="flex gap-2">
                              <span>→</span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2 text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                      <span>Recorded: {r.recordedDate}</span>
                      <span>Review: {r.reviewDate}</span>
                      <span>Key worker: {getStaffName(r.keyWorker)}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="font-semibold mb-1">Regulatory framework</div>
        <p>
          Religious rites and rite-of-passage milestones are recorded with dignity, including those completed before the
          child entered care. Practice is grounded in the Children&rsquo;s Homes (England) Regulations 2015 Quality
          Standards 6 (Enjoyment &amp; Achievement) and 7 (Health &amp; Wellbeing), the Equality Act 2010 (religion or
          belief), and the home&rsquo;s Statement of Purpose. UNCRC Articles 8 (preservation of identity), 14 (freedom
          of thought, conscience and religion) and 30 (cultural and religious identity), together with Working Together
          to Safeguard Children 2023, frame the duty to honour each child&rsquo;s faith heritage. Rites are recorded —
          never imposed — and the child&rsquo;s own voice and pace lead the work. This page is distinct from the
          Religious Festival Celebrations record (annual events) and the Religious Observance Log (daily prayer and
          practice).
        </p>
      </div>
    </PageShell>
  );
}
