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
  Heart,
  Palette,
  Star,
  Lightbulb,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BedroomProfile {
  id: string;
  youngPerson: string;
  roomNumber: string;
  childChooseColours: boolean;
  wallColours: string[];
  furnitureChosenByChild: boolean;
  furnitureItems: { item: string; childChose: boolean; specialNote: string }[];
  decorThemes: string[];
  personalArtworkDisplayed: string[];
  photosDisplayed: string[];
  comfortItems: string[];
  techSetup: { device: string; agreedUseRules: string; locationInRoom: string }[];
  storageArrangement: string;
  privateSpace: string[];
  sensoryAccommodations: string[];
  windowDressing: string;
  flooring: string;
  lightingPreferences: string;
  bedAndBedding: string;
  meaningfulItems: { item: string; significance: string }[];
  totalBudgetSpent: number;
  budgetRemaining: number;
  childSatisfactionRating: number;
  improvementWishes: string[];
  recentChanges: { date: string; change: string }[];
  reviewDate: string;
  reviewedWith: string;
  childAuthored: boolean;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: BedroomProfile[] = [
  {
    id: "br-001",
    youngPerson: "yp_alex",
    roomNumber: "Room 1 (front, double)",
    childChooseColours: true,
    wallColours: ["Charcoal grey feature wall", "Soft white surrounding walls"],
    furnitureChosenByChild: true,
    furnitureItems: [
      { item: "Single bed with under-storage drawers", childChose: true, specialNote: "Alex chose grey frame" },
      { item: "Desk with adjustable lamp", childChose: true, specialNote: "For homework and gaming setup" },
      { item: "Black gaming chair", childChose: true, specialNote: "13th birthday gift" },
      { item: "Wardrobe (built-in)", childChose: false, specialNote: "Original to room — Alex happy with it" },
      { item: "Bedside table with charging station", childChose: true, specialNote: "Built-in USB ports — Alex's request" },
      { item: "Bookshelf", childChose: true, specialNote: "Alex's choice — black metal modern" },
    ],
    decorThemes: ["Boxing inspiration (subtle — framed quotes)", "Football team (Arsenal)", "Modern minimalist"],
    personalArtworkDisplayed: [
      "Framed Arsenal squad poster (signed)",
      "Boxing mantra quote print",
      "Photo collage of Alex's progression at boxing",
    ],
    photosDisplayed: [
      "Mum and Alex at the seaside (age 6, before separation)",
      "Alex with maternal grandmother (recent)",
      "Alex's boxing club celebration",
      "Alex with younger sister Mia",
    ],
    comfortItems: [
      "Old football scarf (kept since age 7) — on bed",
      "Phone (always within reach)",
      "Weighted blanket (7kg) — for sleep",
    ],
    techSetup: [
      { device: "Personal phone", agreedUseRules: "Off at 21:00, returned at 07:05", locationInRoom: "Bedside table charger" },
      { device: "Gaming console (purchased with own savings)", agreedUseRules: "1-hour weekday limit, 2-hour weekend", locationInRoom: "Connected to TV in bedroom" },
      { device: "TV (32-inch)", agreedUseRules: "Used for gaming and films", locationInRoom: "Wall-mounted opposite bed" },
      { device: "Bluetooth speaker", agreedUseRules: "Music volume considerate of others", locationInRoom: "Desk" },
    ],
    storageArrangement: "Under-bed drawers for clothes, wardrobe for hanging items, bookshelf for personal items. Alex's organising preference: tidy but personal items deliberately visible.",
    privateSpace: [
      "Lockable drawer in bedside table (Alex's choice)",
      "Personal cupboard in wardrobe — staff don't access without permission",
    ],
    sensoryAccommodations: [
      "Cool room (window can be opened — Alex prefers cool sleep)",
      "Brown noise machine on desk (for sleep)",
      "Eye mask provided for summer evenings",
    ],
    windowDressing: "Blackout curtains (Alex's choice — better sleep) + sheer for daytime privacy",
    flooring: "Carpet — grey, original",
    lightingPreferences: "Main light + adjustable desk lamp + corner lamp on dimmer (Alex's request). Bedtime: corner lamp only on lowest.",
    bedAndBedding: "Single divan with weighted blanket. Plain dark grey duvet cover (Alex's choice — likes minimalism).",
    meaningfulItems: [
      { item: "Football scarf (kept since first match age 7)", significance: "Pre-care continuity. Connects to early childhood." },
      { item: "Small wooden box (gift from Nan)", significance: "Holds bits and bobs. Connects to Nan." },
      { item: "Boxing gloves (signed by coach)", significance: "Recognition gift. Identity-shaping moment." },
      { item: "Photo of Mum and sister", significance: "Family connection." },
    ],
    totalBudgetSpent: 380,
    budgetRemaining: 120,
    childSatisfactionRating: 5,
    improvementWishes: [
      "Maybe new desk chair eventually (current one slightly small)",
      "Would like a small fridge for drinks (under consideration)",
    ],
    recentChanges: [
      { date: d(-30), change: "New blackout curtains installed (Alex's choice)" },
      { date: d(-90), change: "Boxing trophy shelf added" },
      { date: d(-150), change: "Wall colour updated — Alex chose new charcoal feature wall" },
    ],
    reviewDate: d(-30),
    reviewedWith: "staff_anna",
    childAuthored: true,
  },
  {
    id: "br-002",
    youngPerson: "yp_jordan",
    roomNumber: "Room 2 (rear, double)",
    childChooseColours: true,
    wallColours: ["Deep navy feature wall", "Cream surrounding"],
    furnitureChosenByChild: true,
    furnitureItems: [
      { item: "Single bed with storage drawers", childChose: true, specialNote: "Jordan picked dark wood" },
      { item: "Desk with mirror", childChose: true, specialNote: "Mirror for skincare routine — important to Jordan" },
      { item: "Wardrobe", childChose: false, specialNote: "Original — Jordan organised inside himself" },
      { item: "Tall bedside drawer", childChose: true, specialNote: "Storage for football kit" },
      { item: "Comfortable armchair", childChose: true, specialNote: "For relaxing and friends visiting" },
    ],
    decorThemes: ["Football pride (Manchester United)", "Cultural pride (Caribbean / West African heritage)", "Fashion and style"],
    personalArtworkDisplayed: [
      "Framed Manchester United team photo",
      "Map of West Africa with family origin marked (gift from Mum)",
      "Caribbean flag print (Jamaica, Mum's heritage)",
      "Skincare quote print",
    ],
    photosDisplayed: [
      "Mum and Jordan (recent supervised visit)",
      "Jordan as football team captain (in kit)",
      "Sister Tia and Jordan at sibling visit",
      "Cousin Devon and Jordan at family event",
      "Nan-Nan and Jordan (childhood)",
    ],
    comfortItems: [
      "Football trophy (first achievement at Oak House) — on bedside",
      "Phone (very important — bedside charger)",
      "Mum's letter (in special envelope)",
    ],
    techSetup: [
      { device: "Personal phone", agreedUseRules: "Off at 22:00, music allowed until asleep", locationInRoom: "Bedside" },
      { device: "Bluetooth speaker", agreedUseRules: "Music volume considerate", locationInRoom: "Desk" },
      { device: "TV (small, wall-mounted)", agreedUseRules: "Standard rules", locationInRoom: "Opposite bed" },
    ],
    storageArrangement: "Wardrobe perfectly organised by colour and category (Jordan's preference). Football kit has dedicated drawer. Skincare and grooming on desk.",
    privateSpace: [
      "Lockable jewellery drawer (gold chain stored)",
      "Letter box from Mum — kept personal",
    ],
    sensoryAccommodations: [
      "Cool room temperature preferred",
      "Door slightly open at night (hallway light visible)",
    ],
    windowDressing: "Light grey curtains + blackout blind",
    flooring: "Carpet — beige",
    lightingPreferences: "Main light, bedside lamp, fairy lights for ambience (Jordan's choice). Music allowed until asleep.",
    bedAndBedding: "Single divan, navy and gold bedding (Jordan's choice — coordinates with feature wall)",
    meaningfulItems: [
      { item: "Mum's hand-written letter from prison", significance: "Connection during separation." },
      { item: "First football trophy", significance: "Identity foundation." },
      { item: "Sister Tia's drawing", significance: "Sibling bond." },
      { item: "Caribbean flag", significance: "Cultural pride." },
      { item: "Nan-Nan's photo", significance: "Family heritage." },
      { item: "Football boots (first pair he chose at Oak House)", significance: "Belonging here." },
    ],
    totalBudgetSpent: 425,
    budgetRemaining: 75,
    childSatisfactionRating: 5,
    improvementWishes: [
      "Would like a small mirror for full outfit checks",
      "Possibly a beanbag chair for friends visiting",
    ],
    recentChanges: [
      { date: d(-21), change: "New cultural artwork added (gift from cultural heritage event)" },
      { date: d(-60), change: "Bedside drawer reorganised for football kit" },
      { date: d(-100), change: "Feature wall painted navy — Jordan's choice" },
    ],
    reviewDate: d(-21),
    reviewedWith: "staff_chervelle",
    childAuthored: true,
  },
  {
    id: "br-003",
    youngPerson: "yp_casey",
    roomNumber: "Room 3 (rear, smaller — Casey requested)",
    childChooseColours: true,
    wallColours: ["Soft sage green (sensory choice — calming)", "Cream"],
    furnitureChosenByChild: true,
    furnitureItems: [
      { item: "Single bed (low to ground — Casey's preference)", childChose: true, specialNote: "Lower bed feels more secure for Casey" },
      { item: "Built-in desk", childChose: false, specialNote: "Original — works for Casey's art supplies" },
      { item: "Tall shelves (specifically organised art supplies)", childChose: true, specialNote: "Casey's organised system — staff don't reorganise" },
      { item: "Wardrobe with clear-front drawers", childChose: true, specialNote: "Casey can see contents without opening — sensory preference" },
      { item: "Bean bag (textured fleece)", childChose: true, specialNote: "Sensory regulation seat" },
    ],
    decorThemes: ["Nature (especially otters, foxes, woodland)", "Soft, calm aesthetic", "Casey's artwork"],
    personalArtworkDisplayed: [
      "12 of Casey's own watercolour paintings (rotated regularly)",
      "Otter prints (3 framed — Casey's favourite)",
      "Woodland scene tapestry",
      "Casey's art group exhibition piece (framed in pride of place)",
    ],
    photosDisplayed: [
      "Casey's drawings of Otter (the soft toy)",
      "Animals from nature documentaries Casey loves",
    ],
    comfortItems: [
      "Otter (soft toy since age 5) — always on bed",
      "Weighted blanket (8kg, ASD-specialised)",
      "Sensory fidget collection in specific drawer",
      "Specific bedsheet (smooth texture only)",
    ],
    techSetup: [
      { device: "Personal tablet (used for art and quiet videos)", agreedUseRules: "Time agreed with Anna — flexible", locationInRoom: "Specific drawer when not in use" },
      { device: "White noise machine", agreedUseRules: "On overnight, specific track", locationInRoom: "Bedside" },
      { device: "Smart bulb (gradually brightens at wake time)", agreedUseRules: "Auto-controlled", locationInRoom: "Ceiling" },
    ],
    storageArrangement: "EVERYTHING has a specific place. Casey designed organisation system. Art supplies sorted by type and colour. Don't move items. Visual labels on drawers.",
    privateSpace: [
      "Specific drawer for sensitive items (untouchable)",
      "Otter is private — staff never touch without explicit permission",
      "Art portfolio drawer (Casey's choice what to share)",
    ],
    sensoryAccommodations: [
      "BLACKOUT blind essential — total darkness for sleep",
      "Cool room (16-17°C — Casey's preference)",
      "White noise machine continuous overnight",
      "Specific bedsheet texture only",
      "No bright/sudden light",
      "Door fully closed at night",
    ],
    windowDressing: "Total blackout blind + soft sage curtains",
    flooring: "Carpet (added soft rug Casey chose)",
    lightingPreferences: "Soft warm bulbs only. NO fluorescents. Smart bulb gradual transition.",
    bedAndBedding: "Low single bed with weighted blanket and specific smooth sheet. Sage green plain bedding.",
    meaningfulItems: [
      { item: "Otter (soft toy since age 5)", significance: "Most important item. Continuity through every move." },
      { item: "First watercolour from age 8", significance: "Beginning of art identity." },
      { item: "Letter from art therapist", significance: "Trusted relationship." },
      { item: "Weighted blanket (chosen at age 11 with Anna)", significance: "Sensory regulation milestone." },
      { item: "Casey's exhibition piece 'Finding Home'", significance: "Identity, achievement, healing." },
    ],
    totalBudgetSpent: 460,
    budgetRemaining: 40,
    childSatisfactionRating: 5,
    improvementWishes: [
      "Maybe a small terrarium with succulents (low maintenance, nature-connection)",
      "Bigger art portfolio storage as collection grows",
    ],
    recentChanges: [
      { date: d(-7), change: "New watercolour added to wall display" },
      { date: d(-45), change: "Sage green wall painted (Casey's specific paint choice — multiple sample tests)" },
      { date: d(-120), change: "Bean bag added for sensory regulation seat" },
    ],
    reviewDate: d(-14),
    reviewedWith: "staff_anna",
    childAuthored: true,
  },
];

const exportCols: ExportColumn<BedroomProfile>[] = [
  { header: "Young Person", accessor: (r: BedroomProfile) => getYPName(r.youngPerson) },
  { header: "Room", accessor: (r: BedroomProfile) => r.roomNumber },
  { header: "Themes", accessor: (r: BedroomProfile) => r.decorThemes.join("; ") },
  { header: "Furniture Items", accessor: (r: BedroomProfile) => r.furnitureItems.length.toString() },
  { header: "Budget Spent", accessor: (r: BedroomProfile) => `£${r.totalBudgetSpent}` },
  { header: "Budget Remaining", accessor: (r: BedroomProfile) => `£${r.budgetRemaining}` },
  { header: "Child Satisfaction", accessor: (r: BedroomProfile) => `${r.childSatisfactionRating}/5` },
  { header: "Last Reviewed", accessor: (r: BedroomProfile) => r.reviewDate },
];

export default function BedroomPersonalisationPage() {
  const [filterYP, setFilterYP] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterYP !== "all") items = items.filter((b) => b.youngPerson === filterYP);
    items.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.youngPerson.localeCompare(b.youngPerson);
        case "satisfaction":
          return b.childSatisfactionRating - a.childSatisfactionRating;
        case "review":
          return a.reviewDate.localeCompare(b.reviewDate);
        default:
          return 0;
      }
    });
    return items;
  }, [filterYP, sortBy]);

  const total = data.length;
  const allChildAuthored = data.every((b) => b.childAuthored);
  const avgSatisfaction = (data.reduce((sum, b) => sum + b.childSatisfactionRating, 0) / data.length).toFixed(1);
  const totalBudget = data.reduce((sum, b) => sum + b.totalBudgetSpent + b.budgetRemaining, 0);

  return (
    <PageShell
      title="Bedroom Personalisation"
      subtitle="Each child's bedroom — co-designed, individually meaningful, sensory-aware"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="bedroom-personalisation" />
          <PrintButton title="Bedroom Personalisation" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Personalised Rooms</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{allChildAuthored ? "100%" : `${data.filter((b) => b.childAuthored).length}/${total}`}</p>
          <p className="text-xs text-muted-foreground">Co-Designed</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{avgSatisfaction}/5</p>
          <p className="text-xs text-muted-foreground">Avg Satisfaction</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">£{totalBudget}</p>
          <p className="text-xs text-muted-foreground">Personalisation Budget</p>
        </div>
      </div>

      <div className="rounded-lg bg-pink-50 border border-pink-200 p-3 mb-6 flex items-start gap-2">
        <Home className="h-4 w-4 text-pink-600 mt-0.5 shrink-0" />
        <p className="text-sm text-pink-800">
          A bedroom is a child&apos;s sanctuary. Every room reflects the child who lives in it — colours,
          themes, personal items, sensory needs. Bedrooms are co-designed and respected: staff knock and wait,
          don&apos;t move things without permission, and treat each room as private space.
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
              <SelectItem value="satisfaction">By Satisfaction</SelectItem>
              <SelectItem value="review">Earliest Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((b) => {
          const isExpanded = expandedId === b.id;

          return (
            <div key={b.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : b.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Home className="h-5 w-5 text-pink-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{getYPName(b.youngPerson)} &middot; {b.roomNumber}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {b.decorThemes.slice(0, 3).join(" · ")} &middot; £{b.totalBudgetSpent} of £{b.totalBudgetSpent + b.budgetRemaining} spent
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-sm font-bold text-amber-600">{b.childSatisfactionRating}/5</span>
                  {b.childAuthored && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        <Palette className="h-3 w-3 inline mr-1" />Wall Colours
                      </p>
                      <ul className="space-y-1">
                        {b.wallColours.map((c, i) => (
                          <li key={i} className="text-sm">{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Decor Themes</p>
                      <div className="flex flex-wrap gap-1">
                        {b.decorThemes.map((t, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Furniture</p>
                    <div className="space-y-1">
                      {b.furnitureItems.map((f, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm flex items-start justify-between gap-2">
                          <div>
                            <span className="font-medium">{f.item}</span>
                            {f.specialNote && <p className="text-xs text-muted-foreground mt-0.5">{f.specialNote}</p>}
                          </div>
                          {f.childChose && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium shrink-0">Child chose</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      <Sparkles className="h-3 w-3 inline mr-1" />Personal Artwork &amp; Photos
                    </p>
                    <ul className="space-y-1">
                      {[...b.personalArtworkDisplayed, ...b.photosDisplayed].map((p, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <span className="text-pink-600 mt-0.5">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">
                      <Heart className="h-3 w-3 inline mr-1" />Comfort Items
                    </p>
                    <ul className="space-y-1">
                      {b.comfortItems.map((c, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <Heart className="h-3 w-3 text-pink-500 mt-1 shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tech Setup</p>
                    <div className="space-y-1">
                      {b.techSetup.map((t, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm">
                          <p className="font-medium">{t.device}</p>
                          <p className="text-xs text-muted-foreground">Rules: {t.agreedUseRules} &middot; Location: {t.locationInRoom}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {b.sensoryAccommodations.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">Sensory Accommodations</p>
                      <ul className="space-y-1">
                        {b.sensoryAccommodations.map((s, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <Lightbulb className="h-3 w-3 text-purple-500 mt-1 shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Meaningful Items</p>
                    <div className="space-y-1">
                      {b.meaningfulItems.map((m, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm">
                          <p className="font-medium">{m.item}</p>
                          <p className="text-xs text-muted-foreground">{m.significance}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Private Space</p>
                    <ul className="space-y-1">
                      {b.privateSpace.map((p, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      <Star className="h-3 w-3 inline mr-1" />Recent Changes
                    </p>
                    <ul className="space-y-1">
                      {b.recentChanges.map((c, i) => (
                        <li key={i} className="text-sm">
                          <span className="text-xs text-muted-foreground">{c.date}:</span> {c.change}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {b.improvementWishes.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Wishes / Future Improvements</p>
                      <ul className="space-y-1">
                        {b.improvementWishes.map((w, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <Sparkles className="h-3 w-3 text-blue-500 mt-1 shrink-0" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span>Reviewed: {b.reviewDate} with {getStaffName(b.reviewedWith)}</span>
                    <span>Budget: £{b.totalBudgetSpent} spent / £{b.budgetRemaining} remaining</span>
                    <span>Satisfaction: {b.childSatisfactionRating}/5</span>
                    {b.childAuthored && <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">Child Co-Designed</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Bedroom personalisation supports Quality Standard 1
          (child-centred care), Quality Standard 7 (health and wellbeing — including sensory and sleep),
          Children&apos;s Homes Regulations 2015 Schedule 1 (homely environment), and UNCRC Article 16
          (right to privacy). Each child has a personalisation budget; bedrooms are co-designed and
          respected as private space.
        </p>
      </div>
    </PageShell>
  );
}
