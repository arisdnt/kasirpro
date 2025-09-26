import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabase-client";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { PosProduct } from "./types";
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";
import { fetchProductStocks } from "@/features/produk/api/stocks";
import { useProductStockRealtime } from "@/features/produk/hooks/use-product-stock-realtime";

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

export function usePosProductsQuery() {
  const {
    state: { user },
  } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const query = useQuery<PosProduct[]>({
    queryKey: [...POS_PRODUCTS_KEY, user?.tenantId, user?.tokoId],
    enabled: Boolean(user?.tenantId),
    staleTime: 1000 * 30,
    queryFn: () => fetchPosProducts(user!.tenantId, user?.tokoId ?? null),
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [...POS_PRODUCTS_KEY, user?.tenantId, user?.tokoId],
    });
  }, [queryClient, user?.tenantId, user?.tokoId]);

  useSupabaseRealtime("pos-products", { table: "produk" }, invalidate);
  useProductStockRealtime("pos-stock", invalidate);

  return query;
}
