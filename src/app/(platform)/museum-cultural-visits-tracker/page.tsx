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
  Landmark,
  Palette,
  Theater,
  Film,
  BookOpen,
  Music,
  Users,
  Leaf,
  Fish,
  Sparkles,
  Calendar,
  Camera,
  Heart,
  GraduationCap,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type VenueType =
  | "Museum"
  | "Art gallery"
  | "Theatre"
  | "Cinema"
  | "Heritage site"
  | "Library special exhibit"
  | "Music venue"
  | "Stadium tour"
  | "Botanical garden"
  | "Aquarium/Zoo"
  | "Cultural festival";

interface CulturalVisit {
  id: string;
  date: string;
  venueName: string;
  venueType: VenueType;
  youngPeopleAttended: string[];
  staffEscort: string[];
  purposeOfVisit: string;
  learningOutcomes: string[];
  childInterestArea: Record<string, string>;
  durationHours: number;
  costTotal: number;
  accessibilityAdjustmentsNeeded: string[];
  childComments: Record<string, string>;
  staffObservations: string;
  photographsTaken: boolean;
  photoConsentLog: string;
  repeatVisitInterest: boolean;
  linkedToCurriculum: string;
  linkedToCarePlanGoal: string;
  travelLogged: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: CulturalVisit[] = [
  {
    id: "mcv-001",
    date: d(-7),
    venueName: "Riverside Contemporary Art Gallery — Spring Exhibition",
    venueType: "Art gallery",
    youngPeopleAttended: ["yp_casey"],
    staffEscort: ["staff_anna"],
    purposeOfVisit:
      "Casey-led visit. Casey requested visit after seeing artist's work in art group. Casey chose date, time and pace.",
    learningOutcomes: [
      "Exposure to contemporary mixed-media practice",
      "Discussion of artist intent and material choice",
      "Self-directed cultural exploration",
      "Building art vocabulary",
    ],
    childInterestArea: {
      yp_casey:
        "Mixed-media textile work — connection to Casey's own sensory art practice",
    },
    durationHours: 2,
    costTotal: 0,
    accessibilityAdjustmentsNeeded: [
      "Quiet hour visit booked (10:00 opening)",
      "Pre-visit social story shared with Casey",
      "Ear defenders carried in case of noise from other visitors",
    ],
    childComments: {
      yp_casey:
        "I want to come back. The textile pieces felt like they were talking to me.",
    },
    staffObservations:
      "Casey deeply engaged for 90 minutes; spent extended time at one piece. Asked thoughtful questions of gallery assistant. Significant cultural confidence growing.",
    photographsTaken: true,
    photoConsentLog: "Casey consent recorded; only Casey's own artwork sketches photographed (no people).",
    repeatVisitInterest: true,
    linkedToCurriculum: "Art GCSE coursework — research portfolio",
    linkedToCarePlanGoal: "Identity as artist; sensory-friendly community participation",
    travelLogged: "Anna drove; quiet route via Manor Road; 18 mins each way",
  },
  {
    id: "mcv-002",
    date: d(-14),
    venueName: "Riverside FC Stadium — Behind-the-Scenes Tour",
    venueType: "Stadium tour",
    youngPeopleAttended: ["yp_jordan", "yp_alex"],
    staffEscort: ["staff_edward"],
    purposeOfVisit:
      "Jordan's birthday request. Combined with Alex (boxing fan, sports interest). Tour of changing rooms, pitch, trophy room, press box.",
    learningOutcomes: [
      "Sports career pathways exposure",
      "Stadium operations and team logistics",
      "Local sporting heritage",
      "Shared cultural experience between Jordan and Alex",
    ],
    childInterestArea: {
      yp_jordan: "Football career pathway; academy structures",
      yp_alex: "Sports professionalism — links to boxing aspirations",
    },
    durationHours: 3,
    costTotal: 36,
    accessibilityAdjustmentsNeeded: [
      "None required",
    ],
    childComments: {
      yp_jordan: "Walking out of the tunnel — that's the moment I'm aiming for. Best birthday.",
      yp_alex: "Sick day out. Made me think about sports as a real path, not just a dream.",
    },
    staffObservations:
      "Jordan and Alex bonded notably during tour. Both engaged with tour guide (ex-player) — strong male role model exposure. Jordan emotional in changing room.",
    photographsTaken: true,
    photoConsentLog: "Both YP consent on file; group photo taken in stadium tunnel; LA agreement to share with social workers.",
    repeatVisitInterest: true,
    linkedToCurriculum: "PE / Career pathways",
    linkedToCarePlanGoal: "Jordan: footballer identity. Alex: sporting role models. Brotherly bond between YP.",
    travelLogged: "Edward drove minibus; 25 mins each way",
  },
  {
    id: "mcv-003",
    date: d(-28),
    venueName: "Riverside Civic Theatre — 'A Midsummer Night's Dream'",
    venueType: "Theatre",
    youngPeopleAttended: ["yp_alex", "yp_jordan", "yp_casey"],
    staffEscort: ["staff_darren", "staff_chervelle"],
    purposeOfVisit:
      "Whole-house cultural festival outing. Relaxed performance scheduled (sensory-friendly format) to enable Casey's full participation alongside Alex and Jordan.",
    learningOutcomes: [
      "Live theatre experience for all three YP",
      "Shakespeare exposure linked to school curriculum",
      "Shared cultural memory as a household",
      "Sensory-adjusted access modelling inclusive practice",
    ],
    childInterestArea: {
      yp_alex: "Comedy and physical performance; the mechanicals scenes",
      yp_jordan: "Stage fighting choreography",
      yp_casey: "Costume, lighting design, the soundscape",
    },
    durationHours: 4,
    costTotal: 84,
    accessibilityAdjustmentsNeeded: [
      "Relaxed performance — house lights partially up, freedom to leave",
      "Aisle seats booked for Casey",
      "Pre-visit theatre familiarisation walk-through (week before)",
      "Quiet break room signposted",
    ],
    childComments: {
      yp_alex: "Way funnier than I thought. The donkey bit had me crying laughing.",
      yp_jordan: "Stage fights were proper. Liked it more than I expected.",
      yp_casey: "The lights and the music — it was like being inside a painting.",
    },
    staffObservations:
      "Rare three-YP cultural outing. All three engaged in own way. Casey managed 4-hour event with one quiet break. Significant household cohesion moment.",
    photographsTaken: true,
    photoConsentLog: "Photos in foyer pre-show only (no performance photography); all three YP consents recorded; one group photo to be added to memory books.",
    repeatVisitInterest: true,
    linkedToCurriculum: "English Literature — Shakespeare unit (Alex and Jordan); Casey: arts enrichment",
    linkedToCarePlanGoal: "Household belonging; Casey sensory-friendly community access; cultural capital across all three",
    travelLogged: "Darren drove minibus; Chervelle accompanied; 12 mins each way",
  },
  {
    id: "mcv-004",
    date: d(-42),
    venueName: "Wetland Nature Reserve — Birdwatching Hide & Sensory Trail",
    venueType: "Botanical garden",
    youngPeopleAttended: ["yp_casey"],
    staffEscort: ["staff_anna"],
    purposeOfVisit:
      "Casey-only nature reserve visit. Solo time with Anna; quiet, low-stim, Casey's preferred outdoor environment.",
    learningOutcomes: [
      "Wildlife identification (12 bird species logged in Casey's nature journal)",
      "Sustained attention in calm outdoor setting",
      "Sensory regulation through natural environment",
      "1:1 trusted-adult relationship time",
    ],
    childInterestArea: {
      yp_casey: "Bird identification; quiet observation; nature journaling",
    },
    durationHours: 3,
    costTotal: 8,
    accessibilityAdjustmentsNeeded: [
      "Hide booked privately (off-peak weekday)",
      "Quiet route avoided busy car park",
      "Snack/comfort items pre-prepared",
    ],
    childComments: {
      yp_casey: "I saw a kingfisher. I drew it before it flew away.",
    },
    staffObservations:
      "Casey deeply regulated throughout. Sustained 90 minutes in hide. Significant 1:1 relational moment with Anna. Nature journal a sustained interest.",
    photographsTaken: false,
    photoConsentLog: "No photographs taken at Casey's preference; nature journal entries in lieu.",
    repeatVisitInterest: true,
    linkedToCurriculum: "Science — biodiversity; Geography — wetland ecosystems",
    linkedToCarePlanGoal: "Sensory regulation; trusted adult time; special interest cultivation",
    travelLogged: "Anna drove; 35 mins each way; quiet B-roads route",
  },
  {
    id: "mcv-005",
    date: d(-56),
    venueName: "Riverside City Museum — Black British History Exhibition",
    venueType: "Museum",
    youngPeopleAttended: ["yp_jordan"],
    staffEscort: ["staff_chervelle"],
    purposeOfVisit:
      "Cultural identity work. Chervelle-led visit aligned with Jordan's heritage exploration. Specific exhibition on Black British contribution to local history.",
    learningOutcomes: [
      "Heritage and cultural identity affirmation",
      "Black British historical figures (local and national)",
      "Connection between personal heritage and broader history",
      "Cultural mentor relationship deepened (Chervelle)",
    ],
    childInterestArea: {
      yp_jordan:
        "Black British footballers and sporting pioneers featured; local Windrush stories",
    },
    durationHours: 2.5,
    costTotal: 0,
    accessibilityAdjustmentsNeeded: [
      "None required",
    ],
    childComments: {
      yp_jordan:
        "Felt good seeing my people in the museum. Like I'm part of the story too.",
    },
    staffObservations:
      "Pivotal cultural identity moment. Jordan moved at one display; took photos to share with cousin Devon. Chervelle's shared heritage made discussion safe and rich.",
    photographsTaken: true,
    photoConsentLog: "Photographs of exhibits only (no people); Jordan retains copies in his memory book.",
    repeatVisitInterest: true,
    linkedToCurriculum: "History — diverse perspectives on local history",
    linkedToCarePlanGoal: "Cultural identity; heritage exploration; Black role models",
    travelLogged: "Chervelle drove; 15 mins each way",
  },
  {
    id: "mcv-006",
    date: d(-70),
    venueName: "Riverside Multicultural Festival — Caribbean Heritage Day",
    venueType: "Cultural festival",
    youngPeopleAttended: ["yp_alex", "yp_jordan", "yp_casey"],
    staffEscort: ["staff_chervelle", "staff_anna"],
    purposeOfVisit:
      "All-three festival outing. Annual community festival celebrating Caribbean heritage; food, music, dance, storytelling. Particular cultural significance for Jordan.",
    learningOutcomes: [
      "Exposure to Caribbean food, music, traditions",
      "Community belonging — Jordan among peers from his heritage",
      "Cultural exchange between household members",
      "Casey's first large-scale festival successfully managed",
    ],
    childInterestArea: {
      yp_alex: "Caribbean street food; sound system culture; trying jerk chicken",
      yp_jordan: "Heritage day in his own community; dance performances; meeting cultural mentor",
      yp_casey: "Steel pan music (sensory positive); patterned fabrics; quiet observation from edge",
    },
    durationHours: 3,
    costTotal: 45,
    accessibilityAdjustmentsNeeded: [
      "Casey's quiet retreat zone identified on arrival",
      "Earlier attendance time (less crowded)",
      "Two staff present to enable splits if needed",
      "Casey carried sensory tools",
    ],
    childComments: {
      yp_alex: "Best food ever. Jordan was buzzing the whole day.",
      yp_jordan: "My day. My culture. The home came with me — that meant something.",
      yp_casey: "Steel pans were nice. I watched from the trees. I was okay.",
    },
    staffObservations:
      "Significant cultural and household event. Jordan visibly proud sharing his heritage with Alex and Casey. Casey managed 3 hours with planned retreat. Chervelle's cultural leadership invaluable.",
    photographsTaken: true,
    photoConsentLog: "Festival photographer area opted-out; staff photos with all three YP consent recorded; copies in each YP's memory book.",
    repeatVisitInterest: true,
    linkedToCurriculum: "PSHE — diversity and community; Music — world music traditions",
    linkedToCarePlanGoal: "Cultural identity (Jordan); household belonging; cultural capital for all three",
    travelLogged: "Chervelle drove minibus; Anna second car for Casey early-leave option; 8 mins each way",
  },
  {
    id: "mcv-007",
    date: d(-91),
    venueName: "Riverside Heritage Site — Old Mill Industrial Museum",
    venueType: "Heritage site",
    youngPeopleAttended: ["yp_alex"],
    staffEscort: ["staff_edward"],
    purposeOfVisit:
      "Alex-only visit. School history project on Industrial Revolution. Hands-on demonstration of working machinery; Alex strong kinaesthetic learner.",
    learningOutcomes: [
      "Industrial Revolution local context",
      "Hands-on machinery demonstration",
      "Curriculum-aligned coursework evidence",
      "1:1 time with Edward",
    ],
    childInterestArea: {
      yp_alex: "How machines work; working with hands; the blacksmith demo",
    },
    durationHours: 2,
    costTotal: 12,
    accessibilityAdjustmentsNeeded: [
      "None required",
    ],
    childComments: {
      yp_alex: "Liked the blacksmith. Maybe I'd be alright doing something with my hands.",
    },
    staffObservations:
      "Alex regulated and engaged throughout. Career conversation initiated naturally — first time Alex articulated post-16 trade interest. Edward followed up with college link.",
    photographsTaken: true,
    photoConsentLog: "Alex consent on file; photos of Alex at blacksmith demo for school coursework.",
    repeatVisitInterest: false,
    linkedToCurriculum: "History — Industrial Revolution coursework",
    linkedToCarePlanGoal: "Career exploration; trade interest emerging; trusted male adult time (Edward)",
    travelLogged: "Edward drove; 22 mins each way",
  },
  {
    id: "mcv-008",
    date: d(-105),
    venueName: "Riverside Aquarium — Marine Life Discovery Day",
    venueType: "Aquarium/Zoo",
    youngPeopleAttended: ["yp_jordan", "yp_casey"],
    staffEscort: ["staff_anna", "staff_chervelle"],
    purposeOfVisit:
      "Jordan + Casey paired visit. Casey expressed interest in marine biology; Jordan supportive 'older sibling' role. Building cross-YP bond.",
    learningOutcomes: [
      "Marine biodiversity exposure",
      "Casey's special interest cultivated (marine life)",
      "Jordan in supportive sibling-like role",
      "Pair bonding outside household routines",
    ],
    childInterestArea: {
      yp_jordan: "Sharks and rays; supporting Casey's interest",
      yp_casey: "Octopus tank (45 mins sustained); jellyfish; cephalopod intelligence",
    },
    durationHours: 3.5,
    costTotal: 56,
    accessibilityAdjustmentsNeeded: [
      "Sensory-friendly hour booked (10:00-11:00)",
      "Casey's noise-cancelling headphones available",
      "Pre-visit map studied with Casey",
    ],
    childComments: {
      yp_jordan: "Casey was buzzing about the octopus. Was good seeing them happy.",
      yp_casey: "The octopus changed colour eight times. I counted. I want to come back.",
    },
    staffObservations:
      "Beautiful pair dynamic. Jordan attentive without being overbearing. Casey's special-interest dive into octopus deeply regulating. Jordan's protective role developing.",
    photographsTaken: true,
    photoConsentLog: "Both YP consent on file; photos of YP at exhibits for memory books only; no posting.",
    repeatVisitInterest: true,
    linkedToCurriculum: "Science — marine biology; Biology GCSE prep (Jordan)",
    linkedToCarePlanGoal: "Casey special interest cultivation; cross-YP sibling-like bond; cultural/educational capital",
    travelLogged: "Anna drove minibus; 40 mins each way",
  },
];

const venueIcon: Record<VenueType, typeof Landmark> = {
  Museum: Landmark,
  "Art gallery": Palette,
  Theatre: Theater,
  Cinema: Film,
  "Heritage site": Landmark,
  "Library special exhibit": BookOpen,
  "Music venue": Music,
  "Stadium tour": Users,
  "Botanical garden": Leaf,
  "Aquarium/Zoo": Fish,
  "Cultural festival": Sparkles,
};

const venueColour: Record<VenueType, string> = {
  Museum: "bg-amber-100 text-amber-800",
  "Art gallery": "bg-fuchsia-100 text-fuchsia-800",
  Theatre: "bg-rose-100 text-rose-800",
  Cinema: "bg-indigo-100 text-indigo-800",
  "Heritage site": "bg-stone-100 text-stone-800",
  "Library special exhibit": "bg-blue-100 text-blue-800",
  "Music venue": "bg-purple-100 text-purple-800",
  "Stadium tour": "bg-emerald-100 text-emerald-800",
  "Botanical garden": "bg-green-100 text-green-800",
  "Aquarium/Zoo": "bg-cyan-100 text-cyan-800",
  "Cultural festival": "bg-orange-100 text-orange-800",
};

const exportCols: ExportColumn<CulturalVisit>[] = [
  { header: "Date", accessor: (r: CulturalVisit) => r.date },
  { header: "Venue", accessor: (r: CulturalVisit) => r.venueName },
  { header: "Type", accessor: (r: CulturalVisit) => r.venueType },
  {
    header: "Young People",
    accessor: (r: CulturalVisit) =>
      r.youngPeopleAttended.map((id) => getYPName(id)).join(", "),
  },
  {
    header: "Staff Escort",
    accessor: (r: CulturalVisit) =>
      r.staffEscort.map((id) => getStaffName(id)).join(", "),
  },
  { header: "Duration (hrs)", accessor: (r: CulturalVisit) => r.durationHours.toString() },
  { header: "Cost £", accessor: (r: CulturalVisit) => `£${r.costTotal}` },
  { header: "Purpose", accessor: (r: CulturalVisit) => r.purposeOfVisit },
  { header: "Linked Curriculum", accessor: (r: CulturalVisit) => r.linkedToCurriculum },
  { header: "Linked Care Plan Goal", accessor: (r: CulturalVisit) => r.linkedToCarePlanGoal },
  {
    header: "Repeat Visit Interest",
    accessor: (r: CulturalVisit) => (r.repeatVisitInterest ? "Yes" : "No"),
  },
];

export default function MuseumCulturalVisitsTrackerPage() {
  const [filterYP, setFilterYP] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterYP !== "all")
      items = items.filter((r) => r.youngPeopleAttended.includes(filterYP));
    if (filterType !== "all")
      items = items.filter((r) => r.venueType === filterType);
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.date.localeCompare(a.date);
        case "duration":
          return b.durationHours - a.durationHours;
        case "cost":
          return b.costTotal - a.costTotal;
        case "venueType":
          return a.venueType.localeCompare(b.venueType);
        default:
          return 0;
      }
    });
    return items;
  }, [filterYP, filterType, sortBy]);

  const totalVisits = data.length;
  const thisTermStart = d(-90);
  const thisTermVisits = data.filter((r) => r.date >= thisTermStart).length;
  const childrenParticipating = new Set(
    data.flatMap((r) => r.youngPeopleAttended)
  ).size;
  const differentVenueTypes = new Set(data.map((r) => r.venueType)).size;

  const venueTypes: VenueType[] = [
    "Museum",
    "Art gallery",
    "Theatre",
    "Cinema",
    "Heritage site",
    "Library special exhibit",
    "Music venue",
    "Stadium tour",
    "Botanical garden",
    "Aquarium/Zoo",
    "Cultural festival",
  ];

  return (
    <PageShell
      title="Museum & Cultural Visits Tracker"
      subtitle="Per-child museum, gallery, theatre, and cultural educational visits — Quality Standards 6 & 8"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="museum-cultural-visits" />
          <PrintButton title="Museum & Cultural Visits Tracker" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{totalVisits}</p>
          <p className="text-xs text-muted-foreground">Total Visits</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{thisTermVisits}</p>
          <p className="text-xs text-muted-foreground">This Term</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{childrenParticipating}</p>
          <p className="text-xs text-muted-foreground">Children Participating</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-fuchsia-600">{differentVenueTypes}</p>
          <p className="text-xs text-muted-foreground">Different Venue Types</p>
        </div>
      </div>

      <div className="rounded-lg bg-fuchsia-50 border border-fuchsia-200 p-3 mb-6 flex items-start gap-2">
        <Sparkles className="h-4 w-4 text-fuchsia-600 mt-0.5 shrink-0" />
        <p className="text-sm text-fuchsia-800">
          Cultural capital is built deliberately. Museums, galleries, theatres and festivals are not extras —
          they are how each child encounters their heritage, broadens their curiosity, and joins the wider world.
          Visits are planned around interest, accessibility, and child voice.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterYP} onValueChange={setFilterYP}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Children" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Children</SelectItem>
            <SelectItem value="yp_alex">{getYPName("yp_alex")}</SelectItem>
            <SelectItem value="yp_jordan">{getYPName("yp_jordan")}</SelectItem>
            <SelectItem value="yp_casey">{getYPName("yp_casey")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Venue Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Venue Types</SelectItem>
            {venueTypes.map((vt) => (
              <SelectItem key={vt} value={vt}>
                {vt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">By Date (newest)</SelectItem>
              <SelectItem value="duration">By Duration</SelectItem>
              <SelectItem value="cost">By Cost</SelectItem>
              <SelectItem value="venueType">By Venue Type</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((v) => {
          const isExpanded = expandedId === v.id;
          const Icon = venueIcon[v.venueType];

          return (
            <div key={v.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : v.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Icon className="h-5 w-5 text-fuchsia-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{v.venueName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {v.date} &middot;{" "}
                      {v.youngPeopleAttended.map((id) => getYPName(id)).join(", ")}{" "}
                      &middot; {v.durationHours}h
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      venueColour[v.venueType]
                    )}
                  >
                    {v.venueType}
                  </span>
                  {v.repeatVisitInterest && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800">
                      Repeat interest
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-white rounded-lg p-2 border text-center text-sm">
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-medium">{v.date}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center text-sm">
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-medium">{v.durationHours}h</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center text-sm">
                      <p className="text-xs text-muted-foreground">Cost</p>
                      <p className="font-medium">£{v.costTotal}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center text-sm">
                      <p className="text-xs text-muted-foreground">Photos</p>
                      <p className="font-medium">{v.photographsTaken ? "Yes" : "No"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Purpose of Visit
                    </p>
                    <p className="text-sm">{v.purposeOfVisit}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      <GraduationCap className="h-3 w-3 inline mr-1" />Learning Outcomes
                    </p>
                    <ul className="space-y-1">
                      {v.learningOutcomes.map((lo, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <Sparkles className="h-3 w-3 text-fuchsia-500 mt-1 shrink-0" />
                          <span>{lo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Each Child&apos;s Interest Area
                    </p>
                    <div className="space-y-1">
                      {v.youngPeopleAttended.map((ypId) => (
                        <div
                          key={ypId}
                          className="bg-white rounded-lg p-2 border text-sm"
                        >
                          <span className="font-medium">{getYPName(ypId)}: </span>
                          <span>{v.childInterestArea[ypId] || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {v.accessibilityAdjustmentsNeeded.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Accessibility Adjustments
                      </p>
                      <ul className="space-y-1">
                        {v.accessibilityAdjustmentsNeeded.map((a, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-fuchsia-600 mt-0.5">•</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">
                      Children&apos;s Comments
                    </p>
                    <div className="space-y-2">
                      {v.youngPeopleAttended.map((ypId) => (
                        <div key={ypId} className="text-sm">
                          <span className="font-medium">{getYPName(ypId)}: </span>
                          <span className="italic">
                            &ldquo;{v.childComments[ypId] || "—"}&rdquo;
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">
                      Staff Observations
                    </p>
                    <p className="text-sm">{v.staffObservations}</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">
                      <Camera className="h-3 w-3 inline mr-1" />Photo Consent Log
                    </p>
                    <p className="text-sm">{v.photoConsentLog}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                        <BookOpen className="h-3 w-3 inline mr-1" />Linked to Curriculum
                      </p>
                      <p className="text-sm">{v.linkedToCurriculum}</p>
                    </div>
                    <div className="bg-rose-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-rose-800 uppercase tracking-wide mb-1">
                        <Heart className="h-3 w-3 inline mr-1" />Linked to Care Plan Goal
                      </p>
                      <p className="text-sm">{v.linkedToCarePlanGoal}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span>
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {v.date}
                    </span>
                    <span>
                      <Users className="h-3 w-3 inline mr-1" />
                      Staff: {v.staffEscort.map((id) => getStaffName(id)).join(", ")}
                    </span>
                    <span>Travel: {v.travelLogged}</span>
                    <span>
                      Repeat interest: {v.repeatVisitInterest ? "Yes" : "No"}
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
          <strong>Regulatory Context:</strong> Museum and cultural visits evidence Quality Standard 8
          (education — broadening cultural capital, supporting curriculum, enriching learning) and Quality
          Standard 6 (positive relationships — shared experiences, trusted-adult time, household belonging).
          Visits also support UNCRC Article 31 (right to participate in cultural life). Linked to After-School
          Clubs, Activities, Cultural Identity, Education, and Outcomes pages.
        </p>
      </div>
    </PageShell>
  );
}
