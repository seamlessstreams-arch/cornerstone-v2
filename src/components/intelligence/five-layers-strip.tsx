"use client";

// ══════════════════════════════════════════════════════════════════════════════
// CARA — FIVE INTELLIGENCE LAYERS STRIP  (mounted on the Intelligence Hub)
// The in-app mirror of the website's positioning: one system, five ways it
// thinks with you — every card linking to real working surfaces.
// ══════════════════════════════════════════════════════════════════════════════

import Link from "next/link";
import { PenLine, ShieldAlert, HeartHandshake, ClipboardCheck, GraduationCap, ArrowRight } from "lucide-react";

const LAYERS = [
  {
    Icon: PenLine, t: "Care Recording",
    d: "Every entry works harder than the page it's written on.",
    links: [
      { label: "Daily log", href: "/daily-log" },
      { label: "Handover", href: "/handover" },
      { label: "Shift briefing", href: "/shift-briefing" },
    ],
  },
  {
    Icon: ShieldAlert, t: "Safeguarding",
    d: "Patterns surface while they're still patterns.",
    links: [
      { label: "Priority briefing", href: "/priority-briefing" },
      { label: "Incident Mode", href: "/cara/incident-mode" },
      { label: "Manager oversight", href: "/cara/manager-oversight" },
    ],
  },
  {
    Icon: HeartHandshake, t: "Practice Quality",
    d: "PACE-informed, non-blaming support as you work.",
    links: [
      { label: "Recording assistant", href: "/cara/recording-assistant" },
      { label: "Practice library", href: "/cara/practice-library" },
      { label: "Practice intelligence", href: "/cara-practice" },
    ],
  },
  {
    Icon: ClipboardCheck, t: "Compliance",
    d: "The evidence trail builds itself as you work.",
    links: [
      { label: "Ofsted readiness", href: "/inspection-readiness" },
      { label: "Plan currency", href: "/plan-currency" },
      { label: "Premises checks", href: "/premises-compliance" },
    ],
  },
  {
    Icon: GraduationCap, t: "Learning & Curriculum",
    d: "Turn what the records reveal into learning the child can use.",
    links: [
      { label: "Cara Studio", href: "/cara-studio" },
      { label: "Curriculum builder", href: "/cara-studio/curriculum/new" },
      { label: "Session planner", href: "/cara-studio/session/new" },
    ],
  },
];

export function FiveLayersStrip() {
  return (
    <section className="rounded-3xl border border-[var(--cs-border)] bg-white p-5 shadow-[var(--cs-shadow-card)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--cs-navy)]">Five intelligence layers</h2>
        <p className="text-[11px] text-[var(--cs-text-muted)]">One system, five ways it thinks with you — every link is a live working surface.</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {LAYERS.map((l) => (
          <div key={l.t} className="rounded-2xl border border-[var(--cs-border)] bg-[var(--cs-bg)] p-4">
            <l.Icon className="h-5 w-5 text-[var(--cs-teal-strong)]" />
            <p className="mt-2 text-sm font-bold text-[var(--cs-navy)]">{l.t}</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--cs-text-secondary)]">{l.d}</p>
            <div className="mt-2.5 space-y-1">
              {l.links.map((x) => (
                <Link key={x.href} href={x.href} className="group flex items-center gap-1 text-[11px] font-semibold text-[var(--cs-teal-strong)] hover:text-[var(--cs-navy)]">
                  {x.label} <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
