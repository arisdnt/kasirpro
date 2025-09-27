/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Product } from "@/features/produk/types";
import { getSupabaseClient } from "@/lib/supabase-client";

export async function fetchProducts(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("produk")
    .select(
      `id, kode, nama, harga_jual, harga_beli, status, satuan, gambar_urls, minimum_stock, tenant_id, toko_id, updated_at,
       kategori:kategori_id ( id, nama ),
       brand:brand_id ( id, nama )`
    )
    .eq("tenant_id", tenantId)
    .order("updated_at", { ascending: false });

  if (tokoId) {
    query.or(`toko_id.eq.${tokoId},toko_id.is.null`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return ((data as any[]) ?? []).map((item) => {
    const category = item.kategori as any;
    const brand = item.brand as any;
    return {
      id: item.id,
      kode: item.kode,
      nama: item.nama,
      kategoriId: category?.id ?? null,
      kategoriNama: category?.nama ?? null,
      brandId: brand?.id ?? null,
      brandNama: brand?.nama ?? null,
      hargaJual: item.harga_jual,
      hargaBeli: item.harga_beli,
      status: item.status,
      satuan: item.satuan,
      gambarUrls: (item.gambar_urls as string[] | null) ?? [],
      minimumStock: item.minimum_stock,
      tenantId: item.tenant_id,
      tokoId: item.toko_id,
      updatedAt: item.updated_at,
    } satisfies Product;
  });
}
