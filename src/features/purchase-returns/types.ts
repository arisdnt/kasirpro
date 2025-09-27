export type PurchaseReturnTransaction = {
  id: string;
  nomorRetur: string;
  tanggal: string;
  total: number;
  status: string | null;
  supplierId: string;
  supplierNama: string;
  alasan: string | null;
  createdAt: string;
  updatedAt: string;
  transaksiPembelianId?: string | null;
};

export type PurchaseReturnItem = {
  id: string;
  returId: string;
  produkId: string;
  produkNama: string;
  qty: number;
  hargaSatuan: number;
  subtotal: number;
};