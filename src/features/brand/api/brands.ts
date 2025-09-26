import type { Brand } from "@/types/products";
import { getSupabaseClient } from "@/lib/supabase-client";

export async function fetchBrands(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("brand")
    .select("id, nama, toko_id")
    .eq("tenant_id", tenantId)
    .order("nama");

  if (tokoId) {
    query.or(`toko_id.eq.${tokoId},toko_id.is.null`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (
    data?.map((item) => ({
      id: item.id,
      nama: item.nama,
      tokoId: item.toko_id,
    })) ?? []
  ) satisfies Brand[];
}
