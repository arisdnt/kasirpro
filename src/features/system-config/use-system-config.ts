import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { SystemConfig, SystemConfigInput } from "@/features/system-config/types";
import { createSystemConfig, deleteSystemConfig, fetchSystemConfigs, updateSystemConfig } from "./api";

const CONFIG_KEY = ["system-configs"] as const;

export function useSystemConfigList() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<SystemConfig[]>({
    queryKey: [...CONFIG_KEY, user?.tenantId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchSystemConfigs(user!.tenantId),
    staleTime: 1000 * 60,
  });
}

export function useSystemConfigCreateMutation() {
  const queryClient = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (input: SystemConfigInput) => {
      if (!user) throw new Error("Unauthorized");
      await createSystemConfig({ tenantId: user.tenantId, input });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CONFIG_KEY });
      toast.success("Konfigurasi berhasil dibuat");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error("Gagal membuat konfigurasi");
    },
  });
}

export function useSystemConfigUpdateMutation() {
  const queryClient = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (payload: { id: string; input: SystemConfigInput }) => {
      if (!user) throw new Error("Unauthorized");
      await updateSystemConfig({ id: payload.id, tenantId: user.tenantId, input: payload.input });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CONFIG_KEY });
      toast.success("Konfigurasi berhasil diperbarui");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error("Gagal memperbarui konfigurasi");
    },
  });
}

export function useSystemConfigDeleteMutation() {
  const queryClient = useQueryClient();
  const {
    state: { user },
  } = useSupabaseAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("Unauthorized");
      await deleteSystemConfig({ id, tenantId: user.tenantId });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CONFIG_KEY });
      toast.success("Konfigurasi dihapus");
    },
    onError: (error: unknown) => {
      console.error(error);
      toast.error("Tidak dapat menghapus konfigurasi");
    },
  });
}
