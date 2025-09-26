/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { PromoWithRelations } from "@/types/promo";

const BASE_SELECT = `
  id,
  tenant_id,
  toko_id,
  user_id,
  nama,
  deskripsi,
  kode,
  tipe,
  level,
  nilai,
  harga_spesial,
  beli_qty,
  gratis_qty,
  syarat_min_qty,
  syarat_min_total,
  mulai,
  selesai,
  hari_dalam_minggu,
  jam_mulai,
  jam_selesai,
  limit_per_pelanggan,
  limit_keseluruhan,
  prioritas,
  is_otomatis,
  status,
  metadata,
  created_at,
  updated_at,
  toko:toko_id ( nama ),
  pengguna:user_id ( full_name ),
  products:promo_produk ( id, exclude, produk_id, produk:produk_id ( nama, kode ) ),
  categories:promo_kategori ( id, exclude, kategori_id, kategori:kategori_id ( nama ) ),
  brands:promo_brand ( id, exclude, brand_id, brand:brand_id ( nama ) ),
  customers:promo_pelanggan ( id, exclude, pelanggan_id, pelanggan:pelanggan_id ( nama ) )
`;

type RawAssignment = {
  id: string;
  exclude: boolean;
  produk_id?: string;
  produk?: { nama?: string | null; kode?: string | null } | null;
  kategori_id?: string;
  kategori?: { nama?: string | null } | null;
  brand_id?: string;
  brand?: { nama?: string | null } | null;
  pelanggan_id?: string;
  pelanggan?: { nama?: string | null } | null;
};

type RawPromo = {
  id: string;
  tenant_id: string;
  toko_id: string | null;
  user_id: string | null;
  nama: string;
  deskripsi: string | null;
  kode: string | null;
  tipe: string;
  level: string;
  nilai: number;
  harga_spesial: number | null;
  beli_qty: number | null;
  gratis_qty: number | null;
  syarat_min_qty: number | null;
  syarat_min_total: number | null;
  mulai: string;
  selesai: string | null;
  hari_dalam_minggu: number[] | null;
  jam_mulai: string | null;
  jam_selesai: string | null;
  limit_per_pelanggan: number | null;
  limit_keseluruhan: number | null;
  prioritas: number;
  is_otomatis: boolean;
  status: string;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
  toko?: { nama?: string | null } | null;
  pengguna?: { full_name?: string | null } | null;
  products?: RawAssignment[] | null;
  categories?: RawAssignment[] | null;
  brands?: RawAssignment[] | null;
  customers?: RawAssignment[] | null;
};

function mapAssignments(raw: RawAssignment[] | null | undefined, type: "produk" | "kategori" | "brand" | "pelanggan") {
  if (!raw) return [];
  return raw.map((item) => {
    switch (type) {
      case "produk":
        return {
          id: item.id,
          entityId: item.produk_id ?? "",
          entityName: item.produk?.nama ?? "-",
          exclude: item.exclude,
        };
      case "kategori":
        return {
          id: item.id,
          entityId: item.kategori_id ?? "",
          entityName: item.kategori?.nama ?? "-",
          exclude: item.exclude,
        };
      case "brand":
        return {
          id: item.id,
          entityId: item.brand_id ?? "",
          entityName: item.brand?.nama ?? "-",
          exclude: item.exclude,
        };
      case "pelanggan":
        return {
          id: item.id,
          entityId: item.pelanggan_id ?? "",
          entityName: item.pelanggan?.nama ?? "-",
          exclude: item.exclude,
        };
      default:
        return {
          id: item.id,
          entityId: "",
          entityName: "-",
          exclude: item.exclude,
        };
    }
  });
}

function mapPromo(row: RawPromo): PromoWithRelations {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    tokoId: row.toko_id,
    tokoNama: row.toko?.nama ?? null,
    userId: row.user_id,
    userNama: row.pengguna?.full_name ?? null,
    nama: row.nama,
    deskripsi: row.deskripsi,
    kode: row.kode,
    tipe: row.tipe,
    level: row.level,
    nilai: Number(row.nilai ?? 0),
    hargaSpesial: row.harga_spesial != null ? Number(row.harga_spesial) : null,
    beliQty: row.beli_qty,
    gratisQty: row.gratis_qty,
    syaratMinQty: row.syarat_min_qty,
    syaratMinTotal: row.syarat_min_total != null ? Number(row.syarat_min_total) : null,
    mulai: row.mulai,
    selesai: row.selesai,
    hariDalamMinggu: row.hari_dalam_minggu ?? null,
    jamMulai: row.jam_mulai,
    jamSelesai: row.jam_selesai,
    limitPerPelanggan: row.limit_per_pelanggan,
    limitKeseluruhan: row.limit_keseluruhan,
    prioritas: row.prioritas,
    isOtomatis: row.is_otomatis,
    status: row.status,
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    products: mapAssignments(row.products, "produk"),
    categories: mapAssignments(row.categories, "kategori"),
    brands: mapAssignments(row.brands, "brand"),
    customers: mapAssignments(row.customers, "pelanggan"),
  };
}

export async function fetchPromos(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();

  const query = client
    .from("promo")
    .select(BASE_SELECT)
    .eq("tenant_id", tenantId)
    .order("prioritas", { ascending: true })
    .order("mulai", { ascending: false })
    .limit(100);

  if (tokoId) {
    query.eq("toko_id", tokoId);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return ((data as any[]) ?? []).map((row) => mapPromo(row as RawPromo));
}

export async function updatePromoStatus(promoId: string, status: string) {
  const client = getSupabaseClient();
  const { error } = await client
    .from("promo")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", promoId);

  if (error) {
    throw error;
  }
}
