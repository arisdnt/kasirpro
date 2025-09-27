import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { Brand } from "@/features/brand/types";
import { fetchBrands } from "@/features/brand/api";
import { BRANDS_QUERY_KEY } from "./keys";

export function useBrandsQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<Brand[]>({
    queryKey: [...BRANDS_QUERY_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchBrands(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 60 * 5,
  });
}
