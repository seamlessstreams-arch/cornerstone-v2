"use client";

import { useState, useMemo } from "react";
import {
  PawPrint,
  Heart,
  Calendar,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Stethoscope,
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

type Species =
  | "Dog"
  | "Cat"
  | "Rabbit"
  | "Guinea pig"
  | "Fish"
  | "Hamster"
  | "Bird"
  | "Other";

interface PetRecord {
  id: string;
  name: string;
  species: Species;
  breed?: string;
  dob?: string;
  arrivedAt: string;
  microchipped: boolean;
  insurance: boolean;
  vaccinationsUpToDate: boolean;
  lastVetVisit?: string;
  nextVetDue?: string;
  childAllergiesCleared: string[];
  childrenInvolvedInCare: string[];
  walkingFeedingRota: { task: string; days: string; lead: string }[];
  behaviouralNotes: string;
  therapeuticValue: string;
  riskAssessmentDate: string;
  flags: string[];
  loggedBy: string;
}

const d = (n: number) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };

/* ── colour maps ───────────────────────────────────────────────────────── */

const SPECIES_COLOURS: Record<Species, string> = {
  "Dog": "bg-amber-100 text-amber-800",
  "Cat": "bg-purple-100 text-purple-800",
  "Rabbit": "bg-rose-100 text-rose-800",
  "Guinea pig": "bg-teal-100 text-teal-800",
  "Fish": "bg-blue-100 text-blue-800",
  "Hamster": "bg-orange-100 text-orange-800",
  "Bird": "bg-sky-100 text-sky-800",
  "Other": "bg-gray-100 text-gray-700",
};

/* ── seed ──────────────────────────────────────────────────────────────── */

