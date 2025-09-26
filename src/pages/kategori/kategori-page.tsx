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
import { useCategoriesQuery } from "@/features/kategori/use-categories";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/products";
import { Filter, FolderTree, Plus, RefreshCw, Search } from "lucide-react";

type ScopeFilter = "all" | "global" | "store";

type EnrichedCategory = Category & {
  productCount: number;
  parentName: string | null;
};

export function KategoriPage() {
  const categories = useCategoriesQuery();
  const products = useProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [scope, setScope] = useState<ScopeFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const data = categories.data ?? [];
    const total = data.length;
    const global = data.filter((item) => !item.tokoId).length;
    const store = total - global;
    return { total, global, store };
  }, [categories.data]);

  const productCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of products.data ?? []) {
      if (!item.kategoriId) continue;
      counts[item.kategoriId] = (counts[item.kategoriId] ?? 0) + 1;
    }
    return counts;
  }, [products.data]);

  const categoryIndex = useMemo(() => {
    const lookup: Record<string, { nama: string }> = {};
    for (const item of categories.data ?? []) {
      lookup[item.id] = { nama: item.nama };
    }
    return lookup;
  }, [categories.data]);

  const filteredCategories = useMemo<EnrichedCategory[]>(() => {
    const data = categories.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nama.toLowerCase().includes(query) ||
          (item.tokoId ?? "").toLowerCase().includes(query);
        const matchesScope =
          scope === "all"
            ? true
            : scope === "global"
            ? !item.tokoId
            : Boolean(item.tokoId);
        return matchesSearch && matchesScope;
      })
      .map((item) => ({
        ...item,
        productCount: productCountByCategory[item.id] ?? 0,
        parentName: item.parentId
          ? categoryIndex[item.parentId]?.nama ?? "Kategori induk"
          : null,
      }))
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [categories.data, searchTerm, scope, productCountByCategory, categoryIndex]);

  useEffect(() => {
    if (filteredCategories.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !filteredCategories.some((item) => item.id === selectedId)) {
      setSelectedId(filteredCategories[0]?.id ?? null);
    }
  }, [filteredCategories, selectedId]);

  const selectedCategory = useMemo(() => {
    if (!selectedId) return null;
    return filteredCategories.find((item) => item.id === selectedId) ?? null;
  }, [filteredCategories, selectedId]);

  const categoryProducts = useMemo(() => {
    if (!selectedCategory) return [];
    return (products.data ?? [])
      .filter((item) => item.kategoriId === selectedCategory.id)
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [products.data, selectedCategory]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }),
    []
  );

  const handleRefresh = () => {
    categories.refetch();
    products.refetch();
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
                  placeholder="Cari nama kategori atau kode toko"
                  className="h-10 rounded-none border-slate-200 pl-9 text-sm text-black shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={scope}
                  onChange={(event) => setScope(event.target.value as ScopeFilter)}
                  className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua cakupan</option>
                  <option value="global">Kategori global</option>
                  <option value="store">Kategori per toko</option>
                </select>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <div className="flex gap-3 text-xs text-black">
                <span>Total: <strong>{stats.total}</strong></span>
                <span>Global: <strong>{stats.global}</strong></span>
                <span>Per Toko: <strong>{stats.store}</strong></span>
              </div>
              <Button variant="outline" onClick={handleRefresh} className="gap-2 text-white rounded-none">
                <RefreshCw className="h-4 w-4" />
                Refresh data
              </Button>
              <Button className="gap-2 text-white rounded-none">
                <Plus className="h-4 w-4" />
                Kategori baru
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Navigasi Kategori</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">Daftar Kategori</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredCategories.length} kategori
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {categories.isLoading ? (
                <div className="flex flex-col gap-2 p-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <FolderTree className="h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-700">Belum ada kategori yang cocok</p>
                  <p className="text-xs text-slate-500">
                    Sesuaikan pencarian atau tambahkan kategori baru untuk memulai.
                  </p>
                </div>
              ) : (
                <Table className="min-w-full text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-white/95">
                    <TableRow className="border-b border-slate-200">
                      <TableHead className="w-[35%] text-slate-500">Kategori</TableHead>
                      <TableHead className="w-[20%] text-slate-500">Cakupan</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Produk</TableHead>
                      <TableHead className="w-[30%] text-slate-500">Referensi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((item) => (
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
                          <div className="flex flex-col">
                            <span className={cn(
                              "text-[15px] font-semibold",
                              item.id === selectedId ? "text-black" : "text-slate-900"
                            )}>
                              {item.nama}
                            </span>
                            {item.parentName && (
                              <span className={cn(
                                "text-xs",
                                item.id === selectedId ? "text-gray-700" : "text-slate-500"
                              )}>
                                Sub dari {item.parentName}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <Badge
                            variant={item.tokoId ? "outline" : "secondary"}
                            className={cn(
                              "border-slate-200 bg-slate-100 text-xs font-medium",
                              item.tokoId ? "text-slate-600" : "text-slate-700"
                            )}
                          >
                            {item.tokoId ? "Kategori Toko" : "Kategori Global"}
                          </Badge>
                        </TableCell>
                        <TableCell className={cn(
                          "align-top font-semibold",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.productCount}
                        </TableCell>
                        <TableCell className={cn(
                          "align-top text-xs",
                          item.id === selectedId ? "text-gray-700" : "text-slate-500"
                        )}>
                          {item.tokoId ? `Toko ID: ${item.tokoId}` : "Berlaku untuk semua toko"}
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
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Detail & Produk</span>
              <span className="text-slate-400">•</span>
              <CardTitle className="text-sm">
                {selectedCategory ? selectedCategory.nama : "Pilih kategori"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            {selectedCategory ? (
              <>
                <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-600">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Cakupan</dt>
                      <dd className="font-medium text-slate-900">
                        {selectedCategory.tokoId ? "Kategori Toko" : "Kategori Global"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Toko</dt>
                      <dd className="font-medium text-slate-900">
                        {selectedCategory.tokoId ?? "Semua toko"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Induk</dt>
                      <dd className="font-medium text-slate-900">
                        {selectedCategory.parentId
                          ? selectedCategory.parentName ?? selectedCategory.parentId
                          : "Tidak ada"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Produk</dt>
                      <dd className="font-medium text-slate-900">{selectedCategory.productCount}</dd>
                    </div>
                  </dl>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-800">
                      Produk dalam kategori
                    </span>
                    <Badge variant="outline" className="text-xs text-slate-600 rounded-none">
                      {categoryProducts.length} item
                    </Badge>
                  </div>
                  <ScrollArea className="flex-1">
                    {products.isLoading ? (
                      <div className="flex flex-col gap-2 p-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <Skeleton key={index} className="h-9 w-full rounded-md" />
                        ))}
                      </div>
                    ) : categoryProducts.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                        <FolderTree className="h-6 w-6 text-slate-300" />
                        <p className="text-xs text-slate-500">
                          Belum ada produk pada kategori ini.
                        </p>
                      </div>
                    ) : (
                      <table className="w-full min-w-[280px] text-xs">
                        <thead className="sticky top-0 bg-white text-slate-500">
                          <tr className="border-b border-slate-200 text-left">
                            <th className="px-4 py-2 font-medium">Produk</th>
                            <th className="px-2 py-2 font-medium">Kode</th>
                            <th className="px-2 py-2 font-medium text-right">Harga</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoryProducts.map((item) => (
                            <tr key={item.id} className="border-b border-slate-100">
                              <td className="px-4 py-2 font-medium text-slate-700">{item.nama}</td>
                              <td className="px-2 py-2 text-slate-500">{item.kode}</td>
                              <td className="px-2 py-2 text-right text-slate-600">
                                {currencyFormatter.format(item.hargaJual)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </ScrollArea>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
                <FolderTree className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih kategori untuk melihat detail</p>
                <p className="text-xs text-slate-500">
                  Klik salah satu baris kategori untuk melihat ringkasan dan daftar produk terkait.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
