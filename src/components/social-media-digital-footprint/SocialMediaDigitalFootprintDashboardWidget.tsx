"use client";

// ══════════════════════════════════════════════════════════════════════════════
// SOCIAL MEDIA & DIGITAL FOOTPRINT DASHBOARD WIDGET
//
// Displays the 4-layer digital footprint intelligence:
// - Overall score with rating
// - Layer scores: consent management, incident response, policy, staff readiness
// - Child digital profiles
// - Strengths, areas for improvement, and actions
// - Regulatory references
// ══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";

// ── Local interfaces (mirrors API shape) ──────────────────────────────────

interface ConsentManagement {
  totalConsents: number;
  activeDecisionRate: number;
  childConsultedRate: number;
  parentConsultedRate: number;
  reviewCurrentRate: number;
  statusBreakdown: Record<string, number>;
  typeBreakdown: Record<string, number>;
  score: number;
  strengths: string[];
  concerns: string[];
}

interface DigitalIncidentResponse {
  totalIncidents: number;
  timelyReportingRate: number;
  actionTakenRate: number;
  lessonLearnedRate: number;
  preventionMeasuresRate: number;
  severityBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
  score: number;
  strengths: string[];
  concerns: string[];
}

interface DigitalPolicy {
  totalPolicies: number;
  policyCurrent: boolean;
  imageConsentProcess: boolean;
  socialMediaGuidance: boolean;
  digitalFootprintProtection: boolean;
  cyberbullyingProtocol: boolean;
  dataProtectionCompliant: boolean;
  staffSocialMediaPolicy: boolean;
  score: number;
  strengths: string[];
  concerns: string[];
}

interface StaffDigitalReadiness {
  totalStaff: number;
  digitalSafeguardingRate: number;
  imageConsentProcessRate: number;
  socialMediaRisksRate: number;
  cyberbullyingResponseRate: number;
  dataProtectionRate: number;
  onlineGroomingAwarenessRate: number;
  overallTrainedRate: number;
  score: number;
  strengths: string[];
  concerns: string[];
}

interface ChildProfile {
  childId: string;
  childName: string;
  totalConsents: number;
  activeConsents: number;
  refusedConsents: number;
  pendingConsents: number;
  childConsulted: boolean;
  totalIncidents: number;
  highCriticalIncidents: number;
  digitalSafetyScore: number;
}

interface DigitalFootprintData {
  homeId: string;
  periodStart: string;
  periodEnd: string;
  overallScore: number;
  rating: string;
  consentManagement: ConsentManagement;
  digitalIncidentResponse: DigitalIncidentResponse;
  digitalPolicy: DigitalPolicy;
  staffDigitalReadiness: StaffDigitalReadiness;
  childProfiles: ChildProfile[];
  strengths: string[];
  areasForImprovement: string[];
  actions: string[];
  regulatoryLinks: string[];
  meta?: {
    consentSummary: { id: string; childName: string; type: string; status: string; reviewDate: string }[];
    incidentSummary: { id: string; childName: string; date: string; category: string; severity: string }[];
    ratingLabel: string;
  };
}

// ── Rating Badge ───────────────────────────────────────────────────────────

function RatingBadge({ score, rating }: { score: number; rating: string }) {
  const colorClass =
    rating === "outstanding"
      ? "bg-green-100 text-green-800 border-green-300"
      : rating === "good"
        ? "bg-blue-100 text-blue-800 border-blue-300"
        : rating === "requires_improvement"
          ? "bg-orange-100 text-orange-800 border-orange-300"
          : "bg-red-100 text-red-800 border-red-300";

  const label =
    rating === "outstanding" ? "Outstanding"
      : rating === "good" ? "Good"
        : rating === "requires_improvement" ? "Requires Improvement"
          : "Inadequate";

  return (
    <div className={`rounded-lg border px-4 py-3 text-center ${colorClass}`}>
      <div className="text-3xl font-bold">{score}</div>
      <div className="text-sm font-medium mt-1">{label}</div>
    </div>
  );
}

