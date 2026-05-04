"use client";

import { useState, useMemo } from "react";
import {
  Heart,
  Flower,
  Calendar,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  AlertTriangle,
  Users,
  BookOpen,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

/* ── types ─────────────────────────────────────────────────────────────── */

type LossType =
  | "Death of parent"
  | "Death of grandparent"
  | "Death of sibling"
  | "Death of friend"
  | "Death of pet"
  | "Loss of foster carer"
  | "Loss of birth family contact"
  | "Loss of country/community"
  | "Loss of identity"
  | "Other significant loss";

type GriefStage =
  | "Acute (0-3m)"
  | "Adjusting (3-12m)"
  | "Integrated (12m+)"
  | "Complicated grief";

interface BereavementRecord {
  id: string;
  youngPerson: string;
  recordDate: string;
  lossType: LossType;
  personOrThing: string;
  dateOfLoss?: string;
  relationship: string;
  griefStage: GriefStage;
  childResponse: string[];
  supportProvided: string[];
  externalSupport?: string;
  memoryWork: string[];
  anniversaryMarked: boolean;
  anniversaryDate?: string;
  childVoice: string;
  staffObservation: string;
  flagsForReview: string[];
  reviewDate: string;
  keyWorker: string;
}

const d = (n: number) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };

/* ── colour maps ───────────────────────────────────────────────────────── */

const LOSS_COLOURS: Record<LossType, string> = {
  "Death of parent": "bg-rose-100 text-rose-800",
  "Death of grandparent": "bg-rose-100 text-rose-800",
  "Death of sibling": "bg-rose-100 text-rose-800",
  "Death of friend": "bg-rose-100 text-rose-800",
  "Death of pet": "bg-amber-100 text-amber-800",
  "Loss of foster carer": "bg-amber-100 text-amber-800",
  "Loss of birth family contact": "bg-purple-100 text-purple-800",
  "Loss of country/community": "bg-indigo-100 text-indigo-800",
  "Loss of identity": "bg-purple-100 text-purple-800",
  "Other significant loss": "bg-gray-100 text-gray-700",
};

const STAGE_COLOURS: Record<GriefStage, string> = {
  "Acute (0-3m)": "bg-rose-100 text-rose-800",
  "Adjusting (3-12m)": "bg-amber-100 text-amber-800",
  "Integrated (12m+)": "bg-emerald-100 text-emerald-800",
  "Complicated grief": "bg-red-100 text-red-800",
};

/* ── seed ──────────────────────────────────────────────────────────────── */

