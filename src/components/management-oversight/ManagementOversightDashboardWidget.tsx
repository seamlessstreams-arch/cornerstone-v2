// ══════════════════════════════════════════════════════════════════════════════
// ManagementOversightDashboardWidget — Dual-AI Oversight Layer card
// OpenAI (Management) + ARIA (Operational) working together
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface OversightTask {
  id: string;
  domain: string;
  title: string;
  priority: string;
  assignedProvider: string;
  status: string;
  confidence: number;
  crossValidated: boolean;
  validationOutcome?: string;
  humanApproved?: boolean;
  actualCost?: number;
  estimatedCost: number;
  recommendations?: string[];
  completedAt?: string;
}

interface ProviderMetric {
  provider: string;
  tasksHandled: number;
  averageConfidence: number;
  successRate: number;
  humanOverrideRate: number;
  totalCost: number;
}

interface Compliance {
  isCompliant: boolean;
  issues: string[];
  warnings: string[];
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
  providerMetrics: ProviderMetric[];
  crossValidationRate: number;
  agreementRate: number;
  disagreements: number;
  totalMonthlyCost: number;
  budgetUtilisation: number;
  overallOversightScore: number;
}

interface Metrics {
  overallScore: number;
  tasksThisMonth: number;
  completionRate: number;
  openaiTasksThisMonth: number;
  claudeTasksThisMonth: number;
  internalTasksThisMonth: number;
  crossValidationsThisMonth: number;
  agreementRate: number;
  openaiSpendThisMonth: number;
  claudeSpendThisMonth: number;
  totalSpendThisMonth: number;
  ariaLearningInputsThisMonth: number;
  ariaInternalCapableRate: number;
  patternsDetected: number;
  issues: string[];
  warnings: string[];
}

