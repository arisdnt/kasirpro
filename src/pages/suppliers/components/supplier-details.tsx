import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Supplier } from "@/features/suppliers/types";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Factory } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";

type SupplierPurchase = {
  id: string;
  nomorTransaksi: string;
  tanggal: string;
  total: number;
  status: string | null;
};

type SupplierProductAggregate = {
  produkId: string;
  produkNama: string;
  produkKode: string | null;
  kategoriNama: string | null;
  totalQty: number;
  transaksiCount: number;
  lastPurchasedAt: string | null;
};

interface SupplierDetailsProps {
  supplier: Supplier | null;
  supplierPurchases: UseQueryResult<SupplierPurchase[]>;
  supplierProducts: UseQueryResult<SupplierProductAggregate[]>;
  onEdit: () => void;
  onDelete: () => void;
}

function getStatusBadge(status?: string | null) {
  const base = "px-2 py-1 text-xs font-semibold border rounded-none";
  switch (status) {
    case "aktif":
      return cn(base, "text-green-600 bg-green-50 border-green-200");
    case "nonaktif":
      return cn(base, "text-red-600 bg-red-50 border-red-200");
    default:
      return cn(base, "text-slate-600 bg-slate-50 border-slate-200");
  }
}

export function SupplierDetails({
  supplier,
  supplierPurchases,
  supplierProducts,
  onEdit,
  onDelete,
}: SupplierDetailsProps) {
  const purchases = supplierPurchases.data ?? [];
  const products = supplierProducts.data ?? [];
  const totalPurchaseAmount = purchases.reduce((sum, item) => sum + item.total, 0);
  const lastPurchaseAt = purchases.reduce<string | null>((latest, item) => {
    if (!item.tanggal) return latest;
    const currentTime = new Date(item.tanggal).getTime();
    const latestTime = latest ? new Date(latest).getTime() : 0;
    return currentTime > latestTime ? item.tanggal : latest;
  }, null);

  return (
    <Card
      className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none"
      style={{ backgroundColor: "transparent" }}
    >
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {supplier ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                  <h1 className="text-xl font-bold mb-2">KASIR PRO</h1>
                  <p className="text-xs">Master Data • Supplier</p>
                  <div className="mt-3 pt-2 border-t border-gray-300">
                    <p className="font-bold text-blue-600">RINCIAN SUPPLIER</p>
                  </div>
                </div>

                <div className="mb-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Nama Supplier</span>
                    <span className="font-bold text-black">{supplier.nama}</span>
                  </div>
                  {supplier.kode && (
                    <div className="flex justify-between">
                      <span>Kode</span>
                      <span className="font-mono">{supplier.kode}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className={getStatusBadge(supplier.status)}>{supplier.status ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kontak</span>
                    <span className="text-right max-w-[60%]">
                      {supplier.kontakPerson ?? "-"}
                      {supplier.telepon ? ` • ${supplier.telepon}` : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span className="text-right max-w-[60%]">{supplier.email ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tempo Pembayaran</span>
                    <span>{supplier.tempoPembayaran ? `${supplier.tempoPembayaran} hari` : "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Limit Kredit</span>
                    <span>{supplier.limitKredit ? formatCurrency(supplier.limitKredit) : "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lokasi</span>
                    <span className="text-right max-w-[60%]">
                      {[supplier.kota, supplier.provinsi].filter(Boolean).join(", ") || "-"}
                    </span>
                  </div>
                  {supplier.alamat && (
                    <div className="flex justify-between">
                      <span>Alamat</span>
                      <span className="text-right max-w-[60%] leading-tight">{supplier.alamat}</span>
                    </div>
                  )}
                  {supplier.npwp && (
                    <div className="flex justify-between">
                      <span>NPWP</span>
                      <span className="font-mono">{supplier.npwp}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Dibuat</span>
                    <span>{supplier.createdAt ? formatDateTime(supplier.createdAt) : "-"}</span>
                  </div>
                </div>

                {(purchases.length > 0 || supplierPurchases.isLoading) && (
                  <div className="mt-4 bg-white/80 border border-slate-200 p-3 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span>Total Transaksi</span>
                      <span className="font-bold">
                        {supplierPurchases.isLoading ? "..." : `${purchases.length} transaksi`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Pembelian</span>
                      <span className="font-bold text-red-600">
                        {supplierPurchases.isLoading ? "..." : formatCurrency(totalPurchaseAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Terakhir Pembelian</span>
                      <span>{supplierPurchases.isLoading ? "..." : lastPurchaseAt ? formatDateTime(lastPurchaseAt) : "Belum ada"}</span>
                    </div>
                  </div>
                )}

                <div className="mt-6 border-t-2 border-b-2 border-dashed border-gray-400 py-2">
                  <div className="text-xs font-bold mb-2">Riwayat Pembelian</div>
                  {supplierPurchases.isLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="grid grid-cols-12 gap-1 text-xs">
                          <div className="col-span-5">
                            <div className="h-3 bg-gray-200 animate-pulse" />
                          </div>
                          <div className="col-span-3">
                            <div className="h-3 bg-gray-200 animate-pulse" />
                          </div>
                          <div className="col-span-2">
                            <div className="h-3 bg-gray-200 animate-pulse" />
                          </div>
                          <div className="col-span-2">
                            <div className="h-3 bg-gray-200 animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : purchases.length === 0 ? (
                    <div className="text-xs text-slate-500 py-2 text-center">
                      Belum ada transaksi pembelian.
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {purchases.slice(0, 10).map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-1 text-xs">
                          <div className="col-span-5 font-semibold text-slate-800 truncate">
                            {item.nomorTransaksi}
                          </div>
                          <div className="col-span-3 text-slate-600">
                            {formatDateTime(item.tanggal)}
                          </div>
                          <div className="col-span-2 text-right text-red-600 font-semibold">
                            {formatCurrency(item.total).replace("Rp ", "")}
                          </div>
                          <div className="col-span-2 text-right uppercase">
                            {item.status ?? "-"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t-2 border-b-2 border-dashed border-gray-400 py-2">
                  <div className="text-xs font-bold mb-2">Produk Supplier</div>
                  {supplierProducts.isLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="grid grid-cols-12 gap-1 text-xs">
                          <div className="col-span-6">
                            <div className="h-3 bg-gray-200 animate-pulse" />
                          </div>
                          <div className="col-span-2">
                            <div className="h-3 bg-gray-200 animate-pulse" />
                          </div>
                          <div className="col-span-2">
                            <div className="h-3 bg-gray-200 animate-pulse" />
                          </div>
                          <div className="col-span-2">
                            <div className="h-3 bg-gray-200 animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-xs text-slate-500 py-2 text-center">
                      Belum ada produk terkait.
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {products.slice(0, 10).map((item) => (
                        <div key={item.produkId} className="grid grid-cols-12 gap-1 text-xs">
                          <div className="col-span-6 truncate font-semibold text-slate-800">
                            {item.produkNama}
                          </div>
                          <div className="col-span-2 text-center text-slate-600">
                            {item.produkKode ?? "-"}
                          </div>
                          <div className="col-span-2 text-right text-slate-600">
                            {item.kategoriNama ?? "-"}
                          </div>
                          <div className="col-span-2 text-right text-slate-700">
                            Qty {item.totalQty}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    size="sm"
                    className="h-8 rounded-none bg-gradient-to-r from-slate-700 to-slate-900 px-3 text-xs text-white shadow-sm hover:from-slate-800 hover:to-black"
                    onClick={onEdit}
                  >
                    Edit Supplier
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 rounded-none bg-gradient-to-r from-red-500 to-red-600 px-3 text-xs text-white shadow-sm hover:from-red-600 hover:to-red-700"
                    onClick={onDelete}
                  >
                    Hapus Supplier
                  </Button>
                </div>

                <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-gray-400">
                  <p className="text-xs">Dokumen Rincian Supplier</p>
                  <p className="text-xs">Gunakan informasi ini untuk menjaga relasi pemasok.</p>
                  <p className="text-xs mt-2">== KASIR PRO ==</p>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
            <Factory className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih supplier untuk melihat detail</p>
            <p className="text-xs text-slate-500">Klik salah satu baris untuk melihat informasi supplier.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
