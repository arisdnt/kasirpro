import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowLeftRight } from "lucide-react";
import { PurchaseReturnEditor } from "./purchase-return-editor";

interface PurchaseReturn {
  id: string;
  nomorRetur: string;
  status: string | null;
  total: number;
  alasan: string | null;
  tanggal: string;
  transaksiPembelianId: string | null;
}

interface PurchaseReturnDetailsProps {
  selectedReturn: PurchaseReturn | null;
  onDeleted: () => void;
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

export function PurchaseReturnDetails({ selectedReturn, onDeleted }: PurchaseReturnDetailsProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Retur</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">
            {selectedReturn ? selectedReturn.nomorRetur : "Pilih retur"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
        {selectedReturn ? (
          <>
            <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
              <dl className="space-y-3 text-sm text-slate-600">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Nomor Retur</dt>
                  <dd className="font-bold text-lg font-mono text-slate-900">{selectedReturn.nomorRetur}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
                  <dd>
                    <span className={cn(
                      "px-3 py-1 rounded text-sm font-semibold border capitalize",
                      getStatusColor(selectedReturn.status)
                    )}>
                      {selectedReturn.status ?? "Unknown"}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Total Retur</dt>
                  <dd className="font-bold text-xl text-slate-900">{formatCurrency(selectedReturn.total)}</dd>
                </div>
              </dl>
            </div>

            <PurchaseReturnEditor
              returId={selectedReturn.id}
              transaksiId={selectedReturn.transaksiPembelianId ?? null}
              selectedReturn={selectedReturn}
              onDeleted={onDeleted}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <ArrowLeftRight className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih retur untuk melihat detail</p>
            <p className="text-xs text-slate-500">
              Klik salah satu baris retur untuk melihat informasi lengkap.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}