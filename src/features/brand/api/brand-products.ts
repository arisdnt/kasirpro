import type { Product } from "@/types/products";
import { getSupabaseClient } from "@/lib/supabase-client";

export type BrandProductListItem = Pick<Product, "id" | "nama" | "kode" | "kategoriNama">;

type ProductRow = {
  id: string;
  nama: string;
  kode: string;
  kategori: { nama: string | null } | null;
};

export async function fetchBrandProducts(
  tenantId: string,
  tokoId: string | null,
  brandId: string
): Promise<BrandProductListItem[]> {
  const client = getSupabaseClient();
  const query = client
    .from("produk")
    .select("id, nama, kode, toko_id, kategori:kategori(nama)")
    .eq("tenant_id", tenantId)
    .eq("brand_id", brandId)
    .eq("status", "aktif")
    .order("nama");

  if (tokoId) {
    query.or(`toko_id.eq.${tokoId},toko_id.is.null`);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data as ProductRow[] | null) ?? [];
  return rows.map((r) => ({
    id: r.id,
    nama: r.nama,
    kode: r.kode,
    kategoriNama: r.kategori?.nama ?? null,
  }));
}
