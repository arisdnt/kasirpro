import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { ReturnTransaction } from "@/types/transactions";
import { createSalesReturnDraft, fetchSalesReturns } from "./api";

const RETURNS_KEY = ["sales-returns"];

export function useSalesReturnsQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<ReturnTransaction[]>({
    queryKey: [...RETURNS_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchSalesReturns(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 30,
  });
}

export function useCreateSalesReturnDraft() {
  const queryClient = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (params: { saleId: string; pelangganId: string | null }) => {
      if (!user) throw new Error("Unauthorized");
      return createSalesReturnDraft({
        tenantId: user.tenantId,
        tokoId: user.tokoId ?? null,
        penggunaId: user.id,
        saleId: params.saleId,
        pelangganId: params.pelangganId,
      });
    },
    onSuccess: () => {
      // Refresh list
      queryClient.invalidateQueries({ queryKey: ["sales-returns"] });
    },
  });
}