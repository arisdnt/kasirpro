import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useStoresQuery } from "@/features/stores/use-stores";
import { usePromoList, usePromoStatusMutation } from "@/features/promo/use-promos";
import type { PromoWithRelations } from "@/types/promo";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Filter,
  Layers,
  Percent,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const numberFormatter = new Intl.NumberFormat("id-ID");
const dateFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" });
const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

type StoreFilter = "all" | string;
type StatusFilter = "all" | string;
type TypeFilter = "all" | string;
type LevelFilter = "all" | string;

type SummaryMetric = {
  title: string;
  value: string;
  caption: string;
  icon: typeof CheckCircle2;
  tone: "indigo" | "emerald" | "amber" | "rose";
};

type PromoTiming = "upcoming" | "active" | "expired";

function getPromoTiming(promo: PromoWithRelations): PromoTiming {
  const now = Date.now();
  const start = new Date(promo.mulai).getTime();
  const end = promo.selesai ? new Date(promo.selesai).getTime() : null;

  if (start > now) return "upcoming";
  if (end !== null && end < now) return "expired";
  return "active";
}

function SummaryCard({ title, value, caption, icon: Icon, tone }: SummaryMetric) {
  const toneMap: Record<SummaryMetric["tone"], string> = {
    indigo: "bg-indigo-100 text-indigo-700",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
  };

  return (
    <Card className="border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardContent className="flex items-start gap-3 p-4">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500">{caption}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function PromoPage() {
  const stores = useStoresQuery();
  const [storeFilter, setStoreFilter] = useState<StoreFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const promosQuery = usePromoList(storeFilter);
  const statusMutation = usePromoStatusMutation();

  const promos = useMemo(() => promosQuery.data ?? [], [promosQuery.data]);

  useEffect(() => {
    if (!promos.length) {
      setSelectedId(null);
      return;
    }
    if (selectedId && promos.some((promo) => promo.id === selectedId)) {
      return;
    }
    setSelectedId(promos[0]?.id ?? null);
  }, [promos, selectedId]);

  const statusOptions = useMemo(() => {
    const values = new Set(promos.map((promo) => promo.status));
    return Array.from(values).sort();
  }, [promos]);

  const typeOptions = useMemo(() => {
    const values = new Set(promos.map((promo) => promo.tipe));
    return Array.from(values).sort();
  }, [promos]);

  const levelOptions = useMemo(() => {
    const values = new Set(promos.map((promo) => promo.level));
    return Array.from(values).sort();
  }, [promos]);

  const filteredPromos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return promos.filter((promo) => {
      const matchesSearch =
        query.length === 0 ||
        [promo.nama, promo.kode ?? "", promo.deskripsi ?? "", promo.userNama ?? ""]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query));

      if (!matchesSearch) return false;
      if (statusFilter !== "all" && promo.status !== statusFilter) return false;
      if (typeFilter !== "all" && promo.tipe !== typeFilter) return false;
      if (levelFilter !== "all" && promo.level !== levelFilter) return false;
      if (storeFilter !== "all" && promo.tokoId !== storeFilter) return false;

      return true;
    });
  }, [promos, searchTerm, statusFilter, typeFilter, levelFilter, storeFilter]);

  useEffect(() => {
    if (!filteredPromos.length) {
      setSelectedId(null);
      return;
    }
    if (selectedId && filteredPromos.some((promo) => promo.id === selectedId)) {
      return;
    }
    setSelectedId(filteredPromos[0]?.id ?? null);
  }, [filteredPromos, selectedId]);

  const metrics = useMemo((): SummaryMetric[] => {
    const total = promos.length;
    const active = promos.filter((promo) => getPromoTiming(promo) === "active").length;
    const upcoming = promos.filter((promo) => getPromoTiming(promo) === "upcoming").length;
    const expired = promos.filter((promo) => getPromoTiming(promo) === "expired").length;

    return [
      {
        title: "Total Promo",
        value: numberFormatter.format(total),
        caption: `${numberFormatter.format(statusOptions.length)} status unik`,
        icon: CheckCircle2,
        tone: "indigo",
      },
      {
        title: "Sedang Aktif",
        value: numberFormatter.format(active),
        caption: "Berlaku untuk transaksi saat ini",
        icon: ShieldCheck,
        tone: "emerald",
      },
      {
        title: "Terjadwal",
        value: numberFormatter.format(upcoming),
        caption: "Belum mulai, siap dijalankan",
        icon: CalendarClock,
        tone: "amber",
      },
      {
        title: "Berakhir",
        value: numberFormatter.format(expired),
        caption: "Perlu diperbarui atau diarsip",
        icon: AlertTriangle,
        tone: "rose",
      },
    ];
  }, [promos, statusOptions.length]);

  const selectedPromo = useMemo(
    () => filteredPromos.find((promo) => promo.id === selectedId) ?? null,
    [filteredPromos, selectedId],
  );

  const handleRefresh = () => {
    void promosQuery.refetch();
  };

  const handleToggleStatus = (promo: PromoWithRelations) => {
    const nextStatus = promo.status === "aktif" ? "nonaktif" : "aktif";
    statusMutation.mutate({ promoId: promo.id, status: nextStatus });
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2 text-slate-900">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <SummaryCard key={metric.title} {...metric} />
        ))}
      </div>

      <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
        <CardContent className="flex flex-col gap-3 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-[260px] flex-1 flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Cari nama promo, kode, atau deskripsi"
                  className="h-10 rounded-none border-slate-200 pl-9 text-sm shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={storeFilter}
                  onChange={(event) => setStoreFilter(event.target.value)}
                  className="h-10 min-w-[160px] rounded-none border border-slate-200 bg-white px-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua toko</option>
                  {stores.data?.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-slate-400" />
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
                  className="h-10 min-w-[140px] rounded-none border border-slate-200 bg-white px-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua tipe</option>
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-slate-400" />
                <select
                  value={levelFilter}
                  onChange={(event) => setLevelFilter(event.target.value as LevelFilter)}
                  className="h-10 min-w-[140px] rounded-none border border-slate-200 bg-white px-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua level</option>
                  {levelOptions.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                  className="h-10 min-w-[140px] rounded-none border border-slate-200 bg-white px-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua status</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70"
                disabled={promosQuery.isFetching}
              >
                <RefreshCw className={cn("h-4 w-4", promosQuery.isFetching && "animate-spin")} />
                Muat ulang
              </Button>
              <Button className="gap-2 rounded-none bg-[#466eae] text-white hover:bg-[#3a5c9a]" disabled title="Segera hadir">
                <Plus className="h-4 w-4" />
                Promo Baru
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <Card className="flex h-full min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Promo</span>
              <span className="text-slate-400">•</span>
              <CardTitle className="text-sm">Daftar Promo</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredPromos.length} promo
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {promosQuery.isLoading ? (
                <div className="space-y-2 p-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-md" />
                  ))}
                </div>
              ) : filteredPromos.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-500">
                  <Percent className="h-10 w-10 text-slate-300" />
                  <p className="text-sm font-medium text-slate-600">Belum ada promo yang cocok</p>
                  <p className="text-xs text-slate-500">Sesuaikan pencarian atau tambahkan promo baru.</p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {filteredPromos.map((promo) => {
                    const isSelected = promo.id === selectedId;
                    const timing = getPromoTiming(promo);
                    const timingLabel = timing === "active" ? "Sedang berjalan" : timing === "upcoming" ? "Akan datang" : "Berakhir";
                    const timingTone = timing === "active" ? "text-emerald-600" : timing === "upcoming" ? "text-amber-600" : "text-rose-600";

                    return (
                      <button
                        key={promo.id}
                        type="button"
                        onClick={() => setSelectedId(promo.id)}
                        className={cn(
                          "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition",
                          isSelected ? "border-indigo-300 bg-indigo-50/80" : "hover:border-indigo-200 hover:bg-indigo-50/40",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className={cn("text-sm font-semibold", isSelected ? "text-indigo-700" : "text-slate-800")}>{promo.nama}</p>
                            <p className="text-xs text-slate-500">
                              {dateFormatter.format(new Date(promo.mulai))}
                              {promo.selesai ? ` – ${dateFormatter.format(new Date(promo.selesai))}` : ""}
                              {promo.kode ? ` • Kode ${promo.kode}` : ""}
                            </p>
                          </div>
                          <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-xs">
                            {promo.status}
                          </Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                          <span className={timingTone}>{timingLabel}</span>
                          <span>Level: {promo.level}</span>
                          <span>Tipe: {promo.tipe}</span>
                          <span>Prioritas: {promo.prioritas}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        </div>

        <div className="w-full lg:w-1/4">
          <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Detail</span>
              <span className="text-slate-400">•</span>
              <CardTitle className="text-sm">
                {selectedPromo ? selectedPromo.nama : "Pilih promo"}
              </CardTitle>
            </div>
            {selectedPromo ? (
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none text-xs">
                {selectedPromo.status}
              </Badge>
            ) : null}
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            {!selectedPromo ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
                <Percent className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih promo untuk melihat detail</p>
                <p className="text-xs text-slate-500">Klik salah satu promo di daftar.</p>
              </div>
            ) : (
              <>
                <div className="rounded-none border border-slate-200 bg-white p-4 shadow-inner text-sm text-slate-600">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Periode</p>
                      <p className="font-semibold text-slate-800">
                        {dateTimeFormatter.format(new Date(selectedPromo.mulai))}
                        {selectedPromo.selesai ? ` – ${dateTimeFormatter.format(new Date(selectedPromo.selesai))}` : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Toko</p>
                      <p className="font-semibold text-slate-800">{selectedPromo.tokoNama ?? "Semua toko"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Nilai</p>
                      <p className="font-semibold text-slate-800">
                        {selectedPromo.tipe === "diskon_persen"
                          ? `${numberFormatter.format(selectedPromo.nilai)}%`
                          : formatCurrency(selectedPromo.nilai)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Harga Spesial</p>
                      <p className="font-semibold text-slate-800">
                        {selectedPromo.hargaSpesial != null ? formatCurrency(selectedPromo.hargaSpesial) : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Minimum Qty</p>
                      <p className="font-semibold text-slate-800">
                        {selectedPromo.syaratMinQty != null ? numberFormatter.format(selectedPromo.syaratMinQty) : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Minimum Total</p>
                      <p className="font-semibold text-slate-800">
                        {selectedPromo.syaratMinTotal != null ? formatCurrency(selectedPromo.syaratMinTotal) : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Limit per Pelanggan</p>
                      <p className="font-semibold text-slate-800">
                        {selectedPromo.limitPerPelanggan != null ? numberFormatter.format(selectedPromo.limitPerPelanggan) : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Limit Keseluruhan</p>
                      <p className="font-semibold text-slate-800">
                        {selectedPromo.limitKeseluruhan != null ? numberFormatter.format(selectedPromo.limitKeseluruhan) : "-"}
                      </p>
                    </div>
                  </div>
                  {selectedPromo.deskripsi ? (
                    <>
                      <Separator className="my-3" />
                      <p className="text-xs uppercase tracking-wide text-slate-500">Deskripsi</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{selectedPromo.deskripsi}</p>
                    </>
                  ) : null}
                </div>

                <div className="rounded-none border border-slate-200 bg-white p-4 shadow-inner text-sm text-slate-600">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Syarat & Ketentuan</p>
                  <div className="mt-2 space-y-2 text-sm text-slate-700">
                    <p>Level promo: <strong>{selectedPromo.level}</strong></p>
                    <p>Otomatis diterapkan: <strong>{selectedPromo.isOtomatis ? "Ya" : "Tidak"}</strong></p>
                    <p>Jam aktif: {selectedPromo.jamMulai && selectedPromo.jamSelesai ? `${selectedPromo.jamMulai} – ${selectedPromo.jamSelesai}` : "Sepanjang hari"}</p>
                    <p>
                      Hari aktif: {selectedPromo.hariDalamMinggu && selectedPromo.hariDalamMinggu.length > 0
                        ? selectedPromo.hariDalamMinggu.map((day) => day + 1).join(", ")
                        : "Semua hari"}
                    </p>
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-800">Target Promo</span>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none text-xs">
                      {selectedPromo.products.length + selectedPromo.categories.length + selectedPromo.brands.length + selectedPromo.customers.length} entitas
                    </Badge>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="divide-y divide-slate-200">
                      {(
                        [
                          { label: "Produk", data: selectedPromo.products },
                          { label: "Kategori", data: selectedPromo.categories },
                          { label: "Brand", data: selectedPromo.brands },
                          { label: "Pelanggan", data: selectedPromo.customers },
                        ] as const
                      ).map(({ label, data }) => (
                        <div key={label} className="px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                          {data.length === 0 ? (
                            <p className="mt-1 text-xs text-slate-500">Tidak ada {label.toLowerCase()} spesifik.</p>
                          ) : (
                            <ul className="mt-2 space-y-1">
                              {data.map((item) => (
                                <li key={item.id} className="flex items-center justify-between text-sm">
                                  <span className="text-slate-700">{item.entityName}</span>
                                  <Badge variant={item.exclude ? "secondary" : "outline"} className="rounded-full px-2 py-0.5 text-[10px]">
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

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    className="rounded-none"
                    onClick={() => selectedPromo && handleToggleStatus(selectedPromo)}
                    disabled={statusMutation.isPending || !selectedPromo}
                  >
                    {selectedPromo?.status === "aktif" ? (
                      <>
                        <ToggleLeft className="h-4 w-4" /> Nonaktifkan
                      </>
                    ) : (
                      <>
                        <ToggleRight className="h-4 w-4" /> Aktifkan
                      </>
                    )}
                  </Button>
                  <Button className="rounded-none bg-[#466eae] text-white hover:bg-[#3a5c9a]" disabled title="Segera hadir">
                    Edit promo
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
