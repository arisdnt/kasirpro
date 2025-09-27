/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { BRANDS_QUERY_KEY } from "./queries";
import { createBrand, updateBrand, deleteBrand } from "./api";

export function useCreateBrandMutation() {
  const qc = useQueryClient();
  const { state: { user } } = useSupabaseAuth();
  return useMutation({
    mutationFn: async (payload: { nama: string; tokoId?: string | null }) => {
      if (!user?.tenantId) throw new Error("Tenant tidak ditemukan");
      return createBrand({ tenantId: user.tenantId, ...payload });
    },
    onSuccess: () => {
      toast.success("Brand berhasil dibuat");
      void qc.invalidateQueries({ queryKey: BRANDS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Gagal membuat brand");
    },
  });
}

export function useUpdateBrandMutation() {
  const qc = useQueryClient();
  const { state: { user } } = useSupabaseAuth();
  return useMutation({
    mutationFn: async (params: { id: string; nama?: string; tokoId?: string | null }) => {
      if (!user?.tenantId) throw new Error("Tenant tidak ditemukan");
      return updateBrand(params.id, { tenantId: user.tenantId, nama: params.nama, tokoId: params.tokoId });
    },
    onSuccess: () => {
      toast.success("Brand berhasil diubah");
      void qc.invalidateQueries({ queryKey: BRANDS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Gagal mengubah brand");
    },
  });
}

export function useDeleteBrandMutation() {
  const qc = useQueryClient();
  const { state: { user } } = useSupabaseAuth();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!user?.tenantId) throw new Error("Tenant tidak ditemukan");
      return deleteBrand(id, user.tenantId);
    },
    onSuccess: () => {
      toast.success("Brand berhasil dihapus");
      void qc.invalidateQueries({ queryKey: BRANDS_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Gagal menghapus brand");
    },
  });
}
