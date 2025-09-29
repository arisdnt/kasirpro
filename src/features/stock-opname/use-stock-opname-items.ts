import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addOpnameItem, deleteOpnameItem, fetchOpnameItems, updateOpnameItem } from "./items-api";

export function useOpnameItems(opnameId: string | null) {
  return useQuery({
    queryKey: ["stock-opname", "items", opnameId],
    enabled: Boolean(opnameId),
    queryFn: () => fetchOpnameItems(opnameId!),
  });
}

export function useAddOpnameItem(opnameId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addOpnameItem,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["stock-opname", "items", opnameId] });
      void qc.invalidateQueries({ queryKey: ["stock-opname", "detail"] });
    },
  });
}

export function useUpdateOpnameItem(opnameId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateOpnameItem,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["stock-opname", "items", opnameId] });
      void qc.invalidateQueries({ queryKey: ["stock-opname", "detail"] });
    },
  });
}

export function useDeleteOpnameItem(opnameId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteOpnameItem,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["stock-opname", "items", opnameId] });
      void qc.invalidateQueries({ queryKey: ["stock-opname", "detail"] });
    },
  });
}

