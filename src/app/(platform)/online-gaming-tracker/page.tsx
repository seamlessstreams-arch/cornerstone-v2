"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  Gamepad2,
  Headphones,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  AlertTriangle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GamingRecord {
  id: string;
  youngPerson: string;
  reviewDate: string;
  console: string;
  primaryGames: { title: string; pegiRating: "3" | "7" | "12" | "16" | "18"; ageAppropriate: boolean }[];
  weeklyHours: number;
  voiceChatUsed: boolean;
  onlineFriendsKnownInPerson: number;
  onlineFriendsKnownOnly: number;
  inGameSpendThisMonth: number;
  spendCap: number;
  flagsConcerns: string[];
  protectiveFactors: string[];
  parentalControlsActive: boolean;
  screenTimeBalanceNote: string;
  childVoice: string;
  staffObservation: string;
  nextReview: string;
  keyWorker: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: GamingRecord[] = [
  {
    id: "gam-001",
    youngPerson: "yp_jordan",
    reviewDate: d(-7),
    console: "PlayStation 5",
    primaryGames: [
      { title: "EA Sports FC (FIFA)", pegiRating: "3", ageAppropriate: true },
      { title: "Fortnite", pegiRating: "12", ageAppropriate: true },
      { title: "NBA 2K", pegiRating: "3", ageAppropriate: true },
    ],
    weeklyHours: 8,
    voiceChatUsed: true,
    onlineFriendsKnownInPerson: 6,
    onlineFriendsKnownOnly: 2,
    inGameSpendThisMonth: 4,
    spendCap: 5,
    flagsConcerns: [],
    protectiveFactors: [
      "Voice chat predominantly with mosque friends and football team mates",
      "Two online-only friends verified by staff via parents/coach links",
      "Open communication — Jordan happily talks about who he plays with",
      "Gaming sits alongside strong offline life (football, family, mosque)",
    ],
    parentalControlsActive: true,
    screenTimeBalanceNote: "Balanced. Gaming is one part of a full life. Self-regulates well — often turns off to attend football or family contact without prompting.",
    childVoice: "FIFA's my main thing. I play with the boys from football and my cousin Devon. It's just chill — like meeting up but online when it's raining.",
    staffObservation: "Healthy gaming profile. Voice chat use is a connection tool with known peers, not a risk vector. Light parental controls appropriate to age 16. Continue current approach.",
    nextReview: d(83),
    keyWorker: "staff_anna",
  },
  {
    id: "gam-002",
    youngPerson: "yp_alex",
    reviewDate: d(-14),
    console: "Nintendo Switch + PC (Steam)",
    primaryGames: [
      { title: "Stardew Valley", pegiRating: "7", ageAppropriate: true },
      { title: "Hades", pegiRating: "12", ageAppropriate: true },
      { title: "Animal Crossing: New Horizons", pegiRating: "3", ageAppropriate: true },
      { title: "Celeste", pegiRating: "7", ageAppropriate: true },
    ],
    weeklyHours: 12,
    voiceChatUsed: false,
    onlineFriendsKnownInPerson: 0,
    onlineFriendsKnownOnly: 1,
    inGameSpendThisMonth: 0,
    spendCap: 10,
    flagsConcerns: [],
    protectiveFactors: [
      "Game choices explicitly therapeutic and self-soothing",
      "Voice chat declined by choice — boundary respected",
      "Single online friend met in moderated LGBTQ+ youth gaming space (verified)",
      "Uses Stardew Valley as named regulation tool when overwhelmed",
      "Talks to key worker openly about online friend",
    ],
    parentalControlsActive: true,
    screenTimeBalanceNote: "Higher hours but quality is high — gaming functions as emotional regulation. Balanced with boxing club, school, key work. No displacement of sleep, food, or relationships.",
    childVoice: "I don't do voice chat — too loud, too much. I like games where I can just exist. Stardew is where I go when my head is busy. My friend Sam from the gaming space gets it.",
    staffObservation: "Gaming is a protective factor for Alex, not a risk. Game library is age-appropriate, low PEGI, non-violent for the most part. The single online friendship was disclosed openly and the space it formed in is moderated and trans/queer-affirming. Continue.",
    nextReview: d(76),
    keyWorker: "staff_edward",
  },
  {
    id: "gam-003",
    youngPerson: "yp_casey",
    reviewDate: d(-3),
    console: "Nintendo Switch (shared with Anna)",
    primaryGames: [
      { title: "Mario Kart 8 Deluxe", pegiRating: "3", ageAppropriate: true },
      { title: "Animal Crossing: New Horizons", pegiRating: "3", ageAppropriate: true },
      { title: "Super Mario Odyssey", pegiRating: "7", ageAppropriate: true },
    ],
    weeklyHours: 4,
    voiceChatUsed: false,
    onlineFriendsKnownInPerson: 0,
    onlineFriendsKnownOnly: 0,
    inGameSpendThisMonth: 0,
    spendCap: 0,
    flagsConcerns: [],
    protectiveFactors: [
      "Console used in shared living space, never in bedroom",
      "Anna co-plays Mario Kart most weekends — relationship-building",
      "All games age-appropriate (PEGI 3-7)",
      "No online interactions — local multiplayer only",
      "Full parental controls: no online play, no chat, no spending",
    ],
    parentalControlsActive: true,
    screenTimeBalanceNote: "Strict screen time — 1 hour per day max. No gaming after 19:00. Balance with sensory art group, library reading hour, and key work.",
    childVoice: "Anna lets me win at Mario Kart sometimes but I beat her on Rainbow Road on my own. Animal Crossing is for when I want everything to be calm.",
    staffObservation: "Highly protected gaming profile appropriate to Casey's age, sensory needs, and developmental stage. Co-play with Anna is a relationship-building tool. No online exposure. Continue current approach. Will reassess at age 13.",
    nextReview: d(87),
    keyWorker: "staff_chervelle",
  },
];

const pegiColour: Record<string, string> = {
  "3": "bg-green-100 text-green-800",
  "7": "bg-lime-100 text-lime-800",
  "12": "bg-amber-100 text-amber-800",
  "16": "bg-orange-100 text-orange-800",
  "18": "bg-red-100 text-red-800",
};

const exportCols: ExportColumn<GamingRecord>[] = [
  { header: "Young Person", accessor: (r: GamingRecord) => getYPName(r.youngPerson) },
  { header: "Review Date", accessor: (r: GamingRecord) => r.reviewDate },
  { header: "Console", accessor: (r: GamingRecord) => r.console },
  { header: "Primary Games", accessor: (r: GamingRecord) => r.primaryGames.map((g) => `${g.title} (PEGI ${g.pegiRating})`).join("; ") },
  { header: "Weekly Hours", accessor: (r: GamingRecord) => `${r.weeklyHours}` },
  { header: "Voice Chat", accessor: (r: GamingRecord) => r.voiceChatUsed ? "Yes" : "No" },
  { header: "Friends (in person)", accessor: (r: GamingRecord) => `${r.onlineFriendsKnownInPerson}` },
  { header: "Friends (online only)", accessor: (r: GamingRecord) => `${r.onlineFriendsKnownOnly}` },
  { header: "In-game spend (£)", accessor: (r: GamingRecord) => `£${r.inGameSpendThisMonth} / £${r.spendCap} cap` },
  { header: "Parental controls", accessor: (r: GamingRecord) => r.parentalControlsActive ? "Active" : "Off" },
  { header: "Flags", accessor: (r: GamingRecord) => r.flagsConcerns.join("; ") },
  { header: "Key Worker", accessor: (r: GamingRecord) => getStaffName(r.keyWorker) },
  { header: "Next Review", accessor: (r: GamingRecord) => r.nextReview },
];

export default function OnlineGamingTrackerPage() {
  const [search, setSearch] = useState("");
  const [filterAgeAppropriate, setFilterAgeAppropriate] = useState("all");
  const [sortBy, setSortBy] = useState("review");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (r) =>
          getYPName(r.youngPerson).toLowerCase().includes(q) ||
          r.console.toLowerCase().includes(q) ||
          r.primaryGames.some((g) => g.title.toLowerCase().includes(q))
      );
    }
    if (filterAgeAppropriate === "yes") {
      items = items.filter((r) => r.primaryGames.every((g) => g.ageAppropriate));
    } else if (filterAgeAppropriate === "no") {
      items = items.filter((r) => r.primaryGames.some((g) => !g.ageAppropriate));
    }
    items.sort((a, b) => {
      switch (sortBy) {
        case "review":
          return b.reviewDate.localeCompare(a.reviewDate);
        case "hours":
          return b.weeklyHours - a.weeklyHours;
        case "flags":
          return b.flagsConcerns.length - a.flagsConcerns.length;
        case "spend":
          return b.inGameSpendThisMonth - a.inGameSpendThisMonth;
        default:
          return 0;
      }
    });
    return items;
  }, [search, filterAgeAppropriate, sortBy]);

  const activeGamers = data.length;
  const weeklyHoursTotal = data.reduce((sum, r) => sum + r.weeklyHours, 0);
  const onlineOnlyFriendsTotal = data.reduce((sum, r) => sum + r.onlineFriendsKnownOnly, 0);
  const flagsTotal = data.reduce((sum, r) => sum + r.flagsConcerns.length, 0);

  return (
    <PageShell
      title="Online Gaming Tracker"
      subtitle="Per-child gaming activity — child-led with safeguarding lens. Console, games, online interactions, time, spend, and online safety."
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="online-gaming-tracker" />
          <PrintButton title="Online Gaming Tracker" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">{activeGamers}</p>
          <p className="text-xs text-muted-foreground">Active Gamers</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-violet-600">{weeklyHoursTotal}</p>
          <p className="text-xs text-muted-foreground">Total Weekly Hours</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{onlineOnlyFriendsTotal}</p>
          <p className="text-xs text-muted-foreground">Online-Only Friends</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className={cn("text-2xl font-bold", flagsTotal > 0 ? "text-red-600" : "text-green-600")}>{flagsTotal}</p>
          <p className="text-xs text-muted-foreground">Active Flags</p>
        </div>
      </div>

      <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-3 mb-6 flex items-start gap-2">
        <Gamepad2 className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
        <p className="text-sm text-indigo-800">
          Gaming is a legitimate part of childhood (UNCRC Article 31 — right to play and leisure).
          We track to keep children safe online, not to police their fun. Child-led, safeguarding-aware.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search child, console, or game"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border bg-white text-sm"
          />
        </div>
        <Select value={filterAgeAppropriate} onValueChange={setFilterAgeAppropriate}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Age-appropriate" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Age Ratings</SelectItem>
            <SelectItem value="yes">All age-appropriate</SelectItem>
            <SelectItem value="no">Has unsuitable game</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="review">By Review Date</SelectItem>
              <SelectItem value="hours">By Weekly Hours</SelectItem>
              <SelectItem value="flags">By Flags</SelectItem>
              <SelectItem value="spend">By Monthly Spend</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => {
          const isExpanded = expandedId === r.id;
          const overSpend = r.inGameSpendThisMonth > r.spendCap;
          const hasFlags = r.flagsConcerns.length > 0;

          return (
            <div key={r.id} className={cn("rounded-xl border bg-white overflow-hidden", hasFlags && "border-red-200")}>
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : r.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Gamepad2 className="h-5 w-5 text-indigo-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{getYPName(r.youngPerson)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Reviewed {r.reviewDate} &middot; Key worker {getStaffName(r.keyWorker)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 shrink-0 ml-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-800">
                    {r.console.split(" ")[0]}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-violet-100 text-violet-800">
                    {r.weeklyHours} hrs/wk
                  </span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1", r.voiceChatUsed ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700")}>
                    <Headphones className="h-3 w-3" />
                    {r.voiceChatUsed ? "Voice" : "No voice"}
                  </span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1", r.parentalControlsActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
                    <ShieldCheck className="h-3 w-3" />
                    {r.parentalControlsActive ? "Controls on" : "No controls"}
                  </span>
                  {hasFlags && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-800 inline-flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {r.flagsConcerns.length} flag{r.flagsConcerns.length === 1 ? "" : "s"}
                    </span>
                  )}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-white rounded-lg p-2 border text-center text-sm">
                      <p className="text-xs text-muted-foreground">Console</p>
                      <p className="font-medium">{r.console}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center text-sm">
                      <p className="text-xs text-muted-foreground">Weekly Hours</p>
                      <p className="font-medium">{r.weeklyHours}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center text-sm">
                      <p className="text-xs text-muted-foreground">Friends (in-person)</p>
                      <p className="font-medium">{r.onlineFriendsKnownInPerson}</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border text-center text-sm">
                      <p className="text-xs text-muted-foreground">Friends (online-only)</p>
                      <p className="font-medium">{r.onlineFriendsKnownOnly}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      <Gamepad2 className="h-3 w-3 inline mr-1" />Primary Games
                    </p>
                    <ul className="space-y-1">
                      {r.primaryGames.map((g, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <span className={cn("text-xs px-1.5 py-0.5 rounded font-bold", pegiColour[g.pegiRating])}>
                            PEGI {g.pegiRating}
                          </span>
                          <span>{g.title}</span>
                          {!g.ageAppropriate && (
                            <span className="text-xs text-red-600 font-medium inline-flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Above age
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Child&apos;s Voice</p>
                    <p className="text-sm italic">&ldquo;{r.childVoice}&rdquo;</p>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">Staff Observation</p>
                    <p className="text-sm">{r.staffObservation}</p>
                  </div>

                  <div className={cn("rounded-lg p-3 border", overSpend ? "bg-red-50 border-red-200" : "bg-white")}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">In-Game Spending (this month)</p>
                    <p className="text-sm">
                      <strong>£{r.inGameSpendThisMonth.toFixed(2)}</strong> spent of <strong>£{r.spendCap.toFixed(2)}</strong> monthly cap
                      {overSpend && (
                        <span className="ml-2 text-red-700 inline-flex items-center gap-1 font-medium">
                          <AlertTriangle className="h-3 w-3" />
                          Over cap
                        </span>
                      )}
                    </p>
                  </div>

                  {r.protectiveFactors.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-800 uppercase tracking-wide mb-1">
                        <ShieldCheck className="h-3 w-3 inline mr-1" />Protective Factors
                      </p>
                      <ul className="space-y-1">
                        {r.protectiveFactors.map((p, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-green-600 mt-0.5">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {r.flagsConcerns.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <p className="text-xs font-semibold text-red-800 uppercase tracking-wide mb-1">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />Flags / Concerns
                      </p>
                      <ul className="space-y-1">
                        {r.flagsConcerns.map((f, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-red-600 mt-0.5">•</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-violet-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-violet-800 uppercase tracking-wide mb-1">Screen-Time Balance</p>
                    <p className="text-sm">{r.screenTimeBalanceNote}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span>Reviewed: {r.reviewDate}</span>
                    <span>Next review: {r.nextReview}</span>
                    <span>Key worker: {getStaffName(r.keyWorker)}</span>
                    <span>Voice chat: {r.voiceChatUsed ? "Yes" : "No"}</span>
                    <span>Parental controls: {r.parentalControlsActive ? "Active" : "Off"}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Online gaming oversight aligns with KCSIE 2024 (online safety),
          UK GDPR Age Appropriate Design Code (children&apos;s data online), Quality Standard 9 (Protection of
          Children), Online Safety Act 2023 (illegal and harmful content duties on platforms), and UNCRC
          Articles 17 (access to information), 19 (protection from harm) and 31 (right to play and leisure).
          Linked to Safeguarding, Risk Assessments, Pocket Money, and Child Voice pages.
        </p>
      </div>
    </PageShell>
  );
}
