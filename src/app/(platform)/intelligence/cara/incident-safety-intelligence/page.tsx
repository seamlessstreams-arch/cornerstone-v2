"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckCircle, AlertTriangle, Clock, Star, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useHomeIncidentSafetyIntelligence } from "@/hooks/use-home-incident-safety-intelligence";
import type { HomeIncidentSafetyResult, IncidentSafetyRating } from "@/lib/engines/home-incident-safety-intelligence-engine";

const RATING_META: Record<IncidentSafetyRating, { label: string; color: string; bg: string; border: string }> = {
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

function TrendBadge({ trend }: { trend: "improving" | "stable" | "worsening" | "insufficient_data" }) {
  if (trend === "improving")  return <span className="inline-flex items-center gap-1 text-xs text-emerald-700"><TrendingUp className="h-3 w-3" />Improving</span>;
  if (trend === "worsening")  return <span className="inline-flex items-center gap-1 text-xs text-red-700"><TrendingDown className="h-3 w-3" />Worsening</span>;
  if (trend === "stable")     return <span className="inline-flex items-center gap-1 text-xs text-slate-600"><Minus className="h-3 w-3" />Stable</span>;
  return <span className="text-xs text-muted-foreground">—</span>;
}

export default function IncidentSafetyIntelligencePage() {
  const { data, isLoading, error } = useHomeIncidentSafetyIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Incident & Safety Intelligence" description="Analysing incident and safety data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Incident & Safety Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load incident safety data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.incident_safety_rating];
  const inc = d.incidents;
  const res = d.restraints;
  const han = d.handovers;

  return (
    <PageShell
      title="Incident & Safety Intelligence"
      description="Incident frequency, severity, oversight and learning; restraint use, duration, debrief and injury; handover completion and sign-off — the full picture of whether the home is safe, learning and improving (CHR 2015 Reg 12, 13, 35, 40; SCCIF Safety)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <ShieldAlert className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Safety score: {d.incident_safety_score}/100 · {inc.total_30d} incidents (30d) · {res.total_30d} restraints (30d) · {inc.critical_count_30d} critical
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.incident_safety_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(inc.critical_count_30d > 0 || res.injury_count > 0 || inc.open_count > 0) && (
          <div className="flex flex-col gap-2">
            {inc.critical_count_30d > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {inc.critical_count_30d} critical incident{inc.critical_count_30d > 1 ? "s" : ""} in the last 30 days — Ofsted will examine the response, management oversight and learning from each
              </div>
            )}
            {res.injury_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {res.injury_count} restraint-related injur{res.injury_count > 1 ? "ies" : "y"} — each requires individual review of technique, proportionality and de-escalation
              </div>
            )}
            {inc.open_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {inc.open_count} open incident{inc.open_count > 1 ? "s" : ""} — unresolved incidents block learning and may indicate backlog in management oversight
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Incidents (30d)", value: inc.total_30d, color: inc.total_30d > 5 ? "text-red-600" : "text-foreground" },
            { label: "Incidents (90d)", value: inc.total_90d, color: "" },
            { label: "Restraints (30d)", value: res.total_30d, color: res.total_30d > 3 ? "text-red-600" : "text-foreground" },
            { label: "Open incidents", value: inc.open_count, color: inc.open_count > 0 ? "text-amber-600" : "text-emerald-600" },
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
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-muted-foreground" /> Incident Quality</span>
                <TrendBadge trend={inc.trend} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Body map compliance rate" value={inc.body_map_compliance_rate} warn={90} />
              <RateBar label="Oversight completion rate" value={inc.oversight_completion_rate} warn={90} />
              <RateBar label="Lessons learned rate" value={inc.lessons_learned_rate} warn={80} />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${inc.critical_count_30d > 0 ? "text-red-600" : "text-foreground"}`}>{inc.critical_count_30d}</p>
                  <p className="text-xs text-muted-foreground">Critical (30d)</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${inc.high_count_30d > 2 ? "text-amber-600" : "text-foreground"}`}>{inc.high_count_30d}</p>
                  <p className="text-xs text-muted-foreground">High severity (30d)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-muted-foreground" /> Restraint Profile</span>
                <TrendBadge trend={res.trend} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Child debrief rate" value={res.child_debrief_rate} warn={95} />
              <RateBar label="Staff debrief rate" value={res.staff_debrief_rate} warn={90} />
              <RateBar label="Body map completion rate" value={res.body_map_rate} warn={100} />
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${res.long_restraint_count > 0 ? "text-amber-600" : "text-emerald-600"}`}>{res.long_restraint_count}</p>
                  <p className="text-xs text-muted-foreground">Long restraints (&gt;10 min)</p>
                </div>
                <div className="rounded border bg-muted/30 p-2 text-center">
                  <p className={`text-lg font-bold ${res.avg_duration_minutes != null && res.avg_duration_minutes > 10 ? "text-amber-600" : "text-foreground"}`}>
                    {res.avg_duration_minutes != null ? `${res.avg_duration_minutes.toFixed(1)}m` : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">Avg duration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Handover Safety Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Handover completion rate" value={han.completion_rate} warn={95} />
            <RateBar label="Handover sign-off rate" value={han.sign_off_rate} warn={90} />
            <RateBar label="Incident-linked handover rate" value={han.incident_linked_rate} warn={80} />
            <div className="flex gap-4 pt-1">
              <div className="rounded border bg-muted/30 p-2 text-center flex-1">
                <p className="text-lg font-bold text-blue-600">{han.total_30d}</p>
                <p className="text-xs text-muted-foreground">Handovers (30d)</p>
              </div>
              <div className="rounded border bg-muted/30 p-2 text-center flex-1">
                <p className={`text-lg font-bold ${han.avg_flags_per_handover > 3 ? "text-amber-600" : "text-foreground"}`}>{han.avg_flags_per_handover.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Avg flags/handover</p>
              </div>
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
                      <p className="text-xs text-muted-foreground mt-0.5">{rec.regulatory_ref}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs capitalize border ${urgencyColor}`}>{rec.urgency}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          CHR 2015 Regulation 12 (Children's welfare — the registered person must take all reasonable steps to safeguard and promote the welfare of children). Regulation 13 (Leadership and management — must have systems to assure quality of care including incident learning). Regulation 35 (Restraint — must be used only as a last resort; every use must be recorded, reviewed and debriefed). Regulation 40 (Notification — notifiable events must be reported to Ofsted within 24 hours). Safety is the first test of a children's home. Ofsted will look at every critical incident, every restraint, and whether the home is genuinely learning from its own data — or just recording it.
        </p>
      </div>
    </PageShell>
  );
}
