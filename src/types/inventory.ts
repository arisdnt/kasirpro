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
