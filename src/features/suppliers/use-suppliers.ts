import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { Supplier } from "@/types/partners";
import { fetchSuppliers } from "./api";

const SUPPLIERS_KEY = ["suppliers"];

export function useSuppliersQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<Supplier[]>({
    queryKey: [...SUPPLIERS_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchSuppliers(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 60,
  });
}