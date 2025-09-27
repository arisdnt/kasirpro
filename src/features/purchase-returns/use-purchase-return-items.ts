import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { PurchaseReturnItem } from "@/types/transactions";
import {
  addPurchaseReturnItem,
  deletePurchaseReturn,
  deletePurchaseReturnItem,
  fetchPurchaseReturnItems,
  fetchPurchaseItemsWithReturnable,
  updatePurchaseReturnHeader,
  updatePurchaseReturnItem,
} from "./api";

export function usePurchaseReturnItemsQuery(returId: string | null) {
  return useQuery<PurchaseReturnItem[]>({
    queryKey: ["purchase-return-items", returId],
    enabled: Boolean(returId),
    queryFn: () => fetchPurchaseReturnItems(returId!),
    staleTime: 1000 * 15,
  });
}

export function usePurchaseItemsWithReturnableQuery(transaksiId: string | null) {
  return useQuery({
    queryKey: ["purchase-items-with-returnable", transaksiId],
    enabled: Boolean(transaksiId),
    queryFn: () => fetchPurchaseItemsWithReturnable(transaksiId!),
    staleTime: 1000 * 15,
  });
}

export function useAddPurchaseReturnItem(returId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { produkId: string; qty: number; hargaSatuan: number }) =>
      addPurchaseReturnItem({ returId, ...p }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["purchase-return-items", returId] });
      await qc.invalidateQueries({ queryKey: ["purchase-returns"] });
    },
  });
}

export function useUpdatePurchaseReturnItem(returId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id: string; qty: number; hargaSatuan: number }) =>
      updatePurchaseReturnItem({ ...p, returId }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["purchase-return-items", returId] });
      await qc.invalidateQueries({ queryKey: ["purchase-returns"] });
    },
  });
}

export function useDeletePurchaseReturnItem(returId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePurchaseReturnItem({ id, returId }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["purchase-return-items", returId] });
      await qc.invalidateQueries({ queryKey: ["purchase-returns"] });
    },
  });
}

export function useUpdatePurchaseReturnHeader() {
  const qc = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();
  return useMutation({
    mutationFn: updatePurchaseReturnHeader,
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({ queryKey: ["purchase-returns", user?.tenantId, user?.tokoId] });
      await qc.invalidateQueries({ queryKey: ["purchase-return-items", vars.id] });
    },
  });
}

export function useDeletePurchaseReturn() {
  const qc = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();
  return useMutation({
    mutationFn: (returId: string) => deletePurchaseReturn(returId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["purchase-returns", user?.tenantId, user?.tokoId] });
    },
  });
}
