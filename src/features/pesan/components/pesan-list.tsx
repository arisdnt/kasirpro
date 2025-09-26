import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import type { InternalMessage } from "@/types/transactions";

interface PesanListProps {
  messages: InternalMessage[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectMessage: (id: string) => void;
}

export function PesanList({ messages, isLoading, selectedId, onSelectMessage }: PesanListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <Mail className="h-8 w-8 text-slate-300" />
        <p className="text-sm font-medium text-slate-700">Tidak ada pesan yang cocok</p>
        <p className="text-xs text-slate-500">
          Sesuaikan pencarian atau buat pesan baru untuk memulai.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col">
        {messages.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectMessage(item.id)}
            className={cn(
              "cursor-pointer border-b border-slate-100 p-4 transition",
              item.id === selectedId ? "bg-gray-100" : "hover:bg-slate-50"
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className={cn(
                "font-semibold text-sm",
                item.id === selectedId ? "text-black" : "text-slate-900"
              )}>
                {item.judul}
              </h3>
              <Badge
                variant={item.status === "terkirim" ? "outline" : item.status === "draft" ? "secondary" : "default"}
                className="text-xs rounded-none"
              >
                {item.status}
              </Badge>
            </div>
            <p className={cn(
              "text-xs text-slate-600 line-clamp-2 mb-2",
              item.id === selectedId ? "text-gray-700" : ""
            )}>
              {item.isi}
            </p>
            <p className={cn(
              "text-xs",
              item.id === selectedId ? "text-gray-600" : "text-slate-500"
            )}>
              {formatDateTime(item.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}