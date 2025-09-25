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

export type PurchaseTransaction = {
  id: string;
  nomorTransaksi: string;
  tanggal: string;
  total: number;
  status: string | null;
  supplierId: string;
  supplierNama: string;
};

export type ReturnTransaction = {
  id: string;
  nomorRetur: string;
  tanggal: string;
  total: number;
  status: string | null;
  pelangganNama: string | null;
};

export type InternalMessage = {
  id: string;
  judul: string;
  isi: string;
  createdAt: string;
  status: string | null;
};

export type AuditEntry = {
  id: string;
  tabel: string;
  aksi: string;
  userId: string | null;
  createdAt: string;
};
