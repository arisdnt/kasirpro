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
import { cn } from "@/lib/utils";
import { FolderTree } from "lucide-react";
import type { EnrichedCategory } from "./kategori-utils";

interface KategoriTableProps {
  data: EnrichedCategory[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectItem: (id: string) => void;
}

export function KategoriTable({ data, isLoading, selectedId, onSelectItem }: KategoriTableProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 rounded-none" style={{
      backgroundColor: '#f6f9ff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2" style={{ backgroundColor: '#f6f9ff' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Navigasi Kategori</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Kategori</CardTitle>
        </div>
        <Badge variant="secondary" className="text-white rounded-none" style={{ backgroundColor: '#3b91f9' }}>
          {data.length} kategori
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
        ) : data.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <FolderTree className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-700">Belum ada kategori yang cocok</p>
            <p className="text-xs text-slate-500">
              Sesuaikan pencarian atau tambahkan kategori baru untuk memulai.
            </p>
          </div>
        ) : (
          <>
            {/* Fixed Header */}
            <div className="shrink-0 border-b border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
              <Table className="min-w-full text-sm table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%] text-slate-500">Kategori</TableHead>
                    <TableHead className="w-[20%] text-slate-500">Cakupan</TableHead>
                    <TableHead className="w-[15%] text-slate-500">Produk</TableHead>
                    <TableHead className="w-[30%] text-slate-500">Referensi</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            {/* Scrollable Body */}
            <ScrollArea className="flex-1">
              <Table className="min-w-full text-sm table-fixed">
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow
                      key={item.id}
                      onClick={() => onSelectItem(item.id)}
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
                      <TableCell className="w-[35%] align-middle py-4">
                        <div className="flex flex-col">
                          <span className={cn("font-medium", item.id === selectedId ? "text-black" : "text-slate-900")}>
                            {item.nama}
                          </span>
                          {item.parentName && (
                            <span className={cn("text-xs", item.id === selectedId ? "text-black" : "text-slate-500")}>
                              Sub dari {item.parentName}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="w-[20%] align-middle py-4">
                        <span className={cn("px-2 py-1 rounded text-xs font-semibold border", item.tokoId ? "text-blue-600 bg-blue-50 border-blue-200" : "text-green-600 bg-green-50 border-green-200")}>
                          {item.tokoId ? "Kategori Toko" : "Kategori Global"}
                        </span>
                      </TableCell>
                      <TableCell className={cn("w-[15%] align-middle py-4 font-semibold", item.id === selectedId ? "text-black" : "text-slate-900")}>
                        {item.productCount}
                      </TableCell>
                      <TableCell className={cn("w-[30%] align-middle py-4 text-xs", item.id === selectedId ? "text-black" : "text-slate-700")}>
                        {item.tokoId ? (item.storeName ?? `Toko ID: ${item.tokoId}`) : "Berlaku untuk semua toko"}
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