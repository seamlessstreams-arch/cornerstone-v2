"use client";

import { PageShell } from "@/components/layout/page-shell";
import { SmartSignIn } from "@/components/attendance/smart-sign-in";
import { OffShiftBanner } from "@/components/attendance/off-shift-banner";

export default function SmartSignInPage() {
  return (
    <PageShell
      title="Shift Sign-In"
      subtitle="Clock in and out of your shift in one tap. Makes your on-shift status real across the platform."
    >
      <div className="max-w-2xl mx-auto mb-4">
        <OffShiftBanner />
      </div>
      <SmartSignIn />
    </PageShell>
  );
}
