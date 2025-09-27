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
import { useSalesQuery, useSaleItemsQuery } from "@/features/sales/use-sales";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Filter, RefreshCw, Search, ShoppingCart } from "lucide-react";

type PaymentMethodFilter = "all" | "cash" | "card" | "transfer" | "qris";

export function SalesPage() {
  const sales = useSalesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethodFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const saleItems = useSaleItemsQuery(selectedId);

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
            <div className="flex flex-1 items-center justify-end gap-4">
              <div className="flex items-center gap-4 text-xs text-black bg-slate-50 px-3 py-1.5 rounded border h-10">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-slate-600 text-[10px] leading-none">Total</span>
                  <span className="font-bold text-sm text-slate-900 leading-none">{stats.total}</span>
                </div>
                <div className="w-px h-6 bg-slate-300"></div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-slate-600 text-[10px] leading-none">Tunai</span>
                  <span className="font-bold text-sm text-green-600 leading-none">{stats.cash}</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-slate-600 text-[10px] leading-none">Non-Tunai</span>
                  <span className="font-bold text-sm text-blue-600 leading-none">{stats.nonCash}</span>
                </div>
                <div className="w-px h-6 bg-slate-300"></div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-slate-600 text-[10px] leading-none">Omzet</span>
                  <span className="font-bold text-sm text-emerald-600 leading-none">{formatCurrency(stats.totalRevenue)}</span>
                </div>
              </div>
              <Button onClick={handleRefresh} className="gap-2 text-white rounded-none" style={{ backgroundColor: '#476EAE' }}>
                <RefreshCw className="h-4 w-4" />
                Refresh data
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
                    {filteredSales.map((item, index) => (
                      <TableRow
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        data-state={item.id === selectedId ? "selected" : undefined}
                        className={cn(
                          "cursor-pointer border-b border-slate-100 transition h-14",
                          item.id === selectedId
                            ? "!bg-gray-100 text-black"
                            : index % 2 === 0
                              ? "bg-white hover:bg-slate-50"
                              : "bg-gray-50/50 hover:bg-slate-100"
                        )}
                      >
                        <TableCell className="align-middle py-4">
                          <span className={cn(
                            "font-medium",
                            item.id === selectedId ? "text-black" : "text-slate-900"
                          )}>
                            {item.nomorTransaksi}
                          </span>
                        </TableCell>
                        <TableCell className={cn(
                          "align-middle py-4",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.pelangganNama ?? "Pelanggan umum"}
                        </TableCell>
                        <TableCell className={cn(
                          "align-middle py-4 font-semibold",
                          item.id === selectedId ? "text-black" : "text-slate-900"
                        )}>
                          {formatCurrency(item.total)}
                        </TableCell>
                        <TableCell className="align-middle py-4">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-semibold border",
                            getPaymentMethodColor(item.metodePembayaran)
                          )}>
                            {getPaymentMethodLabel(item.metodePembayaran)}
                          </span>
                        </TableCell>
                        <TableCell className={cn(
                          "align-middle py-4 font-medium",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.kembalian ? formatCurrency(item.kembalian) : "-"}
                        </TableCell>
                        <TableCell className={cn(
                          "align-middle py-4 text-xs",
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
        </div>

        <div className="w-full lg:w-1/4">
          <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white shadow-sm rounded-none">
          <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
            {selectedSale ? (
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  {/* Invoice Container */}
                  <div className="bg-white p-6 font-mono text-sm">
                    {/* Invoice Header */}
                    <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                      <h1 className="text-xl font-bold mb-2">KASIR PRO</h1>
                      <p className="text-xs">Jl. Contoh No. 123, Kota</p>
                      <p className="text-xs">Telp: (021) 123-4567</p>
                      <div className="mt-3 pt-2 border-t border-gray-300">
                        <p className="font-bold">STRUK PENJUALAN</p>
                      </div>
                    </div>

                    {/* Transaction Info */}
                    <div className="mb-4 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>No. Transaksi</span>
                        <span className="font-bold">{selectedSale.nomorTransaksi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tanggal</span>
                        <span>{formatDateTime(selectedSale.tanggal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pelanggan</span>
                        <span>{selectedSale.pelangganNama ?? "Umum"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kasir</span>
                        <span>Admin</span>
                      </div>
                    </div>

                    {/* Items Table */}
                    <div className="border-t-2 border-b-2 border-dashed border-gray-400 py-2">
                      <div className="text-xs font-bold mb-2 grid grid-cols-12 gap-1">
                        <div className="col-span-6">ITEM</div>
                        <div className="col-span-2 text-center">QTY</div>
                        <div className="col-span-2 text-right">HARGA</div>
                        <div className="col-span-2 text-right">TOTAL</div>
                      </div>

                      {saleItems.isLoading ? (
                        <div className="space-y-2">
                          {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="grid grid-cols-12 gap-1 text-xs">
                              <div className="col-span-6">
                                <Skeleton className="h-3 w-full" />
                              </div>
                              <div className="col-span-2">
                                <Skeleton className="h-3 w-full" />
                              </div>
                              <div className="col-span-2">
                                <Skeleton className="h-3 w-full" />
                              </div>
                              <div className="col-span-2">
                                <Skeleton className="h-3 w-full" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {saleItems.data?.map((item) => (
                            <div key={item.id}>
                              <div className="grid grid-cols-12 gap-1 text-xs">
                                <div className="col-span-6 truncate">
                                  {item.produkNama}
                                </div>
                                <div className="col-span-2 text-center">
                                  {item.qty}
                                </div>
                                <div className="col-span-2 text-right">
                                  {formatCurrency(item.hargaSatuan).replace('Rp ', '')}
                                </div>
                                <div className="col-span-2 text-right">
                                  {formatCurrency(item.subtotal).replace('Rp ', '')}
                                </div>
                              </div>
                              {item.produkKode && (
                                <div className="text-xs text-gray-600 ml-0">
                                  [{item.produkKode}]
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Totals */}
                    <div className="mt-4 space-y-1 text-xs">
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span>Subtotal</span>
                        <span className="font-bold">{formatCurrency(selectedSale.total).replace('Rp ', '')}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-b-2 border-dashed border-gray-400 pb-2">
                        <span>TOTAL</span>
                        <span>Rp {formatCurrency(selectedSale.total).replace('Rp ', '')}</span>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="mt-4 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Metode Bayar</span>
                        <span className="font-bold">{getPaymentMethodLabel(selectedSale.metodePembayaran)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bayar</span>
                        <span>{formatCurrency(selectedSale.bayar ?? selectedSale.total).replace('Rp ', '')}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Kembalian</span>
                        <span>{formatCurrency(selectedSale.kembalian ?? 0).replace('Rp ', '')}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-gray-400">
                      <p className="text-xs">Terima kasih atas kunjungan Anda</p>
                      <p className="text-xs">Barang yang sudah dibeli tidak dapat ditukar</p>
                      <p className="text-xs mt-2">== KASIR PRO ==</p>
                    </div>

                    {/* Transaction ID Footer */}
                    <div className="text-center mt-4 pt-2 border-t border-gray-300">
                      <p className="text-xs text-gray-600">ID: {selectedSale.id}</p>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
                <ShoppingCart className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih transaksi untuk melihat invoice</p>
                <p className="text-xs text-slate-500">
                  Klik salah satu baris untuk melihat struk penjualan.
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