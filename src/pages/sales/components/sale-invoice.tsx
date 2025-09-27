import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SaleTransaction, SaleItem } from "@/features/sales/types";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { ShoppingCart } from "lucide-react";
import { SaleItemsList } from "./sale-items-list";

interface SaleInvoiceProps {
  sale: SaleTransaction | null;
  saleItems: {
    data: (SaleItem & { produkKode: string | null; kategoriNama: string | null })[] | undefined;
    isLoading: boolean;
  };
}

function getPaymentMethodLabel(method: string | null) {
  switch (method) {
    case "cash":
      return "Tunai";
    case "card":
      return "Kartu";
    case "transfer":
      return "Transfer";
    case "qris":
      return "QRIS";
    default:
      return "Tidak diketahui";
  }
}

export function SaleInvoice({ sale, saleItems }: SaleInvoiceProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white shadow-sm rounded-none">
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {sale ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="bg-white p-6 font-mono text-sm">
                {/* Invoice Header */}
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                  <h1 className="text-xl font-bold mb-2">KASIR PRO</h1>
                  <p className="text-xs">Jl. Contoh No. 123, Kota</p>
                  <p className="text-xs">Telp: (021) 123-4567</p>
                  <div className="mt-3 pt-2 border-t border-gray-300">
                    <p className="font-bold">STRUK PENJUALAN</p>
                  </div>
                </div>

                {/* Transaction Info */}
                <div className="mb-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>No. Transaksi</span>
                    <span className="font-bold">{sale.nomorTransaksi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal</span>
                    <span>{formatDateTime(sale.tanggal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pelanggan</span>
                    <span>{sale.pelangganNama ?? "Umum"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kasir</span>
                    <span>Admin</span>
                  </div>
                </div>

                {/* Items Table */}
                <SaleItemsList items={saleItems.data} isLoading={saleItems.isLoading} />

                {/* Totals */}
                <div className="mt-4 space-y-1 text-xs">
                  <div className="flex justify-between border-b border-gray-300 pb-2">
                    <span>Subtotal</span>
                    <span className="font-bold">{formatCurrency(sale.total).replace('Rp ', '')}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-b-2 border-dashed border-gray-400 pb-2">
                    <span>TOTAL</span>
                    <span>Rp {formatCurrency(sale.total).replace('Rp ', '')}</span>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="mt-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Metode Bayar</span>
                    <span className="font-bold">{getPaymentMethodLabel(sale.metodePembayaran)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bayar</span>
                    <span>{formatCurrency(sale.bayar ?? sale.total).replace('Rp ', '')}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Kembalian</span>
                    <span>{formatCurrency(sale.kembalian ?? 0).replace('Rp ', '')}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-gray-400">
                  <p className="text-xs">Terima kasih atas kunjungan Anda</p>
                  <p className="text-xs">Barang yang sudah dibeli tidak dapat ditukar</p>
                  <p className="text-xs mt-2">== KASIR PRO ==</p>
                </div>

                {/* Transaction ID Footer */}
                <div className="text-center mt-4 pt-2 border-t border-gray-300">
                  <p className="text-xs text-gray-600">ID: {sale.id}</p>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
            <ShoppingCart className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih transaksi untuk melihat invoice</p>
            <p className="text-xs text-slate-500">
              Klik salah satu baris untuk melihat struk penjualan.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}