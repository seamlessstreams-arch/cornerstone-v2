"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Calendar,
  Users,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Heart,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FestivalRecord {
  id: string;
  festival: string;
  faith:
    | "Islam"
    | "Christianity"
    | "Hinduism"
    | "Sikhism"
    | "Judaism"
    | "Buddhism"
    | "Rastafari"
    | "Secular"
    | "Other / Multi-faith";
  date: string;
  childrenInvolved: string[];
  ledByChild?: string;
  preparation: string[];
  food: string[];
  decorations: string[];
  guestsInvited: string[];
  ritualsObserved: string[];
  childChosenAspects: string[];
  budget: number;
  spent: number;
  photosTaken: boolean;
  consentForPhotos: string[];
  reflections: string;
  childVoice: string;
  staffObservation: string;
  improvementsForNextTime: string[];
  recordedBy: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const records: FestivalRecord[] = [
  {
    id: "fest_001",
    festival: "Eid al-Fitr",
    faith: "Islam",
    date: d(-25),
    childrenInvolved: ["yp_jordan"],
    ledByChild: "yp_jordan",
    preparation: [
      "Jordan led menu planning two weeks ahead",
      "New clothes shopping (cultural budget)",
      "Henna kit purchased",
      "House decorated with star/moon lights and 'Eid Mubarak' banner",
      "Mosque attendance arranged for Eid prayer (5am with Anna)",
    ],
    food: [
      "Sheer khurma (vermicelli pudding) — Jordan's mum's recipe (she shared it on contact call)",
      "Biryani — Jordan cooked with Anna",
      "Samosas",
      "Dates and sweets",
    ],
    decorations: [
      "Eid Mubarak banner",
      "Star lights",
      "Floor cushions for shared meal",
    ],
    guestsInvited: [
      "Casey and Alex — invited and joined",
      "Darren joined for evening meal",
      "Mosque friend Yusuf came round briefly",
    ],
    ritualsObserved: [
      "Fajr prayer at mosque",
      "Charity (Zakat al-Fitr) — Jordan donated £5 from pocket money to local food bank",
      "New clothes worn",
      "Family contact call with mum and brother",
      "Greeting 'Eid Mubarak' to all",
    ],
    childChosenAspects: [
      "Menu",
      "Decorations",
      "Who to invite",
      "Wearing new shalwar kameez",
      "Wanted Casey and Alex involved — 'they're family too'",
    ],
    budget: 200,
    spent: 187.5,
    photosTaken: true,
    consentForPhotos: ["yp_jordan", "yp_casey", "yp_alex (selectively)"],
    reflections:
      "A genuinely beautiful day. Jordan said it was the best Eid since being in care because 'I got to do it properly and people cared'. Casey loved learning about it. Alex enjoyed the food. The fact Jordan led it and others joined was the heart of it.",
    childVoice:
      "I was nervous because at my last home Eid wasn't really a thing. But here I cooked the food, we did the prayer, mum sent her recipe — it felt like home. Eid Mubarak.",
    staffObservation:
      "Jordan was visibly proud, animated, leading the day with confidence. Mosque attendance important — staff supported transport at 5am without fuss. Other children joining made Jordan feel less 'separate'.",
    improvementsForNextTime: [
      "Plan Eid al-Adha sacrifice/charity element earlier",
      "Invite mosque friend Yusuf's family for tea (already discussed)",
      "Save sheer khurma recipe to home recipe book (Jordan agreed)",
    ],
    recordedBy: "staff_anna",
  },
  {
    id: "fest_002",
    festival: "Christmas Day",
    faith: "Christianity",
    date: d(-130),
    childrenInvolved: ["yp_alex", "yp_casey"],
    preparation: [
      "Tree decorated by all three children together",
      "Stockings personalised (Casey decorated their own)",
      "Casey wrote letter to Father Christmas (developmentally appropriate — they wanted to)",
      "Christmas Eve church service offered — Alex declined, Casey attended with Anna",
      "Christmas dinner shopping done together",
    ],
    food: [
      "Roast turkey with all trimmings",
      "Vegetarian wellington for Alex",
      "Christmas pudding (Casey wanted custard not brandy butter)",
      "Pigs in blankets (Jordan happily ate halal sausages, separate)",
    ],
    decorations: ["Tree", "Stockings on the fireplace", "Outside lights", "Wreath on door"],
    guestsInvited: [
      "Alex's birth mum did not attend (declined invitation — kept invitation open)",
      "Anna and Darren both worked the day",
      "Casey's grandad joined for lunch (transported home after)",
    ],
    ritualsObserved: [
      "Stockings opened in PJs",
      "Presents around tree after breakfast",
      "Christmas dinner at 2pm",
      "Queen's speech (well — King's now — Casey watched, others didn't)",
      "Walk after dinner",
      "Casey's grandad called Alex's mum on her behalf to extend wishes",
    ],
    childChosenAspects: [
      "Casey: tree decorations",
      "Alex: vegetarian main",
      "Jordan: separate halal preparation respected",
      "Order of presents",
      "Whether to do stockings (Alex chose yes)",
    ],
    budget: 600,
    spent: 587.4,
    photosTaken: true,
    consentForPhotos: ["yp_casey", "yp_jordan"],
    reflections:
      "Mixed-faith Christmas done well — celebrated as a family event without forcing religious observance. Alex's mum not coming was a hard moment but Alex managed it with dignity and Casey's grandad's kindness helped. Jordan included throughout while respecting his Islamic identity (no pork prepared in his cookware, halal alternatives offered).",
    childVoice:
      "It was good. I missed mum but it didn't ruin it. Casey was so excited it was sweet. — Alex. // I LOVED the tree and grandad came!! — Casey.",
    staffObservation:
      "Alex was quiet morning of Christmas — gentle check-in helped. Casey's joy was infectious. Jordan engaged warmly without compromising his own faith. All three children expressed feeling 'together'.",
    improvementsForNextTime: [
      "Plan a fallback if mum can't attend — Alex appreciated the back-up",
      "Earlier Christmas Eve activity to manage anticipation for Casey",
      "Consider doing stockings the night before for Casey (her ritual at home pre-care)",
    ],
    recordedBy: "staff_darren",
  },
  {
    id: "fest_003",
    festival: "Diwali",
    faith: "Hinduism",
    date: d(-200),
    childrenInvolved: ["yp_casey", "yp_jordan", "yp_alex"],
    preparation: [
      "No Hindu child currently placed — celebrated as cultural learning",
      "Visit to local mandir arranged (open day)",
      "Diya tea-light candles bought",
      "Rangoli kit and coloured rice",
      "Sweets shop visit (Indian sweetshop in town)",
    ],
    food: [
      "Indian takeaway selected by children",
      "Gulab jamun, jalebi, barfi — sweets",
      "Veggie samosas",
    ],
    decorations: ["Rangoli at front door (chalk)", "Diyas along windowsills (LED, supervised)", "Fairy lights"],
    guestsInvited: ["Just the home this evening"],
    ritualsObserved: [
      "Mandir visit (open day, no obligation to participate)",
      "Lighting diyas at dusk",
      "Sharing sweets",
      "Discussion about light over darkness",
    ],
    childChosenAspects: [
      "Whether to attend mandir (all three chose yes)",
      "Which sweets to buy",
      "Rangoli design",
    ],
    budget: 80,
    spent: 73.2,
    photosTaken: true,
    consentForPhotos: ["yp_casey", "yp_jordan"],
    reflections:
      "Cultural curiosity celebrated without appropriation. The mandir host was generous — explained the festival's meaning. Children enjoyed the sensory richness (lights, sweets, colours). Jordan said his mosque friend's family celebrate too and he'd like to go to theirs next year if possible.",
    childVoice:
      "The lights were so pretty and the sweets were AMAZING. — Casey. // I'd like to go to a real Diwali at someone's house next year. — Jordan.",
    staffObservation:
      "Useful exposure to faiths beyond those currently represented in the home. Children engaged respectfully. Mandir visit went well — all three asked questions politely.",
    improvementsForNextTime: [
      "Connect with Jordan's mosque friend's family in advance for invitation possibility",
      "Build rangoli with henna designs (Jordan offered)",
      "Watch a Diwali film or read picture book with Casey beforehand",
    ],
    recordedBy: "staff_anna",
  },
  {
    id: "fest_004",
    festival: "Eid al-Adha",
    faith: "Islam",
    date: d(20),
    childrenInvolved: ["yp_jordan"],
    ledByChild: "yp_jordan",
    preparation: [
      "Planning meeting held with Jordan (3 weeks ahead)",
      "Charity element planned — Jordan to donate via mosque",
      "Mosque attendance booked",
      "Halal lamb ordered from local butcher",
      "Yusuf's family invited for evening meal (accepted)",
    ],
    food: [
      "Lamb biryani (planned)",
      "Roast lamb (planned)",
      "Sheer khurma",
      "Salads and breads",
    ],
    decorations: ["Star/moon lights", "Eid Mubarak banner", "Floor cushions"],
    guestsInvited: ["Yusuf's family (5 people, accepted)", "Casey and Alex"],
    ritualsObserved: [
      "Eid prayer at mosque (planned)",
      "Charity portion of meat to local food bank",
      "New clothes worn",
      "Greeting and family contact call",
    ],
    childChosenAspects: [
      "Inviting Yusuf's family",
      "Menu",
      "Charity destination (food bank)",
      "Wanting it 'bigger' than Eid al-Fitr because guests joining",
    ],
    budget: 250,
    spent: 0,
    photosTaken: false,
    consentForPhotos: [],
    reflections: "Upcoming — planning in progress. Jordan engaged and confident.",
    childVoice:
      "This time I want Yusuf's family to come because their mum and dad have been so good to me at mosque. I want to give back.",
    staffObservation:
      "Jordan's growing leadership of his own faith identity is a real strength. The fact he's reciprocating Yusuf's family's hospitality shows social maturity.",
    improvementsForNextTime: [],
    recordedBy: "staff_anna",
  },
];

const exportCols: ExportColumn<FestivalRecord>[] = [
  { header: "Festival", accessor: (r: FestivalRecord) => r.festival },
  { header: "Faith", accessor: (r: FestivalRecord) => r.faith },
  { header: "Date", accessor: (r: FestivalRecord) => r.date },
  {
    header: "Children Involved",
    accessor: (r: FestivalRecord) => r.childrenInvolved.map(getYPName).join("; "),
  },
  { header: "Led by Child", accessor: (r: FestivalRecord) => (r.ledByChild ? getYPName(r.ledByChild) : "—") },
  { header: "Budget", accessor: (r: FestivalRecord) => `£${r.budget.toFixed(2)}` },
  { header: "Spent", accessor: (r: FestivalRecord) => `£${r.spent.toFixed(2)}` },
  { header: "Food", accessor: (r: FestivalRecord) => r.food.join("; ") },
  { header: "Rituals Observed", accessor: (r: FestivalRecord) => r.ritualsObserved.join("; ") },
  { header: "Child Voice", accessor: (r: FestivalRecord) => r.childVoice },
  { header: "Reflections", accessor: (r: FestivalRecord) => r.reflections },
  { header: "Recorded By", accessor: (r: FestivalRecord) => getStaffName(r.recordedBy) },
];

const faithColour: Record<FestivalRecord["faith"], string> = {
  Islam: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Christianity: "bg-red-100 text-red-800 border-red-200",
  Hinduism: "bg-amber-100 text-amber-800 border-amber-200",
  Sikhism: "bg-orange-100 text-orange-800 border-orange-200",
  Judaism: "bg-blue-100 text-blue-800 border-blue-200",
  Buddhism: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Rastafari: "bg-green-100 text-green-800 border-green-200",
  Secular: "bg-slate-100 text-slate-800 border-slate-200",
  "Other / Multi-faith": "bg-purple-100 text-purple-800 border-purple-200",
};

export default function ReligiousFestivalCelebrationsPage() {
  const [search, setSearch] = useState("");
  const [faithFilter, setFaithFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "festival" | "faith">("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = records.filter((rec) => {
      const matchesSearch =
        !search ||
        rec.festival.toLowerCase().includes(search.toLowerCase()) ||
        rec.childrenInvolved.some((c) => getYPName(c).toLowerCase().includes(search.toLowerCase()));
      const matchesFaith = faithFilter === "all" || rec.faith === faithFilter;
      return matchesSearch && matchesFaith;
    });
    r = [...r].sort((a, b) => {
      if (sortBy === "festival") return a.festival.localeCompare(b.festival);
      if (sortBy === "faith") return a.faith.localeCompare(b.faith);
      return b.date.localeCompare(a.date);
    });
    return r;
  }, [search, faithFilter, sortBy]);

  const stats = useMemo(() => {
    const upcoming = records.filter((r) => r.date > d(0)).length;
    const childLed = records.filter((r) => r.ledByChild).length;
    const totalSpent = records.reduce((acc, r) => acc + r.spent, 0);
    const distinctFaiths = new Set(records.map((r) => r.faith)).size;
    return { upcoming, childLed, totalSpent, distinctFaiths };
  }, []);

  return (
    <PageShell
      title="Religious & Cultural Festival Celebrations"
      actions={
        <div className="flex gap-2">
          <ExportButton data={filtered} columns={exportCols} filename="religious-festival-celebrations" />
          <PrintButton title="Religious & Cultural Festival Celebrations" />
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Calendar className="h-4 w-4" />
            <span>Upcoming festivals</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.upcoming}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Heart className="h-4 w-4" />
            <span>Child-led celebrations</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.childLed}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Distinct faiths</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">{stats.distinctFaiths}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm mb-1">
            <Users className="h-4 w-4" />
            <span>Total spent</span>
          </div>
          <div className="text-2xl font-semibold text-slate-900">£{stats.totalSpent.toFixed(2)}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search festival or child..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Select value={faithFilter} onValueChange={setFaithFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Faith" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All faiths</SelectItem>
            <SelectItem value="Islam">Islam</SelectItem>
            <SelectItem value="Christianity">Christianity</SelectItem>
            <SelectItem value="Hinduism">Hinduism</SelectItem>
            <SelectItem value="Sikhism">Sikhism</SelectItem>
            <SelectItem value="Judaism">Judaism</SelectItem>
            <SelectItem value="Buddhism">Buddhism</SelectItem>
            <SelectItem value="Rastafari">Rastafari</SelectItem>
            <SelectItem value="Secular">Secular</SelectItem>
            <SelectItem value="Other / Multi-faith">Other / Multi-faith</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-full sm:w-48">
            <ArrowUpDown className="h-4 w-4 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Most recent</SelectItem>
            <SelectItem value="festival">Festival A→Z</SelectItem>
            <SelectItem value="faith">Faith A→Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => {
          const isOpen = expandedId === r.id;
          const upcoming = r.date > d(0);
          return (
            <div key={r.id} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
              <button
                onClick={() => setExpandedId(isOpen ? null : r.id)}
                className="w-full p-4 flex items-start justify-between gap-3 hover:bg-slate-50 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-slate-900">{r.festival}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border", faithColour[r.faith])}>
                      {r.faith}
                    </span>
                    {r.ledByChild ? (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-pink-100 text-pink-800 border-pink-200">
                        Led by {getYPName(r.ledByChild)}
                      </span>
                    ) : null}
                    {upcoming ? (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                        Upcoming
                      </span>
                    ) : null}
                  </div>
                  <div className="text-sm text-slate-600">
                    {r.date} · {r.childrenInvolved.map(getYPName).join(", ")} · £{r.spent.toFixed(2)} of £{r.budget.toFixed(2)}
                  </div>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
              </button>
              {isOpen ? (
                <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50/50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Child Voice</div>
                      <p className="text-sm text-slate-700 italic">&ldquo;{r.childVoice}&rdquo;</p>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Staff Observation</div>
                      <p className="text-sm text-slate-700">{r.staffObservation}</p>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Preparation</div>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {r.preparation.map((t, i) => (
                          <li key={i} className="flex gap-2"><span className="text-slate-400">·</span><span>{t}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Food</div>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {r.food.map((t, i) => (
                          <li key={i} className="flex gap-2"><span className="text-slate-400">·</span><span>{t}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Rituals Observed</div>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {r.ritualsObserved.map((t, i) => (
                          <li key={i} className="flex gap-2"><span className="text-emerald-500">·</span><span>{t}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Child-Chosen Aspects</div>
                      <ul className="text-sm text-slate-700 space-y-1">
                        {r.childChosenAspects.map((t, i) => (
                          <li key={i} className="flex gap-2"><span className="text-pink-500">·</span><span>{t}</span></li>
                        ))}
                      </ul>
                    </div>
                    {r.guestsInvited.length ? (
                      <div className="rounded-md border border-slate-200 bg-white p-3">
                        <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Guests</div>
                        <ul className="text-sm text-slate-700 space-y-1">
                          {r.guestsInvited.map((t, i) => (
                            <li key={i} className="flex gap-2"><span className="text-slate-400">·</span><span>{t}</span></li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {r.improvementsForNextTime.length ? (
                      <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                        <div className="text-xs font-semibold text-amber-800 uppercase mb-2">For next time</div>
                        <ul className="text-sm text-amber-900 space-y-1">
                          {r.improvementsForNextTime.map((t, i) => (
                            <li key={i} className="flex gap-2"><span>→</span><span>{t}</span></li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <div className="rounded-md border border-slate-200 bg-white p-3 lg:col-span-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Reflections</div>
                      <p className="text-sm text-slate-700">{r.reflections}</p>
                      <div className="text-xs text-slate-500 mt-2">Recorded by {getStaffName(r.recordedBy)}</div>
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
          Religious and cultural festivals are central to identity and belonging. Practice is grounded in Quality
          Standard 6 (Enjoyment & Achievement) and the Equality Act 2010 (religion or belief). Children lead the design
          of their own festivals where possible, with staff resourcing and joining respectfully. Children of other faiths
          (or no faith) are invited but never required to participate. The Statement of Purpose, UNCRC Articles 14
          (freedom of thought, conscience and religion) and 30 (cultural identity), and the home&rsquo;s Equality &
          Diversity policy underpin this work.
        </p>
      </div>
    </PageShell>
  );
}
