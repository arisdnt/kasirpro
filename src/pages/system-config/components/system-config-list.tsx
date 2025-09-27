import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Settings2 } from "lucide-react";
import type { SystemConfig } from "@/types/system-config";
import type { UseQueryResult } from "@tanstack/react-query";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

function describeScope(config: SystemConfig) {
  if (config.tokoId) {
    return config.tokoNama ?? "Konfigurasi Toko";
  }
  return "Konfigurasi Tenant";
}

interface SystemConfigListProps {
  filteredConfigs: SystemConfig[];
  selectedId: string | null;
  onSelectConfig: (id: string) => void;
  configsQuery: UseQueryResult<SystemConfig[]>;
}

export function SystemConfigList({
  filteredConfigs,
  selectedId,
  onSelectConfig,
  configsQuery,
}: SystemConfigListProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
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
                    onClick={() => onSelectConfig(config.id)}
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
  );
}