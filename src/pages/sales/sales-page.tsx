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
import { useSalesQuery } from "@/features/sales/use-sales";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Filter, Plus, RefreshCw, Search, ShoppingCart } from "lucide-react";

type PaymentMethodFilter = "all" | "cash" | "card" | "transfer" | "qris";

export function SalesPage() {
  const sales = useSalesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethodFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const data = sales.data ?? [];
    const total = data.length;
    const totalRevenue = data.reduce((sum, item) => sum + item.total, 0);
    const cash = data.filter((item) => item.metodePembayaran === "cash").length;
    const nonCash = total - cash;
    return { total, totalRevenue, cash, nonCash };
  }, [sales.data]);

  const filteredSales = useMemo(() => {
    const data = sales.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nomorTransaksi.toLowerCase().includes(query) ||
          (item.pelangganNama ?? "").toLowerCase().includes(query);
        const matchesPayment =
          paymentFilter === "all" ||
          item.metodePembayaran === paymentFilter;
        return matchesSearch && matchesPayment;
      })
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [sales.data, searchTerm, paymentFilter]);

  const selectedSale = useMemo(() => {
    if (!selectedId) return null;
    return filteredSales.find((item) => item.id === selectedId) ?? null;
  }, [filteredSales, selectedId]);

  const handleRefresh = () => {
    sales.refetch();
  };

  const getPaymentMethodLabel = (method: string | null) => {
    switch (method) {
      case "cash":
        return "Tunai";
      case "card":
        return "Kartu";
      case "transfer":
        return "Transfer";
      case "qris":
        return "QRIS";
      default:
        return "Tidak diketahui";
    }
  };

  const getPaymentMethodColor = (method: string | null) => {
    switch (method) {
      case "cash":
        return "text-green-600 bg-green-50 border-green-200";
      case "card":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "transfer":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "qris":
        return "text-orange-600 bg-orange-50 border-orange-200";
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
                  placeholder="Cari nomor transaksi atau pelanggan"
                  className="h-10 rounded-none border-slate-200 pl-9 text-sm text-black shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={paymentFilter}
                  onChange={(event) => setPaymentFilter(event.target.value as PaymentMethodFilter)}
                  className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua metode</option>
                  <option value="cash">Tunai</option>
                  <option value="card">Kartu</option>
                  <option value="transfer">Transfer</option>
                  <option value="qris">QRIS</option>
                </select>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <div className="flex gap-3 text-xs text-black">
                <span>Total: <strong>{stats.total}</strong></span>
                <span>Tunai: <strong>{stats.cash}</strong></span>
                <span>Non-Tunai: <strong>{stats.nonCash}</strong></span>
                <span>Omzet: <strong>{formatCurrency(stats.totalRevenue)}</strong></span>
              </div>
              <Button variant="outline" onClick={handleRefresh} className="gap-2 text-white rounded-none">
                <RefreshCw className="h-4 w-4" />
                Refresh data
              </Button>
              <Button className="gap-2 text-white rounded-none">
                <Plus className="h-4 w-4" />
                Transaksi baru
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Transaksi Penjualan</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">Riwayat Penjualan</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredSales.length} transaksi
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {sales.isLoading ? (
                <div className="flex flex-col gap-2 p-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : filteredSales.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <ShoppingCart className="h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-700">Belum ada transaksi penjualan yang cocok</p>
                  <p className="text-xs text-slate-500">
                    Sesuaikan pencarian atau buat transaksi baru untuk memulai.
                  </p>
                </div>
              ) : (
                <Table className="min-w-full text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-white/95">
                    <TableRow className="border-b border-slate-200">
                      <TableHead className="w-[20%] text-slate-500">No. Transaksi</TableHead>
                      <TableHead className="w-[20%] text-slate-500">Pelanggan</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Total</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Metode</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Kembalian</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Tanggal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.map((item) => (
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
                            {item.nomorTransaksi}
                          </span>
                        </TableCell>
                        <TableCell className={cn(
                          "align-top",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.pelangganNama ?? "Pelanggan umum"}
                        </TableCell>
                        <TableCell className={cn(
                          "align-top font-semibold",
                          item.id === selectedId ? "text-black" : "text-slate-900"
                        )}>
                          {formatCurrency(item.total)}
                        </TableCell>
                        <TableCell className="align-top">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-semibold border",
                            getPaymentMethodColor(item.metodePembayaran)
                          )}>
                            {getPaymentMethodLabel(item.metodePembayaran)}
                          </span>
                        </TableCell>
                        <TableCell className={cn(
                          "align-top font-medium",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.kembalian ? formatCurrency(item.kembalian) : "-"}
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
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Transaksi</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">
                {selectedSale ? selectedSale.nomorTransaksi : "Pilih transaksi"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            {selectedSale ? (
              <>
                <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
                  <dl className="space-y-3 text-sm text-slate-600">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">No. Transaksi</dt>
                      <dd className="font-bold text-lg text-slate-900">{selectedSale.nomorTransaksi}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Pelanggan</dt>
                      <dd className="font-semibold text-slate-900">{selectedSale.pelangganNama ?? "Pelanggan umum"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Metode Pembayaran</dt>
                      <dd>
                        <span className={cn(
                          "px-3 py-1 rounded text-sm font-semibold border",
                          getPaymentMethodColor(selectedSale.metodePembayaran)
                        )}>
                          {getPaymentMethodLabel(selectedSale.metodePembayaran)}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Total</dt>
                      <dd className="font-bold text-2xl text-emerald-600">{formatCurrency(selectedSale.total)}</dd>
                    </div>
                  </dl>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-800">
                      Detail Pembayaran
                    </span>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Dibayar</span>
                          <p className="font-semibold text-lg text-slate-900">
                            {selectedSale.bayar ? formatCurrency(selectedSale.bayar) : formatCurrency(selectedSale.total)}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Kembalian</span>
                          <p className="font-semibold text-lg text-blue-600">
                            {selectedSale.kembalian ? formatCurrency(selectedSale.kembalian) : formatCurrency(0)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Tanggal & Waktu</span>
                        <p className="text-slate-700">{formatDateTime(selectedSale.tanggal)}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">ID Transaksi</span>
                        <p className="font-mono text-slate-700">{selectedSale.id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
                <ShoppingCart className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih transaksi untuk melihat detail</p>
                <p className="text-xs text-slate-500">
                  Klik salah satu baris untuk melihat informasi lengkap transaksi penjualan.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}