/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { ReturnItem, ReturnTransaction } from "@/features/returns/types";
import type { SaleItem } from "@/features/sales/types";
import { nanoid } from "nanoid";

export async function fetchSalesReturns(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  const query = client
    .from("retur_penjualan")
    .select(`
      id,
      nomor_retur,
      tanggal,
      total,
      status,
      alasan,
      transaksi_penjualan_id,
      pelanggan_id,
      pelanggan:pelanggan_id ( nama ),
      transaksi_penjualan:transaksi_penjualan_id ( nomor_transaksi )
    `)
    .eq("tenant_id", tenantId)
    .order("tanggal", { ascending: false })
    .limit(50);

  if (tokoId) {
    query.eq("toko_id", tokoId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    nomorRetur: item.nomor_retur,
    tanggal: item.tanggal,
    total: item.total ?? 0,
    status: item.status,
    alasan: item.alasan ?? null,
    transaksiPenjualanId: item.transaksi_penjualan_id ?? null,
    pelangganId: item.pelanggan_id ?? null,
    pelangganNama: (item.pelanggan as any)?.nama ?? null,
    nomorTransaksiPenjualan: (item.transaksi_penjualan as any)?.nomor_transaksi ?? null,
  })) as ReturnTransaction[]);
}

export async function createSalesReturnDraft(params: {
  tenantId: string;
  tokoId: string | null;
  penggunaId: string;
  saleId: string;
  pelangganId: string | null;
}) {
  const client = getSupabaseClient();

  // Helper to generate nomor retur. First attempt uses RPC pattern, subsequent attempts use a guaranteed-unique local format.
  const generateNomorRetur = async (attempt: number, last?: string): Promise<string> => {
    if (attempt === 0) {
      try {
        const { data, error } = await client.rpc("generate_transaction_number", {
          p_prefix: "RPJ",
          p_tenant_id: params.tenantId,
          p_toko_id: params.tokoId,
          p_date: new Date().toISOString(),
        } as unknown as undefined);
        if (error) throw error;
        const val = (data as string) ?? "";
        if (val && val !== last) return val;
      } catch {
        // ignore and use fallback
      }
    }
    // Local unique fallback (tenant-scoped uniqueness is satisfied by randomness + timestamp)
    const d = new Date();
    const pad = (n: number, w = 2) => n.toString().padStart(w, "0");
    const ms = d.getMilliseconds().toString().padStart(3, "0");
    const suffix = nanoid(8); // slightly longer for extra safety
    return `RPJ-${pad(d.getDate())}${pad(d.getMonth() + 1)}${d.getFullYear().toString().slice(-2)}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}${ms}-${suffix}`;
  };

  if (!params.tokoId) {
    throw new Error("Toko aktif belum dipilih");
  }

  const payload = {
    tenant_id: params.tenantId,
    toko_id: params.tokoId,
    pengguna_id: params.penggunaId,
    tanggal: new Date().toISOString(),
    total: 0,
    status: "draft",
    pelanggan_id: params.pelangganId,
    transaksi_penjualan_id: params.saleId,
  };

  // Retry on unique conflict for nomor_retur (HTTP 409)
  let attempt = 0;
  const maxAttempts = 4;
  let inserted: { id: string; nomor_retur: string } | null = null;
  // Generate initial number
  let nomorRetur = await generateNomorRetur(attempt);
  while (attempt < maxAttempts && !inserted) {
    const { data, error, status } = await client
      .from("retur_penjualan")
      .insert({ ...(payload as Record<string, unknown>), nomor_retur: nomorRetur } as unknown as never)
      .select("id, nomor_retur")
      .single();

    if (!error && data) {
      inserted = data as { id: string; nomor_retur: string };
      break;
    }

    // If conflict, regenerate and retry
    if (status === 409) {
      // Helpful diagnostics in dev console
      console.warn("createSalesReturnDraft: nomor_retur conflict, regenerating", {
        attempt,
        nomorRetur,
        errorMessage: (error as any)?.message,
        errorDetails: (error as any)?.details,
      });
      attempt += 1;
      nomorRetur = await generateNomorRetur(attempt, nomorRetur);
      continue;
    }
    // Other errors bubble up
    if (error) throw error;
  }
  if (!inserted) {
    throw new Error("Gagal membuat nomor retur unik. Coba lagi.");
  }

  return inserted as { id: string; nomor_retur: string };
}

// Items CRUD and header helpers

export async function fetchReturnItems(returId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("item_retur_penjualan")
    .select(
      `id, retur_id, produk_id, qty, harga_satuan, subtotal,
       produk:produk_id ( nama )`
    )
    .eq("retur_id", returId)
    .order("id", { ascending: true });
  if (error) throw error;
  return (((data as any[]) ?? []).map((row) => ({
    id: row.id,
    returId: row.retur_id,
    produkId: row.produk_id,
    produkNama: (row.produk as any)?.nama ?? "Produk",
    qty: row.qty ?? 0,
    hargaSatuan: row.harga_satuan ?? 0,
    subtotal: row.subtotal ?? 0,
  })) as ReturnItem[]);
}

