import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { useCreateStockOpname } from "@/features/stock-opname/use-stock-opname";
import { useProductSearch } from "@/features/stock-opname/use-stock-opname-products";
import { addOpnameItem } from "@/features/stock-opname/items-api";

type NewItem = { produkId: string; nama: string; kode: string | null; stockSistem: number; stockFisik: string };

export default function StockOpnameCreateDialog({ open, onOpenChange, defaultStoreId }: { open: boolean; onOpenChange: (v: boolean) => void; defaultStoreId?: string | null }) {
  const { state: { user } } = useSupabaseAuth();
  const tokoId = defaultStoreId ?? user?.tokoId ?? null;
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().slice(0, 16));
  const [catatan, setCatatan] = useState("");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<NewItem[]>([]);
  const createMut = useCreateStockOpname();
  const search = useProductSearch({ enabled: open, tenantId: user?.tenantId, tokoId, q });

  const canSave = useMemo(() => Boolean(tokoId) && items.length > 0, [tokoId, items.length]);

  const addCandidate = (prod: { id: string; nama: string; kode: string | null; stock: number }) => {
    if (items.some((i) => i.produkId === prod.id)) return;
    setItems((prev) => [...prev, { produkId: prod.id, nama: prod.nama, kode: prod.kode, stockSistem: prod.stock, stockFisik: "" }]);
  };

  const removeItem = (pid: string) => setItems((prev) => prev.filter((i) => i.produkId !== pid));

  const submit = async () => {
    if (!user || !tokoId || items.length === 0) return;
    const header = await createMut.mutateAsync({ tokoId, tanggal: new Date(tanggal).toISOString(), catatan });
    for (const it of items) {
      const fisik = Number(it.stockFisik || 0);
      await addOpnameItem({ opnameId: header.id, produkId: it.produkId, stockFisik: fisik, stockSistem: it.stockSistem });
    }
    onOpenChange(false);
    setItems([]);
    setQ("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white rounded-none border border-slate-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-800 font-semibold">Buat Stock Opname</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 col-span-1">
              <label className="text-xs text-slate-600 font-medium">Tanggal</label>
              <Input type="datetime-local" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="bg-white border-slate-300 rounded-none focus-visible:ring-blue-400/50 focus-visible:border-blue-400" />
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-xs text-slate-600 font-medium">Catatan</label>
              <Input value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Masukkan catatan..." className="bg-white border-slate-300 rounded-none focus-visible:ring-blue-400/50 focus-visible:border-blue-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-600 font-medium">Cari Produk (kode/nama/barcode)</label>
            <div className="relative">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ketik untuk mencari..." className="bg-white border-slate-300 rounded-none focus-visible:ring-blue-400/50 focus-visible:border-blue-400" />
              {q.trim() && (search.data?.length > 0 || search.isLoading) && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 border border-slate-300 rounded-none max-h-40 overflow-auto bg-white shadow-lg">
                  {search.isLoading ? (
                    <div className="px-3 py-2 text-xs text-slate-500 text-center">Memuat...</div>
                  ) : (
                    (search.data ?? []).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          addCandidate(p);
                          setQ("");
                        }}
                        className={`px-3 py-2 cursor-pointer border-b border-slate-100 last:border-b-0 hover:bg-slate-50 ${
                          items.some((i) => i.produkId === p.id)
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'text-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{p.nama}</div>
                            <div className="text-xs text-slate-500">{p.kode ?? "-"}</div>
                          </div>
                          <div className="text-xs text-slate-600 ml-3">
                            Stock: {p.stock}
                          </div>
                        </div>
                        {items.some((i) => i.produkId === p.id) && (
                          <div className="text-xs text-slate-400 mt-1">Sudah ditambahkan</div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-600 font-medium">Item Opname</label>
            <div className="border border-slate-300 rounded-none max-h-56 overflow-auto bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead className="w-24 text-right">Sistem</TableHead>
                    <TableHead className="w-28">Fisik</TableHead>
                    <TableHead className="w-24">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((it) => (
                    <TableRow key={it.produkId}>
                      <TableCell>
                        <div className="text-sm font-medium">{it.nama}</div>
                        <div className="text-xs text-slate-500">{it.kode ?? "-"}</div>
                      </TableCell>
                      <TableCell className="text-right">{it.stockSistem}</TableCell>
                      <TableCell>
                        <Input type="number" value={it.stockFisik} onChange={(e) => setItems((prev) => prev.map((x) => x.produkId === it.produkId ? { ...x, stockFisik: e.target.value } : x))} className="bg-white border-slate-300 rounded-none focus-visible:ring-blue-400/50 focus-visible:border-blue-400 h-8" />
                      </TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => removeItem(it.produkId)} className="rounded-none bg-red-500 hover:bg-red-600 text-white border-0 h-7 px-2 text-xs">Hapus</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center text-xs py-3">Belum ada item</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={createMut.isPending} className="rounded-none border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700">Batal</Button>
          <Button onClick={submit} disabled={!canSave || createMut.isPending} className="rounded-none bg-blue-500 hover:bg-blue-600 text-white border-0">{createMut.isPending ? "Menyimpan..." : "Simpan"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

