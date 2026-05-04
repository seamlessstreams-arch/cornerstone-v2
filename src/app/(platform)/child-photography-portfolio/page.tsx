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
  Star,
  BookOpen,
  Frame,
  Image as ImageIcon,
  CheckCircle,
  Shield,
  Users,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PhotoEntry {
  id: string;
  youngPerson: string;
  date: string;
  occasion: string;
  photoCategory:
    | "Birthday"
    | "Achievement"
    | "Activity"
    | "Family contact"
    | "Holiday/Trip"
    | "Everyday moment"
    | "Cultural event"
    | "School milestone";
  description: string;
  photographer: string;
  childPosed: boolean;
  childChooseToTake: boolean;
  groupPhoto: boolean;
  othersInPhoto: string[];
  consentGiven: boolean;
  consentMethod: "Verbal" | "Written" | "Visual cards" | "Through advocate";
  photoLocation: string;
  copies: string[];
  childCanRequestRemoval: boolean;
  partOfLifeStoryBook: boolean;
  partOfBedroomDisplay: boolean;
  partOfGalleryWall: boolean;
  childComment: string;
  specialSignificance: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: PhotoEntry[] = [
  // ALEX
  {
    id: "ph-001",
    youngPerson: "yp_alex",
    date: d(-14),
    occasion: "Boxing club regional medal ceremony",
    photoCategory: "Achievement",
    description:
      "Alex receiving regional silver medal at the boxing club. Coach Pete pinning medal. Alex grinning, gloves still on.",
    photographer: "staff_anna",
    childPosed: true,
    childChooseToTake: true,
    groupPhoto: true,
    othersInPhoto: ["Coach Pete (consented)", "Boxing club teammate (anonymised — face blurred)"],
    consentGiven: true,
    consentMethod: "Verbal",
    photoLocation: "Regional boxing championship venue",
    copies: ["Life Story Book", "Bedroom display (framed)", "Mum's letter pack (with consent)", "Secure care record"],
    childCanRequestRemoval: true,
    partOfLifeStoryBook: true,
    partOfBedroomDisplay: true,
    partOfGalleryWall: false,
    childComment: "Best day. Want this one big on my wall.",
    specialSignificance:
      "First regional-level achievement. Alex chose to send copy to Mum. Identity-affirming — links to long-term sense of self as a boxer.",
  },
  {
    id: "ph-002",
    youngPerson: "yp_alex",
    date: d(-45),
    occasion: "13th birthday — cake at Oak House",
    photoCategory: "Birthday",
    description:
      "Alex blowing out 13 candles. Sister Mia visiting, hands clasped beside him. Cake decorated in Arsenal colours (Alex's choice).",
    photographer: "staff_darren",
    childPosed: false,
    childChooseToTake: true,
    groupPhoto: true,
    othersInPhoto: ["Sister Mia (parental consent obtained)", "Staff_Darren (consented)"],
    consentGiven: true,
    consentMethod: "Verbal",
    photoLocation: "Oak House dining room",
    copies: ["Life Story Book", "Bedroom display", "Sister Mia's photo album (parent-approved)"],
    childCanRequestRemoval: true,
    partOfLifeStoryBook: true,
    partOfBedroomDisplay: true,
    partOfGalleryWall: false,
    childComment: "Mia was buzzing. Good day.",
    specialSignificance:
      "First birthday at Oak House where Mia could attend. Marker of stabilising sibling contact.",
  },
  {
    id: "ph-003",
    youngPerson: "yp_alex",
    date: d(-90),
    occasion: "Sunday roast — everyday moment",
    photoCategory: "Everyday moment",
    description:
      "Alex laughing at the dinner table — Jordan had cracked a joke. Casey in background. Roast dinner spread visible.",
    photographer: "Self",
    childPosed: false,
    childChooseToTake: true,
    groupPhoto: true,
    othersInPhoto: ["yp_jordan (consented)", "yp_casey (consented — appears in background only)"],
    consentGiven: true,
    consentMethod: "Verbal",
    photoLocation: "Oak House kitchen/diner",
    copies: ["Alex's phone", "Life Story Book"],
    childCanRequestRemoval: true,
    partOfLifeStoryBook: true,
    partOfBedroomDisplay: false,
    partOfGalleryWall: true,
    childComment: "Just normal Sunday. Like family.",
    specialSignificance:
      "Self-taken — shows Alex's growing comfort and sense of belonging at Oak House. The 'normal' is the point.",
  },
  {
    id: "ph-004",
    youngPerson: "yp_alex",
    date: d(-200),
    occasion: "Visit with maternal grandmother (Nan)",
    photoCategory: "Family contact",
    description:
      "Alex with Nan in her front garden. Nan holding Alex's hand. Roses in bloom. Both smiling.",
    photographer: "External",
    childPosed: true,
    childChooseToTake: true,
    groupPhoto: true,
    othersInPhoto: ["Maternal grandmother (consented in writing)"],
    consentGiven: true,
    consentMethod: "Written",
    photoLocation: "Nan's house, supervised contact visit",
    copies: ["Life Story Book", "Bedroom display (framed beside bed)", "Nan's mantelpiece"],
    childCanRequestRemoval: true,
    partOfLifeStoryBook: true,
    partOfBedroomDisplay: true,
    partOfGalleryWall: false,
    childComment: "Nan smelled like cake.",
    specialSignificance:
      "Anchor point for family identity. Alex requested this as the photo by his bed. Pre-care continuity made tangible.",
  },

  // JORDAN
  {
    id: "ph-005",
    youngPerson: "yp_jordan",
    date: d(-7),
    occasion: "Football team captain — first match wearing armband",
    photoCategory: "Achievement",
    description:
      "Jordan in full kit, captain's armband on left bicep, holding match ball. Tunnel entrance behind.",
    photographer: "staff_chervelle",
    childPosed: true,
    childChooseToTake: true,
    groupPhoto: false,
    othersInPhoto: [],
    consentGiven: true,
    consentMethod: "Verbal",
    photoLocation: "Local FC home ground",
    copies: ["Life Story Book", "Bedroom display (framed)", "Mum's letter pack"],
    childCanRequestRemoval: true,
    partOfLifeStoryBook: true,
    partOfBedroomDisplay: true,
    partOfGalleryWall: true,
    childComment: "Captain. That's me.",
    specialSignificance:
      "Identity-defining moment. Jordan chose this as the photo to send to Mum in prison. Leadership marker.",
  },
  {
    id: "ph-006",
    youngPerson: "yp_jordan",
    date: d(-30),
    occasion: "Cultural heritage event — Caribbean food festival",
    photoCategory: "Cultural event",
    description:
      "Jordan with cousin Devon at Caribbean festival, holding plate of jerk chicken and rice. Jamaica flag bunting overhead.",
    photographer: "staff_chervelle",
    childPosed: true,
    childChooseToTake: true,
    groupPhoto: true,
    othersInPhoto: ["Cousin Devon (parental consent obtained)"],
    consentGiven: true,
    consentMethod: "Verbal",
    photoLocation: "City Caribbean Festival",
    copies: ["Life Story Book", "Bedroom display", "Cousin Devon's family"],
    childCanRequestRemoval: true,
    partOfLifeStoryBook: true,
    partOfBedroomDisplay: true,
    partOfGalleryWall: false,
    childComment: "Mum would've loved this. Sent her the picture.",
    specialSignificance:
      "Cultural identity affirmation. Connection to Mum's Jamaican heritage. Cousin connection re-built.",
  },
  {
    id: "ph-007",
    youngPerson: "yp_jordan",
    date: d(-75),
    occasion: "Sister Tia's 9th birthday — supervised contact",
    photoCategory: "Family contact",
    description:
      "Jordan helping Tia blow out candles. Tia laughing, frosting on her cheek. Foster mum (Tia's carer) in background, consented.",
    photographer: "External",
    childPosed: false,
    childChooseToTake: false,
    groupPhoto: true,
    othersInPhoto: ["Sister Tia (foster carer consent)", "Tia's foster mum (consented)"],
    consentGiven: true,
    consentMethod: "Written",
    photoLocation: "Family contact centre",
    copies: ["Life Story Book", "Bedroom display (framed)", "Tia's photo album"],
    childCanRequestRemoval: true,
    partOfLifeStoryBook: true,
    partOfBedroomDisplay: true,
    partOfGalleryWall: false,
    childComment: "Big brother stuff.",
    specialSignificance:
      "Sibling bond reinforced. Jordan chose to keep this on his bedside table. Continuity of his role as big brother.",
  },
  {
    id: "ph-008",
    youngPerson: "yp_jordan",
    date: d(-150),
    occasion: "School Year 9 Citizenship Award assembly",
    photoCategory: "School milestone",
    description:
      "Jordan on stage receiving certificate from Head Teacher. Smile, slightly shy. Anna in audience clapping (visible).",
    photographer: "staff_anna",
    childPosed: false,
    childChooseToTake: true,
    groupPhoto: true,
    othersInPhoto: ["Head Teacher (consented for school context)", "staff_anna (consented)"],
    consentGiven: true,
    consentMethod: "Verbal",
    photoLocation: "School main hall",
    copies: ["Life Story Book", "Bedroom display", "School yearbook (school's own copy)"],
    childCanRequestRemoval: true,
    partOfLifeStoryBook: true,
    partOfBedroomDisplay: false,
    partOfGalleryWall: true,
    childComment: "Didn't think I'd get one of these.",
    specialSignificance:
      "Recognition of who Jordan is becoming — beyond the boy in the case file. School visibility shift.",
  },

  // CASEY
  {
    id: "ph-009",
    youngPerson: "yp_casey",
    date: d(-21),
    occasion: "Art exhibition — 'Finding Home' piece displayed",
    photoCategory: "Achievement",
    description:
      "Casey beside their watercolour piece 'Finding Home' at the local young artists' exhibition. Visual cards used to confirm consent. Casey not posed — chose distance from the work.",
    photographer: "staff_anna",
    childPosed: false,
    childChooseToTake: true,
    groupPhoto: false,
    othersInPhoto: [],
    consentGiven: true,
    consentMethod: "Visual cards",
    photoLocation: "City library exhibition space",
    copies: ["Life Story Book", "Bedroom display (framed in pride of place)", "Art therapist's record (with consent)"],
    childCanRequestRemoval: true,
    partOfLifeStoryBook: true,
    partOfBedroomDisplay: true,
    partOfGalleryWall: true,
    childComment: "It's mine. People saw it.",
    specialSignificance:
      "Major identity moment. First public display of Casey's art. Casey controlled the photo — consent re-checked using visual cards before, during, and after.",
  },
  {
    id: "ph-010",
    youngPerson: "yp_casey",
    date: d(-60),
    occasion: "Quiet moment — painting in bedroom corner",
    photoCategory: "Everyday moment",
    description:
      "Casey painting at desk, Otter (soft toy) beside them, sage green wall in background. Self-taken with phone timer.",
    photographer: "Self",
    childPosed: true,
    childChooseToTake: true,
    groupPhoto: false,
    othersInPhoto: [],
    consentGiven: true,
    consentMethod: "Visual cards",
    photoLocation: "Casey's bedroom",
    copies: ["Casey's tablet", "Life Story Book (Casey added)"],
    childCanRequestRemoval: true,
    partOfLifeStoryBook: true,
    partOfBedroomDisplay: false,
    partOfGalleryWall: false,
    childComment: "Just me. With Otter.",
    specialSignificance:
      "Self-authored. Casey choosing to be seen on their own terms. Sensory-safe space documented by Casey themselves.",
  },
  {
    id: "ph-011",
    youngPerson: "yp_casey",
    date: d(-110),
    occasion: "Seaside day trip — first beach walk",
    photoCategory: "Holiday/Trip",
    description:
      "Casey at the shoreline, ear defenders on, holding a shell up to camera. Sea misty behind. Footprints in sand.",
    photographer: "staff_anna",
    childPosed: true,
    childChooseToTake: true,
    groupPhoto: false,
    othersInPhoto: [],
    consentGiven: true,
    consentMethod: "Visual cards",
    photoLocation: "North Norfolk coast — Holkham beach",
    copies: ["Life Story Book", "Bedroom display", "Anna's phone (deleted after transfer)"],
    childCanRequestRemoval: true,
    partOfLifeStoryBook: true,
    partOfBedroomDisplay: true,
    partOfGalleryWall: true,
    childComment: "The shell sounded like the sea.",
    specialSignificance:
      "First beach trip. Sensory milestone — Casey managed a new environment with regulation strategies. Anna deleted phone copy after secure transfer (data minimisation).",
  },
  {
    id: "ph-012",
    youngPerson: "yp_casey",
    date: d(-180),
    occasion: "Casey with Otter — bedroom display photo",
    photoCategory: "Everyday moment",
    description:
      "Close-up of Otter (soft toy since age 5) on Casey's pillow. Casey not in photo (chose not to be). Casey directed the framing.",
    photographer: "Self",
    childPosed: false,
    childChooseToTake: true,
    groupPhoto: false,
    othersInPhoto: [],
    consentGiven: true,
    consentMethod: "Visual cards",
    photoLocation: "Casey's bedroom",
    copies: ["Casey's tablet", "Life Story Book"],
    childCanRequestRemoval: true,
    partOfLifeStoryBook: true,
    partOfBedroomDisplay: false,
    partOfGalleryWall: false,
    childComment: "Otter is the important one.",
    specialSignificance:
      "Casey's choice to photograph what matters to them — not themselves. Demonstrates child-led documentation and respects Casey's preference to be unseen.",
  },
];

const exportCols: ExportColumn<PhotoEntry>[] = [
  { header: "Young Person", accessor: (r: PhotoEntry) => getYPName(r.youngPerson) },
  { header: "Date", accessor: (r: PhotoEntry) => r.date },
  { header: "Occasion", accessor: (r: PhotoEntry) => r.occasion },
  { header: "Category", accessor: (r: PhotoEntry) => r.photoCategory },
  {
    header: "Photographer",
    accessor: (r: PhotoEntry) =>
      r.photographer === "Self" || r.photographer === "External"
        ? r.photographer
        : getStaffName(r.photographer),
  },
  { header: "Consent", accessor: (r: PhotoEntry) => (r.consentGiven ? `Yes (${r.consentMethod})` : "No") },
  { header: "Group Photo", accessor: (r: PhotoEntry) => (r.groupPhoto ? "Yes" : "No") },
  { header: "Life Story Book", accessor: (r: PhotoEntry) => (r.partOfLifeStoryBook ? "Yes" : "No") },
  { header: "Bedroom Display", accessor: (r: PhotoEntry) => (r.partOfBedroomDisplay ? "Yes" : "No") },
  { header: "Gallery Wall", accessor: (r: PhotoEntry) => (r.partOfGalleryWall ? "Yes" : "No") },
  { header: "Description", accessor: (r: PhotoEntry) => r.description },
];

const categoryColours: Record<PhotoEntry["photoCategory"], string> = {
  Birthday: "bg-pink-100 text-pink-800",
  Achievement: "bg-amber-100 text-amber-800",
  Activity: "bg-blue-100 text-blue-800",
  "Family contact": "bg-rose-100 text-rose-800",
  "Holiday/Trip": "bg-cyan-100 text-cyan-800",
  "Everyday moment": "bg-emerald-100 text-emerald-800",
  "Cultural event": "bg-purple-100 text-purple-800",
  "School milestone": "bg-indigo-100 text-indigo-800",
};

export default function ChildPhotographyPortfolioPage() {
  const [filterYP, setFilterYP] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterYP !== "all") items = items.filter((p) => p.youngPerson === filterYP);
    if (filterCategory !== "all") items = items.filter((p) => p.photoCategory === filterCategory);
    items.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.date.localeCompare(a.date);
        case "oldest":
          return a.date.localeCompare(b.date);
        case "name":
          return a.youngPerson.localeCompare(b.youngPerson);
        case "category":
          return a.photoCategory.localeCompare(b.photoCategory);
        default:
          return 0;
      }
    });
    return items;
  }, [filterYP, filterCategory, sortBy]);

  const total = data.length;
  const thisYear = data.filter((p) => p.date.startsWith(new Date().getFullYear().toString())).length;
  const lifeStoryCount = data.filter((p) => p.partOfLifeStoryBook).length;
  const achievementCount = data.filter((p) => p.photoCategory === "Achievement").length;
  const allConsented = data.every((p) => p.consentGiven);

  return (
    <PageShell
      title="Child Photography Portfolio"
      subtitle="Photo memories per child — milestones, achievements, everyday joy, documented with consent"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="child-photography-portfolio" />
          <PrintButton title="Child Photography Portfolio" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Photos Catalogued</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{thisYear}</p>
          <p className="text-xs text-muted-foreground">This Year</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{lifeStoryCount}</p>
          <p className="text-xs text-muted-foreground">Life Story Photos</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{achievementCount}</p>
          <p className="text-xs text-muted-foreground">Achievement Photos</p>
        </div>
      </div>

      <div
        className={cn(
          "rounded-lg p-3 mb-6 flex items-start gap-2 border",
          allConsented ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200",
        )}
      >
        <Shield
          className={cn(
            "h-4 w-4 mt-0.5 shrink-0",
            allConsented ? "text-emerald-600" : "text-amber-600",
          )}
        />
        <p
          className={cn(
            "text-sm",
            allConsented ? "text-emerald-800" : "text-amber-800",
          )}
        >
          <strong>Consent first, always.</strong> Every photo is taken with the child&apos;s
          informed agreement using a method they understand (verbal, written, visual cards, or via
          advocate). Children can request removal at any time. Group photos are checked with all
          others present. Faces of unconsenting parties are anonymised. This is a metadata
          register — image files are stored separately within secure care records.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterYP} onValueChange={setFilterYP}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Children" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Children</SelectItem>
            <SelectItem value="yp_alex">{getYPName("yp_alex")}</SelectItem>
            <SelectItem value="yp_jordan">{getYPName("yp_jordan")}</SelectItem>
            <SelectItem value="yp_casey">{getYPName("yp_casey")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Birthday">Birthday</SelectItem>
            <SelectItem value="Achievement">Achievement</SelectItem>
            <SelectItem value="Activity">Activity</SelectItem>
            <SelectItem value="Family contact">Family contact</SelectItem>
            <SelectItem value="Holiday/Trip">Holiday/Trip</SelectItem>
            <SelectItem value="Everyday moment">Everyday moment</SelectItem>
            <SelectItem value="Cultural event">Cultural event</SelectItem>
            <SelectItem value="School milestone">School milestone</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">By Child</SelectItem>
              <SelectItem value="category">By Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((p) => {
          const isExpanded = expandedId === p.id;
          const photographerName =
            p.photographer === "Self" || p.photographer === "External"
              ? p.photographer
              : getStaffName(p.photographer);

          return (
            <div key={p.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Camera className="h-5 w-5 text-purple-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {getYPName(p.youngPerson)} &middot; {p.occasion}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {p.date} &middot; Photographer: {photographerName}
                      {p.groupPhoto && p.othersInPhoto.length > 0
                        ? ` · Group of ${p.othersInPhoto.length + 1}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium hidden sm:inline-block",
                      categoryColours[p.photoCategory],
                    )}
                  >
                    {p.photoCategory}
                  </span>
                  {p.consentGiven && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {p.partOfLifeStoryBook && <BookOpen className="h-4 w-4 text-purple-500" />}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      <ImageIcon className="h-3 w-3 inline mr-1" />
                      Description
                    </p>
                    <p className="text-sm">{p.description}</p>
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      Note: this is a metadata record only — image not stored in this register.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Photographer &amp; Framing
                      </p>
                      <ul className="text-sm space-y-0.5">
                        <li>
                          <span className="text-muted-foreground">Taken by:</span>{" "}
                          {photographerName}
                        </li>
                        <li>
                          <span className="text-muted-foreground">Child posed:</span>{" "}
                          {p.childPosed ? "Yes" : "No (candid)"}
                        </li>
                        <li>
                          <span className="text-muted-foreground">Child chose to take it:</span>{" "}
                          {p.childChooseToTake ? "Yes" : "No"}
                        </li>
                        <li>
                          <span className="text-muted-foreground">Location:</span> {p.photoLocation}
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        <Shield className="h-3 w-3 inline mr-1" />
                        Consent
                      </p>
                      <ul className="text-sm space-y-0.5">
                        <li>
                          <span className="text-muted-foreground">Given:</span>{" "}
                          {p.consentGiven ? "Yes" : "No"}
                        </li>
                        <li>
                          <span className="text-muted-foreground">Method:</span> {p.consentMethod}
                        </li>
                        <li className="flex items-start gap-1">
                          <Trash2 className="h-3 w-3 text-rose-500 mt-1 shrink-0" />
                          <span>
                            {p.childCanRequestRemoval
                              ? "Child can request removal at any time"
                              : "Removal restricted (review required)"}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {p.groupPhoto && p.othersInPhoto.length > 0 && (
                    <div className="bg-white rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        <Users className="h-3 w-3 inline mr-1" />
                        Others in Photo (anonymised)
                      </p>
                      <ul className="space-y-0.5">
                        {p.othersInPhoto.map((o, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-purple-600 mt-0.5">•</span>
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      <Frame className="h-3 w-3 inline mr-1" />
                      Where the Photo Lives
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {p.partOfLifeStoryBook && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium">
                          <BookOpen className="h-3 w-3 inline mr-1" />
                          Life Story Book
                        </span>
                      )}
                      {p.partOfBedroomDisplay && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 font-medium">
                          Bedroom Display
                        </span>
                      )}
                      {p.partOfGalleryWall && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                          Communal Gallery Wall
                        </span>
                      )}
                    </div>
                    <ul className="space-y-0.5">
                      {p.copies.map((c, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {p.childComment && (
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">
                        Child&apos;s Words
                      </p>
                      <p className="text-sm italic">&ldquo;{p.childComment}&rdquo;</p>
                    </div>
                  )}

                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                      <Star className="h-3 w-3 inline mr-1" />
                      Special Significance
                    </p>
                    <p className="text-sm">{p.specialSignificance}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span>Date: {p.date}</span>
                    <span>Category: {p.photoCategory}</span>
                    <span>
                      <Heart className="h-3 w-3 inline mr-1 text-pink-500" />
                      Consent: {p.consentMethod}
                    </span>
                    {p.childChooseToTake && (
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
                        Child-led
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Photographic memory-keeping supports Quality
          Standard 1 (child-centred care and identity work), Quality Standard 6 (positive
          relationships and family connection), Children&apos;s Homes Regulations 2015 Schedule 1
          (records of significant events), UNCRC Article 8 (right to identity) and Article 16
          (right to privacy). Each photo is taken with informed consent in a method the child
          understands; children retain the right to request removal at any time. Image files
          are held in secure care records — this register stores metadata only. Group photos
          require consent from all identifiable parties; otherwise, faces are anonymised.
        </p>
      </div>
    </PageShell>
  );
}
