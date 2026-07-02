// ══════════════════════════════════════════════════════════════════════════════
// CARA — WORKFORCE COMMAND ENGINE (pure / deterministic)
//
// The manager's single workforce landing view (spec §1). Composes the already-
// computed signals from across the workforce layer — recruitment, safer
// recruitment, onboarding, probation, supervision, training, retention support
// and Ofsted workforce evidence — into status cards + a ranked "needs your
// attention" feed, each deep-linked to where to act.
//
// Pure: takes normalized inputs (the route fans them in) and shapes the view.
// ══════════════════════════════════════════════════════════════════════════════

export interface WorkforceCommandInput {
  recruitment: { total: number; active: number; appointed: number };
  safer_recruitment: { checks_tracked: number; verified: number; candidates: number };
  onboarding: { total: number; completed: number; in_progress: number };
  probation: { in_probation: number; due_soon: number };
  supervision: { rate: number; current: number; overdue: number; due_soon: number; total: number; wellbeing_concerns: number };
  training: { total: number; expired: number; expiring: number };
  retention: { priority: number; support: number; total: number } | null;
  ofsted: { rating: string; red: number; amber: number; green: number } | null;
  tasks: { open: number; overdue: number };
}

export type CardStatus = "good" | "watch" | "alert" | "info";

export interface CommandCard {
  key: string;
  label: string;
  href: string;
  value: string;
  sub: string;
  status: CardStatus;
}

export interface AttentionItem {
  key: string;
  severity: "alert" | "watch";
  label: string;
  detail: string;
  href: string;
  count: number;
}

export interface WorkforceCommand {
  cards: CommandCard[];
  attention: AttentionItem[];
  summary: { attention_count: number; alerts: number };
  headline: string;
}

const RATING_STATUS: Record<string, CardStatus> = { strong: "good", secure: "watch", developing: "alert", insufficient_data: "info" };

export function computeWorkforceCommand(i: WorkforceCommandInput): WorkforceCommand {
  const cards: CommandCard[] = [
    {
      key: "recruitment", label: "Recruitment pipeline", href: "/recruitment", status: "info",
      value: `${i.recruitment.active}`, sub: `active candidates · ${i.recruitment.appointed} appointed`,
    },
    {
      key: "safer_recruitment", label: "Safer recruitment", href: "/safer-recruitment-tracker", status: i.safer_recruitment.checks_tracked > 0 ? "good" : "info",
      value: `${i.safer_recruitment.checks_tracked}`, sub: `checks tracked across ${i.safer_recruitment.candidates} candidates`,
    },
    {
      key: "onboarding", label: "Onboarding", href: "/staff-induction",
      status: i.onboarding.total === 0 ? "info" : i.onboarding.in_progress > 0 ? "watch" : "good",
      value: `${i.onboarding.completed}/${i.onboarding.total}`, sub: `inductions complete · ${i.onboarding.in_progress} in progress`,
    },
    {
      key: "probation", label: "Probation reviews", href: "/staff-induction",
      status: i.probation.due_soon > 0 ? "watch" : "info",
      value: `${i.probation.in_probation}`, sub: `in probation · ${i.probation.due_soon} review${i.probation.due_soon === 1 ? "" : "s"} due soon`,
    },
    {
      key: "supervision", label: "Supervision due", href: "/reflective-supervision",
      status: i.supervision.overdue > 0 ? "alert" : i.supervision.due_soon > 0 ? "watch" : "good",
      value: `${i.supervision.overdue}`, sub: `overdue · ${i.supervision.rate}% current`,
    },
    {
      key: "training", label: "Training gaps", href: "/training",
      status: i.training.expired > 0 ? "alert" : i.training.expiring > 0 ? "watch" : "good",
      value: `${i.training.expired}`, sub: `expired · ${i.training.expiring} expiring soon`,
    },
    {
      key: "retention", label: "Retention & support", href: "/retention-support",
      status: !i.retention ? "info" : i.retention.priority > 0 ? "alert" : i.retention.support > 0 ? "watch" : "good",
      value: i.retention ? `${i.retention.priority + i.retention.support}` : "—", sub: i.retention ? `may need support · ${i.retention.priority} priority` : "unavailable",
    },
    {
      key: "ofsted", label: "Ofsted evidence gaps", href: "/ofsted-workforce-evidence",
      status: i.ofsted ? (RATING_STATUS[i.ofsted.rating] ?? "info") : "info",
      value: i.ofsted ? `${i.ofsted.red + i.ofsted.amber}` : "—", sub: i.ofsted ? `areas to strengthen · ${i.ofsted.red} need attention` : "unavailable",
    },
    {
      key: "tasks", label: "Outstanding tasks", href: "/actions-register",
      status: i.tasks.overdue > 0 ? "alert" : i.tasks.open > 0 ? "watch" : "good",
      value: `${i.tasks.open}`, sub: `open · ${i.tasks.overdue} overdue`,
    },
  ];

  const attention: AttentionItem[] = [];
  const push = (key: string, severity: "alert" | "watch", count: number, label: string, detail: string, href: string) => {
    if (count > 0) attention.push({ key, severity, label, detail, href, count });
  };
  push("supervision", "alert", i.supervision.overdue, `${i.supervision.overdue} staff overdue supervision`, "Book reflective supervision and a check-in.", "/reflective-supervision");
  if (i.retention) push("retention", "alert", i.retention.priority, `${i.retention.priority} staff need priority support`, "Offer support early to protect wellbeing and retention.", "/retention-support");
  push("training", "alert", i.training.expired, `${i.training.expired} training items expired`, "Schedule the overdue mandatory training.", "/training");
  if (i.ofsted) push("ofsted", "alert", i.ofsted.red, `${i.ofsted.red} workforce evidence areas need attention`, "Strengthen the evidence before inspection.", "/ofsted-workforce-evidence");
  push("tasks", "alert", i.tasks.overdue, `${i.tasks.overdue} tasks overdue`, "Clear or reassign overdue tasks.", "/actions-register");
  push("probation", "watch", i.probation.due_soon, `${i.probation.due_soon} probation review${i.probation.due_soon === 1 ? "" : "s"} due soon`, "Plan the probation review.", "/staff-induction");
  if (i.retention) push("retention_support", "watch", i.retention.support, `${i.retention.support} staff to offer support`, "Check in and offer the right support.", "/retention-support");
  push("supervision_soon", "watch", i.supervision.due_soon, `${i.supervision.due_soon} supervision${i.supervision.due_soon === 1 ? "" : "s"} due soon`, "Schedule upcoming supervision.", "/reflective-supervision");
  push("training_soon", "watch", i.training.expiring, `${i.training.expiring} training items expiring soon`, "Re-book before they lapse.", "/training");

  const sevRank = { alert: 0, watch: 1 };
  attention.sort((a, b) => sevRank[a.severity] - sevRank[b.severity] || b.count - a.count || a.label.localeCompare(b.label));

  const alerts = attention.filter((a) => a.severity === "alert").length;
  const headline = attention.length === 0
    ? "Your workforce is in good shape — nothing needs your attention right now."
    : `${attention.length} thing${attention.length === 1 ? "" : "s"} need your attention${alerts > 0 ? ` — ${alerts} urgent` : ""}.`;

  return { cards, attention, summary: { attention_count: attention.length, alerts }, headline };
}