const SEED: BereavementRecord[] = [
  {
    id: "br1",
    youngPerson: "yp_casey",
    recordDate: d(-21),
    lossType: "Death of grandparent",
    personOrThing: "Grandad Tom (paternal)",
    dateOfLoss: d(-24),
    relationship: "Casey&apos;s grandad on dad&apos;s side. Casey saw him every other Sunday until age 9. He sent birthday cards every year of Casey&apos;s life — even during the gaps in contact.",
    griefStage: "Acute (0-3m)",
    childResponse: [
      "Tearful at unexpected moments — particularly Sunday afternoons",
      "Asked many questions about what happens after death",
      "Drew pictures of grandad in the garden",
      "Reduced appetite for first week, now returning",
      "Wanted to wear grandad&apos;s old jumper to bed",
    ],
    supportProvided: [
      "Anna sat with Casey when she heard the news — no rushing, no fixing",
      "Allowed Casey to choose whether to attend the funeral (she chose to go, accompanied by gran)",
      "Created a quiet memory corner in Casey&apos;s bedroom with photos and the jumper",
      "Daily check-ins kept light — &apos;how are you today?&apos; not &apos;are you sad?&apos;",
      "Made grandad&apos;s favourite biscuits together (custard creams)",
    ],
    externalSupport: "Referral made to Winston&apos;s Wish — first session booked for next week. School pastoral team informed and supporting at school.",
    memoryWork: [
      "Memory box with photos, the birthday cards, and pressed flowers from his garden",
      "Story journal — Casey is writing down stories grandad told her",
      "Planted a rosemary plant on the windowsill (his favourite herb)",
    ],
    anniversaryMarked: true,
    anniversaryDate: d(341),
    childVoice: "I keep thinking he&apos;ll send me a birthday card. I know he can&apos;t but my brain forgets. Anna said it&apos;s ok that my brain forgets sometimes.",
    staffObservation: "Casey is grieving openly and appropriately for her age. She is using the relationships available to her. The strong bond with her gran is providing essential continuity. Watch for delayed reactions around birthday and Christmas.",
    flagsForReview: [
      "Sleep settling has been disrupted — monitor for next 4 weeks",
      "First birthday after loss falls in 6 weeks — plan support",
    ],
    reviewDate: d(14),
    keyWorker: "staff_anna",
  },
  {
    id: "br2",
    youngPerson: "yp_casey",
    recordDate: d(-180),
    lossType: "Death of pet",
    personOrThing: "Hopscotch (Casey&apos;s pet rabbit)",
    dateOfLoss: d(-183),
    relationship: "Casey&apos;s rabbit since age 7. Came with her into care. The most consistent companion through all her placements.",
    griefStage: "Adjusting (3-12m)",
    childResponse: [
      "Initially inconsolable — refused school for two days",
      "Slept with Hopscotch&apos;s blanket for several weeks",
      "Wrote a letter to Hopscotch and read it at the burial",
      "Now talks about him fondly without distress most of the time",
    ],
    supportProvided: [
      "Allowed Casey to lead the burial in the garden — she chose the spot under the apple tree",
      "Made a small wooden sign together — &apos;Hopscotch — best bunny ever&apos;",
      "Created a photo book of all his adventures",
      "Did not minimise the loss — pet grief is real grief",
    ],
    externalSupport: undefined,
    memoryWork: [
      "Apple tree memorial spot — Casey visits when she wants to talk to him",
      "Photo book kept in her bedroom",
      "Decided not to get another rabbit yet — wants to wait until it feels right",
    ],
    anniversaryMarked: true,
    anniversaryDate: d(182),
    childVoice: "He was with me through everything. Three foster homes and Oak House. I think he was the only one who really knew me the whole way through.",
    staffObservation: "Casey has worked through this loss with great resilience. The grief now sits alongside her, rather than overwhelming her. Important to recognise the depth of this loss given his role across all her placements.",
    flagsForReview: [],
    reviewDate: d(60),
    keyWorker: "staff_anna",
  },
  {
    id: "br3",
    youngPerson: "yp_alex",
    recordDate: d(-35),
    lossType: "Loss of birth family contact",
    personOrThing: "Birth father (Craig) — contact ended after Alex came out",
    dateOfLoss: d(-38),
    relationship: "Birth father. Contact had been monthly but already inconsistent. After Alex came out as non-binary, dad sent a message ending contact. Alex hasn&apos;t heard from him since.",
    griefStage: "Acute (0-3m)",
    childResponse: [
      "Initial withdrawal — spent two days mostly in bedroom",
      "Anger directed inward — &apos;there&apos;s something wrong with me&apos;",
      "Periods of intense focus on college work as distraction",
      "Difficulty with male staff for first two weeks — gently easing",
      "Late-night conversations with Anna — small, quiet disclosures",
    ],
    supportProvided: [
      "Named the loss explicitly — &apos;this is grief, not just rejection&apos;",
      "Reaffirmed that dad&apos;s response is about him, not about who Alex is",
      "Did not push Alex to talk — left door open, made Alex&apos;s preferred snacks available",
      "Connected Alex with mentor through Mermaids — they have lived experience of similar loss",
      "Birth mum (Michelle) has stepped up contact — affirming and protective",
    ],
    externalSupport: "Mermaids peer mentor — fortnightly video calls. CAMHS aware. Alex declined formal therapy for now but the door is open.",
    memoryWork: [
      "Alex chose to keep the box of dad&apos;s old letters in the loft, not in the bedroom — &apos;not ready to throw them but not ready to look at them&apos;",
      "Working with Anna on a life story chapter that includes the loss without making dad the centre of the story",
    ],
    anniversaryMarked: false,
    childVoice: "It&apos;s like he died but he didn&apos;t. Worse maybe — because he chose to leave. I can&apos;t mourn him the normal way because he&apos;s still out there somewhere not wanting me.",
    staffObservation: "This is a complex disenfranchised grief — the kind that gets less recognition because there&apos;s no funeral, no ritual. The identity dimension makes it especially heavy. Alex&apos;s emerging trust with Anna is the lifeline. Important not to rush the timeline.",
    flagsForReview: [
      "Self-talk shows internalised rejection — watch for impact on self-esteem",
      "Father&apos;s birthday in 8 weeks — plan ahead",
      "Coordinate with CAMHS if low mood persists past 8 weeks",
    ],
    reviewDate: d(7),
    keyWorker: "staff_anna",
  },
  {
    id: "br4",
    youngPerson: "yp_jordan",
    recordDate: d(-90),
    lossType: "Death of friend",
    personOrThing: "Bilal — best friend from primary school who moved away",
    dateOfLoss: d(-95),
    relationship: "Jordan and Bilal were inseparable from age 6 to 9. Bilal&apos;s family moved to Manchester when Jordan was 9 — they kept in touch by phone. Bilal moved away two months ago when his dad got a job in Birmingham. Jordan now describes this as a loss, not just a move.",
    griefStage: "Adjusting (3-12m)",
    childResponse: [
      "Quiet for the first week",
      "Drew the two of them in art therapy",
      "Asked thoughtful questions about whether friendships can survive distance",
      "Took longer to settle into new peer group at school",
    ],
    supportProvided: [
      "Validated that this is a real loss, not &apos;just&apos; a move",
      "Helped Jordan write a letter and put together a small parcel",
      "Set up monthly video call schedule with Bilal&apos;s mum",
      "Gentle introduction to other peer group activities — at Jordan&apos;s pace",
    ],
    externalSupport: "Art therapist (Dr Shah) is incorporating the loss into ongoing sessions.",
    memoryWork: [
      "Photo printed and framed for Jordan&apos;s shelf",
      "Memory journal of shared adventures",
      "Plan to visit Birmingham for a weekend in the school holidays",
    ],
    anniversaryMarked: false,
    childVoice: "Everyone I get close to leaves. Mum, the foster lady, now Bilal. I don&apos;t think it&apos;s anyone&apos;s fault. It&apos;s just how my life is.",
    staffObservation: "Jordan&apos;s grief here connects to a larger pattern of cumulative loss. Each new loss reactivates the earlier ones. Important to acknowledge the pattern without making it determinative — this loss is also its own thing. Art therapy is providing essential processing space.",
    flagsForReview: [
      "Watch for reactivation of attachment-related distress",
      "Cumulative loss narrative needs gentle reframing over time",
    ],
    reviewDate: d(30),
    keyWorker: "staff_chervelle",
  },
  {
    id: "br5",
    youngPerson: "yp_jordan",
    recordDate: d(-300),
    lossType: "Loss of country/community",
    personOrThing: "Childhood Pakistani-British community in Bradford",
    dateOfLoss: d(-720),
    relationship: "Jordan grew up in a tight-knit Pakistani-British community in Bradford — extended family, mosque, Eid celebrations, Urdu spoken at home, halal food, familiar faces on every street. When Jordan came into care at age 5 the placement was 80 miles away in a predominantly white area. The community was lost in a single day.",
    griefStage: "Integrated (12m+)",
    childResponse: [
      "In early years — confusion about cultural identity, refusal of cultural foods",
      "Around age 9 — questions about heritage, asked to learn some Urdu",
      "Teenage — anger at the system that severed cultural connection",
      "Now — actively rebuilding cultural identity with support",
    ],
    supportProvided: [
      "Sourced Urdu lessons through online tutor (Jordan attends weekly)",
      "Connected with a local mosque — Jordan attends Friday prayers occasionally with a member of staff who is Muslim",
      "Halal meals available routinely (not as a special request)",
      "Eid celebrated in the home — staff learned, didn&apos;t ask Jordan to teach",
      "Cultural mentor through Pakistani Welfare Association — monthly contact",
    ],
    externalSupport: "Pakistani Welfare Association cultural mentor. Imam at local mosque is a known supporter for the home. SW has made cultural connection a placement priority.",
    memoryWork: [
      "Family tree project with extended family in Bradford (with SW support)",
      "Recipe book — gathering family recipes through aunties",
      "Annual visit to Bradford — staying in a B&B near the old neighbourhood",
    ],
    anniversaryMarked: false,
    childVoice: "I forgot what Eid felt like. I was a Pakistani Muslim kid and then I was just a kid in care. Now I&apos;m rebuilding. It&apos;s like learning a song I used to know.",
    staffObservation: "Cultural and community loss is one of the most under-recognised forms of grief in the care system. Jordan&apos;s active reclamation work is healing — but it cannot give back what was taken. Staff role is to remove every barrier and follow Jordan&apos;s lead.",
    flagsForReview: [
      "Annual Bradford visit needs planning — June",
      "Ramadan support plan to be agreed before March",
    ],
    reviewDate: d(45),
    keyWorker: "staff_chervelle",
  },
];

