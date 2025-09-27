import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SupplierForm {
  kode: string;
  nama: string;
  kontakPerson: string;
  telepon: string;
  email: string;
  status: "aktif" | "nonaktif";
  alamat: string;
  kota: string;
  provinsi: string;
  kodePos: string;
  npwp: string;
  tempoPembayaran: number;
  limitKredit: number;
}

interface SupplierModalsProps {
  showCreate: boolean;
  showEdit: boolean;
  showDelete: boolean;
  form: SupplierForm;
  selectedId: string | null;
  onCloseCreate: () => void;
  onCloseEdit: () => void;
  onCloseDelete: () => void;
  onFormChange: (form: SupplierForm) => void;
  onCreate: () => Promise<void>;
  onUpdate: () => Promise<void>;
  onDelete: () => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

const FormFields = ({ form, onFormChange }: { form: SupplierForm; onFormChange: (form: SupplierForm) => void }) => (
  <div className="grid gap-3">
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs text-slate-600">Kode</label>
        <Input value={form.kode} onChange={(e) => onFormChange({ ...form, kode: e.target.value })} />
      </div>
      <div>
        <label className="text-xs text-slate-600">Nama</label>
        <Input value={form.nama} onChange={(e) => onFormChange({ ...form, nama: e.target.value })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs text-slate-600">Kontak</label>
        <Input value={form.kontakPerson} onChange={(e) => onFormChange({ ...form, kontakPerson: e.target.value })} />
      </div>
      <div>
        <label className="text-xs text-slate-600">Telepon</label>
        <Input value={form.telepon} onChange={(e) => onFormChange({ ...form, telepon: e.target.value })} />
      </div>
    </div>
    <div>
      <label className="text-xs text-slate-600">Email</label>
      <Input value={form.email} onChange={(e) => onFormChange({ ...form, email: e.target.value })} />
    </div>
    <div>
      <label className="text-xs text-slate-600">Alamat</label>
      <Input value={form.alamat} onChange={(e) => onFormChange({ ...form, alamat: e.target.value })} />
    </div>
    <div className="grid grid-cols-3 gap-3">
      <div>
        <label className="text-xs text-slate-600">Kota</label>
        <Input value={form.kota} onChange={(e) => onFormChange({ ...form, kota: e.target.value })} />
      </div>
      <div>
        <label className="text-xs text-slate-600">Provinsi</label>
        <Input value={form.provinsi} onChange={(e) => onFormChange({ ...form, provinsi: e.target.value })} />
      </div>
      <div>
        <label className="text-xs text-slate-600">Kode Pos</label>
        <Input value={form.kodePos} onChange={(e) => onFormChange({ ...form, kodePos: e.target.value })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs text-slate-600">NPWP</label>
        <Input value={form.npwp} onChange={(e) => onFormChange({ ...form, npwp: e.target.value })} />
      </div>
      <div>
        <label className="text-xs text-slate-600">Status</label>
        <select
          className="h-10 w-full rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner"
          value={form.status}
          onChange={(e) => onFormChange({ ...form, status: e.target.value as "aktif" | "nonaktif" })}
        >
          <option value="aktif">aktif</option>
          <option value="nonaktif">nonaktif</option>
        </select>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs text-slate-600">Tempo Pembayaran (hari)</label>
        <Input type="number" value={form.tempoPembayaran}
          onChange={(e) => onFormChange({ ...form, tempoPembayaran: Number(e.target.value || 0) })} />
      </div>
      <div>
        <label className="text-xs text-slate-600">Limit Kredit</label>
        <Input type="number" value={form.limitKredit}
          onChange={(e) => onFormChange({ ...form, limitKredit: Number(e.target.value || 0) })} />
      </div>
    </div>
  </div>
);

export function SupplierModals({
  showCreate,
  showEdit,
  showDelete,
  form,
  selectedId,
  onCloseCreate,
  onCloseEdit,
  onCloseDelete,
  onFormChange,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
  isDeleting,
}: SupplierModalsProps) {
  const handleCreate = async () => {
    if (!form.kode || !form.nama) {
      toast.error("Kode dan nama wajib diisi");
      return;
    }
    await onCreate();
  };

  const handleUpdate = async () => {
    if (!selectedId) return;
    if (!form.kode || !form.nama) {
      toast.error("Kode dan nama wajib diisi");
      return;
    }
    await onUpdate();
  };

  return (
    <>
      {/* Create Modal */}
      <Dialog open={showCreate} onOpenChange={onCloseCreate}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Supplier baru</DialogTitle>
          </DialogHeader>
          <FormFields form={form} onFormChange={onFormChange} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={onCloseCreate}
              className="rounded-none"
            >
              Batal
            </Button>
            <Button
              className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
              disabled={isCreating}
              onClick={handleCreate}
            >
              {isCreating ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEdit} onOpenChange={onCloseEdit}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Edit supplier</DialogTitle>
          </DialogHeader>
          <FormFields form={form} onFormChange={onFormChange} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={onCloseEdit}
              className="rounded-none"
            >
              Batal
            </Button>
            <Button
              className="rounded-none bg-[#476EAE] text-white hover:bg-[#3f63a0]"
              disabled={isUpdating || !selectedId}
              onClick={handleUpdate}
            >
              {isUpdating ? "Menyimpan..." : "Simpan perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDelete} onOpenChange={onCloseDelete}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Hapus supplier?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">Tindakan ini tidak dapat dibatalkan.</p>
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-none"
              onClick={onCloseDelete}
            >
              Batal
            </Button>
            <Button
              className="rounded-none bg-red-600 hover:bg-red-700"
              disabled={isDeleting || !selectedId}
              onClick={onDelete}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}