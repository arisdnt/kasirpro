export type StatusFilter = "all" | "draft" | "diterima" | "sebagian" | "selesai" | "batal";
export type SupplierFilter = "all" | string;

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

// Types from old centralized types
export type PurchaseTransaction = {
  id: string;
  nomorTransaksi: string;
  tanggal: string;
  total: number;
  status: string | null;
  supplierId: string;
  supplierNama: string;
};

export type PurchaseItemDetailed = {
  id: string;
  transaksiId: string;
  produkId: string;
  produkNama: string;
  produkKode: string | null;
  kategoriNama: string | null;
  qty: number;
  hargaSatuan: number;
  subtotal: number;
};