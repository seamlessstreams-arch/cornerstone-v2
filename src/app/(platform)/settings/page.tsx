"use client";

import React, { useState, useEffect } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
  Bell, Shield, Building, Users, Key,
  Globe, Mail, Phone, CheckCircle2, Save, Smartphone,
  Lock, Eye, EyeOff, Database, FileText, Zap, Monitor, User, X,
} from "lucide-react";
import { HOME } from "@/lib/seed-data";
import { useStaff } from "@/hooks/use-staff";
import { useAuthContext } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

type SettingsTab = "profile" | "home" | "notifications" | "security" | "roles" | "integrations" | "operations";

const NOTIFICATION_DEFS = [
  { label: "Task assigned to you",           key: "task_assigned",    enabled: true  },
  { label: "Task overdue",                   key: "task_overdue",     enabled: true  },
  { label: "Incident logged",                key: "incident_logged",  enabled: true  },
  { label: "Leave request pending approval", key: "leave_pending",    enabled: true  },
  { label: "Training expiring soon",         key: "training_expiring",enabled: true  },
  { label: "Supervision due",                key: "supervision_due",  enabled: true  },
  { label: "Document requires sign-off",     key: "doc_sign",         enabled: true  },
  { label: "New candidate in pipeline",      key: "recruitment",      enabled: false },
  { label: "Expense claim submitted",        key: "expense",          enabled: false },
  { label: "Open shift published",           key: "open_shift",       enabled: true  },
];

const ROLE_OPTIONS = [
  "registered_manager","responsible_individual","deputy_manager",
  "team_leader","residential_care_worker","bank_staff","admin",
];

const TABS_CFG: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "profile",       label: "My Profile",   icon: User     },
  { id: "home",          label: "Home Details",  icon: Building },
  { id: "notifications", label: "Notifications", icon: Bell     },
  { id: "security",      label: "Security",      icon: Shield   },
  { id: "roles",         label: "Roles",         icon: Users    },
  { id: "integrations",  label: "Integrations",  icon: Globe    },
  { id: "operations",    label: "Operations",    icon: Zap      },
];

function SavedBanner({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800 font-medium">
      <CheckCircle2 className="h-4 w-4 shrink-0" />Changes saved successfully.
    </div>
  );
}

