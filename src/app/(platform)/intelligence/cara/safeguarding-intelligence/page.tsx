"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, Clock, Star, Globe, Eye } from "lucide-react";
import { useHomeSafeguardingIntelligence } from "@/hooks/use-home-safeguarding-intelligence";
import type { SafeguardingRating } from "@/lib/engines/home-safeguarding-intelligence-engine";

const RATING_META: Record<SafeguardingRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function SafeguardingIntelligencePage() {
  const { data, isLoading, error } = useHomeSafeguardingIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Safeguarding Intelligence" description="Analysing safeguarding data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Safeguarding Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load safeguarding intelligence data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.safeguarding_rating];
  const ctx = d.contextual_risk_profile;
  const exp = d.exploitation_profile;
  const online = d.online_safety_profile;

  return (
    <PageShell
      title="Safeguarding Intelligence"
      description="Contextual safeguarding risks, exploitation screening, online safety and multi-agency working (KCSIE 2024; Working Together 2023; CHR 2015 Reg 34)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Shield className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Safeguarding score: {d.safeguarding_score}/100</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.safeguarding_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical alerts */}
        {(ctx.high_very_high_count > 0 || ctx.escalated_count > 0 || exp.high_risk_count > 0 || online.unresolved_high_critical > 0) && (
          <div className="flex flex-wrap gap-2">
            {ctx.high_very_high_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {ctx.high_very_high_count} high/very-high contextual risk(s) active
              </div>
            )}
            {ctx.escalated_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {ctx.escalated_count} escalated risk(s) requiring immediate action
              </div>
            )}
            {exp.high_risk_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {exp.high_risk_count} high-risk exploitation screening(s)
              </div>
            )}
            {online.unresolved_high_critical > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {online.unresolved_high_critical} unresolved high/critical online safety incident(s)
              </div>
            )}
          </div>
        )}

        {/* Three profile cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Contextual risk */}
          <Card className={ctx.high_very_high_count > 0 ? "border-red-200" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Contextual Risk
                </CardTitle>
                <Badge variant="outline" className="text-xs">{ctx.total_risks} risks</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-blue-600">{ctx.active_count}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${ctx.escalated_count > 0 ? "text-red-600" : "text-foreground"}`}>{ctx.escalated_count}</p>
                  <p className="text-xs text-muted-foreground">Escalated</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${ctx.overdue_reviews > 0 ? "text-amber-600" : "text-foreground"}`}>{ctx.overdue_reviews}</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
              <RateBar label="Multi-agency working" value={ctx.multi_agency_rate} warn={90} />
              <RateBar label="Protective action in place" value={ctx.protective_action_rate} />
            </CardContent>
          </Card>

          {/* Exploitation screening */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  Exploitation Screening
                </CardTitle>
                <Badge variant="outline" className="text-xs">{exp.total_screenings} screenings</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <RateBar label="Screening coverage" value={exp.screening_coverage} warn={100} />
              <RateBar label="Safety plan in place (high risk)" value={exp.safety_plan_rate} warn={100} />
              <RateBar label="SW notification rate" value={exp.social_worker_notification_rate} warn={90} />
              {exp.nrm_referral_count > 0 && (
                <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-700">
                  <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                  {exp.nrm_referral_count} NRM referral(s) made
                </div>
              )}
              {exp.children_not_screened.length > 0 && (
                <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-700">
                  <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                  {exp.children_not_screened.length} child(ren) not yet screened
                </div>
              )}
            </CardContent>
          </Card>

          {/* Online safety */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Online Safety (90 days)
                </CardTitle>
                <Badge variant="outline" className="text-xs">{online.total_incidents_90d} incidents</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {online.high_critical_count > 0 && (
                <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-700">
                  <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                  {online.high_critical_count} high/critical severity incident(s)
                </div>
              )}
              <RateBar label="Child discussion following incident" value={online.child_discussion_rate} />
              <RateBar label="Follow-up completed" value={online.follow_up_rate} />
              <RateBar label="Parent/carer notification" value={online.parent_notification_rate} />
            </CardContent>
          </Card>
        </div>

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
                const urgencyColor =
                  rec.urgency === "immediate" ? "bg-red-100 text-red-700 border-red-200" :
                  rec.urgency === "soon"       ? "bg-amber-100 text-amber-700 border-amber-200" :
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
          KCSIE 2024. Working Together to Safeguard Children 2023. CHR 2015 Reg 34 (safeguarding). Modern Slavery Act 2015 (NRM). SCCIF: "How well children are helped and protected."
        </p>
      </div>
    </PageShell>
  );
}
