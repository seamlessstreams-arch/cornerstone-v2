"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeBuildingOpsSafetyIntelligence } from "@/hooks/use-home-building-ops-safety-intelligence";
import type { BuildingOpsSafetyRating } from "@/lib/engines/home-building-ops-safety-intelligence-engine";

const RATING_META: Record<BuildingOpsSafetyRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 90 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 60 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 60 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function BuildingOpsSafetyIntelligencePage() {
  const { data, isLoading, error } = useHomeBuildingOpsSafetyIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Building & Ops Safety" description="Analysing building and operational safety…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Building & Ops Safety" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load building and operational safety data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.building_ops_rating];

  return (
    <PageShell
      title="Building & Ops Safety"
      description="Evacuation plans, grab bags, asbestos management, secure storage, room searches and fire risk (CHR 2015 Reg 25 — Premises; Reg 12 — Health and Safety; RRFSO 2005)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Building2 className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Safety score: {d.building_ops_score}/100 · {d.fire_risk.high_risk_count} high fire risks · {d.evacuation.overdue_drills} overdue drills
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.building_ops_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.fire_risk.high_risk_count > 0 || d.asbestos.poor_condition_count > 0 || d.evacuation.overdue_drills > 0) && (
          <div className="flex flex-col gap-2">
            {d.fire_risk.high_risk_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.fire_risk.high_risk_count} high-risk fire hazard(s) — immediate action required under RRFSO 2005
              </div>
            )}
            {d.asbestos.poor_condition_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.asbestos.poor_condition_count} asbestos-containing material(s) in poor/damaged condition — urgent review required
              </div>
            )}
            {d.evacuation.overdue_drills > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.evacuation.overdue_drills} evacuation drill(s) overdue — schedule immediately
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className={`rounded-lg border p-3 text-center ${d.fire_risk.overdue_actions > 0 ? "bg-red-50" : "bg-muted/30"}`}>
            <p className={`text-2xl font-bold ${d.fire_risk.overdue_actions > 0 ? "text-red-600" : "text-foreground"}`}>{d.fire_risk.overdue_actions}</p>
            <p className="text-xs text-muted-foreground mt-1">Fire risk overdue actions</p>
          </div>
          <div className={`rounded-lg border p-3 text-center ${d.grab_bags.overdue_checks > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
            <p className={`text-2xl font-bold ${d.grab_bags.overdue_checks > 0 ? "text-amber-600" : "text-foreground"}`}>{d.grab_bags.overdue_checks}</p>
            <p className="text-xs text-muted-foreground mt-1">Grab bag checks overdue</p>
          </div>
          <div className={`rounded-lg border p-3 text-center ${d.secure_storage.flagged_count > 0 ? "bg-amber-50" : "bg-muted/30"}`}>
            <p className={`text-2xl font-bold ${d.secure_storage.flagged_count > 0 ? "text-amber-600" : "text-foreground"}`}>{d.secure_storage.flagged_count}</p>
            <p className="text-xs text-muted-foreground mt-1">Storage items flagged</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Evacuation Plans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Fire officer approved" value={d.evacuation.fire_officer_approved_rate} warn={100} />
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted-foreground">Total plans</span>
                <span className="font-medium">{d.evacuation.total}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Drills current</span>
                <span className="font-medium">{d.evacuation.drills_current}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Overdue drills</span>
                <span className={`font-medium ${d.evacuation.overdue_drills > 0 ? "text-red-600" : "text-foreground"}`}>{d.evacuation.overdue_drills}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Grab Bags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Grab bag complete rate" value={d.grab_bags.complete_rate} warn={100} />
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted-foreground">Total bags</span>
                <span className="font-medium">{d.grab_bags.total}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Overdue checks</span>
                <span className={`font-medium ${d.grab_bags.overdue_checks > 0 ? "text-amber-600" : "text-foreground"}`}>{d.grab_bags.overdue_checks}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Asbestos Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">ACM identified</span>
                <span className="font-medium">{d.asbestos.acm_present}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Poor / damaged condition</span>
                <span className={`font-medium ${d.asbestos.poor_condition_count > 0 ? "text-red-600" : "text-foreground"}`}>{d.asbestos.poor_condition_count}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Overdue inspections</span>
                <span className={`font-medium ${d.asbestos.overdue_inspections > 0 ? "text-amber-600" : "text-foreground"}`}>{d.asbestos.overdue_inspections}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Secure Storage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Verified rate" value={d.secure_storage.verified_rate} warn={95} />
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted-foreground">Total items</span>
                <span className="font-medium">{d.secure_storage.total}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Overdue checks</span>
                <span className={`font-medium ${d.secure_storage.overdue_checks > 0 ? "text-amber-600" : "text-foreground"}`}>{d.secure_storage.overdue_checks}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Room Searches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Child informed rate" value={d.room_searches.child_informed_rate} warn={100} />
              <RateBar label="Follow-up completion rate" value={d.room_searches.follow_up_completion_rate} warn={90} />
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted-foreground">Total searches</span>
                <span className="font-medium">{d.room_searches.total}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">High distress incidents</span>
                <span className={`font-medium ${d.room_searches.high_distress_count > 0 ? "text-amber-600" : "text-foreground"}`}>{d.room_searches.high_distress_count}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Fire Risk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Actions completed rate" value={d.fire_risk.completed_rate} warn={90} />
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted-foreground">Total risk items</span>
                <span className="font-medium">{d.fire_risk.total}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">High risk</span>
                <span className={`font-medium ${d.fire_risk.high_risk_count > 0 ? "text-red-600" : "text-foreground"}`}>{d.fire_risk.high_risk_count}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Overdue actions</span>
                <span className={`font-medium ${d.fire_risk.overdue_actions > 0 ? "text-red-600" : "text-foreground"}`}>{d.fire_risk.overdue_actions}</span>
              </div>
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
          CHR 2015 Regulation 25 (Premises) and Regulation 12 (Health and Safety). Regulatory Reform (Fire Safety) Order 2005. Control of Asbestos Regulations 2012. Grab bag checks required for every child in placement.
        </p>
      </div>
    </PageShell>
  );
}
