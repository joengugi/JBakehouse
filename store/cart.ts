
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  qty: number;
}

interface CartStore {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addItem: (item) => set((state) => {
        const exists = state.cart.find((i) => i.id === item.id);
        if (exists) {
          return { cart: state.cart.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) };
        }
        return { cart: [...state.cart, { ...item, qty: 1 }] };
      }),

      removeItem: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),

      updateQty: (id, delta) => set((state) => ({
        cart: state.cart.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i),
      })),

      clearCart: () => set({ cart: [] }),

      total: () => get().cart.reduce((sum, i) => sum + i.price * i.qty, 0),
      count: () => get().cart.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: "jomos-cart" }  // persists to localStorage
  )
);