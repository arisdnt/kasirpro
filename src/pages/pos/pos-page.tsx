import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { PosCart } from "@/features/pos/pos-cart";
import { PosSummary } from "@/features/pos/pos-summary";
import { usePosCartStore } from "@/features/pos/use-pos-cart-store";
import { usePosProductsQuery } from "@/features/pos/use-pos-products";
import { useCustomersQuery } from "@/features/partners/use-partners";
import { ProductSearchBox } from "@/features/pos/product-search-box";
import { CustomerSearchBox } from "@/features/pos/customer-search-box";
import type { Customer } from "@/types/partners";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

type FooterAction = {
  label: string;
  variant: "default" | "outline";
  onClick: () => void;
};

export function PosPage() {
  const { data: products = [] } = usePosProductsQuery();
  const { data: customers = [] } = useCustomersQuery();

  // Debug: Log when products data changes
  useEffect(() => {
    console.log("🔍 POS Page: Products data updated", {
      count: products.length,
      firstProduct: products[0]?.nama,
      firstStock: products[0]?.stok
    });
  }, [products]);
  const addItem = usePosCartStore((state) => state.addItem);
  const clearCart = usePosCartStore((state) => state.clear);
  const totalAmount = usePosCartStore((state) => state.totalAmount());
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const productInputRef = useRef<HTMLInputElement>(null);
  const customerInputRef = useRef<HTMLInputElement>(null);
  const payButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "F2") {
        event.preventDefault();
        productInputRef.current?.focus();
      } else if (event.key === "F3") {
        event.preventDefault();
        customerInputRef.current?.focus();
      } else if (event.key === "F4") {
        event.preventDefault();
        payButtonRef.current?.click();
      } else if (event.key === "F6") {
        event.preventDefault();
        clearCart();
        toast.info("Keranjang dibersihkan");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [clearCart]);

  const footerActions: FooterAction[] = [
    {
      label: "Pembayaran (F4)",
      variant: "default",
      onClick: () => payButtonRef.current?.click(),
    },
    {
      label: "Simpan Draft",
      variant: "outline",
      onClick: () => toast.info("Fitur simpan draft segera hadir"),
    },
    {
      label: "Bersihkan (F6)",
      variant: "outline",
      onClick: () => {
        clearCart();
        toast.success("Keranjang dikosongkan");
      },
    },
    {
      label: "Daftar Draft",
      variant: "outline",
      onClick: () => toast.info("Fitur daftar draft segera hadir"),
    },
  ];

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col gap-2 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <div className="flex flex-1 overflow-hidden border border-slate-200 bg-white shadow-sm">
        <section className="flex flex-[7] flex-col border-r border-slate-200 p-4">
          <div className="grid grid-cols-[2fr_1fr] gap-3">
            <ProductSearchBox
              products={products}
              inputRef={productInputRef}
              onAdd={(product) => addItem(product)}
            />
            <CustomerSearchBox
              customers={customers}
              inputRef={customerInputRef}
              selectedCustomer={selectedCustomer}
              onSelect={(customer) => setSelectedCustomer(customer)}
            />
          </div>
          <div className="mt-4 flex flex-1 flex-col overflow-hidden">
            <PosCart />
          </div>
        </section>

        <aside className="flex flex-[3] flex-col p-4">
          <PosSummary customer={selectedCustomer} payButtonRef={payButtonRef} />
        </aside>
      </div>

      <footer className="flex-shrink-0 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 bg-white px-2 py-3">
        <div>
          <p className="text-[#476EAE]">
            <span className="text-sm font-semibold">Total Belanja : </span>
            <span className="text-5xl font-bold">{formatCurrency(totalAmount)}</span>
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {footerActions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              className={`h-11 px-6 text-sm font-semibold ${
                action.variant === "default"
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-[#476EAE] text-white hover:bg-[#476EAE]/90"
              }`}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </footer>
    </div>
  );
}
