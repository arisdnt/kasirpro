/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { ReturnTransaction } from "@/types/transactions";

export async function fetchSalesReturns(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("retur_penjualan")
    .select(`
      id,
      nomor_retur,
      tanggal,
      total,
      status,
      alasan,
      pelanggan:pelanggan_id ( nama )
    `)
    .eq("tenant_id", tenantId)
    .order("tanggal", { ascending: false })
    .limit(50);

  if (tokoId) {
    query.eq("toko_id", tokoId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    nomorRetur: item.nomor_retur,
    tanggal: item.tanggal,
    total: item.total ?? 0,
    status: item.status,
    alasan: item.alasan ?? null,
    pelangganNama: (item.pelanggan as any)?.nama ?? null,
  })) as ReturnTransaction[]);
}