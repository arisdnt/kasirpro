import { getSupabaseClient } from "@/lib/supabase-client";

export async function fetchProductStocks(
  tenantId: string,
  tokoId: string | null,
  productIds: string[],
): Promise<Record<string, number>> {
  if (!tokoId || productIds.length === 0) return {};
  const client = getSupabaseClient();
  const { data, error } = await client.rpc("compute_product_stocks", {
    p_tenant_id: tenantId,
    p_toko_id: tokoId,
    p_produk_ids: productIds,
  });
  if (error) throw error;
  const map: Record<string, number> = {};
  for (const row of data ?? []) {
    const produkId = (row as { produk_id: string | null })?.produk_id;
    if (!produkId) continue;
    const stockValue = (row as { stock_tersedia: number | string | null })?.stock_tersedia;
    map[produkId] = Number(stockValue ?? 0);
  }
  return map;
}
