"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, AlertTriangle, Clock, Star, Package, Navigation, MessageSquare, Target, Gift } from "lucide-react";
import { useHomePlacementJourneyIntelligence } from "@/hooks/use-home-placement-journey-intelligence";
import type { PlacementJourneyRating } from "@/lib/engines/home-placement-journey-intelligence-engine";

// ── Rating helpers ─────────────────────────────────────────────────────────────

const RATING_META: Record<PlacementJourneyRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

// ── Rate bar ───────────────────────────────────────────────────────────────────

function RateBar({ label, value, max = 100, warn = 70 }: { label: string; value: number; max?: number; warn?: number }) {
  const pct = Math.round((value / max) * 100);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-medium text-foreground">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Journey stage card ────────────────────────────────────────────────────────

function StageCard({ icon: Icon, title, total, total_label, bars }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  total: number;
  total_label: string;
  bars: { label: string; value: number }[];
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            {title}
          </CardTitle>
          <Badge variant="outline" className="text-xs">{total} {total_label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {total === 0 ? (
          <p className="text-xs text-muted-foreground italic">No {total_label.toLowerCase()} recorded.</p>
        ) : (
          bars.map((b) => <RateBar key={b.label} label={b.label} value={b.value} />)
        )}
      </CardContent>
    </Card>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PlacementJourneyIntelligencePage() {
  const { data, isLoading, error } = useHomePlacementJourneyIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Placement Journey Intelligence" description="Analysing placement journey quality…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Placement Journey Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load placement journey data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.placement_journey_rating];

  return (
    <PageShell
      title="Placement Journey Intelligence"
      description="End-to-end placement journey quality from pre-admission to anniversaries (CHR 2015 Reg 5, 6, 7)."
    >
      <div className="space-y-6">

        {/* Rating banner */}
        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <MapPin className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Journey score: {d.placement_journey_score}/100</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{d.placement_journey_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journey stages grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <StageCard
            icon={CheckCircle}
            title="Pre-Admission Checklists"
            total={d.pre_admission.total}
            total_label="checklists"
            bars={[
              { label: "All sections complete", value: d.pre_admission.all_complete_rate },
              { label: "Risk assessment included", value: d.pre_admission.risk_included_rate },
              { label: "Child visited the home", value: d.pre_admission.child_visited_rate },
            ]}
          />
          <StageCard
            icon={Package}
            title="Warm Welcome Packs"
            total={d.welcome_packs.total}
            total_label="packs"
            bars={[
              { label: "Children received a pack", value: d.welcome_packs.child_coverage },
              { label: "Personalised packs", value: d.welcome_packs.personalised_rate },
            ]}
          />
          <StageCard
            icon={Navigation}
            title="Welcome Tours"
            total={d.welcome_tours.total}
            total_label="tours"
            bars={[
              { label: "Tours completed", value: d.welcome_tours.completed_rate },
              { label: "Child feedback captured", value: d.welcome_tours.feedback_rate },
              { label: "Buddy assigned", value: d.welcome_tours.buddy_rate },
            ]}
          />
          <StageCard
            icon={MessageSquare}
            title="Return Home Interviews"
            total={d.return_interviews.total}
            total_label="interviews"
            bars={[
              { label: "Conducted within 24h", value: d.return_interviews.within_24h_rate },
              { label: "Child views recorded", value: d.return_interviews.child_views_rate },
              { label: "Actions completed", value: d.return_interviews.action_completion_rate },
            ]}
          />
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  Placement Objectives
                </CardTitle>
                <Badge variant="outline" className="text-xs">{d.objectives.total} objectives</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {d.objectives.total === 0 ? (
                <p className="text-xs text-muted-foreground italic">No objectives recorded.</p>
              ) : (
                <>
                  <RateBar label="On track / achieved" value={d.objectives.on_track_rate} />
                  <RateBar label="Child involved" value={d.objectives.child_involved_rate} />
                  {d.objectives.overdue_reviews > 0 && (
                    <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-700">
                      <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                      {d.objectives.overdue_reviews} review{d.objectives.overdue_reviews !== 1 ? "s" : ""} overdue
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
          <StageCard
            icon={Gift}
            title="Placement Anniversaries"
            total={d.anniversaries.total}
            total_label="anniversaries"
            bars={[
              { label: "Celebrated", value: d.anniversaries.celebrated_rate },
              { label: "Child voice captured", value: d.anniversaries.child_voice_rate },
              { label: "Memory box updated", value: d.anniversaries.memory_box_rate },
            ]}
          />
        </div>

        {/* Insights */}
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

        {/* Strengths + Concerns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {d.strengths.length > 0 && (
            <Card className="border-emerald-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-emerald-700 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {d.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-foreground flex gap-2">
                      <Star className="h-3 w-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {d.concerns.length > 0 && (
            <Card className="border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-amber-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Concerns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {d.concerns.map((c, i) => (
                    <li key={i} className="text-xs text-foreground flex gap-2">
                      <AlertTriangle className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommendations */}
        {d.recommendations.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {d.recommendations.map((rec) => {
                const urgencyColor =
                  rec.urgency === "immediate" ? "bg-red-100 text-red-700 border-red-200" :
                  rec.urgency === "soon"       ? "bg-amber-100 text-amber-700 border-amber-200" :
                  "bg-blue-100 text-blue-700 border-blue-200";
                return (
                  <div key={rec.rank} className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {rec.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{rec.recommendation}</p>
                      {rec.regulatory_ref && (
                        <p className="text-xs text-muted-foreground mt-0.5">{rec.regulatory_ref}</p>
                      )}
                    </div>
                    <Badge variant="outline" className={`text-xs capitalize border ${urgencyColor}`}>
                      {rec.urgency}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-muted-foreground border-t pt-3">
          CHR 2015 Reg 5 (engagement), Reg 6 (quality of care), Reg 7 (welfare), Reg 9 (accommodation). SCCIF: "Experiences and progress of children."
        </p>
      </div>
    </PageShell>
  );
}
