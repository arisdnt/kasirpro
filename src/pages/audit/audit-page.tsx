import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuditLogsQuery } from "@/features/audit/use-audit";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ClipboardList, Filter, RefreshCw, Search } from "lucide-react";

type ActionFilter = "all" | "INSERT" | "UPDATE" | "DELETE";

export function AuditPage() {
  const audits = useAuditLogsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const data = audits.data ?? [];
    const total = data.length;
    const insert = data.filter((item) => item.aksi === "INSERT").length;
    const update = data.filter((item) => item.aksi === "UPDATE").length;
    const deleteCount = data.filter((item) => item.aksi === "DELETE").length;
    return { total, insert, update, delete: deleteCount };
  }, [audits.data]);

  const filteredAudits = useMemo(() => {
    const data = audits.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.tabel.toLowerCase().includes(query) ||
          (item.userId ?? "").toLowerCase().includes(query);
        const matchesAction =
          actionFilter === "all" ||
          item.aksi === actionFilter;
        return matchesSearch && matchesAction;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [audits.data, searchTerm, actionFilter]);

  const selectedAudit = useMemo(() => {
    if (!selectedId) return null;
    return filteredAudits.find((item) => item.id === selectedId) ?? null;
  }, [filteredAudits, selectedId]);

  const handleRefresh = () => {
    audits.refetch();
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "INSERT":
        return "text-green-600 bg-green-50 border-green-200";
      case "UPDATE":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "DELETE":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
        <CardContent className="flex flex-col gap-3 py-4 text-black">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex min-w-[260px] flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Cari tabel atau user ID"
                  className="h-10 rounded-none border-slate-200 pl-9 text-sm text-black shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={actionFilter}
                  onChange={(event) => setActionFilter(event.target.value as ActionFilter)}
                  className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua aksi</option>
                  <option value="INSERT">Insert</option>
                  <option value="UPDATE">Update</option>
                  <option value="DELETE">Delete</option>
                </select>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <div className="flex gap-3 text-xs text-black">
                <span>Total: <strong>{stats.total}</strong></span>
                <span>Insert: <strong>{stats.insert}</strong></span>
                <span>Update: <strong>{stats.update}</strong></span>
                <span>Delete: <strong>{stats.delete}</strong></span>
              </div>
              <Button variant="outline" onClick={handleRefresh} className="gap-2 text-white rounded-none">
                <RefreshCw className="h-4 w-4" />
                Refresh data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Audit Log</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">Jejak Aktivitas</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredAudits.length} aktivitas
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {audits.isLoading ? (
                <div className="flex flex-col gap-2 p-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              ) : filteredAudits.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <ClipboardList className="h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-700">Belum ada aktivitas yang cocok</p>
                  <p className="text-xs text-slate-500">
                    Sesuaikan pencarian atau tunggu aktivitas baru terekam.
                  </p>
                </div>
              ) : (
                <Table className="min-w-full text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-white/95">
                    <TableRow className="border-b border-slate-200">
                      <TableHead className="w-[25%] text-slate-500">Tabel</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Aksi</TableHead>
                      <TableHead className="w-[20%] text-slate-500">User</TableHead>
                      <TableHead className="w-[40%] text-slate-500">Tanggal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAudits.map((item) => (
                      <TableRow
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        data-state={item.id === selectedId ? "selected" : undefined}
                        className={cn(
                          "cursor-pointer border-b border-slate-100 transition",
                          item.id === selectedId ? "!bg-gray-100 text-black" : "hover:bg-slate-50"
                        )}
                      >
                        <TableCell className="align-top">
                          <span className={cn(
                            "font-medium",
                            item.id === selectedId ? "text-black" : "text-slate-900"
                          )}>
                            {item.tabel}
                          </span>
                        </TableCell>
                        <TableCell className="align-top">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-semibold border",
                            getActionColor(item.aksi)
                          )}>
                            {item.aksi}
                          </span>
                        </TableCell>
                        <TableCell className={cn(
                          "align-top",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.userId ?? "system"}
                        </TableCell>
                        <TableCell className={cn(
                          "align-top",
                          item.id === selectedId ? "text-black" : "text-slate-600"
                        )}>
                          {formatDateTime(item.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex w-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm lg:w-[360px] rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Audit</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">
                {selectedAudit ? selectedAudit.tabel : "Pilih aktivitas"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            {selectedAudit ? (
              <>
                <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
                  <dl className="space-y-3 text-sm text-slate-600">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Tabel</dt>
                      <dd className="font-bold text-lg text-slate-900">{selectedAudit.tabel}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Aksi</dt>
                      <dd>
                        <span className={cn(
                          "px-3 py-1 rounded text-sm font-semibold border",
                          getActionColor(selectedAudit.aksi)
                        )}>
                          {selectedAudit.aksi}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">User ID</dt>
                      <dd className="font-medium text-slate-900">{selectedAudit.userId ?? "system"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Waktu</dt>
                      <dd className="text-slate-700">{formatDateTime(selectedAudit.createdAt)}</dd>
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
                        <span className="text-xs uppercase tracking-wide text-slate-500">ID Audit</span>
                        <p className="font-mono text-slate-700">{selectedAudit.id}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Dampak</span>
                        <p className="text-slate-700">
                          {selectedAudit.aksi === "INSERT" && "Data baru ditambahkan ke sistem"}
                          {selectedAudit.aksi === "UPDATE" && "Data existing diperbarui"}
                          {selectedAudit.aksi === "DELETE" && "Data dihapus dari sistem"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
                <ClipboardList className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih aktivitas untuk melihat detail</p>
                <p className="text-xs text-slate-500">
                  Klik salah satu baris untuk melihat informasi lengkap audit log.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}