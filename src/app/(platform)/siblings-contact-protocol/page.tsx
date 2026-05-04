"use client";

import { useState, useMemo } from "react";
import { PageShell } from "@/components/ui/page-shell";
import { ExportButton, type ExportColumn } from "@/components/ui/export-button";
import { PrintButton } from "@/components/ui/print-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Filter, ArrowUpDown, ChevronDown, ChevronUp,
  Users, Heart, Gavel, CalendarClock, MapPin, Shield, Sparkles,
  Phone, Video, Mail, MessageSquare, Cake, Gift, AlertTriangle,
  CheckCircle2, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStaffName, getYPName } from "@/lib/seed-data";

/* ── types ─────────────────────────────────────────────────────────────────── */

interface RecentContact {
  date: string;
  type: string;
  observations: string;
  childMoodAfter: string;
}

interface SiblingProtocol {
  id: string;
  youngPerson: string;
  siblingName: string;
  siblingPlacement: string;
  siblingLocation: string;
  relationshipPreOakHouse: string;
  currentRelationshipQuality: string;
  contactFrequency: string;
  contactTypes: string[];
  agreedContactPlan: string;
  childPreferences: string;
  siblingPreferences: string;
  riskFactorsToContact: string[];
  protectiveFactorsToContact: string[];
  supervisionRequired: boolean;
  supervisionLevel: string;
  transportArrangements: string;
  contactCostsBudget: string;
  locationsForContact: string[];
  favouriteSiblingActivities: string[];
  birthdayCelebrationPlan: string;
  christmasArrangements: string;
  courtOrderedContact: boolean;
  courtOrderTerms: string;
  recentContacts: RecentContact[];
  ongoingSiblingThemes: string[];
  reviewDate: string;
  reviewedBy: string;
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const QUALITY_CLR: Record<string, string> = {
  "Strong": "bg-green-100 text-green-800",
  "Good": "bg-emerald-100 text-emerald-800",
  "Developing": "bg-blue-100 text-blue-800",
  "Fragile": "bg-amber-100 text-amber-800",
  "Strained": "bg-red-100 text-red-800",
};

const MOOD_CLR: Record<string, string> = {
  "Settled": "bg-emerald-100 text-emerald-800",
  "Happy": "bg-green-100 text-green-800",
  "Reflective": "bg-blue-100 text-blue-800",
  "Mixed": "bg-amber-100 text-amber-800",
  "Unsettled": "bg-orange-100 text-orange-800",
  "Distressed": "bg-red-100 text-red-800",
};

const TYPE_ICON: Record<string, typeof Phone> = {
  "Visit": Users,
  "Phone": Phone,
  "Video": Video,
  "Letterbox": Mail,
  "Social media": MessageSquare,
  "Indirect": Mail,
};

/* ── seed data ─────────────────────────────────────────────────────────────── */

const SEED: SiblingProtocol[] = [
  {
    id: "sib_1",
    youngPerson: "yp_alex",
    siblingName: "M (younger sister, 9)",
    siblingPlacement: "Lives with Mum",
    siblingLocation: "Doncaster (same town)",
    relationshipPreOakHouse: "Lived together until Alex's admission 14 months ago. M looked up to Alex; Alex took on protective 'older sibling' role during periods of parental drinking. Some role-reversal/parentification noted in pre-admission assessment.",
    currentRelationshipQuality: "Fragile",
    contactFrequency: "Indirect — through Mum's supervised contact (fortnightly). No direct sibling-only contact at present.",
    contactTypes: ["Letterbox", "Indirect", "Phone"],
    agreedContactPlan: "Letterbox contact monthly (cards, drawings, photos sent through SW). Telephone contact during Mum's supervised contact at Family Centre — last 10 minutes of the session reserved for Alex and M to speak. No unsupervised direct contact whilst safeguarding plan in place. Plan to be reviewed at next LAC review with view to introducing supervised sibling-only contact.",
    childPreferences: "Alex says he 'misses M loads' but worries about 'making her sad' if she sees him upset. Wants to send her birthday card himself. Has asked keyworker if he can record short video messages — to be explored with SW.",
    siblingPreferences: "M (per SW report) talks about Alex daily, keeps a photo by her bed. Has written 4 letters in past 6 months. Wants to see Alex but Mum reports M becomes anxious before contact and unsettled afterwards.",
    riskFactorsToContact: [
      "Risk of role-reversal — Alex feels responsible for M's emotional wellbeing",
      "M's anxiety pre/post contact — needs careful pacing",
      "Mum's contact is supervised due to alcohol concerns — sibling contact embedded within this is inherently constrained",
      "Alex's own emotional regulation following contact — historically dysregulated for 24-48 hrs",
    ],
    protectiveFactorsToContact: [
      "Both children clearly love each other — relationship worth protecting",
      "Letterbox provides safe, paced communication",
      "M's foster-style stability with Mum is currently good",
      "Family Centre supervisor knows both children well",
      "Alex's keyworker (Anna) provides post-contact decompression session",
    ],
    supervisionRequired: true,
    supervisionLevel: "Fully supervised by Family Centre staff during Mum's contact",
    transportArrangements: "Oak House staff transport Alex to Family Centre. M brought by Mum. Returns separately.",
    contactCostsBudget: "£20/month letterbox stationery + postage. Travel covered in placement plan.",
    locationsForContact: ["Doncaster Family Centre", "Letterbox via SW office"],
    favouriteSiblingActivities: [
      "Drawing together (when contact was direct)",
      "Alex reading to M",
      "Watching cartoons — both love Bluey",
      "Looking at family photos",
    ],
    birthdayCelebrationPlan: "M's birthday (12 August): Alex to choose and send card + small gift (£15 budget). Phone call on the day if possible. Alex's birthday (3 March): M sends card via letterbox; Mum brings card to next contact.",
    christmasArrangements: "Christmas cards exchanged via letterbox. Alex to make handmade gift in keywork sessions Nov-Dec. Phone call on Christmas Day afternoon (15 mins, supervised). No overnight or extended contact this year — to review for 2027.",
    courtOrderedContact: false,
    courtOrderTerms: "",
    recentContacts: [
      {
        date: d(-3),
        type: "Letterbox",
        observations: "Alex sent a drawing of Oak House garden and a letter telling M about his new bike. Took 40 minutes in keywork. Carefully chose stickers for the envelope.",
        childMoodAfter: "Settled",
      },
      {
        date: d(-10),
        type: "Phone",
        observations: "10-min call at end of Mum's contact. Alex initially quiet, then asked M about her school play. M told him she got the part of a tree. Both laughed. Alex said 'love you' at end — first time on record.",
        childMoodAfter: "Reflective",
      },
      {
        date: d(-24),
        type: "Letterbox",
        observations: "M sent Alex a friendship bracelet she'd made and a letter. Alex held the bracelet for a long time; teared up. Asked to keep letter in his memory box.",
        childMoodAfter: "Mixed",
      },
      {
        date: d(-38),
        type: "Phone",
        observations: "10-min call. Alex agitated beforehand. M sounded tired. Conversation stilted. Alex ended call early saying he was 'tired'. Decompression session with Anna afterwards.",
        childMoodAfter: "Unsettled",
      },
    ],
    ongoingSiblingThemes: [
      "Alex's parentification — needs ongoing therapeutic work to release responsibility for M",
      "Pacing of contact — quality over frequency",
      "Building toward supervised sibling-only direct contact (target Q3)",
      "Joint life-story work potential when both ready",
      "Memory box updates after each contact",
    ],
    reviewDate: d(28),
    reviewedBy: "staff_anna",
  },
  {
    id: "sib_2",
    youngPerson: "yp_jordan",
    siblingName: "T (younger sister, 11)",
    siblingPlacement: "Long-term foster carer (Mrs Jones)",
    siblingLocation: "Sheffield (35 mins by car)",
    relationshipPreOakHouse: "Jordan and T were placed together initially in 2022, then separated 8 months ago when previous placement disrupted. Very close pre-separation — shared bedroom for 6 years, T described Jordan as 'my person'. Mrs Jones is a kinship-style carer who knew the family previously.",
    currentRelationshipQuality: "Strong",
    contactFrequency: "Direct contact every 2 weeks (alternating Saturdays) plus weekly video call. Letterbox between visits. Holiday/birthday additions.",
    contactTypes: ["Visit", "Video", "Phone", "Letterbox"],
    agreedContactPlan: "Fortnightly Saturday visit (4-5 hours), alternating between Oak House and Mrs Jones's home. Weekly Wednesday video call (30 mins, 6:30pm). Phone call any time at Jordan's request. Two extended visits per year (overnight at Mrs Jones's, agreed by SW). Joint birthday celebration. Christmas Day morning together. Mrs Jones and Oak House have direct relationship — communicate weekly.",
    childPreferences: "Jordan: 'T is my sister and that won't ever change. I want to see her as much as I can.' Has stated clearly she wants overnight contact at Mrs Jones's. Her wishes recorded in care plan and at last LAC review.",
    siblingPreferences: "T (per Mrs Jones and SW): asks about Jordan daily, counts down to visits on calendar. Has photo of Jordan as her phone background. Has said 'when I'm grown up I want to live with Jordan'.",
    riskFactorsToContact: [
      "Both children have shared trauma history — contact can trigger memories",
      "Jordan can become protective/controlling toward T (linked to earlier role)",
      "T occasionally regresses behaviourally for 24 hrs after visits (Mrs Jones reports)",
    ],
    protectiveFactorsToContact: [
      "Excellent relationship between Oak House and Mrs Jones — trusting communication",
      "Jordan's contact is celebrated and well-prepared for in keywork",
      "Both children have stable placements — contact enriches rather than destabilises",
      "T's foster carer is on Jordan's life-story team",
      "Routine and predictability of fortnightly rhythm is calming for both",
      "Activities chosen to suit both ages — deliberately nurturing not over-stimulating",
    ],
    supervisionRequired: false,
    supervisionLevel: "Unsupervised at Mrs Jones's home. At Oak House, staff present in shared spaces but children have private time in Jordan's room or garden.",
    transportArrangements: "Oak House staff drive Jordan to Sheffield on Mrs Jones-host Saturdays. Mrs Jones drives T to Oak House on alternating Saturdays. Costs split in placement plan.",
    contactCostsBudget: "£40/month activity budget (cinema, swimming, lunch out). Travel costs absorbed in placement budget. Christmas/birthday fund of £80 each from child's personal allowance.",
    locationsForContact: [
      "Mrs Jones's home (kitchen/garden/T's bedroom)",
      "Oak House (Jordan's room/garden/lounge)",
      "Sheffield Ponderosa park",
      "Cineworld Doncaster",
      "Meadowhall (occasionally)",
    ],
    favouriteSiblingActivities: [
      "Baking (especially shortbread — Mum used to make this)",
      "Swimming at Sheffield International",
      "Watching films together — Disney rotation",
      "Walking Mrs Jones's dog",
      "Doing each other's hair",
      "Playing UNO and Dobble",
    ],
    birthdayCelebrationPlan: "T's birthday (4 June): Jordan stays overnight at Mrs Jones's the weekend closest. Joint cake. Jordan plans the gift in keywork sessions and uses her allowance. Jordan's birthday (19 September): T comes to Oak House with Mrs Jones for tea. Jordan can choose 1 sibling-only activity in the lead-up week.",
    christmasArrangements: "Christmas Eve: Mrs Jones drops T at Oak House for tea and present-wrapping (Jordan's idea last year — kept up). Christmas Day morning 9-12 at Oak House together — open sibling presents, breakfast. Mrs Jones collects T at noon for Christmas dinner with her family. Boxing Day: video call. New Year's Eve: Jordan invited to Mrs Jones's for sleepover (agreed annually).",
    courtOrderedContact: true,
    courtOrderTerms: "Sibling contact to be promoted in line with Children Act 1989 s23(7). Court order from placement disruption hearing (Mar 2026) specifies minimum fortnightly direct contact, weekly indirect contact, and overnight contact 'where consistent with both children's wishes and welfare'. Local authority to fund.",
    recentContacts: [
      {
        date: d(-6),
        type: "Visit",
        observations: "Saturday at Mrs Jones's. 5 hours. Baked shortbread (Jordan led, T helped — beautiful to see). Walked dog in park. T tearful at goodbye but Jordan comforted her well. Jordan reflective in car home.",
        childMoodAfter: "Settled",
      },
      {
        date: d(-9),
        type: "Video",
        observations: "30-min Wed call. Both showed each other artwork from week. Discussed plans for next visit. Lots of laughter. T showed Jordan her loose tooth.",
        childMoodAfter: "Happy",
      },
      {
        date: d(-13),
        type: "Visit",
        observations: "T came to Oak House. Swimming at Sheffield International (Mrs Jones drove both). Lunch out — pizza. Both children very settled. Took selfie together for Jordan's room.",
        childMoodAfter: "Happy",
      },
      {
        date: d(-16),
        type: "Phone",
        observations: "Brief 10-min call — T had bad day at school, called Jordan. Jordan was calm, supportive, gave good advice. Mrs Jones thanked Oak House afterwards.",
        childMoodAfter: "Reflective",
      },
      {
        date: d(-20),
        type: "Visit",
        observations: "Saturday at Mrs Jones's. Cinema (Inside Out 2). Both loved it. T fell asleep on Jordan's shoulder on the way back. Jordan asked if T could stay at Oak House sometime — to discuss at LAC review.",
        childMoodAfter: "Happy",
      },
    ],
    ongoingSiblingThemes: [
      "Building toward T overnighting at Oak House (target review item)",
      "Joint life-story work commenced March — fortnightly sessions",
      "Maintaining Jordan's age-appropriate role — not over-responsibilising",
      "Supporting T's transitions back to Mrs Jones's after visits",
      "Plan for both children attending family events (cousin's wedding, June)",
      "Long-term: shared social media space when age-appropriate",
    ],
    reviewDate: d(45),
    reviewedBy: "staff_chervelle",
  },
];

/* ── page ──────────────────────────────────────────────────────────────────── */

export default function SiblingsContactProtocolPage() {
  const [data] = useState<SiblingProtocol[]>(SEED);
  const [search, setSearch] = useState("");
  const [filterYP, setFilterYP] = useState("all");
  const [filterQuality, setFilterQuality] = useState("all");
  const [filterCourt, setFilterCourt] = useState("all");
  const [sortBy, setSortBy] = useState("review-asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId((p) => (p === id ? null : id));

  /* ── derived ─────────────────────────────────────────────────────────────── */

  const filtered = useMemo(() => {
    let rows = data.filter((r) => {
      if (filterYP !== "all" && r.youngPerson !== filterYP) return false;
      if (filterQuality !== "all" && r.currentRelationshipQuality !== filterQuality) return false;
      if (filterCourt === "yes" && !r.courtOrderedContact) return false;
      if (filterCourt === "no" && r.courtOrderedContact) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.siblingName.toLowerCase().includes(q) ||
          r.siblingPlacement.toLowerCase().includes(q) ||
          r.siblingLocation.toLowerCase().includes(q) ||
          r.agreedContactPlan.toLowerCase().includes(q) ||
          getYPName(r.youngPerson).toLowerCase().includes(q)
        );
      }
      return true;
    });
    rows = [...rows].sort((a, b) => {
      switch (sortBy) {
        case "review-asc": return a.reviewDate.localeCompare(b.reviewDate);
        case "review-desc": return b.reviewDate.localeCompare(a.reviewDate);
        case "yp": return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
        case "quality": return a.currentRelationshipQuality.localeCompare(b.currentRelationshipQuality);
        default: return 0;
      }
    });
    return rows;
  }, [data, search, filterYP, filterQuality, filterCourt, sortBy]);

