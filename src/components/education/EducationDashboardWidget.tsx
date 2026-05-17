// ══════════════════════════════════════════════════════════════════════════════
// EducationDashboardWidget — Education, PEP, attendance & attainment overview
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface EducationMetrics {
  homeId: string;
  childCount: number;
  averageAttendance: number;
  pepComplianceRate: number;
  exclusionCount: number;
  exclusionDays: number;
  averageTargetProgress: number;
  childrenBelowExpected: number;
  childrenAtExpected: number;
  childrenAboveExpected: number;
  totalPPAllocation: number;
  totalPPSpent: number;
  ppUtilisationRate: number;
  concerns: { childId: string; childName: string; concern: string }[];
}

interface Props {
  homeId?: string;
}

export function EducationDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<EducationMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/education?homeId=${homeId}&view=overview`);
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

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Education & PEP</h3>
              <p className="text-xs text-muted-foreground">
                {data.childCount} children tracked
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            data.averageAttendance >= 95 ? "bg-emerald-100 text-emerald-800" :
            data.averageAttendance >= 90 ? "bg-amber-100 text-amber-800" :
            "bg-red-100 text-red-800"
          }`}>
            {data.averageAttendance}% attendance
          </span>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-px bg-border">
        <Stat label="PEP" value={`${data.pepComplianceRate}%`} alert={data.pepComplianceRate < 100} />
        <Stat label="Progress" value={`${data.averageTargetProgress}%`} />
        <Stat label="PP Spend" value={`${data.ppUtilisationRate}%`} alert={data.ppUtilisationRate < 60} />
        <Stat label="Exclude" value={String(data.exclusionDays)} alert={data.exclusionDays > 0} suffix="d" />
      </div>

      {/* Attainment bar */}
      <div className="px-4 py-3 border-t border-border">
        <p className="text-xs text-muted-foreground mb-1.5">Attainment spread</p>
        <div className="h-2 bg-muted rounded-full overflow-hidden flex">
          {data.childrenAboveExpected > 0 && (
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${(data.childrenAboveExpected / data.childCount) * 100}%` }}
            />
          )}
          {data.childrenAtExpected > 0 && (
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${(data.childrenAtExpected / data.childCount) * 100}%` }}
            />
          )}
          {data.childrenBelowExpected > 0 && (
            <div
              className="bg-amber-500 h-full"
              style={{ width: `${(data.childrenBelowExpected / data.childCount) * 100}%` }}
            />
          )}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-emerald-600">{data.childrenAboveExpected} above</span>
          <span className="text-[10px] text-blue-600">{data.childrenAtExpected} at</span>
          <span className="text-[10px] text-amber-600">{data.childrenBelowExpected} below</span>
        </div>
      </div>

      {/* Concerns */}
      {data.concerns.length > 0 && (
        <div className="divide-y divide-border border-t border-border">
          {data.concerns.slice(0, 3).map((c, i) => (
            <div key={i} className="px-4 py-2 flex items-center justify-between">
              <p className="text-xs font-medium">{c.childName}</p>
              <span className="text-xs text-amber-600 dark:text-amber-400 truncate max-w-[140px]">
                {c.concern}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* PP Budget */}
      <div className="px-4 py-2.5 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Pupil Premium</span>
        <span className="text-xs font-medium">
          £{(data.totalPPSpent / 1000).toFixed(1)}k / £{(data.totalPPAllocation / 1000).toFixed(1)}k
        </span>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border text-center">
        <a href="/education" className="text-xs text-primary font-medium hover:underline">
          View education dashboard →
        </a>
      </div>
    </div>
  );
}

function Stat({ label, value, alert, suffix }: { label: string; value: string; alert?: boolean; suffix?: string }) {
  return (
    <div className="bg-card p-3 text-center">
      <p className={`text-lg font-bold ${alert ? "text-amber-600 dark:text-amber-400" : ""}`}>
        {value}{suffix && <span className="text-xs font-normal">{suffix}</span>}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
