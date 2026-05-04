"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  Moon,
  Star,
  Heart,
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

// ── types ───────────────────────────────────────────────────────────────────
interface NightAnxietyRecord {
  id: string;
  youngPerson: string;
  recordDate: string;
  anxietyLevel:
    | "Settled"
    | "Mild — manageable"
    | "Moderate"
    | "Severe — frequent waking"
    | "Crisis — sleep severely impacted";
  primaryTriggers: string[];
  bedtimeRoutine: string[];
  comfortItems: string[];
  doStrategies: string[];
  doNotStrategies: string[];
  childPreferences: string;
  externalReferralActive?: string;
  averageSleepHours?: number;
  nightmareFrequency:
    | "None"
    | "Occasional"
    | "Weekly"
    | "Multiple per week"
    | "Most nights";
  hypervigilanceNotes?: string;
  childVoice: string;
  staffObservation: string;
  staffActionsLastWeek: string[];
  reviewDate: string;
  keyWorker: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

// ── seed data ───────────────────────────────────────────────────────────────
const records: NightAnxietyRecord[] = [
  {
    id: "nas-001",
    youngPerson: "yp-casey",
    recordDate: d(-3),
    anxietyLevel: "Severe — frequent waking",
    primaryTriggers: [
      "Memories of previous home (raised voices at night)",
      "Sudden noises (doors slamming, footsteps in corridor)",
      "Total darkness",
      "Door fully closed (feels trapped)",
    ],
    bedtimeRoutine: [
      "Warm bath at 19:30 with calming bath salts",
      "Story read aloud by key worker (20 minutes)",
      "Comfort blanket and weighted blanket on bed",
      "Nightlight on (warm amber, low setting)",
      "Bedroom door left ajar approximately 15cm",
      "Quiet 'goodnight' from staff — no extended conversation",
    ],
    comfortItems: [
      "Pink comfort blanket (originally from grandmother)",
      "Weighted blanket (4.5kg)",
      "Soft bunny — 'Mr Hopps'",
      "Amber nightlight",
    ],
    doStrategies: [
      "Move quietly in corridor after 20:00",
      "Use calm, low voice if Casey wakes",
      "Offer warm milk if waking before midnight",
      "Sit on chair near door (not on bed) if reassurance needed",
      "Validate feelings: 'It makes sense you feel scared'",
      "Allow comfort blanket to be taken everywhere",
    ],
    doNotStrategies: [
      "Do NOT slam doors or speak loudly in corridor",
      "Do NOT close bedroom door fully — even briefly",
      "Do NOT remove the nightlight, even if bulb seems bright",
      "Do NOT minimise fears ('there's nothing to be scared of')",
      "Do NOT enter room without knocking softly first",
      "Do NOT promise 'nothing bad will happen' — Casey knows this isn't always true",
    ],
    childPreferences:
      "Casey has asked that staff not sit on her bed when she's anxious — prefers chair near door. Wants the same key worker to read story when possible. Has asked that the comfort blanket is never washed during the day (only when she's at school).",
    externalReferralActive:
      "CAMHS — trauma-focused CBT, fortnightly with Dr Hassan",
    averageSleepHours: 5.5,
    nightmareFrequency: "Multiple per week",
    hypervigilanceNotes:
      "Casey listens to corridor sounds and can identify which staff member is on. Reports feeling 'on alert' until she hears the night staff settle. Sleeps with one eye open if she doesn't recognise the night staff voice.",
    childVoice:
      "I sleep better when I know it's Maria on. The nightlight makes the room feel like mine. Please don't shut my door — even when I'm asleep. The weighted blanket feels like a hug.",
    staffObservation:
      "Casey settles more quickly on nights where her preferred key worker is on shift. Hypervigilance reduces over weeks of consistent staffing. Nightmares cluster around contact week and after social media exposure to old neighbourhood.",
    staffActionsLastWeek: [
      "Maintained nightlight + door-ajar protocol every night",
      "Maria read story 5 of 7 nights",
      "Soothed twice after nightmare — used grounding (5-4-3-2-1) technique",
      "Logged sleep hours each morning",
      "Liaised with CAMHS following Tuesday nightmare cluster",
    ],
    reviewDate: d(11),
    keyWorker: "staff-maria",
  },
  {
    id: "nas-002",
    youngPerson: "yp-alex",
    recordDate: d(-7),
    anxietyLevel: "Moderate",
    primaryTriggers: [
      "Silence (associates with being alone after family rejection)",
      "Door fully closed",
      "Staff checking in too often (feels watched)",
      "Anniversary dates (mum's birthday, contact refusals)",
    ],
    bedtimeRoutine: [
      "Quiet chat in lounge (no pressure to talk) at 20:30",
      "Optional shower",
      "Lo-fi playlist on low volume",
      "Door slightly open to hallway sounds",
      "Single 'night Alex' from staff — no follow-up check-in",
    ],
    comfortItems: [
      "Bluetooth speaker (lo-fi playlist)",
      "Hoodie worn to bed",
      "Phone within arm's reach (wind-down playlist)",
    ],
    doStrategies: [
      "Leave hallway light on low until 23:00",
      "Allow Alex to keep door slightly open",
      "Respect that hallway voices are reassuring (not disruptive)",
      "Walk past room normally — no tiptoeing (feels patronising)",
      "Acknowledge anniversary dates proactively in keywork",
    ],
    doNotStrategies: [
      "Do NOT check in repeatedly through the night — Alex finds this distressing",
      "Do NOT play 'sleep music' apps Alex hasn't chosen",
      "Do NOT close the door, even if hallway sounds carry",
      "Do NOT raise contact-related topics within an hour of bedtime",
      "Do NOT remove the phone at lights-out — wind-down playlist matters",
    ],
    childPreferences:
      "Alex prefers staff to act 'normal' around bedtime — no whispering, no special voice. Has said the hallway sounds make the home feel 'lived in' and less like a placement.",
    averageSleepHours: 6.5,
    nightmareFrequency: "Weekly",
    hypervigilanceNotes:
      "Reports listening for staff voices to confirm someone is awake. Settles within 20 minutes once hallway activity is heard. Hypervigilance worsens around contact-refusal anniversaries.",
    childVoice:
      "I don't want anyone fussing. Just say goodnight and go. The music helps me stop thinking. I like hearing people in the hallway — means I'm not the only one awake.",
    staffObservation:
      "Alex's anxiety presents as withdrawal at bedtime rather than verbal distress. Sleep improves when staff hold a relaxed, non-watchful presence. Nightmares correlate strongly with contact-refusal anniversary dates.",
    staffActionsLastWeek: [
      "Held door-open + hallway-light protocol every night",
      "Avoided check-ins after lights out (per plan)",
      "Flagged upcoming anniversary date in handover",
      "Shared lo-fi playlist suggestion Alex requested",
    ],
    reviewDate: d(21),
    keyWorker: "staff-tom",
  },
  {
    id: "nas-003",
    youngPerson: "yp-jordan",
    recordDate: d(-14),
    anxietyLevel: "Mild — manageable",
    primaryTriggers: [
      "Contact day evenings (heightened thinking)",
      "Big football fixtures (overstimulation)",
    ],
    bedtimeRoutine: [
      "Football podcast (own choice) at 21:30",
      "Lights out 22:00",
      "Single 'goodnight' from staff at door — no entry",
    ],
    comfortItems: ["Headphones + football podcast", "Team scarf hung over chair"],
    doStrategies: [
      "Say goodnight from doorway only",
      "Allow podcast to play through to natural end",
      "Acknowledge the next day on contact eves ('big day tomorrow, sleep well')",
      "Trust Jordan's self-regulation",
    ],
    doNotStrategies: [
      "Do NOT enter the bedroom to check on Jordan",
      "Do NOT remove headphones at lights out",
      "Do NOT debrief contact in the hour before bed",
      "Do NOT comment on the team scarf or 'tidiness' — it's deliberate",
    ],
    childPreferences:
      "Jordan is clear: a verbal 'goodnight' from the doorway is the right amount of contact. Nothing more. Has asked staff to not raise football scores at bedtime if his team lost.",
    averageSleepHours: 7.5,
    nightmareFrequency: "Occasional",
    childVoice:
      "Honestly I'm fine. Just say night from the door. Don't come in. The podcast is the routine — it's not negotiable.",
    staffObservation:
      "Jordan shows good self-regulation around bedtime. Occasional nightmare clusters around contact days — generally self-resolves by morning. Does not seek staff support after bad nights but will mention briefly at breakfast if asked.",
    staffActionsLastWeek: [
      "Held doorway-goodnight protocol every night",
      "Logged one nightmare on contact-Wednesday",
      "Briefly checked in at breakfast Thursday — Jordan acknowledged but moved on",
    ],
    reviewDate: d(35),
    keyWorker: "staff-sarah",
  },
];

// ── helpers ─────────────────────────────────────────────────────────────────
const anxietyOrder: Record<NightAnxietyRecord["anxietyLevel"], number> = {
  "Crisis — sleep severely impacted": 5,
  "Severe — frequent waking": 4,
  Moderate: 3,
  "Mild — manageable": 2,
  Settled: 1,
};

const anxietyChip = (lvl: NightAnxietyRecord["anxietyLevel"]) => {
  switch (lvl) {
    case "Crisis — sleep severely impacted":
      return "bg-red-100 text-red-800 border-red-300";
    case "Severe — frequent waking":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "Moderate":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "Mild — manageable":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Settled":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
  }
};

const nightmareChip = (f: NightAnxietyRecord["nightmareFrequency"]) => {
  switch (f) {
    case "Most nights":
      return "bg-red-100 text-red-800 border-red-300";
    case "Multiple per week":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "Weekly":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "Occasional":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "None":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
  }
};

// ── page ────────────────────────────────────────────────────────────────────
export default function NightTimeAnxietySupportPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"level" | "name" | "review">("level");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = records.filter((r) => {
      if (levelFilter !== "all" && r.anxietyLevel !== levelFilter) return false;
      if (!q) return true;
      const hay = [
        getYPName(r.youngPerson),
        r.anxietyLevel,
        r.childVoice,
        r.staffObservation,
        r.primaryTriggers.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
    list = [...list].sort((a, b) => {
      if (sortBy === "level")
        return anxietyOrder[b.anxietyLevel] - anxietyOrder[a.anxietyLevel];
      if (sortBy === "name")
        return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
      return a.reviewDate.localeCompare(b.reviewDate);
    });
    return list;
  }, [search, levelFilter, sortBy]);

  // ── stats ─────────────────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const stats = {
    plans: records.length,
    severe: records.filter(
      (r) =>
        r.anxietyLevel === "Severe — frequent waking" ||
        r.anxietyLevel === "Crisis — sleep severely impacted"
    ).length,
    reviewsDue: records.filter((r) => r.reviewDate <= d(14)).length,
    referrals: records.filter((r) => !!r.externalReferralActive).length,
  };

