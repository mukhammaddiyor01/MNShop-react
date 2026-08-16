import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const publicNavigation = [
  { label: "Home", href: "/", exact: true },
  { label: "Products", href: "/products" },
  { label: "Help", href: "/help" },
  { label: "About", href: "/about" },
];

function MnshopLogo() {
  return (
    <span className="mnshop-other-navbar__logo" aria-label="MNShop logo">
      <img src="/icons/Tashqi aylana.png" alt="" aria-hidden="true" />
      <img src="/icons/Markaziy logo.png" alt="" aria-hidden="true" />
    </span>
  );
}

export function OtherNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="mnshop-other-navbar">
      <div className="mnshop-other-navbar__inner">
        <Link to="/" className="mnshop-other-navbar__brand">
          <MnshopLogo />
          <span className="mnshop-other-navbar__brand-name">MNShop</span>
        </Link>

        <nav
          className="mnshop-other-navbar__desktop-nav"
          aria-label="Buyer navigation"
        >
          {publicNavigation.map((item) => (
            <NavLink
              key={item.href}
              exact={item.exact}
              to={item.href}
              className="mnshop-other-navbar__link"
              activeClassName="mnshop-other-navbar__link--active"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mnshop-other-navbar__actions">
          <Link to="/login" className="mnshop-other-navbar__login">
            <PersonIcon sx={{ fontSize: 17 }} />
            Login
          </Link>

          <button
            type="button"
            className="mnshop-other-navbar__menu-toggle"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mnshop-other-mobile-menu"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="mnshop-other-navbar__overlay"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />

          <aside
            id="mnshop-other-mobile-menu"
            className="mnshop-other-navbar__drawer"
            aria-label="Mobile navigation"
          >
            <div className="mnshop-other-navbar__drawer-header">
              <Link
                to="/"
                className="mnshop-other-navbar__drawer-brand"
                onClick={() => setMobileOpen(false)}
              >
                <MnshopLogo />
                <span>MNShop</span>
              </Link>

              <button
                type="button"
                className="mnshop-other-navbar__drawer-close"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <nav
              className="mnshop-other-navbar__mobile-nav"
              aria-label="Mobile buyer navigation"
            >
              {publicNavigation.map((item) => (
                <NavLink
                  key={item.href}
                  exact={item.exact}
                  to={item.href}
                  className="mnshop-other-navbar__mobile-link"
                  activeClassName="mnshop-other-navbar__mobile-link--active"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <Link
              to="/login"
              className="mnshop-other-navbar__mobile-login"
              onClick={() => setMobileOpen(false)}
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
