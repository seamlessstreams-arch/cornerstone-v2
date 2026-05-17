"use client";

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD WIDGET — Health Intelligence (Physical)
//
// Shows at a glance:
//   - Overall score + rating
//   - Assessment status (current/overdue)
//   - Immunisation rate
//   - Appointment attendance rate
//   - Health action progress
//   - Sub-scores (assessment, registration, appointments, lifestyle)
//   - Concerns + regulatory status
// ══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Stethoscope, AlertTriangle, CheckCircle2,
} from "lucide-react";

interface HealthData {
  childName: string;
  overallScore: number;
  overallRating: string;
  assessmentScore: number;
  registrationScore: number;
  appointmentScore: number;
  lifestyleScore: number;
  assessmentStatus: string;
  immunisationRate: number;
  appointmentAttendanceRate: number;
  medicationCompliance: boolean;
  healthActionProgress: number;
  concerns: Array<{ severity: string; category: string; description: string }>;
  strengths: Array<{ category: string; description: string }>;
  regulatoryFlags: Array<{ regulation: string; area: string; status: string; detail: string }>;
  recommendations: string[];
  summary: string;
}

interface HealthIntelligenceCardProps {
  childId: string;
}

const RATING_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  excellent: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  good: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  adequate: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  requires_improvement: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  inadequate: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

const STATUS_STYLES: Record<string, { text: string }> = {
  current: { text: "text-emerald-600" },
  due_soon: { text: "text-amber-600" },
  overdue: { text: "text-red-600" },
};

export function HealthIntelligenceCard({ childId }: HealthIntelligenceCardProps) {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/aria/health?childId=${childId}`);
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Failed to fetch health intelligence:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [childId]);

  if (loading) {
    return (
      <div className="rounded-xl border border-[var(--cs-border)] bg-white p-5 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-48 mb-4" />
        <div className="h-20 bg-gray-100 rounded" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-[var(--cs-border)] bg-white p-5">
        <p className="text-sm text-[var(--cs-text-muted)]">Unable to load health intelligence.</p>
      </div>
    );
  }

  const ratingStyle = RATING_STYLES[data.overallRating] ?? RATING_STYLES.adequate;
  const statusStyle = STATUS_STYLES[data.assessmentStatus] ?? STATUS_STYLES.current;

  return (
    <div className="rounded-xl border border-[var(--cs-border)] bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--cs-border)] px-5 py-3 bg-[var(--cs-surface)]">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-red-400" />
          <h3 className="text-sm font-semibold text-[var(--cs-navy)]">Health</h3>
        </div>
        <Badge className={cn("text-[10px]", ratingStyle.bg, ratingStyle.text, ratingStyle.border)}>
          {data.overallRating.replace(/_/g, " ")} ({data.overallScore}%)
        </Badge>
      </div>

      <div className="p-5 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {/* Assessment status */}
          <div className="rounded-lg bg-gray-50 p-2">
            <span className={cn("text-xs font-bold", statusStyle.text)}>
              {data.assessmentStatus === "current" ? "Current" :
               data.assessmentStatus === "overdue" ? "Overdue" : "Due"}
            </span>
            <p className="text-[9px] text-[var(--cs-text-muted)]">RHA</p>
          </div>

          {/* Immunisation rate */}
          <div className="rounded-lg bg-gray-50 p-2">
            <span className={cn(
              "text-xs font-bold",
              data.immunisationRate >= 1 ? "text-emerald-600" :
              data.immunisationRate >= 0.8 ? "text-amber-600" : "text-red-600",
            )}>
              {Math.round(data.immunisationRate * 100)}%
            </span>
            <p className="text-[9px] text-[var(--cs-text-muted)]">Immun.</p>
          </div>

          {/* Appointment attendance */}
          <div className="rounded-lg bg-gray-50 p-2">
            <span className={cn(
              "text-xs font-bold",
              data.appointmentAttendanceRate >= 0.9 ? "text-emerald-600" :
              data.appointmentAttendanceRate >= 0.7 ? "text-amber-600" : "text-red-600",
            )}>
              {Math.round(data.appointmentAttendanceRate * 100)}%
            </span>
            <p className="text-[9px] text-[var(--cs-text-muted)]">Appts</p>
          </div>

          {/* Health action progress */}
          <div className="rounded-lg bg-gray-50 p-2">
            <span className={cn(
              "text-xs font-bold",
              data.healthActionProgress >= 80 ? "text-emerald-600" :
              data.healthActionProgress >= 50 ? "text-amber-600" : "text-red-600",
            )}>
              {data.healthActionProgress}%
            </span>
            <p className="text-[9px] text-[var(--cs-text-muted)]">Actions</p>
          </div>
        </div>

        {/* Sub-scores */}
        <div className="grid grid-cols-4 gap-2">
          <MiniScore label="Assess." score={data.assessmentScore} />
          <MiniScore label="Register" score={data.registrationScore} />
          <MiniScore label="Appts" score={data.appointmentScore} />
          <MiniScore label="Lifestyle" score={data.lifestyleScore} />
        </div>

        {/* Top concerns */}
        {data.concerns.length > 0 && (
          <div className="space-y-1.5">
            {data.concerns.slice(0, 2).map((concern, i) => {
              const isHigh = concern.severity === "critical" || concern.severity === "significant";
              return (
                <div key={i} className={cn(
                  "flex items-start gap-2 rounded-lg p-2 text-xs",
                  isHigh ? "bg-red-50" : "bg-amber-50",
                )}>
                  <AlertTriangle className={cn(
                    "h-3.5 w-3.5 shrink-0 mt-0.5",
                    isHigh ? "text-red-600" : "text-amber-600",
                  )} />
                  <span className={isHigh ? "text-red-700" : "text-amber-700"}>
                    {concern.description}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Regulatory flags */}
        {data.regulatoryFlags.some(f => f.status !== "met") && (
          <div className="flex flex-wrap gap-1.5">
            {data.regulatoryFlags.filter(f => f.status !== "met").slice(0, 3).map((flag, i) => (
              <Badge
                key={i}
                className={cn(
                  "text-[9px]",
                  flag.status === "not_met" ? "bg-red-100 text-red-700 border-red-200" :
                  "bg-amber-100 text-amber-700 border-amber-200",
                )}
                title={flag.detail}
              >
                {flag.area}
              </Badge>
            ))}
          </div>
        )}

        {/* All clear */}
        {data.concerns.length === 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-xs text-emerald-700">
              Health good. All assessments current, registrations in place.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-component ───────────────────────────────────────────────────────────

function MiniScore({ label, score }: { label: string; score: number }) {
  const color = score >= 75 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-red-600";
  return (
    <div className="text-center">
      <span className={cn("text-sm font-bold", color)}>{score}</span>
      <p className="text-[9px] text-[var(--cs-text-muted)] mt-0.5">{label}</p>
    </div>
  );
}
