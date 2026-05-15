import { AriaCommandCentre } from "@/components/aria/AriaCommandCentre";
import { OfstedReadinessCard } from "@/components/aria/OfstedReadinessCard";

export default async function AriaPage() {
  // TODO: Replace these placeholders with Cornerstone's real session/home context.
  const homeId = "00000000-0000-0000-0000-000000000000";
  const userId = "00000000-0000-0000-0000-000000000000";

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Aria Intelligence Centre</h1>
        <p className="mt-1 text-sm text-slate-600">
          Live oversight, evidence, Ofsted readiness, practice support and AI governance.
        </p>
      </div>

      <OfstedReadinessCard homeId={homeId} userId={userId} />

      <AriaCommandCentre
        homeId={homeId}
        userId={userId}
        defaultRoleMode="registered_manager"
      />
    </main>
  );
}
