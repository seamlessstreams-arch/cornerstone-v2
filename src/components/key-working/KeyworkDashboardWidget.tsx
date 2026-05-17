// ══════════════════════════════════════════════════════════════════════════════
// KeyworkDashboardWidget — Key working metrics and compliance for home dashboard
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface KeyworkData {
  metrics: {
    totalSessions: number;
    sessionsThisMonth: number;
    completionRate: number;
    declinedRate: number;
    averageEngagement: number;
    averageDuration: number;
    moodImprovementRate: number;
    childVoiceRate: number;
    goalProgressRate: number;
    complianceRate: number;
    byChild: {
      childId: string;
      childName: string;
      keyworkerName: string;
      sessionsThisMonth: number;
      averageEngagement: number;
      averageMoodChange: number;
      relationshipQuality: string;
      isCompliant: boolean;
      overdueActions: number;
    }[];
  };
  allocations: {
    childId: string;
    childName: string;
    primaryKeyworkerName: string;
    expectedFrequency: string;
    relationshipQuality: string;
  }[];
}

interface Props {
  homeId?: string;
}

const QUALITY_STYLES: Record<string, string> = {
  strong: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  developing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  new: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  strained: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  breakdown: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export function KeyworkDashboardWidget({ homeId = "home-001" }: Props) {
  const [data, setData] = useState<KeyworkData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/key-working?homeId=${homeId}`);
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

  const { metrics } = data;
  const nonCompliant = metrics.byChild.filter(c => !c.isCompliant);

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Key Working</h3>
              <p className="text-xs text-muted-foreground">
                {metrics.sessionsThisMonth} sessions this month
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            metrics.complianceRate >= 90 ? "bg-emerald-100 text-emerald-800" :
            metrics.complianceRate >= 70 ? "bg-amber-100 text-amber-800" :
            "bg-red-100 text-red-800"
          }`}>
            {metrics.complianceRate}% compliant
          </span>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-px bg-border">
        <Stat label="Engagement" value={`${metrics.averageEngagement}/5`} />
        <Stat label="Mood ↑" value={`${metrics.moodImprovementRate}%`} />
        <Stat label="Voice" value={`${metrics.childVoiceRate}%`} />
        <Stat label="Goals" value={`${metrics.goalProgressRate}%`} />
      </div>

      {/* Per-child */}
      <div className="divide-y divide-border">
        {metrics.byChild.map(child => (
          <div key={child.childId} className="px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!child.isCompliant && (
                <span className="w-2 h-2 rounded-full bg-red-500" title="Non-compliant" />
              )}
              <div>
                <p className="text-xs font-medium">{child.childName}</p>
                <p className="text-xs text-muted-foreground">{child.keyworkerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${QUALITY_STYLES[child.relationshipQuality] ?? ""}`}>
                {child.relationshipQuality}
              </span>
              <span className="text-xs text-muted-foreground">
                {child.sessionsThisMonth} this month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Non-compliant warning */}
      {nonCompliant.length > 0 && (
        <div className="border-t border-border bg-amber-50/50 dark:bg-amber-900/10 p-3">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
            {nonCompliant.length} child{nonCompliant.length !== 1 ? "ren" : ""} below keywork frequency requirement
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-border text-center">
        <a href="/key-working" className="text-xs text-primary font-medium hover:underline">
          View all keywork sessions →
        </a>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-3 text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
