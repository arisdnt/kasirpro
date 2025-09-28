import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
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
  onEdit?: () => void;
  onDelete?: () => void;
}

export function BrandDetail({ selectedBrand, onEdit, onDelete }: BrandDetailProps) {
  const products = useBrandProductsQuery(selectedBrand?.id ?? null);
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none" style={{ backgroundColor: 'transparent' }}>
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {selectedBrand ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Brand</span>
                    <span className="text-black">•</span>
                    <span className="text-sm text-black">{selectedBrand.nama}</span>
                  </div>
                  <div className="flex gap-2">
                    {onEdit ? (
                      <button onClick={onEdit} className="text-xs rounded-none bg-slate-800 px-2 py-1 text-white">Edit</button>
                    ) : null}
                    {onDelete ? (
                      <button onClick={onDelete} className="text-xs rounded-none bg-red-600 px-2 py-1 text-white">Hapus</button>
                    ) : null}
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-3 text-slate-700">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">Nama Brand</div>
                    <div className="font-semibold text-slate-900">{selectedBrand.nama}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">Cakupan</div>
                    <div className="font-semibold text-slate-900">{getBrandScopeText(selectedBrand.tokoId ?? null)}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Toko</div>
                    <div className="font-semibold text-slate-900">{getBrandScopeDisplay(selectedBrand.tokoId ?? null)}</div>
                  </div>
                </div>

                <div className="rounded-none border border-slate-200 bg-white">
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-800">Produk Dalam Brand Ini</span>
                  </div>
                  <div className="p-4">
                    {products.isLoading ? (
                      <div className="space-y-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <Skeleton key={i} className="h-10 w-full" />
                        ))}
                      </div>
                    ) : (products.data ?? []).length === 0 ? (
                      <div className="text-xs text-slate-500">Belum ada produk untuk brand ini.</div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        {(products.data ?? []).map((p: { id: string; nama: string; kode: string; kategoriNama: string | null; }) => (
                          <div key={p.id} className="flex items-center justify-between rounded border border-slate-200 p-2">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-800">{p.nama}</span>
                              <span className="text-slate-500">{p.kode}</span>
                            </div>
                            <div className="text-right text-xs text-slate-600">
                              {p.kategoriNama ?? "-"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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