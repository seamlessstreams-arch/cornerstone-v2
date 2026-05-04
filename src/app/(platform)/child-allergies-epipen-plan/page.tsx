"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — CHILD ALLERGIES & ANAPHYLAXIS (AAI / EPIPEN) PLAN
// Per-child BSACI-format allergy and anaphylaxis management plan covering known
// allergens, severity grading, antihistamine, AAI/EpiPen brand + dose +
// locations + expiry, staff trained to administer, school provision, hospital
// plan, child voice and review cycle.
// Quality Standard 8 (Care Planning) + QS7 (Health). BSACI 2023, Resus
// Council UK 2021, MHRA AAI advice, Anaphylaxis Campaign / Allergy UK,
// UNCRC Article 24.
// ══════════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { PrintButton } from "@/components/ui/print-button";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  Syringe,
  AlertTriangle,
  ShieldAlert,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Search,
  Phone,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Severity = "Mild" | "Moderate" | "Severe" | "Anaphylactic";

interface AllergyPlan {
  id: string;
  youngPerson: string;
  planDate: string;
  allergens: { allergen: string; severity: Severity; lastReaction?: string }[];
  antihistamine?: { name: string; dose: string; route: string };
  aaiPrescribed: boolean;
  aaiBrand?: "EpiPen" | "Jext" | "Emerade" | "Other";
  aaiDose?: "150mcg" | "300mcg" | "500mcg";
  aaiLocations: string[];
  aaiExpiryDates: { location: string; expiry: string }[];
  staffTrainedNames: string[];
  staffTrainingExpires?: string;
  emergencyProtocol: string[];
  hospitalAdmissions: { date: string; reason: string; outcome: string }[];
  schoolHasPlan: boolean;
  schoolHasAai: boolean;
  childCanSelfAdminister: boolean;
  childWearsMedicalAlert: boolean;
  emergencyContacts: { name: string; role: string; phone: string }[];
  childVoice: string;
  staffObservation: string;
  reviewDate: string;
  keyWorker: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const today = d(0);
const in60 = d(60);

const SEVERITY_COLOURS: Record<Severity, string> = {
  Mild: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Moderate: "bg-amber-100 text-amber-800 border-amber-200",
  Severe: "bg-orange-100 text-orange-800 border-orange-200",
  Anaphylactic: "bg-red-100 text-red-800 border-red-200",
};

const SEVERITY_RING: Record<Severity, string> = {
  Mild: "border-l-4 border-l-emerald-400",
  Moderate: "border-l-4 border-l-amber-400",
  Severe: "border-l-4 border-l-orange-500",
  Anaphylactic: "border-l-4 border-l-red-600",
};

const expiryStatus = (expiry: string) => {
  if (expiry < today) return { label: "Expired", colour: "bg-red-100 text-red-800" };
  if (expiry < in60)
    return { label: "Expiring soon", colour: "bg-amber-100 text-amber-800" };
  return { label: "In date", colour: "bg-emerald-100 text-emerald-800" };
};

const highestSeverity = (plan: AllergyPlan): Severity | null => {
  if (plan.allergens.length === 0) return null;
  const order: Severity[] = ["Mild", "Moderate", "Severe", "Anaphylactic"];
  return plan.allergens.reduce<Severity>((acc, a) => {
    return order.indexOf(a.severity) > order.indexOf(acc) ? a.severity : acc;
  }, "Mild");
};

// ── Seed Data ─────────────────────────────────────────────────────────────────

const SEED: AllergyPlan[] = [
  {
    id: "alp_001",
    youngPerson: "yp_alex",
    planDate: d(-30),
    allergens: [
      {
        allergen: "Peanut",
        severity: "Anaphylactic",
        lastReaction:
          "Age 8 — accidental ingestion of biscuit containing peanut traces; full anaphylaxis with airway swelling, EpiPen administered, hospital admission 24h.",
      },
      {
        allergen: "Tree nuts (cashew, almond, walnut)",
        severity: "Moderate",
        lastReaction:
          "Age 11 — facial swelling and hives after eating cashew, settled with antihistamine.",
      },
      {
        allergen: "Latex",
        severity: "Moderate",
        lastReaction:
          "Age 12 — contact dermatitis on hands following balloon handling at school event.",
      },
    ],
    antihistamine: {
      name: "Cetirizine",
      dose: "10mg",
      route: "Oral (PO) — once daily as needed for mild reactions",
    },
    aaiPrescribed: true,
    aaiBrand: "Jext",
    aaiDose: "300mcg",
    aaiLocations: [
      "Alex's bedroom (named pouch on bedside table — primary)",
      "Kitchen first aid kit (locked cupboard)",
      "School bag (carried daily)",
      "Boxing gym sports bag",
    ],
    aaiExpiryDates: [
      { location: "Bedroom", expiry: d(180) },
      { location: "Kitchen first aid kit", expiry: d(45) },
      { location: "School bag", expiry: d(220) },
      { location: "Boxing sports bag", expiry: d(-5) },
    ],
    staffTrainedNames: ["staff_anna", "staff_edward", "staff_chervelle"],
    staffTrainingExpires: d(330),
    emergencyProtocol: [
      "Recognise signs: swelling of lips/face/tongue, throat tightness, hoarse voice, wheeze, widespread hives, sudden floppy/pale presentation, persistent vomiting, sense of impending doom.",
      "Lie Alex flat with legs raised (sit upright if breathing is difficult, recovery position if unconscious but breathing). Never stand Alex up.",
      "Administer Jext 300mcg into outer mid-thigh — hold against thigh for 10 seconds, gently massage site for a further 10 seconds. Through clothing acceptable.",
      "Call 999 IMMEDIATELY — say the words 'anaphylaxis, AAI given'. Never delay because the AAI seemed to work.",
      "Note exact time of administration on the empty Jext device casing.",
      "If no clear improvement after 5 minutes, give a second AAI from the nearest spare location.",
      "Stay with Alex. Keep airway clear. Do not give food, drink or oral medication.",
      "Hand the used AAI device to paramedics on arrival.",
      "Inform on-call manager and parents/social worker within 1 hour of the incident.",
    ],
    hospitalAdmissions: [
      {
        date: "2018-04-12",
        reason: "Anaphylaxis — peanut ingestion",
        outcome:
          "EpiPen given by parent, 24h observation at Royal Derby for biphasic reaction risk, immunology referral.",
      },
      {
        date: "2022-09-30",
        reason: "Cashew exposure — moderate allergic reaction",
        outcome: "A&E review, cetirizine, no AAI required, discharged same day.",
      },
    ],
    schoolHasPlan: true,
    schoolHasAai: true,
    childCanSelfAdminister: true,
    childWearsMedicalAlert: true,
    emergencyContacts: [
      { name: "Karen Holding", role: "Social Worker (Derby City)", phone: "01332 641 700" },
      { name: "Dr. S. Patel", role: "Registered GP", phone: "01332 500 100" },
      { name: "Royal Derby Paediatric Allergy Team", role: "Consultant Immunologist", phone: "01332 340 131" },
      { name: "On-call Manager", role: "Cornerstone — Oak House", phone: "07700 000001" },
    ],
    childVoice:
      "I know what to do if I feel my throat closing. I want staff to stay calm and not panic — that makes it worse. I trust Anna and Edward most. I want the boxing coach to know about my Jext but I don't want the whole class to be told.",
    staffObservation:
      "Alex is competent and confident with self-administration after BSACI-format teaching. Carries Jext in a labelled pouch at all times. Has shown good awareness around social pressure (e.g. shared snacks at school). Continues to need adult prompting to check restaurant menus and to read ingredient labels for snacks bought independently.",
    reviewDate: d(-30 + 365),
    keyWorker: "staff_edward",
  },
  {
    id: "alp_002",
    youngPerson: "yp_jordan",
    planDate: d(-60),
    allergens: [
      {
        allergen: "Penicillin",
        severity: "Moderate",
        lastReaction:
          "Age 6 — widespread urticarial rash 24h after starting amoxicillin for ear infection, settled with antihistamine. Recorded on GP allergy record. Not anaphylactic.",
      },
      {
        allergen: "Strawberries (suspected)",
        severity: "Mild",
        lastReaction:
          "Reports tingling lips after fresh strawberries on two occasions. Skin prick test negative, food challenge not yet completed — treated as suspected food sensitivity.",
      },
    ],
    antihistamine: {
      name: "Cetirizine",
      dose: "10mg",
      route: "Oral (PO) — once daily as needed",
    },
    aaiPrescribed: false,
    aaiLocations: [],
    aaiExpiryDates: [],
    staffTrainedNames: ["staff_anna", "staff_edward", "staff_chervelle"],
    emergencyProtocol: [
      "Avoid all penicillin-class antibiotics (amoxicillin, ampicillin, co-amoxiclav). Confirm with any prescriber and pharmacist before issuing any new antibiotic.",
      "If accidental exposure: monitor for rash, swelling or breathing difficulty. Give cetirizine 10mg PO if mild rash or itching.",
      "Call GP same day for any reaction. Call 999 if breathing affected, throat tightening, collapse, or rapidly spreading rash with feeling of unwellness.",
      "For suspected strawberry sensitivity: avoid fresh strawberries pending food challenge. Cooked/processed strawberry products tolerated to date — supervise first exposures.",
    ],
    hospitalAdmissions: [],
    schoolHasPlan: true,
    schoolHasAai: false,
    childCanSelfAdminister: false,
    childWearsMedicalAlert: false,
    emergencyContacts: [
      { name: "Michael Osei", role: "Social Worker (Notts)", phone: "0115 977 3100" },
      { name: "Dr. A. Khan", role: "Registered GP", phone: "01332 500 200" },
    ],
    childVoice:
      "I don't think strawberries are a big deal but the doctor said wait until they test me. I always tell new doctors no penicillin.",
    staffObservation:
      "Jordan is well aware of penicillin allergy and consistently informs healthcare staff. Allergy alert recorded on GP and dental records. Strawberry challenge to be booked once stable in placement (post 6-month placement anniversary).",
    reviewDate: d(-60 + 365),
    keyWorker: "staff_anna",
  },
  {
    id: "alp_003",
    youngPerson: "yp_casey",
    planDate: d(-14),
    allergens: [],
    aaiPrescribed: false,
    aaiLocations: [],
    aaiExpiryDates: [],
    staffTrainedNames: [],
    emergencyProtocol: [
      "No known allergies — placeholder plan held to confirm screening and review on admission and at every annual health assessment.",
      "If any new reaction is observed (rash, swelling, breathing change, gastrointestinal symptoms after exposure): document on body map, inform GP, do not give any antihistamine without GP advice unless previously authorised.",
    ],
    hospitalAdmissions: [],
    schoolHasPlan: false,
    schoolHasAai: false,
    childCanSelfAdminister: false,
    childWearsMedicalAlert: false,
    emergencyContacts: [
      { name: "Fiona Brennan", role: "Social Worker (Derbyshire)", phone: "01629 533 190" },
      { name: "Dr. L. Chen", role: "Registered GP", phone: "01332 500 300" },
    ],
    childVoice:
      "I don't think I'm allergic to anything but my last carer said maybe nuts? I'm not sure. I want to be tested properly so I know.",
    staffObservation:
      "Casey reports possible nut sensitivity from previous placement but no documented evidence on transferred records. Allergy testing referral submitted via GP — pending appointment. In the interim, nuts are not stored or served at home as a precaution.",
    reviewDate: d(-14 + 90),
    keyWorker: "staff_chervelle",
  },
];

// ── Page Component ────────────────────────────────────────────────────────────

export default function ChildAllergiesEpipenPlanPage() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("severity");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Stats ───────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const anaphylactic = SEED.filter((p) =>
      p.allergens.some((a) => a.severity === "Anaphylactic")
    ).length;

