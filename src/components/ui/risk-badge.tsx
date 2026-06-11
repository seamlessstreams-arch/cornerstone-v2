// ══════════════════════════════════════════════════════════════════════════════
// CARA — RISK BADGE
// Circular dot + text label. Accessible — never colour-only meaning.
// Large touch target (min 44px when interactive).
// ══════════════════════════════════════════════════════════════════════════════

"use client";

import React from "react";
import { cn } from "@/lib/utils";

type RiskLevel = "low" | "medium" | "high" | "critical" | "none";

interface RiskBadgeProps {
  level: RiskLevel;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const RISK_CONFIG: Record<
  RiskLevel,
  {
    label: string;
    dot: string;
    text: string;
    bg: string;
    border: string;
    pulse?: boolean;
  }
> = {
  low: {
    label: "Low Risk",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  medium: {
    label: "Medium Risk",
    dot: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  high: {
    label: "High Risk",
    dot: "bg-red-500",
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  critical: {
    label: "Critical Risk",
    dot: "bg-red-600",
    text: "text-red-800",
    bg: "bg-red-50",
    border: "border-red-300",
    pulse: true,
  },
  none: {
    label: "No Risk",
    dot: "bg-slate-300",
    text: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
};

export function RiskBadge({
  level,
  showLabel = true,
  size = "md",
  className,
}: RiskBadgeProps) {
  const config = RISK_CONFIG[level];

  const dotSizes = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
  };

  const textSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  const paddingSizes = {
    sm: "px-2 py-0.5",
    md: "px-2.5 py-1",
    lg: "px-3 py-1.5 min-h-[44px]",
  };

  return (
    <span
      role="status"
      aria-label={config.label}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-medium transition-colors",
        config.bg,
        config.border,
        config.text,
        paddingSizes[size],
        textSizes[size],
        className,
      )}
    >
      <span
        className={cn(
          "shrink-0 rounded-full",
          dotSizes[size],
          config.dot,
          config.pulse && "animate-pulse",
        )}
        aria-hidden="true"
      />
      {showLabel && config.label}
    </span>
  );
}
