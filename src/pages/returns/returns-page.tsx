import React, { useMemo, useState } from "react";
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
import { useCreateSalesReturnDraft, useSalesReturnsQuery } from "@/features/returns/use-returns";
import {
  useAddReturnItem,
  useDeleteReturn,
  useDeleteReturnItem,
  useReturnItemsQuery,
  useSaleItemsWithReturnableQuery,
  useUpdateReturnHeader,
  useUpdateReturnItem,
} from "@/features/returns/use-return-items";
import { useSalesQuery } from "@/features/sales/use-sales";
import { toast } from "sonner";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ClipboardList, Filter, Plus, RefreshCw, Search, Eye, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type StatusFilter = "all" | "draft" | "diterima" | "sebagian" | "selesai" | "batal";

const getStatusColor = (status: string) => {
  switch (status) {
    case "selesai":
      return "text-green-600 bg-green-50 border-green-200";
    case "draft":
    case "sebagian":
    case "diterima":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "batal":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
};

export function ReturnsPage() {
  const returns = useSalesReturnsQuery();
  const createDraft = useCreateSalesReturnDraft();
  const sales = useSalesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSaleId, setSelectedSaleId] = useState<string>("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedModalSaleId, setSelectedModalSaleId] = useState<string>("");
  const [showItemSelectionDialog, setShowItemSelectionDialog] = useState(false);
  const [selectedSaleForItems, setSelectedSaleForItems] = useState<string>("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReturnForAction, setSelectedReturnForAction] = useState<string>("");

  const stats = useMemo(() => {
    const data = returns.data ?? [];
    const total = data.length;
    const draft = data.filter((item) => item.status === "draft").length;
    const selesai = data.filter((item) => item.status === "selesai").length;
    const batal = data.filter((item) => item.status === "batal").length;
    return { total, draft, selesai, batal };
  }, [returns.data]);

  const filteredReturns = useMemo(() => {
    const data = returns.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nomorRetur.toLowerCase().includes(query) ||
          (item.pelangganNama ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [returns.data, searchTerm, statusFilter]);

  const selectedReturn = useMemo(() => {
    if (!selectedId) return null;
    return filteredReturns.find((item) => item.id === selectedId) ?? null;
  }, [filteredReturns, selectedId]);

  const handleRefresh = () => {
    returns.refetch();
  };

  return (
    <>
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
                  placeholder="Cari nomor retur atau pelanggan"
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
                <span>Selesai: <strong>{stats.selesai}</strong></span>
                <span>Batal: <strong>{stats.batal}</strong></span>
              </div>
              <Button
                onClick={handleRefresh}
                className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] disabled:bg-[#476EAE]/70"
                disabled={returns.isFetching}
              >
                <RefreshCw className={cn("h-4 w-4", returns.isFetching && "animate-spin")} />
                Refresh data
              </Button>
              <Button
                className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
                onClick={() => {
                  // Prefill the most recent sale if available
                  const first = (sales.data ?? [])[0];
                  setSelectedModalSaleId(first?.id ?? "");
                  setShowCreateDialog(true);
                }}
              >
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
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Retur Penjualan</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">Daftar Retur</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredReturns.length} retur
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {returns.isLoading ? (
                <div className="flex flex-col gap-2 p-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : filteredReturns.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
                  <ClipboardList className="h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-700">Belum ada retur penjualan yang cocok</p>
                  <p className="text-xs text-slate-500">
                    Sesuaikan pencarian atau buat retur baru untuk memulai.
                  </p>
                </div>
              ) : (
                <Table className="min-w-full text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-white/95">
                    <TableRow className="border-b border-slate-200">
                      <TableHead className="w-[18%] text-slate-500">No. Retur</TableHead>
                      <TableHead className="w-[18%] text-slate-500">No. Transaksi</TableHead>
                      <TableHead className="w-[18%] text-slate-500">Pelanggan</TableHead>
                      <TableHead className="w-[13%] text-slate-500">Total</TableHead>
                      <TableHead className="w-[13%] text-slate-500">Status</TableHead>
                      <TableHead className="w-[10%] text-slate-500">Tanggal</TableHead>
                      <TableHead className="w-[10%] text-slate-500">Aksi</TableHead>
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
                            "font-medium",
                            item.id === selectedId ? "text-black" : "text-slate-900"
                          )}>
                            {item.nomorRetur}
                          </span>
                        </TableCell>
                        <TableCell className={cn(
                          "align-top",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.nomorTransaksiPenjualan ?? "-"}
                        </TableCell>
                        <TableCell className={cn(
                          "align-top",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.pelangganNama ?? "Tanpa pelanggan"}
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
                        <TableCell className="align-top">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-none hover:bg-blue-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReturnForAction(item.id);
                                setShowDetailModal(true);
                              }}
                            >
                              <Eye className="h-3 w-3 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-none hover:bg-green-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReturnForAction(item.id);
                                setShowEditModal(true);
                              }}
                            >
                              <Edit className="h-3 w-3 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-none hover:bg-red-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReturnForAction(item.id);
                                setShowDeleteModal(true);
                              }}
                            >
                              <Trash2 className="h-3 w-3 text-red-600" />
                            </Button>
                          </div>
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
            {selectedReturn ? (
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  {/* Return Invoice Container */}
                  <div className="bg-white p-6 font-mono text-sm">
                    {/* Invoice Header */}
                    <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                      <h1 className="text-xl font-bold mb-2">KASIR PRO</h1>
                      <p className="text-xs">Jl. Contoh No. 123, Kota</p>
                      <p className="text-xs">Telp: (021) 123-4567</p>
                      <div className="mt-3 pt-2 border-t border-gray-300">
                        <p className="font-bold text-red-600">RETUR PENJUALAN</p>
                      </div>
                    </div>

                    {/* Return Info */}
                    <div className="mb-4 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>No. Retur</span>
                        <span className="font-bold">{selectedReturn.nomorRetur}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>No. Transaksi</span>
                        <span>{selectedReturn.nomorTransaksiPenjualan ?? "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tanggal</span>
                        <span>{formatDateTime(selectedReturn.tanggal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pelanggan</span>
                        <span>{selectedReturn.pelangganNama ?? "Umum"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status</span>
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-semibold border",
                          getStatusColor(selectedReturn.status ?? "")
                        )}>
                          {selectedReturn.status ?? "-"}
                        </span>
                      </div>
                      {selectedReturn.alasan && (
                        <div className="flex justify-between">
                          <span>Alasan</span>
                          <span className="text-right max-w-[60%]">{selectedReturn.alasan}</span>
                        </div>
                      )}
                    </div>

                    {/* Return Items Table */}
                    <ReturnInvoiceItems returId={selectedReturn.id} />

                    {/* Return Total */}
                    <div className="mt-4 space-y-1 text-xs">
                      <div className="flex justify-between border-b border-gray-300 pb-2">
                        <span>Subtotal Retur</span>
                        <span className="font-bold text-red-600">{formatCurrency(selectedReturn.total).replace('Rp ', '')}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-b-2 border-dashed border-gray-400 pb-2">
                        <span className="text-red-600">TOTAL RETUR</span>
                        <span className="text-red-600">Rp {formatCurrency(selectedReturn.total).replace('Rp ', '')}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-gray-400">
                      <p className="text-xs">Dokumen Retur Penjualan</p>
                      <p className="text-xs">Barang retur sesuai dengan ketentuan</p>
                      <p className="text-xs mt-2">== KASIR PRO ==</p>
                    </div>

                    {/* Return ID Footer */}
                    <div className="text-center mt-4 pt-2 border-t border-gray-300">
                      <p className="text-xs text-gray-600">ID: {selectedReturn.id}</p>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
                <ClipboardList className="h-8 w-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Pilih retur untuk melihat detail</p>
                <p className="text-xs text-slate-500">
                  Klik salah satu baris untuk melihat dokumen retur.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
      {/* Create Return Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="rounded-none bg-white">
          <DialogTitle className="text-black">Buat Retur Penjualan</DialogTitle>
          <DialogDescription className="text-slate-600">
            Pilih transaksi penjualan yang akan dibuatkan retur draft.
          </DialogDescription>
          <div className="mt-4 flex flex-col gap-3">
            <select
              className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={selectedModalSaleId}
              onChange={(e) => setSelectedModalSaleId(e.target.value)}
            >
              <option value="">Pilih transaksi...</option>
              {(sales.data ?? []).slice(0, 20).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nomorTransaksi} • {s.pelangganNama ?? "Umum"} • {new Date(s.tanggal).toLocaleString()}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] border-[#476EAE]"
                onClick={() => setShowCreateDialog(false)}
              >
                Batal
              </Button>
              <Button
                className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
                disabled={!selectedModalSaleId}
                onClick={() => {
                  if (!selectedModalSaleId) return;
                  setSelectedSaleForItems(selectedModalSaleId);
                  setShowCreateDialog(false);
                  setShowItemSelectionDialog(true);
                }}
              >
                OK
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Selection Dialog */}
      <ItemSelectionDialog
        open={showItemSelectionDialog}
        onOpenChange={setShowItemSelectionDialog}
        saleId={selectedSaleForItems}
        onReturnCreated={() => {
          setSelectedSaleForItems("");
          void returns.refetch();
        }}
      />

      {/* Detail Modal */}
      <ReturnDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        returnId={selectedReturnForAction}
      />

      {/* Edit Modal */}
      <ReturnEditModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        returnId={selectedReturnForAction}
        onReturnUpdated={() => {
          void returns.refetch();
        }}
      />

      {/* Delete Modal */}
      <ReturnDeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        returnId={selectedReturnForAction}
        onReturnDeleted={() => {
          void returns.refetch();
        }}
      />
    </>
  );
}

function ReturnInvoiceItems({ returId }: { returId: string }) {
  const items = useReturnItemsQuery(returId);

  return (
    <div className="border-t-2 border-b-2 border-dashed border-gray-400 py-2">
      <div className="text-xs font-bold mb-2 grid grid-cols-12 gap-1">
        <div className="col-span-6">ITEM RETUR</div>
        <div className="col-span-2 text-center">QTY</div>
        <div className="col-span-2 text-right">HARGA</div>
        <div className="col-span-2 text-right">TOTAL</div>
      </div>

      {items.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="grid grid-cols-12 gap-1 text-xs">
              <div className="col-span-6">
                <div className="h-3 bg-gray-200 animate-pulse rounded" />
              </div>
              <div className="col-span-2">
                <div className="h-3 bg-gray-200 animate-pulse rounded" />
              </div>
              <div className="col-span-2">
                <div className="h-3 bg-gray-200 animate-pulse rounded" />
              </div>
              <div className="col-span-2">
                <div className="h-3 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (items.data ?? []).length === 0 ? (
        <div className="text-xs text-gray-500 py-2 text-center">
          Belum ada item retur
        </div>
      ) : (
        <div className="space-y-1">
          {(items.data ?? []).map((item) => (
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
                <div className="col-span-2 text-right font-semibold text-red-600">
                  -{formatCurrency(item.subtotal).replace('Rp ', '')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ItemSelectionDialog({
  open,
  onOpenChange,
  saleId,
  onReturnCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saleId: string;
  onReturnCreated: () => void;
}) {
  const saleItems = useSaleItemsWithReturnableQuery(saleId);
  const createDraft = useCreateSalesReturnDraft();
  const sales = useSalesQuery();
  const [selectedItems, setSelectedItems] = useState<{ produkId: string; qty: number; hargaSatuan: number }[]>([]);

  const selectedSale = useMemo(() => {
    return sales.data?.find(s => s.id === saleId);
  }, [sales.data, saleId]);

  const handleItemToggle = (produkId: string, qty: number, hargaSatuan: number) => {
    setSelectedItems(prev => {
      const existing = prev.find(item => item.produkId === produkId);
      if (existing) {
        return prev.filter(item => item.produkId !== produkId);
      } else {
        return [...prev, { produkId, qty: 1, hargaSatuan }];
      }
    });
  };

  const handleQtyChange = (produkId: string, newQty: number) => {
    setSelectedItems(prev => prev.map(item =>
      item.produkId === produkId ? { ...item, qty: Math.max(1, newQty) } : item
    ));
  };

  const handleCreateReturn = async () => {
    if (!selectedSale || selectedItems.length === 0) return;

    try {
      // 1. Create return header
      const res = await createDraft.mutateAsync({
        saleId: selectedSale.id,
        pelangganId: selectedSale.pelangganId
      });

      // 2. Add selected items to the return using direct API call
      const { addReturnItem } = await import("@/features/returns/api");

      for (const item of selectedItems) {
        await addReturnItem({
          returId: res.id,
          produkId: item.produkId,
          qty: item.qty,
          hargaSatuan: item.hargaSatuan
        });
      }

      toast.success(`Draft retur dibuat: ${res.nomor_retur} dengan ${selectedItems.length} item`);
      setSelectedItems([]);
      onOpenChange(false);
      onReturnCreated();
    } catch (error) {
      console.error("Error creating return:", error);
      toast.error("Gagal membuat draft retur");
    }
  };

  // Reset selected items when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setSelectedItems([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none max-w-2xl bg-white">
        <DialogTitle className="text-black">Pilih Item untuk Retur</DialogTitle>
        <DialogDescription className="text-slate-600">
          Transaksi: {selectedSale?.nomorTransaksi} • {selectedSale?.pelangganNama ?? "Umum"}
        </DialogDescription>

        <div className="mt-4 max-h-96 overflow-y-auto">
          {saleItems.isLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (saleItems.data ?? []).length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Tidak ada item yang dapat diretur dari transaksi ini
            </div>
          ) : (
            <div className="space-y-2">
              {((saleItems.data as { produkId: string; produkNama: string; remainingReturnable: number; hargaSatuan: number }[] | undefined) ?? [])
                .filter(item => item.remainingReturnable > 0)
                .map((item) => {
                  const isSelected = selectedItems.some(selected => selected.produkId === item.produkId);
                  const selectedItem = selectedItems.find(selected => selected.produkId === item.produkId);

                  return (
                    <div
                      key={item.produkId}
                      className={`border border-slate-200 p-3 ${isSelected ? 'bg-emerald-50 border-emerald-200' : 'bg-white'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleItemToggle(item.produkId, item.remainingReturnable, item.hargaSatuan)}
                            className="w-4 h-4"
                          />
                          <div>
                            <div className="font-medium text-slate-900">{item.produkNama}</div>
                            <div className="text-sm text-slate-500">
                              Harga: {formatCurrency(item.hargaSatuan)} • Sisa dapat diretur: {item.remainingReturnable}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">Qty:</span>
                            <input
                              type="number"
                              min={1}
                              max={item.remainingReturnable}
                              value={selectedItem?.qty ?? 1}
                              onChange={(e) => handleQtyChange(item.produkId, parseInt(e.target.value) || 1)}
                              className="w-16 h-8 border border-slate-200 rounded-none px-2 text-center"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            {selectedItems.length} item dipilih
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] border-[#476EAE]"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
              disabled={selectedItems.length === 0 || createDraft.isPending}
              onClick={handleCreateReturn}
            >
              Buat Retur
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReturnEditor(props: { returId: string; transaksiId: string | null; selectedReturn: { id: string; status: string | null; alasan?: string | null; tanggal: string } }) {
  const { returId, transaksiId, selectedReturn } = props;
  const items = useReturnItemsQuery(returId);
  const saleItems = useSaleItemsWithReturnableQuery(transaksiId);
  const addItem = useAddReturnItem(returId);
  const updItem = useUpdateReturnItem(returId);
  const delItem = useDeleteReturnItem(returId);
  const updHeader = useUpdateReturnHeader();
  const delHeader = useDeleteReturn();

  const canEdit = (selectedReturn.status ?? "draft") === "draft";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
        <span className="text-sm font-semibold text-slate-800">Item Retur</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] border-[#476EAE]"
            disabled={delHeader.isPending || !canEdit}
            onClick={async () => {
              try {
                await delHeader.mutateAsync(returId);
                toast.success("Retur dihapus");
              } catch {
                toast.error("Gagal menghapus retur");
              }
            }}
          >
            Hapus Retur
          </Button>
          <select
            disabled={!canEdit || saleItems.isLoading || (saleItems.data ?? []).length === 0}
            className="h-9 rounded-none border border-slate-200 bg-white px-2 text-xs text-black shadow-inner"
            onChange={async (e) => {
              const pid = e.target.value;
              if (!pid) return;
              type SaleItemWithReturnable = { produkId: string; produkNama: string; remainingReturnable: number; hargaSatuan: number };
              const src = (saleItems.data as SaleItemWithReturnable[] | undefined)?.find((s) => s.produkId === pid);
              if (!src || src.remainingReturnable <= 0) {
                toast.error("Qty retur tidak tersedia");
                return;
              }
              try {
                await addItem.mutateAsync({ produkId: src.produkId, qty: 1, hargaSatuan: src.hargaSatuan });
              } catch {
                toast.error("Gagal menambah item retur");
              }
            }}
          >
            <option value="">+ Tambah item dari transaksi</option>
            {((saleItems.data as { produkId: string; produkNama: string; remainingReturnable: number }[] | undefined) ?? []).map((s) => (
              <option key={s.produkId} value={s.produkId} disabled={s.remainingReturnable <= 0}>
                {s.produkNama} • sisa retur {s.remainingReturnable}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex-1 p-3">
        {items.isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (items.data ?? []).length === 0 ? (
          <div className="text-xs text-slate-500">Belum ada item retur.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {(items.data ?? []).map((it) => (
              <div key={it.id} className="grid grid-cols-12 items-center gap-2 rounded border border-slate-200 p-2 text-xs">
                <div className="col-span-5">
                  <div className="font-medium text-slate-800">{it.produkNama}</div>
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min={1}
                    className="h-8 w-full rounded-none border border-slate-200 px-2"
                    defaultValue={it.qty}
                    disabled={!canEdit}
                    onBlur={async (e) => {
                      const val = Math.max(1, Number(e.currentTarget.value || 1));
                      try {
                        await updItem.mutateAsync({ id: it.id, qty: val, hargaSatuan: it.hargaSatuan });
                      } catch {
                        toast.error("Gagal mengupdate item");
                      }
                    }}
                  />
                </div>
                <div className="col-span-3 text-right font-mono">{formatCurrency(it.hargaSatuan)}</div>
                <div className="col-span-2 text-right font-mono font-semibold">{formatCurrency(it.subtotal)}</div>
                {canEdit && (
                  <div className="col-span-12 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] border-[#476EAE]"
                      onClick={async () => {
                        try {
                          await delItem.mutateAsync(it.id);
                        } catch {
                          toast.error("Gagal menghapus item");
                        }
                      }}
                    >
                      Hapus
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="shrink-0 border-t border-slate-200 p-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Status:</span>
            <select
              className="h-8 rounded-none border border-slate-200 bg-white px-2"
              defaultValue={selectedReturn.status ?? "draft"}
              disabled={!canEdit}
              onChange={async (e) => {
                try {
                  const v = e.target.value as "draft" | "diterima" | "sebagian" | "selesai" | "batal";
                  await updHeader.mutateAsync({ id: returId, status: v });
                  toast.success("Status diperbarui");
                } catch {
                  toast.error("Gagal memperbarui status");
                }
              }}
            >
              <option value="draft">draft</option>
              <option value="diterima">diterima</option>
              <option value="sebagian">sebagian</option>
              <option value="selesai">selesai</option>
              <option value="batal">batal</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Alasan:</span>
            <input
              className="h-8 w-48 rounded-none border border-slate-200 px-2"
              placeholder="Alasan retur"
              defaultValue={selectedReturn.alasan ?? ""}
              disabled={!canEdit}
              onBlur={async (e) => {
                try {
                  await updHeader.mutateAsync({ id: returId, alasan: e.currentTarget.value });
                } catch {
                  toast.error("Gagal memperbarui alasan");
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReturnDetailModal({
  open,
  onOpenChange,
  returnId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnId: string;
}) {
  const returns = useSalesReturnsQuery();
  const items = useReturnItemsQuery(returnId);

  const returnData = useMemo(() => {
    return returns.data?.find(r => r.id === returnId);
  }, [returns.data, returnId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none bg-white max-w-3xl">
        <DialogTitle className="text-black">Detail Retur Penjualan</DialogTitle>

        {returnData && (
          <div className="mt-4 space-y-4">
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-4 p-4 border border-slate-200 bg-slate-50">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">No. Retur</label>
                <p className="text-sm font-semibold text-slate-900">{returnData.nomorRetur}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">No. Transaksi</label>
                <p className="text-sm font-semibold text-slate-900">{returnData.nomorTransaksiPenjualan ?? "-"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Pelanggan</label>
                <p className="text-sm text-slate-700">{returnData.pelangganNama ?? "Tanpa pelanggan"}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</label>
                <span className={cn(
                  "inline-block px-2 py-1 rounded text-xs font-semibold border",
                  getStatusColor(returnData.status ?? "")
                )}>
                  {returnData.status ?? "-"}
                </span>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tanggal</label>
                <p className="text-sm text-slate-700">{formatDateTime(returnData.tanggal)}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total</label>
                <p className="text-lg font-bold text-red-600">{formatCurrency(returnData.total)}</p>
              </div>
              {returnData.alasan && (
                <div className="col-span-2">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Alasan</label>
                  <p className="text-sm text-slate-700">{returnData.alasan}</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Item Retur</h3>
              {items.isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-slate-100 animate-pulse" />
                  ))}
                </div>
              ) : (items.data ?? []).length === 0 ? (
                <p className="text-sm text-slate-500 py-4">Belum ada item retur.</p>
              ) : (
                <div className="border border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-slate-500">Produk</TableHead>
                        <TableHead className="text-slate-500">Qty</TableHead>
                        <TableHead className="text-slate-500">Harga</TableHead>
                        <TableHead className="text-slate-500">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(items.data ?? []).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.produkNama}</TableCell>
                          <TableCell>{item.qty}</TableCell>
                          <TableCell>{formatCurrency(item.hargaSatuan)}</TableCell>
                          <TableCell className="font-semibold">{formatCurrency(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] border-[#476EAE]"
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReturnEditModal({
  open,
  onOpenChange,
  returnId,
  onReturnUpdated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnId: string;
  onReturnUpdated: () => void;
}) {
  const returns = useSalesReturnsQuery();
  const items = useReturnItemsQuery(returnId);
  const addItem = useAddReturnItem(returnId);
  const updItem = useUpdateReturnItem(returnId);
  const delItem = useDeleteReturnItem(returnId);
  const updHeader = useUpdateReturnHeader();

  const returnData = useMemo(() => {
    return returns.data?.find(r => r.id === returnId);
  }, [returns.data, returnId]);

  const saleItems = useSaleItemsWithReturnableQuery(returnData?.transaksiPenjualanId ?? null);

  const [status, setStatus] = useState<"draft" | "diterima" | "sebagian" | "selesai" | "batal">("draft");
  const [alasan, setAlasan] = useState("");

  React.useEffect(() => {
    if (returnData) {
      setStatus(returnData.status as any ?? "draft");
      setAlasan(returnData.alasan ?? "");
    }
  }, [returnData]);

  const canEdit = (returnData?.status ?? "draft") === "draft";

  const handleSave = async () => {
    try {
      await updHeader.mutateAsync({
        id: returnId,
        status,
        alasan: alasan || null
      });
      toast.success("Retur berhasil diperbarui");
      onReturnUpdated();
      onOpenChange(false);
    } catch {
      toast.error("Gagal memperbarui retur");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogTitle className="text-black">Edit Retur Penjualan</DialogTitle>

        {returnData && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-4 p-4 border border-slate-200 bg-slate-50">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">No. Retur</label>
                <p className="text-sm font-semibold text-slate-900">{returnData.nomorRetur}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  disabled={!canEdit}
                  className="h-8 w-full rounded-none border border-slate-200 bg-white px-2 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="diterima">Diterima</option>
                  <option value="sebagian">Sebagian</option>
                  <option value="selesai">Selesai</option>
                  <option value="batal">Batal</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Alasan</label>
                <input
                  type="text"
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  disabled={!canEdit}
                  placeholder="Alasan retur"
                  className="h-8 w-full rounded-none border border-slate-200 bg-white px-2 text-sm"
                />
              </div>
            </div>

            {canEdit && (
              <div>
                <select
                  disabled={saleItems.isLoading || (saleItems.data ?? []).length === 0}
                  className="h-10 w-full rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner"
                  onChange={async (e) => {
                    const pid = e.target.value;
                    if (!pid) return;
                    type SaleItemWithReturnable = { produkId: string; produkNama: string; remainingReturnable: number; hargaSatuan: number };
                    const src = (saleItems.data as SaleItemWithReturnable[] | undefined)?.find((s) => s.produkId === pid);
                    if (!src || src.remainingReturnable <= 0) {
                      toast.error("Qty retur tidak tersedia");
                      return;
                    }
                    try {
                      await addItem.mutateAsync({ produkId: src.produkId, qty: 1, hargaSatuan: src.hargaSatuan });
                      toast.success("Item ditambahkan");
                    } catch {
                      toast.error("Gagal menambah item retur");
                    }
                  }}
                >
                  <option value="">+ Tambah item dari transaksi</option>
                  {((saleItems.data as { produkId: string; produkNama: string; remainingReturnable: number }[] | undefined) ?? []).map((s) => (
                    <option key={s.produkId} value={s.produkId} disabled={s.remainingReturnable <= 0}>
                      {s.produkNama} • sisa retur {s.remainingReturnable}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              {(items.data ?? []).map((item) => (
                <div key={item.id} className="grid grid-cols-12 items-center gap-2 p-3 border border-slate-200 bg-white text-sm">
                  <div className="col-span-5">
                    <div className="font-medium text-slate-800">{item.produkNama}</div>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={1}
                      className="h-8 w-full rounded-none border border-slate-200 px-2"
                      defaultValue={item.qty}
                      disabled={!canEdit}
                      onBlur={async (e) => {
                        const val = Math.max(1, Number(e.currentTarget.value || 1));
                        try {
                          await updItem.mutateAsync({ id: item.id, qty: val, hargaSatuan: item.hargaSatuan });
                        } catch {
                          toast.error("Gagal mengupdate item");
                        }
                      }}
                    />
                  </div>
                  <div className="col-span-2 text-right">{formatCurrency(item.hargaSatuan)}</div>
                  <div className="col-span-2 text-right font-semibold">{formatCurrency(item.subtotal)}</div>
                  {canEdit && (
                    <div className="col-span-1 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 rounded-none hover:bg-red-100"
                        onClick={async () => {
                          try {
                            await delItem.mutateAsync(item.id);
                          } catch {
                            toast.error("Gagal menghapus item");
                          }
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] border-[#476EAE]"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
            onClick={handleSave}
            disabled={updHeader.isPending}
          >
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReturnDeleteModal({
  open,
  onOpenChange,
  returnId,
  onReturnDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnId: string;
  onReturnDeleted: () => void;
}) {
  const returns = useSalesReturnsQuery();
  const delHeader = useDeleteReturn();

  const returnData = useMemo(() => {
    return returns.data?.find(r => r.id === returnId);
  }, [returns.data, returnId]);

  const handleDelete = async () => {
    try {
      await delHeader.mutateAsync(returnId);
      toast.success("Retur berhasil dihapus");
      onReturnDeleted();
      onOpenChange(false);
    } catch {
      toast.error("Gagal menghapus retur");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none bg-white">
        <DialogTitle className="text-black">Hapus Retur Penjualan</DialogTitle>

        {returnData && (
          <div className="mt-4">
            <p className="text-slate-600">
              Apakah Anda yakin ingin menghapus retur <strong>{returnData.nomorRetur}</strong>?
            </p>
            <div className="mt-3 p-3 bg-slate-50 border border-slate-200">
              <div className="text-sm space-y-1">
                <div><span className="font-medium">No. Transaksi:</span> {returnData.nomorTransaksiPenjualan ?? "-"}</div>
                <div><span className="font-medium">Pelanggan:</span> {returnData.pelangganNama ?? "Tanpa pelanggan"}</div>
                <div><span className="font-medium">Total:</span> {formatCurrency(returnData.total)}</div>
              </div>
            </div>
            <p className="text-sm text-red-600 mt-3">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0] border-[#476EAE]"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            className="rounded-none bg-red-600 text-white hover:bg-red-700"
            onClick={handleDelete}
            disabled={delHeader.isPending}
          >
            Hapus
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
