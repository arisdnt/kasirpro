import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";
import { usePosCartStore } from "./use-pos-cart-store";
import { Trash2 } from "lucide-react";
import { usePosProductsQuery } from "./use-pos-products";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { fetchProductStocks } from "@/features/produk/api/stocks";

export function PosCart() {
  const {
    state: { user },
  } = useSupabaseAuth();
  const items = usePosCartStore((state) => state.items);
  const increase = usePosCartStore((state) => state.increase);
  const decrease = usePosCartStore((state) => state.decrease);
  const updateQuantity = usePosCartStore((state) => state.updateQuantity);
  const remove = usePosCartStore((state) => state.remove);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const { data: liveProducts = [] } = usePosProductsQuery({ subscribe: false });
  const queryClient = useQueryClient();
  const lastRefreshRef = useRef<number>(0);

  // Build a quick lookup map for current live stocks by product id
  const liveStockMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of liveProducts) map[p.id] = p.stok;
    return map;
  }, [liveProducts]);

  // Backstop: if for any reason the shared cache lags, refresh stocks for items in cart
  useEffect(() => {
    const now = Date.now();
    // Throttle to avoid spamming requests
    if (now - lastRefreshRef.current < 4000) return;
    lastRefreshRef.current = now;

    const tenantId = user?.tenantId;
    const tokoId = user?.tokoId ?? null;
    if (!tenantId || !tokoId) return;
    if (items.length === 0) return;

  const productIds = Array.from(new Set(items.map((it) => it.product.id)));

    (async () => {
      try {
  console.log("🧭 POS Cart: refreshing stocks for cart items", productIds);
        const stockMap = await fetchProductStocks(tenantId, tokoId, productIds);
        // Patch the shared query cache so all POS components see the update
        queryClient.setQueryData<import("./types").PosProduct[] | undefined>(
          ["pos-products", tenantId, tokoId],
          (old) => {
            if (!old) return old;
            return old.map((p) =>
              stockMap[p.id] !== undefined ? { ...p, stok: stockMap[p.id] } : p,
            );
          },
        );
      } catch (e) {
        console.warn("POS Cart: stock refresh failed", e);
      }
    })();
  }, [items, user?.tenantId, user?.tokoId, liveStockMap, queryClient]);

  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center text-sm text-slate-500">
        <span className="text-base font-semibold text-slate-600">Keranjang kosong</span>
        <p className="mt-2 max-w-[240px] text-xs leading-relaxed">
          Sentuh produk pada katalog atau gunakan pemindaian barcode untuk menambahkan ke transaksi.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full border border-slate-200 bg-white">
      <div className="divide-y divide-slate-100">
        {items.map((item, index) => {
          const lineTotal = item.quantity * item.product.hargaJual;
          const currentStock = liveStockMap[item.product.id] ?? item.product.stok;
          if (liveStockMap[item.product.id] === undefined) {
            // Targeted debug: identify when we fall back to snapshot stock
            console.warn("⚠️ POS Cart: live stock missing in cache, falling back to snapshot", {
              produkId: item.product.id,
              kode: item.product.kode,
              snapshotStok: item.product.stok,
            });
          }
          return (
            <div
              key={item.product.id}
              className={`grid grid-cols-[1fr_120px_120px_120px_80px] gap-3 items-start px-4 py-3 transition-colors hover:bg-slate-50 ${
                index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
              }`}
            >
              <div className="space-y-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {item.product.nama}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {item.product.kode} • <span className="bg-[#476EAE] text-white px-1 py-0.5 text-xs font-bold">Stok {currentStock}</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-slate-700 truncate">
                  {item.product.kategoriNama || '-'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {item.product.brandNama || '-'}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-1 py-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => decrease(item.product.id)}
                    className="h-7 w-7 rounded-full bg-red-600 text-white hover:bg-red-700"
                  >
                    −
                  </Button>
                  {editingId === item.product.id ? (
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={tempValue}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow numeric input or empty
                        if (value === '' || /^\d+$/.test(value)) {
                          setTempValue(value);
                        }
                      }}
                      onBlur={() => {
                        const value = parseInt(tempValue) || 1;
                        updateQuantity(item.product.id, value);
                        setEditingId(null);
                        setTempValue("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const value = parseInt(tempValue) || 1;
                          updateQuantity(item.product.id, value);
                          setEditingId(null);
                          setTempValue("");
                        }
                      }}
                      onFocus={(e) => e.target.select()}
                      className="w-16 h-6 text-center text-xs border-0 bg-transparent font-semibold text-slate-800 focus:bg-white focus:border focus:border-slate-300"
                      autoFocus
                    />
                  ) : (
                    <span
                      className="w-8 text-center font-semibold text-slate-800 cursor-pointer hover:bg-slate-200 rounded px-1"
                      onClick={() => {
                        setEditingId(item.product.id);
                        setTempValue(item.quantity.toString());
                      }}
                    >
                      {item.quantity}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => increase(item.product.id)}
                    className="h-7 w-7 rounded-full bg-red-600 text-white hover:bg-red-700"
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-emerald-600">
                  {formatCurrency(lineTotal)}
                </p>
              </div>
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 gap-1 bg-red-600 text-white hover:bg-red-700"
                  onClick={() => remove(item.product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-xs">Hapus</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

