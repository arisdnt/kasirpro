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
import { useCustomersQuery } from "@/features/customers/use-customers";
import { cn } from "@/lib/utils";
import { Filter, Plus, RefreshCw, Search, Users } from "lucide-react";

type StatusFilter = "all" | "aktif" | "nonaktif";

export function CustomersPage() {
  const customers = useCustomersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const data = customers.data ?? [];
    const total = data.length;
    const aktif = data.filter((item) => item.status === "aktif").length;
    const nonaktif = total - aktif;
    return { total, aktif, nonaktif };
  }, [customers.data]);

  const filteredCustomers = useMemo(() => {
    const data = customers.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nama.toLowerCase().includes(query) ||
          (item.kode ?? "").toLowerCase().includes(query) ||
          (item.telepon ?? "").toLowerCase().includes(query) ||
          (item.email ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [customers.data, searchTerm, statusFilter]);

  const selectedCustomer = useMemo(() => {
    if (!selectedId) return null;
    return filteredCustomers.find((item) => item.id === selectedId) ?? null;
  }, [filteredCustomers, selectedId]);

  const handleRefresh = () => {
    customers.refetch();
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
                  placeholder="Cari nama, kode, telepon, atau email pelanggan"
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
                  <option value="aktif">Pelanggan aktif</option>
                  <option value="nonaktif">Pelanggan nonaktif</option>
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
                Pelanggan baru
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Data Pelanggan</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">Daftar Pelanggan</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredCustomers.length} pelanggan
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {customers.isLoading ? (
                <div className="flex flex-col gap-2 p-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <Users className="h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-700">Belum ada pelanggan yang cocok</p>
                  <p className="text-xs text-slate-500">
                    Sesuaikan pencarian atau tambahkan pelanggan baru untuk memulai.
                  </p>
                </div>
              ) : (
                <Table className="min-w-full text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-white/95">
                    <TableRow className="border-b border-slate-200">
                      <TableHead className="w-[25%] text-slate-500">Nama</TableHead>
                      <TableHead className="w-[20%] text-slate-500">Kontak</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Transaksi</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Poin</TableHead>
                      <TableHead className="w-[25%] text-slate-500">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((item) => (
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
                          <div>
                            <span className={cn(
                              "font-medium",
                              item.id === selectedId ? "text-black" : "text-slate-900"
                            )}>
                              {item.nama}
                            </span>
                            {item.kode && (
                              <p className="text-xs text-slate-500">{item.kode}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex flex-col text-xs text-slate-600">
                            <span>{item.telepon ?? "-"}</span>
                            <span>{item.email ?? "-"}</span>
                          </div>
                        </TableCell>
                        <TableCell className={cn(
                          "align-top font-semibold",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.totalTransaksi?.toLocaleString("id-ID") ?? 0}
                        </TableCell>
                        <TableCell className={cn(
                          "align-top font-semibold",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.poinRewards ?? 0}
                        </TableCell>
                        <TableCell className="align-top">
                          <Badge
                            variant={item.status === "aktif" ? "outline" : "destructive"}
                            className="text-xs rounded-none"
                          >
                            {item.status ?? "-"}
                          </Badge>
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
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Pelanggan</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">
                {selectedCustomer ? selectedCustomer.nama : "Pilih pelanggan"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            {selectedCustomer ? (
              <>
                <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
                  <dl className="space-y-3 text-sm text-slate-600">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Nama</dt>
                      <dd className="font-bold text-lg text-slate-900">{selectedCustomer.nama}</dd>
                    </div>
                    {selectedCustomer.kode && (
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-500">Kode</dt>
                        <dd className="font-medium text-slate-900">{selectedCustomer.kode}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
                      <dd>
                        <Badge
                          variant={selectedCustomer.status === "aktif" ? "outline" : "destructive"}
                          className="text-xs rounded-none"
                        >
                          {selectedCustomer.status ?? "-"}
                        </Badge>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-800">
                      Informasi Kontak & Transaksi
                    </span>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-4">
                      <div className="space-y-4 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs uppercase tracking-wide text-slate-500">Total Transaksi</span>
                            <p className="font-semibold text-lg text-slate-900">
                              {selectedCustomer.totalTransaksi?.toLocaleString("id-ID") ?? 0}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs uppercase tracking-wide text-slate-500">Poin Rewards</span>
                            <p className="font-semibold text-lg text-emerald-600">
                              {selectedCustomer.poinRewards ?? 0}
                            </p>
                          </div>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Telepon</span>
                          <p className="text-slate-700">{selectedCustomer.telepon ?? "Tidak ada"}</p>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Email</span>
                          <p className="text-slate-700">{selectedCustomer.email ?? "Tidak ada"}</p>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Frekuensi Transaksi</span>
                          <p className="text-slate-700">{selectedCustomer.frekuensiTransaksi ?? 0} kali</p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
                <Users className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih pelanggan untuk melihat detail</p>
                <p className="text-xs text-slate-500">
                  Klik salah satu baris pelanggan untuk melihat informasi lengkap.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}