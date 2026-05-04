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
  Heart,
  Sparkles,
  Flower,
  Star,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MemorialRecord {
  id: string;
  occasion: "Bereavement (death)" | "Annual remembrance" | "Pet bereavement" | "Loss anniversary" | "Family anniversary" | "Cultural memorial day";
  date: string;
  whoIsRemembered: string;
  affectedChildren: string[];
  significance: string;
  childPreferences: string;
  ritualsObserved: string[];
  staffRoleOnDay: string;
  externalSupport: string;
  childExpressionsObserved: string;
  followUpDate: string;
  notes: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: MemorialRecord[] = [
  {
    id: "mo-001",
    occasion: "Pet bereavement",
    date: d(-30),
    whoIsRemembered: "Casey's previous home pet (cat)",
    affectedChildren: ["yp_casey"],
    significance: "Casey lost a much-loved cat at previous placement. Significant emotional wound. Anniversary acknowledged at Casey's request.",
    childPreferences: "Quiet acknowledgement. Drawing of cat added to memory book. Anna present quietly.",
    ritualsObserved: [
      "Casey drew a picture of the cat for Memory Book",
      "Lit a candle for the evening (Casey's idea)",
      "Anna brought sage green flowers (Casey's preferred colour)",
      "No demands or activities — Casey directed the day",
    ],
    staffRoleOnDay: "Anna stayed close. Quiet presence. Visual cards available. Casey set the pace.",
    externalSupport: "Art therapist briefed; offered session if Casey wished",
    childExpressionsObserved: "Casey kept the drawing all day. Smiled softly at the candle. Said via visual cards that they 'liked having a quiet day for [pet name]'.",
    followUpDate: d(335),
    notes: "Honouring earlier loss matters. Casey's autonomy in marking it was central.",
  },
  {
    id: "mo-002",
    occasion: "Loss anniversary",
    date: "2025-11-05",
    whoIsRemembered: "Anniversary of house fire (Jordan's childhood)",
    affectedChildren: ["yp_jordan"],
    significance: "Trauma anniversary — house fire that destroyed family home. Bonfire night compounds the date. Jordan's PTSD risk elevated.",
    childPreferences: "Acknowledged but not made a big thing. Avoid fireworks where possible. Available staff. Optional creative outlet.",
    ritualsObserved: [
      "Pre-emptive conversation in the days before",
      "Quieter staffing — Chervelle on shift",
      "Fireworks avoided where possible (challenging on bonfire night)",
      "Optional creative session offered (Jordan's choice — declined this year)",
      "Therapy session within 48 hours",
      "Letter to lost family pet (a tradition Jordan started age 10)",
    ],
    staffRoleOnDay: "Chervelle led. Quiet presence. RM aware. On-call manager briefed. Sensory tools accessible.",
    externalSupport: "CAMHS therapist had crisis slot pre-booked",
    childExpressionsObserved: "Jordan wrote his annual letter to the family pet. Sat with Chervelle. Slept with night light. Spoke about it briefly the next morning.",
    followUpDate: "2026-11-05",
    notes: "Annual ritual respected and refined each year per Jordan's preferences. Linked to Trauma-Informed Timeline and Placement Anniversaries.",
  },
  {
    id: "mo-003",
    occasion: "Cultural memorial day",
    date: d(-90),
    whoIsRemembered: "Black History Month — collective remembrance and celebration",
    affectedChildren: ["yp_jordan", "yp_alex", "yp_casey"],
    significance: "Cultural celebration with memorial elements. Jordan led aspects given his heritage. Inclusive for all children.",
    childPreferences: "Jordan led; Alex and Casey participated as wished. Cultural mentor invited.",
    ritualsObserved: [
      "Cultural meal (Jordan-led with Chervelle)",
      "Watched documentaries chosen by Jordan",
      "Visit to Black History Museum (whole house — see Cultural Visits)",
      "Discussion of family heritage (gentle, child-led)",
      "Jordan's cultural mentor visited",
    ],
    staffRoleOnDay: "Chervelle and Jordan co-led; staff supported children's individual engagement levels.",
    externalSupport: "Cultural mentor (paid practitioner)",
    childExpressionsObserved: "Jordan visibly proud. Alex curious and respectful. Casey engaged with quieter aspects (food, watching, drawing).",
    followUpDate: d(275),
    notes: "Meaningful inclusion of cultural memorial. Jordan-led rather than imposed. Also see Religious Observance Log.",
  },
  {
    id: "mo-004",
    occasion: "Bereavement (death)",
    date: "2024-03-12",
    whoIsRemembered: "Casey's birth grandmother (died) — letterbox notification",
    affectedChildren: ["yp_casey"],
    significance: "Birth grandmother died — Casey informed via SW. Complex emotion given limited contact.",
    childPreferences: "Casey wished for quiet acknowledgement. Did not wish to attend funeral (decision respected).",
    ritualsObserved: [
      "SW informed Casey gently with Anna present",
      "Casey wrote a private letter (kept in Memory Book — never sent)",
      "Quiet day at home; Anna present throughout",
      "Annual remembrance now established at Casey's request",
    ],
    staffRoleOnDay: "Anna and Lisa (SW) jointly informed Casey using visual support. Anna stayed for the day.",
    externalSupport: "Art therapist offered session in following week",
    childExpressionsObserved: "Casey processed quietly through art. Wrote private letter. Has marked anniversary annually since with similar quiet acknowledgement.",
    followUpDate: "2026-03-12",
    notes: "Loss with complexity given birth family situation. Honoured per Casey's wishes. Sensitive entry — see also Grief and Loss Support.",
  },
];

const occasionColour: Record<string, string> = {
  "Bereavement (death)": "bg-purple-100 text-purple-800",
  "Annual remembrance": "bg-amber-100 text-amber-800",
  "Pet bereavement": "bg-pink-100 text-pink-800",
  "Loss anniversary": "bg-rose-100 text-rose-800",
  "Family anniversary": "bg-blue-100 text-blue-800",
  "Cultural memorial day": "bg-emerald-100 text-emerald-800",
};

const exportCols: ExportColumn<MemorialRecord>[] = [
  { header: "Occasion", accessor: (r: MemorialRecord) => r.occasion },
  { header: "Date", accessor: (r: MemorialRecord) => r.date },
  { header: "Remembered", accessor: (r: MemorialRecord) => r.whoIsRemembered },
  { header: "Children Affected", accessor: (r: MemorialRecord) => r.affectedChildren.map(getYPName).join("; ") },
  { header: "Significance", accessor: (r: MemorialRecord) => r.significance },
  { header: "Follow-Up", accessor: (r: MemorialRecord) => r.followUpDate },
];

export default function MemorialOccasionRecordsPage() {
  const [filterOccasion, setFilterOccasion] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterOccasion !== "all") items = items.filter((m) => m.occasion === filterOccasion);
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.date.localeCompare(a.date);
        case "occasion":
          return a.occasion.localeCompare(b.occasion);
        default:
          return 0;
      }
    });
    return items;
  }, [filterOccasion, sortBy]);

  const total = data.length;
  const annualMarkers = data.filter((m) => m.occasion === "Annual remembrance" || m.occasion === "Loss anniversary" || m.occasion === "Pet bereavement").length;
  const childrenWithRituals = new Set(data.flatMap((m) => m.affectedChildren)).size;

  return (
    <PageShell
      title="Memorial Occasions"
      subtitle="How the home marks significant losses, anniversaries, and remembrance — with care, dignity, and child-led ritual"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="memorial-occasion-records" />
          <PrintButton title="Memorial Occasions" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Memorial Records</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{annualMarkers}</p>
          <p className="text-xs text-muted-foreground">Annual Markers</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-pink-600">{childrenWithRituals}/3</p>
          <p className="text-xs text-muted-foreground">Children with Rituals</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">100%</p>
          <p className="text-xs text-muted-foreground">Child-Led</p>
        </div>
      </div>

      <div className="rounded-lg bg-purple-50 border border-purple-200 p-3 mb-6 flex items-start gap-2">
        <Flower className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
        <p className="text-sm text-purple-800">
          Loss touches every child who comes into care. We mark significant occasions — bereavements,
          anniversaries, pet losses, cultural memorial days — in ways the child chooses. Tradition,
          ritual, and quiet acknowledgement honoured. Never imposed.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterOccasion} onValueChange={setFilterOccasion}>
          <SelectTrigger className="w-[220px]"><SelectValue placeholder="All Occasions" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Occasions</SelectItem>
            <SelectItem value="Bereavement (death)">Bereavement</SelectItem>
            <SelectItem value="Annual remembrance">Annual Remembrance</SelectItem>
            <SelectItem value="Pet bereavement">Pet Bereavement</SelectItem>
            <SelectItem value="Loss anniversary">Loss Anniversary</SelectItem>
            <SelectItem value="Family anniversary">Family Anniversary</SelectItem>
            <SelectItem value="Cultural memorial day">Cultural Memorial</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Most Recent</SelectItem>
              <SelectItem value="occasion">By Occasion</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((m) => {
          const isExpanded = expandedId === m.id;

          return (
            <div key={m.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : m.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Flower className="h-5 w-5 text-purple-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{m.whoIsRemembered}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {m.date} &middot; {m.affectedChildren.map(getYPName).join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", occasionColour[m.occasion])}>{m.occasion}</span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">Significance</p>
                    <p className="text-sm">{m.significance}</p>
                  </div>

                  <div className="bg-pink-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1">
                      <Heart className="h-3 w-3 inline mr-1" />Child Preferences
                    </p>
                    <p className="text-sm">{m.childPreferences}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      <Sparkles className="h-3 w-3 inline mr-1" />Rituals Observed
                    </p>
                    <ul className="space-y-1">
                      {m.ritualsObserved.map((r, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <Star className="h-3 w-3 text-amber-500 mt-1 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Staff Role</p>
                    <p className="text-sm">{m.staffRoleOnDay}</p>
                  </div>

                  {m.externalSupport && (
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">External Support</p>
                      <p className="text-sm">{m.externalSupport}</p>
                    </div>
                  )}

                  <div className="bg-rose-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-rose-800 uppercase tracking-wide mb-1">Child&apos;s Expressions Observed</p>
                    <p className="text-sm italic">{m.childExpressionsObserved}</p>
                  </div>

                  {m.notes && (
                    <div className="bg-slate-50 rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-sm">{m.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span>Follow-up: {m.followUpDate}</span>
                    <span>Children: {m.affectedChildren.map(getYPName).join(", ")}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Memorial occasion records support Quality Standard 1
          (child-centred care), Quality Standard 7 (health and wellbeing), trauma-informed practice
          principles, and respect for cultural / spiritual practice (UNCRC Article 30). Linked to Grief
          and Loss Support, Placement Anniversaries, Trauma-Informed Timeline, and Cultural Identity.
        </p>
      </div>
    </PageShell>
  );
}
