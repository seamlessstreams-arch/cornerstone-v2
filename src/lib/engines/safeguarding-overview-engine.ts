// ══════════════════════════════════════════════════════════════════════════════
// CARA — Home Safeguarding Overview engine (pure, deterministic)
//
// One safeguarding lens for the DSL/registered manager: incidents awaiting
// management oversight, open incidents, active/recent missing episodes and
// outstanding return interviews, overdue risk assessments, open LADO referrals
// and notifiable events still to be sent. Distinct from the generic priority
// briefing — this is the safeguarding picture, with deep-links to act.
//
// Honesty rule: a section with records but none outstanding reads "none open";
// a section with NO records reads "none recorded" — never false assurance.
// Deterministic — `today` injected; unit-testable without a store or clock.
// ══════════════════════════════════════════════════════════════════════════════

export type SafeguardingSeverity = "critical" | "high" | "warning" | "ok" | "none";

export interface SafeguardingItem {
  title: string;
  detail: string;
  href: string;
  severity: "critical" | "high" | "medium" | "low";
  date: string | null;
}
export interface SafeguardingSection {
  key: string;
  label: string;
  severity: SafeguardingSeverity;
  count: number;
  items: SafeguardingItem[];
  status_text: string;
  href: string;
}

export interface SgIncident {
  id: string;
  child_id: string;
  type: string;
  severity: string;
  date: string;
  status: string;
  requires_oversight: boolean;
  oversight_at: string | null;
}
export interface SgMissing {
  id: string;
  child_id: string;
  date_missing: string;
  date_returned: string | null;
  risk_level: string;
  return_interview_completed: boolean;
}
export interface SgRisk {
  id: string;
  child_id: string;
  domain: string;
  current_level: string;
  status: string;
  review_date: string;
}
export interface SgLado {
  id: string;
  child_ids: string[];
  status: string;
  date_referred: string;
  closed_date: string | null;
  allegation_type: string;
}
export interface SgNotifiable {
  id: string;
  child_id: string | null;
  date: string;
  event_type: string;
  ofsted_status: string;
}

export interface SafeguardingOverviewInput {
  today: string;
  incidents: SgIncident[];
  missing: SgMissing[];
  risk: SgRisk[];
  lado: SgLado[];
  notifiable: SgNotifiable[];
  resolveChild: (id: string | null) => string | null;
  recentDays?: number; // window for "recent" incidents/missing (default 7)
}

export interface SafeguardingOverviewResult {
  generated_for: string;
  date: string;
  overall: "critical" | "elevated" | "stable";
  headline: string;
  sections: SafeguardingSection[];
  counts: {
    oversight_pending: number;
    open_incidents: number;
    missing_active: number;
    rhi_outstanding: number;
    risk_overdue: number;
    lado_open: number;
    notifiable_pending: number;
  };
  positives: string[];
}

const CLOSED = new Set(["closed", "resolved"]);

function incidentSeverity(sev: string): "critical" | "high" | "medium" | "low" {
  if (sev === "critical") return "critical";
  if (sev === "high") return "high";
  if (sev === "medium") return "medium";
  return "low";
}
function riskSeverity(level: string): "critical" | "high" | "medium" | "low" {
  if (level === "very_high" || level === "critical") return "critical";
  if (level === "high") return "high";
  if (level === "medium") return "medium";
  return "low";
}
function childLabel(name: string | null): string {
  return name ? ` — ${name}` : "";
}

