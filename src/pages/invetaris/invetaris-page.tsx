import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useStoresQuery } from "@/features/stores/use-stores";
import { useInventoryQuery } from "@/features/inventory/use-inventory";
import { useCreateInventaris, useDeleteInventaris, useUpdateInventaris, type InventarisInput } from "@/features/inventory/mutations";
import { useAssetProductsQuery } from "@/features/inventory/use-asset-products";
import { InvetarisSummary } from "@/pages/invetaris/invetaris-summary";
import { InvetarisFilters } from "@/pages/invetaris/invetaris-filters";
import { InvetarisTable } from "@/pages/invetaris/invetaris-table";
import { InvetarisDetail } from "@/pages/invetaris/invetaris-detail";
import { getStockState, type StockStateFilter } from "@/pages/invetaris/invetaris-utils";

export function InvetarisPage() {
  const stores = useStoresQuery();
  const [storeFilter, setStoreFilter] = useState<string | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stockState, setStockState] = useState<StockStateFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [form, setForm] = useState<InventarisInput>({
    produkId: "",
    stockFisik: 0,
    stockTersedia: 0,
    stockMinimum: null,
    stockMaksimum: null,
    lokasiRak: "",
    batchNumber: "",
    tanggalExpired: null,
  });

  const inventory = useInventoryQuery(storeFilter);
  const products = useAssetProductsQuery(storeFilter);
  const createInventaris = useCreateInventaris();
  const updateInventaris = useUpdateInventaris();
  const deleteInventaris = useDeleteInventaris();

  useEffect(() => {
    if (!inventory.data || inventory.data.length === 0) {
      setSelectedId(null);
      return;
    }
    if (selectedId && inventory.data.some((item) => item.id === selectedId)) {
      return;
    }
    setSelectedId(inventory.data[0]?.id ?? null);
  }, [inventory.data, selectedId]);

  const filteredInventory = useMemo(() => {
    const data = inventory.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data.filter((item) => {
      const matchesSearch =
        query.length === 0 ||
        [item.produkNama, item.produkKode ?? "", item.lokasiRak ?? ""].some((value) =>
          value.toLowerCase().includes(query),
        );

      if (!matchesSearch) return false;

      if (stockState === "all") return true;
      const state = getStockState(item);
      if (stockState === "healthy") {
        return state === "healthy";
      }
      return state === stockState;
    });
  }, [inventory.data, searchTerm, stockState]);

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return filteredInventory.find((item) => item.id === selectedId) ?? null;
  }, [filteredInventory, selectedId]);

  const handleRefresh = () => {
    void inventory.refetch();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2 text-slate-900">
      <InvetarisSummary data={inventory.data ?? []} />

      <InvetarisFilters
        searchTerm={searchTerm}
        storeFilter={storeFilter}
        stockState={stockState}
        stores={stores.data ?? []}
        onSearchChange={setSearchTerm}
        onStoreFilterChange={setStoreFilter}
        onStockStateChange={setStockState}
        onRefresh={handleRefresh}
        isRefreshing={inventory.isFetching}
        onCreate={() => {
          setForm({
            produkId: "",
            stockFisik: 0,
            stockTersedia: 0,
            stockMinimum: null,
            stockMaksimum: null,
            lokasiRak: "",
            batchNumber: "",
            tanggalExpired: null,
          });
          setShowCreate(true);
        }}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <InvetarisTable
            data={filteredInventory}
            isLoading={inventory.isLoading}
            selectedId={selectedId}
            onSelectItem={setSelectedId}
          />
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2 lg:w-1/4">
          <div className="flex items-center justify-end gap-2">
            <Button
              className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
              onClick={() => {
                setForm({
                  produkId: "",
                  stockFisik: 0,
                  stockTersedia: 0,
                  stockMinimum: null,
                  stockMaksimum: null,
                  lokasiRak: "",
                  batchNumber: "",
                  tanggalExpired: null,
                });
                setShowCreate(true);
              }}
            >
              Aset baru
            </Button>
            <Button
              variant="outline"
              className="rounded-none"
              onClick={() => {
                if (!selectedItem) return;
                setForm({
                  produkId: selectedItem.produkId,
                  stockFisik: selectedItem.stockFisik,
                  stockTersedia: selectedItem.stockSistem,
                  stockMinimum: selectedItem.stockMinimum,
                  stockMaksimum: selectedItem.stockMaximum,
                  lokasiRak: selectedItem.lokasiRak,
                  batchNumber: selectedItem.batchNumber,
                  tanggalExpired: selectedItem.tanggalExpired,
                });
                setShowEdit(true);
              }}
              disabled={!selectedItem}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              className="rounded-none"
              onClick={() => setShowDelete(true)}
              disabled={!selectedItem}
            >
              Hapus
            </Button>
            <Button
              variant="outline"
              className="rounded-none"
              onClick={() => setShowDetail(true)}
              disabled={!selectedItem}
            >
              Detail
            </Button>
          </div>
          <InvetarisDetail selectedItem={selectedItem} />
        </div>
      </div>

      {/* Create Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aset baru</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <label className="text-xs text-slate-600">Produk</label>
              <select
                value={form.produkId}
                onChange={(e) => setForm({ ...form, produkId: e.target.value })}
                className="h-10 w-full rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner"
              >
                <option value="">Pilih produk</option>
                {(products.data ?? []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} ({p.kode})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Stok Fisik</label>
                <Input type="number" value={form.stockFisik ?? 0}
                  onChange={(e) => setForm({ ...form, stockFisik: Number(e.target.value || 0) })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Stok Sistem</label>
                <Input type="number" value={form.stockTersedia ?? 0}
                  onChange={(e) => setForm({ ...form, stockTersedia: Number(e.target.value || 0) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Minimum</label>
                <Input type="number" value={form.stockMinimum ?? 0}
                  onChange={(e) => setForm({ ...form, stockMinimum: Number(e.target.value || 0) })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Maksimum</label>
                <Input type="number" value={form.stockMaksimum ?? 0}
                  onChange={(e) => setForm({ ...form, stockMaksimum: Number(e.target.value || 0) })} />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-600">Lokasi Rak</label>
              <Input value={form.lokasiRak ?? ""}
                onChange={(e) => setForm({ ...form, lokasiRak: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Batch Number</label>
                <Input value={form.batchNumber ?? ""}
                  onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Tanggal Expired</label>
                <Input type="date" value={form.tanggalExpired ?? ""}
                  onChange={(e) => setForm({ ...form, tanggalExpired: e.target.value || null })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
              disabled={createInventaris.isPending || !form.produkId}
              onClick={async () => {
                try {
                  await createInventaris.mutateAsync(form);
                  toast.success("Aset ditambahkan");
                  setShowCreate(false);
                  setForm({
                    produkId: "",
                    stockFisik: 0,
                    stockTersedia: 0,
                    stockMinimum: null,
                    stockMaksimum: null,
                    lokasiRak: "",
                    batchNumber: "",
                    tanggalExpired: null,
                  });
                  void inventory.refetch();
                } catch (err: unknown) {
                  const message = err instanceof Error ? err.message : String(err);
                  toast.error(message);
                }
              }}
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit aset</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <label className="text-xs text-slate-600">Produk</label>
              <select
                value={form.produkId}
                onChange={(e) => setForm({ ...form, produkId: e.target.value })}
                className="h-10 w-full rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner"
              >
                <option value="">Pilih produk</option>
                {(products.data ?? []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} ({p.kode})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Stok Fisik</label>
                <Input type="number" value={form.stockFisik ?? 0}
                  onChange={(e) => setForm({ ...form, stockFisik: Number(e.target.value || 0) })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Stok Sistem</label>
                <Input type="number" value={form.stockTersedia ?? 0}
                  onChange={(e) => setForm({ ...form, stockTersedia: Number(e.target.value || 0) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Minimum</label>
                <Input type="number" value={form.stockMinimum ?? 0}
                  onChange={(e) => setForm({ ...form, stockMinimum: Number(e.target.value || 0) })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Maksimum</label>
                <Input type="number" value={form.stockMaksimum ?? 0}
                  onChange={(e) => setForm({ ...form, stockMaksimum: Number(e.target.value || 0) })} />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-600">Lokasi Rak</label>
              <Input value={form.lokasiRak ?? ""}
                onChange={(e) => setForm({ ...form, lokasiRak: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600">Batch Number</label>
                <Input value={form.batchNumber ?? ""}
                  onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-slate-600">Tanggal Expired</label>
                <Input type="date" value={form.tanggalExpired ?? ""}
                  onChange={(e) => setForm({ ...form, tanggalExpired: e.target.value || null })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
              disabled={updateInventaris.isPending || !selectedItem}
              onClick={async () => {
                if (!selectedItem) return;
                try {
                  await updateInventaris.mutateAsync({ id: selectedItem.id, ...form });
                  toast.success("Perubahan disimpan");
                  setShowEdit(false);
                  void inventory.refetch();
                } catch (err: unknown) {
                  const message = err instanceof Error ? err.message : String(err);
                  toast.error(message);
                }
              }}
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus aset</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">Aksi ini tidak dapat dibatalkan.</p>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-none"
              onClick={() => setShowDelete(false)}
            >
              Batal
            </Button>
            <Button
              className="rounded-none bg-rose-600 text-white hover:bg-rose-700"
              disabled={deleteInventaris.isPending || !selectedItem}
              onClick={async () => {
                if (!selectedItem) return;
                try {
                  await deleteInventaris.mutateAsync(selectedItem.id);
                  toast.success("Aset dihapus");
                  setShowDelete(false);
                  setSelectedId(null);
                  void inventory.refetch();
                } catch (err: unknown) {
                  const message = err instanceof Error ? err.message : String(err);
                  toast.error(message);
                }
              }}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Modal (optional) */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Detail aset</DialogTitle>
          </DialogHeader>
          <InvetarisDetail selectedItem={selectedItem} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
