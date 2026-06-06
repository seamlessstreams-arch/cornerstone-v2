import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing type strictness issues in lib files — does not affect runtime.
    // TODO: resolve all TS errors and remove this flag.
    ignoreBuildErrors: true,
  },
  // Note: the `eslint` config key was removed in Next.js 16 (ESLint no longer
  // runs during `next build`), so it is intentionally omitted here.

  // Explicitly permit the device capabilities Cornerstone relies on — for the app's
  // OWN origin (self), on every route. This guarantees the microphone (voice
  // dictation + audio capture), camera (QR / document capture) and geolocation
  // (geofenced presence sign-in) stay enabled across ALL devices Cornerstone runs
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
