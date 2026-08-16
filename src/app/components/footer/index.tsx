import { Link } from "react-router-dom";

const footerNavigation = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Help", href: "/help" },
  { label: "About", href: "/about" },
];

function FooterLogo() {
  return (
    <span className="mnshop-footer__logo" aria-label="MNShop logo">
      <img src="/icons/Tashqi aylana.png" alt="" aria-hidden="true" />
      <img src="/icons/Markaziy logo.png" alt="" aria-hidden="true" />
    </span>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mnshop-footer">
      <div className="mnshop-footer__inner">
        <section className="mnshop-footer__brand" aria-label="About MNShop">
          <Link to="/" className="mnshop-footer__brand-link">
            <FooterLogo />
            <span className="mnshop-footer__brand-name">MNShop</span>
          </Link>

          <p className="mnshop-footer__description">
            Premium Korean-inspired streetwear curated for Uzbekistan.
          </p>
        </section>

        <nav className="mnshop-footer__navigation" aria-label="Footer navigation">
          <h2 className="mnshop-footer__title">Explore</h2>
          <div className="mnshop-footer__links">
            {footerNavigation.map((item) => (
              <Link key={item.href} to={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="mnshop-footer__bottom">
        <p>© {currentYear} MNShop. All rights reserved.</p>
      </div>
    </footer>
  );
}
