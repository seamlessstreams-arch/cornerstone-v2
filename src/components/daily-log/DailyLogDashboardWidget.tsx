// ══════════════════════════════════════════════════════════════════════════════
// DailyLogDashboardWidget — Daily recording, mood, and compliance overview
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface ActivityMetrics {
  homeId: string;
  periodDays: number;
  totalEntries: number;
  entriesPerDay: number;
  complianceRate: number;
  averageHomeMood: number;
  eventsByCategory: { category: string; count: number }[];
  eventsByPriority: { priority: string; count: number }[];
  schoolAttendanceRate: number;
  medicationComplianceRate: number;
  nightCheckComplianceRate: number;
  handoverCompletionRate: number;
  childEngagementScores: { childId: string; childName: string; score: number }[];
}

interface Props {
  homeId?: string;
}

const MOOD_LABELS = ["", "Very low", "Low", "Okay", "Good", "Great"];
const MOOD_COLORS = ["", "text-red-600", "text-orange-600", "text-gray-600", "text-blue-600", "text-emerald-600"];

export function DailyLogDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<ActivityMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/daily-log?homeId=${homeId}&view=overview&days=7`);
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

  const moodIndex = Math.round(data.averageHomeMood);

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Daily Log</h3>
              <p className="text-xs text-muted-foreground">
                Last 7 days — {data.totalEntries} entries
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            data.complianceRate >= 90 ? "bg-emerald-100 text-emerald-800" :
            data.complianceRate >= 70 ? "bg-amber-100 text-amber-800" :
            "bg-red-100 text-red-800"
          }`}>
            {data.complianceRate}% complete
          </span>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-px bg-border">
        <Stat label="Mood" value={MOOD_LABELS[moodIndex] ?? "—"} color={MOOD_COLORS[moodIndex]} />
        <Stat label="School" value={`${data.schoolAttendanceRate}%`} alert={data.schoolAttendanceRate < 90} />
        <Stat label="Meds" value={`${data.medicationComplianceRate}%`} alert={data.medicationComplianceRate < 100} />
        <Stat label="Nights" value={`${data.nightCheckComplianceRate}%`} alert={data.nightCheckComplianceRate < 90} />
      </div>

      {/* Child engagement */}
      {data.childEngagementScores.length > 0 && (
        <div className="divide-y divide-border border-t border-border">
          {data.childEngagementScores.slice(0, 4).map(child => (
            <div key={child.childId} className="px-4 py-2.5 flex items-center justify-between">
              <p className="text-xs font-medium">{child.childName}</p>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      child.score >= 4 ? "bg-emerald-500" :
                      child.score >= 3 ? "bg-blue-500" :
                      child.score >= 2 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${(child.score / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-7 text-right">{child.score}/5</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Handover */}
      <div className="px-4 py-2.5 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Handover completion</span>
        <span className={`text-xs font-medium ${
          data.handoverCompletionRate >= 90 ? "text-emerald-600" : "text-amber-600"
        }`}>
          {data.handoverCompletionRate}%
        </span>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border text-center">
        <a href="/daily-log" className="text-xs text-primary font-medium hover:underline">
          View daily log →
        </a>
      </div>
    </div>
  );
}

function Stat({ label, value, alert, color }: { label: string; value: string; alert?: boolean; color?: string }) {
  return (
    <div className="bg-card p-3 text-center">
      <p className={`text-lg font-bold ${alert ? "text-amber-600 dark:text-amber-400" : color ?? ""}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
