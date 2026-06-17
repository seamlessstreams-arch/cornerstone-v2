"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, AlertTriangle, Clock, Star, Heart } from "lucide-react";
import { useHomeMentalHealthIntelligence } from "@/hooks/use-home-mental-health-intelligence";
import type { MentalHealthRating } from "@/lib/engines/home-mental-health-intelligence-engine";

const RATING_META: Record<MentalHealthRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 80, inverse = false }: { label: string; value: number; warn?: number; inverse?: boolean }) {
  const pct = Math.round(value);
  const good = inverse ? pct === 0 : pct >= warn;
  const ok   = inverse ? pct <= 10 : pct >= 50;
  const color = good ? "bg-emerald-500" : ok ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${(!inverse && pct < 50) || (inverse && pct > 10) ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function MentalHealthIntelligencePage() {
  const { data, isLoading, error } = useHomeMentalHealthIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Mental Health Intelligence" description="Analysing mental health and wellbeing data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Mental Health Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load mental health intelligence data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.mental_health_rating];
  const ci = d.check_ins;
  const th = d.therapy;
  const sp = d.safety_plans;
  const ref = d.referrals;

  return (
    <PageShell
      title="Mental Health Intelligence"
      description="Check-in coverage, therapy engagement, safety plan compliance and therapeutic referral waiting times (CAMHS standards; CHR 2015 Reg 10; Working Together 2023; CYP mental health framework)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Brain className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Mental health score: {d.mental_health_score}/100 · {ci.children_with_check_ins} children with check-ins · avg mood {ci.avg_mood_rating.toFixed(1)}/5
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.mental_health_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(ci.low_mood_count > 0 || sp.overdue_reviews > 0) && (
          <div className="flex flex-wrap gap-2">
            {ci.low_mood_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {ci.low_mood_count} low-mood check-ins recorded (mood ≤ 2) — review with keyworker
              </div>
            )}
            {sp.overdue_reviews > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {sp.overdue_reviews} safety plan review(s) overdue — immediate attention required
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Check-ins */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  Daily Check-ins (30d)
                </CardTitle>
                <Badge variant="outline" className="text-xs">{ci.total_check_ins_30d} check-ins</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{ci.children_with_check_ins}</p>
                  <p className="text-xs text-muted-foreground">Children</p>
                </div>
                <div className={`rounded border p-2 text-center ${ci.low_mood_count > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${ci.low_mood_count > 0 ? "text-amber-700" : "text-foreground"}`}>{ci.low_mood_count}</p>
                  <p className="text-xs text-muted-foreground">Low mood</p>
                </div>
                <div className={`rounded border p-2 text-center ${ci.flagged_check_ins > 0 ? "bg-red-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${ci.flagged_check_ins > 0 ? "text-red-600" : "text-foreground"}`}>{ci.flagged_check_ins}</p>
                  <p className="text-xs text-muted-foreground">Flagged</p>
                </div>
              </div>
              <RateBar label="Check-in coverage" value={ci.check_in_coverage_rate} />
              <RateBar label="Follow-up actions completed" value={ci.follow_up_rate} />
            </CardContent>
          </Card>

          {/* Therapy */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4 text-muted-foreground" />
                  Therapy Sessions (90d)
                </CardTitle>
                <Badge variant="outline" className="text-xs">{th.total_sessions_90d} sessions</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{th.children_in_therapy}</p>
                  <p className="text-xs text-muted-foreground">In therapy</p>
                </div>
                <div className={`rounded border p-2 text-center ${th.sessions_with_escalation > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${th.sessions_with_escalation > 0 ? "text-amber-700" : "text-foreground"}`}>{th.sessions_with_escalation}</p>
                  <p className="text-xs text-muted-foreground">Escalations</p>
                </div>
              </div>
              <RateBar label="Attendance rate" value={th.attendance_rate} />
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>Avg mood improvement per session</span>
                <span className={`font-medium ${th.avg_mood_improvement >= 0.5 ? "text-emerald-600" : "text-amber-600"}`}>
                  +{th.avg_mood_improvement.toFixed(1)} pts
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Safety Plans */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  Safety Plans
                </CardTitle>
                <Badge variant={sp.overdue_reviews > 0 ? "destructive" : "outline"} className="text-xs">
                  {sp.overdue_reviews} overdue reviews
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{sp.active_plans}</p>
                  <p className="text-xs text-muted-foreground">Active plans</p>
                </div>
                <div className={`rounded border p-2 text-center ${sp.recent_incident_plans > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${sp.recent_incident_plans > 0 ? "text-amber-700" : "text-foreground"}`}>{sp.recent_incident_plans}</p>
                  <p className="text-xs text-muted-foreground">Post-incident</p>
                </div>
              </div>
              <RateBar label="Child co-production rate" value={sp.co_production_rate} />
              <RateBar label="Child signed off" value={sp.child_signed_rate} />
            </CardContent>
          </Card>

          {/* Referrals */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Therapeutic Referrals
                </CardTitle>
                <Badge variant="outline" className="text-xs">{ref.active_referrals} active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold">{ref.active_referrals}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
                <div className={`rounded border p-2 text-center ${ref.pending_referrals > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
                  <p className={`text-lg font-bold ${ref.pending_referrals > 0 ? "text-amber-700" : "text-foreground"}`}>{ref.pending_referrals}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                <span>Avg waiting time</span>
                <span className={`font-medium ${ref.avg_waiting_weeks > 8 ? "text-red-600" : ref.avg_waiting_weeks > 4 ? "text-amber-600" : "text-emerald-600"}`}>
                  {ref.avg_waiting_weeks.toFixed(1)} wks
                </span>
              </div>
              <RateBar label="Therapy coverage rate" value={ref.therapy_coverage_rate} />
            </CardContent>
          </Card>
        </div>

        {d.insights.length > 0 && (
          <div className="space-y-2">
            {d.insights.map((ins, i) => {
              const sev = ins.severity as string;
              const cls =
                sev === "critical" ? "bg-red-50 border-red-200 text-red-800" :
                sev === "warning"  ? "bg-amber-50 border-amber-200 text-amber-800" :
                "bg-emerald-50 border-emerald-200 text-emerald-800";
              return (
                <div key={i} className={`flex items-start gap-2 rounded border px-3 py-2 text-xs ${cls}`}>
                  {sev === "critical" ? <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
                   sev === "positive"  ? <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> :
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
                    <li key={i} className="text-xs flex gap-2"><Star className="h-3 w-3 text-emerald-500 flex-shrink-0 mt-0.5" />{s}</li>
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
                const urg = rec.urgency as string;
                const urgencyColor =
                  urg === "immediate" ? "bg-red-100 text-red-700 border-red-200" :
                  urg === "soon"      ? "bg-amber-100 text-amber-700 border-amber-200" :
                  "bg-blue-100 text-blue-700 border-blue-200";
                return (
                  <div key={rec.rank} className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">{rec.rank}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{rec.recommendation}</p>
                      {rec.regulatory_ref && <p className="text-xs text-muted-foreground mt-0.5">{rec.regulatory_ref}</p>}
                    </div>
                    <Badge variant="outline" className={`text-xs capitalize border ${urgencyColor}`}>{urg}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          CAMHS standards and waiting-time targets. CHR 2015 Reg 10 (children's health). Working Together 2023 — supporting mental health. NHS CYP mental health framework. NICE guidance NG225.
        </p>
      </div>
    </PageShell>
  );
}
