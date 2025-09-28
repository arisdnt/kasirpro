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
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ClipboardList } from "lucide-react";
import { getActionColor } from "./audit-utils";

interface AuditLog {
  id: string;
  aksi: string;
  tabel: string;
  userId?: string;
  createdAt: string;
}

interface AuditTableProps {
  data: AuditLog[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectItem: (id: string) => void;
}

export function AuditTable({ data, isLoading, selectedId, onSelectItem }: AuditTableProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 rounded-none" style={{
      backgroundColor: '#f6f9ff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2" style={{ backgroundColor: '#f6f9ff' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Transaksi Audit</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Jejak Aktivitas</CardTitle>
        </div>
        <Badge variant="secondary" className="text-white rounded-none" style={{ backgroundColor: '#3b91f9' }}>
          {data.length} aktivitas
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0 flex flex-col">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-500">
            <ClipboardList className="h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Belum ada aktivitas yang cocok</p>
            <p className="text-xs text-slate-500">
              Sesuaikan pencarian atau tunggu aktivitas baru terekam.
            </p>
          </div>
        ) : (
          <>
            {/* Fixed Header */}
            <div className="shrink-0 border-b border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[25%] text-slate-500">Tabel</TableHead>
                    <TableHead className="w-[15%] text-slate-500">Aksi</TableHead>
                    <TableHead className="w-[25%] text-slate-500">User</TableHead>
                    <TableHead className="w-[35%] text-slate-500">Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            {/* Scrollable Body */}
            <ScrollArea className="flex-1">
              <Table className="min-w-full text-sm">
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow
                      key={item.id}
                      onClick={() => onSelectItem(item.id)}
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
                        <span className="font-medium text-slate-800">
                          {item.tabel}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-semibold border",
                          getActionColor(item.aksi)
                        )}>
                          {item.aksi}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle py-4 text-slate-700">
                        {item.userId ?? "system"}
                      </TableCell>
                      <TableCell className="align-middle py-4 text-slate-600">
                        {formatDateTime(item.createdAt)}
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