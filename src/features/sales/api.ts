/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { SaleTransaction } from "@/types/transactions";

export async function fetchSalesTransactions(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("transaksi_penjualan")
    .select(
      "id, nomor_transaksi, tanggal, total, bayar, kembalian, metode_pembayaran, pelanggan_id, pelanggan:pelanggan_id ( nama )"
    )
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
    nomorTransaksi: item.nomor_transaksi,
    tanggal: item.tanggal,
    total: item.total ?? 0,
    bayar: item.bayar,
    kembalian: item.kembalian,
    metodePembayaran: item.metode_pembayaran,
    pelangganId: item.pelanggan_id,
    pelangganNama: (item.pelanggan as any)?.nama ?? null,
  })) as SaleTransaction[]);
}