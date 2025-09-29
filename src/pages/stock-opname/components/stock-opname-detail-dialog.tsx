import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { StockOpnameSummary } from "@/features/stock-opname/types";
import { Badge } from "@/components/ui/badge";
import { useStockOpnameDetail } from "@/features/stock-opname/use-stock-opname";
import { formatDate, statusLabel, statusVariant, numberFormatter } from "../stock-opname-utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: StockOpnameSummary | null;
};

export default function StockOpnameDetailDialog({ open, onOpenChange, data }: Props) {
  const detailQuery = useStockOpnameDetail(data?.id ?? null);
  const detail = detailQuery.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-white rounded-none border border-slate-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-800 font-semibold">Detail Stock Opname</DialogTitle>
        </DialogHeader>
        {!data ? (
          <p className="text-sm text-slate-600">Memuat...</p>
        ) : (
          <div className="space-y-4">
            {/* Header Info - Compact 2 Rows */}
            <div className="bg-slate-50 p-3 rounded-none border border-slate-200">
              {/* Baris 1 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Nomor</div>
                    <div className="font-semibold text-slate-800">{data.nomorOpname}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Tanggal</div>
                    <div className="font-medium text-slate-700">{formatDate(data.tanggal)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Toko</div>
                    <div className="font-medium text-slate-700">{data.tokoNama ?? '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">PJ</div>
                    <div className="font-medium text-slate-700">{data.penggunaNama ?? '-'}</div>
                  </div>
                </div>
                <Badge variant={statusVariant(data.status)} className="rounded-none">
                  {statusLabel(data.status)}
                </Badge>
              </div>

              {/* Baris 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Items</div>
                    <div className="font-semibold text-slate-800">{data.totalItems}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Plus</div>
                    <div className="font-semibold text-emerald-600">{numberFormatter.format(data.totalSelisihPlus)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Minus</div>
                    <div className="font-semibold text-red-600">{numberFormatter.format(data.totalSelisihMinus)}</div>
                  </div>
                  {data.catatan && (
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Catatan</div>
                      <div className="text-slate-700 text-sm max-w-xs truncate" title={data.catatan}>{data.catatan}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Detail Items */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-800">Detail Item yang Dikoreksi</h3>
              {detailQuery.isLoading ? (
                <p className="text-sm text-slate-600">Memuat detail items...</p>
              ) : !detail?.items || detail.items.length === 0 ? (
                <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-none border border-slate-200 text-center">
                  Belum ada item yang dikoreksi
                </p>
              ) : (
                <div className="border border-slate-300 rounded-none bg-white">
                  <ScrollArea className="h-96">
                    <Table className="min-w-full text-sm">
                      <TableHeader className="bg-slate-100">
                        <TableRow>
                          <TableHead className="w-[30%] text-slate-600 font-medium">Produk</TableHead>
                          <TableHead className="w-[15%] text-slate-600 font-medium text-right">Stok Sistem</TableHead>
                          <TableHead className="w-[15%] text-slate-600 font-medium text-right">Stok Fisik</TableHead>
                          <TableHead className="w-[15%] text-slate-600 font-medium text-right">Selisih</TableHead>
                          <TableHead className="w-[25%] text-slate-600 font-medium">Keterangan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detail.items.map((item) => (
                          <TableRow key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <TableCell className="py-3">
                              <div className="font-medium text-slate-800">{item.produkNama}</div>
                              <div className="text-xs text-slate-500">{item.produkKode ?? "-"}</div>
                            </TableCell>
                            <TableCell className="py-3 text-right font-semibold text-blue-600">
                              {numberFormatter.format(item.stockSistem)}
                            </TableCell>
                            <TableCell className="py-3 text-right font-semibold text-purple-600">
                              {numberFormatter.format(item.stockFisik)}
                            </TableCell>
                            <TableCell className="py-3 text-right font-semibold">
                              <span className={item.selisih > 0 ? "text-emerald-600" : item.selisih < 0 ? "text-red-600" : "text-slate-600"}>
                                {item.selisih > 0 ? "+" : ""}{numberFormatter.format(item.selisih)}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 text-slate-600 text-xs">
                              {item.keterangan ?? "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

