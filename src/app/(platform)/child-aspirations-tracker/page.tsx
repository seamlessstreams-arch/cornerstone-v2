"use client";

import { useState, useMemo } from "react";
import {
  Star,
  Compass,
  Sparkles,
  Heart,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { cn } from "@/lib/utils";
import { getYPName, getStaffName } from "@/lib/seed-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ── types ─────────────────────────────────────────────────────────────── */

type Domain =
  | "Career"
  | "Education"
  | "Where I'll live"
  | "Family I want"
  | "Skills I want"
  | "Travel"
  | "Identity & Belonging"
  | "Relationships"
  | "Wellbeing"
  | "Creative";

type Realism =
  | "Very achievable"
  | "Achievable with support"
  | "Stretch goal"
  | "Big dream — long term";

interface AspirationRecord {
  id: string;
  youngPerson: string;
  recordedDate: string;
  domain: Domain;
  aspiration: string;
  whyItMatters: string;
  currentRealism: Realism;
  stepsTaken: string[];
  stepsNext: string[];
  supportNeeded: string[];
  blockers: string[];
  evolvedFromPrevious?: string;
  childChose: boolean;
  reviewDate: string;
  keyWorker: string;
}

/* ── seed ──────────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const SEED: AspirationRecord[] = [
  /* ── Jordan ── */
  {
    id: "asp1",
    youngPerson: "yp_jordan",
    recordedDate: d(-90),
    domain: "Career",
    aspiration: "I want to be a football coach — work with kids who don't fit in at school.",
    whyItMatters:
      "Football is the one place I always felt like I belonged. I want to give that feeling to other kids who get told they're trouble. My PE teacher in primary said I'd be good at coaching — I never forgot that.",
    currentRealism: "Achievable with support",
    stepsTaken: [
      "Started FA Level 1 Introduction to Coaching prep on YouTube",
      "Helps coach the under-9s at Saturday club at the local community centre",
      "Wrote down what makes a good coach in key work session",
    ],
    stepsNext: [
      "Apply for FA Level 1 course — bursary available through LA",
      "Ask community centre coach for a written reference",
      "Look at sport & coaching BTEC at college for next September",
    ],
    supportNeeded: [
      "Funding for FA Level 1 (~£170)",
      "Lift to Saturday sessions",
      "Help with the application form",
    ],
    blockers: [
      "GCSE English grade may affect college entry route",
    ],
    childChose: true,
    reviewDate: d(20),
    keyWorker: "staff_anna",
  },
  {
    id: "asp2",
    youngPerson: "yp_jordan",
    recordedDate: d(-60),
    domain: "Education",
    aspiration: "Pass my GCSEs — especially English and Maths at grade 4 or above.",
    whyItMatters:
      "I used to think school wasn't for me but I want to prove people wrong. If I get my GCSEs I can do the BTEC and then maybe coach properly. It's also for my mum — she always says education is the way out.",
    currentRealism: "Stretch goal",
    stepsTaken: [
      "Attending Highfields four full days a week — best attendance this year",
      "Tutor working with me on English comprehension twice a week",
      "Mock results: Maths grade 3, English grade 3",
    ],
    stepsNext: [
      "Daily 30 mins reading with key worker — book of my choice",
      "Half-term revision plan agreed with school SENCO",
      "Mock again before Christmas",
    ],
    supportNeeded: [
      "Continued tutoring funding",
      "Quiet revision space at the home (bedroom or study)",
      "Encouragement on the bad days",
    ],
    blockers: [
      "Reading age below chronological — affects exam stamina",
      "Anxiety on exam days",
    ],
    childChose: true,
    reviewDate: d(14),
    keyWorker: "staff_anna",
  },
  {
    id: "asp3",
    youngPerson: "yp_jordan",
    recordedDate: d(-30),
    domain: "Identity & Belonging",
    aspiration:
      "Reconnect with my mum's home cooking and start praying again like she taught me.",
    whyItMatters:
      "I was raised Muslim and mum's cooking is part of who I am. Since I came into care I haven't really practised. I want to bring that part of me back — not because anyone's making me, because it's mine.",
    currentRealism: "Very achievable",
    stepsTaken: [
      "Halal meals confirmed at the home",
      "Spoke with key worker about wanting a prayer mat in my room",
      "Asked mum to write down three of her recipes",
    ],
    stepsNext: [
      "Cook one of mum's recipes a fortnight with staff support",
      "Visit the local mosque with staff for Friday prayer if I want to",
      "Ramadan plan to be agreed before next March",
    ],
    supportNeeded: [
      "Staff who respect privacy during prayer",
      "Ingredients budget for cultural cooking",
      "Lift to mosque if I choose to go",
    ],
    blockers: [],
    evolvedFromPrevious:
      "Originally recorded six months ago as 'eat the food I grew up with' — has grown into a wider identity goal that Jordan has shaped himself.",
    childChose: true,
    reviewDate: d(45),
    keyWorker: "staff_anna",
  },
  {
    id: "asp4",
    youngPerson: "yp_jordan",
    recordedDate: d(-15),
    domain: "Travel",
    aspiration: "Travel to Pakistan one day to meet my dad's side of the family.",
    whyItMatters:
      "I've never met my grandparents on dad's side. They live in a village near Lahore. I have cousins my age I've never spoken to. I want to know where half of me comes from.",
    currentRealism: "Big dream — long term",
    stepsTaken: [
      "Asked dad for a family tree — he's working on it",
      "Started a savings tin in my room — £18 so far",
    ],
    stepsNext: [
      "Get my own passport application started (LA can help fund)",
      "Video call with cousins — dad to set up",
      "Add to Pathway Plan as a post-18 goal",
    ],
    supportNeeded: [
      "Help with passport application and ID documents",
      "Conversations with SW about post-18 travel and consent",
      "Maybe an Urdu phrase app",
    ],
    blockers: [
      "Cost of travel",
      "Need passport first",
      "Family contact assessments",
    ],
    childChose: true,
    reviewDate: d(90),
    keyWorker: "staff_anna",
  },

  /* ── Alex ── */
  {
    id: "asp5",
    youngPerson: "yp_alex",
    recordedDate: d(-100),
    domain: "Career",
    aspiration:
      "Study law or social work after college — I want to be the person I needed.",
    whyItMatters:
      "I've had social workers who really listened and ones who didn't. I know what the difference feels like. I want to be one of the ones who gets it. Or a lawyer who fights for kids in care.",
    currentRealism: "Achievable with support",
    stepsTaken: [
      "Researching A-Level vs Access to HE routes with college tutor",
      "Read 'Hackney Child' and one social work textbook from the library",
      "Spoke with care leaver who is now a SW — she said it's possible",
    ],
    stepsNext: [
      "Visit two universities with care-experienced student support",
      "Apply for Become charity's care-experienced mentoring scheme",
      "Get UCAS account set up",
    ],
    supportNeeded: [
      "Help understanding student finance for care leavers",
      "PA support continuing past 18 (legal entitlement to 25)",
      "References from the home",
    ],
    blockers: [
      "Fear of not being 'the right kind' of person for university",
    ],
    childChose: true,
    reviewDate: d(28),
    keyWorker: "staff_edward",
  },
  {
    id: "asp6",
    youngPerson: "yp_alex",
    recordedDate: d(-70),
    domain: "Where I'll live",
    aspiration:
      "Have a peaceful flat with my own kitchen and a window that opens onto something green.",
    whyItMatters:
      "I've never had a kitchen that was mine. Cooking is how I calm down. Peaceful means no shouting through walls — I've had enough of that. The window matters because I want to see something alive when I wake up.",
    currentRealism: "Achievable with support",
    stepsTaken: [
      "Started cooking one meal a week at the home",
      "Saved £230 in setting-up-home savings",
      "Visited a Local Offer flat with PA",
    ],
    stepsNext: [
      "Pinterest / scrapbook of what 'home' looks like to me",
      "Budget conversation with PA about realistic rent in Derby",
      "Apply for council housing register at 17.5",
    ],
    supportNeeded: [
      "Setting Up Home Allowance (LA leaving care duty)",
      "Help understanding tenancy agreements",
      "Keep cooking sessions going at the home",
    ],
    blockers: [
      "Local housing market — peaceful + green = harder to find",
    ],
    childChose: true,
    reviewDate: d(60),
    keyWorker: "staff_edward",
  },
  {
    id: "asp7",
    youngPerson: "yp_alex",
    recordedDate: d(-45),
    domain: "Wellbeing",
    aspiration: "Keep boxing — three sessions a week. It's mine and it works.",
    whyItMatters:
      "Boxing is the only place my head goes quiet. The coach treats me like an athlete, not a kid in care. I'm not giving it up.",
    currentRealism: "Very achievable",
    stepsTaken: [
      "Attending Derby ABC three times a week",
      "Won a junior intermediate bout in March",
      "Coach has my emergency contacts and knows my plan",
    ],
    stepsNext: [
      "Continue current routine",
      "Add to placement plan as a protective factor",
      "Discuss with new keyworker whether to enter another bout",
    ],
    supportNeeded: [
      "Membership and gear funding",
      "Lifts when key worker is on shift",
      "Recovery time built into evening routine",
    ],
    blockers: [],
    childChose: true,
    reviewDate: d(40),
    keyWorker: "staff_edward",
  },
  {
    id: "asp8",
    youngPerson: "yp_alex",
    recordedDate: d(-20),
    domain: "Relationships",
    aspiration:
      "Be a mentor for other LGBTQ+ kids in care once I'm older.",
    whyItMatters:
      "I came out in care and it was lonelier than people realised. There's other kids going through it right now. If I can be the older one who gets it — that's something I want to do. Not just one day, properly.",
    currentRealism: "Stretch goal",
    stepsTaken: [
      "Attended Just Like Us youth event with key worker",
      "Connected with a Stonewall young person's group online",
    ],
    stepsNext: [
      "Look at peer mentor schemes (NYAS / Coram Voice) for 17+",
      "Build my own story — what I'd want to share, what stays private",
      "Discuss safeguarding training options when I turn 18",
    ],
    supportNeeded: [
      "Safeguarding training so I do this safely",
      "Ongoing therapy access — I want to be steady before I support others",
      "Time and space to do this properly",
    ],
    blockers: [
      "Need to be 18+ for most formal mentor schemes",
    ],
    evolvedFromPrevious:
      "First recorded as 'I want to help other gay kids' — Alex has rewritten this himself with much more clarity.",
    childChose: true,
    reviewDate: d(75),
    keyWorker: "staff_edward",
  },

  /* ── Casey ── */
  {
    id: "asp9",
    youngPerson: "yp_casey",
    recordedDate: d(-80),
    domain: "Career",
    aspiration:
      "Become a vet — a proper vet who looks after rescue animals.",
    whyItMatters:
      "Animals don't lie to you. They don't pretend. When I'm with them I feel calm and useful at the same time. I've always known I want to work with them — I think the rescue ones especially because we kind of get each other.",
    currentRealism: "Big dream — long term",
    stepsTaken: [
      "Volunteers at the local cat rescue every other Saturday",
      "Predicted GCSE biology grade 5",
      "Read three books on animal behaviour from the library",
    ],
    stepsNext: [
      "Apply for level 3 BTEC Animal Care at college as bridge to vet nursing",
      "Talk to the rescue vet about work shadowing",
      "Visit Nottingham vet school open day with key worker",
    ],
    supportNeeded: [
      "Strong sciences support — Biology and Chemistry tutoring",
      "Travel to volunteering",
      "Time and patience — vet school is a long road",
    ],
    blockers: [
      "Vet school entry requirements are very high",
      "May need to consider vet nursing as a route in",
    ],
    childChose: true,
    reviewDate: d(35),
    keyWorker: "staff_chervelle",
  },
  {
    id: "asp10",
    youngPerson: "yp_casey",
    recordedDate: d(-50),
    domain: "Skills I want",
    aspiration: "Learn British Sign Language — fluent enough to have a real conversation.",
    whyItMatters:
      "My old foster sister was Deaf. I picked up bits but lost it when I moved. I miss being able to sign. I want it back, and I want to be able to talk to Deaf people properly — not just the basics.",
    currentRealism: "Achievable with support",
    stepsTaken: [
      "Doing the free Sign BSL Level 1 online module",
      "Practises with key worker once a week",
    ],
    stepsNext: [
      "Enrol on a community BSL Level 1 course in September",
      "Attend a Deaf-friendly café session in Derby",
      "Save up for Level 2 course",
    ],
    supportNeeded: [
      "Course fees (~£200 for Level 1)",
      "Transport to evening classes",
      "Someone at the home to practise with",
    ],
    blockers: [],
    childChose: true,
    reviewDate: d(50),
    keyWorker: "staff_chervelle",
  },
  {
    id: "asp11",
    youngPerson: "yp_casey",
    recordedDate: d(-10),
    domain: "Where I'll live",
    aspiration: "Have my own room with a dog one day — somewhere where I'm allowed to be quiet.",
    whyItMatters:
      "I get tired of people. A dog doesn't ask you a hundred questions when you walk through the door. I want a place that's mine, where I decide when there's noise and when there isn't. The dog is part of the picture, not extra.",
    currentRealism: "Stretch goal",
    stepsTaken: [
      "Researched dog-friendly Derby council and HA tenancies",
      "Started a 'one day' Pinterest board",
      "Practising responsible dog care at the rescue",
    ],
    stepsNext: [
      "Add dog ownership cost research into independent living work",
      "Conversation with PA about tenancies that allow pets",
      "Build into Pathway Plan from 16",
    ],
    supportNeeded: [
      "Independent living skills sessions",
      "Realistic budgeting for dog ownership",
      "Help finding pet-friendly housing options",
    ],
    blockers: [
      "Pet-friendly social housing is limited",
      "Need stable accommodation first",
    ],
    childChose: true,
    reviewDate: d(80),
    keyWorker: "staff_chervelle",
  },
];

