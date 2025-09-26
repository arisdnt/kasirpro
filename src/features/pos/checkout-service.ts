import { getSupabaseClient } from "@/lib/supabase-client";
import type { CartItem } from "./types";

export async function finalizeTransaction(params: {
  tenantId: string;
  tokoId: string;
  penggunaId: string;
  cart: CartItem[];
  amountPaid: number;
  method: string;
  customerId: string | null;
  discount?: number;
}) {
  const client = getSupabaseClient();
  // Fetch effective tax settings (store overrides tenant)
  type TaxSettings = { pajak_enabled: boolean; pajak_persen: number };
  const { data: taxData, error: taxError } = await client.rpc("get_tax_settings");
  if (taxError) throw taxError;
  const tax = (taxData as unknown as TaxSettings) ?? { pajak_enabled: false, pajak_persen: 0 };
  const taxEnabled = Boolean(tax.pajak_enabled);
  const taxRate = Number(tax.pajak_persen ?? 0);
  const { data: numberData, error: numberError } = await client.rpc(
    "generate_transaction_number",
    {
      p_prefix: "POS",
      p_tenant_id: params.tenantId,
      p_toko_id: params.tokoId,
      p_date: new Date().toISOString(),
    } as unknown as undefined,
  );
  if (numberError) throw numberError;
  const nomorTransaksi = numberData as string;

  const subtotal = params.cart.reduce(
    (sum, item) => sum + item.quantity * item.product.hargaJual - item.discount,
    0,
  );
  const discount = params.discount ?? 0;
  const taxableBase = Math.max(subtotal - discount, 0);
  const taxNominal = taxEnabled && taxRate > 0 ? (taxableBase * taxRate) / 100 : 0;
  const total = Math.max(taxableBase + taxNominal, 0);
  const change = Math.max(params.amountPaid - total, 0);

  const { data: inserted, error: insertError } = await client
    .from("transaksi_penjualan")
    .insert({
      tenant_id: params.tenantId,
      toko_id: params.tokoId,
      pengguna_id: params.penggunaId,
      pelanggan_id: params.customerId,
      nomor_transaksi: nomorTransaksi,
      subtotal,
      pajak_persen: taxEnabled ? taxRate : 0,
      pajak_nominal: taxNominal,
      total,
      bayar: params.amountPaid,
      kembalian: change,
      metode_pembayaran: params.method,
      diskon_nominal: discount,
      diskon_persen: 0,
    } as unknown as never)
    .select("id")
    .single();
  if (insertError || !inserted) throw insertError;
  const transaksiId = (inserted as unknown as { id: string }).id;

  const itemsPayload = params.cart.map((item) => ({
    transaksi_id: transaksiId,
    produk_id: item.product.id,
    qty: item.quantity,
    harga_satuan: item.product.hargaJual,
    diskon_nominal: item.discount,
    diskon_persen: 0,
    subtotal: item.quantity * item.product.hargaJual - item.discount,
  }));

  const { error: itemError } = await client
    .from("item_transaksi_penjualan")
    .insert(itemsPayload as unknown as never);

  if (itemError) {
    await client.from("transaksi_penjualan").delete().eq("id", transaksiId);
    throw itemError;
  }

  return { nomorTransaksi, total, change, pajak: taxNominal, pajakRate: taxEnabled ? taxRate : 0 };
}