export function computeSafeguardingOverview(input: SafeguardingOverviewInput): SafeguardingOverviewResult {
  const recentDays = input.recentDays ?? 7;
  const recentFloor = new Date(Date.parse(`${input.today}T00:00:00Z`) - recentDays * 864e5).toISOString().slice(0, 10);
  const cap = (arr: SafeguardingItem[]) => arr.sort((a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity]).slice(0, 6);

  // ── 1. Incidents awaiting management oversight ──
  const oversight = input.incidents.filter((i) => i.requires_oversight && !i.oversight_at && !CLOSED.has(i.status));
  const oversightItems: SafeguardingItem[] = oversight.map((i) => ({
    title: `${i.type.replace(/_/g, " ")}${childLabel(input.resolveChild(i.child_id))}`,
    detail: `Awaiting management oversight and sign-off. Logged ${i.date}.`,
    href: "/incidents",
    severity: incidentSeverity(i.severity),
    date: i.date,
  }));

  // ── 2. Open incidents (not yet closed) ──
  const open = input.incidents.filter((i) => !CLOSED.has(i.status));

  // ── 3. Missing — active episodes + outstanding return interviews ──
  const activeMissing = input.missing.filter((m) => !m.date_returned);
  const rhiOutstanding = input.missing.filter((m) => m.date_returned && !m.return_interview_completed && m.date_returned >= recentFloor);
  const missingItems: SafeguardingItem[] = [
    ...activeMissing.map((m) => ({
      title: `Currently missing${childLabel(input.resolveChild(m.child_id))}`,
      detail: `${m.risk_level} risk. Missing since ${m.date_missing}. Follow the missing protocol.`,
      href: "/missing-from-care",
      severity: (m.risk_level === "high" || m.risk_level === "critical" ? "critical" : "high") as SafeguardingItem["severity"],
      date: m.date_missing,
    })),
    ...rhiOutstanding.map((m) => ({
      title: `Return interview outstanding${childLabel(input.resolveChild(m.child_id))}`,
      detail: `Returned ${m.date_returned}. Independent return interview not yet completed.`,
      href: "/missing-from-care",
      severity: "high" as const,
      date: m.date_returned,
    })),
  ];

  // ── 4. Overdue risk assessments (current plans past review date) ──
  const overdueRisk = input.risk.filter((r) => r.status === "current" && r.review_date && r.review_date < input.today);
  const riskItems: SafeguardingItem[] = overdueRisk.map((r) => ({
    title: `${r.domain.replace(/_/g, " ")} risk assessment overdue${childLabel(input.resolveChild(r.child_id))}`,
    detail: `${r.current_level} risk. Review was due ${r.review_date}.`,
    href: "/risk-assessments",
    severity: riskSeverity(r.current_level),
    date: r.review_date,
  }));

  // ── 5. Open LADO referrals ──
  const openLado = input.lado.filter((l) => !l.closed_date);
  const ladoItems: SafeguardingItem[] = openLado.map((l) => ({
    title: `LADO referral — ${l.allegation_type.replace(/_/g, " ")}`,
    detail: `${l.status.replace(/_/g, " ")}. Referred ${l.date_referred}.${l.child_ids.length ? ` ${l.child_ids.length} child(ren) involved.` : ""}`,
    href: "/lado-referrals",
    severity: "high" as const,
    date: l.date_referred,
  }));

  // ── 6. Notifiable events still to send (Reg 40) ──
  const pendingNotifiable = input.notifiable.filter((n) => n.ofsted_status === "pending");
  const notifiableItems: SafeguardingItem[] = pendingNotifiable.map((n) => ({
    title: `Notification outstanding — ${n.event_type.replace(/_/g, " ")}${childLabel(input.resolveChild(n.child_id))}`,
    detail: `Event dated ${n.date}. Ofsted notification not yet recorded — the manager should consider whether notification is required.`,
    href: "/notifiable-events",
    severity: "high" as const,
    date: n.date,
  }));

  // ── Section assembly ──
  const sevOf = (items: SafeguardingItem[], recorded: boolean): SafeguardingSeverity => {
    if (items.length === 0) return recorded ? "ok" : "none";
    if (items.some((i) => i.severity === "critical")) return "critical";
    if (items.some((i) => i.severity === "high")) return "high";
    return "warning";
  };
  const statusText = (items: SafeguardingItem[], recorded: boolean, openWord: string, recordedWord: string): string => {
    if (items.length > 0) return `${items.length} ${openWord}`;
    return recorded ? recordedWord : "None recorded";
  };

  const sections: SafeguardingSection[] = [
    {
      key: "oversight",
      label: "Incidents awaiting oversight",
      severity: sevOf(oversightItems, input.incidents.length > 0),
      count: oversightItems.length,
      items: cap(oversightItems),
      status_text: statusText(oversightItems, input.incidents.length > 0, "awaiting sign-off", "All incidents signed off"),
      href: "/incidents",
    },
    {
      key: "missing",
      label: "Missing from care",
      severity: sevOf(missingItems, input.missing.length > 0),
      count: missingItems.length,
      items: cap(missingItems),
      status_text: statusText(missingItems, input.missing.length > 0, "to action", "No active episodes"),
      href: "/missing-from-care",
    },
    {
      key: "risk",
      label: "Risk assessments overdue",
      severity: sevOf(riskItems, input.risk.length > 0),
      count: riskItems.length,
      items: cap(riskItems),
      status_text: statusText(riskItems, input.risk.length > 0, "overdue", "All current"),
      href: "/risk-assessments",
    },
    {
      key: "lado",
      label: "LADO referrals open",
      severity: sevOf(ladoItems, input.lado.length > 0),
      count: ladoItems.length,
      items: cap(ladoItems),
      status_text: statusText(ladoItems, input.lado.length > 0, "open", "None open"),
      href: "/lado-referrals",
    },
    {
      key: "notifiable",
      label: "Notifications outstanding",
      severity: sevOf(notifiableItems, input.notifiable.length > 0),
      count: notifiableItems.length,
      items: cap(notifiableItems),
      status_text: statusText(notifiableItems, input.notifiable.length > 0, "to send", "All sent"),
      href: "/notifiable-events",
    },
  ];

  // ── Overall + headline ──
  const anyCritical = sections.some((s) => s.severity === "critical");
  const anyHigh = sections.some((s) => s.severity === "high");
  const overall: SafeguardingOverviewResult["overall"] = anyCritical ? "critical" : anyHigh || sections.some((s) => s.severity === "warning") ? "elevated" : "stable";

  const headBits = sections.filter((s) => s.count > 0).map((s) => `${s.count} ${s.label.toLowerCase()}`);
  const headline = headBits.length ? headBits.join(" · ") : "No open safeguarding actions";

  // ── Positives (only for sections with records but nothing open) ──
  const positives: string[] = [];
  for (const s of sections) {
    if (s.severity === "ok") positives.push(`${s.label}: ${s.status_text.toLowerCase()}`);
  }

  return {
    generated_for: "Designated Safeguarding Lead",
    date: input.today,
    overall,
    headline,
    sections,
    counts: {
      oversight_pending: oversightItems.length,
      open_incidents: open.length,
      missing_active: activeMissing.length,
      rhi_outstanding: rhiOutstanding.length,
      risk_overdue: overdueRisk.length,
      lado_open: openLado.length,
      notifiable_pending: pendingNotifiable.length,
    },
    positives,
  };
}

const SEV_RANK: Record<SafeguardingItem["severity"], number> = { critical: 0, high: 1, medium: 2, low: 3 };
