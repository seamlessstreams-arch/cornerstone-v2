// ══════════════════════════════════════════════════════════════════════════════
// CARA — Competence & training demo seeds
//
// Seeds four previously-empty store collections so the
// home-staff-competency-training-intelligence endpoint shows a realistic
// "good" picture rather than all-zero rates.
//
// Target metrics (approximate):
//   staff_assessed_rate       88%   score mod +2
//   competent_or_above_rate   82%   score mod +3
//   training_compliance_rate  71%   score mod +2
//   cpd_engagement_rate       75%   score mod +3
//   handbook_acknowledgement  80%   score mod +2
//   Total score ≈ 64 → "good" rating (60–74)
// ══════════════════════════════════════════════════════════════════════════════

import type {
  StaffCompetencyRecord,
  TrainingMatrixRow,
  CPDRecord,
  StaffHandbookAcknowledgementRecord,
} from "@/types/extended";

const NOW = new Date().toISOString();
const today = NOW.slice(0, 10);

function daysAgo(n: number): string {
  const d = new Date(Date.now() - n * 864e5);
  return d.toISOString().slice(0, 10);
}
function daysAhead(n: number): string {
  const d = new Date(Date.now() + n * 864e5);
  return d.toISOString().slice(0, 10);
}

// ── Staff IDs & roles (from seed-data.ts) ──────────────────────────────────
const STAFF = [
  { id: "staff_darren",    name: "Olivia Hayes",   role: "registered_manager" },
  { id: "staff_ryan",      name: "Marcus Bell",    role: "deputy_manager" },
  { id: "staff_edward",    name: "Daniel Frost",   role: "residential_care_worker" },
  { id: "staff_lackson",   name: "Samuel Boateng", role: "residential_care_worker" },
  { id: "staff_anna",      name: "Priya Sharma",   role: "residential_care_worker" },
  { id: "staff_diane",     name: "Maria Okafor",   role: "residential_care_worker" },
  { id: "staff_chervelle", name: "Naomi Reid",     role: "residential_care_worker" },
];

// ── 1. Staff competency records ─────────────────────────────────────────────
// Each active care worker has entries in 5 core competency areas.
// Maria Okafor (newest) has 2 "developing" entries to add realism.

const COMPETENCY_AREAS = [
  "safeguarding",
  "medication_administration",
  "physical_intervention",
  "trauma_informed_care",
  "risk_assessment",
];

export function seedStaffCompetencyRecords(): StaffCompetencyRecord[] {
  const records: StaffCompetencyRecord[] = [];

  const levelMap: Record<string, ("competent" | "developing" | "not_assessed")[]> = {
    staff_darren:    ["competent", "competent", "competent", "competent", "competent"],
    staff_ryan:      ["competent", "competent", "competent", "competent", "competent"],
    staff_edward:    ["competent", "developing", "competent", "competent", "competent"],
    staff_lackson:   ["competent", "competent", "not_assessed", "competent", "competent"],
    staff_anna:      ["competent", "competent", "competent", "competent", "developing"],
    staff_diane:     ["competent", "developing", "not_assessed", "developing", "not_assessed"],
    staff_chervelle: ["competent", "competent", "competent", "competent", "competent"],
  };

  STAFF.forEach((s, si) => {
    const levels = levelMap[s.id] ?? ["competent", "competent", "competent", "competent", "competent"];
    records.push({
      id: `scr_${s.id}`,
      staff_id: s.id,
      staff_name: s.name,
      role: s.role,
      entries: COMPETENCY_AREAS.map((area, i) => ({
        id: `sce_${s.id}_${i}`,
        area,
        level: levels[i],
        assessed_date: levels[i] === "not_assessed" ? null : daysAgo(30 + si * 7 + i * 3),
        assessed_by: "staff_darren",
        expiry_date: levels[i] === "competent" ? daysAhead(365) : null,
        notes: "",
      })),
    });
  });

  return records;
}

// ── 2. Training matrix rows ─────────────────────────────────────────────────
// 8 mandatory courses per staff. 5 fully compliant, 2 action_required.

export function seedTrainingMatrixRows(): TrainingMatrixRow[] {
  const config: Record<string, {
    valid: number; expiring: number; expired: number;
    compliance: "fully_compliant" | "action_required" | "non_compliant";
    nextDue: string;
  }> = {
    staff_darren:    { valid: 8, expiring: 0, expired: 0, compliance: "fully_compliant",  nextDue: daysAhead(120) },
    staff_ryan:      { valid: 7, expiring: 1, expired: 0, compliance: "fully_compliant",  nextDue: daysAhead(45) },
    staff_edward:    { valid: 6, expiring: 1, expired: 1, compliance: "action_required",  nextDue: daysAhead(14) },
    staff_lackson:   { valid: 8, expiring: 0, expired: 0, compliance: "fully_compliant",  nextDue: daysAhead(90) },
    staff_anna:      { valid: 7, expiring: 1, expired: 0, compliance: "fully_compliant",  nextDue: daysAhead(60) },
    staff_diane:     { valid: 5, expiring: 2, expired: 1, compliance: "action_required",  nextDue: daysAhead(7) },
    staff_chervelle: { valid: 8, expiring: 0, expired: 0, compliance: "fully_compliant",  nextDue: daysAhead(180) },
  };

  return STAFF.map((s) => {
    const c = config[s.id] ?? { valid: 8, expiring: 0, expired: 0, compliance: "fully_compliant" as const, nextDue: daysAhead(90) };
    return {
      id: `tmr_${s.id}`,
      staff_id: s.id,
      role: s.role,
      training_statuses: [],
      overall_compliance: c.compliance,
      next_refresher_due: c.nextDue,
      total_courses: 8,
      valid_count: c.valid,
      expiring_count: c.expiring,
      expired_count: c.expired,
      created_at: NOW,
    };
  });
}

