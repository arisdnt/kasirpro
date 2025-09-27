import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { PurchaseProduct } from "@/features/purchases/use-purchase-products";
import { resolveBasePrice } from "../purchase-entry-utils";

interface ProductSearchProps {
  searchTerm: string;
  highlightIndex: number;
  searchFocused: boolean;
  suggestions: PurchaseProduct[];
  onSearchChange: (value: string) => void;
  onFocusChange: (focused: boolean) => void;
  onHighlightChange: (index: number) => void;
  onCommit: () => void;
  onProductSelect: (product: PurchaseProduct) => void;
}

export function ProductSearch({
  searchTerm,
  highlightIndex,
  searchFocused,
  suggestions,
  onSearchChange,
  onFocusChange,
  onHighlightChange,
  onCommit,
  onProductSelect,
}: ProductSearchProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBlurTimer = useRef<number | null>(null);
  const suggestionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const node = suggestionRefs.current[highlightIndex];
    if (node) {
      node.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex, suggestions]);

  useEffect(
    () => () => {
      if (searchBlurTimer.current !== null) {
        window.clearTimeout(searchBlurTimer.current);
      }
    },
    [],
  );

  suggestionRefs.current = Array(suggestions.length).fill(null);

  return (
    <div className="relative flex-1">
      <Input
        ref={searchInputRef}
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        onFocus={() => {
          if (searchBlurTimer.current !== null) {
            window.clearTimeout(searchBlurTimer.current);
          }
          onFocusChange(true);
        }}
        onBlur={() => {
          searchBlurTimer.current = window.setTimeout(() => onFocusChange(false), 120);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onCommit();
          } else if (event.key === "ArrowDown") {
            event.preventDefault();
            onHighlightChange(Math.min(highlightIndex + 1, Math.max(suggestions.length - 1, 0)));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            onHighlightChange(Math.max(highlightIndex - 1, 0));
          }
        }}
        placeholder="Cari atau scan barcode"
        className="h-12 border border-emerald-100 bg-emerald-50/60 pl-11 text-sm font-medium text-slate-800 shadow-inner focus-visible:ring-2 focus-visible:ring-emerald-200"
      />
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
      {searchFocused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-auto border border-emerald-100 bg-white shadow-xl rounded-none">
          <ul className="py-1">
            {suggestions.map((product, index) => {
              const isHighlighted = index === highlightIndex;
              return (
                <li key={product.id}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => onProductSelect(product)}
                    onMouseEnter={() => onHighlightChange(index)}
                    ref={(element) => {
                      suggestionRefs.current[index] = element;
                    }}
                    className={`flex w-full flex-col gap-1 px-4 py-2 text-left text-sm transition ${
                      isHighlighted
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700"
                    }`}
                  >
                    <span className="font-semibold">{product.nama}</span>
                    <span className="text-xs text-slate-500">
                      {product.kode}
                      {product.barcode ? ` • ${product.barcode}` : ""}
                    </span>
                    <span className="text-xs font-medium text-emerald-600">
                      {formatCurrency(resolveBasePrice(product))}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}