interface DashboardData {
  compliance: Compliance;
  metrics: Metrics;
  tasks: OversightTask[];
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function getScoreColour(score: number): string {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

function getProviderColour(provider: string): string {
  switch (provider) {
    case "openai": return "bg-emerald-100 text-emerald-800";
    case "anthropic_claude": return "bg-indigo-100 text-indigo-800";
    case "cornerstone_internal": return "bg-slate-100 text-slate-800";
    default: return "bg-slate-100 text-slate-700";
  }
}

function getProviderShortLabel(provider: string): string {
  switch (provider) {
    case "openai": return "OpenAI";
    case "anthropic_claude": return "ARIA";
    case "cornerstone_internal": return "Internal";
    default: return provider;
  }
}

function getStatusColour(status: string): string {
  switch (status) {
    case "completed": return "bg-green-100 text-green-700";
    case "in_progress": return "bg-blue-100 text-blue-700";
    case "pending": return "bg-slate-100 text-slate-600";
    case "escalated": return "bg-red-100 text-red-700";
    default: return "bg-slate-100 text-slate-600";
  }
}

function getDomainLabel(domain: string): string {
  const labels: Record<string, string> = {
    quality_of_care_review: "Quality Review",
    compliance_audit: "Compliance Audit",
    pattern_detection: "Pattern Detection",
    ofsted_readiness: "Ofsted Readiness",
    staff_practice_quality: "Practice Quality",
    governance_verification: "Governance",
    outcome_tracking: "Outcomes",
    risk_escalation: "Risk Escalation",
    financial_oversight: "Financial",
    safeguarding_audit: "Safeguarding",
    aria_output_validation: "ARIA Validation",
    regulatory_interpretation: "Reg. Interpretation",
  };
  return labels[domain] ?? domain;
}

// ── Component ────────────────────────────────────────────────────────────────

export function ManagementOversightDashboardWidget() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/management-oversight?mode=dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch oversight data");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-6 w-64 bg-slate-200 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-3/4 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-700 text-sm">Error loading oversight data: {error}</p>
      </div>
    );
  }

  const { compliance, metrics, tasks } = data;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Management Oversight AI Layer
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            OpenAI (oversight) + ARIA (operational) — dual-provider governance
          </p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${getScoreColour(compliance.overallOversightScore)}`}>
            {compliance.overallOversightScore}%
          </p>
          <p className="text-xs text-slate-400">oversight score</p>
        </div>
      </div>

      {/* Provider Split */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center">
          <p className="text-xs text-emerald-600 mb-1">OpenAI (Oversight)</p>
          <p className="text-lg font-bold text-emerald-800">{metrics.openaiTasksThisMonth}</p>
          <p className="text-[10px] text-emerald-500">tasks this month</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-center">
          <p className="text-xs text-indigo-600 mb-1">ARIA (Operational)</p>
          <p className="text-lg font-bold text-indigo-800">{metrics.claudeTasksThisMonth}</p>
          <p className="text-[10px] text-indigo-500">tasks this month</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-600 mb-1">Cross-Validations</p>
          <p className="text-lg font-bold text-slate-800">{metrics.crossValidationsThisMonth}</p>
          <p className="text-[10px] text-slate-500">{metrics.agreementRate}% agreement</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Completion"
          value={`${compliance.completionRate}%`}
          sub={`${compliance.completedTasks}/${compliance.totalTasks} tasks`}
          score={compliance.completionRate}
        />
        <MetricCard
          label="Monthly Spend"
          value={`£${metrics.totalSpendThisMonth.toFixed(0)}`}
          sub={`${compliance.budgetUtilisation}% of budget`}
          score={100 - compliance.budgetUtilisation}
        />
        <MetricCard
          label="ARIA Learning"
          value={String(metrics.ariaLearningInputsThisMonth)}
          sub="inputs this month"
          score={Math.min(100, metrics.ariaLearningInputsThisMonth * 15)}
        />
        <MetricCard
          label="Internal Ready"
          value={`${metrics.ariaInternalCapableRate}%`}
          sub="could be internal"
          score={metrics.ariaInternalCapableRate}
        />
      </div>

      {/* Recent Tasks */}
      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-3">Oversight Tasks</h4>
        <div className="space-y-2">
          {tasks.filter(t => t.status === "completed").slice(0, 5).map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${getProviderColour(task.assignedProvider)}`}>
                      {getProviderShortLabel(task.assignedProvider)}
                    </span>
                    <p className="text-sm font-medium text-slate-800">{getDomainLabel(task.domain)}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Confidence: {task.confidence}%
                    {task.crossValidated && (
                      <span className={`ml-2 ${task.validationOutcome === "agreed" ? "text-green-600" : "text-amber-600"}`}>
                        {task.validationOutcome === "agreed" ? "Validated" : "Partial"}
                      </span>
                    )}
                    {task.humanApproved !== undefined && (
                      <span className="ml-2 text-blue-600">
                        {task.humanApproved ? "Approved" : "Overridden"}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${getStatusColour(task.status)}`}>
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Patterns Detected */}
      {metrics.patternsDetected > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Patterns Detected</h4>
          <p className="text-xs text-blue-700">
            {metrics.patternsDetected} actionable pattern(s) identified by OpenAI oversight this month
          </p>
        </div>
      )}

      {/* Compliance Issues */}
      {compliance.issues.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Issues ({compliance.issues.length})
          </h4>
          <ul className="space-y-1">
            {compliance.issues.map((issue, i) => (
              <li key={i} className="text-xs text-red-700 flex items-start gap-1.5">
                <span className="mt-0.5 shrink-0">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <MiniStat label="OpenAI" value={`£${metrics.openaiSpendThisMonth.toFixed(0)}`} />
          <MiniStat label="ARIA" value={`£${metrics.claudeSpendThisMonth.toFixed(0)}`} />
          <MiniStat label="Disagreements" value={String(compliance.disagreements)} />
        </div>
        <span className="text-xs text-slate-400">
          Reg 45/13 &middot; SCCIF Leadership
        </span>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  score,
}: {
  label: string;
  value: string;
  sub: string;
  score: number;
}) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-lg font-semibold ${getScoreColour(score)}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-slate-500">{label}:</span>
      <span className="text-xs font-semibold text-slate-700">{value}</span>
    </div>
  );
}
