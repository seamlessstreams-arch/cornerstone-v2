"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Shield, CheckCircle2, AlertTriangle, XCircle,
  ClipboardList, Eye, FileText, Users,
  Heart, Pill, BookOpen, Activity,
  Sparkles, ChevronDown, ChevronUp,
  TrendingUp, Clock, Target, Award,
  ExternalLink, Zap,
} from "lucide-react";

// ── Regulation framework ───────────────────────────────────────────────────

interface RegulationRef {
  code: string;
  title: string;
  description: string;
  framework: "CHR2015" | "SCCIF" | "Reg44" | "Reg45" | "NMS" | "JTAI";
  module: string;
  evidenceAreas: string[];
  complianceStatus: "compliant" | "attention" | "non_compliant" | "not_assessed";
  lastAssessed: string | null;
  evidenceCount: number;
  gaps: string[];
}

const REGULATION_MAP: RegulationRef[] = [
  // CHR 2015 — Core Regulations
  {
    code: "CHR2015-3", title: "Statement of Purpose",
    description: "The registered person must compile a statement of purpose",
    framework: "CHR2015", module: "compliance",
    evidenceAreas: ["Statement of purpose document", "Children's guide", "Annual review evidence"],
    complianceStatus: "compliant", lastAssessed: "2026-04-15", evidenceCount: 4, gaps: [],
  },
  {
    code: "CHR2015-5", title: "Engaging with the Responsible Authority",
    description: "Engagement with the placing authority in relation to the child's care",
    framework: "CHR2015", module: "young_people",
    evidenceAreas: ["Social worker communication logs", "LAC review attendance", "Placement plan reviews", "Professional update records"],
    complianceStatus: "compliant", lastAssessed: "2026-05-01", evidenceCount: 12, gaps: [],
  },
  {
    code: "CHR2015-6", title: "Quality and Purpose of Care",
    description: "Standard of care focused on quality and purpose",
    framework: "CHR2015", module: "daily_logs",
    evidenceAreas: ["Daily log quality", "Key work session records", "Activity programme", "Children's voice evidence"],
    complianceStatus: "attention", lastAssessed: "2026-05-08", evidenceCount: 8,
    gaps: ["Some daily logs lack sufficient detail (ARIA detected weak recording)"],
  },
  {
    code: "CHR2015-7", title: "Children's Views, Wishes and Feelings",
    description: "Ascertaining and having regard to the child's wishes and feelings",
    framework: "CHR2015", module: "young_people",
    evidenceAreas: ["Voice of child records", "YP feedback forms", "Complaints outcomes", "Key work session notes"],
    complianceStatus: "compliant", lastAssessed: "2026-05-05", evidenceCount: 18, gaps: [],
  },
  {
    code: "CHR2015-8", title: "Fitness and Sustainability of the Home",
    description: "Financial viability and organisation fitness",
    framework: "CHR2015", module: "staffing",
    evidenceAreas: ["Staffing records", "Supervision logs", "Training records", "DBS update checks"],
    complianceStatus: "attention", lastAssessed: "2026-05-10", evidenceCount: 9,
    gaps: ["3 expired mandatory training records identified"],
  },
  {
    code: "CHR2015-12", title: "Health and Wellbeing Standard",
    description: "Promoting and protecting children's health",
    framework: "CHR2015", module: "medication",
    evidenceAreas: ["Medication administration records", "Health assessments", "GP registration evidence", "CAMHS referrals"],
    complianceStatus: "compliant", lastAssessed: "2026-05-07", evidenceCount: 15, gaps: [],
  },
  {
    code: "CHR2015-13", title: "Leadership and Management",
    description: "Effective leadership and management of the home",
    framework: "CHR2015", module: "oversight",
    evidenceAreas: ["Management oversight notes", "Supervision records", "Reg 44 reports", "Reg 45 reviews", "Staff meeting minutes"],
    complianceStatus: "attention", lastAssessed: "2026-05-12", evidenceCount: 11,
    gaps: ["4 records without management oversight >48hrs"],
  },
  {
    code: "CHR2015-34", title: "Employment of Staff",
    description: "Recruitment, training, and development of staff",
    framework: "CHR2015", module: "staffing",
    evidenceAreas: ["Recruitment records", "Training matrix", "Induction checklists", "Competency assessments"],
    complianceStatus: "attention", lastAssessed: "2026-05-10", evidenceCount: 7,
    gaps: ["3 mandatory training records expired"],
  },
  {
    code: "CHR2015-35", title: "Safeguarding",
    description: "Arrangements to safeguard and promote welfare",
    framework: "CHR2015", module: "safeguarding",
    evidenceAreas: ["Safeguarding policy", "Risk assessments", "Incident records", "Missing episodes", "Body maps", "Restraint records"],
    complianceStatus: "compliant", lastAssessed: "2026-05-11", evidenceCount: 22, gaps: [],
  },
  {
    code: "CHR2015-40", title: "Notification of Significant Events",
    description: "Notification to relevant persons of significant events",
    framework: "CHR2015", module: "compliance",
    evidenceAreas: ["Ofsted notifications", "Police notifications", "LA notifications", "Incident reporting logs"],
    complianceStatus: "compliant", lastAssessed: "2026-05-11", evidenceCount: 6, gaps: [],
  },
  {
    code: "CHR2015-44", title: "Independent Person: Visits and Reports",
    description: "Monthly independent person visits",
    framework: "CHR2015", module: "compliance",
    evidenceAreas: ["Reg 44 visit reports", "Recommendation tracking", "Action plan progress"],
    complianceStatus: "compliant", lastAssessed: "2026-04-28", evidenceCount: 5, gaps: [],
  },
  {
    code: "CHR2015-45", title: "Review of Quality of Care",
    description: "Six-monthly quality of care review by registered person",
    framework: "CHR2015", module: "compliance",
    evidenceAreas: ["Reg 45 review reports", "Improvement plans", "Outcome data", "Young people feedback analysis"],
    complianceStatus: "compliant", lastAssessed: "2026-03-15", evidenceCount: 3, gaps: [],
  },

  // SCCIF Social Care Common Inspection Framework
  {
    code: "SCCIF-EXP", title: "Children's Experiences",
    description: "The overall experiences and progress of children living in the home",
    framework: "SCCIF", module: "young_people",
    evidenceAreas: ["Outcome tracking", "Progress records", "Voice of child", "Key work sessions", "Education progress"],
    complianceStatus: "compliant", lastAssessed: "2026-05-05", evidenceCount: 24, gaps: [],
  },
  {
    code: "SCCIF-SAFE", title: "How Safe Children Are",
    description: "The effectiveness of safeguarding arrangements",
    framework: "SCCIF", module: "safeguarding",
    evidenceAreas: ["Safeguarding incidents", "Risk assessments", "Missing episodes", "Restraint records", "Online safety"],
    complianceStatus: "compliant", lastAssessed: "2026-05-11", evidenceCount: 19, gaps: [],
  },
  {
    code: "SCCIF-LEAD", title: "Leadership and Management",
    description: "Effectiveness of leaders and managers",
    framework: "SCCIF", module: "oversight",
    evidenceAreas: ["Management oversight quality", "Staff development", "Quality assurance", "Improvement tracking"],
    complianceStatus: "attention", lastAssessed: "2026-05-12", evidenceCount: 8,
    gaps: ["Oversight timeliness needs improvement"],
  },
];

