"use client";

import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, TrendingDown, TrendingUp, Minus } from "lucide-react";

const RATING: Record<string, { label: string; cls: string }> = {
  outstanding: { label: "Outstanding", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  good:        { label: "Good",        cls: "text-blue-700 bg-blue-50 border-blue-200"        },
  adequate:    { label: "Adequate",    cls: "text-amber-700 bg-amber-50 border-amber-200"     },
  inadequate:  { label: "Inadequate",  cls: "text-red-700 bg-red-50 border-red-200"           },
};

const TREND_ICON: Record<string, React.ReactNode> = {
  improving: <TrendingDown className="h-4 w-4 text-emerald-600" />,
  stable:    <Minus className="h-4 w-4 text-gray-400" />,
  worsening: <TrendingUp className="h-4 w-4 text-red-600" />,
};

const TREND_LABEL: Record<string, string> = {
  improving: "Improving — crisis frequency declining",
  stable:    "Stable",
  worsening: "Worsening — crisis frequency increasing",
};

export default function CrisisPreventionPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["crisis-prevention-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home/crisis-prevention-intelligence");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 60_000,
  });

  const d = data?.data;
  const rating = d?.overall_rating ? RATING[d.overall_rating] : null;

  if (isLoading) return <PageShell title="Crisis Prevention Intelligence" description="Analysing…"><div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading…</div></PageShell>;
  if (error || !d) return <PageShell title="Crisis Prevention Intelligence" description="Unable to load."><div className="h-48 flex items-center justify-center text-destructive text-sm">Failed to load data.</div></PageShell>;

  return (
    <PageShell
      title="Crisis Prevention Intelligence"
      description={d.headline ?? "Anticipatory vs reactive response ratio and de-escalation effectiveness"}
    >
      <div className="space-y-6">
        {rating && (
          <Card className={`border-2 ${rating.cls}`}>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{rating.label}</p>
                <p className="text-xs text-muted-foreground">{d.regulatory_ref}</p>
              </div>
              {d.prevention_trend && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {TREND_ICON[d.prevention_trend]}
                  <span>{TREND_LABEL[d.prevention_trend]}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.anticipatory_ratio}%</p>
              <p className="text-xs text-muted-foreground mt-1">Anticipatory response rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.deescalation_count}</p>
              <p className="text-xs text-muted-foreground mt-1">De-escalation entries</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-2xl font-bold">{d.crisis_count}</p>
              <p className="text-xs text-muted-foreground mt-1">Crisis incidents</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className={`text-2xl font-bold ${d.repeat_crisis_children > 0 ? "text-amber-600" : ""}`}>
                {d.repeat_crisis_children}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Children: repeat crisis (7 days)</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Anticipatory Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Anticipatory ratio (non-crisis responses)</span>
                <span className={`font-medium ${d.anticipatory_ratio >= 80 ? "text-emerald-600" : "text-amber-600"}`}>
                  {d.anticipatory_ratio}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${d.anticipatory_ratio >= 80 ? "bg-emerald-500" : "bg-amber-400"}`} style={{ width: `${d.anticipatory_ratio}%` }} />
              </div>
            </div>
            {d.crisis_count > 0 && (
              <p className="text-xs text-muted-foreground pt-1">
                {d.deescalation_per_crisis} de-escalation entries per crisis incident
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
