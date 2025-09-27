import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { createSupplier, deleteSupplier, updateSupplier } from "./api";

export function useCreateSupplier() {
  const qc = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();
  return useMutation({
    mutationFn: async (payload: Parameters<typeof createSupplier>[0]["payload"]) => {
      if (!user) throw new Error("Unauthorized");
      return createSupplier({ tenantId: user.tenantId, tokoId: user.tokoId ?? null, payload });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["suppliers", user?.tenantId, user?.tokoId] });
    },
  });
}

export function useUpdateSupplier() {
  const qc = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();
  return useMutation({
    mutationFn: (p: { id: string; payload: Parameters<typeof updateSupplier>[0]["payload"] }) =>
      updateSupplier(p),
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({ queryKey: ["suppliers", user?.tenantId, user?.tokoId] });
      await qc.invalidateQueries({ queryKey: ["supplier", vars.id] });
    },
  });
}

export function useDeleteSupplier() {
  const qc = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();
  return useMutation({
    mutationFn: (id: string) => deleteSupplier(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["suppliers", user?.tenantId, user?.tokoId] });
    },
  });
}
