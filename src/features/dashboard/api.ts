/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DashboardSummary, LowStockItem, RecentSale } from "@/types/dashboard";
import { getSupabaseClient } from "@/lib/supabase-client";

export async function fetchDashboardSummary(
  tenantId: string,
  tokoId: string | null,
): Promise<DashboardSummary | null> {
  const client = getSupabaseClient();
  const { data, error } = await client.rpc("get_dashboard_summary", {
    p_tenant_id: tenantId,
    p_toko_id: tokoId ?? undefined,
  });

  if (error) {
    throw error;
  }

  const record = (data as any)?.[0];
  if (!record) {
    return null;
  }

  return {
    penjualanHariIni: record.penjualan_hari_ini ?? 0,
    penjualanBulanIni: record.penjualan_bulan_ini ?? 0,
    transaksiHariIni: record.transaksi_hari_ini ?? 0,
    transaksiBulanIni: record.transaksi_bulan_ini ?? 0,
    produkAktif: record.total_produk_aktif ?? 0,
    produkMenipis: record.produk_stock_menipis ?? 0,
    tokoId: record.toko_id,
    tokoNama: record.toko_nama,
  } satisfies DashboardSummary;
}

export async function fetchLowStockItems(
  tenantId: string,
  tokoId: string | null,
): Promise<LowStockItem[]> {
  const client = getSupabaseClient();
  const { data, error } = await client.rpc("get_low_stock_products", {
    p_tenant_id: tenantId,
    p_toko_id: tokoId ?? undefined,
  });

  if (error) {
    throw error;
  }

  return ((data as any[]) ?? []).map((item) => ({
    produkId: item.produk_id,
    namaProduk: item.nama_produk,
    stockTersedia: item.stock_tersedia ?? 0,
    minimumStock: item.minimum_stock ?? 0,
    tokoNama: item.toko_nama,
  }));
}

export async function fetchRecentSales(
  tenantId: string,
  tokoId: string | null,
): Promise<RecentSale[]> {
  const client = getSupabaseClient();
  const query = client
    .from("transaksi_penjualan")
    .select(
      "id, nomor_transaksi, total, tanggal, pelanggan:pelanggan_id ( nama )",
    )
    .eq("tenant_id", tenantId)
    .order("tanggal", { ascending: false })
    .limit(6);

  if (tokoId) {
    query.eq("toko_id", tokoId);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return ((data as any[]) ?? []).map((item) => ({
    id: item.id,
    nomorTransaksi: item.nomor_transaksi,
    total: item.total ?? 0,
    tanggal: item.tanggal,
    pelanggan: (item.pelanggan as any)?.nama ?? null,
  }));
}
