import { useEffect, useMemo, useState } from "react";
import { useCustomersQuery } from "@/features/customers/use-customers";
import type { Customer } from "@/features/customers/types";
import { useStoresQuery } from "@/features/stores/use-stores";
import { CustomerFilters } from "./components/customer-filters";
import { CustomerList } from "./components/customer-list";
import { CustomerDetailCard } from "./components/customer-detail-card";
import { CustomerAddModal } from "./components/customer-add-modal";
import { CustomerEditModal } from "./components/customer-edit-modal";
import { CustomerDeleteDialog } from "./components/customer-delete-dialog";
import { CustomerDetailModal } from "./components/customer-detail-modal";

type StatusFilter = "all" | "aktif" | "nonaktif";
type StoreFilter = "all" | string;

type CustomerStats = { total: number; active: number; inactive: number };

function mapToRow(customer: Customer) {
  return {
    id: customer.id,
    nama: customer.nama,
    kode: customer.kode,
    telepon: customer.telepon,
    email: customer.email,
    totalTransaksi: customer.totalTransaksi,
    poinRewards: customer.poinRewards,
    status: customer.status,
  };
}

function computeStats(data: Customer[] | undefined): CustomerStats {
  const list = data ?? [];
  const total = list.length;
  const active = list.filter((item) => (item.status ?? "aktif") === "aktif").length;
  const inactive = list.filter((item) => (item.status ?? "aktif") === "nonaktif").length;
  return { total, active, inactive };
}

export function CustomersPage() {
  const stores = useStoresQuery();
  const [storeFilter, setStoreFilter] = useState<StoreFilter>("all");
  const customers = useCustomersQuery(storeFilter);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [detailModalId, setDetailModalId] = useState<string | null>(null);
  const [editModalId, setEditModalId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const storeOptions = useMemo(
    () => (stores.data ?? []).map((store) => ({ value: store.id, label: store.nama })),
    [stores.data],
  );

  const filteredCustomers = useMemo(() => {
    const data = customers.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nama.toLowerCase().includes(query) ||
          (item.kode ?? "").toLowerCase().includes(query) ||
          (item.telepon ?? "").toLowerCase().includes(query) ||
          (item.email ?? "").toLowerCase().includes(query);

        if (!matchesSearch) return false;

        if (statusFilter !== "all" && (item.status ?? "aktif") !== statusFilter) return false;

        if (storeFilter !== "all" && item.tokoId && item.tokoId !== storeFilter) return false;

        return true;
      })
      .sort((a, b) => a.nama.localeCompare(b.nama, "id", { sensitivity: "base" }));
  }, [customers.data, searchTerm, statusFilter, storeFilter]);

  useEffect(() => {
    if (!filteredCustomers.length) {
      setSelectedId(null);
      return;
    }
    if (selectedId && filteredCustomers.some((item) => item.id === selectedId)) {
      return;
    }
    setSelectedId(filteredCustomers[0]?.id ?? null);
  }, [filteredCustomers, selectedId]);

  const selectedCustomer = useMemo(() => {
    if (!selectedId) return null;
    return filteredCustomers.find((item) => item.id === selectedId) ?? null;
  }, [filteredCustomers, selectedId]);

  const detailModalCustomer = useMemo(
    () => filteredCustomers.find((item) => item.id === detailModalId) ?? null,
    [detailModalId, filteredCustomers],
  );
  const editModalCustomer = useMemo(
    () => filteredCustomers.find((item) => item.id === editModalId) ?? null,
    [editModalId, filteredCustomers],
  );
  const deleteModalCustomer = useMemo(
    () => filteredCustomers.find((item) => item.id === deleteModalId) ?? null,
    [deleteModalId, filteredCustomers],
  );

  const stats = useMemo(() => computeStats(customers.data), [customers.data]);

  const handleRefresh = () => {
    void customers.refetch();
  };

  const listRows = useMemo(() => filteredCustomers.map(mapToRow), [filteredCustomers]);

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <CustomerFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        storeFilter={storeFilter}
        onStoreFilterChange={setStoreFilter}
        storeOptions={storeOptions}
        stats={stats}
        isRefreshing={customers.isFetching}
        onRefresh={handleRefresh}
        onAddCustomer={() => setIsAddOpen(true)}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <CustomerList
            data={listRows}
            isLoading={customers.isLoading}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onViewDetail={(customer) => {
              setSelectedId(customer.id);
              setDetailModalId(customer.id);
            }}
            onEdit={(customer) => {
              setSelectedId(customer.id);
              setEditModalId(customer.id);
            }}
            onDelete={(customer) => {
              setSelectedId(customer.id);
              setDeleteModalId(customer.id);
            }}
          />
        </div>
        <div
          className="w-full lg:w-1/4"
          style={{ backgroundColor: "#e6f4f1", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}
        >
          <CustomerDetailCard
            customer={selectedCustomer}
            onEdit={(customer) => setEditModalId(customer.id)}
            onDelete={(customer) => setDeleteModalId(customer.id)}
            onOpenModal={(customer) => setDetailModalId(customer.id)}
          />
        </div>
      </div>

      <CustomerAddModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        storeOptions={storeOptions}
        defaultStoreId={storeFilter !== "all" ? storeFilter : null}
      />

      <CustomerEditModal
        open={Boolean(editModalId && editModalCustomer)}
        onOpenChange={(open) => {
          if (!open) setEditModalId(null);
        }}
        customer={editModalCustomer}
        storeOptions={storeOptions}
      />

      <CustomerDeleteDialog
        open={Boolean(deleteModalId && deleteModalCustomer)}
        onOpenChange={(open) => {
          if (!open) setDeleteModalId(null);
        }}
        customer={deleteModalCustomer}
      />

      <CustomerDetailModal
        open={Boolean(detailModalId && detailModalCustomer)}
        onOpenChange={(open) => {
          if (!open) setDetailModalId(null);
        }}
        customer={detailModalCustomer}
        onEdit={(customer) => setEditModalId(customer.id)}
        onDelete={(customer) => setDeleteModalId(customer.id)}
      />
    </div>
  );
}
