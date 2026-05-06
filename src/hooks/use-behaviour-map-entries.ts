import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BehaviourMapEntry } from "@/types/extended";

const KEY = "behaviour-map-entries";
const API = "/api/v1/behaviour-map-entries";

export function useBehaviourMapEntries(childId?: string) {
  return useQuery<{ data: BehaviourMapEntry[] }>({
    queryKey: childId ? [KEY, childId] : [KEY],
    queryFn: () => fetch(childId ? `${API}?child_id=${childId}` : API).then((r) => r.json()),
  });
}

export function useCreateBehaviourMapEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BehaviourMapEntry>) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateBehaviourMapEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BehaviourMapEntry> & { id: string }) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