// ── Inspection readiness grades ────────────────────────────────────────────

const MODULE_SCORES: { module: string; label: string; icon: React.ElementType; score: number; weight: number }[] = [
  { module: "safeguarding", label: "Safeguarding", icon: Shield, score: 92, weight: 25 },
  { module: "daily_logs", label: "Daily Recording", icon: BookOpen, score: 74, weight: 15 },
  { module: "oversight", label: "Management Oversight", icon: Eye, score: 68, weight: 15 },
  { module: "young_people", label: "Young People", icon: Heart, score: 88, weight: 15 },
  { module: "staffing", label: "Staffing & Training", icon: Users, score: 71, weight: 10 },
  { module: "medication", label: "Medication", icon: Pill, score: 95, weight: 5 },
  { module: "compliance", label: "Regulatory Compliance", icon: ClipboardList, score: 84, weight: 10 },
  { module: "contact", label: "Contact & Communication", icon: Activity, score: 81, weight: 5 },
];

function getGrade(score: number): { grade: string; color: string; bg: string } {
  if (score >= 90) return { grade: "Outstanding", color: "text-emerald-700", bg: "bg-emerald-50" };
  if (score >= 75) return { grade: "Good", color: "text-blue-700", bg: "bg-blue-50" };
  if (score >= 50) return { grade: "Requires Improvement", color: "text-amber-700", bg: "bg-amber-50" };
  return { grade: "Inadequate", color: "text-red-700", bg: "bg-red-50" };
}

