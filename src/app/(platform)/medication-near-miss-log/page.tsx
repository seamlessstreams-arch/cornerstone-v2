"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — MEDICATION NEAR-MISS LOG
// Records situations where a medication error was prevented before reaching
// the young person. Critical learning tool — psychological safety and
// blame-free reporting are key indicators of safety culture maturity.
// Required by Quality Standard 7 (Health & Wellbeing) and CQC medication
// standards. Distinct from the Medication Errors register because near-misses
// must be celebrated as catches, not punished as failures.
// ══════════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Filter, ArrowUpDown, ChevronDown, ChevronUp,
  Shield, ShieldCheck, Heart, Eye, BookOpen, Users, Sparkles,
  CheckCircle2, AlertCircle, GraduationCap, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStaffName, getYPName } from "@/lib/seed-data";

// ── Types ─────────────────────────────────────────────────────────────────────

type NearMissType =
  | "Wrong medication selected"
  | "Wrong dose calculated"
  | "Wrong time"
  | "Missed dose almost given late"
  | "Allergy nearly missed"
  | "Expired medication caught"
  | "Witness procedure not followed"
  | "Recording error"
  | "Storage issue";

type RiskGrade = "Low" | "Medium" | "High" | "Critical";

interface NearMiss {
  id: string;
  date: string;
  time: string;
  youngPerson: string;
  reportedBy: string;
  nearMissType: NearMissType;
  whatNearlyHappened: string;
  howCaught: string;
  contributingFactors: string[];
  childInformed: boolean;
  childResponse: string;
  staffEmotionalImpact: string;
  debriefHeld: boolean;
  debriefDate: string;
  learningPoints: string[];
  systemicChanges: string[];
  trainingArising: string[];
  policyArising: string;
  riskGrade: RiskGrade;
  wouldEscalateIfRecurred: boolean;
  patternCheck: string;
  reportedToPharmacist: boolean;
  shareableAnonymously: boolean;
}

