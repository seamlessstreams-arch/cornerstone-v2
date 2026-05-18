"use client";

import React, { useEffect, useState } from "react";
import type { RiScores } from "@/lib/ri/compute-scores";

// ── Types ───────────────────────────────────────────────────────────────────

interface RiApiResponse {
  scores: RiScores;
  inputs_summary: {
    training_needs: number;
    training_records: number;
    alerts: number;
    incidents: number;
    supervisions_overdue: number;
    audits_overdue: number;
    audits: number;
    medication_audits: number;
    reg45_items: number;
    challenges: number;
    care_forms: number;
    daily_logs: number;
    active_candidates: number;
    yp_count: number;
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

function barColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

function barBgColor(score: number): string {
  if (score >= 80) return "bg-green-100";
  if (score >= 60) return "bg-amber-100";
  return "bg-red-100";
}

function riskLevel(score: number): { label: string; className: string } {
  if (score >= 85) return { label: "LOW RISK", className: "bg-green-100 text-green-800 border-green-300" };
  if (score >= 70) return { label: "MODERATE", className: "bg-amber-100 text-amber-800 border-amber-300" };
  if (score >= 55) return { label: "ELEVATED", className: "bg-orange-100 text-orange-800 border-orange-300" };
  return { label: "HIGH RISK", className: "bg-red-100 text-red-800 border-red-300" };
}

const SCORE_LABELS: Record<string, string> = {
  safeguarding_oversight_score: "Safeguarding Oversight",
  incident_management_score: "Incident Management",
  missing_episodes_score: "Missing Episodes",
  reg45_compliance_score: "Reg 45 Compliance",
  staff_supervision_score: "Staff Supervision",
  training_compliance_score: "Training Compliance",
  medication_governance_score: "Medication Governance",
  care_planning_score: "Care Planning",
  child_voice_score: "Child Voice",
  complaint_management_score: "Complaint Management",
  building_safety_score: "Building Safety",
  recruitment_compliance_score: "Recruitment Compliance",
  oversight_quality_score: "Oversight Quality",
  outcome_evidence_score: "Outcome Evidence",
  challenge_log_score: "Challenge Log",
};

// ── Score Bar ───────────────────────────────────────────────────────────────

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-xs text-gray-600 w-44 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-xs font-bold w-8 text-right ${scoreColor(score)}`}>{score}</span>
    </div>
  );
}

// ── Expandable Section ──────────────────────────────────────────────────────

function Section({
  title,
  expanded,
  onToggle,
  children,
  badge,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors w-full text-left"
      >
        <span className={`transform transition-transform text-xs ${expanded ? "rotate-90" : ""}`}>
          &#9654;
        </span>
        <span>{title}</span>
        {badge}
      </button>
      {expanded && (
        <div className="mt-2 rounded-lg border border-gray-200 bg-white p-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Main Widget ─────────────────────────────────────────────────────────────

export function RiGovernanceDashboardWidget() {
  const [data, setData] = useState<RiApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ri")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6">
        <div className="h-6 w-56 rounded bg-gray-200 mb-4" />
        <div className="h-24 rounded-lg bg-gray-100 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 rounded bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h3 className="font-semibold text-red-800">RI Governance Scorecard</h3>
        <p className="mt-2 text-sm text-red-600">Failed to load: {error}</p>
      </div>
    );
  }

  const { scores, inputs_summary } = data;
  const risk = riskLevel(scores.overall_governance_score);

  const toggle = (section: string) =>
    setExpandedSection((prev) => (prev === section ? null : section));

  const criticalScores = [
    { key: "safeguarding_oversight_score" as const, label: "Safeguarding Oversight" },
    { key: "incident_management_score" as const, label: "Incident Management" },
    { key: "reg45_compliance_score" as const, label: "Reg 45 Compliance" },
  ];

  const trainingScores = [
    { key: "training_compliance_score" as const, label: "Training Compliance" },
    { key: "staff_supervision_score" as const, label: "Staff Supervision" },
  ];

  const qualityScores = [
    { key: "care_planning_score" as const, label: "Care Planning" },
    { key: "child_voice_score" as const, label: "Child Voice" },
    { key: "medication_governance_score" as const, label: "Medication Governance" },
  ];

  const infraScores = [
    { key: "building_safety_score" as const, label: "Building Safety" },
    { key: "recruitment_compliance_score" as const, label: "Recruitment Compliance" },
    { key: "complaint_management_score" as const, label: "Complaint Management" },
  ];

  const oversightScores = [
    { key: "oversight_quality_score" as const, label: "Oversight Quality" },
    { key: "outcome_evidence_score" as const, label: "Outcome Evidence" },
    { key: "challenge_log_score" as const, label: "Challenge Log" },
    { key: "missing_episodes_score" as const, label: "Missing Episodes" },
  ];

  const allSubScores = Object.entries(SCORE_LABELS).map(([key, label]) => ({
    key: key as keyof RiScores,
    label,
    score: scores[key as keyof RiScores],
  }));

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            RI Governance Scorecard
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {inputs_summary.yp_count} young people &middot; {inputs_summary.daily_logs} daily logs &middot; {inputs_summary.incidents} incidents
          </p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-semibold ${risk.className}`}>
          {risk.label}
        </span>
      </div>

