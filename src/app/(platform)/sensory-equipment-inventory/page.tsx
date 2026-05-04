"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ArrowUpDown, Sparkles, Package, Heart, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SensoryItem {
  id: string;
  itemName: string;
  category: "Weighted/proprioceptive" | "Tactile/fidget" | "Visual/lighting" | "Auditory" | "Vestibular" | "Olfactory" | "Oral motor" | "Compression" | "Calming";
  location: "Sensory space" | "Casey's bedroom" | "Lounge sensory corner" | "Office sensory drawer" | "Mobile sensory bag" | "Garden sensory area";
  assignedToChild: string;
  purchaseDate: string;
  condition: "Excellent" | "Good" | "Worn — replace soon" | "Damaged — out of use";
  useFrequency: "Daily" | "Several times weekly" | "Weekly" | "As needed";
  childPreference: string;
  purchaseCost: number;
  replacementDue: string;
  sensoryProfile: string;
  recommendedBy: string;
  notes: string;
}

const d = (n: number) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };

const data: SensoryItem[] = [
  { id: "se-001", itemName: "Weighted blanket 8kg (ASD-spec)", category: "Weighted/proprioceptive", location: "Casey's bedroom", assignedToChild: "yp_casey", purchaseDate: "2022-09-01", condition: "Good", useFrequency: "Daily", childPreference: "Casey's primary regulation tool — used nightly", purchaseCost: 120, replacementDue: d(365), sensoryProfile: "Deep proprioceptive input — calming for ASD profile", recommendedBy: "OT (Casey's specialist)", notes: "Critical item. Casey's bedtime non-negotiable." },
  { id: "se-002", itemName: "Weighted lap pad 3kg", category: "Weighted/proprioceptive", location: "Lounge sensory corner", assignedToChild: "", purchaseDate: "2024-01-15", condition: "Excellent", useFrequency: "Daily", childPreference: "Casey uses regularly; Alex uses occasionally", purchaseCost: 45, replacementDue: d(540), sensoryProfile: "Proprioceptive — for shared sensory corner use", recommendedBy: "Anna + OT", notes: "" },
  { id: "se-003", itemName: "Bean bag (large, fleece-covered)", category: "Calming", location: "Sensory space", assignedToChild: "", purchaseDate: "2023-06-01", condition: "Good", useFrequency: "Daily", childPreference: "Used by all children", purchaseCost: 80, replacementDue: d(180), sensoryProfile: "Soft enclosure; passive calm space", recommendedBy: "Casey (children's meeting)", notes: "Refill due — getting flat" },
  { id: "se-004", itemName: "Fidget toolkit (10 items)", category: "Tactile/fidget", location: "Office sensory drawer", assignedToChild: "", purchaseDate: "2024-03-10", condition: "Good", useFrequency: "Daily", childPreference: "Mixed use — Casey's preferred tactile toys; Alex uses during homework", purchaseCost: 35, replacementDue: d(120), sensoryProfile: "Hand-based fidgets — focus and regulation", recommendedBy: "Anna", notes: "Some items wear faster — replace as needed" },
  { id: "se-005", itemName: "White noise machine", category: "Auditory", location: "Casey's bedroom", assignedToChild: "yp_casey", purchaseDate: "2021-09-15", condition: "Excellent", useFrequency: "Daily", childPreference: "Casey's specific track; runs continuously overnight", purchaseCost: 60, replacementDue: d(700), sensoryProfile: "Auditory regulation; sleep support", recommendedBy: "OT", notes: "Specific track saved as Casey's preference" },
  { id: "se-006", itemName: "Smart bulb (gradual brightening)", category: "Visual/lighting", location: "Casey's bedroom", assignedToChild: "yp_casey", purchaseDate: "2023-09-01", condition: "Excellent", useFrequency: "Daily", childPreference: "Auto wake routine — Casey wakes calmer", purchaseCost: 25, replacementDue: d(900), sensoryProfile: "Visual; circadian rhythm support", recommendedBy: "Anna", notes: "" },
  { id: "se-007", itemName: "Ear defenders (Peltor)", category: "Auditory", location: "Mobile sensory bag", assignedToChild: "yp_casey", purchaseDate: "2023-04-12", condition: "Good", useFrequency: "Several times weekly", childPreference: "Used at busy events, library, school assemblies", purchaseCost: 30, replacementDue: d(365), sensoryProfile: "Sound attenuation for hyper-auditory profile", recommendedBy: "Casey + OT", notes: "Travel with Casey always" },
  { id: "se-008", itemName: "Brown noise speaker (portable)", category: "Auditory", location: "Mobile sensory bag", assignedToChild: "yp_alex", purchaseDate: "2024-06-20", condition: "Excellent", useFrequency: "Daily", childPreference: "Alex uses for sleep; supports ADHD profile", purchaseCost: 35, replacementDue: d(540), sensoryProfile: "Auditory — sleep and focus", recommendedBy: "Alex (children's meeting)", notes: "Charges via USB" },
  { id: "se-009", itemName: "Otter (soft toy — Casey's)", category: "Calming", location: "Casey's bedroom", assignedToChild: "yp_casey", purchaseDate: "2014-01-01", condition: "Worn — replace soon", useFrequency: "Daily", childPreference: "Casey's most important item — never replace without consultation", purchaseCost: 0, replacementDue: d(0), sensoryProfile: "Comfort attachment; primary regulation through proximity", recommendedBy: "Casey (own choice since age 5)", notes: "DO NOT REPLACE without Casey's explicit approval. Mending preferred. Critical attachment item." },
  { id: "se-010", itemName: "Compression vest", category: "Compression", location: "Casey's bedroom", assignedToChild: "yp_casey", purchaseDate: "2024-01-15", condition: "Excellent", useFrequency: "Several times weekly", childPreference: "Used during sensory crises", purchaseCost: 75, replacementDue: d(450), sensoryProfile: "Deep pressure for regulation", recommendedBy: "OT", notes: "Sized to grow — replace at next OT review" },
  { id: "se-011", itemName: "Stress ball collection", category: "Tactile/fidget", location: "Lounge sensory corner", assignedToChild: "", purchaseDate: "2024-04-01", condition: "Good", useFrequency: "Several times weekly", childPreference: "Alex uses during boxing club anxiety", purchaseCost: 12, replacementDue: d(180), sensoryProfile: "Tactile; muscular release", recommendedBy: "Lackson", notes: "" },
  { id: "se-012", itemName: "Therapy putty (4 grades)", category: "Tactile/fidget", location: "Office sensory drawer", assignedToChild: "", purchaseDate: "2024-07-01", condition: "Good", useFrequency: "As needed", childPreference: "Casey particularly enjoys", purchaseCost: 20, replacementDue: d(150), sensoryProfile: "Hand strengthening + tactile + focus", recommendedBy: "OT", notes: "" },
  { id: "se-013", itemName: "Sensory bath bombs (unscented)", category: "Tactile/fidget", location: "Casey's bedroom", assignedToChild: "yp_casey", purchaseDate: "2024-10-01", condition: "Good", useFrequency: "Weekly", childPreference: "Casey loves these — bath ritual", purchaseCost: 18, replacementDue: d(60), sensoryProfile: "Calming; tactile water exploration", recommendedBy: "Casey (children's meeting)", notes: "Specific brand only — Casey's choice" },
  { id: "se-014", itemName: "Blackout blind", category: "Visual/lighting", location: "Casey's bedroom", assignedToChild: "yp_casey", purchaseDate: "2022-09-01", condition: "Excellent", useFrequency: "Daily", childPreference: "Essential for sleep — Casey's room", purchaseCost: 60, replacementDue: d(900), sensoryProfile: "Visual; total darkness for sleep regulation", recommendedBy: "OT", notes: "" },
  { id: "se-015", itemName: "Weighted lap snake (5kg)", category: "Weighted/proprioceptive", location: "Sensory space", assignedToChild: "", purchaseDate: "2024-08-01", condition: "Excellent", useFrequency: "Several times weekly", childPreference: "Casey + Alex both use", purchaseCost: 50, replacementDue: d(540), sensoryProfile: "Proprioceptive over legs; portable form", recommendedBy: "OT", notes: "" },
  { id: "se-016", itemName: "Mobile sensory bag (full kit)", category: "Calming", location: "Mobile sensory bag", assignedToChild: "yp_casey", purchaseDate: "2023-01-15", condition: "Good", useFrequency: "Several times weekly", childPreference: "Goes everywhere with Casey outside home", purchaseCost: 45, replacementDue: d(365), sensoryProfile: "Multi-tool — fidgets, ear defenders, weighted lap pad small, visual cards", recommendedBy: "Anna + Casey", notes: "Contents refreshed quarterly" },
];