function IntegrationsTab() {
  const list = [
    { name: "Supabase",      desc: "Database & authentication backend",        icon: Database },
    { name: "BrightHR",      desc: "Legacy HR data sync via Chrome extension", icon: Zap      },
    { name: "Sage Payroll",  desc: "Payroll export integration",               icon: FileText },
    { name: "ClearCare",     desc: "Care management data sync",                icon: Globe    },
    { name: "Ofsted Portal", desc: "Inspection reporting and notifications",   icon: Shield   },
  ];
  const [statuses, setStatuses] = React.useState<Record<string, "connected" | "not_connected">>({
    Supabase: "connected", BrightHR: "connected",
    "Sage Payroll": "not_connected", ClearCare: "not_connected", "Ofsted Portal": "not_connected",
  });
  const [modal, setModal] = React.useState<string | null>(null);
  const [cfg, setCfg] = React.useState("");

  function save() {
    if (modal) { setStatuses((p) => ({ ...p, [modal]: "connected" })); setModal(null); setCfg(""); }
  }

  return (
    <div className="space-y-4">
      {list.map(({ name, desc, icon: Icon }) => {
        const connected = statuses[name] === "connected";
        return (
          <div key={name} className="rounded-2xl border border-[var(--cs-border)] bg-white p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              <Icon className="h-6 w-6 text-[var(--cs-text-secondary)]" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-[var(--cs-navy)]">{name}</div>
              <div className="text-xs text-[var(--cs-text-muted)]">{desc}</div>
            </div>
            <Badge className={cn("text-[10px] rounded-full", connected ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-[var(--cs-text-muted)]")}>
              {connected ? "Connected" : "Not connected"}
            </Badge>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setModal(name)}>
              {connected ? "Configure" : "Connect"}
            </Button>
          </div>
        );
      })}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-semibold text-[var(--cs-navy)]">{statuses[modal] === "connected" ? "Configure" : "Connect"} {modal}</div>
                <div className="text-xs text-[var(--cs-text-muted)] mt-0.5">Enter API key for {modal}.</div>
              </div>
              <button onClick={() => setModal(null)} className="text-[var(--cs-text-muted)] hover:text-[var(--cs-text-secondary)]"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--cs-text-secondary)]">API Key</label>
              <input className="w-full rounded-xl border border-[var(--cs-border)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" value={cfg} onChange={(e) => setCfg(e.target.value)} placeholder="Enter API key…" />
            </div>
            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setModal(null)}>Cancel</Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={save} disabled={!cfg}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const { currentUser } = useAuthContext();
  const staffQ = useStaff();
  const allStaff = (staffQ.data?.data ?? []).filter((s) => s.is_active);
  const me = allStaff.find((s) => s.id === (currentUser?.id ?? "staff_darren")) ?? allStaff[0];

  const [tab, setTab] = useState<SettingsTab>("profile");
  const [profile, setProfile] = useState({ first_name: "", last_name: "", email: "", phone: "", payroll_id: "" });
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (me) setProfile({ first_name: me.first_name ?? "", last_name: me.last_name ?? "", email: me.email ?? "", phone: me.phone ?? "", payroll_id: me.payroll_id ?? "" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.id]);

  const [homeForm, setHomeForm] = useState({
    name: HOME.name ?? "", ofsted_urn: HOME.ofsted_urn ?? "", address: HOME.address ?? "",
    phone: HOME.phone ?? "", max_beds: String(HOME.max_beds ?? ""),
    last_inspection_date: HOME.last_inspection_date ?? "", last_inspection_grade: HOME.last_inspection_grade ?? "",
  });
  const [homeSaved, setHomeSaved] = useState(false);

  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_DEFS.map((n) => [n.key, n.enabled])),
  );
  const [notifSaved, setNotifSaved] = useState(false);

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSaved, setPwSaved] = useState(false);
  const [signedOut, setSignedOut] = useState<Set<string>>(new Set());

  const [roles, setRoles] = useState<Record<string, string>>({});
  const [rolesSaved, setRolesSaved] = useState(false);

  function flash(setter: (v: boolean) => void) { setter(true); setTimeout(() => setter(false), 3500); }
  const handleSaveProfile = () => flash(setProfileSaved);
  const handleSaveHome    = () => flash(setHomeSaved);
  const handleSaveNotifs  = () => flash(setNotifSaved);
  const handleSaveRoles   = () => flash(setRolesSaved);

  function handleUpdatePw() {
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) { setPwError("All fields required."); return; }
    if (pwForm.next.length < 8) { setPwError("Min 8 characters."); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError("Passwords don't match."); return; }
    setPwError(null); setPwForm({ current: "", next: "", confirm: "" }); flash(setPwSaved);
  }

  return (
    <PageShell title="Settings" subtitle="Account, home configuration, and preferences" showQuickCreate={false}>
      <div className="flex gap-6">
        <aside className="w-52 shrink-0">
          <nav className="space-y-0.5">
            {TABS_CFG.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)} className={cn("w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors text-left", tab === id ? "bg-slate-900 text-white" : "text-[var(--cs-text-secondary)] hover:bg-[var(--cs-surface)] hover:text-[var(--cs-navy)]")}>
                <Icon className="h-4 w-4 shrink-0" />{label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0 space-y-5">

          {tab === "profile" && me && (
            <Card>
              <CardHeader><CardTitle>My Profile</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-5">
                  <Avatar name={me.full_name} size="xl" />
                  <div>
                    <div className="text-lg font-bold text-[var(--cs-navy)]">{me.full_name}</div>
                    <div className="text-sm text-[var(--cs-text-muted)]">{me.job_title}</div>
                    <Button size="sm" variant="outline" className="mt-2 h-8 text-xs" disabled>Change photo</Button>
                  </div>
                </div>
                <SavedBanner show={profileSaved} />
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "First name", key: "first_name" as const },
                    { label: "Last name",  key: "last_name"  as const },
                    { label: "Email",      key: "email"      as const },
                    { label: "Phone",      key: "phone"      as const },
                    { label: "Payroll ID", key: "payroll_id" as const },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label className="text-xs font-semibold text-[var(--cs-text-secondary)] block mb-1">{label}</label>
                      <Input value={profile[key]} onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))} />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold text-[var(--cs-text-secondary)] block mb-1">Role</label>
                    <Input value={me.job_title} disabled className="bg-slate-50" />
                  </div>
                </div>
                <Button className="w-full" onClick={handleSaveProfile}><Save className="h-4 w-4 mr-2" />Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {tab === "home" && (
            <Card>
              <CardHeader><CardTitle>Home Details — {HOME.name}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <SavedBanner show={homeSaved} />
                <div className="grid grid-cols-2 gap-4">
                  {([ { label: "Home name", key: "name" }, { label: "Ofsted URN", key: "ofsted_urn" }, { label: "Address", key: "address" }, { label: "Phone", key: "phone" }, { label: "Max beds", key: "max_beds" }, { label: "Last inspection", key: "last_inspection_date" }, { label: "Last grade", key: "last_inspection_grade" } ] as { label: string; key: keyof typeof homeForm }[]).map(({ label, key }) => (
                    <div key={key}>
                      <label className="text-xs font-semibold text-[var(--cs-text-secondary)] block mb-1">{label}</label>
                      <Input value={homeForm[key]} onChange={(e) => setHomeForm((f) => ({ ...f, [key]: e.target.value }))} />
                    </div>
                  ))}
                </div>
                <Button onClick={handleSaveHome}><Save className="h-4 w-4 mr-2" />Save Home Details</Button>
              </CardContent>
            </Card>
          )}

          {tab === "notifications" && (
            <Card>
              <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <SavedBanner show={notifSaved} />
                {NOTIFICATION_DEFS.map((n) => (
                  <div key={n.key} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm text-[var(--cs-text-secondary)]">{n.label}</span>
                    <button onClick={() => setNotifications((p) => ({ ...p, [n.key]: !p[n.key] }))} className={cn("relative h-6 w-10 rounded-full transition-colors", notifications[n.key] ? "bg-blue-600" : "bg-slate-200")}>
                      <div className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform", notifications[n.key] ? "translate-x-4" : "translate-x-0.5")} />
                    </button>
                  </div>
                ))}
                <Button className="w-full mt-2" onClick={handleSaveNotifs}><Save className="h-4 w-4 mr-2" />Save Preferences</Button>
              </CardContent>
            </Card>
          )}

          {tab === "security" && (
            <div className="space-y-5">
              <Card>
                <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <SavedBanner show={pwSaved} />
                  <div>
                    <label className="text-xs font-semibold text-[var(--cs-text-secondary)] block mb-1">Current password</label>
                    <div className="relative">
                      <Input type={showPw ? "text" : "password"} placeholder="••••••••" value={pwForm.current} onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))} />
                      <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cs-text-muted)]">
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--cs-text-secondary)] block mb-1">New password</label>
                    <Input type="password" placeholder="••••••••" value={pwForm.next} onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[var(--cs-text-secondary)] block mb-1">Confirm new password</label>
                    <Input type="password" placeholder="••••••••" value={pwForm.confirm} onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))} />
                  </div>
                  {pwError && <p className="text-xs text-red-600 font-medium">{pwError}</p>}
                  <Button onClick={handleUpdatePw}><Lock className="h-4 w-4 mr-2" />Update Password</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Active Sessions</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { device: "MacBook Pro — Derby",   last: "Now (this session)", icon: Monitor,    current: true,  key: "macbook" },
                      { device: "iPhone 15 Pro — Mobile",last: "2 hours ago",        icon: Smartphone, current: false, key: "iphone"  },
                    ].map(({ device, last, icon: Icon, current, key }) => (
                      <div key={key} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                        <Icon className="h-5 w-5 text-[var(--cs-text-muted)]" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[var(--cs-navy)]">{device}</div>
                          <div className="text-xs text-[var(--cs-text-muted)]">{signedOut.has(key) ? "Signed out" : last}</div>
                        </div>
                        {current ? (
                          <Badge className="text-[9px] rounded-full bg-emerald-100 text-emerald-700">Current</Badge>
                        ) : signedOut.has(key) ? (
                          <Badge className="text-[9px] rounded-full bg-slate-100 text-[var(--cs-text-muted)]">Signed out</Badge>
                        ) : (
                          <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200" onClick={() => setSignedOut((p) => new Set([...p, key]))}>Sign out</Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {tab === "roles" && (
            <Card>
              <CardHeader><CardTitle>Roles &amp; Permissions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <SavedBanner show={rolesSaved} />
                {allStaff.map((staff) => (
                  <div key={staff.id} className="flex items-center gap-4 rounded-xl bg-slate-50 px-4 py-3">
                    <Avatar name={staff.full_name} size="sm" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[var(--cs-navy)]">{staff.full_name}</div>
                      <div className="text-xs text-[var(--cs-text-muted)]">{staff.email}</div>
                    </div>
                    <select value={roles[staff.id] ?? staff.role} onChange={(e) => setRoles((r) => ({ ...r, [staff.id]: e.target.value }))} disabled={staff.id === (currentUser?.id ?? "staff_darren")} className="h-8 rounded-xl border border-[var(--cs-border)] px-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100">
                      {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
                    </select>
                  </div>
                ))}
                <Button className="mt-1" onClick={handleSaveRoles}><Key className="h-4 w-4 mr-2" />Save Role Changes</Button>
              </CardContent>
            </Card>
          )}

          {tab === "integrations" && <IntegrationsTab />}

          {tab === "operations" && <OperationsSettingsTab />}

        </div>
      </div>
    </PageShell>
  );
}

// ── Operations Settings Tab ────────────────────────────────────────────────

function OperationsSettingsTab() {
  const SETTINGS_GROUPS = [
    {
      title: "ARIA Intelligence",
      icon: Zap,
      settings: [
        { key: "aria.enabled", label: "ARIA Intelligence", desc: "Enable or disable ARIA AI intelligence features", type: "toggle" as const, value: true },
        { key: "aria.auto_scan_interval_hours", label: "Auto-Scan Interval (hours)", desc: "How often ARIA scans for patterns", type: "number" as const, value: 24 },
        { key: "aria.recommendation_expiry_days", label: "Recommendation Expiry (days)", desc: "Days before unacted recommendations expire", type: "number" as const, value: 7 },
        { key: "aria.minimum_confidence", label: "Minimum Confidence (0-1)", desc: "Minimum confidence threshold", type: "number" as const, value: 0.7 },
        { key: "aria.show_positive_patterns", label: "Show Positive Patterns", desc: "Include positive recognition recommendations", type: "toggle" as const, value: true },
        { key: "aria.oversight_prompts_enabled", label: "Oversight Quality Prompts", desc: "Show ARIA prompts when writing oversight", type: "toggle" as const, value: true },
      ],
    },
    {
      title: "Compliance Thresholds",
      icon: Shield,
      settings: [
        { key: "compliance.supervision_interval_weeks", label: "Supervision Interval (weeks)", desc: "Maximum weeks between supervisions", type: "number" as const, value: 6 },
        { key: "compliance.max_consecutive_shifts", label: "Max Consecutive Shifts", desc: "Days before wellbeing alert", type: "number" as const, value: 6 },
        { key: "compliance.missing_protocol_hours", label: "Missing Protocol (hours)", desc: "Hours before police escalation", type: "number" as const, value: 1 },
        { key: "compliance.medication_audit_interval_days", label: "Medication Audit Interval (days)", desc: "Days between stock audits", type: "number" as const, value: 7 },
      ],
    },
    {
      title: "Operational Defaults",
      icon: Building,
      settings: [
        { key: "ops.home_capacity", label: "Home Capacity", desc: "Maximum registered places", type: "number" as const, value: 5 },
        { key: "ops.daily_log_min_length", label: "Daily Log Min Length", desc: "Minimum characters for daily logs", type: "number" as const, value: 50 },
        { key: "ops.incident_sign_off_required", label: "Incident Sign-Off Required", desc: "Manager sign-off on all incidents", type: "toggle" as const, value: true },
        { key: "ops.handover_yp_updates_required", label: "Handover YP Updates Required", desc: "Per-child updates in handover notes", type: "toggle" as const, value: true },
      ],
    },
    {
      title: "Notification Timing",
      icon: Bell,
      settings: [
        { key: "notify.task_overdue_hours", label: "Task Overdue Alert (hours)", desc: "Hours after due date before flagging", type: "number" as const, value: 2 },
        { key: "notify.oversight_reminder_hours", label: "Oversight Reminder (hours)", desc: "Hours before oversight reminder", type: "number" as const, value: 48 },
        { key: "notify.training_expiry_days", label: "Training Expiry Warning (days)", desc: "Days before training expiry warning", type: "number" as const, value: 30 },
        { key: "notify.shift_unfilled_days", label: "Shift Unfilled Warning (days)", desc: "Days in advance to flag", type: "number" as const, value: 7 },
      ],
    },
  ];

  const [values, setValues] = React.useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    for (const group of SETTINGS_GROUPS) {
      for (const s of group.settings) {
        initial[s.key] = s.value;
      }
    }
    return initial;
  });

  return (
    <div className="space-y-6">
      {SETTINGS_GROUPS.map((group) => {
        const Icon = group.icon;
        return (
          <Card key={group.title}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Icon className="h-4 w-4 text-[var(--cs-text-muted)]" /> {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.settings.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--cs-navy)]">{setting.label}</p>
                    <p className="text-xs text-[var(--cs-text-muted)]">{setting.desc}</p>
                  </div>
                  {setting.type === "toggle" ? (
                    <button
                      onClick={() => setValues((prev) => ({ ...prev, [setting.key]: !prev[setting.key] }))}
                      className={cn(
                        "h-6 w-11 rounded-full relative transition-colors shrink-0",
                        values[setting.key] ? "bg-emerald-500" : "bg-gray-300",
                      )}
                    >
                      <div className={cn(
                        "h-5 w-5 bg-white rounded-full absolute top-0.5 transition-all shadow",
                        values[setting.key] ? "left-[22px]" : "left-0.5",
                      )} />
                    </button>
                  ) : (
                    <Input
                      type="number"
                      value={String(values[setting.key] ?? "")}
                      onChange={(e) => setValues((prev) => ({ ...prev, [setting.key]: parseFloat(e.target.value) || 0 }))}
                      className="w-24 text-right text-sm shrink-0"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
      <Button className="gap-2">
        <Save className="h-4 w-4" /> Save Operations Settings
      </Button>
    </div>
  );
}
