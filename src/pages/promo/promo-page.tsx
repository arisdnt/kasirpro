import { useEffect, useMemo, useState } from "react";
import { usePromoList, usePromoStatusMutation } from "@/features/promo/use-promos";
import type { PromoWithRelations } from "@/features/promo/types";
import { useStoresQuery } from "@/features/stores/use-stores";
import { PromoFilters } from "./components/promo-filters";
import { PromoDetailCard } from "./components/promo-detail-card";
import { PromoList, type PromoTiming } from "./components/promo-list";
import { PromoAddModal } from "./components/promo-add-modal";
import { PromoEditModal } from "./components/promo-edit-modal";
import { PromoDeleteDialog } from "./components/promo-delete-dialog";
import { PromoDetailModal } from "./components/promo-detail-modal";

type StoreFilter = "all" | string;
type StatusFilter = "all" | string;
type TypeFilter = "all" | string;

function getPromoTiming(promo: PromoWithRelations): PromoTiming {
  const now = Date.now();
  const start = new Date(promo.mulai).getTime();
  const end = promo.selesai ? new Date(promo.selesai).getTime() : null;

  if (start > now) return "upcoming";
  if (end !== null && end < now) return "expired";
  return "active";
}

export function PromoPage() {
  const stores = useStoresQuery();
  const [storeFilter, setStoreFilter] = useState<StoreFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [detailModalId, setDetailModalId] = useState<string | null>(null);
  const [editModalId, setEditModalId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  const promosQuery = usePromoList(storeFilter);
  const statusMutation = usePromoStatusMutation();

  const promos = useMemo(() => promosQuery.data ?? [], [promosQuery.data]);

  useEffect(() => {
    if (!promos.length) {
      setSelectedId(null);
      return;
    }
    if (selectedId && promos.some((promo) => promo.id === selectedId)) {
      return;
    }
    setSelectedId(promos[0]?.id ?? null);
  }, [promos, selectedId]);

  const statusOptions = useMemo(() => {
    const values = new Set(promos.map((promo) => promo.status));
    return Array.from(values).sort();
  }, [promos]);

  const typeOptions = useMemo(() => {
    const values = new Set(promos.map((promo) => promo.tipe));
    return Array.from(values).sort();
  }, [promos]);

  const filteredPromos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return promos.filter((promo) => {
      const matchesSearch =
        query.length === 0 ||
        [promo.nama, promo.kode ?? "", promo.deskripsi ?? "", promo.userNama ?? ""]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query));

      if (!matchesSearch) return false;
      if (statusFilter !== "all" && promo.status !== statusFilter) return false;
      if (typeFilter !== "all" && promo.tipe !== typeFilter) return false;
      if (storeFilter !== "all" && promo.tokoId && promo.tokoId !== storeFilter) return false;

      return true;
    });
  }, [promos, searchTerm, statusFilter, typeFilter, storeFilter]);

  useEffect(() => {
    if (!filteredPromos.length) {
      setSelectedId(null);
      return;
    }
    if (selectedId && filteredPromos.some((promo) => promo.id === selectedId)) {
      return;
    }
    setSelectedId(filteredPromos[0]?.id ?? null);
  }, [filteredPromos, selectedId]);

  const stats = useMemo(() => {
    const total = promos.length;
    const active = promos.filter((promo) => getPromoTiming(promo) === "active").length;
    const expired = promos.filter((promo) => getPromoTiming(promo) === "expired").length;
    return { total, active, expired };
  }, [promos]);

  const storeOptions = useMemo(
    () => (stores.data ?? []).map((store) => ({ value: store.id, label: store.nama })),
    [stores.data],
  );

  const selectedPromo = useMemo(
    () => filteredPromos.find((promo) => promo.id === selectedId) ?? null,
    [filteredPromos, selectedId],
  );

  const selectedPromoTiming = selectedPromo ? getPromoTiming(selectedPromo) : null;
  const detailModalPromo = useMemo(
    () => filteredPromos.find((promo) => promo.id === detailModalId) ?? null,
    [detailModalId, filteredPromos],
  );
  const editModalPromo = useMemo(
    () => filteredPromos.find((promo) => promo.id === editModalId) ?? null,
    [editModalId, filteredPromos],
  );
  const deleteModalPromo = useMemo(
    () => filteredPromos.find((promo) => promo.id === deleteModalId) ?? null,
    [deleteModalId, filteredPromos],
  );
  const detailModalTiming = detailModalPromo ? getPromoTiming(detailModalPromo) : null;

  const handleRefresh = () => {
    void promosQuery.refetch();
  };

  const handleToggleStatus = (promo: PromoWithRelations) => {
    const nextStatus = promo.status === "aktif" ? "nonaktif" : "aktif";
    statusMutation.mutate({ promoId: promo.id, status: nextStatus });
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <PromoFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        storeFilter={storeFilter}
        onStoreFilterChange={setStoreFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        storeOptions={storeOptions}
        statusOptions={statusOptions}
        typeOptions={typeOptions}
        stats={stats}
        isRefreshing={promosQuery.isFetching}
        onRefresh={handleRefresh}
        onAddPromo={() => setIsAddOpen(true)}
      />
      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <PromoList
            promos={filteredPromos}
            isLoading={promosQuery.isLoading}
            selectedId={selectedId}
            onSelectPromo={setSelectedId}
            getPromoTiming={getPromoTiming}
            onViewDetail={(promo) => setDetailModalId(promo.id)}
            onEditPromo={(promo) => setEditModalId(promo.id)}
            onDeletePromo={(promo) => setDeleteModalId(promo.id)}
          />
        </div>
        <div
          className="w-full lg:w-1/4"
          style={{ backgroundColor: "#e6f4f1", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}
        >
          <PromoDetailCard
            promo={selectedPromo}
            timing={selectedPromoTiming}
            isStatusUpdating={statusMutation.isPending}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </div>

      <PromoAddModal
        open={isAddOpen}
        onOpenChange={(open) => {
          setIsAddOpen(open);
        }}
        storeOptions={storeOptions}
        defaultStoreId={storeFilter !== "all" ? storeFilter : null}
      />

      <PromoEditModal
        open={Boolean(editModalId && editModalPromo)}
        onOpenChange={(open) => {
          if (!open) setEditModalId(null);
        }}
        promo={editModalPromo}
        storeOptions={storeOptions}
      />

      <PromoDeleteDialog
        open={Boolean(deleteModalId && deleteModalPromo)}
        onOpenChange={(open) => {
          if (!open) setDeleteModalId(null);
        }}
        promo={deleteModalPromo}
      />

      <PromoDetailModal
        open={Boolean(detailModalId && detailModalPromo)}
        onOpenChange={(open) => {
          if (!open) setDetailModalId(null);
        }}
        promo={detailModalPromo}
        timing={detailModalTiming}
        isStatusUpdating={statusMutation.isPending}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
