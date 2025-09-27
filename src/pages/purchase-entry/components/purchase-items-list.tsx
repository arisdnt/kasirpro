import { Button as HeroButton } from "@heroui/react";
import { ScanBarcode, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { DraftItem } from "../purchase-entry-types";

interface PurchaseItemsListProps {
  items: DraftItem[];
  onUpdateQty: (productId: string, qty: number) => void;
  onUpdatePrice: (productId: string, price: number) => void;
  onRemoveItem: (productId: string) => void;
}

export function PurchaseItemsList({
  items,
  onUpdateQty,
  onUpdatePrice,
  onRemoveItem,
}: PurchaseItemsListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden border border-slate-200/70 bg-slate-50/60 rounded-none">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 border-b border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span>Produk</span>
        <span>Harga (IDR)</span>
        <span>Qty</span>
        <span>Subtotal</span>
        <span className="text-center">Aksi</span>
      </div>
      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-slate-400">
            <ScanBarcode className="h-8 w-8" />
            <p>Belum ada produk. Mulai dengan pencarian di atas.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200/70">
            {items.map((item) => {
              const subtotal = item.qty * item.harga;
              return (
                <li
                  key={item.productId}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-2 px-4 py-3 text-sm"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800">{item.nama}</p>
                    <p className="text-xs text-slate-500">
                      {item.kode}
                      {item.satuan ? ` • ${item.satuan}` : ""}
                      {typeof item.stok === "number" ? ` • Stok: ${item.stok}` : ""}
                    </p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={item.harga}
                      onChange={(event) => onUpdatePrice(item.productId, Number(event.target.value) || 0)}
                      className="h-10 w-full rounded-lg border border-transparent bg-white px-3 text-sm font-semibold text-slate-700 shadow-inner focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      min={0}
                      step={100}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(event) => onUpdateQty(item.productId, Number(event.target.value) || 1)}
                      className="h-10 w-full rounded-lg border border-transparent bg-white px-3 text-sm font-semibold text-slate-700 shadow-inner focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      min={1}
                      step={1}
                    />
                  </div>
                  <div className="text-sm font-bold text-emerald-600">
                    {formatCurrency(subtotal)}
                  </div>
                  <div className="flex justify-center">
                    <HeroButton
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => onRemoveItem(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </HeroButton>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}