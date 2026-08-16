import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function MnshopLogo({ size }: { size: "sm" }) {
  return (
    <span aria-label="MNShop logo">{size === "sm" ? "MN" : "MNShop"}</span>
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="mnshop-home-navbar sticky top-0 z-[1000] border-b border-white/10 bg-night/90 backdrop-blur-xl">
      <div className="mnshop-home-navbar__inner mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-8 lg:px-12">
        {/* Logo */}
        <Link to="/" className="mnshop-home-navbar__brand flex items-center gap-3">
          <MnshopLogo size="sm" />

          <span className="mnshop-home-navbar__brand-name hidden font-display text-lg font-black text-white sm:block">
            MNShop
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="mnshop-home-navbar__desktop-nav hidden items-center gap-7 lg:flex">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={[
                "mnshop-home-navbar__link",
                "relative py-5 text-xs font-bold uppercase tracking-[0.12em]",
                "transition-colors after:absolute after:inset-x-0",
                "after:bottom-3 after:h-px after:bg-blue",
                "after:transition-transform",
                isActive(item.href)
                  ? "mnshop-home-navbar__link--active text-blue after:scale-x-100"
                  : "text-white/70 after:scale-x-0 hover:text-white hover:after:scale-x-100",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User actions */}
        <div className="mnshop-home-navbar__actions flex items-center gap-2">
          <Link
            to="/login"
            className="mnshop-home-navbar__login hidden items-center gap-2 rounded-full bg-blue px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue/80 md:flex"
          >
            <PersonIcon sx={{ fontSize: 17 }} />
            Login
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="mnshop-home-navbar__menu-toggle rounded-full p-2 text-white lg:hidden"
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
            className="mnshop-home-navbar__overlay fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm lg:hidden"
          />

          <aside className="mnshop-home-navbar__drawer fixed inset-y-0 right-0 z-[1200] w-full max-w-sm border-l border-white/10 bg-night p-5 lg:hidden">
            <div className="mnshop-home-navbar__drawer-header flex items-center justify-between">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="mnshop-home-navbar__drawer-brand flex items-center gap-3"
              >
                <MnshopLogo size="sm" />

                <span className="font-display text-xl font-black">MNShop</span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="mnshop-home-navbar__drawer-close rounded-full p-2 hover:bg-white/10"
              >
                <CloseIcon />
              </button>
            </div>

            <nav className="mnshop-home-navbar__mobile-nav mt-8 space-y-2">
              {publicNavigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    "mnshop-home-navbar__mobile-link",
                    "block rounded-lg px-4 py-3 text-lg font-bold transition",
                    isActive(item.href)
                      ? "mnshop-home-navbar__mobile-link--active bg-blue/15 text-blue"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              ))}

            </nav>

            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="mnshop-home-navbar__mobile-login mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-blue px-5 py-3 font-black text-white"
            >
              <PersonIcon sx={{ fontSize: 18 }} />
              Login
            </Link>
          </aside>
        </>
      )}
    </header>
  );
}