  /* ── stats ───────────────────────────────────────────────────────────────── */

  const childrenWithSiblings = new Set(data.map((r) => r.youngPerson)).size;
  const activeContacts = data.filter((r) => r.contactTypes.length > 0).length;
  const courtOrderedCount = data.filter((r) => r.courtOrderedContact).length;
  const reviewsDue = useMemo(() => {
    const today = new Date();
    const in30 = new Date();
    in30.setDate(today.getDate() + 30);
    return data.filter((r) => {
      const rd = new Date(r.reviewDate);
      return rd <= in30;
    }).length;
  }, [data]);

  const yps = Array.from(new Set(data.map((r) => r.youngPerson)));
  const qualities = Array.from(new Set(data.map((r) => r.currentRelationshipQuality)));

  /* ── export ──────────────────────────────────────────────────────────────── */

  const exportCols: ExportColumn<SiblingProtocol>[] = [
    { header: "Young Person", accessor: (r: SiblingProtocol) => getYPName(r.youngPerson) },
    { header: "Sibling", accessor: (r: SiblingProtocol) => r.siblingName },
    { header: "Sibling Placement", accessor: (r: SiblingProtocol) => r.siblingPlacement },
    { header: "Location", accessor: (r: SiblingProtocol) => r.siblingLocation },
    { header: "Pre-Oak House Relationship", accessor: (r: SiblingProtocol) => r.relationshipPreOakHouse },
    { header: "Current Quality", accessor: (r: SiblingProtocol) => r.currentRelationshipQuality },
    { header: "Frequency", accessor: (r: SiblingProtocol) => r.contactFrequency },
    { header: "Contact Types", accessor: (r: SiblingProtocol) => r.contactTypes.join("; ") },
    { header: "Agreed Plan", accessor: (r: SiblingProtocol) => r.agreedContactPlan },
    { header: "Child's Preferences", accessor: (r: SiblingProtocol) => r.childPreferences },
    { header: "Sibling's Preferences", accessor: (r: SiblingProtocol) => r.siblingPreferences },
    { header: "Risk Factors", accessor: (r: SiblingProtocol) => r.riskFactorsToContact.join("; ") },
    { header: "Protective Factors", accessor: (r: SiblingProtocol) => r.protectiveFactorsToContact.join("; ") },
    { header: "Supervision Required", accessor: (r: SiblingProtocol) => r.supervisionRequired ? "Yes" : "No" },
    { header: "Supervision Level", accessor: (r: SiblingProtocol) => r.supervisionLevel },
    { header: "Transport", accessor: (r: SiblingProtocol) => r.transportArrangements },
    { header: "Budget", accessor: (r: SiblingProtocol) => r.contactCostsBudget },
    { header: "Locations", accessor: (r: SiblingProtocol) => r.locationsForContact.join("; ") },
    { header: "Favourite Activities", accessor: (r: SiblingProtocol) => r.favouriteSiblingActivities.join("; ") },
    { header: "Birthday Plan", accessor: (r: SiblingProtocol) => r.birthdayCelebrationPlan },
    { header: "Christmas Arrangements", accessor: (r: SiblingProtocol) => r.christmasArrangements },
    { header: "Court Ordered", accessor: (r: SiblingProtocol) => r.courtOrderedContact ? "Yes" : "No" },
    { header: "Court Order Terms", accessor: (r: SiblingProtocol) => r.courtOrderTerms },
    { header: "Recent Contacts", accessor: (r: SiblingProtocol) => r.recentContacts.map((c) => `${c.date} ${c.type}: ${c.observations} [mood: ${c.childMoodAfter}]`).join(" || ") },
    { header: "Ongoing Themes", accessor: (r: SiblingProtocol) => r.ongoingSiblingThemes.join("; ") },
    { header: "Review Date", accessor: (r: SiblingProtocol) => r.reviewDate },
    { header: "Reviewed By", accessor: (r: SiblingProtocol) => getStaffName(r.reviewedBy) },
  ];

