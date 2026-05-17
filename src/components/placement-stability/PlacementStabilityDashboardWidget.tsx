// ══════════════════════════════════════════════════════════════════════════════
// PlacementStabilityDashboardWidget — Placement stability & matching overview
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface StabilityMetrics {
  homeId: string;
  homeName: string;
  totalPlacements: number;
  activePlacements: number;
  averageDaysInPlacement: number;
  averageStabilityScore: number;
  placementsAtRisk: number;
  plannedEndings: number;
  disruptionRate: number;
  averageMatchingScore: number;
  occupancyRate: number;
  stabilityByChild: { childId: string; childName: string; score: number; days: number }[];
  riskSummary: { indicator: string; count: number }[];
}

interface Props {
  homeId?: string;
}

export function PlacementStabilityDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<StabilityMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/placement-stability?homeId=${homeId}&view=overview`);
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

  const stabilityColor = data.averageStabilityScore >= 75 ? "text-emerald-600" :
    data.averageStabilityScore >= 50 ? "text-amber-600" : "text-red-600";

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Placement Stability</h3>
              <p className="text-xs text-muted-foreground">
                {data.activePlacements} active placements
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            data.placementsAtRisk === 0 ? "bg-emerald-100 text-emerald-800" :
            data.placementsAtRisk <= 1 ? "bg-amber-100 text-amber-800" :
            "bg-red-100 text-red-800"
          }`}>
            {data.placementsAtRisk === 0 ? "All stable" : `${data.placementsAtRisk} at risk`}
          </span>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-px bg-border">
        <Stat label="Stability" value={`${data.averageStabilityScore}%`} color={stabilityColor} />
        <Stat label="Match" value={`${data.averageMatchingScore}%`} />
        <Stat label="Occupancy" value={`${data.occupancyRate}%`} />
        <Stat label="Disruption" value={`${data.disruptionRate}%`} alert={data.disruptionRate > 15} />
      </div>

      {/* Per-child stability */}
      <div className="divide-y divide-border border-t border-border">
        {data.stabilityByChild.slice(0, 4).map(child => (
          <div key={child.childId} className="px-4 py-2.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium">{child.childName}</p>
              <p className="text-[10px] text-muted-foreground">{child.days} days</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    child.score >= 75 ? "bg-emerald-500" :
                    child.score >= 50 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${child.score}%` }}
                />
              </div>
              <span className="text-xs font-medium w-8 text-right">{child.score}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Risk indicators */}
      {data.riskSummary.length > 0 && (
        <div className="border-t border-border bg-amber-50/50 dark:bg-amber-900/10 p-3">
          <div className="flex flex-wrap gap-2">
            {data.riskSummary.slice(0, 4).map(r => (
              <span key={r.indicator} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                {r.indicator.replace(/_/g, " ")} ({r.count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-border text-center">
        <a href="/placement-stability" className="text-xs text-primary font-medium hover:underline">
          View placement stability →
        </a>
      </div>
    </div>
  );
}

function Stat({ label, value, alert, color }: { label: string; value: string; alert?: boolean; color?: string }) {
  return (
    <div className="bg-card p-3 text-center">
      <p className={`text-lg font-bold ${alert ? "text-red-600 dark:text-red-400" : color ?? ""}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