/* ── constants ─────────────────────────────────────────────────────────── */

const DOMAINS: Domain[] = [
  "Career",
  "Education",
  "Where I'll live",
  "Family I want",
  "Skills I want",
  "Travel",
  "Identity & Belonging",
  "Relationships",
  "Wellbeing",
  "Creative",
];

const DOMAIN_META: Record<Domain, { colour: string; icon: typeof Star }> = {
  "Career":               { colour: "bg-amber-100 text-amber-800",   icon: Compass },
  "Education":            { colour: "bg-sky-100 text-sky-800",       icon: Sparkles },
  "Where I'll live":      { colour: "bg-emerald-100 text-emerald-800", icon: Heart },
  "Family I want":        { colour: "bg-rose-100 text-rose-800",     icon: Heart },
  "Skills I want":        { colour: "bg-indigo-100 text-indigo-800", icon: Sparkles },
  "Travel":               { colour: "bg-cyan-100 text-cyan-800",     icon: Compass },
  "Identity & Belonging": { colour: "bg-orange-100 text-orange-800", icon: Star },
  "Relationships":        { colour: "bg-pink-100 text-pink-800",     icon: Heart },
  "Wellbeing":            { colour: "bg-teal-100 text-teal-800",     icon: Sparkles },
  "Creative":             { colour: "bg-purple-100 text-purple-800", icon: Sparkles },
};

