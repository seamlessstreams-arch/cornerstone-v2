"use client";

import React, { useEffect, useState } from "react";
import type {
  PracticeIntelligenceScan,
  RiskPattern,
  PracticeDriftAlert,
  TrainingNeedAlert,
  OversightPrompt,
  SuggestedSession,
  PlanUpdateSuggestion,
} from "@/types/practice-intelligence";

// ── Types for regulation coverage response ─────────────────────────────────

interface RegulationCoverage {
  regulation: string;
  title: string;
  evidenceCount: number;
  lastEvidenceDate: string | null;
  coverage: "strong" | "adequate" | "weak" | "none";
  sccifThemes: string[];
}

// ── Severity / Priority Badge ───────────────────────────────────────────────

function SeverityBadge({ level }: { level: string }) {
  const colorMap: Record<string, string> = {
    critical: "bg-red-100 text-red-800 border-red-300",
    urgent: "bg-red-100 text-red-800 border-red-300",
    high: "bg-orange-100 text-orange-800 border-orange-300",
    medium: "bg-amber-100 text-amber-800 border-amber-300",
    low: "bg-blue-100 text-blue-800 border-blue-300",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold uppercase ${colorMap[level] ?? "bg-gray-100 text-gray-800 border-gray-300"}`}
    >
      {level}
    </span>
  );
}

// ── Health Indicator ────────────────────────────────────────────────────────

function HealthIndicator({ riskLevel, riskScore }: { riskLevel: string; riskScore: number }) {
  const colorMap: Record<string, string> = {
    low: "bg-green-100 text-green-800 border-green-300",
    medium: "bg-amber-100 text-amber-800 border-amber-300",
    high: "bg-orange-100 text-orange-800 border-orange-300",
    critical: "bg-red-100 text-red-800 border-red-300",
  };
  const labelMap: Record<string, string> = {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
    critical: "Critical",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold ${colorMap[riskLevel] ?? "bg-gray-100 text-gray-800 border-gray-300"}`}
    >
      {labelMap[riskLevel] ?? riskLevel} ({riskScore})
    </span>
  );
}

// ── Metric Card ─────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <span className={`text-2xl font-bold ${color ?? "text-gray-900"}`}>{value}</span>
      <span className="mt-1 text-xs text-gray-500 text-center">{label}</span>
    </div>
  );
}

// ── Coverage Bar ────────────────────────────────────────────────────────────

