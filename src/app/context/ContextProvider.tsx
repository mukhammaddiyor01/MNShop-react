import React, { createContext, useEffect, useMemo, useState } from "react";

export type Role = "BUYER" | "SELLER";
export type Member = { id: string; fullName: string; email: string; role: Role; avatar?: string };
export type Product = { id: string; name: string; category: string; price: number; comparePrice?: number; image: string; hoverImage: string; colors: string[]; sizes: string[]; stock: number; sale?: boolean; views: number; likes: number };
export type CartItem = { product: Product; color: string; size: string; quantity: number };

type Globals = {
  authMember: Member | null;
  setAuthMember: React.Dispatch<React.SetStateAction<Member | null>>;
  basket: CartItem[];
  onAdd: (product: Product, color?: string, size?: string) => void;
  onRemove: (key: string) => void;
  onDelete: (key: string) => void;
  onDeleteAll: () => void;
  orderBuilder: Date;
  setOrderBuilder: React.Dispatch<React.SetStateAction<Date>>;
  cartOpen: boolean;
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  likedIds: string[];
  toggleLike: (id: string) => void;
};

export const GlobalContext = createContext<Globals | null>(null);
const keyOf = (item: CartItem) => `${item.product.id}:${item.color}:${item.size}`;

function read<T>(key: string, fallback: T): T {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [authMember, setAuthMember] = useState<Member | null>(() => read("memberData", null));
  const [basket, setBasket] = useState<CartItem[]>(() => read("cartData", []));
  const [likedIds, setLikedIds] = useState<string[]>(() => read("mnshopLikes", []));
  const [orderBuilder, setOrderBuilder] = useState(new Date());
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => { authMember ? localStorage.setItem("memberData", JSON.stringify(authMember)) : localStorage.removeItem("memberData"); }, [authMember]);
  useEffect(() => localStorage.setItem("cartData", JSON.stringify(basket)), [basket]);
  useEffect(() => localStorage.setItem("mnshopLikes", JSON.stringify(likedIds)), [likedIds]);

  const value = useMemo<Globals>(() => ({
    authMember, setAuthMember, basket, orderBuilder, setOrderBuilder, cartOpen, setCartOpen, likedIds,
    onAdd(product, color = product.colors[0] || "Default", size = product.sizes[0] || "One Size") {
      setBasket((items) => {
        const key = `${product.id}:${color}:${size}`;
        const found = items.find((item) => keyOf(item) === key);
        return found ? items.map((item) => keyOf(item) === key ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item) : [...items, { product, color, size, quantity: 1 }];
      });
    },
    onRemove(key) { setBasket((items) => items.flatMap((item) => keyOf(item) !== key ? [item] : item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [])); },
    onDelete(key) { setBasket((items) => items.filter((item) => keyOf(item) !== key)); },
    onDeleteAll() { setBasket([]); },
    toggleLike(id) { setLikedIds((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]); },
  }), [authMember, basket, cartOpen, likedIds, orderBuilder]);

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}