  /* ── render ──────────────────────────────────────────────────────────────── */

  return (
    <PageShell
      title="Siblings Contact Protocol"
      subtitle="Children Act 1989 s23(7) — sibling duty · Quality Standard 9 (Care Planning)"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Siblings Contact Protocol" />
          <ExportButton data={filtered} columns={exportCols} filename="siblings-contact-protocol" />
        </div>
      }
    >
      <div id="print-area">
        {/* ── stat strip ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Children with Siblings", value: childrenWithSiblings, icon: Users, clr: "text-blue-600" },
            { label: "Active Contacts", value: activeContacts, icon: Heart, clr: "text-rose-600" },
            { label: "Court-Ordered", value: courtOrderedCount, icon: Gavel, clr: "text-indigo-600" },
            { label: "Reviews Due (30d)", value: reviewsDue, icon: CalendarClock, clr: reviewsDue > 0 ? "text-amber-600" : "text-emerald-600" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-3 text-center">
                <s.icon className={cn("h-5 w-5 mx-auto mb-1", s.clr)} />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── enduring relationships banner ────────────────────────────────── */}
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-rose-900">Sibling relationships often outlast every placement.</p>
            <p className="text-rose-800 mt-1">
              Brothers and sisters are usually the longest relationships in a child&apos;s life — outlasting carers, schools, social workers, and homes. Section 23(7) of the Children Act 1989 places a duty on the local authority to enable separated siblings to live together so far as is reasonably practicable, and where they cannot, to support meaningful contact. Quality Standard 9 requires us to actively promote those bonds. This protocol is not a contact log — it is the agreed shape of an enduring relationship we are entrusted to protect and grow.
            </p>
          </div>
        </div>

