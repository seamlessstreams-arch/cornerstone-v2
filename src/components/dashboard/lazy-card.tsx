"use client";

import React, { useEffect, useRef, useState } from "react";
import { CardErrorBoundary } from "./card-error-boundary";

/**
 * Defers mounting a dashboard card (and therefore its data fetch) until it is
 * near the viewport. The Manager Control Centre renders ~300 data-driven cards;
 * mounting them all on load fired ~80+ API requests and 300 component renders up
 * front. With LazyCard, only the cards in/near the first viewport mount initially
 * (a handful of requests); the rest mount as the user scrolls.
 *
 * A min-height skeleton keeps the grid laid out so IntersectionObserver and
 * scrolling behave; once visible the card renders inside a CardErrorBoundary so a
 * single failing widget still can't take down the page.
 */
export function LazyCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    // No IntersectionObserver (older/SSR edge) → render immediately.
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  return (
    <div ref={ref} className="min-h-[150px]">
      {show ? (
        <CardErrorBoundary>{children}</CardErrorBoundary>
      ) : (
        <div className="rounded-2xl border border-[var(--cs-border)] bg-white/40 min-h-[150px] animate-pulse" />
      )}
    </div>
  );
}
