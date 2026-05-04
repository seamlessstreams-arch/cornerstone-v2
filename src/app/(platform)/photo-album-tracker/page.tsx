"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { getYPName, getStaffName } from "@/lib/seed-data";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Camera,
  Heart,
  Sparkles,
  Lock,
  Star,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PhotoAlbum {
  id: string;
  youngPerson: string;
  albumName: string;
  albumType: "Life Story Book" | "Memory book" | "Annual album" | "Theme album" | "Achievement album" | "Family album" | "Identity album";
  format: "Physical book" | "Cloud digital" | "Both";
  startedDate: string;
  childOwnsAlbum: boolean;
  childChoosesContent: boolean;
  totalPhotos: number;
  recentAdditions: { date: string; description: string; addedBy: string; childInvolved: boolean }[];
  themesCovered: string[];
  consentRecord: string;
  storageLocation: string;
  childCanAccess: boolean;
  childCanEdit: boolean;
  sharedWithFamily: boolean;
  shareableSummary: string;
  significantMoments: string[];
  reviewedDate: string;
  reviewedWith: string;
  childReflectionOnAlbum: string;
  protectionMeasures: string[];
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: PhotoAlbum[] = [
  {
    id: "pa-001",
    youngPerson: "yp_alex",
    albumName: "Alex's Life Story Book",
    albumType: "Life Story Book",
    format: "Both",
    startedDate: "2022-02-01",
    childOwnsAlbum: true,
    childChoosesContent: true,
    totalPhotos: 47,
    recentAdditions: [
      { date: d(-7), description: "Boxing club inter-club competition photo", addedBy: "staff_lackson", childInvolved: true },
      { date: d(-30), description: "Sunday lunch with Nan (visit photo)", addedBy: "staff_anna", childInvolved: true },
      { date: d(-60), description: "Birthday card from Mum (photographed)", addedBy: "staff_anna", childInvolved: true },
    ],
    themesCovered: ["Pre-care happy memories", "Family connections", "Boxing journey", "Growth at Oak House", "Achievements"],
    consentRecord: "Triple consent recorded (child, PR, LA) — see Media Publicity Consent",
    storageLocation: "Alex's bedroom (physical) + secured cloud (Anna access only with Alex's permission)",
    childCanAccess: true,
    childCanEdit: true,
    sharedWithFamily: true,
    shareableSummary: "Mum has copy of safe photos (chosen by Alex)",
    significantMoments: [
      "First boxing photo (age 11) — identity-defining",
      "Reunion photo with Mum after period of restricted contact",
      "School progress milestone moments",
    ],
    reviewedDate: d(-30),
    reviewedWith: "staff_anna",
    childReflectionOnAlbum: "It's mine. I look at it when I miss Mum. The boxing pics make me feel strong.",
    protectionMeasures: [
      "Photos featuring father not included (per Alex's choice and safeguarding plan)",
      "School-based photos limited to those Alex chose",
      "Online sharing only via approved family channel",
    ],
  },
  {
    id: "pa-002",
    youngPerson: "yp_jordan",
    albumName: "Jordan's Story",
    albumType: "Life Story Book",
    format: "Both",
    startedDate: "2023-07-15",
    childOwnsAlbum: true,
    childChoosesContent: true,
    totalPhotos: 38,
    recentAdditions: [
      { date: d(-14), description: "Football team captain photo (newspaper cutting)", addedBy: "staff_chervelle", childInvolved: true },
      { date: d(-45), description: "Cultural Saturday club — heritage exploration", addedBy: "staff_chervelle", childInvolved: true },
      { date: d(-90), description: "Sister Tia's birthday card photo", addedBy: "staff_chervelle", childInvolved: true },
    ],
    themesCovered: ["Cultural identity", "Football journey", "Family (Mum's letters)", "Sibling bond with Tia", "Growth"],
    consentRecord: "Triple consent recorded — see Media Publicity Consent",
    storageLocation: "Jordan's bedroom (physical) + cloud copy",
    childCanAccess: true,
    childCanEdit: true,
    sharedWithFamily: true,
    shareableSummary: "Mum receives selected photos via prison letterbox approved arrangement",
    significantMoments: [
      "Football captaincy moment",
      "Cultural Saturday club first attendance",
      "Cousin Devon photo",
      "Letters from Mum (some scanned with permission)",
    ],
    reviewedDate: d(-21),
    reviewedWith: "staff_chervelle",
    childReflectionOnAlbum: "It's everything. The football stuff is class. The Mum stuff helps when she's far.",
    protectionMeasures: [
      "Pre-care photos limited (Jordan's choice)",
      "Prison-related identifying details obscured",
      "Online presence restricted",
    ],
  },
  {
    id: "pa-003",
    youngPerson: "yp_casey",
    albumName: "Casey's Memory Book",
    albumType: "Memory book",
    format: "Physical book",
    startedDate: "2021-08-01",
    childOwnsAlbum: true,
    childChoosesContent: true,
    totalPhotos: 62,
    recentAdditions: [
      { date: d(-3), description: "Otters at New Forest Wildlife Park (Casey's chosen visit)", addedBy: "staff_anna", childInvolved: true },
      { date: d(-28), description: "Casey's exhibition piece 'Finding Home'", addedBy: "staff_anna", childInvolved: true },
      { date: d(-90), description: "Sensory garden — Casey's favourite plants", addedBy: "staff_anna", childInvolved: true },
    ],
    themesCovered: ["Otters and nature", "Casey's artwork (own)", "Sensory-friendly places visited", "Anna and Casey moments", "Pre-care few selected memories"],
    consentRecord: "Triple consent — see Media Publicity Consent",
    storageLocation: "Casey's bedroom (physical only — Casey's preference)",
    childCanAccess: true,
    childCanEdit: true,
    sharedWithFamily: false,
    shareableSummary: "Casey doesn't currently share — letterbox-only contact arrangement",
    significantMoments: [
      "Otter sanctuary visit (real-life otters meeting Otter the toy)",
      "First exhibition piece",
      "Otter (soft toy) journey across years — same since age 5",
      "Anna's birthday card otter drawing",
    ],
    reviewedDate: d(-7),
    reviewedWith: "staff_anna",
    childReflectionOnAlbum: "[Pointed at otter pages and visually smiled. Tapped Otter (soft toy) chest.]",
    protectionMeasures: [
      "Birth family photos not included (Casey's choice; reviewable)",
      "Physical book only — no cloud copy (Casey's preference)",
      "No online presence",
      "Anna only has access with Casey's permission",
    ],
  },
  {
    id: "pa-004",
    youngPerson: "yp_alex",
    albumName: "Alex's Annual Album 2025",
    albumType: "Annual album",
    format: "Both",
    startedDate: "2025-01-01",
    childOwnsAlbum: true,
    childChoosesContent: true,
    totalPhotos: 12,
    recentAdditions: [
      { date: d(-30), description: "January routine moments", addedBy: "staff_anna", childInvolved: true },
    ],
    themesCovered: ["Year in pictures", "Routine joy", "Growth markers"],
    consentRecord: "Triple consent — see Media Publicity Consent",
    storageLocation: "Alex's bedroom + cloud",
    childCanAccess: true,
    childCanEdit: true,
    sharedWithFamily: false,
    shareableSummary: "Personal — for Alex",
    significantMoments: [],
    reviewedDate: d(-30),
    reviewedWith: "staff_anna",
    childReflectionOnAlbum: "It's nice having a year on its own.",
    protectionMeasures: ["Standard Alex photo-consent rules apply"],
  },
];

const albumTypeColour: Record<string, string> = {
  "Life Story Book": "bg-pink-100 text-pink-800",
  "Memory book": "bg-purple-100 text-purple-800",
  "Annual album": "bg-blue-100 text-blue-800",
  "Theme album": "bg-amber-100 text-amber-800",
  "Achievement album": "bg-emerald-100 text-emerald-800",
  "Family album": "bg-rose-100 text-rose-800",
  "Identity album": "bg-indigo-100 text-indigo-800",
};

const exportCols: ExportColumn<PhotoAlbum>[] = [
  { header: "Young Person", accessor: (r: PhotoAlbum) => getYPName(r.youngPerson) },
  { header: "Album", accessor: (r: PhotoAlbum) => r.albumName },
  { header: "Type", accessor: (r: PhotoAlbum) => r.albumType },
  { header: "Format", accessor: (r: PhotoAlbum) => r.format },
  { header: "Started", accessor: (r: PhotoAlbum) => r.startedDate },
  { header: "Total Photos", accessor: (r: PhotoAlbum) => String(r.totalPhotos) },
  { header: "Child Owns", accessor: (r: PhotoAlbum) => r.childOwnsAlbum ? "Yes" : "No" },
  { header: "Last Reviewed", accessor: (r: PhotoAlbum) => r.reviewedDate },
];

export default function PhotoAlbumTrackerPage() {
  const [filterYP, setFilterYP] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterYP !== "all") items = items.filter((p) => p.youngPerson === filterYP);
    if (filterType !== "all") items = items.filter((p) => p.albumType === filterType);
    items.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.youngPerson.localeCompare(b.youngPerson);
        case "photos":
          return b.totalPhotos - a.totalPhotos;
        default:
          return 0;
      }
    });
    return items;
  }, [filterYP, filterType, sortBy]);

  const total = data.length;
  const allChildOwn = data.every((p) => p.childOwnsAlbum);
  const totalPhotos = data.reduce((sum, p) => sum + p.totalPhotos, 0);
  const uniqueChildren = new Set(data.map((p) => p.youngPerson)).size;

  return (
    <PageShell
      title="Photo Album Tracker"
      subtitle="Per-child photo memory albums — owned by children, curated with care, protected with consent"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="photo-album-tracker" />
          <PrintButton title="Photo Album Tracker" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Active Albums</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{allChildOwn ? "100%" : `${data.filter((p) => p.childOwnsAlbum).length}/${total}`}</p>
          <p className="text-xs text-muted-foreground">Child-Owned</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalPhotos}</p>
          <p className="text-xs text-muted-foreground">Photos Curated</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{uniqueChildren}/3</p>
          <p className="text-xs text-muted-foreground">Children with Albums</p>
        </div>
      </div>

      <div className="rounded-lg bg-pink-50 border border-pink-200 p-3 mb-6 flex items-start gap-2">
        <Camera className="h-4 w-4 text-pink-600 mt-0.5 shrink-0" />
        <p className="text-sm text-pink-800">
          Photo albums belong to the children. They choose what goes in. They choose who sees them. They
          can keep, take when they leave, and pass to their own families. Every photo respects triple
          consent (child, PR, LA).
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterYP} onValueChange={setFilterYP}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Children" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Children</SelectItem>
            <SelectItem value="yp_alex">{getYPName("yp_alex")}</SelectItem>
            <SelectItem value="yp_jordan">{getYPName("yp_jordan")}</SelectItem>
            <SelectItem value="yp_casey">{getYPName("yp_casey")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Life Story Book">Life Story Book</SelectItem>
            <SelectItem value="Memory book">Memory Book</SelectItem>
            <SelectItem value="Annual album">Annual Album</SelectItem>
            <SelectItem value="Theme album">Theme Album</SelectItem>
            <SelectItem value="Achievement album">Achievement Album</SelectItem>
            <SelectItem value="Family album">Family Album</SelectItem>
            <SelectItem value="Identity album">Identity Album</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">By Child</SelectItem>
              <SelectItem value="photos">Most Photos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((p) => {
          const isExpanded = expandedId === p.id;

          return (
            <div key={p.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Camera className="h-5 w-5 text-pink-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{p.albumName} ({getYPName(p.youngPerson)})</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Started {p.startedDate} &middot; {p.totalPhotos} photos &middot; {p.format}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", albumTypeColour[p.albumType])}>{p.albumType}</span>
                  {p.childOwnsAlbum && <Heart className="h-4 w-4 text-pink-500" />}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Themes Covered</p>
                    <div className="flex flex-wrap gap-1">
                      {p.themesCovered.map((t, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Recent Additions</p>
                    <div className="space-y-1">
                      {p.recentAdditions.map((r, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm">
                          <p className="font-medium">{r.date} — {r.description}</p>
                          <p className="text-xs text-muted-foreground">Added by {getStaffName(r.addedBy)}{r.childInvolved && " (with child)"}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {p.significantMoments.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">
                        <Sparkles className="h-3 w-3 inline mr-1" />Significant Moments
                      </p>
                      <ul className="space-y-1">
                        {p.significantMoments.map((m, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <Star className="h-3 w-3 text-amber-500 mt-1 shrink-0" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-pink-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1">Child&apos;s Reflection</p>
                    <p className="text-sm italic">&ldquo;{p.childReflectionOnAlbum}&rdquo;</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Storage</p>
                      <p className="text-sm">{p.storageLocation}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Sharing</p>
                      <p className="text-sm">{p.sharedWithFamily ? p.shareableSummary : "Personal — not externally shared"}</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                      <Lock className="h-3 w-3 inline mr-1" />Protection Measures
                    </p>
                    <ul className="space-y-1">
                      {p.protectionMeasures.map((m, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <Lock className="h-3 w-3 text-amber-500 mt-1 shrink-0" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span>Reviewed: {p.reviewedDate} with {getStaffName(p.reviewedWith)}</span>
                    {p.childCanAccess && <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">Child has access</span>}
                    {p.childCanEdit && <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">Child edits</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Photo albums support Quality Standard 1 (child-centred care),
          Quality Standard 9 (relationships), UNCRC Article 8 (right to identity), and Life Story work
          principles. Triple consent applies to every photo. Linked to Life Story Work, Personal Belongings,
          Media Publicity Consent, and Cards & Letters Tracker.
        </p>
      </div>
    </PageShell>
  );
}
