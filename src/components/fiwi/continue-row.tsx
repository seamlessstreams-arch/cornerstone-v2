"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — "Continue watching" rail (reads on-device progress, live-updating)
// ══════════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, X } from "lucide-react";
import { MediaRow } from "./media-row";
import { Poster } from "./poster";
import { loadProgress, clearProgress } from "@/lib/fiwi/client";
import type { WatchProgress } from "@/lib/fiwi/types";

export function ContinueRow() {
  const [items, setItems] = useState<WatchProgress[]>([]);

  useEffect(() => {
    const refresh = () => setItems(loadProgress());
    refresh();
    window.addEventListener("fiwi:progress", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("fiwi:progress", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!items.length) return null;

  return (
    <MediaRow title="Continue watching" itemWidth="w-[230px] sm:w-[260px]">
      {items.map((p) => {
        const pct = p.durationSecs ? (p.positionSecs / p.durationSecs) * 100 : 0;
        const href =
          p.kind === "episode"
            ? `/fiwi/watch?type=episode&series=${p.refId}&ep=${p.key.split(":")[1]}`
            : `/fiwi/watch?type=movie&id=${p.refId}`;
        return (
          <div key={p.key} className="fiwi-card group relative">
            <Link href={href} className="block">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Poster src={p.poster} title={p.title} className="h-full w-full" rounded="rounded-lg" />
                <div className="absolute inset-0 grid place-items-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-black">
                    <Play className="h-6 w-6 translate-x-0.5 fill-current" />
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-black/50">
                  <div className="h-full" style={{ width: `${pct}%`, background: "var(--fw-grad-brand)" }} />
                </div>
              </div>
            </Link>
            <button
              onClick={() => clearProgress(p.key)}
              aria-label="Remove from continue watching"
              className="absolute right-1.5 top-1.5 hidden rounded-full bg-black/70 p-1 text-white group-hover:block"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="px-1 pt-1.5">
              <p className="truncate text-sm font-semibold text-white">{p.title}</p>
              {p.subtitle && <p className="truncate text-xs text-[var(--fw-text-3)]">{p.subtitle}</p>}
            </div>
          </div>
        );
      })}
    </MediaRow>
  );
}
