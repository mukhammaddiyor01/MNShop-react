import React, { createContext, useEffect, useMemo, useState } from "react";
import { User } from "../../lib/types/user";

export type Product = { id: string; name: string; category: string; description: string; price: number; comparePrice?: number; image: string; hoverImage: string; colors: string[]; sizes: string[]; stock: number; sold: number; sale?: boolean; views: number; likes: number; rating: number };
export type CartItem = { product: Product; color: string; size: string; quantity: number };

type Globals = {
  authUser: User | null;
  setAuthUser: React.Dispatch<React.SetStateAction<User | null>>;
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

const legacyUserStorageKey = ["mem", "berData"].join("");

function readAuthUser(): User | null {
  return read<User | null>(
    "userData",
    read<User | null>(legacyUserStorageKey, null),
  );
}

function likesStorageKey(user: User | null) {
  return user ? `mnshopLikes:${user.id}` : "mnshopLikes:guest";
}

function readLikedIds(user: User | null) {
  const key = likesStorageKey(user);
  const scopedValue = localStorage.getItem(key);

  if (scopedValue) return read<string[]>(key, []);

  // Preserve likes saved before buyer-scoped persistence was introduced.
  return read<string[]>("mnshopLikes", []);
}

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(readAuthUser);
  const [basket, setBasket] = useState<CartItem[]>(() => read("cartData", []));
  const [likedIds, setLikedIds] = useState<string[]>(() => readLikedIds(readAuthUser()));
  const [likesOwnerId, setLikesOwnerId] = useState<string | null>(
    readAuthUser()?.id || null,
  );
  const [orderBuilder, setOrderBuilder] = useState(new Date());
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (authUser) localStorage.setItem("userData", JSON.stringify(authUser));
    else localStorage.removeItem("userData");
    localStorage.removeItem(legacyUserStorageKey);
  }, [authUser]);
  useEffect(() => {
    if (basket.length) localStorage.setItem("cartData", JSON.stringify(basket));
    else localStorage.removeItem("cartData");
  }, [basket]);
  useEffect(() => {
    const nextOwnerId = authUser?.id || null;
    setLikedIds(readLikedIds(authUser));
    setLikesOwnerId(nextOwnerId);
  }, [authUser]);
  useEffect(() => {
    if (likesOwnerId !== (authUser?.id || null)) return;
    localStorage.setItem(likesStorageKey(authUser), JSON.stringify(likedIds));
  }, [authUser, likedIds, likesOwnerId]);

  const value = useMemo<Globals>(() => ({
    authUser, setAuthUser, basket, orderBuilder, setOrderBuilder, cartOpen, setCartOpen, likedIds,
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
  }), [authUser, basket, cartOpen, likedIds, orderBuilder]);

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}
