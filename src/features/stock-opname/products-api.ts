import { getSupabaseClient } from "@/lib/supabase-client";

export type ProductWithStock = {
  id: string;
  kode: string | null;
  nama: string;
  barcode: string | null;
  satuan: string | null;
  stock: number;
};

export async function searchProductsWithStock(params: { tenantId: string; tokoId: string; q: string; limit?: number }) {
  const client = getSupabaseClient();
  const limit = params.limit ?? 20;
  const q = params.q.trim();
  const sel = `tenant_id, toko_id, produk_id, kode, nama, barcode, satuan, stock`;
  const base = client.from("v_produk_toko_with_stock").select(sel).eq("tenant_id", params.tenantId).eq("toko_id", params.tokoId).limit(limit);
  const query = q
    ? base.or(`kode.ilike.%${q}%,nama.ilike.%${q}%,barcode.ilike.%${q}%`)
    : base;
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.produk_id as string,
    kode: (r.kode as string) ?? null,
    nama: r.nama as string,
    barcode: (r.barcode as string) ?? null,
    satuan: (r.satuan as string) ?? null,
    stock: Number(r.stock ?? 0),
  })) as ProductWithStock[];
}

