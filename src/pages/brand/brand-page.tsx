import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useBrandsQuery } from "@/features/brand/use-brands";
import { BrandFilters } from "./brand-filters";
import { BrandStatistics } from "./brand-statistics";
import { BrandTable } from "./brand-table";
import { BrandDetail } from "./brand-detail";
import { BrandFormModal } from "./brand-form-modal";
import { useCreateBrandMutation, useDeleteBrandMutation, useUpdateBrandMutation } from "@/features/brand/mutations";

type ScopeFilter = "all" | "global" | "store";

export function BrandPage() {
  const brands = useBrandsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [scope, setScope] = useState<ScopeFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const createBrand = useCreateBrandMutation();
  const updateBrand = useUpdateBrandMutation();
  const deleteBrand = useDeleteBrandMutation();

  const filteredBrands = useMemo(() => {
    const data = brands.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nama.toLowerCase().includes(query) ||
          (item.tokoId ?? "").toLowerCase().includes(query);
        const matchesScope =
          scope === "all"
            ? true
            : scope === "global"
            ? !item.tokoId
            : Boolean(item.tokoId);
        return matchesSearch && matchesScope;
      })
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [brands.data, searchTerm, scope]);

  const selectedBrand = useMemo(() => {
    if (!selectedId) return null;
    return filteredBrands.find((item) => item.id === selectedId) ?? null;
  }, [filteredBrands, selectedId]);

  const handleRefresh = () => {
    brands.refetch();
  };

  const handleAddNew = () => {
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = () => {
    if (!selectedBrand) return;
    setEditingId(selectedBrand.id);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedBrand) return;
    const count = selectedBrand.jumlahProduk ?? 0;
    const ok = window.confirm(
      `Hapus brand "${selectedBrand.nama}"?${count > 0 ? `\nPeringatan: Brand ini memiliki ${count} produk terkait.` : ""}`
    );
    if (!ok) return;
    await deleteBrand.mutateAsync(selectedBrand.id);
    setSelectedId(null);
  };

  const handleSubmitForm = async (payload: { nama: string; tokoId?: string | null }) => {
    if (editingId) {
      await updateBrand.mutateAsync({ id: editingId, ...payload });
    } else {
      await createBrand.mutateAsync(payload);
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      {/* Header Form - glassmorphism */}
      <Card
        className="shrink-0 shadow-sm rounded-none border border-slate-200"
        style={{ backgroundColor: '#f6f9ff' }}
      >
        <CardContent className="flex flex-col gap-2 py-3 px-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <BrandFilters
              searchTerm={searchTerm}
              scope={scope}
              onSearchChange={setSearchTerm}
              onScopeChange={setScope}
            />
            <BrandStatistics
              data={brands.data ?? []}
              onRefresh={handleRefresh}
              onAddNew={handleAddNew}
              isRefreshing={brands.isFetching}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <BrandTable
            data={filteredBrands}
            isLoading={brands.isLoading}
            selectedId={selectedId}
            onSelectItem={setSelectedId}
          />
        </div>
        <div
          className="w-full lg:w-1/4"
          style={{ backgroundColor: '#e6f4f1', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}
        >
          <BrandDetail selectedBrand={selectedBrand} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>

      <BrandFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initial={editingId ? selectedBrand ?? null : null}
        onSubmit={handleSubmitForm}
        isSubmitting={createBrand.isPending || updateBrand.isPending}
      />
    </div>
  );
}
