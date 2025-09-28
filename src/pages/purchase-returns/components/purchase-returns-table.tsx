import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowLeftRight } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";

interface PurchaseReturn {
  id: string;
  nomorRetur: string;
  supplierNama: string;
  total: number;
  status: string | null;
  alasan: string | null;
  tanggal: string;
}

interface PurchaseReturnsTableProps {
  filteredReturns: PurchaseReturn[];
  selectedId: string | null;
  onSelectReturn: (id: string) => void;
  purchaseReturns: UseQueryResult<PurchaseReturn[]>;
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

export function PurchaseReturnsTable({
  filteredReturns,
  selectedId,
  onSelectReturn,
  purchaseReturns,
}: PurchaseReturnsTableProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 rounded-none" style={{
      backgroundColor: '#f6f9ff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2" style={{ backgroundColor: '#f6f9ff' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Retur Pembelian</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Retur Supplier</CardTitle>
        </div>
        <Badge variant="secondary" className="text-white rounded-none" style={{ backgroundColor: '#3b91f9' }}>
          {filteredReturns.length} retur
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0 flex flex-col">
        {purchaseReturns.isLoading ? (
          <div className="flex flex-col gap-2 p-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredReturns.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <ArrowLeftRight className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Belum ada retur pembelian yang cocok</p>
            <p className="text-xs text-slate-500">
              Sesuaikan pencarian atau buat retur pembelian baru untuk memulai.
            </p>
          </div>
        ) : (
          <>
            <div className="shrink-0 border-b border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%] text-slate-500">Nomor Retur</TableHead>
                    <TableHead className="w-[20%] text-slate-500">Supplier</TableHead>
                    <TableHead className="w-[15%] text-slate-500">Total</TableHead>
                    <TableHead className="w-[15%] text-slate-500">Status</TableHead>
                    <TableHead className="w-[20%] text-slate-500">Alasan</TableHead>
                    <TableHead className="w-[10%] text-slate-500">Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            <ScrollArea className="flex-1">
              <Table className="min-w-full text-sm">
                <TableBody>
                  {filteredReturns.map((item, index) => (
                    <TableRow
                      key={item.id}
                      onClick={() => onSelectReturn(item.id)}
                      className={cn(
                        "cursor-pointer border-b border-slate-100 transition h-14",
                        item.id === selectedId
                          ? "text-black"
                          : index % 2 === 0
                            ? "bg-white hover:bg-slate-50"
                            : "bg-gray-50/50 hover:bg-slate-100"
                      )}
                      style={item.id === selectedId ? { backgroundColor: '#e6f4f1' } : undefined}
                    >
                      <TableCell className="align-middle py-4">
                        <span className="font-medium font-mono text-xs">
                          {item.nomorRetur}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        {item.supplierNama}
                      </TableCell>
                      <TableCell className="align-middle py-4 font-semibold">
                        {formatCurrency(item.total)}
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-semibold border capitalize",
                          getStatusColor(item.status)
                        )}>
                          {item.status ?? "Unknown"}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle py-4 max-w-32 truncate">
                        {item.alasan ?? "-"}
                      </TableCell>
                      <TableCell className="align-middle py-4 text-xs">
                        {formatDateTime(item.tanggal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
}