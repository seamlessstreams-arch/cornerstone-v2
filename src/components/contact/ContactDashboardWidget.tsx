// ══════════════════════════════════════════════════════════════════════════════
// ContactDashboardWidget — Contact & Family Time dashboard card
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface Metrics {
  totalArrangements: number;
  activeArrangements: number;
  overallComplianceRate: number;
  averageAttendanceRate: number;
  averageCancellationRate: number;
  contactPlanRate: number;
  riskAssessmentCurrentRate: number;
  childWishesRecordedRate: number;
  upcomingSessions: { childName: string; contactPerson: string; date: string }[];
  concerns: { childName: string; concern: string }[];
  sessionsThisMonth: number;
  sessionsLastMonth: number;
  outcomeBreakdown: { positive: number; mixed: number; negative: number; neutral: number };
}

interface Props {
  homeId?: string;
}

export function ContactDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/contact?homeId=${homeId}&view=overview`);
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
        <div className="h-4 w-36 bg-muted rounded mb-4" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded" />
          <div className="h-3 w-3/4 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const totalOutcomes = data.outcomeBreakdown.positive + data.outcomeBreakdown.mixed + data.outcomeBreakdown.negative + data.outcomeBreakdown.neutral;
  const positiveRate = totalOutcomes > 0 ? Math.round((data.outcomeBreakdown.positive / totalOutcomes) * 100) : 0;
  const sessionTrend = data.sessionsThisMonth - data.sessionsLastMonth;

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Contact & Family Time</h3>
              <p className="text-xs text-muted-foreground">Reg 11 — Contact arrangements</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{data.activeArrangements}</p>
            <p className="text-[10px] text-muted-foreground">active</p>
          </div>
        </div>
      </div>

      {/* Concerns alert */}
      {data.concerns.length > 0 && (
        <div className="px-4 py-2.5 border-b border-border bg-amber-50/50 dark:bg-amber-900/10">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
              {data.concerns.length} concern{data.concerns.length > 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 line-clamp-1">
            {data.concerns[0].childName}: {data.concerns[0].concern}
          </p>
        </div>
      )}

      {/* Key Stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <div className="p-3 text-center">
          <p className={`text-lg font-bold ${data.overallComplianceRate >= 85 ? "text-emerald-600 dark:text-emerald-400" : data.overallComplianceRate >= 65 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
            {data.overallComplianceRate}%
          </p>
          <p className="text-[10px] text-muted-foreground">Compliant</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-lg font-bold">{data.averageAttendanceRate}%</p>
          <p className="text-[10px] text-muted-foreground">Attended</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-lg font-bold">{positiveRate}%</p>
          <p className="text-[10px] text-muted-foreground">Positive</p>
        </div>
      </div>

      {/* Compliance bars */}
      <div className="px-4 py-3 border-b border-border space-y-2">
        <ComplianceBar label="Contact plans" value={data.contactPlanRate} />
        <ComplianceBar label="Risk assessments" value={data.riskAssessmentCurrentRate} />
        <ComplianceBar label="Child wishes" value={data.childWishesRecordedRate} />
      </div>

      {/* Sessions trend */}
      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Sessions this month</span>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold">{data.sessionsThisMonth}</span>
          {sessionTrend !== 0 && (
            <span className={`text-[10px] ${sessionTrend > 0 ? "text-emerald-600" : "text-red-600"}`}>
              {sessionTrend > 0 ? "+" : ""}{sessionTrend}
            </span>
          )}
        </div>
      </div>

      {/* Upcoming */}
      {data.upcomingSessions.length > 0 && (
        <div className="border-b border-border">
          <div className="px-4 py-2 bg-muted/30">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Upcoming</p>
          </div>
          <div className="divide-y divide-border">
            {data.upcomingSessions.slice(0, 3).map((s, i) => (
              <div key={i} className="px-4 py-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium">{s.childName}</p>
                  <p className="text-[10px] text-muted-foreground">with {s.contactPerson}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 text-center">
        <a href="/contact" className="text-xs text-primary font-medium hover:underline">
          View all contact arrangements →
        </a>
      </div>
    </div>
  );
}

function ComplianceBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[10px] text-muted-foreground">{label}</span>
        <span className="text-[10px] font-medium">{value}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${value >= 90 ? "bg-emerald-500" : value >= 70 ? "bg-amber-500" : "bg-red-500"}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
