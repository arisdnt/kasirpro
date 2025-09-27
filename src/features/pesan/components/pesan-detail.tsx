import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateTime } from "@/lib/format";
import { Mail } from "lucide-react";
import type { InternalMessage } from "@/types/transactions";

interface PesanDetailProps {
  message: InternalMessage | null;
  onEdit?: (message: InternalMessage) => void;
  onDelete?: (id: string) => void;
  onMarkRead?: (id: string) => void;
}

export function PesanDetail({ message, onEdit, onDelete, onMarkRead }: PesanDetailProps) {
  if (!message) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
        <Mail className="h-8 w-8 text-slate-300" />
        <p className="text-sm font-medium text-slate-600">Pilih pesan untuk melihat detail</p>
        <p className="text-xs text-slate-500">
          Klik salah satu pesan untuk melihat informasi lengkap.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-4">
        <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Judul</dt>
              <dd className="font-semibold text-slate-900">{message.judul}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
              <dd>
                <Badge
                  variant={message.status === "terkirim" ? "outline" : message.status === "draft" ? "secondary" : "default"}
                  className="text-xs rounded-none"
                >
                  {message.status}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Pengirim</dt>
              <dd className="text-slate-700">{message.pengirimNama || "Unknown"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Penerima</dt>
              <dd className="text-slate-700">{message.penerimaNama || "Broadcast"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Tanggal</dt>
              <dd className="text-slate-700">{formatDateTime(message.createdAt)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            {message.status !== "dibaca" && (
              <Button size="sm" className="rounded-none" onClick={() => onMarkRead?.(message.id)}>
                Tandai Dibaca
              </Button>
            )}
            <Button size="sm" variant="secondary" className="rounded-none" onClick={() => onEdit?.(message)}>
              Edit
            </Button>
            <Button size="sm" variant="destructive" className="rounded-none" onClick={() => onDelete?.(message.id)}>
              Hapus
            </Button>
          </div>
        </div>

        <div className="rounded-none border border-slate-200 bg-white p-4 shadow-inner">
          <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Isi Pesan</h4>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{message.isi}</p>
        </div>
      </div>
    </ScrollArea>
  );
}