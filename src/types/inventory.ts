export type InventoryItem = {
  id: string;
  produkId: string;
  produkNama: string;
  stockSistem: number;
  stockFisik: number;
  selisih: number;
  tokoId: string;
};

export type BatchInfo = {
  id: string;
  produkId: string;
  batchNumber: string | null;
  tanggalExpired: string | null;
  stockFisik: number | null;
};
