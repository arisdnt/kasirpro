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
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden">
        {selectedCategory ? (
          <ScrollArea className="h-full pr-1">
            <div className="relative w-full">
              <div className="absolute right-0 top-0">
                <Badge variant="outline" className="rounded-none border border-slate-400 text-[11px] uppercase tracking-wide">
                  {selectedCategory.tokoId ? "Kategori Toko" : "Kategori Global"}
                </Badge>
              </div>
              <div className="p-6 font-mono text-xs text-slate-800">
                <div className="mb-4 border-b-2 border-dashed border-slate-400 pb-3 text-center">
                  <h2 className="text-lg font-bold tracking-[0.3em] text-slate-900">KATEGORI</h2>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Ringkasan & Produk</p>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between"><span>Nama</span><span className="max-w-[60%] truncate text-right font-semibold text-slate-900">{selectedCategory.nama}</span></div>
                  <div className="flex justify-between"><span>ID</span><span className="font-mono text-[10px] text-slate-700">{selectedCategory.id}</span></div>
                  <div className="flex justify-between"><span>Cakupan</span><span className="text-slate-900">{selectedCategory.tokoId ? "Kategori Toko" : "Kategori Global"}</span></div>
                  <div className="flex justify-between"><span>Toko</span><span className="text-slate-900">{selectedCategory.tokoId ?? "Semua toko"}</span></div>
                  <div className="flex justify-between"><span>Induk</span><span className="text-slate-900">{selectedCategory.parentId ? (selectedCategory.parentName ?? selectedCategory.parentId) : "Tidak ada"}</span></div>
                  <div className="flex justify-between"><span>Jumlah Produk</span><span className="font-semibold text-slate-900">{selectedCategory.productCount}</span></div>
                </div>

                <div className="mt-4 border-y-2 border-dashed border-slate-400 py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase text-slate-500">Produk dalam Kategori</div>
                    <Badge variant="secondary" className="rounded-none border border-slate-200 bg-white text-slate-700">
                      {categoryProducts.length} item
                    </Badge>
                  </div>
                </div>

                <div className="mt-3">
                  {isProductsLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} className="h-8 w-full" />
                      ))}
                    </div>
                  ) : categoryProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                      <FolderTree className="h-6 w-6 text-slate-300" />
                      <p className="text-[11px] text-slate-600">Belum ada produk pada kategori ini.</p>
                    </div>
                  ) : (
                    <table className="w-full min-w-[280px] text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-left text-slate-500">
                          <th className="px-4 py-2 font-medium">Produk</th>
                          <th className="px-2 py-2 font-medium">Kode</th>
                          <th className="px-2 py-2 text-right font-medium">Harga</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryProducts.map((item) => (
                          <tr key={item.id} className="border-b border-slate-100">
                            <td className="px-4 py-2 font-medium text-slate-700">{item.nama}</td>
                            <td className="px-2 py-2 text-slate-500">{item.kode}</td>
                            <td className="px-2 py-2 text-right text-slate-600">{currencyFormatter.format(item.hargaJual)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
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