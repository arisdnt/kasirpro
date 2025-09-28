import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ClipboardList } from "lucide-react";
import { ReturnInvoiceItems } from "./return-invoice-items";

interface ReturnInvoicePreviewProps {
  selectedReturn: any;
  getStatusColor: (status: string) => string;
}

export function ReturnInvoicePreview({ selectedReturn, getStatusColor }: ReturnInvoicePreviewProps) {
  return (
    <Card
      className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none"
      style={{ backgroundColor: "transparent" }}
    >
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {selectedReturn ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                  <h1 className="text-xl font-bold mb-2">KASIR PRO</h1>
                  <p className="text-xs">Jl. Contoh No. 123, Kota</p>
                  <p className="text-xs">Telp: (021) 123-4567</p>
                  <div className="mt-3 pt-2 border-t border-gray-300">
                    <p className="font-bold text-red-600">RETUR PENJUALAN</p>
                  </div>
                </div>

                <div className="mb-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>No. Retur</span>
                    <span className="font-bold">{selectedReturn.nomorRetur}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>No. Transaksi</span>
                    <span>{selectedReturn.nomorTransaksiPenjualan ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal</span>
                    <span>{formatDateTime(selectedReturn.tanggal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pelanggan</span>
                    <span>{selectedReturn.pelangganNama ?? "Umum"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-semibold border rounded-none",
                        getStatusColor(selectedReturn.status ?? "")
                      )}
                    >
                      {selectedReturn.status ?? "-"}
                    </span>
                  </div>
                  {selectedReturn.alasan && (
                    <div className="flex justify-between">
                      <span>Alasan</span>
                      <span className="text-right max-w-[60%]">{selectedReturn.alasan}</span>
                    </div>
                  )}
                </div>

                <ReturnInvoiceItems returId={selectedReturn.id} />

                <div className="mt-4 space-y-1 text-xs">
                  <div className="flex justify-between border-b border-gray-300 pb-2">
                    <span>Subtotal Retur</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(selectedReturn.total).replace("Rp ", "")}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-b-2 border-dashed border-gray-400 pb-2">
                    <span className="text-red-600">TOTAL RETUR</span>
                    <span className="text-red-600">
                      Rp {formatCurrency(selectedReturn.total).replace("Rp ", "")}
                    </span>
                  </div>
                </div>

                <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-gray-400">
                  <p className="text-xs">Dokumen Retur Penjualan</p>
                  <p className="text-xs">Barang retur sesuai dengan ketentuan</p>
                  <p className="text-xs mt-2">== KASIR PRO ==</p>
                </div>

                <div className="text-center mt-4 pt-2 border-t border-gray-300">
                  <p className="text-xs text-gray-600">ID: {selectedReturn.id}</p>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
            <ClipboardList className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih retur untuk melihat detail</p>
            <p className="text-xs text-slate-500">Klik salah satu baris untuk melihat dokumen retur.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
