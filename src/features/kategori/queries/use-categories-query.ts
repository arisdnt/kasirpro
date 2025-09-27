import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { Category } from "@/features/kategori/types";
import { fetchCategories } from "@/features/kategori/api";
import { CATEGORIES_QUERY_KEY } from "./keys";

export function useCategoriesQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<Category[]>({
    queryKey: [...CATEGORIES_QUERY_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchCategories(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 60 * 5,
  });
}
