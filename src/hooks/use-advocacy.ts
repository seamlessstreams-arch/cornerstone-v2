import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdvocacyRecord } from "@/types/extended";

const KEY = "advocacy";
const API = "/api/v1/advocacy";

export function useAdvocacy(childId?: string) {
  return useQuery<{ data: AdvocacyRecord[] }>({
    queryKey: childId ? [KEY, childId] : [KEY],
    queryFn: () => fetch(childId ? `${API}?child_id=${childId}` : API).then((r) => r.json()),
  });
}

export function useCreateAdvocacyRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AdvocacyRecord>) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateAdvocacyRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AdvocacyRecord> & { id: string }) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
