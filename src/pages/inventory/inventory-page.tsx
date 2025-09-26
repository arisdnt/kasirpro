import { useState, useMemo } from "react";
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
import { useInventoryQuery, useBatchInfoQuery } from "@/features/inventory/use-inventory";
import { cn } from "@/lib/utils";
import { Filter, Package, Plus, RefreshCw, Search } from "lucide-react";

type StockFilter = "all" | "positive" | "negative" | "zero";

export function InventoryPage() {
  const inventory = useInventoryQuery();
  const batches = useBatchInfoQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const data = inventory.data ?? [];
    const total = data.length;
    const positive = data.filter((item) => item.selisih > 0).length;
    const negative = data.filter((item) => item.selisih < 0).length;
    const zero = data.filter((item) => item.selisih === 0).length;
    return { total, positive, negative, zero };
  }, [inventory.data]);

  const filteredInventory = useMemo(() => {
    const data = inventory.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.produkNama.toLowerCase().includes(query);
        const matchesStock =
          stockFilter === "all" ||
          (stockFilter === "positive" && item.selisih > 0) ||
          (stockFilter === "negative" && item.selisih < 0) ||
          (stockFilter === "zero" && item.selisih === 0);
        return matchesSearch && matchesStock;
      })
      .sort((a, b) => a.produkNama.localeCompare(b.produkNama));
  }, [inventory.data, searchTerm, stockFilter]);

  const selectedInventoryItem = useMemo(() => {
    if (!selectedId) return null;
    return filteredInventory.find((item) => item.id === selectedId) ?? null;
  }, [filteredInventory, selectedId]);

  const selectedBatches = useMemo(() => {
    if (!selectedInventoryItem) return [];
    return batches.data?.filter((batch) => batch.produkId === selectedInventoryItem.produkId) ?? [];
  }, [batches.data, selectedInventoryItem]);

  const handleRefresh = () => {
    inventory.refetch();
    batches.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
        <CardContent className="flex flex-col gap-3 py-4 text-black">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex min-w-[260px] flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Cari nama produk inventori"
                  className="h-10 rounded-none border-slate-200 pl-9 text-sm text-black shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={stockFilter}
                  onChange={(event) => setStockFilter(event.target.value as StockFilter)}
                  className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua selisih</option>
                  <option value="positive">Selisih positif</option>
                  <option value="negative">Selisih negatif</option>
                  <option value="zero">Selisih nol</option>
                </select>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <div className="flex gap-3 text-xs text-black">
                <span>Total: <strong>{stats.total}</strong></span>
                <span>Positif: <strong>{stats.positive}</strong></span>
                <span>Negatif: <strong>{stats.negative}</strong></span>
                <span>Nol: <strong>{stats.zero}</strong></span>
              </div>
              <Button variant="outline" onClick={handleRefresh} className="gap-2 text-white rounded-none">
                <RefreshCw className="h-4 w-4" />
                Refresh data
              </Button>
              <Button className="gap-2 text-white rounded-none">
                <Plus className="h-4 w-4" />
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
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Inventori Stok</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">Ringkasan Stok</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredInventory.length} item
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {inventory.isLoading ? (
                <div className="flex flex-col gap-2 p-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              ) : filteredInventory.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <Package className="h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-700">Belum ada data inventori yang cocok</p>
                  <p className="text-xs text-slate-500">
                    Sesuaikan pencarian atau lakukan stock opname untuk memulai.
                  </p>
                </div>
              ) : (
                <Table className="min-w-full text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-white/95">
                    <TableRow className="border-b border-slate-200">
                      <TableHead className="w-[35%] text-slate-500">Produk</TableHead>
                      <TableHead className="w-[20%] text-slate-500">Stok Sistem</TableHead>
                      <TableHead className="w-[20%] text-slate-500">Stok Fisik</TableHead>
                      <TableHead className="w-[25%] text-slate-500">Selisih</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        data-state={item.id === selectedId ? "selected" : undefined}
                        className={cn(
                          "cursor-pointer border-b border-slate-100 transition",
                          item.id === selectedId ? "!bg-gray-100 text-black" : "hover:bg-slate-50"
                        )}
                      >
                        <TableCell className="align-top">
                          <span className={cn(
                            "font-medium",
                            item.id === selectedId ? "text-black" : "text-slate-900"
                          )}>
                            {item.produkNama}
                          </span>
                        </TableCell>
                        <TableCell className={cn(
                          "align-top font-semibold",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.stockSistem}
                        </TableCell>
                        <TableCell className={cn(
                          "align-top font-semibold",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.stockFisik}
                        </TableCell>
                        <TableCell className="align-top">
                          <Badge
                            variant={item.selisih === 0 ? "secondary" : item.selisih > 0 ? "outline" : "destructive"}
                            className="text-xs rounded-none"
                          >
                            {item.selisih > 0 ? `+${item.selisih}` : item.selisih}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex w-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm lg:w-[360px] rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Inventori</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">
                {selectedInventoryItem ? selectedInventoryItem.produkNama : "Pilih item"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            {selectedInventoryItem ? (
              <>
                <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-600">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Stok Sistem</dt>
                      <dd className="font-bold text-lg text-slate-900">{selectedInventoryItem.stockSistem}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Stok Fisik</dt>
                      <dd className="font-bold text-lg text-slate-900">{selectedInventoryItem.stockFisik}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Selisih</dt>
                      <dd className={cn(
                        "font-bold text-2xl",
                        selectedInventoryItem.selisih === 0
                          ? "text-slate-600"
                          : selectedInventoryItem.selisih > 0
                            ? "text-emerald-600"
                            : "text-red-600"
                      )}>
                        {selectedInventoryItem.selisih > 0 ? `+${selectedInventoryItem.selisih}` : selectedInventoryItem.selisih}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-800">
                      Batch & Kedaluwarsa
                    </span>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none text-xs">
                      {selectedBatches.length} batch
                    </Badge>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-4">
                      {batches.isLoading ? (
                        <div className="space-y-3">
                          {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="h-16 w-full rounded-md" />
                          ))}
                        </div>
                      ) : selectedBatches.length === 0 ? (
                        <div className="text-center text-slate-500 py-6">
                          <Package className="h-6 w-6 mx-auto text-slate-300 mb-2" />
                          <p className="text-sm">Tidak ada batch tersedia</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedBatches.map((batch) => (
                            <div
                              key={batch.id}
                              className="rounded-none border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm"
                            >
                              <p className="font-medium leading-none text-slate-900">
                                Batch {batch.batchNumber ?? "-"}
                              </p>
                              <p className="text-xs text-slate-600 mt-1">
                                Kedaluwarsa: {batch.tanggalExpired
                                  ? new Date(batch.tanggalExpired).toLocaleDateString("id-ID")
                                  : "-"}
                              </p>
                              <p className="text-xs text-slate-600">
                                Stok: {batch.stockFisik ?? 0}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
                <Package className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih item untuk melihat detail</p>
                <p className="text-xs text-slate-500">
                  Klik salah satu baris inventori untuk melihat informasi lengkap.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
