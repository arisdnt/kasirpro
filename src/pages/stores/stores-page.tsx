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
import { useStoresQuery } from "@/features/stores/use-stores";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Building, Filter, Plus, RefreshCw, Search } from "lucide-react";

type StatusFilter = "all" | "aktif" | "nonaktif" | "maintenance";

export function StoresPage() {
  const stores = useStoresQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const data = stores.data ?? [];
    const total = data.length;
    const aktif = data.filter((item) => item.status === "aktif").length;
    const nonaktif = data.filter((item) => item.status === "nonaktif").length;
    const maintenance = data.filter((item) => item.status === "maintenance").length;
    return { total, aktif, nonaktif, maintenance };
  }, [stores.data]);

  const filteredStores = useMemo(() => {
    const data = stores.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nama.toLowerCase().includes(query) ||
          (item.kode ?? "").toLowerCase().includes(query) ||
          (item.alamat ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [stores.data, searchTerm, statusFilter]);

  const selectedStore = useMemo(() => {
    if (!selectedId) return null;
    return filteredStores.find((item) => item.id === selectedId) ?? null;
  }, [filteredStores, selectedId]);

  const handleRefresh = () => {
    stores.refetch();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aktif":
        return "text-green-600 bg-green-50 border-green-200";
      case "nonaktif":
        return "text-slate-600 bg-slate-50 border-slate-200";
      case "maintenance":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
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
                  placeholder="Cari nama, kode, atau alamat toko"
                  className="h-10 rounded-none border-slate-200 pl-9 text-sm text-black shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                  className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <div className="flex gap-3 text-xs text-black">
                <span>Total: <strong>{stats.total}</strong></span>
                <span>Aktif: <strong>{stats.aktif}</strong></span>
                <span>Nonaktif: <strong>{stats.nonaktif}</strong></span>
                <span>Maintenance: <strong>{stats.maintenance}</strong></span>
              </div>
              <Button variant="outline" onClick={handleRefresh} className="gap-2 text-white rounded-none">
                <RefreshCw className="h-4 w-4" />
                Refresh data
              </Button>
              <Button className="gap-2 text-white rounded-none">
                <Plus className="h-4 w-4" />
                Toko baru
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
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Manajemen Toko</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">Daftar Toko</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredStores.length} toko
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {stores.isLoading ? (
                <div className="flex flex-col gap-2 p-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : filteredStores.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <Building className="h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-700">Belum ada toko yang cocok</p>
                  <p className="text-xs text-slate-500">
                    Sesuaikan pencarian atau tambahkan toko baru untuk memulai.
                  </p>
                </div>
              ) : (
                <Table className="min-w-full text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-white/95">
                    <TableRow className="border-b border-slate-200">
                      <TableHead className="w-[25%] text-slate-500">Nama Toko</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Kode</TableHead>
                      <TableHead className="w-[25%] text-slate-500">Alamat</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Zona Waktu</TableHead>
                      <TableHead className="w-[10%] text-slate-500">Status</TableHead>
                      <TableHead className="w-[10%] text-slate-500">Dibuat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStores.map((item) => (
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
                            {item.nama}
                          </span>
                        </TableCell>
                        <TableCell className={cn(
                          "align-top font-mono text-xs",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.kode ?? "-"}
                        </TableCell>
                        <TableCell className={cn(
                          "align-top",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.alamat ?? "-"}
                        </TableCell>
                        <TableCell className={cn(
                          "align-top",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.timezone ?? "-"}
                        </TableCell>
                        <TableCell className="align-top">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-semibold border capitalize",
                            getStatusColor(item.status)
                          )}>
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell className={cn(
                          "align-top text-xs",
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
        </div>

        <div className="w-full lg:w-1/4">
          <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Toko</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">
                {selectedStore ? selectedStore.nama : "Pilih toko"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            {selectedStore ? (
              <>
                <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
                  <dl className="space-y-3 text-sm text-slate-600">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Nama Toko</dt>
                      <dd className="font-bold text-lg text-slate-900">{selectedStore.nama}</dd>
                    </div>
                    {selectedStore.kode && (
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-500">Kode</dt>
                        <dd className="font-mono text-slate-900">{selectedStore.kode}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
                      <dd>
                        <span className={cn(
                          "px-3 py-1 rounded text-sm font-semibold border capitalize",
                          getStatusColor(selectedStore.status)
                        )}>
                          {selectedStore.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-800">
                      Informasi Toko
                    </span>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-4">
                      <div className="space-y-4 text-sm">
                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Alamat</span>
                          <p className="text-slate-700">{selectedStore.alamat ?? "Tidak ada alamat"}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs uppercase tracking-wide text-slate-500">Telepon</span>
                            <p className="text-slate-700">{selectedStore.telepon ?? "-"}</p>
                          </div>
                          <div>
                            <span className="text-xs uppercase tracking-wide text-slate-500">Email</span>
                            <p className="text-slate-700">{selectedStore.email ?? "-"}</p>
                          </div>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Zona Waktu</span>
                          <p className="text-slate-700">{selectedStore.timezone ?? "Asia/Jakarta"}</p>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Mata Uang</span>
                          <p className="text-slate-700">{selectedStore.mataUang ?? "IDR"}</p>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Dibuat</span>
                          <p className="text-slate-700">{formatDateTime(selectedStore.createdAt)}</p>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">ID Toko</span>
                          <p className="font-mono text-slate-700">{selectedStore.id}</p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
                <Building className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih toko untuk melihat detail</p>
                <p className="text-xs text-slate-500">
                  Klik salah satu baris toko untuk melihat informasi lengkap.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}