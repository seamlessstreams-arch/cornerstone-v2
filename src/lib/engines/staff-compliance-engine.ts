// ══════════════════════════════════════════════════════════════════════════════
// CARA — Staff Compliance Cockpit engine (pure, deterministic)
//
// One view of every active staff member's compliance: supervision due,
// appraisal due, mandatory training (expired / expiring), DBS currency and
// probation. Data-backed only — supervision/appraisal due dates and DBS come
// from the staff record; training from the training records. Honesty rule: a
// null due date reads "not scheduled" and no mandatory training reads "none
// recorded" — never counted as compliant. `today` injected; unit-testable.
// ══════════════════════════════════════════════════════════════════════════════

export type StaffComplianceLevel = "critical" | "attention" | "compliant";

export interface StaffLite {
  id: string;
  full_name: string;
  role: string;
  job_title: string;
  is_active: boolean;
  start_date: string | null;
  probation_end_date: string | null;
  dbs_issue_date: string | null;
  dbs_update_service: boolean;
  next_supervision_due: string | null;
  next_appraisal_due: string | null;
}
export interface TrainingLite {
  staff_id: string;
  course_name: string;
  expiry_date: string | null;
  is_mandatory: boolean;
  completed_date?: string | null;
  status?: string | null;
}

export interface StaffComplianceFlag {
  severity: "critical" | "attention";
  text: string;
}
export interface StaffComplianceRow {
  staff_id: string;
  full_name: string;
  role: string;
  job_title: string;
  level: StaffComplianceLevel;
  supervision: { due: string | null; overdue: boolean; days_overdue: number; text: string };
  appraisal: { due: string | null; overdue: boolean; text: string };
  training: { mandatory_total: number; expired: number; expiring: number; outstanding: number; compliant: number; pct: number | null; text: string; expired_courses: string[]; expiring_courses: string[]; outstanding_courses: string[] };
  dbs: { issue_date: string | null; age_years: number | null; on_update_service: boolean; due_for_renewal: boolean; text: string };
  probation: { end_date: string; ending_soon: boolean; text: string } | null;
  flags: StaffComplianceFlag[];
}
export interface StaffComplianceResult {
  date: string;
  total_staff: number;
  summary: {
    fully_compliant: number;
    needs_attention: number;
    critical: number;
    supervision_overdue: number;
    appraisal_overdue: number;
    training_expired_staff: number;
    dbs_due: number;
  };
  headline: string;
  rows: StaffComplianceRow[];
}

export interface StaffComplianceInput {
  today: string;
  staff: StaffLite[];
  training: TrainingLite[];
  trainingExpiringDays?: number; // default 30
  dbsRenewYears?: number; // default 3
  probationSoonDays?: number; // default 30
}

function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 864e5);
}
function yearsSince(date: string, today: string): number {
  return Math.floor(daysBetween(date, today) / 365);
}

const LEVEL_RANK: Record<StaffComplianceLevel, number> = { critical: 0, attention: 1, compliant: 2 };

