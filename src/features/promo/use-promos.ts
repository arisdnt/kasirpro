import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { PromoInput, PromoWithRelations } from "@/features/promo/types";
import { createPromo, deletePromo, fetchPromos, updatePromo, updatePromoStatus } from "./api";

export const PROMO_LIST_KEY = ["promo-list"] as const;

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

export function useCreatePromoMutation() {
  const queryClient = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (input: PromoInput) => {
      if (!user) throw new Error("Unauthorized");
      const payload: PromoInput = {
        ...input,
        tokoId: input.tokoId ?? user.tokoId ?? null,
      };
      await createPromo({
        tenantId: user.tenantId,
        userId: user.id,
        input: payload,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROMO_LIST_KEY });
      toast.success("Promo berhasil dibuat");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal membuat promo");
    },
  });
}

export function useUpdatePromoMutation(promoId: string) {
  const queryClient = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (input: PromoInput) => {
      if (!user) throw new Error("Unauthorized");
      await updatePromo({
        promoId,
        tenantId: user.tenantId,
        userId: user.id,
        input,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROMO_LIST_KEY });
      toast.success("Promo diperbarui");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal memperbarui promo");
    },
  });
}

export function useDeletePromoMutation() {
  const queryClient = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (promoId: string) => {
      if (!user) throw new Error("Unauthorized");
      await deletePromo({ promoId, tenantId: user.tenantId });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROMO_LIST_KEY });
      toast.success("Promo dihapus");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Tidak dapat menghapus promo");
    },
  });
}
