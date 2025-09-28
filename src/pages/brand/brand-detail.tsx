import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateTime } from "@/lib/format";
import { Tag } from "lucide-react";
import { getBrandScopeText, getBrandScopeDisplay } from "./brand-utils";
import { useBrandProductsQuery } from "@/features/brand/queries";

interface Brand {
  id: string;
  nama: string;
  tokoId?: string | null;
  createdAt?: string;
}

interface BrandDetailProps {
  selectedBrand: Brand | null;
}

export function BrandDetail({ selectedBrand }: BrandDetailProps) {
  const products = useBrandProductsQuery(selectedBrand?.id ?? null);
  return (
    <Card
      className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none"
      style={{ backgroundColor: "transparent" }}
    >
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {selectedBrand ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                  <h1 className="text-xl font-bold mb-2">KASIR PRO</h1>
                  <p className="text-xs">Master Data • Brand</p>
                  <div className="mt-3 pt-2 border-t border-gray-300">
                    <p className="font-bold text-blue-600">RINCIAN BRAND</p>
                  </div>
                </div>

                <div className="mb-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Nama Brand</span>
                    <span className="font-bold text-black">{selectedBrand.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cakupan</span>
                    <span className="font-bold text-black">{getBrandScopeText(selectedBrand.tokoId ?? null)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toko Terkait</span>
                    <span className="text-right max-w-[60%]">{getBrandScopeDisplay(selectedBrand.tokoId ?? null)}</span>
                  </div>
                  {selectedBrand.createdAt ? (
                    <div className="flex justify-between">
                      <span>Dibuat Pada</span>
                      <span>{formatDateTime(selectedBrand.createdAt)}</span>
                    </div>
                  ) : null}
                </div>

                <div className="mt-6 border-t-2 border-b-2 border-dashed border-gray-400 py-2">
                  <div className="text-xs font-bold mb-2 grid grid-cols-12 gap-1">
                    <div className="col-span-6">Produk</div>
                    <div className="col-span-3 text-center">Kode</div>
                    <div className="col-span-3 text-right">Kategori</div>
                  </div>

                  {products.isLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="grid grid-cols-12 gap-1 text-xs">
                          <div className="col-span-6">
                            <div className="h-3 bg-gray-200 animate-pulse" />
                          </div>
                          <div className="col-span-3">
                            <div className="h-3 bg-gray-200 animate-pulse" />
                          </div>
                          <div className="col-span-3">
                            <div className="h-3 bg-gray-200 animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (products.data ?? []).length === 0 ? (
                    <div className="text-xs text-slate-500 py-2 text-center">
                      Belum ada produk untuk brand ini.
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {(products.data ?? []).map(
                        (p: { id: string; nama: string; kode: string; kategoriNama: string | null }) => (
                          <div key={p.id} className="grid grid-cols-12 gap-1 text-xs">
                            <div className="col-span-6 truncate font-semibold text-slate-800">
                              {p.nama}
                            </div>
                            <div className="col-span-3 text-center text-slate-600">
                              {p.kode}
                            </div>
                            <div className="col-span-3 text-right text-slate-600">
                              {p.kategoriNama ?? "-"}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-gray-400">
                  <p className="text-xs">Dokumen Rincian Brand</p>
                  <p className="text-xs">Gunakan untuk memastikan data brand tetap konsisten.</p>
                  <p className="text-xs mt-2">== KASIR PRO ==</p>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
            <Tag className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih brand untuk melihat detail</p>
            <p className="text-xs text-slate-500">Klik salah satu baris brand untuk melihat informasi lengkap.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
