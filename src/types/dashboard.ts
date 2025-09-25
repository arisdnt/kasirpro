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