    const allAaiExpiries = SEED.flatMap((p) => p.aaiExpiryDates);
    const aaisInDate = allAaiExpiries.filter((e) => e.expiry >= in60).length;

    const staffTrainedSet = new Set(SEED.flatMap((p) => p.staffTrainedNames));
    const staffTrained = staffTrainedSet.size;

    const reviewsDue = SEED.filter((p) => p.reviewDate <= d(30)).length;

    return { anaphylactic, aaisInDate, staffTrained, reviewsDue };
  }, []);

  // ── Filtering & Sorting ─────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let list = [...SEED];

    if (severityFilter !== "all") {
      list = list.filter((p) =>
        p.allergens.some((a) => a.severity === severityFilter)
      );
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          getYPName(p.youngPerson).toLowerCase().includes(q) ||
          p.allergens.some((a) => a.allergen.toLowerCase().includes(q)) ||
          (p.antihistamine?.name.toLowerCase().includes(q) ?? false) ||
          (p.aaiBrand?.toLowerCase().includes(q) ?? false)
      );
    }

    const order: Severity[] = ["Mild", "Moderate", "Severe", "Anaphylactic"];
    list.sort((a, b) => {
      switch (sortBy) {
        case "severity": {
          const aMax = highestSeverity(a);
          const bMax = highestSeverity(b);
          return (
            (bMax ? order.indexOf(bMax) : -1) -
            (aMax ? order.indexOf(aMax) : -1)
          );
        }
        case "review_due":
          return a.reviewDate.localeCompare(b.reviewDate);
        case "young_person":
          return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
        default:
          return 0;
      }
    });

    return list;
  }, [search, severityFilter, sortBy]);

  // ── Export columns ──────────────────────────────────────────────────────────

  const exportColumns: ExportColumn<AllergyPlan>[] = [
    {
      header: "Young Person",
      accessor: (r: AllergyPlan) => getYPName(r.youngPerson),
    },
    { header: "Plan Date", accessor: (r: AllergyPlan) => r.planDate },
    {
      header: "Allergens",
      accessor: (r: AllergyPlan) =>
        r.allergens
          .map((a) => `${a.allergen} (${a.severity})`)
          .join("; "),
    },
    {
      header: "Antihistamine",
      accessor: (r: AllergyPlan) =>
        r.antihistamine
          ? `${r.antihistamine.name} ${r.antihistamine.dose} ${r.antihistamine.route}`
          : "None",
    },
    {
      header: "AAI Prescribed",
      accessor: (r: AllergyPlan) => (r.aaiPrescribed ? "Yes" : "No"),
    },
    { header: "AAI Brand", accessor: (r: AllergyPlan) => r.aaiBrand ?? "" },
    { header: "AAI Dose", accessor: (r: AllergyPlan) => r.aaiDose ?? "" },
    {
      header: "AAI Locations",
      accessor: (r: AllergyPlan) => r.aaiLocations.join("; "),
    },
    {
      header: "AAI Expiry Dates",
      accessor: (r: AllergyPlan) =>
        r.aaiExpiryDates.map((e) => `${e.location}: ${e.expiry}`).join("; "),
    },
    {
      header: "Staff Trained",
      accessor: (r: AllergyPlan) =>
        r.staffTrainedNames.map(getStaffName).join(", "),
    },
    {
      header: "Staff Training Expires",
      accessor: (r: AllergyPlan) => r.staffTrainingExpires ?? "",
    },
    {
      header: "Emergency Protocol",
      accessor: (r: AllergyPlan) =>
        r.emergencyProtocol.map((s, i) => `${i + 1}. ${s}`).join(" | "),
    },
    {
      header: "Hospital Admissions",
      accessor: (r: AllergyPlan) =>
        r.hospitalAdmissions
          .map((h) => `${h.date} — ${h.reason} → ${h.outcome}`)
          .join(" | "),
    },
    {
      header: "School Has Plan",
      accessor: (r: AllergyPlan) => (r.schoolHasPlan ? "Yes" : "No"),
    },
    {
      header: "School Has AAI",
      accessor: (r: AllergyPlan) => (r.schoolHasAai ? "Yes" : "No"),
    },
    {
      header: "Child Self-Administers",
      accessor: (r: AllergyPlan) => (r.childCanSelfAdminister ? "Yes" : "No"),
    },
    {
      header: "Wears Medical Alert",
      accessor: (r: AllergyPlan) => (r.childWearsMedicalAlert ? "Yes" : "No"),
    },
    {
      header: "Emergency Contacts",
      accessor: (r: AllergyPlan) =>
        r.emergencyContacts
          .map((c) => `${c.name} (${c.role}) ${c.phone}`)
          .join("; "),
    },
    { header: "Child Voice", accessor: (r: AllergyPlan) => r.childVoice },
    {
      header: "Staff Observation",
      accessor: (r: AllergyPlan) => r.staffObservation,
    },
    { header: "Review Date", accessor: (r: AllergyPlan) => r.reviewDate },
    {
      header: "Key Worker",
      accessor: (r: AllergyPlan) => getStaffName(r.keyWorker),
    },
  ];

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <PageShell
      title="Allergies & Anaphylaxis Plans"
      subtitle="Per-child BSACI allergy management — AAI/EpiPen protocol, training register and hospital plan"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Allergies & Anaphylaxis Plans" />
          <ExportButton<AllergyPlan>
            data={filtered}
            columns={exportColumns}
            filename="child-allergies-epipen-plans"
          />
        </div>
      }
    >
      {/* ── Summary Stats ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Anaphylaxis Plans",
            value: stats.anaphylactic,
            icon: ShieldAlert,
            colour: stats.anaphylactic > 0 ? "text-red-600" : "text-slate-500",
          },
          {
            label: "AAIs In-Date",
            value: stats.aaisInDate,
            icon: Syringe,
            colour: "text-emerald-600",
          },
          {
            label: "Staff AAI-Trained",
            value: stats.staffTrained,
            icon: ShieldAlert,
            colour: "text-blue-600",
          },
          {
            label: "Reviews Due (30d)",
            value: stats.reviewsDue,
            icon: AlertTriangle,
            colour: stats.reviewsDue > 0 ? "text-amber-600" : "text-slate-500",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg border bg-card p-3 flex items-center gap-3"
          >
            <s.icon className={cn("h-5 w-5", s.colour)} />
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Anaphylaxis Banner ─────────────────────────────────────────────── */}
      <div className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 p-4 flex items-start gap-3">
        <ShieldAlert className="h-6 w-6 text-red-600 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="font-bold text-red-900 uppercase tracking-wide text-sm">
            BSACI rule: if in doubt, give the AAI and call 999
          </p>
          <p className="mt-1 text-sm text-red-800">
            Adrenaline auto-injectors are safe. Hesitation kills, AAI does not.
            Administer into the outer mid-thigh, hold for 10 seconds, call 999
            stating &quot;anaphylaxis, AAI given&quot;. Repeat dose after 5
            minutes if no improvement. Always transport to hospital — biphasic
            reactions can occur up to 6 hours after the first.
          </p>
        </div>
      </div>

      {/* ── Filters & Sort ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search young person, allergen, AAI brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm"
          />
        </div>

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="Mild">Mild</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="Severe">Severe</SelectItem>
            <SelectItem value="Anaphylactic">Anaphylactic</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="severity">Severity (highest first)</SelectItem>
              <SelectItem value="review_due">Review Due</SelectItem>
              <SelectItem value="young_person">Young Person (A–Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Allergy Plan Cards ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No plans match your filters.
          </p>
        )}

        {filtered.map((plan) => {
          const expanded = expandedId === plan.id;
          const peakSeverity = highestSeverity(plan);
          const reviewOverdue = plan.reviewDate < today;

          // Worst expiry among AAI locations
          const expiries = plan.aaiExpiryDates.map((e) => e.expiry).sort();
          const worstExpiry = expiries[0];
          const worstExpiryStatus = worstExpiry
            ? expiryStatus(worstExpiry)
            : null;

          return (
            <div
              key={plan.id}
              className={cn(
                "rounded-lg border bg-card overflow-hidden",
                peakSeverity && SEVERITY_RING[peakSeverity]
              )}
            >
              {/* Card Header */}
              <button
                onClick={() => setExpandedId(expanded ? null : plan.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Syringe className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">
                        {getYPName(plan.youngPerson)}
                      </span>

                      {peakSeverity ? (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
                            SEVERITY_COLOURS[peakSeverity]
                          )}
                        >
                          {peakSeverity}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">
                          No known allergies
                        </span>
                      )}

                      {plan.aaiPrescribed && worstExpiryStatus && (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                            worstExpiryStatus.colour
                          )}
                        >
                          AAI {worstExpiryStatus.label.toLowerCase()}
                        </span>
                      )}

                      {plan.childCanSelfAdminister && (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700">
                          Self-administer competent
                        </span>
                      )}

                      {plan.childWearsMedicalAlert && (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-purple-50 text-purple-700">
                          Medical alert worn
                        </span>
                      )}

                      {reviewOverdue && (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Review overdue
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {plan.allergens.length > 0
                        ? plan.allergens.map((a) => a.allergen).join(", ")
                        : "No documented allergens — annual screening only"}
                      {plan.aaiPrescribed &&
                        ` — ${plan.aaiBrand} ${plan.aaiDose}`}
                    </p>
                  </div>
                </div>
                {expanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
              </button>

              {/* Expanded Content */}
              {expanded && (
                <div className="border-t px-4 py-4 space-y-5">
                  {/* Allergen list */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">
                      Known Allergens
                    </h4>
                    {plan.allergens.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No documented allergens. Screening recorded on plan
                        date {plan.planDate}.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {plan.allergens.map((a, i) => (
                          <li
                            key={i}
                            className={cn(
                              "rounded-md border p-2.5 text-sm",
                              SEVERITY_COLOURS[a.severity]
                            )}
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="font-semibold">
                                {a.allergen}
                              </span>
                              <span className="text-xs font-medium uppercase tracking-wide">
                                {a.severity}
                              </span>
                            </div>
                            {a.lastReaction && (
                              <p className="mt-1 text-xs opacity-90">
                                <strong>Last reaction:</strong> {a.lastReaction}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Antihistamine */}
                  {plan.antihistamine && (
                    <div className="rounded-md border bg-muted/40 p-3">
                      <h4 className="text-sm font-semibold mb-1">
                        Antihistamine (first-line for mild reactions)
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        <strong>{plan.antihistamine.name}</strong> —{" "}
                        {plan.antihistamine.dose} —{" "}
                        {plan.antihistamine.route}
                      </p>
                    </div>
                  )}

                  {/* AAI block */}
                  {plan.aaiPrescribed ? (
                    <div className="rounded-md border-2 border-red-200 bg-red-50/60 p-3 space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-1 text-red-900">
                        <Syringe className="h-4 w-4" /> Adrenaline Auto-Injector
                        (AAI)
                      </h4>
                      <p className="text-sm text-red-900">
                        <strong>Brand:</strong> {plan.aaiBrand} —{" "}
                        <strong>Dose:</strong> {plan.aaiDose}
                      </p>

                      <div>
                        <h5 className="text-xs font-semibold uppercase tracking-wide text-red-900 mt-2 mb-1">
                          AAI Locations
                        </h5>
                        <ul className="list-disc list-inside text-sm text-red-900 space-y-0.5">
                          {plan.aaiLocations.map((loc, i) => (
                            <li key={i}>{loc}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-xs font-semibold uppercase tracking-wide text-red-900 mt-2 mb-1">
                          AAI Expiry Dates
                        </h5>
                        <ul className="space-y-1">
                          {plan.aaiExpiryDates.map((e, i) => {
                            const s = expiryStatus(e.expiry);
                            return (
                              <li
                                key={i}
                                className="flex items-center justify-between text-sm gap-2"
                              >
                                <span className="text-red-900">
                                  {e.location}
                                </span>
                                <span className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-red-900">
                                    {e.expiry}
                                  </span>
                                  <span
                                    className={cn(
                                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                                      s.colour
                                    )}
                                  >
                                    {s.label}
                                  </span>
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-md border bg-muted/40 p-3">
                      <h4 className="text-sm font-semibold mb-1">
                        Adrenaline Auto-Injector
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        No AAI prescribed for this child. Reactions managed with
                        antihistamine and avoidance. Reassess at any new
                        reaction or change in severity.
                      </p>
                    </div>
                  )}

                  {/* Staff trained */}
                  <div>
                    <h4 className="text-sm font-semibold mb-1">
                      Staff Trained to Administer
                    </h4>
                    {plan.staffTrainedNames.length > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        {plan.staffTrainedNames.map(getStaffName).join(", ")}
                        {plan.staffTrainingExpires && (
                          <>
                            {" "}— BSACI training valid until{" "}
                            <strong>{plan.staffTrainingExpires}</strong>
                          </>
                        )}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No AAI training required (no AAI prescribed).
                      </p>
                    )}
                  </div>

                  {/* Emergency Protocol */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">
                      Emergency Protocol — Step by Step
                    </h4>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 marker:font-semibold marker:text-foreground">
                      {plan.emergencyProtocol.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Hospital admissions */}
                  {plan.hospitalAdmissions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">
                        Hospital Admissions History
                      </h4>
                      <ul className="space-y-1.5">
                        {plan.hospitalAdmissions.map((h, i) => (
                          <li
                            key={i}
                            className="rounded-md border bg-muted/30 p-2 text-sm"
                          >
                            <p className="font-medium">
                              {h.date} — {h.reason}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {h.outcome}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* School & self-care row */}
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="rounded-md border bg-muted/40 p-3">
                      <h4 className="text-sm font-semibold mb-1">
                        School Provision
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-0.5">
                        <li>
                          School holds plan:{" "}
                          <strong>{plan.schoolHasPlan ? "Yes" : "No"}</strong>
                        </li>
                        <li>
                          School holds AAI:{" "}
                          <strong>{plan.schoolHasAai ? "Yes" : "No"}</strong>
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-md border bg-muted/40 p-3">
                      <h4 className="text-sm font-semibold mb-1">
                        Child&apos;s Self-Care
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-0.5">
                        <li>
                          Self-administer competent:{" "}
                          <strong>
                            {plan.childCanSelfAdminister ? "Yes" : "No"}
                          </strong>
                        </li>
                        <li>
                          Wears medical alert:{" "}
                          <strong>
                            {plan.childWearsMedicalAlert ? "Yes" : "No"}
                          </strong>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Emergency contacts */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
                      <Phone className="h-4 w-4" /> Emergency Contacts
                    </h4>
                    <ul className="space-y-1">
                      {plan.emergencyContacts.map((c, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between text-sm border-b last:border-b-0 py-1"
                        >
                          <span>
                            <strong>{c.name}</strong>{" "}
                            <span className="text-muted-foreground">
                              — {c.role}
                            </span>
                          </span>
                          <span className="font-mono text-xs">{c.phone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Child voice */}
                  <div className="rounded-md border-l-4 border-l-blue-400 bg-blue-50/60 p-3">
                    <h4 className="text-sm font-semibold mb-1 text-blue-900">
                      Child&apos;s Voice
                    </h4>
                    <p className="text-sm italic text-blue-900">
                      &ldquo;{plan.childVoice}&rdquo;
                    </p>
                  </div>

                  {/* Staff observation */}
                  <div>
                    <h4 className="text-sm font-semibold mb-1">
                      Staff Observation
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {plan.staffObservation}
                    </p>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span>
                      <strong>Plan Date:</strong> {plan.planDate}
                    </span>
                    <span
                      className={cn(
                        reviewOverdue && "text-red-700 font-semibold"
                      )}
                    >
                      <strong>Next Review:</strong> {plan.reviewDate}
                    </span>
                    <span>
                      <strong>Key Worker:</strong>{" "}
                      {getStaffName(plan.keyWorker)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Regulatory Note ────────────────────────────────────────────────── */}
      <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">Regulatory Context</p>
        <p>
          Per-child allergy and anaphylaxis plans use the British Society for
          Allergy &amp; Clinical Immunology (BSACI) Anaphylaxis Plan template,
          aligned with Resuscitation Council UK Guidelines (2021), MHRA Drug
          Safety Update advice on adrenaline auto-injectors, and guidance from
          Allergy UK and the Anaphylaxis Campaign. Plans support compliance
          with Quality Standard 8 (Care Planning) and Quality Standard 7
          (Health and Wellbeing) under The Children&apos;s Homes (England)
          Regulations 2015, and uphold the child&apos;s right to the highest
          attainable standard of health (UNCRC Article 24). Plans must be
          reviewed annually, after every reaction, on placement transition,
          and whenever an AAI is replaced.
        </p>
      </div>
    </PageShell>
  );
}
