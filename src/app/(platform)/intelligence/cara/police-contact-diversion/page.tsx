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

const CONTACT_TYPE_LABELS: Record<string, string> = {
  missing_from_care_report: "Missing-from-care report",
  voluntary_attendance_interview: "Voluntary attendance — interview",
  arrest: "Arrest",
  victim_of_crime: "Victim of crime",
  witness_voluntary: "Witness — voluntary",
  stop_and_search: "Stop and search",
  restorative_resolution: "Restorative resolution",
  welfare_check_by_police: "Welfare check by police",
  information_sharing_only: "Information sharing only",
  other: "Other",
};

export default function PoliceContactDiversionPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["police-contact-diversion-intelligence"],
    queryFn: async () => {
      const res = await fetch("/api/v1/home/police-contact-diversion-intelligence");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 60_000,
  });

  const d = data?.data;
  const rating = d ? (RATING[d.overall_status] ?? RATING.adequate) : null;

  return (
    <PageShell title="Police Contact & Diversion Intelligence" description="Police contact type breakdown, Concordat compliance, appropriate adult, and restorative pathways">
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
              <p className="text-sm text-muted-foreground mt-1">
                {d.police_contacts} contact{d.police_contacts !== 1 ? "s" : ""} across {d.unique_children_involved ?? 0} children
              </p>
              {d.message && <p className="text-sm text-muted-foreground mt-1">{d.message}</p>}
            </CardContent>
          </Card>

          {d.police_contacts > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Arrests", value: d.arrests, highlight: d.arrests > 0 },
                  { label: "Stop & Searches", value: d.stop_and_searches, highlight: d.stop_and_searches > 0 },
                  { label: "Victim of Crime", value: d.victim_of_crime },
                  { label: "Concordat Applied", value: d.concordat_applied },
                  { label: "Concordat Rate", value: `${d.concordat_rate_pct}%`, highlight: d.concordat_rate_pct < 80 },
                  { label: "Protocol Followed", value: d.home_protocol_followed },
                  { label: "Protocol Rate", value: `${d.protocol_rate_pct}%`, highlight: d.protocol_rate_pct < 80 },
                  { label: "Appropriate Adult", value: d.appropriate_adult_present },
                  { label: "AA Rate (Arrests)", value: d.appropriate_adult_rate_arrests_pct != null ? `${d.appropriate_adult_rate_arrests_pct}%` : "—", highlight: d.appropriate_adult_rate_arrests_pct != null && d.appropriate_adult_rate_arrests_pct < 100 },
                  { label: "Restorative Opportunity", value: d.restorative_opportunity },
                  { label: "Follow-up Required", value: d.follow_up_required },
                ].map(({ label, value, highlight }) => (
                  <Card key={label} className={highlight ? "border-amber-200 bg-amber-50" : ""}>
                    <CardContent className="pt-4">
                      <p className="text-2xl font-bold">{value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {d.contact_type_breakdown && Object.keys(d.contact_type_breakdown).length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-sm font-semibold">Contact Type Breakdown</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(d.contact_type_breakdown as Record<string, number>).map(([key, count]) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span>{CONTACT_TYPE_LABELS[key] ?? key}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
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
