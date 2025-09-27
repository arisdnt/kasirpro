/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from "@/lib/supabase-client";
import type { PurchaseReturnItem, PurchaseReturnTransaction } from "@/types/transactions";
import { nanoid } from "nanoid";

export async function fetchPurchaseReturns(tenantId: string, tokoId: string | null) {
  const client = getSupabaseClient();
  let query = client
    .from("retur_pembelian")
    .select(`
      id,
      nomor_retur,
      tanggal,
      total,
      status,
      supplier_id,
      supplier:supplier!inner(nama),
      transaksi_pembelian_id,
      alasan,
      created_at,
      updated_at
    `)
    .eq("tenant_id", tenantId)
    .order("tanggal", { ascending: false });

  if (tokoId) {
    query = query.eq("toko_id", tokoId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (((data as any[]) ?? []).map((item) => ({
    id: item.id,
    nomorRetur: item.nomor_retur,
    tanggal: item.tanggal,
    total: item.total,
    status: item.status,
    supplierId: item.supplier_id,
    supplierNama: item.supplier?.nama ?? "Unknown",
    transaksiPembelianId: item.transaksi_pembelian_id ?? null,
    alasan: item.alasan,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  })) as PurchaseReturnTransaction[]);
}

export async function createPurchaseReturnDraft(params: {
  tenantId: string;
  tokoId: string | null;
  penggunaId: string;
  purchaseId: string;
  supplierId: string;
}) {
  const client = getSupabaseClient();

  const generateNomorRetur = async (attempt: number, last?: string): Promise<string> => {
    if (attempt === 0) {
      try {
        const { data, error } = await client.rpc("generate_transaction_number", {
          p_prefix: "RPB",
          p_tenant_id: params.tenantId,
          p_toko_id: params.tokoId,
          p_date: new Date().toISOString(),
        } as unknown as undefined);
        if (error) throw error;
        const val = (data as string) ?? "";
        if (val && val !== last) return val;
      } catch {
        // ignore
      }
    }
    const d = new Date();
    const pad = (n: number, w = 2) => n.toString().padStart(w, "0");
    const ms = d.getMilliseconds().toString().padStart(3, "0");
    const suffix = nanoid(8);
    return `RPB-${pad(d.getDate())}${pad(d.getMonth() + 1)}${d.getFullYear().toString().slice(-2)}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}${ms}-${suffix}`;
  };

  if (!params.tokoId) throw new Error("Toko aktif belum dipilih");

  const payload = {
    tenant_id: params.tenantId,
    toko_id: params.tokoId,
    pengguna_id: params.penggunaId,
    supplier_id: params.supplierId,
    tanggal: new Date().toISOString(),
    total: 0,
    status: "draft",
    transaksi_pembelian_id: params.purchaseId,
  };

  let attempt = 0;
  const maxAttempts = 4;
  let inserted: { id: string; nomor_retur: string } | null = null;
  let nomorRetur = await generateNomorRetur(attempt);
  while (attempt < maxAttempts && !inserted) {
    const { data, error, status } = await client
      .from("retur_pembelian")
      .insert({ ...(payload as Record<string, unknown>), nomor_retur: nomorRetur } as unknown as never)
      .select("id, nomor_retur")
      .single();
    if (!error && data) {
      inserted = data as { id: string; nomor_retur: string };
      break;
    }
    if (status === 409) {
      console.warn("createPurchaseReturnDraft: nomor_retur conflict, regenerating", {
        attempt,
        nomorRetur,
        errorMessage: (error as any)?.message,
        errorDetails: (error as any)?.details,
      });
      attempt += 1;
      nomorRetur = await generateNomorRetur(attempt, nomorRetur);
      continue;
    }
    if (error) throw error;
  }
  if (!inserted) throw new Error("Gagal membuat nomor retur pembelian unik. Coba lagi.");
  return inserted as { id: string; nomor_retur: string };
}

export async function fetchPurchaseReturnItems(returId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("item_retur_pembelian")
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
  })) as PurchaseReturnItem[]);
}

