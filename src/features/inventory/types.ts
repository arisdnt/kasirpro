export type InventoryItem = {
  id: string;
  produkId: string;
  produkNama: string;
  produkKode: string | null;
  stockSistem: number;
  stockFisik: number;
  selisih: number;
  stockMinimum: number | null;
  stockMaximum: number | null;
  lokasiRak: string | null;
  batchNumber: string | null;
  tanggalExpired: string | null;
  tokoId: string;
};

export type BatchInfo = {
  id: string;
  produkId: string;
  batchNumber: string | null;
  tanggalExpired: string | null;
  stockFisik: number | null;
};

export type StockMovementType = "IN" | "OUT" | "ADJ";

export type StockMovement = {
  id: string;
  date: string; // ISO string
  referenceNo: string | null;
  source: "Pembelian" | "Penjualan" | "Stock Opname";
  type: StockMovementType;
  qtyChange: number; // positive for IN, negative for OUT, signed for ADJ
  note?: string | null;
};