"use client";

import { useState, useEffect } from "react";
import type { FamilyContactQualityIntelligence } from "@/lib/family-contact-quality";

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

const viewColors: Record<string, string> = {
  wants_more: "text-amber-600",
  happy_with_current: "text-green-600",
  wants_less: "text-orange-600",
  does_not_want: "text-red-600",
  not_recorded: "text-gray-400",
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

export function FamilyContactQualityDashboardWidget() {
  const [data, setData] = useState<FamilyContactQualityIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/family-contact-quality")
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
        <h3 className="text-lg font-semibold text-red-800">Family Contact Quality</h3>
        <p className="text-red-600 mt-2">Failed to load: {error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Family Contact Quality</h3>
          <p className="text-sm text-gray-500 mt-1">{data.periodStart} to {data.periodEnd}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{data.overallScore}</div>
          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${ratingColors[data.rating] || ""}`}>
            {ratingLabels[data.rating] || data.rating}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{data.contactQuality.totalContacts}</div>
          <div className="text-xs text-gray-500 mt-1">Total Contacts</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{data.contactQuality.positiveOutcomeRate}%</div>
          <div className="text-xs text-gray-500 mt-1">Positive Outcomes</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{data.planCompliance.frequencyMetRate}%</div>
          <div className="text-xs text-gray-500 mt-1">Plans Met</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{data.siblingContact.totalSiblingPairs}</div>
          <div className="text-xs text-gray-500 mt-1">Sibling Pairs</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{data.familyEngagement.reviewInvolvementRate}%</div>
          <div className="text-xs text-gray-500 mt-1">Family in Reviews</div>
        </div>
      </div>

      {/* Component Scores */}
      <div className="space-y-2">
        <ScoreBar score={data.contactQuality.overallScore} label="Contact Quality" maxScore={25} />
        <ScoreBar score={data.planCompliance.overallScore} label="Plan Compliance" maxScore={25} />
        <ScoreBar score={data.siblingContact.overallScore} label="Sibling Contact" maxScore={25} />
        <ScoreBar score={data.familyEngagement.overallScore} label="Family Engagement" maxScore={25} />
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {data.childProfiles.length > 0 && (
          <Section title="Child Contact Profiles" defaultOpen>
            <div className="space-y-3">
              {data.childProfiles.map((child) => (
                <div key={child.childId} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{child.childName}</span>
                    <span className="text-sm text-gray-500">{child.overallScore}/10</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Contacts: <span className="font-medium">{child.totalContacts}</span></div>
                    <div>Positive: <span className="font-medium">{child.positiveRate}%</span></div>
                    <div>Sibling Contact: <span className={`font-medium ${child.siblingContactMet ? "text-green-600" : "text-red-600"}`}>{child.siblingContactMet ? "Met" : "Not Met"}</span></div>
                    <div>Family Engaged: <span className={`font-medium ${child.familyEngaged ? "text-green-600" : "text-amber-600"}`}>{child.familyEngaged ? "Yes" : "No"}</span></div>
                    <div>Child View: <span className={`font-medium ${viewColors[child.childViewOnContact] || ""}`}>{child.childViewOnContact.replace(/_/g, " ")}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section title="Contact Quality">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-gray-500">Total:</span> <span className="font-medium">{data.contactQuality.totalContacts}</span></div>
            <div><span className="text-gray-500">Positive:</span> <span className="font-medium">{data.contactQuality.positiveOutcomeRate}%</span></div>
            <div><span className="text-gray-500">Prepared:</span> <span className="font-medium">{data.contactQuality.childPreparedRate}%</span></div>
            <div><span className="text-gray-500">Views Sought:</span> <span className="font-medium">{data.contactQuality.childViewsSoughtRate}%</span></div>
            <div><span className="text-gray-500">Enjoyed:</span> <span className="font-medium">{data.contactQuality.childEnjoyedRate}%</span></div>
            <div><span className="text-gray-500">Debriefed:</span> <span className="font-medium">{data.contactQuality.debriefRate}%</span></div>
            <div><span className="text-gray-500">Avg Duration:</span> <span className="font-medium">{data.contactQuality.averageDurationMinutes}min</span></div>
          </div>
        </Section>

        <Section title="Plan Compliance">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-gray-500">Total Plans:</span> <span className="font-medium">{data.planCompliance.totalPlans}</span></div>
            <div><span className="text-gray-500">Frequency Met:</span> <span className="font-medium">{data.planCompliance.frequencyMetRate}%</span></div>
            <div><span className="text-gray-500">Child-Centred:</span> <span className="font-medium">{data.planCompliance.childCentredRate}%</span></div>
            <div><span className="text-gray-500">Children Happy:</span> <span className="font-medium">{data.planCompliance.childHappyCount}</span></div>
            <div><span className="text-gray-500">Want More:</span> <span className={`font-medium ${data.planCompliance.childWantsMoreCount > 0 ? "text-amber-600" : "text-green-600"}`}>{data.planCompliance.childWantsMoreCount}</span></div>
            <div><span className="text-gray-500">Recently Reviewed:</span> <span className="font-medium">{data.planCompliance.recentlyReviewedRate}%</span></div>
            <div><span className="text-gray-500">Court Orders:</span> <span className="font-medium">{data.planCompliance.courtOrderCount}</span></div>
          </div>
        </Section>

        <Section title="Sibling Contact">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-gray-500">Pairs:</span> <span className="font-medium">{data.siblingContact.totalSiblingPairs}</span></div>
            <div><span className="text-gray-500">Frequency Met:</span> <span className="font-medium">{data.siblingContact.frequencyMetRate}%</span></div>
            <div><span className="text-gray-500">Positive Quality:</span> <span className="font-medium">{data.siblingContact.positiveQualityRate}%</span></div>
            <div><span className="text-gray-500">Avg Gap:</span> <span className="font-medium">{data.siblingContact.averageContactGapDays} days</span></div>
          </div>
        </Section>

        <Section title="Family Engagement">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-gray-500">Children:</span> <span className="font-medium">{data.familyEngagement.totalChildren}</span></div>
            <div><span className="text-gray-500">In Reviews:</span> <span className="font-medium">{data.familyEngagement.reviewInvolvementRate}%</span></div>
            <div><span className="text-gray-500">Care Planning:</span> <span className="font-medium">{data.familyEngagement.carePlanningRate}%</span></div>
            <div><span className="text-gray-500">Relationships:</span> <span className="font-medium">{data.familyEngagement.relationshipsSupportedRate}%</span></div>
            <div><span className="text-gray-500">Cultural Links:</span> <span className="font-medium">{data.familyEngagement.culturalLinksRate}%</span></div>
            <div><span className="text-gray-500">Conferencing:</span> <span className="font-medium">{data.familyEngagement.familyConferencingRate}%</span></div>
            <div><span className="text-gray-500">Life Story:</span> <span className="font-medium">{data.familyEngagement.lifestoryRate}%</span></div>
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
