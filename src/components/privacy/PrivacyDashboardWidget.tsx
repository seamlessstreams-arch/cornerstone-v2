// ══════════════════════════════════════════════════════════════════════════════
// PrivacyDashboardWidget — Children's Privacy & Confidentiality card
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface ChildResult {
  childId: string;
  childName: string;
  isCompliant: boolean;
  issues: string[];
  warnings: string[];
  physicalPrivacyScore: number;
  digitalPrivacyScore: number;
  dataProtectionScore: number;
  informationSharingScore: number;
  contactPrivacyScore: number;
  overallPrivacyScore: number;
  totalIncidents: number;
  unresolvedIncidents: number;
  highSeverityIncidents: number;
  assessmentCoverage: number;
  childConsulted: boolean;
  childFeelsRespected: boolean | null;
}

interface HomeMetrics {
  homeId: string;
  totalChildren: number;
  averagePhysicalScore: number;
  averageDigitalScore: number;
  averageDataScore: number;
  averageOverallScore: number;
  childrenWithIssues: number;
  totalIncidents: number;
  unresolvedIncidents: number;
  staffTrainingCurrent: boolean;
  knockingPolicyRate: number;
  ownBedroomRate: number;
  averageAssessmentCoverage: number;
  complianceIssues: string[];
  overallScore: number;
}

interface DashboardData {
  metrics: HomeMetrics;
  childResults: ChildResult[];
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function getScoreColour(score: number): string {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

function getScoreBg(score: number): string {
  if (score >= 75) return "bg-green-50";
  if (score >= 50) return "bg-amber-50";
  return "bg-red-50";
}

// ── Component ────────────────────────────────────────────────────────────────

export function PrivacyDashboardWidget() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/privacy?homeId=home-oak&mode=dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch privacy data");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-6 w-52 bg-slate-200 rounded mb-4" />
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
        <p className="text-red-700 text-sm">Error loading privacy data: {error}</p>
      </div>
    );
  }

  const { metrics, childResults } = data;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Privacy & Confidentiality
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Physical, digital, records, information sharing
          </p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${getScoreColour(metrics.overallScore)}`}>
            {metrics.overallScore}%
          </p>
          <p className="text-xs text-slate-400">overall score</p>
        </div>
      </div>

      {/* Domain Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Physical"
          value={`${metrics.averagePhysicalScore}%`}
          sub={`${metrics.ownBedroomRate}% own room`}
          score={metrics.averagePhysicalScore}
        />
        <MetricCard
          label="Digital"
          value={`${metrics.averageDigitalScore}%`}
          sub="devices & comms"
          score={metrics.averageDigitalScore}
        />
        <MetricCard
          label="Data Protection"
          value={`${metrics.averageDataScore}%`}
          sub="records & access"
          score={metrics.averageDataScore}
        />
        <MetricCard
          label="Assessment"
          value={`${metrics.averageAssessmentCoverage}%`}
          sub="domains covered"
          score={metrics.averageAssessmentCoverage}
        />
      </div>

      {/* Policy Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <PolicyBadge label="Knocking Policy" value={metrics.knockingPolicyRate} />
        <PolicyBadge label="Own Bedroom" value={metrics.ownBedroomRate} />
        <PolicyBadge
          label="Staff Training"
          value={metrics.staffTrainingCurrent ? 100 : 0}
          textOverride={metrics.staffTrainingCurrent ? "Current" : "Overdue"}
        />
        <PolicyBadge
          label="Incidents"
          value={metrics.unresolvedIncidents === 0 ? 100 : 30}
          textOverride={metrics.unresolvedIncidents === 0 ? "None open" : `${metrics.unresolvedIncidents} unresolved`}
        />
      </div>

      {/* Per-Child Summary */}
      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-3">Children's Privacy Status</h4>
        <div className="space-y-2">
          {childResults.map((child) => (
            <div
              key={child.childId}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getScoreBg(child.overallPrivacyScore)} ${getScoreColour(child.overallPrivacyScore)}`}>
                  {child.overallPrivacyScore}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{child.childName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <ScoreBar label="Physical" score={child.physicalPrivacyScore} />
                    <ScoreBar label="Digital" score={child.digitalPrivacyScore} />
                    <ScoreBar label="Data" score={child.dataProtectionScore} />
                    <ScoreBar label="Info" score={child.informationSharingScore} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {child.unresolvedIncidents > 0 && (
                  <span className="text-xs bg-red-50 text-red-700 px-1.5 py-0.5 rounded">
                    {child.unresolvedIncidents} open
                  </span>
                )}
                {child.childFeelsRespected === true && (
                  <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                    Feels respected
                  </span>
                )}
                {child.childFeelsRespected === null && (
                  <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    Not consulted
                  </span>
                )}
                {child.issues.length === 0 && child.unresolvedIncidents === 0 && (
                  <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                    Compliant
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Issues */}
      {metrics.complianceIssues.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Issues ({metrics.complianceIssues.length})
          </h4>
          <ul className="space-y-1">
            {metrics.complianceIssues.map((issue, i) => (
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
          <MiniStat label="Total incidents" value={String(metrics.totalIncidents)} />
          <MiniStat label="Children with issues" value={String(metrics.childrenWithIssues)} />
        </div>
        <span className="text-xs text-slate-400">
          Reg 21 &middot; UK GDPR &middot; UNCRC Art 16
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

function PolicyBadge({
  label,
  value,
  textOverride,
}: {
  label: string;
  value: number;
  textOverride?: string;
}) {
  const colour = value >= 100 ? "bg-green-50 border-green-100 text-green-700" :
                 value >= 50 ? "bg-amber-50 border-amber-100 text-amber-700" :
                 "bg-red-50 border-red-100 text-red-700";
  return (
    <div className={`rounded-lg p-2.5 border text-center ${colour}`}>
      <p className="text-[10px] text-slate-500 mb-0.5">{label}</p>
      <p className="text-xs font-semibold">{textOverride ?? `${value}%`}</p>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const colour = score >= 75 ? "bg-green-400" : score >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-1">
      <span className="text-[9px] text-slate-400">{label}</span>
      <div className="w-8 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${colour}`} style={{ width: `${score}%` }} />
      </div>
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
