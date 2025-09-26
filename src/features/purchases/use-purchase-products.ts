import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabase-client";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";

export type PurchaseProduct = {
  id: string;
  nama: string;
  kode: string;
  barcode: string | null;
  hargaBeli: number;
  hargaJual: number | null;
  satuan: string | null;
  stok: number;
};

const PURCHASE_PRODUCTS_KEY = ["purchase-products"];

type ProductRow = {
  id: string;
  nama: string;
  kode: string;
  barcode: string | null;
  harga_beli: number | null;
  harga_jual: number | null;
  satuan: string | null;
  inventaris: { stock_tersedia: number | null }[] | null;
  toko_id: string | null;
};

async function fetchPurchaseProducts(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("produk")
    .select(
      "id, nama, kode, barcode, harga_beli, harga_jual, satuan, toko_id, inventaris:inventaris(stock_tersedia)"
    )
    .eq("tenant_id", tenantId)
    .eq("status", "aktif")
    .order("nama");

  if (tokoId) {
    query.or(`toko_id.eq.${tokoId},toko_id.is.null`);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (
    data?.map((item: ProductRow) => ({
      id: item.id,
      nama: item.nama,
      kode: item.kode,
      barcode: item.barcode,
      hargaBeli: item.harga_beli ?? 0,
      hargaJual: item.harga_jual,
      satuan: item.satuan,
      stok: item.inventaris?.reduce((total, row) => total + (row.stock_tersedia ?? 0), 0) ?? 0,
    })) ?? []
  ) satisfies PurchaseProduct[];
}

export function usePurchaseProductsQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const query = useQuery<PurchaseProduct[]>({
    queryKey: [...PURCHASE_PRODUCTS_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    staleTime: 1000 * 30,
    queryFn: () => fetchPurchaseProducts(user!.tenantId, user?.tokoId ?? null),
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [...PURCHASE_PRODUCTS_KEY, user?.tenantId, user?.tokoId],
    });
  }, [queryClient, user?.tenantId, user?.tokoId]);

  useSupabaseRealtime("purchase-products", { table: "produk" }, invalidate);
  useSupabaseRealtime("purchase-inventory", { table: "inventaris" }, invalidate);

  return query;
}
