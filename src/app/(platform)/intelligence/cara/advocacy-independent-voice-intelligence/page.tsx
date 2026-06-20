"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeAdvocacyIndependentVoiceIntelligence } from "@/hooks/use-home-advocacy-independent-voice-intelligence";
import type { AdvocacyVoiceResult, AdvocacyVoiceRating } from "@/lib/engines/home-advocacy-independent-voice-intelligence-engine";

const RATING_META: Record<AdvocacyVoiceRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function AdvocacyIndependentVoiceIntelligencePage() {
  const { data, isLoading, error } = useHomeAdvocacyIndependentVoiceIntelligence();
  const d: AdvocacyVoiceResult | undefined = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Advocacy & Independent Voice Intelligence" description="Analysing advocacy record coverage, active engagement rates, independence, child voice capture, and private session access…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Advocacy & Independent Voice Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load advocacy & independent voice data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.advocacy_rating];

  return (
    <PageShell
      title="Advocacy & Independent Voice Intelligence"
      description="Advocacy record completeness, active engagement rate, proportion of children with advocacy support, independence of the advocacy relationship, child voice capture frequency, private session access, and breadth of advocacy types in use — evidencing that the home facilitates meaningful access to independent advocacy that goes beyond signposting (Children Act 1989 s.26A; Advocacy Standards Framework 2002; IRO Handbook 2010; UNCRC Article 12 — right to be heard; CHR 2015 Regulation 5)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Megaphone className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Advocacy score: {d.advocacy_score}/100 · {d.total_records} records · children with advocacy {Math.round(d.children_with_advocacy_rate)}% · active {Math.round(d.active_rate)}% · child voice {Math.round(d.child_voice_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.advocacy_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.children_with_advocacy_rate < 80 || d.independent_rate < 85 || d.private_session_rate < 70) && (
          <div className="flex flex-col gap-2">
            {d.children_with_advocacy_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Children with advocacy rate {Math.round(d.children_with_advocacy_rate)}% — children without an active advocacy record may have declined advocacy, but they should have been actively offered it and their decision documented; a low rate without documented offers and refusals suggests that advocacy access is being left to chance rather than actively facilitated; the Advocacy Standards Framework requires that children are told about advocacy in a way they can understand and are actively supported to access it
              </div>
            )}
            {d.independent_rate < 85 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Advocacy independence rate {Math.round(d.independent_rate)}% — advocacy that is not genuinely independent — where the advocate has a relationship with the home, the local authority, or the placing authority — cannot perform its protective function; children must be supported to access advocates who have no conflict of interest and whose only accountability is to the child; this is a safeguarding governance issue as well as a rights issue
              </div>
            )}
            {d.private_session_rate < 70 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                Private session rate {Math.round(d.private_session_rate)}% — advocacy sessions that are not private — observed by staff, conducted in shared spaces, or held in ways that compromise confidentiality — are not safe enough for children to disclose concerns that involve the home or its staff; private sessions are a structural requirement of meaningful advocacy, not a preference
              </div>
            )}
          </div>
        )}

        <div className="rounded-lg border bg-muted/30 p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{d.total_records}</p>
          <p className="text-xs text-muted-foreground mt-1">Total advocacy records</p>
          {d.advocacy_type_variety > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">{d.advocacy_type_variety} advocacy type{d.advocacy_type_variety !== 1 ? "s" : ""} in use</p>
          )}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Megaphone className="h-4 w-4 text-muted-foreground" /> Advocacy Quality Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RateBar label="Children with active advocacy rate" value={d.children_with_advocacy_rate} warn={85} />
            <RateBar label="Active engagement rate" value={d.active_rate} warn={80} />
            <RateBar label="Advocacy independence rate" value={d.independent_rate} warn={90} />
            <RateBar label="Child voice capture rate" value={d.child_voice_rate} warn={85} />
            <RateBar label="Private session rate" value={d.private_session_rate} warn={80} />
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
          The independent voice is the mechanism through which the care system hears what it would otherwise prefer not to hear. A child who has access to a genuine, independent, confidential advocacy relationship can say things to their advocate that they cannot say to their key worker, their social worker, or their IRO — because they know those adults have institutional interests and institutional loyalties. The Advocacy Standards Framework identifies six core principles: being led by the child, being accessible, being independent, being confidential, being empowering, and being accountable — and the most critical of these for safeguarding purposes is independence and confidentiality. An advocacy service that is commissioned by the placing authority, staffed by people who work for the home, or conducted in spaces where staff can hear the conversation is not independent and is not confidential, however it is described on paper. Child voice capture rate and private session rate are the two operational measures that distinguish genuine advocacy from tokenistic advocacy: genuine advocacy produces a record of what the child actually said in their own words, and it happens somewhere the child can speak freely. Advocacy type variety measures whether the home is offering a menu of options — peer advocacy, instructed advocacy, non-instructed advocacy, complaints advocacy — or defaulting to a single model that may not suit every child; children with communication difficulties in particular need non-instructed advocacy provided by someone trained in alternative communication methods.
        </p>
      </div>
    </PageShell>
  );
}