const REALISM_META: Record<Realism, { colour: string }> = {
  "Very achievable":         { colour: "bg-green-100 text-green-800" },
  "Achievable with support": { colour: "bg-emerald-100 text-emerald-800" },
  "Stretch goal":            { colour: "bg-amber-100 text-amber-800" },
  "Big dream — long term":   { colour: "bg-violet-100 text-violet-800" },
};

const REALISM_ORDER: Record<Realism, number> = {
  "Very achievable": 0,
  "Achievable with support": 1,
  "Stretch goal": 2,
  "Big dream — long term": 3,
};

/* ── component ─────────────────────────────────────────────────────────── */

export default function ChildAspirationsTrackerPage() {
  const [data] = useState<AspirationRecord[]>(SEED);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const stats = useMemo(() => {
    const stretch = data.filter(
      (r) => r.currentRealism === "Stretch goal" || r.currentRealism === "Big dream — long term"
    ).length;
    const reviewsDue = data.filter((r) => r.reviewDate <= today).length;
    const childrenWithPlans = new Set(data.map((r) => r.youngPerson)).size;
    return {
      total: data.length,
      stretch,
      reviewsDue,
      childrenWithPlans,
    };
  }, [data, today]);

  const filtered = useMemo(() => {
    let list = [...data];
    if (filterDomain !== "all") list = list.filter((r) => r.domain === filterDomain);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.aspiration.toLowerCase().includes(q) ||
          r.whyItMatters.toLowerCase().includes(q) ||
          getYPName(r.youngPerson).toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      switch (sortBy) {
        case "child":
          return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
        case "domain":
          return a.domain.localeCompare(b.domain);
        case "realism":
          return REALISM_ORDER[a.currentRealism] - REALISM_ORDER[b.currentRealism];
        default:
          return b.recordedDate.localeCompare(a.recordedDate);
      }
    });
    return list;
  }, [data, filterDomain, search, sortBy]);

  const exportCols: ExportColumn<AspirationRecord>[] = [
    { header: "Young Person",   accessor: (r: AspirationRecord) => getYPName(r.youngPerson) },
    { header: "Recorded",       accessor: (r: AspirationRecord) => r.recordedDate },
    { header: "Domain",         accessor: (r: AspirationRecord) => r.domain },
    { header: "Aspiration",     accessor: (r: AspirationRecord) => r.aspiration },
    { header: "Why it matters", accessor: (r: AspirationRecord) => r.whyItMatters },
    { header: "Realism",        accessor: (r: AspirationRecord) => r.currentRealism },
    { header: "Steps Taken",    accessor: (r: AspirationRecord) => r.stepsTaken.join("; ") },
    { header: "Steps Next",     accessor: (r: AspirationRecord) => r.stepsNext.join("; ") },
    { header: "Support Needed", accessor: (r: AspirationRecord) => r.supportNeeded.join("; ") },
    { header: "Blockers",       accessor: (r: AspirationRecord) => r.blockers.join("; ") },
    { header: "Evolved From",   accessor: (r: AspirationRecord) => r.evolvedFromPrevious || "" },
    { header: "Child Chose",    accessor: (r: AspirationRecord) => (r.childChose ? "Yes" : "No") },
    { header: "Review Date",    accessor: (r: AspirationRecord) => r.reviewDate },
    { header: "Key Worker",     accessor: (r: AspirationRecord) => getStaffName(r.keyWorker) },
  ];

  return (
    <PageShell
      title="Child Aspirations Tracker"
      subtitle="Hopes, dreams and ambitions — child-led, evolving over time, woven into care planning"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="child-aspirations" />
          <PrintButton title="Child Aspirations Tracker" />
        </div>
      }
    >
      <div id="print-area" className="space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { l: "Aspirations tracked",       v: stats.total,              icon: Star,     c: "text-amber-600" },
            { l: "Stretch goals",             v: stats.stretch,            icon: Sparkles, c: "text-violet-600" },
            { l: "Reviews due",               v: stats.reviewsDue,         icon: Compass,  c: "text-sky-600" },
            { l: "Children with active plans", v: stats.childrenWithPlans, icon: Heart,    c: "text-rose-600" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-sky-50 p-4 text-center shadow-sm"
            >
              <s.icon className={cn("mx-auto h-6 w-6 mb-1", s.c)} />
              <p className="text-2xl font-bold">{s.v}</p>
              <p className="text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search aspirations, child, or why it matters…"
              className="w-full rounded-md border pl-8 pr-3 py-2 text-sm"
            />
          </div>
          <Select value={filterDomain} onValueChange={setFilterDomain}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All domains</SelectItem>
              {DOMAINS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Recorded date</SelectItem>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="domain">Domain</SelectItem>
                <SelectItem value="realism">Realism</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cards */}
        {filtered.map((rec) => {
          const DomainIcon = DOMAIN_META[rec.domain].icon;
          const isOpen = expanded === rec.id;
          return (
            <div
              key={rec.id}
              className="rounded-lg border border-amber-100 bg-white overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setExpanded(isOpen ? null : rec.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-amber-50/50 transition"
              >
                <div className="flex items-start gap-3 text-left">
                  <div className="rounded-full bg-gradient-to-br from-amber-100 to-sky-100 p-2">
                    <DomainIcon className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{getYPName(rec.youngPerson)}</h3>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          DOMAIN_META[rec.domain].colour
                        )}
                      >
                        {rec.domain}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          REALISM_META[rec.currentRealism].colour
                        )}
                      >
                        {rec.currentRealism}
                      </span>
                      {rec.childChose && (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-800">
                          Child chose
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {rec.aspiration}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Recorded {rec.recordedDate} · Review {rec.reviewDate}
                    </p>
                  </div>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>

              {isOpen && (
                <div className="border-t border-amber-100 bg-gradient-to-b from-amber-50/40 to-white p-5 space-y-5">
                  {/* Aspiration BIG */}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-amber-700 font-semibold">
                      Aspiration
                    </p>
                    <p className="mt-1 text-xl md:text-2xl font-semibold leading-snug text-gray-900">
                      &ldquo;{rec.aspiration}&rdquo;
                    </p>
                  </div>

                  {/* Why it matters */}
                  <div className="rounded-lg border border-rose-100 bg-rose-50/60 p-3">
                    <p className="text-xs uppercase tracking-wide text-rose-700 font-semibold mb-1">
                      Why it matters
                    </p>
                    <p className="text-sm italic text-rose-900 leading-relaxed">
                      {rec.whyItMatters}
                    </p>
                  </div>

                  {/* Steps grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-green-800 font-semibold mb-2">
                        Steps taken
                      </p>
                      {rec.stepsTaken.length ? (
                        <ul className="space-y-1 text-sm text-green-900">
                          {rec.stepsTaken.map((s, i) => (
                            <li key={i} className="flex gap-2">
                              <span aria-hidden>•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-green-900/70 italic">None yet.</p>
                      )}
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-blue-800 font-semibold mb-2">
                        Next steps
                      </p>
                      {rec.stepsNext.length ? (
                        <ul className="space-y-1 text-sm text-blue-900">
                          {rec.stepsNext.map((s, i) => (
                            <li key={i} className="flex gap-2">
                              <span aria-hidden>•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-blue-900/70 italic">None planned.</p>
                      )}
                    </div>
                  </div>

                  {/* Support + blockers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-lg border bg-white p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">
                        Support needed
                      </p>
                      {rec.supportNeeded.length ? (
                        <ul className="space-y-1 text-sm text-gray-800">
                          {rec.supportNeeded.map((s, i) => (
                            <li key={i} className="flex gap-2">
                              <span aria-hidden>•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No specific support needed.</p>
                      )}
                    </div>

                    <div className="rounded-lg border bg-white p-3">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">
                        Blockers
                      </p>
                      {rec.blockers.length ? (
                        <ul className="space-y-1 text-sm text-gray-800">
                          {rec.blockers.map((s, i) => (
                            <li key={i} className="flex gap-2">
                              <span aria-hidden>•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No current blockers.</p>
                      )}
                    </div>
                  </div>

                  {/* Evolved + key worker */}
                  {rec.evolvedFromPrevious && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3">
                      <p className="text-xs uppercase tracking-wide text-amber-800 font-semibold mb-1">
                        Evolved from previous version
                      </p>
                      <p className="text-sm text-amber-900">{rec.evolvedFromPrevious}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-100 text-sm">
                    <div className="text-muted-foreground">
                      Key worker: <span className="text-gray-900 font-medium">{getStaffName(rec.keyWorker)}</span>
                    </div>
                    <div className="text-muted-foreground">
                      Next review: <span className="text-gray-900 font-medium">{rec.reviewDate}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Regulatory footer */}
        <div className="rounded-lg border-l-4 border-amber-400 bg-gradient-to-r from-amber-50 via-white to-sky-50 p-4 text-sm text-gray-800 space-y-1">
          <p>
            <strong>UNCRC Article 12 (voice)</strong> &amp;{" "}
            <strong>Article 29 (development of personality, talents and abilities)</strong> — Children
            have the right to express their views in matters affecting them and to grow into the fullest
            version of themselves. Aspirations are recorded in the child&apos;s own words wherever possible.
          </p>
          <p>
            <strong>Children&apos;s Homes Quality Standards</strong> —{" "}
            <strong>QS 5 (Education)</strong> and{" "}
            <strong>QS 6 (Enjoyment &amp; Achievement)</strong>. Aspirations evidence the home&apos;s
            commitment to high expectations, individualised goals, and recognition of each child&apos;s
            wider talents and identity.
          </p>
          <p>
            <strong>Pathway Plan integration</strong> — for children aged 16+, aspirations recorded here
            should be carried into the Pathway Plan and reviewed alongside the PA, ensuring continuity of
            ambition into care leaver support up to age 25.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