const SEED: PetRecord[] = [
  {
    id: "pet_marley",
    name: "Marley",
    species: "Dog",
    breed: "Labrador cross (lab x collie)",
    dob: "2019-04-12",
    arrivedAt: "2022-08-01",
    microchipped: true,
    insurance: true,
    vaccinationsUpToDate: true,
    lastVetVisit: d(-92),
    nextVetDue: d(28),
    childAllergiesCleared: ["yp_casey", "yp_alex", "yp_jordan"],
    childrenInvolvedInCare: ["yp_casey", "yp_alex", "yp_jordan"],
    walkingFeedingRota: [
      { task: "Morning walk (30 min)", days: "Mon, Wed, Fri", lead: "staff_anna" },
      { task: "Morning walk (30 min)", days: "Tue, Thu", lead: "staff_chervelle" },
      { task: "Weekend long walk (60 min)", days: "Sat, Sun", lead: "staff_edward" },
      { task: "Breakfast feed", days: "Daily 07:30", lead: "staff_anna" },
      { task: "Evening feed", days: "Daily 17:30", lead: "staff_chervelle" },
      { task: "Brush & bedtime cuddle", days: "Daily 20:30", lead: "staff_anna" },
    ],
    behaviouralNotes:
      "Calm, gentle temperament — well-socialised with children and other dogs. Slightly nervous of loud, sudden noises (fireworks, slamming doors); managed with a quiet retreat space in the staff office and a thunder-vest during firework season. Recall is excellent. Knows sit, stay, paw, and roll over. Will sit by the front door when one of the children is upset — has a particularly strong bond with Casey, often laying outside her bedroom door at night.",
    therapeuticValue:
      "Marley is the steady heartbeat of the home. The children settle when he is in the room. He provides routine, responsibility, and unconditional affection — particularly important for children whose attachment histories are complex. Casey, who lost her own pet rabbit Hopscotch, has rebuilt confidence in caring for an animal through her bond with Marley. Alex finds walks with Marley a calmer alternative to community time during difficult days. Jordan has begun training Marley in new tricks, building patience and pride. Animal-assisted moments are not a programme — they are how this home breathes.",
    riskAssessmentDate: d(-45),
    flags: [],
    loggedBy: "staff_darren",
  },
  {
    id: "pet_twiglet",
    name: "Twiglet",
    species: "Guinea pig",
    breed: "Smooth-haired tortoiseshell",
    dob: "2025-06-10",
    arrivedAt: d(-120),
    microchipped: false,
    insurance: false,
    vaccinationsUpToDate: true,
    lastVetVisit: d(-30),
    nextVetDue: d(150),
    childAllergiesCleared: ["yp_casey", "yp_alex", "yp_jordan"],
    childrenInvolvedInCare: ["yp_casey", "yp_jordan"],
    walkingFeedingRota: [
      { task: "Morning hay & pellets", days: "Daily 07:45", lead: "yp_casey" },
      { task: "Fresh veg top-up", days: "Daily 16:30", lead: "yp_casey" },
      { task: "Hutch clean-out", days: "Sun 10:00", lead: "staff_chervelle" },
      { task: "Lawn-run supervision (weather permitting)", days: "Sat 14:00", lead: "yp_jordan" },
    ],
    behaviouralNotes:
      "Friendly, vocal — wheeks loudly when she hears the fridge open. Bonded pair with Toffee; should not be separated. Tolerates gentle handling for short periods (under 10 minutes) on the floor with a towel. Nervous around sudden movement.",
    therapeuticValue:
      "Twiglet and Toffee arrived at Casey's request after the death of her rabbit Hopscotch. Casey campaigned for them with a written proposal, a budget, and a rota — adopted with social worker agreement. The guinea pigs gave her a structured way to grieve forwards rather than backwards: not replacing Hopscotch, but choosing to love again. Daily care duties have given her gentle morning purpose and a regulating routine. Jordan has joined in with weekend lawn-runs.",
    riskAssessmentDate: d(-60),
    flags: [],
    loggedBy: "staff_chervelle",
  },
  {
    id: "pet_toffee",
    name: "Toffee",
    species: "Guinea pig",
    breed: "Abyssinian (rosetted, ginger)",
    dob: "2025-06-10",
    arrivedAt: d(-120),
    microchipped: false,
    insurance: false,
    vaccinationsUpToDate: true,
    lastVetVisit: d(-30),
    nextVetDue: d(150),
    childAllergiesCleared: ["yp_casey", "yp_alex", "yp_jordan"],
    childrenInvolvedInCare: ["yp_casey", "yp_jordan"],
    walkingFeedingRota: [
      { task: "Morning hay & pellets", days: "Daily 07:45", lead: "yp_casey" },
      { task: "Fresh veg top-up", days: "Daily 16:30", lead: "yp_casey" },
      { task: "Hutch clean-out", days: "Sun 10:00", lead: "staff_chervelle" },
      { task: "Nail check", days: "Monthly", lead: "staff_anna" },
    ],
    behaviouralNotes:
      "Bolder than Twiglet — first to explore. Confident at being picked up once settled. Has a small overgrown front tooth being monitored by the vet at next visit. Will popcorn (jump for joy) when fresh coriander is offered.",
    therapeuticValue:
      "The bonded pair model has been deliberate — two animals model companionship and reduce dependency on a single child. Toffee's bolder personality has drawn quieter children (especially Jordan) into engagement. Children learn that animals — like people — have different temperaments and needs. Pet care responsibilities count toward Quality Standard 6 enjoyment & achievement outcomes.",
    riskAssessmentDate: d(-60),
    flags: ["Tooth check at next vet visit"],
    loggedBy: "staff_chervelle",
  },
];

/* ── flat row for export ───────────────────────────────────────────────── */

interface FlatRow {
  name: string;
  species: string;
  breed: string;
  dob: string;
  arrivedAt: string;
  microchipped: string;
  insurance: string;
  vaccinationsUpToDate: string;
  lastVetVisit: string;
  nextVetDue: string;
  childrenInvolvedInCare: string;
  childAllergiesCleared: string;
  riskAssessmentDate: string;
  flags: string;
  loggedBy: string;
}

