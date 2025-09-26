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
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Filter, Package, Plus, RefreshCw, Search } from "lucide-react";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { fetchProductStocks } from "@/features/produk/api/stocks";

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
                            {item.nama}
                          </span>
                        </TableCell>
                        <TableCell className="align-top">
                          <span className={cn(
                            "text-sm",
                            item.id === selectedId ? "text-gray-700" : "text-slate-600"
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

        <Card className="flex w-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm lg:w-[360px] rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Produk</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">
                {selectedProduct ? selectedProduct.nama : "Pilih produk"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            {selectedProduct ? (
              <>
                <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-600">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Kode</dt>
                      <dd className="font-medium text-slate-900">{selectedProduct.kode}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
                      <dd className="font-medium text-slate-900">{selectedProduct.status ?? "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Kategori</dt>
                      <dd className="font-medium text-slate-900">{selectedProduct.kategoriNama ?? "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Brand</dt>
                      <dd className="font-medium text-slate-900">{selectedProduct.brandNama ?? "-"}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Harga Jual</dt>
                      <dd className="font-bold text-lg text-slate-900">{formatCurrency(selectedProduct.hargaJual)}</dd>
                    </div>
                  </dl>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-800">
                      Informasi Tambahan
                    </span>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">ID Produk</span>
                        <p className="font-mono text-slate-700">{selectedProduct.id}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Dibuat</span>
                        <p className="text-slate-700">
                          {selectedProduct.updatedAt
                            ? new Date(selectedProduct.updatedAt).toLocaleDateString('id-ID')
                            : "-"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
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
