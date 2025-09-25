import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { fetchTenant, fetchStores } from "./api";

type TenantResult = Awaited<ReturnType<typeof fetchTenant>>;

type StoreResult = Awaited<ReturnType<typeof fetchStores>>;

export function useTenantQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<TenantResult>({
    queryKey: ["settings-tenant", user?.tenantId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchTenant(user!.tenantId),
    staleTime: 1000 * 300,
  });
}

export function useStoresQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<StoreResult>({
    queryKey: ["settings-stores", user?.tenantId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchStores(user!.tenantId),
    staleTime: 1000 * 60,
  });
}
