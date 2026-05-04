"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — IMMUNISATION RECORD
// Tracks each child's immunisations against the UK schedule. Captures vaccine
// history, batch numbers, brand, side effects, historic gaps before placement,
// catch-ups during placement, upcoming doses, and the child's voice & consent.
// Required by Quality Standard 7 (Health and Wellbeing) and supports the
// Annual Health Assessment / Initial Health Assessment process.
// ══════════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { PrintButton } from "@/components/ui/print-button";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getYPName, getStaffName } from "@/lib/seed-data";
import {
  ArrowUpDown, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp,
  Syringe, Shield, Calendar, BookOpen, Stethoscope, ClipboardList,
  MessageSquare, FileText, ShieldAlert, ShieldCheck, Activity,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type VaccineStatus =
  | "Up to date"
  | "Due now"
  | "Overdue"
  | "Caught up after gap"
  | "Refused"
  | "Medically exempt";

interface VaccineEntry {
  vaccine: string;
  ageDue: string;
  dateGiven: string;
  batchNumber: string;
  location: string;
  brand: string;
  sideEffects: string;
  sideEffectsObserved: boolean;
  status: VaccineStatus;
}

interface UpcomingDose {
  vaccine: string;
  dueDate: string;
  scheduled: boolean;
}

interface ImmunisationRecord {
  id: string;
  youngPerson: string;
  gpRegistration: string;
  redBookHeld: boolean;
  records: VaccineEntry[];
  missedAtAge: string[];
  caughtUpDuringPlacement: string[];
  upcomingDueWithin90Days: UpcomingDose[];
  childAttitude: string;
  childInformedAndConsent: boolean;
  gpReviewedSchedule: boolean;
  reviewDate: string;
  lastUpdate: string;
}

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_COLOUR: Record<VaccineStatus, string> = {
  "Up to date":          "bg-green-100 text-green-700",
  "Due now":             "bg-amber-100 text-amber-700",
  "Overdue":             "bg-red-100 text-red-700",
  "Caught up after gap": "bg-blue-100 text-blue-700",
  "Refused":             "bg-orange-100 text-orange-700",
  "Medically exempt":    "bg-purple-100 text-purple-700",
};

// ── Date helper ───────────────────────────────────────────────────────────────

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

// ── Seed Data ─────────────────────────────────────────────────────────────────

const SEED: ImmunisationRecord[] = [
  {
    id: "imm_001",
    youngPerson: "yp_alex",
    gpRegistration: "Eastbrook Medical Practice — registered since admission (Dr M. Patel)",
    redBookHeld: true,
    records: [
      { vaccine: "DTaP/IPV/Hib/Hep B (1st)", ageDue: "8 weeks",   dateGiven: "2010-11-04", batchNumber: "AH3492",  location: "Left thigh",      brand: "Infanrix Hexa",  sideEffects: "Mild fever overnight, settled with paracetamol per Red Book entry",     sideEffectsObserved: true,  status: "Up to date" },
      { vaccine: "MenB (1st)",                ageDue: "8 weeks",   dateGiven: "2010-11-04", batchNumber: "BX1207",  location: "Right thigh",     brand: "Bexsero",        sideEffects: "Local swelling at site, resolved within 48h",                            sideEffectsObserved: true,  status: "Up to date" },
      { vaccine: "Rotavirus (oral, 1st)",     ageDue: "8 weeks",   dateGiven: "2010-11-04", batchNumber: "RV9981",  location: "Oral",            brand: "Rotarix",        sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "DTaP/IPV/Hib/Hep B (2nd)",  ageDue: "12 weeks",  dateGiven: "2010-12-09", batchNumber: "AH3611",  location: "Left thigh",      brand: "Infanrix Hexa",  sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "Pneumococcal (PCV, 1st)",   ageDue: "12 weeks",  dateGiven: "2010-12-09", batchNumber: "PV2210",  location: "Right thigh",     brand: "Prevenar 13",    sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "Rotavirus (oral, 2nd)",     ageDue: "12 weeks",  dateGiven: "2010-12-09", batchNumber: "RV0044",  location: "Oral",            brand: "Rotarix",        sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "DTaP/IPV/Hib/Hep B (3rd)",  ageDue: "16 weeks",  dateGiven: "2011-01-13", batchNumber: "AH3870",  location: "Left thigh",      brand: "Infanrix Hexa",  sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "MenB (2nd)",                ageDue: "16 weeks",  dateGiven: "2011-01-13", batchNumber: "BX1455",  location: "Right thigh",     brand: "Bexsero",        sideEffects: "Mild fever, paracetamol given",                                          sideEffectsObserved: true,  status: "Up to date" },
      { vaccine: "Hib/MenC booster",          ageDue: "1 year",    dateGiven: "2011-09-21", batchNumber: "HM5512",  location: "Left arm",        brand: "Menitorix",      sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "MMR (1st)",                 ageDue: "1 year",    dateGiven: "2011-09-21", batchNumber: "MM8870",  location: "Right arm",       brand: "MMR VaxPro",     sideEffects: "Mild rash day 7, no medical attention required",                         sideEffectsObserved: true,  status: "Up to date" },
      { vaccine: "MenB booster",              ageDue: "1 year",    dateGiven: "2011-09-21", batchNumber: "BX2199",  location: "Left thigh",      brand: "Bexsero",        sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "Pneumococcal booster",      ageDue: "1 year",    dateGiven: "2011-09-21", batchNumber: "PV3041",  location: "Right thigh",     brand: "Prevenar 13",    sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "DTaP/IPV pre-school",       ageDue: "3y 4m",     dateGiven: "2014-01-30", batchNumber: "DT7720",  location: "Left arm",        brand: "Repevax",        sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "MMR (2nd)",                 ageDue: "3y 4m",     dateGiven: "2014-01-30", batchNumber: "MM9912",  location: "Right arm",       brand: "MMR VaxPro",     sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "HPV (1st dose)",            ageDue: "12-13 yrs", dateGiven: "2023-10-12", batchNumber: "HP4421",  location: "Left arm",        brand: "Gardasil 9",     sideEffects: "Sore arm 24h",                                                           sideEffectsObserved: true,  status: "Up to date" },
      { vaccine: "HPV (2nd dose)",            ageDue: "12-13 yrs", dateGiven: "",           batchNumber: "",        location: "",                brand: "",               sideEffects: "",                                                                       sideEffectsObserved: false, status: "Due now" },
      { vaccine: "Annual flu (2025/26)",      ageDue: "Annual",    dateGiven: d(-30),       batchNumber: "FL2526A", location: "Nasal",           brand: "Fluenz Tetra",   sideEffects: "Mild runny nose for 24h",                                                sideEffectsObserved: true,  status: "Up to date" },
    ],
    missedAtAge: [],
    caughtUpDuringPlacement: [],
    upcomingDueWithin90Days: [
      { vaccine: "HPV (2nd dose)", dueDate: d(28), scheduled: true },
    ],
    childAttitude: "Alex is comfortable with vaccinations. Prefers a brief explanation of what is happening and asks for the nurse to count down. Confident with needles. Happy to attend the GP surgery alone with a staff member rather than as part of a school session for the HPV catch-up.",
    childInformedAndConsent: true,
    gpReviewedSchedule: true,
    reviewDate: d(-21),
    lastUpdate: d(-3),
  },
  {
    id: "imm_002",
    youngPerson: "yp_jordan",
    gpRegistration: "Eastbrook Medical Practice — registered on admission (Dr M. Patel). Practice familiar with Jordan's ASD needs.",
    redBookHeld: false,
    records: [
      { vaccine: "DTaP/IPV/Hib/Hep B (1st)", ageDue: "8 weeks",   dateGiven: "2012-09-14", batchNumber: "Historic — pre-placement (records obtained from previous GP)", location: "Not recorded",   brand: "Not recorded",   sideEffects: "No record",                                                              sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "MenB (1st)",                ageDue: "8 weeks",   dateGiven: "",           batchNumber: "Not given — historic gap",                                       location: "",                brand: "",               sideEffects: "",                                                                       sideEffectsObserved: false, status: "Caught up after gap" },
      { vaccine: "Rotavirus (oral, 1st)",     ageDue: "8 weeks",   dateGiven: "",           batchNumber: "Out of age window — cannot be given after 24 weeks",            location: "",                brand: "",               sideEffects: "",                                                                       sideEffectsObserved: false, status: "Medically exempt" },
      { vaccine: "DTaP/IPV/Hib/Hep B (2nd)",  ageDue: "12 weeks",  dateGiven: "2012-10-19", batchNumber: "Historic — pre-placement",                                       location: "Not recorded",   brand: "Not recorded",   sideEffects: "No record",                                                              sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "Pneumococcal (PCV, 1st)",   ageDue: "12 weeks",  dateGiven: "2012-10-19", batchNumber: "Historic — pre-placement",                                       location: "Not recorded",   brand: "Not recorded",   sideEffects: "No record",                                                              sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "DTaP/IPV/Hib/Hep B (3rd)",  ageDue: "16 weeks",  dateGiven: "",           batchNumber: "Missed — caught up at age 11 (see catch-up note)",              location: "",                brand: "",               sideEffects: "",                                                                       sideEffectsObserved: false, status: "Caught up after gap" },
      { vaccine: "Hib/MenC booster",          ageDue: "1 year",    dateGiven: "",           batchNumber: "Missed — caught up at age 11 (see catch-up note)",              location: "",                brand: "",               sideEffects: "",                                                                       sideEffectsObserved: false, status: "Caught up after gap" },
      { vaccine: "MMR (1st)",                 ageDue: "1 year",    dateGiven: "",           batchNumber: "Missed — caught up at age 11 (see catch-up note)",              location: "",                brand: "",               sideEffects: "",                                                                       sideEffectsObserved: false, status: "Caught up after gap" },
      { vaccine: "Pneumococcal booster",      ageDue: "1 year",    dateGiven: "2013-09-22", batchNumber: "Historic — pre-placement",                                       location: "Not recorded",   brand: "Not recorded",   sideEffects: "No record",                                                              sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "DTaP/IPV pre-school",       ageDue: "3y 4m",     dateGiven: "",           batchNumber: "Missed — caught up at age 11 (combined catch-up programme)",    location: "",                brand: "",               sideEffects: "",                                                                       sideEffectsObserved: false, status: "Caught up after gap" },
      { vaccine: "MMR (2nd)",                 ageDue: "3y 4m",     dateGiven: "",           batchNumber: "Missed — caught up at age 11 (combined catch-up programme)",    location: "",                brand: "",               sideEffects: "",                                                                       sideEffectsObserved: false, status: "Caught up after gap" },
      { vaccine: "Catch-up: dTaP/IPV (Td/IPV equiv.)", ageDue: "Catch-up at 11", dateGiven: "2023-04-19", batchNumber: "TI8801", location: "Left arm", brand: "Revaxis", sideEffects: "Localised redness 24h. Jordan distressed during procedure — desensitisation work followed (see attached social story).", sideEffectsObserved: true, status: "Caught up after gap" },
      { vaccine: "Catch-up: MMR (1st of 2)",  ageDue: "Catch-up at 11", dateGiven: "2023-04-19", batchNumber: "MM2001",  location: "Right arm",       brand: "MMR VaxPro",     sideEffects: "Mild fever evening of vaccination, settled with paracetamol",            sideEffectsObserved: true,  status: "Caught up after gap" },
      { vaccine: "Catch-up: MMR (2nd of 2)",  ageDue: "Catch-up at 11", dateGiven: "2023-05-31", batchNumber: "MM2244",  location: "Right arm",       brand: "MMR VaxPro",     sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Caught up after gap" },
      { vaccine: "Catch-up: MenACWY",         ageDue: "Catch-up",  dateGiven: "2023-06-21", batchNumber: "MA7720",  location: "Left arm",        brand: "Nimenrix",       sideEffects: "Sore arm 24h",                                                           sideEffectsObserved: true,  status: "Caught up after gap" },
      { vaccine: "Catch-up: MenB (course)",   ageDue: "Catch-up",  dateGiven: "2023-07-14", batchNumber: "BX5512",  location: "Right arm",       brand: "Bexsero",        sideEffects: "Mild fever, settled overnight",                                          sideEffectsObserved: true,  status: "Caught up after gap" },
      { vaccine: "Annual flu (2025/26)",      ageDue: "Annual",    dateGiven: d(-42),       batchNumber: "FL2526B", location: "Nasal",           brand: "Fluenz Tetra",   sideEffects: "Brief sensory distress during administration, no physical reaction",     sideEffectsObserved: true,  status: "Up to date" },
    ],
    missedAtAge: [
      "16 weeks — DTaP/IPV/Hib/Hep B (3rd dose) missed (family disengaged with primary care)",
      "1 year — Hib/MenC booster, MMR (1st), MenB booster missed",
      "3 years 4 months — DTaP/IPV pre-school booster and MMR (2nd) missed",
      "Adolescent MenACWY missed at scheduled school session",
    ],
    caughtUpDuringPlacement: [
      "April 2023 — Catch-up programme commenced 6 weeks after admission, agreed with GP and CAMHS",
      "April 2023 — Combined Revaxis (dTaP/IPV) and MMR 1st dose given following desensitisation work",
      "May 2023 — MMR 2nd dose given (6 weeks after 1st)",
      "June 2023 — MenACWY catch-up dose",
      "July 2023 — MenB catch-up course completed",
      "Pre-vaccination preparation included social stories, hospital play, and a familiar staff member attending each appointment",
    ],
    upcomingDueWithin90Days: [],
    childAttitude: "Jordan finds vaccinations highly distressing due to sensory sensitivities (needle, alcohol wipe smell, bright clinic lighting) and dislikes the unpredictability of the procedure. A bespoke approach has been developed: appointments booked at the start of the day to reduce waiting, dimmer lighting where possible, ear defenders permitted, weighted lap pad, and consistent attending staff member (Anna). Jordan uses a Now-and-Next visual to prepare. Calm and praise after, followed by a regulating activity at home.",
    childInformedAndConsent: true,
    gpReviewedSchedule: true,
    reviewDate: d(-35),
    lastUpdate: d(-7),
  },
  {
    id: "imm_003",
    youngPerson: "yp_casey",
    gpRegistration: "Eastbrook Medical Practice — registered on admission (Dr M. Patel)",
    redBookHeld: true,
    records: [
      { vaccine: "DTaP/IPV/Hib/Hep B (1st)", ageDue: "8 weeks",   dateGiven: "2009-08-11", batchNumber: "AH1102",  location: "Left thigh",      brand: "Infanrix Hexa",  sideEffects: "Mild fever, paracetamol given as advised",                               sideEffectsObserved: true,  status: "Up to date" },
      { vaccine: "Pneumococcal (PCV, 1st)",   ageDue: "12 weeks",  dateGiven: "2009-09-15", batchNumber: "PV0908",  location: "Right thigh",     brand: "Prevenar",       sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "DTaP/IPV/Hib/Hep B (2nd)",  ageDue: "12 weeks",  dateGiven: "2009-09-15", batchNumber: "AH1290",  location: "Left thigh",      brand: "Infanrix Hexa",  sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "DTaP/IPV/Hib/Hep B (3rd)",  ageDue: "16 weeks",  dateGiven: "2009-10-20", batchNumber: "AH1402",  location: "Left thigh",      brand: "Infanrix Hexa",  sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "Hib/MenC booster",          ageDue: "1 year",    dateGiven: "2010-06-22", batchNumber: "HM3320",  location: "Left arm",        brand: "Menitorix",      sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "MMR (1st)",                 ageDue: "1 year",    dateGiven: "2010-06-22", batchNumber: "MM6611",  location: "Right arm",       brand: "Priorix",        sideEffects: "Mild rash day 8, no treatment required",                                 sideEffectsObserved: true,  status: "Up to date" },
      { vaccine: "Pneumococcal booster",      ageDue: "1 year",    dateGiven: "2010-06-22", batchNumber: "PV4490",  location: "Right thigh",     brand: "Prevenar",       sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "DTaP/IPV pre-school",       ageDue: "3y 4m",     dateGiven: "2012-10-30", batchNumber: "DT5512",  location: "Left arm",        brand: "Repevax",        sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "MMR (2nd)",                 ageDue: "3y 4m",     dateGiven: "2012-10-30", batchNumber: "MM7702",  location: "Right arm",       brand: "Priorix",        sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "HPV (1st dose)",            ageDue: "12-13 yrs", dateGiven: "2022-09-28", batchNumber: "HP3309",  location: "Left arm",        brand: "Gardasil 9",     sideEffects: "Faintness post-vaccination, recovered within 15 minutes",                sideEffectsObserved: true,  status: "Up to date" },
      { vaccine: "HPV (2nd dose)",            ageDue: "12-13 yrs", dateGiven: "2023-04-19", batchNumber: "HP4012",  location: "Left arm",        brand: "Gardasil 9",     sideEffects: "Sore arm 24h",                                                           sideEffectsObserved: true,  status: "Up to date" },
      { vaccine: "3-in-1 teenage booster (Td/IPV)", ageDue: "14 yrs", dateGiven: "2024-03-14", batchNumber: "TB2240",  location: "Left arm",        brand: "Revaxis",        sideEffects: "None recorded",                                                          sideEffectsObserved: false, status: "Up to date" },
      { vaccine: "MenACWY",                   ageDue: "14 yrs",    dateGiven: "2024-03-14", batchNumber: "MA9020",  location: "Right arm",       brand: "Nimenrix",       sideEffects: "Mild headache evening of vaccination",                                   sideEffectsObserved: true,  status: "Up to date" },
      { vaccine: "Annual flu (2025/26)",      ageDue: "Annual",    dateGiven: d(-21),       batchNumber: "FL2526C", location: "Right arm (intramuscular — Casey prefers injection over nasal)", brand: "Quadrivalent flu", sideEffects: "Sore arm 24h",                                                           sideEffectsObserved: true,  status: "Up to date" },
    ],
    missedAtAge: [],
    caughtUpDuringPlacement: [],
    upcomingDueWithin90Days: [],
    childAttitude: "Casey approaches vaccinations cautiously and is sensory-aware. Prefers full information in advance — what the vaccine is for, what side effects are possible, where it will be given. Brings their own headphones to appointments to manage clinic noise. Asks for a moment of quiet before the injection and prefers to look away. Past episode of post-vaccination faintness is now managed proactively (Casey eats beforehand, lies down for HPV). Casey's autonomy and informed choice are central — staff support without pressure.",
    childInformedAndConsent: true,
    gpReviewedSchedule: true,
    reviewDate: d(-14),
    lastUpdate: d(-2),
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function ImmunisationRecordPage() {
  const [records] = useState<ImmunisationRecord[]>(SEED);
  const [ypFilter, setYpFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* ── filtering & sorting ──────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = [...records];
    if (ypFilter !== "all") list = list.filter(r => r.youngPerson === ypFilter);
    if (statusFilter !== "all") {
      list = list.filter(r => r.records.some(v => v.status === statusFilter));
    }
    list.sort((a, b) => {
      switch (sortBy) {
        case "name":     return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
        case "review":   return b.reviewDate.localeCompare(a.reviewDate);
        case "updated":  return b.lastUpdate.localeCompare(a.lastUpdate);
        case "due": {
          const ad = a.upcomingDueWithin90Days[0]?.dueDate ?? "9999-12-31";
          const bd = b.upcomingDueWithin90Days[0]?.dueDate ?? "9999-12-31";
          return ad.localeCompare(bd);
        }
        default: return 0;
      }
    });
    return list;
  }, [records, ypFilter, statusFilter, sortBy]);

  /* ── stats ────────────────────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const upToDate = records.filter(r =>
      r.records.every(v =>
        v.status === "Up to date" ||
        v.status === "Caught up after gap" ||
        v.status === "Medically exempt" ||
        v.status === "Refused"
      )
    ).length;

    const dueWithin90 = records.reduce((acc, r) => acc + r.upcomingDueWithin90Days.length, 0);

    const refusalsHandled = records.filter(r =>
      r.records.some(v => v.status === "Refused") && r.childInformedAndConsent
    ).length;

    const totalDoses = records.reduce((acc, r) => acc + r.records.length, 0);
    const completedDoses = records.reduce(
      (acc, r) => acc + r.records.filter(v =>
        v.status === "Up to date" ||
        v.status === "Caught up after gap" ||
        v.status === "Medically exempt"
      ).length,
      0,
    );
    const compliance = totalDoses === 0 ? 0 : Math.round((completedDoses / totalDoses) * 100);

    return { upToDate, dueWithin90, refusalsHandled, compliance };
  }, [records]);

  /* ── overdue alert ────────────────────────────────────────────────────── */
  const overdueChildren = useMemo(
    () => records.filter(r => r.records.some(v => v.status === "Overdue")),
    [records]
  );

  /* ── export ───────────────────────────────────────────────────────────── */
  const exportCols: ExportColumn<ImmunisationRecord>[] = [
    { header: "ID",                          accessor: (r: ImmunisationRecord) => r.id },
    { header: "Young Person",                accessor: (r: ImmunisationRecord) => getYPName(r.youngPerson) },
    { header: "GP Registration",             accessor: (r: ImmunisationRecord) => r.gpRegistration },
    { header: "Red Book Held",               accessor: (r: ImmunisationRecord) => r.redBookHeld ? "Yes" : "No" },
    { header: "Vaccines (vaccine | ageDue | dateGiven | batch | brand | status)",
                                              accessor: (r: ImmunisationRecord) => r.records.map(v => `${v.vaccine} | ${v.ageDue} | ${v.dateGiven || "—"} | ${v.batchNumber || "—"} | ${v.brand || "—"} | ${v.status}`).join("  ||  ") },
    { header: "Side Effects Observed",       accessor: (r: ImmunisationRecord) => r.records.filter(v => v.sideEffectsObserved).map(v => `${v.vaccine}: ${v.sideEffects}`).join(" | ") },
    { header: "Missed At Age (historic)",    accessor: (r: ImmunisationRecord) => r.missedAtAge.join(" | ") },
    { header: "Caught Up During Placement",  accessor: (r: ImmunisationRecord) => r.caughtUpDuringPlacement.join(" | ") },
    { header: "Upcoming (90 days)",          accessor: (r: ImmunisationRecord) => r.upcomingDueWithin90Days.map(u => `${u.vaccine} due ${u.dueDate} (${u.scheduled ? "scheduled" : "to schedule"})`).join(" | ") },
    { header: "Child Attitude",              accessor: (r: ImmunisationRecord) => r.childAttitude },
    { header: "Child Informed & Consent",    accessor: (r: ImmunisationRecord) => r.childInformedAndConsent ? "Yes" : "No" },
    { header: "GP Reviewed Schedule",        accessor: (r: ImmunisationRecord) => r.gpReviewedSchedule ? "Yes" : "No" },
    { header: "Review Date",                 accessor: (r: ImmunisationRecord) => r.reviewDate },
    { header: "Last Update",                 accessor: (r: ImmunisationRecord) => r.lastUpdate },
  ];

  return (
    <PageShell
      title="Immunisation Record"
      subtitle="UK schedule tracking · Vaccine history · Side effects · Catch-up programmes · Child voice"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Immunisation Record" />
          <ExportButton data={filtered} columns={exportCols} filename="immunisation-record" />
        </div>
      }
    >
      {/* ── Summary Stats ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Children up to date",              value: `${stats.upToDate}/${records.length}`, icon: ShieldCheck, c: "text-green-600"  },
          { label: "Doses due within 90 days",         value: stats.dueWithin90,                     icon: Calendar,    c: "text-amber-600"  },
          { label: "Children with refusals (handled)", value: stats.refusalsHandled,                 icon: ShieldAlert, c: "text-orange-600" },
          { label: "Schedule compliance",              value: `${stats.compliance}%`,                icon: Activity,    c: "text-blue-600"   },
        ].map(s => (
          <div key={s.label} className="rounded-lg border bg-card p-3 flex items-center gap-3">
            <s.icon className={cn("h-5 w-5", s.c)} />
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Alerts ─────────────────────────────────────────────────────────── */}
      {overdueChildren.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 p-3 mb-3 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm text-red-800 dark:text-red-300">
            <p className="font-semibold">
              {overdueChildren.length} child{overdueChildren.length !== 1 ? "ren have" : " has"} overdue immunisations
            </p>
            <p className="text-xs mt-0.5">
              Liaise with GP and Looked-After Children health team to arrange catch-up appointments.
            </p>
          </div>
        </div>
      )}

      {stats.dueWithin90 > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 p-3 mb-6 flex items-start gap-3">
          <Calendar className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-300">
            <p className="font-semibold">
              {stats.dueWithin90} dose{stats.dueWithin90 !== 1 ? "s" : ""} due within the next 90 days
            </p>
            <p className="text-xs mt-0.5">
              Confirm appointments are booked. Update placement diary and inform key worker.
            </p>
          </div>
        </div>
      )}

      {/* ── Filters & Sort ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Select value={ypFilter} onValueChange={setYpFilter}>
          <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Young person" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All young people</SelectItem>
            <SelectItem value="yp_alex">{getYPName("yp_alex")}</SelectItem>
            <SelectItem value="yp_jordan">{getYPName("yp_jordan")}</SelectItem>
            <SelectItem value="yp_casey">{getYPName("yp_casey")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px] h-9"><SelectValue placeholder="Vaccine status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {Object.keys(STATUS_COLOUR).map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 ml-auto">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Child name (A-Z)</SelectItem>
              <SelectItem value="review">Most recently reviewed</SelectItem>
              <SelectItem value="updated">Most recently updated</SelectItem>
              <SelectItem value="due">Earliest dose due</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        {(ypFilter !== "all" || statusFilter !== "all") && " (filtered)"}
      </p>

      {/* ── Cards ──────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Syringe className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="font-medium">No immunisation records match the current filters</p>
          </div>
        )}

        {filtered.map(r => {
          const isOpen = expandedId === r.id;
          const hasOverdue = r.records.some(v => v.status === "Overdue");
          const hasRefusal = r.records.some(v => v.status === "Refused");
          const hasCatchup = r.caughtUpDuringPlacement.length > 0 || r.records.some(v => v.status === "Caught up after gap");
          const upcomingCount = r.upcomingDueWithin90Days.length;
          const totalDoses = r.records.length;
          const completed = r.records.filter(v =>
            v.status === "Up to date" ||
            v.status === "Caught up after gap" ||
            v.status === "Medically exempt"
          ).length;

          return (
            <div
              key={r.id}
              className={cn(
                "rounded-lg border bg-card overflow-hidden",
                hasOverdue ? "border-l-4 border-l-red-400"
                  : hasCatchup ? "border-l-4 border-l-blue-400"
                  : "border-l-4 border-l-green-400",
              )}
            >
              <button
                onClick={() => setExpandedId(isOpen ? null : r.id)}
                className="w-full flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="rounded-full p-1.5 shrink-0 bg-blue-100 text-blue-700">
                  <Syringe className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{getYPName(r.youngPerson)}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-foreground/80">
                      {completed}/{totalDoses} doses logged
                    </span>
                    {hasOverdue && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">
                        <AlertTriangle className="h-3 w-3" /> Overdue
                      </span>
                    )}
                    {hasCatchup && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                        <Stethoscope className="h-3 w-3" /> Catch-up programme
                      </span>
                    )}
                    {hasRefusal && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700">
                        <ShieldAlert className="h-3 w-3" /> Refusal logged
                      </span>
                    )}
                    {upcomingCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
                        <Calendar className="h-3 w-3" /> {upcomingCount} due ≤90d
                      </span>
                    )}
                    {r.redBookHeld && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">
                        <BookOpen className="h-3 w-3" /> Red Book held
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {r.gpRegistration} · GP review {r.reviewDate} · Updated {r.lastUpdate}
                  </p>
                </div>

                {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 mt-1" /> : <ChevronDown className="h-4 w-4 shrink-0 mt-1" />}
              </button>

              {isOpen && (
                <div className="border-t px-4 py-3 space-y-4 bg-muted/30">
                  {/* Meta */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">GP registration</p>
                      <p className="font-medium">{r.gpRegistration}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Red Book held</p>
                      <p className="font-medium">{r.redBookHeld ? "Yes" : "No — copy of record obtained from GP"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">GP-reviewed schedule</p>
                      <p className="font-medium">{r.gpReviewedSchedule ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last GP review</p>
                      <p className="font-medium">{r.reviewDate}</p>
                    </div>
                  </div>

                  {/* Vaccine table */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                      <Syringe className="h-3.5 w-3.5" /> UK schedule — vaccine history
                    </p>
                    <div className="rounded border bg-card overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-muted/50 text-left">
                          <tr>
                            <th className="px-2 py-1.5 font-medium">Vaccine</th>
                            <th className="px-2 py-1.5 font-medium">Age due</th>
                            <th className="px-2 py-1.5 font-medium">Date given</th>
                            <th className="px-2 py-1.5 font-medium">Brand</th>
                            <th className="px-2 py-1.5 font-medium">Batch</th>
                            <th className="px-2 py-1.5 font-medium">Site</th>
                            <th className="px-2 py-1.5 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {r.records.map((v, i) => (
                            <tr key={i} className="border-t align-top">
                              <td className="px-2 py-1.5 font-medium">{v.vaccine}</td>
                              <td className="px-2 py-1.5 text-muted-foreground">{v.ageDue}</td>
                              <td className="px-2 py-1.5">{v.dateGiven || "—"}</td>
                              <td className="px-2 py-1.5">{v.brand || "—"}</td>
                              <td className="px-2 py-1.5">{v.batchNumber || "—"}</td>
                              <td className="px-2 py-1.5">{v.location || "—"}</td>
                              <td className="px-2 py-1.5">
                                <span className={cn("px-2 py-0.5 rounded-full text-[11px]", STATUS_COLOUR[v.status])}>
                                  {v.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Side effects */}
                  {r.records.some(v => v.sideEffectsObserved) && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Side effects observed</p>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        {r.records.filter(v => v.sideEffectsObserved).map((v, i) => (
                          <li key={i}>
                            <span className="font-medium">{v.vaccine}</span> — {v.sideEffects}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Historic gaps */}
                  {r.missedAtAge.length > 0 && (
                    <div className="rounded border border-amber-200 bg-amber-50/50 p-3">
                      <p className="text-xs font-semibold text-amber-800 uppercase mb-1 flex items-center gap-1">
                        <ClipboardList className="h-3.5 w-3.5" /> Historic gaps (pre-placement)
                      </p>
                      <ul className="text-sm space-y-1 list-disc pl-5 text-amber-900">
                        {r.missedAtAge.map((m, i) => <li key={i}>{m}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Catch-up */}
                  {r.caughtUpDuringPlacement.length > 0 && (
                    <div className="rounded border border-blue-200 bg-blue-50/50 p-3">
                      <p className="text-xs font-semibold text-blue-800 uppercase mb-1 flex items-center gap-1">
                        <Stethoscope className="h-3.5 w-3.5" /> Caught up during placement
                      </p>
                      <ul className="text-sm space-y-1 list-disc pl-5 text-blue-900">
                        {r.caughtUpDuringPlacement.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Upcoming */}
                  {r.upcomingDueWithin90Days.length > 0 && (
                    <div className="rounded border bg-card p-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Upcoming doses (next 90 days)
                      </p>
                      <ul className="text-sm space-y-1.5">
                        {r.upcomingDueWithin90Days.map((u, i) => (
                          <li key={i} className="flex items-center justify-between gap-2 rounded border bg-muted/30 px-2 py-1.5">
                            <span><span className="font-medium">{u.vaccine}</span> — due {u.dueDate}</span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-xs",
                              u.scheduled ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700",
                            )}>
                              {u.scheduled ? "Appointment booked" : "Needs booking"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Child voice & consent */}
                  <div className="rounded border bg-card p-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" /> Child's voice and consent
                    </p>
                    <p className="text-sm">{r.childAttitude}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="flex items-center gap-1">
                        {r.childInformedAndConsent
                          ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                          : <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />}
                        Informed and giving consent: <span className="font-medium">{r.childInformedAndConsent ? "Yes" : "No"}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        {r.gpReviewedSchedule
                          ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                          : <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />}
                        GP-reviewed schedule: <span className="font-medium">{r.gpReviewedSchedule ? "Yes" : "No"}</span>
                      </span>
                    </div>
                  </div>

                  {/* Footer meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" /> Reviewed by {getStaffName("staff_darren")} with GP on {r.reviewDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Updated {r.lastUpdate} by {getStaffName("staff_anna")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Regulatory Note ────────────────────────────────────────────────── */}
      <div className="mt-8 rounded-lg border border-dashed p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">Quality Standard 7 — Health and wellbeing</p>
            <p>
              Under the <strong>Children's Homes (England) Regulations 2015</strong>, the home must
              promote and protect each child's health. The registered person must ensure that each
              child is registered with a GP and that the child's health needs — including immunisation
              against vaccine-preventable disease in line with the <strong>UK routine immunisation schedule</strong> —
              are met. Looked-after children frequently arrive with incomplete vaccination histories;
              homes are expected to obtain previous records, identify gaps, agree a catch-up plan with
              the GP and the Looked-After Children health team, and prepare the child sensitively for
              any procedures.
            </p>
            <p>
              The child's wishes and feelings must be respected. A child with sufficient understanding
              (Gillick competence) may consent to or refuse vaccinations; refusals must be discussed,
              recorded, and reviewed without coercion. Vaccine batch numbers, brand, site of
              administration and any side effects must be retained on the child's file. Records are
              shared at the Initial Health Assessment, Annual Health Assessment, statutory review,
              and on placement transition.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
