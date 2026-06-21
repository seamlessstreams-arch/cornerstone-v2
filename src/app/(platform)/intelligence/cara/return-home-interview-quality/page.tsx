"use client";

import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, MapPin } from "lucide-react";

const RATING: Record<string, { label: string; cls: string }> = {
  outstanding: { label: "Outstanding", cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  good:        { label: "Good",        cls: "text-blue-700 bg-blue-50 border-blue-200"        },
  adequate:    { label: "Adequate",    cls: "text-amber-700 bg-amber-50 border-amber-200"     },
  inadequate:  { label: "Inadequate",  cls: "text-red-700 bg-red-50 border-red-200"           },
};

function Stat({ label, value, sub, warn }: { label: string; value: string | number; sub?: string; warn?: boolean }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <p className={`text-2xl font-bold ${warn ? "text-red-600" : ""}`}>{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export default function ReturnHomeInterviewQualityPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["rhi-quality-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home/return-home-interview-quality-intelligence");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 60_000,
  });

  const d = data?.data;
  const rating = d?.overall_rating ? RATING[d.overall_rating] : null;

  if (isLoading) return <PageShell title="Return Home Interview Quality" description="Analysing…"><div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading…</div></PageShell>;
  if (error || !d) return <PageShell title="Return Home Interview Quality" description="Unable to load."><div className="h-48 flex items-center justify-center text-destructive text-sm">Failed to load data.</div></PageShell>;

  return (
    <PageShell
      title="Return Home Interview Quality"
      description={d.headline ?? "RHI completion and quality analysis"}
    >
      <div className="space-y-6">
        {rating && (
          <Card className={`border-2 ${rating.cls}`}>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              {d.rhi_completion_rate >= 85 ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              )}
              <div>
                <p className="text-sm font-semibold">{rating.label}</p>
                <p className="text-xs text-muted-foreground">{d.regulatory_ref}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Missing episodes" value={d.total_missing_episodes} />
          <Stat label="RHI completion" value={`${d.rhi_completion_rate}%`} warn={d.rhi_completion_rate < 85} />
          <Stat label="In-time rate" value={`${d.in_time_rate}%`} sub="within 72h" warn={d.in_time_rate < 75} />
          <Stat label="High-risk episodes" value={d.high_risk_missing} warn={d.high_risk_missing > 2} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" /> Timeliness Requirement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>RHI completion rate</span>
                <span className={`font-medium ${d.rhi_completion_rate < 85 ? "text-red-600" : "text-emerald-600"}`}>{d.rhi_completion_rate}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${d.rhi_completion_rate >= 85 ? "bg-emerald-500" : "bg-red-400"}`} style={{ width: `${d.rhi_completion_rate}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>In-time rate (72h window)</span>
                <span className={`font-medium ${d.in_time_rate < 75 ? "text-amber-600" : "text-emerald-600"}`}>{d.in_time_rate}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${d.in_time_rate >= 75 ? "bg-emerald-500" : "bg-amber-400"}`} style={{ width: `${d.in_time_rate}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {d.child_profiles && d.child_profiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Per-child RHI Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {d.child_profiles.map((p: any, i: number) => (
                  <div key={i} className="py-2 flex items-center justify-between">
                    <span className="text-sm font-medium">{p.name}</span>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{p.episodes} episode{p.episodes !== 1 ? "s" : ""}</span>
                      <span className={p.rhi_completed < p.episodes ? "text-amber-600 font-medium" : "text-emerald-600"}>
                        {p.rhi_completed}/{p.episodes} RHI
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
