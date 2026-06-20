"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartHandshake, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeSiblingContactRelationshipsIntelligence } from "@/hooks/use-home-sibling-contact-relationships-intelligence";
import type { SiblingContactResult, SiblingContactRating } from "@/lib/engines/home-sibling-contact-relationships-intelligence-engine";

const RATING_META: Record<SiblingContactRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function SiblingContactRelationshipsIntelligencePage() {
  const raw = useHomeSiblingContactRelationshipsIntelligence();
  const d = (raw as { data?: SiblingContactResult } | undefined)?.data;
  const isLoading = raw.isLoading;
  const error = raw.error;

  if (isLoading) {
    return (
      <PageShell title="Sibling Contact & Relationships Intelligence" description="Analysing sibling placement considerations, contact facilitation, relationship quality, event participation, and child satisfaction…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Sibling Contact & Relationships Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load sibling contact relationships data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.sibling_rating];

  return (
    <PageShell
      title="Sibling Contact & Relationships Intelligence"
      description="Sibling consideration at placement stage, contact facilitation quality, assessed relationship quality, shared event participation, child wishes capture, and child satisfaction with sibling contact — measuring the depth of sibling relationship support beyond protocol existence to actual quality and meaningful connection (CHR 2015 Reg 7; Children Act 1989 s.34; SCCIF 'Children's experiences'; DfE Children in Care guidance; UN CRC Articles 9 & 30)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <HeartHandshake className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sibling score: {d.sibling_score}/100 · {d.total_contact_records} contact records · facilitation {Math.round(d.contact_facilitation_rate)}% · relationship quality {Math.round(d.relationship_quality_rate)}% · child wishes {Math.round(d.child_wishes_rate)}% · satisfaction {Math.round(d.child_satisfaction_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.sibling_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.contact_facilitation_rate < 75 || d.relationship_quality_rate < 65 || d.child_satisfaction_rate < 65) && (
          <div className="flex flex-col gap-2">
            {d.contact_facilitation_rate < 75 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Contact facilitation rate {Math.round(d.contact_facilitation_rate)}% — contact that is not actively facilitated often does not happen; for children in residential care, many of the practical barriers to sibling contact — transport, coordination with other placements, staff capacity — exist only because they have not been systematically planned and resourced; a low facilitation rate indicates that the home is relying on sibling contact to happen spontaneously rather than actively making it happen
              </div>
            )}
            {d.relationship_quality_rate < 65 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Relationship quality rate {Math.round(d.relationship_quality_rate)}% — contact frequency and relationship quality are not the same metric; a child can be seeing siblings regularly while the quality of those contacts is poor — stressful, conflict-laden, or experienced as obligatory rather than joyful; assessed relationship quality tells the manager whether the contact that is happening is actually beneficial, which is the question that matters for the child
              </div>
            )}
            {d.child_satisfaction_rate < 65 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Child satisfaction rate {Math.round(d.child_satisfaction_rate)}% — sibling contact that the child is not satisfied with needs to be understood before it is continued unchanged; dissatisfaction may reflect practical issues (venue, timing, activities) that can be easily resolved, or it may reflect deeper relational issues that require therapeutic support and more careful planning; children's dissatisfaction with sibling contact is data, not a justification for reducing contact
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Placements assessed", value: d.total_placement_records, color: "text-blue-600" },
            { label: "Contact records", value: d.total_contact_records, color: "text-blue-600" },
            { label: "Assessments", value: d.total_assessment_records, color: "text-blue-600" },
            { label: "Shared events", value: d.total_event_records, color: "text-blue-600" },
            { label: "Wishes recorded", value: d.total_wishes_records, color: "text-blue-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><HeartHandshake className="h-4 w-4 text-muted-foreground" /> Sibling Relationship Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Sibling considered at placement decision" value={d.placement_consideration_rate} warn={90} />
            <RateBar label="Contact actively facilitated" value={d.contact_facilitation_rate} warn={80} />
            <RateBar label="Assessed relationship quality" value={d.relationship_quality_rate} warn={70} />
            <RateBar label="Shared event participation rate" value={d.event_participation_rate} warn={70} />
            <RateBar label="Child wishes documented" value={d.child_wishes_rate} warn={85} />
            <RateBar label="Child satisfaction with contact" value={d.child_satisfaction_rate} warn={70} />
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
          The placement consideration rate is a leading indicator of whether the home treats sibling relationships as a care planning priority from the outset. Research from the Rees Centre, the Nuffield Foundation, and the DfE's own longitudinal studies is consistent: children placed alongside or in close proximity to siblings have better placement stability, lower rates of placement breakdown, lower rates of offending, and better mental health outcomes than those separated from siblings without therapeutic support. The event participation rate captures something qualitatively different from contact frequency: shared positive experiences — birthdays, outings, holidays — are how sibling relationships are enriched rather than merely maintained; a sibling relationship that consists only of scheduled visits without shared memories is a thinner relationship than one that includes shared experience. The placement consideration rate is particularly important: a home that does not routinely assess sibling relationships at the point of placement is likely to make decisions that inadvertently harm those relationships; a home that routinely considers how a new placement will support or affect sibling contact is one that takes family bonds seriously as a care planning variable, not an afterthought.
        </p>
      </div>
    </PageShell>
  );
}
