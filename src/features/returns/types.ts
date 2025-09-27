export type ReturnTransaction = {
  id: string;
  nomorRetur: string;
  tanggal: string;
  total: number;
  status: string | null;
  pelangganNama: string | null;
  alasan?: string | null;
  // Linking info to enable editing against the original sale
  transaksiPenjualanId?: string | null;
  pelangganId?: string | null;
  nomorTransaksiPenjualan?: string | null;
};

export type ReturnItem = {
  id: string;
  returId: string;
  produkId: string;
  produkNama: string;
  qty: number;
  hargaSatuan: number;
  subtotal: number;
};