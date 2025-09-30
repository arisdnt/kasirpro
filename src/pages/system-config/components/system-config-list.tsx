import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Settings2, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SystemConfig } from "@/features/system-config/types";
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
  onViewDetail?: (config: SystemConfig) => void;
  onEditConfig?: (config: SystemConfig) => void;
  onDeleteConfig?: (config: SystemConfig) => void;
}

export function SystemConfigList({
  filteredConfigs,
  selectedId,
  onSelectConfig,
  configsQuery,
  onViewDetail,
  onEditConfig,
  onDeleteConfig,
}: SystemConfigListProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 rounded-none" style={{
      backgroundColor: '#f6f9ff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2" style={{ backgroundColor: '#f6f9ff' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Konfigurasi</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Key</CardTitle>
        </div>
        <Badge variant="secondary" className="text-white rounded-none" style={{ backgroundColor: '#3b91f9' }}>
          {filteredConfigs.length} key
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0 flex flex-col">
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
            <div className="space-y-1 p-2">
              {filteredConfigs.map((config, index) => {
                const isActive = selectedId === config.id;
                const scope = describeScope(config);
                return (
                  <div
                    key={config.id}
                    className={cn(
                      "flex w-full items-center gap-3 border border-slate-100 px-4 py-3 transition",
                      isActive
                        ? "text-black"
                        : index % 2 === 0
                          ? "bg-white hover:bg-slate-50"
                          : "bg-gray-50/50 hover:bg-slate-100"
                    )}
                    style={isActive ? { backgroundColor: '#e6f4f1' } : undefined}
                    onClick={() => onSelectConfig(config.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelectConfig(config.id);
                      }
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-semibold truncate", isActive ? "text-slate-800" : "text-slate-800")}>{config.key}</p>
                      <p className="text-xs text-slate-500 truncate">{scope}</p>
                      {config.deskripsi && (
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">{config.deskripsi}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="secondary" className="rounded-none px-2 py-0.5 text-xs bg-blue-100 text-blue-700">
                          {config.tipe ?? "string"}
                        </Badge>
                        <div className="text-[10px] text-slate-400 text-right">
                          {config.updatedAt ? dateFormatter.format(new Date(config.updatedAt)) : "-"}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {onViewDetail ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 rounded-none hover:bg-blue-100"
                            onClick={(event) => {
                              event.stopPropagation();
                              onViewDetail(config);
                            }}
                            title="Detail"
                          >
                            <Eye className="h-3 w-3 text-blue-600" />
                          </Button>
                        ) : null}
                        {onEditConfig ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 rounded-none hover:bg-green-100"
                            onClick={(event) => {
                              event.stopPropagation();
                              onEditConfig(config);
                            }}
                            title="Edit"
                          >
                            <Edit className="h-3 w-3 text-green-600" />
                          </Button>
                        ) : null}
                        {onDeleteConfig ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 rounded-none hover:bg-red-100"
                            onClick={(event) => {
                              event.stopPropagation();
                              onDeleteConfig(config);
                            }}
                            title="Hapus"
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
