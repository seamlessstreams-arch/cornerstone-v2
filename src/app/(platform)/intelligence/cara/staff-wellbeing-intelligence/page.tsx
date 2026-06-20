"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, CheckCircle, AlertTriangle, Clock, Users } from "lucide-react";
import { useHomeStaffWellbeingIntelligence } from "@/hooks/use-home-staff-wellbeing-intelligence";
import type { HomeStaffWellbeingResult, StaffWellbeingRating } from "@/lib/engines/home-staff-wellbeing-intelligence-engine";

const RATING_META: Record<StaffWellbeingRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 80 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 50 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ScoreBar({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color = pct >= 70 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 50 ? "text-red-600" : "text-foreground"}`}>{value}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function StaffWellbeingIntelligencePage() {
  const { data, isLoading, error } = useHomeStaffWellbeingIntelligence();
  const d: HomeStaffWellbeingResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Staff Wellbeing Intelligence" description="Analysing staff wellbeing check coverage, morale scores, stressor patterns, and follow-up completion…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Staff Wellbeing Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load staff wellbeing data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.wellbeing_rating];

  return (
    <PageShell
      title="Staff Wellbeing Intelligence"
      description="Staff wellbeing check coverage and frequency, morale and workload scores, stressor patterns, check-type distribution, and follow-up compliance — evidencing that the home takes a proactive, structured approach to staff wellbeing in line with the Health & Safety at Work Act 1974, CHR 2015 Regulation 33/35, NHS People Plan 2020/21 psychological safety principles, Working Together to Safeguard Children 2023 duty to staff welfare, and the broader evidence that staff wellbeing is a direct predictor of care quality and safeguarding outcomes."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Heart className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Wellbeing score: {d.wellbeing_score}/100 · coverage {Math.round(d.coverage.coverage_rate)}% · avg morale {d.morale.avg_overall}/10 · {d.morale.at_risk_count} at risk · {d.follow_ups.overdue_follow_ups} overdue follow-ups
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.wellbeing_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.morale.at_risk_count > 0 || d.follow_ups.overdue_follow_ups > 0 || d.coverage.coverage_rate < 70) && (
          <div className="flex flex-col gap-2">
            {d.morale.at_risk_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.morale.at_risk_count} staff member{d.morale.at_risk_count > 1 ? "s" : ""} with an overall wellbeing score of 4 or below — a score this low indicates a staff member who is experiencing significant distress; a distressed practitioner cannot provide the emotionally regulated, therapeutic care that children in residential settings need; the link between staff distress and increased risk of inappropriate or harmful responses to children is well-evidenced; these individuals need immediate management attention, not a scheduled check-in
              </div>
            )}
            {d.follow_ups.overdue_follow_ups > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {d.follow_ups.overdue_follow_ups} overdue wellbeing follow-up{d.follow_ups.overdue_follow_ups > 1 ? "s" : ""} — a wellbeing check that identifies a concern and then generates a follow-up that never happens is worse than no check at all; it signals to staff that concerns are recorded but not acted upon, which corrodes trust in the management relationship and discourages future disclosure
              </div>
            )}
            {d.coverage.coverage_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Users className="h-3.5 w-3.5 flex-shrink-0" />
                Staff wellbeing check coverage {Math.round(d.coverage.coverage_rate)}% — over a quarter of staff have not had a recorded wellbeing check; staff who are not checked in with are invisible to the management system; problems that would be identified and addressed in a check — burnout, compassion fatigue, personal difficulties affecting practice — accumulate undetected until they manifest in the quality of care or in absence and attrition
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total checks", value: d.coverage.total_checks, color: "text-blue-600" },
            { label: "Staff checked", value: d.coverage.unique_staff_checked, color: "text-purple-600" },
            { label: "At risk (score ≤4)", value: d.morale.at_risk_count, color: d.morale.at_risk_count > 0 ? "text-red-600" : "text-emerald-600" },
            { label: "Thriving (score ≥7)", value: d.morale.thriving_count, color: "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Heart className="h-4 w-4 text-muted-foreground" /> Morale Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ScoreBar label="Average overall wellbeing" value={d.morale.avg_overall} />
              <ScoreBar label="Average workload score" value={d.morale.avg_workload} />
              <ScoreBar label="Average support score" value={d.morale.avg_support} />
              <ScoreBar label="Average moral distress score" value={d.morale.avg_moral} />
              <div className="grid grid-cols-2 gap-4 pt-1 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>Lowest score</span><span className="text-red-600 font-medium">{d.morale.lowest_overall}/10</span></div>
                <div className="flex justify-between"><span>Highest score</span><span className="text-emerald-600 font-medium">{d.morale.highest_overall}/10</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> Coverage & Follow-ups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Staff coverage rate" value={d.coverage.coverage_rate} warn={80} />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-blue-600">{d.coverage.checks_last_30_days}</p>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-blue-600">{d.coverage.checks_last_90_days}</p>
                  <p className="text-xs text-muted-foreground">Last 90 days</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-blue-600">{d.follow_ups.total_follow_ups_due}</p>
                  <p className="text-xs text-muted-foreground">Follow-ups due</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-red-600">{d.follow_ups.overdue_follow_ups}</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-sm font-bold text-amber-600">{d.follow_ups.upcoming_follow_ups}</p>
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Check Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Monthly check-in", value: d.check_types.monthly_checkin },
                { label: "Post-incident", value: d.check_types.post_incident },
                { label: "Supervision wellbeing", value: d.check_types.supervision_wellbeing },
                { label: "Return from absence", value: d.check_types.return_from_absence },
                { label: "Self-referral", value: d.check_types.self_referral },
                { label: "Manager concern", value: d.check_types.manager_concern },
              ].map(({ label, value }) => (
                <div key={label} className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-blue-600">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Stressor Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>Total stressors identified</span><span className="font-medium text-foreground">{d.stressor_profile.total_stressors}</span></div>
              <div className="flex justify-between"><span>Unique stressor types</span><span className="font-medium text-foreground">{d.stressor_profile.unique_stressors}</span></div>
              <div className="flex justify-between"><span>Positives recorded</span><span className="font-medium text-emerald-600">{d.stressor_profile.total_positives}</span></div>
              <div className="flex justify-between"><span>Support needed</span><span className="font-medium text-amber-600">{d.stressor_profile.checks_with_support_needed}</span></div>
              <div className="flex justify-between"><span>Action agreed</span><span className="font-medium text-blue-600">{d.stressor_profile.checks_with_action_agreed}</span></div>
            </div>
          </CardContent>
        </Card>

        {d.insights.length > 0 && (
          <div className="space-y-2">
            {d.insights.map((ins, i) => {
              const cls =
                ins.severity === "critical" ? "bg-red-50 border-red-200 text-red-800" :
                ins.severity === "warning"  ? "bg-amber-50 border-amber-200 text-amber-800" :
                "bg-emerald-50 border-emerald-200 text-emerald-800";
              return (
                <div key={i} className={`flex items-start gap-2 rounded border px-3 py-2 text-xs ${cls}`}>
                  {ins.severity === "critical" ? <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
                   ins.severity === "positive"  ? <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
                   <Clock className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />}
                  {ins.text}
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {d.strengths.length > 0 && (
            <Card className="border-emerald-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-emerald-700 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {d.strengths.map((s, i) => (
                    <li key={i} className="text-xs flex gap-2"><CheckCircle className="h-3 w-3 text-emerald-500 flex-shrink-0 mt-0.5" />{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {d.concerns.length > 0 && (
            <Card className="border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-amber-700 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Concerns</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {d.concerns.map((c, i) => (
                    <li key={i} className="text-xs flex gap-2"><AlertTriangle className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" />{c}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {d.recommendations.length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Recommendations</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {d.recommendations.map((rec) => {
                const urgencyColor =
                  rec.urgency === "immediate" ? "bg-red-100 text-red-700 border-red-200" :
                  rec.urgency === "soon"      ? "bg-amber-100 text-amber-700 border-amber-200" :
                  "bg-blue-100 text-blue-700 border-blue-200";
                return (
                  <div key={rec.rank} className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">{rec.rank}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{rec.recommendation}</p>
                      {rec.regulatory_ref && <p className="text-xs text-muted-foreground mt-0.5">{rec.regulatory_ref}</p>}
                    </div>
                    <Badge variant="outline" className={`text-xs capitalize border ${urgencyColor}`}>{rec.urgency}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          Staff wellbeing is not a soft metric — it is the operational foundation on which therapeutic care rests. The evidence base from residential care, secure settings, and inpatient mental health services consistently shows that staff who are experiencing poor wellbeing — particularly high workload scores, low support scores, or signs of compassion fatigue — are significantly more likely to respond to children's behaviour with frustration and reactivity rather than attunement and therapeutic intent. This is not a character failing; it is a predictable consequence of sustained exposure to secondary trauma without adequate support. A wellbeing check programme that is proactive (regular monthly check-ins), responsive (post-incident and post-absence checks), and person-led (self-referral available) creates the conditions in which staff can name their experience before it becomes a risk. The morale profile — particularly the at-risk count (overall score ≤4) and the lowest individual score — is the most important leading indicator in this dashboard: the manager's immediate task when these numbers are elevated is not to improve the aggregate score but to make direct, personal contact with the individuals identified and to take whatever action is needed to reduce the risk they face and the risk they may pose. The check-type distribution reveals whether the programme is genuinely proactive (monthly check-ins driving the volume) or predominantly reactive (post-incident checks dominant), which tells the manager whether the home is preventing wellbeing problems or mainly responding to them. The stressor profile, and especially the ratio of positives recorded to stressors identified, measures whether the culture of the check is genuine wellbeing dialogue or a compliance exercise — homes where positives are rarely recorded are running a problem-listing exercise, not a wellbeing conversation.
        </p>
      </div>
    </PageShell>
  );
}
