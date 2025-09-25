import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabase-client";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import type { PosProduct } from "./types";
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";

const POS_PRODUCTS_KEY = ["pos-products"];

type ProductRow = {
  id: string;
  nama: string;
  kode: string;
  harga_jual: number;
  satuan: string | null;
  gambar_urls: string[] | null;
  inventaris: { stock_tersedia: number | null }[] | null;
  brand: { nama: string | null } | null;
  kategori: { nama: string | null } | null;
};

async function fetchPosProducts(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("produk")
    .select(
      "id, nama, kode, harga_jual, satuan, gambar_urls, toko_id, brand:brand(nama), kategori:kategori(nama), inventaris:inventaris(stock_tersedia)",
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
      hargaJual: item.harga_jual,
      satuan: item.satuan,
      gambarUrl: item.gambar_urls?.[0] ?? null,
      stok: item.inventaris?.reduce((total, row) => total + (row.stock_tersedia ?? 0), 0) ?? 0,
      brandNama: item.brand?.nama ?? null,
      kategoriNama: item.kategori?.nama ?? null,
    })) ?? []
  ) satisfies PosProduct[];
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
  useSupabaseRealtime("pos-inventory", { table: "inventaris" }, invalidate);

  return query;
}
