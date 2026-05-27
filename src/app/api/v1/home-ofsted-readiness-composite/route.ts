import { NextResponse } from "next/server";
import {
  computeHomeOfstedReadiness,
  type EngineScoreInput,
} from "@/lib/engines/home-ofsted-readiness-composite-engine";

export const dynamic = "force-dynamic";

/**
 * Fetches all engine API routes internally and aggregates their scores.
 * Each engine API returns { data: { ..._rating, ..._score } }.
 */
async function fetchEngineScore(baseUrl: string, routeName: string, engineName: string, domain: string): Promise<EngineScoreInput | null> {
  try {
    const res = await fetch(`${baseUrl}/api/v1/${routeName}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const d = json.data;
    if (!d) return null;
    // Find the rating and score fields dynamically
    const ratingKey = Object.keys(d).find(k => k.endsWith("_rating"));
    const scoreKey = Object.keys(d).find(k => k.endsWith("_score"));
    if (!ratingKey || !scoreKey) return null;
    return { engine_name: engineName, score: d[scoreKey] ?? 0, rating: d[ratingKey] ?? "insufficient_data", domain };
  } catch {
    return null;
  }
}

const ENGINE_ROUTES: [string, string, string][] = [
  // [routeName, engineName, domain]
  // Experiences
  ["home-health-wellbeing-intelligence", "health-wellbeing", "experiences"],
  ["home-health-monitoring-intelligence", "health-monitoring", "experiences"],
  ["home-mental-health-intelligence", "mental-health", "experiences"],
  ["home-sleep-quality-intelligence", "sleep-quality", "experiences"],
  ["home-nutrition-catering-intelligence", "nutrition-catering", "experiences"],
  ["home-education-engagement-intelligence", "education-engagement", "experiences"],
  ["home-education-achievement-intelligence", "education-achievement", "experiences"],
  ["home-therapeutic-progress-intelligence", "therapeutic-progress", "experiences"],
  ["home-therapeutic-climate-intelligence", "therapeutic-climate", "experiences"],
  ["home-enrichment-achievement-intelligence", "enrichment-achievement", "experiences"],
  ["home-activity-enrichment-intelligence", "activity-enrichment", "experiences"],
  ["home-community-access-intelligence", "community-access", "experiences"],
  ["home-wellbeing-intelligence", "wellbeing", "experiences"],
  ["home-outcomes-progress-intelligence", "outcomes-progress", "experiences"],
  ["home-independence-intelligence", "independence", "experiences"],
  ["home-independence-life-skills-intelligence", "independence-life-skills", "experiences"],
  ["home-peer-dynamics-intelligence", "peer-dynamics", "experiences"],
  ["home-placement-stability-intelligence", "placement-stability", "experiences"],
  ["home-placement-stability-depth-intelligence", "placement-stability-depth", "experiences"],
  ["home-living-environment-intelligence", "living-environment", "experiences"],
  ["home-cultural-identity-intelligence", "cultural-identity", "experiences"],
  ["home-life-story-identity-intelligence", "life-story-identity", "experiences"],
  ["home-placement-journey-intelligence", "placement-journey", "experiences"],
  ["home-child-voice-intelligence", "child-voice", "experiences"],
  ["home-childrens-rights-participation-intelligence", "childrens-rights-participation", "experiences"],
  ["home-participation-intelligence", "participation", "experiences"],
  ["home-family-engagement-intelligence", "family-engagement", "experiences"],
  ["home-communication-contact-intelligence", "communication-contact", "experiences"],
  ["home-transition-planning-intelligence", "transition-planning", "experiences"],
  ["home-financial-wellbeing-intelligence", "financial-wellbeing", "experiences"],
  ["home-specialized-health-plans-intelligence", "specialized-health-plans", "experiences"],
  ["home-night-care-safety-intelligence", "night-care-safety", "experiences"],
  ["home-key-working-intelligence", "key-working", "experiences"],
  ["home-keyworker-intelligence", "keyworker", "experiences"],
  ["home-digital-safety-intelligence", "digital-safety", "experiences"],
  // Protection
  ["home-safeguarding-intelligence", "safeguarding", "protection"],
  ["home-safeguarding-depth-intelligence", "safeguarding-depth", "protection"],
  ["home-safeguarding-prevention-intelligence", "safeguarding-prevention", "protection"],
  ["home-exploitation-screening-intelligence", "exploitation-screening", "protection"],
  ["home-missing-episodes-intelligence", "missing-episodes", "protection"],
  ["home-incident-safety-intelligence", "incident-safety", "protection"],
  ["home-behaviour-intelligence", "behaviour", "protection"],
  ["home-bsp-effectiveness-intelligence", "bsp-effectiveness", "protection"],
  ["home-restrictive-practice-intelligence", "restrictive-practice", "protection"],
  ["home-risk-assessment-intelligence", "risk-assessment", "protection"],
  ["home-risk-landscape-intelligence", "risk-landscape", "protection"],
  ["home-strategic-risk-intelligence", "strategic-risk", "protection"],
  ["home-notifiable-events-intelligence", "notifiable-events", "protection"],
  ["home-emergency-preparedness-intelligence", "emergency-preparedness", "protection"],
  ["home-fire-safety-intelligence", "fire-safety", "protection"],
  ["home-building-ops-safety-intelligence", "building-ops-safety", "protection"],
  ["home-premises-safety-intelligence", "premises-safety", "protection"],
  ["home-medication-governance-intelligence", "medication-governance", "protection"],
  ["home-medication-management-intelligence", "medication-management", "protection"],
  ["home-complaints-intelligence", "complaints", "protection"],
  ["home-on-call-governance-intelligence", "on-call-governance", "protection"],
  ["home-night-safety-intelligence", "night-safety", "protection"],
  ["home-staff-safety-intelligence", "staff-safety", "protection"],
  // Leadership
  ["home-regulatory-compliance-intelligence", "regulatory-compliance", "leadership"],
  ["home-policy-compliance-intelligence", "policy-compliance", "leadership"],
  ["home-quality-assurance-intelligence", "quality-assurance", "leadership"],
  ["home-reg44-intelligence", "reg44", "leadership"],
  ["home-reg4445-evidence-intelligence", "reg4445-evidence", "leadership"],
  ["home-data-governance-intelligence", "data-governance", "leadership"],
  ["home-document-governance-intelligence", "document-governance", "leadership"],
  ["home-recording-quality-intelligence", "recording-quality", "leadership"],
  ["home-organizational-learning-intelligence", "organizational-learning", "leadership"],
  ["home-meeting-governance-intelligence", "meeting-governance", "leadership"],
  ["home-multi-agency-intelligence", "multi-agency", "leadership"],
  ["home-delegated-authority-intelligence", "delegated-authority", "leadership"],
  ["home-expense-governance-intelligence", "expense-governance", "leadership"],
  ["home-visitor-intelligence", "visitor", "leadership"],
  ["home-leave-absence-intelligence", "leave-absence", "leadership"],
  ["home-lac-review-intelligence", "lac-review", "leadership"],
  ["home-chronology-intelligence", "chronology", "leadership"],
  // Workforce
  ["home-workforce-planning-intelligence", "workforce-planning", "workforce"],
  ["home-staff-lifecycle-intelligence", "staff-lifecycle", "workforce"],
  ["home-staff-development-intelligence", "staff-development", "workforce"],
  ["home-staff-wellbeing-intelligence", "staff-wellbeing", "workforce"],
  ["home-supervision-intelligence", "supervision", "workforce"],
  ["home-competency-landscape-intelligence", "competency-landscape", "workforce"],
  ["home-safer-recruitment-intelligence", "safer-recruitment", "workforce"],
  ["home-shift-pattern-intelligence", "shift-pattern", "workforce"],
  ["home-handover-continuity-intelligence", "handover-continuity", "workforce"],
  ["home-facilities-compliance-intelligence", "facilities-compliance", "workforce"],
  ["home-daily-log-intelligence", "daily-log", "workforce"],
  ["home-admission-intelligence", "admission", "workforce"],
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const today = new Date().toISOString().slice(0, 10);

  const results = await Promise.allSettled(
    ENGINE_ROUTES.map(([route, name, domain]) => fetchEngineScore(baseUrl, route, name, domain))
  );

  const engine_scores: EngineScoreInput[] = results
    .map(r => r.status === "fulfilled" ? r.value : null)
    .filter((v): v is EngineScoreInput => v !== null);

  const result = computeHomeOfstedReadiness({
    today,
    engine_scores,
    total_children: 0,
    total_staff: 0,
  });

  return NextResponse.json({ data: result });
}
