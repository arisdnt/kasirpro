export type StatusFilter = "all" | "draft" | "diterima" | "sebagian" | "selesai" | "batal";

export interface PurchaseStats {
  total: number;
  draft: number;
  diterima: number;
  sebagian: number;
  selesai: number;
  batal: number;
}

export interface Purchase {
  id: string;
  nomorTransaksi: string;
  supplierNama: string;
  total: number;
  status: string;
  tanggal: string;
}

export interface PurchaseItem {
  id: string;
  produkNama: string;
  produkKode?: string;
  qty: number;
  hargaSatuan: number;
  subtotal: number;
}