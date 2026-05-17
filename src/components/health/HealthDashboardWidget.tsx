// ══════════════════════════════════════════════════════════════════════════════
// HealthDashboardWidget — Health & Wellbeing dashboard card
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface Metrics {
  homeId: string;
  childCount: number;
  overallComplianceRate: number;
  ihaComplianceRate: number;
  rhaComplianceRate: number;
  dentalComplianceRate: number;
  opticalComplianceRate: number;
  sdqComplianceRate: number;
  immunisationRate: number;
  averageDNARate: number;
  totalActiveMedications: number;
  medicationsOverdueReview: number;
  upcomingAppointments: { childName: string; type: string; date: string }[];
  concerns: { childName: string; concern: string }[];
}

interface Props {
  homeId?: string;
}

const TYPE_LABELS: Record<string, string> = {
  iha: "IHA",
  rha: "RHA",
  dental: "Dental",
  optical: "Optical",
  sdq: "SDQ",
  camhs: "CAMHS",
  gp: "GP",
  specialist: "Specialist",
};

export function HealthDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/health?homeId=${homeId}&view=overview`);
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

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Health & Wellbeing</h3>
              <p className="text-xs text-muted-foreground">Reg 10 — Health standard</p>
            </div>
          </div>
          <div className={`text-right px-2 py-0.5 rounded-full text-xs font-medium ${
            data.overallComplianceRate >= 90 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" :
            data.overallComplianceRate >= 70 ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" :
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}>
            {data.overallComplianceRate}%
          </div>
        </div>
      </div>

      {/* Concerns */}
      {data.concerns.length > 0 && (
        <div className="px-4 py-2.5 border-b border-border bg-red-50/50 dark:bg-red-900/10">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-medium text-red-700 dark:text-red-400">
              {data.concerns.length} health concern{data.concerns.length > 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-[10px] text-red-600 dark:text-red-400 line-clamp-1">
            {data.concerns[0].childName}: {data.concerns[0].concern}
          </p>
        </div>
      )}

      {/* Assessment compliance grid */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Assessments</p>
        <div className="grid grid-cols-3 gap-2">
          <ComplianceTile label="IHA" value={data.ihaComplianceRate} />
          <ComplianceTile label="RHA" value={data.rhaComplianceRate} />
          <ComplianceTile label="Dental" value={data.dentalComplianceRate} />
          <ComplianceTile label="Optical" value={data.opticalComplianceRate} />
          <ComplianceTile label="SDQ" value={data.sdqComplianceRate} />
          <ComplianceTile label="Immunise" value={data.immunisationRate} />
        </div>
      </div>

      {/* Medication + DNA */}
      <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
        <div className="p-3 text-center">
          <p className="text-lg font-bold">{data.totalActiveMedications}</p>
          <p className="text-[10px] text-muted-foreground">Active meds</p>
          {data.medicationsOverdueReview > 0 && (
            <p className="text-[9px] text-red-600 dark:text-red-400 mt-0.5">
              {data.medicationsOverdueReview} overdue review
            </p>
          )}
        </div>
        <div className="p-3 text-center">
          <p className={`text-lg font-bold ${data.averageDNARate > 15 ? "text-red-600 dark:text-red-400" : data.averageDNARate > 5 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
            {data.averageDNARate}%
          </p>
          <p className="text-[10px] text-muted-foreground">DNA rate</p>
        </div>
      </div>

      {/* Upcoming appointments */}
      {data.upcomingAppointments.length > 0 && (
        <div className="border-b border-border">
          <div className="px-4 py-2 bg-muted/30">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Upcoming</p>
          </div>
          <div className="divide-y divide-border">
            {data.upcomingAppointments.slice(0, 3).map((apt, i) => (
              <div key={i} className="px-4 py-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium">{apt.childName}</p>
                  <p className="text-[10px] text-muted-foreground">{TYPE_LABELS[apt.type] ?? apt.type}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(apt.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 text-center">
        <a href="/health" className="text-xs text-primary font-medium hover:underline">
          View health records →
        </a>
      </div>
    </div>
  );
}

function ComplianceTile({ label, value }: { label: string; value: number }) {
  const color = value >= 90 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
    : value >= 70 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";

  return (
    <div className={`rounded px-2 py-1.5 text-center ${color}`}>
      <p className="text-xs font-bold">{value}%</p>
      <p className="text-[9px]">{label}</p>
    </div>
  );
}
