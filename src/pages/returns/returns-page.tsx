import { useMemo, useState } from "react";
import { useSalesReturnsQuery } from "@/features/returns/use-returns";
import { useSalesQuery } from "@/features/sales/use-sales";
import { ReturnsHeader } from "./components/returns-header";
import { ReturnsTable } from "./components/returns-table";
import { ReturnInvoicePreview } from "./components/return-invoice-preview";
import { CreateReturnDialog } from "./components/create-return-dialog";
import { ItemSelectionDialog } from "./components/item-selection-dialog";
import { ReturnDetailModal } from "./components/return-detail-modal";
import { ReturnEditModal } from "./components/return-edit-modal";
import { ReturnDeleteModal } from "./components/return-delete-modal";

type StatusFilter = "all" | "draft" | "diterima" | "sebagian" | "selesai" | "batal";

const getStatusColor = (status: string) => {
  switch (status) {
    case "selesai": return "text-green-600 bg-green-50 border-green-200";
    case "draft":
    case "sebagian":
    case "diterima": return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "batal": return "text-red-600 bg-red-50 border-red-200";
    default: return "text-slate-600 bg-slate-50 border-slate-200";
  }
};

export function ReturnsPage() {
  const returns = useSalesReturnsQuery();
  const sales = useSalesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedModalSaleId, setSelectedModalSaleId] = useState<string>("");
  const [showItemSelectionDialog, setShowItemSelectionDialog] = useState(false);
  const [selectedSaleForItems, setSelectedSaleForItems] = useState<string>("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReturnForAction, setSelectedReturnForAction] = useState<string>("");

  const stats = useMemo(() => {
    const data = returns.data ?? [];
    return {
      total: data.length,
      draft: data.filter((item) => item.status === "draft").length,
      selesai: data.filter((item) => item.status === "selesai").length,
      batal: data.filter((item) => item.status === "batal").length,
    };
  }, [returns.data]);

  const filteredReturns = useMemo(() => {
    const data = returns.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch = query.length === 0 ||
          item.nomorRetur.toLowerCase().includes(query) ||
          (item.pelangganNama ?? "").toLowerCase().includes(query);
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [returns.data, searchTerm, statusFilter]);

  const selectedReturn = useMemo(() => {
    if (!selectedId) return null;
    return filteredReturns.find((item) => item.id === selectedId) ?? null;
  }, [filteredReturns, selectedId]);

  return (
    <>
      <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
        <ReturnsHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          stats={stats}
          isFetching={returns.isFetching}
          onRefresh={() => returns.refetch()}
          onCreateNew={() => {
            const first = (sales.data ?? [])[0];
            setSelectedModalSaleId(first?.id ?? "");
            setShowCreateDialog(true);
          }}
        />

        <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
          <ReturnsTable
            filteredReturns={filteredReturns}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            isLoading={returns.isLoading}
            getStatusColor={getStatusColor}
            onDetailClick={(id: string) => {
              setSelectedReturnForAction(id);
              setShowDetailModal(true);
            }}
            onEditClick={(id: string) => {
              setSelectedReturnForAction(id);
              setShowEditModal(true);
            }}
            onDeleteClick={(id: string) => {
              setSelectedReturnForAction(id);
              setShowDeleteModal(true);
            }}
          />
          <div
            className="w-full lg:w-1/4"
            style={{
              backgroundColor: "#e6f4f1",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <ReturnInvoicePreview selectedReturn={selectedReturn} getStatusColor={getStatusColor} />
          </div>
        </div>
      </div>

      <CreateReturnDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        selectedModalSaleId={selectedModalSaleId}
        setSelectedModalSaleId={setSelectedModalSaleId}
        sales={sales.data ?? []}
        onItemSelectionOpen={(saleId: string) => {
          setSelectedSaleForItems(saleId);
          setShowCreateDialog(false);
          setShowItemSelectionDialog(true);
        }}
      />

      <ItemSelectionDialog
        open={showItemSelectionDialog}
        onOpenChange={setShowItemSelectionDialog}
        saleId={selectedSaleForItems}
        onReturnCreated={() => {
          setSelectedSaleForItems("");
          void returns.refetch();
        }}
      />

      <ReturnDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        returnId={selectedReturnForAction}
      />

      <ReturnEditModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        returnId={selectedReturnForAction}
        onReturnUpdated={() => void returns.refetch()}
      />

      <ReturnDeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        returnId={selectedReturnForAction}
        onReturnDeleted={() => void returns.refetch()}
      />
    </>
  );
}
