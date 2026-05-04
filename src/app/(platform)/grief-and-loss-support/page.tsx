"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Heart,
  ArrowUpDown,
  Search,
  AlertTriangle,
  Calendar,
  Users,
  Sparkles,
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

type LossType =
  | "Bereavement (death)"
  | "Separation from family"
  | "Placement loss"
  | "Pet bereavement"
  | "Friendship loss"
  | "Loss of identity (e.g. cultural)"
  | "Anticipatory loss"
  | "Multiple losses";

interface GriefRecord {
  id: string;
  youngPerson: string;
  lossType: LossType;
  lossDescription: string;
  dateOfLoss: string;
  timeSinceLoss: string;
  childRelationshipToLoss: string;
  griefStageObservation: string;
  externalSupportInPlace: string[];
  homeBasedSupport: string[];
  keyWorkerInvolvement: string;
  traditionsAndRituals: string[];
  anniversaryAcknowledgement: string;
  creativeOutlets: string[];
  commemorationActivities: string[];
  childCopingStrategies: string[];
  behavioursToWatchFor: string[];
  reviewSchedule: string;
  lastReviewDate: string;
  reviewedBy: string;
  nextReviewDate: string;
}

/* ── seed ──────────────────────────────────────────────────────────────── */

const d = (n: number) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };

const LOSS_TYPE_COLOURS: Record<LossType, string> = {
  "Bereavement (death)":            "bg-slate-100 text-slate-800",
  "Separation from family":         "bg-blue-100 text-blue-800",
  "Placement loss":                 "bg-amber-100 text-amber-800",
  "Pet bereavement":                "bg-emerald-100 text-emerald-800",
  "Friendship loss":                "bg-pink-100 text-pink-800",
  "Loss of identity (e.g. cultural)": "bg-purple-100 text-purple-800",
  "Anticipatory loss":              "bg-yellow-100 text-yellow-800",
  "Multiple losses":                "bg-rose-100 text-rose-800",
};

