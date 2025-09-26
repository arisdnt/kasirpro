export type StockOpnameSummary = {
  id: string;
  nomorOpname: string;
  tanggal: string;
  status: string | null;
  catatan: string | null;
  tokoId: string;
  tokoNama: string | null;
  penggunaId: string;
  penggunaNama: string | null;
  totalItems: number;
  totalSelisihPlus: number;
  totalSelisihMinus: number;
  totalSelisihNet: number;
};

export type StockOpnameItem = {
  id: string;
  produkId: string;
  produkKode: string | null;
  produkNama: string | null;
  stockSistem: number;
  stockFisik: number;
  selisih: number;
  keterangan: string | null;
};

export type StockOpnameDetail = StockOpnameSummary & {
  items: StockOpnameItem[];
};
