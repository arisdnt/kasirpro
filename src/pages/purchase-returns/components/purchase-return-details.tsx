import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowLeftRight } from "lucide-react";

interface PurchaseReturn {
  id: string;
  nomorRetur: string;
  status: string | null;
  total: number;
  alasan: string | null;
  tanggal: string;
  transaksiPembelianId: string | null;
  supplierNama?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PurchaseReturnDetailsProps {
  selectedReturn: PurchaseReturn | null;
  onDeleted?: () => void;
}

const getStatusColor = (status: string | null) => {
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
};

export function PurchaseReturnDetails({ selectedReturn }: PurchaseReturnDetailsProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none" style={{ backgroundColor: 'transparent' }}>
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {selectedReturn ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                {/* Return Header */}
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                  <h1 className="text-xl font-bold mb-2">RETUR PEMBELIAN</h1>
                  <p className="text-xs">Pengembalian Barang ke Supplier</p>
                  <div className="mt-3 pt-2 border-t border-gray-300">
                    <p className="font-bold">PURCHASE RETURN</p>
                  </div>
                </div>

                {/* Return Basic Info */}
                <div className="mb-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>No. Retur</span>
                    <span className="font-bold">{selectedReturn.nomorRetur}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal Retur</span>
                    <span>{formatDateTime(selectedReturn.tanggal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supplier</span>
                    <span>{selectedReturn.supplierNama ?? "Tidak diketahui"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-semibold border capitalize",
                      getStatusColor(selectedReturn.status)
                    )}>
                      {selectedReturn.status ?? "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Transaction Reference */}
                <div className="mb-4 border-b border-gray-300 pb-2">
                  <div className="text-center mb-2">
                    <p className="font-bold text-sm">REFERENSI TRANSAKSI</p>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>ID Pembelian</span>
                      <span className="font-mono">{selectedReturn.transaksiPembelianId ?? "-"}</span>
                    </div>
                  </div>
                </div>

                {/* Return Reason */}
                <div className="mb-4 border-b border-gray-300 pb-2">
                  <div className="text-center mb-2">
                    <p className="font-bold text-sm">ALASAN RETUR</p>
                  </div>
                  <div className="text-xs text-center">
                    <p className="bg-gray-100 p-2 rounded border italic">
                      {selectedReturn.alasan ?? "Tidak ada alasan yang dicatat"}
                    </p>
                  </div>
                </div>

                {/* Total Section */}
                <div className="mt-4 space-y-1 text-xs">
                  <div className="flex justify-between border-b border-gray-300 pb-2">
                    <span>Subtotal Retur</span>
                    <span className="font-bold">{formatCurrency(selectedReturn.total).replace('Rp ', '')}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-b-2 border-dashed border-gray-400 pb-2">
                    <span>TOTAL RETUR</span>
                    <span>Rp {formatCurrency(selectedReturn.total).replace('Rp ', '')}</span>
                  </div>
                </div>

                {/* Processing Info */}
                <div className="mt-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Proses Retur</span>
                    <span className="capitalize">{selectedReturn.status === 'selesai' ? 'Completed' : 'In Progress'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tipe Retur</span>
                    <span>Purchase Return</span>
                  </div>
                </div>

                {/* System Info */}
                <div className="mt-6 border-t border-gray-300 pt-2">
                  <div className="text-center mb-2">
                    <p className="font-bold text-sm">INFORMASI SISTEM</p>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Retur ID</span>
                      <span className="font-mono text-gray-600">{selectedReturn.id}</span>
                    </div>
                    {selectedReturn.createdAt && (
                      <div className="flex justify-between">
                        <span>Dibuat</span>
                        <span>{formatDateTime(selectedReturn.createdAt)}</span>
                      </div>
                    )}
                    {selectedReturn.updatedAt && (
                      <div className="flex justify-between">
                        <span>Diperbarui</span>
                        <span>{formatDateTime(selectedReturn.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-gray-400">
                  <p className="text-xs">Dokumen ini adalah bukti retur pembelian</p>
                  <p className="text-xs">Simpan sebagai record untuk keperluan audit</p>
                  <p className="text-xs mt-2">== KASIR PRO ==</p>
                </div>

                {/* Document ID Footer */}
                <div className="text-center mt-4 pt-2 border-t border-gray-300">
                  <p className="text-xs text-gray-600">Doc: {selectedReturn.nomorRetur}</p>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
            <ArrowLeftRight className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih retur untuk melihat detail</p>
            <p className="text-xs text-slate-500">
              Klik salah satu baris untuk melihat informasi lengkap retur.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}