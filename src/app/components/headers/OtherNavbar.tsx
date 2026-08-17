import CheckroomIcon from "@mui/icons-material/Checkroom";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
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

const productNavigation = [
  { label: "Hoodies", value: "hoodies" },
  { label: "T-Shirts", value: "tshirts" },
  { label: "Caps", value: "caps" },
  { label: "Cups", value: "cups" },
];

export function OtherNavbar() {
  const { pathname, search } = useLocation();
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

  const activeCategory =
    new URLSearchParams(search).get("category") || "hoodies";
  const showProductNavigation = pathname === "/products";

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
    <header className="mnshop-other-header">
      <div className="mnshop-other-header__inner">
        <Link to="/" className="mnshop-other-header__brand">
          <span className="mnshop-other-header__brand-tile" aria-hidden="true">
            <CheckroomIcon />
          </span>
          <MnshopLogo size="sm" />
          <span className="mnshop-other-header__brand-name">
            mnshop_blueprint
          </span>
        </Link>

        <nav
          className="mnshop-other-header__desktop-nav"
          aria-label="Buyer navigation"
        >
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`mnshop-other-header__nav-link${
                isActive(item.href)
                  ? " mnshop-other-header__nav-link--active"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mnshop-other-header__search">
          <div className="mnshop-other-header__search-field">
            <SearchIcon aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search mnshop_blueprint"
              aria-label="Search mnshop_blueprint"
            />

            {suggestions.length > 0 && (
              <div className="mnshop-other-header__suggestions">
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

        <div className="mnshop-other-header__actions">
          {authUser && (
            <button
              type="button"
              className="mnshop-other-header__notification"
              aria-label="Notifications"
            >
              <NotificationsNoneIcon />
              <span aria-hidden="true" />
            </button>
          )}

          <Link
            to={authUser ? "/likes" : "/login?next=%2Flikes"}
            className="mnshop-other-header__icon-action"
            aria-label="Liked items"
          >
            <FavoriteBorderIcon />
            {likedIds.length > 0 && (
              <span className="mnshop-other-header__action-count">
                {likedIds.length}
              </span>
            )}
          </Link>

          {authUser ? (
            <button
              type="button"
              className="mnshop-other-header__icon-action"
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBagOutlinedIcon />
              {basket.length > 0 && (
                <span className="mnshop-other-header__action-count">
                  {basket.length}
                </span>
              )}
            </button>
          ) : (
            <Link
              to="/login?next=%2Fcart"
              className="mnshop-other-header__icon-action"
              aria-label="Cart"
            >
              <ShoppingBagOutlinedIcon />
              {basket.length > 0 && (
                <span className="mnshop-other-header__action-count">
                  {basket.length}
                </span>
              )}
            </Link>
          )}

          {authUser ? (
            <Link
              to="/user-page"
              className="mnshop-other-header__profile"
              aria-label="My Page"
            >
              {initials}
            </Link>
          ) : (
            <Link to="/login" className="mnshop-other-header__login">
              <PersonOutlineIcon />
              Sign In
            </Link>
          )}

          <button
            type="button"
            className="mnshop-other-header__menu-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mnshop-other-mobile-menu"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {showProductNavigation && (
        <div className="mnshop-other-header__product-bar">
          <nav aria-label="Product categories">
            {productNavigation.map((item) => (
              <Link
                key={item.value}
                to={`/products?category=${item.value}`}
                className={`mnshop-other-header__category-link${
                  activeCategory === item.value
                    ? " mnshop-other-header__category-link--active"
                    : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/products?category=sale"
              className={`mnshop-other-header__category-link mnshop-other-header__category-link--sale${
                activeCategory === "sale"
                  ? " mnshop-other-header__category-link--active-sale"
                  : ""
              }`}
            >
              <LocalFireDepartmentIcon />
              Sale
              <span>HOT</span>
            </Link>
          </nav>
        </div>
      )}

      {mobileOpen && (
        <aside
          id="mnshop-other-mobile-menu"
          className="mnshop-other-header__drawer"
          aria-label="Mobile buyer navigation"
        >
          <div className="mnshop-other-header__drawer-heading">
            <Link
              to="/"
              className="mnshop-other-header__drawer-brand"
              onClick={() => setMobileOpen(false)}
            >
              <MnshopLogo size="sm" />
              <span>mnshop_blueprint</span>
            </Link>
            <button
              type="button"
              className="mnshop-other-header__drawer-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="mnshop-other-header__mobile-nav">
            {mainNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`mnshop-other-header__mobile-link${
                    isActive(item.href)
                      ? " mnshop-other-header__mobile-link--active"
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
                className="mnshop-other-header__mobile-link"
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
              className="mnshop-other-header__mobile-auth"
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
