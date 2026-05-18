"use client";

import { useState, useEffect } from "react";
import type { SleepHygieneQualityIntelligence } from "@/lib/sleep-hygiene-quality";

const ratingColors: Record<string, string> = {
  outstanding: "bg-green-100 text-green-800 border-green-300",
  good: "bg-blue-100 text-blue-800 border-blue-300",
  requires_improvement: "bg-amber-100 text-amber-800 border-amber-300",
  inadequate: "bg-red-100 text-red-800 border-red-300",
};

const ratingLabels: Record<string, string> = {
  outstanding: "Outstanding",
  good: "Good",
  requires_improvement: "Requires Improvement",
  inadequate: "Inadequate",
};

function ScoreBar({ score, label, maxScore = 100 }: { score: number; label: string; maxScore?: number }) {
  const pct = (score / maxScore) * 100;
  const color = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-blue-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-44 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <span className="text-sm font-medium w-12 text-right">{score}</span>
    </div>
  );
}

function Section({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
        <span className="font-medium text-gray-900">{title}</span>
        <span className="text-gray-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}

export function SleepHygieneQualityDashboardWidget() {
  const [data, setData] = useState<SleepHygieneQualityIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sleep-hygiene-quality")
      .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then((json) => setData(json.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="grid grid-cols-4 gap-4">{[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-gray-200 rounded" />)}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-red-800">Sleep Hygiene Quality</h3>
        <p className="text-red-600 mt-2">Failed to load: {error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sleep Hygiene Quality</h3>
          <p className="text-sm text-gray-500 mt-1">{data.periodStart} to {data.periodEnd}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{data.overallScore}</div>
          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${ratingColors[data.rating] || ""}`}>
            {ratingLabels[data.rating] || data.rating}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{data.sleepEnvironment.totalAudits}</div>
          <div className="text-xs text-gray-500 mt-1">Env Audits</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{data.sleepRoutine.totalRecords}</div>
          <div className="text-xs text-gray-500 mt-1">Routines</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{data.sleepOutcome.averageHours}h</div>
          <div className="text-xs text-gray-500 mt-1">Avg Sleep</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{data.sleepOutcome.goodSleepRate}%</div>
          <div className="text-xs text-gray-500 mt-1">Good Sleep</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{data.staffSleepReadiness.totalStaff}</div>
          <div className="text-xs text-gray-500 mt-1">Staff Trained</div>
        </div>
      </div>

      <div className="space-y-2">
        <ScoreBar score={data.sleepEnvironment.overallScore} label="Sleep Environment" maxScore={25} />
        <ScoreBar score={data.sleepRoutine.overallScore} label="Sleep Routine" maxScore={25} />
        <ScoreBar score={data.sleepOutcome.overallScore} label="Sleep Outcomes" maxScore={25} />
        <ScoreBar score={data.staffSleepReadiness.overallScore} label="Staff Readiness" maxScore={25} />
      </div>

      <div className="space-y-3">
        {data.childProfiles.length > 0 && (
          <Section title="Child Sleep Profiles" defaultOpen>
            <div className="space-y-3">
              {data.childProfiles.map((child) => (
                <div key={child.childId} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{child.childName}</span>
                    <span className="text-sm font-medium text-gray-600">{child.overallScore}/10</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Environment: <span className="font-medium capitalize">{child.environmentRating}</span></div>
                    <div>Routine: <span className="font-medium capitalize">{child.routineAdherence.replace(/_/g, " ")}</span></div>
                    <div>Avg Hours: <span className="font-medium">{child.averageSleepHours}</span></div>
                    <div>Good Sleep: <span className="font-medium">{child.goodSleepRate}%</span></div>
                    <div>Disruptions: <span className={`font-medium ${child.disruptionCount === 0 ? "text-green-600" : "text-amber-600"}`}>{child.disruptionCount}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section title="Sleep Environment">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-gray-500">Audits:</span> <span className="font-medium">{data.sleepEnvironment.totalAudits}</span></div>
            <div><span className="text-gray-500">Good+:</span> <span className="font-medium">{data.sleepEnvironment.excellentGoodRate}%</span></div>
            <div><span className="text-gray-500">Temperature:</span> <span className="font-medium">{data.sleepEnvironment.temperatureOkRate}%</span></div>
            <div><span className="text-gray-500">Bedding:</span> <span className="font-medium">{data.sleepEnvironment.beddingRate}%</span></div>
            <div><span className="text-gray-500">Blackout:</span> <span className="font-medium">{data.sleepEnvironment.blackoutRate}%</span></div>
            <div><span className="text-gray-500">Personal Items:</span> <span className="font-medium">{data.sleepEnvironment.personalItemsRate}%</span></div>
          </div>
        </Section>

        <Section title="Sleep Routine">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-gray-500">Records:</span> <span className="font-medium">{data.sleepRoutine.totalRecords}</span></div>
            <div><span className="text-gray-500">Fully Followed:</span> <span className="font-medium">{data.sleepRoutine.fullyFollowedRate}%</span></div>
            <div><span className="text-gray-500">Wind-Down:</span> <span className="font-medium">{data.sleepRoutine.windDownOfferedRate}%</span></div>
            <div><span className="text-gray-500">Screen Free:</span> <span className="font-medium">{data.sleepRoutine.screenFreeRate}%</span></div>
            <div><span className="text-gray-500">On Time:</span> <span className="font-medium">{data.sleepRoutine.onTimeBedtimeRate}%</span></div>
          </div>
        </Section>

        <Section title="Sleep Outcomes">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-gray-500">Records:</span> <span className="font-medium">{data.sleepOutcome.totalRecords}</span></div>
            <div><span className="text-gray-500">Good Sleep:</span> <span className="font-medium">{data.sleepOutcome.goodSleepRate}%</span></div>
            <div><span className="text-gray-500">Avg Hours:</span> <span className="font-medium">{data.sleepOutcome.averageHours}h</span></div>
            <div><span className="text-gray-500">No Disruptions:</span> <span className="font-medium">{data.sleepOutcome.disruptionFreeRate}%</span></div>
            <div><span className="text-gray-500">Self-Report:</span> <span className="font-medium">{data.sleepOutcome.childSelfReportRate}%</span></div>
            <div><span className="text-gray-500">Rested:</span> <span className="font-medium">{data.sleepOutcome.restedRate}%</span></div>
          </div>
        </Section>

        <Section title="Staff Sleep Readiness">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-gray-500">Staff:</span> <span className="font-medium">{data.staffSleepReadiness.totalStaff}</span></div>
            <div><span className="text-gray-500">Sleep Hygiene:</span> <span className="font-medium">{data.staffSleepReadiness.sleepHygieneRate}%</span></div>
            <div><span className="text-gray-500">Night Care:</span> <span className="font-medium">{data.staffSleepReadiness.nightCareRate}%</span></div>
            <div><span className="text-gray-500">Trauma-Informed:</span> <span className="font-medium">{data.staffSleepReadiness.traumaInformedRate}%</span></div>
            <div><span className="text-gray-500">Sleep Disorders:</span> <span className="font-medium">{data.staffSleepReadiness.sleepDisorderRate}%</span></div>
            <div><span className="text-gray-500">Bedtime Routines:</span> <span className="font-medium">{data.staffSleepReadiness.bedtimeRoutinesRate}%</span></div>
          </div>
        </Section>

        <Section title="Strengths, Areas & Actions">
          {data.strengths.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-1">Strengths</h4>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                {data.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
          {data.areasForImprovement.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-amber-700 mb-1">Areas for Improvement</h4>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                {data.areasForImprovement.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}
          {data.actions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-blue-700 mb-1">Recommended Actions</h4>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                {data.actions.map((a, i) => (
                  <li key={i} className={a.startsWith("URGENT") ? "text-red-700 font-medium" : ""}>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        <Section title="Regulatory Framework">
          <ul className="text-sm text-gray-600 space-y-1">
            {data.regulatoryLinks.map((link, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">&sect;</span>
                <span>{link}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
