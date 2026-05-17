"use client";

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD WIDGET — Key Working Intelligence
//
// Shows at a glance:
//   - Overall score + rating
//   - Session compliance (occurred vs expected)
//   - Average duration + child-led rate
//   - Sub-scores (frequency, quality, relationship, voice)
//   - Topic coverage badges
//   - Concerns + regulatory status
// ══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  HeartHandshake, AlertTriangle, CheckCircle2, Clock,
  UserCheck, MessageCircle,
} from "lucide-react";

interface KeyworkingData {
  childName: string;
  overallScore: number;
  overallRating: string;
  frequencyScore: number;
  qualityScore: number;
  relationshipScore: number;
  voiceScore: number;
  totalSessions: number;
  occurredSessions: number;
  missedSessions: number;
  complianceRate: number;
  avgDuration: number;
  childLedRate: number;
  wishesRate: number;
  actionCompletionRate: number;
  topicCoverage: Array<{ topic: string; count: number; percentage: number }>;
  concerns: Array<{ severity: string; category: string; description: string }>;
  strengths: Array<{ category: string; description: string }>;
  regulatoryFlags: Array<{ regulation: string; area: string; status: string; detail: string }>;
  recommendations: string[];
  summary: string;
}

interface KeyworkingIntelligenceCardProps {
  childId: string;
}

const RATING_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  excellent: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  good: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  adequate: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  requires_improvement: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  inadequate: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

export function KeyworkingIntelligenceCard({ childId }: KeyworkingIntelligenceCardProps) {
  const [data, setData] = useState<KeyworkingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/aria/keyworking?childId=${childId}`);
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Failed to fetch keyworking intelligence:", err);
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
        <p className="text-sm text-[var(--cs-text-muted)]">Unable to load keyworking intelligence.</p>
      </div>
    );
  }

  const ratingStyle = RATING_STYLES[data.overallRating] ?? RATING_STYLES.adequate;

  return (
    <div className="rounded-xl border border-[var(--cs-border)] bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--cs-border)] px-5 py-3 bg-[var(--cs-surface)]">
        <div className="flex items-center gap-2">
          <HeartHandshake className="h-4 w-4 text-violet-500" />
          <h3 className="text-sm font-semibold text-[var(--cs-navy)]">Key Working</h3>
        </div>
        <Badge className={cn("text-[10px]", ratingStyle.bg, ratingStyle.text, ratingStyle.border)}>
          {data.overallRating.replace(/_/g, " ")} ({data.overallScore}%)
        </Badge>
      </div>

      <div className="p-5 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="rounded-lg bg-gray-50 p-2">
            <span className={cn("text-xs font-bold", data.complianceRate >= 0.8 ? "text-emerald-600" : data.complianceRate >= 0.6 ? "text-amber-600" : "text-red-600")}>
              {Math.round(data.complianceRate * 100)}%
            </span>
            <p className="text-[9px] text-[var(--cs-text-muted)]">Compliance</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <span className="text-xs font-bold text-[var(--cs-navy)]">{data.avgDuration}m</span>
            <p className="text-[9px] text-[var(--cs-text-muted)]">Avg Duration</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <span className={cn("text-xs font-bold", data.childLedRate >= 0.6 ? "text-emerald-600" : data.childLedRate >= 0.3 ? "text-amber-600" : "text-red-600")}>
              {Math.round(data.childLedRate * 100)}%
            </span>
            <p className="text-[9px] text-[var(--cs-text-muted)]">Child-Led</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <span className={cn("text-xs font-bold", data.wishesRate >= 0.7 ? "text-emerald-600" : data.wishesRate >= 0.4 ? "text-amber-600" : "text-red-600")}>
              {Math.round(data.wishesRate * 100)}%
            </span>
            <p className="text-[9px] text-[var(--cs-text-muted)]">Wishes</p>
          </div>
        </div>

        {/* Sub-scores */}
        <div className="grid grid-cols-4 gap-2">
          <MiniScore label="Frequency" score={data.frequencyScore} />
          <MiniScore label="Quality" score={data.qualityScore} />
          <MiniScore label="Relation" score={data.relationshipScore} />
          <MiniScore label="Voice" score={data.voiceScore} />
        </div>

        {/* Topic coverage */}
        {data.topicCoverage.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.topicCoverage.slice(0, 5).map((topic, i) => (
              <Badge key={i} className="text-[9px] bg-gray-100 text-gray-700 border-gray-200">
                {topic.topic.replace(/_/g, " ")} ({topic.percentage}%)
              </Badge>
            ))}
          </div>
        )}

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
        {data.concerns.length === 0 && data.totalSessions > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-xs text-emerald-700">
              Keywork sessions delivered consistently with strong child engagement.
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