const categoryColour: Record<string, string> = {
  "Weighted/proprioceptive": "bg-purple-100 text-purple-800",
  "Tactile/fidget": "bg-amber-100 text-amber-800",
  "Visual/lighting": "bg-blue-100 text-blue-800",
  "Auditory": "bg-emerald-100 text-emerald-800",
  "Vestibular": "bg-pink-100 text-pink-800",
  "Olfactory": "bg-rose-100 text-rose-800",
  "Oral motor": "bg-indigo-100 text-indigo-800",
  "Compression": "bg-purple-100 text-purple-800",
  "Calming": "bg-cyan-100 text-cyan-800",
};

const conditionColour: Record<string, string> = {
  Excellent: "bg-green-100 text-green-800",
  Good: "bg-blue-100 text-blue-800",
  "Worn — replace soon": "bg-amber-100 text-amber-800",
  "Damaged — out of use": "bg-red-100 text-red-800",
};

const exportCols: ExportColumn<SensoryItem>[] = [
  { header: "Item", accessor: (r: SensoryItem) => r.itemName },
  { header: "Category", accessor: (r: SensoryItem) => r.category },
  { header: "Location", accessor: (r: SensoryItem) => r.location },
  { header: "Assigned", accessor: (r: SensoryItem) => r.assignedToChild ? getYPName(r.assignedToChild) : "Shared" },
  { header: "Condition", accessor: (r: SensoryItem) => r.condition },
  { header: "Use Frequency", accessor: (r: SensoryItem) => r.useFrequency },
  { header: "Cost £", accessor: (r: SensoryItem) => `£${r.purchaseCost}` },
  { header: "Replacement Due", accessor: (r: SensoryItem) => r.replacementDue },
];

