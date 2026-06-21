"use client";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RATING: Record<string, { label: string; cls: string }> = {
  outstanding: { label: "Outstanding", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  good:        { label: "Good",        cls: "text-blue-700 bg-blue-50 border-blue-200" },
  adequate:    { label: "Adequate",    cls: "text-amber-700 bg-amber-50 border-amber-200" },
  inadequate:  { label: "Inadequate",  cls: "text-red-700 bg-red-50 border-red-200" },
};

export default function RadicalisationPreventChannelPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["radicalisation-prevent-channel-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home/radicalisation-prevent-channel-intelligence");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 60_000,
  });

  const d = data?.data;
  const rating = d ? (RATING[d.overall_status] ?? RATING.adequate) : null;
  const outcomeLabels: Record<string, string> = {
    no_concerns: "No concerns",
    watchful_awareness: "Watchful awareness",
    concerns_identified_internal_support: "Concerns — internal support",
    channel_discussion_considered: "Channel considered",
    channel_referred: "Channel referred",
    de_escalated_closed: "De-escalated / closed",
  };

  return (
    <PageShell title="Radicalisation & Prevent/Channel Intelligence" description="Prevent duty screening, Channel referral status, and proportionality recording">
      {isLoading && <p className="text-muted-foreground text-sm">Loading…</p>}
      {error && <p className="text-red-600 text-sm">Failed to load data.</p>}
      {d && (
        <div className="space-y-6">
          <Card className={`border ${rating!.cls}`}>
            <CardHeader>
              <CardTitle className="text-base">Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${rating!.cls.split(" ")[0]}`}>{rating!.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{d.total_children} children in placement</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Prevent Screenings", value: d.prevent_screenings },
              { label: "No Prevent Screening", value: d.no_prevent_screening, highlight: d.no_prevent_screening > 1 },
              { label: "Watchful Awareness", value: d.watchful_awareness_count, highlight: d.watchful_awareness_count > 0 },
              { label: "Channel Referred", value: d.channel_referred, highlight: d.channel_referred > 0 },
              { label: "Radicalisation Screenings", value: d.radicalisation_exploitation_screenings },
              { label: "Proportionality Rate", value: `${d.proportionality_reflection_rate}%` },
              { label: "Child Voice Rate", value: `${d.child_voice_rate}%` },
            ].map(({ label, value, highlight }) => (
              <Card key={label} className={highlight ? "border-red-200 bg-red-50" : ""}>
                <CardContent className="pt-4">
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {d.outcome_breakdown && Object.keys(d.outcome_breakdown).length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-sm font-semibold">Screening Outcome Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(d.outcome_breakdown as Record<string, number>).map(([key, count]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span>{outcomeLabels[key] ?? key}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Regulatory Reference</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{d.regulatory_ref}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </PageShell>
  );
}