// ── Layer Score Card ───────────────────────────────────────────────────────

function LayerScoreCard({ label, score, max }: { label: string; score: number; max: number }) {
  const pctVal = Math.round((score / max) * 100);
  const color =
    pctVal >= 80 ? "text-green-700 bg-green-50 border-green-200"
      : pctVal >= 60 ? "text-blue-700 bg-blue-50 border-blue-200"
        : pctVal >= 40 ? "text-orange-700 bg-orange-50 border-orange-200"
          : "text-red-700 bg-red-50 border-red-200";

  return (
    <div className={`rounded-lg border p-3 text-center ${color}`}>
      <div className="text-2xl font-bold">{score}<span className="text-sm font-normal">/{max}</span></div>
      <div className="text-xs font-medium mt-0.5">{label}</div>
    </div>
  );
}

// ── Compliance Gauge ───────────────────────────────────────────────────────

function ComplianceGauge({ label, value }: { label: string; value: number }) {
  const color =
    value >= 90 ? "text-green-700 bg-green-100"
      : value >= 70 ? "text-yellow-700 bg-yellow-100"
        : "text-red-700 bg-red-100";

  return (
    <div className={`rounded-lg p-2.5 text-center ${color}`}>
      <div className="text-xl font-bold">{value}%</div>
      <div className="text-[10px] font-medium mt-0.5">{label}</div>
    </div>
  );
}

// ── Policy Check ──────────────────────────────────────────────────────────

function PolicyCheck({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={active ? "text-green-600" : "text-red-500"}>{active ? "+" : "-"}</span>
      <span className={active ? "text-gray-700" : "text-red-600"}>{label}</span>
    </div>
  );
}

// ── Child Profile Row ─────────────────────────────────────────────────────

function ChildProfileRow({ profile }: { profile: ChildProfile }) {
  const safetyColor =
    profile.digitalSafetyScore >= 8 ? "bg-green-100 text-green-700"
      : profile.digitalSafetyScore >= 5 ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{profile.childName}</span>
          {profile.highCriticalIncidents > 0 && (
            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">High-risk incidents</span>
          )}
          {profile.pendingConsents > 0 && (
            <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">Pending consents</span>
          )}
        </div>
        <div className="flex gap-3 text-[10px] text-gray-400 mt-0.5">
          <span>Consents: {profile.activeConsents} active, {profile.refusedConsents} refused</span>
          {profile.totalIncidents > 0 && <span>Incidents: {profile.totalIncidents}</span>}
          {profile.totalIncidents === 0 && <span>No incidents</span>}
          {!profile.childConsulted && profile.totalConsents > 0 && <span className="text-red-400">Not consulted</span>}
        </div>
      </div>
      <span className={`text-xs font-medium px-2 py-0.5 rounded shrink-0 ${safetyColor}`}>
        {profile.digitalSafetyScore}/10
      </span>
    </div>
  );
}

// ── Main Widget ────────────────────────────────────────────────────────────

