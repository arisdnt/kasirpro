import { Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import { Truck } from "lucide-react";
import type { Supplier } from "@/types/partners";
import type { SupplierMode } from "../purchase-entry-types";

interface SupplierSelectorProps {
  supplierMode: SupplierMode;
  selectedSupplierId: string | null;
  externalSupplierName: string;
  suppliers: Supplier[];
  loadingSuppliers: boolean;
  activeSupplierName: string;
  onModeChange: (mode: SupplierMode) => void;
  onSupplierChange: (id: string | null) => void;
  onExternalNameChange: (name: string) => void;
}

export function SupplierSelector({
  supplierMode,
  selectedSupplierId,
  externalSupplierName,
  suppliers,
  loadingSuppliers,
  activeSupplierName,
  onModeChange,
  onSupplierChange,
  onExternalNameChange,
}: SupplierSelectorProps) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Tabs
        aria-label="Supplier mode"
        selectedKey={supplierMode}
        onSelectionChange={(key) => onModeChange(key as SupplierMode)}
        disableAnimation
        classNames={{
          tabList: "flex gap-2 border-b border-slate-200 bg-transparent p-0",
          tab: "min-w-[120px] rounded-none border-b-2 border-transparent px-3 py-2 text-sm font-semibold text-slate-500 transition data-[hover=true]:bg-slate-50 data-[hover=true]:text-[#476EAE] data-[selected=true]:border-[#476EAE] data-[selected=true]:text-[#476EAE]",
          tabContent: "w-full justify-center",
          cursor: "hidden",
        }}
      >
        <Tab key="registered" title="Terdaftar">
          <div className="space-y-2">
            <select
              value={selectedSupplierId ?? ""}
              onChange={(event) => onSupplierChange(event.target.value || null)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-inner focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              disabled={loadingSuppliers}
            >
              <option value="">Pilih supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.nama} ({supplier.kode})
                </option>
              ))}
            </select>
          </div>
        </Tab>
        <Tab key="external" title="Bebas">
          <div className="space-y-2">
            <input
              value={externalSupplierName}
              onChange={(event) => onExternalNameChange(event.target.value)}
              placeholder="Nama supplier"
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-inner focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </Tab>
      </Tabs>

      <div className="border border-dashed border-sky-200 bg-sky-50/70 p-4 rounded-none">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-200/80">
            <Truck className="h-5 w-5 text-sky-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">{activeSupplierName}</p>
            <p className="text-xs text-slate-500">Pemasok saat ini</p>
          </div>
        </div>
      </div>
    </div>
  );
}