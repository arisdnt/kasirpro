import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { Customer } from "@/features/customers/types";
import { fetchCustomers } from "./api";

const CUSTOMERS_KEY = ["customers"];

export function useCustomersQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<Customer[]>({
    queryKey: [...CUSTOMERS_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchCustomers(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 60,
  });
}