const SEED: GriefRecord[] = [
  {
    id: "gl1",
    youngPerson: "yp_alex",
    lossType: "Separation from family",
    lossDescription:
      "Ongoing loss of relationship with birth father. Father has repeatedly missed planned contact (DNA pattern over 18 months) and recently disengaged from the local authority altogether. Alex experiences this as a living loss — grief without a death — which is often unrecognised by others.",
    dateOfLoss: d(-540),
    timeSinceLoss: "Approx. 18 months of escalating disengagement; recent cessation of contact in the past 3 months.",
    childRelationshipToLoss:
      "Birth father — the parent Alex idealised in early childhood. Alex carries a complicated mix of love, anger, and self-blame. Often expressed as 'I don't care' but key worker observes underlying sadness and worthlessness narrative ('he must not love me').",
    griefStageObservation:
      "Moves between protest (anger about father's choices), denial ('I never wanted to see him anyway') and quiet sadness. Not linear. Currently presenting more flat affect — bargaining and meaning-making phase. Honour Alex's pace; do not push acceptance.",
    externalSupportInPlace: [
      "Cruse Bereavement Care — Young People's Service (referral made; awaiting first session)",
      "CAMHS clinical psychologist (Dr Patel) — regular sessions",
      "School pastoral lead — informal check-ins",
    ],
    homeBasedSupport: [
      "Weekly key worker 1:1 with Anna — protected time",
      "Trauma-informed responses around contact dates",
      "Permission to feel angry, sad or nothing at all — no pressure to talk",
      "Quiet space available during dysregulation",
    ],
    keyWorkerInvolvement:
      "Anna leads. Has built trust over 8 months. Uses 'alongside' moments (driving, cooking) rather than face-to-face conversations to allow Alex to open up. Tracks emotional weather. Liaises with CAMHS and Cruse.",
    traditionsAndRituals: [
      "Memory jar — Alex can drop in written or drawn memories of dad whenever wanted",
      "Birthday acknowledgement: a simple card to dad, posted or kept (Alex's choice)",
      "No forced 'sharing' — rituals are private if Alex prefers",
    ],
    anniversaryAcknowledgement:
      "Date of last contact (March) noted on key worker's diary. Anna will check in a few days before, offer presence not pressure. Father's birthday flagged so staff can be especially gentle that day.",
    creativeOutlets: [
      "Journalling — Alex keeps a private notebook",
      "Music playlist — making and listening as a regulation tool",
      "Writing letters that may never be sent (psychotherapist-recommended)",
    ],
    commemorationActivities: [
      "Walk to a local viewpoint dad once took Alex (initiated by Alex)",
      "Cooking a meal dad used to make — done quietly with key worker",
    ],
    childCopingStrategies: [
      "Withdrawal to bedroom (developmentally appropriate)",
      "Running and gym sessions",
      "Talking to brother on the phone",
      "Spending time with the home's dog",
    ],
    behavioursToWatchFor: [
      "Increased withdrawal beyond normal pattern",
      "Self-deprecating language ('no one wants me')",
      "Sleep disturbance around contact dates",
      "Risk-taking or self-harm urges (low risk currently — monitored)",
      "Sudden 'fine' presentation that masks distress",
    ],
    reviewSchedule: "6-weekly while active; sooner if any contact change",
    lastReviewDate: d(-21),
    reviewedBy: "staff_anna",
    nextReviewDate: d(21),
  },
  {
    id: "gl2",
    youngPerson: "yp_jordan",
    lossType: "Multiple losses",
    lossDescription:
      "Two interwoven losses. (1) Anticipatory loss around mum's pending release from prison — Jordan is grieving the imagined reunion that may not match reality, alongside loss of the structured contact pattern they have known since age 5. (2) Bereavement of family pet 'Biscuit' (cat, 14 years) who lived with Jordan's gran and was the constant during chaotic early years. Biscuit died 6 weeks ago.",
    dateOfLoss: d(-42),
    timeSinceLoss: "Pet bereavement 6 weeks ago; anticipatory loss intensifying as mum's release date approaches in approx. 3 months.",
    childRelationshipToLoss:
      "Biscuit was Jordan's emotional anchor in early childhood — slept on Jordan's bed during periods of domestic violence. The pet has come to represent safety itself. Mum's release brings hope but also fear: Jordan grieves the version of mum they imagined, and the predictability of weekly visits.",
    griefStageObservation:
      "Pet loss: acute grief — tearful, art outputs feature Biscuit, has asked thoughtful questions about death and what happens after. Anticipatory loss: oscillates between excitement and dread; sleep disturbance; somatic complaints (tummy aches before mum's video calls). Disorganised attachment intensifies both grief responses.",
    externalSupportInPlace: [
      "Art therapist (weekly, ongoing) — Biscuit features regularly in sessions",
      "CAMHS therapist (Dr Shah) — anticipatory grief work integrated",
      "Prison family worker — supporting Jordan and mum to talk about transition realistically",
    ],
    homeBasedSupport: [
      "Quiet bedtime routine extended (Biscuit used to sleep with Jordan)",
      "Photo of Biscuit kept by Jordan's bed",
      "Weighted blanket (Biscuit substitute, child's request)",
      "Predictable warnings before mum's calls",
      "Post-call regulation routine with Chervelle",
    ],
    keyWorkerInvolvement:
      "Chervelle leads. Coordinates between art therapist, CAMHS and prison family worker. Holds the holistic picture of Jordan's two losses. Avoids minimising pet bereavement ('it was just a cat') — recognises Biscuit's symbolic weight.",
    traditionsAndRituals: [
      "Memory box for Biscuit — collar, photos, drawings, hand-written stories",
      "Lighting a candle on Biscuit's birthday (already in shared diary)",
      "Pre-mum-call ritual: a short grounding activity Jordan chooses each week",
    ],
    anniversaryAcknowledgement:
      "Biscuit's death anniversary will be marked annually with gran by phone — Jordan's choice. Mum's release date will be approached as a transition not a 'fix' — staff will hold space for grief on the day itself.",
    creativeOutlets: [
      "Art therapy pieces (gallery wall in bedroom)",
      "Memory book about Biscuit — collaborative with gran",
      "Letter writing to mum (some kept, some sent)",
    ],
    commemorationActivities: [
      "Visit to gran's garden where Biscuit is buried (planned next month with key worker)",
      "Planting a small flower in the home's garden in Biscuit's memory",
    ],
    childCopingStrategies: [
      "Drawing and painting",
      "Talking to Tyler (brother) on video call",
      "Sensory regulation tools (weighted blanket, fidget items)",
      "Cuddles with the home's dog (with permission)",
    ],
    behavioursToWatchFor: [
      "Freeze responses around mum's calls or release talk",
      "Regression in self-care",
      "Increased somatic complaints",
      "Difficulty separating Biscuit's loss from broader anxieties",
      "Idealisation of mum that risks crash on reunion",
    ],
    reviewSchedule: "Fortnightly until release date; then monthly for 6 months",
    lastReviewDate: d(-10),
    reviewedBy: "staff_chervelle",
    nextReviewDate: d(4),
  },
  {
    id: "gl3",
    youngPerson: "yp_casey",
    lossType: "Multiple losses",
    lossDescription:
      "Two recent losses. (1) Living loss of birth family relationship — although reunification with mum is being planned, Casey grieves the family life that will never be (sibling Casey was separated from at age 9 has now been adopted and contact has formally ended). (2) Recent pet bereavement — the home's previous dog 'Pepper' died peacefully 3 weeks ago after a short illness. Pepper had been Casey's chosen comfort.",
    dateOfLoss: d(-21),
    timeSinceLoss: "Pet loss 3 weeks ago. Sibling contact ended 4 months ago and grief is still processing.",
    childRelationshipToLoss:
      "Pepper was the home's resident dog and Casey gravitated to him daily — feeding, walking, talking to him. Many photos. The sibling separation is a deeper, quieter grief: Casey rarely names it but staff observe sadness around birthdays and at school events about families.",
    griefStageObservation:
      "Pet loss: open and expressive grief — tearful, talkative, asks questions, draws Pepper. Healthy grieving. Sibling loss: more buried — Casey shows yearning indirectly through play, dolls, and stories. Anxious-ambivalent attachment means loss intensifies clingy behaviour with Anna.",
    externalSupportInPlace: [
      "School counselling (weekly)",
      "Therapeutic Life Story Work practitioner (monthly) — addressing sibling loss",
      "GP aware (no medical concern)",
    ],
    homeBasedSupport: [
      "Daily check-ins with Anna",
      "Pepper's framed photo placed where Casey requested",
      "Open conversations about Pepper — staff use his name freely, share their own memories",
      "Sibling life story book reviewed gently when Casey initiates",
    ],
    keyWorkerInvolvement:
      "Anna leads. Manages the closeness Casey needs without fostering dependency. Models healthy grief by sharing her own appropriate feelings about Pepper. Coordinates with TLSW practitioner around sibling loss.",
    traditionsAndRituals: [
      "Pepper memorial corner — photo, his collar, paw print",
      "Small ceremony held by all the children to scatter ashes in the garden",
      "Casey added a page to the home's pet memory book",
      "Annual birthday card-making for the adopted sibling (kept in Casey's life story book)",
    ],
    anniversaryAcknowledgement:
      "Anniversary of Pepper's death will be acknowledged simply — a shared moment, a favourite story, no pressure. Sibling's birthday and the date contact ended both flagged in Anna's diary; gentle awareness only.",
    creativeOutlets: [
      "Drawing Pepper (pinned in Casey's room)",
      "Memory box for sibling — letters, photos, small objects",
      "Story-writing ('A dog called Pepper') for younger children in the home",
    ],
    commemorationActivities: [
      "Walk to Pepper's favourite park with all the children",
      "Made a paw-print biscuit on Pepper's would-be next birthday",
      "Photo wall update with Casey's choice of pictures",
    ],
    childCopingStrategies: [
      "Talking — Casey processes verbally",
      "Cuddling soft toys",
      "Calling gran on Wednesdays (anchor relationship)",
      "Drawing and writing",
    ],
    behavioursToWatchFor: [
      "Increased clinginess to Anna (expected; do not pathologise)",
      "Comfort eating",
      "Regression to younger behaviours",
      "Blurring of pet grief and sibling grief",
      "Anxiety spikes around reunification talk and family loss",
    ],
    reviewSchedule: "Monthly while both losses active",
    lastReviewDate: d(-7),
    reviewedBy: "staff_anna",
    nextReviewDate: d(23),
  },
  {
    id: "gl4",
    youngPerson: "yp_jordan",
    lossType: "Loss of identity (e.g. cultural)",
    lossDescription:
      "Loss of cultural and community connection. Jordan is mixed heritage (paternal Caribbean heritage). Following placement moves, Jordan has been disconnected from the cultural community, food, hair-care knowledge, and faith practices that were part of early life. This is a quieter, often unrecognised grief — a loss of self.",
    dateOfLoss: d(-1095),
    timeSinceLoss: "Approx. 3 years since meaningful cultural community contact, intensified during care moves.",
    childRelationshipToLoss:
      "Cultural identity is core to Jordan's sense of self. Loss has been compounded by previous placements where staff lacked confident hair-care knowledge or did not include culturally relevant food, music or stories. Jordan has expressed feeling 'in-between' and 'not enough of either'.",
    griefStageObservation:
      "Mixed presentation. Sometimes anger ('you don't get it'), sometimes withdrawal, sometimes curious questioning of staff and self. Identity grief is non-linear and lifelong — focus is on validation, restoration of connection, and helping Jordan author their own cultural story.",
    externalSupportInPlace: [
      "Local Caribbean community group — supported drop-ins arranged",
      "Specialist hair-care practitioner (monthly visit, Jordan's preferred salon)",
      "Cultural mentor matched via local authority's Black & Mixed Heritage in Care project",
    ],
    homeBasedSupport: [
      "Culturally relevant food in the weekly menu (Jordan helps plan)",
      "Books, music and films reflecting Jordan's heritage in the home",
      "All staff completed cultural competency refresher",
      "Hair and skin care products specific to Jordan's needs always available",
    ],
    keyWorkerInvolvement:
      "Chervelle leads — has lived experience of similar identity questions and has shared appropriately. Connects Jordan with the community group, follows Jordan's lead on pace and preferences. Advocates within the wider system.",
    traditionsAndRituals: [
      "Family recipes cooked with paternal aunt over video call (monthly)",
      "Black History Month is acknowledged thoughtfully — Jordan shapes how",
      "Jordan keeps a 'who I am' book — photos, words, music, family tree",
    ],
    anniversaryAcknowledgement:
      "Cultural and faith dates important to Jordan are noted in the home's diary. Staff prepare in advance, ask Jordan how (or whether) to mark them. Never assume, never ignore.",
    creativeOutlets: [
      "Music — Jordan is building a playlist of artists from their heritage",
      "Writing — short pieces about identity (some shared with mentor)",
      "Photography — building a 'me and mine' album",
    ],
    commemorationActivities: [
      "Visit to the city where paternal family lived — planned with Chervelle",
      "Cooking a family meal for the home and explaining its meaning",
    ],
    childCopingStrategies: [
      "Talking to cultural mentor",
      "Listening to music",
      "Spending time with paternal aunt by video",
      "Writing",
    ],
    behavioursToWatchFor: [
      "Withdrawal when cultural topics arise clumsily",
      "Statements of not belonging anywhere",
      "Distress around hair-care or food choices",
      "Avoidance of identity-related conversations",
      "Internalised racism or self-rejection — escalate to therapist",
    ],
    reviewSchedule: "Quarterly, integrated into care plan review",
    lastReviewDate: d(-30),
    reviewedBy: "staff_edward",
    nextReviewDate: d(60),
  },
];