        {/* ── filters ──────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search sibling, placement, plan…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterYP} onValueChange={setFilterYP}>
            <SelectTrigger className="w-[170px]"><Filter className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Children</SelectItem>
              {yps.map((y) => (<SelectItem key={y} value={y}>{getYPName(y)}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={filterQuality} onValueChange={setFilterQuality}>
            <SelectTrigger className="w-[170px]"><Filter className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Qualities</SelectItem>
              {qualities.map((q) => (<SelectItem key={q} value={q}>{q}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={filterCourt} onValueChange={setFilterCourt}>
            <SelectTrigger className="w-[170px]"><Filter className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Court status: any</SelectItem>
              <SelectItem value="yes">Court ordered</SelectItem>
              <SelectItem value="no">Not court ordered</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[170px]"><ArrowUpDown className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="review-asc">Review: soonest</SelectItem>
              <SelectItem value="review-desc">Review: latest</SelectItem>
              <SelectItem value="yp">By Child</SelectItem>
              <SelectItem value="quality">By Quality</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ── records ──────────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {filtered.map((r) => {
            const open = expandedId === r.id;
            const lastContact = r.recentContacts[0];
            return (
              <Card
                key={r.id}
                className={cn(
                  "border-l-4",
                  r.courtOrderedContact ? "border-l-indigo-500" : "border-l-rose-300",
                )}
              >
                <CardHeader className="pb-2 cursor-pointer" onClick={() => toggle(r.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                        {getYPName(r.youngPerson)}
                        <span className="text-muted-foreground font-normal">↔</span>
                        <span className="font-medium">{r.siblingName}</span>
                        <Badge variant="outline" className={QUALITY_CLR[r.currentRelationshipQuality] ?? "bg-slate-100 text-slate-800"}>
                          {r.currentRelationshipQuality}
                        </Badge>
                        {r.courtOrderedContact && (
                          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 gap-1">
                            <Gavel className="h-3 w-3" /> Court Ordered
                          </Badge>
                        )}
                        {r.supervisionRequired && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 gap-1">
                            <Shield className="h-3 w-3" /> Supervised
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.siblingPlacement}</span>
                        <span>·</span>
                        <span>{r.siblingLocation}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><CalendarClock className="h-3 w-3" /> Review {r.reviewDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {r.contactTypes.map((t) => {
                          const Icon = TYPE_ICON[t] ?? MessageSquare;
                          return (
                            <Badge key={t} variant="outline" className="bg-slate-50 text-slate-700 gap-1 font-normal">
                              <Icon className="h-3 w-3" /> {t}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                    {open ? <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />}
                  </div>
                </CardHeader>

                {open && (
                  <CardContent className="pt-0 space-y-5 text-sm">
                    {/* Pre-Oak House */}
                    <section>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Relationship before Oak House</h4>
                      <p className="text-slate-700 leading-relaxed">{r.relationshipPreOakHouse}</p>
                    </section>

