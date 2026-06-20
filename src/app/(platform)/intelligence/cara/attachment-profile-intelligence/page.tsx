"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeAttachmentProfileIntelligence } from "@/hooks/use-home-attachment-profile-intelligence";
import type { AttachmentProfileRating } from "@/lib/engines/home-attachment-profile-intelligence-engine";

const RATING_META: Record<AttachmentProfileRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function AttachmentProfileIntelligencePage() {
  const { data, isLoading, error } = useHomeAttachmentProfileIntelligence();

  if (isLoading) {
    return (
      <PageShell title="Attachment Profile Intelligence" description="Analysing attachment profile data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !data) {
    return (
      <PageShell title="Attachment Profile Intelligence" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load attachment profile intelligence data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[data.profile_rating];

  return (
    <PageShell
      title="Attachment Profile Intelligence"
      description="Attachment assessment coverage, behaviour analysis depth, relational quality, child voice, and staff guidance (CHR 2015 Reg 9, 10; SCCIF Experiences and progress; DDP; PACE)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Link2 className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{data.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Score: {data.profile_score}/100 · {data.total_profiles} attachment profile{data.total_profiles !== 1 ? "s" : ""} · {data.children_with_profile_rate}% children covered
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{data.profile_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {data.total_profiles === 0 && (
          <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            No attachment profiles exist — the home cannot demonstrate attachment-informed care. Ofsted expects this for all children.
          </div>
        )}

        {data.total_profiles > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="rounded-lg border bg-muted/30 p-3 text-center">
                <p className="text-2xl font-bold">{data.total_profiles}</p>
                <p className="text-xs text-muted-foreground mt-1">Total profiles</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3 text-center">
                <p className={`text-2xl font-bold ${data.children_with_profile_rate >= 80 ? "text-emerald-600" : data.children_with_profile_rate >= 50 ? "text-amber-600" : "text-red-600"}`}>
                  {data.children_with_profile_rate}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">Children covered</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3 text-center">
                <p className={`text-2xl font-bold ${data.active_profile_rate >= 80 ? "text-emerald-600" : data.active_profile_rate >= 50 ? "text-amber-600" : "text-red-600"}`}>
                  {data.active_profile_rate}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">Active / current</p>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  Profile Quality Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <RateBar label="Children with profile" value={data.children_with_profile_rate} />
                <RateBar label="Active profile rate" value={data.active_profile_rate} />
                <RateBar label="Behaviour analysis depth" value={data.behaviour_analysis_rate} warn={75} />
                <RateBar label="Strong key relationships" value={data.strong_relationship_rate} warn={60} />
                <RateBar label="Child voice captured" value={data.child_voice_rate} />
                <RateBar label="Staff guidance embedded" value={data.staff_guidance_rate} />
              </CardContent>
            </Card>
          </>
        )}

        {data.insights.length > 0 && (
          <div className="space-y-2">
            {data.insights.map((ins, i) => {
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
          {data.strengths.length > 0 && (
            <Card className="border-emerald-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-emerald-700 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.strengths.map((s, i) => (
                    <li key={i} className="text-xs flex gap-2"><Star className="h-3 w-3 text-emerald-500 flex-shrink-0 mt-0.5" />{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {data.concerns.length > 0 && (
            <Card className="border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-amber-700 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Concerns</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.concerns.map((c, i) => (
                    <li key={i} className="text-xs flex gap-2"><AlertTriangle className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" />{c}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {data.recommendations.length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Recommendations</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {data.recommendations.map((rec) => {
                const urgencyColor =
                  rec.urgency === "immediate" ? "bg-red-100 text-red-700 border-red-200" :
                  rec.urgency === "soon"       ? "bg-amber-100 text-amber-700 border-amber-200" :
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
          CHR 2015 Reg 9 (contact), Reg 10 (health and wellbeing). SCCIF: Experiences and progress; Health and well-being. DDP (Hughes) attachment-informed residential care. PACE model.
        </p>
      </div>
    </PageShell>
  );
}
