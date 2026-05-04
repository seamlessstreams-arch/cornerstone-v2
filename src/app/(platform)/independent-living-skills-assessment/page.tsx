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
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SkillLevel = "Not yet started" | "Emerging" | "Developing" | "Established" | "Mastered";

interface SkillAssessment {
  skill: string;
  level: SkillLevel;
  evidence: string;
  childSelfAssessment: SkillLevel;
  staffAssessment: SkillLevel;
  agreementBetweenChildAndStaff: boolean;
  nextSteps: string;
}

interface IndependenceAssessment {
  id: string;
  youngPerson: string;
  age: number;
  yearsToTransition: number;
  assessmentDate: string;
  assessor: string;
  domainAssessments: { domain: string; skills: SkillAssessment[]; domainSummary: string }[];
  overallReadiness: "Early-stage" | "Building foundations" | "Developing strongly" | "Approaching ready" | "Ready for next step";
  childAspirations: string;
  childWorries: string[];
  prioritySkillsForNextSixMonths: string[];
  pathwayLinks: string[];
  resourcesAllocated: string[];
  childAgreed: boolean;
  reviewedDate: string;
  nextAssessmentDue: string;
  notes: string;
}

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
};

const data: IndependenceAssessment[] = [
  {
    id: "ila-001",
    youngPerson: "yp_alex",
    age: 13,
    yearsToTransition: 5,
    assessmentDate: d(-30),
    assessor: "staff_anna",
    domainAssessments: [
      {
        domain: "Personal Care & Hygiene",
        skills: [
          { skill: "Daily hygiene routine without prompting", level: "Established", evidence: "Independent shower routine for 6+ months", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Maintain" },
          { skill: "Laundry — washing and drying clothes", level: "Developing", evidence: "Knows how to use machine; needs reminding to fold", childSelfAssessment: "Developing", staffAssessment: "Developing", agreementBetweenChildAndStaff: true, nextSteps: "Practise weekly" },
          { skill: "Wardrobe management — appropriate clothing for weather/activity", level: "Established", evidence: "Choices appropriate consistently", childSelfAssessment: "Mastered", staffAssessment: "Established", agreementBetweenChildAndStaff: false, nextSteps: "Acknowledge developing taste; gentle dialogue around discrepancy" },
        ],
        domainSummary: "Strong foundation in personal care. Laundry developing well. Confident self-presentation.",
      },
      {
        domain: "Cooking & Food Preparation",
        skills: [
          { skill: "Make basic breakfast independently", level: "Established", evidence: "Cereals, toast, simple eggs", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Add variety" },
          { skill: "Plan and cook a simple meal", level: "Developing", evidence: "Has cooked spaghetti bolognese, curry under guidance", childSelfAssessment: "Established", staffAssessment: "Developing", agreementBetweenChildAndStaff: false, nextSteps: "Plan-shop-cook cycle weekly" },
          { skill: "Food safety — temperatures, storage, expiry", level: "Emerging", evidence: "Aware of expiry dates; learning about safe temperatures", childSelfAssessment: "Developing", staffAssessment: "Emerging", agreementBetweenChildAndStaff: false, nextSteps: "Build into weekly routine" },
        ],
        domainSummary: "Cooking interest is genuine. Confidence outpaces actual technique slightly. Good area for ongoing development.",
      },
      {
        domain: "Money Management",
        skills: [
          { skill: "Pocket money budgeting", level: "Established", evidence: "Self-manages weekly £20", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Increase complexity" },
          { skill: "Saving for goals", level: "Established", evidence: "Saved for gaming console — £400+", childSelfAssessment: "Mastered", staffAssessment: "Established", agreementBetweenChildAndStaff: false, nextSteps: "Maintain" },
          { skill: "Understanding bank accounts and Junior ISA", level: "Developing", evidence: "Knows about Junior ISA, less clear on interest/growth", childSelfAssessment: "Emerging", staffAssessment: "Developing", agreementBetweenChildAndStaff: false, nextSteps: "Quarterly money learning session" },
          { skill: "Identifying scams and online fraud", level: "Emerging", evidence: "Aware of basic scams; needs more education", childSelfAssessment: "Developing", staffAssessment: "Emerging", agreementBetweenChildAndStaff: false, nextSteps: "Build into key working" },
        ],
        domainSummary: "Strong intuitive money management. Foundations laid for adult financial literacy.",
      },
      {
        domain: "Health & Wellbeing",
        skills: [
          { skill: "Knows own GP, dentist, optician", level: "Established", evidence: "Can name and locate", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Maintain" },
          { skill: "Manages own ADHD medication daily", level: "Established", evidence: "Takes medication with reminder; would like to fully self-manage by 14", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Build to full self-management" },
          { skill: "Recognises when to seek help (mental and physical)", level: "Developing", evidence: "Therapy is normal for Alex; physical health less so", childSelfAssessment: "Developing", staffAssessment: "Developing", agreementBetweenChildAndStaff: true, nextSteps: "Continue therapeutic work" },
        ],
        domainSummary: "Strong health awareness. Self-management of ADHD medication a key transition skill.",
      },
      {
        domain: "Education & Career",
        skills: [
          { skill: "Punctual attendance at school", level: "Established", evidence: "92% attendance maintained", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Maintain" },
          { skill: "Career exploration (next stage)", level: "Emerging", evidence: "Knows likes boxing; thinking about coaching as career", childSelfAssessment: "Emerging", staffAssessment: "Emerging", agreementBetweenChildAndStaff: true, nextSteps: "Career conversations and visits" },
        ],
        domainSummary: "Education recovering well. Career thinking emerging — boxing coaching aspiration to nurture.",
      },
      {
        domain: "Social & Community",
        skills: [
          { skill: "Maintains friendships independently", level: "Developing", evidence: "Two close friends; arranges meet-ups", childSelfAssessment: "Established", staffAssessment: "Developing", agreementBetweenChildAndStaff: false, nextSteps: "Continue with light support" },
          { skill: "Uses public transport confidently", level: "Emerging", evidence: "Can use familiar bus route alone; new routes need support", childSelfAssessment: "Developing", staffAssessment: "Emerging", agreementBetweenChildAndStaff: false, nextSteps: "Practice new routes monthly" },
          { skill: "Manages community boundaries (curfew, contact)", level: "Established", evidence: "Reliable", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Increase autonomy gradually" },
        ],
        domainSummary: "Solid social and community foundations. Public transport area for active development.",
      },
    ],
    overallReadiness: "Building foundations",
    childAspirations: "Become a boxing coach. Have own place by 18 (with support). Stay close to Mum and sister. Help kids who've had it tough.",
    childWorries: [
      "Money management as adult (especially scams)",
      "Loneliness — what if I don't have people?",
      "Failing somehow",
    ],
    prioritySkillsForNextSixMonths: [
      "Build ADHD medication full self-management",
      "Cooking — plan-shop-cook cycle weekly",
      "Money management complexity — bills awareness",
      "Public transport — new routes monthly",
      "Career conversations and visits",
    ],
    pathwayLinks: ["Independence Pathway page", "Care Plan", "Personal Education Plan", "Pathway Plan (will activate at 16)"],
    resourcesAllocated: ["Weekly cooking session", "Independent travel training (booked)", "Career visit to boxing coaching event"],
    childAgreed: true,
    reviewedDate: d(-30),
    nextAssessmentDue: d(150),
    notes: "Alex is on a strong trajectory. 5 years to transition is plenty of time to build all skills. Discrepancies between self-assessment and staff assessment are gentle — Alex sometimes overestimates, but this is good developmentally (confidence is protective). Address through gentle dialogue rather than correction.",
  },
  {
    id: "ila-002",
    youngPerson: "yp_jordan",
    age: 13,
    yearsToTransition: 5,
    assessmentDate: d(-21),
    assessor: "staff_chervelle",
    domainAssessments: [
      {
        domain: "Personal Care & Hygiene",
        skills: [
          { skill: "Daily hygiene independently", level: "Mastered", evidence: "Skincare routine, hair care, deodorant — all consistent", childSelfAssessment: "Mastered", staffAssessment: "Mastered", agreementBetweenChildAndStaff: true, nextSteps: "Maintain" },
          { skill: "Laundry routine", level: "Established", evidence: "Manages own laundry weekly", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Maintain" },
          { skill: "Wardrobe management — quality and care", level: "Established", evidence: "Cares for clothes well; style awareness", childSelfAssessment: "Mastered", staffAssessment: "Established", agreementBetweenChildAndStaff: false, nextSteps: "Acknowledge mature taste" },
        ],
        domainSummary: "Personal care a strength. Mature presentation. Models for younger children.",
      },
      {
        domain: "Cooking & Food Preparation",
        skills: [
          { skill: "Cultural and family recipes", level: "Established", evidence: "Cooks Caribbean dishes well; keeps Mum's recipes", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Expand repertoire" },
          { skill: "Plan and shop for a meal", level: "Developing", evidence: "Plans well; budget awareness emerging", childSelfAssessment: "Developing", staffAssessment: "Developing", agreementBetweenChildAndStaff: true, nextSteps: "Weekly cooking lead role" },
          { skill: "Food safety", level: "Established", evidence: "Cultural cooking gives strong food safety practice", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Maintain" },
        ],
        domainSummary: "Cultural cooking is a real strength. Confident in kitchen. Plan-shop-cook cycle developing.",
      },
      {
        domain: "Money Management",
        skills: [
          { skill: "Pocket money", level: "Established", evidence: "Manages £25/week", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Maintain" },
          { skill: "Saving for goals", level: "Developing", evidence: "Saving for football boots", childSelfAssessment: "Developing", staffAssessment: "Developing", agreementBetweenChildAndStaff: true, nextSteps: "Add multi-goal saving" },
          { skill: "Bank account awareness", level: "Developing", evidence: "Has FlexOne current account; uses card sensibly", childSelfAssessment: "Established", staffAssessment: "Developing", agreementBetweenChildAndStaff: false, nextSteps: "Build understanding of statements/interest" },
        ],
        domainSummary: "Practical money skills strong. Banking literacy developing.",
      },
      {
        domain: "Health & Wellbeing",
        skills: [
          { skill: "Asthma self-management", level: "Established", evidence: "Knows own triggers, uses inhaler appropriately", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Maintain" },
          { skill: "Mental health awareness — when to seek help", level: "Developing", evidence: "Therapy regular; learning to articulate states", childSelfAssessment: "Developing", staffAssessment: "Developing", agreementBetweenChildAndStaff: true, nextSteps: "Continue therapeutic work" },
        ],
        domainSummary: "Health skills strong. Asthma well-managed. Mental health vocabulary growing.",
      },
      {
        domain: "Education & Career",
        skills: [
          { skill: "Attendance and engagement", level: "Established", evidence: "91% attendance, leadership at school", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Maintain" },
          { skill: "Career exploration", level: "Developing", evidence: "Football professional aspiration; realistic about probabilities; backup plans emerging", childSelfAssessment: "Developing", staffAssessment: "Developing", agreementBetweenChildAndStaff: true, nextSteps: "Visit football clubs and academies" },
        ],
        domainSummary: "Education trajectory strong. Career thinking has primary aspiration plus emerging realism.",
      },
      {
        domain: "Social & Community",
        skills: [
          { skill: "Friendships and peer skills", level: "Established", evidence: "Football team captain — leadership", childSelfAssessment: "Mastered", staffAssessment: "Established", agreementBetweenChildAndStaff: false, nextSteps: "Maintain" },
          { skill: "Public transport", level: "Established", evidence: "Confident on local routes", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "City-level routes next" },
          { skill: "Cultural community engagement", level: "Established", evidence: "Connected with cultural events and church family", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Continue building" },
        ],
        domainSummary: "Strong social and community presence. Cultural connections particularly protective.",
      },
    ],
    overallReadiness: "Developing strongly",
    childAspirations: "Play professional football. Backup: physiotherapy or sports coaching. Have a family one day. Travel — see Africa.",
    childWorries: [
      "Mum's release — what will the relationship be?",
      "Maintaining who I am if I move out",
      "Money management as an adult",
    ],
    prioritySkillsForNextSixMonths: [
      "Bank account understanding (statements, interest)",
      "City-level public transport",
      "Football academy visits",
      "Mum-release transition planning",
      "Multi-goal saving",
    ],
    pathwayLinks: ["Independence Pathway", "Care Plan", "PEP", "Pathway Plan (16+)"],
    resourcesAllocated: ["Football academy day-release visits", "Cultural mentoring referral", "Banking literacy session"],
    childAgreed: true,
    reviewedDate: d(-21),
    nextAssessmentDue: d(159),
    notes: "Jordan is developing strongly across all domains. Cultural anchor and football identity provide protective continuity. Focus on banking literacy and city-scale independence in next 6 months.",
  },
  {
    id: "ila-003",
    youngPerson: "yp_casey",
    age: 12,
    yearsToTransition: 6,
    assessmentDate: d(-7),
    assessor: "staff_anna",
    domainAssessments: [
      {
        domain: "Personal Care & Hygiene",
        skills: [
          { skill: "Sensory-aware hygiene routine", level: "Established", evidence: "Specific routine works; sensory products selected", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Maintain" },
          { skill: "Laundry — own clothes", level: "Developing", evidence: "Learning machine use; needs visual prompts", childSelfAssessment: "Developing", staffAssessment: "Developing", agreementBetweenChildAndStaff: true, nextSteps: "Visual checklist for laundry" },
        ],
        domainSummary: "Casey's routines work for Casey. Hygiene strong. Laundry developing with sensory-aware approach.",
      },
      {
        domain: "Cooking & Food Preparation",
        skills: [
          { skill: "Safe food preparation (within sensory tolerance)", level: "Developing", evidence: "Can prepare safe foods independently", childSelfAssessment: "Developing", staffAssessment: "Developing", agreementBetweenChildAndStaff: true, nextSteps: "Continue gradual exposure to new foods if Casey wishes" },
          { skill: "Kitchen safety awareness", level: "Established", evidence: "Aware of hazards; cautious", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Maintain" },
        ],
        domainSummary: "Cooking skills work within Casey's sensory profile. ARFID context shapes approach. Progress is meaningful in this context.",
      },
      {
        domain: "Money Management",
        skills: [
          { skill: "Pocket money and choice", level: "Established", evidence: "Manages allowance; saves for art supplies", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Continue" },
          { skill: "Visual money awareness", level: "Developing", evidence: "Visual budget tools effective", childSelfAssessment: "Developing", staffAssessment: "Developing", agreementBetweenChildAndStaff: true, nextSteps: "Build picture-based banking literacy" },
        ],
        domainSummary: "Money skills accessible through visual approaches.",
      },
      {
        domain: "Health & Wellbeing",
        skills: [
          { skill: "Sensory regulation tools", level: "Mastered", evidence: "Uses tools effectively, advocates for own needs", childSelfAssessment: "Mastered", staffAssessment: "Mastered", agreementBetweenChildAndStaff: true, nextSteps: "Maintain" },
          { skill: "Communication of distress", level: "Developing", evidence: "Visual cards effective; verbal harder", childSelfAssessment: "Developing", staffAssessment: "Developing", agreementBetweenChildAndStaff: true, nextSteps: "Continue therapeutic work" },
        ],
        domainSummary: "Sensory self-management is exceptional. Verbal distress communication developing.",
      },
      {
        domain: "Education & Career",
        skills: [
          { skill: "Engages with specialist provision", level: "Established", evidence: "Strong engagement; art is real strength", childSelfAssessment: "Established", staffAssessment: "Established", agreementBetweenChildAndStaff: true, nextSteps: "Maintain" },
          { skill: "Career thinking", level: "Emerging", evidence: "Art / vet aspiration; realistic given developmental stage", childSelfAssessment: "Emerging", staffAssessment: "Emerging", agreementBetweenChildAndStaff: true, nextSteps: "Career exposure through art world and animal welfare" },
        ],
        domainSummary: "Education in specialist provision strong. Art identity protective. Career exploration appropriate to age.",
      },
      {
        domain: "Social & Community",
        skills: [
          { skill: "Friendship development", level: "Developing", evidence: "First independent friendship (Ellie) — significant milestone", childSelfAssessment: "Developing", staffAssessment: "Developing", agreementBetweenChildAndStaff: true, nextSteps: "Support friendship maintenance" },
          { skill: "Community engagement (low-stim)", level: "Developing", evidence: "Library, art group, nature reserve — sustained", childSelfAssessment: "Developing", staffAssessment: "Developing", agreementBetweenChildAndStaff: true, nextSteps: "Continue with respect for sensory needs" },
          { skill: "Independent travel", level: "Emerging", evidence: "Familiar routes only; sensory considerations", childSelfAssessment: "Emerging", staffAssessment: "Emerging", agreementBetweenChildAndStaff: true, nextSteps: "Travel training with sensory-aware approach" },
        ],
        domainSummary: "Casey's social and community engagement is meaningful and increasing. Independent friendship is a major milestone.",
      },
    ],
    overallReadiness: "Early-stage",
    childAspirations: "Be an artist or vet. Have a forever family. Travel to see otters in the wild. Live somewhere quiet with a garden.",
    childWorries: [
      "Loud places overwhelming me",
      "Being misunderstood",
      "Having to leave Oak House",
      "Sensory overload as a grown-up",
    ],
    prioritySkillsForNextSixMonths: [
      "Visual laundry routine",
      "Independent travel — familiar routes only, sensory-aware",
      "Communication of distress vocabulary",
      "Friendship maintenance with Ellie",
      "Picture-based banking literacy",
    ],
    pathwayLinks: ["Independence Pathway", "Care Plan", "EHCP", "Sensory profile"],
    resourcesAllocated: ["SaLT communication tools", "Sensory-aware travel training (specialist)", "Art world career exposure (art group)"],
    childAgreed: true,
    reviewedDate: d(-7),
    nextAssessmentDue: d(173),
    notes: "Casey's independence skills must be assessed in context of ASD profile and sensory needs. 'Mastered' looks different — for example, sensory regulation is mastered in a way many adults aren't. Trajectory is positive. 6 years to transition gives time. EHCP review will inform pathway planning.",
  },
];

const levelColour: Record<SkillLevel, string> = {
  "Not yet started": "bg-slate-100 text-slate-700",
  "Emerging": "bg-amber-100 text-amber-800",
  "Developing": "bg-blue-100 text-blue-800",
  "Established": "bg-emerald-100 text-emerald-800",
  "Mastered": "bg-green-200 text-green-900",
};

const readinessColour: Record<string, string> = {
  "Early-stage": "bg-slate-100 text-slate-800",
  "Building foundations": "bg-blue-100 text-blue-800",
  "Developing strongly": "bg-emerald-100 text-emerald-800",
  "Approaching ready": "bg-green-200 text-green-900",
  "Ready for next step": "bg-purple-200 text-purple-900",
};

const exportCols: ExportColumn<IndependenceAssessment>[] = [
  { header: "Young Person", accessor: (r: IndependenceAssessment) => getYPName(r.youngPerson) },
  { header: "Age", accessor: (r: IndependenceAssessment) => String(r.age) },
  { header: "Years to Transition", accessor: (r: IndependenceAssessment) => String(r.yearsToTransition) },
  { header: "Overall Readiness", accessor: (r: IndependenceAssessment) => r.overallReadiness },
  { header: "Domains Assessed", accessor: (r: IndependenceAssessment) => String(r.domainAssessments.length) },
  { header: "Total Skills", accessor: (r: IndependenceAssessment) => String(r.domainAssessments.reduce((sum, d) => sum + d.skills.length, 0)) },
  { header: "Assessor", accessor: (r: IndependenceAssessment) => getStaffName(r.assessor) },
  { header: "Last Assessed", accessor: (r: IndependenceAssessment) => r.assessmentDate },
];

export default function IndependentLivingSkillsAssessmentPage() {
  const [filterYP, setFilterYP] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let items = [...data];
    if (filterYP !== "all") items = items.filter((a) => a.youngPerson === filterYP);
    items.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.youngPerson.localeCompare(b.youngPerson);
        case "review":
          return a.nextAssessmentDue.localeCompare(b.nextAssessmentDue);
        case "age":
          return b.age - a.age;
        default:
          return 0;
      }
    });
    return items;
  }, [filterYP, sortBy]);

  const total = data.length;
  const totalSkills = data.reduce((sum, a) => sum + a.domainAssessments.reduce((s, d) => s + d.skills.length, 0), 0);
  const childAgreed = data.filter((a) => a.childAgreed).length;
  const dueAssessment = data.filter((a) => a.nextAssessmentDue <= d(60)).length;

  return (
    <PageShell
      title="Independent Living Skills Assessment"
      subtitle="Skills assessment across life domains — preparing each child for adulthood at their pace"
      actions={
        <div className="flex items-center gap-2">
          <ExportButton data={data} columns={exportCols} filename="independent-living-skills-assessment" />
          <PrintButton title="Independent Living Skills Assessment" />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Active Assessments</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalSkills}</p>
          <p className="text-xs text-muted-foreground">Skills Tracked</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{childAgreed}/{total}</p>
          <p className="text-xs text-muted-foreground">Child Co-Authored</p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-center">
          <p className={cn("text-2xl font-bold", dueAssessment > 0 ? "text-amber-600" : "text-green-600")}>{dueAssessment}</p>
          <p className="text-xs text-muted-foreground">Reassess Next 60d</p>
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mb-6 flex items-start gap-2">
        <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-800">
          Independence is built one skill at a time, at the pace each child can manage. We assess against
          life domains — personal care, cooking, money, health, education, community — with both child and
          staff perspectives. The goal isn&apos;t a checklist; it&apos;s a confident adult.
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
              <SelectItem value="age">By Age</SelectItem>
              <SelectItem value="review">Earliest Reassessment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((a) => {
          const isExpanded = expandedId === a.id;
          const skillCount = a.domainAssessments.reduce((sum, d) => sum + d.skills.length, 0);
          const masteredCount = a.domainAssessments.reduce((sum, d) => sum + d.skills.filter((s) => s.level === "Mastered" || s.level === "Established").length, 0);

          return (
            <div key={a.id} className="rounded-xl border bg-white overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : a.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <TrendingUp className="h-5 w-5 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{getYPName(a.youngPerson)} (age {a.age})</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {a.domainAssessments.length} domains &middot; {skillCount} skills &middot; {masteredCount} established/mastered &middot; {a.yearsToTransition} years to transition
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", readinessColour[a.overallReadiness])}>
                    {a.overallReadiness}
                  </span>
                  {a.childAgreed && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t px-4 py-4 bg-slate-50 space-y-4">
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-1">Child&apos;s Aspirations</p>
                    <p className="text-sm">{a.childAspirations}</p>
                  </div>

                  {a.childWorries.length > 0 && (
                    <div className="bg-amber-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Child&apos;s Worries</p>
                      <ul className="space-y-1">
                        {a.childWorries.map((w, i) => (
                          <li key={i} className="text-sm flex items-start gap-1">
                            <AlertCircle className="h-3 w-3 text-amber-500 mt-1 shrink-0" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* domain assessments */}
                  {a.domainAssessments.map((d, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border">
                      <p className="text-sm font-semibold mb-2">{d.domain}</p>
                      <p className="text-xs text-muted-foreground italic mb-2">{d.domainSummary}</p>
                      <div className="space-y-2">
                        {d.skills.map((s, j) => (
                          <div key={j} className="bg-slate-50 rounded-lg p-2 border">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{s.skill}</span>
                              <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium shrink-0", levelColour[s.level])}>{s.level}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{s.evidence}</p>
                            {!s.agreementBetweenChildAndStaff && (
                              <p className="text-xs text-amber-700">
                                <em>Note: Child rates &lsquo;{s.childSelfAssessment}&rsquo; vs staff &lsquo;{s.staffAssessment}&rsquo;. {s.nextSteps}</em>
                              </p>
                            )}
                            {s.agreementBetweenChildAndStaff && s.nextSteps && (
                              <p className="text-xs text-blue-700"><strong>Next:</strong> {s.nextSteps}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">
                      <Star className="h-3 w-3 inline mr-1" />Priority Skills — Next 6 Months
                    </p>
                    <ul className="space-y-1">
                      {a.prioritySkillsForNextSixMonths.map((p, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <Star className="h-3 w-3 text-emerald-500 mt-1 shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Resources Allocated</p>
                    <ul className="space-y-1">
                      {a.resourcesAllocated.map((r, i) => (
                        <li key={i} className="text-sm flex items-start gap-1">
                          <CheckCircle className="h-3 w-3 text-blue-500 mt-1 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 border">
                    <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">Pathway Links</p>
                    <div className="flex flex-wrap gap-1">
                      {a.pathwayLinks.map((p, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{p}</span>
                      ))}
                    </div>
                  </div>

                  {a.notes && (
                    <div className="bg-slate-50 rounded-lg p-3 border">
                      <p className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1">Assessor Notes</p>
                      <p className="text-sm">{a.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span>Assessor: {getStaffName(a.assessor)}</span>
                    <span><Clock className="h-3 w-3 inline mr-1" />Reassess: {a.nextAssessmentDue}</span>
                    {a.childAgreed && <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">Child Co-Authored</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg bg-muted/50 border p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Regulatory Context:</strong> Independent living skills assessments support Quality Standard 12
          (preparation for adulthood), Quality Standard 1 (child-centred care), Care Leavers Regulations 2010,
          and link to the Pathway Plan from age 16. Reassessed every 6 months. Linked to Independence
          Pathway, Independence Skills, and Pathway Plan (16+).
        </p>
      </div>
    </PageShell>
  );
}
