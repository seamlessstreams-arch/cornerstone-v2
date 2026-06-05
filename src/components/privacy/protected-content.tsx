"use client";

import type { ReactNode } from "react";
import { EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrivacy } from "@/contexts/privacy-context";
import { shouldProtect, sensitivityLabel } from "@/lib/privacy/screen-protection";

/**
 * Obscures sensitive content on screen until the user taps to reveal it. When
 * obscured the children are NOT rendered (the sensitive text is kept OUT of the DOM,
 * not merely blurred). Only active when privacy mode is on; otherwise renders the
 * children normally. Defence-in-depth display only — never a server-side control.
 */
export function ProtectedContent({
  id,
  sensitivity,
  protect,
  label,
  children,
  className,
}: {
  /** Stable id so a reveal applies to this item only. */
  id: string;
  /** Sensitivity token (drives protection if `protect` not given). */
  sensitivity?: string | null;
  /** Explicit override for whether this content is protected. */
  protect?: boolean;
  /** Optional label on the redaction chip. */
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  const { isObscured, reveal } = usePrivacy();
  const isProtected = protect ?? shouldProtect(sensitivity);
  const obscured = isObscured(id, isProtected);

  if (!obscured) return <>{children}</>;

  return (
    <button
      type="button"
      onClick={() => reveal(id)}
      aria-label={`Hidden ${sensitivityLabel(sensitivity)} content — tap to reveal`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-dashed border-[var(--cs-border-strong)] bg-[var(--cs-surface)] px-2 py-1 text-[11px] font-medium text-[var(--cs-text-muted)] hover:bg-[var(--cs-teal-bg)] hover:text-[var(--cs-teal)] transition-colors select-none",
        className,
      )}
    >
      <EyeOff className="h-3 w-3" />
      {label ?? `${sensitivityLabel(sensitivity)} — tap to reveal`}
    </button>
  );
}
