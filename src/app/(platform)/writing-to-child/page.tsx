"use client";

// CARA — Writing to the Child: child-readable recording review (standalone page).
// The review panel is reusable and also embedded at the point of writing in the
// daily-log, incident and key-working editors.

import { PageShell } from "@/components/layout/page-shell";
import { WritingToChildPanel } from "@/components/writing-to-child/writing-to-child-panel";

export default function WritingToChildPage() {
  return (
    <PageShell
      title="Writing to the Child"
      subtitle="Write the record as evidence for professionals — but as memory for the child. Cara advises; you decide."
      showQuickCreate={false}
    >
      <div className="max-w-3xl">
        <WritingToChildPanel
          title="Review a record"
          showRecordTypeSelect
          showAdvanced
          showExamples
        />
      </div>
    </PageShell>
  );
}
