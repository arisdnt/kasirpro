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
import { useProductsQuery } from "@/features/produk/use-products";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Filter, Package, Plus, RefreshCw, Search } from "lucide-react";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { fetchProductStocks } from "@/features/produk/api/stocks";
import { useProductMovements } from "@/features/produk/queries/use-product-movements";

type StatusFilter = "all" | "aktif" | "nonaktif";

export function ProdukPage() {
  const products = useProductsQuery();
  const { state: { user } } = useSupabaseAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stocks, setStocks] = useState<Record<string, number>>({});

  const stats = useMemo(() => {
    const data = products.data ?? [];
    const total = data.length;
    const aktif = data.filter((item) => item.status === "aktif").length;
    const nonaktif = total - aktif;
    return { total, aktif, nonaktif };
  }, [products.data]);

  const filteredProducts = useMemo(() => {
    const data = products.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nama.toLowerCase().includes(query) ||
          item.kode.toLowerCase().includes(query) ||
          (item.kategoriNama ?? "").toLowerCase().includes(query) ||
          (item.brandNama ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [products.data, searchTerm, statusFilter]);

  const selectedProduct = useMemo(() => {
    if (!selectedId) return null;
    return filteredProducts.find((item) => item.id === selectedId) ?? null;
  }, [filteredProducts, selectedId]);

  const MOVEMENT_LIMIT = 30;
  const movements = useProductMovements(selectedProduct?.id ?? null, MOVEMENT_LIMIT);

  const currentStock = useMemo(() => {
    if (!selectedProduct) return null;
    if (!user?.tokoId) return null;
    return stocks[selectedProduct.id] ?? 0;
  }, [selectedProduct, stocks, user?.tokoId]);

  const movementList = movements.data ?? [];

  const movementStats = useMemo(() => {
    const list = movementList;
    return list.reduce(
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
      { masuk: 0, keluar: 0, penyesuaian: 0 },
    );
  }, [movementList]);

  const netMovement = movementStats.masuk - movementStats.keluar + movementStats.penyesuaian;

  const formatSigned = (value: number) => {
    if (value === 0) return "0";
    return value > 0 ? `+${value}` : `-${Math.abs(value)}`;
  };

  const formatOutbound = (value: number) => {
    if (value === 0) return "0";
    return `-${value}`;
  };

  const handleRefresh = () => {
    products.refetch();
  };

  // Load stocks for current store when product list changes
  useEffect(() => {
    const load = async () => {
      if (!user?.tenantId || !user.tokoId) return;
      const ids = (products.data ?? []).map(p => p.id);
      if (ids.length === 0) {
        setStocks({});
        return;
      }
      try {
        const map = await fetchProductStocks(user.tenantId, user.tokoId, ids);
        setStocks(map);
      } catch {
        setStocks({});
      }
    };
    void load();
  }, [user?.tenantId, user?.tokoId, products.data]);

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
                  placeholder="Cari nama produk, kode, kategori, atau brand"
                  className="h-10 rounded-none border-slate-200 pl-9 text-sm text-black shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                  className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua status</option>
                  <option value="aktif">Produk aktif</option>
                  <option value="nonaktif">Produk nonaktif</option>
                </select>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <div className="flex gap-3 text-xs text-black">
                <span>Total: <strong>{stats.total}</strong></span>
                <span>Aktif: <strong>{stats.aktif}</strong></span>
                <span>Nonaktif: <strong>{stats.nonaktif}</strong></span>
              </div>
              <Button
                onClick={handleRefresh}
                className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70"
                disabled={products.isFetching}
              >
                <RefreshCw className={cn("h-4 w-4", products.isFetching && "animate-spin")} />
                Refresh data
              </Button>
              <Button className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]" disabled>
                <Plus className="h-4 w-4" />
                Produk baru
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Katalog Produk</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">Daftar Produk</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredProducts.length} produk
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {products.isLoading ? (
                <div className="flex flex-col gap-2 p-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <Package className="h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-700">Belum ada produk yang cocok</p>
                  <p className="text-xs text-slate-500">
                    Sesuaikan pencarian atau tambahkan produk baru untuk memulai.
                  </p>
                </div>
              ) : (
                <Table className="min-w-full text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-white/95">
                    <TableRow className="border-b border-slate-200">
                      <TableHead className="w-[15%] text-slate-500">Kode</TableHead>
                      <TableHead className="w-[25%] text-slate-500">Nama</TableHead>
                      <TableHead className="w-[20%] text-slate-500">Kategori</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Brand</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Harga</TableHead>
                      <TableHead className="w-[10%] text-slate-500">Stok</TableHead>
                      <TableHead className="w-[10%] text-slate-500">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((item) => (
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
                            {item.kode}
                          </span>
                        </TableCell>
                        <TableCell className="align-top">
                          <span className={cn(
                            "text-sm",
                            item.id === selectedId ? "text-slate-900" : "text-slate-900"
                          )}>
                            {item.nama}
                          </span>
                        </TableCell>
                        <TableCell className="align-top">
                          <span className={cn(
                            "text-sm",
                            item.id === selectedId ? "text-black" : "text-slate-900"
                          )}>
                            {item.kategoriNama ?? "-"}
                          </span>
                        </TableCell>
                        <TableCell className="align-top">
                          <span className={cn(
                            "text-sm",
                            item.id === selectedId ? "text-gray-700" : "text-slate-600"
                          )}>
                            {item.brandNama ?? "-"}
                          </span>
                        </TableCell>
                        <TableCell className={cn(
                          "align-top font-semibold",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {formatCurrency(item.hargaJual)}
                        </TableCell>
                        <TableCell className="align-top">
                          <span className={cn(
                            "text-sm",
                            item.id === selectedId ? "text-black" : "text-slate-700"
                          )}>
                            {user?.tokoId ? (stocks[item.id] ?? 0) : "-"}
                          </span>
                        </TableCell>
                        <TableCell className="align-top">
                          <Badge
                            variant={item.status === "aktif" ? "outline" : "destructive"}
                            className="text-xs rounded-none"
                          >
                            {item.status ?? "-"}
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

        <Card className="flex w-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm lg:w-[400px] rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Produk</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">
                {selectedProduct ? selectedProduct.nama : "Pilih produk"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
            {selectedProduct ? (
              <ScrollArea className="h-full">
                <div className="flex justify-center bg-slate-50 px-4 py-6">
                  <div className="relative w-full max-w-md rounded-sm border border-slate-300 bg-white shadow-[0_12px_28px_-18px_rgba(15,23,42,0.35)]">
                    <div className="absolute right-5 top-5">
                      <Badge variant={selectedProduct.status === "aktif" ? "outline" : "destructive"} className="rounded-none border border-slate-400 text-[11px] uppercase tracking-wide">
                        {selectedProduct.status ?? "-"}
                      </Badge>
                    </div>
                    <div className="p-6 font-mono text-xs text-slate-800">
                      <div className="text-center border-b-2 border-dashed border-slate-400 pb-3 mb-4">
                        <h2 className="text-lg font-bold tracking-[0.3em] text-slate-900">KARTU STOK</h2>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Item Movement</p>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span>Nama</span>
                          <span className="font-semibold text-slate-900 max-w-[60%] truncate text-right">{selectedProduct.nama}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kode</span>
                          <span className="font-semibold text-slate-900">{selectedProduct.kode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kategori</span>
                          <span className="text-slate-900">{selectedProduct.kategoriNama ?? "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Brand</span>
                          <span className="text-slate-900">{selectedProduct.brandNama ?? "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Satuan</span>
                          <span className="text-slate-900">{selectedProduct.satuan ?? "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Diubah</span>
                          <span>{selectedProduct.updatedAt ? formatDateTime(selectedProduct.updatedAt) : "-"}</span>
                        </div>
                      </div>

                      <div className="mt-4 border-y-2 border-dashed border-slate-400 py-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded border border-slate-200 px-3 py-2 text-center">
                            <div className="text-[10px] uppercase text-slate-500">Stok Saat Ini</div>
                            <div className={cn("text-base font-bold", selectedProduct.minimumStock != null && currentStock != null && currentStock < selectedProduct.minimumStock ? "text-red-700" : "text-slate-900")}>{currentStock ?? "-"}</div>
                          </div>
                          <div className="rounded border border-slate-200 px-3 py-2 text-center">
                            <div className="text-[10px] uppercase text-slate-500">Min. Stok</div>
                            <div className="text-base font-semibold text-slate-900">{selectedProduct.minimumStock ?? "-"}</div>
                          </div>
                          <div className="rounded border border-slate-200 px-3 py-2 text-center">
                            <div className="text-[10px] uppercase text-slate-500">Harga Jual</div>
                            <div className="text-sm font-semibold text-slate-900">{formatCurrency(selectedProduct.hargaJual)}</div>
                          </div>
                          <div className="rounded border border-slate-200 px-3 py-2 text-center">
                            <div className="text-[10px] uppercase text-slate-500">Harga Beli</div>
                            <div className="text-sm font-semibold text-slate-900">{selectedProduct.hargaBeli != null ? formatCurrency(selectedProduct.hargaBeli) : "-"}</div>
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
                        <div className="text-[10px] text-slate-500 text-right">{movementList.length} dari {MOVEMENT_LIMIT} pergerakan terbaru</div>
                      </div>

                      <div className="mt-4 border-t-2 border-dashed border-slate-400 pt-3">
                        <div className="text-[10px] uppercase text-slate-500 mb-2">Riwayat Mutasi</div>
                        {movements.isLoading ? (
                          <div className="space-y-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div key={i} className="flex flex-col gap-1 rounded bg-slate-100 px-3 py-2">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-1/2" />
                              </div>
                            ))}
                          </div>
                        ) : movementList.length === 0 ? (
                          <div className="text-[11px] text-slate-600">Belum ada pergerakan stok yang tercatat.</div>
                        ) : (
                          <div className="space-y-2">
                            {movementList.map((m) => {
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
                          <span className="font-mono text-[10px] text-slate-700">{selectedProduct.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Toko</span>
                          <span>{user?.tokoId ?? "-"}</span>
                        </div>
                        <div className="mt-3 text-center text-[10px]">Saldo akhir • {currentStock ?? "-"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
                <Package className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih produk untuk melihat detail</p>
                <p className="text-xs text-slate-500">
                  Klik salah satu baris produk untuk melihat informasi lengkap.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