export async function addPurchaseReturnItem(params: {
  returId: string;
  produkId: string;
  qty: number;
  hargaSatuan: number;
}) {
  const client = getSupabaseClient();
  const subtotal = (params.qty ?? 0) * (params.hargaSatuan ?? 0);
  const { data, error } = await client
    .from("item_retur_pembelian")
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
  await recomputePurchaseReturnTotals(params.returId);
  return data as { id: string };
}

export async function updatePurchaseReturnItem(params: {
  id: string;
  returId: string;
  qty: number;
  hargaSatuan: number;
}) {
  const client = getSupabaseClient();
  const subtotal = (params.qty ?? 0) * (params.hargaSatuan ?? 0);
  const { error } = await (client as any)
    .from("item_retur_pembelian")
    .update({ qty: params.qty, harga_satuan: params.hargaSatuan, subtotal })
    .eq("id", params.id);
  if (error) throw error;
  await recomputePurchaseReturnTotals(params.returId);
}

export async function deletePurchaseReturnItem(params: { id: string; returId: string }) {
  const client = getSupabaseClient();
  const { error } = await client
    .from("item_retur_pembelian")
    .delete()
    .eq("id", params.id);
  if (error) throw error;
  await recomputePurchaseReturnTotals(params.returId);
}

export async function recomputePurchaseReturnTotals(returId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("item_retur_pembelian")
    .select("subtotal")
    .eq("retur_id", returId);
  if (error) throw error;
  const subtotal = ((data as any[]) ?? []).reduce((sum, r) => sum + (Number(r.subtotal) || 0), 0);
  const total = subtotal;
  const { error: upErr } = await (client as any)
    .from("retur_pembelian")
    .update({ subtotal, total })
    .eq("id", returId);
  if (upErr) throw upErr;
}

export async function updatePurchaseReturnHeader(params: {
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
  const { error } = await (client as any).from("retur_pembelian").update(patch).eq("id", params.id);
  if (error) throw error;
}

export async function deletePurchaseReturn(returId: string) {
  const client = getSupabaseClient();
  const { error } = await client.from("retur_pembelian").delete().eq("id", returId);
  if (error) throw error;
}

export async function fetchPurchaseItemsWithReturnable(transaksiId: string) {
  const client = getSupabaseClient();
  // Purchase items
  const { data: purchaseItems, error: pErr } = await client
    .from("item_transaksi_pembelian")
    .select("id, transaksi_id, produk_id, qty, harga_satuan, subtotal, produk:produk_id ( nama )")
    .eq("transaksi_id", transaksiId)
    .order("id", { ascending: true });
  if (pErr) throw pErr;
  const items = ((purchaseItems as any[]) ?? []).map((row) => ({
    id: row.id,
    transaksiId: row.transaksi_id,
    produkId: row.produk_id,
    produkNama: (row.produk as any)?.nama ?? "Produk",
    qty: row.qty ?? 0,
    hargaSatuan: row.harga_satuan ?? 0,
    subtotal: row.subtotal ?? 0,
  }));

  // Headers for this purchase
  const { data: returHeaders, error: hErr } = await client
    .from("retur_pembelian")
    .select("id")
    .eq("transaksi_pembelian_id", transaksiId);
  if (hErr) throw hErr;
  const returIds = ((returHeaders as any[]) ?? []).map((r) => r.id as string);

  const returnedByProduct = new Map<string, number>();
  if (returIds.length > 0) {
    const { data: returnedItems, error: riErr } = await client
      .from("item_retur_pembelian")
      .select("produk_id, qty, retur_id")
      .in("retur_id", returIds);
    if (riErr) throw riErr;
    for (const row of (returnedItems as any[]) ?? []) {
      const pid = row.produk_id as string;
      returnedByProduct.set(pid, (returnedByProduct.get(pid) ?? 0) + (row.qty ?? 0));
    }
  }

  return items.map((it: any) => ({
    ...it,
    returnedQty: returnedByProduct.get(it.produkId) ?? 0,
    remainingReturnable: Math.max(0, it.qty - (returnedByProduct.get(it.produkId) ?? 0)),
  }));
}