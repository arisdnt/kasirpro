import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

interface Product {
  id: string;
  nama: string;
  kode: string;
  kategoriNama: string | null;
  brandNama: string | null;
  satuan: string | null;
  hargaJual: number;
  hargaBeli: number | null;
  minimumStock: number | null;
  status: string | null;
  updatedAt: string | null;
}

import type { StockMovement as Movement } from "@/features/inventory/types";

interface ProductStockCardProps {
  product: Product | null;
  currentStock: number | null;
  movements: Movement[];
  isMovementsLoading: boolean;
  userTokoId?: string;
  movementLimit: number;
}

export function ProductStockCard({
  product,
  currentStock,
  movements,
  isMovementsLoading,
  userTokoId,
  movementLimit,
}: ProductStockCardProps) {
  const movementStats = movements.reduce(
    (acc, item) => {
      if (item.type === "IN") {
        acc.masuk += Math.abs(item.qtyChange);
      } else if (item.type === "OUT") {
        acc.keluar += Math.abs(item.qtyChange);
      } else {
        acc.penyesuaian += item.qtyChange;
      }
      return acc;
    },
    { masuk: 0, keluar: 0, penyesuaian: 0 }
  );

  const netMovement = movementStats.masuk - movementStats.keluar + movementStats.penyesuaian;

  const formatSigned = (value: number) => {
    if (value === 0) return "0";
    return value > 0 ? `+${value}` : `-${Math.abs(value)}`;
  };

  const formatOutbound = (value: number) => {
    if (value === 0) return "0";
    return `-${value}`;
  };

  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none" style={{ backgroundColor: 'transparent' }}>
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {product ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                <div className="relative w-full">
                  <div className="absolute right-0 top-0">
                    <Badge variant={product.status === "aktif" ? "outline" : "destructive"} className="rounded-none border border-slate-400 text-[11px] uppercase tracking-wide">
                      {product.status ?? "-"}
                    </Badge>
                  </div>
                <div className="text-center border-b-2 border-dashed border-slate-400 pb-3 mb-4">
                  <h2 className="text-lg font-bold tracking-[0.3em] text-slate-900">KARTU STOK</h2>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Item Movement</p>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>Nama</span>
                    <span className="font-semibold text-slate-900 max-w-[60%] truncate text-right">{product.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kode</span>
                    <span className="font-semibold text-slate-900">{product.kode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kategori</span>
                    <span className="text-slate-900">{product.kategoriNama ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Brand</span>
                    <span className="text-slate-900">{product.brandNama ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satuan</span>
                    <span className="text-slate-900">{product.satuan ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diubah</span>
                    <span>{product.updatedAt ? formatDateTime(product.updatedAt) : "-"}</span>
                  </div>
                </div>

                <div className="mt-4 border-y-2 border-dashed border-slate-400 py-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded border border-slate-200 px-3 py-2 text-center">
                      <div className="text-[10px] uppercase text-slate-500">Stok Saat Ini</div>
                      <div className={cn("text-base font-bold", product.minimumStock != null && currentStock != null && currentStock < product.minimumStock ? "text-red-700" : "text-slate-900")}>{currentStock ?? "-"}</div>
                    </div>
                    <div className="rounded border border-slate-200 px-3 py-2 text-center">
                      <div className="text-[10px] uppercase text-slate-500">Min. Stok</div>
                      <div className="text-base font-semibold text-slate-900">{product.minimumStock ?? "-"}</div>
                    </div>
                    <div className="rounded border border-slate-200 px-3 py-2 text-center">
                      <div className="text-[10px] uppercase text-slate-500">Harga Jual</div>
                      <div className="text-sm font-semibold text-slate-900">{formatCurrency(product.hargaJual)}</div>
                    </div>
                    <div className="rounded border border-slate-200 px-3 py-2 text-center">
                      <div className="text-[10px] uppercase text-slate-500">Harga Beli</div>
                      <div className="text-sm font-semibold text-slate-900">{product.hargaBeli != null ? formatCurrency(product.hargaBeli) : "-"}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded bg-emerald-50/70 px-3 py-2 border border-emerald-200">
                      <div className="text-[10px] uppercase text-emerald-700">Masuk</div>
                      <div className="text-sm font-bold text-emerald-700">{formatSigned(movementStats.masuk)}</div>
                    </div>
                    <div className="rounded bg-rose-50/70 px-3 py-2 border border-rose-200">
                      <div className="text-[10px] uppercase text-rose-700">Keluar</div>
                      <div className="text-sm font-bold text-rose-700">{formatOutbound(movementStats.keluar)}</div>
                    </div>
                    <div className="rounded bg-amber-50/70 px-3 py-2 border border-amber-200">
                      <div className="text-[10px] uppercase text-amber-700">Penyesuaian</div>
                      <div className="text-sm font-bold text-amber-700">{formatSigned(movementStats.penyesuaian)}</div>
                    </div>
                    <div className="rounded bg-slate-100 px-3 py-2 border border-slate-300">
                      <div className="text-[10px] uppercase text-slate-600">Total Mutasi</div>
                      <div className={cn("text-sm font-bold", netMovement === 0 ? "text-slate-700" : netMovement > 0 ? "text-emerald-700" : "text-rose-700")}>{formatSigned(netMovement)}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 text-right">{movements.length} dari {movementLimit} pergerakan terbaru</div>
                </div>

                <div className="mt-4 border-t-2 border-dashed border-slate-400 pt-3">
                  <div className="text-[10px] uppercase text-slate-500 mb-2">Riwayat Mutasi</div>
                  {isMovementsLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-1 rounded bg-slate-100 px-3 py-2">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : movements.length === 0 ? (
                    <div className="text-[11px] text-slate-600">Belum ada pergerakan stok yang tercatat.</div>
                  ) : (
                    <div className="space-y-2">
                      {movements.map((m) => {
                        const qtyLabel = formatSigned(m.qtyChange);
                        return (
                          <div key={m.id} className="rounded border border-slate-200 px-3 py-2">
                            <div className="grid grid-cols-12 items-center gap-1 text-[11px]">
                              <div className="col-span-6 text-slate-900">{formatDateTime(m.date)}</div>
                              <div className="col-span-3 text-center text-slate-700">{m.source}</div>
                              <div className={cn(
                                "col-span-3 text-right font-bold",
                                m.type === "IN" ? "text-emerald-700" : m.type === "OUT" ? "text-rose-700" : "text-amber-700",
                              )}>
                                {qtyLabel}
                              </div>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                              <span>Ref: {m.referenceNo ?? "-"}</span>
                              {m.note ? <span className="text-right">Catatan: {m.note}</span> : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="mt-4 border-t border-slate-300 pt-3 text-[10px] text-slate-500">
                  <div className="flex justify-between">
                    <span>ID Produk</span>
                    <span className="font-mono text-[10px] text-slate-700">{product.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toko</span>
                    <span>{userTokoId ?? "-"}</span>
                  </div>
                  <div className="mt-3 text-center text-[10px]">Saldo akhir • {currentStock ?? "-"}</div>
                </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
            <Package className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih produk untuk melihat detail</p>
            <p className="text-xs text-slate-500">
              Klik salah satu baris produk untuk melihat informasi lengkap.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}