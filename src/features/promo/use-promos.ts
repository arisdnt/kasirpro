import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { PromoWithRelations } from "@/types/promo";
import { fetchPromos, updatePromoStatus } from "./api";

const PROMO_LIST_KEY = ["promo-list"] as const;

export function usePromoList(filterStoreId?: string | null | "all") {
  const {
    state: { user },
  } = useSupabaseAuth();

  const effectiveStore = filterStoreId && filterStoreId !== "all" ? filterStoreId : user?.tokoId ?? null;

  return useQuery<PromoWithRelations[]>({
    queryKey: [...PROMO_LIST_KEY, user?.tenantId, effectiveStore],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchPromos(user!.tenantId, effectiveStore),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30,
  });
}

export function usePromoStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ promoId, status }: { promoId: string; status: string }) => updatePromoStatus(promoId, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROMO_LIST_KEY });
      toast.success("Status promo diperbarui");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error("Tidak dapat memperbarui status promo");
    },
  });
}
