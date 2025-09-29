import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useUpdateStockOpname } from "@/features/stock-opname/use-stock-opname";
import { useOpnameItems, useUpdateOpnameItem, useDeleteOpnameItem } from "@/features/stock-opname/use-stock-opname-items";
import { useProductSearch } from "@/features/stock-opname/use-stock-opname-products";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { addOpnameItem } from "@/features/stock-opname/items-api";
import type { StockOpnameSummary } from "@/features/stock-opname/types";
import { numberFormatter } from "../stock-opname-utils";
import { Trash2, Plus, Save } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: StockOpnameSummary | null;
};

export default function StockOpnameEditDialog({ open, onOpenChange, data }: Props) {
  const { state: { user } } = useSupabaseAuth();
  const mutation = useUpdateStockOpname();
  const itemsQuery = useOpnameItems(data?.id ?? null);
  const updateItemMutation = useUpdateOpnameItem(data?.id ?? null);
  const deleteItemMutation = useDeleteOpnameItem(data?.id ?? null);

  // Header states
  const [tanggal, setTanggal] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [catatan, setCatatan] = useState<string>("");

  // Item editing states
  const [editingItems, setEditingItems] = useState<Record<string, { stockFisik: string; keterangan: string }>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const productSearch = useProductSearch({
    enabled: Boolean(searchQuery.trim() && data?.tokoId),
    tenantId: user?.tenantId,
    tokoId: data?.tokoId,
    q: searchQuery
  });

  useEffect(() => {
    if (!data) return;
    setTanggal(data.tanggal.slice(0, 16));
    setStatus(data.status ?? "draft");
    setCatatan(data.catatan ?? "");
  }, [data]);

  useEffect(() => {
    if (itemsQuery.data) {
      const initialEditing: Record<string, { stockFisik: string; keterangan: string }> = {};
      itemsQuery.data.forEach(item => {
        initialEditing[item.id] = {
          stockFisik: item.stockFisik.toString(),
          keterangan: item.keterangan ?? ""
        };
      });
      setEditingItems(initialEditing);
    }
  }, [itemsQuery.data]);

  const submitHeader = async () => {
    if (!data) return;
    await mutation.mutateAsync({ id: data.id, tanggal: new Date(tanggal).toISOString(), status, catatan });
  };

  const saveItem = async (itemId: string) => {
    const editData = editingItems[itemId];
    if (!editData) return;

    await updateItemMutation.mutateAsync({
      id: itemId,
      stockFisik: Number(editData.stockFisik),
      keterangan: editData.keterangan || null
    });
  };

  const deleteItem = async (itemId: string) => {
    await deleteItemMutation.mutateAsync(itemId);
  };

  const addNewItem = async (product: any) => {
    if (!data) return;

    await addOpnameItem({
      opnameId: data.id,
      produkId: product.id,
      stockFisik: product.stock,
      stockSistem: product.stock
    });

    setSearchQuery("");
    await itemsQuery.refetch();
  };

  const updateEditingItem = (itemId: string, field: 'stockFisik' | 'keterangan', value: string) => {
    setEditingItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const submitAll = async () => {
    await submitHeader();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-white rounded-none border border-slate-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-800 font-semibold">Edit Stock Opname</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header Edit - Compact */}
          <div className="bg-slate-50 p-3 rounded-none border border-slate-200">
            <div className="grid grid-cols-4 gap-3 text-sm">
              <div>
                <label className="text-xs text-slate-600 font-medium">Tanggal</label>
                <Input type="datetime-local" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="bg-white border-slate-300 rounded-none h-8" />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-medium">Status</label>
                <select className="w-full border border-slate-300 rounded-none h-8 px-2 bg-white text-sm" value={status ?? "draft"} onChange={(e) => setStatus(e.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="selesai">Selesai</option>
                  <option value="batal">Batal</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-600 font-medium">Catatan</label>
                <Input value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Catatan..." className="bg-white border-slate-300 rounded-none h-8" />
              </div>
            </div>
          </div>

          {/* Add New Item */}
          <div className="space-y-2">
            <label className="text-xs text-slate-600 font-medium">Tambah Produk Baru</label>
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk untuk ditambahkan..."
                className="bg-white border-slate-300 rounded-none focus-visible:ring-blue-400/50 focus-visible:border-blue-400"
              />
              {searchQuery.trim() && (productSearch.data?.length > 0 || productSearch.isLoading) && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 border border-slate-300 rounded-none max-h-32 overflow-auto bg-white shadow-lg">
                  {productSearch.isLoading ? (
                    <div className="px-3 py-2 text-xs text-slate-500 text-center">Memuat...</div>
                  ) : (
                    (productSearch.data ?? [])
                      .filter(p => !itemsQuery.data?.some(item => item.produkId === p.id))
                      .map((p) => (
                        <div
                          key={p.id}
                          onClick={() => addNewItem(p)}
                          className="px-3 py-2 cursor-pointer border-b border-slate-100 last:border-b-0 hover:bg-slate-50 text-slate-700"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{p.nama}</div>
                              <div className="text-xs text-slate-500">{p.kode ?? "-"}</div>
                            </div>
                            <div className="text-xs text-slate-600 ml-3">Stock: {p.stock}</div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-800">Item yang Dikoreksi</h3>
            {itemsQuery.isLoading ? (
              <p className="text-sm text-slate-600">Memuat items...</p>
            ) : !itemsQuery.data || itemsQuery.data.length === 0 ? (
              <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-none border border-slate-200 text-center">
                Belum ada item yang dikoreksi
              </p>
            ) : (
              <div className="border border-slate-300 rounded-none bg-white">
                <ScrollArea className="h-80">
                  <Table className="min-w-full text-sm">
                    <TableHeader className="bg-slate-100">
                      <TableRow>
                        <TableHead className="w-[25%] text-slate-600 font-medium">Produk</TableHead>
                        <TableHead className="w-[12%] text-slate-600 font-medium text-right">Stok Sistem</TableHead>
                        <TableHead className="w-[15%] text-slate-600 font-medium">Stok Fisik</TableHead>
                        <TableHead className="w-[12%] text-slate-600 font-medium text-right">Selisih</TableHead>
                        <TableHead className="w-[25%] text-slate-600 font-medium">Keterangan</TableHead>
                        <TableHead className="w-[11%] text-slate-600 font-medium text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itemsQuery.data.map((item) => {
                        const editData = editingItems[item.id] || { stockFisik: item.stockFisik.toString(), keterangan: item.keterangan ?? "" };
                        const currentSelisih = Number(editData.stockFisik) - item.stockSistem;

                        return (
                          <TableRow key={item.id} className="border-b border-slate-100">
                            <TableCell className="py-3">
                              <div className="font-medium text-slate-800">{item.produkNama}</div>
                              <div className="text-xs text-slate-500">{item.produkKode ?? "-"}</div>
                            </TableCell>
                            <TableCell className="py-3 text-right font-semibold text-blue-600">
                              {numberFormatter.format(item.stockSistem)}
                            </TableCell>
                            <TableCell className="py-3">
                              <Input
                                type="number"
                                value={editData.stockFisik}
                                onChange={(e) => updateEditingItem(item.id, 'stockFisik', e.target.value)}
                                className="bg-white border-slate-300 rounded-none h-8 text-sm font-semibold text-purple-600"
                              />
                            </TableCell>
                            <TableCell className="py-3 text-right font-semibold">
                              <span className={currentSelisih > 0 ? "text-emerald-600" : currentSelisih < 0 ? "text-red-600" : "text-slate-600"}>
                                {currentSelisih > 0 ? "+" : ""}{numberFormatter.format(currentSelisih)}
                              </span>
                            </TableCell>
                            <TableCell className="py-3">
                              <Input
                                value={editData.keterangan}
                                onChange={(e) => updateEditingItem(item.id, 'keterangan', e.target.value)}
                                placeholder="Keterangan..."
                                className="bg-white border-slate-300 rounded-none h-8 text-xs"
                              />
                            </TableCell>
                            <TableCell className="py-3">
                              <div className="flex gap-1 justify-center">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => saveItem(item.id)}
                                  disabled={updateItemMutation.isPending}
                                  className="h-7 w-7 p-0 rounded-none hover:bg-green-100"
                                >
                                  <Save className="h-3 w-3 text-green-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteItem(item.id)}
                                  disabled={deleteItemMutation.isPending}
                                  className="h-7 w-7 p-0 rounded-none hover:bg-red-100"
                                >
                                  <Trash2 className="h-3 w-3 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
            className="rounded-none border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Batal
          </Button>
          <Button
            onClick={submitAll}
            disabled={mutation.isPending || !data}
            className="rounded-none bg-blue-500 hover:bg-blue-600 text-white border-0"
          >
            {mutation.isPending ? "Menyimpan..." : "Simpan Semua"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
