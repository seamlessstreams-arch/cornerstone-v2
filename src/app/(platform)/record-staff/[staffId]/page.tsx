"use client";

import { useParams, useRouter } from "next/navigation";
import { UniversalStaffEntry } from "@/components/forms/universal-staff-entry";

export default function UniversalStaffRecordPage() {
  const { staffId } = useParams<{ staffId: string }>();
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[var(--cs-navy)]">Record for Staff Member</h1>
        <p className="text-sm text-[var(--cs-text-muted)]">
          Just write what happened. Cara will classify it and route it everywhere.
        </p>
      </div>
      <UniversalStaffEntry staffId={staffId} onCancel={() => router.back()} />
    </div>
  );
}