export default function SensoryEquipmentInventoryPage() {
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCondition, setFilterCondition] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterCategory !== "all") items = items.filter((i) => i.category === filterCategory);
    if (filterCondition !== "all") items = items.filter((i) => i.condition === filterCondition);
    items.sort((a, b) => sortBy === "name" ? a.itemName.localeCompare(b.itemName) : sortBy === "replacement" ? a.replacementDue.localeCompare(b.replacementDue) : 0);
    return items;
  }, [filterCategory, filterCondition, sortBy]);

  const total = data.length;
  const childAssigned = data.filter((i) => i.assignedToChild).length;
  const dueReplacement = data.filter((i) => i.replacementDue <= d(60) || i.condition === "Worn — replace soon" || i.condition === "Damaged — out of use").length;
  const categories = new Set(data.map((i) => i.category)).size;

  return (
    <PageShell title="Sensory Equipment Inventory" subtitle="All sensory regulation items — owned, shared, mobile — with condition, replacement, and child assignment"
      actions={<div className="flex items-center gap-2"><ExportButton data={data} columns={exportCols} filename="sensory-equipment-inventory" /><PrintButton title="Sensory Equipment Inventory" /></div>}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center"><p className="text-2xl font-bold">{total}</p><p className="text-xs text-muted-foreground">Total Items</p></div>
        <div className="rounded-xl border bg-white p-4 text-center"><p className="text-2xl font-bold text-pink-600">{childAssigned}</p><p className="text-xs text-muted-foreground">Child-Assigned</p></div>
        <div className="rounded-xl border bg-white p-4 text-center"><p className={cn("text-2xl font-bold", dueReplacement > 0 ? "text-amber-600" : "text-green-600")}>{dueReplacement}</p><p className="text-xs text-muted-foreground">Due Replacement</p></div>
        <div className="rounded-xl border bg-white p-4 text-center"><p className="text-2xl font-bold text-blue-600">{categories}</p><p className="text-xs text-muted-foreground">Categories</p></div>
      </div>
      <div className="rounded-lg bg-purple-50 border border-purple-200 p-3 mb-6 flex items-start gap-2">
        <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
        <p className="text-sm text-purple-800">Sensory equipment is meaningful, individual, and respected. Casey&apos;s items are sacred — Otter is non-replaceable without consent. Items chosen with input from OT, child, and staff. Items wear; we replace responsively.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterCategory} onValueChange={setFilterCategory}><SelectTrigger className="w-[200px]"><SelectValue placeholder="All Categories" /></SelectTrigger><SelectContent><SelectItem value="all">All Categories</SelectItem>{(["Weighted/proprioceptive","Tactile/fidget","Visual/lighting","Auditory","Compression","Calming","Vestibular","Olfactory","Oral motor"]).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
        <Select value={filterCondition} onValueChange={setFilterCondition}><SelectTrigger className="w-[180px]"><SelectValue placeholder="All Conditions" /></SelectTrigger><SelectContent><SelectItem value="all">All Conditions</SelectItem>{(["Excellent","Good","Worn — replace soon","Damaged — out of use"]).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
        <div className="flex items-center gap-1"><ArrowUpDown className="h-4 w-4 text-muted-foreground" /><Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="name">By Name</SelectItem><SelectItem value="replacement">Replacement Due</SelectItem></SelectContent></Select></div>
      </div>
      <div className="space-y-3">
        {filtered.map((i) => {
          const isExpanded = expandedId === i.id;
          const isCritical = i.id === "se-009";
          return (
            <div key={i.id} className={cn("rounded-xl border bg-white overflow-hidden", isCritical && "border-l-4 border-l-pink-500")}>
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors" onClick={() => setExpandedId(isExpanded ? null : i.id)}>
                <div className="flex items-center gap-3 flex-1 min-w-0"><Package className="h-5 w-5 text-purple-600 shrink-0" /><div className="min-w-0"><p className="font-medium truncate">{i.itemName}</p><p className="text-xs text-muted-foreground mt-0.5">{i.location} &middot; {i.assignedToChild ? getYPName(i.assignedToChild) : "Shared"} &middot; {i.useFrequency}</p></div></div>
                <div className="flex items-center gap-2 shrink-0 ml-3"><span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", categoryColour[i.category])}>{i.category}</span><span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", conditionColour[i.condition])}>{i.condition}</span>{isCritical && <Heart className="h-4 w-4 text-pink-500" />}{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</div>
              </button>
              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-3 text-sm">
                  <div className="bg-blue-50 rounded-lg p-3"><p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Sensory Profile / Function</p><p>{i.sensoryProfile}</p></div>
                  <div className="bg-pink-50 rounded-lg p-3"><p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1">Child Preference / Use</p><p>{i.childPreference}</p></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2"><div className="bg-white rounded-lg p-2 border"><p className="text-xs text-muted-foreground">Purchased</p><p className="font-medium">{i.purchaseDate}</p></div><div className="bg-white rounded-lg p-2 border"><p className="text-xs text-muted-foreground">Cost</p><p className="font-medium">£{i.purchaseCost}</p></div><div className="bg-white rounded-lg p-2 border"><p className="text-xs text-muted-foreground">Replace Due</p><p className="font-medium">{i.replacementDue}</p></div><div className="bg-white rounded-lg p-2 border"><p className="text-xs text-muted-foreground">Recommended By</p><p className="font-medium">{i.recommendedBy}</p></div></div>
                  {i.notes && <div className="bg-amber-50 rounded-lg p-3"><p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1"><AlertTriangle className="h-3 w-3 inline mr-1" />Notes</p><p>{i.notes}</p></div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-8 rounded-lg bg-muted/50 border p-4"><p className="text-xs text-muted-foreground"><strong>Regulatory Context:</strong> Sensory equipment supports Quality Standard 5 (protection — non-restrictive practice), Quality Standard 7 (health and wellbeing). Linked to Sensory Profiles, Bedroom Personalisation, and Sensory Room Usage.</p></div>
    </PageShell>
  );
}
