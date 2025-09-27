import { create } from "zustand";
import { toast } from "sonner";
import type { CartItem, PosProduct } from "./types";

export type CartState = {
  items: CartItem[];
  addItem: (product: PosProduct) => void;
  increase: (productId: string, currentStock?: number) => void;
  decrease: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number, currentStock?: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  totalQuantity: () => number;
  totalAmount: () => number;
};

export const usePosCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) => {
    set((state) => {
      const existing = state.items.find((item) => item.product.id === product.id);
      if (existing) {
        const newQuantity = existing.quantity + 1;
        if (newQuantity > product.stok) {
          toast.error(`Tidak dapat menambah. Stok "${product.nama}" hanya ${product.stok} tersisa`);
          return state;
        }
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item,
          ),
        };
      }
      return {
        items: [...state.items, { product, quantity: 1, discount: 0 }],
      };
    });
  },
  increase: (productId, currentStock) => {
    set((state) => {
      const item = state.items.find((item) => item.product.id === productId);
      if (!item) return state;

      const stock = currentStock ?? item.product.stok;
      const newQuantity = item.quantity + 1;

      if (newQuantity > stock) {
        toast.error(`Tidak dapat menambah. Stok "${item.product.nama}" hanya ${stock} tersisa`);
        return state;
      }

      return {
        items: state.items.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      };
    });
  },
  decrease: (productId) => {
    set((state) => ({
      items: state.items
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item,
        )
        .filter(Boolean) as CartItem[],
    }));
  },
  updateQuantity: (productId, quantity, currentStock) => {
    if (quantity <= 0) {
      set((state) => ({
        items: state.items.filter((item) => item.product.id !== productId),
      }));
      return;
    }

    set((state) => {
      const item = state.items.find((item) => item.product.id === productId);
      if (!item) return state;

      const stock = currentStock ?? item.product.stok;

      if (quantity > stock) {
        toast.error(`Quantity tidak boleh melebihi stok. Stok "${item.product.nama}" hanya ${stock} tersisa`);
        return state;
      }

      return {
        items: state.items.map((item) =>
          item.product.id === productId
            ? { ...item, quantity }
            : item,
        ),
      };
    });
  },
  remove: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },
  clear: () => set({ items: [] }),
  totalQuantity: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
  totalAmount: () =>
    get().items.reduce(
      (sum, item) => sum + item.quantity * item.product.hargaJual - item.discount,
      0,
    ),
}));
