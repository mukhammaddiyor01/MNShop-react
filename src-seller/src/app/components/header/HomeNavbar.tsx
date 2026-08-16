import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type User = {
  fullName: string;
};

function readUser(): User | null {
  const value = window.localStorage.getItem("mnshop-user");
  if (!value) return null;

  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
}

function readCart(): unknown[] {
  const value = window.localStorage.getItem("mnshop-cart");
  if (!value) return [];

  try {
    const cart = JSON.parse(value);
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function MnshopLogo({ size }: { size: "sm" }) {
  return <span aria-label="MNShop logo">{size === "sm" ? "MN" : "MNShop"}</span>;
}

function ProfileDropdown({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="absolute right-0 top-12 rounded-lg bg-night p-3 shadow-lg">
      <Link to="/profile" onClick={onClose}>
        My Page
      </Link>
    </div>
  );
}

const publicNavigation = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Help", href: "/help" },
  { label: "About", href: "/about" },
];

export function HomeNavbar() {
  const { pathname } = useLocation();
  const [user] = useState<User | null>(readUser);
  const [cart] = useState<unknown[]>(readCart);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigation = useMemo(() => {
    if (!user) return publicNavigation;

    return [
      publicNavigation[0],
      publicNavigation[1],
      { label: "Orders", href: "/orders" },
      ...publicNavigation.slice(2),
    ];
  }, [user]);

  const initials = user?.fullName
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const openCart = () => {
    if (!user) {
      const next = `${window.location.pathname}${window.location.search}`;
      window.location.href = `/login?next=${encodeURIComponent(next)}`;
      return;
    }

    window.dispatchEvent(new CustomEvent("mnshop:cart-open"));
  };

  return (
    <header className="sticky top-0 z-[1000] border-b border-white/10 bg-night/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-8 lg:px-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <MnshopLogo size="sm" />

          <span className="hidden font-display text-lg font-black text-white sm:block">
            MNShop
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={[
                "relative py-5 text-xs font-bold uppercase tracking-[0.12em]",
                "transition-colors after:absolute after:inset-x-0",
                "after:bottom-3 after:h-px after:bg-blue",
                "after:transition-transform",
                isActive(item.href)
                  ? "text-blue after:scale-x-100"
                  : "text-white/70 after:scale-x-0 hover:text-white hover:after:scale-x-100",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            className="relative rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-blue"
          >
            <ShoppingBagIcon sx={{ fontSize: 21 }} />

            {cart.length > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-blue px-1.5 text-[10px] font-black text-white">
                {cart.length}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                aria-label="My Page"
                aria-expanded={profileOpen}
                className="grid h-10 w-10 place-items-center rounded-full bg-blue text-sm font-black text-white"
              >
                {initials}
              </button>

              <ProfileDropdown
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
              />
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue/80 md:flex"
            >
              <PersonIcon sx={{ fontSize: 17 }} />
              Login
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="rounded-full p-2 text-white lg:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm lg:hidden"
          />

          <aside className="fixed inset-y-0 right-0 z-[1200] w-full max-w-sm border-l border-white/10 bg-night p-5 lg:hidden">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <MnshopLogo size="sm" />

                <span className="font-display text-xl font-black">MNShop</span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-full p-2 hover:bg-white/10"
              >
                <CloseIcon />
              </button>
            </div>

            <nav className="mt-8 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    "block rounded-lg px-4 py-3 text-lg font-bold transition",
                    isActive(item.href)
                      ? "bg-blue/15 text-blue"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              ))}

              {user && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setProfileOpen(true);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-lg font-bold text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <PersonIcon sx={{ fontSize: 20 }} className="text-blue" />
                  My Page
                </button>
              )}
            </nav>

            {!user && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-blue px-5 py-3 font-black text-white"
              >
                <PersonIcon sx={{ fontSize: 18 }} />
                Login
              </Link>
            )}
          </aside>
        </>
      )}
    </header>
  );
}
