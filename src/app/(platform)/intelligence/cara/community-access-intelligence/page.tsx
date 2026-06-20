"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeCommunityAccessIntelligence } from "@/hooks/use-home-community-access-intelligence";
import type { CommunityAccessRating } from "@/lib/engines/home-community-access-intelligence-engine";

const RATING_META: Record<CommunityAccessRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function CommunityAccessIntelligencePage() {
  const { data, isLoading, error } = useHomeCommunityAccessIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Community Access" description="Analysing community access and transport safety…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Community Access" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load community access data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.community_access_rating];

  return (
    <PageShell
      title="Community Access"
      description="Transport safety, independent travel development, trip planning and community engagement for all children in placement (CHR 2015 Reg 9 — Supporting healthy development; Reg 12 — Health and Safety)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <MapPin className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Community score: {d.community_access_score}/100 · {d.community_engagement.total_engagements_90d} engagements (90d) · {d.transport_safety.total_logs} transport logs
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.community_access_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.transport_ra.overdue_reviews > 0 || d.independent_travel.overdue_reviews > 0) && (
          <div className="flex flex-col gap-2">
            {d.transport_ra.overdue_reviews > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.transport_ra.overdue_reviews} transport risk assessment review(s) overdue — update required under CHR 2015 Reg 12
              </div>
            )}
            {d.independent_travel.overdue_reviews > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {d.independent_travel.overdue_reviews} independent travel review(s) overdue — check child&apos;s current capability and route safety
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Transport Safety
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Licence checked rate" value={d.transport_safety.licence_checked_rate} warn={100} />
              <RateBar label="Vehicle checked rate" value={d.transport_safety.vehicle_checked_rate} warn={100} />
              <RateBar label="Excellent behaviour rate" value={d.transport_safety.excellent_behaviour_rate} warn={80} />
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted-foreground">Transport logs total</span>
                <span className="font-medium">{d.transport_safety.total_logs}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Transport incident rate</span>
                <span className={`font-medium ${d.transport_safety.incident_rate > 10 ? "text-amber-600" : "text-foreground"}`}>{Math.round(d.transport_safety.incident_rate)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Transport Risk Assessments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Signed-off rate" value={d.transport_ra.signed_off_rate} warn={100} />
              <RateBar label="Emergency procedure rate" value={d.transport_ra.emergency_procedure_rate} warn={90} />
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted-foreground">Total / active RAs</span>
                <span className="font-medium">{d.transport_ra.total_ras} / {d.transport_ra.active_ras}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Overdue reviews</span>
                <span className={`font-medium ${d.transport_ra.overdue_reviews > 0 ? "text-amber-600" : "text-foreground"}`}>{d.transport_ra.overdue_reviews}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Independent Travel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Solo / independent rate" value={d.independent_travel.solo_or_independent_rate} warn={60} />
              <RateBar label="Confident / highly confident" value={d.independent_travel.confident_or_highly_rate} warn={70} />
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted-foreground">Children covered</span>
                <span className="font-medium">{d.independent_travel.child_coverage}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Avg routes mastered</span>
                <span className="font-medium">{d.independent_travel.avg_routes_mastered.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Trip Planning &amp; Community Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RateBar label="Manager approval rate" value={d.trip_planning.manager_approval_rate} warn={100} />
              <RateBar label="Risk assessment rate" value={d.trip_planning.risk_assessment_rate} warn={90} />
              <RateBar label="Children&apos;s views included" value={d.trip_planning.children_views_rate} warn={85} />
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted-foreground">Community engagements (90d)</span>
                <span className="font-medium">{d.community_engagement.total_engagements_90d}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Children engaged</span>
                <span className="font-medium">{d.community_engagement.unique_children_90d}</span>
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
          CHR 2015 Regulation 9 (Supporting healthy development) and Regulation 12 (Health and Safety). Independent travel development promotes resilience and life skills. All outings must have risk assessments and manager approval.
        </p>
      </div>
    </PageShell>
  );
}
