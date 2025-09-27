import type { Brand } from "@/types/products";
import { getSupabaseClient } from "@/lib/supabase-client";

export async function fetchBrands(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("brand")
    .select("id, nama, toko_id, produk:produk(count)")
    .eq("tenant_id", tenantId)
    .order("nama");

  if (tokoId) {
    query.or(`toko_id.eq.${tokoId},toko_id.is.null`);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Supabase row typing is dynamic here; narrow with a local any cast for mapping only.
  return (
    (data ?? []).map((item: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      id: item.id,
      nama: item.nama,
      tokoId: item.toko_id,
      jumlahProduk: Array.isArray(item.produk) && item.produk[0]?.count ? Number(item.produk[0].count) : 0,
    })) ?? []
  ) as unknown as Brand[];
}
