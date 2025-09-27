import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { Supplier } from "@/types/partners";
import { fetchSupplierProducts, fetchSupplierPurchases, fetchSuppliers, type SupplierProductAggregate, type SupplierPurchase } from "./api";

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

export function useSupplierPurchasesQuery(supplierId: string | null) {
  const {
    state: { user },
  } = useSupabaseAuth();
  return useQuery<SupplierPurchase[]>({
    queryKey: ["supplier-purchases", user?.tenantId, user?.tokoId, supplierId],
    enabled: Boolean(user?.tenantId && supplierId),
    queryFn: () => fetchSupplierPurchases({ tenantId: user!.tenantId, tokoId: user?.tokoId ?? null, supplierId: supplierId! }),
    staleTime: 1000 * 30,
  });
}

export function useSupplierProductsQuery(supplierId: string | null) {
  const {
    state: { user },
  } = useSupabaseAuth();
  return useQuery<SupplierProductAggregate[]>({
    queryKey: ["supplier-products", user?.tenantId, user?.tokoId, supplierId],
    enabled: Boolean(user?.tenantId && supplierId),
    queryFn: () => fetchSupplierProducts({ tenantId: user!.tenantId, tokoId: user?.tokoId ?? null, supplierId: supplierId! }),
    staleTime: 1000 * 60,
  });
}