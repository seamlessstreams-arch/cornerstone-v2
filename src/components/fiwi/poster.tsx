"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — Poster / artwork
//
// Uses the provider's real artwork when present; otherwise renders a stable,
// good-looking gradient placeholder derived from the title (so the grid never
// shows broken images — important for offline/demo and patchy provider data).
// ══════════════════════════════════════════════════════════════════════════════

import { useState } from "react";

// Curated gradient pairs — chosen by a hash of the title so a given show always
// gets the same artwork.
const GRADIENTS: [string, string][] = [
  ["#ff2e88", "#7b2ff7"],
  ["#7b2ff7", "#4f46e5"],
  ["#19d3e2", "#3b82f6"],
  ["#f5c451", "#ef4444"],
  ["#10b981", "#0ea5e9"],
  ["#ef4444", "#7b2ff7"],
  ["#f97316", "#db2777"],
  ["#06b6d4", "#7c3aed"],
  ["#8b5cf6", "#ec4899"],
  ["#0ea5e9", "#22d3ee"],
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Poster({
  src,
  title,
  className = "",
  rounded = "rounded-lg",
  showTitle = true,
}: {
  src: string | null;
  title: string;
  className?: string;
  rounded?: string;
  showTitle?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [g1, g2] = GRADIENTS[hash(title) % GRADIENTS.length];

  if (src && !failed) {
    return (
      <div className={`fiwi-poster-ph ${rounded} ${className}`} style={{ backgroundColor: g1 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={title}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`fiwi-poster-ph ${rounded} ${className} flex items-end`}
      style={{ background: `linear-gradient(150deg, ${g1}, ${g2})` }}
    >
      {showTitle && (
        <div className="relative z-10 p-3">
          <span className="line-clamp-3 text-sm font-semibold leading-tight text-white drop-shadow">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}