/* ── flat row for export ───────────────────────────────────────────────── */

interface FlatRow {
  youngPerson: string;
  recordDate: string;
  lossType: string;
  personOrThing: string;
  dateOfLoss: string;
  griefStage: string;
  externalSupport: string;
  anniversaryMarked: string;
  anniversaryDate: string;
  reviewDate: string;
  keyWorker: string;
  childVoice: string;
  staffObservation: string;
}

const exportCols: ExportColumn<FlatRow>[] = [
  { header: "Young Person", accessor: (r: FlatRow) => r.youngPerson },
  { header: "Record Date", accessor: (r: FlatRow) => r.recordDate },
  { header: "Loss Type", accessor: (r: FlatRow) => r.lossType },
  { header: "Person/Thing Lost", accessor: (r: FlatRow) => r.personOrThing },
  { header: "Date of Loss", accessor: (r: FlatRow) => r.dateOfLoss },
  { header: "Grief Stage", accessor: (r: FlatRow) => r.griefStage },
  { header: "External Support", accessor: (r: FlatRow) => r.externalSupport },
  { header: "Anniversary Marked", accessor: (r: FlatRow) => r.anniversaryMarked },
  { header: "Anniversary Date", accessor: (r: FlatRow) => r.anniversaryDate },
  { header: "Review Date", accessor: (r: FlatRow) => r.reviewDate },
  { header: "Key Worker", accessor: (r: FlatRow) => r.keyWorker },
  { header: "Child Voice", accessor: (r: FlatRow) => r.childVoice },
  { header: "Staff Observation", accessor: (r: FlatRow) => r.staffObservation },
];