function CoverageBadge({ coverage }: { coverage: string }) {
  const map: Record<string, string> = {
    strong: "bg-green-100 text-green-700 border-green-200",
    adequate: "bg-blue-100 text-blue-700 border-blue-200",
    weak: "bg-amber-100 text-amber-700 border-amber-200",
    none: "bg-red-100 text-red-700 border-red-200",
  };
  const labels: Record<string, string> = {
    strong: "STRONG",
    adequate: "ADEQUATE",
    weak: "WEAK",
    none: "NONE",
  };
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${map[coverage] ?? "bg-gray-100 text-gray-700"}`}
    >
      {labels[coverage] ?? coverage}
    </span>
  );
}

// ── Climate Label ───────────────────────────────────────────────────────────

function climateLabel(climate: string): string {
  const map: Record<string, string> = {
    settled: "Settled",
    mostly_settled: "Mostly Settled",
    unsettled: "Unsettled",
    challenging: "Challenging",
    in_crisis: "In Crisis",
  };
  return map[climate] ?? climate;
}

function climateColor(climate: string): string {
  const map: Record<string, string> = {
    settled: "text-green-600",
    mostly_settled: "text-green-600",
    unsettled: "text-amber-600",
    challenging: "text-orange-600",
    in_crisis: "text-red-600",
  };
  return map[climate] ?? "text-gray-600";
}

// ── Main Widget ─────────────────────────────────────────────────────────────

export function PracticeIntelligenceDashboardWidget() {
  const [scan, setScan] = useState<PracticeIntelligenceScan | null>(null);
  const [coverage, setCoverage] = useState<RegulationCoverage[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const scanRes = await fetch("/api/practice-intelligence/scanner?mode=latest");
        if (!scanRes.ok) throw new Error(`Scanner HTTP ${scanRes.status}`);
        const scanJson = await scanRes.json();

        if (cancelled) return;

        const scanData: PracticeIntelligenceScan | null = scanJson.data ?? null;
        setScan(scanData);

        // If we have scan data, also fetch regulation coverage
        if (scanData) {
          try {
            const covRes = await fetch("/api/practice-intelligence/regulation-mapping?mode=coverage");
            if (covRes.ok) {
              const covJson = await covRes.json();
              if (!cancelled) {
                setCoverage(covJson.data ?? null);
              }
            }
          } catch {
            // Regulation coverage is supplementary — don't fail the widget
          }
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Loading skeleton ────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6">
        <div className="h-6 w-64 rounded bg-gray-200 mb-4" />
        <div className="h-4 w-48 rounded bg-gray-100 mb-5" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-gray-100" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h3 className="font-semibold text-red-800">Practice Intelligence</h3>
        <p className="mt-2 text-sm text-red-600">Failed to load: {error}</p>
      </div>
    );
  }

  // ── Empty state — no scan data ──────────────────────────────────────────

  if (!scan) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900">Practice Intelligence</h3>
        <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-600">
            No practice intelligence scans have been run yet.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Run the first scan to analyse incidents, daily logs, risk assessments, staffing
            patterns, and therapeutic profiles across the home. Scans surface risk patterns,
            practice drift, training needs, oversight prompts, and session suggestions.
          </p>
        </div>
        <div className="mt-4 text-xs text-gray-400">
          CHR 2015 Regs 5, 12, 13, 34 | SCCIF Quality of Care | Working Together 2023
        </div>
      </div>
    );
  }

  // ── Data present — render full dashboard ────────────────────────────────

  const d = scan.home_dynamics_summary;
  const allSuggestedSessions = [
    ...(scan.suggested_keywork ?? []),
    ...(scan.suggested_reflective ?? []),
  ];

  const toggle = (section: string) =>
    setExpandedSection((prev) => (prev === section ? null : section));

  // Count high-severity items for status badges
  const criticalRisks = scan.risk_patterns.filter(
    (r) => r.severity === "critical" || r.severity === "high",
  ).length;
  const urgentOversight = scan.oversight_prompts.filter(
    (o) => o.priority === "urgent" || o.priority === "high",
  ).length;
  const pendingDrift = scan.practice_drift_alerts.length;

  // Calculate regulation coverage percentage if available
  let coveragePct: number | null = null;
  if (coverage && coverage.length > 0) {
    const covered = coverage.filter((c) => c.coverage !== "none").length;
    coveragePct = Math.round((covered / coverage.length) * 100);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Practice Intelligence</h3>
          <p className="text-xs text-gray-500 mt-1">
            Scan: {scan.scan_date} | Type:{" "}
            {scan.scan_type.replace(/_/g, " ")} | Climate:{" "}
            <span className={`font-medium ${climateColor(d.emotional_climate)}`}>
              {climateLabel(d.emotional_climate)}
            </span>
          </p>
        </div>
        <HealthIndicator riskLevel={d.risk_level} riskScore={d.risk_score} />
      </div>

      {/* ── Key Metrics Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        <MetricCard
          label="Risk Patterns"
          value={scan.risk_patterns.length}
          color={scan.risk_patterns.length > 0 ? "text-red-600" : "text-green-600"}
        />
        <MetricCard
          label="Practice Drift Alerts"
          value={scan.practice_drift_alerts.length}
          color={scan.practice_drift_alerts.length > 0 ? "text-amber-600" : "text-green-600"}
        />
        <MetricCard
          label="Training Needs"
          value={scan.training_need_alerts.length}
          color={scan.training_need_alerts.length > 0 ? "text-amber-600" : "text-green-600"}
        />
        <MetricCard
          label="Oversight Prompts"
          value={scan.oversight_prompts.length}
          color={scan.oversight_prompts.length > 0 ? "text-orange-600" : "text-green-600"}
        />
        <MetricCard
          label="Workflow Triggers"
          value={scan.repeated_triggers.length}
          color={scan.repeated_triggers.length > 0 ? "text-amber-600" : "text-green-600"}
        />
      </div>

      {/* ── Status Badges ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-5">
        {criticalRisks > 0 && (
          <span className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-medium border border-red-200">
            {criticalRisks} HIGH/CRITICAL RISK PATTERN{criticalRisks !== 1 ? "S" : ""}
          </span>
        )}
        {urgentOversight > 0 && (
          <span className="rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-xs font-medium border border-orange-200">
            {urgentOversight} URGENT OVERSIGHT PROMPT{urgentOversight !== 1 ? "S" : ""}
          </span>
        )}
        {pendingDrift > 0 && (
          <span className="rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-medium border border-amber-200">
            {pendingDrift} DRIFT ALERT{pendingDrift !== 1 ? "S" : ""}
          </span>
        )}
        {d.safeguarding_alerts > 0 && (
          <span className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-medium border border-red-200">
            {d.safeguarding_alerts} SAFEGUARDING ALERT{d.safeguarding_alerts !== 1 ? "S" : ""}
          </span>
        )}
        {d.overdue_actions > 0 && (
          <span className="rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-medium border border-amber-200">
            {d.overdue_actions} OVERDUE ACTION{d.overdue_actions !== 1 ? "S" : ""}
          </span>
        )}
        {criticalRisks === 0 && urgentOversight === 0 && d.safeguarding_alerts === 0 && (
          <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-medium border border-green-200">
            NO CRITICAL ALERTS
          </span>
        )}
      </div>

      {/* ── Risk Patterns ────────────────────────────────────────────────── */}
      <ExpandableSection
        id="risk_patterns"
        label={`Risk Patterns (${scan.risk_patterns.length})`}
        expanded={expandedSection}
        toggle={toggle}
      >
        {scan.risk_patterns.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No risk patterns detected in this scan.</p>
        ) : (
          <div className="space-y-3">
            {scan.risk_patterns.map((rp: RiskPattern, i: number) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 bg-white p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">
                    {rp.type.replace(/_/g, " ")}
                  </span>
                  <SeverityBadge level={rp.severity} />
                </div>
                <p className="text-sm text-gray-600">{rp.description}</p>
                <p className="mt-1 text-xs text-blue-700">
                  Suggested: {rp.suggested_response}
                </p>
              </div>
            ))}
          </div>
        )}
      </ExpandableSection>

      {/* ── Practice Drift Alerts ────────────────────────────────────────── */}
      <ExpandableSection
        id="practice_drift"
        label={`Practice Drift Alerts (${scan.practice_drift_alerts.length})`}
        expanded={expandedSection}
        toggle={toggle}
      >
        {scan.practice_drift_alerts.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No practice drift detected.</p>
        ) : (
          <div className="space-y-3">
            {scan.practice_drift_alerts.map((da: PracticeDriftAlert, i: number) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 bg-white p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">{da.area}</span>
                  <SeverityBadge level={da.severity} />
                </div>
                <p className="text-sm text-gray-600">{da.description}</p>
                <p className="mt-1 text-xs text-blue-700">
                  Recommendation: {da.recommended_action}
                </p>
              </div>
            ))}
          </div>
        )}
      </ExpandableSection>

      {/* ── Training Needs ───────────────────────────────────────────────── */}
      <ExpandableSection
        id="training_needs"
        label={`Training Needs (${scan.training_need_alerts.length})`}
        expanded={expandedSection}
        toggle={toggle}
      >
        {scan.training_need_alerts.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No training needs identified in this scan.</p>
        ) : (
          <div className="space-y-3">
            {scan.training_need_alerts.map((tn: TrainingNeedAlert, i: number) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 bg-white p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">{tn.topic}</span>
                  <SeverityBadge level={tn.priority} />
                </div>
                <p className="text-sm text-gray-600">{tn.reason}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Suggested resource: {tn.suggested_resource_type.replace(/_/g, " ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </ExpandableSection>

      {/* ── Oversight Prompts ────────────────────────────────────────────── */}
      <ExpandableSection
        id="oversight_prompts"
        label={`Oversight Prompts (${scan.oversight_prompts.length})`}
        expanded={expandedSection}
        toggle={toggle}
      >
        {scan.oversight_prompts.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No oversight prompts generated.</p>
        ) : (
          <div className="space-y-3">
            {scan.oversight_prompts.map((op: OversightPrompt, i: number) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 bg-white p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">
                    {op.oversight_type.replace(/_/g, " ")}
                  </span>
                  <SeverityBadge level={op.priority} />
                </div>
                <p className="text-sm text-gray-600">{op.reason}</p>
              </div>
            ))}
          </div>
        )}
      </ExpandableSection>

      {/* ── Suggested Sessions ───────────────────────────────────────────── */}
      <ExpandableSection
        id="suggested_sessions"
        label={`Suggested Sessions (${allSuggestedSessions.length})`}
        expanded={expandedSection}
        toggle={toggle}
      >
        {allSuggestedSessions.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No session suggestions from this scan.</p>
        ) : (
          <div className="space-y-3">
            {allSuggestedSessions.map((ss: SuggestedSession, i: number) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 bg-white p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">{ss.title}</span>
                  <SeverityBadge level={ss.priority} />
                </div>
                <p className="text-sm text-gray-600">{ss.rationale}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Framework: {ss.framework.replace(/_/g, " ")} | Type:{" "}
                  {ss.session_type.replace(/_/g, " ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </ExpandableSection>

      {/* ── Plan Update Suggestions ──────────────────────────────────────── */}
      <ExpandableSection
        id="plan_updates"
        label={`Plan Update Suggestions (${scan.suggested_plan_updates.length})`}
        expanded={expandedSection}
        toggle={toggle}
      >
        {scan.suggested_plan_updates.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No plan updates suggested.</p>
        ) : (
          <div className="space-y-3">
            {scan.suggested_plan_updates.map((pu: PlanUpdateSuggestion, i: number) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 bg-white p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">
                    {pu.plan_type.replace(/_/g, " ")}
                  </span>
                  <SeverityBadge level={pu.priority} />
                </div>
                <p className="text-sm text-gray-600">{pu.suggestion}</p>
                <p className="mt-1 text-xs text-gray-500">{pu.rationale}</p>
              </div>
            ))}
          </div>
        )}
      </ExpandableSection>

      {/* ── Regulation Coverage ───────────────────────────────────────────── */}
      <ExpandableSection
        id="regulation_coverage"
        label={`Regulation Coverage${coveragePct !== null ? ` (${coveragePct}%)` : ""}`}
        expanded={expandedSection}
        toggle={toggle}
      >
        {!coverage || coverage.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No regulation mapping data available. Run a scan and map evidence to regulations.
          </p>
        ) : (
          <div className="space-y-2">
            {coverage.map((rc: RegulationCoverage, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      rc.coverage === "strong"
                        ? "bg-green-500"
                        : rc.coverage === "adequate"
                          ? "bg-blue-500"
                          : rc.coverage === "weak"
                            ? "bg-amber-500"
                            : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm text-gray-700">
                    {rc.regulation}: {rc.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {rc.evidenceCount} evidence{rc.evidenceCount !== 1 ? "" : ""}
                  </span>
                  <CoverageBadge coverage={rc.coverage} />
                </div>
              </div>
            ))}
          </div>
        )}
      </ExpandableSection>

      {/* ── Regulatory Footer ────────────────────────────────────────────── */}
      <div className="mt-5 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400">
          CHR 2015 Regs 5, 12, 13, 34 | SCCIF Quality of Care | Working Together 2023
        </p>
      </div>
    </div>
  );
}

// ── Expandable Section ──────────────────────────────────────────────────────

function ExpandableSection({
  id,
  label,
  expanded,
  toggle,
  children,
}: {
  id: string;
  label: string;
  expanded: string | null;
  toggle: (id: string) => void;
  children: React.ReactNode;
}) {
  const isOpen = expanded === id;
  return (
    <div className="mb-5">
      <button
        onClick={() => toggle(id)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
      >
        <span
          className={`transform transition-transform ${isOpen ? "rotate-90" : ""}`}
        >
          &#9654;
        </span>
        {label}
      </button>
      {isOpen && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4">
          {children}
        </div>
      )}
    </div>
  );
}
