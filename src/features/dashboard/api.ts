/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  CategoryPerformance,
  CustomerSummary,
  DashboardFilters,
  DashboardInsights,
  DashboardSummary,
  InventoryHealth,
  LowStockItem,
  PaymentBreakdown,
  RecentSale,
  SalesTrendPoint,
  StorePerformance,
  TopCashier,
  TopProduct,
} from "@/features/dashboard/types";
import { getSupabaseClient } from "@/lib/supabase-client";

const numberOrZero = (value: unknown) => {
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const stringOr = (value: unknown, fallback: string) =>
  typeof value === "string" && value.length > 0 ? value : fallback;

export async function fetchDashboardSummary(
  tenantId: string,
  tokoId: string | null,
): Promise<DashboardSummary | null> {
  const client = getSupabaseClient();
  const { data, error } = await (client.rpc as any)(
    "get_dashboard_summary",
    {
      p_tenant_id: tenantId,
      p_toko_id: tokoId ?? undefined,
    },
  );

  if (error) {
    throw error;
  }

  const record = (data as any)?.[0];
  if (!record) {
    return null;
  }

  return {
    penjualanHariIni: numberOrZero(record.penjualan_hari_ini),
    penjualanBulanIni: numberOrZero(record.penjualan_bulan_ini),
    transaksiHariIni: numberOrZero(record.transaksi_hari_ini),
    transaksiBulanIni: numberOrZero(record.transaksi_bulan_ini),
    produkAktif: numberOrZero(record.total_produk_aktif),
    produkMenipis: numberOrZero(record.produk_stock_menipis),
    tokoId: record.toko_id,
    tokoNama: record.toko_nama,
  } satisfies DashboardSummary;
}

export async function fetchLowStockItems(
  tenantId: string,
  tokoId: string | null,
): Promise<LowStockItem[]> {
  const client = getSupabaseClient();
  const { data, error } = await (client.rpc as any)(
    "get_low_stock_products",
    {
      p_tenant_id: tenantId,
      p_toko_id: tokoId ?? undefined,
    },
  );

  if (error) {
    throw error;
  }

  return ((data as any[]) ?? []).map((item) => ({
    produkId: item.produk_id,
    namaProduk: item.nama_produk,
    stockTersedia: numberOrZero(item.stock_tersedia),
    minimumStock: numberOrZero(item.minimum_stock),
    tokoNama: item.toko_nama,
  }));
}

export async function fetchRecentSales(
  tenantId: string,
  tokoId: string | null,
  startDate?: string,
  endDate?: string,
  limit = 12,
): Promise<RecentSale[]> {
  const client = getSupabaseClient();
  const query = client
    .from("transaksi_penjualan")
    .select(
      "id, nomor_transaksi, total, tanggal, pelanggan:pelanggan_id ( nama )",
    )
    .eq("tenant_id", tenantId)
    .order("tanggal", { ascending: false })
    .limit(limit);

  if (tokoId) {
    query.eq("toko_id", tokoId);
  }

  if (startDate) {
    query.gte("tanggal", startDate);
  }

  if (endDate) {
    query.lte("tanggal", `${endDate} 23:59:59`);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return ((data as any[]) ?? []).map((item) => ({
    id: item.id,
    nomorTransaksi: item.nomor_transaksi,
    total: numberOrZero(item.total),
    tanggal: item.tanggal,
    pelanggan: (item.pelanggan as any)?.nama ?? null,
  }));
}

type InsightPayload = {
  salesTrend?: Array<{
    bucket: string;
    total_penjualan: number;
    total_transaksi: number;
    pelanggan_unik: number;
    rata_order: number;
  }>;
  categoryPerformance?: Array<{
    kategori_id: string;
    kategori_nama: string;
    total_penjualan: number;
    total_qty: number;
  }>;
  paymentBreakdown?: Array<{
    metode_pembayaran: string;
    total_penjualan: number;
    total_transaksi: number;
  }>;
  topProducts?: Array<{
    produk_id: string;
    nama_produk: string;
    total_penjualan: number;
    total_qty: number;
  }>;
  topCashiers?: Array<{
    pengguna_id: string;
    nama_pengguna: string;
    total_penjualan: number;
    total_transaksi: number;
  }>;
  storePerformance?: Array<{
    toko_id: string;
    toko_nama: string;
    total_penjualan: number;
    total_transaksi: number;
    rata_order: number;
  }>;
  inventoryHealth?: {
    produk_aktif: number;
    produk_low: number;
    produk_habis: number;
    nilai_persediaan: number;
  };
  customerSummary?: {
    pelanggan_unik: number;
    pelanggan_baru: number;
  };
};

export async function fetchDashboardInsights(
  tenantId: string,
  filters: DashboardFilters,
): Promise<DashboardInsights> {
  const client = getSupabaseClient();
  const { data, error } = await (client.rpc as any)(
    "get_dashboard_insights",
    {
      p_tenant_id: tenantId,
      p_toko_id: filters.tokoId === "all" ? undefined : filters.tokoId,
      p_date_start: filters.startDate,
      p_date_end: filters.endDate,
      p_status_filter:
        filters.statuses.length > 0 ? filters.statuses : undefined,
      p_granularity: filters.granularity,
    },
  );

  if (error) {
    throw error;
  }

  const raw = (Array.isArray(data) ? data[0] : data) as
    | InsightPayload
    | null
    | undefined;
  const source = raw ?? {};

  const salesTrend: SalesTrendPoint[] = Array.isArray(source.salesTrend)
    ? source.salesTrend.map((item) => ({
        bucket: stringOr(item.bucket, ""),
        totalPenjualan: numberOrZero(item.total_penjualan),
        totalTransaksi: Number(item.total_transaksi ?? 0),
        pelangganUnik: Number(item.pelanggan_unik ?? 0),
        rataOrder: numberOrZero(item.rata_order),
      }))
    : [];

  const categoryPerformance: CategoryPerformance[] = Array.isArray(
    source.categoryPerformance,
  )
    ? source.categoryPerformance.map((item) => ({
        kategoriId: stringOr(item.kategori_id, "uncategorized"),
        kategoriNama: stringOr(item.kategori_nama, "Tanpa Kategori"),
        totalPenjualan: numberOrZero(item.total_penjualan),
        totalQty: numberOrZero(item.total_qty),
      }))
    : [];

  const paymentBreakdown: PaymentBreakdown[] = Array.isArray(
    source.paymentBreakdown,
  )
    ? source.paymentBreakdown.map((item) => ({
        metodePembayaran: stringOr(item.metode_pembayaran, "lainnya"),
        totalPenjualan: numberOrZero(item.total_penjualan),
        totalTransaksi: Number(item.total_transaksi ?? 0),
      }))
    : [];

  const topProducts: TopProduct[] = Array.isArray(source.topProducts)
    ? source.topProducts.map((item) => ({
        produkId: stringOr(item.produk_id, "unknown"),
        namaProduk: stringOr(item.nama_produk, "Produk"),
        totalPenjualan: numberOrZero(item.total_penjualan),
        totalQty: numberOrZero(item.total_qty),
      }))
    : [];

  const topCashiers: TopCashier[] = Array.isArray(source.topCashiers)
    ? source.topCashiers.map((item) => ({
        penggunaId: stringOr(item.pengguna_id, "unknown"),
        namaPengguna: stringOr(item.nama_pengguna, "Kasir"),
        totalPenjualan: numberOrZero(item.total_penjualan),
        totalTransaksi: Number(item.total_transaksi ?? 0),
      }))
    : [];

  const storePerformance: StorePerformance[] = Array.isArray(
    source.storePerformance,
  )
    ? source.storePerformance.map((item) => ({
        tokoId: stringOr(item.toko_id, "unknown"),
        tokoNama: stringOr(item.toko_nama, "Tanpa Toko"),
        totalPenjualan: numberOrZero(item.total_penjualan),
        totalTransaksi: Number(item.total_transaksi ?? 0),
        rataOrder: numberOrZero(item.rata_order),
      }))
    : [];

  const inventoryHealth: InventoryHealth = source.inventoryHealth
    ? {
        produkAktif: Number(source.inventoryHealth.produk_aktif ?? 0),
        produkLow: Number(source.inventoryHealth.produk_low ?? 0),
        produkHabis: Number(source.inventoryHealth.produk_habis ?? 0),
        nilaiPersediaan: numberOrZero(
          source.inventoryHealth.nilai_persediaan,
        ),
      }
    : { produkAktif: 0, produkLow: 0, produkHabis: 0, nilaiPersediaan: 0 };

  const customerSummary: CustomerSummary = source.customerSummary
    ? {
        pelangganUnik: Number(source.customerSummary.pelanggan_unik ?? 0),
        pelangganBaru: Number(source.customerSummary.pelanggan_baru ?? 0),
      }
    : { pelangganUnik: 0, pelangganBaru: 0 };

  return {
    salesTrend,
    categoryPerformance,
    paymentBreakdown,
    topProducts,
    topCashiers,
    storePerformance,
    inventoryHealth,
    customerSummary,
  } satisfies DashboardInsights;
}
