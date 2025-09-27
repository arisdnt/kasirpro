import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { NotepadText, Package } from "lucide-react";
import type { StockOpnameDetail } from "@/types/stock-opname";
import { numberFormatter, formatDate, statusVariant, statusLabel, getVarianceColor, formatVariance } from "./stock-opname-utils";

interface StockOpnameDetailProps {
  data: StockOpnameDetail | null | undefined;
  isLoading: boolean;
}

export function StockOpnameDetail({ data, isLoading }: StockOpnameDetailProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Detail</span>
          <span className="text-slate-400">•</span>
          <CardTitle className="text-sm">
            {data ? data.nomorOpname : "Pilih Stock Opname"}
          </CardTitle>
        </div>
        {data ? (
          <Badge variant={statusVariant(data.status)} className="rounded-full px-3 py-0.5 text-xs">
            {statusLabel(data.status)}
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-md" />
            <Skeleton className="h-48 w-full rounded-md" />
          </div>
        ) : !data ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <Package className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih sesi stock opname</p>
            <p className="text-xs text-slate-500">Detail akan muncul setelah memilih salah satu catatan di samping.</p>
          </div>
        ) : (
          <>
            <div className="rounded-none border border-slate-200 bg-white p-4 shadow-inner">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-600">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Tanggal</dt>
                  <dd className="font-semibold text-slate-800">{formatDate(data.tanggal)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Penanggung jawab</dt>
                  <dd className="font-semibold text-slate-800">{data.penggunaNama ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Toko</dt>
                  <dd className="font-semibold text-slate-800">{data.tokoNama ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Total Item</dt>
                  <dd className="font-semibold text-slate-800">{data.totalItems}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Selisih (+)</dt>
                  <dd className="font-semibold text-emerald-600">{numberFormatter.format(data.totalSelisihPlus)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Selisih (-)</dt>
                  <dd className="font-semibold text-rose-600">{numberFormatter.format(data.totalSelisihMinus)}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Selisih Bersih</dt>
                  <dd className="text-lg font-semibold text-slate-900">{numberFormatter.format(data.totalSelisihNet)}</dd>
                </div>
              </dl>
              {data.catatan ? (
                <div className="mt-3 rounded-md border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs text-slate-600">
                  {data.catatan}
                </div>
              ) : null}
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <span className="text-sm font-semibold text-slate-800">Rincian Item</span>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none text-xs">
                  {data.items.length} item
                </Badge>
              </div>
              <ScrollArea className="flex-1">
                {data.items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-500">
                    <NotepadText className="h-8 w-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">Belum ada item pada sesi ini</p>
                    <p className="text-xs text-slate-500">Tambahkan item saat melakukan proses stock opname.</p>
                  </div>
                ) : (
                  <Table className="min-w-full text-sm">
                    <TableHeader className="sticky top-0 z-10 bg-white/95">
                      <TableRow className="border-b border-slate-200">
                        <TableHead className="w-[40%] text-slate-500">Produk</TableHead>
                        <TableHead className="w-[20%] text-slate-500">Sistem</TableHead>
                        <TableHead className="w-[20%] text-slate-500">Fisik</TableHead>
                        <TableHead className="w-[20%] text-slate-500">Selisih</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.items.map((item) => (
                        <TableRow key={item.id} className="border-b border-slate-100">
                          <TableCell className="align-top">
                            <p className="text-sm font-medium text-slate-800">{item.produkNama ?? "Produk"}</p>
                            <p className="text-xs text-slate-500">{item.produkKode ?? "-"}</p>
                            {item.keterangan ? (
                              <p className="mt-1 text-xs text-slate-500">{item.keterangan}</p>
                            ) : null}
                          </TableCell>
                          <TableCell className="align-top font-semibold text-slate-700">
                            {numberFormatter.format(item.stockSistem)}
                          </TableCell>
                          <TableCell className="align-top font-semibold text-slate-700">
                            {numberFormatter.format(item.stockFisik)}
                          </TableCell>
                          <TableCell className={cn("align-top font-semibold", getVarianceColor(item.selisih))}>
                            {formatVariance(item.selisih)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}