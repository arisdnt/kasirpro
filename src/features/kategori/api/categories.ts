import type { Category } from "@/types/products";
import { getSupabaseClient } from "@/lib/supabase-client";

export async function fetchCategories(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("kategori")
    .select("id, nama, parent_id, toko_id")
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
      parentId: item.parent_id,
      tokoId: item.toko_id,
    })) ?? []
  ) satisfies Category[];
}