      {/* Hero metric */}
      <div className={`flex flex-col items-center rounded-xl border-2 p-6 mb-5 ${
        scores.overall_governance_score >= 80 ? "border-green-200 bg-green-50" :
        scores.overall_governance_score >= 60 ? "border-amber-200 bg-amber-50" :
        "border-red-200 bg-red-50"
      }`}>
        <span className={`text-5xl font-black ${scoreColor(scores.overall_governance_score)}`}>
          {scores.overall_governance_score}
        </span>
        <span className="text-sm text-gray-600 mt-1 font-medium">Overall Governance Score</span>
        <div className="w-full max-w-xs mt-3">
          <div className={`h-3 rounded-full overflow-hidden ${barBgColor(scores.overall_governance_score)}`}>
            <div
              className={`h-full rounded-full transition-all ${barColor(scores.overall_governance_score)}`}
              style={{ width: `${scores.overall_governance_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick summary badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        {scores.safeguarding_oversight_score < 80 && (
          <span className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-medium border border-red-200">
            SAFEGUARDING ATTENTION NEEDED
          </span>
        )}
        {scores.reg45_compliance_score >= 88 && (
          <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-medium border border-green-200">
            REG 45 ON TRACK
          </span>
        )}
        {scores.building_safety_score >= 85 && (
          <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-medium border border-green-200">
            BUILDING SAFETY STRONG
          </span>
        )}
        {scores.recruitment_compliance_score >= 85 && (
          <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-medium border border-green-200">
            RECRUITMENT COMPLIANT
          </span>
        )}
        {scores.staff_supervision_score < 70 && (
          <span className="rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-medium border border-amber-200">
            SUPERVISION OVERDUE
          </span>
        )}
        {scores.training_compliance_score < 70 && (
          <span className="rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-medium border border-amber-200">
            TRAINING GAPS
          </span>
        )}
      </div>

      {/* Individual Score Breakdown */}
      <Section
        title="Individual Score Breakdown"
        expanded={expandedSection === "breakdown"}
        onToggle={() => toggle("breakdown")}
        badge={
          <span className="ml-auto text-xs text-gray-400 font-normal">15 metrics</span>
        }
      >
        <div className="space-y-0.5">
          {allSubScores
            .sort((a, b) => a.score - b.score)
            .map(({ key, label, score }) => (
              <ScoreBar key={key} label={label} score={score} />
            ))}
        </div>
      </Section>

      {/* Critical Indicators */}
      <Section
        title="Critical Indicators"
        expanded={expandedSection === "critical"}
        onToggle={() => toggle("critical")}
        badge={
          criticalScores.some(({ key }) => scores[key] < 60) ? (
            <span className="ml-2 rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs font-medium border border-red-200">
              ATTENTION
            </span>
          ) : undefined
        }
      >
        <div className="space-y-0.5">
          {criticalScores.map(({ key, label }) => (
            <ScoreBar key={key} label={label} score={scores[key]} />
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500">
          These indicators carry the highest weighting in the overall governance score.
          Safeguarding oversight has a 2.0x weight; incident management and Reg 45 each carry 1.5x.
        </p>
      </Section>

      {/* Training & Supervision */}
      <Section
        title="Training & Supervision"
        expanded={expandedSection === "training"}
        onToggle={() => toggle("training")}
      >
        <div className="space-y-0.5">
          {trainingScores.map(({ key, label }) => (
            <ScoreBar key={key} label={label} score={scores[key]} />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-gray-50 p-2">
            <span className="text-lg font-bold text-gray-900">{inputs_summary.training_records}</span>
            <p className="text-xs text-gray-500">Training Records</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <span className="text-lg font-bold text-gray-900">{inputs_summary.supervisions_overdue}</span>
            <p className="text-xs text-gray-500">Supervisions Overdue</p>
          </div>
        </div>
      </Section>

      {/* Quality of Care */}
      <Section
        title="Quality of Care"
        expanded={expandedSection === "quality"}
        onToggle={() => toggle("quality")}
      >
        <div className="space-y-0.5">
          {qualityScores.map(({ key, label }) => (
            <ScoreBar key={key} label={label} score={scores[key]} />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-gray-50 p-2">
            <span className="text-lg font-bold text-gray-900">{inputs_summary.care_forms}</span>
            <p className="text-xs text-gray-500">Care Forms</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <span className="text-lg font-bold text-gray-900">{inputs_summary.daily_logs}</span>
            <p className="text-xs text-gray-500">Daily Logs</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <span className="text-lg font-bold text-gray-900">{inputs_summary.medication_audits}</span>
            <p className="text-xs text-gray-500">Med Audits</p>
          </div>
        </div>
      </Section>

      {/* Infrastructure */}
      <Section
        title="Infrastructure"
        expanded={expandedSection === "infra"}
        onToggle={() => toggle("infra")}
      >
        <div className="space-y-0.5">
          {infraScores.map(({ key, label }) => (
            <ScoreBar key={key} label={label} score={scores[key]} />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-gray-50 p-2">
            <span className="text-lg font-bold text-gray-900">{inputs_summary.audits}</span>
            <p className="text-xs text-gray-500">Safety Audits</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <span className="text-lg font-bold text-gray-900">{inputs_summary.active_candidates}</span>
            <p className="text-xs text-gray-500">Active Candidates</p>
          </div>
        </div>
      </Section>

      {/* Oversight & Evidence */}
      <Section
        title="Oversight & Evidence"
        expanded={expandedSection === "oversight"}
        onToggle={() => toggle("oversight")}
      >
        <div className="space-y-0.5">
          {oversightScores.map(({ key, label }) => (
            <ScoreBar key={key} label={label} score={scores[key]} />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-gray-50 p-2">
            <span className="text-lg font-bold text-gray-900">{inputs_summary.challenges}</span>
            <p className="text-xs text-gray-500">RI Challenges</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <span className="text-lg font-bold text-gray-900">{inputs_summary.audits_overdue}</span>
            <p className="text-xs text-gray-500">Audits Overdue</p>
          </div>
        </div>
      </Section>

      {/* Regulatory footer */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="font-semibold text-gray-700">Regulatory framework:</span>{" "}
          Children&apos;s Homes (England) Regulations 2015, Regulation 45 &mdash; Review of quality of care.
          Social Care Common Inspection Framework (SCCIF) &mdash; leadership and management judgement
          includes governance, oversight quality, and evidence of impact.
          Scores are computed deterministically from live operational data and should be reviewed
          alongside qualitative evidence.
        </p>
      </div>
    </div>
  );
}