// ── Config ────────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<NearMissType, { color: string; bg: string; border: string }> = {
  "Wrong medication selected":     { color: "text-rose-700",    bg: "bg-rose-50",    border: "border-rose-200"    },
  "Wrong dose calculated":         { color: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-200"  },
  "Wrong time":                    { color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200"   },
  "Missed dose almost given late": { color: "text-yellow-700",  bg: "bg-yellow-50",  border: "border-yellow-200"  },
  "Allergy nearly missed":         { color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200"     },
  "Expired medication caught":     { color: "text-stone-700",   bg: "bg-stone-100",  border: "border-stone-200"   },
  "Witness procedure not followed":{ color: "text-indigo-700",  bg: "bg-indigo-50",  border: "border-indigo-200"  },
  "Recording error":               { color: "text-slate-700",   bg: "bg-slate-100",  border: "border-slate-200"   },
  "Storage issue":                 { color: "text-teal-700",    bg: "bg-teal-50",    border: "border-teal-200"    },
};

const RISK_CONFIG: Record<RiskGrade, { color: string; bg: string; border: string }> = {
  Low:      { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  Medium:   { color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200"   },
  High:     { color: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-200"  },
  Critical: { color: "text-rose-700",    bg: "bg-rose-50",    border: "border-rose-200"    },
};

// ── Date helper ───────────────────────────────────────────────────────────────

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

function formatDate(s: string): string {
  if (!s) return "—";
  return new Date(s + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

const SEED_NEAR_MISSES: NearMiss[] = [
  {
    id: "nm_001",
    date: d(-78),
    time: "21:05",
    youngPerson: "yp_alex",
    reportedBy: "staff_anna",
    nearMissType: "Wrong medication selected",
    whatNearlyHappened:
      "Reached for Casey's Fluoxetine blister pack instead of Alex's Melatonin during the evening medication round. Both packs had been left adjacent on the medication trolley by the previous shift. Tablet was in hand and pack was open when the second-check witness asked me to confirm the medication name aloud — and I realised it wasn't right.",
    howCaught:
      "Two-staff witness procedure. Witness asked the standard read-back question 'Confirm medication, dose, and recipient?' before administration. Reading the name aloud surfaced the mismatch immediately. No medication left the pack and none reached Alex.",
    contributingFactors: [
      "Two young people's medications staged on trolley simultaneously",
      "Visually similar blister-pack packaging",
      "End of long shift — fatigue at 21:00",
      "Brief interruption from another young person seconds before",
    ],
    childInformed: true,
    childResponse:
      "Alex was matter-of-fact about it. Said 'glad you spotted it' and asked if I was okay. Used the moment to talk together about why the witness check exists — Alex felt it made the home safer, not less safe.",
    staffEmotionalImpact:
      "Initially shaken — sat down for ten minutes after the round and the witness made me a tea. Talked it through with the witness and felt steadier by the end of shift. Manager checked in the next morning. No shame, just a focus on what we can change.",
    debriefHeld: true,
    debriefDate: d(-77),
    learningPoints: [
      "Read-back of medication name out loud is the single most reliable catch — it works",
      "Staging multiple residents' medications on one trolley creates avoidable risk",
      "Fatigue at the end of long shifts is a real factor and should be designed around, not blamed on",
    ],
    systemicChanges: [
      "Trolley protocol updated: only one young person's medications on the trolley at any time",
      "Coloured trolley dividers introduced to physically separate any cross-resident items",
      "Read-back of medication name + recipient now mandatory at every administration, not just CDs",
    ],
    trainingArising: [
      "Refresher on two-stage witness procedure delivered in next team meeting",
      "Fatigue-and-medication-safety briefing added to induction pack",
    ],
    policyArising:
      "MED-04 (Medication Administration) updated section 4.2 to require single-resident staging and mandatory read-back. Version 3.2 published, all staff signed.",
    riskGrade: "High",
    wouldEscalateIfRecurred: true,
    patternCheck:
      "No prior reports of wrong-pack selection in last 12 months. Single isolated event. Continued monitoring through weekly med-safety huddle.",
    reportedToPharmacist: true,
    shareableAnonymously: true,
  },
  {
    id: "nm_002",
    date: d(-54),
    time: "08:12",
    youngPerson: "yp_jordan",
    reportedBy: "staff_darren",
    nearMissType: "Allergy nearly missed",
    whatNearlyHappened:
      "GP issued a new prescription for Amoxicillin for a chest infection. Pharmacy delivered it and I was about to log it onto the MAR sheet when I cross-checked the allergy section of Jordan's care plan and saw 'Penicillin — confirmed reaction aged 6'. The original GP letter had not flagged the allergy and I had nearly accepted the prescription as routine.",
    howCaught:
      "Routine 'new prescription against care plan allergy field' check before MAR sheet entry. Caught at the point of receiving the medication, before any administration. GP rang back, prescribed Clarithromycin instead. Allergy bracelet on file was checked at the same time.",
    contributingFactors: [
      "GP letter did not flag the allergy",
      "Allergy was recorded only in care plan, not on the front of MAR sheet at the time",
      "Pressure to start antibiotics quickly because of unwell young person",
    ],
    childInformed: true,
    childResponse:
      "Jordan was appreciative — said she sometimes forgets to mention the allergy herself when she's unwell. Asked for a medical-alert keyring which we ordered the same week. Felt safer knowing the system caught it.",
    staffEmotionalImpact:
      "Relief, then concern about how close it had been. Talked it through with the manager and we agreed it was the system that nearly let us down, not me — but the system now does its job because we caught and changed it.",
    debriefHeld: true,
    debriefDate: d(-53),
    learningPoints: [
      "Allergy must be visible on the FRONT of every MAR sheet — not buried in care plan",
      "Every new prescription gets cross-checked against allergy field before MAR entry, no exceptions",
      "GP communications cannot be assumed to carry forward known allergies",
    ],
    systemicChanges: [
      "Allergy banner added to top of every MAR sheet in red — auto-populated from care plan",
      "New prescription receiving form now has compulsory 'allergy cross-check' tick box",
      "GP correspondence template updated to ask GPs to repeat allergy info on every new script",
    ],
    trainingArising: [
      "All staff briefed at next team meeting on the new MAR allergy banner and the receiving check",
    ],
    policyArising:
      "MED-02 (Receiving Prescriptions) updated to make allergy cross-check a recorded step. Version 2.4.",
    riskGrade: "Critical",
    wouldEscalateIfRecurred: true,
    patternCheck:
      "Reviewed all three young people's allergy fields across MAR / care plan / health passport — two minor inconsistencies found and corrected. Quarterly allergy reconciliation now scheduled.",
    reportedToPharmacist: true,
    shareableAnonymously: true,
  },
  {
    id: "nm_003",
    date: d(-41),
    time: "07:50",
    youngPerson: "yp_jordan",
    reportedBy: "staff_chervelle",
    nearMissType: "Missed dose almost given late",
    whatNearlyHappened:
      "Jordan's morning Concerta XL had not been administered at the usual 07:30 by the night staff during handover gap. By 07:50 I noticed the unsigned MAR row and was about to give it before realising that GP guidance for Concerta XL is 'do not give after 08:00 due to sleep impact'. Came within minutes of administering at a clinically inappropriate time.",
    howCaught:
      "Cross-checked the MAR sheet against the GP-approved administration window (printed on the MAR for Concerta specifically because of the sleep risk). Realised giving it now would breach the window. Phoned GP for advice, who confirmed: omit and resume tomorrow with extra support today.",
    contributingFactors: [
      "Handover gap — night staff did not flag pending dose",
      "No morning medication prompt on day-shift checklist at the time",
      "Time-pressure of school morning routine",
    ],
    childInformed: true,
    childResponse:
      "Jordan understood. We agreed extra support strategies for school that day and texted the teacher to give them context. Jordan said it was 'good that we told the truth' rather than just giving it late.",
    staffEmotionalImpact:
      "Felt frustrated at the handover gap but reassured by being able to speak to GP and choose the safe option. Importantly did not feel pressure to give it late just to avoid 'looking bad' — that culture mattered.",
    debriefHeld: true,
    debriefDate: d(-40),
    learningPoints: [
      "Time-window medications need explicit cut-off times printed on the MAR",
      "Handover must include any pending or upcoming doses, not just completed ones",
      "Doing the right thing late > doing the wrong thing on time",
    ],
    systemicChanges: [
      "Handover template updated: 'pending medications in next 4 hours' is now a required field",
      "Time-window cut-offs now printed in red on every relevant MAR row",
      "Digital reminder set on shift planner 30 minutes before each time-sensitive dose",
    ],
    trainingArising: [
      "Handover discipline added to next supervision cycle for all staff",
    ],
    policyArising:
      "MED-04 sec 6 (Time-window medications) clarified — 'after window has passed: omit, document, inform GP, never administer late without GP authorisation'.",
    riskGrade: "Medium",
    wouldEscalateIfRecurred: true,
    patternCheck:
      "Second handover-gap event in 6 months (first was a documentation-only issue). Triggers a thematic review — see Medication Errors me_002. Pattern noted.",
    reportedToPharmacist: false,
    shareableAnonymously: true,
  },
  {
    id: "nm_004",
    date: d(-29),
    time: "15:20",
    youngPerson: "yp_casey",
    reportedBy: "staff_edward",
    nearMissType: "Expired medication caught",
    whatNearlyHappened:
      "Routine PRN check before a planned trip out. Picked up Casey's Piriton from the PRN bag for the day-out kit and checked the expiry — had passed 11 days earlier. Bottle had not been pulled from rotation during the previous monthly stock audit. Could have been administered if the day had triggered a PRN need.",
    howCaught:
      "Pre-outing PRN check (added to the home's standard outing protocol). Expiry date is one of the four points on the check. Caught before leaving the building. Replacement obtained from pharmacy that afternoon.",
    contributingFactors: [
      "Previous monthly stock audit missed this item",
      "PRN bag stored separately to main medication cabinet — slightly outside the main audit flow",
      "Bottle had been opened over six months ago and 'opened-on' date sticker was faded",
    ],
    childInformed: true,
    childResponse:
      "Casey thought it was 'kind of funny' that we found it in time — but understood why it mattered. Used the moment to talk about how every safety check has a reason behind it.",
    staffEmotionalImpact:
      "Quietly satisfying to be the one who caught it. Reminded me why we do the boring checks. Reported with no anxiety because the culture here is that finding things is good news.",
    debriefHeld: true,
    debriefDate: d(-28),
    learningPoints: [
      "PRN bag and offsite kits need including in the main monthly stock audit, not handled separately",
      "'Opened-on' date stickers fade — durable labels needed",
      "Pre-outing checks are a real safety net, not a tick-box",
    ],
    systemicChanges: [
      "Monthly stock audit expanded: PRN bag, day-out kits, and emergency medications are all included",
      "Switched to laminated tamper-evident date labels for opened bottles",
      "Stock-audit checklist now has a dedicated 'PRN bag' section",
    ],
    trainingArising: [
      "Stock-audit refresher delivered to the two staff on the audit rota",
    ],
    policyArising:
      "MED-05 (Stock Control) sec 3 — scope clarified to include PRN bag, day-out kits, and any decanted stock.",
    riskGrade: "Low",
    wouldEscalateIfRecurred: false,
    patternCheck:
      "First expired-medication near-miss in 18 months. No pattern. New audit scope should prevent recurrence.",
    reportedToPharmacist: true,
    shareableAnonymously: true,
  },
  {
    id: "nm_005",
    date: d(-15),
    time: "20:40",
    youngPerson: "yp_alex",
    reportedBy: "staff_ryan",
    nearMissType: "Witness procedure not followed",
    whatNearlyHappened:
      "Was about to administer Alex's evening Melatonin solo because the second staff member had stepped out to support Casey. Realised mid-pour that I was breaking the home's two-person witness rule for evening medications. Stopped, recapped, locked the bottle, and waited the four minutes for the witness to return.",
    howCaught:
      "Self-catch. Caught it myself before any medication was decanted into the measure. Recognised the deviation in real time and chose to pause rather than rationalise it.",
    contributingFactors: [
      "Competing demand — Casey needed support at the same window",
      "Pressure to keep Alex's bedtime routine on time",
      "Single-staff window when one of the team had to step away briefly",
    ],
    childInformed: true,
    childResponse:
      "Alex was completely fine waiting four minutes. Said 'I'd rather wait than have something go wrong'. We talked about why witnesses exist — Alex felt looked after, not inconvenienced.",
    staffEmotionalImpact:
      "Proud of the self-catch. Reported it without hesitation because the team treats self-catches as wins. The reflection afterwards was useful — would I have caught it if I'd been more rushed?",
    debriefHeld: true,
    debriefDate: d(-14),
    learningPoints: [
      "Self-catches are valuable data — they tell us what nearly happened, not what did",
      "Time pressure on bedtime routines is a recurring contributing factor — worth designing for",
      "Witness-availability needs planning into the rota, not improvised",
    ],
    systemicChanges: [
      "Evening medication rota now identifies the named witness for each shift",
      "Bedtime routine plans include a 5-minute buffer either side of medication times",
      "If witness becomes unavailable mid-round, medication pauses — non-negotiable, formalised in policy",
    ],
    trainingArising: [
      "Team huddle topic: 'why we never run medications without a witness, even by 60 seconds'",
    ],
    policyArising:
      "MED-04 sec 5.1 strengthened — 'no solo administration of evening or controlled medications under any time pressure'.",
    riskGrade: "Medium",
    wouldEscalateIfRecurred: true,
    patternCheck:
      "Reviewed evening-shift staffing patterns over last 8 weeks. Three brief single-staff windows identified, all under 5 minutes. Rota adjustment proposed and trialled.",
    reportedToPharmacist: false,
    shareableAnonymously: true,
  },
  {
    id: "nm_006",
    date: d(-4),
    time: "09:15",
    youngPerson: "yp_casey",
    reportedBy: "staff_mirela",
    nearMissType: "Wrong dose calculated",
    whatNearlyHappened:
      "Casey's Sertraline was being increased from 50mg to 75mg per GP letter. Our supply was 50mg tablets only. Calculated 1.5 tablets and was about to halve a tablet when I checked the BNF and remembered Sertraline tablets are scored for halving but the GP letter had specified 'use 25mg tablets' which we did not have in stock yet. Pharmacy delivery was due that afternoon. Almost gave 1.5 tablets in error.",
    howCaught:
      "Cross-checked GP letter against in-hand stock before administration. Caught the wording 'use 25mg tablets' which I had skim-read first time. Phoned GP, confirmed: omit this morning's dose, give 50mg this evening, restart 75mg with 25mg tablets tomorrow morning once delivery arrives.",
    contributingFactors: [
      "Skim-reading of GP letter on a busy morning",
      "Stock of new strength not yet delivered when dose change was due",
      "No automatic prompt linking 'dose change' to 'do we have the right strength?' until now",
    ],
    childInformed: true,
    childResponse:
      "Casey was glad to be told. Asked sensible questions about what would have happened with the wrong dose. Used the moment to do a bit of medication-literacy work together — Casey now knows what a 'scored tablet' means.",
    staffEmotionalImpact:
      "Heart sank for a second when I realised, but the structure of the check means I caught it. Talked to manager same day. No blame, lots of curiosity about how to improve the process.",
    debriefHeld: true,
    debriefDate: d(-3),
    learningPoints: [
      "Dose changes need a dedicated checklist — they are higher-risk than steady-state administration",
      "GP letter wording must be read in full, not skimmed — annotate as you go",
      "Stock readiness should be confirmed before the first dose at the new strength",
    ],
    systemicChanges: [
      "New 'Dose Change' checklist introduced — read GP letter twice, confirm correct strength in stock, note start-date, flag witness",
      "Dose changes trigger an alert on the digital MAR until first administration is signed",
      "Pharmacy delivery confirmation required before scheduling first dose at new strength",
    ],
    trainingArising: [
      "Dose-change scenarios added to the medication competency assessment",
      "BNF familiarisation session for newer staff",
    ],
    policyArising:
      "MED-06 (Dose Changes) — new standalone procedure created. Version 1.0 published.",
    riskGrade: "High",
    wouldEscalateIfRecurred: true,
    patternCheck:
      "First dose-change near-miss recorded. Triggered creation of dedicated dose-change procedure. Will monitor over next 6 months.",
    reportedToPharmacist: true,
    shareableAnonymously: true,
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

const TYPE_OPTIONS: ("all" | NearMissType)[] = [
  "all",
  "Wrong medication selected",
  "Wrong dose calculated",
  "Wrong time",
  "Missed dose almost given late",
  "Allergy nearly missed",
  "Expired medication caught",
  "Witness procedure not followed",
  "Recording error",
  "Storage issue",
];

const RISK_OPTIONS: ("all" | RiskGrade)[] = ["all", "Low", "Medium", "High", "Critical"];

export default function MedicationNearMissLogPage() {
  const [records] = useState<NearMiss[]>(SEED_NEAR_MISSES);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | NearMissType>("all");
  const [riskFilter, setRiskFilter] = useState<"all" | RiskGrade>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "risk">("newest");

  // ── Filtered + sorted ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...records];

    if (typeFilter !== "all") list = list.filter((r) => r.nearMissType === typeFilter);
    if (riskFilter !== "all") list = list.filter((r) => r.riskGrade === riskFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.whatNearlyHappened.toLowerCase().includes(q) ||
          r.howCaught.toLowerCase().includes(q) ||
          r.nearMissType.toLowerCase().includes(q) ||
          getYPName(r.youngPerson).toLowerCase().includes(q) ||
          getStaffName(r.reportedBy).toLowerCase().includes(q),
      );
    }

    const RISK_ORDER: Record<RiskGrade, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    switch (sortBy) {
      case "newest":
        list.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case "oldest":
        list.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case "risk":
        list.sort((a, b) => RISK_ORDER[a.riskGrade] - RISK_ORDER[b.riskGrade]);
        break;
    }
    return list;
  }, [records, typeFilter, riskFilter, search, sortBy]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const ninetyDaysAgo = d(-90);
    const thisQuarter = records.filter((r) => r.date >= ninetyDaysAgo).length;

    const typeCounts = records.reduce<Record<string, number>>((acc, r) => {
      acc[r.nearMissType] = (acc[r.nearMissType] || 0) + 1;
      return acc;
    }, {});
    const mostCommon = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

    const learningEmbedded = records.filter(
      (r) => r.debriefHeld && r.systemicChanges.length > 0,
    ).length;

    return {
      thisQuarter,
      mostCommonType: mostCommon ? mostCommon[0] : "—",
      mostCommonCount: mostCommon ? mostCommon[1] : 0,
      learningEmbedded,
      total: records.length,
      becameErrors: 0,
    };
  }, [records]);

  // ── Export columns ────────────────────────────────────────────────────────
  const exportColumns = useMemo<ExportColumn<NearMiss>[]>(() => [
    { header: "Date",                  accessor: (r: NearMiss) => r.date },
    { header: "Time",                  accessor: (r: NearMiss) => r.time },
    { header: "Young Person",          accessor: (r: NearMiss) => getYPName(r.youngPerson) },
    { header: "Reported By",           accessor: (r: NearMiss) => getStaffName(r.reportedBy) },
    { header: "Type",                  accessor: (r: NearMiss) => r.nearMissType },
    { header: "Risk Grade",            accessor: (r: NearMiss) => r.riskGrade },
    { header: "What Nearly Happened",  accessor: (r: NearMiss) => r.whatNearlyHappened },
    { header: "How Caught",            accessor: (r: NearMiss) => r.howCaught },
    { header: "Contributing Factors",  accessor: (r: NearMiss) => r.contributingFactors.join("; ") },
    { header: "Child Informed",        accessor: (r: NearMiss) => (r.childInformed ? "Yes" : "No") },
    { header: "Debrief Held",          accessor: (r: NearMiss) => (r.debriefHeld ? `Yes (${r.debriefDate})` : "No") },
    { header: "Learning Points",       accessor: (r: NearMiss) => r.learningPoints.join("; ") },
    { header: "Systemic Changes",      accessor: (r: NearMiss) => r.systemicChanges.join("; ") },
    { header: "Training Arising",      accessor: (r: NearMiss) => r.trainingArising.join("; ") },
    { header: "Policy Arising",        accessor: (r: NearMiss) => r.policyArising },
    { header: "Pattern Check",         accessor: (r: NearMiss) => r.patternCheck },
    { header: "Pharmacist Notified",   accessor: (r: NearMiss) => (r.reportedToPharmacist ? "Yes" : "No") },
    { header: "Shareable Anonymously", accessor: (r: NearMiss) => (r.shareableAnonymously ? "Yes" : "No") },
  ], []);

  const hasFilters = search || typeFilter !== "all" || riskFilter !== "all";

  return (
    <PageShell
      title="Medication Near-Miss Log"
      subtitle="Quality Standard 7 — blame-free reporting of medication catches"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Medication Near-Miss Log" />
          <ExportButton<NearMiss>
            data={filtered}
            columns={exportColumns}
            filename="medication-near-miss-log"
          />
        </div>
      }
    >
      {/* ── Summary Strip ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <Card className="border-slate-200">
          <CardContent className="p-3">
            <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <Eye className="h-3 w-3" />
              Near misses (quarter)
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-0.5">{stats.thisQuarter}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{stats.total} total on record</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-3">
            <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Most common type
            </div>
            <div className="text-sm font-semibold text-slate-900 mt-1 leading-tight">{stats.mostCommonType}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{stats.mostCommonCount} occurrence{stats.mostCommonCount !== 1 ? "s" : ""}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-3">
            <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              Learning embedded
            </div>
            <div className="text-2xl font-bold text-violet-600 mt-0.5">
              {stats.learningEmbedded}<span className="text-sm text-slate-400 font-normal">/{stats.total}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">debrief + systemic change</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardContent className="p-3">
            <div className="text-[10px] font-medium text-emerald-700 uppercase tracking-wide flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Became errors
            </div>
            <div className="text-2xl font-bold text-emerald-600 mt-0.5">{stats.becameErrors}</div>
            <div className="text-[10px] text-emerald-700/80 mt-0.5">zero reached the child</div>
          </CardContent>
        </Card>
      </div>

      {/* ── Blame-free banner ───────────────────────────────────────────── */}
      <div className="mb-5 rounded-lg border border-violet-200 bg-gradient-to-r from-violet-50 to-blue-50 p-4 flex items-start gap-3">
        <div className="rounded-lg bg-violet-100 p-2 flex-shrink-0">
          <Heart className="h-5 w-5 text-violet-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-violet-900">Psychological safety — blame-free reporting</h3>
            <Badge className="text-[9px] px-1.5 py-0 bg-violet-100 text-violet-700 border border-violet-200">
              <Sparkles className="h-2.5 w-2.5 mr-0.5" />
              Mature culture
            </Badge>
          </div>
          <p className="text-xs text-violet-900/90 leading-relaxed">
            A near-miss is not a failure — it is a system working. Every record below is a moment a colleague chose to surface
            a catch rather than hide it, so the home gets safer for the young people who live here. Reporting near-misses is a
            recognised marker of safety-culture maturity. Staff who report are thanked, not blamed. We learn loudly so we never
            have to apologise quietly.
          </p>
          <p className="text-[11px] text-violet-700/80 leading-relaxed mt-1.5">
            <strong>If in doubt, report it.</strong> The cost of a logged near-miss is a debrief and a learning point. The
            cost of an unreported one is the next child harmed by the same gap.
          </p>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search near-misses..."
            className="h-8 pl-8 text-xs"
          />
        </div>

        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as "all" | NearMissType)}>
          <SelectTrigger className="h-8 text-xs w-[210px]">
            <Filter className="h-3 w-3 mr-1 text-slate-400" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((t) => (
              <SelectItem key={t} value={t}>{t === "all" ? "All Types" : t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={riskFilter} onValueChange={(v) => setRiskFilter(v as "all" | RiskGrade)}>
          <SelectTrigger className="h-8 text-xs w-[140px]">
            <SelectValue placeholder="Risk" />
          </SelectTrigger>
          <SelectContent>
            {RISK_OPTIONS.map((r) => (
              <SelectItem key={r} value={r}>{r === "all" ? "All Risk Grades" : r}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="h-8 text-xs w-[150px]">
            <ArrowUpDown className="h-3 w-3 mr-1 text-slate-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="risk">By risk grade</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <button
            type="button"
            onClick={() => { setSearch(""); setTypeFilter("all"); setRiskFilter("all"); }}
            className="text-[11px] text-slate-400 hover:text-slate-600 underline-offset-2 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="text-[11px] text-slate-400 mb-3">
        Showing {filtered.length} of {records.length} record{records.length !== 1 ? "s" : ""}
      </p>

      {/* ── Card list ───────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-slate-400">
            No near-misses match the current filters.
          </div>
        )}

        {filtered.map((r) => {
          const isExpanded = expandedId === r.id;
          const tCfg = TYPE_CONFIG[r.nearMissType];
          const rCfg = RISK_CONFIG[r.riskGrade];

          return (
            <div
              key={r.id}
              className={cn(
                "rounded-lg border bg-white transition-all",
                r.riskGrade === "Critical" && "ring-1 ring-rose-200 border-rose-200",
                r.riskGrade === "High" && "border-orange-200",
              )}
            >
              {/* Card header (clickable) */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : r.id)}
                className="w-full flex items-start gap-3 p-4 text-left"
              >
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 flex-shrink-0">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-medium text-slate-500">{formatDate(r.date)}</span>
                    <span className="text-[10px] text-slate-400">{r.time}</span>
                    <span className="text-xs font-semibold text-slate-900">— {r.nearMissType}</span>
                    <span className="text-[11px] text-slate-500">({getYPName(r.youngPerson)})</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge className={cn("text-[10px] px-2 py-0 border", tCfg.bg, tCfg.color, tCfg.border)}>
                      {r.nearMissType}
                    </Badge>
                    <Badge className={cn("text-[10px] px-2 py-0 border", rCfg.bg, rCfg.color, rCfg.border)}>
                      Risk: {r.riskGrade}
                    </Badge>
                    {r.debriefHeld && (
                      <Badge className="text-[10px] px-2 py-0 bg-violet-50 text-violet-700 border border-violet-200">
                        <BookOpen className="h-2.5 w-2.5 mr-0.5" />
                        Debriefed
                      </Badge>
                    )}
                    {r.systemicChanges.length > 0 && (
                      <Badge className="text-[10px] px-2 py-0 bg-blue-50 text-blue-700 border border-blue-200">
                        Systemic change
                      </Badge>
                    )}
                    {r.shareableAnonymously && (
                      <Badge className="text-[10px] px-2 py-0 bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Users className="h-2.5 w-2.5 mr-0.5" />
                        Shareable
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    Reported by {getStaffName(r.reportedBy)}
                  </span>
                  {isExpanded
                    ? <ChevronUp className="h-4 w-4 text-slate-400" />
                    : <ChevronDown className="h-4 w-4 text-slate-400" />
                  }
                </div>
              </button>

              {/* Expanded body */}
              {isExpanded && (
                <div className="border-t px-4 pb-4 pt-3 space-y-4">
                  {/* What nearly happened — amber */}
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <h4 className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      What nearly happened
                    </h4>
                    <p className="text-xs text-amber-900 leading-relaxed">{r.whatNearlyHappened}</p>
                  </div>

                  {/* How caught — emerald */}
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                    <h4 className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      How it was caught
                    </h4>
                    <p className="text-xs text-emerald-900 leading-relaxed">{r.howCaught}</p>
                  </div>

                  {/* Contributing factors */}
                  {r.contributingFactors.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Contributing factors</h4>
                      <div className="flex flex-wrap gap-1">
                        {r.contributingFactors.map((f, i) => (
                          <Badge key={i} className="text-[10px] px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200">
                            {f}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Child + staff impact — two columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                      <h4 className="text-[11px] font-semibold text-blue-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        Young person — {getYPName(r.youngPerson)}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-blue-700/80 mb-1">
                        {r.childInformed ? (
                          <><CheckCircle2 className="h-3 w-3 text-emerald-600" /> Informed at the time</>
                        ) : (
                          <><AlertCircle className="h-3 w-3 text-amber-600" /> Not informed</>
                        )}
                      </div>
                      <p className="text-xs text-blue-900 leading-relaxed">{r.childResponse}</p>
                    </div>
                    <div className="rounded-lg bg-violet-50 border border-violet-200 p-3">
                      <h4 className="text-[11px] font-semibold text-violet-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Staff emotional impact
                      </h4>
                      <p className="text-xs text-violet-900 leading-relaxed">{r.staffEmotionalImpact}</p>
                    </div>
                  </div>

                  {/* Debrief */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    <div className="flex-1 text-xs text-slate-700">
                      {r.debriefHeld ? (
                        <span><strong>Debrief held</strong> on {formatDate(r.debriefDate)} — outcomes captured below.</span>
                      ) : (
                        <span className="text-amber-700"><strong>Debrief outstanding</strong> — schedule before next shift cycle.</span>
                      )}
                    </div>
                  </div>

                  {/* Learning points */}
                  {r.learningPoints.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        Learning points
                      </h4>
                      <ul className="space-y-1">
                        {r.learningPoints.map((l, i) => (
                          <li key={i} className="text-xs text-slate-700 leading-relaxed flex gap-2">
                            <span className="text-violet-500 flex-shrink-0">•</span>
                            <span>{l}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Systemic changes */}
                  {r.systemicChanges.length > 0 && (
                    <div className="rounded-lg bg-blue-50/60 border border-blue-200 p-3">
                      <h4 className="text-[11px] font-semibold text-blue-700 uppercase tracking-wide mb-1.5">Systemic changes implemented</h4>
                      <ul className="space-y-1">
                        {r.systemicChanges.map((s, i) => (
                          <li key={i} className="text-xs text-blue-900 leading-relaxed flex gap-2">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Training + policy — two columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {r.trainingArising.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          Training arising
                        </h4>
                        <ul className="space-y-1">
                          {r.trainingArising.map((t, i) => (
                            <li key={i} className="text-xs text-slate-700 leading-relaxed flex gap-2">
                              <span className="text-slate-400 flex-shrink-0">•</span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {r.policyArising && (
                      <div>
                        <h4 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          Policy arising
                        </h4>
                        <p className="text-xs text-slate-700 leading-relaxed">{r.policyArising}</p>
                      </div>
                    )}
                  </div>

                  {/* Pattern check + escalation flags */}
                  <div className="rounded-lg border border-slate-200 p-3">
                    <h4 className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Pattern check &amp; escalation</h4>
                    <p className="text-xs text-slate-700 leading-relaxed mb-2">{r.patternCheck}</p>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      <Badge className={cn(
                        "text-[10px] px-2 py-0 border",
                        r.wouldEscalateIfRecurred
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-slate-50 text-slate-600 border-slate-200",
                      )}>
                        {r.wouldEscalateIfRecurred ? "Would escalate if recurred" : "No escalation trigger"}
                      </Badge>
                      <Badge className={cn(
                        "text-[10px] px-2 py-0 border",
                        r.reportedToPharmacist
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : "bg-slate-50 text-slate-600 border-slate-200",
                      )}>
                        {r.reportedToPharmacist ? "Pharmacist notified" : "Pharmacist not notified"}
                      </Badge>
                      <Badge className={cn(
                        "text-[10px] px-2 py-0 border",
                        r.shareableAnonymously
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-600 border-slate-200",
                      )}>
                        {r.shareableAnonymously ? "Shareable for sector learning" : "Internal only"}
                      </Badge>
                    </div>
                  </div>

                  {/* Footer meta */}
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>Reported {formatDate(r.date)} {r.time} by {getStaffName(r.reportedBy)}</span>
                    {r.debriefHeld && <span>Debrief: {formatDate(r.debriefDate)}</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Regulatory note ─────────────────────────────────────────────── */}
      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-[10px] text-slate-500 leading-relaxed">
          <strong>Regulatory context:</strong> This log supports compliance with{" "}
          <strong>Quality Standard 7 — Health and Wellbeing</strong> of the Children&apos;s Homes (England) Regulations
          2015 and aligns with <strong>CQC medication safety standards</strong> and <strong>NICE NG5</strong> on
          medicines optimisation. A high near-miss reporting rate alongside zero or low actual-error rates is recognised
          by Ofsted and CQC as evidence of a mature, learning-focused safety culture — not a sign of poor practice.
          Records inform the medication errors register, supervision, training plans, and policy development. Anonymised
          learning is shared with the placing authorities&apos; safeguarding networks where appropriate.
        </p>
      </div>
    </PageShell>
  );
}
