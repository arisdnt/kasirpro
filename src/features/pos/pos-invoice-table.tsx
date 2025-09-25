import { formatCurrency } from "@/lib/format";
import type { CartItem } from "./types";

type PosInvoiceTableProps = {
  items: CartItem[];
};

export function PosInvoiceTable({ items }: PosInvoiceTableProps) {
  if (!items.length) {
    return (
      <div className="flex h-full items-center justify-center border border-slate-200 bg-slate-50 text-sm text-slate-500">
        Item akan muncul setelah ditambahkan dari panel kiri.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden border border-slate-200">
      <div className="grid grid-cols-[2fr_1fr_1fr] items-center border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
        <span>Deskripsi</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Total</span>
      </div>
      <div className="h-full overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="grid grid-cols-[2fr_1fr_1fr] gap-2 border-b border-slate-100 px-4 py-2 text-sm"
          >
            <div>
              <p className="font-medium text-slate-900">{item.product.nama}</p>
              <p className="text-xs text-slate-500">{item.product.kode}</p>
            </div>
            <div className="text-right text-slate-600">
              {item.quantity} × {formatCurrency(item.product.hargaJual)}
            </div>
            <div className="text-right font-semibold text-slate-900">
              {formatCurrency(item.quantity * item.product.hargaJual)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

