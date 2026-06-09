// ══════════════════════════════════════════════════════════════════════════════
// CORNERSTONE — PRIVACY  (route: /privacy)
// Plain-English summary. Honest — no fabricated certifications or claims.
// ══════════════════════════════════════════════════════════════════════════════

import type { Metadata } from "next";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { SectionEyebrow } from "@/components/marketing/ui";

export const metadata: Metadata = {
  title: "Privacy | Cornerstone Care OS",
  description: "How Cornerstone Care OS handles the information you share with us — a plain-English privacy summary.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-[var(--cs-navy)]">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-[var(--cs-text-secondary)]">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--cs-bg)] text-[var(--cs-text)]">
      <MarketingHeader />
      <article className="mx-auto max-w-3xl px-5 py-14 lg:py-16">
        <SectionEyebrow>Privacy</SectionEyebrow>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--cs-navy)] sm:text-4xl">Your information, handled with care.</h1>
        <p className="mt-3 text-sm text-[var(--cs-text-muted)]">A plain-English summary of how we handle the information you share through this website. This is a summary, not a contract — if you need our full data-processing terms, just ask.</p>

        <Section title="What we collect">
          <p>When you request early access or contact us, we collect what you choose to give us — typically your name, organisation, role, email, the number of homes you run, and what you&rsquo;d like help with. This website does not ask for any information about children or care records.</p>
        </Section>
        <Section title="Why we use it">
          <p>We use your details solely to respond to your enquiry and talk to you about Cornerstone Care OS. We don&rsquo;t sell your data, and we don&rsquo;t add you to unrelated marketing.</p>
        </Section>
        <Section title="Lawful basis (UK GDPR)">
          <p>We rely on your consent and our legitimate interest in responding to enquiries about our product. You can withdraw consent and ask us to stop contacting you at any time.</p>
        </Section>
        <Section title="How long we keep it">
          <p>We keep enquiry details only as long as needed to follow up, and then for a reasonable period to maintain a record of our conversation. You can ask us to delete your details sooner.</p>
        </Section>
        <Section title="Your rights">
          <p>Under UK data-protection law you can ask to access, correct or delete the information we hold about you, and to object to or restrict how we use it. To exercise any of these, email us and we&rsquo;ll help.</p>
        </Section>
        <Section title="Security">
          <p>We treat your information as confidential and apply role-based access, audit trails and least-privilege principles across the platform. Cornerstone Care OS is designed with safeguarding, safer recruitment and data protection in mind. We don&rsquo;t claim certifications we don&rsquo;t hold.</p>
        </Section>
        <Section title="Cookies">
          <p>This site uses only what&rsquo;s necessary to function. We don&rsquo;t use intrusive advertising trackers.</p>
        </Section>
        <Section title="Contact">
          <p>Questions about privacy or your data? Email <a className="font-semibold text-[var(--cs-teal-strong)] hover:underline" href="mailto:hello@cornerstonecare.app">hello@cornerstonecare.app</a> and we&rsquo;ll respond personally.</p>
        </Section>
      </article>
      <MarketingFooter />
    </div>
  );
}
