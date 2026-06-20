"use client";

import { PageShell } from "@/components/ui/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { useHomeLadoAllegationManagementIntelligence } from "@/hooks/use-home-lado-allegation-management-intelligence";
import type { LadoAllegationResult, LadoAllegationRating } from "@/lib/engines/home-lado-allegation-management-intelligence-engine";

const RATING_META: Record<LadoAllegationRating, { label: string; color: string; bg: string; border: string }> = {
  outstanding:       { label: "Outstanding",       color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good:              { label: "Good",               color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  adequate:          { label: "Adequate",           color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  inadequate:        { label: "Inadequate",         color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200" },
  insufficient_data: { label: "Insufficient Data",  color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200" },
};

export default function LadoAllegationManagementIntelligencePage() {
  const { data, isLoading, error } = useHomeLadoAllegationManagementIntelligence();
  const d = data?.data;

  if (isLoading) {
    return (
      <PageShell title="LADO & Allegation Management" description="Analysing LADO referral and allegation data…">
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading…</div>
      </PageShell>
    );
  }
  if (error || !d) {
    return (
      <PageShell title="LADO & Allegation Management" description="Unable to load data.">
        <div className="flex items-center justify-center h-48 text-destructive text-sm">Failed to load LADO allegation management data.</div>
      </PageShell>
    );
  }

  const rating = RATING_META[d.lado_rating];

  return (
    <PageShell
      title="LADO & Allegation Management"
      description="LADO referral compliance, Ofsted notification timeliness, allegation resolution rates and time-to-close — evidencing that allegations against staff are handled with statutory rigour, protecting both children and staff from harm (Working Together 2023; KCSIE 2024; CHR 2015 Reg 34)."
    >
      <div className="space-y-6">

        <Card className={`border-2 ${rating.border}`}>
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${rating.bg} ${rating.border} border`}>
                <ShieldAlert className={`h-5 w-5 ${rating.color}`} />
                <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{d.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  LADO score: {d.lado_score}/100 · {d.total_referrals} referrals · {d.open_referrals} open · Ofsted notification {Math.round(d.ofsted_notification_rate)}% · resolution {Math.round(d.resolution_rate)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{d.lado_score}</p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(d.open_referrals > 0 || d.ofsted_notification_rate < 100 || d.resolution_rate < 80) && (
          <div className="flex flex-col gap-2">
            {d.open_referrals > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {d.open_referrals} open LADO referral{d.open_referrals > 1 ? "s" : ""} — open referrals represent ongoing risk; the LADO must be kept informed of progress and the employer must not allow the subject staff member unsupervised access to children until resolved
              </div>
            )}
            {d.ofsted_notification_rate < 100 && (
              <div className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Ofsted notification rate {Math.round(d.ofsted_notification_rate)}% — every allegation requiring LADO referral must be notified to Ofsted within 14 days; failure to notify is a regulatory breach that will result in regulatory action
              </div>
            )}
            {d.resolution_rate < 80 && (
              <div className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                Resolution rate {Math.round(d.resolution_rate)}% — unresolved allegations leave staff, children and the home in a position of prolonged uncertainty; Ofsted will scrutinise whether the employer has taken timely action
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total referrals", value: d.total_referrals, color: "text-blue-600" },
            { label: "Open referrals", value: d.open_referrals, color: d.open_referrals > 0 ? "text-amber-600" : "text-emerald-600" },
            { label: "Ofsted notification rate", value: `${Math.round(d.ofsted_notification_rate)}%`, color: d.ofsted_notification_rate < 100 ? "text-red-600" : "text-emerald-600" },
            { label: "Resolution rate", value: `${Math.round(d.resolution_rate)}%`, color: d.resolution_rate < 80 ? "text-amber-600" : "text-emerald-600" },
            { label: "Avg days to close", value: Math.round(d.average_days_to_close), color: d.average_days_to_close > 90 ? "text-amber-600" : "text-foreground" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
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
          Working Together to Safeguard Children 2023 (Chapter 2 — organisations and agencies must have clear policies for dealing with allegations; the LADO must be consulted whenever an allegation is made against a person who works with children). KCSIE 2024 (Part 4 — low-level concerns and allegations against staff in children's settings, including the duty to refer to the LADO and the DBS). CHR 2015 Regulation 34 (Notification of significant events — the registered person must notify Ofsted of any allegation of abuse made against a member of staff within 14 days). LADO referral compliance is not a performance metric — it is a child safeguarding and staff welfare obligation. Slow, incomplete or undocumented referrals can allow a harmful staff member to remain in post and can expose the home to criminal, regulatory and civil liability.
        </p>
      </div>
    </PageShell>
  );
}
