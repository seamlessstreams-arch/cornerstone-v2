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
  KeyRound,
  Gavel,
  Heart,
  AlertCircle,
  CheckCircle,
  Users,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PrHolder {
  party: string;
  partyType: "Birth Mother" | "Birth Father" | "Maternal Grandparent" | "Paternal Grandparent" | "Adoptive Parent" | "Special Guardian" | "Local Authority" | "Court" | "Step-Parent";
  acquired: "By birth (Mother)" | "By marriage to mother" | "By being on birth certificate" | "By Parental Responsibility Agreement" | "By Court Order" | "By Care Order (s31)" | "By Adoption Order" | "By Special Guardianship Order" | "Other";
  acquiredDate: string;
  current: boolean;
  endedDate: string;
  endedReason: string;
  notes: string;
}

interface DelegatedAuthority {
  category: string;
  delegatedTo: "Home" | "Social Worker" | "Parent (specific)" | "Joint" | "LA Director";
  rationale: string;
  reviewedDate: string;
  exceptions: string[];
}

interface PrRecord {
  id: string;
  youngPerson: string;
  legalStatus: "Section 20 Voluntary" | "Section 31 Care Order" | "Section 38 Interim Care Order" | "Section 17 Child in Need" | "Police Protection (s46)" | "Emergency Protection Order" | "Special Guardianship";
  legalStatusDate: string;
  prHolders: PrHolder[];
  delegatedAuthorities: DelegatedAuthority[];
  childAwarenessOfStatus: string;
  routinelyConsultedParties: string[];
  parentalResponsibilityComplexNotes: string;
  courtOrdersInPlace: { order: string; dateIssued: string; expiry: string; terms: string }[];
  contactArrangements: string;
  prohibitedSteps: string[];
  identityDocuments: { document: string; held: boolean; location: string }[];
  consentMatrix: { activity: string; whoConsents: string; lastUsed: string }[];
  reviewedDate: string;
  reviewedBy: string;
  signedOffByLA: boolean;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: PrRecord[] = [
  {
    id: "pr-001",
    youngPerson: "yp_alex",
    legalStatus: "Section 31 Care Order",
    legalStatusDate: "2022-01-10",
    prHolders: [
      { party: "Birth Mother (Sarah)", partyType: "Birth Mother", acquired: "By birth (Mother)", acquiredDate: "2012-08-15", current: true, endedDate: "", endedReason: "", notes: "PR shared with LA via Care Order. Mother retains PR but cannot exercise without LA agreement on most matters." },
      { party: "Birth Father (James)", partyType: "Birth Father", acquired: "By being on birth certificate", acquiredDate: "2012-08-20", current: true, endedDate: "", endedReason: "", notes: "Father retains PR but estranged. Non-molestation order in place. PR exercise practically impossible without court involvement. Information not shared with him without legal review." },
      { party: "Riverside County Council", partyType: "Local Authority", acquired: "By Care Order (s31)", acquiredDate: "2022-01-10", current: true, endedDate: "", endedReason: "", notes: "Shared PR with both parents. LA decision-maker on most matters." },
    ],
    delegatedAuthorities: [
      { category: "Day-to-day care decisions", delegatedTo: "Home", rationale: "Standard delegation per Care Plan", reviewedDate: d(-30), exceptions: [] },
      { category: "Routine medical consent", delegatedTo: "Home", rationale: "GP, dental, optician — standard care", reviewedDate: d(-30), exceptions: ["Surgery requires LA consent", "Mental health interventions require LA consent"] },
      { category: "School matters", delegatedTo: "Home", rationale: "Day-to-day; LA for major decisions", reviewedDate: d(-30), exceptions: ["School change requires LA", "Permanent exclusion involvement requires LA"] },
      { category: "Activities & residentials", delegatedTo: "Home", rationale: "Standard activities home-led", reviewedDate: d(-30), exceptions: ["Foreign travel requires LA"] },
      { category: "Hairdressing & body modification", delegatedTo: "Home", rationale: "Standard barbering home-led", reviewedDate: d(-30), exceptions: ["Tattoos / piercings require LA"] },
      { category: "Religion & cultural practices", delegatedTo: "Joint", rationale: "Mother's input valued; home implements", reviewedDate: d(-30), exceptions: [] },
      { category: "Mother contact", delegatedTo: "LA Director", rationale: "Court-ordered framework; LA arranges", reviewedDate: d(-30), exceptions: [] },
      { category: "Father contact", delegatedTo: "LA Director", rationale: "Restricted by non-molestation order", reviewedDate: d(-30), exceptions: ["No contact without explicit LA legal review"] },
    ],
    childAwarenessOfStatus: "Alex understands age-appropriately that he is on a Care Order, that LA shares PR with parents, and what that means in practice. Knows he can ask Sarah Mitchell (SW) about decisions.",
    routinelyConsultedParties: [
      "Mother (where appropriate and not destabilising)",
      "LA (Sarah Mitchell, SW)",
      "Alex himself (age-appropriately)",
      "IRO for major decisions",
    ],
    parentalResponsibilityComplexNotes: "Father's PR creates complexity. Information sharing with father is risk-assessed each time. He has not exercised PR since 2018. LA legal team consulted for any matter where his consent might be technically required.",
    courtOrdersInPlace: [
      { order: "Care Order (s31)", dateIssued: "2022-01-10", expiry: "Until 18 or discharge", terms: "Shared PR with parents. LA decision-maker." },
      { order: "Non-molestation order (against father)", dateIssued: "2018-04-15", expiry: "Indefinite (renewed)", terms: "Father not to contact mother or children directly." },
    ],
    contactArrangements: "Mother: Weekly phone, fortnightly supervised visit. Father: No contact. Sister Mia: Indirect through Mum. Maternal Grandmother: Sunday lunches when possible.",
    prohibitedSteps: [
      "Father not to be informed of Alex's location",
      "Alex not to attend events where father may be present",
      "No social media contact with father's family",
    ],
    identityDocuments: [
      { document: "Birth certificate", held: true, location: "Locked file in office" },
      { document: "Passport", held: true, location: "Locked file (LA aware)" },
      { document: "NHS card", held: true, location: "Office file" },
      { document: "Care Order documents", held: true, location: "Locked legal file" },
    ],
    consentMatrix: [
      { activity: "GP appointment routine", whoConsents: "Home (RM signature)", lastUsed: d(-14) },
      { activity: "School trip residential", whoConsents: "LA (SW signature)", lastUsed: d(-180) },
      { activity: "Photographs for life story", whoConsents: "Home + Alex (he agrees)", lastUsed: d(-30) },
      { activity: "Therapeutic referral (CAMHS)", whoConsents: "LA + GP", lastUsed: "2022-03-20" },
      { activity: "Sleepover at friend's house", whoConsents: "Home (RM)", lastUsed: d(-7) },
      { activity: "Boxing club membership", whoConsents: "Home (RM)", lastUsed: "2024-09-01" },
    ],
    reviewedDate: d(-30),
    reviewedBy: "staff_darren",
    signedOffByLA: true,
  },
  {
    id: "pr-002",
    youngPerson: "yp_jordan",
    legalStatus: "Section 31 Care Order",
    legalStatusDate: "2023-06-12",
    prHolders: [
      { party: "Birth Mother (Janice)", partyType: "Birth Mother", acquired: "By birth (Mother)", acquiredDate: "2012-11-22", current: true, endedDate: "", endedReason: "", notes: "Currently in HMP. PR retained but cannot exercise day-to-day. Pre-release planning underway. Strong relationship with Jordan despite circumstances." },
      { party: "Birth Father (Marcus Sr)", partyType: "Birth Father", acquired: "Other", acquiredDate: "Not on birth certificate", current: false, endedDate: "Never had PR", endedReason: "Not married to mother; not on birth certificate; no PR Agreement", notes: "Father does not hold PR. Limited involvement throughout Jordan's life. Recently expressed interest in re-establishing contact — being explored carefully." },
      { party: "Valley Borough Council", partyType: "Local Authority", acquired: "By Care Order (s31)", acquiredDate: "2023-06-12", current: true, endedDate: "", endedReason: "", notes: "Shared PR with mother. LA decision-maker." },
    ],
    delegatedAuthorities: [
      { category: "Day-to-day care decisions", delegatedTo: "Home", rationale: "Standard", reviewedDate: d(-21), exceptions: [] },
      { category: "Routine medical consent", delegatedTo: "Home", rationale: "Standard care", reviewedDate: d(-21), exceptions: ["Asthma management plan changes require GP + LA awareness"] },
      { category: "School matters", delegatedTo: "Home", rationale: "Day-to-day", reviewedDate: d(-21), exceptions: [] },
      { category: "Activities", delegatedTo: "Home", rationale: "Football, cultural events", reviewedDate: d(-21), exceptions: [] },
      { category: "Religion & cultural practices", delegatedTo: "Joint", rationale: "Mother's faith framework respected", reviewedDate: d(-21), exceptions: [] },
      { category: "Mother contact", delegatedTo: "LA Director", rationale: "Prison contact framework + post-release planning", reviewedDate: d(-21), exceptions: [] },
      { category: "Father contact", delegatedTo: "LA Director", rationale: "Father has no PR; contact decisions LA-led with Jordan's voice central", reviewedDate: d(-21), exceptions: [] },
      { category: "Sibling Tia contact", delegatedTo: "Joint", rationale: "Coordinated with Tia's foster carer + LA", reviewedDate: d(-21), exceptions: [] },
    ],
    childAwarenessOfStatus: "Jordan understands his legal status. Knows mother is on Care Order with him, knows father doesn't hold PR. Knows LA makes big decisions with him.",
    routinelyConsultedParties: [
      "Mother (via prison contact framework)",
      "Tom Richards (SW)",
      "Jordan himself",
      "Coram Voice advocate",
      "IRO for major decisions",
    ],
    parentalResponsibilityComplexNotes: "Father's request to re-establish contact is being explored. He does not hold PR but Jordan's wishes matter. Process being managed carefully with advocate support.",
    courtOrdersInPlace: [
      { order: "Care Order (s31)", dateIssued: "2023-06-12", expiry: "Until 18 or discharge", terms: "Shared PR with mother." },
    ],
    contactArrangements: "Mother: Weekly prison phone calls + monthly prison visits (when arranged). Sister Tia: Monthly direct contact + birthdays/Christmas. Father: Currently none, being reviewed.",
    prohibitedSteps: [],
    identityDocuments: [
      { document: "Birth certificate", held: true, location: "Locked office file" },
      { document: "Passport", held: false, location: "Application in progress with LA" },
      { document: "NHS card", held: true, location: "Office file" },
      { document: "Care Order documents", held: true, location: "Locked legal file" },
    ],
    consentMatrix: [
      { activity: "GP appointment routine", whoConsents: "Home (RM signature)", lastUsed: d(-21) },
      { activity: "Football team registration", whoConsents: "Home (RM)", lastUsed: "2024-09-05" },
      { activity: "School trip", whoConsents: "Home + LA for residentials", lastUsed: d(-30) },
      { activity: "Cultural mentor engagement", whoConsents: "Home + LA", lastUsed: d(-45) },
      { activity: "Mother prison visit", whoConsents: "LA + Prison social worker", lastUsed: d(-14) },
      { activity: "Sister contact", whoConsents: "Joint with foster carer", lastUsed: d(-30) },
    ],
    reviewedDate: d(-21),
    reviewedBy: "staff_darren",
    signedOffByLA: true,
  },
  {
    id: "pr-003",
    youngPerson: "yp_casey",
    legalStatus: "Section 31 Care Order",
    legalStatusDate: "2021-07-10",
    prHolders: [
      { party: "Birth Mother (Rachel)", partyType: "Birth Mother", acquired: "By birth (Mother)", acquiredDate: "2014-04-08", current: true, endedDate: "", endedReason: "", notes: "Did not contest care order. Letterbox-only contact. PR exercise minimal in practice." },
      { party: "Birth Father (Andrew)", partyType: "Birth Father", acquired: "By being on birth certificate", acquiredDate: "2014-04-15", current: true, endedDate: "", endedReason: "", notes: "Did not contest care order. No active involvement. Information not shared without LA legal review." },
      { party: "Hillside County Council", partyType: "Local Authority", acquired: "By Care Order (s31)", acquiredDate: "2021-07-10", current: true, endedDate: "", endedReason: "", notes: "Shared PR with both parents. LA primary decision-maker." },
    ],
    delegatedAuthorities: [
      { category: "Day-to-day care decisions", delegatedTo: "Home", rationale: "Standard", reviewedDate: d(-7), exceptions: [] },
      { category: "Routine medical consent", delegatedTo: "Home", rationale: "Standard health needs", reviewedDate: d(-7), exceptions: ["Specialist (paediatrician/SaLT/CAMHS) requires LA awareness", "Medication changes require GP + LA"] },
      { category: "School matters", delegatedTo: "Home", rationale: "Specialist provision liaison", reviewedDate: d(-7), exceptions: ["EHCP review involvement requires LA"] },
      { category: "Activities", delegatedTo: "Home", rationale: "Sensory-aware activities", reviewedDate: d(-7), exceptions: ["Day trips beyond 50 miles require LA"] },
      { category: "Sensory & ASD-related interventions", delegatedTo: "Joint", rationale: "Multi-disciplinary input critical", reviewedDate: d(-7), exceptions: [] },
      { category: "Letterbox contact with birth family", delegatedTo: "LA Director", rationale: "Set arrangement, twice-yearly", reviewedDate: d(-7), exceptions: [] },
      { category: "Long-term placement decisions", delegatedTo: "LA Director", rationale: "Strategic placement decisions LA-led", reviewedDate: d(-7), exceptions: [] },
    ],
    childAwarenessOfStatus: "Casey understands age-appropriately and using visual supports that 'I'm on a Care Order so the council and the home look after me'. Doesn't want detailed exploration at present.",
    routinelyConsultedParties: [
      "Lisa Chen (SW)",
      "Casey (visually-supported communication)",
      "Anna (key worker, primary attachment)",
      "Multi-disciplinary team (SaLT, paediatrician, art therapist)",
      "IRO",
    ],
    parentalResponsibilityComplexNotes: "Both birth parents non-contesting. Letterbox-only contact. PR essentially exercised by LA. Casey doesn't currently wish to explore birth family further. Position respected and reviewable.",
    courtOrdersInPlace: [
      { order: "Care Order (s31)", dateIssued: "2021-07-10", expiry: "Until 18 or discharge", terms: "Shared PR with parents. LA decision-maker. Letterbox contact arrangement." },
    ],
    contactArrangements: "Birth Mother: Letterbox twice yearly. Birth Father: No contact. No siblings known.",
    prohibitedSteps: [
      "No direct contact between birth parents and Casey",
      "Letterbox content reviewed by Lisa (SW) before sharing with Casey",
    ],
    identityDocuments: [
      { document: "Birth certificate", held: true, location: "Locked office file" },
      { document: "Passport", held: false, location: "Will apply when needed" },
      { document: "NHS card", held: true, location: "Office file" },
      { document: "EHCP", held: true, location: "Education file" },
      { document: "Care Order documents", held: true, location: "Locked legal file" },
    ],
    consentMatrix: [
      { activity: "GP appointment routine", whoConsents: "Home (RM)", lastUsed: d(-14) },
      { activity: "Specialist appointments (paediatrician, SaLT)", whoConsents: "Home + LA", lastUsed: d(-21) },
      { activity: "Art therapy sessions", whoConsents: "Home + LA", lastUsed: d(-7) },
      { activity: "School activities", whoConsents: "Home", lastUsed: d(-7) },
      { activity: "EHCP annual review", whoConsents: "LA + Home", lastUsed: "2024-11-15" },
      { activity: "Otter sanctuary trip (planned)", whoConsents: "Home (within 50 mi)", lastUsed: d(-3) },
      { activity: "Letterbox letter from Mother received", whoConsents: "LA opens, Anna shares with Casey", lastUsed: d(-90) },
    ],
    reviewedDate: d(-7),
    reviewedBy: "staff_darren",
    signedOffByLA: true,
  },
];

const exportCols: ExportColumn<PrRecord>[] = [
  { header: "Young Person", accessor: (r: PrRecord) => getYPName(r.youngPerson) },
  { header: "Legal Status", accessor: (r: PrRecord) => r.legalStatus },
  { header: "Legal Status Since", accessor: (r: PrRecord) => r.legalStatusDate },
  { header: "PR Holders", accessor: (r: PrRecord) => r.prHolders.filter((p) => p.current).length.toString() },
  { header: "Court Orders Active", accessor: (r: PrRecord) => r.courtOrdersInPlace.length.toString() },
  { header: "Last Reviewed", accessor: (r: PrRecord) => r.reviewedDate },
  { header: "LA Sign-Off", accessor: (r: PrRecord) => r.signedOffByLA ? "Yes" : "No" },
];

export default function ParentalResponsibilityRecordPage() {
  const [filterYP, setFilterYP] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterYP !== "all") items = items.filter((r) => r.youngPerson === filterYP);
    items.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.youngPerson.localeCompare(b.youngPerson);
        case "review":
          return a.reviewedDate.localeCompare(b.reviewedDate);
        default:
          return 0;
      }
    });
    return items;
  }, [filterYP, sortBy]);

  const total = data.length;
  const allSignedOff = data.every((r) => r.signedOffByLA);
  const totalCourtOrders = data.reduce((sum, r) => sum + r.courtOrdersInPlace.length, 0);
  const dueReview = data.filter((r) => r.reviewedDate <= d(-90)).length;

  return (
    <PageShell
      title="Parental Responsibility Record"
      subtitle="Per-child legal status, PR holders, delegated authorities, and consent matrix"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="parental-responsibility-records" />
          <PrintButton title="Parental Responsibility Records" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Active Records</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{allSignedOff ? "100%" : `${data.filter((r) => r.signedOffByLA).length}/${total}`}</p>
          <p className="text-xs text-muted-foreground">LA Signed Off</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalCourtOrders}</p>
          <p className="text-xs text-muted-foreground">Active Court Orders</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className={cn("text-2xl font-bold", dueReview > 0 ? "text-amber-600" : "text-green-600")}>{dueReview}</p>
          <p className="text-xs text-muted-foreground">Reviews Overdue</p>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mb-6 flex items-start gap-2">
        <KeyRound className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">
          Parental Responsibility (PR) determines who can make decisions about a child. For looked-after
          children, PR is shared between parent(s) and Local Authority. The home holds delegated day-to-day
          authority. Knowing exactly who consents to what — and consulting the right parties — is fundamental
          to lawful, child-centred practice.
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
        {filtered.map((r) => {
          const isExpanded = expandedId === r.id;

          return (
            <div key={r.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : r.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Gavel className="h-5 w-5 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{getYPName(r.youngPerson)} &middot; {r.legalStatus}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Status since {r.legalStatusDate} &middot; {r.prHolders.filter((p) => p.current).length} PR holders &middot; Reviewed {r.reviewedDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {r.signedOffByLA && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  {/* PR Holders */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      <Users className="h-3 w-3 inline mr-1" />Who Holds Parental Responsibility
                    </p>
                    <div className="space-y-2">
                      {r.prHolders.map((p, i) => (
                        <div key={i} className={cn("rounded-lg p-3 border", p.current ? "bg-white" : "bg-slate-100 opacity-75")}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium">{p.party}</p>
                            <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                              p.current ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-700"
                            )}>
                              {p.current ? "Current" : "Ended"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{p.partyType} &middot; Acquired {p.acquired} on {p.acquiredDate}</p>
                          {!p.current && p.endedDate && <p className="text-xs text-muted-foreground">Ended {p.endedDate}: {p.endedReason}</p>}
                          <p className="text-xs mt-1">{p.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Court Orders */}
                  {r.courtOrdersInPlace.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-2">
                        <Gavel className="h-3 w-3 inline mr-1" />Court Orders in Place
                      </p>
                      <div className="space-y-1">
                        {r.courtOrdersInPlace.map((c, i) => (
                          <div key={i} className="bg-white rounded-lg p-2 border text-sm">
                            <p className="font-medium">{c.order}</p>
                            <p className="text-xs text-muted-foreground">Issued {c.dateIssued} &middot; Expiry: {c.expiry}</p>
                            <p className="text-xs">{c.terms}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delegated Authority */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Delegated Authorities</p>
                    <div className="space-y-1">
                      {r.delegatedAuthorities.map((d, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{d.category}</span>
                            <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                              d.delegatedTo === "Home" ? "bg-green-100 text-green-800" :
                              d.delegatedTo === "LA Director" ? "bg-amber-100 text-amber-800" :
                              "bg-blue-100 text-blue-800"
                            )}>
                              {d.delegatedTo}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{d.rationale}</p>
                          {d.exceptions.length > 0 && (
                            <ul className="mt-1 space-y-0.5">
                              {d.exceptions.map((e, ei) => (
                                <li key={ei} className="text-xs text-amber-700 flex items-start gap-1">
                                  <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                                  <span>{e}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Consent Matrix */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Consent Matrix (Common Decisions)</p>
                    <div className="space-y-1">
                      {r.consentMatrix.map((c, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm flex items-center justify-between">
                          <div>
                            <p className="font-medium">{c.activity}</p>
                            <p className="text-xs text-muted-foreground">{c.whoConsents}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">Last: {c.lastUsed}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Identity Documents */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      <FileText className="h-3 w-3 inline mr-1" />Identity Documents
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      {r.identityDocuments.map((d, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 border text-sm flex items-center justify-between">
                          <span>{d.document}</span>
                          <span className={cn("text-xs",
                            d.held ? "text-green-600" : "text-amber-600"
                          )}>
                            {d.held ? `Held (${d.location})` : `Not held — ${d.location}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Child Awareness</p>
                    <p className="text-sm">{r.childAwarenessOfStatus}</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">PR Complexity Notes</p>
                    <p className="text-sm">{r.parentalResponsibilityComplexNotes}</p>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">
                      <Heart className="h-3 w-3 inline mr-1" />Contact Arrangements
                    </p>
                    <p className="text-sm">{r.contactArrangements}</p>
                  </div>

                  {r.prohibitedSteps.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-800 uppercase tracking-wide mb-1">
                        <AlertCircle className="h-3 w-3 inline mr-1" />Prohibited Steps
                      </p>
                      <ul className="space-y-1">
                        {r.prohibitedSteps.map((s, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <span className="text-red-600 mt-0.5">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span>Reviewed: {r.reviewedDate} by {getStaffName(r.reviewedBy)}</span>
                    {r.signedOffByLA && <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">LA Signed Off</span>}
                    <span>{r.routinelyConsultedParties.length} parties routinely consulted</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Parental Responsibility records support Children Act 1989,
          Care Planning Regulations 2010, Quality Standard 4 (the child&apos;s plan), and Quality Standard 13.
          Reviewed at every LAC review, when legal status changes, or when delegated authorities are
          revisited. Linked to Delegated Authority page, Court Orders, and Consent Records.
        </p>
      </div>
    </PageShell>
  );
}
