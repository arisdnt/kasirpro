import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import type { Customer } from "@/features/customers/types";
import { toast } from "sonner";

const MAX_SUGGESTIONS = 8;

type CustomerSearchBoxProps = {
  customers: Customer[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSelect: (customer: Customer | null) => void;
  selectedCustomer: Customer | null;
};

export function CustomerSearchBox({ customers, inputRef, onSelect, selectedCustomer }: CustomerSearchBoxProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const blurTimer = useRef<number | null>(null);

  useEffect(() => {
    setQuery(selectedCustomer ? `${selectedCustomer.nama}` : "");
  }, [selectedCustomer]);

  useEffect(() => setHighlight(0), [query]);
  useEffect(
    () => () => {
      if (blurTimer.current !== null) window.clearTimeout(blurTimer.current);
    },
    [],
  );

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const needle = query.trim().toLowerCase();
    return customers
      .filter(
        (customer) =>
          customer.nama.toLowerCase().includes(needle) ||
          customer.kode.toLowerCase().includes(needle) ||
          (customer.telepon ?? "").toLowerCase().includes(needle),
      )
      .slice(0, MAX_SUGGESTIONS);
  }, [customers, query]);

  const commit = (index: number) => {
    const selected = suggestions[index];
    if (!selected) {
      toast.error("Pelanggan tidak ditemukan");
      return;
    }
    onSelect(selected);
    setHighlight(0);
    setFocused(false);
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          onSelect(null);
        }}
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
        placeholder="F3 • Pilih pelanggan"
        className="h-12 border-slate-200 bg-slate-50 pl-4 text-base placeholder:text-slate-400 focus-visible:border-emerald-400 focus-visible:ring-emerald-100"
      />
      {focused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden border border-slate-200 bg-white shadow-lg">
          {suggestions.map((customer, index) => (
            <button
              key={customer.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => commit(index)}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                index === highlight
                  ? "bg-emerald-50 text-emerald-700"
                  : "hover:bg-slate-100"
              }`}
            >
              <p className="font-medium">{customer.nama}</p>
              <p className="text-xs text-slate-500">
                {customer.kode} • {customer.telepon ?? "-"}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
