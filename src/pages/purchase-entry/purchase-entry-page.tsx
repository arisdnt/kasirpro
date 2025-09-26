import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button as HeroButton,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tab,
  Tabs,
} from "@heroui/react";
import { Input } from "@/components/ui/input";
import { usePurchaseProductsQuery } from "@/features/purchases/use-purchase-products";
import { useSuppliersQuery } from "@/features/suppliers/use-suppliers";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import { MoveRight, ScanBarcode, Search, Trash2, Truck } from "lucide-react";

import type { PurchaseProduct } from "@/features/purchases/use-purchase-products";
import type { Supplier } from "@/types/partners";

const MAX_SUGGESTIONS = 8;


type DraftItem = {
  productId: string;
  nama: string;
  kode: string;
  barcode: string | null;
  satuan: string | null;
  harga: number;
  qty: number;
  stok: number;
};

type SupplierMode = "registered" | "external";

function resolveBasePrice(product: PurchaseProduct) {
  if (product.hargaBeli > 0) return product.hargaBeli;
  if (product.hargaJual && product.hargaJual > 0) return product.hargaJual;
  return 0;
}

export function PurchaseEntryPage() {
  const { data: products = [] } = usePurchaseProductsQuery();
  const { data: suppliers = [], isLoading: loadingSuppliers } = useSuppliersQuery();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBlurTimer = useRef<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [items, setItems] = useState<DraftItem[]>([]);
  const [supplierMode, setSupplierMode] = useState<SupplierMode>("registered");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [externalSupplierName, setExternalSupplierName] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const suggestionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    setHighlightIndex(0);
  }, [searchTerm]);

  const suggestions = useMemo(() => {
    const trimmed = searchTerm.trim();
    if (trimmed.length < 2) {
      return [] as PurchaseProduct[];
    }
    const needle = trimmed.toLowerCase();
    return products
      .filter((product) =>
        product.nama.toLowerCase().includes(needle) ||
        product.kode.toLowerCase().includes(needle) ||
        (product.barcode ? product.barcode.toLowerCase().includes(needle) : false),
      )
      .slice(0, MAX_SUGGESTIONS);
  }, [products, searchTerm]);

  useEffect(() => {
    if (highlightIndex >= suggestions.length) {
      setHighlightIndex(suggestions.length > 0 ? suggestions.length - 1 : 0);
    }
  }, [highlightIndex, suggestions]);

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

  const totals = useMemo(() => {
    const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.qty * item.harga, 0);
    return { totalQty, totalAmount };
  }, [items]);

  const addProductToDraft = (product: PurchaseProduct) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, qty: item.qty + 1 }
            : item,
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          nama: product.nama,
          kode: product.kode,
          barcode: product.barcode,
          satuan: product.satuan,
          harga: resolveBasePrice(product),
          qty: 1,
          stok: product.stok,
        },
      ];
    });
  };

  const commitProduct = (product: PurchaseProduct) => {
    addProductToDraft(product);
    setSearchTerm("");
    setHighlightIndex(0);
    window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const handleCommit = () => {
    const trimmed = searchTerm.trim();
    const needle = trimmed.toLowerCase();

    const direct = trimmed
      ? products.find(
          (product) =>
            product.kode.toLowerCase() === needle ||
            (product.barcode ? product.barcode.toLowerCase() === needle : false),
        )
      : undefined;

    const candidate = direct ?? suggestions[highlightIndex] ?? suggestions[0];
    if (!candidate) {
      toast.error("Produk tidak ditemukan");
      return;
    }

    commitProduct(candidate);
  };

  const updateItemQty = (productId: string, qty: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, qty: Math.max(1, Math.round(qty)) }
          : item,
      ),
    );
  };

  const updateItemPrice = (productId: string, price: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, harga: Math.max(0, price) }
          : item,
      ),
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleSaveDraft = () => {
    if (items.length === 0) {
      toast.error("Tambahkan produk terlebih dahulu");
      return;
    }

    toast.success("Draft pembelian disimpan (simulasi)");
  };

  const handleFinalize = () => {
    if (items.length === 0) {
      toast.error("Keranjang pembelian masih kosong");
      return;
    }

    if (supplierMode === "registered" && !selectedSupplierId) {
      toast.error("Pilih supplier terlebih dahulu");
      return;
    }

    if (supplierMode === "external" && externalSupplierName.trim().length === 0) {
      toast.error("Masukkan nama supplier");
      return;
    }

    toast.success("Transaksi pembelian siap diproses (simulasi)");
  };

  const activeSupplierName = useMemo(() => {
    if (supplierMode === "external") {
      return externalSupplierName.trim() || "Supplier Bebas";
    }
    const found = suppliers.find((supplier) => supplier.id === selectedSupplierId);
    return found?.nama ?? "Pilih supplier";
  }, [externalSupplierName, selectedSupplierId, supplierMode, suppliers]);

  suggestionRefs.current = Array(suggestions.length).fill(null);

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col gap-3 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <div className="grid flex-1 min-h-0 grid-cols-1 gap-3 xl:grid-cols-[2.3fr_1fr]">
        <Card className="flex min-h-0 flex-col border border-emerald-100 bg-white/95 shadow-md rounded-none">
          <CardBody className="flex min-h-0 flex-1 flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="relative flex-1">
                <Input
                  ref={searchInputRef}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onFocus={() => {
                    if (searchBlurTimer.current !== null) {
                      window.clearTimeout(searchBlurTimer.current);
                    }
                    setSearchFocused(true);
                  }}
                  onBlur={() => {
                    searchBlurTimer.current = window.setTimeout(() => setSearchFocused(false), 120);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleCommit();
                    } else if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setHighlightIndex((prev) => Math.min(prev + 1, Math.max(suggestions.length - 1, 0)));
                    } else if (event.key === "ArrowUp") {
                      event.preventDefault();
                      setHighlightIndex((prev) => Math.max(prev - 1, 0));
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
                            onClick={() => commitProduct(product)}
                            onMouseEnter={() => setHighlightIndex(index)}
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
              <HeroButton
                color="danger"
                className="h-12 px-5"
                variant="flat"
                startContent={<Trash2 className="h-4 w-4" />}
                onPress={() => setItems([])}
                isDisabled={items.length === 0}
              >
                Kosongkan
              </HeroButton>
            </div>

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
                        <li key={item.productId} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-2 px-4 py-3 text-sm">
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
                              onChange={(event) => updateItemPrice(item.productId, Number(event.target.value) || 0)}
                              className="h-10 w-full rounded-lg border border-transparent bg-white px-3 text-sm font-semibold text-slate-700 shadow-inner focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                              min={0}
                              step={100}
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              value={item.qty}
                              onChange={(event) => updateItemQty(item.productId, Number(event.target.value) || 1)}
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
                              onPress={() => removeItem(item.productId)}
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
          </CardBody>
        </Card>

        <Card className="flex min-h-0 flex-col border border-sky-100 bg-white/95 shadow-md rounded-none">
          <CardHeader className="border-b border-sky-100 pb-3">
            <p className="text-sm font-semibold text-slate-800">Supplier</p>
          </CardHeader>
          <CardBody className="flex flex-1 flex-col gap-4">
            <Tabs
              aria-label="Supplier mode"
              selectedKey={supplierMode}
              onSelectionChange={(key) => setSupplierMode(key as SupplierMode)}
              variant="solid"
              color="primary"
            >
              <Tab key="registered" title="Terdaftar">
                <div className="space-y-2">
                  <select
                    value={selectedSupplierId ?? ""}
                    onChange={(event) => setSelectedSupplierId(event.target.value || null)}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-inner focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    disabled={loadingSuppliers}
                  >
                    <option value="">Pilih supplier</option>
                    {(suppliers as Supplier[]).map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.nama} ({supplier.kode})
                      </option>
                    ))}
                  </select>
                </div>
              </Tab>
              <Tab key="external" title="Bebas">
                <div className="space-y-2">
                  <input
                    value={externalSupplierName}
                    onChange={(event) => setExternalSupplierName(event.target.value)}
                    placeholder="Nama supplier"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-inner focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>
              </Tab>
            </Tabs>

            <div className="border border-dashed border-sky-200 bg-sky-50/70 p-4 rounded-none">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-200/80">
                  <Truck className="h-5 w-5 text-sky-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{activeSupplierName}</p>
                  <p className="text-xs text-slate-500">Pemasok saat ini</p>
                </div>
              </div>
            </div>

            <div className="border border-emerald-200 bg-emerald-50/90 p-4 text-slate-700 rounded-none">
              <div className="flex items-center justify-between text-sm">
                <span>Total qty</span>
                <span className="font-semibold">{totals.totalQty}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-base font-semibold text-emerald-600">
                <span>Grand total</span>
                <span>{formatCurrency(totals.totalAmount)}</span>
              </div>
            </div>
          </CardBody>
          <CardFooter className="flex flex-col gap-2 border-t border-sky-100 pt-4">
            <HeroButton
              color="secondary"
              variant="flat"
              fullWidth
              onPress={handleSaveDraft}
            >
              Simpan Draft
            </HeroButton>
            <HeroButton
              color="primary"
              className="bg-emerald-500 text-white hover:bg-emerald-600"
              fullWidth
              onPress={handleFinalize}
              endContent={<MoveRight className="h-4 w-4" />}
            >
              Konfirmasi Pembelian
            </HeroButton>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
