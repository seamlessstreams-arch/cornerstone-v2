"use client";

import React, { useEffect, useState } from "react";
import type {
  SensoryEnvironmentIntelligence,
  ChildEnvironmentProfile,
} from "@/lib/sensory-environment/sensory-environment-engine";
import {
  getSensoryNeedLabel,
  getSpaceTypeLabel,
} from "@/lib/sensory-environment/sensory-environment-engine";

// ── Rating Badge ─────────────────────────────────────────────────────────────

function RatingBadge({ rating, score }: { rating: string; score: number }) {
  const colorMap: Record<string, string> = {
    outstanding: "bg-green-100 text-green-800 border-green-300",
    good: "bg-blue-100 text-blue-800 border-blue-300",
    requires_improvement: "bg-amber-100 text-amber-800 border-amber-300",
    inadequate: "bg-red-100 text-red-800 border-red-300",
  };
  const labelMap: Record<string, string> = {
    outstanding: "Outstanding",
    good: "Good",
    requires_improvement: "Requires Improvement",
    inadequate: "Inadequate",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold ${colorMap[rating] ?? "bg-gray-100 text-gray-800 border-gray-300"}`}>
      {labelMap[rating] ?? rating} — {score}/100
    </span>
  );
}

// ── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({ label, value, suffix, color }: { label: string; value: number | string; suffix?: string; color?: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <span className={`text-2xl font-bold ${color ?? "text-gray-900"}`}>
        {value}{suffix}
      </span>
      <span className="mt-1 text-xs text-gray-500 text-center">{label}</span>
    </div>
  );
}

// ── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pctVal = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pctVal}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-600 w-10 text-right">{pctVal}%</span>
    </div>
  );
}

// ── Child Profile Card ───────────────────────────────────────────────────────

function ChildProfileCard({ profile }: { profile: ChildEnvironmentProfile }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{profile.childName}</h4>
          <span className="text-xs text-gray-500">
            Comfort Score: {profile.environmentalComfortScore}/100
          </span>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold border ${
            profile.environmentalComfortScore >= 80
              ? "bg-green-100 text-green-700 border-green-200"
              : profile.environmentalComfortScore >= 60
                ? "bg-blue-100 text-blue-700 border-blue-200"
                : profile.environmentalComfortScore >= 40
                  ? "bg-amber-100 text-amber-700 border-amber-200"
                  : "bg-red-100 text-red-700 border-red-200"
          }`}
        >
          {profile.environmentalComfortScore >= 80
            ? "WELL SUPPORTED"
            : profile.environmentalComfortScore >= 60
              ? "SUPPORTED"
              : profile.environmentalComfortScore >= 40
                ? "PARTIAL"
                : "NEEDS ATTENTION"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t">
        <div>
          <span className="text-lg font-bold text-gray-900">{profile.adaptationsInPlace}</span>
          <p className="text-xs text-gray-500">Adaptations</p>
        </div>
        <div>
          <span className="text-lg font-bold text-gray-900">{profile.spaceUsageCount}</span>
          <p className="text-xs text-gray-500">Space Uses</p>
        </div>
        <div>
          <span className="text-lg font-bold text-gray-900">{profile.positiveResponseRate}%</span>
          <p className="text-xs text-gray-500">Positive</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 pt-2">
        {profile.sensoryNeeds.map((need) => (
          <span
            key={need}
            className="rounded-full bg-purple-100 text-purple-700 px-2 py-0.5 text-xs font-medium border border-purple-200"
          >
            {getSensoryNeedLabel(need)}
          </span>
        ))}
        {profile.hasSensoryDiet ? (
          <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium border border-green-200">
            SENSORY DIET
          </span>
        ) : (
          <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs font-medium border border-red-200">
            NO SENSORY DIET
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main Widget ──────────────────────────────────────────────────────────────

export function SensoryEnvironmentDashboardWidget() {
  const [data, setData] = useState<SensoryEnvironmentIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sensory-environment")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6">
        <div className="h-6 w-48 rounded bg-gray-200 mb-4" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h3 className="font-semibold text-red-800">Sensory & Therapeutic Environment Intelligence</h3>
        <p className="mt-2 text-sm text-red-600">Failed to load: {error}</p>
      </div>
    );
  }

  const toggle = (section: string) =>
    setExpandedSection((prev) => (prev === section ? null : section));

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Sensory & Therapeutic Environment
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {data.periodStart} to {data.periodEnd} · CHR 2015 Reg 6/25 · NICE CG128 · UNCRC Art. 31
          </p>
        </div>
        <RatingBadge rating={data.rating} score={data.overallScore} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <MetricCard
          label="Overall Score"
          value={data.overallScore}
          suffix="/100"
          color={data.overallScore >= 80 ? "text-green-600" : data.overallScore >= 60 ? "text-blue-600" : data.overallScore >= 40 ? "text-amber-600" : "text-red-600"}
        />
        <MetricCard
          label="Profile Coverage"
          value={data.sensoryProfiling.coverageRate}
          suffix="%"
          color={data.sensoryProfiling.coverageRate === 100 ? "text-green-600" : data.sensoryProfiling.coverageRate >= 80 ? "text-blue-600" : "text-red-600"}
        />
        <MetricCard
          label="Adaptation Effectiveness"
          value={data.adaptations.effectivenessRate}
          suffix="%"
          color={data.adaptations.effectivenessRate >= 80 ? "text-green-600" : data.adaptations.effectivenessRate >= 60 ? "text-amber-600" : "text-red-600"}
        />
        <MetricCard
          label="Positive Response Rate"
          value={data.therapeuticUsage.positiveResponseRate}
          suffix="%"
          color={data.therapeuticUsage.positiveResponseRate >= 80 ? "text-green-600" : data.therapeuticUsage.positiveResponseRate >= 60 ? "text-amber-600" : "text-red-600"}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <MetricCard label="Spaces Assessed" value={data.spaceQuality.spacesAssessed} />
        <MetricCard
          label="Personalisation"
          value={data.spaceQuality.personalisationRate}
          suffix="%"
          color={data.spaceQuality.personalisationRate >= 80 ? "text-green-600" : "text-amber-600"}
        />
        <MetricCard label="Active Adaptations" value={data.adaptations.activeAdaptations} />
        <MetricCard label="Therapeutic Sessions" value={data.therapeuticUsage.usageFrequency} />
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        {data.sensoryProfiling.coverageRate === 100 && (
          <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-medium border border-green-200">
            ALL CHILDREN PROFILED
          </span>
        )}
        {data.adaptations.effectivenessRate >= 80 && (
          <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-medium border border-green-200">
            HIGH ADAPTATION EFFECTIVENESS
          </span>
        )}
        {data.adaptations.needsReviewCount > 0 && (
          <span className="rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-medium border border-amber-200">
            {data.adaptations.needsReviewCount} ADAPTATION{data.adaptations.needsReviewCount !== 1 ? "S" : ""} NEED REVIEW
          </span>
        )}
        {data.spaceQuality.improvementBacklog > 0 && (
          <span className="rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-medium border border-amber-200">
            {data.spaceQuality.improvementBacklog} SPACE IMPROVEMENT{data.spaceQuality.improvementBacklog !== 1 ? "S" : ""} PENDING
          </span>
        )}
        {data.sensoryProfiling.unprofiledChildIds.length > 0 && (
          <span className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-medium border border-red-200">
            {data.sensoryProfiling.unprofiledChildIds.length} CHILD{data.sensoryProfiling.unprofiledChildIds.length !== 1 ? "REN" : ""} UNPROFILED
          </span>
        )}
      </div>

      {/* Child Sensory Profiles */}
      <div className="mb-5">
        <button
          onClick={() => toggle("profiles")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
        >
          <span className={`transform transition-transform ${expandedSection === "profiles" ? "rotate-90" : ""}`}>&#9654;</span>
          Child Sensory Profiles ({data.childProfiles.length})
        </button>
        {expandedSection === "profiles" && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.childProfiles.map((profile) => (
              <ChildProfileCard key={profile.childId} profile={profile} />
            ))}
          </div>
        )}
      </div>

      {/* Space Quality */}
      <div className="mb-5">
        <button
          onClick={() => toggle("spaces")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
        >
          <span className={`transform transition-transform ${expandedSection === "spaces" ? "rotate-90" : ""}`}>&#9654;</span>
          Space Quality
        </button>
        {expandedSection === "spaces" && (
          <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Personalisation</span>
                <span className="font-medium">{data.spaceQuality.personalisationRate}%</span>
              </div>
              <ProgressBar value={data.spaceQuality.personalisationRate} max={100} color="bg-purple-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Child-Friendly</span>
                <span className="font-medium">{data.spaceQuality.childFriendlyRate}%</span>
              </div>
              <ProgressBar value={data.spaceQuality.childFriendlyRate} max={100} color="bg-blue-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Noise Quality</span>
                <span className="font-medium">{data.spaceQuality.noiseQuality}%</span>
              </div>
              <ProgressBar value={data.spaceQuality.noiseQuality} max={100} color="bg-green-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Lighting Quality</span>
                <span className="font-medium">{data.spaceQuality.lightingQuality}%</span>
              </div>
              <ProgressBar value={data.spaceQuality.lightingQuality} max={100} color="bg-yellow-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Temperature Quality</span>
                <span className="font-medium">{data.spaceQuality.temperatureQuality}%</span>
              </div>
              <ProgressBar value={data.spaceQuality.temperatureQuality} max={100} color="bg-orange-500" />
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
              <span className="text-gray-700">Improvement Backlog</span>
              <span className={`font-medium ${data.spaceQuality.improvementBacklog > 3 ? "text-red-600" : data.spaceQuality.improvementBacklog > 0 ? "text-amber-600" : "text-green-600"}`}>
                {data.spaceQuality.improvementBacklog} item{data.spaceQuality.improvementBacklog !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Environmental Adaptations */}
      <div className="mb-5">
        <button
          onClick={() => toggle("adaptations")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
        >
          <span className={`transform transition-transform ${expandedSection === "adaptations" ? "rotate-90" : ""}`}>&#9654;</span>
          Environmental Adaptations ({data.adaptations.adaptationCount})
        </button>
        {expandedSection === "adaptations" && (
          <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <span className="text-lg font-bold text-green-600">{data.adaptations.activeAdaptations}</span>
                <p className="text-xs text-gray-500">Active</p>
              </div>
              <div>
                <span className="text-lg font-bold text-blue-600">{data.adaptations.plannedAdaptations}</span>
                <p className="text-xs text-gray-500">Planned</p>
              </div>
              <div>
                <span className={`text-lg font-bold ${data.adaptations.needsReviewCount > 0 ? "text-amber-600" : "text-gray-900"}`}>{data.adaptations.needsReviewCount}</span>
                <p className="text-xs text-gray-500">Needs Review</p>
              </div>
              <div>
                <span className="text-lg font-bold text-purple-600">{data.adaptations.childFeedbackCaptureRate}%</span>
                <p className="text-xs text-gray-500">Feedback Capture</p>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Effectiveness Rate</span>
                <span className="font-medium">{data.adaptations.effectivenessRate}%</span>
              </div>
              <ProgressBar value={data.adaptations.effectivenessRate} max={100} color={data.adaptations.effectivenessRate >= 80 ? "bg-green-500" : "bg-amber-500"} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Child-Specific Rate</span>
                <span className="font-medium">{data.adaptations.childSpecificRate}%</span>
              </div>
              <ProgressBar value={data.adaptations.childSpecificRate} max={100} color="bg-blue-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Review Currency</span>
                <span className="font-medium">{data.adaptations.reviewCurrency}%</span>
              </div>
              <ProgressBar value={data.adaptations.reviewCurrency} max={100} color={data.adaptations.reviewCurrency >= 80 ? "bg-green-500" : "bg-amber-500"} />
            </div>
          </div>
        )}
      </div>

      {/* Therapeutic Space Usage */}
      <div className="mb-5">
        <button
          onClick={() => toggle("usage")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
        >
          <span className={`transform transition-transform ${expandedSection === "usage" ? "rotate-90" : ""}`}>&#9654;</span>
          Therapeutic Space Usage
        </button>
        {expandedSection === "usage" && (
          <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <span className="text-lg font-bold text-gray-900">{data.therapeuticUsage.usageFrequency}</span>
                <p className="text-xs text-gray-500">Total Sessions</p>
              </div>
              <div>
                <span className="text-lg font-bold text-purple-600">{data.therapeuticUsage.spaceVariety}</span>
                <p className="text-xs text-gray-500">Space Types Used</p>
              </div>
              <div>
                <span className={`text-lg font-bold ${data.therapeuticUsage.positiveResponseRate >= 80 ? "text-green-600" : "text-amber-600"}`}>{data.therapeuticUsage.positiveResponseRate}%</span>
                <p className="text-xs text-gray-500">Positive Response</p>
              </div>
              <div>
                <span className="text-lg font-bold text-blue-600">{data.therapeuticUsage.staffSupportRate}%</span>
                <p className="text-xs text-gray-500">Staff Supported</p>
              </div>
            </div>
            {data.therapeuticUsage.perChildEngagement.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Per-Child Engagement</h4>
                <div className="space-y-2">
                  {data.therapeuticUsage.perChildEngagement.map((child) => (
                    <div key={child.childId} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-700">{child.childName}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{child.usageCount} sessions ({child.totalMinutes} min)</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${child.positiveRate >= 80 ? "bg-green-100 text-green-700" : child.positiveRate >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                          {child.positiveRate}% positive
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Strengths / Areas / Actions */}
      <div className="space-y-4 mb-5">
        {data.actions.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h4 className="text-sm font-semibold text-red-800 mb-2">Actions Required</h4>
            <ul className="space-y-1">
              {data.actions.map((action, i) => (
                <li key={i} className="text-sm text-red-700">- {action}</li>
              ))}
            </ul>
          </div>
        )}

        {data.strengths.length > 0 && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h4 className="text-sm font-semibold text-green-800 mb-2">Strengths</h4>
            <ul className="space-y-1">
              {data.strengths.map((s, i) => (
                <li key={i} className="text-sm text-green-700">- {s}</li>
              ))}
            </ul>
          </div>
        )}

        {data.areasForImprovement.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="text-sm font-semibold text-amber-800 mb-2">Areas for Improvement</h4>
            <ul className="space-y-1">
              {data.areasForImprovement.map((a, i) => (
                <li key={i} className="text-sm text-amber-700">- {a}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Regulatory Framework */}
      <div>
        <button
          onClick={() => toggle("regulatory")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
        >
          <span className={`transform transition-transform ${expandedSection === "regulatory" ? "rotate-90" : ""}`}>&#9654;</span>
          Regulatory Framework
        </button>
        {expandedSection === "regulatory" && (
          <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4">
            <ul className="space-y-1">
              {data.regulatoryLinks.map((link, i) => (
                <li key={i} className="text-xs text-gray-600">- {link}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