export function computeStaffCompliance(input: StaffComplianceInput): StaffComplianceResult {
  const expiringDays = input.trainingExpiringDays ?? 30;
  const dbsYears = input.dbsRenewYears ?? 3;
  const probSoon = input.probationSoonDays ?? 30;
  const today = input.today;

  const trainingByStaff = new Map<string, TrainingLite[]>();
  for (const t of input.training) {
    const arr = trainingByStaff.get(t.staff_id) ?? [];
    arr.push(t);
    trainingByStaff.set(t.staff_id, arr);
  }

  const rows: StaffComplianceRow[] = input.staff
    .filter((s) => s.is_active)
    .map((s) => {
      const flags: StaffComplianceFlag[] = [];

      // ── Supervision ──
      const supDue = s.next_supervision_due;
      const supOverdue = !!supDue && supDue < today;
      const supDaysOver = supDue ? Math.max(0, daysBetween(supDue, today)) : 0;
      const supText = !supDue ? "Not scheduled" : supOverdue ? `Overdue ${supDaysOver}d` : `Due ${supDue}`;
      if (supOverdue) flags.push({ severity: "critical", text: `Supervision overdue (${supDaysOver}d)` });
      else if (!supDue) flags.push({ severity: "attention", text: "No supervision scheduled" });

      // ── Appraisal ──
      const appDue = s.next_appraisal_due;
      const appOverdue = !!appDue && appDue < today;
      const appText = !appDue ? "Not scheduled" : appOverdue ? `Overdue` : `Due ${appDue}`;
      if (appOverdue) flags.push({ severity: "attention", text: "Appraisal overdue" });

      // ── Training (mandatory) ──
      // A course is current if it has a future expiry beyond the grace window,
      // OR it's completed with no expiry (lifetime), OR explicitly marked
      // compliant. Anything else with no/expired evidence is outstanding —
      // so a "not_started" mandatory course is never silently counted current.
      const mand = (trainingByStaff.get(s.id) ?? []).filter((t) => t.is_mandatory);
      const isExpired = (t: TrainingLite) => !!t.expiry_date && t.expiry_date < today;
      const isExpiring = (t: TrainingLite) => !!t.expiry_date && t.expiry_date >= today && daysBetween(today, t.expiry_date) <= expiringDays;
      const isCurrent = (t: TrainingLite) =>
        (!!t.expiry_date && daysBetween(today, t.expiry_date) > expiringDays) ||
        (!t.expiry_date && (!!t.completed_date || t.status === "compliant"));
      const expired = mand.filter(isExpired);
      const expiring = mand.filter((t) => !isExpired(t) && isExpiring(t));
      const current = mand.filter((t) => !isExpired(t) && !isExpiring(t) && isCurrent(t));
      const outstanding = mand.filter((t) => !isExpired(t) && !isExpiring(t) && !isCurrent(t)); // not_started / no evidence
      const pct = mand.length === 0 ? null : Math.round((current.length / mand.length) * 100);
      const trainText =
        mand.length === 0 ? "None recorded"
        : expired.length ? `${expired.length} expired`
        : outstanding.length ? `${outstanding.length} outstanding`
        : expiring.length ? `${expiring.length} expiring`
        : `${pct}% current`;
      if (expired.length) flags.push({ severity: "critical", text: `${expired.length} mandatory training expired` });
      else if (outstanding.length) flags.push({ severity: "attention", text: `${outstanding.length} mandatory training outstanding` });
      else if (expiring.length) flags.push({ severity: "attention", text: `${expiring.length} training expiring soon` });
      else if (mand.length === 0) flags.push({ severity: "attention", text: "No mandatory training recorded" });

      // ── DBS ──
      const dbsAge = s.dbs_issue_date ? yearsSince(s.dbs_issue_date, today) : null;
      const dbsDue = !!s.dbs_issue_date && !s.dbs_update_service && (dbsAge ?? 0) >= dbsYears;
      const dbsText = !s.dbs_issue_date ? "No DBS on record" : s.dbs_update_service ? "On update service" : `Issued ${s.dbs_issue_date} (${dbsAge}y)`;
      if (dbsDue) flags.push({ severity: "attention", text: `DBS ${dbsAge}y old — consider renewal` });
      else if (!s.dbs_issue_date) flags.push({ severity: "attention", text: "No DBS recorded" });

      // ── Probation ──
      let probation: StaffComplianceRow["probation"] = null;
      if (s.probation_end_date) {
        const future = s.probation_end_date >= today;
        const soon = future && daysBetween(today, s.probation_end_date) <= probSoon;
        probation = { end_date: s.probation_end_date, ending_soon: soon, text: future ? `Ends ${s.probation_end_date}` : "Passed" };
        if (soon) flags.push({ severity: "attention", text: `Probation ends ${s.probation_end_date}` });
      }

      // ── Overall level ──
      const level: StaffComplianceLevel = flags.some((f) => f.severity === "critical")
        ? "critical"
        : flags.length > 0
          ? "attention"
          : "compliant";

      return {
        staff_id: s.id,
        full_name: s.full_name,
        role: s.role,
        job_title: s.job_title,
        level,
        supervision: { due: supDue, overdue: supOverdue, days_overdue: supDaysOver, text: supText },
        appraisal: { due: appDue, overdue: appOverdue, text: appText },
        training: {
          mandatory_total: mand.length,
          expired: expired.length,
          expiring: expiring.length,
          outstanding: outstanding.length,
          compliant: current.length,
          pct,
          text: trainText,
          expired_courses: expired.map((t) => t.course_name),
          expiring_courses: expiring.map((t) => t.course_name),
          outstanding_courses: outstanding.map((t) => t.course_name),
        },
        dbs: { issue_date: s.dbs_issue_date, age_years: dbsAge, on_update_service: s.dbs_update_service, due_for_renewal: dbsDue, text: dbsText },
        probation,
        flags,
      };
    })
    .sort((a, b) => LEVEL_RANK[a.level] - LEVEL_RANK[b.level] || a.full_name.localeCompare(b.full_name));

  const summary = {
    fully_compliant: rows.filter((r) => r.level === "compliant").length,
    needs_attention: rows.filter((r) => r.level === "attention").length,
    critical: rows.filter((r) => r.level === "critical").length,
    supervision_overdue: rows.filter((r) => r.supervision.overdue).length,
    appraisal_overdue: rows.filter((r) => r.appraisal.overdue).length,
    training_expired_staff: rows.filter((r) => r.training.expired > 0).length,
    dbs_due: rows.filter((r) => r.dbs.due_for_renewal).length,
  };

  const bits: string[] = [];
  if (summary.critical) bits.push(`${summary.critical} critical`);
  if (summary.needs_attention) bits.push(`${summary.needs_attention} need attention`);
  bits.push(`${summary.fully_compliant}/${rows.length} fully compliant`);
  const headline = bits.join(" · ");

  return { date: today, total_staff: rows.length, summary, headline, rows };
}
