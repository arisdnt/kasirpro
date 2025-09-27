import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Brand</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">
            {selectedBrand ? selectedBrand.nama : "Pilih brand"}
          </CardTitle>
        </div>
        {selectedBrand ? (
          <div className="flex gap-2">
            {onEdit ? (
              <button onClick={onEdit} className="text-xs rounded-none bg-slate-800 px-2 py-1 text-white">Edit</button>
            ) : null}
            {onDelete ? (
              <button onClick={onDelete} className="text-xs rounded-none bg-red-600 px-2 py-1 text-white">Hapus</button>
            ) : null}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
        {selectedBrand ? (
          <>
            <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-600">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Nama Brand</dt>
                  <dd className="font-medium text-slate-900">{selectedBrand.nama}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Cakupan</dt>
                  <dd className="font-medium text-slate-900">
                    {getBrandScopeText(selectedBrand.tokoId ?? null)}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Toko</dt>
                  <dd className="font-medium text-slate-900">
                    {getBrandScopeDisplay(selectedBrand.tokoId ?? null)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                <span className="text-sm font-semibold text-slate-800">
                  Produk Dalam Brand Ini
                </span>
              </div>
              <ScrollArea className="flex-1">
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
              </ScrollArea>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <Tag className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih brand untuk melihat detail</p>
            <p className="text-xs text-slate-500">
              Klik salah satu baris brand untuk melihat informasi lengkap.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}