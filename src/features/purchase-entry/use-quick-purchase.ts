import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { getSupabaseClient } from "@/lib/supabase-client";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";

export type QuickPurchaseItem = {
  productId: string;
  qty: number;
  harga: number;
};

export type QuickPurchasePayload = {
  items: QuickPurchaseItem[];
  supplierMode: "registered" | "external";
  supplierId: string | null;
  externalSupplierName: string | null;
  status: "draft" | "diterima";
};

export type QuickPurchaseResult = {
  transaksiId: string;
  nomorTransaksi: string;
  supplierId: string;
};

function generateSupplierCode(name: string) {
  const sanitized = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
  const suffix = nanoid(4).toUpperCase();
  return `SUP-${sanitized || "GEN"}-${suffix}`;
}

export function useQuickPurchaseMutation() {
  const {
    state: { user },
  } = useSupabaseAuth();
  const queryClient = useQueryClient();

  return useMutation<QuickPurchaseResult, Error, QuickPurchasePayload>({
    mutationFn: async (payload) => {
      if (!user) {
        throw new Error("Pengguna tidak ditemukan. Silakan masuk kembali.");
      }

      if (!user.tenantId) {
        throw new Error("Tenant tidak valid.");
      }

      if (!user.tokoId) {
        throw new Error("Pilih toko aktif sebelum membuat pembelian.");
      }

      if (payload.items.length === 0) {
        throw new Error("Tambahkan produk terlebih dahulu sebelum menyimpan pembelian.");
      }

      if (payload.supplierMode === "registered" && !payload.supplierId) {
        throw new Error("Pilih supplier terdaftar sebelum melanjutkan.");
      }

      if (payload.supplierMode === "external" && !payload.externalSupplierName?.trim()) {
        throw new Error("Masukkan nama supplier eksternal.");
      }

      const client = getSupabaseClient();

      let supplierId = payload.supplierId ?? null;

      if (!supplierId && payload.supplierMode === "external") {
        const name = payload.externalSupplierName!.trim();
        const kode = generateSupplierCode(name);
        const { data: insertedSupplier, error: supplierError } = await client
          .from("supplier")
          .insert({
            tenant_id: user.tenantId,
            toko_id: user.tokoId,
            nama: name,
            kode,
            status: "aktif",
          } as unknown as never)
          .select("id")
          .single();
        if (supplierError || !insertedSupplier) {
          throw supplierError ?? new Error("Gagal membuat supplier baru.");
        }
        supplierId = (insertedSupplier as unknown as { id: string }).id;
      }

      if (!supplierId) {
        throw new Error("Supplier tidak valid.");
      }

      const subtotal = payload.items.reduce((sum, item) => sum + item.qty * item.harga, 0);
      const now = new Date();

      const { data: numberData, error: numberError } = await client.rpc(
        "generate_transaction_number",
        {
          p_prefix: "PO",
          p_tenant_id: user.tenantId,
          p_toko_id: user.tokoId,
          p_date: now.toISOString(),
        } as unknown as undefined,
      );
      if (numberError) {
        throw numberError;
      }
      const nomorTransaksi = (numberData as string) ?? `PO-${now.getTime()}`;

      const status = payload.status;

      const { data: insertedPurchase, error: insertError } = await client
        .from("transaksi_pembelian")
        .insert({
          tenant_id: user.tenantId,
          toko_id: user.tokoId,
          pengguna_id: user.id,
          supplier_id: supplierId,
          nomor_transaksi: nomorTransaksi,
          tanggal: now.toISOString(),
          subtotal,
          total: subtotal,
          diskon_nominal: 0,
          diskon_persen: 0,
          pajak_nominal: 0,
          pajak_persen: 0,
          biaya_tambahan: 0,
          status,
          status_pembayaran: null,
          metadata: {
            source: "quick_entry",
          },
        } as unknown as never)
        .select("id")
        .single();

      if (insertError || !insertedPurchase) {
        throw insertError ?? new Error("Gagal membuat transaksi pembelian.");
      }

      const transaksiId = (insertedPurchase as unknown as { id: string }).id;

      const itemsPayload = payload.items.map((item) => ({
        transaksi_id: transaksiId,
        produk_id: item.productId,
        qty: item.qty,
        harga_satuan: item.harga,
        diskon_nominal: 0,
        diskon_persen: 0,
        subtotal: item.qty * item.harga,
      }));

      const { error: itemsError } = await client
        .from("item_transaksi_pembelian")
        .insert(itemsPayload as unknown as never);

      if (itemsError) {
        await client.from("transaksi_pembelian").delete().eq("id", transaksiId);
        throw itemsError;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["purchases"] }),
        queryClient.invalidateQueries({ queryKey: ["purchase-products"] }),
        queryClient.invalidateQueries({ queryKey: ["inventory-items"] }),
        queryClient.invalidateQueries({ queryKey: ["suppliers"] }),
      ]);

      return { transaksiId, nomorTransaksi, supplierId } satisfies QuickPurchaseResult;
    },
  });
}
