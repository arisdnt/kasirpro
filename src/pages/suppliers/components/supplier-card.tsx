import { Badge } from "@/components/ui/badge";
import type { Supplier } from "@/types/partners";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Building2, Calendar, CreditCard, Hash, Mail, MapPin, Phone, User } from "lucide-react";

interface SupplierCardProps {
  supplier: Supplier;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function SupplierCard({ supplier, isSelected, onSelect }: SupplierCardProps) {
  return (
    <div
      onClick={() => onSelect(supplier.id)}
      className={cn(
        "cursor-pointer rounded-none border border-primary/10 bg-white/80 p-3 text-sm shadow-sm transition hover:shadow-md",
        isSelected
          ? "!bg-gray-100 border-gray-300 shadow-md"
          : "hover:bg-slate-50 hover:border-primary/20"
      )}
    >
      <div className="grid grid-cols-3 gap-4">
        {/* Kolom 1: Identitas dan Status */}
        <div className="space-y-1">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold text-sm leading-tight truncate",
                isSelected ? "text-black" : "text-slate-900"
              )}>
                {supplier.nama}
              </h3>
              {supplier.kode && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Hash className="h-3 w-3 text-slate-400 shrink-0" />
                  <p className={cn(
                    "text-xs font-mono",
                    isSelected ? "text-gray-600" : "text-slate-500"
                  )}>
                    {supplier.kode}
                  </p>
                </div>
              )}
            </div>
          </div>
          <Badge
            variant={supplier.status === "aktif" ? "outline" : "destructive"}
            className="text-xs rounded-none"
          >
            {supplier.status ?? "-"}
          </Badge>
          {supplier.tokoId && (
            <div className="text-xs text-slate-500 truncate">
              <span className="font-medium">Store ID:</span> {supplier.tokoId}
            </div>
          )}
        </div>

        {/* Kolom 2: Kontak & Alamat */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1 truncate">
            <Phone className="h-3 w-3 text-slate-500 shrink-0" />
            <span>{supplier.telepon ?? "-"}</span>
          </div>
          <div className="flex items-center gap-1 truncate">
            <Mail className="h-3 w-3 text-slate-500 shrink-0" />
            <span>{supplier.email ?? "-"}</span>
          </div>
          <div className="flex items-center gap-1 truncate">
            <User className="h-3 w-3 text-slate-500 shrink-0" />
            <span>{supplier.kontakPerson ?? "-"}</span>
          </div>
          {supplier.alamat && (
            <div className="flex items-start gap-1 text-[11px] text-slate-600 mt-1">
              <MapPin className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{supplier.alamat}</span>
            </div>
          )}
        </div>

        {/* Kolom 3: Info Bisnis & Lokasi */}
        <div className="space-y-1 text-xs text-right">
          <div className="flex items-center gap-1 justify-end truncate">
            <span>{supplier.kota ?? "-"}</span>
            <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
          </div>
          {supplier.provinsi && (
            <div className="text-[11px] text-slate-500 truncate">
              {supplier.provinsi}
              {supplier.kodePos && ` • ${supplier.kodePos}`}
            </div>
          )}
          {(supplier.tempoPembayaran || supplier.limitKredit) && (
            <div className="flex items-center gap-1 justify-end truncate">
              <span>
                {supplier.tempoPembayaran ? `${supplier.tempoPembayaran}d` : ""}
                {supplier.limitKredit ? `${supplier.tempoPembayaran ? " • " : ""}${new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  notation: 'compact',
                  maximumFractionDigits: 0
                }).format(supplier.limitKredit)}` : ""}
              </span>
              <CreditCard className="h-3 w-3 text-slate-500 shrink-0" />
            </div>
          )}
          {supplier.npwp && (
            <div className="flex items-center gap-1 justify-end truncate">
              <span className="font-mono text-[11px]">{supplier.npwp}</span>
              <Building2 className="h-3 w-3 text-slate-500 shrink-0" />
            </div>
          )}
        </div>
      </div>

      {/* Footer dengan tanggal dan ID */}
      <div className="border-t border-slate-100 pt-1.5 mt-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {supplier.updatedAt ? formatDateTime(supplier.updatedAt).split(' ')[0] :
               supplier.createdAt ? formatDateTime(supplier.createdAt).split(' ')[0] : '-'}
            </span>
          </div>
          <div className="font-mono text-[10px] truncate max-w-20" title={supplier.id}>
            ID: {supplier.id.slice(-8)}
          </div>
        </div>
      </div>
    </div>
  );
}