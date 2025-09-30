import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format";
import type { PromoWithRelations } from "@/features/promo/types";
import type { PromoTiming } from "./promo-list";
import { Percent, ToggleLeft, ToggleRight } from "lucide-react";

interface PromoDetailCardProps {
  promo: PromoWithRelations | null;
  timing: PromoTiming | null;
  isStatusUpdating: boolean;
  onToggleStatus: (promo: PromoWithRelations) => void;
}

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

const numberFormatter = new Intl.NumberFormat("id-ID");
const timingLabelMap: Record<PromoTiming, string> = {
  active: "Sedang berjalan",
  upcoming: "Terjadwal",
  expired: "Berakhir",
};

export function PromoDetailCard({ promo, timing, isStatusUpdating, onToggleStatus }: PromoDetailCardProps) {
  return (
    <Card
      className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none"
      style={{ backgroundColor: "transparent" }}
    >
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Detail Promo</span>
          <span className="text-slate-400">•</span>
          <CardTitle className="text-sm text-slate-800">
            {promo ? promo.nama : "Pilih promo"}
          </CardTitle>
        </div>
        {promo ? (
          <Badge
            variant="secondary"
            className="rounded-none text-xs font-semibold"
            style={{ backgroundColor: "#3b91f9", color: "#fff" }}
          >
            {promo.status}
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 min-h-0 flex-col gap-3 overflow-hidden p-4">
        {!promo ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <Percent className="h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih promo untuk melihat detail</p>
            <p className="text-xs text-slate-500">Klik salah satu promo di daftar.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm p-4 text-sm text-slate-700">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Periode</p>
                    <p className="font-semibold text-slate-800">
                      {dateTimeFormatter.format(new Date(promo.mulai))}
                      {promo.selesai ? ` – ${dateTimeFormatter.format(new Date(promo.selesai))}` : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Outlet</p>
                    <p className="font-semibold text-slate-800">{promo.tokoNama ?? "Semua toko"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Nilai Promo</p>
                    <p className="font-semibold text-slate-800">
                      {promo.tipe === "diskon_persen"
                        ? `${promo.nilai}%`
                        : formatCurrency(promo.nilai)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Harga Spesial</p>
                    <p className="font-semibold text-slate-800">
                      {promo.hargaSpesial != null ? formatCurrency(promo.hargaSpesial) : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Min. Qty</p>
                    <p className="font-semibold text-slate-800">
                      {promo.syaratMinQty != null ? numberFormatter.format(promo.syaratMinQty) : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Min. Total</p>
                    <p className="font-semibold text-slate-800">
                      {promo.syaratMinTotal != null ? formatCurrency(promo.syaratMinTotal) : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Limit Pelanggan</p>
                    <p className="font-semibold text-slate-800">
                      {promo.limitPerPelanggan != null ? numberFormatter.format(promo.limitPerPelanggan) : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Limit Total</p>
                    <p className="font-semibold text-slate-800">
                      {promo.limitKeseluruhan != null ? numberFormatter.format(promo.limitKeseluruhan) : "-"}
                    </p>
                  </div>
                </div>
                {promo.deskripsi ? (
                  <>
                    <Separator className="my-3 bg-slate-200" />
                    <p className="text-xs uppercase tracking-wide text-slate-500">Deskripsi</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{promo.deskripsi}</p>
                  </>
                ) : null}
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm p-4 text-sm text-slate-700">
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Level Promo</p>
                    <p className="font-semibold text-slate-800">{promo.level}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Status Jadwal</p>
                    <p className="font-semibold text-slate-800">{timing ? timingLabelMap[timing] : "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Auto Apply</p>
                    <p className="font-semibold text-slate-800">{promo.isOtomatis ? "Ya" : "Tidak"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Jam Aktif</p>
                    <p className="font-semibold text-slate-800">
                      {promo.jamMulai && promo.jamSelesai ? `${promo.jamMulai} – ${promo.jamSelesai}` : "Sepanjang hari"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Hari Aktif</p>
                    <p className="font-semibold text-slate-800">
                      {promo.hariDalamMinggu && promo.hariDalamMinggu.length > 0
                        ? promo.hariDalamMinggu.map((day) => day + 1).join(", ")
                        : "Semua hari"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 flex-col overflow-hidden bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <span className="text-sm font-semibold text-slate-800">Target Promo</span>
                  <Badge variant="secondary" className="rounded-none text-[10px] font-semibold" style={{ backgroundColor: "#3b91f9", color: "#fff" }}>
                    {promo.products.length + promo.categories.length + promo.brands.length + promo.customers.length} entitas
                  </Badge>
                </div>
                <ScrollArea className="max-h-64">
                  <div className="divide-y divide-slate-200">
                    {(
                      [
                        { label: "Produk", data: promo.products },
                        { label: "Kategori", data: promo.categories },
                        { label: "Brand", data: promo.brands },
                        { label: "Pelanggan", data: promo.customers },
                      ] as const
                    ).map(({ label, data }) => (
                      <div key={label} className="px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                        {data.length === 0 ? (
                          <p className="mt-1 text-xs text-slate-500">Tidak ada {label.toLowerCase()} spesifik.</p>
                        ) : (
                          <ul className="mt-2 space-y-1">
                            {data.map((item) => (
                              <li key={item.id} className="flex items-center justify-between text-sm text-slate-700">
                                <span>{item.entityName}</span>
                                <Badge
                                  variant={item.exclude ? "secondary" : "outline"}
                                  className="rounded-none px-2 py-0.5 text-[10px]"
                                >
                                  {item.exclude ? "Exclude" : "Include"}
                                </Badge>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                variant="outline"
                className="rounded-none"
                onClick={() => promo && onToggleStatus(promo)}
                disabled={isStatusUpdating}
              >
                {promo.status === "aktif" ? (
                  <>
                    <ToggleLeft className="h-4 w-4" /> Nonaktifkan
                  </>
                ) : (
                  <>
                    <ToggleRight className="h-4 w-4" /> Aktifkan
                  </>
                )}
              </Button>
              <Button
                className="rounded-none bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                disabled
              >
                Edit promo
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
