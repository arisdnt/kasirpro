import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStoresQuery } from "@/features/stores/use-stores";
import {
  useStockOpnameDetail,
  useStockOpnameList,
} from "@/features/stock-opname/use-stock-opname";
import type { StockOpnameSummary } from "@/types/stock-opname";
import { cn } from "@/lib/utils";
import { Filter, FilePlus, NotepadText, Package, RefreshCw, Search } from "lucide-react";

const numberFormatter = new Intl.NumberFormat("id-ID");
const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
});

function formatDate(value: string) {
  try {
    return dateFormatter.format(new Date(value));
  } catch (error) {
    console.error(error);
    return value;
  }
}

function statusVariant(status: string | null) {
  switch (status) {
    case "draft":
      return "secondary" as const;
    case "selesai":
    case "final":
      return "outline" as const;
    case "dibatalkan":
    case "cancelled":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

function statusLabel(status: string | null) {
  if (!status) return "Draft";
  switch (status) {
    case "draft":
      return "Draft";
    case "selesai":
      return "Selesai";
    case "final":
      return "Final";
    case "dibatalkan":
      return "Dibatalkan";
    case "cancelled":
      return "Dibatalkan";
    default:
      return status;
  }
}

function summarize(list: StockOpnameSummary[]) {
  return list.reduce(
    (acc, item) => {
      acc.total += 1;
      acc.items += item.totalItems;
      acc.plus += item.totalSelisihPlus;
      acc.minus += item.totalSelisihMinus;
      return acc;
    },
    { total: 0, items: 0, plus: 0, minus: 0 },
  );
}

export function StockOpnamePage() {
  const stores = useStoresQuery();
  const [storeFilter, setStoreFilter] = useState<string | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const listQuery = useStockOpnameList(storeFilter);
  const detailQuery = useStockOpnameDetail(selectedId);

  useEffect(() => {
    if (!listQuery.data || listQuery.data.length === 0) {
      setSelectedId(null);
      return;
    }
    if (selectedId && listQuery.data.some((item) => item.id === selectedId)) {
      return;
    }
    setSelectedId(listQuery.data[0]?.id ?? null);
  }, [listQuery.data, selectedId]);

  const filteredList = useMemo(() => {
    if (!listQuery.data) return [];
    const query = searchTerm.trim().toLowerCase();
    if (!query) return listQuery.data;
    return listQuery.data.filter((item) =>
      [item.nomorOpname, item.tokoNama ?? "", item.penggunaNama ?? ""].some((text) =>
        text.toLowerCase().includes(query),
      ),
    );
  }, [listQuery.data, searchTerm]);

  const summaryMetrics = useMemo(() => summarize(filteredList), [filteredList]);

  const selectedDetail = detailQuery.data;

  const handleRefresh = () => {
    void listQuery.refetch();
    if (selectedId) {
      void detailQuery.refetch();
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2 text-slate-900">
      <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
        <CardContent className="flex flex-col gap-3 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex min-w-[260px] flex-1 flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Cari nomor atau penanggung jawab"
                  className="h-10 rounded-none border-slate-200 pl-9 text-sm shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={storeFilter}
                  onChange={(event) => setStoreFilter(event.target.value)}
                  className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua Toko</option>
                  {stores.data?.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <div className="flex flex-wrap gap-3 text-xs text-slate-700">
                <span>Total Opname: <strong>{summaryMetrics.total}</strong></span>
                <span>Total Item: <strong>{summaryMetrics.items}</strong></span>
                <span>Selisih +: <strong>{numberFormatter.format(summaryMetrics.plus)}</strong></span>
                <span>Selisih -: <strong>{numberFormatter.format(summaryMetrics.minus)}</strong></span>
              </div>
              <Button variant="outline" onClick={handleRefresh} className="gap-2 rounded-none">
                <RefreshCw className="h-4 w-4" />
                Muat ulang
              </Button>
              <Button className="gap-2 rounded-none" disabled title="Segera hadir">
                <FilePlus className="h-4 w-4" />
                Stock Opname Baru
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Riwayat Opname</span>
              <span className="text-slate-400">•</span>
              <CardTitle className="text-sm">Daftar Stock Opname</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredList.length} catatan
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {listQuery.isLoading ? (
                <div className="space-y-2 p-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 w-full rounded-md" />
                  ))}
                </div>
              ) : filteredList.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-500">
                  <NotepadText className="h-10 w-10 text-slate-300" />
                  <p className="text-sm font-medium text-slate-600">Belum ada aktivitas stock opname</p>
                  <p className="text-xs text-slate-500">
                    Mulai sesi stock opname untuk memantau perbedaan stok fisik dan sistem.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {filteredList.map((item) => {
                    const isActive = item.id === selectedId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        className={cn(
                          "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition",
                          isActive ? "border-indigo-300 bg-indigo-50/80" : "hover:border-indigo-200 hover:bg-indigo-50/40",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className={cn("text-sm font-semibold", isActive ? "text-indigo-700" : "text-slate-800")}>{item.nomorOpname}</p>
                            <p className="text-xs text-slate-500">
                              {formatDate(item.tanggal)} • {item.tokoNama ?? "-"}
                            </p>
                          </div>
                          <Badge variant={statusVariant(item.status)} className="rounded-full px-3 py-0.5 text-xs">
                            {statusLabel(item.status)}
                          </Badge>
                        </div>
                        {item.catatan ? (
                          <p className="mt-2 line-clamp-2 text-xs text-slate-500">{item.catatan}</p>
                        ) : null}
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                          <span>{item.totalItems} item</span>
                          <span>Selisih: {numberFormatter.format(item.totalSelisihNet)}</span>
                          <span>+</span>
                          <span className="text-emerald-600">{numberFormatter.format(item.totalSelisihPlus)}</span>
                          <span>-</span>
                          <span className="text-rose-600">{numberFormatter.format(item.totalSelisihMinus)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex w-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm lg:w-[420px] rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Detail</span>
              <span className="text-slate-400">•</span>
              <CardTitle className="text-sm">
                {selectedDetail ? selectedDetail.nomorOpname : "Pilih Stock Opname"}
              </CardTitle>
            </div>
            {selectedDetail ? (
              <Badge variant={statusVariant(selectedDetail.status)} className="rounded-full px-3 py-0.5 text-xs">
                {statusLabel(selectedDetail.status)}
              </Badge>
            ) : null}
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            {detailQuery.isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-48 w-full rounded-md" />
              </div>
            ) : !selectedDetail ? (
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
                      <dd className="font-semibold text-slate-800">{formatDate(selectedDetail.tanggal)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Penanggung jawab</dt>
                      <dd className="font-semibold text-slate-800">{selectedDetail.penggunaNama ?? "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Toko</dt>
                      <dd className="font-semibold text-slate-800">{selectedDetail.tokoNama ?? "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Total Item</dt>
                      <dd className="font-semibold text-slate-800">{selectedDetail.totalItems}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Selisih (+)</dt>
                      <dd className="font-semibold text-emerald-600">{numberFormatter.format(selectedDetail.totalSelisihPlus)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Selisih (-)</dt>
                      <dd className="font-semibold text-rose-600">{numberFormatter.format(selectedDetail.totalSelisihMinus)}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Selisih Bersih</dt>
                      <dd className="text-lg font-semibold text-slate-900">{numberFormatter.format(selectedDetail.totalSelisihNet)}</dd>
                    </div>
                  </dl>
                  {selectedDetail.catatan ? (
                    <div className="mt-3 rounded-md border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs text-slate-600">
                      {selectedDetail.catatan}
                    </div>
                  ) : null}
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-800">Rincian Item</span>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none text-xs">
                      {selectedDetail.items.length} item
                    </Badge>
                  </div>
                  <ScrollArea className="flex-1">
                    {selectedDetail.items.length === 0 ? (
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
                          {selectedDetail.items.map((item) => (
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
                              <TableCell className={cn(
                                "align-top font-semibold",
                                item.selisih === 0
                                  ? "text-slate-600"
                                  : item.selisih > 0
                                    ? "text-emerald-600"
                                    : "text-rose-600",
                              )}>
                                {item.selisih > 0 ? `+${numberFormatter.format(item.selisih)}` : numberFormatter.format(item.selisih)}
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
      </div>
    </div>
  );
}