  // ── export ────────────────────────────────────────────────────────────────
  const exportColumns: ExportColumn<NightAnxietyRecord>[] = [
    { header: "Young person", accessor: (r: NightAnxietyRecord) => getYPName(r.youngPerson) },
    { header: "Record date", accessor: (r: NightAnxietyRecord) => r.recordDate },
    { header: "Anxiety level", accessor: (r: NightAnxietyRecord) => r.anxietyLevel },
    { header: "Nightmare frequency", accessor: (r: NightAnxietyRecord) => r.nightmareFrequency },
    {
      header: "Avg sleep (hrs)",
      accessor: (r: NightAnxietyRecord) =>
        r.averageSleepHours !== undefined ? r.averageSleepHours : "",
    },
    {
      header: "Primary triggers",
      accessor: (r: NightAnxietyRecord) => r.primaryTriggers.join("; "),
    },
    {
      header: "DO strategies",
      accessor: (r: NightAnxietyRecord) => r.doStrategies.join("; "),
    },
    {
      header: "DO NOT strategies",
      accessor: (r: NightAnxietyRecord) => r.doNotStrategies.join("; "),
    },
    {
      header: "External referral",
      accessor: (r: NightAnxietyRecord) => r.externalReferralActive ?? "",
    },
    { header: "Child voice", accessor: (r: NightAnxietyRecord) => r.childVoice },
    {
      header: "Staff observation",
      accessor: (r: NightAnxietyRecord) => r.staffObservation,
    },
    { header: "Review date", accessor: (r: NightAnxietyRecord) => r.reviewDate },
    {
      header: "Key worker",
      accessor: (r: NightAnxietyRecord) => getStaffName(r.keyWorker),
    },
  ];

