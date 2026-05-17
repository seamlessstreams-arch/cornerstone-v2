// ══════════════════════════════════════════════════════════════════════════════
// MissingFromCareDashboardWidget — Live missing episodes overview
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface MissingMetrics {
  totalEpisodes: number;
  activeEpisodes: number;
  episodesThisMonth: number;
  episodesThisQuarter: number;
  returnInterviewCompliance: number;
  averageResponseMinutes: number;
  childrenWithEpisodes: number;
  repeatMissers: number;
  exploitationConcerns: number;
  complianceRate: number;
}

interface ActiveEpisode {
  id: string;
  childId: string;
  childName: string;
  riskGrading: string;
  reportedMissingAt: string;
  lastSeenLocation: string;
  exploitationConcern: boolean;
}

interface MissingData {
  metrics: MissingMetrics;
  activeEpisodes: ActiveEpisode[];
  recentEpisodes: unknown[];
}

interface Props {
  homeId?: string;
}

const RISK_STYLES: Record<string, string> = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  very_high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export function MissingFromCareDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<MissingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/missing-from-care?homeId=${homeId}&view=overview`);
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

  const { metrics, activeEpisodes } = data;

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              activeEpisodes.length > 0
                ? "bg-gradient-to-br from-red-500 to-red-700 animate-pulse"
                : "bg-gradient-to-br from-sky-500 to-blue-600"
            }`}>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Missing From Care</h3>
              <p className="text-xs text-muted-foreground">
                {metrics.episodesThisMonth} episode{metrics.episodesThisMonth !== 1 ? "s" : ""} this month
              </p>
            </div>
          </div>
          {activeEpisodes.length > 0 ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 animate-pulse">
              {activeEpisodes.length} ACTIVE
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              All present
            </span>
          )}
        </div>
      </div>

      {/* Active Episodes Alert */}
      {activeEpisodes.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          {activeEpisodes.map(ep => (
            <div key={ep.id} className="px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <div>
                  <p className="text-xs font-medium text-red-800 dark:text-red-200">{ep.childName}</p>
                  <p className="text-[10px] text-red-600 dark:text-red-400">
                    Since {new Date(ep.reportedMissingAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${RISK_STYLES[ep.riskGrading] ?? ""}`}>
                  {ep.riskGrading}
                </span>
                {ep.exploitationConcern && (
                  <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    CSE
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-px bg-border">
        <Stat label="Quarter" value={String(metrics.episodesThisQuarter)} />
        <Stat label="RI Done" value={`${metrics.returnInterviewCompliance}%`} />
        <Stat label="Repeat" value={String(metrics.repeatMissers)} alert={metrics.repeatMissers > 0} />
        <Stat label="CSE" value={String(metrics.exploitationConcerns)} alert={metrics.exploitationConcerns > 0} />
      </div>

      {/* Compliance */}
      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Overall compliance</span>
        <span className={`text-xs font-medium ${
          metrics.complianceRate >= 90 ? "text-emerald-600" :
          metrics.complianceRate >= 70 ? "text-amber-600" : "text-red-600"
        }`}>
          {metrics.complianceRate}%
        </span>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border text-center">
        <a href="/missing-from-care" className="text-xs text-primary font-medium hover:underline">
          View missing episodes →
        </a>
      </div>
    </div>
  );
}

function Stat({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className="bg-card p-3 text-center">
      <p className={`text-lg font-bold ${alert ? "text-red-600 dark:text-red-400" : ""}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
