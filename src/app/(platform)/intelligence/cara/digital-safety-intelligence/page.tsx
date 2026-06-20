"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeDigitalSafetyIntelligence } from "@/hooks/use-home-digital-safety-intelligence";
import type { HomeDigitalSafetyResult, DigitalSafetyRating } from "@/lib/engines/home-digital-safety-intelligence-engine";

const RATING_META: Record<DigitalSafetyRating, { label: string; color: string; bg: string; border: string }> = {
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

export default function DigitalSafetyIntelligencePage() {
  const { data, isLoading, error } = useHomeDigitalSafetyIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="Digital Safety" description="Analysing digital safety data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="Digital Safety" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load digital safety data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.digital_safety_rating];
  const inc = d.incidents;
  const agr = d.agreements;
  const con = d.consents;

  return (
    <PageShell
      title="Digital Safety"
      description="Online safety incidents, digital agreements, photo and media consent — proactive digital safeguarding that protects children from online harm and respects their privacy rights (NMS 7 — Online Safety; KCSIE 2024; CHR 2015 Reg 12; UN CRC Article 16)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <Shield className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Digital safety score: {d.digital_safety_score}/100 · {inc.total_incidents_90d} incidents (90d) · {agr.agreement_coverage_rate}% agreement coverage
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.digital_safety_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(inc.high_severity_count > 0 || inc.open_incidents > 0) && (
          <div className="flex flex-col gap-2">
            {inc.high_severity_count > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                {inc.high_severity_count} high/critical severity online safety {inc.high_severity_count === 1 ? "incident" : "incidents"} — immediate review and safeguarding consideration required
              </div>
            )}
            {inc.open_incidents > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {inc.open_incidents} open online safety {inc.open_incidents === 1 ? "incident" : "incidents"} — assign owners and set resolution target dates
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Online Safety Incidents (90d)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Total:</span> <span className="font-medium">{inc.total_incidents_90d}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Open:</span> <span className={`font-medium ${inc.open_incidents > 0 ? "text-amber-600" : ""}`}>{inc.open_incidents}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Escalated:</span> <span className="font-medium">{inc.escalated_incidents}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">High severity:</span> <span className={`font-medium ${inc.high_severity_count > 0 ? "text-red-600" : ""}`}>{inc.high_severity_count}</span></div>
              </div>
              <RateBar label="Safeguarding referral rate" value={inc.safeguarding_referral_rate} warn={100} />
              <RateBar label="Parent notification rate" value={inc.parent_notification_rate} warn={100} />
              <RateBar label="Resolution rate" value={inc.resolution_rate} warn={90} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Online Safety Agreements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Children covered:</span> <span className="font-medium">{agr.children_with_agreements}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Overdue reviews:</span> <span className={`font-medium ${agr.overdue_reviews > 0 ? "text-amber-600" : ""}`}>{agr.overdue_reviews}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Parental controls:</span> <span className="font-medium">{agr.with_parental_controls}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Avg devices/child:</span> <span className="font-medium">{agr.avg_devices_per_child.toFixed(1)}</span></div>
              </div>
              <RateBar label="Agreement coverage rate" value={agr.agreement_coverage_rate} warn={90} />
              <RateBar label="Signed by child rate" value={agr.signed_rate} warn={80} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Photo & Media Consent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs"><span className="text-muted-foreground">Photo consent:</span> <span className="font-medium">{con.children_with_photo_consent}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Overdue reviews:</span> <span className={`font-medium ${con.overdue_photo_reviews > 0 ? "text-amber-600" : ""}`}>{con.overdue_photo_reviews}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Media consents:</span> <span className="font-medium">{con.media_consents_active}</span></div>
                <div className="text-xs"><span className="text-muted-foreground">Expired media:</span> <span className={`font-medium ${con.expired_media_consents > 0 ? "text-amber-600" : ""}`}>{con.expired_media_consents}</span></div>
              </div>
              <RateBar label="Photo consent coverage" value={con.photo_consent_coverage_rate} warn={100} />
              <RateBar label="Child consent rate" value={con.child_consent_rate} warn={90} />
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
          National Minimum Standards 7 (Online Safety). Keeping Children Safe in Education 2024. CHR 2015 Regulation 12 (Health and Safety). UN CRC Article 16 (privacy). Every child in a residential home should have an individualised online safety agreement, current consent records, and a clear response process when online safety incidents occur. Parental control settings should be reviewed at least annually.
        </p>
      </div>
    </PageShell>
  );
}
