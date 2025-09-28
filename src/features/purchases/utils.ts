import type { Purchase, PurchaseStats, StatusFilter, SupplierFilter } from "./types";

export function calculatePurchaseStats(purchases: Purchase[]): PurchaseStats {
  const total = purchases.length;
  const draft = purchases.filter((item) => item.status === "draft").length;
  const diterima = purchases.filter((item) => item.status === "diterima").length;
  const sebagian = purchases.filter((item) => item.status === "sebagian").length;
  const selesai = purchases.filter((item) => item.status === "selesai").length;
  const batal = purchases.filter((item) => item.status === "batal").length;
  return { total, draft, diterima, sebagian, selesai, batal };
}

export function filterPurchases(
  purchases: Purchase[],
  searchTerm: string,
  statusFilter: StatusFilter,
  supplierFilter: SupplierFilter = "all"
): Purchase[] {
  const query = searchTerm.trim().toLowerCase();
  return purchases
    .filter((item) => {
      const matchesSearch =
        query.length === 0 ||
        item.nomorTransaksi.toLowerCase().includes(query) ||
        item.supplierNama.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" ||
        item.status === statusFilter;
      const matchesSupplier =
        supplierFilter === "all" ||
        item.supplierNama === supplierFilter;
      return matchesSearch && matchesStatus && matchesSupplier;
    })
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "selesai":
      return "text-green-600 bg-green-50 border-green-200";
    case "diterima":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "sebagian":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "draft":
      return "text-slate-600 bg-slate-50 border-slate-200";
    case "batal":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
}