                    {/* Frequency + Plan */}
                    <section className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Contact frequency</h4>
                        <p className="text-slate-700">{r.contactFrequency}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Supervision</h4>
                        <p className="text-slate-700">{r.supervisionLevel}</p>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Agreed contact plan</h4>
                      <p className="text-slate-700 leading-relaxed">{r.agreedContactPlan}</p>
                    </section>

                    {/* Court order */}
                    {r.courtOrderedContact && r.courtOrderTerms && (
                      <section className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                        <h4 className="text-xs font-semibold text-indigo-800 mb-1 flex items-center gap-1">
                          <Gavel className="h-3.5 w-3.5" /> Court order terms
                        </h4>
                        <p className="text-indigo-900 text-sm">{r.courtOrderTerms}</p>
                      </section>
                    )}

                    {/* Voices */}
                    <section className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h4 className="text-xs font-semibold text-blue-800 mb-1">Child&apos;s preferences</h4>
                        <p className="text-blue-900">{r.childPreferences}</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <h4 className="text-xs font-semibold text-purple-800 mb-1">Sibling&apos;s preferences</h4>
                        <p className="text-purple-900">{r.siblingPreferences}</p>
                      </div>
                    </section>

                    {/* Risk + Protective */}
                    <section className="grid md:grid-cols-2 gap-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <h4 className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" /> Risks to contact
                        </h4>
                        <ul className="space-y-1 text-amber-900 list-disc list-inside text-xs">
                          {r.riskFactorsToContact.map((f, i) => (<li key={i}>{f}</li>))}
                        </ul>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <h4 className="text-xs font-semibold text-emerald-800 mb-2 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Protective factors
                        </h4>
                        <ul className="space-y-1 text-emerald-900 list-disc list-inside text-xs">
                          {r.protectiveFactorsToContact.map((f, i) => (<li key={i}>{f}</li>))}
                        </ul>
                      </div>
                    </section>

