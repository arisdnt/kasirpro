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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Judul & Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Isi Pesan
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Waktu
              </th>
            </tr>
          </thead>
          <tbody>
            {messages.map((item) => (
              <tr
                key={item.id}
                onClick={() => onSelectMessage(item.id)}
                className={cn(
                  "cursor-pointer border-b border-slate-100 transition",
                  item.id === selectedId ? "bg-gray-100" : "hover:bg-slate-50"
                )}
              >
                {/* Column 1: Title, Status, Sender/Receiver */}
                <td className="px-4 py-3 w-1/3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
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
                    <div className="text-xs text-slate-500">
                      <span className="block">
                        <strong>Dari:</strong> {item.pengirimNama || "Unknown"}
                      </span>
                      <span className="block">
                        <strong>Ke:</strong> {item.penerimaNama || "Broadcast"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Column 2: Message Content */}
                <td className="px-4 py-3 w-1/2">
                  <p className={cn(
                    "text-sm text-slate-600 line-clamp-3",
                    item.id === selectedId ? "text-gray-700" : ""
                  )}>
                    {item.isi}
                  </p>
                </td>

                {/* Column 3: Timestamp */}
                <td className="px-4 py-3 w-1/6">
                  <p className={cn(
                    "text-xs",
                    item.id === selectedId ? "text-gray-600" : "text-slate-500"
                  )}>
                    {formatDateTime(item.createdAt)}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
}