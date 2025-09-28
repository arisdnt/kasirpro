import { useState, useMemo } from "react";
import { usePurchaseReturnsQuery } from "@/features/purchase-returns/use-purchase-returns";
import { usePurchasesQuery } from "@/features/purchases/use-purchases";
import { PurchaseReturnsHeader } from "./components/purchase-returns-header";
import { PurchaseReturnsTable } from "./components/purchase-returns-table";
import { PurchaseReturnDetails } from "./components/purchase-return-details";
import { PurchaseReturnModals } from "./components/purchase-return-modals";
import { PurchaseReturnDetailModal } from "./components/purchase-return-detail-modal";
import { PurchaseReturnEditModal } from "./components/purchase-return-edit-modal";
import { PurchaseReturnDeleteModal } from "./components/purchase-return-delete-modal";
import type { PurchaseReturnTransaction } from "@/features/purchase-returns/types";

type StatusFilter = "all" | "draft" | "diterima" | "sebagian" | "selesai" | "batal";

export function PurchaseReturnsPage() {
  const purchaseReturns = usePurchaseReturnsQuery();
  const purchases = usePurchasesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedModalPurchaseId, setSelectedModalPurchaseId] = useState<string>("");
  const [showItemSelectionDialog, setShowItemSelectionDialog] = useState(false);
  const [selectedPurchaseForItems, setSelectedPurchaseForItems] = useState<string>("");

  // Modal states for CRUD operations
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPurchaseReturn, setSelectedPurchaseReturn] = useState<PurchaseReturnTransaction | null>(null);

  const stats = useMemo(() => {
    const data = purchaseReturns.data ?? [];
    const total = data.length;
    const draft = data.filter((item) => item.status === "draft").length;
    const diterima = data.filter((item) => item.status === "diterima").length;
    const sebagian = data.filter((item) => item.status === "sebagian").length;
    const selesai = data.filter((item) => item.status === "selesai").length;
    const batal = data.filter((item) => item.status === "batal").length;
    const totalValue = data.reduce((sum, item) => sum + item.total, 0);
    return { total, draft, diterima, sebagian, selesai, batal, totalValue };
  }, [purchaseReturns.data]);

  const filteredReturns = useMemo(() => {
    const data = purchaseReturns.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nomorRetur.toLowerCase().includes(query) ||
          item.supplierNama.toLowerCase().includes(query) ||
          (item.alasan ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [purchaseReturns.data, searchTerm, statusFilter]);

  const selectedReturn = useMemo(() => {
    if (!selectedId) return null;
    return filteredReturns.find((item) => item.id === selectedId) ?? null;
  }, [filteredReturns, selectedId]);

  const handleRefresh = () => {
    purchaseReturns.refetch();
  };

  const handleCreateNew = () => {
    const first = (purchases.data ?? [])[0];
    setSelectedModalPurchaseId(first?.id ?? "");
    setShowCreateDialog(true);
  };

  const handleModalProceed = () => {
    if (!selectedModalPurchaseId) return;
    setSelectedPurchaseForItems(selectedModalPurchaseId);
    setShowCreateDialog(false);
    setShowItemSelectionDialog(true);
  };

  const handleReturnCreated = () => {
    setSelectedPurchaseForItems("");
    void purchaseReturns.refetch();
  };

  // CRUD Action handlers
  const handleViewDetail = (purchaseReturn: PurchaseReturnTransaction) => {
    setSelectedPurchaseReturn(purchaseReturn);
    setShowDetailModal(true);
  };

  const handleEdit = (purchaseReturn: PurchaseReturnTransaction) => {
    setSelectedPurchaseReturn(purchaseReturn);
    setShowEditModal(true);
  };

  const handleDelete = (purchaseReturn: PurchaseReturnTransaction) => {
    setSelectedPurchaseReturn(purchaseReturn);
    setShowDeleteModal(true);
  };

  const handleEditSuccess = () => {
    void purchaseReturns.refetch();
  };

  const handleDeleteSuccess = () => {
    void purchaseReturns.refetch();
    setSelectedId(null); // Clear selection if deleted item was selected
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <PurchaseReturnsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        stats={stats}
        purchaseReturns={purchaseReturns}
        onRefresh={handleRefresh}
        onCreateNew={handleCreateNew}
      />

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <PurchaseReturnsTable
            filteredReturns={filteredReturns}
            selectedId={selectedId}
            onSelectReturn={setSelectedId}
            purchaseReturns={purchaseReturns}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <div className="w-full lg:w-1/4" style={{
          backgroundColor: '#e6f4f1',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <PurchaseReturnDetails
            selectedReturn={selectedReturn}
          />
        </div>
      </div>

      <PurchaseReturnModals
        showCreateDialog={showCreateDialog}
        onCloseCreateDialog={() => setShowCreateDialog(false)}
        showItemSelectionDialog={showItemSelectionDialog}
        onCloseItemSelectionDialog={() => setShowItemSelectionDialog(false)}
        selectedModalPurchaseId={selectedModalPurchaseId}
        onSelectedModalPurchaseIdChange={setSelectedModalPurchaseId}
        selectedPurchaseForItems={selectedPurchaseForItems}
        onModalProceed={handleModalProceed}
        onReturnCreated={handleReturnCreated}
      />

      {/* CRUD Modals */}
      <PurchaseReturnDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        purchaseReturn={selectedPurchaseReturn}
      />

      <PurchaseReturnEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        purchaseReturn={selectedPurchaseReturn}
        onSuccess={handleEditSuccess}
      />

      <PurchaseReturnDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        purchaseReturn={selectedPurchaseReturn}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
