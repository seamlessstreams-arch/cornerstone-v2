"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — ASSESSMENT OF NEED
// Care Planning, Placement and Case Review (England) Regulations 2010, Reg 14
// (28-day report) — Children's Homes Quality Standard 4 (Education /
// Care, in conjunction with Standard 1)
// Comprehensive baseline assessment on or shortly after admission that informs
// the care plan.
// ══════════════════════════════════════════════════════════════════════════════

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
  ClipboardList, Clock, AlertTriangle, CheckCircle2, Layers,
  Users, Heart, GraduationCap, Sparkles, Home, Sun, Compass,
  Shield, Stethoscope, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getStaffName, getYPName } from "@/lib/seed-data";

/* ── types ─────────────────────────────────────────────────────────────────── */

type Domain =
  | "Health"
  | "Education"
  | "Identity"
  | "Family & Social"
  | "Behavioural & Emotional"
  | "Self-Care & Practical"
  | "Spiritual & Cultural";

type Complexity = "Low" | "Moderate" | "Complex" | "Highly complex";

interface DomainAssessment {
  domain: Domain;
  presentingNeeds: string[];
  strengths: string[];
  priorities: string[];
  immediateActions: string[];
}

interface NeedsAssessment {
  id: string;
  youngPerson: string;
  assessmentDate: string;
  completedBy: string;
  assessmentVersion: number;
  arrivalDate: string;
  statutoryDeadline: string;
  completedWithinDeadline: boolean;
  domainAssessments: DomainAssessment[];
  overallNeedComplexity: Complexity;
  childInputMethod: string;
  childInput: string;
  familyInput: string;
  professionalsConsulted: string[];
  keyRisks: string[];
  keyProtectiveFactors: string[];
  recommendedInterventions: string[];
  accommodationsRecommended: string[];
  pedagogicalApproachIdentified: string;
  reviewSchedule: string;
  sharedWithLA: boolean;
  sharedDate: string;
  signedOffByRM: boolean;
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const COMPLEXITY_CLR: Record<Complexity, string> = {
  "Low":             "bg-green-100 text-green-800",
  "Moderate":        "bg-yellow-100 text-yellow-800",
  "Complex":         "bg-orange-100 text-orange-800",
  "Highly complex":  "bg-red-100 text-red-800",
};

const COMPLEXITY_BORDER: Record<Complexity, string> = {
  "Low":             "border-l-green-400",
  "Moderate":        "border-l-yellow-400",
  "Complex":         "border-l-orange-500",
  "Highly complex":  "border-l-red-600",
};

const DOMAIN_ICON: Record<Domain, React.ElementType> = {
  "Health":                 Stethoscope,
  "Education":              GraduationCap,
  "Identity":               Sparkles,
  "Family & Social":        Users,
  "Behavioural & Emotional":Heart,
  "Self-Care & Practical":  Home,
  "Spiritual & Cultural":   Sun,
};

const DOMAIN_CLR: Record<Domain, string> = {
  "Health":                 "bg-rose-50 text-rose-700 border-rose-200",
  "Education":              "bg-blue-50 text-blue-700 border-blue-200",
  "Identity":               "bg-amber-50 text-amber-700 border-amber-200",
  "Family & Social":        "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Behavioural & Emotional":"bg-violet-50 text-violet-700 border-violet-200",
  "Self-Care & Practical":  "bg-sky-50 text-sky-700 border-sky-200",
  "Spiritual & Cultural":   "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
};

const COMPLEXITIES: Complexity[] = ["Low", "Moderate", "Complex", "Highly complex"];

/* ── seed data ─────────────────────────────────────────────────────────────── */

const SEED: NeedsAssessment[] = [
  {
    id: "aon_alex",
    youngPerson: "yp_alex",
    assessmentDate: d(-22),
    completedBy: "staff_darren",
    assessmentVersion: 1,
    arrivalDate: d(-30),
    statutoryDeadline: d(-2),
    completedWithinDeadline: true,
    domainAssessments: [
      {
        domain: "Health",
        presentingNeeds: [
          "Mild asthma — uses salbutamol inhaler PRN",
          "Disrupted sleep pattern; often awake until 01:00",
          "Dental check-up overdue (last seen 18 months ago)",
        ],
        strengths: [
          "Engages with health appointments when prepared in advance",
          "Good general nutrition; enjoys cooking",
        ],
        priorities: [
          "Re-register with local GP, dentist and optician",
          "Establish consistent bedtime routine",
        ],
        immediateActions: [
          "GP appointment booked for week 2",
          "Asthma plan copied to medication folder",
        ],
      },
      {
        domain: "Education",
        presentingNeeds: [
          "Year 10 — currently out of school for 6 weeks",
          "Reading age below chronological age (last assessed)",
          "Strong interest in sport, particularly football",
        ],
        strengths: [
          "Good verbal communication and quick on practical tasks",
          "Engaged well with previous PE teacher",
        ],
        priorities: [
          "Secure school place / interim AP within 20 working days (Virtual School)",
          "Reading support; consider 1:1 tuition",
        ],
        immediateActions: [
          "PEP meeting booked with Virtual School",
          "Tutoring referral submitted",
        ],
      },
      {
        domain: "Identity",
        presentingNeeds: [
          "Mixed Black-British / White-British heritage — wishes to learn more about paternal heritage",
          "Identifies as male, no questioning recorded",
        ],
        strengths: [
          "Confident in cultural identity, articulate about heritage",
        ],
        priorities: [
          "Identity life-story work to be planned with key worker",
        ],
        immediateActions: [
          "Hair-care products sourced; barber linked in",
        ],
      },
      {
        domain: "Family & Social",
        presentingNeeds: [
          "Supervised contact with mother fortnightly (LA arranged)",
          "No contact with father (no order in place — mother's wish)",
          "Two younger siblings in separate placement",
        ],
        strengths: [
          "Strong attachment to maternal grandmother",
          "Maintains friendship with two peers from previous placement",
        ],
        priorities: [
          "Sibling contact plan to be drafted with SW",
          "Telephone contact with grandmother to be facilitated weekly",
        ],
        immediateActions: [
          "First contact session arranged for week 3",
        ],
      },
      {
        domain: "Behavioural & Emotional",
        presentingNeeds: [
          "Verbal escalation when feeling unheard, lasting 5–15 minutes",
          "Trauma history — exposure to domestic abuse age 4–7",
          "Underlying anxiety, particularly at transitions",
        ],
        strengths: [
          "Responds well to clear, predictable routines",
          "Uses humour and football as natural regulation",
        ],
        priorities: [
          "CAMHS referral for trauma-focused work",
          "Behaviour Support Plan to mirror de-escalation strategies",
        ],
        immediateActions: [
          "CAMHS referral submitted",
          "PACE-informed approach agreed across team",
        ],
      },
      {
        domain: "Self-Care & Practical",
        presentingNeeds: [
          "Personal hygiene generally good; needs prompts at weekends",
          "Limited independent travel experience",
        ],
        strengths: [
          "Manages own laundry with light supervision",
          "Confident food preparation — toast, pasta, eggs",
        ],
        priorities: [
          "Build local travel confidence (bus to school)",
        ],
        immediateActions: [
          "Travel-training plan agreed with key worker",
        ],
      },
      {
        domain: "Spiritual & Cultural",
        presentingNeeds: [
          "Family follows Christian (non-denominational) faith — Alex 'unsure'",
        ],
        strengths: [
          "Open to exploring faith and culture; enjoys family events",
        ],
        priorities: [
          "Offer choice of attending church / cultural events",
        ],
        immediateActions: [
          "Cultural calendar discussed during induction",
        ],
      },
    ],
    overallNeedComplexity: "Moderate",
    childInputMethod: "Two key-work sessions and a 'My Voice' booklet",
    childInput:
      "Alex told us he wants 'a place that feels like home, not a hotel'. He asked for football to be part of his weekly plan, that adults give him a heads-up before changes, and that he sees his nan and brothers more than he did before.",
    familyInput:
      "Mother contributed by phone — she emphasised Alex's love of football, his close relationship with his maternal grandmother and his asthma. Maternal grandmother provided wider history and cultural context.",
    professionalsConsulted: [
      "Social Worker — Karen Holding",
      "Virtual School Co-ordinator — N. Patel",
      "Previous foster carer (briefly, with consent)",
      "GP — Dr Singh",
      "CAMHS Single Point of Access",
    ],
    keyRisks: [
      "Educational disengagement if school place not secured promptly",
      "Anxiety-driven escalation at transitions / unannounced changes",
      "Loss of sibling relationships if contact not maintained",
    ],
    keyProtectiveFactors: [
      "Strong relationship with maternal grandmother",
      "Sport (football) as positive outlet",
      "Articulate self-advocate when supported",
    ],
    recommendedInterventions: [
      "CAMHS trauma-focused work",
      "Weekly 1:1 key-work sessions using PACE",
      "Reading-age-appropriate tutoring",
      "Sibling contact plan",
    ],
    accommodationsRecommended: [
      "Inhaler stored in bedroom and downstairs first-aid kit",
      "Visual weekly planner on bedroom door",
      "Advance notice (24 hrs) of any change to routine",
    ],
    pedagogicalApproachIdentified:
      "PACE-led therapeutic parenting (Playfulness, Acceptance, Curiosity, Empathy) with structured predictability. Sport used as relational and regulatory anchor. Trauma-informed lens applied to all transitions.",
    reviewSchedule:
      "First review at 28 days (now), then within first LAC review (20 days post-placement already held), then 3-monthly aligned to LAC reviews.",
    sharedWithLA: true,
    sharedDate: d(-1),
    signedOffByRM: true,
  },
  {
    id: "aon_jordan",
    youngPerson: "yp_jordan",
    assessmentDate: d(-15),
    completedBy: "staff_anna",
    assessmentVersion: 1,
    arrivalDate: d(-20),
    statutoryDeadline: d(8),
    completedWithinDeadline: true,
    domainAssessments: [
      {
        domain: "Health",
        presentingNeeds: [
          "Diagnosed ADHD — currently on methylphenidate XR 27mg morning",
          "Eczema flares with stress",
          "Medication review due in 6 weeks",
        ],
        strengths: [
          "Takes medication consistently when reminded",
          "Will articulate when feeling unwell",
        ],
        priorities: [
          "Continuity of CAMHS prescriber",
          "Eczema-management plan documented",
        ],
        immediateActions: [
          "Pharmacy switched to local provider",
          "CAMHS prescriber transfer requested",
        ],
      },
      {
        domain: "Education",
        presentingNeeds: [
          "Year 9 — attending mainstream secondary, Cherrywood",
          "EHCP in place; SEMH and ADHD recognised",
          "History of fixed-term suspensions (verbal disruption)",
        ],
        strengths: [
          "Interested in DT, music and graphic design",
          "Positive relationship with Head of Year",
        ],
        priorities: [
          "PEP within 10 working days",
          "Reasonable adjustments embedded — movement breaks, time out card",
        ],
        immediateActions: [
          "PEP scheduled",
          "Reasonable-adjustments meeting booked with school SENCO",
        ],
      },
      {
        domain: "Identity",
        presentingNeeds: [
          "White British, identifies as male",
          "Newly disclosed bisexuality — wants this kept confidential outside the home",
        ],
        strengths: [
          "Self-aware, articulate about identity",
        ],
        priorities: [
          "Confidentiality respected; key worker support offered",
          "Local LGBTQ+ youth resources offered, not imposed",
        ],
        immediateActions: [
          "Confidentiality plan documented in care record",
        ],
      },
      {
        domain: "Family & Social",
        presentingNeeds: [
          "Older sister (18) is significant attachment figure — lives independently",
          "No contact with mother (court-ordered no contact)",
          "Father deceased",
        ],
        strengths: [
          "Sister actively involved, attends meetings when invited",
        ],
        priorities: [
          "Weekly contact with sister maintained",
          "Anniversary of father's death (next month) — supportive plan needed",
        ],
        immediateActions: [
          "Sister added to approved contact list",
          "Anniversary support plan drafted",
        ],
      },
      {
        domain: "Behavioural & Emotional",
        presentingNeeds: [
          "Impulsivity linked to ADHD; risk-taking behaviour (skateboarding without pads)",
          "Low mood at evenings / weekends",
          "History of self-harm (superficial scratching) — none in last 4 months",
        ],
        strengths: [
          "Open to talking when calm",
          "Music as regulation tool",
        ],
        priorities: [
          "Continued CAMHS engagement",
          "Self-harm safety plan reviewed monthly",
        ],
        immediateActions: [
          "Risk and safety plan in place",
          "Sharps audit on bedroom completed with consent",
        ],
      },
      {
        domain: "Self-Care & Practical",
        presentingNeeds: [
          "Inconsistent personal hygiene without prompts",
          "Spends evening pocket money quickly — limited budgeting skills",
        ],
        strengths: [
          "Cooks simple meals confidently",
          "Tidy in own room",
        ],
        priorities: [
          "Hygiene routine card with key worker",
          "Pocket-money / budgeting work",
        ],
        immediateActions: [
          "Routine card created and agreed",
        ],
      },
      {
        domain: "Spiritual & Cultural",
        presentingNeeds: [
          "No religious affiliation; values nature and music as personal meaning",
        ],
        strengths: [
          "Reflective, comfortable discussing values",
        ],
        priorities: [
          "Outdoor / nature-based activity to be embedded weekly",
        ],
        immediateActions: [
          "Wednesday woodland walk added to plan",
        ],
      },
    ],
    overallNeedComplexity: "Complex",
    childInputMethod: "One-page profile workshop and recorded voice memos",
    childInput:
      "Jordan said the most important things were 'people not making a big deal of stuff', having his sister visit, being able to listen to music in his room, and not being told off in front of others. He asked us to 'check in but not crowd'.",
    familyInput:
      "Older sister contributed in person — gave background on family bereavement, pointed out music and skateboarding as positive interests, and asked the team to be patient on anniversaries.",
    professionalsConsulted: [
      "Social Worker — Marcus Lane",
      "CAMHS — Dr Aldrin (prescriber)",
      "School SENCO — Cherrywood",
      "Virtual School Co-ordinator",
      "Previous keyworker (with consent)",
    ],
    keyRisks: [
      "Self-harm relapse during low mood / anniversary",
      "Educational suspension if reasonable adjustments not embedded",
      "Risk-taking impulsivity (skateboarding, road safety)",
    ],
    keyProtectiveFactors: [
      "Sister's active involvement",
      "Music and creative outlets",
      "EHCP and CAMHS engagement",
    ],
    recommendedInterventions: [
      "Continued CAMHS support and prescribing",
      "Self-harm safety plan, monthly review",
      "Music / creative activity programme",
      "Anniversary support plan",
    ],
    accommodationsRecommended: [
      "Quiet space in evenings",
      "Consistent medication time and prompts",
      "Confidentiality protocol (sexuality)",
      "Helmet & pads non-negotiable for skateboarding",
    ],
    pedagogicalApproachIdentified:
      "Trauma-informed, attuned and rights-respecting. Combines social-pedagogical 'common third' (shared activities — woodland walks, music) with consistent ADHD-aware structure. PACE used at points of dysregulation; agency and choice maximised wherever safe.",
    reviewSchedule:
      "28-day report (now), 3-month review aligned with first looked-after review post 20-day, then 6-monthly or sooner if presentation changes.",
    sharedWithLA: true,
    sharedDate: d(-14),
    signedOffByRM: true,
  },
  {
    id: "aon_casey",
    youngPerson: "yp_casey",
    assessmentDate: d(-5),
    completedBy: "staff_chervelle",
    assessmentVersion: 1,
    arrivalDate: d(-10),
    statutoryDeadline: d(18),
    completedWithinDeadline: true,
    domainAssessments: [
      {
        domain: "Health",
        presentingNeeds: [
          "Iron-deficiency anaemia — on ferrous sulphate",
          "Possible undiagnosed sensory differences (under exploration)",
          "Initial Health Assessment outstanding",
        ],
        strengths: [
          "Co-operates with familiar adults during health tasks",
        ],
        priorities: [
          "Initial Health Assessment booked within statutory 20 days",
          "Sensory profile referral via OT",
        ],
        immediateActions: [
          "IHA appointment confirmed for week 3",
          "OT referral submitted",
        ],
      },
      {
        domain: "Education",
        presentingNeeds: [
          "Year 8 — currently no school place (transferred LA area)",
          "Significant attendance gap last academic year (54%)",
          "Suspected gaps in literacy and numeracy",
        ],
        strengths: [
          "Strong creative / artistic interest",
          "Engages well in 1:1 tutoring",
        ],
        priorities: [
          "School place secured within 20 working days",
          "Cognitive / educational baseline assessment",
        ],
        immediateActions: [
          "Virtual School urgent referral",
          "Interim 1:1 tutor sourced",
        ],
      },
      {
        domain: "Identity",
        presentingNeeds: [
          "Dual heritage (White British / Pakistani heritage)",
          "Currently exploring gender; uses they/them pronouns at home, she/her at school",
          "Wishes to be supported at their pace",
        ],
        strengths: [
          "Articulate about identity, has done own research",
        ],
        priorities: [
          "Pronouns respected; staff trained on use",
          "Cultural foods and resources reflective of heritage",
        ],
        immediateActions: [
          "Pronoun guidance shared with team",
          "Cultural-foods plan agreed with key worker",
        ],
      },
      {
        domain: "Family & Social",
        presentingNeeds: [
          "Contact with mother weekly, supervised",
          "Maternal aunt as positive figure — letterbox contact",
          "No contact with father (safeguarding concern)",
        ],
        strengths: [
          "Maternal aunt consistently engaged for 3+ years",
        ],
        priorities: [
          "Risk-managed contact plan",
          "Letterbox contact with aunt facilitated monthly",
        ],
        immediateActions: [
          "Contact risk assessment completed",
        ],
      },
      {
        domain: "Behavioural & Emotional",
        presentingNeeds: [
          "Significant trauma history including neglect and one disclosed CSE incident (historic, prosecuted)",
          "Dissociative episodes when anxious — short, well-recognised",
          "Low self-esteem; struggles to accept positive feedback",
        ],
        strengths: [
          "Insight into own coping strategies",
          "Forms attachments with consistent adults",
        ],
        priorities: [
          "Specialist trauma therapy referral",
          "Dissociation safety plan",
          "Daily relational consistency — same key adults wherever possible",
        ],
        immediateActions: [
          "Specialist therapy referral submitted",
          "Dissociation plan in place and shared with school",
        ],
      },
      {
        domain: "Self-Care & Practical",
        presentingNeeds: [
          "Sleep onset difficulty",
          "Limited cooking and laundry experience",
        ],
        strengths: [
          "Enjoys art and creative making",
          "Will try new tasks with patient adult support",
        ],
        priorities: [
          "Bedtime wind-down routine",
          "Practical-skills programme (cooking, laundry)",
        ],
        immediateActions: [
          "Wind-down kit placed in bedroom (lavender, weighted blanket per preference)",
        ],
      },
      {
        domain: "Spiritual & Cultural",
        presentingNeeds: [
          "Wishes to learn more about Islamic heritage from paternal side, despite no contact",
          "Curious rather than practising",
        ],
        strengths: [
          "Open and curious about faith and identity",
        ],
        priorities: [
          "Heritage-informed life-story work",
          "Cultural events and community access where safe",
        ],
        immediateActions: [
          "Library books and trusted online resources sourced",
        ],
      },
    ],
    overallNeedComplexity: "Highly complex",
    childInputMethod: "Creative arts session with key worker; written notes by Casey",
    childInput:
      "Casey wrote that they want to feel safe, not be asked too many questions at once, and to keep their drawing things in a private drawer. They asked for staff to remember their pronouns 'without it being a big deal' and to have one trusted adult to go to first.",
    familyInput:
      "Mother (supervised) shared early childhood memories and confirmed Casey's diet preferences. Maternal aunt provided cultural and family heritage context via letter.",
    professionalsConsulted: [
      "Social Worker — Priya Desai",
      "IRO — D. Watson",
      "Designated Doctor LAC",
      "Specialist trauma therapist (referral pending)",
      "Virtual School Co-ordinator",
      "CSE worker (historic case, closed)",
    ],
    keyRisks: [
      "Re-traumatisation if contact / professional involvement not carefully managed",
      "Educational drift if school place delayed",
      "Dissociation in unfamiliar environments",
    ],
    keyProtectiveFactors: [
      "Strong insight and self-advocacy",
      "Maternal aunt as consistent figure",
      "Creative outlets",
    ],
    recommendedInterventions: [
      "Specialist trauma therapy",
      "Sensory / OT assessment",
      "Heritage and identity-affirming life-story work",
      "Daily relational consistency with named adults",
    ],
    accommodationsRecommended: [
      "They/them pronouns at home, she/her at school respected",
      "Private drawer for personal items",
      "Wind-down routine, low-stimulation bedroom lighting",
      "Two named key adults rather than rotating staff",
    ],
    pedagogicalApproachIdentified:
      "Therapeutic, trauma-informed care drawing on attachment-based parenting and social pedagogy. The 'three Ps' (Personal, Private, Professional) used to balance closeness and boundaries; relational consistency prioritised over task efficiency. Identity-affirming and culturally responsive practice underpins all domains.",
    reviewSchedule:
      "28-day report (in 18 days), 3-month review at first LAC review, then aligned to LAC reviews and CAMHS reviews — sooner if dissociative episodes increase.",
    sharedWithLA: false,
    sharedDate: "",
    signedOffByRM: false,
  },
];

/* ── page ──────────────────────────────────────────────────────────────────── */

export default function AssessmentOfNeedPage() {
  const [data] = useState<NeedsAssessment[]>(SEED);
  const [search, setSearch] = useState("");
  const [filterYP, setFilterYP] = useState("all");
  const [filterComplexity, setFilterComplexity] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId((p) => (p === id ? null : id));

  /* ── derived ─────────────────────────────────────────────────────────────── */

  const filtered = useMemo(() => {
    let rows = data.filter((r) => {
      if (filterYP !== "all" && r.youngPerson !== filterYP) return false;
      if (filterComplexity !== "all" && r.overallNeedComplexity !== filterComplexity) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          getYPName(r.youngPerson).toLowerCase().includes(q) ||
          r.childInput.toLowerCase().includes(q) ||
          r.pedagogicalApproachIdentified.toLowerCase().includes(q) ||
          r.keyRisks.some((k) => k.toLowerCase().includes(q)) ||
          r.recommendedInterventions.some((k) => k.toLowerCase().includes(q))
        );
      }
      return true;
    });

    rows = [...rows].sort((a, b) => {
      switch (sortBy) {
        case "date-desc": return b.assessmentDate.localeCompare(a.assessmentDate);
        case "date-asc":  return a.assessmentDate.localeCompare(b.assessmentDate);
        case "complexity": {
          const order: Complexity[] = ["Low", "Moderate", "Complex", "Highly complex"];
          return order.indexOf(b.overallNeedComplexity) - order.indexOf(a.overallNeedComplexity);
        }
        case "yp": return getYPName(a.youngPerson).localeCompare(getYPName(b.youngPerson));
        default: return 0;
      }
    });
    return rows;
  }, [data, search, filterYP, filterComplexity, sortBy]);

  /* ── stats ───────────────────────────────────────────────────────────────── */

  const activeAssessments = data.length;
  const withinDeadlinePct = data.length === 0
    ? 0
    : Math.round((data.filter((r) => r.completedWithinDeadline).length / data.length) * 100);
  const complexCount = data.filter(
    (r) => r.overallNeedComplexity === "Complex" || r.overallNeedComplexity === "Highly complex",
  ).length;

  // "Reviews due" — assessment is older than 21 days OR not yet signed off
  const reviewsDue = useMemo(() => {
    const today = new Date();
    return data.filter((r) => {
      if (!r.signedOffByRM) return true;
      const ad = new Date(r.assessmentDate);
      const days = Math.round((today.getTime() - ad.getTime()) / (1000 * 60 * 60 * 24));
      return days >= 21;
    }).length;
  }, [data]);

  const yps = Array.from(new Set(data.map((r) => r.youngPerson)));

  /* ── export ──────────────────────────────────────────────────────────────── */

  const exportCols: ExportColumn<NeedsAssessment>[] = [
    { header: "Young Person", accessor: (r: NeedsAssessment) => getYPName(r.youngPerson) },
    { header: "Assessment Date", accessor: (r: NeedsAssessment) => r.assessmentDate },
    { header: "Completed By", accessor: (r: NeedsAssessment) => getStaffName(r.completedBy) },
    { header: "Version", accessor: (r: NeedsAssessment) => String(r.assessmentVersion) },
    { header: "Arrival Date", accessor: (r: NeedsAssessment) => r.arrivalDate },
    { header: "Statutory Deadline", accessor: (r: NeedsAssessment) => r.statutoryDeadline },
    { header: "Within Deadline", accessor: (r: NeedsAssessment) => r.completedWithinDeadline ? "Yes" : "No" },
    { header: "Complexity", accessor: (r: NeedsAssessment) => r.overallNeedComplexity },
    { header: "Domains Assessed", accessor: (r: NeedsAssessment) => r.domainAssessments.map((da) => da.domain).join("; ") },
    { header: "Child Input Method", accessor: (r: NeedsAssessment) => r.childInputMethod },
    { header: "Child Input", accessor: (r: NeedsAssessment) => r.childInput },
    { header: "Family Input", accessor: (r: NeedsAssessment) => r.familyInput },
    { header: "Professionals Consulted", accessor: (r: NeedsAssessment) => r.professionalsConsulted.join("; ") },
    { header: "Key Risks", accessor: (r: NeedsAssessment) => r.keyRisks.join("; ") },
    { header: "Protective Factors", accessor: (r: NeedsAssessment) => r.keyProtectiveFactors.join("; ") },
    { header: "Recommended Interventions", accessor: (r: NeedsAssessment) => r.recommendedInterventions.join("; ") },
    { header: "Accommodations", accessor: (r: NeedsAssessment) => r.accommodationsRecommended.join("; ") },
    { header: "Pedagogical Approach", accessor: (r: NeedsAssessment) => r.pedagogicalApproachIdentified },
    { header: "Review Schedule", accessor: (r: NeedsAssessment) => r.reviewSchedule },
    { header: "Shared With LA", accessor: (r: NeedsAssessment) => r.sharedWithLA ? `Yes (${r.sharedDate})` : "No" },
    { header: "Signed Off By RM", accessor: (r: NeedsAssessment) => r.signedOffByRM ? "Yes" : "No" },
  ];

  /* ── render ──────────────────────────────────────────────────────────────── */

  return (
    <PageShell
      title="Assessment of Need"
      subtitle="Care Planning Regulations 2010, Reg 14 (28-day report) · Quality Standard 4 — comprehensive baseline assessment on admission"
      actions={
        <div className="flex items-center gap-2">
          <PrintButton title="Assessment of Need" />
          <ExportButton data={filtered} columns={exportCols} filename="assessment-of-need" />
        </div>
      }
    >
      <div id="print-area">
        {/* ── stat strip ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Active Assessments", value: activeAssessments, icon: ClipboardList, clr: "text-indigo-600" },
            { label: "Within Deadline", value: `${withinDeadlinePct}%`, icon: CheckCircle2, clr: withinDeadlinePct === 100 ? "text-green-600" : "text-amber-600" },
            { label: "Complex / Highly Complex", value: complexCount, icon: Layers, clr: complexCount > 0 ? "text-orange-600" : "text-slate-600" },
            { label: "Reviews Due", value: reviewsDue, icon: Clock, clr: reviewsDue > 0 ? "text-amber-600" : "text-green-600" },
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

        {/* ── overdue / unsigned alert ──────────────────────────────────────── */}
        {data.some((r) => !r.signedOffByRM) && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-amber-800">
                {data.filter((r) => !r.signedOffByRM).length} assessment(s) awaiting RM sign-off
              </p>
              <p className="text-amber-700">
                Reg 14 requires that the registered manager review and approve each assessment of need before it
                informs the care plan. Unshared assessments must be sent to the placing authority.
              </p>
            </div>
          </div>
        )}

        {/* ── filters ───────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search child, voice, risks, interventions…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterYP} onValueChange={setFilterYP}>
            <SelectTrigger className="w-[160px]"><Filter className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Children</SelectItem>
              {yps.map((y) => (<SelectItem key={y} value={y}>{getYPName(y)}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={filterComplexity} onValueChange={setFilterComplexity}>
            <SelectTrigger className="w-[180px]"><Filter className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Complexity</SelectItem>
              {COMPLEXITIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[170px]"><ArrowUpDown className="h-4 w-4 mr-1" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="complexity">By Complexity</SelectItem>
              <SelectItem value="yp">By Child</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ── records ───────────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {filtered.map((r) => {
            const open = expandedId === r.id;
            return (
              <Card
                key={r.id}
                className={cn(
                  "border-l-4",
                  COMPLEXITY_BORDER[r.overallNeedComplexity],
                  !r.signedOffByRM && "ring-1 ring-amber-300",
                )}
              >
                <CardHeader className="pb-2 cursor-pointer" onClick={() => toggle(r.id)}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                        {getYPName(r.youngPerson)}
                        <Badge variant="outline" className={COMPLEXITY_CLR[r.overallNeedComplexity]}>
                          {r.overallNeedComplexity}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-50">
                          v{r.assessmentVersion} · {r.assessmentVersion === 1 ? "Initial" : "Updated"}
                        </Badge>
                        {r.completedWithinDeadline ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> On Time
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Late
                          </Badge>
                        )}
                        {!r.signedOffByRM && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                            Awaiting RM Sign-off
                          </Badge>
                        )}
                        {!r.sharedWithLA && (
                          <Badge variant="outline" className="bg-orange-100 text-orange-800">
                            Not Shared with LA
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Assessed {r.assessmentDate} · arrival {r.arrivalDate} · deadline {r.statutoryDeadline} · by {getStaffName(r.completedBy)}
                      </p>
                    </div>
                    {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </CardHeader>

                {open && (
                  <CardContent className="pt-0 space-y-5 text-sm">
                    {/* domains */}
                    <div>
                      <p className="font-medium mb-2 flex items-center gap-1">
                        <Layers className="h-4 w-4" /> Domain Assessments
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {r.domainAssessments.map((da) => {
                          const Icon = DOMAIN_ICON[da.domain];
                          return (
                            <div
                              key={da.domain}
                              className={cn("rounded-lg border p-3", DOMAIN_CLR[da.domain])}
                            >
                              <p className="font-semibold flex items-center gap-1.5 mb-2 text-sm">
                                <Icon className="h-4 w-4" /> {da.domain}
                              </p>
                              <div className="space-y-2 text-xs">
                                <div>
                                  <p className="font-semibold uppercase tracking-wide text-[10px] opacity-80 mb-0.5">Presenting Needs</p>
                                  <ul className="list-disc list-inside space-y-0.5">
                                    {da.presentingNeeds.map((n, i) => (<li key={i}>{n}</li>))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="font-semibold uppercase tracking-wide text-[10px] opacity-80 mb-0.5">Strengths</p>
                                  <ul className="list-disc list-inside space-y-0.5">
                                    {da.strengths.map((n, i) => (<li key={i}>{n}</li>))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="font-semibold uppercase tracking-wide text-[10px] opacity-80 mb-0.5">Priorities</p>
                                  <ul className="list-disc list-inside space-y-0.5">
                                    {da.priorities.map((n, i) => (<li key={i}>{n}</li>))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="font-semibold uppercase tracking-wide text-[10px] opacity-80 mb-0.5">Immediate Actions</p>
                                  <ul className="list-disc list-inside space-y-0.5">
                                    {da.immediateActions.map((n, i) => (<li key={i}>{n}</li>))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* voice */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-lg border border-indigo-200 bg-indigo-50/40 p-3">
                        <p className="font-semibold text-indigo-800 flex items-center gap-1 mb-1">
                          <MessageSquare className="h-4 w-4" /> Child&apos;s Voice
                        </p>
                        <p className="text-xs text-slate-700 mb-1"><span className="font-medium">Method:</span> {r.childInputMethod}</p>
                        <p className="text-xs text-slate-700">{r.childInput}</p>
                      </div>
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-3">
                        <p className="font-semibold text-emerald-800 flex items-center gap-1 mb-1">
                          <Users className="h-4 w-4" /> Family Input
                        </p>
                        <p className="text-xs text-slate-700">{r.familyInput}</p>
                      </div>
                    </div>

                    {/* professionals */}
                    <div>
                      <p className="font-medium mb-1">Professionals Consulted</p>
                      <div className="flex flex-wrap gap-1.5">
                        {r.professionalsConsulted.map((p, i) => (
                          <Badge key={i} variant="outline" className="bg-slate-50 text-xs">
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* risks / protective */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-lg border border-red-200 bg-red-50/40 p-3">
                        <p className="font-semibold text-red-800 flex items-center gap-1 mb-1">
                          <AlertTriangle className="h-4 w-4" /> Key Risks
                        </p>
                        <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                          {r.keyRisks.map((k, i) => (<li key={i}>{k}</li>))}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-green-200 bg-green-50/40 p-3">
                        <p className="font-semibold text-green-800 flex items-center gap-1 mb-1">
                          <Shield className="h-4 w-4" /> Protective Factors
                        </p>
                        <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                          {r.keyProtectiveFactors.map((k, i) => (<li key={i}>{k}</li>))}
                        </ul>
                      </div>
                    </div>

                    {/* interventions / accommodations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="font-medium mb-1">Recommended Interventions</p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                          {r.recommendedInterventions.map((k, i) => (<li key={i}>{k}</li>))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Accommodations Recommended</p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                          {r.accommodationsRecommended.map((k, i) => (<li key={i}>{k}</li>))}
                        </ul>
                      </div>
                    </div>

                    {/* pedagogical approach */}
                    <div className="rounded-lg border border-violet-200 bg-violet-50/40 p-3">
                      <p className="font-semibold text-violet-800 flex items-center gap-1 mb-1">
                        <Compass className="h-4 w-4" /> Pedagogical Approach Identified
                      </p>
                      <p className="text-xs text-slate-700">{r.pedagogicalApproachIdentified}</p>
                    </div>

                    {/* review schedule */}
                    <div>
                      <p className="font-medium mb-1">Review Schedule</p>
                      <p className="text-xs text-muted-foreground">{r.reviewSchedule}</p>
                    </div>

                    {/* footer */}
                    <div className="flex flex-wrap justify-between items-center pt-2 border-t text-xs text-muted-foreground gap-2">
                      <span>Completed by: {getStaffName(r.completedBy)}</span>
                      <span>
                        {r.sharedWithLA
                          ? `Shared with LA: ${r.sharedDate}`
                          : "Not yet shared with LA"}
                      </span>
                      <span>{r.signedOffByRM ? "RM signed off" : "Awaiting RM sign-off"}</span>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* ── regulatory note ───────────────────────────────────────────────── */}
        <div className="mt-6 bg-muted/30 rounded-lg p-4 text-xs text-muted-foreground">
          <p className="font-semibold mb-1">Regulatory Framework</p>
          <p>
            Care Planning, Placement and Case Review (England) Regulations 2010, Reg 14 — within 28 days of
            placement the responsible authority must prepare a written assessment of need that informs and is
            consistent with the child&apos;s care plan. Children&apos;s Homes (England) Regulations 2015 and the
            Quality Standards (in particular Standard 1 — Care and Support, and Standard 4 — Education) require
            that the registered manager satisfies themselves the assessment is comprehensive, child-centred and
            up-to-date. Assessments must capture the child&apos;s wishes and feelings (Children Act 1989, s.22(4)),
            family input where appropriate, and consultation with relevant professionals (health, education,
            CAMHS, Virtual School). Each assessment must identify the therapeutic / pedagogical approach to be
            applied across the home and feed directly into the Care Plan, Behaviour Support Plan and Risk
            Assessment. Records retained until the child&apos;s 75th birthday (Reg 37, looked-after children).
          </p>
        </div>
      </div>
    </PageShell>
  );
}
