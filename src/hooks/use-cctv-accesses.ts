import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CCTVAccess } from "@/types/extended";

const KEY = "cctv-accesses";
const API = "/api/v1/cctv-accesses";

export function useCCTVAccesses() {
  return useQuery<{ data: CCTVAccess[] }>({
    queryKey: [KEY],
    queryFn: () => fetch(API).then((r) => r.json()),
  });
}

export function useCreateCCTVAccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CCTVAccess>) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateCCTVAccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CCTVAccess> & { id: string }) =>
      fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
