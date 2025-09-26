import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useStoresQuery } from "@/features/stores/use-stores";
import { useSystemConfigList, useSystemConfigUpdate } from "@/features/system-config/use-system-config";
import type { SystemConfig } from "@/types/system-config";
import { cn } from "@/lib/utils";
import {
  Filter,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Building,
  KeyRound,
  Wand2,
} from "lucide-react";

const numberFormatter = new Intl.NumberFormat("id-ID");
const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

const summaryAccentMap = {
  indigo: "bg-indigo-100 text-indigo-700",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
} as const;
type SummaryAccent = keyof typeof summaryAccentMap;

type ScopeFilter = "all" | "tenant" | string;
type TypeFilter = "all" | string;

type SummaryMetric = {
  title: string;
  value: string;
  caption: string;
  icon: typeof Settings2;
  accent: SummaryAccent;
};

function SummaryCard({ title, value, caption, icon: Icon, accent }: SummaryMetric) {
  return (
    <Card className="border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardContent className="flex items-start gap-3 p-4">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", summaryAccentMap[accent])}>
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

function describeScope(config: SystemConfig) {
  if (config.tokoId) {
    return config.tokoNama ?? "Konfigurasi Toko";
  }
  return "Konfigurasi Tenant";
}

export function SystemConfigPage() {
  const stores = useStoresQuery();
  const configsQuery = useSystemConfigList();
  const updateMutation = useSystemConfigUpdate();

  const [searchTerm, setSearchTerm] = useState("");
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [valueDraft, setValueDraft] = useState("");
  const [descriptionDraft, setDescriptionDraft] = useState("");

  const configs = useMemo(() => configsQuery.data ?? [], [configsQuery.data]);

  useEffect(() => {
    if (!configs.length) {
      setSelectedId(null);
      return;
    }
    if (selectedId && configs.some((item) => item.id === selectedId)) {
      return;
    }
    setSelectedId(configs[0]?.id ?? null);
  }, [configs, selectedId]);

  const filteredConfigs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return configs.filter((config) => {
      const matchesSearch =
        query.length === 0 ||
        [config.key, config.tipe ?? "", config.deskripsi ?? "", config.tokoNama ?? ""]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      if (scopeFilter === "tenant" && config.tokoId) return false;
      if (scopeFilter !== "all" && scopeFilter !== "tenant" && config.tokoId !== scopeFilter) return false;
      if (typeFilter !== "all" && (config.tipe ?? "") !== typeFilter) return false;

      return true;
    });
  }, [configs, searchTerm, scopeFilter, typeFilter]);

  useEffect(() => {
    if (!filteredConfigs.length) {
      setSelectedId(null);
      return;
    }
    if (selectedId && filteredConfigs.some((config) => config.id === selectedId)) {
      return;
    }
    setSelectedId(filteredConfigs[0]?.id ?? null);
  }, [filteredConfigs, selectedId]);

  const selectedConfig = useMemo(
    () => filteredConfigs.find((config) => config.id === selectedId) ?? null,
    [filteredConfigs, selectedId],
  );

  useEffect(() => {
    setValueDraft(selectedConfig?.value ?? "");
    setDescriptionDraft(selectedConfig?.deskripsi ?? "");
  }, [selectedConfig?.id, selectedConfig?.value, selectedConfig?.deskripsi]);

  const typeOptions = useMemo(() => {
    const values = new Set(configs.map((config) => config.tipe ?? ""));
    values.delete("");
    return Array.from(values).sort();
  }, [configs]);

  const metrics: SummaryMetric[] = useMemo(() => {
    const total = configs.length;
    const storeScoped = configs.filter((config) => Boolean(config.tokoId)).length;
    const tenantScoped = total - storeScoped;
    const uniqueKeys = new Set(configs.map((config) => config.key)).size;
    return [
      {
        title: "Total Konfigurasi",
        value: numberFormatter.format(total),
        caption: `${uniqueKeys} key unik terdaftar`,
        icon: Settings2,
        accent: "indigo" as SummaryAccent,
      },
      {
        title: "Konfigurasi Toko",
        value: numberFormatter.format(storeScoped),
        caption: `${numberFormatter.format(tenantScoped)} konfigurasi tenant`,
        icon: Building,
        accent: "amber" as SummaryAccent,
      },
      {
        title: "Perlu Tinjau",
        value: numberFormatter.format(configs.filter((config) => (config.value ?? "").length === 0).length),
        caption: "Key tanpa nilai tersimpan",
        icon: ShieldCheck,
        accent: "emerald" as SummaryAccent,
      },
    ];
  }, [configs]);

  const handleRefresh = () => {
    void configsQuery.refetch();
  };

  const handleSave = () => {
    if (!selectedConfig) return;
    updateMutation.mutate({
      id: selectedConfig.id,
      value: valueDraft.trim().length === 0 ? null : valueDraft,
      deskripsi: descriptionDraft.trim().length === 0 ? null : descriptionDraft,
    });
  };

  const isDirty = Boolean(
    selectedConfig &&
      (((selectedConfig.value ?? "") !== valueDraft) || (selectedConfig.deskripsi ?? "") !== descriptionDraft),
  );

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2 text-slate-900">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <SummaryCard key={metric.title} {...metric} />
        ))}
      </div>

      <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
        <CardContent className="flex flex-col gap-3 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex min-w-[260px] flex-1 flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Cari key, tipe, atau deskripsi"
                  className="h-10 rounded-none border-slate-200 pl-9 text-sm shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={scopeFilter}
                  onChange={(event) => setScopeFilter(event.target.value as ScopeFilter)}
                  className="h-10 min-w-[160px] rounded-none border border-slate-200 bg-white px-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua cakupan</option>
                  <option value="tenant">Konfigurasi Tenant</option>
                  {stores.data?.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-slate-400" />
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
                  className="h-10 min-w-[150px] rounded-none border border-slate-200 bg-white px-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Tipe apapun</option>
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <Button variant="outline" onClick={handleRefresh} className="gap-2 rounded-none" disabled={configsQuery.isFetching}>
                <RefreshCw className={cn("h-4 w-4", configsQuery.isFetching && "animate-spin")} />
                Muat ulang
              </Button>
              <Button className="gap-2 rounded-none" disabled title="Segera hadir">
                <KeyRound className="h-4 w-4" />
                Tambah Konfigurasi
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Konfigurasi</span>
              <span className="text-slate-400">•</span>
              <CardTitle className="text-sm">Daftar Key</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredConfigs.length} key
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {configsQuery.isLoading ? (
                <div className="space-y-2 p-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-14 w-full rounded-md" />
                  ))}
                </div>
              ) : filteredConfigs.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-500">
                  <Settings2 className="h-10 w-10 text-slate-300" />
                  <p className="text-sm font-medium text-slate-600">Tidak ada konfigurasi yang cocok</p>
                  <p className="text-xs text-slate-500">Sesuaikan pencarian atau filter untuk melihat konfigurasi lainnya.</p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {filteredConfigs.map((config) => {
                    const isActive = selectedId === config.id;
                    const scope = describeScope(config);
                    return (
                      <button
                        key={config.id}
                        type="button"
                        onClick={() => setSelectedId(config.id)}
                        className={cn(
                          "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition",
                          isActive ? "border-indigo-300 bg-indigo-50/80" : "hover:border-indigo-200 hover:bg-indigo-50/40",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className={cn("text-sm font-semibold", isActive ? "text-indigo-700" : "text-slate-800")}>{config.key}</p>
                            <p className="text-xs text-slate-500">{scope}</p>
                          </div>
                          <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-xs">
                            {config.tipe ?? "string"}
                          </Badge>
                        </div>
                        {config.deskripsi ? (
                          <p className="mt-2 line-clamp-2 text-xs text-slate-500">{config.deskripsi}</p>
                        ) : null}
                        <div className="mt-2 text-[11px] text-slate-500">
                          Disunting {config.updatedAt ? dateFormatter.format(new Date(config.updatedAt)) : "-"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex w-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm lg:w-[420px] rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Detail</span>
              <span className="text-slate-400">•</span>
              <CardTitle className="text-sm">
                {selectedConfig ? selectedConfig.key : "Pilih konfigurasi"}
              </CardTitle>
            </div>
            {selectedConfig ? (
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none text-xs">
                {selectedConfig.tipe ?? "string"}
              </Badge>
            ) : null}
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            {!selectedConfig ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
                <Settings2 className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih konfigurasi untuk melihat detail</p>
                <p className="text-xs text-slate-500">Klik salah satu key di daftar konfigurasi.</p>
              </div>
            ) : (
              <>
                <div className="rounded-none border border-slate-200 bg-white p-4 shadow-inner text-sm text-slate-600">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Cakupan</p>
                      <p className="font-semibold text-slate-800">{describeScope(selectedConfig)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Terakhir diubah</p>
                      <p className="font-semibold text-slate-800">
                        {selectedConfig.updatedAt ? dateFormatter.format(new Date(selectedConfig.updatedAt)) : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Dibuat</p>
                      <p className="text-slate-800">
                        {selectedConfig.createdAt ? dateFormatter.format(new Date(selectedConfig.createdAt)) : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">ID</p>
                      <p className="text-slate-800">{selectedConfig.id}</p>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Deskripsi</p>
                    <textarea
                      value={descriptionDraft}
                      onChange={(event) => setDescriptionDraft(event.target.value)}
                      className="mt-1 min-h-[80px] w-full resize-y rounded-none border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="Tambahkan deskripsi untuk key ini"
                    />
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white p-4 shadow-inner">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Nilai</p>
                  <textarea
                    value={valueDraft}
                    onChange={(event) => setValueDraft(event.target.value)}
                    className="mt-2 min-h-[150px] flex-1 resize-y rounded-none border border-slate-200 bg-white px-3 py-2 text-sm font-mono text-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Masukkan nilai konfigurasi"
                  />
                  <p className="mt-2 text-[11px] text-slate-500">
                    Simpan sebagai teks mentah. Gunakan format JSON untuk konfigurasi kompleks.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    className="rounded-none"
                    onClick={() => {
                      setValueDraft(selectedConfig.value ?? "");
                      setDescriptionDraft(selectedConfig.deskripsi ?? "");
                    }}
                    disabled={!isDirty || updateMutation.isPending}
                  >
                    Reset
                  </Button>
                  <Button
                    className="rounded-none"
                    onClick={handleSave}
                    disabled={!selectedConfig || updateMutation.isPending || !isDirty}
                  >
                    {updateMutation.isPending ? "Menyimpan..." : "Simpan perubahan"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
