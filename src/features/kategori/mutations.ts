/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { CATEGORIES_QUERY_KEY } from "./queries/keys";
import { createCategory, updateCategory, deleteCategory } from "./api";

export function useCreateCategoryMutation() {
  const qc = useQueryClient();
  const { state: { user } } = useSupabaseAuth();
  return useMutation({
    mutationFn: async (payload: { nama: string; parentId?: string | null; tokoId?: string | null }) => {
      if (!user?.tenantId) throw new Error("Tenant tidak ditemukan");
      return createCategory({ tenantId: user.tenantId, ...payload });
    },
    onSuccess: () => {
      toast.success("Kategori berhasil dibuat");
      void qc.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Gagal membuat kategori");
    },
  });
}

export function useUpdateCategoryMutation() {
  const qc = useQueryClient();
  const { state: { user } } = useSupabaseAuth();
  return useMutation({
    mutationFn: async (params: { id: string; nama?: string; parentId?: string | null; tokoId?: string | null }) => {
      if (!user?.tenantId) throw new Error("Tenant tidak ditemukan");
      return updateCategory(params.id, { tenantId: user.tenantId, nama: params.nama, parentId: params.parentId, tokoId: params.tokoId });
    },
    onSuccess: () => {
      toast.success("Kategori berhasil diubah");
      void qc.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Gagal mengubah kategori");
    },
  });
}

export function useDeleteCategoryMutation() {
  const qc = useQueryClient();
  const { state: { user } } = useSupabaseAuth();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!user?.tenantId) throw new Error("Tenant tidak ditemukan");
      return deleteCategory(id, user.tenantId);
    },
    onSuccess: () => {
      toast.success("Kategori berhasil dihapus");
      void qc.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Gagal menghapus kategori");
    },
  });
}
