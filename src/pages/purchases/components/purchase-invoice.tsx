import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Package2 } from "lucide-react";
import type { Purchase, PurchaseItem } from "../purchases-types";
import { getStatusColor } from "../purchases-utils";

interface PurchaseInvoiceProps {
  selectedPurchase: Purchase | null;
  purchaseItems: PurchaseItem[] | undefined;
  isLoadingItems: boolean;
}

export function PurchaseInvoice({ selectedPurchase, purchaseItems, isLoadingItems }: PurchaseInvoiceProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white shadow-sm rounded-none">
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {selectedPurchase ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="bg-white p-6 font-mono text-sm">
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                  <h1 className="text-xl font-bold mb-2">KASIR PRO</h1>
                  <p className="text-xs">Jl. Contoh No. 123, Kota</p>
                  <p className="text-xs">Telp: (021) 123-4567</p>
                  <div className="mt-3 pt-2 border-t border-gray-300">
                    <p className="font-bold">BUKTI PEMBELIAN</p>
                  </div>
                </div>

                <div className="mb-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>No. Transaksi</span>
                    <span className="font-bold">{selectedPurchase.nomorTransaksi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal</span>
                    <span>{formatDateTime(selectedPurchase.tanggal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supplier</span>
                    <span>{selectedPurchase.supplierNama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold border",
                      getStatusColor(selectedPurchase.status ?? "")
                    )}>{selectedPurchase.status ?? "-"}</span>
                  </div>
                </div>

                <div className="border-t-2 border-b-2 border-dashed border-gray-400 py-2">
                  <div className="text-xs font-bold mb-2 grid grid-cols-12 gap-1">
                    <div className="col-span-6">ITEM</div>
                    <div className="col-span-2 text-center">QTY</div>
                    <div className="col-span-2 text-right">HARGA</div>
                    <div className="col-span-2 text-right">TOTAL</div>
                  </div>

                  {isLoadingItems ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="grid grid-cols-12 gap-1 text-xs">
                          <div className="col-span-6">
                            <Skeleton className="h-3 w-full" />
                          </div>
                          <div className="col-span-2">
                            <Skeleton className="h-3 w-full" />
                          </div>
                          <div className="col-span-2">
                            <Skeleton className="h-3 w-full" />
                          </div>
                          <div className="col-span-2">
                            <Skeleton className="h-3 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {purchaseItems?.map((item) => (
                        <div key={item.id}>
                          <div className="grid grid-cols-12 gap-1 text-xs">
                            <div className="col-span-6 truncate">
                              {item.produkNama}
                            </div>
                            <div className="col-span-2 text-center">
                              {item.qty}
                            </div>
                            <div className="col-span-2 text-right">
                              {formatCurrency(item.hargaSatuan).replace('Rp ', '')}
                            </div>
                            <div className="col-span-2 text-right">
                              {formatCurrency(item.subtotal).replace('Rp ', '')}
                            </div>
                          </div>
                          {item.produkKode && (
                            <div className="text-xs text-gray-600 ml-0">
                              [{item.produkKode}]
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-1 text-xs">
                  <div className="flex justify-between border-b border-gray-300 pb-2">
                    <span>Subtotal</span>
                    <span className="font-bold">{formatCurrency(selectedPurchase.total).replace('Rp ', '')}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-b-2 border-dashed border-gray-400 pb-2">
                    <span>TOTAL</span>
                    <span>Rp {formatCurrency(selectedPurchase.total).replace('Rp ', '')}</span>
                  </div>
                </div>

                <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-gray-400">
                  <p className="text-xs">Terima kasih</p>
                  <p className="text-xs">Simpan bukti pembelian ini untuk arsip</p>
                  <p className="text-xs mt-2">== KASIR PRO ==</p>
                </div>

                <div className="text-center mt-4 pt-2 border-t border-gray-300">
                  <p className="text-xs text-gray-600">ID: {selectedPurchase.id}</p>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
            <Package2 className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih transaksi untuk melihat bukti pembelian</p>
            <p className="text-xs text-slate-500">
              Klik salah satu baris untuk melihat rincian item dalam bentuk invoice.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}