/* ── export columns ────────────────────────────────────────────────────── */

const EXPORT_COLS: ExportColumn<GriefRecord>[] = [
  { header: "Young Person",         accessor: (r: GriefRecord) => getYPName(r.youngPerson) },
  { header: "Loss Type",            accessor: (r: GriefRecord) => r.lossType },
  { header: "Loss Description",     accessor: (r: GriefRecord) => r.lossDescription },
  { header: "Date of Loss",         accessor: (r: GriefRecord) => r.dateOfLoss },
  { header: "Time Since Loss",      accessor: (r: GriefRecord) => r.timeSinceLoss },
  { header: "Relationship",         accessor: (r: GriefRecord) => r.childRelationshipToLoss },
  { header: "Grief Observation",    accessor: (r: GriefRecord) => r.griefStageObservation },
  { header: "External Support",     accessor: (r: GriefRecord) => r.externalSupportInPlace.join("; ") },
  { header: "Home-based Support",   accessor: (r: GriefRecord) => r.homeBasedSupport.join("; ") },
  { header: "Key Worker",           accessor: (r: GriefRecord) => r.keyWorkerInvolvement },
  { header: "Traditions & Rituals", accessor: (r: GriefRecord) => r.traditionsAndRituals.join("; ") },
  { header: "Anniversary",          accessor: (r: GriefRecord) => r.anniversaryAcknowledgement },
  { header: "Creative Outlets",     accessor: (r: GriefRecord) => r.creativeOutlets.join("; ") },
  { header: "Commemoration",        accessor: (r: GriefRecord) => r.commemorationActivities.join("; ") },
  { header: "Coping Strategies",    accessor: (r: GriefRecord) => r.childCopingStrategies.join("; ") },
  { header: "Watch For",            accessor: (r: GriefRecord) => r.behavioursToWatchFor.join("; ") },
  { header: "Review Schedule",      accessor: (r: GriefRecord) => r.reviewSchedule },
  { header: "Last Review",          accessor: (r: GriefRecord) => r.lastReviewDate },
  { header: "Reviewed By",          accessor: (r: GriefRecord) => getStaffName(r.reviewedBy) },
  { header: "Next Review",          accessor: (r: GriefRecord) => r.nextReviewDate },
];

