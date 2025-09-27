import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { Customer } from "@/features/customers/types";
import type { Supplier } from "@/features/suppliers/types";
import { fetchCustomers, fetchSuppliers } from "./api";

const CUSTOMERS_KEY = ["partners-customers"];
const SUPPLIERS_KEY = ["partners-suppliers"];

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
