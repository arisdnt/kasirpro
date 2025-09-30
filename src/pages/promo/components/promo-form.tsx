import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PromoInput, PromoWithRelations } from "@/features/promo/types";
import {
  useCreatePromoMutation,
  useUpdatePromoMutation,
} from "@/features/promo/use-promos";
import { cn } from "@/lib/utils";
import { RefreshCw, Save } from "lucide-react";

type StoreOption = { value: string; label: string };

type PromoFormProps = {
  onSuccess: () => void;
  mode?: "create" | "edit";
  promo?: PromoWithRelations | null;
  storeOptions: StoreOption[];
  defaultStoreId?: string | null;
};

type FormState = {
  tokoId: string | null;
  nama: string;
  deskripsi: string;
  kode: string;
  tipe: string;
  level: string;
  nilai: number;
  hargaSpesial: number | null;
  beliQty: number | null;
  gratisQty: number | null;
  syaratMinQty: number | null;
  syaratMinTotal: number | null;
  mulai: string;
  selesai: string;
  hariDalamMinggu: number[];
  jamMulai: string;
  jamSelesai: string;
  limitPerPelanggan: number | null;
  limitKeseluruhan: number | null;
  prioritas: number;
  isOtomatis: boolean;
  status: string;
};

const promoTypes = [
  { value: "diskon_persen", label: "Diskon Persen" },
  { value: "diskon_nominal", label: "Diskon Nominal" },
  { value: "harga_spesial", label: "Harga Spesial" },
  { value: "beli_x_gratis_y", label: "Beli X Gratis Y" },
  { value: "bundling", label: "Bundling" },
];

const promoLevels = [
  { value: "per_item", label: "Per Item" },
  { value: "per_transaksi", label: "Per Transaksi" },
];

const promoStatuses = [
  { value: "draft", label: "Draft" },
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Nonaktif" },
  { value: "kedaluwarsa", label: "Kedaluwarsa" },
];

