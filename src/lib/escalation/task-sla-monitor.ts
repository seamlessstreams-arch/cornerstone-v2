// ══════════════════════════════════════════════════════════════════════════════
// TASK SLA MONITOR
//
// Closes the "action automatically" loop of the Enter Once system. The
// orchestrators auto-create deadline-bound tasks (manager review 24h, Reg 40
// same-day, return interview 72h, debriefs 24h, etc.) — this engine watches
// whether they are actually completed in time and escalates SLA breaches,
// weighted for the statutory/safeguarding tasks Ofsted scrutinises.
//
// Pure deterministic — no store/LLM. Injectable `now` for deterministic tests.
// ══════════════════════════════════════════════════════════════════════════════

export interface SlaTask {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  due_date: string | null;
  assigned_to?: string | null;
  child_id?: string | null;
  linked_record_type?: string | null;
  linked_record_id?: string | null;
}

export interface SlaEscalation {
  task_id: string;
  title: string;
  category: string;
  priority: string;
  severity: "critical" | "high" | "medium" | "watch";
  days_overdue: number;
  due_date: string | null;
  is_statutory: boolean;
  reason: string;
  child_id?: string | null;
  linked_record_type?: string | null;
  linked_record_id?: string | null;
}

export interface SlaMonitorResult {
  escalations: SlaEscalation[];
  summary: {
    active_tasks: number;
    overdue: number;
    breached_critical: number;
    breached_high: number;
    approaching: number;
    statutory_overdue: number;
  };
  by_category: { category: string; overdue: number }[];
  headline: string;
}

const TERMINAL_STATUSES = new Set(["completed", "cancelled"]);
// Categories where an overdue task is inherently serious in a regulated home.
const STATUTORY_CATEGORIES = new Set(["safeguarding", "compliance", "medication"]);
// Title markers for statutory/time-bound actions the orchestrators generate.
const STATUTORY_TITLE = /reg\s*40|return interview|debrief|notification|strategy discussion|body map|risk assessment/i;

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function daysOverdue(dueDate: string, now: Date): number {
  const due = new Date(dueDate + "T00:00:00");
  return Math.floor((startOfDay(now) - startOfDay(due)) / 86_400_000);
}

export function monitorTaskSla(tasks: SlaTask[], now: Date = new Date()): SlaMonitorResult {
  const active = tasks.filter((t) => !TERMINAL_STATUSES.has(t.status));
  const escalations: SlaEscalation[] = [];
  const categoryOverdue: Record<string, number> = {};

  for (const t of active) {
    if (!t.due_date) continue;
    const overdue = daysOverdue(t.due_date, now);
    const isStatutory = STATUTORY_CATEGORIES.has(t.category) || STATUTORY_TITLE.test(t.title);

    // Approaching (due today / tomorrow, not yet breached)
    if (overdue < 0) {
      if (overdue >= -1) {
        escalations.push({
          task_id: t.id, title: t.title, category: t.category, priority: t.priority,
          severity: "watch", days_overdue: overdue, due_date: t.due_date, is_statutory: isStatutory,
          reason: overdue === 0 ? "Due today" : "Due tomorrow",
          child_id: t.child_id ?? null, linked_record_type: t.linked_record_type ?? null, linked_record_id: t.linked_record_id ?? null,
        });
      }
      continue;
    }

    // Breached (overdue >= 0 days, i.e. due date has passed or is today-passed)
    categoryOverdue[t.category] = (categoryOverdue[t.category] ?? 0) + 1;

    let severity: SlaEscalation["severity"];
    let reason: string;
    if (isStatutory || t.priority === "urgent" || overdue > 3) {
      severity = "critical";
      reason = isStatutory
        ? `Statutory/safeguarding action overdue by ${overdue} day${overdue === 1 ? "" : "s"} — escalate to Registered Manager`
        : t.priority === "urgent"
        ? `Urgent task overdue by ${overdue} day${overdue === 1 ? "" : "s"}`
        : `Overdue by ${overdue} days — sustained breach`;
    } else if (t.priority === "high" || overdue >= 1) {
      severity = "high";
      reason = `Overdue by ${overdue} day${overdue === 1 ? "" : "s"}`;
    } else {
      severity = "medium";
      reason = "Past due date today";
    }

    escalations.push({
      task_id: t.id, title: t.title, category: t.category, priority: t.priority,
      severity, days_overdue: overdue, due_date: t.due_date, is_statutory: isStatutory,
      reason,
      child_id: t.child_id ?? null, linked_record_type: t.linked_record_type ?? null, linked_record_id: t.linked_record_id ?? null,
    });
  }

  // Sort: critical → high → medium → watch, then most overdue first
  const order = { critical: 0, high: 1, medium: 2, watch: 3 };
  escalations.sort((a, b) => (order[a.severity] - order[b.severity]) || (b.days_overdue - a.days_overdue));

  const breachedCritical = escalations.filter((e) => e.severity === "critical").length;
  const breachedHigh = escalations.filter((e) => e.severity === "high").length;
  const approaching = escalations.filter((e) => e.severity === "watch").length;
  const overdue = escalations.filter((e) => e.severity !== "watch").length;
  const statutoryOverdue = escalations.filter((e) => e.is_statutory && e.severity !== "watch").length;

  const headline =
    breachedCritical > 0
      ? `${breachedCritical} critical SLA breach${breachedCritical === 1 ? "" : "es"} need immediate escalation`
      : breachedHigh > 0
      ? `${breachedHigh} task${breachedHigh === 1 ? "" : "s"} overdue and need attention`
      : approaching > 0
      ? `${approaching} task${approaching === 1 ? "" : "s"} due soon — on track`
      : "All actions within SLA — nothing overdue";

  return {
    escalations,
    summary: {
      active_tasks: active.length,
      overdue,
      breached_critical: breachedCritical,
      breached_high: breachedHigh,
      approaching,
      statutory_overdue: statutoryOverdue,
    },
    by_category: Object.entries(categoryOverdue)
      .map(([category, n]) => ({ category, overdue: n }))
      .sort((a, b) => b.overdue - a.overdue),
    headline,
  };
}
