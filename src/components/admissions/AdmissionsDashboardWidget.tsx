// ══════════════════════════════════════════════════════════════════════════════
// AdmissionsDashboardWidget — Admissions & Impact Assessment dashboard card
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface ReferralSummary {
  id: string;
  childName: string;
  childAge: number;
  status: string;
  admissionType: string;
  referralDate: string;
  placingAuthority: string;
  matchScore: number | null;
  isCompliant: boolean | null;
}

interface Metrics {
  totalReferralsLast12Months: number;
  admittedCount: number;
  declinedCount: number;
  pendingCount: number;
  impactAssessmentRate: number;
  childConsultationRate: number;
  averageMatchScore: number;
  postAdmissionReviewRate: number;
  occupancyRate: number;
  currentOccupancy: number;
  maxCapacity: number;
}

interface DashboardData {
  metrics: Metrics;
  referrals: ReferralSummary[];
  complianceIssues: string[];
}

// ── Status helpers ───────────────────────────────────────────────────────────

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    received: "Received",
    under_assessment: "Under Assessment",
    impact_assessment_complete: "Assessment Complete",
    approved: "Approved",
    declined: "Declined",
    withdrawn: "Withdrawn",
    admitted: "Admitted",
  };
  return labels[status] ?? status;
}

function getStatusColour(status: string): string {
  switch (status) {
    case "admitted":
      return "bg-green-100 text-green-800";
    case "declined":
      return "bg-red-100 text-red-800";
    case "withdrawn":
      return "bg-gray-100 text-gray-600";
    case "under_assessment":
    case "impact_assessment_complete":
      return "bg-amber-100 text-amber-800";
    case "approved":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getAdmissionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    planned: "Planned",
    emergency: "Emergency",
    respite: "Respite",
    step_down: "Step-down",
  };
  return labels[type] ?? type;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Component ────────────────────────────────────────────────────────────────

export function AdmissionsDashboardWidget() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admissions?homeId=home-oak&mode=dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch admissions data");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-3/4 bg-slate-100 rounded" />
          <div className="h-4 w-1/2 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-700 text-sm">Error loading admissions data: {error}</p>
      </div>
    );
  }

  const { metrics, referrals, complianceIssues } = data;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Admissions & Impact Assessment
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Referral matching, impact on existing children, placement decisions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Occupancy</span>
          <span className="text-sm font-semibold text-slate-700">
            {metrics.currentOccupancy}/{metrics.maxCapacity}
          </span>
          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                metrics.occupancyRate >= 100
                  ? "bg-red-500"
                  : metrics.occupancyRate >= 80
                  ? "bg-amber-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(metrics.occupancyRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Referrals (12m)"
          value={metrics.totalReferralsLast12Months}
          sub={`${metrics.admittedCount} admitted, ${metrics.declinedCount} declined`}
        />
        <MetricCard
          label="Impact Assessment"
          value={`${metrics.impactAssessmentRate}%`}
          sub="completion rate"
          alert={metrics.impactAssessmentRate < 100}
        />
        <MetricCard
          label="Child Consultation"
          value={`${metrics.childConsultationRate}%`}
          sub="existing children consulted"
          alert={metrics.childConsultationRate < 100}
        />
        <MetricCard
          label="Avg Match Score"
          value={`${metrics.averageMatchScore}/5`}
          sub="across admitted children"
          alert={metrics.averageMatchScore < 3}
        />
      </div>

      {/* Referral List */}
      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-3">Recent Referrals</h4>
        <div className="space-y-2">
          {referrals.map((referral) => (
            <div
              key={referral.id}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {referral.childName}
                    <span className="text-slate-400 font-normal ml-1">
                      ({referral.childAge}yrs)
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {referral.placingAuthority} &middot;{" "}
                    {getAdmissionTypeLabel(referral.admissionType)} &middot;{" "}
                    {formatDate(referral.referralDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {referral.matchScore !== null && (
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      referral.matchScore >= 4
                        ? "bg-green-50 text-green-700"
                        : referral.matchScore >= 3
                        ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    Match: {referral.matchScore}/5
                  </span>
                )}
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusColour(
                    referral.status
                  )}`}
                >
                  {getStatusLabel(referral.status)}
                </span>
                {referral.isCompliant === false && (
                  <span className="text-xs text-red-600" title="Compliance issues">
                    ⚠
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Issues */}
      {complianceIssues.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Compliance Issues ({complianceIssues.length})
          </h4>
          <ul className="space-y-1">
            {complianceIssues.map((issue, i) => (
              <li key={i} className="text-xs text-red-700 flex items-start gap-1.5">
                <span className="mt-0.5 shrink-0">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Post-Admission Review */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <MiniStat
            label="Post-Admission Reviews"
            value={`${metrics.postAdmissionReviewRate}%`}
            alert={metrics.postAdmissionReviewRate < 100}
          />
          <MiniStat
            label="Pending"
            value={String(metrics.pendingCount)}
            alert={metrics.pendingCount > 0}
          />
        </div>
        <span className="text-xs text-slate-400">
          Reg 5, 12, 14 &middot; SCCIF Matching
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
  alert,
}: {
  label: string;
  value: string | number;
  sub: string;
  alert?: boolean;
}) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p
        className={`text-lg font-semibold ${
          alert ? "text-red-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  alert,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-slate-500">{label}:</span>
      <span
        className={`text-xs font-semibold ${
          alert ? "text-amber-600" : "text-slate-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
