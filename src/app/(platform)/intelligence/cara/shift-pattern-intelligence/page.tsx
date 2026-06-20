"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeShiftPatternIntelligence } from "@/hooks/use-home-shift-pattern-intelligence";
import type { HomeShiftPatternResult, ShiftPatternRating } from "@/lib/engines/home-shift-pattern-intelligence-engine";

const RATING_META: Record<ShiftPatternRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 85 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 55 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 55 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function ShiftPatternIntelligencePage() {
  const { data, isLoading, error } = useHomeShiftPatternIntelligence();
  const d: HomeShiftPatternResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Shift Pattern Intelligence" description="Analysing shift coverage, punctuality, overtime, workload distribution, and swap management…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Shift Pattern Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load shift pattern data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.shift_rating];
  const { coverage, punctuality, overtime, workload, swaps } = d;

  return (
    <PageShell
      title="Shift Pattern Intelligence"
      description="Shift coverage completeness, punctuality and handover quality, overtime exposure and staff wellbeing risk, workload equity across the team, and shift swap management — evidencing that the rota delivers consistent, adequately-staffed, equitably-distributed care that protects children's relationships with familiar staff, supports safe handovers, and does not create staff wellbeing risks that compromise care quality (CHR 2015 Reg 15 & 33; Ofsted SCCIF; Working Together 2023; HSE guidance on working hours in care settings)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <CalendarClock className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Shift score: {d.shift_score}/100 · {coverage.total_shifts} total shifts · {coverage.open_shifts} open · punctuality {punctuality.on_time_rate}% · overtime rate {overtime.overtime_rate}% · {swaps.pending_swaps} pending swaps
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.shift_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(coverage.open_shifts > 0 || overtime.overtime_rate > 20 || punctuality.on_time_rate < 90) && (
          <div className="flex flex-col gap-2">
            {coverage.open_shifts > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {coverage.open_shifts} open shift{coverage.open_shifts > 1 ? "s" : ""} without assigned staff — uncovered shifts are a child safeguarding risk; every shift that is not staffed to ratio is a period when children are receiving inadequate adult support; Regulation 33 visits and Ofsted inspections will identify staffing gaps as a significant concern; open shifts must be filled before they occur, not managed reactively
              </div>
            )}
            {overtime.overtime_rate > 20 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Overtime rate {overtime.overtime_rate}% — chronic overtime is a staff wellbeing and child safety risk; fatigued staff make more errors, have less emotional capacity for therapeutic relationships, and are more likely to experience burnout; the HSE recommends that care workers do not regularly work beyond their contracted hours; high overtime also indicates a structural staffing problem that should be addressed through recruitment rather than by continuing to rely on existing staff goodwill
              </div>
            )}
            {punctuality.on_time_rate < 90 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Punctuality {punctuality.on_time_rate}% (avg delay {punctuality.avg_delay_minutes.toFixed(1)} min) — late arrivals disrupt handovers, which is the single most important information transfer in residential care; a poor handover means the incoming shift does not have full situational awareness of children's current state, any incidents during the previous shift, or any safeguarding concerns that have arisen; it also sends a message to children that their time and routine are not respected
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total shifts", value: coverage.total_shifts, color: "text-blue-600" },
            { label: "Open (unfilled) shifts", value: coverage.open_shifts, color: coverage.open_shifts === 0 ? "text-emerald-600" : "text-red-600" },
            { label: "Staff rostered", value: coverage.unique_staff_working, color: "text-blue-600" },
            { label: "Sleep-in shifts", value: coverage.sleep_in_shifts, color: coverage.sleep_in_shifts > 0 ? "text-emerald-600" : "text-amber-600" },
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
              <CardTitle className="text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> Punctuality & Coverage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="On-time arrival rate" value={punctuality.on_time_rate} warn={92} />
              <RateBar label="Shift completion rate" value={coverage.completed_shifts > 0 ? Math.round((coverage.completed_shifts / coverage.total_shifts) * 100) : 0} warn={95} />
              <div className="text-xs text-muted-foreground pt-1 grid grid-cols-2 gap-2">
                <div>Avg delay: <span className="font-medium text-foreground">{punctuality.avg_delay_minutes.toFixed(1)} min</span></div>
                <div>Max delay: <span className="font-medium text-foreground">{punctuality.max_delay_minutes} min</span></div>
                <div>Late starts: <span className="font-medium text-foreground">{punctuality.late_count}</span></div>
                <div>Day shifts: <span className="font-medium text-foreground">{coverage.day_shifts}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><CalendarClock className="h-4 w-4 text-muted-foreground" /> Overtime & Workload Equity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Overtime exposure rate" value={overtime.overtime_rate} warn={10} />
              <div className="text-xs text-muted-foreground pt-1 grid grid-cols-2 gap-2">
                <div>Total OT mins: <span className="font-medium text-foreground">{overtime.total_overtime_minutes}</span></div>
                <div>Avg OT/shift: <span className="font-medium text-foreground">{overtime.avg_overtime_per_shift.toFixed(0)} min</span></div>
                <div>Fairness ratio: <span className={`font-medium ${workload.fairness_ratio >= 0.7 ? "text-emerald-600" : "text-amber-600"}`}>{workload.fairness_ratio.toFixed(2)}</span></div>
                <div>Max/min shifts: <span className="font-medium text-foreground">{workload.max_shifts_per_staff}/{workload.min_shifts_per_staff}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {swaps.total_swaps > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><CalendarClock className="h-4 w-4 text-muted-foreground" /> Shift Swap Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3 text-center">
                {[
                  { label: "Total requests", value: swaps.total_swaps },
                  { label: "Pending", value: swaps.pending_swaps, warn: swaps.pending_swaps > 2 },
                  { label: "Approved", value: swaps.approved_swaps },
                  { label: "Resolution rate", value: `${Math.round(swaps.resolution_rate)}%` },
                ].map(({ label, value, warn }) => (
                  <div key={label} className="rounded-lg border bg-muted/30 p-3">
                    <p className={`text-xl font-bold ${warn ? "text-amber-600" : "text-foreground"}`}>{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
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
          The rota is not an administrative document — it is the structural expression of how the home values its children and its staff. A rota with open shifts tells children that their care cannot be guaranteed; a rota with chronic overtime tells staff that they are being exploited; a rota with poor workload equity tells some staff that they carry the burden while others do not. CHR 2015 Regulation 15 requires that sufficient staff are deployed to meet children's needs at all times; Regulation 33 monitor visits assess staffing as a key quality indicator. The punctuality rate is a leading indicator of handover quality, which in turn determines whether each shift begins with the full situational awareness needed to keep children safe. The fairness ratio (min shifts / max shifts per staff member) is one of the most important retention indicators available to a manager: persistent inequity in shift allocation is one of the most common reasons cited by care staff for leaving; a home that cannot retain staff cannot provide the relational continuity that therapeutic care requires. The sleep-in shift count is a safeguarding indicator: a home with no documented sleep-in shifts either has no overnight staffing (a safeguarding gap) or is not recording it (a governance gap) — both warrant immediate attention.
        </p>
      </div>
    </PageShell>
  );
}