function getScoreColor(score: number): string {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 75) return "bg-blue-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

// ══════════════════════════════════════════════════════════════════════════════

type ViewTab = "dashboard" | "regulations" | "evidence" | "actions";

export default function InspectionReadinessPage() {
  const [activeTab, setActiveTab] = useState<ViewTab>("dashboard");
  const [expandedReg, setExpandedReg] = useState<Set<string>>(new Set());
  const [frameworkFilter, setFrameworkFilter] = useState<string>("all");

  const overallScore = Math.round(
    MODULE_SCORES.reduce((sum, m) => sum + m.score * (m.weight / 100), 0),
  );
  const overallGrade = getGrade(overallScore);

  const compliant = REGULATION_MAP.filter((r) => r.complianceStatus === "compliant").length;
  const attention = REGULATION_MAP.filter((r) => r.complianceStatus === "attention").length;
  const nonCompliant = REGULATION_MAP.filter((r) => r.complianceStatus === "non_compliant").length;
  const totalEvidence = REGULATION_MAP.reduce((sum, r) => sum + r.evidenceCount, 0);

  const toggleReg = (code: string) => {
    setExpandedReg((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code); else next.add(code);
      return next;
    });
  };

  const filteredRegs = frameworkFilter === "all"
    ? REGULATION_MAP
    : REGULATION_MAP.filter((r) => r.framework === frameworkFilter);

  return (
    <PageShell title="Inspection Readiness" subtitle="Real-time regulatory compliance and Ofsted preparation">
      <div className="space-y-6">
        {/* Tab bar */}
        <div className="flex gap-1 border-b border-gray-200 pb-0">
          {([
            { id: "dashboard", label: "Dashboard", icon: Target },
            { id: "regulations", label: "Regulation Map", icon: Shield },
            { id: "evidence", label: "Evidence Tracker", icon: FileText },
            { id: "actions", label: "Action Plan", icon: ClipboardList },
          ] as { id: ViewTab; label: string; icon: React.ElementType }[]).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-[1px] transition-colors",
                  activeTab === tab.id ? "border-[var(--cs-primary)] text-[var(--cs-primary)]" : "border-transparent text-gray-500 hover:text-gray-700",
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Overall grade */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <Card className="lg:col-span-1">
                <CardContent className="p-6 text-center">
                  <div className={cn("inline-flex h-24 w-24 rounded-full items-center justify-center mb-3", overallGrade.bg)}>
                    <span className={cn("text-3xl font-bold", overallGrade.color)}>{overallScore}</span>
                  </div>
                  <p className={cn("text-lg font-bold", overallGrade.color)}>{overallGrade.grade}</p>
                  <p className="text-xs text-gray-500 mt-1">Overall Readiness Score</p>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Module Readiness</h3>
                  <div className="space-y-3">
                    {MODULE_SCORES.map((m) => {
                      const Icon = m.icon;
                      const moduleGrade = getGrade(m.score);
                      return (
                        <div key={m.module} className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Icon className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 w-40">{m.label}</span>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full transition-all", getScoreColor(m.score))}
                              style={{ width: `${m.score}%` }}
                            />
                          </div>
                          <span className={cn("text-sm font-bold w-12 text-right", moduleGrade.color)}>
                            {m.score}%
                          </span>
                          <span className="text-[10px] text-gray-400 w-6">{m.weight}%</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Compliant" value={compliant} icon={CheckCircle2} color="text-emerald-600 bg-emerald-50" />
              <StatCard label="Needs Attention" value={attention} icon={AlertTriangle} color="text-amber-600 bg-amber-50" />
              <StatCard label="Non-Compliant" value={nonCompliant} icon={XCircle} color="text-red-600 bg-red-50" />
              <StatCard label="Evidence Items" value={totalEvidence} icon={FileText} color="text-blue-600 bg-blue-50" />
            </div>

            {/* ARIA readiness insight */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-violet-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-violet-800 mb-1">ARIA Inspection Readiness Analysis</h4>
                    <p className="text-xs text-violet-600 leading-relaxed">
                      Overall readiness is <strong>{overallGrade.grade.toLowerCase()}</strong> at {overallScore}%.
                      Priority areas: Management oversight timeliness (4 records &gt;48hrs without oversight),
                      mandatory training compliance (3 expired records), and daily recording quality
                      (weak recording detected for 2 young people). Safeguarding and medication are strong —
                      these areas will evidence well. Recommend focusing on oversight completion before any
                      anticipated inspection visit.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick action items */}
            <Card>
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" /> Priority Actions for Inspection Readiness
                </h3>
                <div className="space-y-2">
                  {[
                    { action: "Complete management oversight on 4 outstanding records", severity: "critical", reg: "CHR2015 Reg 13" },
                    { action: "Renew 3 expired mandatory training records", severity: "high", reg: "CHR2015 Reg 34" },
                    { action: "Improve daily log recording quality for Tyler and Jayden", severity: "medium", reg: "CHR2015 Reg 6" },
                    { action: "Schedule overdue supervisions for 2 staff members", severity: "medium", reg: "CHR2015 Reg 8" },
                    { action: "Fill 3 unfilled shifts in the next 7 days", severity: "high", reg: "CHR2015 Reg 34" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        item.severity === "critical" ? "bg-red-500" :
                        item.severity === "high" ? "bg-orange-500" :
                        "bg-amber-500",
                      )} />
                      <span className="text-sm text-gray-700 flex-1">{item.action}</span>
                      <Badge variant="outline" className="text-[10px] bg-gray-50">{item.reg}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Regulation Map */}
        {activeTab === "regulations" && (
          <div className="space-y-4">
            {/* Framework filter */}
            <div className="flex items-center gap-2">
              {["all", "CHR2015", "SCCIF"].map((fw) => (
                <button
                  key={fw}
                  onClick={() => setFrameworkFilter(fw)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                    frameworkFilter === fw ? "bg-[var(--cs-primary)] text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200",
                  )}
                >
                  {fw === "all" ? `All (${REGULATION_MAP.length})` : `${fw} (${REGULATION_MAP.filter((r) => r.framework === fw).length})`}
                </button>
              ))}
            </div>

            {/* Regulation cards */}
            <div className="space-y-2">
              {filteredRegs.map((reg) => {
                const isExpanded = expandedReg.has(reg.code);
                const statusColor = reg.complianceStatus === "compliant" ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
                  reg.complianceStatus === "attention" ? "text-amber-600 bg-amber-50 border-amber-200" :
                  reg.complianceStatus === "non_compliant" ? "text-red-600 bg-red-50 border-red-200" :
                  "text-gray-600 bg-gray-50 border-gray-200";
                const StatusIcon = reg.complianceStatus === "compliant" ? CheckCircle2 :
                  reg.complianceStatus === "attention" ? AlertTriangle : XCircle;

                return (
                  <Card key={reg.code}>
                    <button
                      onClick={() => toggleReg(reg.code)}
                      className="w-full text-left p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", statusColor)}>
                        <StatusIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gray-500">{reg.code}</span>
                          <h4 className="text-sm font-semibold text-gray-900">{reg.title}</h4>
                          <Badge className={cn("text-[10px]", statusColor)}>
                            {reg.complianceStatus.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{reg.description}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-gray-500">{reg.evidenceCount} evidence items</span>
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                      </div>
                    </button>
                    {isExpanded && (
                      <CardContent className="px-4 pb-4 pt-0 space-y-3">
                        <div>
                          <h5 className="text-xs font-semibold text-gray-600 mb-1.5">Evidence Areas</h5>
                          <div className="flex flex-wrap gap-1.5">
                            {reg.evidenceAreas.map((ea) => (
                              <span key={ea} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">{ea}</span>
                            ))}
                          </div>
                        </div>
                        {reg.gaps.length > 0 && (
                          <div>
                            <h5 className="text-xs font-semibold text-red-600 mb-1.5">Identified Gaps</h5>
                            {reg.gaps.map((gap, i) => (
                              <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-50">
                                <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                                <span className="text-xs text-red-700">{gap}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {reg.lastAssessed && (
                          <p className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Last assessed: {new Date(reg.lastAssessed).toLocaleDateString("en-GB")}
                          </p>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Evidence Tracker */}
        {activeTab === "evidence" && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
              <FileText className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Evidence is automatically tracked across all Cornerstone modules. Each record, form submission,
                oversight note, and communication draft is mapped to relevant regulations. The scores above reflect
                real-time evidence coverage.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MODULE_SCORES.map((m) => {
                const Icon = m.icon;
                const moduleGrade = getGrade(m.score);
                const regs = REGULATION_MAP.filter((r) => r.module === m.module);
                const totalEv = regs.reduce((sum, r) => sum + r.evidenceCount, 0);
                return (
                  <Card key={m.module}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", moduleGrade.bg)}>
                          <Icon className={cn("h-4 w-4", moduleGrade.color)} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">{m.label}</h4>
                          <p className="text-[10px] text-gray-500">{regs.length} regulations mapped</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Evidence items</span>
                        <span className="font-bold text-gray-900">{totalEv}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                        <div className={cn("h-full rounded-full", getScoreColor(m.score))} style={{ width: `${m.score}%` }} />
                      </div>
                      <p className={cn("text-xs font-medium mt-1", moduleGrade.color)}>{m.score}% — {moduleGrade.grade}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Plan */}
        {activeTab === "actions" && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-violet-50 border border-violet-100">
              <Sparkles className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
              <p className="text-xs text-violet-700">
                ARIA generates an inspection action plan based on current compliance gaps. Actions are prioritised
                by regulatory impact and timeliness. Complete these before any anticipated inspection visit.
              </p>
            </div>
            {[
              { priority: 1, action: "Complete management oversight for 4 outstanding significant records", owner: "Registered Manager", deadline: "2026-05-14", reg: "CHR2015 Reg 13", status: "overdue" },
              { priority: 2, action: "Book and complete mandatory training renewals (safeguarding, first aid, medication)", owner: "Deputy Manager", deadline: "2026-05-19", reg: "CHR2015 Reg 34", status: "in_progress" },
              { priority: 3, action: "Review and improve daily log recording standards with team", owner: "Senior RSW", deadline: "2026-05-16", reg: "CHR2015 Reg 6", status: "not_started" },
              { priority: 4, action: "Complete overdue staff supervisions", owner: "Registered Manager", deadline: "2026-05-18", reg: "CHR2015 Reg 8", status: "not_started" },
              { priority: 5, action: "Fill unfilled shifts for the coming week", owner: "Deputy Manager", deadline: "2026-05-13", reg: "CHR2015 Reg 34", status: "in_progress" },
              { priority: 6, action: "Update fire safety drill log and evacuation plan", owner: "Maintenance Lead", deadline: "2026-05-20", reg: "NMS 10.3", status: "not_started" },
              { priority: 7, action: "Prepare Reg 45 review — due June 2026", owner: "Responsible Individual", deadline: "2026-06-15", reg: "CHR2015 Reg 45", status: "not_started" },
            ].map((item) => (
              <Card key={item.priority}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                    item.priority <= 2 ? "bg-red-100 text-red-700" :
                    item.priority <= 4 ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700",
                  )}>
                    {item.priority}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">{item.action}</h4>
                      <Badge className={cn(
                        "text-[10px]",
                        item.status === "overdue" ? "bg-red-100 text-red-700" :
                        item.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-600",
                      )}>
                        {item.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Owner: {item.owner}</span>
                      <span>Due: {new Date(item.deadline).toLocaleDateString("en-GB")}</span>
                      <Badge variant="outline" className="text-[10px]">{item.reg}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
