import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuppliersQuery } from "@/features/suppliers/use-suppliers";
import { cn } from "@/lib/utils";
import { Factory, Filter, Plus, RefreshCw, Search } from "lucide-react";

type StatusFilter = "all" | "aktif" | "nonaktif";

export function SuppliersPage() {
  const suppliers = useSuppliersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const data = suppliers.data ?? [];
    const total = data.length;
    const aktif = data.filter((item) => item.status === "aktif").length;
    const nonaktif = total - aktif;
    return { total, aktif, nonaktif };
  }, [suppliers.data]);

  const filteredSuppliers = useMemo(() => {
    const data = suppliers.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nama.toLowerCase().includes(query) ||
          (item.kode ?? "").toLowerCase().includes(query) ||
          (item.kontakPerson ?? "").toLowerCase().includes(query) ||
          (item.kota ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [suppliers.data, searchTerm, statusFilter]);

  const selectedSupplier = useMemo(() => {
    if (!selectedId) return null;
    return filteredSuppliers.find((item) => item.id === selectedId) ?? null;
  }, [filteredSuppliers, selectedId]);

  const handleRefresh = () => {
    suppliers.refetch();
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
                  placeholder="Cari nama, kode, kontak, atau kota supplier"
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
                  <option value="aktif">Supplier aktif</option>
                  <option value="nonaktif">Supplier nonaktif</option>
                </select>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <div className="flex gap-3 text-xs text-black">
                <span>Total: <strong>{stats.total}</strong></span>
                <span>Aktif: <strong>{stats.aktif}</strong></span>
                <span>Nonaktif: <strong>{stats.nonaktif}</strong></span>
              </div>
              <Button variant="outline" onClick={handleRefresh} className="gap-2 text-white rounded-none">
                <RefreshCw className="h-4 w-4" />
                Refresh data
              </Button>
              <Button className="gap-2 text-white rounded-none">
                <Plus className="h-4 w-4" />
                Supplier baru
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Data Supplier</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">Supplier Aktif</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredSuppliers.length} supplier
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {suppliers.isLoading ? (
                <div className="flex flex-col gap-2 p-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-20 w-full rounded-lg" />
                  ))}
                </div>
              ) : filteredSuppliers.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <Factory className="h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-700">Belum ada supplier yang cocok</p>
                  <p className="text-xs text-slate-500">
                    Sesuaikan pencarian atau tambahkan supplier baru untuk memulai.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 p-4 md:grid-cols-2">
                  {filteredSuppliers.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={cn(
                        "cursor-pointer rounded-none border border-primary/10 bg-white/80 px-4 py-3 text-sm shadow-sm transition",
                        item.id === selectedId
                          ? "!bg-gray-100 border-gray-300"
                          : "hover:bg-slate-50 hover:border-primary/20"
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={cn(
                          "font-semibold leading-none",
                          item.id === selectedId ? "text-black" : "text-slate-900"
                        )}>
                          {item.nama}
                        </h3>
                        <Badge
                          variant={item.status === "aktif" ? "outline" : "destructive"}
                          className="text-xs rounded-none"
                        >
                          {item.status ?? "-"}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <p className={cn(
                          "text-xs",
                          item.id === selectedId ? "text-gray-700" : "text-slate-600"
                        )}>
                          Kontak: {item.kontakPerson ?? "-"} • {item.telepon ?? "-"}
                        </p>
                        <p className={cn(
                          "text-xs",
                          item.id === selectedId ? "text-gray-700" : "text-slate-600"
                        )}>
                          Wilayah: {item.kota ?? "-"}, {item.provinsi ?? "-"}
                        </p>
                        {item.kode && (
                          <p className={cn(
                            "text-xs",
                            item.id === selectedId ? "text-gray-600" : "text-slate-500"
                          )}>
                            Kode: {item.kode}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex w-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm lg:w-[360px] rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Supplier</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">
                {selectedSupplier ? selectedSupplier.nama : "Pilih supplier"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            {selectedSupplier ? (
              <>
                <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
                  <dl className="space-y-3 text-sm text-slate-600">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Nama Supplier</dt>
                      <dd className="font-bold text-lg text-slate-900">{selectedSupplier.nama}</dd>
                    </div>
                    {selectedSupplier.kode && (
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-500">Kode</dt>
                        <dd className="font-medium text-slate-900">{selectedSupplier.kode}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
                      <dd>
                        <Badge
                          variant={selectedSupplier.status === "aktif" ? "outline" : "destructive"}
                          className="text-xs rounded-none"
                        >
                          {selectedSupplier.status ?? "-"}
                        </Badge>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-800">
                      Informasi Kontak & Lokasi
                    </span>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="space-y-4 text-sm">
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Kontak Person</span>
                        <p className="font-semibold text-slate-900">{selectedSupplier.kontakPerson ?? "Tidak ada"}</p>
                      </div>

                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Telepon</span>
                        <p className="text-slate-700">{selectedSupplier.telepon ?? "Tidak ada"}</p>
                      </div>

                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Email</span>
                        <p className="text-slate-700">{selectedSupplier.email ?? "Tidak ada"}</p>
                      </div>

                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Kota</span>
                        <p className="text-slate-700">{selectedSupplier.kota ?? "Tidak diketahui"}</p>
                      </div>

                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Provinsi</span>
                        <p className="text-slate-700">{selectedSupplier.provinsi ?? "Tidak diketahui"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
                <Factory className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih supplier untuk melihat detail</p>
                <p className="text-xs text-slate-500">
                  Klik salah satu kartu supplier untuk melihat informasi lengkap.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}