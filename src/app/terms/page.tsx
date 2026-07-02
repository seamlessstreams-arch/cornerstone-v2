// ══════════════════════════════════════════════════════════════════════════════
// CARA — TERMS  (route: /terms)
// Plain-English summary. Honest — no fabricated claims.
// ══════════════════════════════════════════════════════════════════════════════

import type { Metadata } from "next";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { SectionEyebrow } from "@/components/marketing/ui";

export const metadata: Metadata = {
  title: "Terms | Cara OS",
  description: "Plain-English terms for using the Cara OS website and early-access demo.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-[var(--cs-navy)]">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-[var(--cs-text-secondary)]">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--cs-bg)] text-[var(--cs-text)]">
      <MarketingHeader />
      <article className="mx-auto max-w-3xl px-5 py-14 lg:py-16">
        <SectionEyebrow>Terms</SectionEyebrow>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--cs-navy)] sm:text-4xl">Using this site &amp; the early-access demo.</h1>
        <p className="mt-3 text-sm text-[var(--cs-text-muted)]">A plain-English summary of the terms for using this website and any demo we share. Full contractual terms are provided separately to customers.</p>

        <Section title="About this website">
          <p>This website describes Cara OS, a workforce, recruitment, supervision and practice-intelligence layer for children&rsquo;s homes. The product is in active development and offered on an early-access basis.</p>
        </Section>
        <Section title="The demo environment">
          <p>Any demo you see uses fictional, illustrative data — a fictional home and fictional people. It contains no real child or staff information. Demo data may reset and is for demonstration only.</p>
        </Section>
        <Section title="Decision-support, not decisions">
          <p>Cara OS supports professional judgement; it does not replace it. Matching, intelligence and AI features are decision-support tools only. Final recruitment, safeguarding and care decisions must be made by the organisation using its own professional judgement, safer-recruitment practice and statutory responsibilities.</p>
        </Section>
        <Section title="AI features">
          <p>Where AI assists with drafting or suggestions, outputs are drafts for a human to accept, edit or reject. AI never makes final decisions, and AI-assisted actions are recorded.</p>
        </Section>
        <Section title="No warranty for the demo">
          <p>The website and demo are provided &ldquo;as is&rdquo; for evaluation. We work hard to keep them accurate and available, but we don&rsquo;t guarantee uninterrupted access during early access.</p>
        </Section>
        <Section title="Acceptable use">
          <p>Please don&rsquo;t attempt to disrupt the service, misuse it, or enter real children&rsquo;s or staff personal data into a demo environment.</p>
        </Section>
        <Section title="Contact">
          <p>Questions about these terms? Reach us via the <a className="font-semibold text-[var(--cs-teal-strong)] hover:underline" href="/contact">contact page</a>.</p>
        </Section>
      </article>
      <MarketingFooter />
    </div>
  );
}
