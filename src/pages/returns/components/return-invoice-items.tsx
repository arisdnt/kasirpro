import { useReturnItemsQuery } from "@/features/returns/use-return-items";
import { formatCurrency } from "@/lib/format";

interface ReturnInvoiceItemsProps {
  returId: string;
}

export function ReturnInvoiceItems({ returId }: ReturnInvoiceItemsProps) {
  const items = useReturnItemsQuery(returId);

  return (
    <div className="border-t-2 border-b-2 border-dashed border-gray-400 py-2">
      <div className="text-xs font-bold mb-2 grid grid-cols-12 gap-1">
        <div className="col-span-6">ITEM RETUR</div>
        <div className="col-span-2 text-center">QTY</div>
        <div className="col-span-2 text-right">HARGA</div>
        <div className="col-span-2 text-right">TOTAL</div>
      </div>

      {items.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="grid grid-cols-12 gap-1 text-xs">
              <div className="col-span-6">
                <div className="h-3 bg-gray-200 animate-pulse rounded" />
              </div>
              <div className="col-span-2">
                <div className="h-3 bg-gray-200 animate-pulse rounded" />
              </div>
              <div className="col-span-2">
                <div className="h-3 bg-gray-200 animate-pulse rounded" />
              </div>
              <div className="col-span-2">
                <div className="h-3 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (items.data ?? []).length === 0 ? (
        <div className="text-xs text-gray-500 py-2 text-center">
          Belum ada item retur
        </div>
      ) : (
        <div className="space-y-1">
          {(items.data ?? []).map((item) => (
            <div key={item.id}>
              <div className="grid grid-cols-12 gap-1 text-xs">
                <div className="col-span-6 truncate">
                  {item.produkNama}
                </div>
                <div className="col-span-2 text-center">
                  {item.qty}
                </div>
                <div className="col-span-2 text-right">
                  {formatCurrency(item.hargaSatuan).replace('Rp ', '')}
                </div>
                <div className="col-span-2 text-right font-semibold text-red-600">
                  -{formatCurrency(item.subtotal).replace('Rp ', '')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}