const exportCols: ExportColumn<FlatRow>[] = [
  { header: "Name", accessor: (r: FlatRow) => r.name },
  { header: "Species", accessor: (r: FlatRow) => r.species },
  { header: "Breed", accessor: (r: FlatRow) => r.breed },
  { header: "Date of Birth", accessor: (r: FlatRow) => r.dob },
  { header: "Arrived At Home", accessor: (r: FlatRow) => r.arrivedAt },
  { header: "Microchipped", accessor: (r: FlatRow) => r.microchipped },
  { header: "Insured", accessor: (r: FlatRow) => r.insurance },
  { header: "Vaccinations Up To Date", accessor: (r: FlatRow) => r.vaccinationsUpToDate },
  { header: "Last Vet Visit", accessor: (r: FlatRow) => r.lastVetVisit },
  { header: "Next Vet Due", accessor: (r: FlatRow) => r.nextVetDue },
  { header: "Children Involved In Care", accessor: (r: FlatRow) => r.childrenInvolvedInCare },
  { header: "Allergies Cleared (children)", accessor: (r: FlatRow) => r.childAllergiesCleared },
  { header: "Risk Assessment Date", accessor: (r: FlatRow) => r.riskAssessmentDate },
  { header: "Flags", accessor: (r: FlatRow) => r.flags },
  { header: "Logged By", accessor: (r: FlatRow) => r.loggedBy },
];

/* ── component ─────────────────────────────────────────────────────────── */

