import { Skeleton } from "@/components/ui/skeleton";
import type { SaleItem } from "@/types/transactions";
import { formatCurrency } from "@/lib/format";

interface SaleItemsListProps {
  items: (SaleItem & { produkKode: string | null; kategoriNama: string | null })[] | undefined;
  isLoading: boolean;
}

export function SaleItemsList({ items, isLoading }: SaleItemsListProps) {
  return (
    <div className="border-t-2 border-b-2 border-dashed border-gray-400 py-2">
      <div className="text-xs font-bold mb-2 grid grid-cols-12 gap-1">
        <div className="col-span-6">ITEM</div>
        <div className="col-span-2 text-center">QTY</div>
        <div className="col-span-2 text-right">HARGA</div>
        <div className="col-span-2 text-right">TOTAL</div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="grid grid-cols-12 gap-1 text-xs">
              <div className="col-span-6">
                <Skeleton className="h-3 w-full" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-3 w-full" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-3 w-full" />
              </div>
              <div className="col-span-2">
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {items?.map((item) => (
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
                <div className="col-span-2 text-right">
                  {formatCurrency(item.subtotal).replace('Rp ', '')}
                </div>
              </div>
              {item.produkKode && (
                <div className="text-xs text-gray-600 ml-0">
                  [{item.produkKode}]
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}