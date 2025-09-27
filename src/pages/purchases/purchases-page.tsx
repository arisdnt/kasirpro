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
import { usePurchasesQuery, usePurchaseItemsQuery } from "@/features/purchases/use-purchases";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Filter, Package2, Plus, RefreshCw, Search } from "lucide-react";

// Align with public.transaksi_pembelian.status enum: draft, diterima, sebagian, selesai, batal
type StatusFilter = "all" | "draft" | "diterima" | "sebagian" | "selesai" | "batal";

export function PurchasesPage() {
  const purchases = usePurchasesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const purchaseItems = usePurchaseItemsQuery(selectedId);

  const stats = useMemo(() => {
    const data = purchases.data ?? [];
    const total = data.length;
    const draft = data.filter((item) => item.status === "draft").length;
    const diterima = data.filter((item) => item.status === "diterima").length;
    const sebagian = data.filter((item) => item.status === "sebagian").length;
    const selesai = data.filter((item) => item.status === "selesai").length;
    const batal = data.filter((item) => item.status === "batal").length;
    return { total, draft, diterima, sebagian, selesai, batal };
  }, [purchases.data]);

  const filteredPurchases = useMemo(() => {
    const data = purchases.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nomorTransaksi.toLowerCase().includes(query) ||
          item.supplierNama.toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [purchases.data, searchTerm, statusFilter]);

  const selectedPurchase = useMemo(() => {
    if (!selectedId) return null;
    return filteredPurchases.find((item) => item.id === selectedId) ?? null;
  }, [filteredPurchases, selectedId]);

  const handleRefresh = () => {
    purchases.refetch();
  };

  const getStatusColor = (status: string) => {
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
                  placeholder="Cari nomor transaksi atau supplier"
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
              </div>
              <Button
                onClick={handleRefresh}
                className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70"
                disabled={purchases.isFetching}
              >
                <RefreshCw className={cn("h-4 w-4", purchases.isFetching && "animate-spin")} />
                Refresh data
              </Button>
              <Button className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]" disabled>
                <Plus className="h-4 w-4" />
                Pembelian baru
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <Card className="flex flex-1 min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Transaksi Pembelian</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">Daftar Pembelian</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredPurchases.length} transaksi
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {purchases.isLoading ? (
                <div className="flex flex-col gap-2 p-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : filteredPurchases.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <Package2 className="h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-700">Belum ada transaksi pembelian yang cocok</p>
                  <p className="text-xs text-slate-500">
                    Sesuaikan pencarian atau buat transaksi pembelian baru untuk memulai.
                  </p>
                </div>
              ) : (
                <Table className="min-w-full text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-white/95">
                    <TableRow className="border-b border-slate-200">
                      <TableHead className="w-[25%] text-slate-500">No. Transaksi</TableHead>
                      <TableHead className="w-[25%] text-slate-500">Supplier</TableHead>
                      <TableHead className="w-[20%] text-slate-500">Total</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Status</TableHead>
                      <TableHead className="w-[15%] text-slate-500">Tanggal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPurchases.map((item) => (
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
                            "px-2 py-1 rounded text-xs font-semibold border",
                            getStatusColor(item.status ?? "")
                          )}>
                            {item.status ?? "-"}
                          </span>
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

        <Card className="flex w-full shrink-0 flex-col border border-primary/10 bg-white shadow-sm lg:w-[400px] rounded-none">
          <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
            {selectedPurchase ? (
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="bg-white p-6 font-mono text-sm">
                    <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                      <h1 className="text-xl font-bold mb-2">KASIR PRO</h1>
                      <p className="text-xs">Jl. Contoh No. 123, Kota</p>
                      <p className="text-xs">Telp: (021) 123-4567</p>
                      <div className="mt-3 pt-2 border-t border-gray-300">
                        <p className="font-bold">BUKTI PEMBELIAN</p>
                      </div>
                    </div>

                    <div className="mb-4 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>No. Transaksi</span>
                        <span className="font-bold">{selectedPurchase.nomorTransaksi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tanggal</span>
                        <span>{formatDateTime(selectedPurchase.tanggal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Supplier</span>
                        <span>{selectedPurchase.supplierNama}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold border",
                          getStatusColor(selectedPurchase.status ?? "")
                        )}>{selectedPurchase.status ?? "-"}</span>
                      </div>
                    </div>

                    <div className="border-t-2 border-b-2 border-dashed border-gray-400 py-2">
                      <div className="text-xs font-bold mb-2 grid grid-cols-12 gap-1">
                        <div className="col-span-6">ITEM</div>
                        <div className="col-span-2 text-center">QTY</div>
                        <div className="col-span-2 text-right">HARGA</div>
                        <div className="col-span-2 text-right">TOTAL</div>
                      </div>

                      {purchaseItems.isLoading ? (
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
                          {purchaseItems.data?.map((item) => (
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

                    <div className="mt-4 space-y-1 text-xs">
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span>Subtotal</span>
                        <span className="font-bold">{formatCurrency(selectedPurchase.total).replace('Rp ', '')}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-b-2 border-dashed border-gray-400 pb-2">
                        <span>TOTAL</span>
                        <span>Rp {formatCurrency(selectedPurchase.total).replace('Rp ', '')}</span>
                      </div>
                    </div>

                    <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-gray-400">
                      <p className="text-xs">Terima kasih</p>
                      <p className="text-xs">Simpan bukti pembelian ini untuk arsip</p>
                      <p className="text-xs mt-2">== KASIR PRO ==</p>
                    </div>

                    <div className="text-center mt-4 pt-2 border-t border-gray-300">
                      <p className="text-xs text-gray-600">ID: {selectedPurchase.id}</p>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
                <Package2 className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih transaksi untuk melihat bukti pembelian</p>
                <p className="text-xs text-slate-500">
                  Klik salah satu baris untuk melihat rincian item dalam bentuk invoice.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
