"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { GuidanceNote } from "./guidance-note";

interface PageGuidanceProps {
  title: string;
  description: string;
  evidenceTip?: string;
  ariaTip?: string;
  regulationRef?: string;
  variant?: "default" | "aria" | "compliance" | "safeguarding";
  className?: string;
}

/**
 * Top-of-page guidance wrapper. Drop into any page to provide
 * contextual coaching, evidence tips, and ARIA suggestions.
 * Wraps GuidanceNote with standard page-level spacing.
 */
export function PageGuidance({
  title,
  description,
  evidenceTip,
  ariaTip,
  regulationRef,
  variant = "default",
  className,
}: PageGuidanceProps) {
  return (
    <div className={cn("mb-4", className)}>
      <GuidanceNote
        title={title}
        description={description}
        evidenceTip={evidenceTip}
        ariaTip={ariaTip}
        regulationRef={regulationRef}
        variant={variant}
        dismissible
      />
    </div>
  );
}
