export type SaleTransaction = {
  id: string;
  nomorTransaksi: string;
  tanggal: string;
  total: number;
  bayar: number | null;
  kembalian: number | null;
  metodePembayaran: string | null;
  pelangganId: string | null;
  pelangganNama: string | null;
};

export type SaleItem = {
  id: string;
  transaksiId: string;
  produkId: string;
  produkNama: string;
  qty: number;
  hargaSatuan: number;
  subtotal: number;
};