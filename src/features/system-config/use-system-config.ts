import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { SystemConfig } from "@/features/system-config/types";
import { fetchSystemConfigs, updateSystemConfig } from "./api";

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

export function useSystemConfigUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSystemConfig,
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
