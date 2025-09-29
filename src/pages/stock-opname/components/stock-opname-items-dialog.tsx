import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAddOpnameItem, useDeleteOpnameItem, useOpnameItems, useUpdateOpnameItem } from "@/features/stock-opname/use-stock-opname-items";

type Props = { open: boolean; onOpenChange: (v: boolean) => void; opnameId: string | null };

export default function StockOpnameItemsDialog({ open, onOpenChange, opnameId }: Props) {
  const list = useOpnameItems(opnameId);
  const addMut = useAddOpnameItem(opnameId);
  const upMut = useUpdateOpnameItem(opnameId);
  const delMut = useDeleteOpnameItem(opnameId);
  const [produkId, setProdukId] = useState("");
  const [stockFisik, setStockFisik] = useState<string>("");
  const [keterangan, setKeterangan] = useState("");

  const canAdd = useMemo(() => produkId && stockFisik !== "", [produkId, stockFisik]);

  const handleAdd = async () => {
    if (!opnameId || !canAdd) return;
    await addMut.mutateAsync({ opnameId, produkId, stockFisik: Number(stockFisik), keterangan });
    setProdukId("");
    setStockFisik("");
    setKeterangan("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Kelola Item Opname</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2">
            <Input className="col-span-2" placeholder="Produk ID" value={produkId} onChange={(e) => setProdukId(e.target.value)} />
            <Input type="number" placeholder="Stock Fisik" value={stockFisik} onChange={(e) => setStockFisik(e.target.value)} />
            <Input className="col-span-2" placeholder="Keterangan (opsional)" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAdd} disabled={!canAdd || addMut.isPending}>Tambah</Button>
          </div>
          <div className="border rounded">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead className="w-24 text-right">Sistem</TableHead>
                  <TableHead className="w-28">Fisik</TableHead>
                  <TableHead className="w-40">Keterangan</TableHead>
                  <TableHead className="w-28">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(list.data ?? []).map((it) => (
                  <TableRow key={it.id}>
                    <TableCell>
                      <div className="text-sm font-medium">{it.produkNama ?? it.produkId}</div>
                      <div className="text-xs text-slate-500">{it.produkKode ?? "-"}</div>
                    </TableCell>
                    <TableCell className="text-right">{it.stockSistem}</TableCell>
                    <TableCell>
                      <Input type="number" defaultValue={it.stockFisik} onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (v !== it.stockFisik) upMut.mutate({ id: it.id, stockFisik: v, keterangan: it.keterangan ?? null });
                      }} />
                    </TableCell>
                    <TableCell>
                      <Input defaultValue={it.keterangan ?? ""} onBlur={(e) => {
                        const v = e.target.value;
                        if (v !== (it.keterangan ?? "")) upMut.mutate({ id: it.id, stockFisik: it.stockFisik, keterangan: v });
                      }} />
                    </TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => delMut.mutate(it.id)} disabled={delMut.isPending}>Hapus</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {list.isLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-slate-500 py-6">Memuat...</TableCell>
                  </TableRow>
                )}
                {(!list.isLoading && (list.data ?? []).length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-slate-500 py-6">Belum ada item</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

