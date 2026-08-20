import axios from "axios";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { User } from "../../lib/types/user";
import BuyerAuthService from "../services/BuyerAuthService";

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
const authSessionExpiryKey = "mnshopAuthExpiresAt";
const authSessionDurationMs = 3 * 60 * 60 * 1000;
const buyerAuthService = new BuyerAuthService();

function read<T>(key: string, fallback: T): T {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}

const legacyUserStorageKey = ["mem", "berData"].join("");

function readAuthUser(): User | null {
  const user = read<User | null>(
    "userData",
    read<User | null>(legacyUserStorageKey, null),
  );

  if (!user) return null;

  const expiresAt = Number(localStorage.getItem(authSessionExpiryKey));

  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    localStorage.removeItem("userData");
    localStorage.removeItem(legacyUserStorageKey);
    localStorage.removeItem(authSessionExpiryKey);
    return null;
  }

  return user;
}

function likesStorageKey(user: User | null) {
  return user ? `mnshopLikes:${user.id}` : null;
}

function cartStorageKey(user: User | null) {
  return user ? `mnshopCart:${user.id}` : null;
}

function readBasket(user: User | null) {
  const key = cartStorageKey(user);

  if (!key) return [];

  const scopedValue = localStorage.getItem(key);
  if (scopedValue) return read<CartItem[]>(key, []);

  // Migrate the active Burak-compatible cartData snapshot once.
  return read<CartItem[]>("cartData", []);
}

function readLikedIds(user: User | null) {
  const key = likesStorageKey(user);

  if (!key) return [];

  const scopedValue = localStorage.getItem(key);

  if (scopedValue) return read<string[]>(key, []);

  // Preserve likes saved before buyer-scoped persistence was introduced.
  const legacyLikes = read<string[]>("mnshopLikes", []);

  if (legacyLikes.length) {
    localStorage.setItem(key, JSON.stringify(legacyLikes));
    localStorage.removeItem("mnshopLikes");
  }

  return legacyLikes;
}

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const initialAuthUser = useMemo(() => readAuthUser(), []);
  const [authUser, setAuthUser] = useState<User | null>(initialAuthUser);
  const [authReady, setAuthReady] = useState(false);
  const [basket, setBasket] = useState<CartItem[]>(() =>
    readBasket(initialAuthUser),
  );
  const [cartOwnerId, setCartOwnerId] = useState<string | null>(
    initialAuthUser?.id || null,
  );
  const [likedIds, setLikedIds] = useState<string[]>(() =>
    readLikedIds(initialAuthUser),
  );
  const [likesOwnerId, setLikesOwnerId] = useState<string | null>(
    initialAuthUser?.id || null,
  );
  const [orderBuilder, setOrderBuilder] = useState(new Date());
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const fallbackTimer = window.setTimeout(() => {
      if (active) setAuthReady(true);
    }, 3000);

    buyerAuthService
      .getCurrentBuyer()
      .then((buyer) => {
        if (active) setAuthUser(buyer);
      })
      .catch((error: unknown) => {
        if (!active || !axios.isAxiosError(error)) return;

        if (error.response?.status === 401 || error.response?.status === 403) {
          setAuthUser(null);
        }
      })
      .finally(() => {
        if (!active) return;
        window.clearTimeout(fallbackTimer);
        setAuthReady(true);
      });

    return () => {
      active = false;
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    if (!authUser) {
      localStorage.removeItem("userData");
      localStorage.removeItem(authSessionExpiryKey);
      localStorage.removeItem(legacyUserStorageKey);
      return;
    }

    localStorage.setItem("userData", JSON.stringify(authUser));
    localStorage.removeItem(legacyUserStorageKey);

    const storedExpiry = Number(localStorage.getItem(authSessionExpiryKey));
    const expiresAt =
      Number.isFinite(storedExpiry) && storedExpiry > Date.now()
        ? storedExpiry
        : Date.now() + authSessionDurationMs;

    localStorage.setItem(authSessionExpiryKey, String(expiresAt));

    const expireSession = () => {
      localStorage.removeItem("userData");
      localStorage.removeItem(legacyUserStorageKey);
      localStorage.removeItem(authSessionExpiryKey);
      setCartOpen(false);
      setAuthUser(null);

      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup"
      ) {
        window.location.replace(
          `/login?next=${encodeURIComponent(currentPath)}`,
        );
      }
    };

    const checkSession = () => {
      const currentExpiry = Number(
        localStorage.getItem(authSessionExpiryKey),
      );

      if (!Number.isFinite(currentExpiry) || currentExpiry <= Date.now()) {
        expireSession();
      }
    };

    const timeoutId = window.setTimeout(
      expireSession,
      Math.max(0, expiresAt - Date.now()),
    );

    window.addEventListener("focus", checkSession);
    document.addEventListener("visibilitychange", checkSession);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("focus", checkSession);
      document.removeEventListener("visibilitychange", checkSession);
    };
  }, [authUser]);
  useEffect(() => {
    if (!authReady) return;

    if (!authUser) {
      setBasket([]);
      setCartOwnerId(null);
      setLikedIds([]);
      setLikesOwnerId(null);
      setCartOpen(false);
      localStorage.removeItem("cartData");
      return;
    }

    const nextOwnerId = authUser?.id || null;
    setBasket(readBasket(authUser));
    setCartOwnerId(nextOwnerId);
    setLikedIds(readLikedIds(authUser));
    setLikesOwnerId(nextOwnerId);
  }, [authReady, authUser]);
  useEffect(() => {
    const key = cartStorageKey(authUser);

    if (!key || cartOwnerId !== authUser?.id) return;

    if (basket.length) {
      const serializedBasket = JSON.stringify(basket);
      localStorage.setItem(key, serializedBasket);
      localStorage.setItem("cartData", serializedBasket);
    } else {
      localStorage.removeItem(key);
      localStorage.removeItem("cartData");
    }
  }, [authUser, basket, cartOwnerId]);
  useEffect(() => {
    const key = likesStorageKey(authUser);

    if (!key || likesOwnerId !== authUser?.id) return;

    localStorage.setItem(key, JSON.stringify(likedIds));
  }, [authUser, likedIds, likesOwnerId]);

  const value = useMemo<Globals>(() => ({
    authUser, setAuthUser, basket, orderBuilder, setOrderBuilder, cartOpen, setCartOpen, likedIds,
    onAdd(product, color = product.colors[0] || "Default", size = product.sizes[0] || "One Size") {
      if (!authUser) return;
      setBasket((items) => {
        const key = `${product.id}:${color}:${size}`;
        const found = items.find((item) => keyOf(item) === key);
        return found ? items.map((item) => keyOf(item) === key ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item) : [...items, { product, color, size, quantity: 1 }];
      });
    },
    onRemove(key) { if (authUser) setBasket((items) => items.flatMap((item) => keyOf(item) !== key ? [item] : item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [])); },
    onDelete(key) { if (authUser) setBasket((items) => items.filter((item) => keyOf(item) !== key)); },
    onDeleteAll() { if (authUser) setBasket([]); },
    toggleLike(id) { if (authUser) setLikedIds((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]); },
  }), [authUser, basket, cartOpen, likedIds, orderBuilder]);

  return (
    <GlobalContext.Provider value={value}>
      {authReady ? children : null}
    </GlobalContext.Provider>
  );
}
