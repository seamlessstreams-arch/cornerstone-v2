// ══════════════════════════════════════════════════════════════════════════════
// EnvironmentDashboardWidget — Environmental Safety dashboard card
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";

interface Compliance {
  isCompliant: boolean;
  fireComplianceScore: number;
  generalSafetyScore: number;
  certificatesValid: boolean;
  gasValid: boolean;
  electricalValid: boolean;
  legionellaValid: boolean;
  fireDrillsCurrent: boolean;
  fireDrillCount12Months: number;
  averageEvacuationTime: number;
}

interface Metrics {
  overallComplianceRate: number;
  checksOverdue: number;
  checksDueSoon: number;
  maintenanceOpenCount: number;
  emergencyMaintenanceOpen: number;
  maintenanceCompletedThisMonth: number;
  averageCompletionDays: number;
}

interface CertificateStatus {
  name: string;
  valid: boolean;
  expiryDate?: string;
}

interface MaintenanceItem {
  id: string;
  description: string;
  location: string;
  priority: string;
  priorityLabel: string;
  status: string;
  statusLabel: string;
  safetyRelated: boolean;
}

interface DashboardData {
  compliance: Compliance;
  metrics: Metrics;
  openMaintenance: MaintenanceItem[];
  certificateStatus: CertificateStatus[];
  issues: string[];
  warnings: string[];
}

interface Props {
  homeId?: string;
}

const PRIORITY_STYLES: Record<string, string> = {
  emergency: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  urgent: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  routine: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  cosmetic: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function EnvironmentDashboardWidget({ homeId = "home-oak" }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [homeId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/environment?homeId=${homeId}&mode=dashboard`);
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

  const { compliance, metrics, openMaintenance, certificateStatus, issues } = data;

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Environment & Safety</h3>
              <p className="text-xs text-muted-foreground">Premises, fire, maintenance</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${metrics.overallComplianceRate >= 90 ? "text-emerald-600 dark:text-emerald-400" : metrics.overallComplianceRate >= 70 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
              {metrics.overallComplianceRate}%
            </p>
            <p className="text-[10px] text-muted-foreground">checks current</p>
          </div>
        </div>
      </div>

      {/* Issues alert */}
      {issues.length > 0 && (
        <div className="px-4 py-2.5 border-b border-border bg-red-50/50 dark:bg-red-900/10">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs font-medium text-red-700 dark:text-red-400">
              {issues.length} safety issue{issues.length > 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-[10px] text-red-600 dark:text-red-400 line-clamp-1">
            {issues[0]}
          </p>
        </div>
      )}

      {/* Key stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <div className="p-3 text-center">
          <p className={`text-lg font-bold ${compliance.fireComplianceScore >= 90 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {compliance.fireComplianceScore}%
          </p>
          <p className="text-[10px] text-muted-foreground">Fire safety</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-lg font-bold">{compliance.fireDrillCount12Months}</p>
          <p className="text-[10px] text-muted-foreground">Drills (12m)</p>
        </div>
        <div className="p-3 text-center">
          <p className={`text-lg font-bold ${metrics.checksOverdue === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {metrics.checksOverdue}
          </p>
          <p className="text-[10px] text-muted-foreground">Overdue</p>
        </div>
      </div>

      {/* Certificates */}
      <div className="border-b border-border">
        <div className="px-4 py-2 bg-muted/30">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Certificates</p>
        </div>
        <div className="px-4 py-2 space-y-1">
          {certificateStatus.map((cert, i) => (
            <div key={i} className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">{cert.name}</span>
              <span className={`font-medium ${cert.valid ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {cert.valid ? "Valid" : "Expired"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Open maintenance */}
      {openMaintenance.length > 0 && (
        <div className="border-b border-border">
          <div className="px-4 py-2 bg-muted/30">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Open Maintenance ({metrics.maintenanceOpenCount})</p>
          </div>
          <div className="divide-y divide-border">
            {openMaintenance.slice(0, 3).map(m => (
              <div key={m.id} className="px-4 py-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">{m.description}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[m.priority] ?? ""}`}>
                    {m.priorityLabel}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">{m.location} — {m.statusLabel}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="px-4 py-2.5 border-b border-border">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Avg evacuation time</span>
          <span className="font-medium">{compliance.averageEvacuationTime}s</span>
        </div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-muted-foreground">Completed this month</span>
          <span className="font-medium">{metrics.maintenanceCompletedThisMonth}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-muted-foreground">Avg fix time</span>
          <span className="font-medium">{metrics.averageCompletionDays} days</span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 text-center">
        <a href="/environment" className="text-xs text-primary font-medium hover:underline">
          View environment dashboard →
        </a>
      </div>
    </div>
  );
}
