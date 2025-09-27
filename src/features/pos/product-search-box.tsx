import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";
import type { PosProduct } from "./types";
import { toast } from "sonner";
import { ScanBarcode } from "lucide-react";

const MAX_SUGGESTIONS = 8;

type ProductSearchBoxProps = {
  products: PosProduct[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  onAdd: (product: PosProduct) => void;
};

export function ProductSearchBox({ products, inputRef, onAdd }: ProductSearchBoxProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const blurTimer = useRef<number | null>(null);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const needle = query.trim().toLowerCase();
    return products
      .filter(
        (product) =>
          product.nama.toLowerCase().includes(needle) ||
          product.kode.toLowerCase().includes(needle),
      )
      .slice(0, MAX_SUGGESTIONS);
  }, [products, query]);

  useEffect(() => setHighlight(0), [query]);
  useEffect(
    () => () => {
      if (blurTimer.current !== null) window.clearTimeout(blurTimer.current);
    },
    [],
  );

  const commit = (index: number) => {
    const selected = suggestions[index];
    if (!selected) {
      toast.error("Produk tidak ditemukan");
      return;
    }
    onAdd(selected);
    setQuery("");
    setHighlight(0);
    // Keep focus on input after adding item
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            blurTimer.current = window.setTimeout(() => setFocused(false), 120);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit(highlight);
            } else if (event.key === "ArrowDown") {
              event.preventDefault();
              setHighlight((prev) => Math.min(prev + 1, suggestions.length - 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setHighlight((prev) => Math.max(prev - 1, 0));
            }
          }}
          placeholder="F2 • Cari produk / barcode, Enter untuk menambahkan"
          className="h-12 border-slate-200 bg-slate-50 pl-6 pr-12 text-base text-black placeholder:text-slate-400 focus-visible:border-emerald-400 focus-visible:ring-emerald-100"
        />
        <ScanBarcode className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      </div>
      {focused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden border border-slate-200 bg-white shadow-lg">
          {suggestions.map((product, index) => (
            <button
              key={product.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => commit(index)}
              className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                index === highlight
                  ? "bg-emerald-50 text-emerald-700"
                  : "hover:bg-slate-100 text-black"
              }`}
            >
              <span className="font-medium">{product.nama}</span>
              <span className="text-xs">
                <span className="text-slate-500">{product.kode}</span>
                <span className="text-slate-300"> • </span>
                <span className="text-red-600 font-semibold">Stok {product.stok}</span>
                <span className="text-slate-300"> • </span>
                <span className="text-slate-500">{formatCurrency(product.hargaJual)}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
