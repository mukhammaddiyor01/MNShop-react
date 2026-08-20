import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { Link } from "react-router-dom";
import { MnshopLogo } from "../mnshop-logo";

const quickLinks = [
  { label: "T-shirts", href: "/products?category=tshirts" },
  { label: "Hoodies", href: "/products?category=hoodies" },
  { label: "Caps", href: "/products?category=caps" },
  { label: "Cups", href: "/products?category=cups" },
  { label: "Sale", href: "/products?category=sale" },
];

const helpLinks = [
  { label: "FAQ", href: "/help#quick-answers" },
  { label: "Size Guide", href: "/help/size-guide" },
  { label: "Return Policy", href: "/help/returns" },
  { label: "Contact", href: "/help#contact" },
];

export function Footer() {
  return (
    <footer className="mnshop-footer">
      <div className="mnshop-footer__inner">
        <section className="mnshop-footer__brand" aria-label="About MNShop">
          <Link to="/" className="mnshop-footer__brand-link">
            <MnshopLogo size="xl" />
            <span className="mnshop-footer__brand-name">MNShop</span>
          </Link>
          <p className="mnshop-footer__tagline">
            Our Goal: Customer satisfaction and integrity{" "}
          </p>
          <p className="mnshop-footer__description">
            T-shirts, hoodies, caps, and cups with a design made by you Alone!
          </p>
        </section>

        <div className="mnshop-footer__navigation-grid">
          <nav aria-label="Quick links">
            <h2 className="mnshop-footer__title">Quick Links</h2>
            <div className="mnshop-footer__links">
              {quickLinks.map((item) => (
                <Link key={item.label} to={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Help links">
            <h2 className="mnshop-footer__title">Help</h2>
            <div className="mnshop-footer__links">
              {helpLinks.map((item) => (
                <Link key={item.label} to={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <section className="mnshop-footer__contact" aria-label="Contact MNShop">
          <h2 className="mnshop-footer__title">Contact</h2>
          <p>+82 10 6649 6777</p>
          <p>Seoul, South Korea</p>
          <p>mnshop2001@gmail.com</p>

          <div className="mnshop-footer__socials">
            <a
              href="https://instagram.com/mnshop.uz"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://t.me/mnshopkorea"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
            >
              <SendOutlinedIcon />
            </a>
            <a
              href="https://www.tiktok.com/@mnshopuz?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
            >
              <MusicNoteOutlinedIcon />
            </a>
          </div>
        </section>
      </div>

      <div className="mnshop-footer__bottom">
        <p>© 2024 MNShop. All rights reserved.</p>
        <div>
          <Link to="/help">Privacy Policy</Link>
          <Link to="/help">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
