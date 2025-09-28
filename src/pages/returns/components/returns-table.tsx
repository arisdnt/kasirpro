import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ClipboardList, Eye, Edit, Trash2 } from "lucide-react";

interface ReturnsTableProps {
  filteredReturns: any[];
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  isLoading: boolean;
  onDetailClick: (id: string) => void;
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
  getStatusColor: (status: string) => string;
}

export function ReturnsTable({ filteredReturns, selectedId, setSelectedId, isLoading, onDetailClick, onEditClick, onDeleteClick, getStatusColor }: ReturnsTableProps) {
  return (
    <div className="w-full lg:w-3/4">
      <Card className="flex h-full min-h-0 flex-col border border-primary/10 rounded-none" style={{
        backgroundColor: '#f6f9ff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2" style={{ backgroundColor: '#f6f9ff' }}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-black">Retur Penjualan</span>
            <span className="text-black">•</span>
            <CardTitle className="text-sm text-black">Daftar Retur</CardTitle>
          </div>
          <Badge variant="secondary" className="text-white rounded-none" style={{ backgroundColor: '#3b91f9' }}>
            {filteredReturns.length} retur
          </Badge>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 overflow-hidden p-0 flex flex-col">
          {isLoading ? (
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-2 p-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            </ScrollArea>
          ) : filteredReturns.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
              <ClipboardList className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">Belum ada retur penjualan yang cocok</p>
              <p className="text-xs text-slate-500">Sesuaikan pencarian atau buat retur baru untuk memulai.</p>
            </div>
          ) : (
            <>
              {/* Fixed Header */}
              <div className="shrink-0 border-b border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
                <Table className="min-w-full text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[18%] text-slate-500">No. Retur</TableHead>
                      <TableHead className="w-[18%] text-slate-500">No. Transaksi</TableHead>
                      <TableHead className="w-[18%] text-slate-500">Pelanggan</TableHead>
                      <TableHead className="w-[13%] text-slate-500">Total</TableHead>
                      <TableHead className="w-[13%] text-slate-500">Status</TableHead>
                      <TableHead className="w-[10%] text-slate-500">Tanggal</TableHead>
                      <TableHead className="w-[10%] text-slate-500">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              {/* Scrollable Body */}
              <ScrollArea className="flex-1">
                <Table className="min-w-full text-sm">
                  <TableBody>
                  {filteredReturns.map((item, index) => (
                    <TableRow
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      data-state={item.id === selectedId ? "selected" : undefined}
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
                        <span className={cn("font-medium", item.id === selectedId ? "text-black" : "text-slate-900")}>
                          {item.nomorRetur}
                        </span>
                      </TableCell>
                      <TableCell className={cn("align-middle py-4", item.id === selectedId ? "text-black" : "text-slate-700")}>
                        {item.nomorTransaksiPenjualan ?? "-"}
                      </TableCell>
                      <TableCell className={cn("align-middle py-4", item.id === selectedId ? "text-black" : "text-slate-700")}>
                        {item.pelangganNama ?? "Tanpa pelanggan"}
                      </TableCell>
                      <TableCell className={cn("align-middle py-4 font-semibold", item.id === selectedId ? "text-black" : "text-slate-900")}>
                        {formatCurrency(item.total)}
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        <span className={cn("px-2 py-1 rounded text-xs font-semibold border", getStatusColor(item.status ?? ""))}>
                          {item.status ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell className={cn("align-middle py-4 text-xs", item.id === selectedId ? "text-black" : "text-slate-600")}>
                        {formatDateTime(item.tanggal)}
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-none hover:bg-blue-100" onClick={(e) => { e.stopPropagation(); onDetailClick(item.id); }}>
                            <Eye className="h-3 w-3 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-none hover:bg-green-100" onClick={(e) => { e.stopPropagation(); onEditClick(item.id); }}>
                            <Edit className="h-3 w-3 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-none hover:bg-red-100" onClick={(e) => { e.stopPropagation(); onDeleteClick(item.id); }}>
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
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
    </div>
  );
}