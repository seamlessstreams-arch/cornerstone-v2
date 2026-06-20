"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeLeaveAbsenceIntelligence } from "@/hooks/use-home-leave-absence-intelligence";
import type { HomeLeaveAbsenceResult, LeaveAbsenceRating } from "@/lib/engines/home-leave-absence-intelligence-engine";

const RATING_META: Record<LeaveAbsenceRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function LeaveAbsenceIntelligencePage() {
  const { data, isLoading, error } = useHomeLeaveAbsenceIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Leave & Absence Intelligence" description="Analysing staff leave and absence data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Leave & Absence Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load leave and absence data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.leave_rating];
  const vol = d.volume;
  const sick = d.sickness;
  const plan = d.planning;

  return (
    <PageShell
      title="Leave & Absence Intelligence"
      description="Staff leave volumes, sickness absence patterns, return-to-work compliance and current absence impact on staffing — evidencing that the home maintains safe staffing levels and manages absence in a way that protects continuity of care for children (CHR 2015 Reg 32; Fit and Proper Person requirements)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Calendar className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Leave score: {d.leave_score}/100 · {vol.total_requests} requests · {plan.current_absent_count} currently absent · sickness rate {Math.round(sick.sick_rate)}% · RTW compliance {Math.round(sick.rtw_compliance_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.leave_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(sick.rtw_required > sick.rtw_completed || plan.current_absent_rate > 25 || sick.sick_rate > 15) && (
          <div className="flex flex-col gap-2">
            {sick.rtw_required > sick.rtw_completed && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {sick.rtw_required - sick.rtw_completed} return-to-work interview{sick.rtw_required - sick.rtw_completed > 1 ? "s" : ""} outstanding — RTW interviews are a legal duty-of-care obligation and a key tool for identifying staff who may be struggling; each outstanding RTW is a safeguarding gap
              </div>
            )}
            {plan.current_absent_rate > 25 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {Math.round(plan.current_absent_rate)}% of staff currently absent — high concurrent absence directly threatens minimum staffing ratios and continuity of care; Ofsted will ask how the home ensures children's safety during absence periods
              </div>
            )}
            {sick.sick_rate > 15 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Sickness rate {Math.round(sick.sick_rate)}% — an elevated sickness rate may indicate staff wellbeing or burnout concerns; the home should review whether workload and support structures are adequate
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total requests", value: vol.total_requests, color: "text-blue-600" },
            { label: "Pending approval", value: vol.pending_count, color: vol.pending_count > 5 ? "text-amber-600" : "text-foreground" },
            { label: "Currently absent", value: plan.current_absent_count, color: plan.current_absent_count > 0 ? "text-amber-600" : "text-emerald-600" },
            { label: "Active sick", value: sick.active_sick_count, color: sick.active_sick_count > 0 ? "text-red-600" : "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" /> Sickness Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Return-to-work compliance rate" value={sick.rtw_compliance_rate} warn={100} />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-blue-600">{sick.sick_requests}</p>
                  <p className="text-xs text-muted-foreground">Sick requests</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-blue-600">{sick.sick_days}</p>
                  <p className="text-xs text-muted-foreground">Total sick days</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${sick.rtw_required > sick.rtw_completed ? "text-red-600" : "text-emerald-600"}`}>{sick.rtw_completed}/{sick.rtw_required}</p>
                  <p className="text-xs text-muted-foreground">RTWs completed</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${sick.sick_rate > 10 ? "text-amber-600" : "text-foreground"}`}>{Math.round(sick.sick_rate)}%</p>
                  <p className="text-xs text-muted-foreground">Sickness rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" /> Leave Planning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-blue-600">{plan.annual_leave_requests}</p>
                  <p className="text-xs text-muted-foreground">Annual leave requests</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-blue-600">{plan.annual_leave_days}</p>
                  <p className="text-xs text-muted-foreground">Annual leave days</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-foreground">{plan.future_leave_count}</p>
                  <p className="text-xs text-muted-foreground">Upcoming leave</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className="text-lg font-bold text-foreground">{plan.future_leave_days}</p>
                  <p className="text-xs text-muted-foreground">Future leave days</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {vol.approved_count > 0 && <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700">{vol.approved_count} approved</span>}
                {vol.pending_count > 0 && <span className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-700">{vol.pending_count} pending</span>}
                {vol.rejected_count > 0 && <span className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-700">{vol.rejected_count} rejected</span>}
                {vol.cancelled_count > 0 && <span className="rounded border bg-muted/30 px-2 py-1 text-xs text-muted-foreground">{vol.cancelled_count} cancelled</span>}
              </div>
            </CardContent>
          </Card>
        </div>

        {d.distribution.length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> Leave Type Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {d.distribution.map((item) => (
                  <div key={item.leave_type} className="rounded border bg-muted/30 px-3 py-2 text-center min-w-[90px]">
                    <p className="text-lg font-bold text-blue-600">{item.count}</p>
                    <p className="text-xs text-muted-foreground">{item.leave_type}</p>
                    <p className="text-xs text-muted-foreground">{item.total_days} days</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
          CHR 2015 Regulation 32 (Staffing — the registered person must ensure that the home has sufficient staff with the skills and experience to meet the needs of children at all times; leave and absence management is integral to this). Fit and Proper Person Regulations (employers must be satisfied that their staff are of good character and physically and mentally fit — return-to-work processes are part of how this is maintained). The Employment Rights Act 1996 and Equality Act 2010 govern the legal framework for leave management. Leave and absence data is also an indicator of staff wellbeing — a workforce that is burning out will have elevated sickness rates; intervening early on this protects both staff and children.
        </p>
      </div>
    </PageShell>
  );
}
