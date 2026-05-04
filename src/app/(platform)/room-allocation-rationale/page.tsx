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
  Home,
  Users,
  Heart,
  Volume2,
  Sun,
  Bed,
  CheckCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoomAllocation {
  id: string;
  youngPerson: string;
  roomNumber: string;
  roomDescription: string;
  allocatedDate: string;
  decisionMaker: string;
  reasonsForAllocation: string[];
  considerationsAtPanelDiscussion: string[];
  childInputOnAllocation: string;
  alternativeRoomsConsidered: { room: string; whyNotChosen: string }[];
  roomCharacteristics: { feature: string; suitability: "Strong fit" | "Acceptable" | "Compromise" | "Adapted" }[];
  proximityToOtherChildren: { peer: string; relationship: string; impact: string }[];
  proximityToCommunalAreas: string;
  proximityToStaffOffice: string;
  sensoryConsiderations: string[];
  safeguardingConsiderations: string[];
  reviewSchedule: string;
  reviewTriggers: string[];
  hasBeenReviewed: { reviewDate: string; outcome: string }[];
  fitForPurposeRating: number;
  childSatisfactionWithRoom: string;
  notes: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: RoomAllocation[] = [
  {
    id: "ra-001",
    youngPerson: "yp_alex",
    roomNumber: "Room 1",
    roomDescription: "Front of house, ground floor, double-sized bedroom with built-in wardrobe and large window. Carpeted. South-facing.",
    allocatedDate: "2022-01-10",
    decisionMaker: "staff_darren",
    reasonsForAllocation: [
      "Front-of-house room — Alex felt watched/observed in previous placement back-room. Front room felt more 'present in the world'.",
      "Ground floor — Alex's preference (felt safer, easier exit if anxious)",
      "Largest of the available rooms at admission — Alex's belongings would fit comfortably",
      "Closest to staff office (next door) — provides reassurance for night-time anxiety initially",
      "South-facing window — natural light helps with ADHD-related morning regulation",
    ],
    considerationsAtPanelDiscussion: [
      "Alex's history of placement disruption — important to feel rooted",
      "ADHD profile — light, layout, room for movement matter",
      "Casey's sensory profile in adjacent room (rear) — Alex's room being front means less noise transfer",
    ],
    childInputOnAllocation: "Alex visited prior to admission and was offered choice between Room 1 and Room 4 (smaller, rear). Alex chose Room 1 immediately. 'It's bright. I like the window.'",
    alternativeRoomsConsidered: [
      { room: "Room 4 (smaller, rear)", whyNotChosen: "Alex preferred light and space; rear too quiet" },
      { room: "Room 5 (upstairs)", whyNotChosen: "Not preferred — Alex wanted ground floor" },
    ],
    roomCharacteristics: [
      { feature: "Natural light", suitability: "Strong fit" },
      { feature: "Size", suitability: "Strong fit" },
      { feature: "Privacy from communal areas", suitability: "Acceptable" },
      { feature: "Distance from kitchen (smell)", suitability: "Acceptable" },
      { feature: "Window opening (cool sleep preferred)", suitability: "Strong fit" },
    ],
    proximityToOtherChildren: [
      { peer: "Jordan (Room 2, rear)", relationship: "Generally positive but occasional friction", impact: "Adequate buffer between rooms; corridor separation" },
      { peer: "Casey (Room 3, rear)", relationship: "Respectful, warm", impact: "Front-rear separation supports Casey's sensory needs" },
    ],
    proximityToCommunalAreas: "Adjacent to lounge — easy access for sociable Alex. Slight noise transfer when others are in lounge — acceptable for Alex; gaming headphones available.",
    proximityToStaffOffice: "Adjacent. Provides reassurance especially during early placement. Night staff can hear Alex without intrusion. Alex can knock on office wall if needed.",
    sensoryConsiderations: [
      "Bright morning light — supports ADHD wake routine",
      "Cool room (window can open) — Alex's sleep preference",
      "Brown noise machine effective in this room (carpeted, soft furnishings)",
    ],
    safeguardingConsiderations: [
      "Front room — Alex visible/audible to staff if needed",
      "Ground floor — emergency egress good",
      "Window not overlooked from street (safeguarding for ground-floor)",
    ],
    reviewSchedule: "Annually as part of personalisation budget review, or when child requests, or when group dynamic changes",
    reviewTriggers: [
      "Alex requests change",
      "New admission requires room reshuffle",
      "Alex's needs change significantly",
      "Group dynamics shift",
    ],
    hasBeenReviewed: [
      { reviewDate: "2023-01-15", outcome: "Confirmed continuing — Alex very settled" },
      { reviewDate: "2024-01-12", outcome: "Confirmed continuing — Alex chose to stay; redecorated" },
      { reviewDate: "2025-01-15", outcome: "Confirmed continuing" },
      { reviewDate: d(-30), outcome: "Confirmed continuing — Alex turning 14, remains preferred room" },
    ],
    fitForPurposeRating: 5,
    childSatisfactionWithRoom: "Very high — Alex describes Room 1 as 'mine' and showed pride during 2024 redecoration. Says 'I'd be sad to leave this room'.",
    notes: "Original allocation has worked exceptionally well. Alex's identification with Room 1 is part of his sense of belonging at Oak House.",
  },
  {
    id: "ra-002",
    youngPerson: "yp_jordan",
    roomNumber: "Room 2",
    roomDescription: "Rear of house, ground floor, double-sized bedroom. North-east facing window onto garden. Carpeted.",
    allocatedDate: "2023-09-12",
    decisionMaker: "staff_darren",
    reasonsForAllocation: [
      "Rear room — privacy, particularly for phone calls with Mum (in custody)",
      "Garden view — football kick-about visible from window (significant)",
      "Ground floor — accessibility, emergency egress",
      "Slightly removed from communal areas — respects Jordan's preference for downtime alone",
      "Wall shared with quiet zone (Casey's room) — quieter overall acoustic environment",
    ],
    considerationsAtPanelDiscussion: [
      "Family contact privacy needs (prison phone calls)",
      "Cultural identity — wall space for posters/cultural items",
      "Football identity — window view of garden",
      "Some risk of friction with Alex (next room) during gaming disagreements — managed with gaming rota",
    ],
    childInputOnAllocation: "Jordan offered choice. Said 'I want the rear room. Quieter for calls with Mum.' Chose Room 2. Caribbean flag pre-arranged in advance — placed in Room 2.",
    alternativeRoomsConsidered: [
      { room: "Room 4 (smaller rear)", whyNotChosen: "Jordan preferred more space" },
      { room: "Room 5 (upstairs)", whyNotChosen: "Less convenient for football kit storage" },
    ],
    roomCharacteristics: [
      { feature: "Privacy for phone calls", suitability: "Strong fit" },
      { feature: "Garden view (football)", suitability: "Strong fit" },
      { feature: "Wall space for cultural items", suitability: "Strong fit" },
      { feature: "Distance from communal areas", suitability: "Acceptable" },
      { feature: "Sound isolation from lounge", suitability: "Strong fit" },
    ],
    proximityToOtherChildren: [
      { peer: "Alex (Room 1, front)", relationship: "Generally positive", impact: "Corridor separation prevents minor friction; wall not shared" },
      { peer: "Casey (Room 3, rear, opposite)", relationship: "Respectful, mostly parallel", impact: "Wall shared with Casey — Jordan's music kept low; works well" },
    ],
    proximityToCommunalAreas: "Down the corridor — short walk. Provides Jordan with privacy he values.",
    proximityToStaffOffice: "Across corridor — staff accessible but not intrusive.",
    sensoryConsiderations: [
      "North-east facing — gentler morning light (Jordan likes this)",
      "Music allowed at low volume — works with Casey wall sharing as low-level only",
    ],
    safeguardingConsiderations: [
      "Garden window overlookable from outside — discussed with Jordan; curtains used at night",
      "Phone privacy respected for prison calls per safeguarding plan",
    ],
    reviewSchedule: "Annually or when group dynamic changes",
    reviewTriggers: [
      "Jordan requests change",
      "Mother's release — review whether this room continues to feel right",
      "New admission requires room reshuffle",
    ],
    hasBeenReviewed: [
      { reviewDate: "2024-09-15", outcome: "Confirmed continuing — Jordan very settled" },
      { reviewDate: d(-21), outcome: "Confirmed continuing — Mother's release pending; will revisit post-release if needed" },
    ],
    fitForPurposeRating: 5,
    childSatisfactionWithRoom: "Very high. Jordan has personalised Room 2 strongly — Caribbean flag, football trophies, family photos. Feels like 'his space'.",
    notes: "Allocation has supported Jordan's identity and privacy needs from day one. Cultural recognition in advance was key.",
  },
  {
    id: "ra-003",
    youngPerson: "yp_casey",
    roomNumber: "Room 3",
    roomDescription: "Rear of house, ground floor, smaller-sized bedroom. East facing window. Casey requested smaller room. Tucked-away corner of corridor.",
    allocatedDate: "2021-09-22",
    decisionMaker: "staff_darren",
    reasonsForAllocation: [
      "Smaller room — Casey requested smaller, more contained space (sensory regulation)",
      "Rear, tucked corner — minimal noise transfer; sensory anchor",
      "Ground floor — accessibility",
      "Adjacent to bathroom — short morning route important",
      "Wall shared only with Jordan (rare music, low) — acoustically protected",
      "Positioned away from front door foot-traffic",
    ],
    considerationsAtPanelDiscussion: [
      "Casey's sensory profile — overriding consideration",
      "ASD preference for smaller, defined spaces",
      "Sound isolation needs",
      "Predictability of environment — minimum corridor traffic",
      "Bedding pattern matched from previous placement to provide continuity",
    ],
    childInputOnAllocation: "Casey was anxious about choice. Provided with visual social story showing all rooms. Casey pointed at Room 3 multiple times. Selection respected.",
    alternativeRoomsConsidered: [
      { room: "Room 4 (similar size)", whyNotChosen: "Closer to communal areas — too much foot traffic for sensory profile" },
      { room: "Room 5 (upstairs)", whyNotChosen: "Different floor felt destabilising on tour" },
    ],
    roomCharacteristics: [
      { feature: "Smaller, contained size", suitability: "Strong fit" },
      { feature: "Sound isolation", suitability: "Strong fit" },
      { feature: "Tucked away — minimal traffic", suitability: "Strong fit" },
      { feature: "Adjacent to own bathroom", suitability: "Strong fit" },
      { feature: "Predictable layout (preserved)", suitability: "Strong fit" },
      { feature: "Window — opens to quiet garden", suitability: "Acceptable" },
    ],
    proximityToOtherChildren: [
      { peer: "Jordan (Room 2)", relationship: "Respectful", impact: "Wall shared — music low; works well" },
      { peer: "Alex (Room 1)", relationship: "Distant — corridor and parallel", impact: "No shared wall; good buffer" },
    ],
    proximityToCommunalAreas: "Furthest from kitchen and lounge — minimises sensory load. Casey can choose when to engage with communal spaces.",
    proximityToStaffOffice: "Across corridor — close enough for night welfare without being on the route. Anna's preferred path during sleep-in respects Casey's quiet zone.",
    sensoryConsiderations: [
      "East facing — gentle morning light; smart bulb manages",
      "Total blackout achievable",
      "Carpet absorbs sound",
      "Specific bedding pattern preserved from previous placement",
      "Walls painted sage green (Casey's choice — calming)",
      "White noise machine effective in this room",
    ],
    safeguardingConsiderations: [
      "Tucked corner — staff regular check route during night",
      "Smart bulb lighting allows checks without disturbance",
      "Casey's sensory needs explicitly recorded for emergency response (no bright lights, calm voice)",
    ],
    reviewSchedule: "Annually or with EHCP review",
    reviewTriggers: [
      "Casey requests change (very unlikely given sensory anchor)",
      "Sensory profile changes significantly",
      "New admission requires reshuffle (would require careful management)",
    ],
    hasBeenReviewed: [
      { reviewDate: "2022-09-22", outcome: "Confirmed continuing — strong fit" },
      { reviewDate: "2023-09-22", outcome: "Confirmed continuing — sage green wall added at Casey's request" },
      { reviewDate: "2024-09-22", outcome: "Confirmed continuing — Casey's sanctuary" },
      { reviewDate: d(-7), outcome: "Confirmed continuing — Casey expressed strong attachment to room" },
    ],
    fitForPurposeRating: 5,
    childSatisfactionWithRoom: "Profound. Casey's room is a sensory sanctuary. Casey said 'this is where my brain feels quiet'. Strong attachment.",
    notes: "Most carefully considered allocation in the home. Sensory profile drove every aspect. Continuity of bedding pattern from previous placement was a key transition support. This room is part of Casey's stability.",
  },
];

const exportCols: ExportColumn<RoomAllocation>[] = [
  { header: "Young Person", accessor: (r: RoomAllocation) => getYPName(r.youngPerson) },
  { header: "Room", accessor: (r: RoomAllocation) => r.roomNumber },
  { header: "Allocated", accessor: (r: RoomAllocation) => r.allocatedDate },
  { header: "Decision Maker", accessor: (r: RoomAllocation) => getStaffName(r.decisionMaker) },
  { header: "Fit Rating", accessor: (r: RoomAllocation) => `${r.fitForPurposeRating}/5` },
  { header: "Reviews Held", accessor: (r: RoomAllocation) => String(r.hasBeenReviewed.length) },
  { header: "Last Reviewed", accessor: (r: RoomAllocation) => r.hasBeenReviewed.length > 0 ? r.hasBeenReviewed[r.hasBeenReviewed.length - 1].reviewDate : "Never" },
];

export default function RoomAllocationRationalePage() {
  const [filterYP, setFilterYP] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterYP !== "all") items = items.filter((r) => r.youngPerson === filterYP);
    items.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.youngPerson.localeCompare(b.youngPerson);
        case "rating":
          return b.fitForPurposeRating - a.fitForPurposeRating;
        case "date":
          return b.allocatedDate.localeCompare(a.allocatedDate);
        default:
          return 0;
      }
    });
    return items;
  }, [filterYP, sortBy]);

  const total = data.length;
  const avgRating = (data.reduce((sum, r) => sum + r.fitForPurposeRating, 0) / total).toFixed(1);
  const totalReviews = data.reduce((sum, r) => sum + r.hasBeenReviewed.length, 0);

  return (
    <PageShell
      title="Room Allocation Rationale"
      subtitle="Why each child has the bedroom they have — documented, child-led, regularly reviewed"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="room-allocation-rationale" />
          <PrintButton title="Room Allocation Rationale" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Active Allocations</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{avgRating}/5</p>
          <p className="text-xs text-muted-foreground">Avg Fit Rating</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalReviews}</p>
          <p className="text-xs text-muted-foreground">Total Reviews</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">100%</p>
          <p className="text-xs text-muted-foreground">Child Input Recorded</p>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mb-6 flex items-start gap-2">
        <Home className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">
          Room allocation is one of the first decisions made about a child&apos;s life here. The choice
          shapes daily experience — sensory, social, identity, privacy. We document why each child has
          the room they have, what alternatives were considered, and how the child&apos;s voice shaped
          the decision.
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
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">By Child</SelectItem>
              <SelectItem value="rating">By Fit Rating</SelectItem>
              <SelectItem value="date">Most Recent</SelectItem>
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
                  <Bed className="h-5 w-5 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{getYPName(r.youngPerson)} &middot; {r.roomNumber}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Allocated {r.allocatedDate} &middot; {r.hasBeenReviewed.length} reviews &middot; Fit {r.fitForPurposeRating}/5
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-sm font-bold text-green-600">{r.fitForPurposeRating}/5</span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Room Description</p>
                    <p className="text-sm">{r.roomDescription}</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Reasons for This Allocation</p>
                    <ul className="space-y-1">
                      {r.reasonsForAllocation.map((reason, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <CheckCircle className="h-3 w-3 text-blue-500 mt-1 shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">Considerations at Decision</p>
                    <ul className="space-y-1">
                      {r.considerationsAtPanelDiscussion.map((c, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <span className="text-purple-600 mt-0.5">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-pink-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1">
                      <Heart className="h-3 w-3 inline mr-1" />Child&apos;s Input
                    </p>
                    <p className="text-sm">{r.childInputOnAllocation}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Alternatives Considered</p>
                    <div className="space-y-1">
                      {r.alternativeRoomsConsidered.map((a, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm">
                          <p className="font-medium">{a.room}</p>
                          <p className="text-xs text-muted-foreground">Not chosen: {a.whyNotChosen}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Room Characteristics</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      {r.roomCharacteristics.map((c, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm flex items-center justify-between">
                          <span>{c.feature}</span>
                          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                            c.suitability === "Strong fit" ? "bg-green-100 text-green-800" :
                            c.suitability === "Acceptable" ? "bg-blue-100 text-blue-800" :
                            c.suitability === "Adapted" ? "bg-purple-100 text-purple-800" :
                            "bg-amber-100 text-amber-800"
                          )}>
                            {c.suitability}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">
                        <Volume2 className="h-3 w-3 inline mr-1" />Sensory Considerations
                      </p>
                      <ul className="space-y-1">
                        {r.sensoryConsiderations.map((s, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-emerald-600 mt-0.5">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Safeguarding Considerations</p>
                      <ul className="space-y-1">
                        {r.safeguardingConsiderations.map((s, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      <Users className="h-3 w-3 inline mr-1" />Proximity to Other Children
                    </p>
                    <div className="space-y-1">
                      {r.proximityToOtherChildren.map((p, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm">
                          <p className="font-medium">{p.peer}</p>
                          <p className="text-xs text-muted-foreground">{p.relationship} &middot; {p.impact}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Communal Areas Proximity</p>
                      <p>{r.proximityToCommunalAreas}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Staff Office Proximity</p>
                      <p>{r.proximityToStaffOffice}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Review History</p>
                    <div className="space-y-1">
                      {r.hasBeenReviewed.map((rev, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm flex items-start justify-between gap-2">
                          <span>{rev.outcome}</span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{rev.reviewDate}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">
                      <Sun className="h-3 w-3 inline mr-1" />Child&apos;s Satisfaction
                    </p>
                    <p className="text-sm">{r.childSatisfactionWithRoom}</p>
                  </div>

                  {r.notes && (
                    <div className="bg-slate-50 rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-sm">{r.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span>Decision: {getStaffName(r.decisionMaker)}</span>
                    <span>Reviews: {r.hasBeenReviewed.length}</span>
                    <span>Fit rating: {r.fitForPurposeRating}/5</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Room allocation rationale supports Quality Standard 1
          (child-centred care), Children&apos;s Homes Regulations 2015 Schedule 1 (homely environment),
          and Quality Standard 5 (protection — proximity considerations). Reviewed annually or when
          group dynamic changes. Linked to Bedroom Personalisation, Cohort Analysis, and Pre-Admission
          Checklist.
        </p>
      </div>
    </PageShell>
  );
}