/* ── component ─────────────────────────────────────────────────────────── */

export default function GriefAndLossSupportPage() {
  const [data] = useState<GriefRecord[]>(SEED);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("review");

  const toggle = (id: string) => setExpandedId((curr) => (curr === id ? null : id));

  /* ── stats ────────────────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const active = data.length;
    const types = new Set(data.map((r) => r.lossType)).size;
    const anniversaryActive = data.filter((r) => r.anniversaryAcknowledgement && r.anniversaryAcknowledgement.length > 0).length;
    const reviewsDue = data.filter((r) => r.nextReviewDate <= d(14)).length;
    return { active, types, anniversaryActive, reviewsDue };
  }, [data]);

  /* ── filter / sort ────────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = data;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        getYPName(r.youngPerson).toLowerCase().includes(q) ||
        r.lossType.toLowerCase().includes(q) ||
        r.lossDescription.toLowerCase().includes(q)
      );
    }
    if (filterType !== "all") list = list.filter((r) => r.lossType === filterType);
    const out = [...list];
    switch (sortBy) {
      case "name":   out.sort((a, b) => getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson))); break;
      case "type":   out.sort((a, b) => a.lossType.localeCompare(b.lossType)); break;
      case "review": out.sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate)); break;
      case "recent": out.sort((a, b) => b.dateOfLoss.localeCompare(a.dateOfLoss)); break;
    }
    return out;
  }, [data, search, filterType, sortBy]);

  return (
    <PageShell
      title="Grief & Loss Support"
      subtitle="Bereavement, separation, placement loss, pet loss and identity loss — supporting each child individually"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Grief & Loss Support" />
          <ExportButton data={data} columns={EXPORT_COLS} filename="grief-and-loss-support" />
        </div>
      }
    >
      {/* ── stat strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Grief Support", value: stats.active, icon: Heart, colour: "text-rose-600" },
          { label: "Loss Types Supported", value: stats.types, icon: Users, colour: "text-purple-600" },
          { label: "Anniversaries Active", value: stats.anniversaryActive, icon: Calendar, colour: "text-amber-600" },
          { label: "Reviews Due (14 d)",   value: stats.reviewsDue, icon: AlertTriangle, colour: stats.reviewsDue > 0 ? "text-amber-600" : "text-gray-400" },
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

      {/* ── tender banner ──────────────────────────────────────────── */}
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 mb-6 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-rose-900">
          <p className="font-semibold mb-1">Grief is individual, non-linear and ongoing.</p>
          <p>
            Children and young people grieve in their own way and at their own pace. There is no timetable, no
            &ldquo;right&rdquo; way to feel, and no expectation of &ldquo;moving on&rdquo;. Loss can be a death, a
            separation, a placement ending, a pet, a friendship, or a connection to identity and culture. Our role is
            to listen, to remember alongside the young person, to honour what mattered, and to be reliably present —
            on the loud days, the quiet days, and the anniversaries others may forget.
          </p>
        </div>
      </div>

      {/* ── filters / sort ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search young person, loss type or description…"
            className="w-full rounded-md border py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[230px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Loss Types</SelectItem>
            {Object.keys(LOSS_TYPE_COLOURS).map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <ArrowUpDown className="h-4 w-4" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="review">Next Review</SelectItem>
              <SelectItem value="name">Young Person</SelectItem>
              <SelectItem value="type">Loss Type</SelectItem>
              <SelectItem value="recent">Most Recent Loss</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── cards ──────────────────────────────────────────────────── */}
      <div className="space-y-4 mb-8">
        {filtered.map((r) => {
          const open = expandedId === r.id;
          const reviewOverdue = r.nextReviewDate <= d(0);
          return (
            <div key={r.id} className="rounded-lg border bg-white">
              <button
                onClick={() => toggle(r.id)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Heart className="h-4 w-4 text-rose-400" />
                    <h3 className="font-semibold">{getYPName(r.youngPerson)}</h3>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", LOSS_TYPE_COLOURS[r.lossType])}>
                      {r.lossType}
                    </span>
                    {reviewOverdue && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Review overdue
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{r.timeSinceLoss}</p>
                </div>
                {open ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>

              {open && (
                <div className="border-t px-4 pb-4 space-y-4">
                  {/* meta row */}
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div><span className="text-gray-500">Date of loss:</span> <span className="font-medium">{r.dateOfLoss}</span></div>
                    <div><span className="text-gray-500">Last review:</span> <span className="font-medium">{r.lastReviewDate}</span></div>
                    <div><span className="text-gray-500">Reviewed by:</span> <span className="font-medium">{getStaffName(r.reviewedBy)}</span></div>
                    <div><span className="text-gray-500">Next review:</span> <span className={cn("font-medium", reviewOverdue ? "text-red-600" : "")}>{r.nextReviewDate}</span></div>
                  </div>

                  {/* loss description */}
                  <div className="rounded-md bg-gray-50 p-3">
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">Loss Description (sensitive)</h4>
                    <p className="text-sm">{r.lossDescription}</p>
                  </div>

                  {/* relationship */}
                  <div className="rounded-md bg-gray-50 p-3">
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">Child&apos;s Relationship to the Loss</h4>
                    <p className="text-sm">{r.childRelationshipToLoss}</p>
                  </div>

                  {/* grief observation */}
                  <div className="rounded-md bg-purple-50 border border-purple-200 p-3">
                    <h4 className="text-xs font-semibold text-purple-700 mb-1">Grief Observation (Kübler-Ross informed, child-respectful)</h4>
                    <p className="text-sm text-purple-900">{r.griefStageObservation}</p>
                  </div>

                  {/* support arrays — two columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
                      <h4 className="text-xs font-semibold text-blue-700 mb-1">External Support in Place</h4>
                      <ul className="list-disc list-inside text-sm text-blue-900 space-y-0.5">
                        {r.externalSupportInPlace.map((x, i) => <li key={i}>{x}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-md bg-green-50 border border-green-200 p-3">
                      <h4 className="text-xs font-semibold text-green-700 mb-1">Home-Based Support</h4>
                      <ul className="list-disc list-inside text-sm text-green-900 space-y-0.5">
                        {r.homeBasedSupport.map((x, i) => <li key={i}>{x}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* key worker */}
                  <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                    <h4 className="text-xs font-semibold text-amber-700 mb-1">Key Worker Involvement</h4>
                    <p className="text-sm text-amber-900">{r.keyWorkerInvolvement}</p>
                  </div>

                  {/* traditions / anniversary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-rose-50 border border-rose-200 p-3">
                      <h4 className="text-xs font-semibold text-rose-700 mb-1">Traditions &amp; Rituals</h4>
                      <ul className="list-disc list-inside text-sm text-rose-900 space-y-0.5">
                        {r.traditionsAndRituals.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3">
                      <h4 className="text-xs font-semibold text-yellow-700 mb-1">Anniversary Acknowledgement</h4>
                      <p className="text-sm text-yellow-900">{r.anniversaryAcknowledgement}</p>
                    </div>
                  </div>

                  {/* creative + commemoration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-pink-50 border border-pink-200 p-3">
                      <h4 className="text-xs font-semibold text-pink-700 mb-1">Creative Outlets</h4>
                      <ul className="list-disc list-inside text-sm text-pink-900 space-y-0.5">
                        {r.creativeOutlets.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3">
                      <h4 className="text-xs font-semibold text-emerald-700 mb-1">Commemoration Activities</h4>
                      <ul className="list-disc list-inside text-sm text-emerald-900 space-y-0.5">
                        {r.commemorationActivities.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* coping + watch for */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-slate-50 border border-slate-200 p-3">
                      <h4 className="text-xs font-semibold text-slate-700 mb-1">Child&apos;s Coping Strategies</h4>
                      <ul className="list-disc list-inside text-sm text-slate-900 space-y-0.5">
                        {r.childCopingStrategies.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-md bg-red-50 border border-red-200 p-3">
                      <h4 className="text-xs font-semibold text-red-700 mb-1">Behaviours to Watch For</h4>
                      <ul className="list-disc list-inside text-sm text-red-900 space-y-0.5">
                        {r.behavioursToWatchFor.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* review schedule */}
                  <div className="rounded-md bg-gray-50 p-3">
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">Review Schedule</h4>
                    <p className="text-sm">{r.reviewSchedule}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── regulatory note ────────────────────────────────────────── */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 mb-6">
        <strong>Quality Standard 7 &amp; trauma-informed practice:</strong> The Children&apos;s Homes Regulations 2015
        require homes to help children deal with significant events in their lives, including bereavement and loss
        (Quality Standard 7 — the &ldquo;health and wellbeing&rdquo; standard). This record supports trauma-informed
        practice by recognising loss in its widest sense: deaths, separations, placement endings, family ruptures,
        pet bereavement, friendship loss and identity loss. Records are kept sensitively, reviewed regularly with the
        young person, and shared only with those who need to know in order to provide attuned care.
      </div>
    </PageShell>
  );
}
