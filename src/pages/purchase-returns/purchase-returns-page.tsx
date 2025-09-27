import React, { useState, useMemo } from "react";
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
import { useCreatePurchaseReturnDraft, usePurchaseReturnsQuery } from "@/features/purchase-returns/use-purchase-returns";
import {
  useAddPurchaseReturnItem,
  useDeletePurchaseReturn,
  useDeletePurchaseReturnItem,
  usePurchaseItemsWithReturnableQuery,
  usePurchaseReturnItemsQuery,
  useUpdatePurchaseReturnHeader,
  useUpdatePurchaseReturnItem,
} from "@/features/purchase-returns/use-purchase-return-items";
import { usePurchasesQuery } from "@/features/purchases/use-purchases";
import { toast } from "sonner";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowLeftRight, Filter, Plus, RefreshCw, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

// Align with public.retur_pembelian.status enum: draft, diterima, sebagian, selesai, batal
type StatusFilter = "all" | "draft" | "diterima" | "sebagian" | "selesai" | "batal";

export function PurchaseReturnsPage() {
  const purchaseReturns = usePurchaseReturnsQuery();
  const purchases = usePurchasesQuery();
  const createDraft = useCreatePurchaseReturnDraft();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string>("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedModalPurchaseId, setSelectedModalPurchaseId] = useState<string>("");
  const [showItemSelectionDialog, setShowItemSelectionDialog] = useState(false);
  const [selectedPurchaseForItems, setSelectedPurchaseForItems] = useState<string>("");

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
              <Button
                className="gap-2 rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
                onClick={() => {
                  // Prefill the most recent purchase if available
                  const first = (purchases.data ?? [])[0];
                  setSelectedModalPurchaseId(first?.id ?? "");
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

  <Card className="flex w-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm lg:w-[460px] rounded-none">
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

                <PurchaseReturnEditor
                  returId={selectedReturn.id}
                  transaksiId={selectedReturn.transaksiPembelianId ?? null}
                  selectedReturn={selectedReturn}
                  onDeleted={() => setSelectedId(null)}
                />
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

      {/* Create Purchase Return Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="rounded-none bg-white w-[65%] max-w-2xl border-2 border-[#A7E399]">
          <DialogTitle className="text-black">Buat Retur Pembelian</DialogTitle>
          <DialogDescription className="text-slate-600">
            Pilih transaksi pembelian yang akan dibuatkan retur draft.
          </DialogDescription>
          <div className="mt-4 flex flex-col gap-3">
            <select
              className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40 w-full"
              value={selectedModalPurchaseId}
              onChange={(e) => setSelectedModalPurchaseId(e.target.value)}
            >
              <option value="">Pilih transaksi...</option>
              {(purchases.data ?? []).slice(0, 20).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nomorTransaksi} • {p.supplierNama} • {new Date(p.tanggal).toLocaleDateString()}
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
                disabled={!selectedModalPurchaseId}
                onClick={() => {
                  if (!selectedModalPurchaseId) return;
                  setSelectedPurchaseForItems(selectedModalPurchaseId);
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
      <PurchaseItemSelectionDialog
        open={showItemSelectionDialog}
        onOpenChange={setShowItemSelectionDialog}
        purchaseId={selectedPurchaseForItems}
        onReturnCreated={() => {
          setSelectedPurchaseForItems("");
          void purchaseReturns.refetch();
        }}
      />
    </div>
  );
}

function PurchaseItemSelectionDialog({
  open,
  onOpenChange,
  purchaseId,
  onReturnCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseId: string;
  onReturnCreated: () => void;
}) {
  const purchaseItems = usePurchaseItemsWithReturnableQuery(purchaseId);
  const createDraft = useCreatePurchaseReturnDraft();
  const purchases = usePurchasesQuery();
  const [selectedItems, setSelectedItems] = useState<{ produkId: string; qty: number; hargaSatuan: number }[]>([]);

  const selectedPurchase = useMemo(() => {
    return purchases.data?.find(p => p.id === purchaseId);
  }, [purchases.data, purchaseId]);

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
    if (!selectedPurchase || selectedItems.length === 0) return;

    try {
      // 1. Create return header
      const res = await createDraft.mutateAsync({
        purchaseId: selectedPurchase.id,
        supplierId: selectedPurchase.supplierId
      });

      // 2. Add selected items to the return using direct API call
      const { addPurchaseReturnItem } = await import("@/features/purchase-returns/api");

      for (const item of selectedItems) {
        await addPurchaseReturnItem({
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
      console.error("Error creating purchase return:", error);
      toast.error("Gagal membuat draft retur pembelian");
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
          Transaksi: {selectedPurchase?.nomorTransaksi} • {selectedPurchase?.supplierNama}
        </DialogDescription>

        <div className="mt-4 max-h-96 overflow-y-auto">
          {purchaseItems.isLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (purchaseItems.data ?? []).length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Tidak ada item yang dapat diretur dari transaksi ini
            </div>
          ) : (
            <div className="space-y-2">
              {((purchaseItems.data as { produkId: string; produkNama: string; remainingReturnable: number; hargaSatuan: number }[] | undefined) ?? [])
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

function PurchaseReturnEditor(props: { returId: string; transaksiId: string | null; selectedReturn: { id: string; status: string | null; alasan: string | null; tanggal: string }; onDeleted?: () => void }) {
  const { returId, transaksiId, selectedReturn, onDeleted } = props;
  const items = usePurchaseReturnItemsQuery(returId);
  const purchaseItems = usePurchaseItemsWithReturnableQuery(transaksiId);
  const addItem = useAddPurchaseReturnItem(returId);
  const updItem = useUpdatePurchaseReturnItem(returId);
  const delItem = useDeletePurchaseReturnItem(returId);
  const updHeader = useUpdatePurchaseReturnHeader();
  const delHeader = useDeletePurchaseReturn();

  const canEdit = (selectedReturn.status ?? "draft") === "draft";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
        <span className="text-sm font-semibold text-slate-800">Item Retur Pembelian</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-none"
            disabled={delHeader.isPending || !canEdit}
            onClick={async () => {
              try {
                await delHeader.mutateAsync(returId);
                toast.success("Retur pembelian dihapus");
                onDeleted?.();
              } catch {
                toast.error("Gagal menghapus retur pembelian");
              }
            }}
          >
            Hapus Retur
          </Button>
          <select
            disabled={!canEdit || purchaseItems.isLoading || (purchaseItems.data ?? []).length === 0}
            className="h-9 rounded-none border border-slate-200 bg-white px-2 text-xs text-black shadow-inner"
            onChange={async (e) => {
              const pid = e.target.value;
              if (!pid) return;
              type PurchaseItemWithReturnable = { produkId: string; produkNama: string; remainingReturnable: number; hargaSatuan: number };
              const src = (purchaseItems.data as PurchaseItemWithReturnable[] | undefined)?.find((s) => s.produkId === pid);
              if (!src || src.remainingReturnable <= 0) {
                toast.error("Qty retur tidak tersedia");
                return;
              }
              try {
                await addItem.mutateAsync({ produkId: src.produkId, qty: 1, hargaSatuan: src.hargaSatuan });
                e.currentTarget.value = "";
              } catch {
                toast.error("Gagal menambah item retur pembelian");
              }
            }}
          >
            <option value="">+ Tambah item dari transaksi</option>
            {((purchaseItems.data as { produkId: string; produkNama: string; remainingReturnable: number }[] | undefined) ?? []).map((s) => (
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
                      className="rounded-none"
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
