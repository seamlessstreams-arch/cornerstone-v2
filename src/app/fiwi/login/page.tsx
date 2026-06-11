"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — Connect (sign in to your IPTV portal)
//
// Supports Xtream Codes login (portal URL + username + password) and a one-tap
// Demo portal. Credentials are validated against the portal via our proxy and
// stored only on this device.
// ══════════════════════════════════════════════════════════════════════════════

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Tv, Sparkles, ShieldCheck, Wifi, AlertCircle } from "lucide-react";
import { useFiwi } from "@/components/fiwi/fiwi-context";
import { FiwiWordmark } from "@/components/fiwi/wordmark";
import { authenticate, makeDemoProfile } from "@/lib/fiwi/client";
import { normaliseBaseUrl } from "@/lib/fiwi/xtream";
import type { FiWiProfile } from "@/lib/fiwi/types";

export default function LoginPage() {
  const router = useRouter();
  const { connect } = useFiwi();
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<"xtream" | "demo" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectXtream = async () => {
    setError(null);
    if (!baseUrl.trim() || !username.trim() || !password.trim()) {
      setError("Enter your portal URL, username and password.");
      return;
    }
    setBusy("xtream");
    const profile: FiWiProfile = {
      id: `x_${Date.now()}`,
      kind: "xtream",
      name: name.trim() || new URL(normaliseBaseUrl(baseUrl)).hostname,
      baseUrl: normaliseBaseUrl(baseUrl),
      username: username.trim(),
      password: password.trim(),
      createdAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
    };
    try {
      await authenticate(profile);
      connect(profile);
      router.replace("/fiwi/home");
    } catch (e: any) {
      setError(e?.message || "Could not connect. Check your details and try again.");
      setBusy(null);
    }
  };

  const tryDemo = async () => {
    setBusy("demo");
    const profile = makeDemoProfile();
    connect(profile);
    router.replace("/fiwi/home");
  };

  return (
    <div className="fiwi-shell relative min-h-[100dvh] overflow-hidden">
      {/* cinematic backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "radial-gradient(900px 500px at 80% 10%, rgba(123,47,247,0.35), transparent 60%), radial-gradient(700px 400px at 10% 90%, rgba(255,46,136,0.28), transparent 60%)" }} />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center gap-10 px-5 py-12 lg:flex-row lg:gap-16">
        {/* left — pitch */}
        <div className="max-w-md text-center lg:text-left">
          <FiwiWordmark className="mx-auto h-10 lg:mx-0" />
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Your TV, <span className="fiwi-brandtext">beautifully</span> streamed.
          </h1>
          <p className="mt-4 text-lg text-[var(--fw-text-2)]">
            Connect your IPTV subscription for live channels with a full guide, plus on-demand films and box sets — in one premium app.
          </p>
          <ul className="mt-6 space-y-2.5 text-left text-sm text-[var(--fw-text-2)]">
            <li className="flex items-center gap-2"><Tv className="h-4 w-4 text-[var(--fw-brand)]" /> Sky-style live guide with on-now & next</li>
            <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[var(--fw-brand)]" /> Netflix-style films & series with resume</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--fw-brand)]" /> Your login stays on your device</li>
          </ul>
        </div>

        {/* right — connect card */}
        <div className="w-full max-w-md rounded-2xl border border-[var(--fw-border)] bg-[var(--fw-surface)]/90 p-6 shadow-2xl backdrop-blur sm:p-8">
          <h2 className="text-xl font-bold">Connect your portal</h2>
          <p className="mt-1 text-sm text-[var(--fw-text-3)]">Enter the Xtream / playlist details from your provider.</p>

          <div className="mt-5 space-y-3">
            <Field label="Nickname (optional)" value={name} onChange={setName} placeholder="Living room box" />
            <Field label="Portal URL" value={baseUrl} onChange={setBaseUrl} placeholder="http://line.provider.com:8080" inputMode="url" autoCapitalize="none" />
            <Field label="Username" value={username} onChange={setUsername} placeholder="your-username" autoCapitalize="none" />
            <Field label="Password" value={password} onChange={setPassword} placeholder="••••••••" type="password" onEnter={connectXtream} />
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-[var(--fw-live)]/40 bg-[var(--fw-live)]/10 px-3 py-2 text-sm text-[#ffb4b4]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <button
            onClick={connectXtream}
            disabled={busy !== null}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            style={{ background: "var(--fw-grad-brand)" }}
          >
            {busy === "xtream" ? <><Loader2 className="h-5 w-5 animate-spin" /> Connecting…</> : <><Wifi className="h-5 w-5" /> Connect</>}
          </button>

          <div className="my-4 flex items-center gap-3 text-xs text-[var(--fw-text-3)]">
            <div className="h-px flex-1 bg-[var(--fw-border)]" /> or <div className="h-px flex-1 bg-[var(--fw-border)]" />
          </div>

          <button
            onClick={tryDemo}
            disabled={busy !== null}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--fw-border)] bg-[var(--fw-surface-2)] py-3 font-semibold text-white transition hover:bg-[var(--fw-elevated)] disabled:opacity-60"
          >
            {busy === "demo" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-[var(--fw-brand)]" />}
            Explore the demo portal
          </button>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-[var(--fw-text-3)]">
            FiWi TV is a player only — it carries no channels or content of its own. You bring your own legal subscription.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", inputMode, autoCapitalize, onEnter,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; inputMode?: "url" | "text"; autoCapitalize?: string; onEnter?: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[var(--fw-text-3)]">{label}</span>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        autoCapitalize={autoCapitalize}
        autoCorrect="off"
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && onEnter) onEnter(); }}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--fw-border)] bg-[var(--fw-bg-2)] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[var(--fw-brand)] focus:ring-2 focus:ring-[var(--fw-brand)]/30"
      />
    </label>
  );
}