export default function HomePetsCareLogPage() {
  const [data] = useState<PetRecord[]>(SEED);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterSpecies, setFilterSpecies] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const toggle = (id: string) => setExpandedId((cur) => (cur === id ? null : id));

  /* ── stats ────────────────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const petsInHome = data.length;
    const sixtyDays = d(60);
    const thirtyDays = d(30);
    const vaccinationsDue = data.filter((p) => !p.vaccinationsUpToDate || (p.nextVetDue && p.nextVetDue <= sixtyDays)).length;
    const nextVetVisits = data.filter((p) => p.nextVetDue && p.nextVetDue <= thirtyDays).length;
    const childIds = new Set<string>();
    data.forEach((p) => p.childrenInvolvedInCare.forEach((c) => childIds.add(c)));
    return { petsInHome, vaccinationsDue, nextVetVisits, childrenInvolved: childIds.size };
  }, [data]);

  /* ── filter / sort ────────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = data;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.species.toLowerCase().includes(q) ||
        (p.breed ?? "").toLowerCase().includes(q) ||
        p.behaviouralNotes.toLowerCase().includes(q) ||
        p.therapeuticValue.toLowerCase().includes(q)
      );
    }
    if (filterSpecies !== "all") list = list.filter((p) => p.species === filterSpecies);
    const out = [...list];
    switch (sortBy) {
      case "name": out.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "species": out.sort((a, b) => a.species.localeCompare(b.species)); break;
      case "vet": out.sort((a, b) => (a.nextVetDue ?? "9999").localeCompare(b.nextVetDue ?? "9999")); break;
      case "arrived": out.sort((a, b) => b.arrivedAt.localeCompare(a.arrivedAt)); break;
    }
    return out;
  }, [data, search, filterSpecies, sortBy]);

  /* ── export rows ──────────────────────────────────────────────────── */
  const exportRows = useMemo<FlatRow[]>(() =>
    data.map((p) => ({
      name: p.name,
      species: p.species,
      breed: p.breed ?? "",
      dob: p.dob ?? "",
      arrivedAt: p.arrivedAt,
      microchipped: p.microchipped ? "Yes" : "No",
      insurance: p.insurance ? "Yes" : "No",
      vaccinationsUpToDate: p.vaccinationsUpToDate ? "Yes" : "No",
      lastVetVisit: p.lastVetVisit ?? "",
      nextVetDue: p.nextVetDue ?? "",
      childrenInvolvedInCare: p.childrenInvolvedInCare.map((c) => getYPName(c)).join("; "),
      childAllergiesCleared: p.childAllergiesCleared.map((c) => getYPName(c)).join("; "),
      riskAssessmentDate: p.riskAssessmentDate,
      flags: p.flags.join("; "),
      loggedBy: getStaffName(p.loggedBy),
    })), [data]);

  const speciesOptions: Species[] = [
    "Dog", "Cat", "Rabbit", "Guinea pig", "Fish", "Hamster", "Bird", "Other",
  ];

  const renderLeadName = (id: string) => {
    if (id.startsWith("yp_")) return getYPName(id);
    if (id.startsWith("staff_")) return getStaffName(id);
    return id;
  };

  return (
    <PageShell
      title="Home Pets Care Log"
      subtitle="The animals who share our home — welfare, vet records, child involvement, and the quiet therapeutic value they bring"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Home Pets Care Log" />
          <ExportButton data={exportRows} columns={exportCols} filename="home-pets-care-log" />
        </div>
      }
    >
      {/* ── stat strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Pets in home", value: stats.petsInHome, icon: PawPrint, colour: "text-amber-600" },
          { label: "Vaccinations due (60d)", value: stats.vaccinationsDue, icon: Stethoscope, colour: stats.vaccinationsDue > 0 ? "text-amber-600" : "text-gray-400" },
          { label: "Next vet visits (30d)", value: stats.nextVetVisits, icon: Calendar, colour: stats.nextVetVisits > 0 ? "text-teal-600" : "text-gray-400" },
          { label: "Children involved", value: stats.childrenInvolved, icon: Heart, colour: "text-rose-500" },
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
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 mb-6">
        <div className="flex items-start gap-2">
          <PawPrint className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Pets are part of the family.</strong> The animals who live at Oak House aren&apos;t a programme or an intervention — they are part of the home&apos;s daily fabric. This log records welfare, vet care, allergy clearance, and how the children are involved. Pet care is a shared responsibility, with rotas that build routine, pride, and gentle accountability into ordinary days.
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
            placeholder="Search by pet, species, breed, or notes…"
            className="w-full rounded-md border py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <Select value={filterSpecies} onValueChange={setFilterSpecies}>
          <SelectTrigger className="w-[180px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All species</SelectItem>
            {speciesOptions.map((sp) => <SelectItem key={sp} value={sp}>{sp}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <ArrowUpDown className="h-4 w-4" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[170px] h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A–Z)</SelectItem>
              <SelectItem value="species">Species</SelectItem>
              <SelectItem value="vet">Next vet visit</SelectItem>
              <SelectItem value="arrived">Most recently arrived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── records ────────────────────────────────────────────────── */}
      <div className="space-y-4 mb-8">
        {filtered.map((p) => {
          const open = expandedId === p.id;
          return (
            <div key={p.id} className="rounded-lg border border-amber-100 bg-white">
              <button
                onClick={() => toggle(p.id)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-amber-50/40"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <PawPrint className="h-4 w-4 text-amber-500" />
                    <h3 className="font-semibold">{p.name}</h3>
                    {p.breed && <span className="text-sm text-gray-600">— {p.breed}</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", SPECIES_COLOURS[p.species])}>
                      {p.species}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      p.vaccinationsUpToDate ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                    )}>
                      {p.vaccinationsUpToDate ? "Vaccinations up to date" : "Vaccinations overdue"}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      p.microchipped ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-600"
                    )}>
                      {p.microchipped ? "Microchipped" : "Not microchipped"}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      p.insurance ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    )}>
                      {p.insurance ? "Insured" : "No insurance"}
                    </span>
                    {p.flags.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {p.flags.length} flag{p.flags.length === 1 ? "" : "s"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Arrived {p.arrivedAt}
                    {p.nextVetDue ? <> · Next vet {p.nextVetDue}</> : null}
                    {" · "}Logged by {getStaffName(p.loggedBy)}
                  </p>
                </div>
                {open ? <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" /> : <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />}
              </button>

              {open && (
                <div className="border-t border-amber-100 px-4 pb-4 space-y-4">
                  {/* behavioural notes */}
                  <div className="rounded-md bg-gray-50 p-3 mt-3">
                    <h4 className="text-xs font-semibold text-gray-500 mb-1">Behavioural notes</h4>
                    <p className="text-sm whitespace-pre-line">{p.behaviouralNotes}</p>
                  </div>

                  {/* therapeutic value */}
                  <div className="rounded-md bg-rose-50 border border-rose-200 p-3">
                    <h4 className="text-xs font-semibold text-rose-700 mb-1 flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" /> Therapeutic value
                    </h4>
                    <p className="text-sm text-rose-900">{p.therapeuticValue}</p>
                  </div>

                  {/* allergies cleared + children involved */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3">
                      <h4 className="text-xs font-semibold text-emerald-700 mb-1">Allergy register — cleared</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {p.childAllergiesCleared.length === 0
                          ? <span className="text-sm italic text-emerald-700/70">No clearance recorded yet.</span>
                          : p.childAllergiesCleared.map((c) => (
                              <span key={c} className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                {getYPName(c)}
                              </span>
                            ))}
                      </div>
                    </div>
                    <div className="rounded-md bg-teal-50 border border-teal-200 p-3">
                      <h4 className="text-xs font-semibold text-teal-700 mb-1">Children involved in care</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {p.childrenInvolvedInCare.length === 0
                          ? <span className="text-sm italic text-teal-700/70">No children currently engaged in care.</span>
                          : p.childrenInvolvedInCare.map((c) => (
                              <span key={c} className="px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                {getYPName(c)}
                              </span>
                            ))}
                      </div>
                    </div>
                  </div>

                  {/* rota */}
                  <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                    <h4 className="text-xs font-semibold text-amber-700 mb-2">Walking &amp; feeding rota</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs text-amber-900/70">
                            <th className="py-1 pr-3 font-medium">Task</th>
                            <th className="py-1 pr-3 font-medium">Days / time</th>
                            <th className="py-1 font-medium">Lead</th>
                          </tr>
                        </thead>
                        <tbody>
                          {p.walkingFeedingRota.map((row, i) => (
                            <tr key={i} className="border-t border-amber-200/60">
                              <td className="py-1.5 pr-3 text-amber-900">{row.task}</td>
                              <td className="py-1.5 pr-3 text-amber-900">{row.days}</td>
                              <td className="py-1.5 text-amber-900">{renderLeadName(row.lead)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* vet info + risk assessment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
                      <h4 className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                        <Stethoscope className="h-3.5 w-3.5" /> Vet record
                      </h4>
                      <p className="text-sm text-blue-900">
                        Last visit: <span className="font-medium">{p.lastVetVisit ?? "—"}</span><br />
                        Next due: <span className="font-medium">{p.nextVetDue ?? "—"}</span><br />
                        DOB: <span className="font-medium">{p.dob ?? "—"}</span>
                      </p>
                    </div>
                    <div className="rounded-md bg-purple-50 border border-purple-200 p-3">
                      <h4 className="text-xs font-semibold text-purple-700 mb-1 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Risk assessment
                      </h4>
                      <p className="text-sm text-purple-900">
                        Last reviewed: <span className="font-medium">{p.riskAssessmentDate}</span>
                      </p>
                      <p className="text-xs text-purple-700/80 mt-1">
                        Annual review under Statement of Purpose and the home&apos;s Health &amp; Safety policy.
                      </p>
                    </div>
                  </div>

                  {/* flags */}
                  {p.flags.length > 0 && (
                    <div className="rounded-md bg-amber-50 border border-amber-300 p-3">
                      <h4 className="text-xs font-semibold text-amber-800 mb-1">Flags</h4>
                      <ul className="list-disc list-inside text-sm text-amber-900 space-y-0.5">
                        {p.flags.map((f, i) => <li key={i}>{f}</li>)}
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
            No pets match these filters.
          </div>
        )}
      </div>

      {/* ── regulatory footer ──────────────────────────────────────── */}
      <div className="rounded-lg border border-teal-200 bg-teal-50/60 p-4 text-sm text-teal-900 mb-6">
        <strong>Regulatory framework.</strong> Pet welfare in the home is held within the Animal Welfare Act 2006 and the RSPCA five welfare needs (suitable environment, suitable diet, ability to behave normally, housing with or apart from other animals, protection from pain, suffering, injury and disease). Children&apos;s involvement is risk-assessed under the Health &amp; Safety at Work Act 1974 and the home&apos;s own Health &amp; Safety policy, with allergy clearance recorded against each child&apos;s health profile. The therapeutic value of pet care contributes to Quality Standard 6 (enjoyment &amp; achievement) of the Children&apos;s Homes (England) Regulations 2015 and is described in the Statement of Purpose.
      </div>
    </PageShell>
  );
}
