import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { ReturnItem } from "@/features/returns/types";
import {
  addReturnItem,
  deleteReturn,
  deleteReturnItem,
  fetchReturnItems,
  fetchSaleItemsWithReturnable,
  updateReturnHeader,
  updateReturnItem,
} from "./api";

export function useReturnItemsQuery(returId: string | null) {
  return useQuery<ReturnItem[]>({
    queryKey: ["sales-return-items", returId],
    enabled: Boolean(returId),
    queryFn: () => fetchReturnItems(returId!),
    staleTime: 1000 * 15,
  });
}

export function useSaleItemsWithReturnableQuery(transaksiId: string | null) {
  return useQuery({
    queryKey: ["sale-items-with-returnable", transaksiId],
    enabled: Boolean(transaksiId),
    queryFn: () => fetchSaleItemsWithReturnable(transaksiId!),
    staleTime: 1000 * 15,
  });
}

export function useAddReturnItem(returId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { produkId: string; qty: number; hargaSatuan: number }) =>
      addReturnItem({ returId, ...p }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["sales-return-items", returId] });
      await qc.invalidateQueries({ queryKey: ["sales-returns"] });
    },
  });
}

export function useUpdateReturnItem(returId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id: string; qty: number; hargaSatuan: number }) =>
      updateReturnItem({ ...p, returId }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["sales-return-items", returId] });
      await qc.invalidateQueries({ queryKey: ["sales-returns"] });
    },
  });
}

export function useDeleteReturnItem(returId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReturnItem({ id, returId }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["sales-return-items", returId] });
      await qc.invalidateQueries({ queryKey: ["sales-returns"] });
    },
  });
}

export function useUpdateReturnHeader() {
  const qc = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();
  return useMutation({
    mutationFn: updateReturnHeader,
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({ queryKey: ["sales-returns", user?.tenantId, user?.tokoId] });
      await qc.invalidateQueries({ queryKey: ["sales-return-items", vars.id] });
    },
  });
}

export function useDeleteReturn() {
  const qc = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();
  return useMutation({
    mutationFn: (returId: string) => deleteReturn(returId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["sales-returns", user?.tenantId, user?.tokoId] });
    },
  });
}