/* ── component ─────────────────────────────────────────────────────────── */

export default function BereavementLossSupportPage() {
  const [data] = useState<BereavementRecord[]>(SEED);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterLoss, setFilterLoss] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");

  const toggle = (id: string) => setExpandedId((cur) => (cur === id ? null : id));

  /* ── stats ────────────────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const activeGrief = data.filter((r) => r.griefStage === "Acute (0-3m)" || r.griefStage === "Adjusting (3-12m)" || r.griefStage === "Complicated grief").length;
    const today = new Date();
    const monthFromNow = new Date();
    monthFromNow.setDate(monthFromNow.getDate() + 30);
    const anniversariesThisMonth = data.filter((r) => {
      if (!r.anniversaryMarked || !r.anniversaryDate) return false;
      const ann = new Date(r.anniversaryDate);
      return ann >= today && ann <= monthFromNow;
    }).length;
    const externalEngaged = data.filter((r) => r.externalSupport && r.externalSupport.length > 0).length;
    const reviewsDue = data.filter((r) => r.reviewDate <= d(30)).length;
    return { activeGrief, anniversariesThisMonth, externalEngaged, reviewsDue };
  }, [data]);

  /* ── filter / sort ────────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = data;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        getYPName(r.youngPerson).toLowerCase().includes(q) ||
        r.personOrThing.toLowerCase().includes(q) ||
        r.lossType.toLowerCase().includes(q) ||
        r.relationship.toLowerCase().includes(q)
      );
    }
    if (filterLoss !== "all") list = list.filter((r) => r.lossType === filterLoss);
    const out = [...list];
    switch (sortBy) {
      case "date": out.sort((a, b) => b.recordDate.localeCompare(a.recordDate)); break;
      case "child": out.sort((a, b) => getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson))); break;
      case "stage": out.sort((a, b) => a.griefStage.localeCompare(b.griefStage)); break;
      case "review": out.sort((a, b) => a.reviewDate.localeCompare(b.reviewDate)); break;
    }
    return out;
  }, [data, search, filterLoss, sortBy]);

  /* ── export rows ──────────────────────────────────────────────────── */
  const exportRows = useMemo<FlatRow[]>(() =>
    data.map((r) => ({
      youngPerson: getYPName(r.youngPerson),
      recordDate: r.recordDate,
      lossType: r.lossType,
      personOrThing: r.personOrThing,
      dateOfLoss: r.dateOfLoss ?? "",
      griefStage: r.griefStage,
      externalSupport: r.externalSupport ?? "",
      anniversaryMarked: r.anniversaryMarked ? "Yes" : "No",
      anniversaryDate: r.anniversaryDate ?? "",
      reviewDate: r.reviewDate,
      keyWorker: getStaffName(r.keyWorker),
      childVoice: r.childVoice,
      staffObservation: r.staffObservation,
    })), [data]);

  const lossTypes: LossType[] = [
    "Death of parent", "Death of grandparent", "Death of sibling", "Death of friend",
    "Death of pet", "Loss of foster carer", "Loss of birth family contact",
    "Loss of country/community", "Loss of identity", "Other significant loss",
  ];

  return (
    <PageShell
      title="Bereavement &amp; Loss Support"
      subtitle="Holding space for grief — child-led, trauma-informed support across every kind of loss"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Bereavement & Loss Support" />
          <ExportButton data={exportRows} columns={exportCols} filename="bereavement-loss-support" />
        </div>
      }
    >
      {/* ── stat strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active grief work", value: stats.activeGrief, icon: Heart, colour: "text-rose-600" },
          { label: "Anniversaries this month", value: stats.anniversariesThisMonth, icon: Calendar, colour: stats.anniversariesThisMonth > 0 ? "text-amber-600" : "text-gray-400" },
          { label: "External support engaged", value: stats.externalEngaged, icon: Users, colour: "text-purple-600" },
          { label: "Reviews due (30d)", value: stats.reviewsDue, icon: AlertTriangle, colour: stats.reviewsDue > 0 ? "text-amber-600" : "text-gray-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border bg-white p-4 flex items-center gap-3">
            <s.icon className={cn("h-6 w-6", s.colour)} />
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── opening note ──────────────────────────────────────────── */}
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 mb-6">
        <div className="flex items-start gap-2">
          <Flower className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong>Holding grief together.</strong> Children in our care carry losses that often go unnamed — birth family, foster carers, pets, identity, country, community. This page records how we walk alongside them. Every entry is led by the child&apos;s voice, paced by their needs, and held with dignity.
          </div>
        </div>
      </div>

      {/* ── filters ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by child, loss, or relationship…"
            className="w-full rounded-md border py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <Select value={filterLoss} onValueChange={setFilterLoss}>
          <SelectTrigger className="w-[230px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All loss types</SelectItem>
            {lossTypes.map((lt) => <SelectItem key={lt} value={lt}>{lt}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <ArrowUpDown className="h-4 w-4" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Most recent</SelectItem>
              <SelectItem value="child">Child name</SelectItem>
              <SelectItem value="stage">Grief stage</SelectItem>
              <SelectItem value="review">Review date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── records ────────────────────────────────────────────────── */}
      <div className="space-y-4 mb-8">
        {filtered.map((r) => {
          const open = expandedId === r.id;
          return (
            <div key={r.id} className="rounded-lg border border-rose-100 bg-white">
              <button
                onClick={() => toggle(r.id)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-rose-50/40"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Heart className="h-4 w-4 text-rose-400" />
                    <h3 className="font-semibold">{getYPName(r.youngPerson)}</h3>
                    <span className="text-sm text-gray-600">— {r.personOrThing}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", LOSS_COLOURS[r.lossType])}>{r.lossType}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", STAGE_COLOURS[r.griefStage])}>{r.griefStage}</span>
                    {r.anniversaryMarked && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Anniversary {r.anniversaryDate ?? "—"}
                      </span>
                    )}
                    {r.flagsForReview.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 inline-flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> {r.flagsForReview.length} flag{r.flagsForReview.length === 1 ? "" : "s"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Recorded {r.recordDate} · Key worker {getStaffName(r.keyWorker)} · Review {r.reviewDate}
                  </p>
                </div>
                {open ? <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" /> : <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />}
              </button>

              {open && (
                <div className="border-t border-rose-100 px-4 pb-4 space-y-4">
                  {/* relationship */}
                  <div className="rounded-md bg-gray-50 p-3 mt-3">
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">Relationship &amp; context</h4>
                    <p className="text-sm">{r.relationship}</p>
                    {r.dateOfLoss && (
                      <p className="text-xs text-gray-500 mt-1">Date of loss: {r.dateOfLoss}</p>
                    )}
                  </div>

                  {/* child voice */}
                  <div className="rounded-md bg-rose-50 border border-rose-200 p-3">
                    <h4 className="text-xs font-semibold text-rose-700 mb-1">Child&apos;s voice</h4>
                    <p className="text-sm italic text-rose-900">&ldquo;{r.childVoice}&rdquo;</p>
                  </div>

                  {/* staff observation */}
                  <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                    <h4 className="text-xs font-semibold text-amber-700 mb-1">Staff observation</h4>
                    <p className="text-sm text-amber-900">{r.staffObservation}</p>
                  </div>

                  {/* responses + support */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-blue-50 p-3">
                      <h4 className="text-xs font-semibold text-blue-700 mb-1">How the child has responded</h4>
                      <ul className="list-disc list-inside text-sm text-blue-900 space-y-0.5">
                        {r.childResponse.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-md bg-emerald-50 p-3">
                      <h4 className="text-xs font-semibold text-emerald-700 mb-1">Support provided</h4>
                      <ul className="list-disc list-inside text-sm text-emerald-900 space-y-0.5">
                        {r.supportProvided.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* memory work */}
                  <div className="rounded-md bg-purple-50 border border-purple-200 p-3">
                    <h4 className="text-xs font-semibold text-purple-700 mb-1 flex items-center gap-1">
                      <Flower className="h-3.5 w-3.5" /> Memory work
                    </h4>
                    <ul className="list-disc list-inside text-sm text-purple-900 space-y-0.5">
                      {r.memoryWork.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>

                  {/* external + anniversary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-indigo-50 border border-indigo-200 p-3">
                      <h4 className="text-xs font-semibold text-indigo-700 mb-1 flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" /> External support
                      </h4>
                      <p className="text-sm text-indigo-900">
                        {r.externalSupport ?? <span className="italic text-indigo-700/70">No external support engaged at this time.</span>}
                      </p>
                    </div>
                    <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                      <h4 className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Anniversary
                      </h4>
                      {r.anniversaryMarked && r.anniversaryDate ? (
                        <p className="text-sm text-amber-900">Marked annually — next: <span className="font-medium">{r.anniversaryDate}</span></p>
                      ) : (
                        <p className="text-sm italic text-amber-700/70">Not currently marked. Will revisit with the child as part of review.</p>
                      )}
                    </div>
                  </div>

                  {/* flags */}
                  {r.flagsForReview.length > 0 && (
                    <div className="rounded-md bg-red-50 border border-red-200 p-3">
                      <h4 className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> Flags for review
                      </h4>
                      <ul className="list-disc list-inside text-sm text-red-900 space-y-0.5">
                        {r.flagsForReview.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-lg border border-dashed bg-white p-8 text-center text-sm text-gray-500">
            No records match these filters.
          </div>
        )}
      </div>

      {/* ── regulatory footer ──────────────────────────────────────── */}
      <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-4 text-sm text-rose-900 mb-6">
        <strong>Regulatory framework.</strong> Bereavement and loss support is held within the Children&apos;s Homes (England) Regulations 2015 — particularly Quality Standard 6 (enjoyment &amp; achievement) and Quality Standard 7 (positive relationships). Practice draws on Working Together to Safeguard Children 2023, UNCRC Article 12 (the right to be heard) and Article 16 (privacy and dignity), and NICE guidance on bereavement (NG196). All grief work is child-led, paced by the young person, and recognises the breadth of loss experienced by children in care — including disenfranchised grief that the wider world may not see.
      </div>
    </PageShell>
  );
}
