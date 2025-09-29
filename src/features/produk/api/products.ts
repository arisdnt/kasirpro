/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Product } from "@/features/produk/types";
import { getSupabaseClient } from "@/lib/supabase-client";

export async function fetchProducts(
  tenantId: string,
  tokoId: string | null,
  options?: { kategoriId?: string | null; brandId?: string | null }
) {
  const client = getSupabaseClient();

  // Sumber data dialihkan ke view yang sudah menyertakan stok terbaru per toko
  // View: public.v_produk_toko_with_stock
  const query = client
    .from("v_produk_toko_with_stock")
    .select(
      `tenant_id, toko_id, produk_id, kode, nama, harga_jual, harga_beli, status, satuan, minimum_stock,
       brand_id, brand_nama, kategori_id, kategori_nama, stock`
    )
    .eq("tenant_id", tenantId)
    .order("nama", { ascending: true });

  if (tokoId) {
    query.eq("toko_id", tokoId);
  }
  if (options?.kategoriId) {
    query.eq("kategori_id", options.kategoriId);
  }
  if (options?.brandId) {
    query.eq("brand_id", options.brandId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return ((data as any[]) ?? []).map((item) => {
    return {
      id: item.produk_id,
      kode: item.kode,
      nama: item.nama,
      kategoriId: item.kategori_id ?? null,
      kategoriNama: item.kategori_nama ?? null,
      brandId: item.brand_id ?? null,
      brandNama: item.brand_nama ?? null,
      stock: typeof item.stock === 'number' ? item.stock : Number(item.stock ?? 0),
      hargaJual: item.harga_jual,
      hargaBeli: item.harga_beli,
      status: item.status,
      satuan: item.satuan,
      // View tidak menyertakan gambar_urls/updated_at; set default aman untuk UI saat ini
      gambarUrls: [],
      minimumStock: item.minimum_stock,
      tenantId: item.tenant_id,
      tokoId: item.toko_id,
      updatedAt: null,
    } satisfies Product;
  });
}
