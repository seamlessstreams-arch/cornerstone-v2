// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — route-group layout
//
// A self-contained, dark, installable streaming app living alongside Cara OS.
// Scopes its own theme (.fiwi), serves its own web manifest, and provides the
// active-portal context to everything beneath /fiwi.
// ══════════════════════════════════════════════════════════════════════════════

import type { Metadata, Viewport } from "next";
import { FiwiProvider } from "@/components/fiwi/fiwi-context";
import { FiwiShell } from "@/components/fiwi/fiwi-shell";
import "./fiwi.css";

export const metadata: Metadata = {
  title: "FiWi TV — Live TV, Movies & Series",
  description:
    "FiWi TV — a beautiful streaming app for your IPTV subscription. Live TV with a full EPG, on-demand movies and box sets, with a premium broadcaster experience.",
  applicationName: "FiWi TV",
  manifest: "/fiwi/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FiWi TV",
  },
};

export const viewport: Viewport = {
  themeColor: "#07090f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function FiwiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fiwi">
      <FiwiProvider>
        <FiwiShell>{children}</FiwiShell>
      </FiwiProvider>
    </div>
  );
}
