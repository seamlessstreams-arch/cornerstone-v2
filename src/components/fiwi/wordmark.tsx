// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — wordmark logo (inline SVG, gradient fill)
// ══════════════════════════════════════════════════════════════════════════════

export function FiwiWordmark({ className = "h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 132 32" className={className} role="img" aria-label="FiWi TV" fill="none">
      <defs>
        <linearGradient id="fiwiGrad" x1="0" y1="0" x2="132" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff2e88" />
          <stop offset="0.6" stopColor="#7b2ff7" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      {/* signal-wave glyph */}
      <path d="M4 22 Q9 6 14 22" stroke="url(#fiwiGrad)" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M9 24 Q16 2 23 24" stroke="url(#fiwiGrad)" strokeWidth="2.6" strokeLinecap="round" opacity="0.55" />
      <text x="28" y="24" fontFamily="var(--font-sans)" fontSize="22" fontWeight="800" letterSpacing="-0.5" fill="url(#fiwiGrad)">
        FiWi
      </text>
      <rect x="92" y="9" width="36" height="16" rx="3.5" fill="url(#fiwiGrad)" />
      <text x="110" y="21.5" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="11" fontWeight="800" fill="#07090f" letterSpacing="0.5">
        TV
      </text>
    </svg>
  );
}
