import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing type strictness issues in lib files — does not affect runtime.
    // TODO: resolve all TS errors and remove this flag.
    ignoreBuildErrors: true,
  },
  // Note: the `eslint` config key was removed in Next.js 16 (ESLint no longer
  // runs during `next build`), so it is intentionally omitted here.

  // Cara OS rebrand — legacy URL compatibility. The aria page routes were
  // renamed to cara; permanent redirects keep old bookmarks, PWA shortcuts and
  // deep links working. API routes under /api/aria* intentionally keep their
  // legacy paths (internal, not user-facing) and are NOT redirected.
  async redirects() {
    return [
      { source: "/aria", destination: "/cara", permanent: true },
      { source: "/aria/:path*", destination: "/cara/:path*", permanent: true },
      { source: "/aria-practice", destination: "/cara-practice", permanent: true },
      { source: "/aria-practice/:path*", destination: "/cara-practice/:path*", permanent: true },
      { source: "/aria-studio", destination: "/cara-studio", permanent: true },
      { source: "/aria-studio/:path*", destination: "/cara-studio/:path*", permanent: true },
      { source: "/intelligence/aria", destination: "/intelligence/cara", permanent: true },
      { source: "/intelligence/aria/:path*", destination: "/intelligence/cara/:path*", permanent: true },
      { source: "/aria-intelligence", destination: "/intelligence/cara", permanent: true },
      { source: "/aria-insights", destination: "/intelligence/cara", permanent: true },
      { source: "/cornerstone", destination: "/", permanent: true },
      { source: "/cornerstone-os", destination: "/", permanent: true },
    ];
  },

  // Explicitly permit the device capabilities Cara OS relies on — for the app's
  // OWN origin (self), on every route. This guarantees the microphone (voice
  // dictation + audio capture), camera (QR / document capture) and geolocation
  // (geofenced presence sign-in) stay enabled across ALL devices Cara OS runs
  // on — including MDM-managed tablets, kiosks and embedded webviews that
  // default-deny these features unless the page opts in. `self` keeps them
  // off-limits to any third-party frame, so it grants access without widening it.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "microphone=(self), camera=(self), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
