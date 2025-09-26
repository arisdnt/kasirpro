import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";
import { getBrandScopeText, getBrandScopeDisplay } from "./brand-utils";

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
  return (
    <Card className="flex w-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm lg:w-[360px] rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Brand</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">
            {selectedBrand ? selectedBrand.nama : "Pilih brand"}
          </CardTitle>
        </div>
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
                    {getBrandScopeText(selectedBrand.tokoId)}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Toko</dt>
                  <dd className="font-medium text-slate-900">
                    {getBrandScopeDisplay(selectedBrand.tokoId)}
                  </dd>
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
                    <span className="text-xs uppercase tracking-wide text-slate-500">ID Brand</span>
                    <p className="font-mono text-slate-700">{selectedBrand.id}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide text-slate-500">Dibuat</span>
                    <p className="text-slate-700">
                      {selectedBrand.createdAt
                        ? new Date(selectedBrand.createdAt).toLocaleDateString('id-ID')
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