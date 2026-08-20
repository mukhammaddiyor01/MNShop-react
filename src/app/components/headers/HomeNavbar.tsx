import CheckroomIcon from "@mui/icons-material/Checkroom";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { products } from "../../data/products";
import { useGlobals } from "../../hooks/useGlobals";
import { MnshopLogo } from "../mnshop-logo";

const publicNavigation = [
  { label: "Home", href: "/", icon: HomeOutlinedIcon },
  { label: "Products", href: "/products", icon: Inventory2OutlinedIcon },
  { label: "Help", href: "/help", icon: HelpOutlineIcon },
  { label: "About", href: "/about", icon: InfoOutlinedIcon },
];

export function HomeNavbar() {
  const { pathname } = useLocation();
  const { authUser, basket, likedIds, setCartOpen } = useGlobals();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const mainNavigation = useMemo(
    () =>
      authUser
        ? [
            publicNavigation[0],
            publicNavigation[1],
            {
              label: "Orders",
              href: "/orders",
              icon: ShoppingBagOutlinedIcon,
            },
            ...publicNavigation.slice(2),
          ]
        : publicNavigation,
    [authUser],
  );

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.length < 2) return [];

    return products
      .filter((product) => product.name.toLowerCase().includes(normalizedQuery))
      .slice(0, 5);
  }, [query]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const initials = authUser?.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="mnshop-home-header">
      <div className="mnshop-home-header__inner">
        <Link to="/" className="mnshop-home-header__brand">
          <span className="mnshop-home-header__brand-tile" aria-hidden="true">
            <CheckroomIcon />
          </span>
          <MnshopLogo size="sm" />
          <span className="mnshop-home-header__brand-name">
            mnshop_blueprint
          </span>
        </Link>

        <nav
          className="mnshop-home-header__desktop-nav"
          aria-label="Buyer navigation"
        >
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`mnshop-home-header__nav-link${
                isActive(item.href)
                  ? " mnshop-home-header__nav-link--active"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mnshop-home-header__search">
          <div className="mnshop-home-header__search-field">
            <SearchIcon aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search mnshop_blueprint"
              aria-label="Search mnshop_blueprint"
            />

            {suggestions.length > 0 && (
              <div className="mnshop-home-header__suggestions">
                {suggestions.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    onClick={() => setQuery("")}
                  >
                    {product.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mnshop-home-header__actions">
          {authUser && (
            <>
              <Link
                to="/likes"
                className="mnshop-home-header__icon-action"
                aria-label="Liked items"
              >
                <FavoriteBorderIcon />
                {likedIds.length > 0 && (
                  <span className="mnshop-home-header__action-count">
                    {likedIds.length}
                  </span>
                )}
              </Link>
              <button
                type="button"
                className="mnshop-home-header__icon-action"
                aria-label="Cart"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBagOutlinedIcon />
                {basket.length > 0 && (
                  <span className="mnshop-home-header__action-count">
                    {basket.length}
                  </span>
                )}
              </button>
            </>
          )}
          {authUser ? (
            <Link
              to="/user-page"
              className="mnshop-home-header__profile"
              aria-label="My Page"
            >
              {initials}
            </Link>
          ) : (
            <Link to="/login" className="mnshop-home-header__login">
              <PersonOutlineIcon />
              Sign In
            </Link>
          )}
          <button
            type="button"
            className="mnshop-home-header__menu-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mnshop-home-mobile-menu"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <aside
          id="mnshop-home-mobile-menu"
          className="mnshop-home-header__drawer"
          aria-label="Mobile buyer navigation"
        >
          <div className="mnshop-home-header__drawer-heading">
            <Link
              to="/"
              className="mnshop-home-header__drawer-brand"
              onClick={() => setMobileOpen(false)}
            >
              <MnshopLogo size="sm" />
              <span>mnshop_blueprint</span>
            </Link>
            <button
              type="button"
              className="mnshop-home-header__drawer-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="mnshop-home-header__mobile-nav">
            {mainNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`mnshop-home-header__mobile-link${
                    isActive(item.href)
                      ? " mnshop-home-header__mobile-link--active"
                      : ""
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
            {authUser && (
              <Link
                to="/user-page"
                className="mnshop-home-header__mobile-link"
                onClick={() => setMobileOpen(false)}
              >
                <PersonOutlineIcon aria-hidden="true" />
                My Page
              </Link>
            )}
          </nav>

          {!authUser && (
            <Link
              to="/signup"
              className="mnshop-home-header__mobile-auth"
              onClick={() => setMobileOpen(false)}
            >
              Sign In / Sign Up
            </Link>
          )}
        </aside>
      )}
    </header>
  );
}
