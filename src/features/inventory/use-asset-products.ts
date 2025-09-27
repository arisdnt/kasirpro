import { useQuery } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase-client";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";

export type AssetProduct = {
  id: string;
  nama: string;
  kode: string;
};

const ASSET_PRODUCTS_KEY = ["asset-products"] as const;

type ProductRow = {
  id: string;
  nama: string;
  kode: string;
  toko_id: string | null;
  is_service: boolean | null;
};

async function fetchAssetProducts(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();

  // 1) Fetch active, non-service products scoped to tenant and store/global
  const prodQuery = client
    .from("produk")
    .select("id, nama, kode, toko_id, is_service")
    .eq("tenant_id", tenantId)
    .eq("status", "aktif")
    .order("nama");

  if (tokoId) {
    prodQuery.or(`toko_id.eq.${tokoId},toko_id.is.null`);
  }

  const [{ data: products, error: prodErr }, { data: soldItems, error: soldErr }, { data: boughtItems, error: buyErr }] = await Promise.all([
    prodQuery,
    // 2) Collect product_ids used in any sales items (RLS should scope to tenant)
    client.from("item_transaksi_penjualan").select("produk_id"),
    // 3) Collect product_ids used in any purchase items
    client.from("item_transaksi_pembelian").select("produk_id"),
  ]);

  if (prodErr) throw prodErr;
  if (soldErr) throw soldErr;
  if (buyErr) throw buyErr;

  const rows = (products as ProductRow[] | null) ?? [];
  const soldIds = new Set(((soldItems as { produk_id: string }[] | null) ?? []).map((r) => r.produk_id));
  const boughtIds = new Set(((boughtItems as { produk_id: string }[] | null) ?? []).map((r) => r.produk_id));

  // 4) Filter out any product that has ever appeared in transactions and any service item
  const result = rows
    .filter((p) => !p.is_service && !soldIds.has(p.id) && !boughtIds.has(p.id))
    .map((p) => ({ id: p.id, nama: p.nama, kode: p.kode })) satisfies AssetProduct[];

  return result;
}

export function useAssetProductsQuery(storeId?: string | null | "all") {
  const {
    state: { user },
  } = useSupabaseAuth();

  const effectiveStore = storeId && storeId !== "all" ? storeId : user?.tokoId ?? null;

  return useQuery<AssetProduct[]>({
    queryKey: [...ASSET_PRODUCTS_KEY, user?.tenantId, effectiveStore],
    enabled: Boolean(user?.tenantId),
    staleTime: 1000 * 30,
    queryFn: () => fetchAssetProducts(user!.tenantId, effectiveStore),
  });
}
