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

/* eslint-disable @typescript-eslint/no-explicit-any */
type RawBrand = {
  id: string;
  nama: string;
  toko_id: string | null;
};

export async function createBrand(params: {
  tenantId: string;
  nama: string;
  tokoId?: string | null;
}) {
  const client = getSupabaseClient();
  const payload = {
    tenant_id: params.tenantId,
    nama: params.nama,
    toko_id: params.tokoId ?? null,
  } as const;

  const { data, error } = (await client
    .from("brand")
    .insert(payload as never)
    .select("id, nama, toko_id")
    .single()) as { data: RawBrand; error: any };
  if (error) throw error;
  return {
    id: data.id,
    nama: data.nama,
    tokoId: data.toko_id,
  } satisfies Brand;
}

export async function updateBrand(id: string, params: {
  tenantId: string;
  nama?: string;
  tokoId?: string | null;
}) {
  const client = getSupabaseClient();
  const patch: Record<string, unknown> = {};
  if (typeof params.nama !== "undefined") patch.nama = params.nama;
  if (typeof params.tokoId !== "undefined") patch.toko_id = params.tokoId;

  const { data, error } = (await client
    .from("brand")
    .update(patch as never)
    .eq("tenant_id", params.tenantId)
    .eq("id", id)
    .select("id, nama, toko_id")
    .single()) as { data: RawBrand; error: any };
  if (error) throw error;
  return {
    id: data.id,
    nama: data.nama,
    tokoId: data.toko_id,
  } satisfies Brand;
}

export async function deleteBrand(id: string, tenantId: string) {
  const client = getSupabaseClient();
  const { error } = await client
    .from("brand")
    .delete()
    .eq("tenant_id", tenantId)
    .eq("id", id);
  if (error) throw error;
}