export function SocialMediaDigitalFootprintDashboardWidget() {
  const [data, setData] = useState<DigitalFootprintData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"consents" | "incidents" | "policy" | "staff" | "children">("consents");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/social-media-digital-footprint");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-20 bg-gray-100 rounded" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white border border-red-200 rounded-xl p-6">
        <h3 className="font-semibold text-red-800">Social Media & Digital Footprint</h3>
        <p className="text-sm text-red-600 mt-1">{error ?? "No data available"}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">
            Social Media & Digital Footprint
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {data.periodStart} to {data.periodEnd} | {data.consentManagement.totalConsents} consents | {data.digitalIncidentResponse.totalIncidents} incidents | {data.staffDigitalReadiness.totalStaff} staff
          </p>
        </div>
        <RatingBadge score={data.overallScore} rating={data.rating} />
      </div>

      {/* 4 Layer Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <LayerScoreCard label="Consent Mgmt" score={data.consentManagement.score} max={25} />
        <LayerScoreCard label="Incident Response" score={data.digitalIncidentResponse.score} max={25} />
        <LayerScoreCard label="Digital Policy" score={data.digitalPolicy.score} max={25} />
        <LayerScoreCard label="Staff Readiness" score={data.staffDigitalReadiness.score} max={25} />
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
        <ComplianceGauge label="Active Consents" value={data.consentManagement.activeDecisionRate} />
        <ComplianceGauge label="Child Consulted" value={data.consentManagement.childConsultedRate} />
        <ComplianceGauge label="Timely Reports" value={data.digitalIncidentResponse.timelyReportingRate} />
        <ComplianceGauge label="Action Taken" value={data.digitalIncidentResponse.actionTakenRate} />
        <ComplianceGauge label="Safeguarding" value={data.staffDigitalReadiness.digitalSafeguardingRate} />
        <ComplianceGauge label="Staff Trained" value={data.staffDigitalReadiness.overallTrainedRate} />
      </div>

      {/* Urgent Actions */}
      {data.actions.length > 0 &&
        !data.actions[0].startsWith("No immediate actions") && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <h4 className="text-sm font-semibold text-red-800 mb-2">Urgent Actions</h4>
            <ul className="space-y-1">
              {data.actions.slice(0, 4).map((action, i) => (
                <li key={i} className="text-xs text-red-700 flex items-start gap-1.5">
                  <span className="mt-0.5 shrink-0">
                    {action.startsWith("URGENT") ? "●" : action.startsWith("HIGH") ? "○" : "▪"}
                  </span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Expandable Detail Tabs */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium w-full text-left"
      >
        {expanded ? "Hide details" : "Show detailed breakdown"}
      </button>

      {expanded && (
        <div className="mt-4">
          {/* Tab Buttons */}
          <div className="flex gap-1 mb-3 flex-wrap">
            {(["consents", "incidents", "policy", "staff", "children"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab === "consents" ? "Consents"
                  : tab === "incidents" ? "Incidents"
                    : tab === "policy" ? "Policy"
                      : tab === "staff" ? "Staff"
                        : "Children"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-gray-50 rounded-lg p-4">
            {activeTab === "consents" && (
              <div>
                <h4 className="font-semibold text-sm text-gray-800 mb-3">Consent Management</h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <ComplianceGauge label="Active Decisions" value={data.consentManagement.activeDecisionRate} />
                  <ComplianceGauge label="Child Consulted" value={data.consentManagement.childConsultedRate} />
                  <ComplianceGauge label="Parent Consulted" value={data.consentManagement.parentConsultedRate} />
                  <ComplianceGauge label="Reviews Current" value={data.consentManagement.reviewCurrentRate} />
                </div>
                {data.meta?.consentSummary && (
                  <div className="space-y-1 mt-3">
                    <h5 className="text-xs font-semibold text-gray-600 mb-1">Consent Records</h5>
                    {data.meta.consentSummary.map((c) => (
                      <div key={c.id} className="flex justify-between text-xs text-gray-600 py-1 border-b border-gray-200 last:border-0">
                        <span>{c.childName} — {c.type}</span>
                        <span className={
                          c.status === "Granted" ? "text-green-600"
                            : c.status === "Refused" ? "text-red-600"
                              : "text-orange-600"
                        }>{c.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "incidents" && (
              <div>
                <h4 className="font-semibold text-sm text-gray-800 mb-3">Digital Incident Response</h4>
                {data.digitalIncidentResponse.totalIncidents === 0 ? (
                  <p className="text-sm text-green-700">No digital safety incidents recorded — effective safeguarding.</p>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <ComplianceGauge label="Timely Reporting" value={data.digitalIncidentResponse.timelyReportingRate} />
                      <ComplianceGauge label="Action Taken" value={data.digitalIncidentResponse.actionTakenRate} />
                      <ComplianceGauge label="Lessons Learned" value={data.digitalIncidentResponse.lessonLearnedRate} />
                      <ComplianceGauge label="Prevention" value={data.digitalIncidentResponse.preventionMeasuresRate} />
                    </div>
                    {data.meta?.incidentSummary && (
                      <div className="space-y-1 mt-3">
                        <h5 className="text-xs font-semibold text-gray-600 mb-1">Incident Log</h5>
                        {data.meta.incidentSummary.map((inc) => (
                          <div key={inc.id} className="flex justify-between text-xs text-gray-600 py-1 border-b border-gray-200 last:border-0">
                            <span>{inc.childName} — {inc.category}</span>
                            <span className={
                              inc.severity === "Critical" ? "text-red-600"
                                : inc.severity === "High" ? "text-orange-600"
                                  : "text-gray-500"
                            }>{inc.severity} ({inc.date})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "policy" && (
              <div>
                <h4 className="font-semibold text-sm text-gray-800 mb-3">Digital Safety Policy</h4>
                <div className="space-y-1.5">
                  <PolicyCheck label="Policy current" active={data.digitalPolicy.policyCurrent} />
                  <PolicyCheck label="Image consent process" active={data.digitalPolicy.imageConsentProcess} />
                  <PolicyCheck label="Social media guidance" active={data.digitalPolicy.socialMediaGuidance} />
                  <PolicyCheck label="Digital footprint protection" active={data.digitalPolicy.digitalFootprintProtection} />
                  <PolicyCheck label="Cyberbullying protocol" active={data.digitalPolicy.cyberbullyingProtocol} />
                  <PolicyCheck label="Data protection compliant" active={data.digitalPolicy.dataProtectionCompliant} />
                  <PolicyCheck label="Staff social media policy" active={data.digitalPolicy.staffSocialMediaPolicy} />
                </div>
              </div>
            )}

            {activeTab === "staff" && (
              <div>
                <h4 className="font-semibold text-sm text-gray-800 mb-3">Staff Digital Readiness</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <ComplianceGauge label="Digital Safeguarding" value={data.staffDigitalReadiness.digitalSafeguardingRate} />
                  <ComplianceGauge label="Image Consent" value={data.staffDigitalReadiness.imageConsentProcessRate} />
                  <ComplianceGauge label="Social Media Risks" value={data.staffDigitalReadiness.socialMediaRisksRate} />
                  <ComplianceGauge label="Cyberbullying" value={data.staffDigitalReadiness.cyberbullyingResponseRate} />
                  <ComplianceGauge label="Data Protection" value={data.staffDigitalReadiness.dataProtectionRate} />
                  <ComplianceGauge label="Grooming Awareness" value={data.staffDigitalReadiness.onlineGroomingAwarenessRate} />
                </div>
              </div>
            )}

            {activeTab === "children" && (
              <div>
                <h4 className="font-semibold text-sm text-gray-800 mb-3">Child Digital Profiles</h4>
                <div className="space-y-0.5">
                  {data.childProfiles.map((profile) => (
                    <ChildProfileRow key={profile.childId} profile={profile} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {data.strengths.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-green-800 mb-2">Strengths</h4>
                <ul className="space-y-1">
                  {data.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-green-700 flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0">+</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.areasForImprovement.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-orange-800 mb-2">Areas for Improvement</h4>
                <ul className="space-y-1">
                  {data.areasForImprovement.map((a, i) => (
                    <li key={i} className="text-xs text-orange-700 flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0">-</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Regulatory Links */}
          {data.regulatoryLinks.length > 0 && (
            <div className="mt-4 bg-gray-100 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-600 mb-1.5">Regulatory Framework</h4>
              <div className="flex flex-wrap gap-1.5">
                {data.regulatoryLinks.map((link, i) => (
                  <span key={i} className="text-[10px] bg-white text-gray-500 px-2 py-0.5 rounded border border-gray-200">
                    {link}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