  return (
    <PageShell
      title="Night-time Anxiety Support"
      subtitle="Per-child plans for bedtime fears, separation anxiety, trauma-related sleep difficulty, nightmares and hypervigilance. Captures triggers, soothing strategies, what works, what to avoid, and the child's own voice on what helps."
      actions={
        <div className="flex items-center gap-2">
          <ExportButton
            data={filtered}
            columns={exportColumns}
            filename="night-time-anxiety-support"
          />
          <PrintButton title="Night-time Anxiety Support" />
        </div>
      }
    >
      {/* ── stats ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-lg border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-indigo-700">
              Active plans
            </span>
            <Moon className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-indigo-900">
            {stats.plans}
          </div>
          <div className="text-xs text-indigo-700/70">children with bedtime support plans</div>
        </div>

        <div className="rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-orange-700">
              Severe / crisis
            </span>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-orange-900">
            {stats.severe}
          </div>
          <div className="text-xs text-orange-700/70">requiring escalated overnight support</div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-amber-700">
              Reviews due
            </span>
            <Star className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-amber-900">
            {stats.reviewsDue}
          </div>
          <div className="text-xs text-amber-700/70">within next 14 days</div>
        </div>

        <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-purple-700">
              External referrals
            </span>
            <Heart className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-purple-900">
            {stats.referrals}
          </div>
          <div className="text-xs text-purple-700/70">
            CAMHS / specialist sleep support active
          </div>
        </div>
      </div>

      {/* ── filters ───────────────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by child, trigger, or note…"
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="All anxiety levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All anxiety levels</SelectItem>
            <SelectItem value="Settled">Settled</SelectItem>
            <SelectItem value="Mild — manageable">Mild — manageable</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="Severe — frequent waking">
              Severe — frequent waking
            </SelectItem>
            <SelectItem value="Crisis — sleep severely impacted">
              Crisis — sleep severely impacted
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(v) => setSortBy(v as "level" | "name" | "review")}
        >
          <SelectTrigger className="w-full sm:w-44">
            <ArrowUpDown className="mr-1 h-4 w-4 text-slate-500" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="level">Sort: anxiety level</SelectItem>
            <SelectItem value="name">Sort: child name</SelectItem>
            <SelectItem value="review">Sort: review date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── cards ─────────────────────────────────────────────────────────── */}
      <div className="mt-4 space-y-3">
        {filtered.map((r) => {
          const open = expandedId === r.id;
          return (
            <div
              key={r.id}
              className="rounded-lg border border-indigo-200 bg-white shadow-sm transition hover:border-indigo-300"
            >
              <button
                onClick={() => setExpandedId(open ? null : r.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-blue-100">
                    <Moon className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-slate-900">
                        {getYPName(r.youngPerson)}
                      </span>
                      <span className="text-xs text-slate-500">
                        · key worker {getStaffName(r.keyWorker)}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                          anxietyChip(r.anxietyLevel)
                        )}
                      >
                        {r.anxietyLevel}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                          nightmareChip(r.nightmareFrequency)
                        )}
                      >
                        Nightmares: {r.nightmareFrequency}
                      </span>
                      {r.averageSleepHours !== undefined && (
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
                          {r.averageSleepHours}h avg sleep
                        </span>
                      )}
                      {r.externalReferralActive && (
                        <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs text-purple-700">
                          Referral active
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-xs text-slate-500">
                  <span>Review {r.reviewDate}</span>
                  {open ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </button>

              {open && (
                <div className="border-t border-indigo-100 bg-indigo-50/30 px-4 py-4 space-y-4">
                  {/* Child voice */}
                  <div className="rounded-md border border-indigo-200 bg-white p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                      Child voice
                    </div>
                    <p className="mt-1 text-sm italic text-slate-800">
                      “{r.childVoice}”
                    </p>
                  </div>

                  {/* Staff observation */}
                  <div className="rounded-md border border-slate-200 bg-white p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Staff observation
                    </div>
                    <p className="mt-1 text-sm text-slate-800">{r.staffObservation}</p>
                  </div>

                  {/* Two-col grid */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {/* Triggers */}
                    <div className="rounded-md border border-amber-200 bg-amber-50/50 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                        Primary triggers
                      </div>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-800">
                        {r.primaryTriggers.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Bedtime routine */}
                    <div className="rounded-md border border-indigo-200 bg-white p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                        Bedtime routine
                      </div>
                      <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-slate-800">
                        {r.bedtimeRoutine.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Comfort items */}
                    <div className="rounded-md border border-purple-200 bg-purple-50/40 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-purple-800">
                        Comfort items
                      </div>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-800">
                        {r.comfortItems.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Child preferences */}
                    <div className="rounded-md border border-blue-200 bg-blue-50/40 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-blue-800">
                        Child preferences
                      </div>
                      <p className="mt-1 text-sm text-slate-800">
                        {r.childPreferences}
                      </p>
                    </div>

                    {/* DO strategies */}
                    <div className="rounded-md border border-emerald-200 bg-emerald-50/60 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                        DO — what helps
                      </div>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-emerald-900">
                        {r.doStrategies.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    {/* DO NOT strategies */}
                    <div className="rounded-md border border-red-200 bg-red-50/60 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-red-800">
                        DO NOT — avoid
                      </div>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-red-900">
                        {r.doNotStrategies.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Hypervigilance */}
                  {r.hypervigilanceNotes && (
                    <div className="rounded-md border border-orange-200 bg-orange-50/50 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-orange-800">
                        Hypervigilance notes
                      </div>
                      <p className="mt-1 text-sm text-slate-800">
                        {r.hypervigilanceNotes}
                      </p>
                    </div>
                  )}

                  {/* External referral */}
                  {r.externalReferralActive && (
                    <div className="rounded-md border border-purple-200 bg-white p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                        Active external referral
                      </div>
                      <p className="mt-1 text-sm text-slate-800">
                        {r.externalReferralActive}
                      </p>
                    </div>
                  )}

                  {/* Staff actions last week */}
                  <div className="rounded-md border border-slate-200 bg-white p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Staff actions — last 7 days
                    </div>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-800">
                      {r.staffActionsLastWeek.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer meta */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>Plan recorded {r.recordDate}</span>
                    <span>·</span>
                    <span>Next review {r.reviewDate}</span>
                    <span>·</span>
                    <span>Key worker: {getStaffName(r.keyWorker)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No plans match the current filters.
          </div>
        )}
      </div>

      {/* ── regulatory footer ─────────────────────────────────────────────── */}
      <div className="mt-6 rounded-lg border border-indigo-200 bg-indigo-50/40 p-4 text-xs text-indigo-900/80">
        <div className="font-semibold text-indigo-900">Regulatory framework</div>
        <p className="mt-1">
          This record supports the Children&apos;s Homes (England) Regulations 2015 Quality
          Standard 7 (positive relationships — children feel safe and supported overnight by
          consistent, attuned staff) and Quality Standard 8 (health and well-being — sleep,
          rest, and emotional health are actively promoted). Plans are written from a
          trauma-informed perspective, recognising that night-time anxiety is often a symptom
          of earlier experiences of fear, loss, or unpredictability. The child&apos;s own voice
          is recorded and weighted alongside staff observation, in line with UNCRC Article 31
          (the right to rest and leisure) and Article 12 (the right to be heard in matters
          affecting them).
        </p>
      </div>
    </PageShell>
  );
}
