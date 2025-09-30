import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import type { SystemConfig, SystemConfigInput } from "@/features/system-config/types";
import {
  useSystemConfigCreateMutation,
  useSystemConfigUpdateMutation,
} from "@/features/system-config/use-system-config";
import { cn } from "@/lib/utils";
import { RefreshCw, Save } from "lucide-react";

type StoreOption = { value: string; label: string };

type FormState = {
  key: string;
  tipe: string;
  value: string;
  deskripsi: string;
  tokoId: string | null;
};

type SystemConfigFormProps = {
  mode?: "create" | "edit";
  config?: SystemConfig | null;
  storeOptions: StoreOption[];
  defaultStoreId?: string | null;
  onSuccess: () => void;
};

const defaultState: FormState = {
  key: "",
  tipe: "string",
  value: "",
  deskripsi: "",
  tokoId: null,
};

const typeOptions = ["string", "number", "boolean", "json", "text"];

export function SystemConfigForm({
  mode = "create",
  config,
  storeOptions,
  defaultStoreId = null,
  onSuccess,
}: SystemConfigFormProps) {
  const isEditMode = mode === "edit" && Boolean(config);
  const [form, setForm] = useState<FormState>(() => {
    if (isEditMode && config) {
      return {
        key: config.key,
        tipe: config.tipe ?? "string",
        value: config.value ?? "",
        deskripsi: config.deskripsi ?? "",
        tokoId: config.tokoId ?? null,
      };
    }
    return { ...defaultState, tokoId: defaultStoreId ?? null };
  });

  const createMutation = useSystemConfigCreateMutation();
  const updateMutation = useSystemConfigUpdateMutation();

  useEffect(() => {
    if (isEditMode && config) {
      setForm({
        key: config.key,
        tipe: config.tipe ?? "string",
        value: config.value ?? "",
        deskripsi: config.deskripsi ?? "",
        tokoId: config.tokoId ?? null,
      });
    } else if (!isEditMode) {
      setForm({ ...defaultState, tokoId: defaultStoreId ?? null });
    }
  }, [config, defaultStoreId, isEditMode]);

  const activeMutation = useMemo(
    () => (isEditMode ? updateMutation : createMutation),
    [createMutation, isEditMode, updateMutation],
  );

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitDisabled =
    activeMutation.isPending ||
    !form.key.trim();

  const buildPayload = (): SystemConfigInput => ({
    key: form.key.trim(),
    tipe: form.tipe.trim() ? form.tipe.trim() : null,
    value: form.value.trim() ? form.value : null,
    deskripsi: form.deskripsi.trim() ? form.deskripsi.trim() : null,
    tokoId: form.tokoId && form.tokoId.length > 0 ? form.tokoId : null,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = buildPayload();
    if (isEditMode) {
      if (!config) return;
      await updateMutation.mutateAsync({ id: config.id, input: payload });
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
          <Label htmlFor="config-key">Key</Label>
          <Input
            id="config-key"
            value={form.key}
            onChange={(event) => handleChange("key", event.target.value)}
            placeholder="contoh: app.theme"
            required
            className="rounded-none"
            disabled={isEditMode}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="config-type">Tipe</Label>
          <select
            id="config-type"
            className="h-10 w-full rounded-none border border-slate-300 bg-white px-3 text-sm"
            value={form.tipe}
            onChange={(event) => handleChange("tipe", event.target.value)}
          >
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            {!typeOptions.includes(form.tipe) && form.tipe ? (
              <option value={form.tipe}>{form.tipe}</option>
            ) : null}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="config-scope">Cakupan</Label>
          <select
            id="config-scope"
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
        <div className="space-y-2">
          <Label htmlFor="config-value">Nilai</Label>
          <Textarea
            id="config-value"
            value={form.value}
            onChange={(event) => handleChange("value", event.target.value)}
            rows={4}
            className="rounded-none"
            placeholder="Isi nilai konfigurasi"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="config-description">Deskripsi</Label>
        <Textarea
          id="config-description"
          value={form.deskripsi}
          onChange={(event) => handleChange("deskripsi", event.target.value)}
          rows={3}
          className="rounded-none"
          placeholder="Tuliskan deskripsi singkat fungsi konfigurasi"
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
              {isEditMode ? "Simpan Perubahan" : "Simpan Konfigurasi"}
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
