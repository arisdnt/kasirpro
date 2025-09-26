export type DashboardSummary = {
  penjualanHariIni: number;
  penjualanBulanIni: number;
  transaksiHariIni: number;
  transaksiBulanIni: number;
  produkAktif: number;
  produkMenipis: number;
  tokoId: string;
  tokoNama: string;
};

export type TransactionStatus =
  | "draft"
  | "diterima"
  | "sebagian"
  | "selesai"
  | "batal";

export type DashboardFilters = {
  startDate: string;
  endDate: string;
  tokoId: string | "all";
  statuses: TransactionStatus[];
  granularity: "day" | "week" | "month";
};

export type SalesTrendPoint = {
  bucket: string;
  totalPenjualan: number;
  totalTransaksi: number;
  pelangganUnik: number;
  rataOrder: number;
};

export type CategoryPerformance = {
  kategoriId: string;
  kategoriNama: string;
  totalPenjualan: number;
  totalQty: number;
};

export type PaymentBreakdown = {
  metodePembayaran: string;
  totalPenjualan: number;
  totalTransaksi: number;
};

export type TopProduct = {
  produkId: string;
  namaProduk: string;
  totalPenjualan: number;
  totalQty: number;
};

export type TopCashier = {
  penggunaId: string;
  namaPengguna: string;
  totalPenjualan: number;
  totalTransaksi: number;
};

export type StorePerformance = {
  tokoId: string;
  tokoNama: string;
  totalPenjualan: number;
  totalTransaksi: number;
  rataOrder: number;
};

export type InventoryHealth = {
  produkAktif: number;
  produkLow: number;
  produkHabis: number;
  nilaiPersediaan: number;
};

export type CustomerSummary = {
  pelangganUnik: number;
  pelangganBaru: number;
};

export type DashboardInsights = {
  salesTrend: SalesTrendPoint[];
  categoryPerformance: CategoryPerformance[];
  paymentBreakdown: PaymentBreakdown[];
  topProducts: TopProduct[];
  topCashiers: TopCashier[];
  storePerformance: StorePerformance[];
  inventoryHealth: InventoryHealth;
  customerSummary: CustomerSummary;
};

export type LowStockItem = {
  produkId: string;
  namaProduk: string;
  stockTersedia: number;
  minimumStock: number;
  tokoNama: string;
};

export type RecentSale = {
  id: string;
  nomorTransaksi: string;
  total: number;
  tanggal: string;
  pelanggan: string | null;
};