export async function addReturnItem(params: {
  returId: string;
  produkId: string;
  qty: number;
  hargaSatuan: number;
}) {
  const client = getSupabaseClient();
  const subtotal = (params.qty ?? 0) * (params.hargaSatuan ?? 0);
  const { data, error } = await client
    .from("item_retur_penjualan")
    .insert({
      retur_id: params.returId,
      produk_id: params.produkId,
      qty: params.qty,
      harga_satuan: params.hargaSatuan,
      subtotal,
    } as any)
    .select("id")
    .single();
  if (error) throw error;
  await recomputeReturnTotals(params.returId);
  return data as { id: string };
}

export async function updateReturnItem(params: {
  id: string;
  returId: string;
  qty: number;
  hargaSatuan: number;
}) {
  const client = getSupabaseClient();
  const subtotal = (params.qty ?? 0) * (params.hargaSatuan ?? 0);
  const { error } = await (client as any)
    .from("item_retur_penjualan")
    .update({ qty: params.qty, harga_satuan: params.hargaSatuan, subtotal })
    .eq("id", params.id);
  if (error) throw error;
  await recomputeReturnTotals(params.returId);
}

export async function deleteReturnItem(params: { id: string; returId: string }) {
  const client = getSupabaseClient();
  const { error } = await client
    .from("item_retur_penjualan")
    .delete()
    .eq("id", params.id);
  if (error) throw error;
  await recomputeReturnTotals(params.returId);
}

export async function recomputeReturnTotals(returId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("item_retur_penjualan")
    .select("subtotal")
    .eq("retur_id", returId);
  if (error) throw error;
  const subtotal = ((data as any[]) ?? []).reduce((sum, r) => sum + (Number(r.subtotal) || 0), 0);
  const total = subtotal; // adjust if taxes/fees apply to returns
  const { error: upErr } = await (client as any)
    .from("retur_penjualan")
    .update({ subtotal, total })
    .eq("id", returId);
  if (upErr) throw upErr;
}

export async function updateReturnHeader(params: {
  id: string;
  tanggal?: string;
  alasan?: string | null;
  status?: "draft" | "diterima" | "sebagian" | "selesai" | "batal";
  catatan?: string | null;
}) {
  const client = getSupabaseClient();
  const patch: Record<string, any> = {};
  if (params.tanggal) patch.tanggal = params.tanggal;
  if (typeof params.alasan !== "undefined") patch.alasan = params.alasan;
  if (typeof params.catatan !== "undefined") patch.catatan = params.catatan;
  if (typeof params.status !== "undefined") patch.status = params.status;
  if (Object.keys(patch).length === 0) return;
  const { error } = await (client as any).from("retur_penjualan").update(patch).eq("id", params.id);
  if (error) throw error;
}

export async function deleteReturn(returId: string) {
  const client = getSupabaseClient();
  const { error } = await client.from("retur_penjualan").delete().eq("id", returId);
  if (error) throw error;
}

// Helper: find returnable quantities from a sale to enforce partial returns client-side
export async function fetchSaleItemsWithReturnable(transaksiId: string) {
  const client = getSupabaseClient();
  // Get sale items
  const { data: saleItems, error: sErr } = await client
    .from("item_transaksi_penjualan")
    .select("id, transaksi_id, produk_id, qty, harga_satuan, subtotal, produk:produk_id ( nama )")
    .eq("transaksi_id", transaksiId)
    .order("id", { ascending: true });
  if (sErr) throw sErr;
  const items = ((saleItems as any[]) ?? []).map((row) => ({
    id: row.id,
    transaksiId: row.transaksi_id,
    produkId: row.produk_id,
    produkNama: (row.produk as any)?.nama ?? "Produk",
    qty: row.qty ?? 0,
    hargaSatuan: row.harga_satuan ?? 0,
    subtotal: row.subtotal ?? 0,
  })) as SaleItem[];

  // Find retur headers for this sale
  const { data: returHeaders, error: hErr } = await client
    .from("retur_penjualan")
    .select("id")
    .eq("transaksi_penjualan_id", transaksiId);
  if (hErr) throw hErr;
  const returIds = ((returHeaders as any[]) ?? []).map((r) => r.id as string);
  const returnedByProduct = new Map<string, number>();
  if (returIds.length > 0) {
    const { data: returnedItems, error: riErr } = await client
      .from("item_retur_penjualan")
      .select("produk_id, qty, retur_id")
      .in("retur_id", returIds);
    if (riErr) throw riErr;
    for (const row of (returnedItems as any[]) ?? []) {
      const pid = row.produk_id as string;
      returnedByProduct.set(pid, (returnedByProduct.get(pid) ?? 0) + (row.qty ?? 0));
    }
  }

  return items.map((it) => ({
    ...it,
    returnedQty: returnedByProduct.get(it.produkId) ?? 0,
    remainingReturnable: Math.max(0, it.qty - (returnedByProduct.get(it.produkId) ?? 0)),
  }));
}