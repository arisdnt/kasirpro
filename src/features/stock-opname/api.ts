import { getSupabaseClient } from "@/lib/supabase-client";
import type { StockOpnameDetail, StockOpnameSummary } from "@/features/stock-opname/types";
import { nanoid } from "nanoid";

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
        items:stock_opname_items!opname_id ( id, stock_sistem, stock_fisik, selisih )
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
        items:stock_opname_items!opname_id (
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

export async function createStockOpnameDraft(params: {
  tenantId: string;
  tokoId: string;
  penggunaId: string;
  tanggal?: string;
  catatan?: string | null;
}) {
  const client = getSupabaseClient();

  const generateNomor = async (attempt: number, last?: string) => {
    if (attempt === 0) {
      try {
        const { data, error } = await client.rpc("generate_transaction_number", {
          p_prefix: "SOP",
          p_tenant_id: params.tenantId,
          p_toko_id: params.tokoId,
          p_date: new Date().toISOString(),
        } as unknown as undefined);
        if (error) throw error;
        const val = (data as string) ?? "";
        if (val && val !== last) return val;
      } catch {
        // fallback handled below
      }
    }
    const d = new Date();
    const pad = (n: number, w = 2) => n.toString().padStart(w, "0");
    const ms = d.getMilliseconds().toString().padStart(3, "0");
    return `SOP-${pad(d.getDate())}${pad(d.getMonth() + 1)}${d.getFullYear()
      .toString()
      .slice(-2)}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}${ms}-${nanoid(6)}`;
  };

  const payload = {
    tenant_id: params.tenantId,
    toko_id: params.tokoId,
    pengguna_id: params.penggunaId,
    tanggal: params.tanggal ?? new Date().toISOString(),
    catatan: params.catatan ?? null,
    status: "draft",
  } as Record<string, unknown>;

  let attempt = 0;
  const maxAttempts = 4;
  let inserted: { id: string; nomor_opname: string } | null = null;
  let nomor = await generateNomor(attempt);

  while (attempt < maxAttempts && !inserted) {
    const { data, error, status } = await client
      .from("stock_opname")
      .insert({ ...payload, nomor_opname: nomor } as unknown as never)
      .select("id, nomor_opname")
      .single();

    if (!error && data) {
      inserted = data as { id: string; nomor_opname: string };
      break;
    }

    if (status === 409) {
      attempt += 1;
      nomor = await generateNomor(attempt, nomor);
      continue;
    }
    if (error) throw error;
  }

  if (!inserted) {
    throw new Error("Gagal membuat nomor opname unik. Coba lagi.");
  }
  return inserted;
}

export async function updateStockOpnameHeader(params: {
  id: string;
  tanggal?: string;
  catatan?: string | null;
  status?: string | null;
}) {
  const client = getSupabaseClient();
  const patch: Record<string, unknown> = {};
  if (typeof params.tanggal !== "undefined") patch.tanggal = params.tanggal;
  if (typeof params.catatan !== "undefined") patch.catatan = params.catatan;
  if (typeof params.status !== "undefined") patch.status = params.status;
  if (Object.keys(patch).length === 0) return;
  const { error } = await client.from("stock_opname").update(patch).eq("id", params.id);
  if (error) throw error;
}

export async function deleteStockOpname(id: string) {
  const client = getSupabaseClient();
  // Ensure child items removed first if FK doesn't cascade
  const { error: childErr } = await client.from("stock_opname_items").delete().eq("opname_id", id);
  if (childErr) throw childErr;
  const { error } = await client.from("stock_opname").delete().eq("id", id);
  if (error) throw error;
}
