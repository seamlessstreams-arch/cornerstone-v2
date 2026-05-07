import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AfterCareRecord } from "@/types/extended";

const KEY = "after-care";
const API = "/api/v1/after-care";

export function useAfterCare(childId?: string) {
  return useQuery<{ data: AfterCareRecord[] }>({
    queryKey: childId ? [KEY, childId] : [KEY],
    queryFn: () => fetch(childId ? `${API}?child_id=${childId}` : API).then((r) => r.json()),
  });
}

export function useCreateAfterCareRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AfterCareRecord>) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateAfterCareRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AfterCareRecord> & { id: string }) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
