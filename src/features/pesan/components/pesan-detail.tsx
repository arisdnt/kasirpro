import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateTime } from "@/lib/format";
import { Mail } from "lucide-react";
import type { InternalMessage } from "@/types/transactions";

interface PesanDetailProps {
  message: InternalMessage | null;
}

export function PesanDetail({ message }: PesanDetailProps) {
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
              <dt className="text-xs uppercase tracking-wide text-slate-500">Tanggal</dt>
              <dd className="text-slate-700">{formatDateTime(message.createdAt)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-none border border-slate-200 bg-white p-4 shadow-inner">
          <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Isi Pesan</h4>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{message.isi}</p>
        </div>
      </div>
    </ScrollArea>
  );
}