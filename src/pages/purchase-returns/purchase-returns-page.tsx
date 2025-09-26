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
import { usePurchaseReturnsQuery } from "@/features/purchase-returns/use-purchase-returns";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowLeftRight, Filter, Plus, RefreshCw, Search } from "lucide-react";

// Align with public.retur_pembelian.status enum: draft, diterima, sebagian, selesai, batal
type StatusFilter = "all" | "draft" | "diterima" | "sebagian" | "selesai" | "batal";

export function PurchaseReturnsPage() {
  const purchaseReturns = usePurchaseReturnsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const data = purchaseReturns.data ?? [];
    const total = data.length;
    const draft = data.filter((item) => item.status === "draft").length;
    const diterima = data.filter((item) => item.status === "diterima").length;
    const sebagian = data.filter((item) => item.status === "sebagian").length;
    const selesai = data.filter((item) => item.status === "selesai").length;
    const batal = data.filter((item) => item.status === "batal").length;
    const totalValue = data.reduce((sum, item) => sum + item.total, 0);
    return { total, draft, diterima, sebagian, selesai, batal, totalValue };
  }, [purchaseReturns.data]);

  const filteredReturns = useMemo(() => {
    const data = purchaseReturns.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nomorRetur.toLowerCase().includes(query) ||
          item.supplierNama.toLowerCase().includes(query) ||
          (item.alasan ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [purchaseReturns.data, searchTerm, statusFilter]);

  const selectedReturn = useMemo(() => {
    if (!selectedId) return null;
    return filteredReturns.find((item) => item.id === selectedId) ?? null;
  }, [filteredReturns, selectedId]);

  const handleRefresh = () => {
    purchaseReturns.refetch();
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "selesai":
        return "text-green-600 bg-green-50 border-green-200";
      case "diterima":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "sebagian":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "draft":
        return "text-slate-600 bg-slate-50 border-slate-200";
      case "batal":
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
                  placeholder="Cari nomor retur, supplier, atau alasan"
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
                  <option value="draft">Draft</option>
                  <option value="diterima">Diterima</option>
                  <option value="sebagian">Sebagian</option>
                  <option value="selesai">Selesai</option>
                  <option value="batal">Dibatalkan</option>
                </select>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <div className="flex gap-3 text-xs text-black">
                <span>Total: <strong>{stats.total}</strong></span>
                <span>Draft: <strong>{stats.draft}</strong></span>
                <span>Diterima: <strong>{stats.diterima}</strong></span>
                <span>Sebagian: <strong>{stats.sebagian}</strong></span>
                <span>Selesai: <strong>{stats.selesai}</strong></span>
                <span>Nilai: <strong>{formatCurrency(stats.totalValue)}</strong></span>
              </div>
              <Button
                onClick={handleRefresh}
                className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70"
                disabled={purchaseReturns.isFetching}
              >
                <RefreshCw className={cn("h-4 w-4", purchaseReturns.isFetching && "animate-spin")} />
                Refresh data
              </Button>
              <Button className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]" disabled>
                <Plus className="h-4 w-4" />
                Retur baru
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Retur Pembelian</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">Daftar Retur</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredReturns.length} retur
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {purchaseReturns.isLoading ? (
                <div className="flex flex-col gap-2 p-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : filteredReturns.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <ArrowLeftRight className="h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-700">Belum ada retur pembelian yang cocok</p>
                  <p className="text-xs text-slate-500">
                    Sesuaikan pencarian atau buat retur pembelian baru untuk memulai.
                  </p>
                </div>
              ) : (
                <Table className="min-w-full text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-white/95">
                    <TableRow className="border-b border-slate-200">
                      <TableHead className="w-[20%] text-slate-500">Nomor Retur</TableHead>
                      <TableHead className="w-[20%] text-slate-500">Supplier</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Total</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Status</TableHead>
                      <TableHead className="w-[20%] text-slate-500">Alasan</TableHead>
                      <TableHead className="w-[10%] text-slate-500">Tanggal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReturns.map((item) => (
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
                            "font-medium font-mono text-xs",
                            item.id === selectedId ? "text-black" : "text-slate-900"
                          )}>
                            {item.nomorRetur}
                          </span>
                        </TableCell>
                        <TableCell className={cn(
                          "align-top",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.supplierNama}
                        </TableCell>
                        <TableCell className={cn(
                          "align-top font-semibold",
                          item.id === selectedId ? "text-black" : "text-slate-900"
                        )}>
                          {formatCurrency(item.total)}
                        </TableCell>
                        <TableCell className="align-top">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-semibold border capitalize",
                            getStatusColor(item.status)
                          )}>
                            {item.status ?? "Unknown"}
                          </span>
                        </TableCell>
                        <TableCell className={cn(
                          "align-top max-w-32 truncate",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.alasan ?? "-"}
                        </TableCell>
                        <TableCell className={cn(
                          "align-top text-xs",
                          item.id === selectedId ? "text-black" : "text-slate-600"
                        )}>
                          {formatDateTime(item.tanggal)}
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
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Retur</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">
                {selectedReturn ? selectedReturn.nomorRetur : "Pilih retur"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            {selectedReturn ? (
              <>
                <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
                  <dl className="space-y-3 text-sm text-slate-600">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Nomor Retur</dt>
                      <dd className="font-bold text-lg font-mono text-slate-900">{selectedReturn.nomorRetur}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
                      <dd>
                        <span className={cn(
                          "px-3 py-1 rounded text-sm font-semibold border capitalize",
                          getStatusColor(selectedReturn.status)
                        )}>
                          {selectedReturn.status ?? "Unknown"}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Total Retur</dt>
                      <dd className="font-bold text-xl text-slate-900">{formatCurrency(selectedReturn.total)}</dd>
                    </div>
                  </dl>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-800">
                      Informasi Retur
                    </span>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-4">
                      <div className="space-y-4 text-sm">
                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Supplier</span>
                          <p className="text-slate-700 font-medium">{selectedReturn.supplierNama}</p>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Tanggal Retur</span>
                          <p className="text-slate-700">{formatDateTime(selectedReturn.tanggal)}</p>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Alasan Retur</span>
                          <p className="text-slate-700">
                            {selectedReturn.alasan ?? "Tidak ada alasan yang dicantumkan"}
                          </p>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Dibuat</span>
                          <p className="text-slate-700">{formatDateTime(selectedReturn.createdAt)}</p>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Terakhir Diupdate</span>
                          <p className="text-slate-700">{formatDateTime(selectedReturn.updatedAt)}</p>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">ID Retur</span>
                          <p className="font-mono text-slate-700">{selectedReturn.id}</p>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">ID Supplier</span>
                          <p className="font-mono text-slate-700">{selectedReturn.supplierId}</p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
                <ArrowLeftRight className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih retur untuk melihat detail</p>
                <p className="text-xs text-slate-500">
                  Klik salah satu baris retur untuk melihat informasi lengkap.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
