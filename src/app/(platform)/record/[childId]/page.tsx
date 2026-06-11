"use client";

import { useParams, useRouter } from "next/navigation";
import { UniversalChildEntry } from "@/components/forms/universal-child-entry";

export default function UniversalRecordPage() {
  const { childId } = useParams<{ childId: string }>();
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[var(--cs-navy)]">Record for Child</h1>
        <p className="text-sm text-[var(--cs-text-muted)]">
          Just write what happened. Cara will figure out the type and route it everywhere.
        </p>
      </div>
      <UniversalChildEntry
        childId={childId}
        onSuccess={() => {}}
        onCancel={() => router.back()}
      />
    </div>
  );
}
