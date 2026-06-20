"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeCulturalEventsCelebrationsIntelligence } from "@/hooks/use-home-cultural-events-celebrations-intelligence";
import type { CulturalEventsResult, CulturalEventsRating } from "@/lib/engines/home-cultural-events-celebrations-intelligence-engine";

const RATING_META: Record<CulturalEventsRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function CulturalEventsCelebrationsIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeCulturalEventsCelebrationsIntelligence();
  const d = (raw as { data?: CulturalEventsResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Cultural Events & Celebrations" description="Analysing cultural events and celebrations data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Cultural Events & Celebrations" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load cultural events and celebrations data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.cultural_rating];

  return (
    <PageShell
      title="Cultural Events & Celebrations"
      description="Cultural event participation, diversity celebrations, heritage acknowledgement, festival inclusion, child-led activities and community engagement — celebrating every child's identity, heritage and culture as central to their sense of self and belonging (CHR 2015 Reg 9; Equality Act 2010; UNCRC Article 30)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Sparkles className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cultural score: {d.cultural_score}/100 · {d.total_cultural_events} events · {d.unique_faiths_represented} faiths represented · {d.children_with_heritage_acknowledged} children's heritage acknowledged
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.cultural_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{d.total_cultural_events}</p>
            <p className="text-xs text-muted-foreground mt-1">Cultural events</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold">{d.total_diversity_celebrations}</p>
            <p className="text-xs text-muted-foreground mt-1">Diversity celebrations</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold">{d.total_heritage_days}</p>
            <p className="text-xs text-muted-foreground mt-1">Heritage days</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold">{d.total_festival_inclusions}</p>
            <p className="text-xs text-muted-foreground mt-1">Festival inclusions</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{d.total_child_led_activities}</p>
            <p className="text-xs text-muted-foreground mt-1">Child-led activities</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-lg font-bold">{d.unique_event_types}</p>
            <p className="text-xs text-muted-foreground mt-1">Event types</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-lg font-bold">{d.unique_faiths_represented}</p>
            <p className="text-xs text-muted-foreground mt-1">Faiths represented</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-lg font-bold">{d.unique_heritage_types}</p>
            <p className="text-xs text-muted-foreground mt-1">Heritage types</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 text-center">
            <p className="text-lg font-bold">{d.external_community_events}</p>
            <p className="text-xs text-muted-foreground mt-1">Community events</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              Cultural Participation Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Event participation rate" value={d.event_participation_rate} warn={80} />
            <RateBar label="Diversity celebration rate" value={d.diversity_celebration_rate} warn={80} />
            <RateBar label="Heritage acknowledgement rate" value={d.heritage_acknowledgement_rate} warn={90} />
            <RateBar label="Festival inclusion rate" value={d.festival_inclusion_rate} warn={75} />
            <RateBar label="Child-led activity rate" value={d.child_led_rate} warn={60} />
            <RateBar label="Child satisfaction rate" value={d.child_satisfaction_rate} warn={80} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Avg celebration quality</p>
            <p className="text-xl font-bold mt-1">{d.avg_celebration_quality.toFixed(1)}<span className="text-xs text-muted-foreground">/5</span></p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">Avg festival quality</p>
            <p className="text-xl font-bold mt-1">{d.avg_festival_quality.toFixed(1)}<span className="text-xs text-muted-foreground">/5</span></p>
          </div>
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
          UNCRC Article 30 (Right to enjoy own culture and religion). CHR 2015 Regulation 9 (Supporting healthy development). Equality Act 2010 (protected characteristics). Cultural celebrations and heritage acknowledgement are not optional extras — they are a right and fundamental to every child's identity, belonging and self-worth.
        </p>
      </div>
    </PageShell>
  );
}
