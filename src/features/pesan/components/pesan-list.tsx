import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import type { InternalMessage } from "@/features/pesan/types";

interface PesanListProps {
  messages: InternalMessage[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectMessage: (id: string) => void;
}

export function PesanList({ messages, isLoading, selectedId, onSelectMessage }: PesanListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-500">
        <Mail className="h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-600">Tidak ada pesan yang cocok</p>
        <p className="text-xs text-slate-500">
          Sesuaikan pencarian atau buat pesan baru untuk memulai.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Fixed Header */}
      <div className="shrink-0 border-b border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%] text-slate-500">Judul & Status</TableHead>
              <TableHead className="w-[45%] text-slate-500">Isi Pesan</TableHead>
              <TableHead className="w-[25%] text-slate-500">Waktu & Pengirim</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      {/* Scrollable Body */}
      <ScrollArea className="flex-1">
        <Table className="min-w-full text-sm">
          <TableBody>
            {messages.map((item, index) => (
              <TableRow
                key={item.id}
                onClick={() => onSelectMessage(item.id)}
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
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-slate-800 truncate">
                        {item.judul}
                      </h3>
                      <Badge
                        variant={item.status === "terkirim" ? "outline" : item.status === "draft" ? "secondary" : "default"}
                        className="text-xs rounded-none flex-shrink-0"
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="align-middle py-4">
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {item.isi}
                  </p>
                </TableCell>

                <TableCell className="align-middle py-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">
                      {formatDateTime(item.createdAt)}
                    </p>
                    <div className="text-xs text-slate-500">
                      <span className="block">
                        <strong>Dari:</strong> {item.pengirimNama || "Unknown"}
                      </span>
                      <span className="block">
                        <strong>Ke:</strong> {item.penerimaNama || "Broadcast"}
                      </span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
}