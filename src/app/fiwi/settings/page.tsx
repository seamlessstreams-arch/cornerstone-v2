"use client";

// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — Settings (account, portals, playback data, about)
// ══════════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, LogOut, Trash2, CheckCircle2, AlertTriangle, Wifi, ShieldCheck } from "lucide-react";
import { useFiwi, useRequireProfile } from "@/components/fiwi/fiwi-context";
import { useAccount } from "@/hooks/fiwi/use-fiwi-data";
import { FiwiWordmark } from "@/components/fiwi/wordmark";
import { loadProfiles, deleteProfile } from "@/lib/fiwi/client";
import type { FiWiProfile } from "@/lib/fiwi/types";

export default function SettingsPage() {
  const profile = useRequireProfile();
  const router = useRouter();
  const { disconnect, switchTo } = useFiwi();
  const account = useAccount(profile);
  const [profiles, setProfiles] = useState<FiWiProfile[]>([]);

  useEffect(() => setProfiles(loadProfiles()), [profile]);

  const expiry = account.data?.expiresAt
    ? new Date(account.data.expiresAt * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "Unlimited / unknown";

  const removeProfile = (id: string) => {
    deleteProfile(id);
    setProfiles(loadProfiles());
    if (id === profile?.id) router.replace("/fiwi/login");
  };

  const clearPlayback = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("fiwi.progress.v1");
    localStorage.removeItem("fiwi.mylist.v1");
    window.dispatchEvent(new Event("fiwi:progress"));
    window.dispatchEvent(new Event("fiwi:mylist"));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pt-20 sm:px-8">
      <div className="mb-8 flex items-center justify-between">
        <FiwiWordmark className="h-8" />
        <button
          onClick={() => { disconnect(); router.replace("/fiwi/login"); }}
          className="flex items-center gap-2 rounded-full border border-[var(--fw-border)] px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" /> Disconnect
        </button>
      </div>

      {/* account */}
      <Card title="Current portal">
        <div className="flex items-center gap-2">
          {account.isLoading ? (
            <span className="text-sm text-[var(--fw-text-3)]">Checking subscription…</span>
          ) : account.isError ? (
            <span className="flex items-center gap-2 text-sm text-[#ffb4b4]"><AlertTriangle className="h-4 w-4" /> Could not verify this portal.</span>
          ) : (
            <span className="flex items-center gap-2 text-sm text-[var(--fw-success)]"><CheckCircle2 className="h-4 w-4" /> Active{account.data?.isTrial ? " (trial)" : ""}</span>
          )}
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Info label="Nickname" value={profile?.name ?? "—"} />
          <Info label="Type" value={profile?.kind === "demo" ? "Demo" : profile?.kind?.toUpperCase() ?? "—"} />
          <Info label="Username" value={account.data?.username ?? profile?.username ?? "—"} />
          <Info label="Expires" value={expiry} />
          <Info label="Connections" value={account.data ? `${account.data.activeConnections} / ${account.data.maxConnections || "—"}` : "—"} />
          <Info label="Server" value={account.data?.serverName ?? (profile?.baseUrl || "—")} />
        </dl>
      </Card>

      {/* portals */}
      <Card title="Saved portals">
        <div className="space-y-2">
          {profiles.map((p) => (
            <div key={p.id} className={`flex items-center gap-3 rounded-xl border p-3 ${p.id === profile?.id ? "border-[var(--fw-brand)]/50 bg-white/5" : "border-[var(--fw-border-soft)]"}`}>
              <div className="grid h-9 w-9 place-items-center rounded-md text-sm font-bold text-white" style={{ background: "var(--fw-grad-brand)" }}>
                {p.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{p.name}</p>
                <p className="truncate text-xs text-[var(--fw-text-3)]">{p.kind === "demo" ? "Demo portal" : p.baseUrl}</p>
              </div>
              {p.id === profile?.id ? (
                <span className="text-xs font-semibold text-[var(--fw-brand)]">Active</span>
              ) : (
                <button onClick={() => switchTo(p.id)} className="rounded-full border border-[var(--fw-border)] px-3 py-1 text-xs font-semibold text-white hover:bg-white/10">Switch</button>
              )}
              <button onClick={() => removeProfile(p.id)} aria-label="Remove" className="rounded-full p-1.5 text-[var(--fw-text-3)] hover:bg-white/10 hover:text-[#ffb4b4]">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => router.push("/fiwi/login")}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--fw-border)] py-3 text-sm font-semibold text-[var(--fw-text-2)] hover:text-white"
        >
          <Plus className="h-4 w-4" /> Add another portal
        </button>
      </Card>

      {/* playback data */}
      <Card title="Playback & data">
        <p className="text-sm text-[var(--fw-text-3)]">Continue-watching progress and your list are stored only on this device.</p>
        <button onClick={clearPlayback} className="mt-3 rounded-xl border border-[var(--fw-border)] px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
          Clear continue-watching & My List
        </button>
      </Card>

      {/* about */}
      <Card title="About FiWi TV">
        <ul className="space-y-2 text-sm text-[var(--fw-text-2)]">
          <li className="flex items-center gap-2"><Wifi className="h-4 w-4 text-[var(--fw-brand)]" /> Installable PWA — add to your home screen for a full-screen app.</li>
          <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--fw-brand)]" /> Your credentials never leave your device except to your own provider.</li>
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-[var(--fw-text-3)]">
          FiWi TV is a media player for IPTV subscriptions you already pay for. It hosts no channels or content and is not affiliated with any provider, Sky, Virgin Media or Netflix.
        </p>
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5 rounded-2xl border border-[var(--fw-border)] bg-[var(--fw-surface)]/60 p-5">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--fw-text-3)]">{title}</h2>
      {children}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-[var(--fw-text-3)]">{label}</dt>
      <dd className="truncate text-sm font-medium text-white">{value}</dd>
    </div>
  );
}
