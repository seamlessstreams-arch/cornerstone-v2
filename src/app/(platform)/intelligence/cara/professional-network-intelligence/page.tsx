"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeProfessionalNetworkIntelligence } from "@/hooks/use-home-professional-network-intelligence";
import type { ProfessionalNetworkResult, ProfessionalNetworkRating } from "@/lib/engines/home-professional-network-intelligence-engine";

const RATING_META: Record<ProfessionalNetworkRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

function RateBar({ label, value, warn = 75 }: { label: string; value: number; warn?: number }) {
  const pct = Math.round(value);
  const color = pct >= warn ? "bg-emerald-500" : pct >= 40 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className={`font-medium ${pct < 40 ? "text-red-600" : "text-foreground"}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function ProfessionalNetworkIntelligencePage() {
  const { data: raw, isLoading, error } = useHomeProfessionalNetworkIntelligence();
  const d = (raw as { data?: ProfessionalNetworkResult } | undefined)?.data;

  if (isLoading) {
    return (
      <PageShell title="Professional Network Intelligence" description="Analysing professional contact currency, multi-agency meeting completion, child participation, and action completion data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Professional Network Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load professional network data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.network_rating];

  return (
    <PageShell
      title="Professional Network Intelligence"
      description="Professional contact currency, multi-agency meeting completion, child participation in professional meetings, action completion rates, and role diversity in the home's professional network — evidencing that the home maintains active, multi-agency relationships in the child's interest rather than working in isolation from the broader network of professionals involved in each child's care (CHR 2015 Reg 5; Working Together 2023; NMS 2)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Network className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Network score: {d.network_score}/100 · {d.total_contacts} contacts · currency {Math.round(d.contact_currency_rate)}% · meetings {Math.round(d.meeting_completion_rate)}% · child participation {Math.round(d.child_participation_rate)}% · actions {Math.round(d.action_completion_rate)}% · {d.role_diversity} roles
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.network_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.contact_currency_rate < 60 || d.child_participation_rate < 50 || d.action_completion_rate < 60) && (
          <div className="flex flex-col gap-2">
            {d.contact_currency_rate < 60 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Contact currency rate {Math.round(d.contact_currency_rate)}% — out-of-date professional contacts means the home may be calling the wrong person in a crisis, sharing information with someone no longer in post, or failing to loop in a new professional who has been allocated to a child; contact currency is a safeguarding issue as much as an administrative one
              </div>
            )}
            {d.child_participation_rate < 50 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Child participation rate {Math.round(d.child_participation_rate)}% — children have a right to participate in meetings that are about them (UN CRC Article 12; NMS 7); professional meetings where children are discussed but not present or represented miss the child's perspective and risk producing decisions that are technically correct but experientially wrong for that child
              </div>
            )}
            {d.action_completion_rate < 60 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Action completion rate {Math.round(d.action_completion_rate)}% — meetings that produce actions that are not completed are not effective; uncompleted multi-agency actions are a common theme in serious case reviews and child safeguarding practice reviews; the home must be accountable for its share of agreed actions and must escalate when other partners fail to complete theirs
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Total contacts", value: d.total_contacts, color: "text-blue-600" },
            { label: "Contact currency", value: `${Math.round(d.contact_currency_rate)}%`, color: d.contact_currency_rate >= 80 ? "text-emerald-600" : d.contact_currency_rate >= 50 ? "text-amber-600" : "text-red-600" },
            { label: "Role diversity", value: d.role_diversity, color: d.role_diversity >= 5 ? "text-emerald-600" : "text-amber-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Network className="h-4 w-4 text-muted-foreground" /> Network Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Contact currency rate" value={d.contact_currency_rate} warn={80} />
            <RateBar label="Meeting completion rate" value={d.meeting_completion_rate} warn={80} />
            <RateBar label="Child participation rate" value={d.child_participation_rate} warn={60} />
            <RateBar label="Action completion rate" value={d.action_completion_rate} warn={75} />
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
          CHR 2015 Regulation 5 — the registered person must promote each child's welfare, which requires active coordination with the child's wider professional network including social workers, IROs, CAMHS, education professionals, health staff, and family workers. Working Together to Safeguard Children 2023 — effective safeguarding requires strong multi-agency working; a residential home that is not actively engaged with a child's professional network is not fulfilling its safeguarding responsibilities. NMS Standard 2 — children's homes should work collaboratively with professionals, families, and relevant organisations. The home's role in the professional network is not passive: it is both a provider of information (the people with the most detailed day-to-day knowledge of the child) and a consumer of it (receiving updates from CAMHS, education, health); role diversity in the network is a marker of whether the child's care is genuinely coordinated across all the domains that matter. Child participation in professional meetings is a rights issue: many serious case reviews have found that decisions were made in good faith about children who were never asked what they thought or what they wanted; the home is often the professional best placed to support a child to attend and participate meaningfully.
        </p>
      </div>
    </PageShell>
  );
}
