import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderTree } from "lucide-react";
import type { EnrichedCategory } from "./kategori-utils";
import { currencyFormatter } from "./kategori-utils";

interface Product {
  id: string;
  nama: string;
  kode: string;
  hargaJual: number;
  kategoriId?: string | null;
}

interface KategoriDetailProps {
  selectedCategory: EnrichedCategory | null;
  products: Product[];
  isProductsLoading: boolean;
}

export function KategoriDetail({ selectedCategory, products, isProductsLoading }: KategoriDetailProps) {
  const categoryProducts = selectedCategory
    ? products
        .filter((item) => item.kategoriId === selectedCategory.id)
        .sort((a, b) => a.nama.localeCompare(b.nama))
    : [];

  return (
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
                {isProductsLoading ? (
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
  );
}