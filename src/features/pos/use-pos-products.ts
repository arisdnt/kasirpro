import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabase-client";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { PosProduct } from "./types";
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";
import { useProductStockRealtime } from "@/features/produk/hooks/use-product-stock-realtime";
import { fetchProductStocks } from "@/features/produk/api/stocks";

const POS_PRODUCTS_KEY = ["pos-products"];

type ProductRow = {
  id: string;
  nama: string;
  kode: string;
  harga_jual: number;
  satuan: string | null;
  gambar_urls: string[] | null;
  brand: { nama: string | null } | null;
  kategori: { nama: string | null } | null;
};

async function fetchPosProducts(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("produk")
    .select(
      "id, nama, kode, harga_jual, satuan, gambar_urls, toko_id, brand:brand(nama), kategori:kategori(nama)",
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

  const rows = (data as ProductRow[] | null) ?? [];
  const productIds = rows.map((item) => item.id);
  const stockMap = tokoId && productIds.length > 0
    ? await fetchProductStocks(tenantId, tokoId, productIds)
    : {};

  return rows.map((item) => ({
    id: item.id,
    nama: item.nama,
    kode: item.kode,
    hargaJual: item.harga_jual,
    satuan: item.satuan,
    gambarUrl: item.gambar_urls?.[0] ?? null,
    stok: stockMap[item.id] ?? 0,
    brandNama: item.brand?.nama ?? null,
    kategoriNama: item.kategori?.nama ?? null,
  })) satisfies PosProduct[];
}

export function usePosProductsQuery(options?: { subscribe?: boolean }) {
  const {
    state: { user },
  } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const query = useQuery<PosProduct[]>({
    queryKey: [...POS_PRODUCTS_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    staleTime: 0, // Always fresh for realtime
    queryFn: () => fetchPosProducts(user!.tenantId, user?.tokoId ?? null),
  });

  const refetchData = useCallback(() => {
    console.log("🔄 POS: Refetching products due to realtime event");
    // Invalidate and refetch
    queryClient.invalidateQueries({
      queryKey: [...POS_PRODUCTS_KEY, user?.tenantId, user?.tokoId],
    });
    void queryClient.refetchQueries({
      queryKey: [...POS_PRODUCTS_KEY, user?.tenantId, user?.tokoId],
    });
  }, [queryClient, user?.tenantId, user?.tokoId]);

  const subscribe = options?.subscribe !== false;
  // Always call hooks to preserve order; gate the callback
  useSupabaseRealtime("pos-products", { table: "produk" }, refetchData, { enabled: subscribe });
  useProductStockRealtime("pos-products-stocks", refetchData, { enabled: subscribe });

  return query;
}
