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
  const { data: numberData, error: numberError } = await client.rpc(
    "generate_transaction_number",
    {
      p_prefix: "POS",
      p_tenant_id: params.tenantId,
      p_toko_id: params.tokoId,
      p_date: new Date().toISOString(),
    },
  );
  if (numberError) throw numberError;
  const nomorTransaksi = numberData as string;

  const subtotal = params.cart.reduce(
    (sum, item) => sum + item.quantity * item.product.hargaJual - item.discount,
    0,
  );
  const discount = params.discount ?? 0;
  const total = Math.max(subtotal - discount, 0);
  const change = Math.max(params.amountPaid - total, 0);

  const { data: transaksi, error: insertError } = await client
    .from("transaksi_penjualan")
    .insert({
      tenant_id: params.tenantId,
      toko_id: params.tokoId,
      pengguna_id: params.penggunaId,
      pelanggan_id: params.customerId,
      nomor_transaksi: nomorTransaksi,
      subtotal,
      total,
      bayar: params.amountPaid,
      kembalian: change,
      metode_pembayaran: params.method,
      diskon_nominal: discount,
      diskon_persen: 0,
    })
    .select("id")
    .single();

  if (insertError || !transaksi) throw insertError;

  const itemsPayload = params.cart.map((item) => ({
    transaksi_id: transaksi.id,
    produk_id: item.product.id,
    qty: item.quantity,
    harga_satuan: item.product.hargaJual,
    diskon_nominal: item.discount,
    diskon_persen: 0,
    subtotal: item.quantity * item.product.hargaJual - item.discount,
  }));

  const { error: itemError } = await client
    .from("item_transaksi_penjualan")
    .insert(itemsPayload);

  if (itemError) {
    await client.from("transaksi_penjualan").delete().eq("id", transaksi.id);
    throw itemError;
  }

  return { nomorTransaksi, total, change };
}
