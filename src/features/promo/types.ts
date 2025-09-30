export type Promo = {
  id: string;
  tenantId: string;
  tokoId: string | null;
  tokoNama: string | null;
  userId: string | null;
  userNama: string | null;
  nama: string;
  deskripsi: string | null;
  kode: string | null;
  tipe: string;
  level: string;
  nilai: number;
  hargaSpesial: number | null;
  beliQty: number | null;
  gratisQty: number | null;
  syaratMinQty: number | null;
  syaratMinTotal: number | null;
  mulai: string;
  selesai: string | null;
  hariDalamMinggu: number[] | null;
  jamMulai: string | null;
  jamSelesai: string | null;
  limitPerPelanggan: number | null;
  limitKeseluruhan: number | null;
  prioritas: number;
  isOtomatis: boolean;
  status: string;
  metadata: Record<string, unknown>;
  createdAt: string | null;
  updatedAt: string | null;
};

export type PromoAssignment = {
  id: string;
  entityId: string;
  entityName: string;
  exclude: boolean;
};

export type PromoRelations = {
  products: PromoAssignment[];
  categories: PromoAssignment[];
  brands: PromoAssignment[];
  customers: PromoAssignment[];
};

export type PromoWithRelations = Promo & PromoRelations;

export type PromoInput = {
  nama: string;
  deskripsi?: string | null;
  kode?: string | null;
  tipe: string;
  level: string;
  nilai: number;
  hargaSpesial?: number | null;
  beliQty?: number | null;
  gratisQty?: number | null;
  syaratMinQty?: number | null;
  syaratMinTotal?: number | null;
  mulai: string;
  selesai?: string | null;
  hariDalamMinggu?: number[] | null;
  jamMulai?: string | null;
  jamSelesai?: string | null;
  limitPerPelanggan?: number | null;
  limitKeseluruhan?: number | null;
  prioritas: number;
  isOtomatis: boolean;
  status: string;
  tokoId?: string | null;
};
