import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { NotepadText, Package } from "lucide-react";
import type { StockOpnameDetail } from "@/features/stock-opname/types";
import { numberFormatter, formatDate, statusVariant, statusLabel, getVarianceColor, formatVariance } from "./stock-opname-utils";

interface StockOpnameDetailProps {
  opname: StockOpnameDetail | null | undefined;
  isLoading: boolean;
}

export function StockOpnameDetail({ opname, isLoading }: StockOpnameDetailProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none" style={{ backgroundColor: 'transparent' }}>
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {isLoading ? (
          <div className="space-y-4 p-6">
            <Skeleton className="h-20 w-full rounded-md" />
            <Skeleton className="h-48 w-full rounded-md" />
          </div>
        ) : !opname ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
            <Package className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih sesi stock opname</p>
            <p className="text-xs text-slate-500">Detail akan muncul setelah memilih salah satu catatan di samping.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                {/* Opname Header */}
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                  <h1 className="text-xl font-bold mb-2">KASIR PRO</h1>
                  <p className="text-xs">Laporan Stock Opname</p>
                  <div className="mt-3 pt-2 border-t border-gray-300">
                    <p className="font-bold">DETAIL STOCK OPNAME</p>
                  </div>
                </div>

                {/* Opname Info */}
                <div className="mb-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Nomor Opname</span>
                    <span className="font-bold">{opname.nomorOpname}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal</span>
                    <span className="font-bold">{formatDate(opname.tanggal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span>
                      <Badge variant={statusVariant(opname.status)} className="text-xs rounded">
                        {statusLabel(opname.status)}
                      </Badge>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Penanggung Jawab</span>
                    <span className="font-bold">{opname.penggunaNama ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toko</span>
                    <span className="font-bold">{opname.tokoNama ?? "-"}</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Ringkasan:</h4>
                  <div className="bg-gray-50 p-3 rounded border space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs font-semibold">Total Item:</span>
                        <p className="text-sm text-slate-700 font-bold">{opname.totalItems}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold">Selisih Bersih:</span>
                        <p className="text-sm text-slate-700 font-bold">{numberFormatter.format(opname.totalSelisihNet)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs font-semibold">Selisih (+):</span>
                        <p className="text-sm text-emerald-600 font-bold">{numberFormatter.format(opname.totalSelisihPlus)}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold">Selisih (-):</span>
                        <p className="text-sm text-red-600 font-bold">{numberFormatter.format(opname.totalSelisihMinus)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {opname.catatan && (
                  <div className="mt-4 border-t border-gray-300 pt-4">
                    <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Catatan:</h4>
                    <div className="bg-gray-50 p-3 rounded border">
                      <p className="text-xs text-slate-700">{opname.catatan}</p>
                    </div>
                  </div>
                )}

                {/* Items Detail */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Rincian Item ({opname.items.length}):</h4>
                  {opname.items.length === 0 ? (
                    <div className="bg-gray-50 p-4 rounded border text-center">
                      <p className="text-xs text-slate-500">Belum ada item pada sesi ini</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded border">
                      <div className="space-y-2">
                        {opname.items.map((item, index) => (
                          <div key={item.id} className="flex justify-between items-start text-xs border-b border-gray-200 pb-2 last:border-b-0">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-800">{item.produkNama ?? "Produk"}</p>
                              <p className="text-slate-500">{item.produkKode ?? "-"}</p>
                              {item.keterangan && (
                                <p className="text-slate-500 mt-1">{item.keterangan}</p>
                              )}
                            </div>
                            <div className="text-right min-w-0 ml-2">
                              <div className="flex gap-2 text-xs">
                                <span>Sis: {numberFormatter.format(item.stockSistem)}</span>
                                <span>Fis: {numberFormatter.format(item.stockFisik)}</span>
                              </div>
                              <div className={cn("font-bold text-xs mt-1", getVarianceColor(item.selisih))}>
                                {formatVariance(item.selisih)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-400 text-center">
                  <p className="text-xs text-gray-500">Sistem Stock Opname KasirPro</p>
                  <p className="text-xs text-gray-500">Laporan terverifikasi</p>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}