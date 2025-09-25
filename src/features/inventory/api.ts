/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { InventoryItem, BatchInfo } from "@/types/inventory";

export async function fetchInventoryItems(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("inventaris")
    .select("id, produk_id, stock_tersedia, stock_fisik, toko_id, produk:produk_id ( nama )")
    .eq("tenant_id", tenantId)
    .order("updated_at", { ascending: false });

  if (tokoId) {
    query.eq("toko_id", tokoId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    produkId: item.produk_id,
    produkNama: (item.produk as any)?.nama ?? "-",
    stockSistem: item.stock_tersedia ?? 0,
    stockFisik: item.stock_fisik ?? 0,
    selisih: (item.stock_fisik ?? 0) - (item.stock_tersedia ?? 0),
    tokoId: item.toko_id,
  })) as InventoryItem[]);
}

export async function fetchBatchInfos(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("inventaris")
    .select("id, produk_id, batch_number, tanggal_expired, stock_fisik")
    .eq("tenant_id", tenantId)
    .order("tanggal_expired", { ascending: true })
    .limit(12);

  if (tokoId) {
    query.eq("toko_id", tokoId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    produkId: item.produk_id,
    batchNumber: item.batch_number,
    tanggalExpired: item.tanggal_expired,
    stockFisik: item.stock_fisik,
  })) as BatchInfo[]);
}
