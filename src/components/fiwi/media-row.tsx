"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — Horizontal scrolling rail (Netflix-style) with edge chevrons
// ══════════════════════════════════════════════════════════════════════════════

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function MediaRow({
  title,
  subtitle,
  children,
  itemWidth = "w-[150px] sm:w-[170px]",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  itemWidth?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <section className="group/row relative">
      <div className="mb-2 flex items-baseline justify-between px-4 sm:px-8">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[var(--fw-text)]">{title}</h2>
          {subtitle && <p className="text-xs text-[var(--fw-text-3)]">{subtitle}</p>}
        </div>
      </div>
      <div className="relative">
        <button
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="absolute left-0 top-0 z-10 hidden h-full w-12 items-center justify-center bg-gradient-to-r from-black/70 to-transparent opacity-0 transition group-hover/row:opacity-100 sm:flex"
        >
          <ChevronLeft className="h-7 w-7 text-white" />
        </button>
        <div
          ref={ref}
          className="fiwi-rail flex gap-3 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-8"
        >
          {Array.isArray(children)
            ? children.map((c, i) => (
                <div key={i} className={`shrink-0 ${itemWidth}`}>
                  {c}
                </div>
              ))
            : children}
        </div>
        <button
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="absolute right-0 top-0 z-10 hidden h-full w-12 items-center justify-center bg-gradient-to-l from-black/70 to-transparent opacity-0 transition group-hover/row:opacity-100 sm:flex"
        >
          <ChevronRight className="h-7 w-7 text-white" />
        </button>
      </div>
    </section>
  );
}
