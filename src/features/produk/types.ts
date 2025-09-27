export type Product = {
  id: string;
  kode: string;
  nama: string;
  kategoriId: string | null;
  kategoriNama: string | null;
  brandId: string | null;
  brandNama: string | null;
  hargaJual: number;
  hargaBeli: number | null;
  status: string | null;
  satuan: string | null;
  gambarUrls: string[];
  minimumStock: number | null;
  tenantId: string;
  tokoId: string | null;
  updatedAt: string | null;
};

export type ProductInput = {
  kode: string;
  nama: string;
  kategoriId?: string | null;
  brandId?: string | null;
  hargaJual: number;
  hargaBeli?: number | null;
  satuan?: string | null;
  status?: string | null;
  minimumStock?: number | null;
  gambarUrls?: string[];
};