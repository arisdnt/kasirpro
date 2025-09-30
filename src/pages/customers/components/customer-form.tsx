import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import type { Customer, CustomerInput } from "@/features/customers/types";
import {
  useCustomerCreateMutation,
  useCustomerUpdateMutation,
} from "@/features/customers/use-customers";
import { cn } from "@/lib/utils";
import { RefreshCw, Save } from "lucide-react";

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Nonaktif" },
];

const GENDER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "l", label: "Laki-laki" },
  { value: "p", label: "Perempuan" },
];

type StoreOption = { value: string; label: string };

type FormState = {
  kode: string;
  nama: string;
  status: string;
  telepon: string;
  email: string;
  alamat: string;
  tanggalLahir: string;
  jenisKelamin: string;
  tokoId: string | null;
};

type CustomerFormProps = {
  mode?: "create" | "edit";
  customer?: Customer | null;
  storeOptions: StoreOption[];
  defaultStoreId?: string | null;
  onSuccess: () => void;
};

const defaultState: FormState = {
  kode: "",
  nama: "",
  status: "aktif",
  telepon: "",
  email: "",
  alamat: "",
  tanggalLahir: "",
  jenisKelamin: "",
  tokoId: null,
};

function toDateInputValue(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return ;
}

export function CustomerForm({
  mode = "create",
  customer,
  storeOptions,
  defaultStoreId = null,
  onSuccess,
}: CustomerFormProps) {
  const isEditMode = mode === "edit" && Boolean(customer);
  const [form, setForm] = useState<FormState>(() => {
    if (isEditMode && customer) {
      return {
        kode: customer.kode ?? "",
        nama: customer.nama,
        status: customer.status ?? "aktif",
        telepon: customer.telepon ?? "",
        email: customer.email ?? "",
        alamat: customer.alamat ?? "",
        tanggalLahir: toDateInputValue(customer.tanggalLahir),
        jenisKelamin: customer.jenisKelamin ?? "",
        tokoId: customer.tokoId ?? null,
      };
    }
    return { ...defaultState, tokoId: defaultStoreId ?? null };
  });

  const createMutation = useCustomerCreateMutation();
  const updateMutation = useCustomerUpdateMutation();

  useEffect(() => {
    if (isEditMode && customer) {
      setForm({
        kode: customer.kode ?? "",
        nama: customer.nama,
        status: customer.status ?? "aktif",
        telepon: customer.telepon ?? "",
        email: customer.email ?? "",
        alamat: customer.alamat ?? "",
        tanggalLahir: toDateInputValue(customer.tanggalLahir),
        jenisKelamin: customer.jenisKelamin ?? "",
        tokoId: customer.tokoId ?? null,
      });
    } else if (!isEditMode) {
      setForm({ ...defaultState, tokoId: defaultStoreId ?? null });
    }
  }, [customer, defaultStoreId, isEditMode]);

  const activeMutation = useMemo(
    () => (isEditMode ? updateMutation : createMutation),
    [createMutation, isEditMode, updateMutation],
  );

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitDisabled =
    activeMutation.isPending ||
    !form.nama.trim() ||
    !form.kode.trim();

  const buildPayload = (): CustomerInput => ({
    kode: form.kode.trim(),
    nama: form.nama.trim(),
    status: form.status.trim() || "aktif",
    telepon: form.telepon.trim() ? form.telepon.trim() : null,
    email: form.email.trim() ? form.email.trim() : null,
    alamat: form.alamat.trim() ? form.alamat.trim() : null,
    tanggalLahir: form.tanggalLahir.trim() ? form.tanggalLahir.trim() : null,
    jenisKelamin: form.jenisKelamin.trim() ? form.jenisKelamin.trim() : null,
    tokoId: form.tokoId ?? null,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = buildPayload();
    if (isEditMode) {
      if (!customer) return;
      await updateMutation.mutateAsync({ id: customer.id, input: payload });
    } else {
      await createMutation.mutateAsync(payload);
      setForm({ ...defaultState, tokoId: defaultStoreId ?? null });
    }
    onSuccess();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="customer-name">Nama</Label>
          <Input
            id="customer-name"
            value={form.nama}
            onChange={(event) => handleChange("nama", event.target.value)}
            required
            className="rounded-none"
            placeholder="Nama pelanggan"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer-code">Kode</Label>
          <Input
            id="customer-code"
            value={form.kode}
            onChange={(event) => handleChange("kode", event.target.value)}
            required
            className="rounded-none"
            placeholder="Kode unik pelanggan"
            disabled={isEditMode}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="customer-status">Status</Label>
          <select
            id="customer-status"
            className="h-10 w-full rounded-none border border-slate-300 bg-white px-3 text-sm"
            value={form.status}
            onChange={(event) => handleChange("status", event.target.value)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer-store">Cakupan</Label>
          <select
            id="customer-store"
            className="h-10 w-full rounded-none border border-slate-300 bg-white px-3 text-sm"
            value={form.tokoId ?? ""}
            onChange={(event) => handleChange("tokoId", event.target.value || null)}
          >
            <option value="">Tenant (semua toko)</option>
            {storeOptions.map((store) => (
              <option key={store.value} value={store.value}>
                {store.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="customer-phone">Telepon</Label>
          <Input
            id="customer-phone"
            value={form.telepon}
            onChange={(event) => handleChange("telepon", event.target.value)}
            className="rounded-none"
            placeholder="Contoh: 08123456789"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer-email">Email</Label>
          <Input
            id="customer-email"
            type="email"
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
            className="rounded-none"
            placeholder="nama@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="customer-birth">Tanggal Lahir</Label>
          <Input
            id="customer-birth"
            type="date"
            value={form.tanggalLahir}
            onChange={(event) => handleChange("tanggalLahir", event.target.value)}
            className="rounded-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer-gender">Jenis Kelamin</Label>
          <select
            id="customer-gender"
            className="h-10 w-full rounded-none border border-slate-300 bg-white px-3 text-sm"
            value={form.jenisKelamin ?? ""}
            onChange={(event) => handleChange("jenisKelamin", event.target.value)}
          >
            <option value="">Tidak ditentukan</option>
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customer-address">Alamat</Label>
        <Textarea
          id="customer-address"
          value={form.alamat}
          onChange={(event) => handleChange("alamat", event.target.value)}
          rows={3}
          className="rounded-none"
          placeholder="Alamat lengkap pelanggan"
        />
      </div>

      <DialogFooter>
        <Button
          type="submit"
          disabled={submitDisabled}
          className={cn(
            "rounded-none gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
            submitDisabled && "opacity-70",
          )}
        >
          {activeMutation.isPending ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditMode ? "Simpan Perubahan" : "Simpan Pelanggan"}
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
