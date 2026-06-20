"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeChildrensRightsParticipationIntelligence } from "@/hooks/use-home-childrens-rights-participation-intelligence";
import type { HomeChildrensRightsResult, ChildrensRightsRating } from "@/lib/engines/home-childrens-rights-participation-intelligence-engine";

const RATING_META: Record<ChildrensRightsRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function ChildrensRightsParticipationIntelligencePage() {
  const { data, isLoading, error } = useHomeChildrensRightsParticipationIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Children's Rights & Participation" description="Analysing children's rights and participation data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Children's Rights & Participation" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load children's rights and participation data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.rights_rating];
  const r = d.rights_compliance;
  const m = d.child_led_meetings;
  const f = d.feedback_loops;
  const p = d.pledges;
  const part = d.participation;
  const adv = d.advocacy;

  return (
    <PageShell
      title="Children's Rights & Participation"
      description="UNCRC rights compliance, child-led meetings, feedback loops, rights pledges, advocacy and meaningful participation across all domains — ensuring rights are upheld in practice, not just policy (UNCRC; CHR 2015 Reg 7; Working Together 2023)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Scale className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Rights score: {d.rights_score}/100 · {r.total_rights} rights assessed · fully met {Math.round(r.fully_met_rate)}% · {adv.total_records} advocacy records
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.rights_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rights Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs"><span>Total rights assessed</span><span className="font-medium">{r.total_rights}</span></div>
              <RateBar label="Fully met rate" value={r.fully_met_rate} warn={80} />
              <RateBar label="Child feedback rate" value={r.child_feedback_rate} warn={70} />
              <div className="flex justify-between text-xs text-muted-foreground pt-1">
                <span>Evidence avg</span>
                <span>{r.evidence_avg?.toFixed(1) ?? "—"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Child-Led Meetings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs"><span>Meetings (90d)</span><span className="font-medium">{m.total_meetings_90d}</span></div>
              <div className="flex justify-between text-xs"><span>Unique children</span><span className="font-medium">{m.unique_children}</span></div>
              <RateBar label="Visible change rate" value={m.visible_change_rate} warn={60} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Feedback Loops</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs"><span>Loops (90d)</span><span className="font-medium">{f.total_loops_90d}</span></div>
              <RateBar label="Acceptance rate" value={f.acceptance_rate} warn={70} />
              <RateBar label="Child accepts rate" value={f.child_accepts_rate} warn={70} />
              <RateBar label="Visible change rate" value={f.visible_change_rate} warn={60} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rights Pledges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs"><span>Total pledges</span><span className="font-medium">{p.total_pledges}</span></div>
              <RateBar label="Met rate" value={p.met_rate} warn={80} />
              <RateBar label="Active / in-progress rate" value={p.active_in_progress_rate} warn={70} />
              {p.overdue_reviews > 0 && (
                <div className="flex items-center gap-1 text-xs text-amber-700">
                  <AlertTriangle className="h-3 w-3" />{p.overdue_reviews} overdue reviews
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Participation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs"><span>Entries (90d)</span><span className="font-medium">{part.total_entries_90d}</span></div>
              <RateBar label="Child influence rate" value={part.child_influence_rate} warn={70} />
              <RateBar label="Feedback given rate" value={part.feedback_given_rate} warn={70} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Advocacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs"><span>Total records</span><span className="font-medium">{adv.total_records}</span></div>
              <div className="flex justify-between text-xs"><span>Active</span><span className="font-medium">{adv.active_count}</span></div>
              <RateBar label="Child coverage" value={adv.child_coverage} warn={80} />
              <RateBar label="Child view rate" value={adv.child_view_rate} warn={70} />
              {adv.overdue_reviews > 0 && (
                <div className="flex items-center gap-1 text-xs text-amber-700">
                  <AlertTriangle className="h-3 w-3" />{adv.overdue_reviews} overdue reviews
                </div>
              )}
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
          United Nations Convention on the Rights of the Child (UNCRC). CHR 2015 Regulation 7 (Children's wishes and feelings). Working Together to Safeguard Children 2023. Rights must be actively upheld in daily life, not merely displayed on a wall — all staff are accountable for rights-based practice.
        </p>
      </div>
    </PageShell>
  );
}
