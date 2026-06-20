"use client";

import { useHomePlacementStabilityIntelligence } from "@/hooks/use-home-placement-stability-intelligence";
import type {
  TenureProfile,
  IncidentProfile,
  MissingProfile,
  StabilityInsight,
  StabilityRecommendation,
  PlacementStabilityRating,
} from "@/lib/engines/home-placement-stability-intelligence-engine";

const RATING_STYLES: Record<PlacementStabilityRating, { badge: string; banner: string }> = {
  outstanding:        { badge: "bg-green-100 text-green-700 border-green-300",  banner: "border-green-300 bg-green-50" },
  good:               { badge: "bg-blue-100 text-blue-700 border-blue-300",     banner: "border-blue-300 bg-blue-50" },
  adequate:           { badge: "bg-amber-100 text-amber-700 border-amber-300",  banner: "border-amber-300 bg-amber-50" },
  inadequate:         { badge: "bg-red-100 text-red-700 border-red-300",        banner: "border-red-300 bg-red-50" },
  insufficient_data:  { badge: "bg-slate-100 text-slate-500 border-slate-200",  banner: "border-slate-200 bg-slate-50" },
};

const URGENCY_STYLES: Record<string, string> = {
  immediate: "border-red-300 bg-red-50 text-red-700",
  soon:      "border-amber-300 bg-amber-50 text-amber-700",
  planned:   "border-slate-200 bg-slate-50 text-slate-600",
};

const INSIGHT_BORDER: Record<string, string> = {
  critical: "border-red-400 bg-red-50 text-red-800",
  warning:  "border-amber-300 bg-amber-50 text-amber-800",
  positive: "border-green-300 bg-green-50 text-green-800",
};

function StatBox({ label, value, alert, sub }: { label: string; value: string | number; alert?: boolean; sub?: string }) {
  return (
    <div className={`rounded-lg border p-4 ${alert ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white"}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-2xl font-bold ${alert ? "text-amber-700" : "text-slate-800"}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export default function PlacementStabilityIntelligencePage() {
  const { data, isLoading, isError } = useHomePlacementStabilityIntelligence();

  if (isLoading) {
    return <div className="flex items-center justify-center p-12 text-slate-500">Loading placement stability intelligence…</div>;
  }
  if (isError || !data?.data) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">Could not load placement stability intelligence.</div>;
  }

  const d = data.data;
  const styles = RATING_STYLES[d.stability_rating];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Placement Stability Intelligence</h1>
        <p className="text-sm text-slate-500 mt-1">
          Placement tenure, incident patterns, missing episode trends, and overall stability rating.
        </p>
      </div>

      {/* Stability rating banner */}
      <div className={`rounded-lg border px-5 py-4 flex items-center gap-4 ${styles.banner}`}>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Stability rating</p>
          <span className={`rounded border px-2 py-1 text-sm font-semibold capitalize ${styles.badge}`}>
            {d.stability_rating.replace(/_/g, " ")}
          </span>
        </div>
        <div className="h-8 w-px bg-slate-200" />
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-700">{d.headline}</p>
          <p className="text-xs text-slate-500 mt-0.5">Score: {d.stability_score}/100</p>
        </div>
      </div>

      {/* Tenure profile */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">Placement Tenure</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatBox label="Avg tenure" value={`${Math.round(d.tenure_profile.avg_tenure_days / 30)}mo`} />
          <StatBox label="Longest tenure" value={`${Math.round(d.tenure_profile.longest_tenure_days / 30)}mo`} />
          <StatBox label="Over 6 months" value={d.tenure_profile.children_over_6_months} />
          <StatBox label="Under 3 months" value={d.tenure_profile.children_under_3_months} alert={d.tenure_profile.children_under_3_months > 0} sub="new placements" />
        </div>
      </div>

      {/* Incident + missing profiles side by side */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">Incident Profile</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatBox label="Total incidents" value={d.incident_profile.total_incidents} alert={d.incident_profile.total_incidents > 5} />
            <StatBox label="Per child" value={d.incident_profile.incident_rate.toFixed(1)} alert={d.incident_profile.incident_rate > 2} />
            <StatBox label="High severity" value={d.incident_profile.high_severity_count} alert={d.incident_profile.high_severity_count > 0} />
            <StatBox label="Children with incidents" value={d.incident_profile.children_with_incidents} />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">Missing Episode Profile</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatBox label="Total episodes" value={d.missing_profile.total_episodes} alert={d.missing_profile.total_episodes > 3} />
            <StatBox label="Per child" value={d.missing_profile.episodes_per_child.toFixed(1)} />
            <StatBox label="High risk episodes" value={d.missing_profile.high_risk_count} alert={d.missing_profile.high_risk_count > 0} />
            <StatBox label="RHI rate" value={`${d.missing_profile.return_interview_rate}%`} alert={d.missing_profile.return_interview_rate < 100 && d.missing_profile.total_episodes > 0} />
          </div>
        </div>
      </div>

      {/* Stability profile */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatBox label="Children with no events" value={d.stability_profile.children_with_no_events} />
        <StatBox label="Stability rate" value={`${d.stability_profile.stability_rate}%`} />
        <StatBox label="Avg risk flags / child" value={d.stability_profile.avg_risk_flags.toFixed(1)} alert={d.stability_profile.avg_risk_flags > 2} />
      </div>

      {/* Strengths + concerns */}
      {(d.strengths.length > 0 || d.concerns.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {d.strengths.length > 0 && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-2">
              <h2 className="text-sm font-semibold text-green-700">Strengths</h2>
              <ul className="space-y-1">
                {d.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {d.concerns.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-2">
              <h2 className="text-sm font-semibold text-amber-700">Concerns</h2>
              <ul className="space-y-1">
                {d.concerns.map((c, i) => (
                  <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {d.recommendations.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-700">Recommendations</h2>
          {d.recommendations.map((r: StabilityRecommendation) => (
            <div key={r.rank} className={`rounded-lg border px-4 py-3 space-y-1 ${URGENCY_STYLES[r.urgency] ?? "border-slate-200 bg-slate-50"}`}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide">{r.urgency}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500">{r.regulatory_ref}</span>
              </div>
              <p className="text-sm">{r.recommendation}</p>
            </div>
          ))}
        </div>
      )}

      {/* Insights */}
      {d.insights.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-700">Cara Insights</h2>
          {d.insights.map((i: StabilityInsight, idx: number) => (
            <div key={idx} className={`rounded-lg border px-3 py-2 text-sm ${INSIGHT_BORDER[i.severity] ?? "border-slate-200 bg-slate-50 text-slate-700"}`}>
              {i.text}
            </div>
          ))}
        </div>
      )}

      {/* Regulatory */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        <span className="font-semibold text-slate-600">Regulatory note: </span>
        Placement stability is a primary outcome indicator in ILACS and SCCIF inspections. CHR 2015
        Reg 12 requires placement matching to minimise disruption risk. Missing episode return home
        interviews (statutory guidance 2014) must be completed 100% of the time. Ofsted considers
        both the frequency of incidents and evidence of a positive behaviour support culture when
        judging how well children are helped and protected.
      </div>
    </div>
  );
}
