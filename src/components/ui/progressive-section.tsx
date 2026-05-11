"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Info } from "lucide-react";

interface ProgressiveSectionProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  badge?: string | number;
  icon?: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function ProgressiveSection({
  title,
  subtitle,
  defaultOpen = false,
  badge,
  icon,
  hint,
  children,
  className,
}: ProgressiveSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--cs-border)] bg-[var(--cs-surface-elevated)]",
        "transition-all duration-200",
        open && "shadow-[var(--cs-shadow-soft)]",
        className,
      )}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-3 px-5 py-4 text-left transition-colors",
          "hover:bg-[var(--cs-surface)] rounded-2xl",
        )}
      >
        <div className="text-[var(--cs-text-muted)] transition-transform duration-200">
          {open
            ? <ChevronDown className="h-4 w-4" />
            : <ChevronRight className="h-4 w-4" />
          }
        </div>

        {icon && (
          <div className="shrink-0 text-[var(--cs-text-secondary)]">{icon}</div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--cs-navy)] truncate">
              {title}
            </h3>
            {badge !== undefined && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--cs-surface)] border border-[var(--cs-border)] px-1.5 text-[10px] font-semibold text-[var(--cs-text-muted)]">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-[var(--cs-text-muted)] truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {hint && (
          <div className="group/hint relative shrink-0">
            <Info className="h-3.5 w-3.5 text-[var(--cs-text-gentle)]" />
            <div className="absolute right-0 top-full mt-1 z-50 hidden group-hover/hint:block w-48 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface-elevated)] p-2.5 shadow-[var(--cs-shadow-elevated)] text-xs text-[var(--cs-text-secondary)] leading-relaxed">
              {hint}
            </div>
          </div>
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 pt-0 animate-[gentleFadeUp_0.2s_ease-out]">
          <div className="border-t border-[var(--cs-border-subtle)] pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
