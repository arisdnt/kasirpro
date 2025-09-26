import { getSupabaseClient } from "@/lib/supabase-client";
import type { StockOpnameDetail, StockOpnameSummary } from "@/types/stock-opname";

type RawOpnameItem = {
  id: string;
  stock_sistem: number | null;
  stock_fisik: number | null;
  selisih: number | null;
  keterangan?: string | null;
  produk_id?: string | null;
  produk?: {
    nama?: string | null;
    kode?: string | null;
  } | null;
};

type RawOpname = {
  id: string;
  nomor_opname: string;
  tanggal: string;
  status: string | null;
  catatan: string | null;
  toko_id: string;
  pengguna_id: string;
  toko?: {
    nama?: string | null;
  } | null;
  pengguna?: {
    full_name?: string | null;
  } | null;
  items?: RawOpnameItem[] | null;
};

function aggregateItems(items: RawOpnameItem[] | null | undefined) {
  const safe = items ?? [];
  return safe.reduce(
    (acc, item) => {
      const diff = item.selisih ?? (item.stock_fisik ?? 0) - (item.stock_sistem ?? 0);
      acc.total += diff;
      if (diff > 0) {
        acc.plus += diff;
      } else if (diff < 0) {
        acc.minus += Math.abs(diff);
      }
      acc.count += 1;
      return acc;
    },
    { count: 0, plus: 0, minus: 0, total: 0 },
  );
}

function mapSummary(row: RawOpname): StockOpnameSummary {
  const metrics = aggregateItems(row.items);
  return {
    id: row.id,
    nomorOpname: row.nomor_opname,
    tanggal: row.tanggal,
    status: row.status,
    catatan: row.catatan,
    tokoId: row.toko_id,
    tokoNama: row.toko?.nama ?? null,
    penggunaId: row.pengguna_id,
    penggunaNama: row.pengguna?.full_name ?? null,
    totalItems: metrics.count,
    totalSelisihPlus: metrics.plus,
    totalSelisihMinus: metrics.minus,
    totalSelisihNet: metrics.total,
  };
}

export async function fetchStockOpnameSummaries(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();

  const query = client
    .from("stock_opname")
    .select(
      `
        id,
        nomor_opname,
        tanggal,
        status,
        catatan,
        toko_id,
        pengguna_id,
        toko:toko_id ( nama ),
        pengguna:pengguna_id ( full_name ),
        items:stock_opname_items ( id, stock_sistem, stock_fisik, selisih )
      `,
    )
    .eq("tenant_id", tenantId)
    .order("tanggal", { ascending: false })
    .limit(50);

  if (tokoId) {
    query.eq("toko_id", tokoId);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapSummary(row as unknown as RawOpname));
}

export async function fetchStockOpnameDetail(opnameId: string) {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("stock_opname")
    .select(
      `
        id,
        nomor_opname,
        tanggal,
        status,
        catatan,
        toko_id,
        pengguna_id,
        toko:toko_id ( nama ),
        pengguna:pengguna_id ( full_name ),
        items:stock_opname_items (
          id,
          produk_id,
          stock_sistem,
          stock_fisik,
          selisih,
          keterangan,
          produk:produk_id ( nama, kode )
        )
      `,
    )
    .eq("id", opnameId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const summary = mapSummary(data as unknown as RawOpname);
  const items = ((data as unknown as RawOpname).items ?? []).map((item) => ({
    id: item.id,
    produkId: item.produk_id ?? "",
    produkKode: item.produk?.kode ?? null,
    produkNama: item.produk?.nama ?? null,
    stockSistem: item.stock_sistem ?? 0,
    stockFisik: item.stock_fisik ?? 0,
    selisih: item.selisih ?? (item.stock_fisik ?? 0) - (item.stock_sistem ?? 0),
    keterangan: item.keterangan ?? null,
  }));

  const detail: StockOpnameDetail = {
    ...summary,
    items,
  };

  return detail;
}
