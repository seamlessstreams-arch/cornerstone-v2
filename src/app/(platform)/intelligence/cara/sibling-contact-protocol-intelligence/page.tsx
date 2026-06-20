"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeSiblingContactProtocolIntelligence } from "@/hooks/use-home-sibling-contact-protocol-intelligence";
import type { SiblingContactResult, SiblingContactRating } from "@/lib/engines/home-sibling-contact-protocol-intelligence-engine";

const RATING_META: Record<SiblingContactRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function SiblingContactProtocolIntelligencePage() {
  const { data, isLoading, error } = useHomeSiblingContactProtocolIntelligence();
  const d: SiblingContactResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Sibling Contact Protocol Intelligence" description="Analysing sibling contact protocol coverage, contact frequency, agreed plans, child preferences, and review currency…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Sibling Contact Protocol Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load sibling contact protocol data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.contact_rating];

  return (
    <PageShell
      title="Sibling Contact Protocol Intelligence"
      description="Sibling contact protocol coverage, contact frequency and regularity, agreed plan documentation, child preference capture, celebration and milestone planning, and protocol review currency — evidencing that the home actively facilitates children's rights to maintain meaningful sibling relationships, with clear documented arrangements that reflect each child's wishes and are regularly reviewed (CHR 2015 Reg 7; Children Act 1989 s.34; SCCIF 'Children's experiences and progress'; UN CRC Article 9)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Users className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Contact score: {d.contact_score}/100 · {d.total_protocols} protocols · coverage {Math.round(d.children_with_protocol_rate)}% · regular contact {Math.round(d.regular_contact_rate)}% · child preferences {Math.round(d.child_preference_rate)}% · reviews current {Math.round(d.review_current_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.contact_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.children_with_protocol_rate < 85 || d.regular_contact_rate < 70 || d.child_preference_rate < 70) && (
          <div className="flex flex-col gap-2">
            {d.children_with_protocol_rate < 85 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Sibling contact protocol coverage {Math.round(d.children_with_protocol_rate)}% — children without protocols are at risk of sibling contact being managed inconsistently or not at all; the sibling relationship is one of the most enduring and important in a child's life; it may outlast professional relationships, foster placements, and residential placements; children in residential care who are separated from siblings have a right under the Children Act 1989 to contact unless there is a court order restricting it, and the onus is on the home to facilitate it
              </div>
            )}
            {d.regular_contact_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Regular contact rate {Math.round(d.regular_contact_rate)}% — infrequent sibling contact risks the gradual erosion of sibling bonds through unfamiliarity; research consistently shows that children who maintain meaningful contact with siblings have better long-term outcomes, stronger identity, and lower rates of mental health difficulties in adulthood; protocols that exist on paper but are not leading to regular contact have failed their purpose
              </div>
            )}
            {d.child_preference_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Child preference captured {Math.round(d.child_preference_rate)}% — sibling contact arrangements that are designed by adults without asking the child are more likely to produce arrangements the child does not want, which may mean they decline visits or experience contact as a burden rather than a connection; some children have complex feelings about siblings, particularly where they have experienced abuse or where sibling relationships carry trauma associations — their wishes must be heard and respected
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Total protocols", value: d.total_protocols, color: "text-blue-600" },
            { label: "Agreed plan rate", value: `${Math.round(d.agreed_plan_rate)}%`, color: d.agreed_plan_rate >= 80 ? "text-emerald-600" : "text-amber-600" },
            { label: "Celebration plans in place", value: `${Math.round(d.celebration_plan_rate)}%`, color: d.celebration_plan_rate >= 75 ? "text-emerald-600" : "text-amber-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> Sibling Contact Protocol Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Children with sibling contact protocol" value={d.children_with_protocol_rate} warn={90} />
            <RateBar label="Regular contact maintained" value={d.regular_contact_rate} warn={80} />
            <RateBar label="Agreed contact plan in place" value={d.agreed_plan_rate} warn={85} />
            <RateBar label="Child preferences captured" value={d.child_preference_rate} warn={85} />
            <RateBar label="Celebration / milestone plans in place" value={d.celebration_plan_rate} warn={75} />
            <RateBar label="Protocols reviewed and current" value={d.review_current_rate} warn={85} />
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
          The sibling relationship is protected by law. Children Act 1989 s.34 confers a right to reasonable contact with siblings for children in care; where contact is restricted or not taking place, there must be a specific reason documented in the child's record. CHR 2015 Regulation 7 requires registered managers to ensure care plans reflect family contact arrangements and that arrangements are reviewed regularly. The celebration plan rate is a specific quality indicator that matters more than it might appear: shared celebration of birthdays, Christmas, and other significant occasions is how sibling identity is maintained over time; a child who consistently spends their birthday without their siblings gradually loses the lived experience of being part of a sibling group, even if contact is maintained on a monthly basis. The review currency rate indicates whether the home is treating sibling contact as a living arrangement that responds to changing circumstances — including changes in siblings' placements, any criminal justice involvement, or the child's own evolving preferences as they develop — rather than as a fixed arrangement set at the time of placement that is never revisited. The protocol is the minimum; the quality of the relationship it facilitates is what matters.
        </p>
      </div>
    </PageShell>
  );
}
