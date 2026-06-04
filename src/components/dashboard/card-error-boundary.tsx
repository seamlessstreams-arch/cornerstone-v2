"use client";

import React from "react";

/**
 * Isolates a single dashboard card. If a card throws during render (e.g. an
 * intelligence payload is missing an expected array), only that card shows a
 * small fallback — the rest of the dashboard keeps working instead of the whole
 * page falling to the platform error boundary.
 */
export class CardErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Card-level isolation: log for diagnostics, but don't propagate.
    if (typeof console !== "undefined") {
      console.warn("[dashboard card] failed to render:", error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-[var(--cs-border)] bg-white p-4 flex items-center gap-2 text-xs text-[var(--cs-text-muted)]">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--cs-avisaar-amber)]" />
          This section couldn’t load right now.
        </div>
      );
    }
    return this.props.children;
  }
}