const weekdayOptions: Array<{ value: number; label: string }> = [
  { value: 0, label: "Senin" },
  { value: 1, label: "Selasa" },
  { value: 2, label: "Rabu" },
  { value: 3, label: "Kamis" },
  { value: 4, label: "Jumat" },
  { value: 5, label: "Sabtu" },
  { value: 6, label: "Minggu" },
];

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromDateTimeLocal(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function mapPromoToState(promo: PromoWithRelations): FormState {
  return {
    tokoId: promo.tokoId ?? null,
    nama: promo.nama,
    deskripsi: promo.deskripsi ?? "",
    kode: promo.kode ?? "",
    tipe: promo.tipe,
    level: promo.level,
    nilai: promo.nilai,
    hargaSpesial: promo.hargaSpesial,
    beliQty: promo.beliQty,
    gratisQty: promo.gratisQty,
    syaratMinQty: promo.syaratMinQty,
    syaratMinTotal: promo.syaratMinTotal,
    mulai: toDateTimeLocal(promo.mulai),
    selesai: toDateTimeLocal(promo.selesai),
    hariDalamMinggu: promo.hariDalamMinggu ?? [],
    jamMulai: promo.jamMulai ?? "",
    jamSelesai: promo.jamSelesai ?? "",
    limitPerPelanggan: promo.limitPerPelanggan,
    limitKeseluruhan: promo.limitKeseluruhan,
    prioritas: promo.prioritas,
    isOtomatis: promo.isOtomatis,
    status: promo.status,
  };
}

const defaultState: FormState = {
  tokoId: null,
  nama: "",
  deskripsi: "",
  kode: "",
  tipe: "diskon_persen",
  level: "per_item",
  nilai: 0,
  hargaSpesial: null,
  beliQty: null,
  gratisQty: null,
  syaratMinQty: null,
  syaratMinTotal: null,
  mulai: toDateTimeLocal(new Date().toISOString()),
  selesai: "",
  hariDalamMinggu: [],
  jamMulai: "",
  jamSelesai: "",
  limitPerPelanggan: null,
  limitKeseluruhan: null,
  prioritas: 0,
  isOtomatis: true,
  status: "draft",
};

export function PromoForm({
  onSuccess,
  mode = "create",
  promo,
  storeOptions,
  defaultStoreId = null,
}: PromoFormProps) {
  const isEditMode = mode === "edit" && Boolean(promo);
  const [form, setForm] = useState<FormState>(() => {
    if (isEditMode && promo) return mapPromoToState(promo);
    return { ...defaultState, tokoId: defaultStoreId ?? null };
  });

  const createMutation = useCreatePromoMutation();
  const updateMutation = useUpdatePromoMutation(promo?.id ?? "");

  useEffect(() => {
    if (isEditMode && promo) {
      setForm(mapPromoToState(promo));
    } else if (!isEditMode) {
      setForm({ ...defaultState, tokoId: defaultStoreId ?? null });
    }
  }, [isEditMode, promo, defaultStoreId]);

  const activeMutation = useMemo(
    () => (isEditMode ? updateMutation : createMutation),
    [createMutation, isEditMode, updateMutation],
  );

  const handleSet = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleWeekday = (value: number) => {
    setForm((prev) => {
      const exists = prev.hariDalamMinggu.includes(value);
      return {
        ...prev,
        hariDalamMinggu: exists
          ? prev.hariDalamMinggu.filter((item) => item !== value)
          : [...prev.hariDalamMinggu, value].sort((a, b) => a - b),
      };
    });
  };

  const submitDisabled =
    activeMutation.isPending ||
    !form.nama.trim() ||
    !form.mulai;

  const buildInputPayload = (): PromoInput => ({
    nama: form.nama.trim(),
    deskripsi: form.deskripsi.trim() ? form.deskripsi.trim() : null,
    kode: form.kode.trim() ? form.kode.trim() : null,
    tipe: form.tipe,
    level: form.level,
    nilai: Number(form.nilai) || 0,
    hargaSpesial:
      form.tipe === "harga_spesial" && form.hargaSpesial != null
        ? Number(form.hargaSpesial)
        : form.hargaSpesial ?? null,
    beliQty: form.beliQty != null ? Number(form.beliQty) : null,
    gratisQty: form.gratisQty != null ? Number(form.gratisQty) : null,
    syaratMinQty: form.syaratMinQty != null ? Number(form.syaratMinQty) : null,
    syaratMinTotal: form.syaratMinTotal != null ? Number(form.syaratMinTotal) : null,
    mulai: fromDateTimeLocal(form.mulai) ?? new Date().toISOString(),
    selesai: fromDateTimeLocal(form.selesai) ?? null,
    hariDalamMinggu: form.hariDalamMinggu.length ? form.hariDalamMinggu : null,
    jamMulai: form.jamMulai || null,
    jamSelesai: form.jamSelesai || null,
    limitPerPelanggan: form.limitPerPelanggan != null ? Number(form.limitPerPelanggan) : null,
    limitKeseluruhan: form.limitKeseluruhan != null ? Number(form.limitKeseluruhan) : null,
    prioritas: Number(form.prioritas) || 0,
    isOtomatis: form.isOtomatis,
    status: form.status,
    tokoId: form.tokoId && form.tokoId !== "all" ? form.tokoId : null,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = buildInputPayload();
    if (isEditMode) {
      if (!promo) return;
      await updateMutation.mutateAsync(payload);
    } else {
      await createMutation.mutateAsync(payload);
      setForm({ ...defaultState, tokoId: defaultStoreId ?? null });
    }
    onSuccess();
  };

  const isValueFieldVisible = form.tipe === "diskon_persen" || form.tipe === "diskon_nominal";
  const isSpecialPriceVisible = form.tipe === "harga_spesial";
  const isBuyGetVisible = form.tipe === "beli_x_gratis_y";

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="tokoId">Toko</Label>
          <select
            id="tokoId"
            className="h-10 w-full rounded-none border border-slate-300 bg-white px-3 text-sm"
            value={form.tokoId ?? ""}
            onChange={(event) => handleSet("tokoId", event.target.value || null)}
          >
            <option value="">Semua toko</option>
            {storeOptions.map((store) => (
              <option key={store.value} value={store.value}>
                {store.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="nama">Nama Promo</Label>
          <Input
            id="nama"
            value={form.nama}
            onChange={(event) => handleSet("nama", event.target.value)}
            required
            className="rounded-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="kode">Kode Promo</Label>
          <Input
            id="kode"
            value={form.kode}
            onChange={(event) => handleSet("kode", event.target.value)}
            placeholder="Opsional"
            className="rounded-none"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="h-10 w-full rounded-none border border-slate-300 bg-white px-3 text-sm"
            value={form.status}
            onChange={(event) => handleSet("status", event.target.value)}
          >
            {promoStatuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deskripsi">Deskripsi</Label>
        <Textarea
          id="deskripsi"
          value={form.deskripsi}
          onChange={(event) => handleSet("deskripsi", event.target.value)}
          rows={3}
          className="rounded-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="tipe">Tipe Promo</Label>
          <select
            id="tipe"
            className="h-10 w-full rounded-none border border-slate-300 bg-white px-3 text-sm"
            value={form.tipe}
            onChange={(event) => handleSet("tipe", event.target.value)}
          >
            {promoTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">Level Promo</Label>
          <select
            id="level"
            className="h-10 w-full rounded-none border border-slate-300 bg-white px-3 text-sm"
            value={form.level}
            onChange={(event) => handleSet("level", event.target.value)}
          >
            {promoLevels.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="prioritas">Prioritas</Label>
          <Input
            id="prioritas"
            type="number"
            min={0}
            className="rounded-none"
            value={form.prioritas}
            onChange={(event) => handleSet("prioritas", Number(event.target.value) || 0)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {isValueFieldVisible && (
          <div className="space-y-2">
            <Label htmlFor="nilai">Nilai</Label>
            <Input
              id="nilai"
              type="number"
              step="0.01"
              className="rounded-none"
              value={form.nilai}
              onChange={(event) => handleSet("nilai", Number(event.target.value) || 0)}
            />
          </div>
        )}
        {isSpecialPriceVisible && (
          <div className="space-y-2">
            <Label htmlFor="hargaSpesial">Harga Spesial</Label>
            <Input
              id="hargaSpesial"
              type="number"
              className="rounded-none"
              value={form.hargaSpesial ?? ""}
              onChange={(event) =>
                handleSet("hargaSpesial", event.target.value ? Number(event.target.value) : null)
              }
            />
          </div>
        )}
        {isBuyGetVisible && (
          <>
            <div className="space-y-2">
              <Label htmlFor="beliQty">Beli Qty</Label>
              <Input
                id="beliQty"
                type="number"
                min={0}
                className="rounded-none"
                value={form.beliQty ?? ""}
                onChange={(event) =>
                  handleSet("beliQty", event.target.value ? Number(event.target.value) : null)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gratisQty">Gratis Qty</Label>
              <Input
                id="gratisQty"
                type="number"
                min={0}
                className="rounded-none"
                value={form.gratisQty ?? ""}
                onChange={(event) =>
                  handleSet("gratisQty", event.target.value ? Number(event.target.value) : null)
                }
              />
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="syaratMinQty">Minimum Qty</Label>
          <Input
            id="syaratMinQty"
            type="number"
            min={0}
            className="rounded-none"
            value={form.syaratMinQty ?? ""}
            onChange={(event) =>
              handleSet("syaratMinQty", event.target.value ? Number(event.target.value) : null)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="syaratMinTotal">Minimum Total</Label>
          <Input
            id="syaratMinTotal"
            type="number"
            min={0}
            className="rounded-none"
            value={form.syaratMinTotal ?? ""}
            onChange={(event) =>
              handleSet("syaratMinTotal", event.target.value ? Number(event.target.value) : null)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="limitPerPelanggan">Limit per Pelanggan</Label>
          <Input
            id="limitPerPelanggan"
            type="number"
            min={0}
            className="rounded-none"
            value={form.limitPerPelanggan ?? ""}
            onChange={(event) =>
              handleSet(
                "limitPerPelanggan",
                event.target.value ? Number(event.target.value) : null,
              )
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="limitKeseluruhan">Limit Keseluruhan</Label>
          <Input
            id="limitKeseluruhan"
            type="number"
            min={0}
            className="rounded-none"
            value={form.limitKeseluruhan ?? ""}
            onChange={(event) =>
              handleSet(
                "limitKeseluruhan",
                event.target.value ? Number(event.target.value) : null,
              )
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mulai">Mulai</Label>
          <Input
            id="mulai"
            type="datetime-local"
            className="rounded-none"
            value={form.mulai}
            onChange={(event) => handleSet("mulai", event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="selesai">Selesai</Label>
          <Input
            id="selesai"
            type="datetime-local"
            className="rounded-none"
            value={form.selesai}
            onChange={(event) => handleSet("selesai", event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Hari Aktif</Label>
          <div className="flex flex-wrap gap-3 rounded border border-slate-200 p-3">
            {weekdayOptions.map((day) => {
              const checked = form.hariDalamMinggu.includes(day.value);
              return (
                <label key={day.value} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleWeekday(day.value)}
                    className="h-4 w-4"
                  />
                  {day.label}
                </label>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="jamMulai">Jam Mulai</Label>
            <Input
              id="jamMulai"
              type="time"
              className="rounded-none"
              value={form.jamMulai}
              onChange={(event) => handleSet("jamMulai", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jamSelesai">Jam Selesai</Label>
            <Input
              id="jamSelesai"
              type="time"
              className="rounded-none"
              value={form.jamSelesai}
              onChange={(event) => handleSet("jamSelesai", event.target.value)}
            />
          </div>
          <div className="col-span-2 flex items-center gap-3 rounded border border-slate-200 p-3">
            <input
              id="isOtomatis"
              type="checkbox"
              checked={form.isOtomatis}
              onChange={(event) => handleSet("isOtomatis", event.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="isOtomatis" className="text-sm font-medium text-slate-700">
              Terapkan otomatis pada transaksi yang sesuai
            </Label>
          </div>
        </div>
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
              {isEditMode ? "Simpan Perubahan" : "Simpan Promo"}
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
