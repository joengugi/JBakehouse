"use client";

import {useState} from "react";

interface CartItem {
  id: string;
  name: string;  // Add this property
  emoji: string; // Add this property
  qty: number;
  price: number;
}

export default function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const addItem    = (item: CartItem) => setCart(p => {
    const exists = p.find(i => i.id === item.id);
    return exists
      ? p.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      : [...p, { ...item, qty: 1 }];
  });
  const removeItem = (id: string | number) => setCart(p => p.filter(i => i.id !== id));
  const updateQty  = (id: string | number, delta: number) => setCart(p =>
    p.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
  );
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  return { cart, addItem, removeItem, updateQty, total, count };
}