                    {/* Logistics */}
                    <section className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Transport</h4>
                        <p className="text-slate-700 text-xs">{r.transportArrangements}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Budget</h4>
                        <p className="text-slate-700 text-xs">{r.contactCostsBudget}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Locations</h4>
                        <ul className="text-slate-700 text-xs space-y-0.5">
                          {r.locationsForContact.map((l, i) => (<li key={i} className="flex items-start gap-1"><MapPin className="h-3 w-3 mt-0.5 shrink-0" /> {l}</li>))}
                        </ul>
                      </div>
                    </section>

                    {/* Favourite activities */}
                    <section>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">What they love doing together</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {r.favouriteSiblingActivities.map((a, i) => (
                          <Badge key={i} variant="outline" className="bg-pink-50 text-pink-800 font-normal">{a}</Badge>
                        ))}
                      </div>
                    </section>

                    {/* Birthday + Christmas */}
                    <section className="grid md:grid-cols-2 gap-4">
                      <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                        <h4 className="text-xs font-semibold text-rose-800 mb-1 flex items-center gap-1">
                          <Cake className="h-3.5 w-3.5" /> Birthday celebration plan
                        </h4>
                        <p className="text-rose-900 text-xs">{r.birthdayCelebrationPlan}</p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <h4 className="text-xs font-semibold text-emerald-800 mb-1 flex items-center gap-1">
                          <Gift className="h-3.5 w-3.5" /> Christmas arrangements
                        </h4>
                        <p className="text-emerald-900 text-xs">{r.christmasArrangements}</p>
                      </div>
                    </section>

                    {/* Recent contacts */}
                    <section>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" /> Recent contacts ({r.recentContacts.length})
                      </h4>
                      <div className="space-y-2">
                        {r.recentContacts.map((c, i) => {
                          const Icon = TYPE_ICON[c.type] ?? MessageSquare;
                          return (
                            <div key={i} className="border border-slate-200 rounded-lg p-3 bg-white">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <Badge variant="outline" className="bg-slate-50 text-slate-700 gap-1 font-normal">
                                  <Icon className="h-3 w-3" /> {c.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{c.date}</span>
                                <Badge variant="outline" className={MOOD_CLR[c.childMoodAfter] ?? "bg-slate-100 text-slate-700"}>
                                  Mood after: {c.childMoodAfter}
                                </Badge>
                              </div>
                              <p className="text-slate-700 text-xs leading-relaxed">{c.observations}</p>
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    {/* Themes */}
                    <section>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Ongoing sibling themes</h4>
                      <ul className="space-y-1 text-slate-700 list-disc list-inside text-xs">
                        {r.ongoingSiblingThemes.map((t, i) => (<li key={i}>{t}</li>))}
                      </ul>
                    </section>

                    {/* Review */}
                    <section className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> Next review: <span className="font-medium text-slate-700">{r.reviewDate}</span></span>
                      <span>Reviewed by <span className="font-medium text-slate-700">{getStaffName(r.reviewedBy)}</span></span>
                      {lastContact && (
                        <span>Last contact: <span className="font-medium text-slate-700">{lastContact.date}</span></span>
                      )}
                    </section>
                  </CardContent>
                )}
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No sibling protocols match the current filters.</p>
            </div>
          )}
        </div>

        {/* ── regulatory note ──────────────────────────────────────────────── */}
        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700">
          <p className="font-semibold text-slate-900 mb-1">Regulatory framework</p>
          <p className="leading-relaxed">
            This protocol gives effect to <strong>Children Act 1989, s23(7)</strong> (the duty to place siblings together so far as reasonably practicable, and to support contact where they are separated) and <strong>Quality Standard 9</strong> of the Children&apos;s Homes (England) Regulations 2015 (Care Planning), which requires the home to actively promote contact with siblings where this is consistent with the child&apos;s welfare. Cross-references: Care Plan, Family Contact log, Contact Plans, Life-Story Work, and the placing authority&apos;s Sibling Assessment. Each protocol must be reviewed at every LAC review and at any change in either child&apos;s placement.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
