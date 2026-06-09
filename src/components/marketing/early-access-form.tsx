"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";

const ROLES = ["Registered Manager", "Responsible Individual", "Director / Owner", "Deputy Manager", "Team Leader", "Residential Childcare Worker", "Commissioner", "Other"];
const HOME_COUNTS = ["1 home", "2–5 homes", "6–10 homes", "11+ homes", "Not a provider yet"];

const labelCls = "block text-xs font-bold uppercase tracking-wide text-[var(--cs-text-muted)]";
const fieldCls = "mt-1.5 w-full rounded-lg border border-[var(--cs-border)] bg-white px-3 py-2.5 text-sm text-[var(--cs-text)] focus:border-[var(--cs-teal)] focus:outline-none focus:ring-1 focus:ring-[var(--cs-teal)]";

export function EarlyAccessForm() {
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", organisation: "", role: "", email: "", number_of_homes: "", looking_for: "" });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.email.trim()) { setError("Please add your name and email."); return; }
    setState("submitting");
    try {
      const res = await fetch("/api/v1/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setState("error"); setError(json.error || "Something went wrong. Please try again or email us."); return; }
      setState("done");
    } catch {
      setState("error");
      setError("Couldn't reach the server. Please try again, or email hello@cornerstonecare.app.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-3xl border border-[var(--cs-teal-soft)] bg-[var(--cs-teal-bg)]/50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-[var(--cs-teal-strong)]" />
        <h3 className="mt-3 text-xl font-bold text-[var(--cs-navy)]">Thank you — we&rsquo;ve got it.</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--cs-text-secondary)]">
          We&rsquo;ll be in touch about early access to Cornerstone Care OS. If it&rsquo;s urgent, email us at{" "}
          <a className="font-semibold text-[var(--cs-teal-strong)] hover:underline" href="mailto:hello@cornerstonecare.app">hello@cornerstonecare.app</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-[var(--cs-border)] bg-white p-6 shadow-[var(--cs-shadow-card)] sm:p-8" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="ea-name" className={labelCls}>Name <span className="text-red-500">*</span></label>
          <input id="ea-name" className={fieldCls} value={form.name} onChange={(e) => set("name", e.target.value)} required autoComplete="name" />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="ea-org" className={labelCls}>Organisation</label>
          <input id="ea-org" className={fieldCls} value={form.organisation} onChange={(e) => set("organisation", e.target.value)} autoComplete="organization" />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="ea-role" className={labelCls}>Your role</label>
          <select id="ea-role" className={fieldCls} value={form.role} onChange={(e) => set("role", e.target.value)}>
            <option value="">Select…</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="ea-email" className={labelCls}>Email <span className="text-red-500">*</span></label>
          <input id="ea-email" type="email" className={fieldCls} value={form.email} onChange={(e) => set("email", e.target.value)} required autoComplete="email" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ea-homes" className={labelCls}>Number of homes</label>
          <select id="ea-homes" className={fieldCls} value={form.number_of_homes} onChange={(e) => set("number_of_homes", e.target.value)}>
            <option value="">Select…</option>
            {HOME_COUNTS.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ea-help" className={labelCls}>What are you looking for help with?</label>
          <textarea id="ea-help" className={`${fieldCls} min-h-[110px]`} value={form.looking_for} onChange={(e) => set("looking_for", e.target.value)} placeholder="e.g. values-led recruitment, evidencing safer recruitment, stronger supervision, Ofsted readiness…" />
        </div>
      </div>

      {error && (
        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-red-700" role="alert"><AlertCircle className="h-4 w-4" /> {error}</p>
      )}

      <button type="submit" disabled={state === "submitting"} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--cs-navy)] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[var(--cs-navy-soft)] hover:shadow-md disabled:opacity-60 sm:w-auto">
        {state === "submitting" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <>Request early access <ArrowRight className="h-4 w-4" /></>}
      </button>
      <p className="mt-3 text-xs text-[var(--cs-text-muted)]">We&rsquo;ll only use your details to talk to you about Cornerstone Care OS. No spam, ever.</p>
    </form>
  );
}
