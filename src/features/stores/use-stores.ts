import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { Toko } from "@/types/management";
import { fetchStores } from "./api";

const STORES_KEY = ["stores"];

export function useStoresQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<Toko[]>({
    queryKey: [...STORES_KEY, user?.tenantId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchStores(user!.tenantId),
    staleTime: 1000 * 60,
  });
}