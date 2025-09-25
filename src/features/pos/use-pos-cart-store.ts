import { create } from "zustand";
import type { CartItem, PosProduct } from "./types";

export type CartState = {
  items: CartItem[];
  addItem: (product: PosProduct) => void;
  increase: (productId: string) => void;
  decrease: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
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
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return {
        items: [...state.items, { product, quantity: 1, discount: 0 }],
      };
    });
  },
  increase: (productId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    }));
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
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      set((state) => ({
        items: state.items.filter((item) => item.product.id !== productId),
      }));
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item,
      ),
    }));
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
