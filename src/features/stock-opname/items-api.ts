import { getSupabaseClient } from "@/lib/supabase-client";

export async function fetchOpnameItems(opnameId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("stock_opname_items")
    .select("id, opname_id, produk_id, stock_sistem, stock_fisik, selisih, keterangan, produk:produk_id( nama, kode )")
    .eq("opname_id", opnameId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    id: r.id as string,
    opnameId: r.opname_id as string,
    produkId: r.produk_id as string,
    produkNama: (r.produk as any)?.nama ?? null,
    produkKode: (r.produk as any)?.kode ?? null,
    stockSistem: Number(r.stock_sistem ?? 0),
    stockFisik: Number(r.stock_fisik ?? 0),
    selisih: Number(r.selisih ?? 0),
    keterangan: (r.keterangan as string) ?? null,
  }));
}

async function getHeaderToko(opnameId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("stock_opname")
    .select("toko_id")
    .eq("id", opnameId)
    .single();
  if (error) throw error;
  return (data as any)?.toko_id as string;
}

async function getStockSistem(tokoId: string, produkId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("inventaris")
    .select("stock_fisik")
    .eq("toko_id", tokoId)
    .eq("produk_id", produkId)
    .maybeSingle();
  if (error) throw error;
  return Number((data as any)?.stock_fisik ?? 0);
}

export async function addOpnameItem(params: {
  opnameId: string;
  produkId: string;
  stockFisik: number;
  keterangan?: string | null;
  stockSistem?: number; // optional override
}) {
  const client = getSupabaseClient();
  const tokoId = await getHeaderToko(params.opnameId);
  const stockSistem = typeof params.stockSistem === "number" ? params.stockSistem : await getStockSistem(tokoId, params.produkId);
  const { data, error } = await client
    .from("stock_opname_items")
    .insert({
      opname_id: params.opnameId,
      produk_id: params.produkId,
      stock_sistem: stockSistem,
      stock_fisik: params.stockFisik,
      keterangan: params.keterangan ?? null,
    } as any)
    .select("id")
    .single();
  if (error) throw error;
  return data as { id: string };
}

export async function updateOpnameItem(params: { id: string; stockFisik: number; keterangan?: string | null }) {
  const client = getSupabaseClient();
  const { error } = await client
    .from("stock_opname_items")
    .update({ stock_fisik: params.stockFisik, keterangan: params.keterangan ?? null } as any)
    .eq("id", params.id);
  if (error) throw error;
}

export async function deleteOpnameItem(id: string) {
  const client = getSupabaseClient();
  const { error } = await client.from("stock_opname_items").delete().eq("id", id);
  if (error) throw error;
}

