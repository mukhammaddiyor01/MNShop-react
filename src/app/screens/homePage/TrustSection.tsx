import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";

const buyerStats = [
  ["2.4K+", "Active buyers"],
  ["4.8/5", "Average rating"],
  ["1.2K+", "Orders delivered"],
];

const buyerInitials = ["AK", "MS", "SA", "NY", "DI"];

const sellerBenefits = [
  [
    "01",
    "Verified sellers",
    "Can see the status of Seller and the owner of Product.",
  ],
  ["02", "Delivery updates", "Delivery process will be showen."],
  [
    "03",
    "Direct answers",
    "If you have questions about size, material and quantity of product, Contact Seller.",
  ],
];

export function TrustSection() {
  const sellerImage = "/img/MNShop%20brand%20image/mnshopbrand.webp";

  return (
    <>
      <section className="mnshop-community" aria-labelledby="community-title">
        <div className="mnshop-community__inner">
          <div className="mnshop-community__layout">
            <div className="mnshop-community__intro">
              <p className="mnshop-community__eyebrow">07 / Active buyers</p>
              <h2 id="community-title">Worn by our growing community.</h2>
              <p className="mnshop-community__description">
                Buyers across Uzbekistan are discovering independent Korean
                streetwear, tracking every order, and sharing what fits.
              </p>

              <div className="mnshop-community__social-proof">
                <div
                  className="mnshop-community__avatars"
                  aria-label="MNShop buyer community"
                >
                  {buyerInitials.map((initials) => (
                    <span key={initials}>{initials}</span>
                  ))}
                </div>

                <div>
                  <div
                    className="mnshop-community__stars"
                    aria-label="4.8 out of 5 stars"
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <StarIcon key={index} aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mnshop-community__trusted-copy">
                    Trusted by active shoppers
                  </p>
                </div>
              </div>
            </div>

            <div className="mnshop-community__stats">
              {buyerStats.map(([value, label], index) => (
                <div
                  key={label}
                  className={`mnshop-community__stat${
                    index > 0 ? " mnshop-community__stat--divided" : ""
                  }`}
                >
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mnshop-sellers" aria-labelledby="sellers-title">
        <div className="mnshop-sellers__inner">
          <div className="mnshop-sellers__layout">
            <div className="mnshop-sellers__media">
              <img
                src={sellerImage}
                alt="MNShop seller collection"
                loading="lazy"
              />
              <span>Seoul Studio / verified seller</span>
            </div>

            <div className="mnshop-sellers__content">
              <div>
                <p className="mnshop-sellers__eyebrow">08 / Our sellers</p>
                <h2 id="sellers-title">
                  Small Korean studios. Clear buying from Uzbekistan.
                </h2>
                <p className="mnshop-sellers__description">
                  Every seller controls their collection. But MNShop can control
                  product information, order contolling, and conversation
                  between buyer and seller.
                </p>
              </div>

              <div className="mnshop-sellers__benefits">
                {sellerBenefits.map(([number, title, description]) => (
                  <div key={number} className="mnshop-sellers__benefit">
                    <span>{number}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                ))}
              </div>

              <div className="mnshop-sellers__actions">
                <Link to="/about" className="mnshop-sellers__primary-action">
                  Meet our sellers
                  <ArrowOutwardIcon aria-hidden="true" />
                </Link>
                <Link
                  to="/chat?target=seller"
                  className="mnshop-sellers__secondary-action"
                >
                  <ChatBubbleOutlineIcon aria-hidden="true" />
                  Message a seller
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
