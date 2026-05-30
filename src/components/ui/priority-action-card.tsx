// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — PRIORITY ACTION CARD
// Calm card with left-border urgency colour.
// Used in dashboards and action lists to surface what needs attention.
// Touch-friendly (48px min action target).
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Clock,
  CalendarClock,
  ArrowRight,
  User,
} from "lucide-react";

type Urgency = "urgent" | "today" | "upcoming";

interface PriorityActionCardProps {
  title: string;
  description: string;
  urgency: Urgency;
  icon?: React.ElementType;
  childName?: string;
  actionLabel?: string;
  actionHref?: string;
  timestamp?: string;
  className?: string;
}

const URGENCY_CONFIG: Record<
  Urgency,
  {
    border: string;
    bg: string;
    accentBg: string;
    accentText: string;
    defaultIcon: React.ElementType;
    label: string;
  }
> = {
  urgent: {
    border: "border-l-red-500",
    bg: "bg-red-50/30",
    accentBg: "bg-red-100",
    accentText: "text-red-700",
    defaultIcon: AlertTriangle,
    label: "Urgent",
  },
  today: {
    border: "border-l-amber-500",
    bg: "bg-amber-50/30",
    accentBg: "bg-amber-100",
    accentText: "text-amber-700",
    defaultIcon: Clock,
    label: "Today",
  },
  upcoming: {
    border: "border-l-blue-500",
    bg: "bg-blue-50/20",
    accentBg: "bg-blue-100",
    accentText: "text-blue-700",
    defaultIcon: CalendarClock,
    label: "Upcoming",
  },
};

export function PriorityActionCard({
  title,
  description,
  urgency,
  icon,
  childName,
  actionLabel = "View",
  actionHref,
  timestamp,
  className,
}: PriorityActionCardProps) {
  const config = URGENCY_CONFIG[urgency];
  const Icon = icon ?? config.defaultIcon;

  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-l-4 transition-all duration-200",
        "border-[var(--cs-border)] bg-[var(--cs-surface-elevated)]",
        config.border,
        "hover:shadow-[var(--cs-shadow-card)] hover:-translate-y-0.5",
        className,
      )}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            config.accentBg,
          )}
        >
          <Icon className={cn("h-4 w-4", config.accentText)} />
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-[var(--cs-navy)] leading-tight truncate">
                {title}
              </h4>
              <p className="mt-1 text-[13px] text-[var(--cs-text-secondary)] leading-relaxed line-clamp-2">
                {description}
              </p>
            </div>

            {/* Urgency label */}
            <span
              className={cn(
                "shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                config.accentBg,
                config.accentText,
              )}
            >
              {config.label}
            </span>
          </div>

          {/* Meta row */}
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            {childName && (
              <span className="inline-flex items-center gap-1 text-[12px] text-[var(--cs-text-muted)]">
                <User className="h-3 w-3" />
                {childName}
              </span>
            )}
            {timestamp && (
              <span className="text-[12px] text-[var(--cs-text-gentle)]">
                {timestamp}
              </span>
            )}
          </div>

          {/* Action */}
          {actionHref && (
            <div className="mt-3">
              <Link
                href={actionHref}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium",
                  "min-h-[48px] min-w-[48px]",
                  "bg-[var(--cs-surface)] border border-[var(--cs-border)]",
                  "text-[var(--cs-navy)] transition-all",
                  "hover:bg-[var(--cs-navy)] hover:text-white hover:border-[var(--cs-navy)]",
                )}
              >
                {actionLabel}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
