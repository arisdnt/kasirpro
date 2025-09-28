import { useState, useMemo } from "react";
import { useSupplierProductsQuery, useSupplierPurchasesQuery, useSuppliersQuery } from "@/features/suppliers/use-suppliers";
import { useCreateSupplier, useDeleteSupplier, useUpdateSupplier } from "@/features/suppliers/use-supplier-mutations";
import { toast } from "sonner";
import { SuppliersHeader } from "./components/suppliers-header";
import { SuppliersGrid } from "./components/suppliers-grid";
import { SupplierDetails } from "./components/supplier-details";
import { SupplierModals } from "./components/supplier-modals";

type StatusFilter = "all" | "aktif" | "nonaktif";

export function SuppliersPage() {
  const suppliers = useSuppliersQuery();
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [form, setForm] = useState({
    kode: "",
    nama: "",
    kontakPerson: "",
    telepon: "",
    email: "",
    status: "aktif" as "aktif" | "nonaktif",
    alamat: "",
    kota: "",
    provinsi: "",
    kodePos: "",
    npwp: "",
    tempoPembayaran: 30,
    limitKredit: 0,
  });

  const stats = useMemo(() => {
    const data = suppliers.data ?? [];
    const total = data.length;
    const aktif = data.filter((item) => item.status === "aktif").length;
    const nonaktif = total - aktif;
    return { total, aktif, nonaktif };
  }, [suppliers.data]);

  const filteredSuppliers = useMemo(() => {
    const data = suppliers.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nama.toLowerCase().includes(query) ||
          (item.kode ?? "").toLowerCase().includes(query) ||
          (item.kontakPerson ?? "").toLowerCase().includes(query) ||
          (item.kota ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.nama.localeCompare(b.nama));
  }, [suppliers.data, searchTerm, statusFilter]);

  const selectedSupplier = useMemo(() => {
    if (!selectedId) return null;
    return filteredSuppliers.find((item) => item.id === selectedId) ?? null;
  }, [filteredSuppliers, selectedId]);

  const supplierPurchases = useSupplierPurchasesQuery(selectedSupplier?.id ?? null);
  const supplierProducts = useSupplierProductsQuery(selectedSupplier?.id ?? null);

  const handleRefresh = () => {
    suppliers.refetch();
  };

  const handleCreateNew = () => {
    setForm({
      kode: "",
      nama: "",
      kontakPerson: "",
      telepon: "",
      email: "",
      status: "aktif",
      alamat: "",
      kota: "",
      provinsi: "",
      kodePos: "",
      npwp: "",
      tempoPembayaran: 30,
      limitKredit: 0,
    });
    setShowCreate(true);
  };

  const handleEdit = () => {
    if (!selectedSupplier) return;
    setForm({
      kode: selectedSupplier.kode ?? "",
      nama: selectedSupplier.nama ?? "",
      kontakPerson: selectedSupplier.kontakPerson ?? "",
      telepon: selectedSupplier.telepon ?? "",
      email: selectedSupplier.email ?? "",
      status: (selectedSupplier.status as "aktif" | "nonaktif") ?? "aktif",
      alamat: selectedSupplier.alamat ?? "",
      kota: selectedSupplier.kota ?? "",
      provinsi: selectedSupplier.provinsi ?? "",
      kodePos: selectedSupplier.kodePos ?? "",
      npwp: selectedSupplier.npwp ?? "",
      tempoPembayaran: selectedSupplier.tempoPembayaran ?? 30,
      limitKredit: selectedSupplier.limitKredit ?? 0,
    });
    setShowEdit(true);
  };

  const handleCreate = async () => {
    try {
      await createSupplier.mutateAsync({
        kode: form.kode,
        nama: form.nama,
        kontakPerson: form.kontakPerson || null,
        telepon: form.telepon || null,
        email: form.email || null,
        status: form.status,
        alamat: form.alamat || null,
        kota: form.kota || null,
        provinsi: form.provinsi || null,
        kodePos: form.kodePos || null,
        npwp: form.npwp || null,
        tempoPembayaran: form.tempoPembayaran,
        limitKredit: form.limitKredit,
      });
      toast.success("Supplier berhasil dibuat");
      setShowCreate(false);
    } catch {
      toast.error("Gagal membuat supplier");
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) return;
    try {
      await updateSupplier.mutateAsync({
        id: selectedId,
        payload: {
          kode: form.kode,
          nama: form.nama,
          kontakPerson: form.kontakPerson || null,
          telepon: form.telepon || null,
          email: form.email || null,
          status: form.status,
          alamat: form.alamat || null,
          kota: form.kota || null,
          provinsi: form.provinsi || null,
          kodePos: form.kodePos || null,
          npwp: form.npwp || null,
          tempoPembayaran: form.tempoPembayaran,
          limitKredit: form.limitKredit,
        },
      });
      toast.success("Supplier diperbarui");
      setShowEdit(false);
    } catch {
      toast.error("Gagal memperbarui supplier");
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteSupplier.mutateAsync(selectedId);
      toast.success("Supplier dihapus");
      setShowDelete(false);
    } catch {
      toast.error("Gagal menghapus supplier");
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <SuppliersHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        stats={stats}
        onRefresh={handleRefresh}
        onCreateNew={handleCreateNew}
        isRefetching={suppliers.isFetching}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <SuppliersGrid
            suppliers={filteredSuppliers}
            isLoading={suppliers.isLoading}
            selectedId={selectedId}
            onSelectSupplier={setSelectedId}
          />
        </div>

        <div
          className="w-full lg:w-1/4"
          style={{
            backgroundColor: "#e6f4f1",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <SupplierDetails
            supplier={selectedSupplier}
            supplierPurchases={supplierPurchases}
            supplierProducts={supplierProducts}
            onEdit={handleEdit}
            onDelete={() => setShowDelete(true)}
          />
        </div>
      </div>

      <SupplierModals
        showCreate={showCreate}
        showEdit={showEdit}
        showDelete={showDelete}
        form={form}
        selectedId={selectedId}
        onCloseCreate={() => setShowCreate(false)}
        onCloseEdit={() => setShowEdit(false)}
        onCloseDelete={() => setShowDelete(false)}
        onFormChange={setForm}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isCreating={createSupplier.isPending}
        isUpdating={updateSupplier.isPending}
        isDeleting={deleteSupplier.isPending}
      />
    </div>
  );
}
