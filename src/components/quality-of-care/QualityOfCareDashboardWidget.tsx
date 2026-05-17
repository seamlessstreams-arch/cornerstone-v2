// ══════════════════════════════════════════════════════════════════════════════
// QualityOfCareDashboardWidget — Reg 45 quality review summary
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface DomainSummary {
  domain: string;
  score: number;
  grade: string;
  strengths: string[];
  areasForImprovement: string[];
}

interface QualityReview {
  homeId: string;
  homeName: string;
  overallGrade: string;
  overallScore: number;
  domains: DomainSummary[];
  topStrengths: string[];
  priorityActions: string[];
  regulatoryCompliance: {
    reg44Compliant: boolean;
    notifiableEventsCompliant: boolean;
    statementOfPurposeCurrent: boolean;
    staffingAdequate: boolean;
    recordKeepingAdequate: boolean;
  };
  previousReviewComparison?: {
    previousScore: number;
    trend: string;
  };
}

interface Props {
  homeId?: string;
}

const GRADE_STYLES: Record<string, string> = {
  outstanding: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  good: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  requires_improvement: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  inadequate: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const GRADE_LABELS: Record<string, string> = {
  outstanding: "Outstanding",
  good: "Good",
  requires_improvement: "RI",
  inadequate: "Inadequate",
};

const DOMAIN_SHORT: Record<string, string> = {
  overall_experiences: "Overall",
  safety: "Safety",
  education_and_learning: "Education",
  health_and_wellbeing: "Health",
  positive_relationships: "Relationships",
  protection_of_children: "Protection",
  leadership_and_management: "Leadership",
};

const TREND_ICONS: Record<string, string> = {
  improving: "↑",
  stable: "→",
  declining: "↓",
};

export function QualityOfCareDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<QualityReview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/quality-of-care?homeId=${homeId}`);
      const json = await res.json();
      setData(json);
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 animate-pulse">
        <div className="h-4 w-32 bg-muted rounded mb-4" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded" />
          <div className="h-3 w-3/4 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const domainScores = data.domains.filter(d => d.domain !== "overall_experiences");

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Quality of Care (Reg 45)</h3>
              <p className="text-xs text-muted-foreground">
                SCCIF self-assessment
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {data.previousReviewComparison && (
              <span className={`text-xs font-medium ${
                data.previousReviewComparison.trend === "improving" ? "text-emerald-600" :
                data.previousReviewComparison.trend === "declining" ? "text-red-600" : "text-gray-500"
              }`}>
                {TREND_ICONS[data.previousReviewComparison.trend]}
              </span>
            )}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${GRADE_STYLES[data.overallGrade] ?? ""}`}>
              {GRADE_LABELS[data.overallGrade] ?? data.overallGrade}
            </span>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Overall quality score</span>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                data.overallScore >= 85 ? "bg-emerald-500" :
                data.overallScore >= 65 ? "bg-blue-500" :
                data.overallScore >= 40 ? "bg-amber-500" : "bg-red-500"
              }`}
              style={{ width: `${data.overallScore}%` }}
            />
          </div>
          <span className="text-sm font-bold">{data.overallScore}%</span>
        </div>
      </div>

      {/* Domain Scores */}
      <div className="divide-y divide-border">
        {domainScores.map(domain => (
          <div key={domain.domain} className="px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-medium">{DOMAIN_SHORT[domain.domain] ?? domain.domain}</span>
            <div className="flex items-center gap-2">
              <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    domain.score >= 85 ? "bg-emerald-500" :
                    domain.score >= 65 ? "bg-blue-500" :
                    domain.score >= 40 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${domain.score}%` }}
                />
              </div>
              <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${GRADE_STYLES[domain.grade] ?? ""}`}>
                {GRADE_LABELS[domain.grade] ?? domain.grade}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Regulatory Compliance */}
      <div className="px-4 py-3 border-t border-border">
        <p className="text-xs text-muted-foreground mb-1.5">Regulatory compliance</p>
        <div className="flex flex-wrap gap-1.5">
          <ComplianceChip label="Reg 44" ok={data.regulatoryCompliance.reg44Compliant} />
          <ComplianceChip label="Notifications" ok={data.regulatoryCompliance.notifiableEventsCompliant} />
          <ComplianceChip label="SoP" ok={data.regulatoryCompliance.statementOfPurposeCurrent} />
          <ComplianceChip label="Staffing" ok={data.regulatoryCompliance.staffingAdequate} />
          <ComplianceChip label="Records" ok={data.regulatoryCompliance.recordKeepingAdequate} />
        </div>
      </div>

      {/* Priority Actions */}
      {data.priorityActions.length > 0 && (
        <div className="border-t border-border bg-amber-50/50 dark:bg-amber-900/10 p-3">
          <p className="text-[10px] font-medium text-amber-700 dark:text-amber-400 mb-1">Priority actions:</p>
          <p className="text-xs text-amber-700 dark:text-amber-400 line-clamp-2">
            {data.priorityActions[0]}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-border text-center">
        <a href="/quality-of-care" className="text-xs text-primary font-medium hover:underline">
          View full Reg 45 review →
        </a>
      </div>
    </div>
  );
}

function ComplianceChip({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
      ok
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
    }`}>
      {ok ? "✓" : "✗"} {label}
    </span>
  );
}
