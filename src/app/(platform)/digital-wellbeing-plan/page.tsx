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
  Smartphone,
  Shield,
  AlertTriangle,
  CheckCircle,
  Heart,
  Wifi,
  Lock,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DigitalPlan {
  id: string;
  youngPerson: string;
  age: number;
  devicesUsed: { device: string; ownership: "Personal" | "Shared" | "Loaned"; primaryUse: string }[];
  agreedScreenTimeLimits: { period: string; maxHours: number; rationale: string }[];
  bedtimeRoutineWithDevices: string;
  appsUsed: { app: string; type: "Social" | "Gaming" | "Educational" | "Creative" | "Communication" | "Streaming"; ageAppropriate: boolean; agreedUse: string; oversightLevel: "None" | "Light" | "Active monitoring" }[];
  socialMediaProfiles: { platform: string; username: string; ageVerified: boolean; privacySettings: string; whoCanSeeContent: string; staffApproved: boolean }[];
  knownFriendsOnline: string;
  unknownContactRisks: string[];
  childOnlineSafetyKnowledge: { topic: string; level: "Strong" | "Developing" | "Emerging" | "Needs work" }[];
  digitalLiteracySkills: string[];
  pornographyAndExposureProtections: string[];
  cyberbullyingResponse: string[];
  exploitationRiskFactors: string[];
  exploitationProtections: string[];
  parentalControlsLevel: "None (age-appropriate trust)" | "Light" | "Standard" | "High";
  filteringInPlace: string[];
  childCanRequestPrivacy: string;
  staffOversightApproach: string;
  reviewedDate: string;
  reviewedWith: string;
  childAgreed: boolean;
  nextReviewDate: string;
  notes: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: DigitalPlan[] = [
  {
    id: "dp-001",
    youngPerson: "yp_alex",
    age: 13,
    devicesUsed: [
      { device: "Personal phone (iPhone)", ownership: "Personal", primaryUse: "Social, gaming, music" },
      { device: "Gaming console (Xbox)", ownership: "Personal", primaryUse: "Gaming with online friends" },
      { device: "Communal TV (with streaming)", ownership: "Shared", primaryUse: "Films, gaming alongside Xbox" },
      { device: "Bluetooth speaker", ownership: "Personal", primaryUse: "Music in bedroom" },
    ],
    agreedScreenTimeLimits: [
      { period: "Weekday evening", maxHours: 2.5, rationale: "Balance with school, social, sleep — Alex agreed" },
      { period: "Weekend day", maxHours: 5, rationale: "More flexibility but breaks for activity" },
      { period: "Bedtime", maxHours: 0, rationale: "Phone off at 21:00 — agreed" },
    ],
    bedtimeRoutineWithDevices: "Phone handed in at 21:00 (or to docking station outside bedroom). Returned at 07:05. No devices in bed except music speaker (allowed for sleep).",
    appsUsed: [
      { app: "Instagram", type: "Social", ageAppropriate: true, agreedUse: "Personal account, mostly views; occasional posts of boxing", oversightLevel: "Light" },
      { app: "WhatsApp", type: "Communication", ageAppropriate: true, agreedUse: "Friends and family — Mum and Mia included", oversightLevel: "Light" },
      { app: "Snapchat", type: "Social", ageAppropriate: true, agreedUse: "Friend group only", oversightLevel: "Light" },
      { app: "FIFA / Call of Duty", type: "Gaming", ageAppropriate: true, agreedUse: "Time-limited; voice chat with named friends only", oversightLevel: "Active monitoring" },
      { app: "Spotify", type: "Streaming", ageAppropriate: true, agreedUse: "Music — own playlist", oversightLevel: "None" },
      { app: "YouTube", type: "Streaming", ageAppropriate: true, agreedUse: "Boxing tutorials, gaming content", oversightLevel: "Light" },
    ],
    socialMediaProfiles: [
      { platform: "Instagram", username: "[private — known to Anna]", ageVerified: true, privacySettings: "Private account", whoCanSeeContent: "Friends only — list reviewed monthly with Alex", staffApproved: true },
      { platform: "Snapchat", username: "[private]", ageVerified: true, privacySettings: "Friends only", whoCanSeeContent: "Known peers only", staffApproved: true },
    ],
    knownFriendsOnline: "Online friends are mostly known offline (school, boxing club). Three online gaming friends are pseudonyms but verified through ongoing observation as similar age.",
    unknownContactRisks: [
      "Gaming voice chat with strangers — agreed to mute strangers",
      "Snapchat friend requests from unknown — Alex blocks/asks Anna",
    ],
    childOnlineSafetyKnowledge: [
      { topic: "Stranger danger online", level: "Strong" },
      { topic: "Privacy settings", level: "Developing" },
      { topic: "Recognising grooming", level: "Developing" },
      { topic: "Reporting concerning content", level: "Developing" },
      { topic: "Digital footprint awareness", level: "Emerging" },
    ],
    digitalLiteracySkills: [
      "Can spot phishing emails (mostly)",
      "Knows how to block and report",
      "Manages own privacy settings",
      "Critical thinking on news and content emerging",
    ],
    pornographyAndExposureProtections: [
      "Age-appropriate education delivered (with Anna and external resource)",
      "Filters in place on home wifi",
      "Open conversation if exposed accidentally",
      "Alex knows he won't be in trouble for accidental exposure",
    ],
    cyberbullyingResponse: [
      "Alex knows to screenshot and tell",
      "Knows to block",
      "Has used reporting features once successfully",
    ],
    exploitationRiskFactors: [
      "Past trauma can make grooming harder to spot",
      "Some peer pressure for risky online interaction",
      "ADHD impulsivity can affect online decisions",
    ],
    exploitationProtections: [
      "Trusted adult relationships at home",
      "Open communication culture",
      "Active monitoring of new contacts",
      "Education about grooming tactics",
      "Phone tracking enabled (with Alex's knowledge)",
    ],
    parentalControlsLevel: "Light",
    filteringInPlace: [
      "Adult content blocked at router level",
      "Age-appropriate gaming restrictions on Xbox",
      "Screen Time limits configured on iPhone",
    ],
    childCanRequestPrivacy: "Yes — private chats with friends respected. Therapy conversations private. Family contact private.",
    staffOversightApproach: "Trust-based with active monitoring. Random checks not done. Periodic conversations about online life. Anna sees online friend list monthly with Alex's permission.",
    reviewedDate: d(-21),
    reviewedWith: "staff_anna",
    childAgreed: true,
    nextReviewDate: d(70),
    notes: "Alex is largely managing online life well. ADHD impulsivity occasionally surfaces in late-night gaming requests. Continues to develop critical thinking about online interactions. No exploitation indicators.",
  },
  {
    id: "dp-002",
    youngPerson: "yp_jordan",
    age: 13,
    devicesUsed: [
      { device: "Personal phone (Samsung)", ownership: "Personal", primaryUse: "Social, music, communication with Mum" },
      { device: "Bluetooth speaker", ownership: "Personal", primaryUse: "Music in bedroom" },
      { device: "Communal TV", ownership: "Shared", primaryUse: "Football, films" },
    ],
    agreedScreenTimeLimits: [
      { period: "Weekday evening", maxHours: 2.5, rationale: "Balance with football, school, sleep" },
      { period: "Weekend day", maxHours: 4, rationale: "Flexibility on non-match days" },
      { period: "Match days", maxHours: 1.5, rationale: "Focus on football" },
      { period: "Bedtime", maxHours: 0.5, rationale: "Music allowed until asleep — agreed" },
    ],
    bedtimeRoutineWithDevices: "Phone available in room (Jordan has good track record). Music allowed until asleep. Phone on charger by 22:30. No social use after 22:00.",
    appsUsed: [
      { app: "Instagram", type: "Social", ageAppropriate: true, agreedUse: "Football team account, friends, cultural content", oversightLevel: "Light" },
      { app: "WhatsApp", type: "Communication", ageAppropriate: true, agreedUse: "Family (Mum's prison communication facilitated), friends, team", oversightLevel: "Active monitoring" },
      { app: "TikTok", type: "Social", ageAppropriate: true, agreedUse: "Football content, cultural creators, music", oversightLevel: "Light" },
      { app: "Spotify", type: "Streaming", ageAppropriate: true, agreedUse: "Music — Jordan's own playlists", oversightLevel: "None" },
      { app: "Football Manager (mobile)", type: "Gaming", ageAppropriate: true, agreedUse: "Solo gaming", oversightLevel: "None" },
    ],
    socialMediaProfiles: [
      { platform: "Instagram", username: "[private]", ageVerified: true, privacySettings: "Private", whoCanSeeContent: "Approved friends only", staffApproved: true },
      { platform: "TikTok", username: "[private]", ageVerified: true, privacySettings: "Private", whoCanSeeContent: "Mutual friends only", staffApproved: true },
    ],
    knownFriendsOnline: "Most online connections are real-world: football team, school friends, cousin Devon, cultural community contacts.",
    unknownContactRisks: [
      "Some pre-Oak House peer associates from previous neighbourhood — Jordan knows these are restricted (police community team aware)",
      "Older peer follow-requests on Instagram — Jordan reviews with Anna or Chervelle",
    ],
    childOnlineSafetyKnowledge: [
      { topic: "Stranger danger online", level: "Strong" },
      { topic: "Privacy settings", level: "Strong" },
      { topic: "Recognising grooming", level: "Developing" },
      { topic: "Recognising county lines / exploitation tactics online", level: "Developing" },
      { topic: "Digital footprint awareness", level: "Strong" },
    ],
    digitalLiteracySkills: [
      "Strong privacy awareness",
      "Can spot suspicious messages",
      "Engages critical thinking on social media content",
      "Strong digital footprint awareness — careful about what he posts",
    ],
    pornographyAndExposureProtections: [
      "Age-appropriate education with cultural sensitivity",
      "Filters at router level",
      "Open culture — Jordan can talk about online experiences without judgement",
    ],
    cyberbullyingResponse: [
      "Jordan reports any incidents to Chervelle promptly",
      "Has experience using reporting tools",
      "Strong peer support from football team",
    ],
    exploitationRiskFactors: [
      "Previous community context with exploitation concerns",
      "Black male teenager — disproportionately profiled online",
      "Potential online targeting around mother's release",
    ],
    exploitationProtections: [
      "Active multi-agency awareness (police community team)",
      "Strong cultural mentor connections (offline)",
      "Trusted adult communication",
      "Active monitoring of WhatsApp groups (with Jordan's awareness)",
      "Phone tracking enabled with Jordan's knowledge",
    ],
    parentalControlsLevel: "Standard",
    filteringInPlace: [
      "Adult content filters",
      "WhatsApp known group monitoring",
      "Specific contact restrictions (court/police informed list)",
    ],
    childCanRequestPrivacy: "Yes — relationship privacy respected. Cultural community conversations private. Mother conversations confidential within safeguarding limits.",
    staffOversightApproach: "Active monitoring around known risk areas with Jordan's full knowledge. Trust-based for general use. Direct conversations rather than covert surveillance.",
    reviewedDate: d(-14),
    reviewedWith: "staff_chervelle",
    childAgreed: true,
    nextReviewDate: d(76),
    notes: "Jordan manages digital life maturely. Active monitoring is contextual safeguarding response, not distrust. Mother's release will require digital wellbeing review.",
  },
  {
    id: "dp-003",
    youngPerson: "yp_casey",
    age: 12,
    devicesUsed: [
      { device: "Personal tablet (iPad)", ownership: "Personal", primaryUse: "Art, drawing, watching nature documentaries" },
      { device: "Communal TV", ownership: "Shared", primaryUse: "Casey's specific shows (familiar repeat content)" },
      { device: "White noise machine", ownership: "Personal", primaryUse: "Sleep regulation" },
      { device: "Smart bulb (in bedroom)", ownership: "Personal", primaryUse: "Wake routine and lighting control" },
    ],
    agreedScreenTimeLimits: [
      { period: "Weekday", maxHours: 2, rationale: "Sensory load consideration; replaces with art and nature" },
      { period: "Weekend", maxHours: 3, rationale: "More flexibility" },
      { period: "Bedtime", maxHours: 0, rationale: "Devices off at 19:30; only white noise overnight" },
    ],
    bedtimeRoutineWithDevices: "All devices off by 19:30 (matches sensory routine). White noise machine continues overnight (specific track only). Smart bulb auto-managed.",
    appsUsed: [
      { app: "Procreate", type: "Creative", ageAppropriate: true, agreedUse: "Casey's primary digital outlet — drawing", oversightLevel: "None" },
      { app: "BBC iPlayer (nature)", type: "Streaming", ageAppropriate: true, agreedUse: "Specific nature documentaries — David Attenborough preferred", oversightLevel: "None" },
      { app: "YouTube Kids", type: "Streaming", ageAppropriate: true, agreedUse: "Otter videos, animal content", oversightLevel: "Light" },
      { app: "WhatsApp (limited)", type: "Communication", ageAppropriate: true, agreedUse: "Friend Ellie only currently; future expansion as Casey wishes", oversightLevel: "Active monitoring" },
    ],
    socialMediaProfiles: [
      { platform: "None active", username: "N/A", ageVerified: true, privacySettings: "Casey not on social media", whoCanSeeContent: "N/A", staffApproved: true },
    ],
    knownFriendsOnline: "Just Ellie via WhatsApp. Casey has expressed no interest in broader social media.",
    unknownContactRisks: [
      "WhatsApp invitations from unknown numbers — Casey shows Anna",
    ],
    childOnlineSafetyKnowledge: [
      { topic: "Stranger danger online", level: "Strong" },
      { topic: "Privacy settings", level: "Developing" },
      { topic: "Recognising grooming", level: "Emerging" },
      { topic: "Reporting concerning content", level: "Developing" },
      { topic: "Digital footprint awareness (cautious by nature)", level: "Strong" },
    ],
    digitalLiteracySkills: [
      "Cautious approach is protective",
      "Will always show Anna unfamiliar messages",
      "Strong privacy instincts",
      "Less skill with rapid-evolution platforms (not Casey's space anyway)",
    ],
    pornographyAndExposureProtections: [
      "Age-appropriate education delivered visually with Anna",
      "Strong filters in place",
      "Casey unlikely to seek but protected against accidental exposure",
    ],
    cyberbullyingResponse: [
      "Casey will tell Anna immediately",
      "Currently no exposure given limited social use",
      "Tools demonstrated for future",
    ],
    exploitationRiskFactors: [
      "Vulnerability through ASD profile if introduced to social media without preparation",
      "Cautious online presence is currently protective",
    ],
    exploitationProtections: [
      "Limited social media exposure",
      "Trusted adult communication",
      "Visual education tools used",
      "Cautious approach respected, not pushed to expand",
      "Friend Ellie is genuine offline friend",
    ],
    parentalControlsLevel: "High",
    filteringInPlace: [
      "Strong content filters at router level",
      "App approval required for new installs",
      "WhatsApp known contacts only",
    ],
    childCanRequestPrivacy: "Yes — Casey's space respected. Drawing app private. Therapy-related digital content private.",
    staffOversightApproach: "High oversight given developmental stage and ASD profile. Casey is informed and agrees. Trust-based within agreed parameters. Education delivered visually and at Casey's pace.",
    reviewedDate: d(-7),
    reviewedWith: "staff_anna",
    childAgreed: true,
    nextReviewDate: d(83),
    notes: "Casey's digital approach is appropriately cautious. Tablet used primarily for art (real strength). Limited social media presence is by Casey's choice and is currently protective. Will expand as Casey requests, with careful preparation.",
  },
];

const exportCols: ExportColumn<DigitalPlan>[] = [
  { header: "Young Person", accessor: (r: DigitalPlan) => getYPName(r.youngPerson) },
  { header: "Age", accessor: (r: DigitalPlan) => String(r.age) },
  { header: "Devices", accessor: (r: DigitalPlan) => r.devicesUsed.length.toString() },
  { header: "Apps", accessor: (r: DigitalPlan) => r.appsUsed.length.toString() },
  { header: "Social Media Profiles", accessor: (r: DigitalPlan) => r.socialMediaProfiles.filter((p) => p.platform !== "None active").length.toString() },
  { header: "Parental Controls", accessor: (r: DigitalPlan) => r.parentalControlsLevel },
  { header: "Reviewed", accessor: (r: DigitalPlan) => r.reviewedDate },
  { header: "Child Agreed", accessor: (r: DigitalPlan) => r.childAgreed ? "Yes" : "No" },
];

export default function DigitalWellbeingPlanPage() {
  const [filterYP, setFilterYP] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterYP !== "all") items = items.filter((p) => p.youngPerson === filterYP);
    items.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.youngPerson.localeCompare(b.youngPerson);
        case "review":
          return a.nextReviewDate.localeCompare(b.nextReviewDate);
        default:
          return 0;
      }
    });
    return items;
  }, [filterYP, sortBy]);

  const total = data.length;
  const allChildAgreed = data.every((p) => p.childAgreed);
  const dueReview = data.filter((p) => p.nextReviewDate <= d(60)).length;
  const totalApps = data.reduce((sum, p) => sum + p.appsUsed.length, 0);

  return (
    <PageShell
      title="Digital Wellbeing Plan"
      subtitle="Per-child digital wellbeing — devices, apps, screen time, online safety, and trust-based oversight"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="digital-wellbeing-plans" />
          <PrintButton title="Digital Wellbeing Plans" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Active Plans</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{allChildAgreed ? "100%" : `${data.filter((p) => p.childAgreed).length}/${total}`}</p>
          <p className="text-xs text-muted-foreground">Child Agreed</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalApps}</p>
          <p className="text-xs text-muted-foreground">Apps Tracked</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className={cn("text-2xl font-bold", dueReview > 0 ? "text-amber-600" : "text-green-600")}>{dueReview}</p>
          <p className="text-xs text-muted-foreground">Review Due 60d</p>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mb-6 flex items-start gap-2">
        <Smartphone className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">
          The internet is part of every child&apos;s life. Our approach is education-led, trust-based, and
          age-appropriate — not blanket restriction. Children are partners in their own digital safety.
          Active monitoring happens transparently, not covertly.
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
        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">By Child</SelectItem>
              <SelectItem value="review">Earliest Review</SelectItem>
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
                  <Smartphone className="h-5 w-5 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{getYPName(p.youngPerson)} (age {p.age})</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {p.devicesUsed.length} devices &middot; {p.appsUsed.length} apps &middot; {p.parentalControlsLevel} controls &middot; Reviewed {p.reviewedDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {p.childAgreed && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  {/* devices */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Devices</p>
                    <div className="space-y-1">
                      {p.devicesUsed.map((d, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{d.device}</span>
                            <span className="text-xs text-muted-foreground">{d.ownership}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{d.primaryUse}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* screen time */}
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-2">Agreed Screen Time</p>
                    <div className="space-y-1">
                      {p.agreedScreenTimeLimits.map((s, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm">
                          <p className="font-medium">{s.period}: <span className="text-blue-700">{s.maxHours}h</span></p>
                          <p className="text-xs text-muted-foreground">{s.rationale}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* bedtime */}
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">Bedtime Device Routine</p>
                    <p className="text-sm">{p.bedtimeRoutineWithDevices}</p>
                  </div>

                  {/* apps */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Apps Used</p>
                    <div className="space-y-1">
                      {p.appsUsed.map((a, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{a.app}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">{a.type}</span>
                              <span className={cn("text-xs px-1.5 py-0.5 rounded-full",
                                a.oversightLevel === "Active monitoring" ? "bg-amber-100 text-amber-800" :
                                a.oversightLevel === "Light" ? "bg-blue-100 text-blue-800" :
                                "bg-green-100 text-green-800"
                              )}>
                                {a.oversightLevel}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{a.agreedUse}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* online safety knowledge */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      <Shield className="h-3 w-3 inline mr-1" />Online Safety Knowledge
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      {p.childOnlineSafetyKnowledge.map((k, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm flex items-center justify-between">
                          <span>{k.topic}</span>
                          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                            k.level === "Strong" ? "bg-green-100 text-green-800" :
                            k.level === "Developing" ? "bg-blue-100 text-blue-800" :
                            k.level === "Emerging" ? "bg-amber-100 text-amber-800" :
                            "bg-red-100 text-red-800"
                          )}>{k.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* protections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />Risk Factors
                      </p>
                      <ul className="space-y-1">
                        {p.exploitationRiskFactors.map((r, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">
                        <Shield className="h-3 w-3 inline mr-1" />Protections
                      </p>
                      <ul className="space-y-1">
                        {p.exploitationProtections.map((r, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <CheckCircle className="h-3 w-3 text-emerald-500 mt-1 shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* filters */}
                  <div className="bg-slate-50 rounded-lg p-3 border">
                    <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">
                      <Lock className="h-3 w-3 inline mr-1" />Filters &amp; Controls in Place
                    </p>
                    <ul className="space-y-1">
                      {p.filteringInPlace.map((f, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <Wifi className="h-3 w-3 text-slate-500 mt-1 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-pink-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-pink-800 uppercase tracking-wide mb-1">
                      <Heart className="h-3 w-3 inline mr-1" />Privacy &amp; Trust Approach
                    </p>
                    <p className="text-sm">{p.childCanRequestPrivacy}</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">
                      <Eye className="h-3 w-3 inline mr-1" />Staff Oversight Approach
                    </p>
                    <p className="text-sm">{p.staffOversightApproach}</p>
                  </div>

                  {p.notes && (
                    <div className="bg-slate-50 rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-sm">{p.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span>Reviewed: {p.reviewedDate} with {getStaffName(p.reviewedWith)}</span>
                    <span>Next review: {p.nextReviewDate}</span>
                    <span>Controls level: {p.parentalControlsLevel}</span>
                    {p.childAgreed && <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">Child Co-Authored</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Digital wellbeing plans support Quality Standard 5
          (protection of children), Quality Standard 7 (health and wellbeing), KCSIE 2024 online safety
          requirements, and the Online Safety Act 2023. Plans are co-produced with each child and updated
          as digital landscape evolves. Linked to Online Safety, Exploitation Screening, and Device Policy.
        </p>
      </div>
    </PageShell>
  );
}
