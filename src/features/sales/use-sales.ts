import { useQuery } from "@tanstack/react-query";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { SaleTransaction, SaleItem } from "@/types/transactions";
import { fetchSalesTransactions, fetchSaleItems } from "./api";

const SALES_KEY = ["sales-transactions"];
const SALE_ITEMS_KEY = ["sale-items"];

export function useSalesQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();

  return useQuery<SaleTransaction[]>({
    queryKey: [...SALES_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    queryFn: () => fetchSalesTransactions(user!.tenantId, user?.tokoId ?? null),
    staleTime: 1000 * 30,
  });
}

export function useSaleItemsQuery(transaksiId: string | null) {
  return useQuery<(SaleItem & { produkKode: string | null; kategoriNama: string | null })[]>({
    queryKey: [...SALE_ITEMS_KEY, transaksiId],
    enabled: Boolean(transaksiId),
    queryFn: () => fetchSaleItems(transaksiId!),
    staleTime: 1000 * 60, // 1 minute - data doesn't change often
  });
}