// ── 3. CPD records ──────────────────────────────────────────────────────────
// 8 records: 6 completed, 2 in_progress. avg ≈ 11 hours/staff.

export function seedCpdRecords(): CPDRecord[] {
  return [
    { id: "cpd_001", staff_id: "staff_darren",    title: "Registered Managers Network Forum",  type: "conference",        provider: "NCERCC",                   start_date: daysAgo(90),  completed_date: daysAgo(89),  duration: "1 day",   status: "completed",   cpd_hours: 6,  certificate_obtained: true,  impact_on_practice: "Updated safeguarding practices in line with Working Together 2023.", notes: "" },
    { id: "cpd_002", staff_id: "staff_ryan",      title: "Trauma-Informed Practice Level 2",  type: "qualification",     provider: "CACHE",                    start_date: daysAgo(120), completed_date: daysAgo(60),  duration: "8 weeks", status: "completed",   cpd_hours: 24, certificate_obtained: true,  impact_on_practice: "Improved de-escalation approaches across the team.", notes: "" },
    { id: "cpd_003", staff_id: "staff_edward",    title: "Reflective Practice Supervision",   type: "reflective_account",provider: "In-house",                 start_date: daysAgo(30),  completed_date: daysAgo(28),  duration: "2 hours", status: "completed",   cpd_hours: 2,  certificate_obtained: false, impact_on_practice: "Identified improvement areas in key-working practice.", notes: "" },
    { id: "cpd_004", staff_id: "staff_lackson",   title: "Positive Behavioural Support",      type: "training",          provider: "Skills for Care",          start_date: daysAgo(45),  completed_date: daysAgo(44),  duration: "2 days",  status: "completed",   cpd_hours: 12, certificate_obtained: true,  impact_on_practice: "Supporting behaviour-led approaches within the home.", notes: "" },
    { id: "cpd_005", staff_id: "staff_anna",      title: "Medication Administration Refresher",type: "training",         provider: "Bluebird Training",        start_date: daysAgo(14),  completed_date: daysAgo(13),  duration: "4 hours", status: "completed",   cpd_hours: 4,  certificate_obtained: true,  impact_on_practice: "Reinforced MAR sheet accuracy and PRN recording standards.", notes: "" },
    { id: "cpd_006", staff_id: "staff_chervelle", title: "Child Sexual Exploitation Awareness",type: "training",         provider: "St. Giles Trust",          start_date: daysAgo(60),  completed_date: daysAgo(59),  duration: "1 day",   status: "completed",   cpd_hours: 6,  certificate_obtained: true,  impact_on_practice: "Enhanced CSE identification skills across shift team.", notes: "" },
    { id: "cpd_007", staff_id: "staff_diane",     title: "NVQ Level 3 Health & Social Care",  type: "qualification",     provider: "CACHE",                    start_date: daysAgo(60),  completed_date: null,         duration: "12 months",status: "in_progress", cpd_hours: 0,  certificate_obtained: false, impact_on_practice: "", notes: "Expected completion date Q4 2026." },
    { id: "cpd_008", staff_id: "staff_anna",      title: "PACE Playfulness in Practice",       type: "conference",        provider: "DDP Network UK",           start_date: daysAhead(14), completed_date: null,        duration: "1 day",   status: "in_progress", cpd_hours: 0,  certificate_obtained: false, impact_on_practice: "", notes: "Booked. Awaiting attendance." },
  ];
}

// ── 4. Staff handbook acknowledgement records ───────────────────────────────
// Two core handbooks. All but one newer staff member have acknowledged.

export function seedStaffHandbookAcknowledgementRecords(): StaffHandbookAcknowledgementRecord[] {
  const allStaffIds = STAFF.map((s) => s.id);

  const makeAcks = (excludeIds: string[]): { staff_id: string; acknowledged_date: string | null }[] =>
    allStaffIds.map((id) => ({
      staff_id: id,
      acknowledged_date: excludeIds.includes(id) ? null : daysAgo(30),
    }));

  return [
    {
      id: "sha_001",
      title: "Oak House Staff Handbook 2025–26",
      version: "3.2",
      issued_date: daysAgo(60),
      required_by: daysAgo(30),
      issued_by: "staff_darren",
      category: "handbook",
      acknowledgements: makeAcks(["staff_diane"]),
      notes: "Maria Okafor to complete by end of this week.",
    },
    {
      id: "sha_002",
      title: "Safeguarding Policy — Revised June 2026",
      version: "4.0",
      issued_date: daysAgo(20),
      required_by: today,
      issued_by: "staff_darren",
      category: "policy",
      acknowledgements: makeAcks(["staff_diane", "staff_alex"]),
      notes: "Issued following updated threshold guidance.",
    },
  ];
}
