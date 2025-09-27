import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { PurchaseReturnTransaction } from "@/features/purchase-returns/types";
import { createPurchaseReturnDraft, fetchPurchaseReturns } from "./api";

const PURCHASE_RETURNS_KEY = ["purchase-returns"];

export function usePurchaseReturnsQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<PurchaseReturnTransaction[]>({
    queryKey: [...PURCHASE_RETURNS_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchPurchaseReturns(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 60,
  });
}

export function useCreatePurchaseReturnDraft() {
  const qc = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();
  return useMutation({
    mutationFn: async (params: { purchaseId: string; supplierId: string }) => {
      if (!user) throw new Error("Unauthorized");
      return createPurchaseReturnDraft({
        tenantId: user.tenantId,
        tokoId: user.tokoId ?? null,
        penggunaId: user.id,
        purchaseId: params.purchaseId,
        supplierId: params.supplierId,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchase-returns"] });
    },
  });
}