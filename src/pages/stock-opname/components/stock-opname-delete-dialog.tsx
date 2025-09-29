import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteStockOpname } from "@/features/stock-opname/use-stock-opname";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  id: string | null;
  nomor?: string | null;
};

export default function StockOpnameDeleteDialog({ open, onOpenChange, id, nomor }: Props) {
  const mutation = useDeleteStockOpname();

  const submit = async () => {
    if (!id) return;
    await mutation.mutateAsync(id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Stock Opname</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-600">
          Yakin menghapus opname {nomor ? `"${nomor}"` : "ini"}? Tindakan ini tidak dapat dibatalkan.
        </p>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
            Batal
          </Button>
          <Button variant="destructive" onClick={submit} disabled={mutation.isPending || !id}>
            {mutation.isPending ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
